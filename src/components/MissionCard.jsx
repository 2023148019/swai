export default function MissionCard({ mission, isComplete, disabled, onComplete }) {
  return (
    <div className={`mission-card ${isComplete ? 'done' : ''} ${disabled ? 'disabled' : ''}`}>
      <div>
        <h4>{isComplete ? '✅ ' : '▫️ '}{mission.title}</h4>
        <p>{mission.description}</p>
        <small>{mission.type} · +{mission.rewardScore} 성장 보상</small>
      </div>
      <button className={isComplete ? 'secondary-button' : 'primary-button'} disabled={isComplete || disabled} onClick={() => onComplete(mission)}>
        {isComplete ? '완료됨' : '완료하기'}
      </button>
    </div>
  );
}
