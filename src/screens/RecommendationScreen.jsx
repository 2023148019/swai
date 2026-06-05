import RecommendationCard from '../components/RecommendationCard.jsx';
import { CompassIllustration } from '../components/Illustrations.jsx';

export default function RecommendationScreen({ recommendations, onSelect, onRetake, onHome }) {
  const groups = recommendations?.groups || [];

  return (
    <main className="screen recommendation-screen">
      <section className="card result-hero">
        <div>
          <span className="eyebrow">새로운 가능성 발견</span>
          <h1>지금의 나에게 어울리는 길을 찾았어요.</h1>
          <p>답변을 바탕으로 나를 더 잘 알아갈 수 있는 퀘스트를 골라봤어요. 마음이 가는 길 하나를 골라 작은 실험을 시작해보세요.</p>
        </div>
        <CompassIllustration />
      </section>

      <section className="recommendation-board">
        {groups.map((group) => (
          <div key={group.category} className="recommendation-group card flat-card">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">새롭게 열린 가능성</span>
                <h2>{group.category}</h2>
              </div>
            </div>
            <div className="recommendation-grid">
              {group.items.map((item) => <RecommendationCard key={item.hobby.id} item={item} onSelect={onSelect} />)}
            </div>
          </div>
        ))}
      </section>

      <div className="button-row center">
        <button className="secondary-button" onClick={onRetake}>새로운 가능성 찾기</button>
        <button className="ghost-button" onClick={onHome}>홈으로 가기</button>
      </div>
    </main>
  );
}
