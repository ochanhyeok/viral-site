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

// 국내 배당주 프리셋 (2026년 2월 5일 기준)
const KOREA_PRESETS = [
  {
    name: '삼성전자',
    price: 159000,  // 2026.02.05 기준
    dividend: 365,  // 분기 배당
    frequency: 'quarterly' as const,
    yield: '0.9%',
    tag: '대표주',
    note: '분기배당'
  },
  {
    name: '하나금융지주',
    price: 112000,  // 2026.02.05 기준
    dividend: 3600,  // 연간 배당
    frequency: 'annual' as const,
    yield: '3.2%',
    tag: '금융',
    note: '금융주'
  },
  {
    name: 'KT&G',
    price: 162000,  // 2026.02.05 기준
    dividend: 6000,  // 연간 배당
    frequency: 'annual' as const,
    yield: '3.7%',
    tag: '고배당',
    note: '배당성향 50%+'
  },
  {
    name: 'POSCO홀딩스',
    price: 360000,  // 2026.02.04 기준
    dividend: 17000,
    frequency: 'annual' as const,
    yield: '4.7%',
    tag: '고배당',
    note: '철강 대장주'
  },
  {
    name: 'SK텔레콤',
    price: 71000,  // 2026.02 기준
    dividend: 3000,
    frequency: 'annual' as const,
    yield: '4.2%',
    tag: '통신',
    note: '안정적'
  },
  {
    name: '삼성화재우',
    price: 497000,  // 2026.01 기준
    dividend: 19005,
    frequency: 'annual' as const,
    yield: '3.8%',
    tag: '우선주',
    note: '보험 우선주'
  },
];

// 해외 배당주 프리셋 (2026년 2월 5일 기준, 환율 1,450원)
const OVERSEAS_PRESETS = [
  {
    name: '코카콜라 (KO)',
    price: 113000,  // $78 × 1,450
    dividend: 740,  // 분기 $0.51 × 1,450
    frequency: 'quarterly' as const,
    yield: '2.7%',
    tag: '배당왕',
    note: '62년 연속 인상'
  },
  {
    name: 'J&J (JNJ)',
    price: 232000,  // $160 × 1,450
    dividend: 1885,  // 분기 $1.30 × 1,450
    frequency: 'quarterly' as const,
    yield: '3.3%',
    tag: '배당왕',
    note: '54년 연속 인상'
  },
  {
    name: 'P&G (PG)',
    price: 232000,  // $160 × 1,450
    dividend: 1537,  // 분기 $1.06 × 1,450
    frequency: 'quarterly' as const,
    yield: '2.7%',
    tag: '배당왕',
    note: '68년 연속 인상'
  },
  {
    name: '리얼티인컴 (O)',
    price: 89000,  // $61 × 1,450
    dividend: 392,  // 월 $0.27 × 1,450
    frequency: 'quarterly' as const,  // 실제는 월배당이지만 분기로 환산
    yield: '5.3%',
    tag: '월배당',
    note: 'REIT 월배당'
  },
  {
    name: '버라이즌 (VZ)',
    price: 62000,  // $43 × 1,450
    dividend: 957,  // 분기 $0.66 × 1,450
    frequency: 'quarterly' as const,
    yield: '6.2%',
    tag: '고배당',
    note: '통신주'
  },
  {
    name: 'AT&T (T)',
    price: 37000,  // $26 × 1,450
    dividend: 403,  // 분기 $0.28 × 1,450
    frequency: 'quarterly' as const,
    yield: '4.3%',
    tag: '고배당',
    note: '통신주'
  },
];

