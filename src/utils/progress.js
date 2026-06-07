import { hobbyMap } from '../data/hobbies.js';
import { defaultTraits, traitLabels } from '../data/questions.js';

export const titleLevels = [
  { min: 0, title: '홈프로텍터', description: '아직은 첫걸음을 준비하며 나의 취향 지도를 펼쳐보는 중입니다.' },
  { min: 120, title: '초보 모험가', description: '취미를 하나씩 시도하며 내가 몰랐던 취향을 발견하는 단계입니다.' },
  { min: 350, title: '열정 모험가', description: '여러 퀘스트를 경험하며 나에게 맞는 가능성을 넓히고 있습니다.' },
  { min: 750, title: '취향 지도 제작자', description: '작은 실험들이 모여 나만의 취향 지도가 선명해지고 있습니다.' },
  { min: 1400, title: '라이프 모험가', description: '취미가 나를 발견하는 생활의 길로 자연스럽게 이어지고 있습니다.' }
];

const TITLE_STAGE_COUNT = 5;
const FINAL_TITLE_STAGE_RANGE = 650;

export const baseAchievements = [
  { id: 'first_step', title: '첫 단서 발견', description: '첫 퀘스트를 취향 지도에 추가했습니다.' },
  { id: 'half_way', title: '작은 실험의 중간 지점', description: '첫 퀘스트 진행도 50%를 달성했습니다.' },
  { id: 'first_complete', title: '하나의 길 완주', description: '퀘스트 하나를 끝까지 완료했습니다.' },
  { id: 'collector_3', title: '가능성 수집가', description: '퀘스트 3개를 취향 지도에 추가했습니다.' },
  { id: 'again', title: '새로운 가능성 발견', description: '내면 지도를 다시 복원해 새로운 지점을 발견했습니다.' },
  { id: 'reviewer', title: '솔직한 단서 기록', description: '맞지 않았던 길에 대한 피드백을 남겼습니다.' }
];

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function addTraits(base = defaultTraits, delta = {}) {
  const next = { ...defaultTraits, ...base };
  Object.entries(delta).forEach(([key, value]) => {
    next[key] = clamp((next[key] || 0) + value, -10, 30);
  });
  return next;
}

export function getTopTraits(traits = defaultTraits, count = 2) {
  return Object.entries({ ...defaultTraits, ...traits })
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => ({ key, label: traitLabels[key] || key }));
}

export function getTitleInfo(totalScore = 0) {
  const currentIndex = titleLevels.reduce((last, level, index) => totalScore >= level.min ? index : last, 0);
  const current = titleLevels[currentIndex];
  const next = titleLevels[currentIndex + 1] || {
    min: current.min + FINAL_TITLE_STAGE_RANGE,
    title: '충분히 발견한 여정'
  };
  const isFinalTitle = currentIndex === titleLevels.length - 1;

  const titleRange = next.min - current.min;
  const stageSize = titleRange / TITLE_STAGE_COUNT;
  const scoreInTitle = clamp(totalScore - current.min, 0, titleRange);
  const currentTitleStep = Math.min(
    TITLE_STAGE_COUNT,
    Math.floor(scoreInTitle / stageSize) + 1
  );
  const currentStageStart = current.min + stageSize * (currentTitleStep - 1);
  const nextStageScore = currentTitleStep >= TITLE_STAGE_COUNT
    ? next.min
    : current.min + stageSize * currentTitleStep;
  const isMaxTitle = isFinalTitle && totalScore >= next.min;
  const stageProgress = isMaxTitle
    ? 100
    : ((totalScore - currentStageStart) / (nextStageScore - currentStageStart)) * 100;
  const nextGrowthLabel = isMaxTitle
    ? '충분히 발견한 여정'
    : isFinalTitle && currentTitleStep >= TITLE_STAGE_COUNT
    ? '충분히 발견한 여정'
    : currentTitleStep >= TITLE_STAGE_COUNT
    ? `${next.title} 1단계`
    : `${current.title} ${currentTitleStep + 1}단계`;

  return {
    currentTitle: current.title,
    currentDescription: current.description,
    currentTitleStep,
    currentTitleLabel: `${current.title} ${currentTitleStep}단계`,
    nextTitle: next?.title || '충분히 발견한 여정',
    nextGrowthLabel,
    titleProgressPercent: clamp(Math.round(stageProgress)),
    needScore: Math.max(0, Math.ceil(nextStageScore - totalScore)),
    isMaxTitle
  };
}

