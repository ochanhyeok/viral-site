// 반응속도 테스트 등급 및 메시지 데이터

export interface ReactionGrade {
  id: string;
  name: string;
  emoji: string;
  minMs: number;
  maxMs: number;
  title: string;
  description: string;
  detailDescription: string;
  color: string;
  bgGradient: string;
}

export const grades: ReactionGrade[] = [
  {
    id: 'lightning',
    name: '번개 반사신경',
    emoji: '⚡',
    minMs: 0,
    maxMs: 180,
    title: '번개 반사신경',
    description: 'e스포츠 프로게이머급 반응속도!',
    detailDescription: '믿기 어려울 정도로 빠른 반응속도! 프로게이머들과 비슷한 수준이에요. 격투 게임, FPS, 리듬 게임 등에서 엄청난 실력을 발휘할 수 있어요. 상위 1%의 반응속도를 가지고 있습니다!',
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-500',
  },
  {
    id: 'gamer',
    name: '게이머 반응',
    emoji: '◈',
    minMs: 180,
    maxMs: 220,
    title: '게이머 반응',
    description: '상위 10%의 빠른 반응속도!',
    detailDescription: '게임을 즐기는 사람들 중에서도 빠른 편에 속해요! 순간적인 판단이 필요한 상황에서 남들보다 빠르게 대응할 수 있어요. 운전이나 스포츠에서도 유리한 반응속도입니다.',
    color: 'text-purple-500',
    bgGradient: 'from-purple-500 via-violet-500 to-indigo-500',
  },
  {
    id: 'fast',
    name: '빠른 편',
    emoji: '◆',
    minMs: 220,
    maxMs: 270,
    title: '빠른 편',
    description: '평균 이상의 좋은 반응속도!',
    detailDescription: '일반인 평균보다 빠른 반응속도를 가지고 있어요! 일상생활에서 갑작스러운 상황에도 잘 대처할 수 있는 수준이에요. 조금만 훈련하면 게이머급도 가능해요!',
    color: 'text-green-500',
    bgGradient: 'from-green-400 via-emerald-500 to-teal-500',
  },
  {
    id: 'average',
    name: '보통',
    emoji: '●',
    minMs: 270,
    maxMs: 330,
    title: '보통',
    description: '평균적인 반응속도예요',
    detailDescription: '대부분의 사람들과 비슷한 반응속도를 가지고 있어요. 인간의 평균 반응속도는 약 250-300ms 정도인데, 딱 그 범위에 있네요! 꾸준히 연습하면 더 빨라질 수 있어요.',
    color: 'text-blue-500',
    bgGradient: 'from-blue-400 via-blue-500 to-indigo-500',
  },
  {
    id: 'slow',
    name: '느긋한 편',
    emoji: '○',
    minMs: 330,
    maxMs: 400,
    title: '느긋한 편',
    description: '커피 한 잔 어떠세요?',
    detailDescription: '반응속도가 조금 느린 편이에요. 피곤하거나 집중력이 떨어진 상태일 수 있어요! 충분히 쉬고 다시 도전해보세요. 반응속도는 컨디션에 따라 크게 달라질 수 있답니다.',
    color: 'text-orange-500',
    bgGradient: 'from-orange-400 via-orange-500 to-red-400',
  },
  {
    id: 'sleepy',
    name: '졸린 상태',
    emoji: '—',
    minMs: 400,
    maxMs: 9999,
    title: '졸린 상태',
    description: '오늘은 푹 쉬는 게 좋겠어요',
    detailDescription: '많이 피곤한 상태인 것 같아요! 수면 부족이나 피로가 반응속도에 큰 영향을 미쳐요. 오늘은 무리하지 말고 푹 쉬세요. 컨디션이 좋을 때 다시 도전해보면 훨씬 좋은 결과가 나올 거예요!',
    color: 'text-gray-500',
    bgGradient: 'from-gray-400 via-gray-500 to-slate-500',
  },
];

export function getGradeByMs(avgMs: number): ReactionGrade {
  return grades.find(g => avgMs >= g.minMs && avgMs < g.maxMs) || grades[grades.length - 1];
}

export const TOTAL_ROUNDS = 5;
export const MIN_WAIT_TIME = 2000; // 최소 대기 시간 (ms)
export const MAX_WAIT_TIME = 5000; // 최대 대기 시간 (ms)

// 재미있는 팁/사실
export const funFacts = [
  '인간의 평균 반응속도는 약 250ms예요!',
  '프로 e스포츠 선수들은 150-180ms의 반응속도를 가져요.',
  '카페인은 일시적으로 반응속도를 향상시켜요!',
  '나이가 들수록 반응속도가 느려지지만, 훈련으로 유지할 수 있어요.',
  '시각 자극보다 청각 자극에 더 빠르게 반응해요.',
  '프로 드라이버의 반응속도는 약 200ms 정도예요.',
  '격투 게임 프로들은 프레임 단위(16ms)로 반응해요!',
  '충분한 수면은 반응속도 향상에 큰 도움이 돼요.',
];

// FAQ 데이터
export const reactionTestFAQ = [
  {
    question: '반응속도는 어떻게 측정되나요?',
    answer: '화면이 빨간색에서 초록색으로 바뀌는 순간부터 클릭하는 순간까지의 시간을 밀리초(ms) 단위로 측정합니다. 5회 시도의 평균값으로 최종 결과를 산출합니다.',
  },
  {
    question: '좋은 반응속도는 어느 정도인가요?',
    answer: '일반인의 평균 반응속도는 약 250-300ms입니다. 200ms 이하면 매우 빠른 편이고, 180ms 이하는 프로게이머 수준입니다. 단, 기기와 환경에 따라 약간의 오차가 있을 수 있어요.',
  },
  {
    question: '반응속도를 향상시킬 수 있나요?',
    answer: '네! 반응속도는 훈련을 통해 향상될 수 있습니다. 규칙적인 운동, 충분한 수면, 적절한 카페인 섭취, 그리고 반응속도 게임을 통한 꾸준한 연습이 도움이 됩니다.',
  },
  {
    question: '모바일과 PC 결과가 다른가요?',
    answer: '터치스크린과 마우스 클릭의 입력 지연 시간이 다르기 때문에 약간의 차이가 있을 수 있습니다. 일반적으로 PC 마우스가 조금 더 정확한 측정이 가능합니다.',
  },
  {
    question: '왜 결과가 매번 다른가요?',
    answer: '반응속도는 집중력, 피로도, 컨디션, 예측 여부 등 다양한 요인에 영향을 받습니다. 같은 사람도 상황에 따라 50ms 이상 차이가 날 수 있어요.',
  },
];

// 반응속도별 비교 대상
export const comparisonData = [
  { name: '눈 깜빡임', ms: 100, emoji: '◎' },
  { name: '프로게이머', ms: 170, emoji: '◈' },
  { name: 'F1 드라이버', ms: 200, emoji: '◆' },
  { name: '일반인 평균', ms: 270, emoji: '●' },
  { name: '졸린 상태', ms: 400, emoji: '○' },
];
