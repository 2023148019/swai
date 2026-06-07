const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function generateMissionLink(payload) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/generate-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('AI link request failed');
  }

  return response.json();
}
