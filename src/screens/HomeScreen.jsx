import UserProfileCard from '../components/UserProfileCard.jsx';
import ActiveHobbyCard from '../components/ActiveHobbyCard.jsx';
import { HobbyMapIllustration } from '../components/Illustrations.jsx';
import hobbyMapImage from '../../취미지도.png';

export default function HomeScreen({ profile, stats, userTraits, activeHobbies, onOpenHobby, onAddHobby, onAchievements }) {
  return (
    <main className="screen home-screen dashboard-layout">
      <UserProfileCard profile={profile} stats={stats} userTraits={userTraits} onAchievements={onAchievements} />

      <div className="dashboard-main">
        <section className="card map-section">
          <div>
            <span className="eyebrow">오늘의 취향 지도</span>
            <h1>오늘의 다음 미션을 확인해볼까요?</h1>
            <p className="muted">작은 미션을 하나씩 완료하면 내가 몰랐던 나의 모습이 조금씩 선명해져요.</p>
          </div>
          <img className="today-map-image" src={hobbyMapImage} alt="취미 지도" />
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
