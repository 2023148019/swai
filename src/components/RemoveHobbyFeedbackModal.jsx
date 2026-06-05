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
        <span className="eyebrow">피드백</span>
        <h2>이 취미가 잘 맞지 않았던 이유가 무엇인가요?</h2>
        <p className="muted">다음 추천을 더 똑똑하게 만들게요. 알고리즘아 일해라.</p>
        <div className="reason-grid">
          {reasons.map((item) => (
            <button key={item} className={`choice-card small ${reason === item ? 'selected' : ''}`} onClick={() => setReason(item)}>{item}</button>
          ))}
        </div>
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="추가 의견을 자유롭게 적어주세요." />
        <div className="button-row end">
          <button className="secondary-button" onClick={onCancel}>취소</button>
          <button className="danger-button" onClick={() => onSubmit({ reason, comment })}>피드백 남기고 제거하기</button>
        </div>
      </section>
    </div>
  );
}
