import UserProfileCard from '../components/UserProfileCard.jsx';
import ActiveHobbyCard from '../components/ActiveHobbyCard.jsx';
import { HobbyMapIllustration, TreasureChestIllustration } from '../components/Illustrations.jsx';
import { hobbyMap } from '../data/hobbies.js';
import { getHobbyProgress } from '../utils/progress.js';

export default function HomeScreen({ profile, stats, userTraits, activeHobbies, completedHobbies, onOpenHobby, onAddHobby, onAchievements, onCompletedQuests }) {
  const completedList = (completedHobbies || [])
    .map((item) => ({ record: item, hobby: hobbyMap[item.hobbyId] }))
    .filter((item) => item.hobby)
    .sort((a, b) => new Date(b.record.completedAt || 0) - new Date(a.record.completedAt || 0));
  const recentCompleted = completedList.slice(0, 3);
  const firstActiveHobby = activeHobbies?.find((item) => hobbyMap[item.hobbyId]);
  const firstActionHobby = firstActiveHobby ? hobbyMap[firstActiveHobby.hobbyId] : null;
  const firstActionProgress = firstActiveHobby ? getHobbyProgress(firstActiveHobby) : null;
  const firstActionTitle = firstActionProgress?.nextMission?.title || '나에게 맞는 퀘스트 찾기';
  const firstActionMeta = firstActionHobby
    ? `${firstActionHobby.category} · ${firstActionProgress?.currentStage?.title || '다음 단계'}`
    : '새로운 퀘스트';
  const firstActionDescription = firstActionHobby
    ? `${firstActionHobby.name}에서 바로 이어서 시작해보세요.`
    : '아직 열린 퀘스트가 없다면 오늘 시작할 수 있는 작은 길부터 찾아보세요.';
  const handleFirstAction = () => {
    if (firstActiveHobby) {
      onOpenHobby(firstActiveHobby.instanceId);
      return;
    }
    onAddHobby();
  };

  return (
    <main className="screen home-screen dashboard-layout">
      <UserProfileCard profile={profile} stats={stats} userTraits={userTraits} onAchievements={onAchievements} />

      <div className="dashboard-main">
        <section className="card completed-overview-section">
          <div className="today-first-action">
            <span className="eyebrow">오늘의 첫 행동</span>
            <h1>{firstActionTitle}</h1>
            <p>{firstActionDescription}</p>
            <div className="today-action-footer">
              <span className="soft-pill">{firstActionMeta}</span>
              <button className="primary-button today-action-button" type="button" onClick={handleFirstAction}>
                지금 시작하기
              </button>
            </div>
          </div>
          <div className="completed-overview-panel">
            <div className="completed-count-tile">
              <div>
                <strong>{completedList.length}</strong>
                <span>완료 퀘스트</span>
              </div>
              <TreasureChestIllustration />
            </div>
            <button className="secondary-button full" type="button" onClick={onCompletedQuests}>
              완료 내역 보기
            </button>
            {recentCompleted.length ? (
              <div className="completed-mini-list">
                {recentCompleted.map(({ record, hobby }) => (
                  <button
                    key={record.instanceId}
                    className="completed-mini-item"
                    type="button"
                    onClick={onCompletedQuests}
                  >
                    <span>{hobby.name}</span>
                    <small>{hobby.category}</small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="completed-empty-mini">
                <span>첫 완료 기록을 기다리는 중</span>
              </div>
            )}
          </div>
        </section>

        <section className="active-section card">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">진행 중인 퀘스트</span>
              <h2>진행 중인 퀘스트</h2>
            </div>
            <button className="secondary-button" onClick={onAddHobby}>새로운 퀘스트 시작하기</button>
          </div>
          {activeHobbies.length ? (
            <div className="active-grid">
              {activeHobbies.map((item) => <ActiveHobbyCard key={item.instanceId} activeHobby={item} onOpen={onOpenHobby} />)}
            </div>
          ) : (
            <div className="empty-state-panel">
              <HobbyMapIllustration />
              <h3>아직 열린 길이 없어요.</h3>
              <p>첫 퀘스트를 시작하면 나를 알아가는 작은 실험이 시작됩니다.</p>
              <button className="primary-button" onClick={onAddHobby}>나에게 맞는 길 찾기</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
