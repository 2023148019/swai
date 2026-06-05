import { hobbyMap } from '../data/hobbies.js';
import { baseAchievements } from '../utils/progress.js';
import AchievementCard from '../components/AchievementCard.jsx';
import TitleProgressCard from '../components/TitleProgressCard.jsx';
import TraitSummary from '../components/TraitSummary.jsx';
import { getTitleImage } from '../utils/titleImages.js';

export default function AchievementScreen({ profile, achievements, completedHobbies, onBack }) {
  const earnedIds = new Set((achievements || []).map((item) => item.id));
  const lockedBase = baseAchievements.filter((achievement) => !earnedIds.has(achievement.id));
  const completedHobbyList = (completedHobbies || []).map((item) => hobbyMap[item.hobbyId]).filter(Boolean);
  const currentTitle = profile?.currentTitle || '홈프로텍터';
  const titleImage = getTitleImage(currentTitle);

  return (
    <main className="screen achievement-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>

      <section className="card achievement-hero">
        <div>
          <span className="eyebrow">모험 기록</span>
          <h1>{currentTitle}</h1>
          <p className="muted">{profile?.currentDescription || '첫 취미 모험을 준비 중입니다.'}</p>
          <TraitSummary traits={profile?.topTraits || []} />
        </div>
        <img className="title-image title-image-hero" src={titleImage} alt={`${currentTitle} 칭호 이미지`} />
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
