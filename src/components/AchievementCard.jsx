import { AchievementBadgeIllustration, LockedAchievementIllustration } from './Illustrations.jsx';

export default function AchievementCard({ achievement, locked = false }) {
  return (
    <article className={`achievement-card card ${locked ? 'locked-achievement' : ''}`}>
      {locked ? <LockedAchievementIllustration /> : <AchievementBadgeIllustration />}
      <div>
        <h3>{achievement.title}</h3>
        <p>{achievement.description}</p>
        {achievement.earnedAt && <small>{new Date(achievement.earnedAt).toLocaleDateString('ko-KR')} 발견</small>}
      </div>
    </article>
  );
}
