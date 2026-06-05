import TraitBadge from './TraitBadge.jsx';

export default function TraitSummary({ traits = [] }) {
  return (
    <div className="trait-row">
      {traits.length ? traits.map((trait) => <TraitBadge key={trait.key || trait} label={trait.label || trait} />) : <TraitBadge label="첫 성향 분석 전" />}
    </div>
  );
}
