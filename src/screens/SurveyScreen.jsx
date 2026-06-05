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
          <span className="eyebrow">취향 질문 {index + 1}/{activeQuestions.length}</span>
          <button className="ghost-button" onClick={goPrev}>이전</button>
        </div>
        <ProgressBar value={progress} compact />
        <h1>{question.title}</h1>
        <p className="muted">{question.subtitle}</p>
        <div className="choice-grid">
          {question.options.map((option) => (
            <button key={option.optionId} className="choice-card" onClick={() => selectOption(option)}>
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
