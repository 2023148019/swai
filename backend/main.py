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
당신은 Inner Adventure의 AI 링크 길잡이입니다.
사용자의 현재 취미 미션을 실제로 수행할 수 있도록 바로 사용할 수 있는 실제 링크 후보 3개를 찾아주세요.

입력 정보:
- 취미명: {payload.hobbyName}
- 미션명: {payload.missionTitle}
- 미션 설명: {payload.missionDescription}
- 미션 타입: {payload.missionType or "미정"}
- 사용자 위치: {payload.userLocation or "미정"}
- 예산: {payload.budget or "미정"}
- 에너지/시간: {payload.energy or "미정"}

조건:
- 검색 결과 페이지를 반환하지 마세요.
- 실제 콘텐츠 페이지 URL만 반환하세요.
- 유튜브라면 특정 영상 URL이어야 합니다.
- 블로그라면 특정 게시글 URL이어야 합니다.
- 클래스라면 특정 클래스 예약/상세 페이지 URL이어야 합니다.
- 장소라면 특정 업체/장소 페이지 URL이어야 합니다.
- URL을 상상해서 만들지 마세요.
- 실제로 확인 가능한 URL만 사용하세요.
- 이미 삭제되었거나 비공개/품절/마감/종료된 페이지는 제외하세요.
- 오래된 이벤트, 종료된 모집글, 닫힌 클래스, 삭제된 영상은 제외하세요.
- 가능하면 공식 페이지, 최신 게시글, 현재 예약/수강 가능한 페이지, 공개 상태의 영상을 우선하세요.
- 초보자가 바로 행동할 수 있는 링크를 우선 추천하세요.
- 광고성, 스팸성, 너무 공격적인 페이지는 피하세요.

반드시 아래 JSON 형식만 반환하세요.
{{
  "candidates": [
    {{
      "title": "실제 콘텐츠 제목",
      "url": "https://실제-url",
      "platform": "youtube | blog | class | map | web",
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
    if isinstance(candidate, dict):
        return [candidate]
    return []


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
        candidates = normalize_candidates(request_gemini(payload))
        if not candidates:
            raise ValueError("no link candidates")

        last_error = None
        for candidate in candidates:
            try:
                link = validate_link(candidate)
                break
            except Exception as exc:
                last_error = exc
        else:
            raise last_error or ValueError("no verified link candidates")

        return {"success": True, "link": link, "source": "gemini_grounded"}
    except RuntimeError as exc:
        if "GEMINI_API_KEY" in str(exc):
            return CONFIG_ERROR_RESPONSE
        return FAILED_RESPONSE
    except error.HTTPError as exc:
        if exc.code == 429:
            return QUOTA_ERROR_RESPONSE
        if exc.code == 503:
            return GEMINI_UNAVAILABLE_RESPONSE
        return FAILED_RESPONSE
    except Exception:
        return FAILED_RESPONSE
