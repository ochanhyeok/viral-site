import { useState, useMemo } from 'react';
import { SEO } from '../../components/SEO';
import { Recommendations } from '../../components/Recommendations';

type MarketType = 'kospi' | 'kosdaq' | 'overseas';

interface Result {
  buyTotal: number;
  buyCommission: number;
  sellTotal: number;
  sellCommission: number;
  transactionTax: number;
  totalCost: number;
  netProfit: number;
  profitRate: number;
  breakEvenPrice: number;
}

export default function StockCalculator() {
  const [buyPrice, setBuyPrice] = useState<string>('50000');
  const [sellPrice, setSellPrice] = useState<string>('55000');
  const [quantity, setQuantity] = useState<string>('10');
  const [commission, setCommission] = useState<string>('0.015'); // 0.015%
  const [marketType, setMarketType] = useState<MarketType>('kospi');
  const [showResult, setShowResult] = useState(false);

  // 증권거래세율 (매도 시) - 2026년 기준
  const taxRates: Record<MarketType, number> = {
    kospi: 0.0020,    // 0.20% (증권거래세 0.05% + 농어촌특별세 0.15%)
    kosdaq: 0.0020,   // 0.20%
    overseas: 0,       // 해외주식은 양도소득세로 별도 (22%)
  };

  const result = useMemo<Result | null>(() => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseInt(quantity);
    const commissionRate = parseFloat(commission) / 100;

    if (isNaN(buy) || isNaN(sell) || isNaN(qty) || isNaN(commissionRate) ||
        buy <= 0 || sell <= 0 || qty <= 0 || commissionRate < 0) {
      return null;
    }

    const buyTotal = buy * qty;
    const sellTotal = sell * qty;

    const buyCommission = Math.round(buyTotal * commissionRate);
    const sellCommission = Math.round(sellTotal * commissionRate);
    const transactionTax = Math.round(sellTotal * taxRates[marketType]);

    const totalCost = buyCommission + sellCommission + transactionTax;
    const netProfit = sellTotal - buyTotal - totalCost;
    const profitRate = ((netProfit) / buyTotal) * 100;

    // 손익분기점 (수수료+세금 포함)
    const breakEvenPrice = Math.ceil(
      (buyTotal + buyCommission + buyTotal * commissionRate + buyTotal * taxRates[marketType]) /
      (qty * (1 - commissionRate - taxRates[marketType]))
    );

    return {
      buyTotal,
      buyCommission,
      sellTotal,
      sellCommission,
      transactionTax,
      totalCost,
      netProfit,
      profitRate,
      breakEvenPrice,
    };
  }, [buyPrice, sellPrice, quantity, commission, marketType]);

  const handleCalculate = () => {
    if (result) {
      setShowResult(true);
    }
  };

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');

  const formatWon = (num: number) => {
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (absNum >= 100000000) {
      const uk = Math.floor(absNum / 100000000);
      const man = Math.floor((absNum % 100000000) / 10000);
      return sign + (man > 0 ? `${uk}억 ${formatNumber(man)}만원` : `${uk}억원`);
    } else if (absNum >= 10000) {
      return sign + `${formatNumber(Math.floor(absNum / 10000))}만 ${formatNumber(absNum % 10000)}원`;
    }
    return sign + `${formatNumber(absNum)}원`;
  };

  const markets = [
    { value: 'kospi', label: '코스피', tax: '0.20%' },
    { value: 'kosdaq', label: '코스닥', tax: '0.20%' },
    { value: 'overseas', label: '해외주식', tax: '양도세 22%' },
  ];

  return (
    <>
      <SEO
        title="주식 수익률 계산기"
        description="주식 매매 수익률 계산기. 수수료, 증권거래세 포함 실제 순수익과 손익분기점을 계산해보세요."
        keywords="주식 수익률 계산기, 주식 수익 계산, 증권거래세, 매매 수수료, 손익분기점, 주식 투자"
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            주식 수익률 계산기
          </h1>
          <p className="text-gray-500">
            수수료와 세금 포함 실제 수익을 계산하세요
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-5">
          {/* 시장 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              시장 선택
            </label>
            <div className="grid grid-cols-3 gap-2">
              {markets.map((m) => (
                <button
                  key={m.value}
                  onClick={() => { setMarketType(m.value as MarketType); setShowResult(false); }}
                  className={`py-3 px-2 rounded-xl font-medium transition-all ${
                    marketType === m.value
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold text-sm">{m.label}</div>
                  <div className="text-[10px] opacity-70">거래세 {m.tax}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 매수가 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              매수 단가
            </label>
            <div className="relative">
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => { setBuyPrice(e.target.value); setShowResult(false); }}
                placeholder="1주당 매수 가격"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                원
              </span>
            </div>
          </div>

          {/* 매도가 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              매도 단가
            </label>
            <div className="relative">
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => { setSellPrice(e.target.value); setShowResult(false); }}
                placeholder="1주당 매도 가격"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                원
              </span>
            </div>
          </div>

          {/* 수량 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              수량
            </label>
            <div className="relative">
              <input
                type="number"
                value={quantity}
                onChange={(e) => { setQuantity(e.target.value); setShowResult(false); }}
                placeholder="매매 수량"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                주
              </span>
            </div>
          </div>

          {/* 수수료율 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              증권사 수수료율
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {['0.015', '0.05', '0.1', '0.25'].map((r) => (
                <button
                  key={r}
                  onClick={() => { setCommission(r); setShowResult(false); }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    commission === r
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
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
                step="0.001"
                value={commission}
                onChange={(e) => { setCommission(e.target.value); setShowResult(false); }}
                placeholder="직접 입력"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                %
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              MTS/HTS 평균 0.015%~0.05%, 영업점 0.1%~0.5%
            </p>
          </div>

          {/* 계산 버튼 */}
          <button
            onClick={handleCalculate}
            disabled={!result}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            수익률 계산하기
          </button>
        </div>

        {/* 결과 */}
        {showResult && result && (
          <div className="space-y-4 animate-fadeIn">
            {/* 순수익 */}
            <div className={`rounded-2xl p-6 text-white shadow-xl ${
              result.netProfit >= 0
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-red-500 to-rose-600'
            }`}>
              <div className="text-center">
                <p className="text-white/80 text-sm mb-1">순수익 (세금/수수료 제외)</p>
                <p className="text-4xl font-bold mb-2">
                  {result.netProfit >= 0 ? '+' : ''}{formatWon(result.netProfit)}
                </p>
                <p className={`text-lg font-semibold ${
                  result.netProfit >= 0 ? 'text-green-100' : 'text-red-100'
                }`}>
                  수익률 {result.profitRate >= 0 ? '+' : ''}{result.profitRate.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* 상세 내역 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📋</span>
                매매 상세
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">매수 금액</span>
                  <span className="font-semibold text-gray-900">{formatWon(result.buyTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">매수 수수료</span>
                  <span className="font-semibold text-red-500">-{formatWon(result.buyCommission)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">매도 금액</span>
                  <span className="font-semibold text-gray-900">{formatWon(result.sellTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">매도 수수료</span>
                  <span className="font-semibold text-red-500">-{formatWon(result.sellCommission)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">증권거래세</span>
                  <span className="font-semibold text-red-500">-{formatWon(result.transactionTax)}</span>
                </div>
                <div className="flex justify-between items-center py-2 bg-gray-50 rounded-xl px-4 -mx-4">
                  <span className="font-semibold text-gray-700">총 비용 (수수료+세금)</span>
                  <span className="font-bold text-red-600">{formatWon(result.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* 손익분기점 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                손익분기점
              </h3>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
                <p className="text-amber-700 text-sm mb-1">
                  수수료/세금 포함 본전 매도가
                </p>
                <p className="text-3xl font-bold text-amber-600">
                  {formatNumber(result.breakEvenPrice)}원
                </p>
                <p className="text-xs text-amber-500 mt-2">
                  매수가 대비 +{((result.breakEvenPrice / parseFloat(buyPrice) - 1) * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex gap-3">
                <span className="text-xl">💡</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">2026년 세율 기준</p>
                  <ul className="space-y-1 text-blue-700 text-xs">
                    <li>• 코스피: 증권거래세 0.05% + 농어촌특별세 0.15% = 0.20%</li>
                    <li>• 코스닥/K-OTC: 증권거래세 0.20%</li>
                    <li>• 해외주식 양도소득세: 22% (250만원 공제 후)</li>
                    <li>• 대주주 양도세: 22~27.5% (종목별 10억 이상 보유)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 추천 */}
        <Recommendations currentPath="/stock" maxItems={3} />
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
