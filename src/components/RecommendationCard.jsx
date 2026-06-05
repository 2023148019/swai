import TraitBadge from './TraitBadge.jsx';

export default function RecommendationCard({ item, onSelect }) {
  const { hobby, score, matchedTraits = [], recommendationReason } = item;
  return (
    <article className="recommendation-card card">
      <div className="card-topline">
        <span className="score-badge">추천 점수 {score}점</span>
        <span className="soft-pill">{hobby.category}</span>
      </div>
      <h3>{hobby.name}</h3>
      <p className="muted">{hobby.description}</p>
      <div className="review-bubble">“{hobby.experienceReview}”</div>
      <div className="reason-panel">
        <span>추천 이유</span>
        <p>{recommendationReason || hobby.recommendedReasonText}</p>
      </div>
      <div className="info-chip-row">
        <span>{hobby.estimatedCost}</span>
        <span>{hobby.timeLevel}</span>
        <span>{hobby.difficulty}</span>
        <span>{hobby.placeType}</span>
        <span>{hobby.socialType}</span>
      </div>
      <div className="trait-row">
        {(matchedTraits.length ? matchedTraits : hobby.tags.slice(0, 2)).map((trait) => <TraitBadge key={trait} label={trait} />)}
      </div>
      <button className="primary-button full push-bottom" onClick={() => onSelect(hobby)}>이 취미 퀘스트 시작하기</button>
    </article>
  );
}
