# Text Update Modified Files Full Code

## src/components/AchievementCard.jsx
```jsx
import { AchievementBadgeIllustration, LockedAchievementIllustration } from './Illustrations.jsx';

export default function AchievementCard({ achievement, locked = false }) {
  return (
    <article className={`achievement-card card ${locked ? 'locked-achievement' : ''}`}>
      {locked ? <LockedAchievementIllustration /> : <AchievementBadgeIllustration />}
      <div>
        <h3>{achievement.title}</h3>
        <p>{achievement.description}</p>
        {achievement.earnedAt && <small>{new Date(achievement.earnedAt).toLocaleDateString('ko-KR')} 발견</small>}
      </div>
    </article>
  );
}
``````

## src/components/ActiveHobbyCard.jsx
```jsx
import { hobbyMap } from '../data/hobbies.js';
import { getHobbyProgress } from '../utils/progress.js';
import ProgressBar from './ProgressBar.jsx';

export default function ActiveHobbyCard({ activeHobby, onOpen }) {
  const hobby = hobbyMap[activeHobby.hobbyId];
  const progress = getHobbyProgress(activeHobby);
  if (!hobby) return null;

  return (
    <button className="active-hobby-card card" onClick={() => onOpen(activeHobby.instanceId)}>
      <div className="quest-icon">🗺️</div>
      <div className="active-card-body">
        <div className="card-topline">
          <span className="soft-pill">{hobby.category}</span>
          <strong>{progress.overall}%</strong>
        </div>
        <h3>{hobby.name}</h3>
        <p>현재 걷고 있는 길: {progress.currentStage?.title || '완료 준비 중'}</p>
        <p className="muted">오늘의 다음 미션: {progress.nextMission?.title || '모든 미션 완료!'}</p>
        <ProgressBar value={progress.overall} compact />
      </div>
    </button>
  );
}
``````

## src/components/CompletionModal.jsx
```jsx
import { QuestCompleteIllustration } from './Illustrations.jsx';

export default function CompletionModal({ completed, onClose }) {
  if (!completed) return null;
  return (
    <div className="modal-backdrop">
      <section className="modal-card completion-modal">
        <QuestCompleteIllustration />
        <span className="eyebrow">새로운 발견 기록</span>
        <h2>새로운 나의 단서를 발견했어요!</h2>
        <p>{completed.hobby.name} 퀘스트를 끝까지 완료했습니다.</p>
        <div className="achievement-toast">발견 기록: {completed.hobby.achievement.title}</div>
        <p className="muted">이 경험은 이제 나의 취향 지도에 기록됩니다.</p>
        <button className="primary-button full" onClick={onClose}>홈으로 돌아가기</button>
      </section>
    </div>
  );
}
``````

## src/components/MissionCard.jsx
```jsx
export default function MissionCard({ mission, isComplete, disabled, onComplete }) {
  return (
    <div className={`mission-card ${isComplete ? 'done' : ''} ${disabled ? 'disabled' : ''}`}>
      <div>
        <h4>{isComplete ? '✅ ' : '▫️ '}{mission.title}</h4>
        <p>{mission.description}</p>
        <small>{mission.type} · 나의 단서 +{mission.rewardScore}</small>
      </div>
      <button className={isComplete ? 'secondary-button' : 'primary-button'} disabled={isComplete || disabled} onClick={() => onComplete(mission)}>
        {isComplete ? '완료한 미션' : '미션 완료하기'}
      </button>
    </div>
  );
}
``````

## src/components/MissionStageCard.jsx
```jsx
import ProgressBar from './ProgressBar.jsx';
import MissionCard from './MissionCard.jsx';

export default function MissionStageCard({ stage, status, completedIds, onComplete }) {
  const locked = status?.isLocked;
  return (
    <section className={`mission-stage card ${locked ? 'locked' : ''}`}>
      <div className="stage-header">
        <div>
          <span className="eyebrow">{locked ? '다음 길 준비 중' : status?.isComplete ? '이 단서를 발견했어요' : '지금 진행 중인 길이에요'}</span>
          <h3>{stage.title}</h3>
          <p>{locked ? '이전 단계를 완료하면 다음 길이 열려요.' : stage.description}</p>
        </div>
        <strong>{status?.percent || 0}%</strong>
      </div>
      <ProgressBar value={status?.percent || 0} compact />
      <div className="mission-list">
        {stage.missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            disabled={locked}
            isComplete={completedIds.includes(mission.id)}
            onComplete={onComplete}
          />
        ))}
      </div>
    </section>
  );
}
``````

## src/components/RecommendationCard.jsx
```jsx
import TraitBadge from './TraitBadge.jsx';

export default function RecommendationCard({ item, onSelect }) {
  const { hobby, score, matchedTraits = [], recommendationReason } = item;
  return (
    <article className="recommendation-card card">
      <div className="card-topline">
        <span className="score-badge">내면 나침반 {score}%</span>
        <span className="soft-pill">{hobby.category}</span>
      </div>
      <h3>{hobby.name}</h3>
      <p className="muted">{hobby.description}</p>
      <div className="review-bubble">“{hobby.experienceReview}”</div>
      <div className="reason-panel">
        <span>이 퀘스트가 지금의 나와 잘 맞는 이유</span>
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
        <span className="eyebrow">연결된 성향</span>
        {(matchedTraits.length ? matchedTraits : hobby.tags.slice(0, 2)).map((trait) => <TraitBadge key={trait} label={trait} />)}
      </div>
      <button className="primary-button full push-bottom" onClick={() => onSelect(hobby)}>이 퀘스트 시작하기</button>
    </article>
  );
}
``````

## src/components/RemoveHobbyFeedbackModal.jsx
```jsx
import { useState } from 'react';

const reasons = [
  '비용이 부담돼요',
  '시간이 부족해요',
  '생각보다 재미가 없어요',
  '시작 방법이 어려워요',
  '장소가 멀어요',
  '혼자 하기 부담스러워요',
  '너무 어렵게 느껴져요',
  '다른 취미가 더 끌려요'
];

export default function RemoveHobbyFeedbackModal({ hobby, onCancel, onSubmit }) {
  const [reason, setReason] = useState(reasons[0]);
  const [comment, setComment] = useState('');

  if (!hobby) return null;

  return (
    <div className="modal-backdrop">
      <section className="modal-card">
        <span className="eyebrow">취향 지도 조정</span>
        <h2>이번 길은 잘 맞지 않았나요?</h2>
        <p className="muted">괜찮아요. 맞지 않는 길을 알게 된 것도 나를 알아가는 중요한 단서예요. 이유를 알려주시면 다음 가능성을 더 잘 찾아볼게요.</p>
        <div className="reason-grid">
          {reasons.map((item) => (
            <button key={item} className={`choice-card small ${reason === item ? 'selected' : ''}`} onClick={() => setReason(item)}>{item}</button>
          ))}
        </div>
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="추가 의견을 자유롭게 적어주세요." />
        <div className="button-row end">
          <button className="secondary-button" onClick={onCancel}>조금 더 해볼게요</button>
          <button className="danger-button" onClick={() => onSubmit({ reason, comment })}>피드백 남기고 지도에서 제외하기</button>
        </div>
      </section>
    </div>
  );
}
``````

## src/components/TitleProgressCard.jsx
```jsx
import ProgressBar from './ProgressBar.jsx';
import { getTitleImage } from '../utils/titleImages.js';

