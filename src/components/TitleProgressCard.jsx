import ProgressBar from './ProgressBar.jsx';
import { getTitleImage } from '../utils/titleImages.js';

export default function TitleProgressCard({ profile, stats, hint, onAchievements }) {
  const title = profile?.currentTitle || '홈프로텍터';
  const titleImage = getTitleImage(title);
  const currentStep = profile?.currentTitleStep || 1;
  const message = hint || (profile?.isMaxTitle
    ? '최고 칭호에 도달했어요. 이제는 새로운 취미 기록을 쌓아볼 차례예요.'
    : '다음 성장까지 차근차근 나아가는 중이에요.');
  const progressLabel = profile?.isMaxTitle ? '최고 칭호' : '다음 성장까지';

  return (
    <section className="title-progress-card card">
      <div className="title-progress-header">
        <img className="title-image title-image-small" src={titleImage} alt={`${title} 칭호 이미지`} />
        <div className="title-progress-copy">
          <span className="eyebrow">업적과 성장</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="title-progress-copy">
        <div className="title-stage-track" aria-label={`칭호 성장 ${currentStep}/5`}>
          {Array.from({ length: 5 }, (_, index) => (
            <span
              className={`title-stage-marker${index < currentStep ? ' filled' : ''}${index + 1 === currentStep ? ' current' : ''}`}
              key={index}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="muted">{message}</p>
      </div>
      {stats ? (
        <div className="mini-stat-grid achievement-stat-grid">
          <div><strong>{stats.achievementCount || 0}</strong><span>업적</span></div>
          <div><strong>{stats.completedHobbyCount || 0}</strong><span>완료 취미</span></div>
        </div>
      ) : null}
      <ProgressBar value={profile?.titleProgressPercent || 0} label={progressLabel} />
      {onAchievements ? (
        <button className="secondary-button full" onClick={onAchievements}>업적보기</button>
      ) : null}
    </section>
  );
}
