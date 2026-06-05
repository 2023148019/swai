const defaultSubCharacter = {
  name: '새싹 모험가',
  emoji: '🌱'
};

const subCharacterRules = {
  'activity+challenge': { name: '불꽃 러너', emoji: '🔥' },
  'creativity+focus': { name: '조용한 창작자', emoji: '🎨' },
  'social+expression': { name: '파티 메이커', emoji: '🎤' },
  'focus+indoor': { name: '방구석 전략가', emoji: '🧠' },
  'costSensitive+routine': { name: '실속 성장러', emoji: '🌱' },
  'creativity+expression': { name: '감성 수집가', emoji: '📸' },
  'routine+focus': { name: '루틴 빌더', emoji: '📅' },
  'outdoor+activity': { name: '야외 모험가', emoji: '🏕️' },
  'expression+social': { name: '무대 위 표현가', emoji: '🎭' },
  'focus+creativity': { name: '차분한 탐구자', emoji: '🔍' }
};

export function getSubCharacter(userTraits) {
  if (!userTraits || typeof userTraits !== 'object') return defaultSubCharacter;

  const topTraits = Object.entries(userTraits)
    .filter(([, value]) => Number.isFinite(value))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => key);

  if (topTraits.length < 2) return defaultSubCharacter;

  return subCharacterRules[topTraits.join('+')] || defaultSubCharacter;
}
