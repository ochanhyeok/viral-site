// 색감 테스트 등급 및 메시지 데이터

export interface ColorTestGrade {
  id: string;
  name: string;
  emoji: string;
  minPercent: number;
  maxPercent: number;
  title: string;
  description: string;
  detailDescription: string;
  color: string;
  bgGradient: string;
}

export const grades: ColorTestGrade[] = [
  {
    id: 'artist',
    name: '예술가의 눈',
    emoji: '🎨',
    minPercent: 95,
    maxPercent: 100,
    title: '예술가의 눈',
    description: '당신은 타고난 색채 감각의 소유자!',
    detailDescription: '미세한 색상 차이도 놓치지 않는 당신! 디자이너, 화가, 포토그래퍼 등 색채를 다루는 직업에 천부적인 재능이 있어요. 상위 1%의 색감 능력을 가졌습니다.',
    color: 'text-violet-600',
    bgGradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
  },
  {
    id: 'golden',
    name: '황금눈',
    emoji: '👁️',
    minPercent: 80,
    maxPercent: 94,
    title: '황금눈',
    description: '상위 10%의 뛰어난 색감!',
    detailDescription: '대부분의 색상 차이를 정확하게 구분하는 능력을 가졌어요. 인테리어, 패션 코디 등에서 탁월한 감각을 발휘할 수 있습니다. 주변에서 색 조합 조언을 구하는 사람이 많을 거예요!',
    color: 'text-amber-600',
    bgGradient: 'from-amber-400 via-yellow-500 to-orange-500',
  },
  {
    id: 'good',
    name: '좋은 눈',
    emoji: '✨',
    minPercent: 65,
    maxPercent: 79,
    title: '좋은 눈',
    description: '평균 이상의 색감 능력!',
    detailDescription: '일상생활에서 색상을 잘 구분하고 활용하는 편이에요. 옷 코디나 인테리어에서 조화로운 색 조합을 찾는 능력이 있습니다. 조금만 훈련하면 더 뛰어난 색감을 가질 수 있어요!',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-400 via-green-500 to-teal-500',
  },
  {
    id: 'normal',
    name: '보통 눈',
    emoji: '👀',
    minPercent: 50,
    maxPercent: 64,
    title: '보통 눈',
    description: '평균적인 색감 능력이에요',
    detailDescription: '대부분의 사람들과 비슷한 색감 능력을 가지고 있어요. 뚜렷한 색상 차이는 잘 구분하지만, 미세한 차이는 조금 어려울 수 있어요. 색감은 훈련으로 향상될 수 있으니 걱정 마세요!',
    color: 'text-blue-600',
    bgGradient: 'from-blue-400 via-blue-500 to-indigo-500',
  },
  {
    id: 'sleepy',
    name: '졸린 눈',
    emoji: '😴',
    minPercent: 35,
    maxPercent: 49,
    title: '졸린 눈',
    description: '커피 한 잔 어떠세요?',
    detailDescription: '오늘 컨디션이 안 좋은 걸 수도 있어요! 피로하면 색감 인지 능력이 떨어질 수 있거든요. 푹 쉬고 다시 도전해보세요. 아니면... 모니터 밝기를 확인해보는 건 어떨까요?',
    color: 'text-orange-600',
    bgGradient: 'from-orange-400 via-orange-500 to-red-400',
  },
  {
    id: 'colorblind',
    name: '색맹 의심',
    emoji: '🔍',
    minPercent: 0,
    maxPercent: 34,
    title: '색맹 의심',
    description: '안과 방문을 권장드려요',
    detailDescription: '색상 구분에 어려움이 있는 것 같아요. 모니터 설정 문제일 수도 있지만, 혹시 평소에도 색 구분이 어렵다면 색각 검사를 받아보시는 걸 추천드려요. 색맹/색약은 생각보다 흔하고, 일상생활에 큰 문제가 되지 않아요!',
    color: 'text-rose-600',
    bgGradient: 'from-rose-400 via-red-500 to-pink-500',
  },
];

export function getGradeByPercent(percent: number): ColorTestGrade {
  return grades.find(g => percent >= g.minPercent && percent <= g.maxPercent) || grades[grades.length - 1];
}

// 난이도별 설정
export interface DifficultyConfig {
  gridSize: number;
  hueDiff: number;
  satDiff: number;
  lightDiff: number;
  timeLimit: number;
}

