import { QuestCompleteIllustration } from './Illustrations.jsx';

export default function CompletionModal({ completed, onClose }) {
  if (!completed) return null;
  return (
    <div className="modal-backdrop">
      <section className="modal-card completion-modal">
        <QuestCompleteIllustration />
        <span className="eyebrow">새로운 발견 기록</span>
        <h2>새로운 나의 단서를 발견했어요!</h2>
        <p>{completed.hobby.name} 퀘스트를 끝까지 완료했습니다.</p>
        <div className="achievement-toast">발견 기록: {completed.hobby.achievement.title}</div>
        <p className="muted">이 경험은 이제 나의 취향 지도에 기록됩니다.</p>
        <button className="primary-button full" onClick={onClose}>홈으로 돌아가기</button>
      </section>
    </div>
  );
}
