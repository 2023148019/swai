import { useEffect, useMemo, useState } from 'react';
import StartAndInfoScreen from './screens/StartAndInfoScreen.jsx';
import SurveyScreen from './screens/SurveyScreen.jsx';
import RecommendationScreen from './screens/RecommendationScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import HobbyDetailScreen from './screens/HobbyDetailScreen.jsx';
import AddHobbyScreen from './screens/AddHobbyScreen.jsx';
import HobbySearchScreen from './screens/HobbySearchScreen.jsx';
import AchievementScreen from './screens/AchievementScreen.jsx';
import CompletedQuestScreen from './screens/CompletedQuestScreen.jsx';
import CompletionModal from './components/CompletionModal.jsx';
import RemoveHobbyFeedbackModal from './components/RemoveHobbyFeedbackModal.jsx';
import ResetButton from './components/ResetButton.jsx';
import { hobbyMap } from './data/hobbies.js';
import { defaultTraits } from './data/questions.js';
import { buildRecommendations, applyFeedbackToTraits } from './utils/recommendation.js';
import { clearState, createInitialState, hasSavedState, loadState, saveState } from './utils/storage.js';
import { addAchievement, addTraits, baseAchievements, getHobbyProgress, getProfile, getTraitBoostFromHobby } from './utils/progress.js';
import { getSubCharacter } from './utils/character.js';
import { saveAddedQuest, saveSurveyResponse, saveTraits, saveVisitor } from './utils/sheets.js';

function makeInstance(hobbyId) {
  return {
    instanceId: `${hobbyId}_${Date.now()}`,
    hobbyId,
    completedMissionIds: [],
    missionEvidence: {},
    milestones: [],
    halfBonusClaimed: false,
    completeBonusClaimed: false,
    status: 'active',
    createdAt: new Date().toISOString()
  };
}

function normalizeEvidenceLink(link = '') {
  return String(link || '').trim();
}

function hasMissionEvidence(evidence = {}) {
  const link = String(evidence?.link || '').trim();
  const memo = String(evidence?.memo || '').trim();
  return link.length > 0 || memo.length > 0;
}

function getMission(hobby, missionId) {
  return hobby.missionStages
    .flatMap((stage) => stage.missions.map((mission) => ({ ...mission, stageId: stage.id })))
    .find((mission) => mission.id === missionId);
}

const SCORE_REWARDS = {
  ADD_HOBBY: 5,
  STAGE_COMPLETE: 12,
  HALF_PROGRESS: 20,
  COMPLETE_HOBBY: 45,
  HOBBY_ACHIEVEMENT: 30,
  FEEDBACK: 5,
  RETAKE_SURVEY: 5
};

