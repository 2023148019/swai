import { hobbyMap } from '../data/hobbies.js';
import { getHobbyProgress } from '../utils/progress.js';
import ProgressBar from './ProgressBar.jsx';

export default function ActiveHobbyCard({ activeHobby, onOpen }) {
  const hobby = hobbyMap[activeHobby.hobbyId];
  const progress = getHobbyProgress(activeHobby);
  if (!hobby) return null;

  const categoryIconMap = {
    '악기': '🎸',
    '음악이론/보컬': '🎤',
    '미술/드로잉': '🎨',
    '취업 준비 컨설팅': '💼',
    '사진/영상': '📸',
    '구기 스포츠': '⚽',
    '댄스': '💃',
    '투자/N잡': '💰',
    '연기/마술': '🎭',
    '피트니스': '🏋️',
    '스포츠': '🏃',
    '취미/생활': '🧩',
    '요리/조리': '🍳',
    '공예': '🪴',
    '계절 스포츠': '🏂',
    '패션/미용': '💄',
    '격투 스포츠': '🥊',
    '국악': '🎼',
    '기타 취미/자기계발': '✨'
  };

  const icon = categoryIconMap[hobby.category] || '🗺️';

  return (
    <button className="active-hobby-card card" onClick={() => onOpen(activeHobby.instanceId)}>
      <div className="quest-icon">{icon}</div>
      <div className="active-card-body">
        <div className="card-topline">
          <span className="soft-pill">{hobby.category}</span>
          <strong>{progress.overall}%</strong>
        </div>
        <h3>{hobby.name}</h3>
        <p>현재 걷고 있는 길: {progress.currentStage?.title || '완료 준비 중'}</p>
        <p className="muted">오늘의 다음 미션: {progress.nextMission?.title || '모든 미션 완료!'}</p>
        <ProgressBar value={progress.overall} compact />
      </div>
    </button>
  );
}
