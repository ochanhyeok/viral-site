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

export interface MusicRecommendation {
  title: string;
  artist: string;
  reason: string;
  youtubeQuery: string;
}

export const stressMusic: Record<string, MusicRecommendation[]> = {
  low: [
    {
      title: 'Good Day',
      artist: 'Nappy Roots',
      reason: '기분 좋은 하루를 유지하는 데 딱!',
      youtubeQuery: 'Nappy Roots Good Day',
    },
    {
      title: 'Walking on Sunshine',
      artist: 'Katrina & The Waves',
      reason: '밝은 에너지를 더해줄 곡',
      youtubeQuery: 'Walking on Sunshine Katrina',
    },
  ],
  moderate: [
    {
      title: '여행',
      artist: '볼빨간사춘기',
      reason: '잠시 멈추고 여유를 찾게 해주는 곡',
      youtubeQuery: '볼빨간사춘기 여행',
    },
    {
      title: 'Here Comes The Sun',
      artist: 'The Beatles',
      reason: '힘든 시간도 지나간다는 위로의 곡',
      youtubeQuery: 'Beatles Here Comes The Sun',
    },
    {
      title: '숲',
      artist: '최유리',
      reason: '마음을 차분하게 정리해주는 곡',
      youtubeQuery: '최유리 숲',
    },
  ],
  high: [
    {
      title: '위로',
      artist: '권진아',
      reason: '지친 마음을 토닥여주는 곡',
      youtubeQuery: '권진아 위로',
    },
    {
      title: 'Breathe',
      artist: '이하이',
      reason: '숨 한번 깊게 쉬어가라는 노래',
      youtubeQuery: '이하이 한숨 Breathe',
    },
    {
      title: '사람',
      artist: '폴킴',
      reason: '혼자가 아니라는 따뜻한 위로',
      youtubeQuery: '폴킴 사람',
    },
  ],
  veryHigh: [
    {
      title: '괜찮아요',
      artist: '비투비',
      reason: '정말 괜찮아질 거라는 진심 어린 위로',
      youtubeQuery: '비투비 괜찮아요',
    },
    {
      title: '나의 바람',
      artist: '정승환',
      reason: '힘들 때 듣는 치유의 노래',
      youtubeQuery: '정승환 나의 바람',
    },
    {
      title: '잠시 쉬어가도 괜찮아',
      artist: '이적',
      reason: '쉬어가도 된다는 허락의 노래',
      youtubeQuery: '이적 걱정말아요 그대',
    },
    {
      title: '어떻게 이별까지 사랑하겠어',
      artist: 'AKMU',
      reason: '감정을 풀어주는 힐링송',
      youtubeQuery: 'AKMU 어떻게 이별까지',
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
