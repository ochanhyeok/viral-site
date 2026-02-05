// 연말정산 환급액 예측기
import { useState, useMemo } from 'react';
import { SEO, Button, ShareButtons, Recommendations, Input, Select } from '../../components';

interface DeductionItem {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  maxDeduction: number;
  rate: number;
}

const deductionItems: DeductionItem[] = [
  {
    id: 'card',
    label: '신용카드 사용액',
    description: '총급여의 25% 초과분에 대해 공제',
    placeholder: '연간 신용카드 사용액',
    maxDeduction: 3000000,
    rate: 0.15,
  },
  {
    id: 'debit',
    label: '체크카드/현금영수증',
    description: '총급여의 25% 초과분에 대해 공제',
    placeholder: '연간 사용액',
    maxDeduction: 3000000,
    rate: 0.30,
  },
  {
    id: 'medical',
    label: '의료비',
    description: '총급여의 3% 초과분 공제',
    placeholder: '연간 의료비 지출액',
    maxDeduction: 7000000,
    rate: 0.15,
  },
  {
    id: 'education',
    label: '교육비',
    description: '본인/자녀 교육비',
    placeholder: '연간 교육비 지출액',
    maxDeduction: 9000000,
    rate: 0.15,
  },
  {
    id: 'donation',
    label: '기부금',
    description: '법정/지정 기부금',
    placeholder: '연간 기부금액',
    maxDeduction: 10000000,
    rate: 0.15,
  },
  {
    id: 'pension',
    label: '연금저축',
    description: '연금저축/IRP 납입액',
    placeholder: '연간 납입액',
    maxDeduction: 7000000,
    rate: 0.132,
  },
  {
    id: 'housing',
    label: '주택청약저축',
    description: '무주택 세대주',
    placeholder: '연간 납입액',
    maxDeduction: 2400000,
    rate: 0.40,
  },
];

const familyOptions = [
  { value: '0', label: '본인만 (1명)' },
  { value: '1', label: '2명 (배우자 등)' },
  { value: '2', label: '3명' },
  { value: '3', label: '4명' },
  { value: '4', label: '5명 이상' },
];

