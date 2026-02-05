import type { StressQuestion } from '../types/stressTest';

export const stressQuestions: StressQuestion[] = [
  {
    id: 1,
    category: '수면',
    question: '밤에 누워도 머릿속이 복잡해서 1시간 넘게 뒤척인 적이 있다',
  },
  {
    id: 2,
    category: '업무',
    question: '퇴근 후에도 업무 생각이 계속 나서 제대로 쉬지 못한다',
  },
  {
    id: 3,
    category: '대인관계',
    question: '사람들과 있으면 에너지가 빠지고, 혼자 있고 싶다는 생각이 자주 든다',
  },
  {
    id: 4,
    category: '신체',
    question: '특별한 이유 없이 두통, 소화불량, 어깨 뭉침이 자주 느껴진다',
  },
  {
    id: 5,
    category: '감정',
    question: '별것 아닌 일에도 짜증이 확 올라오거나, 갑자기 눈물이 날 것 같다',
  },
  {
    id: 6,
    category: '식습관',
    question: '스트레스 받으면 폭식하거나, 반대로 입맛이 싹 사라진다',
  },
  {
    id: 7,
    category: '집중력',
    question: '해야 할 일이 있는데 자꾸 딴 생각이 나고 집중이 안 된다',
  },
  {
    id: 8,
    category: '번아웃',
    question: '주말에도 아무것도 하기 싫고, 그냥 누워만 있고 싶다',
  },
  {
    id: 9,
    category: '불안',
    question: '"이러다 큰일 나는 거 아닐까?" 하는 막연한 불안감이 있다',
  },
  {
    id: 10,
    category: '자존감',
    question: '나만 뒤처지는 것 같고, 남들은 다 잘 사는 것 같다는 생각이 든다',
  },
];

export const answerOptions = [
  { value: 1, label: '전혀 아니다', emoji: '😌' },
  { value: 2, label: '가끔 그렇다', emoji: '🙂' },
  { value: 3, label: '보통이다', emoji: '😐' },
  { value: 4, label: '자주 그렇다', emoji: '😟' },
  { value: 5, label: '매우 그렇다', emoji: '😫' },
];

// 카테고리별 상세 분석 정보
export interface CategoryAnalysis {
  name: string;
  emoji: string;
  descriptions: {
    low: string;
    moderate: string;
    high: string;
    danger: string;
  };
  tips: string[];
}

