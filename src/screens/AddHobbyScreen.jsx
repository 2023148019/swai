import { TreasureChestIllustration } from '../components/Illustrations.jsx';

export default function AddHobbyScreen({ onSearch, onSurvey, onBack }) {
  return (
    <main className="screen add-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>
      <section className="card add-hero">
        <div>
          <span className="eyebrow">새로운 취미</span>
          <h1>새로운 취미를 추가해볼까요?</h1>
          <p>직접 검색해서 추가하거나, 취향 질문으로 다시 추천받을 수 있어요.</p>
        </div>
        <TreasureChestIllustration />
      </section>
      <div className="add-option-grid">
        <button className="card add-option" onClick={onSearch}>
          <span>🔎</span>
          <h2>직접 검색해서 추가하기</h2>
          <p>이미 끌리는 취미가 있다면 바로 찾아서 퀘스트로 추가하세요.</p>
        </button>
        <button className="card add-option" onClick={onSurvey}>
          <span>🧭</span>
          <h2>취향 질문으로 추천받기</h2>
          <p>현재 성향과 피드백을 반영해서 새로운 추천을 받아보세요.</p>
        </button>
      </div>
    </main>
  );
}
