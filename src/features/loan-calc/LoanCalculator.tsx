import { useState, useMemo } from 'react';
import { SEO } from '../../components/SEO';
import { Recommendations } from '../../components/Recommendations';

type RepaymentType = 'equalPrincipalInterest' | 'equalPrincipal' | 'balloon';

interface MonthlyPayment {
  month: number;
  principal: number;
  interest: number;
  payment: number;
  remainingBalance: number;
}

interface Result {
  monthlyPayments: MonthlyPayment[];
  totalPayment: number;
  totalInterest: number;
  firstMonthPayment: number;
  lastMonthPayment: number;
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('10000'); // 만원
  const [interestRate, setInterestRate] = useState<string>('5.0');
  const [loanTerm, setLoanTerm] = useState<string>('36'); // 개월
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equalPrincipalInterest');
  const [showResult, setShowResult] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo<Result | null>(() => {
    const principal = parseFloat(loanAmount) * 10000; // 만원 -> 원
    const annualRate = parseFloat(interestRate) / 100;
    const months = parseInt(loanTerm);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(months) || principal <= 0 || annualRate <= 0 || months <= 0) {
      return null;
    }

    const monthlyRate = annualRate / 12;
    const payments: MonthlyPayment[] = [];
    let remainingBalance = principal;
    let totalInterest = 0;

    if (repaymentType === 'equalPrincipalInterest') {
      // 원리금균등상환: 매월 동일한 금액 상환
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

      for (let i = 1; i <= months; i++) {
        const interest = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interest;
        remainingBalance -= principalPayment;

        payments.push({
          month: i,
          principal: Math.round(principalPayment),
          interest: Math.round(interest),
          payment: Math.round(monthlyPayment),
          remainingBalance: Math.max(0, Math.round(remainingBalance)),
        });

        totalInterest += interest;
      }
    } else if (repaymentType === 'equalPrincipal') {
      // 원금균등상환: 매월 동일한 원금 + 이자
      const monthlyPrincipal = principal / months;

      for (let i = 1; i <= months; i++) {
        const interest = remainingBalance * monthlyRate;
        const payment = monthlyPrincipal + interest;
        remainingBalance -= monthlyPrincipal;

        payments.push({
          month: i,
          principal: Math.round(monthlyPrincipal),
          interest: Math.round(interest),
          payment: Math.round(payment),
          remainingBalance: Math.max(0, Math.round(remainingBalance)),
        });

        totalInterest += interest;
      }
    } else {
      // 만기일시상환: 이자만 납부, 마지막에 원금 상환
      const monthlyInterest = principal * monthlyRate;

      for (let i = 1; i <= months; i++) {
        const isLastMonth = i === months;
        const principalPayment = isLastMonth ? principal : 0;
        const payment = monthlyInterest + principalPayment;
        remainingBalance = isLastMonth ? 0 : principal;

        payments.push({
          month: i,
          principal: Math.round(principalPayment),
          interest: Math.round(monthlyInterest),
          payment: Math.round(payment),
          remainingBalance: Math.round(remainingBalance),
        });

        totalInterest += monthlyInterest;
      }
    }

    return {
      monthlyPayments: payments,
      totalPayment: Math.round(principal + totalInterest),
      totalInterest: Math.round(totalInterest),
      firstMonthPayment: payments[0]?.payment || 0,
      lastMonthPayment: payments[payments.length - 1]?.payment || 0,
    };
  }, [loanAmount, interestRate, loanTerm, repaymentType]);

  const handleCalculate = () => {
    if (result) {
      setShowResult(true);
      setShowSchedule(false);
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

  const repaymentTypes = [
    { value: 'equalPrincipalInterest', label: '원리금균등', desc: '매월 동일 금액' },
    { value: 'equalPrincipal', label: '원금균등', desc: '매월 원금 동일' },
    { value: 'balloon', label: '만기일시', desc: '만기에 원금 상환' },
  ];

  return (
    <>
      <SEO
        title="대출 이자 계산기"
        description="대출 이자 계산기. 원리금균등, 원금균등, 만기일시 상환 방식별 월 상환액과 이자를 계산해보세요. 상환 스케줄 제공"
        keywords="대출이자계산기,원리금균등상환,원금균등상환,만기일시상환,대출상환,월상환액,주담대계산기"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '대출 이자 계산기',
          description: '원리금균등, 원금균등, 만기일시 상환 방식별 대출 이자 계산',
          url: 'https://viral-site-opal.vercel.app/loan',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' }
        }}
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/30 mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            대출 이자 계산기
          </h1>
          <p className="text-gray-500">
            상환 방식별 월 납입금을 비교해보세요
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-5">
          {/* 대출 금액 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              대출 금액
            </label>
            <div className="relative">
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => { setLoanAmount(e.target.value); setShowResult(false); }}
                placeholder="대출 금액"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                만원
              </span>
            </div>
            {loanAmount && (
              <p className="mt-1.5 text-xs text-gray-400">
                = {formatNumber(parseFloat(loanAmount) * 10000 || 0)}원
              </p>
            )}
          </div>

          {/* 금리 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              연 이자율
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => { setInterestRate(e.target.value); setShowResult(false); }}
                placeholder="연 이자율"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                %
              </span>
            </div>
          </div>

          {/* 대출 기간 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              대출 기간
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[12, 24, 36, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => { setLoanTerm(m.toString()); setShowResult(false); }}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    loanTerm === m.toString()
                      ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {m >= 12 ? `${m / 12}년` : `${m}개월`}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => { setLoanTerm(e.target.value); setShowResult(false); }}
                placeholder="직접 입력"
                className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg text-sm">
                개월
              </span>
            </div>
          </div>

          {/* 상환 방식 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              상환 방식
            </label>
            <div className="grid grid-cols-3 gap-2">
              {repaymentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => { setRepaymentType(type.value as RepaymentType); setShowResult(false); }}
                  className={`py-3 px-2 rounded-xl font-medium transition-all ${
                    repaymentType === type.value
                      ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold text-sm">{type.label}</div>
                  <div className="text-[10px] opacity-70">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 계산 버튼 */}
          <button
            onClick={handleCalculate}
            disabled={!result}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            대출 이자 계산하기
          </button>
        </div>

        {/* 결과 */}
        {showResult && result && (
          <div className="space-y-4 animate-fadeIn">
            {/* 월 상환액 */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-center">
                <p className="text-rose-100 text-sm mb-1">
                  {repaymentType === 'equalPrincipalInterest' ? '월 상환액' : '첫 달 상환액'}
                </p>
                <p className="text-4xl font-bold mb-2">
                  {formatWon(result.firstMonthPayment)}
                </p>
                {repaymentType !== 'equalPrincipalInterest' && (
                  <p className="text-rose-200 text-sm">
                    마지막 달: {formatWon(result.lastMonthPayment)}
                  </p>
                )}
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
                  <span className="text-gray-600">대출 원금</span>
                  <span className="font-semibold text-gray-900">{formatWon(parseFloat(loanAmount) * 10000)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">총 이자</span>
                  <span className="font-semibold text-rose-600">+{formatWon(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-rose-50 rounded-xl px-4 -mx-4">
                  <span className="font-semibold text-gray-900">총 상환액</span>
                  <span className="font-bold text-rose-600 text-lg">{formatWon(result.totalPayment)}</span>
                </div>
              </div>
            </div>

            {/* 상환 방식 설명 */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex gap-3">
                <span className="text-xl">💡</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">
                    {repaymentType === 'equalPrincipalInterest' && '원리금균등상환'}
                    {repaymentType === 'equalPrincipal' && '원금균등상환'}
                    {repaymentType === 'balloon' && '만기일시상환'}
                  </p>
                  <p className="text-blue-700">
                    {repaymentType === 'equalPrincipalInterest' && '매월 동일한 금액을 상환합니다. 초반에는 이자 비중이 크고, 후반에는 원금 비중이 커집니다.'}
                    {repaymentType === 'equalPrincipal' && '매월 동일한 원금을 상환합니다. 초반 상환 부담이 크지만, 총 이자가 적습니다.'}
                    {repaymentType === 'balloon' && '매월 이자만 납부하고, 만기에 원금을 일시 상환합니다. 총 이자가 가장 많습니다.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 상환 스케줄 토글 */}
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <span>{showSchedule ? '상환 스케줄 접기' : '상환 스케줄 보기'}</span>
              <svg
                className={`w-5 h-5 transition-transform ${showSchedule ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 상환 스케줄 테이블 */}
            {showSchedule && (
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 text-left font-semibold text-gray-600">회차</th>
                        <th className="py-2 px-3 text-right font-semibold text-gray-600">상환금</th>
                        <th className="py-2 px-3 text-right font-semibold text-gray-600">원금</th>
                        <th className="py-2 px-3 text-right font-semibold text-gray-600">이자</th>
                        <th className="py-2 px-3 text-right font-semibold text-gray-600">잔액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.monthlyPayments.slice(0, showSchedule ? undefined : 12).map((payment) => (
                        <tr key={payment.month} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-600">{payment.month}회차</td>
                          <td className="py-2 px-3 text-right font-medium">{formatNumber(payment.payment)}원</td>
                          <td className="py-2 px-3 text-right text-blue-600">{formatNumber(payment.principal)}원</td>
                          <td className="py-2 px-3 text-right text-rose-600">{formatNumber(payment.interest)}원</td>
                          <td className="py-2 px-3 text-right text-gray-500">{formatNumber(payment.remainingBalance)}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 추천 */}
        <Recommendations currentPath="/loan" maxItems={3} />
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
