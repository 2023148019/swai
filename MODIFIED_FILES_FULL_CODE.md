# Modified files full code

## `src/App.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import StartAndInfoScreen from './screens/StartAndInfoScreen.jsx';
import SurveyScreen from './screens/SurveyScreen.jsx';
import RecommendationScreen from './screens/RecommendationScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import HobbyDetailScreen from './screens/HobbyDetailScreen.jsx';
import AddHobbyScreen from './screens/AddHobbyScreen.jsx';
import HobbySearchScreen from './screens/HobbySearchScreen.jsx';
import AchievementScreen from './screens/AchievementScreen.jsx';
import CompletionModal from './components/CompletionModal.jsx';
import RemoveHobbyFeedbackModal from './components/RemoveHobbyFeedbackModal.jsx';
import ResetButton from './components/ResetButton.jsx';
import { hobbyMap } from './data/hobbies.js';
import { defaultTraits } from './data/questions.js';
import { buildRecommendations, applyFeedbackToTraits } from './utils/recommendation.js';
import { clearState, createInitialState, hasSavedState, loadState, saveState } from './utils/storage.js';
import { addAchievement, addTraits, baseAchievements, getHobbyProgress, getProfile, getTraitBoostFromHobby } from './utils/progress.js';

function makeInstance(hobbyId) {
  return {
    instanceId: `${hobbyId}_${Date.now()}`,
    hobbyId,
    completedMissionIds: [],
    milestones: [],
    status: 'active',
    createdAt: new Date().toISOString()
  };
}