// 커버드콜 ETF 프리셋 (2026년 기준, 환율 1,450원)
const COVERED_CALL_PRESETS = [
  {
    name: 'JEPI',
    price: 84000,  // $58 × 1,450
    dividend: 480,  // 월 $0.33 × 1,450
    frequency: 'quarterly' as const,
    yield: '8.1%',
    tag: '안정형',
    note: 'S&P500 월배당'
  },
  {
    name: 'JEPQ',
    price: 85000,  // $59 × 1,450
    dividend: 650,  // 월 $0.45 × 1,450
    frequency: 'quarterly' as const,
    yield: '10.4%',
    tag: '인기',
    note: '나스닥 월배당'
  },
  {
    name: 'QYLD',
    price: 25000,  // $17 × 1,450
    dividend: 230,  // 월 $0.16 × 1,450
    frequency: 'quarterly' as const,
    yield: '11%',
    tag: '고배당',
    note: '나스닥100 월배당'
  },
  {
    name: 'TSLY',
    price: 20000,  // $14 × 1,450
    dividend: 470,  // 주간 $0.32 × 1,450
    frequency: 'quarterly' as const,
    yield: '50%+',
    tag: '초고배당',
    note: '테슬라 주간배당'
  },
  {
    name: 'NVDY',
    price: 21000,  // $14.6 × 1,450
    dividend: 1400,  // 월 $0.98 × 1,450
    frequency: 'quarterly' as const,
    yield: '80%+',
    tag: '초고배당',
    note: '엔비디아 주간배당'
  },
  {
    name: 'CONY',
    price: 16000,  // $11 × 1,450
    dividend: 1200,  // 월 ~$0.83 × 1,450
    frequency: 'quarterly' as const,
    yield: '100%+',
    tag: '초고배당',
    note: '코인베이스 주간배당'
  },
];

// 테크주 프리셋 (2026년 2월 5일 기준, 환율 1,450원)
const TECH_PRESETS = [
  {
    name: '애플 (AAPL)',
    price: 401000,  // $277 × 1,450
    dividend: 370,  // 분기 $0.255 × 1,450
    frequency: 'quarterly' as const,
    yield: '0.37%',
    tag: '시총1위',
    note: '아이폰·서비스'
  },
  {
    name: 'MS (MSFT)',
    price: 613000,  // $423 × 1,450
    dividend: 1200,  // 분기 $0.83 × 1,450
    frequency: 'quarterly' as const,
    yield: '0.79%',
    tag: 'AI리더',
    note: '클라우드·AI'
  },
  {
    name: '엔비디아 (NVDA)',
    price: 254000,  // $175 × 1,450
    dividend: 15,  // 분기 $0.01 × 1,450
    frequency: 'quarterly' as const,
    yield: '0.02%',
    tag: 'GPU독점',
    note: 'AI칩 1위'
  },
  {
    name: '구글 (GOOGL)',
    price: 481000,  // $332 × 1,450
    dividend: 305,  // 분기 $0.21 × 1,450
    frequency: 'quarterly' as const,
    yield: '0.25%',
    tag: '검색·AI',
    note: '2024 첫 배당'
  },
  {
    name: '메타 (META)',
    price: 969000,  // $668 × 1,450
    dividend: 770,  // 분기 $0.53 × 1,450
    frequency: 'quarterly' as const,
    yield: '0.31%',
    tag: 'SNS왕',
    note: '2024 첫 배당'
  },
  {
    name: '브로드컴 (AVGO)',
    price: 439000,  // $303 × 1,450
    dividend: 942,  // 분기 $0.65 × 1,450
    frequency: 'quarterly' as const,
    yield: '0.86%',
    tag: 'AI반도체',
    note: '14년 연속 인상'
  },
];

type PresetType = typeof KOREA_PRESETS[0];

