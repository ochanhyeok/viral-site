import { useState, useMemo } from 'react';
import { SEO } from '../../components/SEO';
import { Recommendations } from '../../components/Recommendations';

interface Result {
  annualDividend: number;
  quarterlyDividend: number;
  monthlyDividend: number;
  dividendYield: number;
  afterTaxDividend: number;
  tax: number;
  yearsToDouble: number;
}

export default function DividendCalculator() {
  const [investAmount, setInvestAmount] = useState<string>('1000'); // 만원
  const [stockPrice, setStockPrice] = useState<string>('50000'); // 원
  const [dividendPerShare, setDividendPerShare] = useState<string>('2000'); // 원
  const [dividendFrequency, setDividendFrequency] = useState<'annual' | 'quarterly'>('annual');
  const [showResult, setShowResult] = useState(false);

  const TAX_RATE = 0.154; // 배당소득세 15.4%

  const result = useMemo<Result | null>(() => {
    const investment = parseFloat(investAmount) * 10000;
    const price = parseFloat(stockPrice);
    const dividend = parseFloat(dividendPerShare);

    if (isNaN(investment) || isNaN(price) || isNaN(dividend) ||
        investment <= 0 || price <= 0 || dividend <= 0) {
      return null;
    }

    const shares = Math.floor(investment / price);
    if (shares <= 0) return null;

    const annualDividendPerShare = dividendFrequency === 'quarterly' ? dividend * 4 : dividend;
    const annualDividend = shares * annualDividendPerShare;
    const tax = Math.round(annualDividend * TAX_RATE);
    const afterTaxDividend = annualDividend - tax;

    const dividendYield = (annualDividendPerShare / price) * 100;
    const quarterlyDividend = Math.round(afterTaxDividend / 4);
    const monthlyDividend = Math.round(afterTaxDividend / 12);

    // 배당금만으로 투자금 회수 기간 (세후)
    const yearsToDouble = afterTaxDividend > 0 ? Math.ceil(investment / afterTaxDividend) : 999;

    return {
      annualDividend: Math.round(annualDividend),
      quarterlyDividend,
      monthlyDividend,
      dividendYield,
      afterTaxDividend: Math.round(afterTaxDividend),
      tax,
      yearsToDouble,
    };
  }, [investAmount, stockPrice, dividendPerShare, dividendFrequency]);

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
      return `${formatNumber(Math.floor(num / 10000))}만 ${formatNumber(num % 10000)}원`;
    }
    return `${formatNumber(num)}원`;
  };

  const shares = useMemo(() => {
    const investment = parseFloat(investAmount) * 10000;
    const price = parseFloat(stockPrice);
    if (isNaN(investment) || isNaN(price) || price <= 0) return 0;
    return Math.floor(investment / price);
  }, [investAmount, stockPrice]);

  return (
    <>
      <SEO
        title="배당금 계산기"
        description="주식 배당금 계산기. 배당 수익률, 세후 배당금(15.4%), 월별 배당금을 계산해보세요. 투자금 회수 기간도 확인!"
        keywords="배당금계산기,배당수익률,배당소득세,월배당금,배당주투자,배당주,고배당주"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '배당금 계산기',
          description: '배당 수익률, 세후 배당금, 월별 배당금 계산',
          url: 'https://viral-site-opal.vercel.app/dividend',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' }
        }}
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 mb-4">
            <span className="text-3xl">💵</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            배당금 계산기
          </h1>
          <p className="text-gray-500">
            예상 배당 수익을 계산해보세요
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-5">
          {/* 투자 금액 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              투자 금액
            </label>
            <div className="relative">
              <input
                type="number"
                value={investAmount}
                onChange={(e) => { setInvestAmount(e.target.value); setShowResult(false); }}
                placeholder="투자할 금액"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                만원
              </span>
            </div>
          </div>

          {/* 주가 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              현재 주가 (1주당)
            </label>
            <div className="relative">
              <input
                type="number"
                value={stockPrice}
                onChange={(e) => { setStockPrice(e.target.value); setShowResult(false); }}
                placeholder="1주당 가격"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                원
              </span>
            </div>
            {shares > 0 && (
              <p className="mt-1.5 text-xs text-amber-600 font-medium">
                매수 가능: {formatNumber(shares)}주
              </p>
            )}
          </div>

          {/* 배당금 지급 주기 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              배당 지급 주기
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setDividendFrequency('annual'); setShowResult(false); }}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  dividendFrequency === 'annual'
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">연 1회</div>
                <div className="text-xs opacity-70">대부분의 국내 주식</div>
              </button>
              <button
                onClick={() => { setDividendFrequency('quarterly'); setShowResult(false); }}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  dividendFrequency === 'quarterly'
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">분기 배당</div>
                <div className="text-xs opacity-70">미국 주식 등</div>
              </button>
            </div>
          </div>

          {/* 1주당 배당금 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {dividendFrequency === 'annual' ? '연간' : '분기'} 배당금 (1주당)
            </label>
            <div className="relative">
              <input
                type="number"
                value={dividendPerShare}
                onChange={(e) => { setDividendPerShare(e.target.value); setShowResult(false); }}
                placeholder="1주당 배당금"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                원
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              증권사 앱에서 배당금 정보를 확인하세요
            </p>
          </div>

          {/* 계산 버튼 */}
          <button
            onClick={handleCalculate}
            disabled={!result}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            배당금 계산하기
          </button>
        </div>

        {/* 결과 */}
        {showResult && result && (
          <div className="space-y-4 animate-fadeIn">
            {/* 연간 배당금 */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-center">
                <p className="text-amber-100 text-sm mb-1">연간 세후 배당금</p>
                <p className="text-4xl font-bold mb-3">
                  {formatWon(result.afterTaxDividend)}
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <p className="text-amber-200 text-xs">배당 수익률</p>
                    <p className="font-bold text-lg">{result.dividendYield.toFixed(2)}%</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <p className="text-amber-200 text-xs">보유 주식</p>
                    <p className="font-bold text-lg">{formatNumber(shares)}주</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 배당금 분석 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📅</span>
                배당금 분석
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-amber-600 mb-1">월 평균</p>
                  <p className="text-lg font-bold text-amber-700">{formatWon(result.monthlyDividend)}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-amber-600 mb-1">분기 평균</p>
                  <p className="text-lg font-bold text-amber-700">{formatWon(result.quarterlyDividend)}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-amber-600 mb-1">연간</p>
                  <p className="text-lg font-bold text-amber-700">{formatWon(result.afterTaxDividend)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">세전 배당금</span>
                  <span className="font-semibold text-gray-900">{formatWon(result.annualDividend)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">배당소득세 (15.4%)</span>
                  <span className="font-semibold text-red-500">-{formatWon(result.tax)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-amber-50 rounded-xl px-4 -mx-4">
                  <span className="font-semibold text-gray-700">세후 배당금</span>
                  <span className="font-bold text-amber-600">{formatWon(result.afterTaxDividend)}</span>
                </div>
              </div>
            </div>

            {/* 투자금 회수 기간 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                투자금 회수
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 text-center">
                <p className="text-blue-700 text-sm mb-1">
                  배당금만으로 원금 회수까지
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  약 {result.yearsToDouble}년
                </p>
                <p className="text-xs text-blue-500 mt-2">
                  주가 변동 미포함, 배당금 재투자 미반영
                </p>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex gap-3">
                <span className="text-xl">💡</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">2026년 배당소득세 기준</p>
                  <ul className="space-y-1 text-blue-700 text-xs">
                    <li>• 기본 세율: 15.4% (소득세 14% + 지방소득세 1.4%)</li>
                    <li>• 2천만원 초과 분리과세: 22%~33% 누진세율 적용</li>
                    <li>• 금융소득 2천만원 초과 시 종합소득 합산 가능</li>
                    <li>• 해외주식: 현지 원천징수 후 국내 차액 정산</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 추천 */}
        <Recommendations currentPath="/dividend" maxItems={3} />
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
