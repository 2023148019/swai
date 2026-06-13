const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function buildPrompt(payload) {
  if (payload.prompt) {
    return String(payload.prompt);
  }

  return `
당신은 Inner Adventure의 AI 미션 도우미입니다.
사용자가 지금 당장 실행할 수 있도록 친절하고 실용적인 가이드를 만들어야 합니다.
단순 링크 후보만 주지 말고, 미션 수행에 필요한 핵심 정보와 다음 행동을 명확히 제안하세요.

입력 정보:
- 취미명: ${payload.hobbyName || '미정'}
- 미션명: ${payload.missionTitle || '미정'}
- 미션 설명: ${payload.missionDescription || '미정'}
- 미션 타입: ${payload.missionType || '미정'}
- 사용자 위치: ${payload.userLocation || '미정'}
- 예산: ${payload.budget || '미정'}
- 에너지/시간: ${payload.energy || '미정'}

요구사항:
1. 사용자가 지금 당장 무엇을 해야 하는지 한 문장으로 요약해 주세요.
2. 최소 2개, 최대 4개의 구체적인 실행 단계(steps)를 제시하세요.
3. 초보자도 이해하기 쉬운 팁(tips)을 2개 이상 포함하세요.
4. 가능한 경우 실제로 사용할 수 있는 링크 후보 최대 3개를 함께 제안하세요.
5. 링크는 상상해서 만들지 말고 실제 존재하는 콘텐츠 URL이어야 합니다.
6. 유튜브면 영상 URL, 블로그면 게시글 URL, 클래스면 상세/예약 페이지 URL, 장소면 업체/공간 페이지 URL이어야 합니다.
7. 검색 결과 페이지, 삭제/비공개/종료된 페이지는 포함하지 마세요.
8. 출력은 반드시 아래 JSON 형식만 반환하세요. 다른 설명, 마크다운, 코드 블록은 포함하지 마세요.

{
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
    {
      "title": "실제 콘텐츠 제목",
      "url": "https://실제-url",
      "platform": "youtube | blog | class | place | web",
      "type": "video | article | class | place | guide",
      "reason": "추천 이유 한 문장"
    }
  ]
}
`.trim();
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return jsonResponse(500, { error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const prompt = buildPrompt(payload);

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: data.error?.message || 'Gemini API request failed',
      });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return jsonResponse(200, { result });
  } catch (error) {
    console.error('Gemini function error:', error);
    return jsonResponse(500, { error: 'Gemini function failed' });
  }
}