export function getProfile(userInfo, userTraits, userStats) {
  const titleInfo = getTitleInfo(userStats.totalScore);
  const topTraits = getTopTraits(userTraits);
  return {
    name: userInfo?.name || '모험가',
    gender: userInfo?.gender || '',
    ...titleInfo,
    topTraits
  };
}

export function getAllMissions(hobby) {
  return hobby.missionStages.flatMap((stage) => stage.missions.map((mission) => ({ ...mission, stageId: stage.id })));
}

export function getHobbyProgress(activeHobby) {
  const hobby = hobbyMap[activeHobby.hobbyId];
  if (!hobby) return { overall: 0, stageProgress: {}, nextMission: null, currentStage: null };
  const completedIds = new Set(activeHobby.completedMissionIds || []);
  const allMissions = getAllMissions(hobby);
  const total = allMissions.reduce((sum, mission) => sum + mission.progressValue, 0);
  const done = allMissions.reduce((sum, mission) => sum + (completedIds.has(mission.id) ? mission.progressValue : 0), 0);

  const stageProgress = {};
  let currentStage = hobby.missionStages[0];
  let nextMission = null;

  hobby.missionStages.forEach((stage, stageIndex) => {
    const stageTotal = stage.missions.reduce((sum, mission) => sum + mission.progressValue, 0);
    const stageDone = stage.missions.reduce((sum, mission) => sum + (completedIds.has(mission.id) ? mission.progressValue : 0), 0);
    const previousDone = stageIndex === 0 || hobby.missionStages[stageIndex - 1].missions.every((mission) => completedIds.has(mission.id));
    const isLocked = !previousDone;
    stageProgress[stage.id] = {
      percent: stageTotal ? Math.round((stageDone / stageTotal) * 100) : 0,
      isLocked,
      isComplete: stageDone >= stageTotal
    };

    if (!isLocked && !stageProgress[stage.id].isComplete && !nextMission) {
      currentStage = stage;
      nextMission = stage.missions.find((mission) => !completedIds.has(mission.id));
    }
  });

  return {
    overall: total ? clamp(Math.round((done / total) * 100)) : 0,
    stageProgress,
    nextMission,
    currentStage
  };
}

export function getTraitBoostFromHobby(hobby, amount = 1) {
  const boost = {};
  const tagMap = {
    '활동적': 'activity', '스포츠': 'activity', '운동': 'activity',
    '창작': 'creativity', '결과물': 'creativity',
    '함께': 'social', '커뮤니티': 'social',
    '도전': 'challenge', '경쟁': 'challenge',
    '몰입': 'focus', '정적': 'focus', '혼자': 'focus',
    '루틴': 'routine', '꾸준함': 'routine', '성장감': 'routine',
    '실속형': 'costSensitive',
    '야외': 'outdoor',
    '실내': 'indoor',
    '표현': 'expression'
  };

  hobby.tags.forEach((tag) => {
    const key = tagMap[tag];
    if (key) boost[key] = (boost[key] || 0) + amount;
  });

  Object.keys(boost).forEach((key) => {
    boost[key] = clamp(boost[key], -2, 3);
  });
  return boost;
}

export function addAchievement(existing = [], achievement) {
  if (!achievement || existing.some((item) => item.id === achievement.id)) return existing;
  return [...existing, { ...achievement, earnedAt: new Date().toISOString() }];
}
