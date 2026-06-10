import { useEffect, useState } from 'react';
import { generateMissionLink } from '../utils/aiLink.js';

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

export default function MissionCard({ mission, hobby, userInfo, evidence = {}, isComplete, disabled, onComplete, onEvidenceChange }) {
  const link = String(evidence.link || '');
  const memo = String(evidence.memo || '');
  const hasEvidence = link.trim().length > 0 || memo.trim().length > 0;
  const [aiGuide, setAiGuide] = useState(evidence.aiGuide || null);
  const [aiStatus, setAiStatus] = useState('idle');
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    setAiGuide(evidence.aiGuide || null);
  }, [evidence.aiGuide]);

  const updateEvidence = (field, value) => {
    onEvidenceChange?.(mission.id, { [field]: value });
  };

  const handleGenerateLink = async () => {
    if (!hobby || disabled) return;

    setAiStatus('loading');
    setAiError('');
    setAiGuide(null);

    try {
      const result = await generateMissionLink({
        hobbyName: hobby.name,
        missionTitle: mission.title,
        missionDescription: mission.description,
        missionType: mission.type,
        userLocation: userInfo?.location || '',
        budget: hobby.estimatedCost || hobby.costLevel || '',
        energy: hobby.timeLevel || ''
      });

      if (!result.success || !result.guide?.answer) {
        throw new Error(result.message || 'AI link failed');
      }

      setAiGuide(result.guide);
      updateEvidence('aiGuide', result.guide);
      setAiStatus('success');
    } catch (error) {
      setAiError(error.message || 'AI 미션 도우미가 바로 사용할 수 있는 가이드를 만들지 못했어요. 다시 한 번 시도해 주세요.');
      setAiStatus('error');
    }
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
          <div className="ai-link-assist">
            <button
              className="secondary-button ai-link-button"
              type="button"
              onClick={handleGenerateLink}
              disabled={disabled || aiStatus === 'loading'}
            >
              {aiStatus === 'loading' ? 'AI 가이드 만드는 중...' : 'AI 미션 가이드'}
            </button>
            {aiStatus === 'loading' ? (
              <p className="mission-evidence-helper">AI 미션 도우미가 지금 할 일과 참고 링크를 찾는 중입니다...</p>
            ) : null}
            {aiError ? <p className="ai-link-error">{aiError}</p> : null}
            {aiGuide ? (
              <div className="ai-link-card">
                <div>
                  <span className="soft-pill">AI 미션 도우미</span>
                  <h5>{aiGuide.answer}</h5>
                </div>
                <div className="ai-guide-section">
                  <strong>실행 단계</strong>
                  <ol>
                    {(aiGuide.steps || []).map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </div>
                <div className="ai-guide-section">
                  <strong>초보자 팁</strong>
                  <ul>
                    {(aiGuide.tips || []).map((tip) => <li key={tip}>{tip}</li>)}
                  </ul>
                </div>
                {(aiGuide.candidates || []).map((candidate) => (
                  <div className="ai-candidate-row" key={candidate.url}>
                    <div>
                      <span className="soft-pill">{candidate.platform || 'web'}</span>
                      <h5>{candidate.title}</h5>
                      <p>{candidate.reason}</p>
                    </div>
                    <div className="button-row">
                      <a className="secondary-button ai-link-anchor" href={candidate.url} target="_blank" rel="noreferrer">링크 열기</a>
                      <button className="primary-button" type="button" onClick={() => updateEvidence('link', candidate.url)}>
                        저장
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
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
