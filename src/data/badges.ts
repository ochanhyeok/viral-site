// 뱃지 정의
export interface BadgeDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'general' | 'color-test' | 'reaction-test' | 'emoji-quiz' | 'personality';
  checkCondition: (stats: BadgeCheckStats) => boolean;
}

export interface BadgeCheckStats {
  totalTests: number;
  testCounts: { [testType: string]: number };
  bestScores: { [testType: string]: number };
  results: { [testType: string]: string[] };
  reactionTimes: number[];
  colorScores: number[];
  emojiScores: number[];
}

export const badges: BadgeDefinition[] = [
  // === 일반 뱃지 ===
  {
    id: 'first-test',
    name: '첫 발걸음',
    emoji: '👣',
    description: '첫 번째 테스트 완료!',
    condition: '아무 테스트 1회 완료',
    rarity: 'common',
    category: 'general',
    checkCondition: (stats) => stats.totalTests >= 1,
  },
  {
    id: 'test-5',
    name: '테스트 러버',
    emoji: '💕',
    description: '테스트 5회 완료',
    condition: '아무 테스트 5회 완료',
    rarity: 'common',
    category: 'general',
    checkCondition: (stats) => stats.totalTests >= 5,
  },
  {
    id: 'test-10',
    name: '테스트 마니아',
    emoji: '🔥',
    description: '테스트 10회 완료',
    condition: '아무 테스트 10회 완료',
    rarity: 'rare',
    category: 'general',
    checkCondition: (stats) => stats.totalTests >= 10,
  },
  {
    id: 'test-30',
    name: '테스트 중독자',
    emoji: '🤩',
    description: '테스트 30회 완료',
    condition: '아무 테스트 30회 완료',
    rarity: 'epic',
    category: 'general',
    checkCondition: (stats) => stats.totalTests >= 30,
  },
  {
    id: 'test-100',
    name: '테스트의 신',
    emoji: '👑',
    description: '테스트 100회 완료!',
    condition: '아무 테스트 100회 완료',
    rarity: 'legendary',
    category: 'general',
    checkCondition: (stats) => stats.totalTests >= 100,
  },
  {
    id: 'all-rounder',
    name: '올라운더',
    emoji: '🌟',
    description: '모든 종류의 테스트를 해봄',
    condition: '6가지 이상 테스트 완료',
    rarity: 'epic',
    category: 'general',
    checkCondition: (stats) => Object.keys(stats.testCounts).length >= 6,
  },

  // === 색감 테스트 뱃지 ===
  {
    id: 'color-first',
    name: '색채의 시작',
    emoji: '🎨',
    description: '색감 테스트 첫 도전',
    condition: '색감 테스트 1회 완료',
    rarity: 'common',
    category: 'color-test',
    checkCondition: (stats) => (stats.testCounts['color-test'] || 0) >= 1,
  },
  {
    id: 'color-master',
    name: '색채의 달인',
    emoji: '🖼️',
    description: '색감 테스트에서 90% 이상 달성',
    condition: '색감 테스트 90% 이상',
    rarity: 'epic',
    category: 'color-test',
    checkCondition: (stats) => stats.colorScores.some(s => s >= 90),
  },
  {
    id: 'color-perfect',
    name: '완벽한 눈',
    emoji: '👁️',
    description: '색감 테스트 만점!',
    condition: '색감 테스트 100% 달성',
    rarity: 'legendary',
    category: 'color-test',
    checkCondition: (stats) => stats.colorScores.some(s => s >= 100),
  },

  // === 반응속도 테스트 뱃지 ===
  {
    id: 'reaction-first',
    name: '반사신경 테스트',
    emoji: '⚡',
    description: '반응속도 테스트 첫 도전',
    condition: '반응속도 테스트 1회 완료',
    rarity: 'common',
    category: 'reaction-test',
    checkCondition: (stats) => (stats.testCounts['reaction-test'] || 0) >= 1,
  },
  {
    id: 'reaction-fast',
    name: '빠른 손',
    emoji: '🖐️',
    description: '평균 250ms 이하 달성',
    condition: '반응속도 250ms 이하',
    rarity: 'rare',
    category: 'reaction-test',
    checkCondition: (stats) => stats.reactionTimes.some(t => t <= 250),
  },
  {
    id: 'reaction-pro',
    name: '프로게이머',
    emoji: '🎮',
    description: '평균 200ms 이하 달성!',
    condition: '반응속도 200ms 이하',
    rarity: 'epic',
    category: 'reaction-test',
    checkCondition: (stats) => stats.reactionTimes.some(t => t <= 200),
  },
  {
    id: 'reaction-god',
    name: '번개의 신',
    emoji: '⚡',
    description: '평균 180ms 이하! 초인급!',
    condition: '반응속도 180ms 이하',
    rarity: 'legendary',
    category: 'reaction-test',
    checkCondition: (stats) => stats.reactionTimes.some(t => t <= 180),
  },

  // === 이모지 퀴즈 뱃지 ===
  {
    id: 'emoji-first',
    name: '이모지 도전',
    emoji: '🎯',
    description: '이모지 퀴즈 첫 도전',
    condition: '이모지 퀴즈 1회 완료',
    rarity: 'common',
    category: 'emoji-quiz',
    checkCondition: (stats) => (stats.testCounts['emoji-quiz'] || 0) >= 1,
  },
  {
    id: 'emoji-good',
    name: '이모지 해독가',
    emoji: '🔍',
    description: '이모지 퀴즈 70% 이상',
    condition: '이모지 퀴즈 7개 이상 정답',
    rarity: 'rare',
    category: 'emoji-quiz',
    checkCondition: (stats) => stats.emojiScores.some(s => s >= 70),
  },
  {
    id: 'emoji-master',
    name: '이모지 마스터',
    emoji: '🏆',
    description: '이모지 퀴즈 전문가!',
    condition: '이모지 퀴즈 9개 이상 정답',
    rarity: 'epic',
    category: 'emoji-quiz',
    checkCondition: (stats) => stats.emojiScores.some(s => s >= 90),
  },
  {
    id: 'emoji-perfect',
    name: '이모지의 신',
    emoji: '👑',
    description: '이모지 퀴즈 만점!',
    condition: '이모지 퀴즈 10개 전부 정답',
    rarity: 'legendary',
    category: 'emoji-quiz',
    checkCondition: (stats) => stats.emojiScores.some(s => s >= 100),
  },

  // === 성격 테스트 뱃지 ===
  {
    id: 'personality-explorer',
    name: '자아 탐험가',
    emoji: '🔮',
    description: '성격 테스트 3종 완료',
    condition: 'MBTI, 소비성향, 스트레스 테스트 완료',
    rarity: 'rare',
    category: 'personality',
    checkCondition: (stats) => {
      const tests = ['work-mbti', 'spending-quiz', 'stress-test'];
      return tests.every(t => (stats.testCounts[t] || 0) >= 1);
    },
  },
  {
    id: 'personality-master',
    name: '심리 전문가',
    emoji: '🧠',
    description: '모든 성격 테스트 완료!',
    condition: '모든 심리테스트 완료',
    rarity: 'epic',
    category: 'personality',
    checkCondition: (stats) => {
      const tests = ['work-mbti', 'spending-quiz', 'stress-test', 'kkondae-test'];
      return tests.every(t => (stats.testCounts[t] || 0) >= 1);
    },
  },
];

// 레어리티별 색상
export const rarityColors = {
  common: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-300',
    gradient: 'from-gray-400 to-gray-500',
  },
  rare: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-400',
    gradient: 'from-blue-400 to-blue-600',
  },
  epic: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-400',
    gradient: 'from-purple-400 to-purple-600',
  },
  legendary: {
    bg: 'bg-gradient-to-r from-yellow-100 to-amber-100',
    text: 'text-amber-600',
    border: 'border-amber-400',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
  },
};

// 레어리티 이름
export const rarityNames = {
  common: '일반',
  rare: '레어',
  epic: '에픽',
  legendary: '레전드리',
};
