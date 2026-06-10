import json
import os
import re
from pathlib import Path
from typing import Any
from urllib import error, parse, request

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
FAILED_RESPONSE = {
    "success": False,
    "message": "AI가 바로 사용할 수 있는 실제 링크를 찾지 못했어요. 다시 시도해 주세요.",
    "source": "failed",
}
CONFIG_ERROR_RESPONSE = {
    "success": False,
    "message": "Gemini API 키가 설정되지 않았어요. .env의 GEMINI_API_KEY를 실제 키로 바꿔주세요.",
    "source": "failed",
}
QUOTA_ERROR_RESPONSE = {
    "success": False,
    "message": "Gemini 무료 사용량 한도에 걸렸어요. 잠시 후 다시 시도하거나 Google AI Studio에서 할당량/결제 설정을 확인해주세요.",
    "source": "quota_exceeded",
}
GEMINI_UNAVAILABLE_RESPONSE = {
    "success": False,
    "message": "Gemini 모델이 잠시 혼잡해요. 조금 뒤 다시 시도해주세요.",
    "source": "model_unavailable",
}

SEARCH_HOSTS = {
    "google.com",
    "www.google.com",
    "search.naver.com",
    "www.bing.com",
    "bing.com",
    "duckduckgo.com",
    "search.daum.net",
}

BLOCKED_SEARCH_PATHS = (
    ({"google.com", "www.google.com"}, "/search"),
    ({"www.youtube.com", "youtube.com", "m.youtube.com"}, "/results"),
    ({"map.naver.com"}, "/p/search"),
    ({"www.bing.com", "bing.com"}, "/search"),
)


def load_env_file() -> None:
    for env_path in (Path.cwd() / ".env", Path(__file__).resolve().parent.parent / ".env"):
        if not env_path.exists():
            continue
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()

app = FastAPI(title="Inner Adventure AI Link Guide")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Local development only.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MissionLinkRequest(BaseModel):
    hobbyName: str = Field(..., min_length=1)
    missionTitle: str = Field(..., min_length=1)
    missionDescription: str = Field(..., min_length=1)
    missionType: str = ""
    userLocation: str = ""
    budget: str = ""
    energy: str = ""


def build_prompt(payload: MissionLinkRequest) -> str:
    return f"""
당신은 Inner Adventure의 AI 미션 도우미입니다.
사용자가 지금 당장 실행할 수 있도록 친절하고 실용적인 가이드를 만들어야 합니다.
단순 링크 후보만 주지 말고, 미션 수행에 필요한 핵심 정보와 다음 행동을 명확히 제안하세요.

입력 정보:
- 취미명: {payload.hobbyName}
- 미션명: {payload.missionTitle}
- 미션 설명: {payload.missionDescription}
- 미션 타입: {payload.missionType or "미정"}
- 사용자 위치: {payload.userLocation or "미정"}
- 예산: {payload.budget or "미정"}
- 에너지/시간: {payload.energy or "미정"}

요구사항:
1. 사용자가 지금 당장 무엇을 해야 하는지 한 문장으로 요약해 주세요.
2. 최소 2개, 최대 4개의 구체적인 실행 단계(steps)를 제시하세요.
3. 초보자도 이해하기 쉬운 팁(tips)을 2개 이상 포함하세요.
4. 가능한 경우 실제로 사용할 수 있는 링크 후보 최대 3개를 함께 제안하세요.
5. 링크는 상상해서 만들지 말고 실제 존재하는 콘텐츠 URL이어야 합니다.
6. 유튜브면 영상 URL, 블로그면 게시글 URL, 클래스면 상세/예약 페이지 URL, 장소면 업체/공간 페이지 URL이어야 합니다.
7. 검색 결과 페이지, 삭제/비공개/종료된 페이지는 포함하지 마세요.
8. 출력은 반드시 아래 JSON 형식만 반환하세요. 다른 설명, 마크다운, 코드 블록은 포함하지 마세요.

반드시 아래 JSON 형식만 반환하세요.
{{
  "answer": "사용자가 가장 먼저 해야 할 핵심 행동을 간결하게 설명하는 문장",
  "steps": [
    "구체적인 첫 번째 행동",
    "두 번째 행동",
    "필요하면 추가 행동"
  ],
  "tips": [
    "실행 시 유의할 점 또는 준비물",
    "초보자에게 도움이 되는 추가 팁"
  ],
  "candidates": [
    {{
      "title": "실제 콘텐츠 제목",
      "url": "https://실제-url",
      "platform": "youtube | blog | class | place | web",
      "type": "video | article | class | place | guide",
      "reason": "추천 이유 한 문장"
    }}
  ]
}}
""".strip()


def extract_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.S)
        if not match:
            raise
        return json.loads(match.group(0))