export function TaxRefundCalculator() {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [salary, setSalary] = useState('');
  const [paidTax, setPaidTax] = useState('');
  const [familyCount, setFamilyCount] = useState('0');
  const [deductions, setDeductions] = useState<Record<string, string>>({});

  const handleDeductionChange = (id: string, value: string) => {
    setDeductions(prev => ({ ...prev, [id]: value }));
  };

  const result = useMemo(() => {
    if (step !== 'result') return null;

    const annualSalary = parseInt(salary.replace(/,/g, '')) || 0;
    const taxPaid = parseInt(paidTax.replace(/,/g, '')) || 0;
    const family = parseInt(familyCount);

    // 기본공제 (본인 + 부양가족)
    const basicDeduction = 1500000 * (1 + family);

    // 근로소득공제
    let incomeDeduction = 0;
    if (annualSalary <= 5000000) {
      incomeDeduction = annualSalary * 0.7;
    } else if (annualSalary <= 15000000) {
      incomeDeduction = 3500000 + (annualSalary - 5000000) * 0.4;
    } else if (annualSalary <= 45000000) {
      incomeDeduction = 7500000 + (annualSalary - 15000000) * 0.15;
    } else if (annualSalary <= 100000000) {
      incomeDeduction = 12000000 + (annualSalary - 45000000) * 0.05;
    } else {
      incomeDeduction = 14750000 + (annualSalary - 100000000) * 0.02;
    }

    // 특별공제 계산
    let specialDeduction = 0;
    const threshold = annualSalary * 0.25;

    deductionItems.forEach(item => {
      const amount = parseInt(deductions[item.id]?.replace(/,/g, '') || '0');
      if (amount > 0) {
        let deductionAmount = 0;

        if (item.id === 'card' || item.id === 'debit') {
          // 신용카드/체크카드는 총급여 25% 초과분
          const excess = Math.max(0, amount - threshold);
          deductionAmount = Math.min(excess * item.rate, item.maxDeduction);
        } else if (item.id === 'medical') {
          // 의료비는 총급여 3% 초과분
          const medicalThreshold = annualSalary * 0.03;
          const excess = Math.max(0, amount - medicalThreshold);
          deductionAmount = Math.min(excess * item.rate, item.maxDeduction);
        } else {
          deductionAmount = Math.min(amount * item.rate, item.maxDeduction * item.rate);
        }

        specialDeduction += deductionAmount;
      }
    });

    // 과세표준
    const taxableIncome = Math.max(0, annualSalary - incomeDeduction - basicDeduction);

    // 산출세액 (간이 계산)
    let calculatedTax = 0;
    if (taxableIncome <= 14000000) {
      calculatedTax = taxableIncome * 0.06;
    } else if (taxableIncome <= 50000000) {
      calculatedTax = 840000 + (taxableIncome - 14000000) * 0.15;
    } else if (taxableIncome <= 88000000) {
      calculatedTax = 6240000 + (taxableIncome - 50000000) * 0.24;
    } else if (taxableIncome <= 150000000) {
      calculatedTax = 15360000 + (taxableIncome - 88000000) * 0.35;
    } else {
      calculatedTax = 37060000 + (taxableIncome - 150000000) * 0.38;
    }

    // 세액공제 적용
    const finalTax = Math.max(0, calculatedTax - specialDeduction);

    // 환급/추가납부
    const refund = taxPaid - finalTax;

    return {
      annualSalary,
      taxPaid,
      basicDeduction,
      incomeDeduction,
      specialDeduction,
      taxableIncome,
      calculatedTax,
      finalTax,
      refund,
      isRefund: refund > 0,
    };
  }, [step, salary, paidTax, familyCount, deductions]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const handleCalculate = () => {
    if (!salary || !paidTax) return;
    setStep('result');
  };

  const handleReset = () => {
    setStep('input');
  };

  return (
    <>
      <SEO
        title="연말정산 환급액 예측기"
        description="2025년 연말정산 예상 환급액을 미리 계산해보세요! 신용카드, 의료비, 교육비 등 공제 항목별 계산"
        keywords="연말정산,환급액,세금환급,연말정산계산기,세액공제,소득공제,13월의월급"
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
            <span className="text-4xl">💸</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">연말정산 환급액 예측기</h1>
          <p className="text-gray-500 text-sm">13월의 월급, 얼마나 받을 수 있을까?</p>
        </div>

        {step === 'input' ? (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📋</span> 기본 정보
              </h2>

              <div className="space-y-4">
                <Input
                  label="연간 총급여 (세전)"
                  type="text"
                  value={salary}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setSalary(value ? parseInt(value).toLocaleString() : '');
                  }}
                  placeholder="예: 50,000,000"
                  suffix="원"
                />

                <Input
                  label="기납부 세액 (원천징수된 소득세)"
                  type="text"
                  value={paidTax}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setPaidTax(value ? parseInt(value).toLocaleString() : '');
                  }}
                  placeholder="급여명세서 참고"
                  suffix="원"
                />

                <Select
                  label="부양가족 수"
                  value={familyCount}
                  onChange={(e) => setFamilyCount(e.target.value)}
                  options={familyOptions}
                />
              </div>
            </div>

            {/* 공제 항목 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>💳</span> 공제 항목 (선택)
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                입력하지 않은 항목은 0으로 계산됩니다
              </p>

              <div className="space-y-4">
                {deductionItems.map(item => (
                  <div key={item.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {item.label}
                      <span className="text-gray-400 font-normal ml-2">({item.description})</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={deductions[item.id] || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          handleDeductionChange(item.id, value ? parseInt(value).toLocaleString() : '');
                        }}
                        placeholder={item.placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCalculate}
              size="lg"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
              disabled={!salary || !paidTax}
            >
              환급액 계산하기
            </Button>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-amber-800 text-sm">
                <span className="font-bold">⚠️ 참고:</span> 이 계산기는 예상 환급액을 간이 계산하며,
                실제 환급액과 차이가 있을 수 있습니다. 정확한 금액은 국세청 홈택스를 이용해주세요.
              </p>
            </div>
          </div>
        ) : result && (
          <div className="space-y-6 animate-fadeIn">
            {/* 결과 카드 */}
            <div
              id="tax-refund-result"
              className={`bg-gradient-to-br ${result.isRefund ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'} rounded-3xl p-6 text-white shadow-xl text-center`}
            >
              <p className="text-white/70 text-sm mb-2">
                {result.isRefund ? '예상 환급액' : '예상 추가 납부액'}
              </p>
              <div className="text-4xl font-black mb-2">
                {result.isRefund ? '+' : '-'}{formatNumber(Math.abs(result.refund))}원
              </div>
              <p className="text-white/80 text-sm">
                {result.isRefund ? '🎉 13월의 월급이 들어올 예정!' : '😢 세금을 더 내야해요...'}
              </p>
            </div>

            {/* 상세 내역 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">📊 계산 상세</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">연간 총급여</span>
                  <span className="font-medium">{formatNumber(result.annualSalary)}원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">근로소득공제</span>
                  <span className="font-medium text-blue-600">-{formatNumber(result.incomeDeduction)}원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">인적공제</span>
                  <span className="font-medium text-blue-600">-{formatNumber(result.basicDeduction)}원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">과세표준</span>
                  <span className="font-medium">{formatNumber(result.taxableIncome)}원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">산출세액</span>
                  <span className="font-medium">{formatNumber(result.calculatedTax)}원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">세액공제 합계</span>
                  <span className="font-medium text-green-600">-{formatNumber(result.specialDeduction)}원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">결정세액</span>
                  <span className="font-medium">{formatNumber(result.finalTax)}원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">기납부세액</span>
                  <span className="font-medium">{formatNumber(result.taxPaid)}원</span>
                </div>
                <div className={`flex justify-between py-3 rounded-xl px-3 ${result.isRefund ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={`font-bold ${result.isRefund ? 'text-green-700' : 'text-red-700'}`}>
                    {result.isRefund ? '환급액' : '추가납부'}
                  </span>
                  <span className={`font-bold ${result.isRefund ? 'text-green-700' : 'text-red-700'}`}>
                    {formatNumber(Math.abs(result.refund))}원
                  </span>
                </div>
              </div>
            </div>

            {/* 팁 */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">💡 환급액 늘리는 TIP</h3>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li>• 체크카드/현금영수증 비율 높이기 (공제율 30%)</li>
                <li>• 연금저축/IRP 납입 (최대 700만원 공제)</li>
                <li>• 주택청약저축 활용 (무주택자, 40% 공제)</li>
                <li>• 기부금 영수증 꼼꼼히 챙기기</li>
              </ul>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">결과 공유하기</h3>
              <ShareButtons
                title="연말정산 환급액 예측"
                description={`예상 ${result.isRefund ? '환급액' : '추가납부'}: ${formatNumber(Math.abs(result.refund))}원`}
                captureElementId="tax-refund-result"
                captureFileName="tax-refund-result"
              />
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full" size="lg">
              다시 계산하기
            </Button>

            <Recommendations currentPath="/tax-refund" />
          </div>
        )}
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
