import ProgressBar from './ProgressBar.jsx';
import MissionCard from './MissionCard.jsx';

export default function MissionStageCard({ stage, status, completedIds, onComplete }) {
  const locked = status?.isLocked;
  return (
    <section className={`mission-stage card ${locked ? 'locked' : ''}`}>
      <div className="stage-header">
        <div>
          <span className="eyebrow">{locked ? '다음 길 준비 중' : status?.isComplete ? '이 단서를 발견했어요' : '지금 진행 중인 길이에요'}</span>
          <h3>{stage.title}</h3>
          <p>{locked ? '이전 단계를 완료하면 다음 길이 열려요.' : stage.description}</p>
        </div>
        <strong>{status?.percent || 0}%</strong>
      </div>
      <ProgressBar value={status?.percent || 0} compact />
      <div className="mission-list">
        {stage.missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            disabled={locked}
            isComplete={completedIds.includes(mission.id)}
            onComplete={onComplete}
          />
        ))}
      </div>
    </section>
  );
}