def is_search_result_url(url: str) -> bool:
    parsed = parse.urlparse(url)
    host = parsed.netloc.lower().removeprefix("www.")
    full_host = parsed.netloc.lower()
    path = parsed.path.lower()

    if full_host in SEARCH_HOSTS and path in {"", "/"}:
        return True

    for hosts, blocked_path in BLOCKED_SEARCH_PATHS:
        if (full_host in hosts or host in hosts) and path.startswith(blocked_path):
            return True

    query = parse.parse_qs(parsed.query)
    if "search_query" in query or (host in {"google.com", "bing.com"} and "q" in query):
        return True
    return False


def normalize_candidates(candidate: Any) -> list[dict[str, Any]]:
    if isinstance(candidate, dict) and isinstance(candidate.get("candidates"), list):
        return [item for item in candidate["candidates"] if isinstance(item, dict)]
    if isinstance(candidate, list):
        return [item for item in candidate if isinstance(item, dict)]
    if isinstance(candidate, dict) and ("url" in candidate or "title" in candidate):
        return [candidate]
    return []


def normalize_text_list(value: Any, min_count: int, max_count: int) -> list[str]:
    if not isinstance(value, list):
        return []
    items = [str(item).strip() for item in value if str(item).strip()]
    return items[:max_count] if len(items) >= min_count else items


def normalize_guide(data: dict[str, Any], candidates: list[dict[str, str]]) -> dict[str, Any]:
    answer = str(data.get("answer", "")).strip()
    steps = normalize_text_list(data.get("steps"), 2, 4)
    tips = normalize_text_list(data.get("tips"), 2, 4)

    if not answer:
        answer = "지금 바로 미션에 필요한 자료를 하나 고르고, 짧게 실행 기록을 남겨보세요."
    if len(steps) < 2:
        steps = [
            "추천 후보 중 하나를 열어 미션에 맞는 준비물이나 방법을 확인하세요.",
            "확인한 내용을 바탕으로 오늘 할 수 있는 가장 작은 행동을 실행하세요.",
        ]
    if len(tips) < 2:
        tips = [
            "처음부터 완벽하게 하려 하지 말고 10분 안에 끝낼 수 있는 범위로 시작하세요.",
            "미션 완료를 위해 참고한 링크나 느낀 점을 바로 기록해두세요.",
        ]

    return {
        "answer": answer,
        "steps": steps[:4],
        "tips": tips[:4],
        "candidates": candidates[:3],
    }


def build_fallback_guide(payload: MissionLinkRequest) -> dict[str, Any]:
    hobby_name = payload.hobbyName.strip()
    mission_title = payload.missionTitle.strip()
    mission_type = payload.missionType.strip() or "미션"
    location_text = payload.userLocation.strip()
    budget_text = payload.budget.strip()
    energy_text = payload.energy.strip()

    context_bits = []
    if location_text:
        context_bits.append(f"지역은 {location_text} 기준으로")
    if budget_text:
        context_bits.append(f"예산은 {budget_text} 범위에서")
    if energy_text:
        context_bits.append(f"시간은 {energy_text} 정도로")
    context = ", ".join(context_bits)
    context_prefix = f"{context} " if context else ""

    return {
        "answer": f"지금은 {context_prefix}{hobby_name}의 '{mission_title}' 미션을 10분 안에 시작할 수 있는 가장 작은 행동으로 쪼개서 실행하세요.",
        "steps": [
            f"{mission_title}에 필요한 준비물이나 장소를 하나만 정하세요.",
            "휴대폰 메모장에 오늘 할 행동, 걸리는 시간, 완료 기준을 한 줄로 적으세요.",
            f"{hobby_name} 관련 영상이나 글을 하나 참고하고, 바로 따라 할 부분 하나를 고르세요.",
            "실행 후 참고 링크나 느낀 점을 미션 기록에 남기세요.",
        ],
        "tips": [
            f"{mission_type} 단계에서는 완성보다 시작이 중요하니 10분 안에 끝낼 수 있게 줄이세요.",
            "링크를 찾지 못해도 검색한 키워드, 알게 된 점, 다음 행동을 메모하면 기록으로 충분합니다.",
            "처음에는 장비를 새로 사기보다 집에 있는 물건이나 무료 자료로 시작하세요.",
        ],
        "candidates": [],
    }


def guide_response(guide: dict[str, Any], source: str = "gemini_grounded") -> dict[str, Any]:
    candidates = guide.get("candidates") if isinstance(guide.get("candidates"), list) else []
    return {
        "success": True,
        "guide": guide,
        "link": candidates[0] if candidates else None,
        "source": source,
    }


