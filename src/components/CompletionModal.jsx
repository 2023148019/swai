import { QuestCompleteIllustration } from './Illustrations.jsx';

export default function CompletionModal({ completed, onClose }) {
  if (!completed) return null;
  return (
    <div className="modal-backdrop">
      <section className="modal-card completion-modal">
        <QuestCompleteIllustration />
        <span className="eyebrow">새로운 업적 발견</span>
        <h2>축하합니다!</h2>
        <p>{completed.hobby.name} 취미 퀘스트를 끝까지 완료했어요.</p>
        <div className="achievement-toast">획득 업적: {completed.hobby.achievement.title}</div>
        <p className="muted">다음 칭호에 더 가까워졌어요. 모험 기록이 하나 더 추가되었습니다.</p>
        <button className="primary-button full" onClick={onClose}>홈으로 돌아가기</button>
      </section>
    </div>
  );
}
