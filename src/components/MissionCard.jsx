const missionHelperText = {
  learn: '본 자료나 영상 링크를 저장하거나, 알게 된 점을 메모해보세요.',
  research: '찾아본 장소, 가격, 클래스 링크나 비교 내용을 기록해보세요.',
  action: '직접 해본 뒤 느낀 점이나 인증할 수 있는 링크를 남겨보세요.',
  record: '느낀 점을 짧게라도 메모하면 완료할 수 있어요.',
  plan: '정한 일정이나 다음 행동을 메모해보세요.',
  prepare: '준비한 내용이나 후보 링크를 저장해보세요.',
  reflect: '계속할지에 대한 생각을 메모해보세요.',
  complete: '이 퀘스트를 마무리하며 최종 생각을 기록해보세요.'
};

export default function MissionCard({ mission, evidence = {}, isComplete, disabled, onComplete, onEvidenceChange }) {
  const link = String(evidence.link || '');
  const memo = String(evidence.memo || '');
  const hasEvidence = link.trim().length > 0 || memo.trim().length > 0;

  const updateEvidence = (field, value) => {
    onEvidenceChange?.(mission.id, { [field]: value });
  };

  return (
    <article className={`mission-card ${isComplete ? 'done' : ''} ${disabled ? 'disabled' : ''}`}>
      <div className="mission-card-copy">
        <h4>{isComplete ? '✅ ' : '▫️ '}{mission.title}</h4>
        <p>{mission.description}</p>
        <small>{mission.type} · 나의 단서 +{mission.rewardScore}</small>
        <p className="mission-evidence-helper">{missionHelperText[mission.type] || '링크나 메모를 남기면 미션을 완료할 수 있어요.'}</p>

        <div className="mission-evidence">
          <div className="mission-evidence-header">
            <strong>나의 기록</strong>
            <span className={`mission-evidence-status ${hasEvidence ? 'saved' : 'empty'}`}>
              {hasEvidence ? '기록이 저장됐어요.' : '링크나 메모를 남기면 미션을 완료할 수 있어요.'}
            </span>
          </div>
          <label className="mission-evidence-field">
            <span>참고 링크</span>
            <input
              className="mission-link-input"
              type="text"
              placeholder="참고한 링크를 저장해보세요. 예: 영상, 클래스, 자료"
              value={link}
              onChange={(event) => updateEvidence('link', event.target.value)}
              disabled={disabled}
            />
          </label>
          <label className="mission-evidence-field">
            <span>메모</span>
            <textarea
              className="mission-memo-textarea"
              placeholder="이 미션에서 알게 된 점이나 느낀 점을 적어보세요."
              value={memo}
              onChange={(event) => updateEvidence('memo', event.target.value)}
              disabled={disabled}
            />
          </label>
        </div>
      </div>

      <div className="mission-card-actions">
        <button
          className={isComplete ? 'secondary-button' : 'primary-button'}
          disabled={isComplete || disabled || !hasEvidence}
          onClick={() => onComplete(mission)}
        >
          {isComplete ? '완료한 미션' : '기록 남기고 미션 완료하기'}
        </button>
      </div>
    </article>
  );
}