export const categoryAnalysis: Record<string, CategoryAnalysis> = {
  수면: {
    name: '수면 스트레스',
    emoji: '😴',
    descriptions: {
      low: '수면 건강이 양호합니다. 충분한 휴식을 취하고 있어요.',
      moderate: '가끔 수면에 어려움이 있지만 관리 가능한 수준이에요.',
      high: '수면의 질이 떨어지고 있어요. 잠들기 어렵거나 자주 깨진 않나요?',
      danger: '심각한 수면 문제가 의심됩니다. 만성 피로로 이어질 수 있어요.',
    },
    tips: [
      '잠들기 1시간 전 스마트폰 사용 자제',
      '매일 같은 시간에 취침하기',
      '카페인은 오후 2시 이후 피하기',
    ],
  },
  업무: {
    name: '업무 스트레스',
    emoji: '💼',
    descriptions: {
      low: '업무 스트레스를 잘 관리하고 있어요. 일과 삶의 균형이 좋습니다.',
      moderate: '업무 부담이 조금 있지만 감당할 수 있는 수준이에요.',
      high: '업무 과부하 상태일 수 있어요. 퇴근 후에도 일 생각이 많이 나나요?',
      danger: '번아웃 위험 신호입니다! 업무량 조절이 시급해요.',
    },
    tips: [
      '퇴근 후 업무 알림 끄기',
      '점심시간에 짧게라도 바깥 공기 쐬기',
      '할 일 목록 작성으로 우선순위 정하기',
    ],
  },
  대인관계: {
    name: '대인관계 스트레스',
    emoji: '👥',
    descriptions: {
      low: '사회적 관계가 건강해요. 사람들과의 교류가 에너지를 줍니다.',
      moderate: '사회적 피로가 조금 있지만 정상 범위예요.',
      high: '대인관계에서 지치고 있어요. 혼자만의 시간이 절실하게 필요하진 않나요?',
      danger: '사회적 고립 위험이 있어요. 에너지를 주는 관계를 찾아보세요.',
    },
    tips: [
      '무리하게 모든 약속에 참석하지 않기',
      '나를 지치게 하는 관계 정리하기',
      '신뢰할 수 있는 한두 명과 깊은 대화하기',
    ],
  },
  신체: {
    name: '신체 스트레스',
    emoji: '🏃',
    descriptions: {
      low: '신체 건강이 양호해요. 몸의 신호에 잘 반응하고 있습니다.',
      moderate: '가벼운 신체 증상이 있지만 심각하진 않아요.',
      high: '몸이 스트레스 신호를 보내고 있어요. 두통, 소화불량, 근육통이 잦나요?',
      danger: '신체가 경고를 보내고 있어요! 건강검진을 권장합니다.',
    },
    tips: [
      '하루 30분 가벼운 스트레칭',
      '충분한 수분 섭취 (하루 2L)',
      '규칙적인 식사 시간 지키기',
    ],
  },
  감정: {
    name: '감정 스트레스',
    emoji: '💔',
    descriptions: {
      low: '감정 조절이 잘 되고 있어요. 정서적으로 안정된 상태입니다.',
      moderate: '가끔 감정 기복이 있지만 자연스러운 수준이에요.',
      high: '감정 조절이 어려워지고 있어요. 작은 일에도 예민해지진 않나요?',
      danger: '감정적으로 지쳐있어요. 전문 상담을 권장합니다.',
    },
    tips: [
      '감정 일기로 내 마음 들여다보기',
      '눈물이 나면 참지 말고 울기',
      '화가 날 때 10까지 세며 심호흡',
    ],
  },
  식습관: {
    name: '식습관 스트레스',
    emoji: '🍽️',
    descriptions: {
      low: '건강한 식습관을 유지하고 있어요. 잘하고 있습니다!',
      moderate: '스트레스 시 식습관 변화가 조금 있지만 큰 문제는 아니에요.',
      high: '스트레스성 식습관 문제가 있어요. 폭식이나 거식 경향이 나타나나요?',
      danger: '식이 장애 위험이 있어요. 전문가 상담이 필요할 수 있습니다.',
    },
    tips: [
      '배고플 때만 먹기, 감정적 허기 구분하기',
      '스트레스 받을 때 물 한 잔 먼저 마시기',
      '건강한 간식 미리 준비해두기',
    ],
  },
  집중력: {
    name: '집중력 저하',
    emoji: '🧠',
    descriptions: {
      low: '집중력이 양호해요. 업무 효율이 좋은 상태입니다.',
      moderate: '가끔 집중이 흐트러지지만 정상 범위예요.',
      high: '집중력이 많이 떨어졌어요. 하나에 몰입하기 어렵지 않나요?',
      danger: '심각한 집중력 저하! 만성 스트레스의 신호일 수 있어요.',
    },
    tips: [
      '뽀모도로 기법 (25분 집중 + 5분 휴식)',
      '작업 중 알림 끄기',
      '한 번에 하나의 일만 하기',
    ],
  },
  번아웃: {
    name: '번아웃 지수',
    emoji: '🔥',
    descriptions: {
      low: '에너지가 충분해요. 번아웃 위험이 낮습니다.',
      moderate: '약간의 피로감이 있지만 회복 가능한 수준이에요.',
      high: '번아웃 초기 증상이 보여요. 무기력감과 의욕 저하가 있나요?',
      danger: '심각한 번아웃 상태입니다! 당장 쉬어야 해요.',
    },
    tips: [
      '완벽주의 내려놓기',
      '할 수 있는 것과 없는 것 구분하기',
      '휴가나 휴식 일정 반드시 확보하기',
    ],
  },
  불안: {
    name: '불안 지수',
    emoji: '😰',
    descriptions: {
      low: '불안 수준이 낮아요. 마음이 안정되어 있습니다.',
      moderate: '가끔 걱정이 있지만 일상에 큰 지장은 없어요.',
      high: '불안 수준이 높아요. 막연한 걱정이 자주 드나요?',
      danger: '범불안 증상이 의심됩니다. 전문 상담을 권장해요.',
    },
    tips: [
      '4-7-8 호흡법 (들숨 4초, 멈춤 7초, 날숨 8초)',
      '걱정되는 것 종이에 적고 찢어버리기',
      '지금 이 순간에 집중하는 마음챙김',
    ],
  },
  자존감: {
    name: '자존감 지수',
    emoji: '💪',
    descriptions: {
      low: '자존감이 건강해요. 자신을 긍정적으로 바라보고 있습니다.',
      moderate: '가끔 자기 의심이 있지만 대체로 괜찮아요.',
      high: '자존감이 낮아지고 있어요. 자주 남과 비교하게 되나요?',
      danger: '심각한 자존감 저하입니다. 스스로를 너무 혹독하게 대하고 있어요.',
    },
    tips: [
      '매일 나의 작은 성취 3가지 기록하기',
      'SNS 사용 시간 줄이기',
      '"나는 충분하다" 자기 긍정 주문',
    ],
  },
};