def youtube_oembed_exists(url: str) -> bool | None:
    parsed = parse.urlparse(url)
    host = parsed.netloc.lower().removeprefix("www.")
    if host not in {"youtube.com", "youtu.be", "m.youtube.com"}:
        return None

    oembed_url = "https://www.youtube.com/oembed?" + parse.urlencode({"url": url, "format": "json"})
    try:
        req = request.Request(oembed_url, headers={"User-Agent": "Mozilla/5.0 InnerAdventure/1.0"})
        with request.urlopen(req, timeout=8) as response:
            return 200 <= response.status < 400
    except error.HTTPError as exc:
        if exc.code in {400, 404, 410}:
            return False
    except Exception:
        return None
    return None


def url_exists(url: str) -> bool:
    youtube_exists = youtube_oembed_exists(url)
    if youtube_exists is not None:
        return youtube_exists

    headers = {
        "User-Agent": "Mozilla/5.0 InnerAdventure/1.0",
        "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
    }
    for method in ("HEAD", "GET"):
        try:
            req = request.Request(url, headers=headers, method=method)
            with request.urlopen(req, timeout=8) as response:
                return 200 <= response.status < 400
        except error.HTTPError as exc:
            if exc.code in {401, 403, 405}:
                return True
            if exc.code in {400, 404, 410, 451}:
                return False
        except Exception:
            continue
    return False


def validate_link(candidate: dict[str, Any]) -> dict[str, str]:
    title = str(candidate.get("title", "")).strip()
    url = str(candidate.get("url", "")).strip()
    reason = str(candidate.get("reason", "")).strip() or "이 미션을 바로 시작하는 데 도움이 되는 실제 링크예요."
    platform = str(candidate.get("platform", "web")).strip() or "web"
    link_type = str(candidate.get("type", "guide")).strip() or "guide"

    parsed = parse.urlparse(url)
    if not title or not url:
        raise ValueError("missing title or url")
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("invalid url")
    if is_search_result_url(url):
        raise ValueError("search result url is not allowed")
    if not url_exists(url):
        raise ValueError("url is unavailable or deleted")

    return {
        "title": title,
        "url": url,
        "platform": platform,
        "type": link_type,
        "reason": reason,
    }


def request_gemini(payload: MissionLinkRequest) -> dict[str, Any]:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key.startswith("your_"):
        raise RuntimeError("GEMINI_API_KEY is not configured")

    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip()
    fallback_model = os.environ.get("GEMINI_FALLBACK_MODEL", "gemini-2.0-flash").strip()
    models_to_try = [model]
    if fallback_model and fallback_model not in models_to_try:
        models_to_try.append(fallback_model)

    body = {
        "contents": [{"role": "user", "parts": [{"text": build_prompt(payload)}]}],
        "tools": [{"googleSearch": {}}],
        "generationConfig": {
            "temperature": 0.2,
        },
    }

    last_error = None
    for current_model in models_to_try:
        url = GEMINI_ENDPOINT.format(model=parse.quote(current_model, safe="")) + f"?key={parse.quote(api_key)}"
        req = request.Request(
            url,
            data=json.dumps(body).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=60) as response:
                data = json.loads(response.read().decode("utf-8"))
            break
        except error.HTTPError as exc:
            last_error = exc
            if exc.code in {429, 503} and current_model != models_to_try[-1]:
                continue
            raise
    else:
        raise last_error or RuntimeError("Gemini request failed")

    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    text = "".join(part.get("text", "") for part in parts).strip()
    if not text:
        raise RuntimeError("empty Gemini response")
    return extract_json(text)


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/api/ai/generate-link")
def generate_link(payload: MissionLinkRequest) -> dict[str, Any]:
    try:
        guide_data = request_gemini(payload)
        candidates = normalize_candidates(guide_data)

        valid_links = []
        for candidate in candidates:
            try:
                valid_links.append(validate_link(candidate))
            except Exception:
                continue
            if len(valid_links) >= 3:
                break

        guide = normalize_guide(guide_data, valid_links)
        return guide_response(guide, "gemini_grounded" if valid_links else "gemini_text_only")
    except RuntimeError as exc:
        if "GEMINI_API_KEY" in str(exc):
            return CONFIG_ERROR_RESPONSE
        return guide_response(build_fallback_guide(payload), "local_fallback")
    except error.HTTPError as exc:
        if exc.code == 429:
            fallback = guide_response(build_fallback_guide(payload), "local_fallback_quota")
            fallback["message"] = QUOTA_ERROR_RESPONSE["message"]
            return fallback
        if exc.code == 503:
            fallback = guide_response(build_fallback_guide(payload), "local_fallback_model_unavailable")
            fallback["message"] = GEMINI_UNAVAILABLE_RESPONSE["message"]
            return fallback
        return guide_response(build_fallback_guide(payload), "local_fallback_http_error")
    except Exception:
        return guide_response(build_fallback_guide(payload), "local_fallback")
