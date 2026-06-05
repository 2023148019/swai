import { useState } from 'react';

const reasons = [
  '비용이 부담돼요',
  '시간이 부족해요',
  '생각보다 재미가 없어요',
  '시작 방법이 어려워요',
  '장소가 멀어요',
  '혼자 하기 부담스러워요',
  '너무 어렵게 느껴져요',
  '다른 취미가 더 끌려요'
];

export default function RemoveHobbyFeedbackModal({ hobby, onCancel, onSubmit }) {
  const [reason, setReason] = useState(reasons[0]);
  const [comment, setComment] = useState('');

  if (!hobby) return null;

  return (
    <div className="modal-backdrop">
      <section className="modal-card">
        <span className="eyebrow">취향 지도 조정</span>
        <h2>이번 길은 잘 맞지 않았나요?</h2>
        <p className="muted">괜찮아요. 맞지 않는 길을 알게 된 것도 나를 알아가는 중요한 단서예요. 이유를 알려주시면 다음 가능성을 더 잘 찾아볼게요.</p>
        <div className="reason-grid">
          {reasons.map((item) => (
            <button key={item} className={`choice-card small ${reason === item ? 'selected' : ''}`} onClick={() => setReason(item)}>{item}</button>
          ))}
        </div>
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="추가 의견을 자유롭게 적어주세요." />
        <div className="button-row end">
          <button className="secondary-button" onClick={onCancel}>조금 더 해볼게요</button>
          <button className="danger-button" onClick={() => onSubmit({ reason, comment })}>피드백 남기고 지도에서 제외하기</button>
        </div>
      </section>
    </div>
  );
}
