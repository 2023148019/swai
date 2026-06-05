import { categories, getHobbiesByCategory, hobbies } from '../data/hobbies.js';
import { defaultTraits, traitLabels } from '../data/questions.js';
import { addTraits, clamp } from './progress.js';

const traitTagRules = {
  activity: ['활동적', '운동', '스포츠'],
  creativity: ['창작', '결과물', '표현'],
  social: ['함께', '팀', '커뮤니티'],
  challenge: ['도전', '경쟁', '난이도'],
  focus: ['몰입', '혼자', '정적', '집중'],
  routine: ['성장감', '꾸준함', '연습', '루틴'],
  costSensitive: ['실속형'],
  outdoor: ['야외'],
  indoor: ['실내'],
  expression: ['표현', '자기표현', '창작']
};

const similarCategoryGroups = [
  ['구기 스포츠', '스포츠', '피트니스', '격투 스포츠', '계절 스포츠'],
  ['악기', '음악이론/보컬', '국악'],
  ['미술/드로잉', '공예', '사진/영상'],
  ['취미/생활', '요리/조리', '패션/미용', '기타 취미/자기계발']
];

function getOptionEffects(answer) {
  const legacy = answer?.effects || {};
  return {
    categoryEffects: answer?.categoryEffects || legacy.categories || {},
    traitEffects: answer?.traitEffects || legacy.traits || {},
    tagEffects: answer?.tagEffects || Object.fromEntries((legacy.tags || []).map((tag) => [tag, 3]))
  };
}

export function summarizeAnswers(answers) {
  const categoryScores = {};
  const tagScores = {};
  let traitDelta = { ...defaultTraits };

  answers.forEach((answer) => {
    const { categoryEffects, traitEffects, tagEffects } = getOptionEffects(answer);
    traitDelta = addTraits(traitDelta, traitEffects);

    Object.entries(categoryEffects).forEach(([category, score]) => {
      if (categories.includes(category)) {
        categoryScores[category] = (categoryScores[category] || 0) + score;
      }
    });

    Object.entries(tagEffects).forEach(([tag, score]) => {
      tagScores[tag] = (tagScores[tag] || 0) + score;
    });
  });

  return { categoryScores, tagScores, traitDelta };
}

function deterministicNoise(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 997;
  }
  return (hash % 7) / 10;
}

function sameCategoryFamily(a, b) {
  return similarCategoryGroups.some((group) => group.includes(a) && group.includes(b));
}

function selectCategories(categoryScores) {
  const ranked = Object.entries(categoryScores)
    .filter(([category]) => getHobbiesByCategory(category).length > 0)
    .sort((a, b) => b[1] - a[1]);

  if (ranked.length === 0) return ['취미/생활', '공예'];
  if (ranked.length === 1) return [ranked[0][0], ranked[0][0] === '취미/생활' ? '공예' : '취미/생활'];

  const [first, second, third] = ranked;
  let selectedSecond = second;

  if (third && sameCategoryFamily(first[0], second[0]) && third[1] >= second[1] * 0.8) {
    selectedSecond = third;
  }

  const selected = [first[0], selectedSecond[0]];
  const fallback = ['구기 스포츠', '공예', '피트니스', '사진/영상', '취미/생활'].filter((category) => !selected.includes(category));
  return [...new Set([...selected, ...fallback])].slice(0, 2);
}

function calculateTagMatchScore(hobby, tagScores) {
  const score = hobby.tags.reduce((sum, tag) => sum + (tagScores[tag] || 0), 0);
  return clamp(score, 0, 25);
}

function calculateTraitMatchScore(hobby, traits) {
  let score = 0;

  Object.entries(traitTagRules).forEach(([trait, ruleTags]) => {
    const value = Math.max(0, traits[trait] || 0);
    if (!value) return;
    const hitCount = ruleTags.filter((tag) => hobby.tags.includes(tag)).length;
    score += Math.min(value, 8) * hitCount * 0.9;
  });

  return clamp(score, 0, 20);
}

function placeFits(preferred, placeType) {
  if (placeType === '혼합') return 0.6;
  return preferred === placeType ? 1 : 0;
}

