import { useState } from 'react';
import { HobbyMapIllustration, SproutAdventurerSelection } from '../components/Illustrations.jsx';

const REGION_OPTIONS = [
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '세종',
  '경기',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주'
];

export default function StartAndInfoScreen({ hasSavedAdventure, onPrepareNewAdventure, onContinue, onStart }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', gender: '', age: '', locations: [] });
  const [locationOpen, setLocationOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLocation = (region) => {
    setForm((prev) => {
      const hasRegion = prev.locations.includes(region);
      return {
        ...prev,
        locations: hasRegion
          ? prev.locations.filter((item) => item !== region)
          : [...prev.locations, region]
      };
    });
    setLocationOpen(false);
  };

  const startNew = () => {
    onPrepareNewAdventure();
    setForm({ name: '', gender: '', age: '', locations: [] });
    setLocationOpen(false);
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.age.trim() || form.locations.length === 0) return;
    onStart({
      ...form,
      location: form.locations.join(', ')
    });
  };

  return (
    <main className="screen start-screen desktop-hero-layout">
      <section className="hero-card card">
        <div className="hero-copy">
          <span className="eyebrow">아직 만나지 못한 나를 찾아서</span>
          <h1>나를 찾아보세요!</h1>
          <p>
            짧은 질문에 답하면 지금의 나에게 어울리는 첫 번째 퀘스트를 찾아드려요.
            운동, 창작, 음악, 요리 같은 취미 활동을 통해 나에게 맞는 가능성을 가볍게 실험해볼 수 있어요.
          </p>
          <div className="hero-feature-grid">
            <div><strong>12문항</strong><span>가벼운 취향 분석</span></div>
            <div><strong>136개</strong><span>맞춤 취미 추천</span></div>
            <div><strong>5단계</strong><span>취미별 성장 미션</span></div>
          </div>
        </div>
        <SproutAdventurerSelection gender={form.gender} />
      </section>

      <aside className={`start-side-panel${showForm ? ' form-mode' : ''}`}>
        {showForm ? (
          <form className="card info-form" onSubmit={handleSubmit}>
            <h2>모험가 등록</h2>
            <div className="info-form-grid">
              <label className="wide-field">
                이름
                <input name="name" value={form.name} onChange={handleChange} placeholder="예: 홍길동" />
              </label>
              <label>
                성별
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">선택 안 함</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </label>
              <label>
                나이
                <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="예: 23" min="1" />
              </label>
              <div className="wide-field location-field">
                <span className="field-label">관심 지역</span>
                <button
                  className={`location-select-trigger${form.locations.length ? ' has-value' : ''}`}
                  type="button"
                  onClick={() => setLocationOpen((open) => !open)}
                  aria-expanded={locationOpen}
                  aria-controls="locationOptions"
                >
                  <span>{form.locations.length ? form.locations.join(', ') : '지역을 선택해주세요'}</span>
                  <span aria-hidden="true">▾</span>
                </button>
                {locationOpen ? (
                  <div className="location-options" id="locationOptions">
                    {REGION_OPTIONS.map((region) => (
                      <label className="location-option" key={region}>
                        <input
                          type="checkbox"
                          checked={form.locations.includes(region)}
                          onChange={() => toggleLocation(region)}
                        />
                        <span>{region}</span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <button className="primary-button full" type="submit">내면 지도 복원하기</button>
            <button className="ghost-button full" type="button" onClick={() => setShowForm(false)}>시작 선택으로 돌아가기</button>
          </form>
        ) : (
          <section className="card start-choice-card">
            <HobbyMapIllustration />
            <span className="eyebrow">시작 선택</span>
            <h2>어떤 모험을 시작할까요?</h2>
            <p className="muted">아래에서 직접 선택하면 오늘의 작은 모험을 이어갈 수 있어요.</p>
            <div className="start-action-stack">
              <button className="primary-button full" type="button" onClick={startNew}>새 모험 시작하기</button>
              {hasSavedAdventure ? (
                <button className="secondary-button full" type="button" onClick={onContinue}>이전 모험 이어하기</button>
              ) : (
                <button className="secondary-button full" type="button" disabled>저장된 모험 없음</button>
              )}
            </div>
          </section>
        )}
      </aside>
    </main>
  );
}
