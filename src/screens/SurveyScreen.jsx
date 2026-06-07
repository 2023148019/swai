import { useEffect, useState } from 'react';
import { getAdaptiveSurveyQuestions } from '../data/questions.js';
import ProgressBar from '../components/ProgressBar.jsx';
import hobbyMapImage from '../../지도.png';

const SURVEY_MAP_PIECES = 12;

export default function SurveyScreen({ onComplete, onBack }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [recentRestoredPieceIndex, setRecentRestoredPieceIndex] = useState(null);
  const [answeredQuestionId, setAnsweredQuestionId] = useState(null);
  const activeQuestions = getAdaptiveSurveyQuestions(answers);
  const question = activeQuestions[index];
  const answeredCount = answers.length;
  const restoredPieceCount = Math.min(SURVEY_MAP_PIECES, answeredCount);
  const progress = Math.round((restoredPieceCount / SURVEY_MAP_PIECES) * 100);
  const isMapCompleted = restoredPieceCount >= SURVEY_MAP_PIECES;
  const isReadyForResult = answeredCount >= SURVEY_MAP_PIECES;

  useEffect(() => {
    setAnsweredQuestionId(null);
  }, [question?.id]);

  const selectOption = (option) => {
    if (isReadyForResult || answeredQuestionId === question.id) return;
    setAnsweredQuestionId(question.id);

    const nextAnswers = [
      ...answers,
      {
        questionId: question.id,
        selectedOptionId: option.optionId,
        label: option.label,
        categoryEffects: option.categoryEffects,
        traitEffects: option.traitEffects,
        tagEffects: option.tagEffects
      }
    ];
    const nextQuestions = getAdaptiveSurveyQuestions(nextAnswers);
    const nextIndex = index + 1;

    setRecentRestoredPieceIndex(Math.min(SURVEY_MAP_PIECES - 1, answers.length));
    setAnswers(nextAnswers);
    if (nextIndex < nextQuestions.length && nextAnswers.length < SURVEY_MAP_PIECES) {
      setIndex(nextIndex);
    }
    window.setTimeout(() => setRecentRestoredPieceIndex(null), 360);
  };

  const goPrev = () => {
    setAnsweredQuestionId(null);
    if (index === 0) {
      onBack?.();
      return;
    }
    setAnswers((prev) => prev.slice(0, -1));
    setIndex((prev) => prev - 1);
  };

  const showResult = () => {
    if (!isReadyForResult) return;
    onComplete(answers);
  };

  return (
    <main className="screen survey-screen">
      <section className="card question-card">
        <div className="card-topline">
          <span className="eyebrow">지도 복원 {Math.min(answeredCount + 1, SURVEY_MAP_PIECES)}/{SURVEY_MAP_PIECES}</span>
          <button className="ghost-button" onClick={goPrev}>이전</button>
        </div>
        <ProgressBar value={progress} compact />
        <h1>{question.title}</h1>
        <p className="muted">{question.subtitle} 정답은 없어요. 지금 끌리는 쪽이 오늘의 단서예요.</p>
        <div className="choice-grid">
          {question.options.map((option) => (
            <button
              key={option.optionId}
              className="choice-card"
              onClick={() => selectOption(option)}
              disabled={isReadyForResult}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="muted">
          {isReadyForResult
            ? '지도를 모두 복원했어요. 이제 어디부터 가볼지 살펴볼 시간이에요.'
            : '답변할수록 지도 위의 흐릿한 조각이 하나씩 선명해져요.'}
        </p>
        {isReadyForResult && (
          <button className="primary-button full survey-result-button" onClick={showResult}>
            완성된 지도 확인하기
          </button>
        )}
      </section>

      <section className={`card survey-map-card ${isMapCompleted ? 'completed' : ''}`} aria-label="내면 지도 복원 상태">
        <div className="card-topline">
          <span className="eyebrow">내면 지도</span>
          <span className="survey-map-progress">
            {isMapCompleted ? '지도 복원 완료' : `지도 조각 ${restoredPieceCount} / ${SURVEY_MAP_PIECES}`}
          </span>
        </div>
        <p className="muted">답변할수록 아직 보이지 않던 나의 모습이 지도 위에 조금씩 드러나요.</p>
        <div className="survey-map-board" aria-hidden="true">
          {Array.from({ length: SURVEY_MAP_PIECES }).map((_, pieceIndex) => {
            const pieceColumn = pieceIndex % 4;
            const pieceRow = Math.floor(pieceIndex / 4);
            const isUnlocked = pieceIndex < restoredPieceCount;
            const isCurrent = pieceIndex === recentRestoredPieceIndex;

            return (
              <div
                key={pieceIndex}
                className={`survey-map-piece ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                style={{
                  '--map-image': `url(${hobbyMapImage})`,
                  '--map-x': `${pieceColumn * 33.3333}%`,
                  '--map-y': `${pieceRow * 50}%`
                }}
              >
                <span className="survey-map-icon">?</span>
              </div>
            );
          })}
        </div>
        <p className="survey-map-helper">
          {isMapCompleted
            ? '이제 완성된 지도를 바탕으로 새로운 가능성을 확인해보세요.'
            : '남은 조각을 채우면 완성된 지도를 확인할 수 있어요.'}
        </p>
      </section>
    </main>
  );
}