function calculatePracticalFitScore(hobby, traits) {
  let score = 0;

  if ((traits.costSensitive || 0) >= 2) {
    if (hobby.costLevel === '낮음') score += 8;
    if (hobby.costLevel === '높음') score -= 8;
  }

  if ((traits.indoor || 0) > 0) score += 5 * placeFits('실내', hobby.placeType);
  if ((traits.outdoor || 0) > 0) score += 5 * placeFits('야외', hobby.placeType);

  if ((traits.focus || 0) > (traits.social || 0) && hobby.socialType === '혼자') score += 5;
  if ((traits.social || 0) > 0 && hobby.socialType === '함께') score += 5;

  return clamp(score, -15, 15);
}

function calculateFeedbackPenalty(hobby, feedbacks = []) {
  let penalty = 0;

  feedbacks.forEach((feedback) => {
    if (feedback.reason === '비용이 부담돼요' && hobby.costLevel === '높음') penalty -= 10;
    if (feedback.reason === '시간이 부족해요' && hobby.timeLevel === '김') penalty -= 10;
    if (feedback.reason === '너무 어렵게 느껴져요' && hobby.difficulty === '어려움') penalty -= 10;
    if (feedback.reason === '장소가 멀어요' && ['야외', '혼합'].includes(hobby.placeType)) penalty -= 8;
  });

  return clamp(penalty, -20, 0);
}

function calculateDuplicatePenalty(hobby, completedIds, removedIds) {
  let penalty = 0;
  if (completedIds.has(hobby.id)) penalty -= 30;
  if (removedIds.has(hobby.id)) penalty -= 25;
  return penalty;
}

function normalizeScore(rawScore, minRawScore, maxRawScore) {
  const normalizedScore = maxRawScore === minRawScore ? 0.5 : (rawScore - minRawScore) / (maxRawScore - minRawScore);
  const scorePercent = clamp(Math.round(55 + normalizedScore * 40), 55, 95);
  // 후보군 안에서 1등이어도 절대 적합도가 아주 높지 않으면 92점 이하로 보정합니다.
  // 덕분에 모든 추천이 95점으로 도배되는 현상을 막습니다.
  return rawScore >= 92 ? scorePercent : Math.min(scorePercent, 92);
}

function getMatchedTraits(hobby, traits, count = 2) {
  return Object.entries(traitTagRules)
    .filter(([trait, tags]) => (traits[trait] || 0) > 0 && tags.some((tag) => hobby.tags.includes(tag)))
    .sort((a, b) => (traits[b[0]] || 0) - (traits[a[0]] || 0))
    .slice(0, count)
    .map(([trait]) => traitLabels[trait] || trait);
}

function buildReason(hobby, traits, matchedTraits) {
  const labels = matchedTraits.length ? matchedTraits : getMatchedTraits(hobby, traits, 2);
  const joined = labels.length >= 2 ? `${labels[0]}과 ${labels[1]}` : `${labels[0] || '현재 성향'}`;

  if (hobby.tags.includes('활동적') || hobby.tags.includes('경쟁')) {
    return `${joined}이 높게 나타나 몸을 움직이며 실력이 쌓이는 취미와 잘 맞아요.`;
  }
  if (hobby.tags.includes('창작') || hobby.tags.includes('결과물')) {
    return `${joined}이 높게 나타나 조용히 결과물을 만들고 기록하는 취미와 잘 맞아요.`;
  }
  if (hobby.tags.includes('표현')) {
    return `${joined}이 높게 나타나 나를 드러내고 반응을 얻는 취미와 잘 맞아요.`;
  }
  if (hobby.tags.includes('루틴') || hobby.tags.includes('성장감')) {
    return `${joined}이 높게 나타나 꾸준히 쌓이는 성장형 취미와 잘 맞아요.`;
  }
  return `${joined}을 바탕으로 부담 없이 시작해볼 만한 취미로 추천했어요.`;
}

function ensureUniqueScores(items) {
  const used = new Set();
  return items.map((item) => {
    let score = item.score;
    while (used.has(score) && score > 55) score -= 1;
    while (used.has(score) && score < 95) score += 1;
    used.add(score);
    return { ...item, score };
  });
}

