// 상위 몇% 표시 컴포넌트
import { useMemo } from 'react';

interface PercentileProps {
  value: number;
  type: 'salary' | 'retirement';
}

// 연봉 분포 (한국 통계 기반 대략적 분포)
const salaryDistribution = [
  { threshold: 150000000, percentile: 1 },   // 1.5억 이상: 상위 1%
  { threshold: 120000000, percentile: 3 },   // 1.2억 이상: 상위 3%
  { threshold: 100000000, percentile: 5 },   // 1억 이상: 상위 5%
  { threshold: 80000000, percentile: 10 },   // 8천 이상: 상위 10%
  { threshold: 70000000, percentile: 15 },   // 7천 이상: 상위 15%
  { threshold: 60000000, percentile: 25 },   // 6천 이상: 상위 25%
  { threshold: 50000000, percentile: 40 },   // 5천 이상: 상위 40%
  { threshold: 40000000, percentile: 55 },   // 4천 이상: 상위 55%
  { threshold: 35000000, percentile: 65 },   // 3.5천 이상: 상위 65%
  { threshold: 30000000, percentile: 75 },   // 3천 이상: 상위 75%
  { threshold: 25000000, percentile: 85 },   // 2.5천 이상: 상위 85%
  { threshold: 0, percentile: 95 },          // 그 외: 상위 95%
];

// 퇴직금 분포 (재직기간 기반 대략적 분포)
const retirementDistribution = [
  { threshold: 100000000, percentile: 1 },   // 1억 이상: 상위 1%
  { threshold: 70000000, percentile: 5 },    // 7천 이상: 상위 5%
  { threshold: 50000000, percentile: 10 },   // 5천 이상: 상위 10%
  { threshold: 30000000, percentile: 20 },   // 3천 이상: 상위 20%
  { threshold: 20000000, percentile: 35 },   // 2천 이상: 상위 35%
  { threshold: 10000000, percentile: 50 },   // 1천 이상: 상위 50%
  { threshold: 5000000, percentile: 70 },    // 5백 이상: 상위 70%
  { threshold: 0, percentile: 90 },          // 그 외: 상위 90%
];

function getPercentile(value: number, type: 'salary' | 'retirement'): number {
  const distribution = type === 'salary' ? salaryDistribution : retirementDistribution;

  for (const item of distribution) {
    if (value >= item.threshold) {
      return item.percentile;
    }
  }
  return 95;
}

function getPercentileMessage(percentile: number): { emoji: string; message: string; color: string } {
  if (percentile <= 1) {
    return { emoji: '👑', message: '전설급이시네요...', color: 'from-yellow-400 to-amber-500' };
  }
  if (percentile <= 5) {
    return { emoji: '🔥', message: '상위권 중에서도 상위권!', color: 'from-orange-400 to-red-500' };
  }
  if (percentile <= 10) {
    return { emoji: '💎', message: '부럽습니다 진심으로...', color: 'from-purple-400 to-pink-500' };
  }
  if (percentile <= 25) {
    return { emoji: '✨', message: '평균 이상이시네요!', color: 'from-blue-400 to-indigo-500' };
  }
  if (percentile <= 50) {
    return { emoji: '👍', message: '딱 중간! 나쁘지 않아요', color: 'from-green-400 to-emerald-500' };
  }
  if (percentile <= 75) {
    return { emoji: '💪', message: '조금만 더 화이팅!', color: 'from-teal-400 to-cyan-500' };
  }
  return { emoji: '🌱', message: '시작이 반이에요!', color: 'from-gray-400 to-gray-500' };
}

export function Percentile({ value, type }: PercentileProps) {
  const percentile = useMemo(() => getPercentile(value, type), [value, type]);
  const { emoji, message, color } = useMemo(() => getPercentileMessage(percentile), [percentile]);

  return (
    <div className={`bg-gradient-to-r ${color} rounded-2xl p-4 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <p className="text-xs text-white/80">전체 직장인 중</p>
            <p className="text-xl font-bold">상위 {percentile}%</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/90">{message}</p>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/80 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${100 - percentile}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/60 mt-1">
        <span>상위</span>
        <span>하위</span>
      </div>
    </div>
  );
}
