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
          <span className="eyebrow">나의 발견 기록</span>
          <h1>{currentTitle}</h1>
          <p className="muted">{profile?.currentDescription || '완료한 미션과 퀘스트는 내가 나를 알아간 기록으로 남아요.'}</p>
          <TraitSummary traits={profile?.topTraits || []} />
        </div>
        <img className="title-image title-image-hero" src={titleImage} alt={`${currentTitle} 여정 단계 이미지`} />
      </section>

      <TitleProgressCard profile={profile} />

      <section className="card achievement-summary">
        <div className="mini-stat-grid wide">
          <div><strong>{completedHobbyList.length}</strong><span>완료한 퀘스트</span></div>
          <div><strong>{achievements.length}</strong><span>발견 기록</span></div>
        </div>
        <h2>완료한 퀘스트</h2>
        {completedHobbyList.length ? (
          <div className="completed-list">
            {completedHobbyList.map((hobby) => <span key={hobby.id} className="soft-pill">{hobby.name}</span>)}
          </div>
        ) : <p className="muted">아직 완료한 퀘스트가 없어요. 작은 미션부터 시작해보세요.</p>}
      </section>

      <section>
        <h2>발견한 기록</h2>
        <div className="achievement-grid three-column-grid">
          {achievements.length ? achievements.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} />) : <div className="empty-card card">아직 발견한 기록이 없어요.</div>}
        </div>
      </section>

      <section>
        <h2>아직 발견하지 못한 기록</h2>
        <p className="muted">앞으로의 여정에서 하나씩 열 수 있어요.</p>
        <div className="achievement-grid three-column-grid">
          {lockedBase.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} locked />)}
        </div>
      </section>
    </main>
  );
}