function scoreHobby({ hobby, category, categoryScores, tagScores, traits, completedIds, removedIds, feedbacks }) {
  const categoryMatchScore = hobby.category === category ? 30 : 0;
  const tagMatchScore = calculateTagMatchScore(hobby, tagScores);
  const traitMatchScore = calculateTraitMatchScore(hobby, traits);
  const practicalFitScore = calculatePracticalFitScore(hobby, traits);
  const feedbackPenalty = calculateFeedbackPenalty(hobby, feedbacks);
  const duplicatePenalty = calculateDuplicatePenalty(hobby, completedIds, removedIds);
  const categoryWeight = Math.min(10, (categoryScores[category] || 0) / 8);
  const rawScore = categoryMatchScore + categoryWeight + tagMatchScore + traitMatchScore + practicalFitScore + feedbackPenalty + duplicatePenalty + deterministicNoise(hobby.id);

  return {
    hobby,
    rawScore,
    scoreParts: {
      categoryMatchScore,
      tagMatchScore,
      traitMatchScore,
      practicalFitScore,
      feedbackPenalty,
      duplicatePenalty
    }
  };
}

export function buildRecommendations({ answers, baseTraits, activeHobbies, completedHobbies, feedbacks }) {
  const { categoryScores, tagScores, traitDelta } = summarizeAnswers(answers);
  const mergedTraits = addTraits(baseTraits || defaultTraits, traitDelta);
  const activeIds = new Set((activeHobbies || []).map((item) => item.hobbyId));
  const completedIds = new Set((completedHobbies || []).map((item) => item.hobbyId));
  const removedIds = new Set((feedbacks || []).map((item) => item.hobbyId));
  const selectedCategories = selectCategories(categoryScores);

  const groups = selectedCategories.map((category) => {
    const candidates = getHobbiesByCategory(category)
      .filter((hobby) => !activeIds.has(hobby.id))
      .map((hobby) => scoreHobby({ hobby, category, categoryScores, tagScores, traits: mergedTraits, completedIds, removedIds, feedbacks }));

    const rawScores = candidates.map((item) => item.rawScore);
    const minRawScore = Math.min(...rawScores);
    const maxRawScore = Math.max(...rawScores);

    const items = ensureUniqueScores(
      candidates
        .map((item) => {
          const matchedTraits = getMatchedTraits(item.hobby, mergedTraits, 2);
          return {
            ...item,
            score: normalizeScore(item.rawScore, minRawScore, maxRawScore),
            matchedTraits,
            recommendationReason: buildReason(item.hobby, mergedTraits, matchedTraits)
          };
        })
        .sort((a, b) => b.rawScore - a.rawScore)
        .slice(0, 2)
    );

    return { category, items };
  });

  const flat = groups.flatMap((group) => group.items);
  if (flat.length < 4) {
    const usedIds = new Set(flat.map((item) => item.hobby.id));
    const extras = hobbies
      .filter((hobby) => !activeIds.has(hobby.id) && !usedIds.has(hobby.id))
      .slice(0, 4 - flat.length)
      .map((hobby, index) => {
        const matchedTraits = getMatchedTraits(hobby, mergedTraits, 2);
        return {
          hobby,
          rawScore: 0,
          score: 70 - index,
          matchedTraits,
          recommendationReason: buildReason(hobby, mergedTraits, matchedTraits),
          scoreParts: {}
        };
      });
    if (groups[0]) groups[0].items = ensureUniqueScores([...groups[0].items, ...extras]);
  }

  return { groups, selectedCategories, categoryScores, tagScores, traitDelta, mergedTraits };
}

export function applyFeedbackToTraits(traits, reason, hobby) {
  const tagPenalty = {};
  const reasonDelta = {
    '비용이 부담돼요': { costSensitive: 2 },
    '시간이 부족해요': { routine: -1 },
    '생각보다 재미가 없어요': {},
    '시작 방법이 어려워요': { challenge: -1 },
    '장소가 멀어요': { outdoor: -1 },
    '혼자 하기 부담스러워요': { social: 1 },
    '너무 어렵게 느껴져요': { challenge: -2 },
    '다른 취미가 더 끌려요': {}
  }[reason] || {};

  if (reason === '생각보다 재미가 없어요' && hobby) {
    if (hobby.tags.includes('활동적')) tagPenalty.activity = -1;
    if (hobby.tags.includes('창작')) tagPenalty.creativity = -1;
    if (hobby.tags.includes('함께')) tagPenalty.social = -1;
    if (hobby.tags.includes('몰입')) tagPenalty.focus = -1;
  }

  return addTraits(traits, { ...tagPenalty, ...reasonDelta });
}