export default function App() {
  // 시연용: 최초 진입 시 자동 복원하지 않습니다. 사용자가 이어하기를 눌러야만 loadState를 호출합니다.
  const [appState, setAppState] = useState(() => createInitialState());
  const [screen, setScreen] = useState('start');
  const [sessionActive, setSessionActive] = useState(false);
  const [savedAdventureExists, setSavedAdventureExists] = useState(() => hasSavedState());
  const [recommendations, setRecommendations] = useState(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [removeTargetId, setRemoveTargetId] = useState(null);

  const profile = useMemo(
    () => getProfile(appState.userInfo, appState.userTraits, appState.userStats),
    [appState.userInfo, appState.userTraits, appState.userStats]
  );

  const stats = useMemo(() => ({
    ...appState.userStats,
    currentTitle: profile.currentTitle,
    nextTitle: profile.nextTitle,
    titleProgressPercent: profile.titleProgressPercent,
    completedHobbyCount: appState.completedHobbies.length,
    achievementCount: appState.achievements.length
  }), [appState.userStats, appState.completedHobbies.length, appState.achievements.length, profile]);

  useEffect(() => {
    if (!sessionActive || !appState.userInfo) return;
    saveState({ ...appState, userProfile: profile, userStats: stats });
    setSavedAdventureExists(true);
  }, [appState, profile, stats, sessionActive]);

  useEffect(() => {
    saveVisitor();
  }, []);

  const selectedActiveHobby = appState.activeHobbies.find((item) => item.instanceId === selectedInstanceId);
  const removeTarget = appState.activeHobbies.find((item) => item.instanceId === removeTargetId);
  const removeTargetHobby = removeTarget ? hobbyMap[removeTarget.hobbyId] : null;

  const updateState = (recipe) => {
    setAppState((prev) => {
      const next = recipe(prev);
      const nextProfile = getProfile(next.userInfo, next.userTraits, next.userStats);
      return {
        ...next,
        userProfile: nextProfile,
        userStats: {
          ...next.userStats,
          currentTitle: nextProfile.currentTitle,
          nextTitle: nextProfile.nextTitle,
          titleProgressPercent: nextProfile.titleProgressPercent,
          completedHobbyCount: next.completedHobbies.length,
          achievementCount: next.achievements.length
        }
      };
    });
  };

  const resetRuntimeState = () => {
    setRecommendations(null);
    setSelectedInstanceId(null);
    setCompletion(null);
    setRemoveTargetId(null);
  };

  const handlePrepareNewAdventure = () => {
    clearState();
    setAppState(createInitialState());
    setSessionActive(false);
    setSavedAdventureExists(false);
    resetRuntimeState();
    setScreen('start');
  };

  const handleContinueAdventure = () => {
    const saved = loadState();
    if (!saved.userInfo) return;
    setAppState(saved);
    setSessionActive(true);
    setSavedAdventureExists(true);
    resetRuntimeState();
    setScreen('home');
  };

  const handleStart = (userInfo) => {
    setSessionActive(true);
    updateState(() => ({
      ...createInitialState(),
      userInfo,
      userTraits: { ...defaultTraits }
    }));
    setScreen('survey');
  };

  const handleSurveyComplete = (answers) => {
    const result = buildRecommendations({
      answers,
      baseTraits: appState.userTraits,
      activeHobbies: appState.activeHobbies,
      completedHobbies: appState.completedHobbies,
      feedbacks: appState.feedbacks
    });
    const subCharacter = getSubCharacter(result.mergedTraits);

    saveSurveyResponse(appState.userInfo, answers);
    saveTraits(result.mergedTraits, subCharacter.name);

    updateState((prev) => {
      const isRepeatSurvey = prev.surveyHistory.length > 0;
      let nextAchievements = prev.achievements;
      let bonusScore = 0;
      if (isRepeatSurvey) {
        const beforeAchievementCount = nextAchievements.length;
        nextAchievements = addAchievement(nextAchievements, baseAchievements.find((item) => item.id === 'again'));
        bonusScore = nextAchievements.length !== beforeAchievementCount ? SCORE_REWARDS.RETAKE_SURVEY : 0;
      }

      return {
        ...prev,
        userTraits: result.mergedTraits,
        surveyHistory: [
          ...prev.surveyHistory,
          {
            answers,
            categoryScores: result.categoryScores,
            tagScores: result.tagScores,
            selectedCategories: result.selectedCategories,
            createdAt: new Date().toISOString()
          }
        ],
        achievements: nextAchievements,
        userStats: { ...prev.userStats, totalScore: prev.userStats.totalScore + bonusScore }
      };
    });

    setRecommendations(result);
    setScreen('recommendation');
  };

  const addHobby = (hobby) => {
    const isAlreadyTracked = appState.activeHobbies.some((item) => item.hobbyId === hobby.id) ||
      appState.completedHobbies.some((item) => item.hobbyId === hobby.id);
    const quest = makeInstance(hobby.id);

    if (!isAlreadyTracked) {
      saveAddedQuest(quest, hobby);
    }

    updateState((prev) => {
      if (
        prev.activeHobbies.some((item) => item.hobbyId === hobby.id) ||
        prev.completedHobbies.some((item) => item.hobbyId === hobby.id)
      ) return prev;
      const nextActive = [...prev.activeHobbies, quest];
      let nextAchievements = addAchievement(prev.achievements, baseAchievements.find((item) => item.id === 'first_step'));
      if (nextActive.length + prev.completedHobbies.length >= 3) {
        nextAchievements = addAchievement(nextAchievements, baseAchievements.find((item) => item.id === 'collector_3'));
      }
      return {
        ...prev,
        activeHobbies: nextActive,
        achievements: nextAchievements,
        userStats: { ...prev.userStats, totalScore: prev.userStats.totalScore + SCORE_REWARDS.ADD_HOBBY }
      };
    });
    setScreen('home');
  };

  const completeMission = (instanceId, missionId) => {
    updateState((prev) => {
      const active = prev.activeHobbies.find((item) => item.instanceId === instanceId);
      if (!active || active.completedMissionIds.includes(missionId)) return prev;

      const hobby = hobbyMap[active.hobbyId];
      const mission = getMission(hobby, missionId);
      if (!mission) return prev;

      const evidence = active.missionEvidence?.[missionId];
      if (!hasMissionEvidence(evidence)) {
        return prev;
      }

      if (active.completedMissionIds.includes(missionId)) {
        return prev;
      }

      const beforeProgress = getHobbyProgress(active);
      const beforeStage = beforeProgress.stageProgress[mission.stageId];
      const updatedActive = {
        ...active,
        completedMissionIds: [...active.completedMissionIds, missionId]
      };
      const afterProgress = getHobbyProgress(updatedActive);
      const afterStage = afterProgress.stageProgress[mission.stageId];

      let nextAchievements = prev.achievements;
      let nextCompleted = prev.completedHobbies;
      let nextActiveList = prev.activeHobbies.map((item) => item.instanceId === instanceId ? updatedActive : item);
      let addedScore = mission.rewardScore;
      let nextTraits = addTraits(prev.userTraits, getTraitBoostFromHobby(hobby, 1));
      let milestones = active.milestones || [];

      if (!beforeStage?.isComplete && afterStage?.isComplete) {
        addedScore += SCORE_REWARDS.STAGE_COMPLETE;
      }

      if (beforeProgress.overall < 50 && afterProgress.overall >= 50 && !active.halfBonusClaimed) {
        nextAchievements = addAchievement(nextAchievements, baseAchievements.find((item) => item.id === 'half_way'));
        addedScore += SCORE_REWARDS.HALF_PROGRESS;
        milestones = [...milestones, 'half'];
        nextActiveList = nextActiveList.map((item) => item.instanceId === instanceId ? { ...item, halfBonusClaimed: true, milestones } : item);
      }

      if (afterProgress.overall >= 100) {
        const beforeAchievementCount = nextAchievements.length;
        nextAchievements = addAchievement(nextAchievements, baseAchievements.find((item) => item.id === 'first_complete'));
        nextAchievements = addAchievement(nextAchievements, hobby.achievement);
        if (!active.completeBonusClaimed) {
          addedScore += SCORE_REWARDS.COMPLETE_HOBBY;
        }
        if (nextAchievements.length > beforeAchievementCount) {
          addedScore += SCORE_REWARDS.HOBBY_ACHIEVEMENT;
        }

        const completedRecord = {
          ...updatedActive,
          milestones: [...new Set([...milestones, 'half', 'complete'])],
          halfBonusClaimed: true,
          completeBonusClaimed: true,
          status: 'completed',
          completedAt: new Date().toISOString()
        };
        nextActiveList = nextActiveList.filter((item) => item.instanceId !== instanceId);
        nextCompleted = [...prev.completedHobbies, completedRecord];
        nextTraits = addTraits(nextTraits, getTraitBoostFromHobby(hobby, 2));
        setCompletion({ hobby });
        setSelectedInstanceId(null);
      }

      return {
        ...prev,
        activeHobbies: nextActiveList,
        completedHobbies: nextCompleted,
        achievements: nextAchievements,
        userTraits: nextTraits,
        userStats: { ...prev.userStats, totalScore: prev.userStats.totalScore + addedScore }
      };
    });
  };

  const submitRemoveFeedback = ({ reason, comment }) => {
    const active = appState.activeHobbies.find((item) => item.instanceId === removeTargetId);
    const hobby = active ? hobbyMap[active.hobbyId] : null;
    if (!active || !hobby) {
      setRemoveTargetId(null);
      return;
    }

    updateState((prev) => {
      const feedback = {
        hobbyId: hobby.id,
        reason,
        comment,
        createdAt: new Date().toISOString()
      };
      const nextAchievements = addAchievement(prev.achievements, baseAchievements.find((item) => item.id === 'reviewer'));
      const feedbackScore = nextAchievements.length !== prev.achievements.length ? SCORE_REWARDS.FEEDBACK : 0;
      return {
        ...prev,
        activeHobbies: prev.activeHobbies.filter((item) => item.instanceId !== active.instanceId),
        feedbacks: [...prev.feedbacks, feedback],
        achievements: nextAchievements,
        userTraits: applyFeedbackToTraits(prev.userTraits, reason, hobby),
        userStats: { ...prev.userStats, totalScore: prev.userStats.totalScore + feedbackScore }
      };
    });

    setRemoveTargetId(null);
    setSelectedInstanceId(null);
    setScreen('home');
  };

  const resetAll = () => {
    clearState();
    setAppState(createInitialState());
    setSessionActive(false);
    setSavedAdventureExists(false);
    resetRuntimeState();
    setScreen('start');
  };

  const handleEvidenceChange = (instanceId, missionId, nextValue) => {
    updateState((prev) => {
      const active = prev.activeHobbies.find((item) => item.instanceId === instanceId);
      if (!active) return prev;

      const current = active.missionEvidence?.[missionId] || {};
      const nextEvidence = {
        ...(active.missionEvidence || {}),
        [missionId]: {
          ...current,
          ...nextValue,
          link: normalizeEvidenceLink(nextValue?.link ?? current.link ?? ''),
          memo: String(nextValue?.memo ?? current.memo ?? ''),
          updatedAt: new Date().toISOString()
        }
      };

      return {
        ...prev,
        activeHobbies: prev.activeHobbies.map((item) => item.instanceId === instanceId
          ? { ...item, missionEvidence: nextEvidence }
          : item)
      };
    });
  };

  const openHobby = (instanceId) => {
    setSelectedInstanceId(instanceId);
    setScreen('hobbyDetail');
  };

  const goHomeOrStart = () => {
    setScreen(sessionActive && appState.userInfo ? 'home' : 'start');
  };

  const renderScreen = () => {
    if (screen === 'start' || !sessionActive || !appState.userInfo) {
      return (
        <StartAndInfoScreen
          hasSavedAdventure={savedAdventureExists}
          onPrepareNewAdventure={handlePrepareNewAdventure}
          onContinue={handleContinueAdventure}
          onStart={handleStart}
        />
      );
    }

    if (screen === 'survey') {
      return <SurveyScreen onComplete={handleSurveyComplete} onBack={() => setScreen('home')} />;
    }

    if (screen === 'recommendation') {
      return <RecommendationScreen recommendations={recommendations} onSelect={addHobby} onRetake={() => setScreen('survey')} onHome={() => setScreen('home')} />;
    }

    if (screen === 'hobbyDetail') {
      return <HobbyDetailScreen
        activeHobby={selectedActiveHobby}
        userInfo={appState.userInfo}
        onBack={() => setScreen('home')}
        onCompleteMission={completeMission}
        onRemove={setRemoveTargetId}
        onEvidenceChange={handleEvidenceChange}
      />;
    }

    if (screen === 'addHobby') {
      return <AddHobbyScreen onSearch={() => setScreen('hobbySearch')} onSurvey={() => setScreen('survey')} onBack={() => setScreen('home')} />;
    }

    if (screen === 'hobbySearch') {
      return <HobbySearchScreen activeHobbies={appState.activeHobbies} completedHobbies={appState.completedHobbies} onAdd={addHobby} onBack={() => setScreen('addHobby')} />;
    }

    if (screen === 'achievement') {
      return <AchievementScreen profile={profile} achievements={appState.achievements} completedHobbies={appState.completedHobbies} onBack={() => setScreen('home')} />;
    }

    if (screen === 'completedQuests') {
      return <CompletedQuestScreen completedHobbies={appState.completedHobbies} onBack={() => setScreen('home')} />;
    }

    return (
      <HomeScreen
        profile={profile}
        stats={stats}
        userTraits={appState.userTraits}
        activeHobbies={appState.activeHobbies}
        completedHobbies={appState.completedHobbies}
        onOpenHobby={openHobby}
        onAddHobby={() => setScreen('addHobby')}
        onAchievements={() => setScreen('achievement')}
        onCompletedQuests={() => setScreen('completedQuests')}
      />
    );
  };

  return (
    <div className="app-shell">
      <div className="rotate-device-overlay" role="status" aria-live="polite">
        <div className="rotate-device-card">
          <span className="rotate-device-icon" aria-hidden="true">↻</span>
          <h2>가로로 돌려서 플레이해주세요</h2>
          <p>Hobby Quest는 휴대폰을 가로로 들었을 때 작은 게임 화면처럼 더 편하게 즐길 수 있어요.</p>
        </div>
      </div>
      <header className="app-header">
        <button className="brand" onClick={goHomeOrStart}>
          <span>IA</span> Inner Adventure
        </button>
        <ResetButton onReset={resetAll} />
      </header>
      {renderScreen()}
      <CompletionModal completed={completion} onClose={() => { setCompletion(null); setScreen('home'); }} />
      <RemoveHobbyFeedbackModal hobby={removeTargetHobby} onCancel={() => setRemoveTargetId(null)} onSubmit={submitRemoveFeedback} />
    </div>
  );
}
