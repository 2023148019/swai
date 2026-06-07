import { useState } from 'react';
import { hobbyMap } from '../data/hobbies.js';
import ProgressBar from '../components/ProgressBar.jsx';
import { HobbyMapIllustration } from '../components/Illustrations.jsx';

const categoryIconMap = {
  '악기': '악기',
  '음악이론/보컬': '보컬',
  '미술/드로잉': '미술',
  '취업 준비 컨설팅': '취업',
  '사진/영상': '사진',
  '구기 스포츠': '구기',
  '댄스': '댄스',
  '투자/N잡': '투자',
  '연기/마술': '연기',
  '피트니스': '운동',
  '스포츠': '스포츠',
  '취미/생활': '생활',
  '요리/조리': '요리',
  '공예': '공예',
  '계절 스포츠': '계절',
  '패션/미용': '미용',
  '격투 스포츠': '격투',
  '국악': '국악',
  '기타 취미/자기계발': '탐색'
};

function formatDate(dateValue) {
  if (!dateValue) return '완료일 기록 없음';
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateValue));
}

export default function CompletedQuestScreen({ completedHobbies, onBack }) {
  const completedRecords = (completedHobbies || [])
    .map((record) => ({ record, hobby: hobbyMap[record.hobbyId] }))
    .filter((item) => item.hobby)
    .sort((a, b) => new Date(b.record.completedAt || 0) - new Date(a.record.completedAt || 0));
  const [selectedCompletedId, setSelectedCompletedId] = useState(null);
  const selectedCompleted = completedRecords.find((item) => item.record.instanceId === selectedCompletedId);
  const selectedEvidenceMap = selectedCompleted?.record.missionEvidence || {};
  const selectedCompletedMissionIds = new Set(selectedCompleted?.record.completedMissionIds || []);
  const selectedCompletedMissions = selectedCompleted
    ? selectedCompleted.hobby.missionStages.flatMap((stage) =>
        stage.missions
          .filter((mission) => selectedCompletedMissionIds.has(mission.id))
          .map((mission) => ({ ...mission, stageTitle: stage.title, evidence: selectedEvidenceMap[mission.id] || {} }))
      )
    : [];

  return (
    <main className="screen completed-quest-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>

      <section className="card completed-quest-hero">
        <div className="completed-quest-hero-copy">
          <div>
            <span className="eyebrow">완료한 퀘스트</span>
            <h1>{completedRecords.length ? `${completedRecords.length}개의 여정을 완료했어요.` : '아직 완료한 퀘스트가 없어요.'}</h1>
            <p className="muted">완료한 카드를 누르면 그때 남겼던 링크와 메모를 다시 볼 수 있어요.</p>
          </div>
          <div className="completed-quest-map">
            <HobbyMapIllustration />
          </div>
        </div>
        <div className="completed-count-tile">
          <div>
            <strong>{completedRecords.length}</strong>
            <span>완료 퀘스트</span>
          </div>
        </div>
      </section>

      {completedRecords.length ? (
        <section className="completed-quest-layout">
          <div className="completed-quest-grid">
            {completedRecords.map(({ record, hobby }) => (
              <button
                key={record.instanceId}
                className={`completed-quest-card card ${selectedCompletedId === record.instanceId ? 'selected' : ''}`}
                type="button"
                onClick={() => setSelectedCompletedId((currentId) => currentId === record.instanceId ? null : record.instanceId)}
              >
                <div className="quest-icon">{categoryIconMap[hobby.category] || '완료'}</div>
                <div className="active-card-body">
                  <div className="card-topline">
                    <span className="soft-pill">{hobby.category}</span>
                    <strong>100%</strong>
                  </div>
                  <h3>{hobby.name}</h3>
                  <p>완료한 날: {formatDate(record.completedAt)}</p>
                  <p className="muted">기록한 미션 {record.completedMissionIds?.length || 0}개</p>
                  <ProgressBar value={100} compact />
                </div>
              </button>
            ))}
          </div>

          {selectedCompleted ? (
            <section className="card completed-detail-panel">
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">완료 기록 보기</span>
                  <h2>{selectedCompleted.hobby.name}</h2>
                  <p className="muted">{formatDate(selectedCompleted.record.completedAt)}에 완료한 퀘스트예요.</p>
                </div>
                <span className="score-badge">미션 {selectedCompletedMissions.length}개</span>
              </div>

              <div className="completed-evidence-list">
                {selectedCompletedMissions.map((mission) => {
                  const link = String(mission.evidence?.link || '').trim();
                  const memo = String(mission.evidence?.memo || '').trim();

                  return (
                    <article key={mission.id} className="completed-evidence-card">
                      <div>
                        <span className="soft-pill">{mission.stageTitle}</span>
                        <h3>{mission.title}</h3>
                        <p className="muted">{mission.description}</p>
                      </div>
                      <div className="completed-evidence-body">
                        {link ? (
                          <p><strong>링크</strong><a href={link} target="_blank" rel="noreferrer">{link}</a></p>
                        ) : null}
                        {memo ? (
                          <p><strong>메모</strong><span>{memo}</span></p>
                        ) : null}
                        {!link && !memo ? <p className="muted">저장된 링크나 메모가 없어요.</p> : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </section>
      ) : (
        <section className="card empty-card">
          <h2>아직 완료한 퀘스트가 없어요.</h2>
          <p className="muted">진행 중인 퀘스트를 끝까지 완료하면 이곳에 기록이 쌓입니다.</p>
        </section>
      )}
    </main>
  );
}
