import RecommendationCard from '../components/RecommendationCard.jsx';
import { HobbyMapIllustration } from '../components/Illustrations.jsx';

export default function RecommendationScreen({ recommendations, onSelect, onRetake, onHome }) {
  const groups = recommendations?.groups || [];

  return (
    <main className="screen recommendation-screen">
      <section className="card result-hero">
        <div>
          <span className="eyebrow">지도 복원 완료</span>
          <h1>지도를 복원했어요. 어디부터 가볼래요?</h1>
          <p>답변을 바탕으로 지금의 나에게 열려 있는 지점들을 표시했어요. 마음이 가는 곳 하나를 골라 작은 탐험을 시작해보세요.</p>
        </div>
        <HobbyMapIllustration />
      </section>

      <section className="recommendation-board">
        {groups.map((group) => (
          <div key={group.category} className="recommendation-group card flat-card">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">지도에 표시된 지점</span>
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
        <button className="secondary-button" onClick={onRetake}>지도 다시 복원하기</button>
        <button className="ghost-button" onClick={onHome}>홈으로 가기</button>
      </div>
    </main>
  );
}
