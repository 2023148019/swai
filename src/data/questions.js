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
    subtitle: '이제 지도 위의 흐릿한 구역을 꽤 좁혀봅니다.',
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
    subtitle: '마지막 지도 조각을 맞추는 중입니다. 곧 가볼 만한 지점이 드러나요.',
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

function getAdaptiveTrackScores(answers = []) {
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

  return scores;
}

function pickAdaptiveSets(answers = [], count = 2) {
  const fallbackTracks = ['practical', 'creative', 'active', 'calm', 'expressive'];
  const rankedTracks = Object.entries(getAdaptiveTrackScores(answers))
    .sort((a, b) => b[1] - a[1])
    .map(([track]) => track);

  return [...rankedTracks, ...fallbackTracks]
    .filter((track, index, list) => list.indexOf(track) === index && adaptiveQuestionSets[track])
    .slice(0, count);
}

export function getAdaptiveSurveyQuestions(answers = []) {
  if (answers.length < 4) return surveyQuestions;

  const openingQuestions = surveyQuestions.slice(0, 4);
  const closingQuestions = surveyQuestions.slice(8, 10);
  const adaptiveSets = pickAdaptiveSets(answers.slice(0, 4))
    .flatMap((track) => adaptiveQuestionSets[track].slice(0, 3));

  return [...openingQuestions, ...adaptiveSets, ...closingQuestions];
}