export const difficultyLevels: DifficultyConfig[] = [
  // 라운드 1-3: 쉬움
  { gridSize: 3, hueDiff: 25, satDiff: 20, lightDiff: 15, timeLimit: 10000 },
  { gridSize: 3, hueDiff: 20, satDiff: 18, lightDiff: 12, timeLimit: 10000 },
  { gridSize: 3, hueDiff: 18, satDiff: 15, lightDiff: 10, timeLimit: 10000 },
  // 라운드 4-6: 보통
  { gridSize: 4, hueDiff: 15, satDiff: 12, lightDiff: 8, timeLimit: 10000 },
  { gridSize: 4, hueDiff: 12, satDiff: 10, lightDiff: 7, timeLimit: 10000 },
  { gridSize: 4, hueDiff: 10, satDiff: 8, lightDiff: 6, timeLimit: 10000 },
  // 라운드 7-9: 어려움
  { gridSize: 4, hueDiff: 8, satDiff: 7, lightDiff: 5, timeLimit: 10000 },
  { gridSize: 5, hueDiff: 7, satDiff: 6, lightDiff: 5, timeLimit: 10000 },
  { gridSize: 5, hueDiff: 6, satDiff: 5, lightDiff: 4, timeLimit: 10000 },
  // 라운드 10-12: 매우 어려움
  { gridSize: 5, hueDiff: 5, satDiff: 4, lightDiff: 4, timeLimit: 10000 },
  { gridSize: 5, hueDiff: 4, satDiff: 4, lightDiff: 3, timeLimit: 10000 },
  { gridSize: 6, hueDiff: 4, satDiff: 3, lightDiff: 3, timeLimit: 10000 },
  // 라운드 13-15: 극한
  { gridSize: 6, hueDiff: 3, satDiff: 3, lightDiff: 2, timeLimit: 10000 },
  { gridSize: 6, hueDiff: 2, satDiff: 2, lightDiff: 2, timeLimit: 10000 },
  { gridSize: 7, hueDiff: 2, satDiff: 2, lightDiff: 2, timeLimit: 10000 },
];

export const TOTAL_ROUNDS = 15;
export const MAX_SCORE_PER_ROUND = 150; // 기본 100 + 속도 보너스 최대 50
export const MAX_TOTAL_SCORE = TOTAL_ROUNDS * MAX_SCORE_PER_ROUND;

// 재미있는 팁 메시지
export const funFacts = [
  '여성이 남성보다 색상을 더 잘 구분한다고 해요!',
  '인간의 눈은 약 1000만 가지 색상을 구분할 수 있어요.',
  '디자이너들은 매일 색감 훈련을 한다고 해요.',
  '블루라이트 필터를 끄면 더 정확한 결과가 나와요!',
  '피곤할 때는 색감 인지 능력이 떨어져요.',
  '모니터 밝기가 색감 테스트에 영향을 줄 수 있어요.',
  '나이가 들수록 색감 인지 능력이 감소해요.',
  '예술가들은 일반인보다 더 많은 색을 볼 수 있어요.',
];

// FAQ 데이터
export const colorTestFAQ = [
  {
    question: '색감 테스트는 정확한가요?',
    answer: '이 테스트는 재미를 위한 것으로, 의학적 진단을 대체할 수 없습니다. 정확한 색각 검사는 안과에서 받으시는 것을 권장드립니다. 다만, 모니터 화질과 밝기에 따라 결과가 달라질 수 있으니 참고해주세요.',
  },
  {
    question: '색감 능력은 훈련으로 향상될 수 있나요?',
    answer: '네! 색감은 훈련으로 향상될 수 있습니다. 디자이너, 화가, 사진작가들은 지속적인 색채 훈련을 통해 미세한 색상 차이도 구분할 수 있게 됩니다. 색칠 공부, 색상 매칭 게임 등이 도움이 됩니다.',
  },
  {
    question: '왜 점수가 낮게 나왔나요?',
    answer: '여러 요인이 영향을 줄 수 있어요: 1) 모니터 화질/밝기 설정, 2) 블루라이트 필터 사용, 3) 피로도, 4) 주변 조명 상태. 최적의 결과를 위해 밝은 환경에서 블루라이트 필터를 끄고 테스트해보세요.',
  },
  {
    question: '색맹/색약이 있으면 점수가 낮나요?',
    answer: '색맹이나 색약이 있으면 특정 색상 조합에서 어려움을 겪을 수 있습니다. 하지만 이 테스트만으로 색맹 여부를 판단할 수 없으며, 정확한 진단은 전문 의료기관에서 받으시기 바랍니다.',
  },
  {
    question: '남성과 여성의 색감 차이가 있나요?',
    answer: '연구에 따르면 여성이 평균적으로 색상을 더 잘 구분한다고 합니다. 이는 X염색체에 색각 관련 유전자가 있어서 X염색체가 2개인 여성이 유리하기 때문입니다. 하지만 개인차가 크므로 일반화하기는 어렵습니다.',
  },
];
