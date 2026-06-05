import RecommendationCard from '../components/RecommendationCard.jsx';
import { CompassIllustration } from '../components/Illustrations.jsx';

export default function RecommendationScreen({ recommendations, onSelect, onRetake, onHome }) {
  const groups = recommendations?.groups || [];

  return (
    <main className="screen recommendation-screen">
      <section className="card result-hero">
        <div>
          <span className="eyebrow">추천 결과</span>
          <h1>취미 지도에서 새로운 길을 발견했어요.</h1>
          <p>답변을 바탕으로 어울리는 취미 경로를 찾았어요. 점수는 55~95점 사이에서 상대적으로 계산됩니다.</p>
        </div>
        <CompassIllustration />
      </section>

      <section className="recommendation-board">
        {groups.map((group) => (
          <div key={group.category} className="recommendation-group card flat-card">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">추천 카테고리</span>
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
        <button className="secondary-button" onClick={onRetake}>다시 추천받기</button>
        <button className="ghost-button" onClick={onHome}>홈으로 가기</button>
      </div>
    </main>
  );
}
