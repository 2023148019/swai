import { useMemo, useState } from 'react';
import { hobbies } from '../data/hobbies.js';

export default function HobbySearchScreen({ activeHobbies, completedHobbies, onAdd, onBack }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const blockedIds = new Set([...(activeHobbies || []).map((item) => item.hobbyId)]);
  const categories = useMemo(() => [...new Set(hobbies.map((hobby) => hobby.category))], []);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    return hobbies
      .filter((hobby) => !blockedIds.has(hobby.id))
      .filter((hobby) => selectedCategory === 'all' || hobby.category === selectedCategory)
      .filter((hobby) => !value || hobby.name.toLowerCase().includes(value) || hobby.category.toLowerCase().includes(value))
      .slice(0, 24);
  }, [query, selectedCategory, activeHobbies]);

  const completedIds = new Set((completedHobbies || []).map((item) => item.hobbyId));

  return (
    <main className="screen search-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 가능성 선택으로</button>
      <section className="card search-card">
        <span className="eyebrow">직접 검색</span>
        <h1>취향 지도에 추가할 길을 찾아보세요.</h1>
        <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="활동 이름을 검색해보세요. 예: 탁구, 베이킹, 기타" autoFocus />
        <div className="category-filter-row" role="radiogroup" aria-label="취미 카테고리 필터">
          <button
            className={`category-filter-button${selectedCategory === 'all' ? ' selected' : ''}`}
            type="button"
            role="radio"
            aria-checked={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          >
            전체
          </button>
          {categories.map((category) => (
            <button
              className={`category-filter-button${selectedCategory === category ? ' selected' : ''}`}
              type="button"
              role="radio"
              aria-checked={selectedCategory === category}
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
      <div className="search-grid">
        {results.map((hobby) => (
          <article className="card search-result-card" key={hobby.id}>
            <div className="card-topline">
              <span className="soft-pill">{hobby.category}</span>
              {completedIds.has(hobby.id) && <span className="soft-pill muted-pill">완료한 퀘스트</span>}
            </div>
            <h3>{hobby.name}</h3>
            <p className="muted">{hobby.description}</p>
            <div className="info-chip-row">
              <span>{hobby.estimatedCost}</span><span>{hobby.timeLevel}</span><span>{hobby.difficulty}</span>
            </div>
            <button className="primary-button full" onClick={() => onAdd(hobby)}>퀘스트로 추가하기</button>
          </article>
        ))}
      </div>
      {!results.length ? <div className="empty-card card">아직 이 이름의 길은 찾지 못했어요.</div> : null}
    </main>
  );
}