export interface MusicRecommendation {
  title: string;
  artist: string;
  reason: string;
  youtubeQuery: string;
  genre: 'korean' | 'pop';
}

export const stressMusic: Record<string, MusicRecommendation[]> = {
  low: [
    // 국내
    {
      title: '좋은 날',
      artist: 'IU',
      reason: '기분 좋은 하루를 더 밝게!',
      youtubeQuery: 'IU 좋은 날',
      genre: 'korean',
    },
    {
      title: '봄날',
      artist: 'BTS',
      reason: '따뜻하고 편안한 감성',
      youtubeQuery: 'BTS 봄날',
      genre: 'korean',
    },
    {
      title: 'TOMBOY',
      artist: '(여자)아이들',
      reason: '신나는 에너지 충전!',
      youtubeQuery: '여자아이들 TOMBOY',
      genre: 'korean',
    },
    // 팝송
    {
      title: 'Happy',
      artist: 'Pharrell Williams',
      reason: '행복한 기분을 더 UP!',
      youtubeQuery: 'Pharrell Williams Happy',
      genre: 'pop',
    },
    {
      title: 'Good as Hell',
      artist: 'Lizzo',
      reason: '자신감 넘치는 하루를 위해',
      youtubeQuery: 'Lizzo Good as Hell',
      genre: 'pop',
    },
    {
      title: 'Walking on Sunshine',
      artist: 'Katrina & The Waves',
      reason: '밝은 에너지를 더해줄 곡',
      youtubeQuery: 'Walking on Sunshine Katrina',
      genre: 'pop',
    },
  ],
  moderate: [
    // 국내
    {
      title: '여행',
      artist: '볼빨간사춘기',
      reason: '잠시 멈추고 여유를 찾게 해주는 곡',
      youtubeQuery: '볼빨간사춘기 여행',
      genre: 'korean',
    },
    {
      title: '밤편지',
      artist: 'IU',
      reason: '조용히 마음을 달래주는 노래',
      youtubeQuery: 'IU 밤편지',
      genre: 'korean',
    },
    {
      title: '숲',
      artist: '최유리',
      reason: '마음을 차분하게 정리해주는 곡',
      youtubeQuery: '최유리 숲',
      genre: 'korean',
    },
    // 팝송
    {
      title: 'Here Comes The Sun',
      artist: 'The Beatles',
      reason: '힘든 시간도 지나간다는 위로',
      youtubeQuery: 'Beatles Here Comes The Sun',
      genre: 'pop',
    },
    {
      title: 'Count On Me',
      artist: 'Bruno Mars',
      reason: '따뜻한 우정의 노래',
      youtubeQuery: 'Bruno Mars Count On Me',
      genre: 'pop',
    },
    {
      title: 'Better Days',
      artist: 'OneRepublic',
      reason: '더 좋은 날이 올 거라는 희망',
      youtubeQuery: 'OneRepublic Better Days',
      genre: 'pop',
    },
  ],
  high: [
    // 국내
    {
      title: '위로',
      artist: '권진아',
      reason: '지친 마음을 토닥여주는 곡',
      youtubeQuery: '권진아 위로',
      genre: 'korean',
    },
    {
      title: '한숨',
      artist: '이하이',
      reason: '숨 한번 깊게 쉬어가라는 노래',
      youtubeQuery: '이하이 한숨 Breathe',
      genre: 'korean',
    },
    {
      title: '사람',
      artist: '폴킴',
      reason: '혼자가 아니라는 따뜻한 위로',
      youtubeQuery: '폴킴 사람',
      genre: 'korean',
    },
    {
      title: '괜찮아요',
      artist: 'D.O.',
      reason: '담담하게 위로해주는 목소리',
      youtubeQuery: '디오 괜찮아요',
      genre: 'korean',
    },
    // 팝송
    {
      title: 'Fix You',
      artist: 'Coldplay',
      reason: '깊은 위로가 필요할 때',
      youtubeQuery: 'Coldplay Fix You',
      genre: 'pop',
    },
    {
      title: 'Lean On Me',
      artist: 'Bill Withers',
      reason: '누군가에게 기대도 괜찮아',
      youtubeQuery: 'Bill Withers Lean On Me',
      genre: 'pop',
    },
    {
      title: "You've Got a Friend",
      artist: 'Carole King',
      reason: '친구가 곁에 있다는 따뜻함',
      youtubeQuery: 'Carole King Youve Got a Friend',
      genre: 'pop',
    },
    {
      title: 'Breathe',
      artist: 'Télépopmusik',
      reason: '잠시 멈추고 호흡하세요',
      youtubeQuery: 'Telepopmusik Breathe',
      genre: 'pop',
    },
  ],
  veryHigh: [
    // 국내
    {
      title: '괜찮아요',
      artist: '비투비',
      reason: '정말 괜찮아질 거라는 진심 어린 위로',
      youtubeQuery: '비투비 괜찮아요',
      genre: 'korean',
    },
    {
      title: '나의 바람',
      artist: '정승환',
      reason: '힘들 때 듣는 치유의 노래',
      youtubeQuery: '정승환 나의 바람',
      genre: 'korean',
    },
    {
      title: '걱정말아요 그대',
      artist: '이적',
      reason: '쉬어가도 된다는 허락의 노래',
      youtubeQuery: '이적 걱정말아요 그대',
      genre: 'korean',
    },
    {
      title: '어떻게 이별까지 사랑하겠어',
      artist: 'AKMU',
      reason: '감정을 풀어주는 힐링송',
      youtubeQuery: 'AKMU 어떻게 이별까지',
      genre: 'korean',
    },
    {
      title: '모든 날, 모든 순간',
      artist: '폴킴',
      reason: '따뜻하게 감싸주는 노래',
      youtubeQuery: '폴킴 모든 날 모든 순간',
      genre: 'korean',
    },
    // 팝송
    {
      title: 'Let It Be',
      artist: 'The Beatles',
      reason: '그냥 두어도 괜찮아요',
      youtubeQuery: 'Beatles Let It Be',
      genre: 'pop',
    },
    {
      title: "Don't Worry Be Happy",
      artist: 'Bobby McFerrin',
      reason: '걱정 내려놓아도 돼요',
      youtubeQuery: 'Bobby McFerrin Dont Worry Be Happy',
      genre: 'pop',
    },
    {
      title: 'Heal',
      artist: 'Tom Odell',
      reason: '치유가 필요한 당신에게',
      youtubeQuery: 'Tom Odell Heal',
      genre: 'pop',
    },
    {
      title: 'The Scientist',
      artist: 'Coldplay',
      reason: '감정을 정리하는 시간',
      youtubeQuery: 'Coldplay The Scientist',
      genre: 'pop',
    },
    {
      title: "It's Okay",
      artist: 'Tom Rosenthal',
      reason: '울어도 괜찮아요',
      youtubeQuery: 'Tom Rosenthal Its Okay',
      genre: 'pop',
    },
  ],
};

