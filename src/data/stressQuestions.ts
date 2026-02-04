import type { StressQuestion } from '../types/stressTest';

export const stressQuestions: StressQuestion[] = [
  {
    id: 1,
    category: '수면',
    question: '최근 잠들기 어렵거나 자주 깨는 편인가요?',
  },
  {
    id: 2,
    category: '업무/학업',
    question: '업무나 학업에서 과도한 부담감을 느끼나요?',
  },
  {
    id: 3,
    category: '대인관계',
    question: '주변 사람들과의 관계에서 갈등이나 긴장감을 느끼나요?',
  },
  {
    id: 4,
    category: '신체 증상',
    question: '두통, 어깨 결림, 소화불량 등 신체적 불편함이 자주 있나요?',
  },
  {
    id: 5,
    category: '감정 상태',
    question: '쉽게 짜증나거나 우울한 기분이 드나요?',
  },
  {
    id: 6,
    category: '식습관',
    question: '식욕이 급격히 변하거나 폭식/거식 경향이 있나요?',
  },
  {
    id: 7,
    category: '집중력',
    question: '업무나 일상 활동에 집중하기 어려운 편인가요?',
  },
  {
    id: 8,
    category: '여가 시간',
    question: '취미 활동이나 휴식을 위한 시간이 부족하다고 느끼나요?',
  },
  {
    id: 9,
    category: '미래 걱정',
    question: '미래에 대한 불안감이나 걱정이 자주 드나요?',
  },
  {
    id: 10,
    category: '행복감',
    question: '전반적으로 삶에 대한 만족도가 낮다고 느끼나요?',
  },
];

export const answerOptions = [
  { value: 1, label: '전혀 아니다' },
  { value: 2, label: '별로 아니다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '약간 그렇다' },
  { value: 5, label: '매우 그렇다' },
];

export const stressTips: Record<string, string[]> = {
  low: [
    '현재 상태를 유지하기 위해 규칙적인 운동을 계속하세요.',
    '충분한 수면 시간을 확보하세요 (7-8시간 권장).',
    '감사 일기를 작성해 긍정적인 마음을 유지하세요.',
  ],
  moderate: [
    '하루 10분 명상이나 심호흡을 실천해보세요.',
    '업무와 휴식 사이에 명확한 경계를 설정하세요.',
    '가벼운 산책으로 기분 전환을 시도해보세요.',
    '신뢰할 수 있는 사람과 대화를 나눠보세요.',
  ],
  high: [
    '당장 해야 할 일과 미룰 수 있는 일을 구분하세요.',
    '규칙적인 수면 패턴을 만들어보세요.',
    '카페인과 알코올 섭취를 줄여보세요.',
    '전문 상담사와 대화해보는 것도 좋은 방법입니다.',
    '짧은 휴가나 휴식을 계획해보세요.',
  ],
  veryHigh: [
    '전문 상담사나 정신건강 전문가와 상담을 권장합니다.',
    '무리하지 말고 충분한 휴식을 취하세요.',
    '혼자 해결하려 하지 말고 주변에 도움을 요청하세요.',
    '정신건강복지센터(1577-0199)에 연락해보세요.',
    '작은 목표부터 하나씩 해결해 나가세요.',
  ],
};
