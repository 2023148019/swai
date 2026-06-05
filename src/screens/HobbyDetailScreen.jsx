import { hobbyMap } from '../data/hobbies.js';
import { getHobbyProgress } from '../utils/progress.js';
import ProgressBar from '../components/ProgressBar.jsx';
import MissionStageCard from '../components/MissionStageCard.jsx';
import { TreasureChestIllustration } from '../components/Illustrations.jsx';

export default function HobbyDetailScreen({ activeHobby, onBack, onCompleteMission, onRemove }) {
  const hobby = hobbyMap[activeHobby?.hobbyId];
  if (!hobby || !activeHobby) {
    return (
      <main className="screen">
        <section className="card empty-card"><p>취미 정보를 찾을 수 없어요.</p><button className="primary-button" onClick={onBack}>돌아가기</button></section>
      </main>
    );
  }

  const progress = getHobbyProgress(activeHobby);
  const completedIds = activeHobby.completedMissionIds || [];

  return (
    <main className="screen detail-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>

      <section className="card detail-top-card">
        <div>
          <span className="soft-pill">{hobby.category}</span>
          <h1>{hobby.name}</h1>
          <p>{hobby.description}</p>
          <ProgressBar value={progress.overall} label="전체 진행도" />
        </div>
        <div className="current-stage-card">
          <span className="eyebrow">현재 단계</span>
          <h2>{progress.currentStage?.title || '완료 준비 중'}</h2>
          <p className="muted">{progress.currentStage?.description || '모든 미션을 완료했어요.'}</p>
        </div>
      </section>

      <section className="detail-two-column">
        <div className="stage-list">
          {hobby.missionStages.map((stage) => (
            <MissionStageCard
              key={stage.id}
              stage={stage}
              status={progress.stageProgress[stage.id]}
              completedIds={completedIds}
              onComplete={(mission) => onCompleteMission(activeHobby.instanceId, mission.id)}
            />
          ))}
        </div>

        <aside className="detail-sidebar">
          <section className="card next-mission-card">
            <TreasureChestIllustration />
            <span className="eyebrow">오늘의 다음 미션</span>
            <h2>{progress.nextMission?.title || '모든 미션 완료!'}</h2>
            <p className="muted">{progress.nextMission?.description || '완료 모달에서 새로운 업적을 확인해보세요.'}</p>
          </section>

          <section className="card detail-info-panel">
            <span className="eyebrow">취미 기본정보</span>
            <h2>시작 전 체크</h2>
            <ul>
              <li><strong>예상 비용</strong><span>{hobby.estimatedCost}</span></li>
              <li><strong>필요한 시간</strong><span>{hobby.timeLevel}</span></li>
              <li><strong>난이도</strong><span>{hobby.difficulty}</span></li>
              <li><strong>장소</strong><span>{hobby.placeType}</span></li>
              <li><strong>방식</strong><span>{hobby.socialType}</span></li>
            </ul>
            <p className="muted">준비물: {hobby.requiredItems.join(', ')}</p>
            <p className="muted">시작 방법: {hobby.startTip}</p>
            <button className="danger-button full" onClick={() => onRemove(activeHobby.instanceId)}>취미 제거하기</button>
          </section>
        </aside>
      </section>
    </main>
  );
}
