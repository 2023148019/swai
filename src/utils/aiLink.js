const GEMINI_FUNCTION_URL = '/.netlify/functions/gemini';

function stripCodeFence(text) {
  return String(text || '')
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
}

function parseGuide(resultText) {
  const cleaned = stripCodeFence(resultText);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    return {
      answer: cleaned || 'AI 미션 가이드를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
      steps: [],
      tips: [],
      candidates: []
    };
  }
}

export async function generateMissionLink(payload) {
  try {
    const response = await fetch(GEMINI_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data = {};

    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to read Gemini function response:', error);
    }

    if (!response.ok) {
      throw new Error(data.error || 'AI link request failed');
    }

    const guide = parseGuide(data.result);

    return {
      success: true,
      guide: {
        answer: guide.answer || data.result || '',
        steps: Array.isArray(guide.steps) ? guide.steps : [],
        tips: Array.isArray(guide.tips) ? guide.tips : [],
        candidates: Array.isArray(guide.candidates) ? guide.candidates : []
      },
      link: Array.isArray(guide.candidates) && guide.candidates.length > 0 ? guide.candidates[0] : null,
      source: 'netlify_gemini'
    };
  } catch (error) {
    console.error('Gemini API request failed:', error);
    throw error;
  }
}
