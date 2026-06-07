import { HobbyMapIllustration, TreasureChestIllustration } from '../components/Illustrations.jsx';

export default function AddHobbyScreen({ onSearch, onSurvey, onBack }) {
  return (
    <main className="screen add-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>
      <section className="card add-hero">
        <div>
          <span className="eyebrow">새로운 가능성</span>
          <h1>새로운 가능성을 열어볼까요?</h1>
          <p>직접 검색해서 시작하거나, 내면 지도를 다시 복원해 지금 가볼 만한 지점을 확인해보세요.</p>
        </div>
        <TreasureChestIllustration />
      </section>
      <div className="add-option-grid">
        <button className="card add-option" onClick={onSearch}>
          <span>🔎</span>
          <h2>직접 검색해서 시작하기</h2>
          <p>이미 마음에 둔 활동이 있다면 바로 퀘스트로 추가해보세요.</p>
        </button>
        <button className="card add-option" onClick={onSurvey}>
          <div className="add-option-illustration">
            <HobbyMapIllustration />
          </div>
          <h2>내면 지도 다시 복원하기</h2>
          <p>다시 질문에 답하고 지금의 나에게 표시되는 지점을 확인해보세요.</p>
        </button>
      </div>
    </main>
  );
}
