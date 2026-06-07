import UserProfileCard from '../components/UserProfileCard.jsx';
import ActiveHobbyCard from '../components/ActiveHobbyCard.jsx';
import { HobbyMapIllustration, TreasureChestIllustration } from '../components/Illustrations.jsx';
import { hobbyMap } from '../data/hobbies.js';

export default function HomeScreen({ profile, stats, userTraits, activeHobbies, completedHobbies, onOpenHobby, onAddHobby, onAchievements, onCompletedQuests }) {
  const completedList = (completedHobbies || [])
    .map((item) => ({ record: item, hobby: hobbyMap[item.hobbyId] }))
    .filter((item) => item.hobby)
    .sort((a, b) => new Date(b.record.completedAt || 0) - new Date(a.record.completedAt || 0));
  const recentCompleted = completedList.slice(0, 3);

  return (
    <main className="screen home-screen dashboard-layout">
      <UserProfileCard profile={profile} stats={stats} userTraits={userTraits} onAchievements={onAchievements} />

      <div className="dashboard-main">
        <section className="card completed-overview-section">
          <div>
            <span className="eyebrow">완료한 여정</span>
            <h1>{completedList.length ? `${completedList.length}개의 퀘스트를 완료했어요.` : '아직 완료한 퀘스트가 없어요.'}</h1>
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
