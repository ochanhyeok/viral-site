import { useState, useMemo } from 'react';
import { SEO } from '../../components/SEO';
import { Recommendations } from '../../components/Recommendations';

type CalcType = 'deposit' | 'savings';
type InterestType = 'simple' | 'compound';

interface Result {
  principal: number;
  totalInterest: number;
  afterTaxInterest: number;
  tax: number;
  totalAmount: number;
  afterTaxTotal: number;
  monthlyBreakdown?: { month: number; principal: number; interest: number; total: number }[];
}

export default function SavingsCalculator() {
  const [calcType, setCalcType] = useState<CalcType>('savings');
  const [interestType, setInterestType] = useState<InterestType>('simple');
  const [principal, setPrincipal] = useState<string>('100'); // 예금: 목돈(만원), 적금: 월납입액(만원)
  const [rate, setRate] = useState<string>('4.0');
  const [months, setMonths] = useState<string>('12');
  const [showResult, setShowResult] = useState(false);

  const TAX_RATE = 0.154; // 이자소득세 15.4%

  const result = useMemo<Result | null>(() => {
    const p = parseFloat(principal) * 10000; // 만원 -> 원
    const r = parseFloat(rate) / 100; // 연이율
    const m = parseInt(months);

    if (isNaN(p) || isNaN(r) || isNaN(m) || p <= 0 || r <= 0 || m <= 0) {
      return null;
    }

    let totalPrincipal = 0;
    let totalInterest = 0;

    if (calcType === 'deposit') {
      // 정기예금: 목돈 예치
      totalPrincipal = p;
      if (interestType === 'simple') {
        // 단리: 원금 × 이율 × 기간
        totalInterest = p * r * (m / 12);
      } else {
        // 복리 (월복리 가정)
        const monthlyRate = r / 12;
        totalInterest = p * Math.pow(1 + monthlyRate, m) - p;
      }
    } else {
      // 정기적금: 매월 납입
      totalPrincipal = p * m;
      if (interestType === 'simple') {
        // 단리: 각 회차별 이자 합산
        // 첫 달 납입금은 m개월, 마지막 납입금은 1개월 이자
        for (let i = 1; i <= m; i++) {
          const remainingMonths = m - i + 1;
          totalInterest += p * (r / 12) * remainingMonths;
        }
      } else {
        // 복리 (월복리)
        const monthlyRate = r / 12;
        for (let i = 1; i <= m; i++) {
          const remainingMonths = m - i + 1;
          totalInterest += p * (Math.pow(1 + monthlyRate, remainingMonths) - 1);
        }
      }
    }

    const tax = totalInterest * TAX_RATE;
    const afterTaxInterest = totalInterest - tax;

    return {
      principal: totalPrincipal,
      totalInterest: Math.round(totalInterest),
      afterTaxInterest: Math.round(afterTaxInterest),
      tax: Math.round(tax),
      totalAmount: Math.round(totalPrincipal + totalInterest),
      afterTaxTotal: Math.round(totalPrincipal + afterTaxInterest),
    };
  }, [calcType, interestType, principal, rate, months]);

  const handleCalculate = () => {
    if (result) {
      setShowResult(true);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const formatWon = (num: number) => {
    if (num >= 100000000) {
      const uk = Math.floor(num / 100000000);
      const man = Math.floor((num % 100000000) / 10000);
      return man > 0 ? `${uk}억 ${formatNumber(man)}만원` : `${uk}억원`;
    } else if (num >= 10000) {
      return `${formatNumber(Math.floor(num / 10000))}만 ${formatNumber(num % 10000)}원`;
    }
    return `${formatNumber(num)}원`;
  };

  return (
    <>
      <SEO
        title="적금 이자 계산기"
        description="정기적금, 정기예금 이자 계산기. 단리/복리, 세전/세후 이자를 한번에 계산해보세요. 2026년 이자소득세 15.4% (2천만원 초과 시 종합과세) 반영"
        keywords="적금 이자 계산기, 예금 이자 계산기, 복리 계산, 단리 계산, 이자소득세, 정기적금, 정기예금"
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 mb-4">
            <span className="text-3xl">🏦</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            적금/예금 이자 계산기
          </h1>
          <p className="text-gray-500">
            세전/세후 이자를 한번에 계산해보세요
          </p>
        </div>

        {/* 계산기 타입 선택 */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setCalcType('savings'); setShowResult(false); }}
              className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                calcType === 'savings'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg mr-2">💰</span>
              정기적금
            </button>
            <button
              onClick={() => { setCalcType('deposit'); setShowResult(false); }}
              className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                calcType === 'deposit'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg mr-2">🏦</span>
              정기예금
            </button>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-5">
          {/* 금액 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {calcType === 'savings' ? '월 납입액' : '예금액'}
            </label>
            <div className="relative">
              <input
                type="number"
                value={principal}
                onChange={(e) => { setPrincipal(e.target.value); setShowResult(false); }}
                placeholder={calcType === 'savings' ? '매월 납입할 금액' : '예금할 금액'}
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                만원
              </span>
            </div>
            {principal && (
              <p className="mt-1.5 text-xs text-gray-400">
                = {formatNumber(parseFloat(principal) * 10000 || 0)}원
              </p>
            )}
          </div>

          {/* 금리 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              연 이자율 (금리)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => { setRate(e.target.value); setShowResult(false); }}
                placeholder="연 이자율"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                %
              </span>
            </div>
          </div>

          {/* 기간 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {calcType === 'savings' ? '적금 기간' : '예금 기간'}
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[6, 12, 24, 36].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMonths(m.toString()); setShowResult(false); }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    months === m.toString()
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {m}개월
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                value={months}
                onChange={(e) => { setMonths(e.target.value); setShowResult(false); }}
                placeholder="직접 입력"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                개월
              </span>
            </div>
          </div>

          {/* 이자 계산 방식 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              이자 계산 방식
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setInterestType('simple'); setShowResult(false); }}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  interestType === 'simple'
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">단리</div>
                <div className="text-xs opacity-70">원금에만 이자</div>
              </button>
              <button
                onClick={() => { setInterestType('compound'); setShowResult(false); }}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  interestType === 'compound'
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">복리</div>
                <div className="text-xs opacity-70">이자에도 이자</div>
              </button>
            </div>
          </div>

          {/* 계산 버튼 */}
          <button
            onClick={handleCalculate}
            disabled={!result}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            이자 계산하기
          </button>
        </div>

        {/* 결과 */}
        {showResult && result && (
          <div className="space-y-4 animate-fadeIn">
            {/* 만기 수령액 */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-center">
                <p className="text-emerald-100 text-sm mb-1">세후 만기 수령액</p>
                <p className="text-4xl font-bold mb-2">
                  {formatWon(result.afterTaxTotal)}
                </p>
                <p className="text-emerald-200 text-sm">
                  세전: {formatWon(result.totalAmount)}
                </p>
              </div>
            </div>

            {/* 상세 내역 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span>
                상세 내역
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">
                    {calcType === 'savings' ? '총 납입 원금' : '예금 원금'}
                  </span>
                  <span className="font-semibold text-gray-900">{formatWon(result.principal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">세전 이자</span>
                  <span className="font-semibold text-emerald-600">+{formatWon(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">이자소득세 (15.4%)</span>
                  <span className="font-semibold text-red-500">-{formatWon(result.tax)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">세후 이자</span>
                  <span className="font-semibold text-emerald-600">+{formatWon(result.afterTaxInterest)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-emerald-50 rounded-xl px-4 -mx-4">
                  <span className="font-semibold text-gray-900">세후 수령액</span>
                  <span className="font-bold text-emerald-600 text-lg">{formatWon(result.afterTaxTotal)}</span>
                </div>
              </div>
            </div>

            {/* 수익률 비교 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📈</span>
                수익률
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">세전 수익률</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {((result.totalInterest / result.principal) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-emerald-600 mb-1">세후 수익률</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {((result.afterTaxInterest / result.principal) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex gap-3">
                <span className="text-xl">💡</span>
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">알아두세요</p>
                  <ul className="space-y-1 text-amber-700">
                    <li>• 이자소득세 15.4% (소득세 14% + 지방소득세 1.4%)</li>
                    <li>• 비과세 상품은 세금 공제 없이 세전 이자 전액 수령</li>
                    <li>• 실제 이자는 은행별 이자 계산 방식에 따라 다를 수 있음</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 추천 */}
        <Recommendations currentPath="/savings" maxItems={3} />
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