function getMission(hobby, missionId) {
  return hobby.missionStages
    .flatMap((stage) => stage.missions.map((mission) => ({ ...mission, stageId: stage.id })))
    .find((mission) => mission.id === missionId);
}

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

    updateState((prev) => {
      const isRepeatSurvey = prev.surveyHistory.length > 0;
      let nextAchievements = prev.achievements;
      let bonusScore = 0;
      if (isRepeatSurvey) {
        nextAchievements = addAchievement(nextAchievements, baseAchievements.find((item) => item.id === 'again'));
        bonusScore = nextAchievements.length !== prev.achievements.length ? 10 : 0;
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
    updateState((prev) => {
      if (prev.activeHobbies.some((item) => item.hobbyId === hobby.id)) return prev;
      const nextActive = [...prev.activeHobbies, makeInstance(hobby.id)];
      let nextAchievements = addAchievement(prev.achievements, baseAchievements.find((item) => item.id === 'first_step'));
      if (nextActive.length + prev.completedHobbies.length >= 3) {
        nextAchievements = addAchievement(nextAchievements, baseAchievements.find((item) => item.id === 'collector_3'));
      }
      return {
        ...prev,
        activeHobbies: nextActive,
        achievements: nextAchievements,
        userStats: { ...prev.userStats, totalScore: prev.userStats.totalScore + 10 }
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
        addedScore += 30;
      }

      if (beforeProgress.overall < 50 && afterProgress.overall >= 50 && !milestones.includes('half')) {
        nextAchievements = addAchievement(nextAchievements, baseAchievements.find((item) => item.id === 'half_way'));
        addedScore += 30;
        milestones = [...milestones, 'half'];
        nextActiveList = nextActiveList.map((item) => item.instanceId === instanceId ? { ...item, milestones } : item);
      }

      if (afterProgress.overall >= 100) {
        const completedRecord = {
          ...updatedActive,
          milestones: [...new Set([...milestones, 'half', 'complete'])],
          status: 'completed',
          completedAt: new Date().toISOString()
        };
        nextActiveList = nextActiveList.filter((item) => item.instanceId !== instanceId);
        nextCompleted = [...prev.completedHobbies, completedRecord];
        nextAchievements = addAchievement(nextAchievements, baseAchievements.find((item) => item.id === 'first_complete'));
        nextAchievements = addAchievement(nextAchievements, hobby.achievement);
        nextTraits = addTraits(nextTraits, getTraitBoostFromHobby(hobby, 2));
        addedScore += 120;
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
      return {
        ...prev,
        activeHobbies: prev.activeHobbies.filter((item) => item.instanceId !== active.instanceId),
        feedbacks: [...prev.feedbacks, feedback],
        achievements: nextAchievements,
        userTraits: applyFeedbackToTraits(prev.userTraits, reason, hobby),
        userStats: { ...prev.userStats, totalScore: prev.userStats.totalScore + 10 }
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
      return <HobbyDetailScreen activeHobby={selectedActiveHobby} onBack={() => setScreen('home')} onCompleteMission={completeMission} onRemove={setRemoveTargetId} />;
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

    return (
      <HomeScreen
        profile={profile}
        stats={stats}
        activeHobbies={appState.activeHobbies}
        onOpenHobby={openHobby}
        onAddHobby={() => setScreen('addHobby')}
        onAchievements={() => setScreen('achievement')}
      />
    );
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand" onClick={goHomeOrStart}>
          <span>🧭</span> Hobby Quest
        </button>
        <ResetButton onReset={resetAll} />
      </header>
      {renderScreen()}
      <CompletionModal completed={completion} onClose={() => { setCompletion(null); setScreen('home'); }} />
      <RemoveHobbyFeedbackModal hobby={removeTargetHobby} onCancel={() => setRemoveTargetId(null)} onSubmit={submitRemoveFeedback} />
    </div>
  );
}

```

## `src/App.css`

```css
:root {
  --bg: #F8F3E8;
  --surface: #FFFDF7;
  --surface-strong: #fff8ec;
  --primary: #E07A5F;
  --primary-dark: #C85C45;
  --secondary: #3D405B;
  --accent: #F2CC8F;
  --success: #81B29A;
  --text: #2F2F2F;
  --muted: #6B6B6B;
  --border: #E8DEC8;
  --danger: #D45C50;
  --shadow: 0 18px 44px rgba(61, 64, 91, 0.10);
  --shadow-hover: 0 24px 58px rgba(61, 64, 91, 0.16);
  --radius: 24px;
}

* { box-sizing: border-box; }
html { background: var(--bg); }
body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  color: var(--text);
  font-family: Inter, Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at 10% 4%, rgba(242, 204, 143, 0.55), transparent 34rem),
    radial-gradient(circle at 90% 0%, rgba(129, 178, 154, 0.24), transparent 30rem),
    linear-gradient(180deg, #fff8ed 0%, var(--bg) 44%, #f7efe2 100%);
}

button, input, select, textarea { font: inherit; }
button { cursor: pointer; }
button:disabled { cursor: not-allowed; opacity: 0.48; }

.app-shell { min-height: 100vh; }
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 18px 0;
  backdrop-filter: blur(14px);
}
.brand {
  border: 1px solid rgba(232, 222, 200, 0.9);
  background: rgba(255, 253, 247, 0.82);
  box-shadow: 0 10px 24px rgba(61,64,91,0.08);
  border-radius: 999px;
  padding: 10px 15px;
  font-weight: 950;
  font-size: 1.06rem;
  color: var(--secondary);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.screen {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 26px 0 84px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.flat-card { box-shadow: none; }

h1, h2, h3, h4, p { margin-top: 0; }
h1 { font-size: clamp(2.25rem, 4vw, 3.8rem); line-height: 1.05; letter-spacing: -0.055em; margin-bottom: 18px; }
h2 { font-size: clamp(1.45rem, 2.4vw, 2rem); letter-spacing: -0.04em; margin-bottom: 12px; }
h3 { font-size: 1.18rem; letter-spacing: -0.02em; margin-bottom: 8px; }
h4 { font-size: 1rem; margin-bottom: 6px; }
p { line-height: 1.66; font-size: 1rem; }
.muted { color: var(--muted); }
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--primary-dark);
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.primary-button, .secondary-button, .ghost-button, .danger-button {
  border-radius: 999px;
  padding: 12px 18px;
  border: 0;
  font-weight: 900;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, border-color 0.16s ease;
}
.primary-button {
  color: white;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  box-shadow: 0 12px 26px rgba(224, 122, 95, 0.25);
}
.secondary-button {
  color: var(--secondary);
  background: #fff3df;
  border: 1px solid var(--border);
}
.ghost-button {
  color: var(--secondary);
  background: rgba(255, 253, 247, 0.68);
  border: 1px solid var(--border);
}
.danger-button {
  color: white;
  background: var(--danger);
  box-shadow: 0 12px 26px rgba(212, 92, 80, 0.2);
}
.primary-button:hover, .secondary-button:hover, .danger-button:hover, .ghost-button:hover { transform: translateY(-1px); box-shadow: var(--shadow-hover); }
.primary-button:active, .secondary-button:active, .danger-button:active, .ghost-button:active { transform: translateY(0); }
.full { width: 100%; }
.push-bottom { margin-top: auto; }
.button-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.button-row.end { justify-content: flex-end; }
.button-row.center { justify-content: center; margin-top: 26px; }
.button-column { display: grid; gap: 10px; }
.back-button { margin-bottom: 16px; }

/* Start */
.start-screen.desktop-hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.32fr) minmax(360px, 0.68fr);
  gap: 24px;
  align-items: start;
}
.hero-card {
  min-height: 630px;
  padding: 48px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.72fr);
  gap: 28px;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,253,247,0.96), rgba(255,245,226,0.92));
}
.hero-copy p { max-width: 680px; font-size: 1.08rem; color: var(--muted); }
.hero-note { color: var(--primary-dark) !important; font-weight: 850; }
.hero-feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 28px 0 18px; }
.hero-feature-grid div { background: #fff4df; border: 1px solid var(--border); border-radius: 20px; padding: 16px; display: grid; gap: 4px; }
.hero-feature-grid strong { color: var(--secondary); font-size: 1.35rem; }
.hero-feature-grid span { color: var(--muted); font-weight: 800; font-size: 0.88rem; }
.start-side-panel { display: grid; gap: 18px; }
.start-choice-card { padding: 26px; text-align: center; }
.start-choice-card .compass { min-height: 170px; }
.start-action-stack { display: grid; gap: 10px; margin-top: 18px; }
.info-form { padding: 26px; display: grid; gap: 15px; }
.info-form label { display: grid; gap: 8px; font-weight: 850; color: #4d4339; }
.info-form input, .info-form select, .search-input, textarea {
  width: 100%;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #fffaf2;
  color: var(--text);
  padding: 14px 15px;
  outline: none;
}
.info-form input:focus, .info-form select:focus, .search-input:focus, textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(224, 122, 95, 0.14); }
textarea { min-height: 110px; resize: vertical; margin-top: 14px; }

/* Illustrations */
.illustration { position: relative; min-height: 260px; }
.adventurer { min-height: 360px; }
.sun { position: absolute; width: 126px; height: 126px; border-radius: 50%; background: #ffd777; right: 18px; top: 26px; box-shadow: 0 0 54px rgba(255, 215, 119, 0.7); }
.character { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -36%); width: 150px; height: 190px; }
.hat { position: absolute; left: 25px; top: 0; width: 110px; height: 42px; background: #805735; border-radius: 50% 50% 12px 12px; transform: rotate(-5deg); }
.hat::after { content: ''; position: absolute; left: -20px; bottom: -9px; width: 150px; height: 18px; background: #6b482e; border-radius: 999px; }
.face { position: absolute; left: 30px; top: 45px; width: 90px; height: 78px; border-radius: 36px; background: #ffe1bd; display: grid; place-items: center; font-weight: 900; }
.body { position: absolute; left: 45px; top: 118px; width: 64px; height: 76px; background: var(--success); border-radius: 24px 24px 18px 18px; }
.ground { position: absolute; left: 20px; right: 20px; bottom: 18px; height: 44px; background: rgba(129, 178, 154, 0.2); border-radius: 50%; }
.mini-map { position: absolute; left: 20px; top: 60px; width: 130px; height: 94px; border-radius: 20px; transform: rotate(-8deg); background: #fff1cb; border: 3px solid #d79c51; display: grid; place-items: center; color: var(--primary); font-size: 2rem; }
.compass { display: grid; place-items: center; min-width: 190px; min-height: 200px; position: relative; }
.compass-ring { width: 160px; height: 160px; border: 13px solid var(--accent); border-radius: 50%; background: #fffaf2; display: grid; place-items: center; position: relative; box-shadow: inset 0 0 0 2px rgba(61,64,91,0.08); }
.needle { position: absolute; width: 20px; height: 106px; background: linear-gradient(to bottom, var(--primary) 0 50%, var(--success) 50% 100%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); transform: rotate(34deg); }
.compass-ring span { position: absolute; top: 10px; font-weight: 950; color: var(--primary-dark); }
.spark { position: absolute; color: var(--primary); font-size: 2rem; }
.spark-1 { right: 8%; top: 16%; }
.spark-2 { left: 8%; bottom: 12%; }
.treasure { width: 128px; height: 100px; position: relative; margin: 16px auto; }
.treasure-lid { position: absolute; left: 12px; top: 0; width: 104px; height: 48px; border-radius: 52px 52px 8px 8px; background: #8e5a31; border: 5px solid #5e3b24; }
.treasure-body { position: absolute; left: 8px; bottom: 0; width: 112px; height: 62px; border-radius: 14px; background: #c9793c; border: 5px solid #5e3b24; display: grid; place-items: center; color: #ffe48a; font-size: 1.6rem; }
.badge-illustration { width: 76px; height: 76px; display: grid; place-items: center; border-radius: 24px; background: #fff1d0; font-size: 2.35rem; flex: 0 0 auto; }
.locked-icon { background: #eee5d9; filter: grayscale(1); }
.complete { min-height: 190px; display: grid; place-items: center; }
.complete-spark { position: absolute; color: var(--primary); font-size: 2rem; }
.complete-spark.one { top: 20px; left: 18%; }
.complete-spark.two { top: 40px; right: 18%; }
.complete-spark.three { bottom: 25px; right: 30%; }
.hobby-map { position: relative; min-height: 140px; min-width: 290px; background: linear-gradient(135deg, #fff4d9, #eff9ee); border: 1px dashed rgba(61,64,91,0.2); border-radius: 28px; overflow: hidden; }
.route-dot { position: absolute; width: 52px; height: 52px; display: grid; place-items: center; background: white; border-radius: 18px; box-shadow: var(--shadow); }
.route-dot.start { left: 24px; bottom: 22px; }
.route-dot.middle { left: 50%; top: 20px; transform: translateX(-50%); }
.route-dot.end { right: 24px; bottom: 22px; }
.route-line { position: absolute; left: 70px; bottom: 54px; width: 32%; border-top: 4px dashed rgba(129,178,154,0.7); transform: rotate(-20deg); }
.route-line.second { left: 55%; transform: rotate(20deg); }

/* Common UI */
.progress-wrap { display: grid; gap: 8px; }
.progress-wrap.compact { gap: 5px; }
.progress-label { display: flex; justify-content: space-between; font-weight: 900; color: var(--secondary); }
.progress-track { width: 100%; height: 16px; border-radius: 999px; background: #efe4cf; overflow: hidden; box-shadow: inset 0 1px 2px rgba(61,64,91,0.08); }
.progress-wrap.compact .progress-track { height: 11px; }
.progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--accent), var(--primary)); transition: width 0.25s ease; }
.card-topline { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.soft-pill, .title-badge-large, .trait-badge, .score-badge { display: inline-flex; align-items: center; border-radius: 999px; font-weight: 900; }
.soft-pill { padding: 7px 11px; background: #fff0d2; color: #8a572e; font-size: 0.85rem; }
.muted-pill { background: #eee7dc; color: var(--muted); }
.trait-row { display: flex; flex-wrap: wrap; gap: 8px; }
.trait-badge { padding: 7px 10px; background: #edf6ee; color: #2f755f; font-size: 0.84rem; }
.score-badge { padding: 8px 12px; background: var(--secondary); color: white; font-size: 0.86rem; }
.info-chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.info-chip-row span { display: inline-flex; padding: 7px 10px; border-radius: 999px; background: #f8ead7; color: #6b5542; font-size: 0.83rem; font-weight: 800; }

/* Survey */
.question-card { max-width: 860px; margin: 0 auto; padding: 42px; }
.choice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 28px; }
.choice-card { text-align: left; min-height: 92px; border: 1px solid var(--border); background: #fffaf2; color: var(--text); border-radius: 20px; padding: 20px; font-weight: 900; box-shadow: 0 8px 22px rgba(61,64,91,0.06); transition: transform 0.16s ease, border-color 0.16s ease, background 0.16s ease; }
.choice-card:hover, .choice-card.selected { border-color: var(--primary); background: #fff2df; transform: translateY(-2px); }
.choice-card.small { min-height: auto; font-size: 0.9rem; padding: 12px 14px; }

/* Recommendation */
.result-hero, .map-section, .add-hero { padding: 34px 38px; display: flex; justify-content: space-between; align-items: center; gap: 26px; }
.result-hero p, .add-hero p, .map-section p { max-width: 660px; color: var(--muted); }
.recommendation-board { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-top: 22px; }
.recommendation-group { padding: 22px; background: rgba(255,253,247,0.72); }
.recommendation-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.recommendation-card { padding: 22px; display: flex; flex-direction: column; gap: 12px; min-height: 520px; transition: transform 0.16s ease, box-shadow 0.16s ease; }
.recommendation-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }
.review-bubble { position: relative; padding: 14px; background: #eff8f2; border-radius: 18px; color: #315947; font-weight: 760; line-height: 1.5; }
.reason-panel { background: #fff4df; border: 1px solid var(--border); border-radius: 18px; padding: 14px; }
.reason-panel span { color: var(--primary-dark); font-size: 0.8rem; font-weight: 950; }
.reason-panel p { margin-bottom: 0; font-weight: 760; }

/* Dashboard */
.dashboard-layout { display: grid; grid-template-columns: 330px minmax(0, 1fr); gap: 24px; align-items: start; }
.dashboard-sidebar { position: sticky; top: 84px; display: grid; gap: 16px; }
.dashboard-main { display: grid; gap: 18px; }
.profile-side-card { padding: 26px; }
.profile-side-card h2 { font-size: 2rem; }
.title-badge-large { padding: 10px 14px; background: linear-gradient(135deg, var(--secondary), #545778); color: white; font-size: 1rem; margin-bottom: 14px; }
.profile-label { margin: 20px 0 8px; font-weight: 900; color: var(--secondary); }
.title-progress-card { padding: 24px; display: grid; gap: 16px; }
.title-progress-copy h2 { margin-bottom: 4px; }
.mini-stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0; }
.mini-stat-grid.wide { max-width: 520px; }
.mini-stat-grid div { background: #fff5e6; border: 1px solid var(--border); border-radius: 18px; padding: 16px; display: grid; gap: 2px; }
.mini-stat-grid strong { font-size: 1.55rem; color: var(--secondary); }
.mini-stat-grid span { color: var(--muted); font-weight: 850; }
.map-section { min-height: 230px; }
.active-section { padding: 24px; }
.section-title-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.active-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.active-hobby-card { text-align: left; border: 1px solid var(--border); color: var(--text); display: flex; gap: 16px; padding: 18px; width: 100%; background: var(--surface); transition: transform 0.16s ease, box-shadow 0.16s ease; }
.active-hobby-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }
.quest-icon { width: 54px; height: 54px; border-radius: 18px; display: grid; place-items: center; background: #fff0d2; flex: 0 0 auto; font-size: 1.5rem; }
.active-card-body { min-width: 0; flex: 1; }
.empty-card, .empty-state-panel { padding: 34px; text-align: center; }
.empty-state-panel { background: #fff9ef; border: 1px dashed var(--border); border-radius: 24px; }
.empty-state-panel .hobby-map { margin: 0 auto 20px; }

/* Detail */
.detail-top-card { padding: 34px; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr); gap: 24px; align-items: end; margin-bottom: 20px; }
.current-stage-card { background: #eff8f2; border: 1px solid rgba(129, 178, 154, 0.34); border-radius: 22px; padding: 22px; }
.detail-two-column { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 20px; align-items: start; }
.stage-list { display: grid; gap: 16px; }
.detail-sidebar { position: sticky; top: 84px; display: grid; gap: 16px; }
.next-mission-card { padding: 24px; text-align: center; }
.detail-info-panel { padding: 24px; background: var(--surface); }
.detail-info-panel ul { list-style: none; display: grid; gap: 10px; padding: 0; margin: 0 0 16px; }
.detail-info-panel li { display: flex; justify-content: space-between; gap: 16px; border-bottom: 1px solid rgba(61,64,91,0.08); padding-bottom: 8px; }
.detail-info-panel li span { text-align: right; color: var(--muted); font-weight: 800; }
.mission-stage { padding: 22px; transition: opacity 0.16s ease; }
.mission-stage.locked { opacity: 0.58; }
.stage-header { display: flex; justify-content: space-between; gap: 12px; }
.stage-header strong { font-size: 1.4rem; color: var(--primary-dark); }
.mission-list { display: grid; gap: 10px; margin-top: 18px; }
.mission-card { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; border: 1px solid var(--border); border-radius: 18px; padding: 14px; background: #fffaf4; }
.mission-card.done { background: #f0f8f3; }
.mission-card.disabled { filter: grayscale(0.25); }
.mission-card p { color: var(--muted); margin-bottom: 6px; }
.mission-card small { color: #98734e; font-weight: 850; }

/* Add/Search/Achievement */
.add-option-grid, .search-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 18px; }
.add-option { border: 1px solid var(--border); text-align: left; padding: 28px; color: var(--text); background: var(--surface); transition: transform 0.16s ease, box-shadow 0.16s ease; }
.add-option:hover, .search-result-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }
.add-option span { font-size: 2rem; }
.search-card { padding: 30px; margin-bottom: 18px; }
.search-result-card { padding: 20px; display: flex; flex-direction: column; gap: 12px; transition: transform 0.16s ease, box-shadow 0.16s ease; }
.achievement-hero { padding: 34px; display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 18px; }
.achievement-summary { padding: 26px; margin: 18px 0; }
.completed-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
.achievement-grid { margin-top: 12px; margin-bottom: 28px; display: grid; gap: 16px; }
.three-column-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.achievement-card { padding: 20px; display: flex; gap: 14px; align-items: center; min-height: 140px; }
.achievement-card p { color: var(--muted); margin-bottom: 6px; }
.locked-achievement { opacity: 0.58; filter: grayscale(0.35); }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 18px; background: rgba(45, 32, 20, 0.45); backdrop-filter: blur(8px); }
.modal-card { width: min(620px, 100%); max-height: 92vh; overflow: auto; background: var(--surface); border-radius: 28px; padding: 34px; box-shadow: 0 26px 80px rgba(0,0,0,0.22); }
.completion-modal { text-align: center; }
.achievement-toast { background: #fff0d2; color: #805024; border-radius: 18px; padding: 14px; font-weight: 950; margin: 16px 0; }
.reason-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 16px 0; }

@media (max-width: 1023px) {
  .screen, .app-header { width: min(100% - 32px, 920px); }
  .start-screen.desktop-hero-layout, .dashboard-layout, .detail-two-column { grid-template-columns: 1fr; }
  .dashboard-sidebar, .detail-sidebar { position: static; }
  .hero-card, .detail-top-card { grid-template-columns: 1fr; min-height: auto; }
  .recommendation-board { grid-template-columns: 1fr; }
  .three-column-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .map-section { flex-direction: column; align-items: stretch; }
}

@media (max-width: 767px) {
  .screen, .app-header { width: min(100% - 24px, 720px); }
  .app-header { padding: 12px 0; }
  h1 { font-size: 2.2rem; }
  .hero-card, .question-card, .detail-top-card, .result-hero, .map-section, .add-hero { padding: 24px; }
  .hero-feature-grid, .choice-grid, .active-grid, .add-option-grid, .search-grid, .three-column-grid { grid-template-columns: 1fr; }
  .result-hero, .add-hero, .achievement-hero { flex-direction: column; align-items: stretch; }
  .illustration.adventurer { min-height: 280px; }
  .hobby-map { min-width: unset; }
  .mission-card { grid-template-columns: 1fr; }
  .reason-grid { grid-template-columns: 1fr; }
  .button-row, .button-row.end { align-items: stretch; justify-content: stretch; }
  .button-row button { flex: 1; }
  .detail-info-panel li { flex-direction: column; gap: 4px; }
}

```

## `src/data/questions.js`

```js
export const traitLabels = {
  activity: '활동성',
  creativity: '창의성',
  social: '사교성',
  challenge: '도전성',
  focus: '몰입성',
  routine: '꾸준함',
  costSensitive: '실속형',
  outdoor: '야외 선호',
  indoor: '실내 선호',
  expression: '표현력'
};

export const defaultTraits = {
  activity: 0,
  creativity: 0,
  social: 0,
  challenge: 0,
  focus: 0,
  routine: 0,
  costSensitive: 0,
  outdoor: 0,
  indoor: 0,
  expression: 0
};

export const surveyQuestions = [
  {
    id: 'q1',
    title: '쉬는 날에 더 끌리는 쪽은?',
    subtitle: '취미 지도 첫 갈림길입니다. 침대도 강력한 보스몹이긴 하죠.',
    options: [
      {
        optionId: 'active',
        label: '몸을 움직이는 활동이 좋아요',
        categoryEffects: { '구기 스포츠': 8, '피트니스': 8, '스포츠': 7, '격투 스포츠': 6, '댄스': 5 },
        traitEffects: { activity: 3, challenge: 1, outdoor: 1 },
        tagEffects: { '활동적': 4, '운동': 4, '도전': 2 }
      },
      {
        optionId: 'calm',
        label: '조용히 집중하면서 쉬고 싶어요',
        categoryEffects: { '공예': 8, '미술/드로잉': 8, '취미/생활': 6, '국악': 3, '악기': 3 },
        traitEffects: { focus: 3, indoor: 2, social: -1 },
        tagEffects: { '몰입': 4, '정적': 4, '실내': 2, '혼자': 2 }
      },
      {
        optionId: 'creative',
        label: '무언가 만들고 표현하고 싶어요',
        categoryEffects: { '미술/드로잉': 8, '사진/영상': 7, '공예': 8, '음악이론/보컬': 5, '요리/조리': 5 },
        traitEffects: { creativity: 3, expression: 2 },
        tagEffects: { '창작': 4, '결과물': 4, '표현': 3 }
      },
      {
        optionId: 'social',
        label: '사람들과 함께하는 활동이 좋아요',
        categoryEffects: { '구기 스포츠': 7, '댄스': 8, '연기/마술': 6, '계절 스포츠': 5, '요리/조리': 4 },
        traitEffects: { social: 3, activity: 1 },
        tagEffects: { '함께': 4, '커뮤니티': 3, '팀': 3 }
      }
    ]
  },
  {
    id: 'q2',
    title: '취미를 시작할 때 가장 중요한 조건은?',
    subtitle: '현실 조건 무시하면 취미가 아니라 고난의 행군입니다.',
    options: [
      {
        optionId: 'cheap',
        label: '비용 부담이 적었으면 좋겠어요',
        categoryEffects: { '취미/생활': 8, '미술/드로잉': 6, '공예': 6, '투자/N잡': 4, '기타 취미/자기계발': 4 },
        traitEffects: { costSensitive: 3 },
        tagEffects: { '실속형': 5, '실내': 1 }
      },
      {
        optionId: 'quick',
        label: '짧은 시간에도 할 수 있어야 해요',
        categoryEffects: { '피트니스': 7, '취미/생활': 7, '구기 스포츠': 5, '패션/미용': 5, '미술/드로잉': 4 },
        traitEffects: { routine: 1, focus: 1 },
        tagEffects: { '짧음': 5, '루틴': 3 }
      },
      {
        optionId: 'easy',
        label: '시작 방법이 쉬웠으면 좋겠어요',
        categoryEffects: { '요리/조리': 7, '공예': 6, '취미/생활': 7, '피트니스': 5, '패션/미용': 4 },
        traitEffects: { challenge: -1, indoor: 1 },
        tagEffects: { '쉬움': 5, '실내': 2 }
      },
      {
        optionId: 'growth',
        label: '실력이 느는 게 보여야 해요',
        categoryEffects: { '악기': 8, '구기 스포츠': 7, '피트니스': 6, '격투 스포츠': 5, '댄스': 5 },
        traitEffects: { routine: 3, challenge: 2 },
        tagEffects: { '성장감': 5, '도전': 3, '연습': 3 }
      }
    ]
  },
  {
    id: 'q3',
    title: '혼자 하는 취미와 함께 하는 취미 중 어디에 가까워요?',
    subtitle: '파티 플레이냐 솔로 랭크냐, 중요한 문제입니다.',
    options: [
      {
        optionId: 'alone',
        label: '혼자 몰입하는 게 편해요',
        categoryEffects: { '공예': 8, '미술/드로잉': 7, '취미/생활': 7, '사진/영상': 5, '악기': 5 },
        traitEffects: { focus: 3, social: -1 },
        tagEffects: { '혼자': 5, '몰입': 4, '정적': 2 }
      },
      {
        optionId: 'together',
        label: '누군가와 같이 해야 더 재밌어요',
        categoryEffects: { '구기 스포츠': 8, '댄스': 7, '연기/마술': 6, '계절 스포츠': 5, '요리/조리': 4 },
        traitEffects: { social: 3 },
        tagEffects: { '함께': 5, '커뮤니티': 3, '팀': 3 }
      },
      {
        optionId: 'both',
        label: '혼자 시작해도 같이 즐길 수 있으면 좋아요',
        categoryEffects: { '사진/영상': 6, '요리/조리': 6, '피트니스': 5, '음악이론/보컬': 5, '패션/미용': 4 },
        traitEffects: { social: 1, focus: 1 },
        tagEffects: { '혼자': 2, '함께': 2, '성장감': 1 }
      }
    ]
  },
  {
    id: 'q4',
    title: '취미 결과물이 남는 걸 좋아하나요?',
    subtitle: '기록파인지 경험파인지 확인하는 구간입니다.',
    options: [
      {
        optionId: 'result',
        label: '네, 만든 결과물이 남으면 뿌듯해요',
        categoryEffects: { '공예': 8, '미술/드로잉': 8, '사진/영상': 7, '요리/조리': 6, '패션/미용': 4 },
        traitEffects: { creativity: 3, expression: 1 },
        tagEffects: { '결과물': 5, '창작': 4, '표현': 1 }
      },
      {
        optionId: 'experience',
        label: '결과물보다 경험 자체가 더 중요해요',
        categoryEffects: { '스포츠': 8, '계절 스포츠': 8, '구기 스포츠': 6, '피트니스': 5, '격투 스포츠': 5 },
        traitEffects: { activity: 2, challenge: 1 },
        tagEffects: { '경험': 5, '활동적': 3, '야외': 2 }
      },
      {
        optionId: 'record',
        label: '기록이나 성장 로그가 남으면 좋아요',
        categoryEffects: { '투자/N잡': 6, '취업 준비 컨설팅': 6, '피트니스': 6, '취미/생활': 5, '악기': 4 },
        traitEffects: { routine: 2, focus: 2 },
        tagEffects: { '기록': 4, '루틴': 4, '성장감': 2 }
      }
    ]
  },
  {
    id: 'q5',
    title: '실내와 야외 중 어디가 더 좋아요?',
    subtitle: '햇빛과 에어컨 사이의 운명적 선택.',
    options: [
      {
        optionId: 'indoor',
        label: '실내가 좋아요',
        categoryEffects: { '공예': 6, '악기': 6, '미술/드로잉': 6, '피트니스': 5, '요리/조리': 5, '취미/생활': 5 },
        traitEffects: { indoor: 3 },
        tagEffects: { '실내': 5 }
      },
      {
        optionId: 'outdoor',
        label: '야외에서 하는 게 좋아요',
        categoryEffects: { '스포츠': 8, '계절 스포츠': 8, '사진/영상': 5, '구기 스포츠': 5, '기타 취미/자기계발': 2 },
        traitEffects: { outdoor: 3, activity: 1 },
        tagEffects: { '야외': 5, '활동적': 2 }
      },
      {
        optionId: 'access',
        label: '장소보다 접근성이 중요해요',
        categoryEffects: { '구기 스포츠': 5, '피트니스': 5, '사진/영상': 4, '취미/생활': 6, '공예': 4 },
        traitEffects: { costSensitive: 1, routine: 1 },
        tagEffects: { '실속형': 2, '루틴': 2, '짧음': 2 }
      }
    ]
  },
  {
    id: 'q6',
    title: '취미에서 원하는 감정은?',
    subtitle: '이거 은근 핵심입니다. 취미의 맛을 고르는 느낌.',
    options: [
      {
        optionId: 'stress',
        label: '스트레스가 확 풀렸으면 좋겠어요',
        categoryEffects: { '격투 스포츠': 8, '피트니스': 7, '구기 스포츠': 6, '댄스': 5, '스포츠': 5 },
        traitEffects: { activity: 2, challenge: 1 },
        tagEffects: { '활동적': 4, '도전': 3, '운동': 3 }
      },
      {
        optionId: 'heal',
        label: '마음이 차분해졌으면 좋겠어요',
        categoryEffects: { '공예': 8, '취미/생활': 8, '국악': 5, '미술/드로잉': 6, '피트니스': 4 },
        traitEffects: { focus: 3, routine: 1 },
        tagEffects: { '정적': 4, '몰입': 4, '루틴': 1 }
      },
      {
        optionId: 'proud',
        label: '내가 성장했다는 느낌이 좋아요',
        categoryEffects: { '악기': 8, '피트니스': 7, '구기 스포츠': 6, '취업 준비 컨설팅': 6, '댄스': 4 },
        traitEffects: { routine: 3, challenge: 2 },
        tagEffects: { '성장감': 5, '루틴': 3, '도전': 2 }
      },
      {
        optionId: 'express',
        label: '나를 표현하고 싶어요',
        categoryEffects: { '댄스': 8, '음악이론/보컬': 8, '연기/마술': 8, '패션/미용': 6, '사진/영상': 5 },
        traitEffects: { expression: 3, creativity: 2 },
        tagEffects: { '표현': 5, '창작': 3, '함께': 1 }
      }
    ]
  },
  {
    id: 'q7',
    title: '새로운 걸 배울 때 나는 보통?',
    subtitle: '고난이도 보스전에 강한 타입인지 봅니다.',
    options: [
      {
        optionId: 'challenge',
        label: '어려워도 도전하는 게 재밌어요',
        categoryEffects: { '격투 스포츠': 8, '계절 스포츠': 7, '스포츠': 6, '악기': 5, '구기 스포츠': 5 },
        traitEffects: { challenge: 3, routine: 1 },
        tagEffects: { '도전': 5, '난이도': 3, '성장감': 2 }
      },
      {
        optionId: 'safe',
        label: '쉬운 것부터 천천히 시작하고 싶어요',
        categoryEffects: { '취미/생활': 8, '공예': 7, '요리/조리': 6, '미술/드로잉': 6, '패션/미용': 4 },
        traitEffects: { challenge: -1, routine: 1 },
        tagEffects: { '쉬움': 5, '실내': 2 }
      },
      {
        optionId: 'guide',
        label: '누가 옆에서 알려주면 잘 따라가요',
        categoryEffects: { '피트니스': 6, '댄스': 6, '구기 스포츠': 6, '취업 준비 컨설팅': 6, '음악이론/보컬': 4 },
        traitEffects: { social: 2, routine: 1 },
        tagEffects: { '함께': 3, '성장감': 3, '커뮤니티': 2 }
      }
    ]
  },
  {
    id: 'q8',
    title: '관심 있는 분위기에 가까운 것은?',
    subtitle: '이제 카테고리를 꽤 좁혀봅니다. 추천 나침반 열일 중.',
    options: [
      {
        optionId: 'art',
        label: '그림, 디자인, 만들기 같은 창작 분위기',
        categoryEffects: { '미술/드로잉': 9, '공예': 9, '사진/영상': 5, '패션/미용': 3 },
        traitEffects: { creativity: 3, focus: 1 },
        tagEffects: { '창작': 5, '결과물': 4, '몰입': 1 }
      },
      {
        optionId: 'music',
        label: '음악, 노래, 연주 같은 표현 분위기',
        categoryEffects: { '악기': 9, '음악이론/보컬': 9, '국악': 7, '연기/마술': 3 },
        traitEffects: { expression: 3, routine: 1 },
        tagEffects: { '표현': 5, '몰입': 2, '성장감': 2 }
      },
      {
        optionId: 'sport',
        label: '운동, 승부, 체력 같은 활동 분위기',
        categoryEffects: { '구기 스포츠': 9, '피트니스': 8, '스포츠': 8, '격투 스포츠': 7, '댄스': 4 },
        traitEffects: { activity: 3, challenge: 1 },
        tagEffects: { '활동적': 5, '경쟁': 4, '운동': 3 }
      },
      {
        optionId: 'life',
        label: '생활, 자기관리, 실용적인 성장 분위기',
        categoryEffects: { '취미/생활': 8, '요리/조리': 7, '패션/미용': 6, '투자/N잡': 6, '취업 준비 컨설팅': 6 },
        traitEffects: { routine: 2, costSensitive: 1 },
        tagEffects: { '루틴': 4, '실속형': 3, '기록': 2 }
      }
    ]
  },
  {
    id: 'q9',
    title: '취미에 쓸 수 있는 시간은 어느 정도인가요?',
    subtitle: '욕심은 취미 마스터, 현실은 과제 제출 23:59일 수 있으니까요.',
    options: [
      {
        optionId: 'short',
        label: '하루 10~30분 정도',
        categoryEffects: { '취미/생활': 8, '피트니스': 6, '미술/드로잉': 5, '악기': 5, '패션/미용': 4 },
        traitEffects: { routine: 1, focus: 1 },
        tagEffects: { '짧음': 5, '루틴': 3 }
      },
      {
        optionId: 'medium',
        label: '주 1~2회, 1시간 정도',
        categoryEffects: { '구기 스포츠': 6, '공예': 6, '요리/조리': 6, '댄스': 6, '사진/영상': 5 },
        traitEffects: { routine: 2 },
        tagEffects: { '성장감': 3, '함께': 1 }
      },
      {
        optionId: 'long',
        label: '반나절 정도 투자해도 좋아요',
        categoryEffects: { '계절 스포츠': 8, '스포츠': 8, '사진/영상': 5, '요리/조리': 4, '격투 스포츠': 4 },
        traitEffects: { challenge: 2, outdoor: 1 },
        tagEffects: { '경험': 5, '야외': 3, '도전': 2 }
      }
    ]
  },
  {
    id: 'q10',
    title: '마지막으로, 지금 가장 끌리는 한 문장은?',
    subtitle: '나침반 최종 보정입니다. 삐빅, 취미 후보 탐색 중.',
    options: [
      {
        optionId: 'move',
        label: '몸을 움직이며 기분 전환하고 싶다',
        categoryEffects: { '피트니스': 8, '구기 스포츠': 8, '댄스': 6, '격투 스포츠': 6, '스포츠': 5 },
        traitEffects: { activity: 3 },
        tagEffects: { '활동적': 5, '운동': 3 }
      },
      {
        optionId: 'make',
        label: '내 손으로 뭔가를 완성하고 싶다',
        categoryEffects: { '공예': 8, '요리/조리': 8, '미술/드로잉': 8, '사진/영상': 4 },
        traitEffects: { creativity: 3, focus: 1 },
        tagEffects: { '결과물': 5, '창작': 4 }
      },
      {
        optionId: 'express',
        label: '사람들 앞에서 나를 표현해보고 싶다',
        categoryEffects: { '음악이론/보컬': 8, '댄스': 8, '연기/마술': 8, '패션/미용': 5 },
        traitEffects: { expression: 3, social: 1 },
        tagEffects: { '표현': 5, '함께': 2 }
      },
      {
        optionId: 'grow',
        label: '꾸준히 쌓이는 취미 루틴을 만들고 싶다',
        categoryEffects: { '악기': 6, '피트니스': 6, '취미/생활': 6, '투자/N잡': 5, '취업 준비 컨설팅': 5 },
        traitEffects: { routine: 3, focus: 1 },
        tagEffects: { '루틴': 5, '성장감': 4, '기록': 2 }
      }
    ]
  }
];

```

## `src/utils/storage.js`

```js
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
      activeHobbies: parsed.activeHobbies || [],
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

```

## `src/utils/recommendation.js`

```js
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

```

## `src/screens/StartAndInfoScreen.jsx`

```jsx
import { useState } from 'react';
import { AdventurerIllustration, CompassIllustration } from '../components/Illustrations.jsx';

export default function StartAndInfoScreen({ hasSavedAdventure, onPrepareNewAdventure, onContinue, onStart }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', gender: '', age: '', location: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startNew = () => {
    onPrepareNewAdventure();
    setForm({ name: '', gender: '', age: '', location: '' });
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.age.trim() || !form.location.trim()) return;
    onStart(form);
  };

  return (
    <main className="screen start-screen desktop-hero-layout">
      <section className="hero-card card">
        <div className="hero-copy">
          <span className="eyebrow">Hobby Quest Beta</span>
          <h1>당신의 취미 지도를 펼쳐볼 시간이에요.</h1>
          <p>
            짧은 질문에 답하면 지금 시작하기 좋은 취미를 추천해드려요.
            추천받은 취미는 퀘스트처럼 진행하고, 업적도 모을 수 있어요.
          </p>
          <div className="hero-feature-grid">
            <div><strong>10문항</strong><span>가벼운 취향 분석</span></div>
            <div><strong>4개</strong><span>맞춤 취미 추천</span></div>
            <div><strong>5단계</strong><span>취미별 성장 미션</span></div>
          </div>
          <p className="hero-note">복잡한 알고리즘은 뒤에서 일하고, 사용자는 모험만 하면 됩니다. 알고리즘도 월급값 해야죠.</p>
        </div>
        <AdventurerIllustration />
      </section>

      <aside className="start-side-panel">
        <section className="card start-choice-card">
          <CompassIllustration />
          <span className="eyebrow">시작 선택</span>
          <h2>어떤 모험을 시작할까요?</h2>
          <p className="muted">앱에 들어왔다고 이전 정보가 자동으로 복원되지 않습니다. 아래에서 직접 선택해주세요.</p>
          <div className="start-action-stack">
            <button className="primary-button full" type="button" onClick={startNew}>새 모험 시작하기</button>
            {hasSavedAdventure ? (
              <button className="secondary-button full" type="button" onClick={onContinue}>이전 모험 이어하기</button>
            ) : (
              <button className="secondary-button full" type="button" disabled>저장된 모험 없음</button>
            )}
          </div>
        </section>

        {showForm && (
          <form className="card info-form" onSubmit={handleSubmit}>
            <span className="eyebrow">모험가 등록</span>
            <h2>기본 정보 입력</h2>
            <label>
              이름
              <input name="name" value={form.name} onChange={handleChange} placeholder="예: 승민" />
            </label>
            <label>
              성별
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">선택 안 함</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
                <option value="기타">기타</option>
              </select>
            </label>
            <label>
              나이
              <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="예: 23" min="1" />
            </label>
            <label>
              거주지
              <input name="location" value={form.location} onChange={handleChange} placeholder="예: 서울" />
            </label>
            <button className="primary-button full" type="submit">취향 질문 시작하기</button>
          </form>
        )}
      </aside>
    </main>
  );
}

```

## `src/screens/SurveyScreen.jsx`

```jsx
import { useState } from 'react';
import { surveyQuestions } from '../data/questions.js';
import ProgressBar from '../components/ProgressBar.jsx';

export default function SurveyScreen({ onComplete, onBack }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const question = surveyQuestions[index];
  const progress = Math.round((index / surveyQuestions.length) * 100);

  const selectOption = (option) => {
    const nextAnswers = [
      ...answers,
      {
        questionId: question.id,
        selectedOptionId: option.optionId,
        label: option.label,
        categoryEffects: option.categoryEffects,
        traitEffects: option.traitEffects,
        tagEffects: option.tagEffects
      }
    ];
    if (index + 1 >= surveyQuestions.length) {
      onComplete(nextAnswers);
      return;
    }
    setAnswers(nextAnswers);
    setIndex(index + 1);
  };

  const goPrev = () => {
    if (index === 0) {
      onBack?.();
      return;
    }
    setAnswers((prev) => prev.slice(0, -1));
    setIndex((prev) => prev - 1);
  };

  return (
    <main className="screen survey-screen">
      <section className="card question-card">
        <div className="card-topline">
          <span className="eyebrow">취향 질문 {index + 1}/{surveyQuestions.length}</span>
          <button className="ghost-button" onClick={goPrev}>이전</button>
        </div>
        <ProgressBar value={progress} compact />
        <h1>{question.title}</h1>
        <p className="muted">{question.subtitle}</p>
        <div className="choice-grid">
          {question.options.map((option) => (
            <button key={option.optionId} className="choice-card" onClick={() => selectOption(option)}>
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

```

## `src/screens/RecommendationScreen.jsx`

```jsx
import RecommendationCard from '../components/RecommendationCard.jsx';
import { CompassIllustration } from '../components/Illustrations.jsx';

export default function RecommendationScreen({ recommendations, onSelect, onRetake, onHome }) {
  const groups = recommendations?.groups || [];

  return (
    <main className="screen recommendation-screen">
      <section className="card result-hero">
        <div>
          <span className="eyebrow">추천 결과</span>
          <h1>취미 지도에서 새로운 길을 발견했어요.</h1>
          <p>답변을 바탕으로 어울리는 취미 경로를 찾았어요. 점수는 55~95점 사이에서 상대적으로 계산됩니다.</p>
        </div>
        <CompassIllustration />
      </section>

      <section className="recommendation-board">
        {groups.map((group) => (
          <div key={group.category} className="recommendation-group card flat-card">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">추천 카테고리</span>
                <h2>{group.category}</h2>
              </div>
            </div>
            <div className="recommendation-grid">
              {group.items.map((item) => <RecommendationCard key={item.hobby.id} item={item} onSelect={onSelect} />)}
            </div>
          </div>
        ))}
      </section>

      <div className="button-row center">
        <button className="secondary-button" onClick={onRetake}>다시 추천받기</button>
        <button className="ghost-button" onClick={onHome}>홈으로 가기</button>
      </div>
    </main>
  );
}

```

## `src/screens/HomeScreen.jsx`

```jsx
import UserProfileCard from '../components/UserProfileCard.jsx';
import ActiveHobbyCard from '../components/ActiveHobbyCard.jsx';
import { HobbyMapIllustration } from '../components/Illustrations.jsx';

export default function HomeScreen({ profile, stats, activeHobbies, onOpenHobby, onAddHobby, onAchievements }) {
  return (
    <main className="screen home-screen dashboard-layout">
      <UserProfileCard profile={profile} stats={stats} onAchievements={onAchievements} onAddHobby={onAddHobby} />

      <div className="dashboard-main">
        <section className="card map-section">
          <div>
            <span className="eyebrow">오늘의 취미 지도</span>
            <h1>오늘의 다음 미션을 확인해볼까요?</h1>
            <p className="muted">진행 중인 취미를 클릭하면 단계별 하위 미션과 현재 단계를 볼 수 있어요.</p>
          </div>
          <HobbyMapIllustration />
        </section>

        <section className="active-section card">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">진행 중인 퀘스트</span>
              <h2>진행 중인 취미</h2>
            </div>
            <button className="secondary-button" onClick={onAddHobby}>새로운 취미 시작하기</button>
          </div>
          {activeHobbies.length ? (
            <div className="active-grid">
              {activeHobbies.map((item) => <ActiveHobbyCard key={item.instanceId} activeHobby={item} onOpen={onOpenHobby} />)}
            </div>
          ) : (
            <div className="empty-state-panel">
              <HobbyMapIllustration />
              <h3>아직 진행 중인 취미가 없어요.</h3>
              <p>새로운 취미를 추가해볼까요? 추천 나침반이 심심해하고 있습니다.</p>
              <button className="primary-button" onClick={onAddHobby}>취미 추가하기</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

```

## `src/screens/HobbyDetailScreen.jsx`

```jsx
import { hobbyMap } from '../data/hobbies.js';
import { getHobbyProgress } from '../utils/progress.js';
import ProgressBar from '../components/ProgressBar.jsx';
import MissionStageCard from '../components/MissionStageCard.jsx';
import { TreasureChestIllustration } from '../components/Illustrations.jsx';

export default function HobbyDetailScreen({ activeHobby, onBack, onCompleteMission, onRemove }) {
  const hobby = hobbyMap[activeHobby?.hobbyId];
  if (!hobby || !activeHobby) {
    return (
      <main className="screen">
        <section className="card empty-card"><p>취미 정보를 찾을 수 없어요.</p><button className="primary-button" onClick={onBack}>돌아가기</button></section>
      </main>
    );
  }

  const progress = getHobbyProgress(activeHobby);
  const completedIds = activeHobby.completedMissionIds || [];

  return (
    <main className="screen detail-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>

      <section className="card detail-top-card">
        <div>
          <span className="soft-pill">{hobby.category}</span>
          <h1>{hobby.name}</h1>
          <p>{hobby.description}</p>
          <ProgressBar value={progress.overall} label="전체 진행도" />
        </div>
        <div className="current-stage-card">
          <span className="eyebrow">현재 단계</span>
          <h2>{progress.currentStage?.title || '완료 준비 중'}</h2>
          <p className="muted">{progress.currentStage?.description || '모든 미션을 완료했어요.'}</p>
        </div>
      </section>

      <section className="detail-two-column">
        <div className="stage-list">
          {hobby.missionStages.map((stage) => (
            <MissionStageCard
              key={stage.id}
              stage={stage}
              status={progress.stageProgress[stage.id]}
              completedIds={completedIds}
              onComplete={(mission) => onCompleteMission(activeHobby.instanceId, mission.id)}
            />
          ))}
        </div>

        <aside className="detail-sidebar">
          <section className="card next-mission-card">
            <TreasureChestIllustration />
            <span className="eyebrow">오늘의 다음 미션</span>
            <h2>{progress.nextMission?.title || '모든 미션 완료!'}</h2>
            <p className="muted">{progress.nextMission?.description || '완료 모달에서 새로운 업적을 확인해보세요.'}</p>
          </section>

          <section className="card detail-info-panel">
            <span className="eyebrow">취미 기본정보</span>
            <h2>시작 전 체크</h2>
            <ul>
              <li><strong>예상 비용</strong><span>{hobby.estimatedCost}</span></li>
              <li><strong>필요한 시간</strong><span>{hobby.timeLevel}</span></li>
              <li><strong>난이도</strong><span>{hobby.difficulty}</span></li>
              <li><strong>장소</strong><span>{hobby.placeType}</span></li>
              <li><strong>방식</strong><span>{hobby.socialType}</span></li>
            </ul>
            <p className="muted">준비물: {hobby.requiredItems.join(', ')}</p>
            <p className="muted">시작 방법: {hobby.startTip}</p>
            <button className="danger-button full" onClick={() => onRemove(activeHobby.instanceId)}>취미 제거하기</button>
          </section>
        </aside>
      </section>
    </main>
  );
}

```

## `src/screens/AchievementScreen.jsx`

```jsx
import { hobbyMap } from '../data/hobbies.js';
import { baseAchievements } from '../utils/progress.js';
import AchievementCard from '../components/AchievementCard.jsx';
import TitleProgressCard from '../components/TitleProgressCard.jsx';
import TraitSummary from '../components/TraitSummary.jsx';
import { AchievementBadgeIllustration } from '../components/Illustrations.jsx';

export default function AchievementScreen({ profile, achievements, completedHobbies, onBack }) {
  const earnedIds = new Set((achievements || []).map((item) => item.id));
  const lockedBase = baseAchievements.filter((achievement) => !earnedIds.has(achievement.id));
  const completedHobbyList = (completedHobbies || []).map((item) => hobbyMap[item.hobbyId]).filter(Boolean);

  return (
    <main className="screen achievement-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>

      <section className="card achievement-hero">
        <div>
          <span className="eyebrow">모험 기록</span>
          <h1>{profile?.currentTitle || '홈프로텍터'}</h1>
          <p className="muted">{profile?.currentDescription || '첫 취미 모험을 준비 중입니다.'}</p>
          <TraitSummary traits={profile?.topTraits || []} />
        </div>
        <AchievementBadgeIllustration />
      </section>

      <TitleProgressCard profile={profile} />

      <section className="card achievement-summary">
        <div className="mini-stat-grid wide">
          <div><strong>{completedHobbyList.length}</strong><span>완료한 취미</span></div>
          <div><strong>{achievements.length}</strong><span>수집한 업적</span></div>
        </div>
        <h2>수집한 취미 목록</h2>
        {completedHobbyList.length ? (
          <div className="completed-list">
            {completedHobbyList.map((hobby) => <span key={hobby.id} className="soft-pill">{hobby.name}</span>)}
          </div>
        ) : <p className="muted">아직 완료한 취미가 없어요. 첫 완주를 향해 가봅시다.</p>}
      </section>

      <section>
        <h2>달성한 업적</h2>
        <div className="achievement-grid three-column-grid">
          {achievements.length ? achievements.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} />) : <div className="empty-card card">업적이 아직 비어 있어요.</div>}
        </div>
      </section>

      <section>
        <h2>잠긴 업적</h2>
        <div className="achievement-grid three-column-grid">
          {lockedBase.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} locked />)}
        </div>
      </section>
    </main>
  );
}

```

## `src/components/UserProfileCard.jsx`

```jsx
import TitleProgressCard from './TitleProgressCard.jsx';
import TraitSummary from './TraitSummary.jsx';

export default function UserProfileCard({ profile, stats, onAchievements, onAddHobby }) {
  const hint = profile?.needScore
    ? `미션을 ${Math.max(1, Math.ceil(profile.needScore / 15))}개 정도 더 완료하면 다음 칭호에 가까워져요.`
    : '이미 취미 세계관 최강자예요.';

  return (
    <aside className="dashboard-sidebar">
      <section className="card profile-side-card">
        <span className="eyebrow">모험가 프로필</span>
        <h2>{profile?.name || '모험가'}님</h2>
        <div className="title-badge-large">{profile?.currentTitle || '홈프로텍터'}</div>
        <p className="muted">{profile?.currentDescription || '첫 취미 모험을 준비 중입니다.'}</p>
        <p className="profile-label">대표 성향</p>
        <TraitSummary traits={profile?.topTraits || []} />
        <div className="mini-stat-grid">
          <div><strong>{stats?.achievementCount || 0}</strong><span>업적</span></div>
          <div><strong>{stats?.completedHobbyCount || 0}</strong><span>완료 취미</span></div>
        </div>
        <div className="button-column">
          <button className="primary-button full" onClick={onAddHobby}>취미 추가하기</button>
          <button className="secondary-button full" onClick={onAchievements}>업적보기</button>
        </div>
      </section>
      <TitleProgressCard profile={profile} hint={hint} />
    </aside>
  );
}

```

## `src/components/TitleProgressCard.jsx`

```jsx
import ProgressBar from './ProgressBar.jsx';

export default function TitleProgressCard({ profile, hint }) {
  return (
    <section className="title-progress-card card">
      <div className="title-progress-copy">
        <span className="eyebrow">다음 칭호까지</span>
        <h2>{profile?.nextTitle || '초보 모험가'}</h2>
        <p className="muted">{hint || '미션을 완료하면 다음 칭호에 가까워져요.'}</p>
      </div>
      <ProgressBar value={profile?.titleProgressPercent || 0} label="진행률" />
    </section>
  );
}

```

## `src/components/RecommendationCard.jsx`

```jsx
import TraitBadge from './TraitBadge.jsx';

export default function RecommendationCard({ item, onSelect }) {
  const { hobby, score, matchedTraits = [], recommendationReason } = item;
  return (
    <article className="recommendation-card card">
      <div className="card-topline">
        <span className="score-badge">추천 점수 {score}점</span>
        <span className="soft-pill">{hobby.category}</span>
      </div>
      <h3>{hobby.name}</h3>
      <p className="muted">{hobby.description}</p>
      <div className="review-bubble">“{hobby.experienceReview}”</div>
      <div className="reason-panel">
        <span>추천 이유</span>
        <p>{recommendationReason || hobby.recommendedReasonText}</p>
      </div>
      <div className="info-chip-row">
        <span>{hobby.estimatedCost}</span>
        <span>{hobby.timeLevel}</span>
        <span>{hobby.difficulty}</span>
        <span>{hobby.placeType}</span>
        <span>{hobby.socialType}</span>
      </div>
      <div className="trait-row">
        {(matchedTraits.length ? matchedTraits : hobby.tags.slice(0, 2)).map((trait) => <TraitBadge key={trait} label={trait} />)}
      </div>
      <button className="primary-button full push-bottom" onClick={() => onSelect(hobby)}>이 취미 퀘스트 시작하기</button>
    </article>
  );
}

```

