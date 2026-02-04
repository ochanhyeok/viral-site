export interface StressQuestion {
  id: number;
  category: string;
  question: string;
  isReverse?: boolean; // 역채점 문항 여부
}

export interface Answer {
  questionId: number;
  score: number;
}

export type StressLevel = 'low' | 'moderate' | 'high' | 'veryHigh';

export interface StressResult {
  totalScore: number;
  level: StressLevel;
  categoryScores: CategoryScore[];
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
}

export const STRESS_LEVELS: Record<StressLevel, { label: string; color: string; description: string }> = {
  low: {
    label: '낮음',
    color: '#22c55e',
    description: '건강한 상태입니다! 현재 스트레스 관리가 잘 되고 있어요.',
  },
  moderate: {
    label: '보통',
    color: '#eab308',
    description: '약간의 스트레스가 있지만 관리 가능한 수준입니다.',
  },
  high: {
    label: '높음',
    color: '#f97316',
    description: '스트레스 수준이 높습니다. 휴식과 자기 관리가 필요해요.',
  },
  veryHigh: {
    label: '매우 높음',
    color: '#ef4444',
    description: '스트레스가 매우 높은 상태입니다. 전문가 상담을 권장합니다.',
  },
};