export default function TitleProgressCard({ profile, stats, hint, onAchievements }) {
  const title = profile?.currentTitle || '시작 전 모험가';
  const titleImage = getTitleImage(title);
  const currentStep = profile?.currentTitleStep || 1;
  const message = hint || (profile?.isMaxTitle
    ? '충분히 많은 가능성을 발견했어요. 이제는 새로운 기록을 쌓아볼 차례예요.'
    : '다음 여정까지 차근차근 나아가는 중이에요.');
  const progressLabel = profile?.isMaxTitle ? '충분히 발견했어요' : '다음 여정까지';

  return (
    <section className="title-progress-card card">
      <div className="title-progress-header">
        <img className="title-image title-image-small" src={titleImage} alt={`${title} 여정 단계 이미지`} />
        <div className="title-progress-copy">
          <span className="eyebrow">발견과 성장</span>
          <h2>다음 여정까지</h2>
        </div>
      </div>
      <div className="title-progress-copy">
        <div className="title-stage-track" aria-label={`여정 성장 ${currentStep}/5`}>
          {Array.from({ length: 5 }, (_, index) => (
            <span
              className={`title-stage-marker${index < currentStep ? ' filled' : ''}${index + 1 === currentStep ? ' current' : ''}`}
              key={index}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="muted">{message}</p>
      </div>
      {stats ? (
        <div className="mini-stat-grid achievement-stat-grid">
          <div><strong>{stats.achievementCount || 0}</strong><span>발견 기록</span></div>
          <div><strong>{stats.completedHobbyCount || 0}</strong><span>완료 퀘스트</span></div>
        </div>
      ) : null}
      <ProgressBar value={profile?.titleProgressPercent || 0} label={progressLabel} />
      {onAchievements ? (
        <button className="secondary-button full" onClick={onAchievements}>발견 기록 보기</button>
      ) : null}
    </section>
  );
}
``````

## src/data/hobbies.js
```jsx
const hobbyCategories = {
  '악기': [
    '기타 레슨', '바이올린 레슨', '피아노/키보드 레슨', '드럼 레슨', '플룻 레슨', '베이스기타 레슨', '첼로 레슨',
    '클라리넷 레슨', '색소폰 레슨', '우쿨렐레 레슨', '칼림바 레슨', '하모니카 레슨'
  ],
  '음악이론/보컬': [
    '보컬 레슨', '미디/컴퓨터작곡 레슨', '성악 레슨', '작곡/편곡 레슨', '랩 레슨', '시창청음/화성학 레슨',
    '음향/레코딩 레슨', '디제잉 레슨', '작사 레슨', '성우 레슨'
  ],
  '미술/드로잉': [
    '디지털드로잉 레슨', '소묘/드로잉 레슨', '만화/웹툰/애니 레슨', '미술회화 레슨', '동양화 레슨', '팝아트 레슨', '조소 레슨'
  ],
  '취업 준비 컨설팅': [
    '면접 컨설팅', '자기소개서 컨설팅', '포트폴리오 컨설팅', '스피치 컨설팅', '커리어 코칭'
  ],
  '사진/영상': ['영상 촬영/편집 레슨', '사진촬영/편집 레슨'],
  '구기 스포츠': [
    '축구 레슨', '농구 레슨', '골프 레슨', '야구 레슨', '테니스 레슨', '볼링 레슨', '배드민턴 레슨',
    '당구 레슨', '탁구 레슨', '족구 레슨', '스쿼시/라켓볼 레슨', '배구 레슨'
  ],
  '댄스': [
    '방송댄스 레슨', '스트릿댄스 레슨', '발레 레슨', '한국무용 레슨', '현대무용 레슨', '댄스스포츠 레슨',
    '라인댄스 레슨', '얼반댄스 레슨', '밸리댄스 레슨', '아르헨티나탱고 레슨', '살사댄스 레슨', '줌바댄스 레슨',
    '폴댄스 레슨', '재즈댄스 레슨', '탭댄스 레슨', '스윙댄스 레슨'
  ],
  '투자/N잡': ['주식 투자 입문', '부동산 투자 입문', '블로그 수익화', '스마트스토어 입문', '영상 편집 부업'],
  '연기/마술': ['연기 레슨', '뮤지컬 레슨', '마술 레슨', '스피치 연기 레슨', '즉흥극 워크숍'],
  '피트니스': ['퍼스널트레이닝(PT)', '필라테스', '요가', '영양/식단 관리', '음악 줄넘기', '크로스핏', '스피닝', '에어로빅 레슨'],
  '스포츠': [
    '수영 레슨', '마라톤/육상 레슨', '자전거/사이클 레슨', '스케이트보드 레슨', '인라인스케이트 레슨',
    '클라이밍/암벽등반 레슨', '체조 레슨', '승마 레슨', '양궁/국궁 레슨'
  ],
  '취미/생활': [
    '글쓰기 레슨', '게임 레슨', '타로카드 레슨', '바둑 레슨', '글씨교정 레슨', '낚시 레슨', '체스 레슨',
    '서예 레슨', '큐브 레슨', '다도 레슨', '드론 레슨', '다트 레슨', '장기 레슨'
  ],
  '요리/조리': ['베이킹 레슨', '커피 레슨', '요리/조리 레슨', '차(Tea) 레슨', '초콜릿 레슨', '푸드카빙 레슨'],
  '공예': [
    '뜨개질/위빙 레슨', '바느질/재봉틀 레슨', '천연비누/화장품 레슨', '플라워/꽃꽂이 레슨', '도자공예 레슨',
    '라탄공예 레슨', '디퓨저/향수 레슨', '가죽공예 레슨', '캘리그라피 레슨', '레진아트 레슨', '가구/목공예 레슨',
    '금속/악세사리공예 레슨', '자수 레슨', '마크라메 레슨', '종이공예 레슨', '클레이아트 레슨', '유리공예 레슨'
  ],
  '계절 스포츠': [
    '스노우보드 강습', '프리다이빙 강습', '스키 강습', '스쿠버다이빙 강습', '아이스스케이트 강습', '스노클링 강습',
    '웨이크보드 강습', '서핑 강습', '수상스키 강습', '요트 강습', '카누/카약 강습'
  ],
  '패션/미용': ['뷰티/미용 레슨', '패션디자인 레슨', '모델 레슨', '퍼스널쇼퍼', '퍼스널컬러자격증 준비'],
  '격투 스포츠': [
    '복싱 레슨', '태권도 레슨', '종합격투기 레슨', '주짓수 레슨', '펜싱 레슨', '검도 레슨', '킥복싱/무에타이 레슨',
    '호신술 레슨', '유도 레슨', '합기도 레슨', '공수도 레슨', '중국무술 레슨', '파쿠르 레슨'
  ],
  '국악': ['가야금 레슨', '해금 레슨', '거문고 레슨', '대금 레슨', '단소 레슨', '사물놀이 레슨', '민요 레슨', '피리 레슨', '판소리 레슨', '아쟁 레슨', '태평소 레슨'],
  '기타 취미/자기계발': ['사주/명리학 레슨', '정리정돈/수납 레슨', '농사 레슨', '인테리어 기술교육']
};

const categoryMeta = {
  '악기': {
    tags: ['실내', '몰입', '꾸준함', '표현', '성장감', '혼자', '창작'], costLevel: '중간', timeLevel: '보통', difficulty: '보통', placeType: '실내', socialType: '혼자',
    requiredItems: ['악기', '악보 앱', '연습 공간'], reason: '반복 연습을 통해 실력이 눈에 보이게 쌓이는 취미예요.', review: '처음엔 소리가 삐끗하지만, 한 소절이 이어지는 순간 은근 뿌듯해요.'
  },
  '음악이론/보컬': {
    tags: ['실내', '표현', '창작', '몰입', '성장감', '함께'], costLevel: '중간', timeLevel: '보통', difficulty: '보통', placeType: '실내', socialType: '혼자',
    requiredItems: ['녹음 앱', '이어폰', '연습곡'], reason: '목소리나 음악으로 자신을 표현하고 싶은 사람에게 잘 맞아요.', review: '녹음해서 들어보면 민망하지만, 성장 체감은 확실해요. 귀는 아프고 실력은 자랍니다.'
  },
  '미술/드로잉': {
    tags: ['실내', '창작', '결과물', '몰입', '표현', '혼자', '정적'], costLevel: '낮음', timeLevel: '짧음', difficulty: '쉬움', placeType: '실내', socialType: '혼자',
    requiredItems: ['스케치북 또는 태블릿', '펜', '참고 이미지'], reason: '조용히 집중하면서 결과물이 남는 취미를 찾는 사람에게 좋아요.', review: '잘 그리는 것보다 계속 그리는 게 핵심이에요. 첫 장은 원래 희생양입니다.'
  },
  '취업 준비 컨설팅': {
    tags: ['실내', '성장감', '도전', '루틴', '기록', '자기표현'], costLevel: '중간', timeLevel: '보통', difficulty: '보통', placeType: '실내', socialType: '함께',
    requiredItems: ['노트북', '기존 이력서', '목표 직무'], reason: '목표를 세우고 실전 결과물을 다듬는 데서 성취감을 느끼는 사람에게 맞아요.', review: '부담은 있지만 방향이 잡히면 머릿속 안개가 걷히는 느낌이 있어요.'
  },
  '사진/영상': {
    tags: ['창작', '결과물', '표현', '야외', '실내', '몰입'], costLevel: '중간', timeLevel: '보통', difficulty: '보통', placeType: '혼합', socialType: '혼자',
    requiredItems: ['스마트폰 또는 카메라', '편집 앱', '촬영 주제'], reason: '일상을 기록하고 결과물을 남기는 데서 만족감을 느끼는 사람에게 잘 맞아요.', review: '처음엔 그냥 찍는 것 같은데, 구도를 알면 갑자기 세상이 썸네일처럼 보입니다.'
  },
  '구기 스포츠': {
    tags: ['활동적', '경쟁', '함께', '성장감', '도전', '실내', '야외'], costLevel: '중간', timeLevel: '짧음', difficulty: '보통', placeType: '혼합', socialType: '함께',
    requiredItems: ['운동복', '운동화', '기본 장비'], reason: '몸을 움직이며 실력이 오르는 느낌을 좋아하는 사람에게 잘 맞아요.', review: '처음엔 공이 내 편인지 적인지 헷갈리지만, 랠리가 이어지면 바로 몰입됩니다.'
  },
  '댄스': {
    tags: ['활동적', '표현', '함께', '성장감', '실내', '도전'], costLevel: '중간', timeLevel: '보통', difficulty: '보통', placeType: '실내', socialType: '함께',
    requiredItems: ['편한 복장', '운동화', '거울 또는 촬영 앱'], reason: '몸으로 표현하고 짧은 시간 안에 몰입하고 싶은 사람에게 좋아요.', review: '처음 영상 찍으면 충격 받을 수 있는데, 그게 성장의 입장권입니다.'
  },
  '투자/N잡': {
    tags: ['실내', '도전', '루틴', '기록', '성장감', '혼자'], costLevel: '낮음', timeLevel: '보통', difficulty: '보통', placeType: '실내', socialType: '혼자',
    requiredItems: ['노트북', '기록장', '학습 자료'], reason: '배운 내용을 현실적인 결과로 연결하는 데 흥미가 있는 사람에게 맞아요.', review: '처음엔 용어가 외계어지만, 작은 기록이 쌓이면 감이 생겨요.'
  },
  '연기/마술': {
    tags: ['표현', '도전', '함께', '창작', '실내', '성장감'], costLevel: '중간', timeLevel: '보통', difficulty: '보통', placeType: '실내', socialType: '함께',
    requiredItems: ['대본 또는 도구', '거울', '촬영 앱'], reason: '사람 앞에서 표현하고 반응을 얻는 활동을 좋아한다면 잘 맞아요.', review: '처음엔 민망함 MAX지만, 한번 터지면 그 맛 때문에 계속하게 됩니다.'
  },
  '피트니스': {
    tags: ['활동적', '루틴', '성장감', '실내', '건강', '도전'], costLevel: '중간', timeLevel: '짧음', difficulty: '쉬움', placeType: '실내', socialType: '혼자',
    requiredItems: ['운동복', '운동화', '물병'], reason: '짧게 시작해도 몸의 변화와 루틴 형성을 체감하기 좋아요.', review: '운동 전엔 귀찮고, 운동 후엔 갑자기 인생을 다 이길 수 있을 것 같아져요.'
  },
  '스포츠': {
    tags: ['활동적', '야외', '도전', '성장감', '집중', '혼자', '함께'], costLevel: '중간', timeLevel: '보통', difficulty: '보통', placeType: '야외', socialType: '함께',
    requiredItems: ['운동복', '보호 장비', '연습 장소'], reason: '체력과 도전감을 동시에 채우고 싶은 사람에게 잘 맞아요.', review: '처음엔 몸이 항의하지만, 한 번 해내면 자존감이 바로 출근합니다.'
  },
  '취미/생활': {
    tags: ['실내', '몰입', '정적', '혼자', '기록', '루틴', '창작'], costLevel: '낮음', timeLevel: '짧음', difficulty: '쉬움', placeType: '실내', socialType: '혼자',
    requiredItems: ['기본 도구', '기록장', '입문 자료'], reason: '부담 없이 시작하고 일상 속에서 꾸준히 즐기기 좋아요.', review: '화려하진 않아도 오래 가는 취미가 많아요. 은근히 인생 접착제 같은 느낌입니다.'
  },
  '요리/조리': {
    tags: ['실내', '창작', '결과물', '루틴', '표현', '함께'], costLevel: '중간', timeLevel: '보통', difficulty: '쉬움', placeType: '실내', socialType: '함께',
    requiredItems: ['재료', '조리 도구', '레시피'], reason: '직접 만든 결과를 바로 맛볼 수 있어 만족감이 빠른 취미예요.', review: '실패해도 먹을 수 있으면 절반은 성공입니다. 요리는 관대해요, 가끔만요.'
  },
  '공예': {
    tags: ['실내', '창작', '결과물', '몰입', '정적', '혼자', '표현'], costLevel: '낮음', timeLevel: '보통', difficulty: '쉬움', placeType: '실내', socialType: '혼자',
    requiredItems: ['재료 키트', '작업 공간', '참고 이미지'], reason: '손으로 만드는 재미와 결과물을 남기는 만족감을 동시에 느낄 수 있어요.', review: '손은 바쁜데 머리는 조용해지는 느낌. 생각보다 힐링력이 셉니다.'
  },
  '계절 스포츠': {
    tags: ['활동적', '야외', '도전', '특별함', '함께', '경험'], costLevel: '높음', timeLevel: '김', difficulty: '보통', placeType: '야외', socialType: '함께',
    requiredItems: ['예약 정보', '대여 장비', '방수/방한 준비물'], reason: '평소와 다른 강한 경험과 추억을 남기고 싶은 사람에게 좋아요.', review: '비용과 준비는 좀 들지만, 한 번 다녀오면 이야깃거리가 확 생깁니다.'
  },
  '패션/미용': {
    tags: ['표현', '창작', '실내', '결과물', '자기관리', '함께'], costLevel: '중간', timeLevel: '짧음', difficulty: '쉬움', placeType: '실내', socialType: '함께',
    requiredItems: ['참고 이미지', '기본 도구', '스타일 기록'], reason: '자기표현과 이미지 변화를 즐기는 사람에게 잘 맞아요.', review: '작은 변화인데 기분 전환은 큽니다. 거울 앞 체류 시간이 늘 수 있어요.'
  },
  '격투 스포츠': {
    tags: ['활동적', '도전', '경쟁', '집중', '성장감', '실내'], costLevel: '중간', timeLevel: '보통', difficulty: '어려움', placeType: '실내', socialType: '함께',
    requiredItems: ['운동복', '보호 장비', '수건'], reason: '스트레스를 몸으로 풀고 실전적인 성장을 느끼고 싶은 사람에게 맞아요.', review: '힘든데 이상하게 개운합니다. 샌드백은 꽤 훌륭한 상담사예요.'
  },
  '국악': {
    tags: ['실내', '표현', '몰입', '꾸준함', '전통', '성장감'], costLevel: '중간', timeLevel: '보통', difficulty: '보통', placeType: '실내', socialType: '혼자',
    requiredItems: ['악기', '연습 공간', '입문 자료'], reason: '전통적인 소리와 꾸준한 수련에 매력을 느끼는 사람에게 좋아요.', review: '처음엔 낯설지만 소리가 익숙해질수록 묘하게 깊은 맛이 생겨요.'
  },
  '기타 취미/자기계발': {
    tags: ['실내', '루틴', '실속형', '몰입', '생활개선', '혼자'], costLevel: '낮음', timeLevel: '짧음', difficulty: '쉬움', placeType: '실내', socialType: '혼자',
    requiredItems: ['기본 도구', '기록장', '입문 자료'], reason: '일상을 정리하고 실용적인 변화를 만들고 싶은 사람에게 맞아요.', review: '겉으론 소소한데 생활이 은근히 편해지는 취미들이 많아요.'
  }
};

const missionTemplates = {
  '구기 스포츠': [
    ['취미 기본정보 알기', '이 스포츠가 어떤 방식으로 진행되는지 먼저 파악하는 단계입니다.', ['기본 규칙 알아보기', '필요한 장비 확인하기', '부상 위험과 준비운동 알아보기']],
    ['온라인으로 가볍게 체험하기', '바로 비용을 쓰기 전에 영상과 자료로 맛보는 단계입니다.', ['초보자 기본 자세 영상 보기', '10분 기본 동작 따라 하기', '좋아 보이는 경기 영상 하나 보기']],
    ['오프라인 클래스 또는 체험 알아보기', '실제로 해볼 수 있는 장소와 사람을 찾는 단계입니다.', ['근처 운동장/운동 시설/동아리 찾기', '원데이 레슨 또는 대관 비용 확인하기', '같이 할 친구나 모임 찾아보기']],
    ['직접 실행해보기', '이제 실제로 한 번 움직여 보는 단계입니다.', ['첫 플레이 날짜 정하기', '실제로 30분 이상 해보기', '재미, 체력 부담, 난이도 기록하기']],
    ['취미로 만들지 판단하기', '앞으로 계속할지 결정하는 단계입니다.', ['계속할지 판단하기', '필요한 장비 구매 여부 정하기', '다음 플레이 일정 정하기']]
  ],
  '공예': [
    ['취미 기본정보 알기', '무엇을 만들고 싶은지 먼저 구체화하는 단계입니다.', ['만들고 싶은 결과물 정하기', '필요한 재료 알아보기', '예상 비용 확인하기']],
    ['온라인으로 가볍게 체험하기', '영상과 샘플로 먼저 손맛을 보는 단계입니다.', ['제작 과정 영상 보기', '작은 샘플 따라 해보기', '만들고 싶은 디자인 저장하기']],
    ['오프라인 클래스 또는 체험 알아보기', '배울 수 있는 클래스나 키트를 찾는 단계입니다.', ['원데이 클래스 찾기', '재료 키트 구매처 확인하기', '클래스 비용 비교하기']],
    ['직접 실행해보기', '작은 결과물을 직접 만들어보는 단계입니다.', ['작은 작품 하나 만들어보기', '완성품 사진 찍기', '어려웠던 점 기록하기']],
    ['취미로 만들지 판단하기', '계속 만들고 싶은지 결정하는 단계입니다.', ['계속 만들고 싶은 작품 정하기', '재료를 더 살지 판단하기', '다음 작품 계획하기']]
  ],
  '요리/조리': [
    ['취미 기본정보 알기', '만들고 싶은 메뉴와 준비물을 확인하는 단계입니다.', ['만들고 싶은 메뉴 정하기', '필요한 재료와 도구 확인하기', '예상 비용 확인하기']],
    ['온라인으로 가볍게 체험하기', '레시피를 보고 흐름을 익히는 단계입니다.', ['레시피 영상 보기', '조리 순서 정리하기', '장보기 목록 만들기']],
    ['오프라인 클래스 또는 체험 알아보기', '배울 수 있는 장소와 재료 구매처를 찾는 단계입니다.', ['쿠킹 클래스나 베이킹 클래스 찾기', '주변 마트나 재료 구매처 확인하기', '클래스 비용 비교하기']],
    ['직접 실행해보기', '직접 만들고 기록하는 단계입니다.', ['직접 요리해보기', '완성 사진 찍기', '맛과 난이도 기록하기']],
    ['취미로 만들지 판단하기', '계속할 메뉴와 방식을 정하는 단계입니다.', ['다시 만들고 싶은지 판단하기', '다음 메뉴 정하기', '나만의 레시피 메모 남기기']]
  ],
  '악기': [
    ['취미 기본정보 알기', '악기의 특징과 시작 비용을 확인하는 단계입니다.', ['관심 악기 특징 알아보기', '악기 구매/대여 비용 확인하기', '연습 장소 확인하기']],
    ['온라인으로 가볍게 체험하기', '기본 자세와 쉬운 연습으로 맛보는 단계입니다.', ['입문 연주 영상 보기', '기본 자세 따라 해보기', '쉬운 코드나 음계 10분 연습하기']],
    ['오프라인 클래스 또는 체험 알아보기', '레슨과 대여 가능 여부를 확인하는 단계입니다.', ['근처 레슨/동아리 찾기', '악기 대여 가능 여부 확인하기', '레슨 비용 비교하기']],
    ['직접 실행해보기', '실제로 소리를 내고 기록하는 단계입니다.', ['첫 연습 날짜 정하기', '15분 이상 연습하기', '녹음하거나 느낀 점 기록하기']],
    ['취미로 만들지 판단하기', '계속 배울지 정하는 단계입니다.', ['계속 배울지 판단하기', '연습 루틴 정하기', '다음 곡 하나 정하기']]
  ],
  '피트니스': [
    ['취미 기본정보 알기', '운동 목표와 현재 몸 상태를 확인하는 단계입니다.', ['운동 목표 정하기', '내 몸 상태 간단히 체크하기', '필요한 준비물 확인하기']],
    ['온라인으로 가볍게 체험하기', '짧은 루틴으로 몸에 맞는지 보는 단계입니다.', ['10분 입문 루틴 영상 보기', '가볍게 따라 하기', '운동 후 몸 상태 기록하기']],
    ['오프라인 클래스 또는 체험 알아보기', '공간과 비용을 비교하는 단계입니다.', ['근처 헬스장/필라테스/요가원 찾기', '가격과 위치 비교하기', '체험 수업 가능 여부 확인하기']],
    ['직접 실행해보기', '실제 운동을 완료해보는 단계입니다.', ['첫 운동 일정 정하기', '실제 운동 완료하기', '난이도와 몸 상태 기록하기']],
    ['취미로 만들지 판단하기', '나에게 맞는 운동 루틴을 정하는 단계입니다.', ['주간 운동 루틴 정하기', '계속할 방식 선택하기', '다음 운동 날짜 정하기']]
  ],
  '사진/영상': [
    ['취미 기본정보 알기', '찍고 싶은 주제와 장비를 확인하는 단계입니다.', ['찍고 싶은 주제 정하기', '필요한 장비나 앱 확인하기', '기본 촬영 구도 알아보기']],
    ['온라인으로 가볍게 체험하기', '주변에서 바로 촬영하고 편집해보는 단계입니다.', ['촬영/편집 입문 영상 보기', '주변에서 사진이나 영상 3개 찍어보기', '간단한 보정 또는 편집 해보기']],
    ['오프라인 클래스 또는 체험 알아보기', '촬영 장소와 배울 수 있는 방법을 찾는 단계입니다.', ['사진/영상 클래스 찾기', '촬영 장소 후보 찾기', '장비 대여나 구매 비용 확인하기']],
    ['직접 실행해보기', '하나의 결과물을 만드는 단계입니다.', ['직접 촬영해보기', '결과물 저장하기', '좋았던 점과 아쉬운 점 기록하기']],
    ['취미로 만들지 판단하기', '다음 프로젝트를 정하는 단계입니다.', ['다음 촬영 주제 정하기', '계속할 방식 정하기', '결과물 모음 만들기']]
  ],
  '댄스': [
    ['취미 기본정보 알기', '배우고 싶은 장르와 준비물을 정하는 단계입니다.', ['배우고 싶은 장르 정하기', '필요한 공간과 복장 확인하기', '난이도 확인하기']],
    ['온라인으로 가볍게 체험하기', '짧은 안무로 먼저 몸에 맞는지 보는 단계입니다.', ['짧은 안무 영상 고르기', '15초 구간만 반복 연습하기', '거울 앞에서 따라 해보기']],
    ['오프라인 클래스 또는 체험 알아보기', '학원과 클래스를 비교하는 단계입니다.', ['근처 댄스학원이나 원데이 클래스 찾기', '클래스 비용 비교하기', '같이 배울 사람이나 모임 찾아보기']],
    ['직접 실행해보기', '한 곡 일부를 직접 따라 해보는 단계입니다.', ['실제로 한 곡 일부 따라 해보기', '짧게 촬영해서 확인하기', '어려웠던 동작 기록하기']],
    ['취미로 만들지 판단하기', '계속할 장르와 방식을 정하는 단계입니다.', ['다음 연습 구간 정하기', '클래스 등록 여부 정하기', '계속할 장르 정하기']]
  ],
  '격투 스포츠': [
    ['취미 기본정보 알기', '안전과 장비를 먼저 확인하는 단계입니다.', ['종목별 특징 알아보기', '안전수칙 확인하기', '필요한 장비 확인하기']],
    ['온라인으로 가볍게 체험하기', '기본 동작으로 체력 부담을 확인하는 단계입니다.', ['기본 동작 영상 보기', '10분 기본 동작 따라 하기', '내 체력 부담 기록하기']],
    ['오프라인 클래스 또는 체험 알아보기', '운동 시설과 수업 조건을 비교하는 단계입니다.', ['근처 운동 시설 찾기', '체험 수업 가능 여부 확인하기', '수업 비용 비교하기']],
    ['직접 실행해보기', '첫 체험에 참여하는 단계입니다.', ['첫 체험 일정 정하기', '체험 수업 참여하기', '난이도와 재미 기록하기']],
    ['취미로 만들지 판단하기', '계속할지와 장비 구매 여부를 정하는 단계입니다.', ['계속할지 판단하기', '장비 구매 여부 정하기', '다음 수업 일정 정하기']]
  ],
  '계절 스포츠': [
    ['취미 기본정보 알기', '시즌, 장소, 안전을 먼저 확인하는 단계입니다.', ['가능한 시즌과 장소 확인하기', '안전수칙 확인하기', '장비 대여 여부 확인하기']],
    ['온라인으로 가볍게 체험하기', '영상과 후기로 체험 감을 잡는 단계입니다.', ['입문 영상 보기', '기본 자세나 안전 동작 익히기', '체험 후기 찾아보기']],
    ['오프라인 클래스 또는 체험 알아보기', '예약 가능한 장소와 비용을 확인하는 단계입니다.', ['체험 가능한 장소 찾기', '장비 대여 비용 확인하기', '예약 가능 여부 확인하기']],
    ['직접 실행해보기', '실제 체험을 완료하는 단계입니다.', ['체험 날짜 정하기', '실제 체험하기', '비용, 재미, 난이도 기록하기']],
    ['취미로 만들지 판단하기', '다음 시즌과 동행을 정하는 단계입니다.', ['다시 하고 싶은지 판단하기', '다음 시즌 계획하기', '같이 갈 사람 정하기']]
  ],
  default: [
    ['취미 기본정보 알기', '이 취미가 어떤 활동인지, 비용과 난이도를 먼저 파악하는 단계입니다.', ['기본 개념 알아보기', '필요한 준비물 확인하기', '난이도와 장단점 살펴보기']],
    ['온라인으로 가볍게 체험하기', '바로 돈을 쓰기 전에 영상이나 자료로 먼저 맛보는 단계입니다.', ['입문 영상 1개 보기', '10분만 따라 해보기', '첫 느낌 기록하기']],
    ['오프라인 클래스 또는 체험 알아보기', '실제로 배울 수 있는 장소나 사람을 찾아보는 단계입니다.', ['근처 클래스 검색하기', '가격 비교하기', '체험 후보 1곳 저장하기']],
    ['직접 실행해보기', '이제 실제로 한 번 해보는 단계입니다.', ['체험 날짜 정하기', '첫 체험 완료하기', '체험 후 기록 남기기']],
    ['취미로 만들지 판단하기', '이 활동을 계속할지 결정하는 단계입니다.', ['계속할 마음 체크하기', '다음 행동 정하기', '취미 퀘스트 완료하기']]
  ]
};

const specialMissionCategoryMap = {
  '음악이론/보컬': '악기',
  '미술/드로잉': '공예',
  '취업 준비 컨설팅': 'default',
  '투자/N잡': 'default',
  '연기/마술': 'default',
  '스포츠': '구기 스포츠',
  '취미/생활': 'default',
  '패션/미용': 'default',
  '국악': '악기',
  '기타 취미/자기계발': 'default'
};

const slugify = (text) => text
  .toLowerCase()
  .replace(/[()]/g, '')
  .replace(/[^a-z0-9가-힣]+/g, '_')
  .replace(/^_+|_+$/g, '');

const missionTypeByIndex = ['learn', 'research', 'learn', 'learn', 'action', 'record', 'research', 'research', 'prepare', 'plan', 'action', 'record', 'reflect', 'plan', 'complete'];
const progressByStage = [5, 10, 10, 12, 8];
const rewardByMissionType = {
  learn: 4,
  research: 4,
  prepare: 4,
  plan: 5,
  record: 5,
  reflect: 5,
  action: 7,
  complete: 8
};

function buildMissionStages(hobbyName, category) {
  const key = missionTemplates[category] ? category : specialMissionCategoryMap[category] || 'default';
  const template = missionTemplates[key] || missionTemplates.default;
  let missionCounter = 0;

  return template.map(([title, description, missions], stageIndex) => ({
    id: `stage_${stageIndex + 1}`,
    title,
    description,
    missions: missions.map((missionTitle, missionIndex) => {
      missionCounter += 1;
      const missionType = missionTypeByIndex[missionCounter - 1] || 'action';
      return {
        id: `mission_${stageIndex + 1}_${missionIndex + 1}`,
        title: missionTitle.replace('이 취미', hobbyName),
        description: `${hobbyName}을/를 시작하기 위해 “${missionTitle}” 미션을 완료해보세요.`,
        type: missionType,
        progressValue: progressByStage[stageIndex],
        rewardScore: rewardByMissionType[missionType] || 5
      };
    })
  }));
}

function getStartTip(category) {
  if (['구기 스포츠', '피트니스', '스포츠', '격투 스포츠'].includes(category)) return '가까운 시설에서 원데이 체험이나 30분 연습부터 시작해보세요.';
  if (['공예', '미술/드로잉', '요리/조리'].includes(category)) return '작은 키트나 쉬운 레시피 하나로 첫 결과물을 만들어보세요.';
  if (['악기', '국악', '음악이론/보컬'].includes(category)) return '입문 영상 하나를 보고 10~15분만 따라 해보세요.';
  if (category === '계절 스포츠') return '시즌, 안전수칙, 장비 대여 여부를 먼저 확인한 뒤 체험 일정을 잡아보세요.';
  return '입문 영상이나 후기 하나를 보고 부담 없는 첫 행동을 정해보세요.';
}

function buildDescription(name, category) {
  const meta = categoryMeta[category];
  if (name === '탁구 레슨') return '짧은 시간에도 몰입감 있게 즐길 수 있는 실내 스포츠';
  if (name === '캘리그라피 레슨') return '글씨를 통해 나만의 표현과 결과물을 남기는 차분한 창작 취미';
  if (name === '요가') return '몸의 긴장을 풀고 꾸준한 루틴을 만들기 좋은 운동 취미';
  if (name === '클라이밍/암벽등반 레슨') return '도전감과 성취감이 강한 전신 스포츠';
  return `${meta?.reason || '새로운 취미 경험을 만들 수 있는 활동입니다.'}`;
}

export const categories = Object.keys(hobbyCategories);

export const hobbies = Object.entries(hobbyCategories).flatMap(([category, names]) => {
  const meta = categoryMeta[category] || categoryMeta['기타 취미/자기계발'];
  return names.map((name, index) => ({
    id: `${slugify(category)}_${slugify(name)}_${index}`,
    name,
    category,
    description: buildDescription(name, category),
    tags: meta.tags,
    costLevel: meta.costLevel,
    timeLevel: meta.timeLevel,
    difficulty: meta.difficulty,
    placeType: meta.placeType,
    socialType: meta.socialType,
    requiredItems: meta.requiredItems,
    estimatedCost: meta.costLevel === '낮음' ? '0원~2만 원대부터 시작 가능' : meta.costLevel === '높음' ? '1회 5만~15만 원 이상' : '1회 1만~5만 원대',
    recommendedReasonText: meta.reason,
    experienceReview: meta.review,
    startTip: getStartTip(category),
    missionStages: buildMissionStages(name, category),
    achievement: {
      id: `${slugify(name)}_beginner`,
      title: `${name.replace(/ 레슨| 강습| 입문/g, '')} 입문자`,
      description: `${name} 취미 퀘스트를 100% 완료했습니다.`
    }
  }));
});

export const hobbyMap = hobbies.reduce((acc, hobby) => {
  acc[hobby.id] = hobby;
  return acc;
}, {});

export const getHobbiesByCategory = (category) => hobbies.filter((hobby) => hobby.category === category);
``````

## src/data/questions.js
```jsx
export const traitLabels = {
  activity: '활동성',
  creativity: '창의성',
  social: '사교성',
  challenge: '도전성',
  focus: '몰입성',
  routine: '꾸준함',
  costSensitive: '실속형',
  outdoor: '야외 선호',
  indoor: '실내 선호',
  expression: '표현력'
};

export const defaultTraits = {
  activity: 0,
  creativity: 0,
  social: 0,
  challenge: 0,
  focus: 0,
  routine: 0,
  costSensitive: 0,
  outdoor: 0,
  indoor: 0,
  expression: 0
};

export const surveyQuestions = [
  {
    id: 'q1',
    title: '쉬는 날에 더 끌리는 쪽은?',
    subtitle: '취미 지도 첫 갈림길입니다. 침대도 강력한 보스몹이긴 하죠.',
    options: [
      {
        optionId: 'active',
        label: '몸을 움직이는 활동이 좋아요',
        categoryEffects: { '구기 스포츠': 8, '피트니스': 8, '스포츠': 7, '격투 스포츠': 6, '댄스': 5 },
        traitEffects: { activity: 3, challenge: 1, outdoor: 1 },
        tagEffects: { '활동적': 4, '운동': 4, '도전': 2 }
      },
      {
        optionId: 'calm',
        label: '조용히 집중하면서 쉬고 싶어요',
        categoryEffects: { '공예': 8, '미술/드로잉': 8, '취미/생활': 6, '국악': 3, '악기': 3 },
        traitEffects: { focus: 3, indoor: 2, social: -1 },
        tagEffects: { '몰입': 4, '정적': 4, '실내': 2, '혼자': 2 }
      },
      {
        optionId: 'creative',
        label: '무언가 만들고 표현하고 싶어요',
        categoryEffects: { '미술/드로잉': 8, '사진/영상': 7, '공예': 8, '음악이론/보컬': 5, '요리/조리': 5 },
        traitEffects: { creativity: 3, expression: 2 },
        tagEffects: { '창작': 4, '결과물': 4, '표현': 3 }
      },
      {
        optionId: 'social',
        label: '사람들과 함께하는 활동이 좋아요',
        categoryEffects: { '구기 스포츠': 7, '댄스': 8, '연기/마술': 6, '계절 스포츠': 5, '요리/조리': 4 },
        traitEffects: { social: 3, activity: 1 },
        tagEffects: { '함께': 4, '커뮤니티': 3, '팀': 3 }
      }
    ]
  },
  {
    id: 'q2',
    title: '취미를 시작할 때 가장 중요한 조건은?',
    subtitle: '현실 조건 무시하면 취미가 아니라 고난의 행군입니다.',
    options: [
      {
        optionId: 'cheap',
        label: '비용 부담이 적었으면 좋겠어요',
        categoryEffects: { '취미/생활': 8, '미술/드로잉': 6, '공예': 6, '투자/N잡': 4, '기타 취미/자기계발': 4 },
        traitEffects: { costSensitive: 3 },
        tagEffects: { '실속형': 5, '실내': 1 }
      },
      {
        optionId: 'quick',
        label: '짧은 시간에도 할 수 있어야 해요',
        categoryEffects: { '피트니스': 7, '취미/생활': 7, '구기 스포츠': 5, '패션/미용': 5, '미술/드로잉': 4 },
        traitEffects: { routine: 1, focus: 1 },
        tagEffects: { '짧음': 5, '루틴': 3 }
      },
      {
        optionId: 'easy',
        label: '시작 방법이 쉬웠으면 좋겠어요',
        categoryEffects: { '요리/조리': 7, '공예': 6, '취미/생활': 7, '피트니스': 5, '패션/미용': 4 },
        traitEffects: { challenge: -1, indoor: 1 },
        tagEffects: { '쉬움': 5, '실내': 2 }
      },
      {
        optionId: 'growth',
        label: '실력이 느는 게 보여야 해요',
        categoryEffects: { '악기': 8, '구기 스포츠': 7, '피트니스': 6, '격투 스포츠': 5, '댄스': 5 },
        traitEffects: { routine: 3, challenge: 2 },
        tagEffects: { '성장감': 5, '도전': 3, '연습': 3 }
      }
    ]
  },
  {
    id: 'q3',
    title: '혼자 하는 취미와 함께 하는 취미 중 어디에 가까워요?',
    subtitle: '파티 플레이냐 솔로 랭크냐, 중요한 문제입니다.',
    options: [
      {
        optionId: 'alone',
        label: '혼자 몰입하는 게 편해요',
        categoryEffects: { '공예': 8, '미술/드로잉': 7, '취미/생활': 7, '사진/영상': 5, '악기': 5 },
        traitEffects: { focus: 3, social: -1 },
        tagEffects: { '혼자': 5, '몰입': 4, '정적': 2 }
      },
      {
        optionId: 'together',
        label: '누군가와 같이 해야 더 재밌어요',
        categoryEffects: { '구기 스포츠': 8, '댄스': 7, '연기/마술': 6, '계절 스포츠': 5, '요리/조리': 4 },
        traitEffects: { social: 3 },
        tagEffects: { '함께': 5, '커뮤니티': 3, '팀': 3 }
      },
      {
        optionId: 'both',
        label: '혼자 시작해도 같이 즐길 수 있으면 좋아요',
        categoryEffects: { '사진/영상': 6, '요리/조리': 6, '피트니스': 5, '음악이론/보컬': 5, '패션/미용': 4 },
        traitEffects: { social: 1, focus: 1 },
        tagEffects: { '혼자': 2, '함께': 2, '성장감': 1 }
      }
    ]
  },
  {
    id: 'q4',
    title: '취미 결과물이 남는 걸 좋아하나요?',
    subtitle: '기록파인지 경험파인지 확인하는 구간입니다.',
    options: [
      {
        optionId: 'result',
        label: '네, 만든 결과물이 남으면 뿌듯해요',
        categoryEffects: { '공예': 8, '미술/드로잉': 8, '사진/영상': 7, '요리/조리': 6, '패션/미용': 4 },
        traitEffects: { creativity: 3, expression: 1 },
        tagEffects: { '결과물': 5, '창작': 4, '표현': 1 }
      },
      {
        optionId: 'experience',
        label: '결과물보다 경험 자체가 더 중요해요',
        categoryEffects: { '스포츠': 8, '계절 스포츠': 8, '구기 스포츠': 6, '피트니스': 5, '격투 스포츠': 5 },
        traitEffects: { activity: 2, challenge: 1 },
        tagEffects: { '경험': 5, '활동적': 3, '야외': 2 }
      },
      {
        optionId: 'record',
        label: '기록이나 성장 로그가 남으면 좋아요',
        categoryEffects: { '투자/N잡': 6, '취업 준비 컨설팅': 6, '피트니스': 6, '취미/생활': 5, '악기': 4 },
        traitEffects: { routine: 2, focus: 2 },
        tagEffects: { '기록': 4, '루틴': 4, '성장감': 2 }
      }
    ]
  },
  {
    id: 'q5',
    title: '실내와 야외 중 어디가 더 좋아요?',
    subtitle: '햇빛과 에어컨 사이의 운명적 선택.',
    options: [
      {
        optionId: 'indoor',
        label: '실내가 좋아요',
        categoryEffects: { '공예': 6, '악기': 6, '미술/드로잉': 6, '피트니스': 5, '요리/조리': 5, '취미/생활': 5 },
        traitEffects: { indoor: 3 },
        tagEffects: { '실내': 5 }
      },
      {
        optionId: 'outdoor',
        label: '야외에서 하는 게 좋아요',
        categoryEffects: { '스포츠': 8, '계절 스포츠': 8, '사진/영상': 5, '구기 스포츠': 5, '기타 취미/자기계발': 2 },
        traitEffects: { outdoor: 3, activity: 1 },
        tagEffects: { '야외': 5, '활동적': 2 }
      },
      {
        optionId: 'access',
        label: '장소보다 접근성이 중요해요',
        categoryEffects: { '구기 스포츠': 5, '피트니스': 5, '사진/영상': 4, '취미/생활': 6, '공예': 4 },
        traitEffects: { costSensitive: 1, routine: 1 },
        tagEffects: { '실속형': 2, '루틴': 2, '짧음': 2 }
      }
    ]
  },
  {
    id: 'q6',
    title: '취미에서 원하는 감정은?',
    subtitle: '이거 은근 핵심입니다. 취미의 맛을 고르는 느낌.',
    options: [
      {
        optionId: 'stress',
        label: '스트레스가 확 풀렸으면 좋겠어요',
        categoryEffects: { '격투 스포츠': 8, '피트니스': 7, '구기 스포츠': 6, '댄스': 5, '스포츠': 5 },
        traitEffects: { activity: 2, challenge: 1 },
        tagEffects: { '활동적': 4, '도전': 3, '운동': 3 }
      },
      {
        optionId: 'heal',
        label: '마음이 차분해졌으면 좋겠어요',
        categoryEffects: { '공예': 8, '취미/생활': 8, '국악': 5, '미술/드로잉': 6, '피트니스': 4 },
        traitEffects: { focus: 3, routine: 1 },
        tagEffects: { '정적': 4, '몰입': 4, '루틴': 1 }
      },
      {
        optionId: 'proud',
        label: '내가 성장했다는 느낌이 좋아요',
        categoryEffects: { '악기': 8, '피트니스': 7, '구기 스포츠': 6, '취업 준비 컨설팅': 6, '댄스': 4 },
        traitEffects: { routine: 3, challenge: 2 },
        tagEffects: { '성장감': 5, '루틴': 3, '도전': 2 }
      },
      {
        optionId: 'express',
        label: '나를 표현하고 싶어요',
        categoryEffects: { '댄스': 8, '음악이론/보컬': 8, '연기/마술': 8, '패션/미용': 6, '사진/영상': 5 },
        traitEffects: { expression: 3, creativity: 2 },
        tagEffects: { '표현': 5, '창작': 3, '함께': 1 }
      }
    ]
  },
  {
    id: 'q7',
    title: '새로운 걸 배울 때 나는 보통?',
    subtitle: '고난이도 보스전에 강한 타입인지 봅니다.',
    options: [
      {
        optionId: 'challenge',
        label: '어려워도 도전하는 게 재밌어요',
        categoryEffects: { '격투 스포츠': 8, '계절 스포츠': 7, '스포츠': 6, '악기': 5, '구기 스포츠': 5 },
        traitEffects: { challenge: 3, routine: 1 },
        tagEffects: { '도전': 5, '난이도': 3, '성장감': 2 }
      },
      {
        optionId: 'safe',
        label: '쉬운 것부터 천천히 시작하고 싶어요',
        categoryEffects: { '취미/생활': 8, '공예': 7, '요리/조리': 6, '미술/드로잉': 6, '패션/미용': 4 },
        traitEffects: { challenge: -1, routine: 1 },
        tagEffects: { '쉬움': 5, '실내': 2 }
      },
      {
        optionId: 'guide',
        label: '누가 옆에서 알려주면 잘 따라가요',
        categoryEffects: { '피트니스': 6, '댄스': 6, '구기 스포츠': 6, '취업 준비 컨설팅': 6, '음악이론/보컬': 4 },
        traitEffects: { social: 2, routine: 1 },
        tagEffects: { '함께': 3, '성장감': 3, '커뮤니티': 2 }
      }
    ]
  },
  {
    id: 'q8',
    title: '관심 있는 분위기에 가까운 것은?',
    subtitle: '이제 카테고리를 꽤 좁혀봅니다. 추천 나침반 열일 중.',
    options: [
      {
        optionId: 'art',
        label: '그림, 디자인, 만들기 같은 창작 분위기',
        categoryEffects: { '미술/드로잉': 9, '공예': 9, '사진/영상': 5, '패션/미용': 3 },
        traitEffects: { creativity: 3, focus: 1 },
        tagEffects: { '창작': 5, '결과물': 4, '몰입': 1 }
      },
      {
        optionId: 'music',
        label: '음악, 노래, 연주 같은 표현 분위기',
        categoryEffects: { '악기': 9, '음악이론/보컬': 9, '국악': 7, '연기/마술': 3 },
        traitEffects: { expression: 3, routine: 1 },
        tagEffects: { '표현': 5, '몰입': 2, '성장감': 2 }
      },
      {
        optionId: 'sport',
        label: '운동, 승부, 체력 같은 활동 분위기',
        categoryEffects: { '구기 스포츠': 9, '피트니스': 8, '스포츠': 8, '격투 스포츠': 7, '댄스': 4 },
        traitEffects: { activity: 3, challenge: 1 },
        tagEffects: { '활동적': 5, '경쟁': 4, '운동': 3 }
      },
      {
        optionId: 'life',
        label: '생활, 자기관리, 실용적인 성장 분위기',
        categoryEffects: { '취미/생활': 8, '요리/조리': 7, '패션/미용': 6, '투자/N잡': 6, '취업 준비 컨설팅': 6 },
        traitEffects: { routine: 2, costSensitive: 1 },
        tagEffects: { '루틴': 4, '실속형': 3, '기록': 2 }
      }
    ]
  },
  {
    id: 'q9',
    title: '취미에 쓸 수 있는 시간은 어느 정도인가요?',
    subtitle: '욕심은 취미 생활 완성, 현실은 과제 제출 23:59일 수 있으니까요.',
    options: [
      {
        optionId: 'short',
        label: '하루 10~30분 정도',
        categoryEffects: { '취미/생활': 8, '피트니스': 6, '미술/드로잉': 5, '악기': 5, '패션/미용': 4 },
        traitEffects: { routine: 1, focus: 1 },
        tagEffects: { '짧음': 5, '루틴': 3 }
      },
      {
        optionId: 'medium',
        label: '주 1~2회, 1시간 정도',
        categoryEffects: { '구기 스포츠': 6, '공예': 6, '요리/조리': 6, '댄스': 6, '사진/영상': 5 },
        traitEffects: { routine: 2 },
        tagEffects: { '성장감': 3, '함께': 1 }
      },
      {
        optionId: 'long',
        label: '반나절 정도 투자해도 좋아요',
        categoryEffects: { '계절 스포츠': 8, '스포츠': 8, '사진/영상': 5, '요리/조리': 4, '격투 스포츠': 4 },
        traitEffects: { challenge: 2, outdoor: 1 },
        tagEffects: { '경험': 5, '야외': 3, '도전': 2 }
      }
    ]
  },
  {
    id: 'q10',
    title: '마지막으로, 지금 가장 끌리는 한 문장은?',
    subtitle: '나침반 최종 보정입니다. 삐빅, 취미 후보 탐색 중.',
    options: [
      {
        optionId: 'move',
        label: '몸을 움직이며 기분 전환하고 싶다',
        categoryEffects: { '피트니스': 8, '구기 스포츠': 8, '댄스': 6, '격투 스포츠': 6, '스포츠': 5 },
        traitEffects: { activity: 3 },
        tagEffects: { '활동적': 5, '운동': 3 }
      },
      {
        optionId: 'make',
        label: '내 손으로 뭔가를 완성하고 싶다',
        categoryEffects: { '공예': 8, '요리/조리': 8, '미술/드로잉': 8, '사진/영상': 4 },
        traitEffects: { creativity: 3, focus: 1 },
        tagEffects: { '결과물': 5, '창작': 4 }
      },
      {
        optionId: 'express',
        label: '사람들 앞에서 나를 표현해보고 싶다',
        categoryEffects: { '음악이론/보컬': 8, '댄스': 8, '연기/마술': 8, '패션/미용': 5 },
        traitEffects: { expression: 3, social: 1 },
        tagEffects: { '표현': 5, '함께': 2 }
      },
      {
        optionId: 'grow',
        label: '꾸준히 쌓이는 취미 루틴을 만들고 싶다',
        categoryEffects: { '악기': 6, '피트니스': 6, '취미/생활': 6, '투자/N잡': 5, '취업 준비 컨설팅': 5 },
        traitEffects: { routine: 3, focus: 1 },
        tagEffects: { '루틴': 5, '성장감': 4, '기록': 2 }
      }
    ]
  }
];

const adaptiveQuestionSets = {
  active: [
    {
      id: 'adaptive_active_1',
      title: '몸을 쓰는 취미라면 어떤 리듬이 좋아요?',
      subtitle: '취미가 일상에 들어오는 속도를 살짝 맞춰봅니다.',
      options: [
        {
          optionId: 'quick_sweat',
          label: '짧고 확실하게 땀나는 활동',
          categoryEffects: { '피트니스': 8, '격투 스포츠': 6, '댄스': 5 },
          traitEffects: { activity: 3, routine: 1 },
          tagEffects: { '운동': 5, '짧음': 3, '루틴': 2 }
        },
        {
          optionId: 'game_flow',
          label: '승부나 게임처럼 몰입되는 활동',
          categoryEffects: { '구기 스포츠': 8, '스포츠': 7, '계절 스포츠': 4 },
          traitEffects: { challenge: 3, social: 1 },
          tagEffects: { '경쟁': 5, '도전': 3, '함께': 2 }
        },
        {
          optionId: 'move_express',
          label: '움직이면서 표현하는 활동',
          categoryEffects: { '댄스': 8, '연기/마술': 5, '음악이론/보컬': 4 },
          traitEffects: { expression: 3, activity: 1 },
          tagEffects: { '표현': 5, '활동적': 3, '창작': 1 }
        }
      ]
    },
    {
      id: 'adaptive_active_2',
      title: '처음 시작할 때 더 편한 방식은?',
      subtitle: '진입 장벽을 낮추는 쪽으로 후보를 좁혀볼게요.',
      options: [
        {
          optionId: 'lesson',
          label: '강습이나 레슨으로 배우기',
          categoryEffects: { '구기 스포츠': 6, '피트니스': 6, '격투 스포츠': 6, '댄스': 5 },
          traitEffects: { routine: 2, social: 1 },
          tagEffects: { '성장감': 4, '함께': 2, '연습': 2 }
        },
        {
          optionId: 'solo_trial',
          label: '혼자 가볍게 체험해보기',
          categoryEffects: { '피트니스': 7, '스포츠': 5, '취미/생활': 4 },
          traitEffects: { focus: 1, costSensitive: 1 },
          tagEffects: { '혼자': 3, '실속형': 3, '쉬움': 2 }
        },
        {
          optionId: 'with_people',
          label: '친구나 모임과 같이 시작하기',
          categoryEffects: { '구기 스포츠': 7, '댄스': 6, '계절 스포츠': 5 },
          traitEffects: { social: 3 },
          tagEffects: { '함께': 5, '커뮤니티': 4, '팀': 3 }
        }
      ]
    },
    {
      id: 'adaptive_active_3',
      title: '활동 후에 남았으면 하는 느낌은?',
      subtitle: '취미의 뒷맛도 꽤 중요하니까요.',
      options: [
        {
          optionId: 'refreshed',
          label: '몸이 개운해지는 느낌',
          categoryEffects: { '피트니스': 8, '스포츠': 6, '격투 스포츠': 5 },
          traitEffects: { activity: 2, routine: 2 },
          tagEffects: { '운동': 5, '루틴': 3 }
        },
        {
          optionId: 'won',
          label: '해냈다는 성취감',
          categoryEffects: { '격투 스포츠': 7, '구기 스포츠': 7, '계절 스포츠': 5 },
          traitEffects: { challenge: 3 },
          tagEffects: { '도전': 5, '성장감': 3 }
        },
        {
          optionId: 'shared',
          label: '같이 웃고 떠든 기억',
          categoryEffects: { '구기 스포츠': 7, '댄스': 6, '요리/조리': 4 },
          traitEffects: { social: 3 },
          tagEffects: { '함께': 5, '커뮤니티': 3 }
        }
      ]
    },
    {
      id: 'adaptive_active_4',
      title: '난이도는 어느 정도가 좋아요?',
      subtitle: '너무 쉬워도 심심하고, 너무 어려워도 도망가고 싶죠.',
      options: [
        {
          optionId: 'gentle',
          label: '부담 없이 꾸준히 할 수 있는 정도',
          categoryEffects: { '피트니스': 7, '취미/생활': 5, '댄스': 4 },
          traitEffects: { routine: 2, challenge: -1 },
          tagEffects: { '루틴': 4, '쉬움': 3 }
        },
        {
          optionId: 'medium_challenge',
          label: '조금 어려워도 성장감이 있는 정도',
          categoryEffects: { '구기 스포츠': 7, '악기': 4, '격투 스포츠': 5 },
          traitEffects: { challenge: 2, routine: 2 },
          tagEffects: { '성장감': 5, '도전': 3 }
        },
        {
          optionId: 'bold',
          label: '확실한 도전이 되는 정도',
          categoryEffects: { '격투 스포츠': 8, '계절 스포츠': 7, '스포츠': 5 },
          traitEffects: { challenge: 3, outdoor: 1 },
          tagEffects: { '도전': 5, '난이도': 4, '야외': 2 }
        }
      ]
    }
  ],
  creative: [
    {
      id: 'adaptive_creative_1',
      title: '만드는 취미라면 어떤 결과물이 좋아요?',
      subtitle: '취향의 결을 조금 더 좁혀봅니다.',
      options: [
        {
          optionId: 'hands',
          label: '손으로 만든 물건이나 작품',
          categoryEffects: { '공예': 9, '미술/드로잉': 6, '패션/미용': 4 },
          traitEffects: { creativity: 3, focus: 1 },
          tagEffects: { '창작': 5, '결과물': 5, '몰입': 2 }
        },
        {
          optionId: 'visual',
          label: '사진, 영상, 이미지처럼 기록되는 것',
          categoryEffects: { '사진/영상': 9, '미술/드로잉': 5, '패션/미용': 4 },
          traitEffects: { expression: 2, creativity: 2 },
          tagEffects: { '표현': 4, '결과물': 4, '기록': 3 }
        },
        {
          optionId: 'taste',
          label: '먹거나 나눌 수 있는 결과물',
          categoryEffects: { '요리/조리': 9, '취미/생활': 4, '공예': 3 },
          traitEffects: { creativity: 2, social: 1 },
          tagEffects: { '결과물': 4, '함께': 2, '쉬움': 2 }
        }
      ]
    },
    {
      id: 'adaptive_creative_2',
      title: '작업할 때 더 끌리는 분위기는?',
      subtitle: '취미 시간의 온도를 맞춰보는 질문입니다.',
      options: [
        {
          optionId: 'quiet_focus',
          label: '조용히 혼자 몰입하는 분위기',
          categoryEffects: { '미술/드로잉': 8, '공예': 7, '악기': 4 },
          traitEffects: { focus: 3, indoor: 1 },
          tagEffects: { '몰입': 5, '혼자': 4, '정적': 3 }
        },
        {
          optionId: 'class_mood',
          label: '클래스에서 같이 만들어보는 분위기',
          categoryEffects: { '공예': 7, '요리/조리': 7, '사진/영상': 4 },
          traitEffects: { social: 2, creativity: 1 },
          tagEffects: { '함께': 4, '커뮤니티': 2, '창작': 2 }
        },
        {
          optionId: 'share_mood',
          label: '완성해서 보여주고 공유하는 분위기',
          categoryEffects: { '사진/영상': 7, '음악이론/보컬': 5, '패션/미용': 6 },
          traitEffects: { expression: 3 },
          tagEffects: { '표현': 5, '결과물': 3 }
        }
      ]
    },
    {
      id: 'adaptive_creative_3',
      title: '처음 만들 결과물은 어느 정도가 좋아요?',
      subtitle: '첫 성공 경험을 만들기 위한 난이도 조절입니다.',
      options: [
        {
          optionId: 'tiny',
          label: '작고 빠르게 완성되는 것',
          categoryEffects: { '취미/생활': 7, '공예': 6, '패션/미용': 5 },
          traitEffects: { costSensitive: 1, routine: 1 },
          tagEffects: { '짧음': 4, '쉬움': 4, '실속형': 2 }
        },
        {
          optionId: 'portfolio',
          label: '시간을 들여 제대로 남기는 것',
          categoryEffects: { '미술/드로잉': 8, '사진/영상': 7, '악기': 4 },
          traitEffects: { focus: 2, routine: 2 },
          tagEffects: { '성장감': 4, '기록': 3, '몰입': 3 }
        },
        {
          optionId: 'daily',
          label: '일상에서 자주 써먹을 수 있는 것',
          categoryEffects: { '요리/조리': 8, '패션/미용': 6, '취미/생활': 6 },
          traitEffects: { routine: 2, costSensitive: 1 },
          tagEffects: { '루틴': 4, '실속형': 3 }
        }
      ]
    },
    {
      id: 'adaptive_creative_4',
      title: '새로운 감각을 배운다면 어디가 좋아요?',
      subtitle: '취미가 남기는 감각을 골라봅니다.',
      options: [
        {
          optionId: 'color_shape',
          label: '색감, 형태, 구도',
          categoryEffects: { '미술/드로잉': 8, '사진/영상': 7, '공예': 5 },
          traitEffects: { creativity: 3 },
          tagEffects: { '창작': 5, '표현': 3 }
        },
        {
          optionId: 'sound_rhythm',
          label: '소리, 리듬, 호흡',
          categoryEffects: { '악기': 8, '음악이론/보컬': 8, '국악': 6 },
          traitEffects: { expression: 2, routine: 1 },
          tagEffects: { '표현': 5, '연습': 3 }
        },
        {
          optionId: 'texture_process',
          label: '재료의 질감과 만드는 과정',
          categoryEffects: { '공예': 8, '요리/조리': 6, '취미/생활': 5 },
          traitEffects: { focus: 2, creativity: 2 },
          tagEffects: { '몰입': 4, '결과물': 4 }
        }
      ]
    }
  ],
  expressive: [
    {
      id: 'adaptive_expressive_1',
      title: '표현하는 취미라면 어디에 가까워요?',
      subtitle: '내가 보여주고 싶은 방식은 사람마다 다르니까요.',
      options: [
        {
          optionId: 'voice',
          label: '목소리나 음악으로 표현하기',
          categoryEffects: { '음악이론/보컬': 9, '악기': 7, '국악': 6 },
          traitEffects: { expression: 3, routine: 1 },
          tagEffects: { '표현': 5, '성장감': 3 }
        },
        {
          optionId: 'body',
          label: '몸짓이나 무대감으로 표현하기',
          categoryEffects: { '댄스': 9, '연기/마술': 8, '격투 스포츠': 3 },
          traitEffects: { expression: 3, activity: 2 },
          tagEffects: { '표현': 5, '활동적': 3, '함께': 2 }
        },
        {
          optionId: 'style',
          label: '스타일이나 이미지로 표현하기',
          categoryEffects: { '패션/미용': 9, '사진/영상': 7, '미술/드로잉': 4 },
          traitEffects: { creativity: 2, expression: 2 },
          tagEffects: { '표현': 5, '결과물': 3 }
        }
      ]
    },
    {
      id: 'adaptive_expressive_2',
      title: '다른 사람의 반응은 어느 정도 중요해요?',
      subtitle: '관객이 있어야 사는 타입인지 살짝 봅니다.',
      options: [
        {
          optionId: 'private',
          label: '일단 나만 만족해도 충분해요',
          categoryEffects: { '악기': 6, '사진/영상': 5, '미술/드로잉': 5 },
          traitEffects: { focus: 2, social: -1 },
          tagEffects: { '혼자': 4, '몰입': 3 }
        },
        {
          optionId: 'small_share',
          label: '가까운 사람에게 보여주고 싶어요',
          categoryEffects: { '사진/영상': 7, '요리/조리': 5, '패션/미용': 5 },
          traitEffects: { social: 1, expression: 1 },
          tagEffects: { '함께': 3, '표현': 3 }
        },
        {
          optionId: 'stage',
          label: '무대나 발표처럼 확실한 반응이 좋아요',
          categoryEffects: { '댄스': 8, '음악이론/보컬': 8, '연기/마술': 8 },
          traitEffects: { social: 3, expression: 3 },
          tagEffects: { '표현': 5, '커뮤니티': 3, '도전': 2 }
        }
      ]
    },
    {
      id: 'adaptive_expressive_3',
      title: '연습 과정은 어떤 쪽이 맞아요?',
      subtitle: '표현형 취미도 루틴이 맞아야 오래 갑니다.',
      options: [
        {
          optionId: 'daily_repeat',
          label: '짧게 반복하며 감각을 쌓기',
          categoryEffects: { '악기': 7, '음악이론/보컬': 7, '댄스': 5 },
          traitEffects: { routine: 3, focus: 1 },
          tagEffects: { '루틴': 5, '연습': 4 }
        },
        {
          optionId: 'project',
          label: '하나의 결과물을 목표로 연습하기',
          categoryEffects: { '사진/영상': 7, '연기/마술': 6, '미술/드로잉': 5 },
          traitEffects: { creativity: 2, challenge: 1 },
          tagEffects: { '결과물': 4, '성장감': 3 }
        },
        {
          optionId: 'group_practice',
          label: '사람들과 맞춰보며 연습하기',
          categoryEffects: { '댄스': 8, '구기 스포츠': 4, '음악이론/보컬': 5 },
          traitEffects: { social: 3 },
          tagEffects: { '함께': 5, '커뮤니티': 3 }
        }
      ]
    },
    {
      id: 'adaptive_expressive_4',
      title: '표현할 때 가장 피하고 싶은 건?',
      subtitle: '취미가 부담이 되지 않게 조절해볼게요.',
      options: [
        {
          optionId: 'too_public',
          label: '처음부터 너무 공개적인 것',
          categoryEffects: { '사진/영상': 6, '악기': 5, '미술/드로잉': 5 },
          traitEffects: { focus: 2, social: -1 },
          tagEffects: { '혼자': 4, '몰입': 2 }
        },
        {
          optionId: 'too_static',
          label: '너무 가만히 앉아 있는 것',
          categoryEffects: { '댄스': 8, '연기/마술': 6, '피트니스': 4 },
          traitEffects: { activity: 2, expression: 1 },
          tagEffects: { '활동적': 4, '표현': 3 }
        },
        {
          optionId: 'too_expensive',
          label: '장비나 수업료가 갑자기 커지는 것',
          categoryEffects: { '취미/생활': 6, '패션/미용': 5, '음악이론/보컬': 4 },
          traitEffects: { costSensitive: 3 },
          tagEffects: { '실속형': 5, '쉬움': 2 }
        }
      ]
    }
  ],
  calm: [
    {
      id: 'adaptive_calm_1',
      title: '조용한 취미라면 어떤 몰입이 좋아요?',
      subtitle: '차분함에도 종류가 있습니다.',
      options: [
        {
          optionId: 'hands_focus',
          label: '손을 쓰며 천천히 빠져드는 몰입',
          categoryEffects: { '공예': 8, '미술/드로잉': 7, '취미/생활': 5 },
          traitEffects: { focus: 3, creativity: 1 },
          tagEffects: { '몰입': 5, '정적': 4, '창작': 2 }
        },
        {
          optionId: 'mind_routine',
          label: '마음이 정리되는 루틴형 몰입',
          categoryEffects: { '취미/생활': 8, '피트니스': 5, '국악': 4 },
          traitEffects: { routine: 3, indoor: 1 },
          tagEffects: { '루틴': 5, '정적': 3 }
        },
        {
          optionId: 'study_focus',
          label: '배우고 기록하며 쌓는 몰입',
          categoryEffects: { '투자/N잡': 7, '취업 준비 컨설팅': 7, '악기': 5 },
          traitEffects: { focus: 2, routine: 2 },
          tagEffects: { '기록': 4, '성장감': 4 }
        }
      ]
    },
    {
      id: 'adaptive_calm_2',
      title: '혼자 시작한다면 무엇이 있으면 좋아요?',
      subtitle: '혼자 해도 막막하지 않게 만드는 조건입니다.',
      options: [
        {
          optionId: 'clear_guide',
          label: '따라 하기 쉬운 가이드',
          categoryEffects: { '취미/생활': 7, '요리/조리': 6, '공예': 5 },
          traitEffects: { routine: 2, challenge: -1 },
          tagEffects: { '쉬움': 5, '루틴': 2 }
        },
        {
          optionId: 'small_tools',
          label: '작은 준비물과 낮은 비용',
          categoryEffects: { '미술/드로잉': 6, '취미/생활': 7, '패션/미용': 4 },
          traitEffects: { costSensitive: 3 },
          tagEffects: { '실속형': 5, '실내': 2 }
        },
        {
          optionId: 'visible_log',
          label: '내가 쌓은 기록이 보이는 것',
          categoryEffects: { '투자/N잡': 7, '악기': 5, '사진/영상': 5 },
          traitEffects: { routine: 2, focus: 2 },
          tagEffects: { '기록': 5, '성장감': 3 }
        }
      ]
    },
    {
      id: 'adaptive_calm_3',
      title: '취미 시간이 끝난 뒤 남았으면 하는 건?',
      subtitle: '결과물과 감정 사이에서 살짝 고르는 질문입니다.',
      options: [
        {
          optionId: 'calm_result',
          label: '작지만 완성된 결과물',
          categoryEffects: { '공예': 8, '요리/조리': 6, '미술/드로잉': 6 },
          traitEffects: { creativity: 2, focus: 1 },
          tagEffects: { '결과물': 5, '창작': 3 }
        },
        {
          optionId: 'clean_mind',
          label: '머리가 맑아지는 느낌',
          categoryEffects: { '취미/생활': 8, '피트니스': 5, '국악': 4 },
          traitEffects: { focus: 2, routine: 1 },
          tagEffects: { '정적': 4, '루틴': 3 }
        },
        {
          optionId: 'new_knowledge',
          label: '새로 알게 된 지식이나 요령',
          categoryEffects: { '취업 준비 컨설팅': 7, '투자/N잡': 7, '악기': 4 },
          traitEffects: { focus: 2, challenge: 1 },
          tagEffects: { '성장감': 4, '기록': 3 }
        }
      ]
    },
    {
      id: 'adaptive_calm_4',
      title: '취미 공간은 어떤 쪽이 좋아요?',
      subtitle: '공간 취향은 꾸준함에 꽤 큰 영향을 줍니다.',
      options: [
        {
          optionId: 'home',
          label: '집에서 바로 할 수 있는 것',
          categoryEffects: { '취미/생활': 8, '미술/드로잉': 6, '악기': 5 },
          traitEffects: { indoor: 3, costSensitive: 1 },
          tagEffects: { '실내': 5, '실속형': 2 }
        },
        {
          optionId: 'studio',
          label: '작업실이나 클래스에서 하는 것',
          categoryEffects: { '공예': 7, '요리/조리': 6, '사진/영상': 5 },
          traitEffects: { social: 1, creativity: 1 },
          tagEffects: { '함께': 3, '창작': 3 }
        },
        {
          optionId: 'anywhere',
          label: '장소를 크게 가리지 않는 것',
          categoryEffects: { '사진/영상': 6, '취미/생활': 6, '투자/N잡': 5 },
          traitEffects: { routine: 2 },
          tagEffects: { '루틴': 4, '짧음': 2 }
        }
      ]
    }
  ],
  practical: [
    {
      id: 'adaptive_practical_1',
      title: '실용적인 취미라면 어디에 가까워요?',
      subtitle: '재미와 쓸모의 균형점을 찾아봅니다.',
      options: [
        {
          optionId: 'daily_life',
          label: '일상 관리에 바로 도움 되는 것',
          categoryEffects: { '취미/생활': 8, '패션/미용': 6, '피트니스': 5 },
          traitEffects: { routine: 2, costSensitive: 1 },
          tagEffects: { '루틴': 5, '실속형': 3 }
        },
        {
          optionId: 'career_money',
          label: '커리어나 수입 가능성에 도움 되는 것',
          categoryEffects: { '취업 준비 컨설팅': 8, '투자/N잡': 8, '사진/영상': 4 },
          traitEffects: { challenge: 1, focus: 2 },
          tagEffects: { '성장감': 5, '기록': 3 }
        },
        {
          optionId: 'useful_making',
          label: '직접 만들고 써먹을 수 있는 것',
          categoryEffects: { '요리/조리': 8, '공예': 6, '취미/생활': 5 },
          traitEffects: { creativity: 2, routine: 1 },
          tagEffects: { '결과물': 4, '실속형': 3 }
        }
      ]
    },
    {
      id: 'adaptive_practical_2',
      title: '꾸준히 하기 위해 가장 필요한 조건은?',
      subtitle: '오래 갈 취미는 결국 생활에 맞아야 하니까요.',
      options: [
        {
          optionId: 'low_cost',
          label: '비용이 작게 유지되는 것',
          categoryEffects: { '취미/생활': 8, '미술/드로잉': 5, '피트니스': 4 },
          traitEffects: { costSensitive: 3 },
          tagEffects: { '실속형': 5, '쉬움': 2 }
        },
        {
          optionId: 'short_time',
          label: '짧은 시간에도 할 수 있는 것',
          categoryEffects: { '피트니스': 6, '패션/미용': 6, '취미/생활': 7 },
          traitEffects: { routine: 2 },
          tagEffects: { '짧음': 5, '루틴': 4 }
        },
        {
          optionId: 'clear_growth',
          label: '성장이나 기록이 눈에 보이는 것',
          categoryEffects: { '투자/N잡': 7, '취업 준비 컨설팅': 7, '악기': 5 },
          traitEffects: { focus: 2, challenge: 1 },
          tagEffects: { '성장감': 5, '기록': 4 }
        }
      ]
    },
    {
      id: 'adaptive_practical_3',
      title: '새 취미에 돈을 쓴다면 어떤 지출이 괜찮아요?',
      subtitle: '예산 감각을 추천에 살짝 반영합니다.',
      options: [
        {
          optionId: 'almost_free',
          label: '거의 무료거나 아주 적은 비용',
          categoryEffects: { '취미/생활': 8, '미술/드로잉': 5, '투자/N잡': 4 },
          traitEffects: { costSensitive: 3 },
          tagEffects: { '실속형': 5 }
        },
        {
          optionId: 'starter_kit',
          label: '입문 키트나 재료 정도',
          categoryEffects: { '공예': 7, '요리/조리': 6, '패션/미용': 5 },
          traitEffects: { creativity: 1, costSensitive: 1 },
          tagEffects: { '결과물': 3, '쉬움': 2 }
        },
        {
          optionId: 'lesson_value',
          label: '배울 가치가 있으면 레슨도 가능',
          categoryEffects: { '악기': 6, '피트니스': 6, '취업 준비 컨설팅': 6 },
          traitEffects: { routine: 2, challenge: 1 },
          tagEffects: { '성장감': 4, '연습': 3 }
        }
      ]
    },
    {
      id: 'adaptive_practical_4',
      title: '취미가 생활에 들어온다면 어떤 모습이면 좋겠어요?',
      subtitle: '마지막으로 지속 가능한 그림을 그려봅니다.',
      options: [
        {
          optionId: 'morning_night',
          label: '아침이나 밤에 짧게 반복하기',
          categoryEffects: { '취미/생활': 8, '피트니스': 6, '악기': 4 },
          traitEffects: { routine: 3 },
          tagEffects: { '루틴': 5, '짧음': 3 }
        },
        {
          optionId: 'weekend_project',
          label: '주말에 하나씩 결과물 만들기',
          categoryEffects: { '공예': 7, '요리/조리': 7, '사진/영상': 5 },
          traitEffects: { creativity: 2, focus: 1 },
          tagEffects: { '결과물': 5, '창작': 3 }
        },
        {
          optionId: 'monthly_growth',
          label: '한 달 단위로 성장 기록 쌓기',
          categoryEffects: { '투자/N잡': 7, '취업 준비 컨설팅': 7, '피트니스': 5 },
          traitEffects: { focus: 2, routine: 2 },
          tagEffects: { '기록': 5, '성장감': 4 }
        }
      ]
    }
  ]
};

function getAnswerEffects(answer) {
  return {
    selectedOptionId: answer?.selectedOptionId,
    categoryEffects: answer?.categoryEffects || {},
    traitEffects: answer?.traitEffects || {}
  };
}

const optionTrackScores = {
  active: { active: 18, growth: 6, together: 6, experience: 12 },
  creative: { creative: 18, result: 14 },
  expressive: { social: 8, both: 3 },
  calm: { calm: 18, easy: 2, alone: 12, record: 3 },
  practical: { cheap: 22, quick: 14, easy: 14, record: 18 }
};

function pickAdaptiveSet(answers = []) {
  const scores = {
    active: 0,
    creative: 0,
    expressive: 0,
    calm: 0,
    practical: 0
  };

  answers.forEach((answer) => {
    const { selectedOptionId, categoryEffects, traitEffects } = getAnswerEffects(answer);
    Object.entries(optionTrackScores).forEach(([track, optionScores]) => {
      scores[track] += optionScores[selectedOptionId] || 0;
    });

    scores.active += (traitEffects.activity || 0) * 3 + (traitEffects.challenge || 0) * 2 + (categoryEffects['구기 스포츠'] || 0) * 0.4 + (categoryEffects['피트니스'] || 0) * 0.4 + (categoryEffects['스포츠'] || 0) * 0.4 + (categoryEffects['격투 스포츠'] || 0) * 0.4;
    scores.creative += (traitEffects.creativity || 0) * 3 + (categoryEffects['공예'] || 0) * 0.4 + (categoryEffects['미술/드로잉'] || 0) * 0.4 + (categoryEffects['사진/영상'] || 0) * 0.25 + (categoryEffects['요리/조리'] || 0) * 0.25;
    scores.expressive += (traitEffects.expression || 0) * 3 + (traitEffects.social || 0) * 2 + (categoryEffects['댄스'] || 0) * 0.4 + (categoryEffects['음악이론/보컬'] || 0) * 0.4 + (categoryEffects['연기/마술'] || 0) * 0.4;
    scores.calm += (traitEffects.focus || 0) * 3 + (traitEffects.indoor || 0) * 2 + (categoryEffects['취미/생활'] || 0) * 0.35 + (categoryEffects['국악'] || 0) * 0.25;
    scores.practical += (traitEffects.costSensitive || 0) * 3 + (traitEffects.routine || 0) * 2 + (categoryEffects['투자/N잡'] || 0) * 0.4 + (categoryEffects['취업 준비 컨설팅'] || 0) * 0.4 + (categoryEffects['패션/미용'] || 0) * 0.35;
  });

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'practical';
}

export function getAdaptiveSurveyQuestions(answers = []) {
  if (answers.length < 4) return surveyQuestions;

  const openingQuestions = surveyQuestions.slice(0, 4);
  const closingQuestions = surveyQuestions.slice(8, 10);
  const adaptiveSet = adaptiveQuestionSets[pickAdaptiveSet(answers)] || adaptiveQuestionSets.practical;

  return [...openingQuestions, ...adaptiveSet, ...closingQuestions];
}
``````

## src/screens/AchievementScreen.jsx
```jsx
import { hobbyMap } from '../data/hobbies.js';
import { baseAchievements } from '../utils/progress.js';
import AchievementCard from '../components/AchievementCard.jsx';
import TitleProgressCard from '../components/TitleProgressCard.jsx';
import TraitSummary from '../components/TraitSummary.jsx';
import { getTitleImage } from '../utils/titleImages.js';

export default function AchievementScreen({ profile, achievements, completedHobbies, onBack }) {
  const earnedIds = new Set((achievements || []).map((item) => item.id));
  const lockedBase = baseAchievements.filter((achievement) => !earnedIds.has(achievement.id));
  const completedHobbyList = (completedHobbies || []).map((item) => hobbyMap[item.hobbyId]).filter(Boolean);
  const currentTitle = profile?.currentTitle || '시작 전 모험가';
  const titleImage = getTitleImage(currentTitle);

  return (
    <main className="screen achievement-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>

      <section className="card achievement-hero">
        <div>
          <span className="eyebrow">나의 발견 기록</span>
          <h1>{currentTitle}</h1>
          <p className="muted">{profile?.currentDescription || '완료한 미션과 퀘스트는 내가 나를 알아간 기록으로 남아요.'}</p>
          <TraitSummary traits={profile?.topTraits || []} />
        </div>
        <img className="title-image title-image-hero" src={titleImage} alt={`${currentTitle} 여정 단계 이미지`} />
      </section>

      <TitleProgressCard profile={profile} />

      <section className="card achievement-summary">
        <div className="mini-stat-grid wide">
          <div><strong>{completedHobbyList.length}</strong><span>완료한 퀘스트</span></div>
          <div><strong>{achievements.length}</strong><span>발견 기록</span></div>
        </div>
        <h2>완료한 퀘스트</h2>
        {completedHobbyList.length ? (
          <div className="completed-list">
            {completedHobbyList.map((hobby) => <span key={hobby.id} className="soft-pill">{hobby.name}</span>)}
          </div>
        ) : <p className="muted">아직 완료한 퀘스트가 없어요. 작은 미션부터 시작해보세요.</p>}
      </section>

      <section>
        <h2>발견한 기록</h2>
        <div className="achievement-grid three-column-grid">
          {achievements.length ? achievements.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} />) : <div className="empty-card card">아직 발견한 기록이 없어요.</div>}
        </div>
      </section>

      <section>
        <h2>아직 발견하지 못한 기록</h2>
        <p className="muted">앞으로의 여정에서 하나씩 열 수 있어요.</p>
        <div className="achievement-grid three-column-grid">
          {lockedBase.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} locked />)}
        </div>
      </section>
    </main>
  );
}
``````

## src/screens/AddHobbyScreen.jsx
```jsx
import { TreasureChestIllustration } from '../components/Illustrations.jsx';

export default function AddHobbyScreen({ onSearch, onSurvey, onBack }) {
  return (
    <main className="screen add-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>
      <section className="card add-hero">
        <div>
          <span className="eyebrow">새로운 가능성</span>
          <h1>새로운 가능성을 열어볼까요?</h1>
          <p>직접 검색해서 시작하거나, 내면 나침반으로 지금의 나에게 어울리는 길을 찾아보세요.</p>
        </div>
        <TreasureChestIllustration />
      </section>
      <div className="add-option-grid">
        <button className="card add-option" onClick={onSearch}>
          <span>🔎</span>
          <h2>직접 검색해서 시작하기</h2>
          <p>이미 마음에 둔 활동이 있다면 바로 퀘스트로 추가해보세요.</p>
        </button>
        <button className="card add-option" onClick={onSurvey}>
          <span>🧭</span>
          <h2>내면 나침반으로 찾기</h2>
          <p>다시 질문에 답하고 지금의 나에게 어울리는 길을 찾아보세요.</p>
        </button>
      </div>
    </main>
  );
}
``````

## src/screens/HobbyDetailScreen.jsx
```jsx
import { hobbyMap } from '../data/hobbies.js';
import { getHobbyProgress } from '../utils/progress.js';
import ProgressBar from '../components/ProgressBar.jsx';
import MissionStageCard from '../components/MissionStageCard.jsx';
import { TreasureChestIllustration } from '../components/Illustrations.jsx';

export default function HobbyDetailScreen({ activeHobby, onBack, onCompleteMission, onRemove }) {
  const hobby = hobbyMap[activeHobby?.hobbyId];
  if (!hobby || !activeHobby) {
    return (
      <main className="screen">
        <section className="card empty-card"><p>퀘스트 정보를 찾을 수 없어요.</p><button className="primary-button" onClick={onBack}>돌아가기</button></section>
      </main>
    );
  }

  const progress = getHobbyProgress(activeHobby);
  const completedIds = activeHobby.completedMissionIds || [];

  return (
    <main className="screen detail-screen">
      <button className="ghost-button back-button" onClick={onBack}>← 홈으로</button>

      <section className="card detail-top-card">
        <div>
          <span className="soft-pill">{hobby.category}</span>
          <h1>{hobby.name} 퀘스트</h1>
          <p>{hobby.description}</p>
          <ProgressBar value={progress.overall} label="전체 진행도" />
        </div>
        <div className="current-stage-card">
          <span className="eyebrow">현재 걷고 있는 길</span>
          <h2>{progress.currentStage?.title || '완료 준비 중'}</h2>
          <p className="muted">{progress.currentStage?.description || '새로운 나의 단서를 발견했어요.'}</p>
        </div>
      </section>

      <section className="detail-two-column">
        <div className="stage-list">
          {hobby.missionStages.map((stage) => (
            <MissionStageCard
              key={stage.id}
              stage={stage}
              status={progress.stageProgress[stage.id]}
              completedIds={completedIds}
              onComplete={(mission) => onCompleteMission(activeHobby.instanceId, mission.id)}
            />
          ))}
        </div>

        <aside className="detail-sidebar">
          <section className="card next-mission-card">
            <TreasureChestIllustration />
            <span className="eyebrow">오늘의 다음 미션</span>
            <h2>{progress.nextMission?.title || '모든 미션 완료!'}</h2>
            <p className="muted">{progress.nextMission?.description || '완료 모달에서 새로운 발견 기록을 확인해보세요.'}</p>
          </section>

          <section className="card detail-info-panel">
            <span className="eyebrow">퀘스트 준비 정보</span>
            <h2>시작 전 체크</h2>
            <ul>
              <li><strong>예상 비용</strong><span>{hobby.estimatedCost}</span></li>
              <li><strong>필요한 시간</strong><span>{hobby.timeLevel}</span></li>
              <li><strong>난이도</strong><span>{hobby.difficulty}</span></li>
              <li><strong>장소</strong><span>{hobby.placeType}</span></li>
              <li><strong>방식</strong><span>{hobby.socialType}</span></li>
            </ul>
            <p className="muted">준비물: {hobby.requiredItems.join(', ')}</p>
            <p className="muted">시작 방법: {hobby.startTip}</p>
            <button className="danger-button full" onClick={() => onRemove(activeHobby.instanceId)}>취향 지도에서 제외하기</button>
          </section>
        </aside>
      </section>
    </main>
  );
}
``````

## src/screens/HobbySearchScreen.jsx
```jsx
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
``````

## src/screens/HomeScreen.jsx
```jsx
import UserProfileCard from '../components/UserProfileCard.jsx';
import ActiveHobbyCard from '../components/ActiveHobbyCard.jsx';
import { HobbyMapIllustration } from '../components/Illustrations.jsx';
import hobbyMapImage from '../../취미지도.png';

export default function HomeScreen({ profile, stats, userTraits, activeHobbies, onOpenHobby, onAddHobby, onAchievements }) {
  return (
    <main className="screen home-screen dashboard-layout">
      <UserProfileCard profile={profile} stats={stats} userTraits={userTraits} onAchievements={onAchievements} />

      <div className="dashboard-main">
        <section className="card map-section">
          <div>
            <span className="eyebrow">오늘의 취향 지도</span>
            <h1>오늘의 다음 미션을 확인해볼까요?</h1>
            <p className="muted">작은 미션을 하나씩 완료하면 내가 몰랐던 나의 모습이 조금씩 선명해져요.</p>
          </div>
          <img className="today-map-image" src={hobbyMapImage} alt="취미 지도" />
        </section>

        <section className="active-section card">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">진행 중인 퀘스트</span>
              <h2>진행 중인 퀘스트</h2>
            </div>
            <button className="secondary-button" onClick={onAddHobby}>새로운 퀘스트 시작하기</button>
          </div>
          {activeHobbies.length ? (
            <div className="active-grid">
              {activeHobbies.map((item) => <ActiveHobbyCard key={item.instanceId} activeHobby={item} onOpen={onOpenHobby} />)}
            </div>
          ) : (
            <div className="empty-state-panel">
              <HobbyMapIllustration />
              <h3>아직 열린 길이 없어요.</h3>
              <p>첫 퀘스트를 시작하면 나를 알아가는 작은 실험이 시작됩니다.</p>
              <button className="primary-button" onClick={onAddHobby}>나에게 맞는 길 찾기</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
``````

## src/screens/RecommendationScreen.jsx
```jsx
import RecommendationCard from '../components/RecommendationCard.jsx';
import { CompassIllustration } from '../components/Illustrations.jsx';

export default function RecommendationScreen({ recommendations, onSelect, onRetake, onHome }) {
  const groups = recommendations?.groups || [];

  return (
    <main className="screen recommendation-screen">
      <section className="card result-hero">
        <div>
          <span className="eyebrow">새로운 가능성 발견</span>
          <h1>지금의 나에게 어울리는 길을 찾았어요.</h1>
          <p>답변을 바탕으로 나를 더 잘 알아갈 수 있는 퀘스트를 골라봤어요. 마음이 가는 길 하나를 골라 작은 실험을 시작해보세요.</p>
        </div>
        <CompassIllustration />
      </section>

      <section className="recommendation-board">
        {groups.map((group) => (
          <div key={group.category} className="recommendation-group card flat-card">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">새롭게 열린 가능성</span>
                <h2>{group.category}</h2>
              </div>
            </div>
            <div className="recommendation-grid">
              {group.items.map((item) => <RecommendationCard key={item.hobby.id} item={item} onSelect={onSelect} />)}
            </div>
          </div>
        ))}
      </section>

      <div className="button-row center">
        <button className="secondary-button" onClick={onRetake}>새로운 가능성 찾기</button>
        <button className="ghost-button" onClick={onHome}>홈으로 가기</button>
      </div>
    </main>
  );
}
``````

## src/screens/StartAndInfoScreen.jsx
```jsx
import { useState } from 'react';
import { CompassIllustration, SproutAdventurerSelection } from '../components/Illustrations.jsx';

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
          <h1>나도 몰랐던 나의 모습을 발견해볼까요?</h1>
          <p>
            짧은 질문에 답하면 지금의 나에게 어울리는 첫 번째 퀘스트를 찾아드려요.
            운동, 창작, 음악, 요리 같은 취미 활동을 통해 나에게 맞는 가능성을 가볍게 실험해볼 수 있어요.
          </p>
          <div className="hero-feature-grid">
            <div><strong>10문항</strong><span>가벼운 취향 분석</span></div>
            <div><strong>4개</strong><span>맞춤 취미 추천</span></div>
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
                  <option value="기타">기타</option>
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
            <button className="primary-button full" type="submit">내면 나침반 맞추기</button>
            <button className="ghost-button full" type="button" onClick={() => setShowForm(false)}>시작 선택으로 돌아가기</button>
          </form>
        ) : (
          <section className="card start-choice-card">
            <CompassIllustration />
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
``````

## src/screens/SurveyScreen.jsx
```jsx
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
``````

## src/utils/progress.js
```jsx
import { hobbyMap } from '../data/hobbies.js';
import { defaultTraits, traitLabels } from '../data/questions.js';

export const titleLevels = [
  { min: 0, title: '시작 전 모험가', description: '아직은 첫걸음을 준비하며 나에게 맞는 길을 찾는 중입니다.' },
  { min: 120, title: '첫걸음 모험가', description: '취미를 하나씩 시도하며 내가 몰랐던 취향을 발견하는 단계입니다.' },
  { min: 350, title: '가능성 수집가', description: '여러 퀘스트를 경험하며 나에게 맞는 가능성을 넓히고 있습니다.' },
  { min: 750, title: '취향 지도 제작자', description: '작은 실험들이 모여 나만의 취향 지도가 선명해지고 있습니다.' },
  { min: 1400, title: '라이프 모험가', description: '취미가 나를 발견하는 생활의 길로 자연스럽게 이어지고 있습니다.' }
];

const TITLE_STAGE_COUNT = 5;
const FINAL_TITLE_STAGE_RANGE = 650;

export const baseAchievements = [
  { id: 'first_step', title: '첫 단서 발견', description: '첫 퀘스트를 취향 지도에 추가했습니다.' },
  { id: 'half_way', title: '작은 실험의 중간 지점', description: '첫 퀘스트 진행도 50%를 달성했습니다.' },
  { id: 'first_complete', title: '하나의 길 완주', description: '퀘스트 하나를 끝까지 완료했습니다.' },
  { id: 'collector_3', title: '가능성 수집가', description: '퀘스트 3개를 취향 지도에 추가했습니다.' },
  { id: 'again', title: '새로운 가능성 발견', description: '내면 나침반으로 새로운 길을 다시 찾았습니다.' },
  { id: 'reviewer', title: '솔직한 단서 기록', description: '맞지 않았던 길에 대한 피드백을 남겼습니다.' }
];

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function addTraits(base = defaultTraits, delta = {}) {
  const next = { ...defaultTraits, ...base };
  Object.entries(delta).forEach(([key, value]) => {
    next[key] = clamp((next[key] || 0) + value, -10, 30);
  });
  return next;
}

export function getTopTraits(traits = defaultTraits, count = 2) {
  return Object.entries({ ...defaultTraits, ...traits })
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => ({ key, label: traitLabels[key] || key }));
}

export function getTitleInfo(totalScore = 0) {
  const currentIndex = titleLevels.reduce((last, level, index) => totalScore >= level.min ? index : last, 0);
  const current = titleLevels[currentIndex];
  const next = titleLevels[currentIndex + 1] || {
    min: current.min + FINAL_TITLE_STAGE_RANGE,
    title: '충분히 발견한 여정'
  };
  const isFinalTitle = currentIndex === titleLevels.length - 1;

  const titleRange = next.min - current.min;
  const stageSize = titleRange / TITLE_STAGE_COUNT;
  const scoreInTitle = clamp(totalScore - current.min, 0, titleRange);
  const currentTitleStep = Math.min(
    TITLE_STAGE_COUNT,
    Math.floor(scoreInTitle / stageSize) + 1
  );
  const currentStageStart = current.min + stageSize * (currentTitleStep - 1);
  const nextStageScore = currentTitleStep >= TITLE_STAGE_COUNT
    ? next.min
    : current.min + stageSize * currentTitleStep;
  const isMaxTitle = isFinalTitle && totalScore >= next.min;
  const stageProgress = isMaxTitle
    ? 100
    : ((totalScore - currentStageStart) / (nextStageScore - currentStageStart)) * 100;
  const nextGrowthLabel = isMaxTitle
    ? '충분히 발견한 여정'
    : isFinalTitle && currentTitleStep >= TITLE_STAGE_COUNT
    ? '충분히 발견한 여정'
    : currentTitleStep >= TITLE_STAGE_COUNT
    ? `${next.title} 1단계`
    : `${current.title} ${currentTitleStep + 1}단계`;

  return {
    currentTitle: current.title,
    currentDescription: current.description,
    currentTitleStep,
    currentTitleLabel: `${current.title} ${currentTitleStep}단계`,
    nextTitle: next?.title || '충분히 발견한 여정',
    nextGrowthLabel,
    titleProgressPercent: clamp(Math.round(stageProgress)),
    needScore: Math.max(0, Math.ceil(nextStageScore - totalScore)),
    isMaxTitle
  };
}

export function getProfile(userInfo, userTraits, userStats) {
  const titleInfo = getTitleInfo(userStats.totalScore);
  const topTraits = getTopTraits(userTraits);
  return {
    name: userInfo?.name || '모험가',
    gender: userInfo?.gender || '',
    ...titleInfo,
    topTraits
  };
}

export function getAllMissions(hobby) {
  return hobby.missionStages.flatMap((stage) => stage.missions.map((mission) => ({ ...mission, stageId: stage.id })));
}

export function getHobbyProgress(activeHobby) {
  const hobby = hobbyMap[activeHobby.hobbyId];
  if (!hobby) return { overall: 0, stageProgress: {}, nextMission: null, currentStage: null };
  const completedIds = new Set(activeHobby.completedMissionIds || []);
  const allMissions = getAllMissions(hobby);
  const total = allMissions.reduce((sum, mission) => sum + mission.progressValue, 0);
  const done = allMissions.reduce((sum, mission) => sum + (completedIds.has(mission.id) ? mission.progressValue : 0), 0);

  const stageProgress = {};
  let currentStage = hobby.missionStages[0];
  let nextMission = null;

  hobby.missionStages.forEach((stage, stageIndex) => {
    const stageTotal = stage.missions.reduce((sum, mission) => sum + mission.progressValue, 0);
    const stageDone = stage.missions.reduce((sum, mission) => sum + (completedIds.has(mission.id) ? mission.progressValue : 0), 0);
    const previousDone = stageIndex === 0 || hobby.missionStages[stageIndex - 1].missions.every((mission) => completedIds.has(mission.id));
    const isLocked = !previousDone;
    stageProgress[stage.id] = {
      percent: stageTotal ? Math.round((stageDone / stageTotal) * 100) : 0,
      isLocked,
      isComplete: stageDone >= stageTotal
    };

    if (!isLocked && !stageProgress[stage.id].isComplete && !nextMission) {
      currentStage = stage;
      nextMission = stage.missions.find((mission) => !completedIds.has(mission.id));
    }
  });

  return {
    overall: total ? clamp(Math.round((done / total) * 100)) : 0,
    stageProgress,
    nextMission,
    currentStage
  };
}

export function getTraitBoostFromHobby(hobby, amount = 1) {
  const boost = {};
  const tagMap = {
    '활동적': 'activity', '스포츠': 'activity', '운동': 'activity',
    '창작': 'creativity', '결과물': 'creativity',
    '함께': 'social', '커뮤니티': 'social',
    '도전': 'challenge', '경쟁': 'challenge',
    '몰입': 'focus', '정적': 'focus', '혼자': 'focus',
    '루틴': 'routine', '꾸준함': 'routine', '성장감': 'routine',
    '실속형': 'costSensitive',
    '야외': 'outdoor',
    '실내': 'indoor',
    '표현': 'expression'
  };

  hobby.tags.forEach((tag) => {
    const key = tagMap[tag];
    if (key) boost[key] = (boost[key] || 0) + amount;
  });

  Object.keys(boost).forEach((key) => {
    boost[key] = clamp(boost[key], -2, 3);
  });
  return boost;
}

export function addAchievement(existing = [], achievement) {
  if (!achievement || existing.some((item) => item.id === achievement.id)) return existing;
  return [...existing, { ...achievement, earnedAt: new Date().toISOString() }];
}
``````

## src/utils/storage.js
```jsx
import { defaultTraits } from '../data/questions.js';

export const STORAGE_KEY = 'hobbyQuestData';

const defaultStats = {
  totalScore: 0,
  currentTitle: '시작 전 모험가',
  nextTitle: '첫걸음 모험가',
  titleProgressPercent: 0,
  completedHobbyCount: 0,
  achievementCount: 0
};

function normalizeActiveHobby(item) {
  return {
    ...item,
    completedMissionIds: item.completedMissionIds || [],
    milestones: item.milestones || [],
    halfBonusClaimed: Boolean(item.halfBonusClaimed || item.milestones?.includes('half')),
    completeBonusClaimed: Boolean(item.completeBonusClaimed || item.milestones?.includes('complete'))
  };
}

export const initialState = {
  userInfo: null,
  userTraits: { ...defaultTraits },
  userProfile: null,
  activeHobbies: [],
  completedHobbies: [],
  achievements: [],
  userStats: { ...defaultStats },
  feedbacks: [],
  surveyHistory: []
};

export function createInitialState() {
  return {
    ...initialState,
    userTraits: { ...defaultTraits },
    userStats: { ...defaultStats },
    activeHobbies: [],
    completedHobbies: [],
    achievements: [],
    feedbacks: [],
    surveyHistory: []
  };
}

export function hasSavedState() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return {
      ...createInitialState(),
      ...parsed,
      userTraits: { ...defaultTraits, ...(parsed.userTraits || {}) },
      userStats: { ...defaultStats, ...(parsed.userStats || {}) },
      activeHobbies: (parsed.activeHobbies || []).map(normalizeActiveHobby),
      completedHobbies: parsed.completedHobbies || [],
      achievements: parsed.achievements || [],
      feedbacks: parsed.feedbacks || [],
      surveyHistory: parsed.surveyHistory || []
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage를 사용할 수 없는 환경에서는 조용히 무시합니다.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage를 사용할 수 없는 환경에서는 조용히 무시합니다.
  }
}
``````

## src/utils/titleImages.js
```jsx
import homeProtectorImage from '../assets/title-images/home-protector.png';
import rookieAdventurerImage from '../assets/title-images/rookie-adventurer.png';
import passionateAdventurerImage from '../assets/title-images/passionate-adventurer.png';
import veteranAdventurerImage from '../assets/title-images/veteran-adventurer.jpg';
import hobbyMasterImage from '../assets/title-images/hobby-master.png';

const titleImageMap = {
  '시작 전 모험가': homeProtectorImage,
  '첫걸음 모험가': rookieAdventurerImage,
  '가능성 수집가': passionateAdventurerImage,
  '취향 지도 제작자': veteranAdventurerImage,
  '라이프 모험가': hobbyMasterImage
};

export function getTitleImage(title) {
  return titleImageMap[title] || homeProtectorImage;
}
``````
