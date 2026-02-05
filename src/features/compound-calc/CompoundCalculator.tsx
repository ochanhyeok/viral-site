import { useState, useMemo } from 'react';
import { SEO } from '../../components/SEO';
import { Recommendations } from '../../components/Recommendations';

interface YearlyData {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

interface Result {
  finalAmount: number;
  totalPrincipal: number;
  totalInterest: number;
  yearlyData: YearlyData[];
  doublingYears: number;
}

export default function CompoundCalculator() {
  const [initialAmount, setInitialAmount] = useState<string>('1000'); // 만원
  const [monthlyContribution, setMonthlyContribution] = useState<string>('50'); // 만원
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('20');
  const [showResult, setShowResult] = useState(false);

  const result = useMemo<Result | null>(() => {
    const initial = parseFloat(initialAmount) * 10000;
    const monthly = parseFloat(monthlyContribution) * 10000;
    const rate = parseFloat(annualRate) / 100;
    const period = parseInt(years);

    if (isNaN(initial) || isNaN(monthly) || isNaN(rate) || isNaN(period) ||
        initial < 0 || monthly < 0 || rate <= 0 || period <= 0) {
      return null;
    }

    const monthlyRate = rate / 12;
    const yearlyData: YearlyData[] = [];
    let currentAmount = initial;
    let totalContributions = initial;

    for (let year = 1; year <= period; year++) {
      // 12개월 동안 매월 복리 계산
      for (let month = 1; month <= 12; month++) {
        currentAmount = currentAmount * (1 + monthlyRate) + monthly;
        totalContributions += monthly;
      }

      yearlyData.push({
        year,
        principal: Math.round(totalContributions),
        interest: Math.round(currentAmount - totalContributions),
        total: Math.round(currentAmount),
      });
    }

    // 72법칙: 원금이 2배가 되는 데 걸리는 시간
    const doublingYears = Math.round(72 / (rate * 100));

    return {
      finalAmount: Math.round(currentAmount),
      totalPrincipal: Math.round(totalContributions),
      totalInterest: Math.round(currentAmount - totalContributions),
      yearlyData,
      doublingYears,
    };
  }, [initialAmount, monthlyContribution, annualRate, years]);

  const handleCalculate = () => {
    if (result) {
      setShowResult(true);
    }
  };

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');

  const formatWon = (num: number) => {
    if (num >= 100000000) {
      const uk = Math.floor(num / 100000000);
      const man = Math.floor((num % 100000000) / 10000);
      return man > 0 ? `${uk}억 ${formatNumber(man)}만원` : `${uk}억원`;
    } else if (num >= 10000) {
      return `${formatNumber(Math.floor(num / 10000))}만원`;
    }
    return `${formatNumber(num)}원`;
  };

  // 차트의 최대 높이를 위한 계산
  const maxAmount = result ? Math.max(...result.yearlyData.map(d => d.total)) : 0;

  return (
    <>
      <SEO
        title="복리 계산기"
        description="복리의 마법을 체험해보세요. 초기 투자금과 월 적립금으로 미래 자산을 시뮬레이션하고, 72법칙으로 자산 2배 시점을 확인하세요."
        keywords="복리 계산기, 72법칙, 복리 효과, 투자 시뮬레이션, 자산 증식, 장기 투자"
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
            <span className="text-3xl">📈</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            복리 계산기
          </h1>
          <p className="text-gray-500">
            시간이 만드는 복리의 마법
          </p>
        </div>

        {/* 72법칙 안내 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 mb-1">72법칙이란?</h3>
              <p className="text-sm text-indigo-700">
                72를 연 수익률로 나누면 원금이 <span className="font-bold">2배</span>가 되는 데 걸리는 시간을 알 수 있어요.
              </p>
              <p className="text-xs text-indigo-500 mt-1">
                예: 연 8% 수익률 → 72 ÷ 8 = 약 9년 후 2배
              </p>
            </div>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-5">
          {/* 초기 투자금 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              초기 투자금
            </label>
            <div className="relative">
              <input
                type="number"
                value={initialAmount}
                onChange={(e) => { setInitialAmount(e.target.value); setShowResult(false); }}
                placeholder="처음 투자할 금액"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                만원
              </span>
            </div>
          </div>

          {/* 월 적립금 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              월 적립금
            </label>
            <div className="relative">
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => { setMonthlyContribution(e.target.value); setShowResult(false); }}
                placeholder="매월 추가 투자 금액"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                만원
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              0으로 설정하면 초기 투자금만으로 계산해요
            </p>
          </div>

          {/* 연 수익률 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              예상 연 수익률
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[5, 7, 10, 15].map((r) => (
                <button
                  key={r}
                  onClick={() => { setAnnualRate(r.toString()); setShowResult(false); }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    annualRate === r.toString()
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={annualRate}
                onChange={(e) => { setAnnualRate(e.target.value); setShowResult(false); }}
                placeholder="직접 입력"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                %
              </span>
            </div>
          </div>

          {/* 투자 기간 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              투자 기간
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[10, 20, 30, 40].map((y) => (
                <button
                  key={y}
                  onClick={() => { setYears(y.toString()); setShowResult(false); }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    years === y.toString()
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {y}년
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                value={years}
                onChange={(e) => { setYears(e.target.value); setShowResult(false); }}
                placeholder="직접 입력"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                년
              </span>
            </div>
          </div>

          {/* 계산 버튼 */}
          <button
            onClick={handleCalculate}
            disabled={!result}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            복리 시뮬레이션
          </button>
        </div>

        {/* 결과 */}
        {showResult && result && (
          <div className="space-y-4 animate-fadeIn">
            {/* 최종 금액 */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-center">
                <p className="text-indigo-100 text-sm mb-1">{years}년 후 예상 자산</p>
                <p className="text-4xl font-bold mb-2">
                  {formatWon(result.finalAmount)}
                </p>
                <div className="flex justify-center gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-indigo-200 text-xs">원금</p>
                    <p className="font-semibold">{formatWon(result.totalPrincipal)}</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <p className="text-indigo-200 text-xs">수익</p>
                    <p className="font-semibold text-yellow-300">+{formatWon(result.totalInterest)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 72법칙 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                72법칙 적용
              </h3>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <div className="text-center">
                  <p className="text-amber-700 text-sm mb-1">
                    연 {annualRate}% 수익률로 원금이 2배가 되는 시간
                  </p>
                  <p className="text-3xl font-bold text-amber-600">
                    약 {result.doublingYears}년
                  </p>
                  <p className="text-xs text-amber-500 mt-2">
                    72 ÷ {annualRate} = {(72 / parseFloat(annualRate)).toFixed(1)}년
                  </p>
                </div>
              </div>
            </div>

            {/* 자산 성장 차트 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span>
                자산 성장 그래프
              </h3>

              <div className="relative h-48 flex items-end gap-1 pt-6">
                {result.yearlyData.map((data, index) => {
                  const height = (data.total / maxAmount) * 100;
                  const principalHeight = (data.principal / maxAmount) * 100;
                  const showLabel = index === 0 ||
                    index === result.yearlyData.length - 1 ||
                    (result.yearlyData.length > 10 && index % 5 === 0) ||
                    (result.yearlyData.length <= 10);

                  return (
                    <div
                      key={data.year}
                      className="flex-1 flex flex-col items-center group relative"
                    >
                      {/* 툴팁 */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {data.year}년: {formatWon(data.total)}
                        </div>
                      </div>

                      {/* 바 */}
                      <div
                        className="w-full rounded-t-sm relative overflow-hidden transition-all hover:opacity-80"
                        style={{ height: `${height}%` }}
                      >
                        {/* 이자 부분 */}
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-400 to-purple-400"
                          style={{ height: `${100 - (principalHeight / height * 100)}%` }}
                        />
                        {/* 원금 부분 */}
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-indigo-500"
                          style={{ height: `${principalHeight / height * 100}%` }}
                        />
                      </div>

                      {/* 연도 라벨 */}
                      {showLabel && (
                        <span className="text-[10px] text-gray-400 mt-1">{data.year}년</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 범례 */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                  <span className="text-xs text-gray-600">원금</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-purple-400" />
                  <span className="text-xs text-gray-600">복리 수익</span>
                </div>
              </div>
            </div>

            {/* 연도별 상세 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 px-2 flex items-center gap-2">
                <span className="text-lg">📋</span>
                연도별 상세
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 text-left font-semibold text-gray-600">연도</th>
                      <th className="py-2 px-3 text-right font-semibold text-gray-600">원금</th>
                      <th className="py-2 px-3 text-right font-semibold text-gray-600">수익</th>
                      <th className="py-2 px-3 text-right font-semibold text-gray-600">총 자산</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyData.filter((_, i) =>
                      i === 0 || i === result.yearlyData.length - 1 ||
                      (i + 1) % 5 === 0
                    ).map((data) => (
                      <tr key={data.year} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-600">{data.year}년</td>
                        <td className="py-2 px-3 text-right">{formatWon(data.principal)}</td>
                        <td className="py-2 px-3 text-right text-purple-600">+{formatWon(data.interest)}</td>
                        <td className="py-2 px-3 text-right font-semibold text-indigo-600">{formatWon(data.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex gap-3">
                <span className="text-xl">⚠️</span>
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">투자 유의사항</p>
                  <ul className="space-y-1 text-amber-700 text-xs">
                    <li>• 이 계산은 일정한 수익률을 가정한 시뮬레이션입니다</li>
                    <li>• 실제 투자 수익은 시장 상황에 따라 변동됩니다</li>
                    <li>• 세금 및 수수료는 반영되지 않았습니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 추천 */}
        <Recommendations currentPath="/compound" maxItems={3} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
