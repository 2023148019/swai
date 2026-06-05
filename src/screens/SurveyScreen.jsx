import { useState } from 'react';
import { getAdaptiveSurveyQuestions } from '../data/questions.js';
import ProgressBar from '../components/ProgressBar.jsx';

export default function SurveyScreen({ onComplete, onBack }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const activeQuestions = getAdaptiveSurveyQuestions(answers);
  const question = activeQuestions[index];
  const progress = Math.round((index / activeQuestions.length) * 100);

  const selectOption = (option) => {
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
    if (index + 1 >= nextQuestions.length) {
      onComplete(nextAnswers);
      return;
    }
    setAnswers(nextAnswers);
    setIndex(index + 1);
  };

  const goPrev = () => {
    if (index === 0) {
      onBack?.();
      return;
    }
    setAnswers((prev) => prev.slice(0, -1));
    setIndex((prev) => prev - 1);
  };

  return (
    <main className="screen survey-screen">
      <section className="card question-card">
        <div className="card-topline">
          <span className="eyebrow">나침반 조정 {index + 1}/{activeQuestions.length}</span>
          <button className="ghost-button" onClick={goPrev}>이전</button>
        </div>
        <ProgressBar value={progress} compact />
        <h1>{question.title}</h1>
        <p className="muted">{question.subtitle} 정답은 없어요. 지금 끌리는 쪽이 오늘의 단서예요.</p>
        <div className="choice-grid">
          {question.options.map((option) => (
            <button key={option.optionId} className="choice-card" onClick={() => selectOption(option)}>
              {option.label}
            </button>
          ))}
        </div>
        <p className="muted">답변할수록 나에게 어울리는 가능성이 조금씩 선명해져요.</p>
      </section>
    </main>
  );
}
