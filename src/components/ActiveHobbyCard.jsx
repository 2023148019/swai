import { hobbyMap } from '../data/hobbies.js';
import { getHobbyProgress } from '../utils/progress.js';
import ProgressBar from './ProgressBar.jsx';

export default function ActiveHobbyCard({ activeHobby, onOpen }) {
  const hobby = hobbyMap[activeHobby.hobbyId];
  const progress = getHobbyProgress(activeHobby);
  if (!hobby) return null;

  return (
    <button className="active-hobby-card card" onClick={() => onOpen(activeHobby.instanceId)}>
      <div className="quest-icon">🗺️</div>
      <div className="active-card-body">
        <div className="card-topline">
          <span className="soft-pill">{hobby.category}</span>
          <strong>{progress.overall}%</strong>
        </div>
        <h3>{hobby.name}</h3>
        <p>현재 단계: {progress.currentStage?.title || '완료 준비 중'}</p>
        <p className="muted">다음 미션: {progress.nextMission?.title || '모든 미션 완료!'}</p>
        <ProgressBar value={progress.overall} compact />
      </div>
    </button>
  );
}
