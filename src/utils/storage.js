import { defaultTraits } from '../data/questions.js';

export const STORAGE_KEY = 'hobbyQuestData';

const defaultStats = {
  totalScore: 0,
  currentTitle: '홈프로텍터',
  nextTitle: '초보 모험가',
  titleProgressPercent: 0,
  completedHobbyCount: 0,
  achievementCount: 0
};

function normalizeActiveHobby(item) {
  return {
    ...item,
    completedMissionIds: item.completedMissionIds || [],
    milestones: item.milestones || [],
    halfBonusClaimed: Boolean(item.halfBonusClaimed || item.milestones?.includes('half')),
    completeBonusClaimed: Boolean(item.completeBonusClaimed || item.milestones?.includes('complete'))
  };
}

export const initialState = {
  userInfo: null,
  userTraits: { ...defaultTraits },
  userProfile: null,
  activeHobbies: [],
  completedHobbies: [],
  achievements: [],
  userStats: { ...defaultStats },
  feedbacks: [],
  surveyHistory: []
};

export function createInitialState() {
  return {
    ...initialState,
    userTraits: { ...defaultTraits },
    userStats: { ...defaultStats },
    activeHobbies: [],
    completedHobbies: [],
    achievements: [],
    feedbacks: [],
    surveyHistory: []
  };
}

export function hasSavedState() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return {
      ...createInitialState(),
      ...parsed,
      userTraits: { ...defaultTraits, ...(parsed.userTraits || {}) },
      userStats: { ...defaultStats, ...(parsed.userStats || {}) },
      activeHobbies: (parsed.activeHobbies || []).map(normalizeActiveHobby),
      completedHobbies: parsed.completedHobbies || [],
      achievements: parsed.achievements || [],
      feedbacks: parsed.feedbacks || [],
      surveyHistory: parsed.surveyHistory || []
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage를 사용할 수 없는 환경에서는 조용히 무시합니다.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage를 사용할 수 없는 환경에서는 조용히 무시합니다.
  }
}