export default function DividendCalculator() {
  const [investAmount, setInvestAmount] = useState<string>('1000'); // 만원
  const [stockPrice, setStockPrice] = useState<string>('55000'); // 원 (삼성전자 기준)
  const [dividendPerShare, setDividendPerShare] = useState<string>('365'); // 원 (삼성전자 분기배당)
  const [dividendFrequency, setDividendFrequency] = useState<'annual' | 'quarterly'>('quarterly');
  const [showResult, setShowResult] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('삼성전자');
  const [presetTab, setPresetTab] = useState<'korea' | 'overseas' | 'tech' | 'covered'>('korea');
  const [mainTab, setMainTab] = useState<'calculator' | 'guide'>('calculator');

  const TAX_RATE = 0.154; // 배당소득세 15.4%

  const currentPresets = presetTab === 'korea'
    ? KOREA_PRESETS
    : presetTab === 'overseas'
    ? OVERSEAS_PRESETS
    : presetTab === 'tech'
    ? TECH_PRESETS
    : COVERED_CALL_PRESETS;

  const handlePresetSelect = (preset: PresetType) => {
    setStockPrice(preset.price.toString());
    setDividendPerShare(preset.dividend.toString());
    setDividendFrequency(preset.frequency);
    setSelectedPreset(preset.name);
    setShowResult(false);
  };

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

        {/* 메인 탭: 계산기 / 투자 가이드 */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setMainTab('calculator')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
              mainTab === 'calculator'
                ? 'bg-white text-amber-600 shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🧮 계산기
          </button>
          <button
            onClick={() => setMainTab('guide')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
              mainTab === 'guide'
                ? 'bg-white text-amber-600 shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📚 투자 가이드
          </button>
        </div>

        {/* 투자 가이드 탭 */}
        {mainTab === 'guide' && (
          <div className="space-y-4 animate-fadeIn">
            {/* 배당 투자란? */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span>
                배당 투자란?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                배당 투자는 <strong>기업이 이익의 일부를 주주에게 나눠주는 배당금</strong>을 통해
                수익을 얻는 투자 방식입니다. 주가 상승 차익뿐만 아니라 정기적인 현금 수입을
                얻을 수 있어 <strong>은퇴 자금, 월급 외 수입</strong>을 원하는 분들에게 인기 있습니다.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="font-semibold text-green-700 text-sm mb-1">✅ 장점</div>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• 정기적인 현금 수입</li>
                    <li>• 복리 효과 (재투자 시)</li>
                    <li>• 하락장에서 수익 가능</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <div className="font-semibold text-amber-700 text-sm mb-1">⚠️ 주의</div>
                  <ul className="text-xs text-amber-600 space-y-1">
                    <li>• 배당락으로 주가 하락</li>
                    <li>• 배당 삭감/중단 가능</li>
                    <li>• 배당소득세 15.4%</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 핵심 용어 정리 */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📖</span>
                핵심 용어 정리
              </h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-gray-800 text-sm">배당수익률 (Dividend Yield)</div>
                  <p className="text-xs text-gray-600 mt-1">
                    연간 배당금 ÷ 주가 × 100. 투자금 대비 배당금 비율. <strong>3% 이상이면 고배당주</strong>로 분류.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-gray-800 text-sm">배당락일 (Ex-Dividend Date)</div>
                  <p className="text-xs text-gray-600 mt-1">
                    이 날 이후 주식을 사면 배당을 못 받음. <strong>배당락일 전날까지</strong> 매수해야 배당 수령 가능.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-gray-800 text-sm">배당성향 (Payout Ratio)</div>
                  <p className="text-xs text-gray-600 mt-1">
                    순이익 중 배당으로 지급하는 비율. <strong>30~50%가 적정</strong>, 너무 높으면 배당 삭감 위험.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-gray-800 text-sm">배당왕/배당귀족 (Dividend King/Aristocrat)</div>
                  <p className="text-xs text-gray-600 mt-1">
                    50년/25년 이상 연속 배당 인상 기업. 코카콜라, P&G, J&J 등이 대표적.
                  </p>
                </div>
              </div>
            </div>

            {/* 배당 투자 전략 */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                배당 투자 전략
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-amber-400 pl-4">
                  <div className="font-semibold text-gray-800 text-sm">1. 배당 재투자 (DRIP)</div>
                  <p className="text-xs text-gray-600 mt-1">
                    받은 배당금으로 같은 주식을 다시 구매. <strong>복리 효과</strong>로 장기 수익 극대화.
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <div className="font-semibold text-gray-800 text-sm">2. 월배당 포트폴리오</div>
                  <p className="text-xs text-gray-600 mt-1">
                    배당 지급 월이 다른 종목 조합. <strong>매월 배당금</strong>을 받을 수 있도록 구성.
                  </p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <div className="font-semibold text-gray-800 text-sm">3. 배당 성장주 투자</div>
                  <p className="text-xs text-gray-600 mt-1">
                    배당수익률보다 <strong>배당 인상률</strong>에 집중. 5년 후 수익률이 더 높아질 수 있음.
                  </p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <div className="font-semibold text-gray-800 text-sm">4. 분산 투자</div>
                  <p className="text-xs text-gray-600 mt-1">
                    국내+해외, 다양한 섹터에 분산. <strong>한 종목에 올인 금지</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* 세금 가이드 */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">🧾</span>
                배당소득세 가이드 (2026년)
              </h3>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="text-sm text-blue-800">
                  <div className="font-semibold mb-2">기본 세율: 15.4%</div>
                  <ul className="text-xs space-y-1 text-blue-700">
                    <li>• 소득세 14% + 지방소득세 1.4%</li>
                    <li>• 금융소득 2천만원 이하: 원천징수로 종결</li>
                    <li>• 금융소득 2천만원 초과: 종합소득 합산과세</li>
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-gray-700 text-xs mb-1">🇰🇷 국내 주식</div>
                  <p className="text-[10px] text-gray-500">
                    15.4% 원천징수 후 입금
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-gray-700 text-xs mb-1">🇺🇸 미국 주식</div>
                  <p className="text-[10px] text-gray-500">
                    미국 15% 원천징수, 국내 추가 없음
                  </p>
                </div>
              </div>
            </div>

            {/* 주의사항 */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border border-red-200">
              <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                투자 시 주의사항
              </h3>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• <strong>고배당률 함정</strong>: 배당수익률이 너무 높으면 주가 하락 or 배당 삭감 가능성</li>
                <li>• <strong>배당락일 효과</strong>: 배당락 후 주가는 배당금만큼 하락하는 것이 일반적</li>
                <li>• <strong>단기 투자 비추천</strong>: 배당 투자는 최소 1년 이상 장기 관점으로</li>
                <li>• <strong>기업 실적 확인</strong>: 이익이 줄어도 배당을 유지하면 위험 신호</li>
              </ul>
            </div>

            {/* 계산기로 이동 버튼 */}
            <button
              onClick={() => setMainTab('calculator')}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30"
            >
              🧮 배당금 계산해보기
            </button>
          </div>
        )}

        {/* 계산기 탭 */}
        {mainTab === 'calculator' && (
          <>
        {/* 인기 배당주 프리셋 */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-lg">🔥</span>
            인기 배당주로 계산해보기
          </h3>

          {/* 국내/해외/테크/커버드콜 탭 */}
          <div className="grid grid-cols-4 gap-1 mb-4">
            <button
              onClick={() => setPresetTab('korea')}
              className={`py-2 px-1 rounded-lg font-medium text-[10px] sm:text-xs transition-all ${
                presetTab === 'korea'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🇰🇷 국내
            </button>
            <button
              onClick={() => setPresetTab('overseas')}
              className={`py-2 px-1 rounded-lg font-medium text-[10px] sm:text-xs transition-all ${
                presetTab === 'overseas'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🌍 해외
            </button>
            <button
              onClick={() => setPresetTab('tech')}
              className={`py-2 px-1 rounded-lg font-medium text-[10px] sm:text-xs transition-all ${
                presetTab === 'tech'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💻 테크
            </button>
            <button
              onClick={() => setPresetTab('covered')}
              className={`py-2 px-1 rounded-lg font-medium text-[10px] sm:text-xs transition-all ${
                presetTab === 'covered'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📈 커버드콜
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {currentPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedPreset === preset.name
                    ? presetTab === 'korea'
                      ? 'bg-amber-100 border-2 border-amber-400 shadow-md'
                      : presetTab === 'overseas'
                      ? 'bg-blue-100 border-2 border-blue-400 shadow-md'
                      : presetTab === 'tech'
                      ? 'bg-cyan-100 border-2 border-cyan-400 shadow-md'
                      : 'bg-purple-100 border-2 border-purple-400 shadow-md'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{preset.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    preset.tag === '고배당'
                      ? 'bg-red-100 text-red-600'
                      : preset.tag === '대표주'
                      ? 'bg-blue-100 text-blue-600'
                      : preset.tag === '우선주'
                      ? 'bg-purple-100 text-purple-600'
                      : preset.tag === '배당왕'
                      ? 'bg-yellow-100 text-yellow-700'
                      : preset.tag === '빅테크'
                      ? 'bg-indigo-100 text-indigo-600'
                      : preset.tag === '월배당'
                      ? 'bg-green-100 text-green-600'
                      : preset.tag === '초고배당'
                      ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600'
                      : preset.tag === '안정형'
                      ? 'bg-teal-100 text-teal-600'
                      : preset.tag === '인기'
                      ? 'bg-orange-100 text-orange-600'
                      : preset.tag === '시총1위' || preset.tag === 'AI리더' || preset.tag === 'GPU독점'
                      ? 'bg-cyan-100 text-cyan-700'
                      : preset.tag === '검색·AI' || preset.tag === 'SNS왕' || preset.tag === 'AI반도체'
                      ? 'bg-sky-100 text-sky-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {preset.tag}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {preset.price.toLocaleString()}원
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">{preset.note}</span>
                  <span className={`text-xs font-bold ${
                    presetTab === 'korea'
                      ? 'text-amber-600'
                      : presetTab === 'overseas'
                      ? 'text-blue-600'
                      : presetTab === 'tech'
                      ? 'text-cyan-600'
                      : 'text-purple-600'
                  }`}>
                    {preset.yield}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            {presetTab === 'korea'
              ? '* 2026년 2월 기준 예상 배당. 실제 주가/배당과 다를 수 있음'
              : presetTab === 'overseas'
              ? '* 2026년 2월 기준, 환율 1,450원 적용. 실제와 다를 수 있음'
              : presetTab === 'tech'
              ? '* 테크주는 배당수익률이 낮지만 성장성이 높음. 환율 1,450원 적용'
              : '* 커버드콜 ETF는 원금 손실 위험이 있음. 배당수익률은 변동 가능'}
          </p>

          {/* 테크주 설명 */}
          {presetTab === 'tech' && (
            <div className="space-y-3 mt-4">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
                <h4 className="font-bold text-cyan-800 mb-2 flex items-center gap-2">
                  <span>💡</span> 테크주 배당 특징
                </h4>
                <p className="text-xs text-cyan-700 leading-relaxed">
                  빅테크 기업들은 <strong>배당수익률이 1% 미만</strong>으로 낮지만,
                  막대한 현금 창출 능력으로 <strong>자사주 매입 + 배당</strong>을 병행합니다.
                  구글과 메타는 2024년 첫 배당을 시작했으며, 애플·MS는 지속적으로 배당을 인상 중입니다.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                  <h5 className="font-bold text-green-700 text-xs mb-2">✅ 장점</h5>
                  <ul className="text-[10px] text-green-600 space-y-1">
                    <li>• AI·클라우드 성장성</li>
                    <li>• 자사주 매입 활발</li>
                    <li>• 배당 인상 여력 큼</li>
                    <li>• 현금흐름 우수</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                  <h5 className="font-bold text-amber-700 text-xs mb-2">⚠️ 주의</h5>
                  <ul className="text-[10px] text-amber-600 space-y-1">
                    <li>• 배당수익률 매우 낮음</li>
                    <li>• 밸류에이션 부담</li>
                    <li>• 규제 리스크 존재</li>
                    <li>• 성장주 특성</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>💰 배당 현황:</strong>
                  애플(분기 $0.25), MS(분기 $0.83), 구글(분기 $0.21), 메타(분기 $0.53)
                  <br/>
                  <strong>🚫 무배당:</strong> 테슬라, 아마존은 현재 배당을 지급하지 않음
                </p>
              </div>
            </div>
          )}

          {/* 커버드콜 상세 설명 */}
          {presetTab === 'covered' && (
            <div className="space-y-3 mt-4">
              {/* 커버드콜이란? */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                  <span>📚</span> 커버드콜 전략이란?
                </h4>
                <p className="text-xs text-purple-700 leading-relaxed">
                  주식을 보유하면서 <strong>콜옵션을 매도</strong>하여 프리미엄 수익을 얻는 전략입니다.
                  기초자산(S&P500, 나스닥100 등)의 주가가 크게 오르지 않으면 옵션 프리미엄만큼 추가 수익을 얻고,
                  이를 배당금으로 지급합니다.
                </p>
              </div>

              {/* ETF 유형 비교 */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📊</span> ETF 유형 비교
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-teal-50 rounded-lg">
                    <span className="font-bold text-teal-700 w-16">JEPI</span>
                    <span className="text-teal-600">S&P500 기반 | 월배당 8% | 안정적, 변동성 낮음</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <span className="font-bold text-orange-700 w-16">JEPQ</span>
                    <span className="text-orange-600">나스닥 기반 | 월배당 10% | 성장+인컴 밸런스</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <span className="font-bold text-red-700 w-16">QYLD</span>
                    <span className="text-red-600">나스닥100 | 월배당 11% | ATM 옵션, 상승제한 큼</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-lg">
                    <span className="font-bold text-pink-700 w-16">TSLY 등</span>
                    <span className="text-pink-600">개별주식 | 주간배당 50~100%+ | 초고위험·초고수익</span>
                  </div>
                </div>
              </div>

              {/* 장단점 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                  <h5 className="font-bold text-green-700 text-xs mb-2">✅ 장점</h5>
                  <ul className="text-[10px] text-green-600 space-y-1">
                    <li>• 매월 안정적인 현금흐름</li>
                    <li>• 횡보장에서 유리</li>
                    <li>• 하락장 방어력 (프리미엄)</li>
                    <li>• 변동성 클수록 프리미엄 증가</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                  <h5 className="font-bold text-red-700 text-xs mb-2">❌ 단점</h5>
                  <ul className="text-[10px] text-red-600 space-y-1">
                    <li>• 상승장 수익 제한 (캡)</li>
                    <li>• 장기 수익률 S&P500 대비 낮음</li>
                    <li>• 원금 손실 가능성</li>
                    <li>• 배당소득세 부과</li>
                  </ul>
                </div>
              </div>

              {/* 경고 */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 border border-red-300">
                <p className="text-xs text-red-700 flex items-start gap-2">
                  <span className="text-base">⚠️</span>
                  <span>
                    <strong>투자 주의사항:</strong> TSLY, NVDY, CONY 등 개별주식 커버드콜 ETF는
                    배당수익률 50~100%+로 매우 높지만, 기초자산 하락 시 <strong>원금 손실이 매우 클 수 있습니다.</strong>
                    과도한 분배금 지급으로 ETF 주가가 지속 하락하는 "밑빠진 독에 물 붓기"가 될 수 있습니다.
                  </span>
                </p>
              </div>
            </div>
          )}
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

          </>
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