export const stressTips: Record<string, string[]> = {
  low: [
    '지금 상태 그대로 유지하세요! 규칙적인 생활이 비결이에요.',
    '가벼운 운동이나 취미활동을 계속 즐기세요.',
    '감사 일기를 쓰면 긍정적인 마음이 더 오래 유지돼요.',
  ],
  moderate: [
    '하루 10분, 아무 생각 없이 멍 때리는 시간을 가져보세요.',
    '퇴근 후에는 업무 알림을 꺼두는 건 어떨까요?',
    '가벼운 산책이나 스트레칭으로 몸의 긴장을 풀어주세요.',
    '믿을 수 있는 사람과 수다 한번 떨어보세요.',
  ],
  high: [
    '지금 당장 해야 할 일과 미뤄도 되는 일을 구분해보세요.',
    '잠들기 1시간 전에는 스마트폰을 멀리 두세요.',
    '카페인과 알코올은 수면의 질을 떨어뜨려요.',
    '매일 같은 시간에 자고 일어나는 루틴을 만들어보세요.',
    '힘들면 전문 상담을 받는 것도 좋은 방법이에요.',
  ],
  veryHigh: [
    '지금 느끼는 감정, 혼자 감당하지 않아도 괜찮아요.',
    '전문 상담사와 이야기 나눠보는 걸 추천해요.',
    '무리하지 말고, 오늘은 쉬어가도 괜찮아요.',
    '정신건강복지센터 1577-0199로 연락해보세요.',
    '작은 것부터 하나씩, 천천히 해결해나가요.',
  ],
};
