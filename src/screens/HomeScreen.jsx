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
            <span className="eyebrow">오늘의 취미 지도</span>
            <h1>오늘의 다음 미션을 확인해볼까요?</h1>
            <p className="muted">진행 중인 취미를 클릭하면 단계별 하위 미션과 현재 단계를 볼 수 있어요.</p>
          </div>
          <img className="today-map-image" src={hobbyMapImage} alt="취미 지도" />
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
