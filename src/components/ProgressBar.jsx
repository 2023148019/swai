export default function ProgressBar({ value = 0, label, compact = false }) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className={`progress-wrap ${compact ? 'compact' : ''}`} aria-label={label || `진행률 ${safeValue}%`}>
      {label && <div className="progress-label"><span>{label}</span><strong>{safeValue}%</strong></div>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
