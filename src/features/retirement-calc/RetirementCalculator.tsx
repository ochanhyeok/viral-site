import { useState } from 'react';
import { SEO, Button, Input, ShareButtons } from '../../components';
import { useRetirementCalc, formatCurrency } from './useRetirementCalc';

export function RetirementCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salary1, setSalary1] = useState('');
  const [salary2, setSalary2] = useState('');
  const [salary3, setSalary3] = useState('');
  const [annualBonus, setAnnualBonus] = useState('');
  const [unusedLeave, setUnusedLeave] = useState('');
  const [calculated, setCalculated] = useState(false);

  const parseSalary = (value: string) => parseInt(value.replace(/,/g, '')) || 0;

  const result = useRetirementCalc({
    startDate,
    endDate,
    monthlySalaries: [parseSalary(salary1), parseSalary(salary2), parseSalary(salary3)],
    annualBonus: parseSalary(annualBonus),
    unusedLeave: parseInt(unusedLeave) || 0,
  });

  const handleSalaryChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      setter(formatCurrency(parseInt(value)));
    } else {
      setter('');
    }
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (startDate && endDate && (salary1 || salary2 || salary3)) {
      setCalculated(true);
    }
  };

  return (
    <>
      <SEO
        title="퇴직금 계산기"
        description="입사일, 퇴사일, 최근 3개월 급여를 입력하면 예상 퇴직금을 정확하게 계산해드립니다."
        keywords="퇴직금계산기,퇴직금,평균임금,퇴직급여"
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <span className="text-4xl">🏦</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">퇴직금 계산기</h1>
          <p className="text-gray-500 text-sm">1년 이상 근무 시 퇴직금 지급</p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  입사일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  퇴사일
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최근 3개월 월급 (세전)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={salary1}
                  onChange={handleSalaryChange(setSalary1)}
                  placeholder="1개월 전"
                  suffix="원"
                  type="text"
                  inputMode="numeric"
                />
                <Input
                  value={salary2}
                  onChange={handleSalaryChange(setSalary2)}
                  placeholder="2개월 전"
                  suffix="원"
                  type="text"
                  inputMode="numeric"
                />
                <Input
                  value={salary3}
                  onChange={handleSalaryChange(setSalary3)}
                  placeholder="3개월 전"
                  suffix="원"
                  type="text"
                  inputMode="numeric"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                * 매월 급여가 같다면 한 칸만 입력
              </p>
            </div>

            <Input
              label="연간 상여금 (총액)"
              value={annualBonus}
              onChange={handleSalaryChange(setAnnualBonus)}
              placeholder="0"
              suffix="원"
              type="text"
              inputMode="numeric"
            />

            <Input
              label="미사용 연차 일수"
              value={unusedLeave}
              onChange={(e) => {
                setUnusedLeave(e.target.value.replace(/[^0-9]/g, ''));
                setCalculated(false);
              }}
              placeholder="0"
              suffix="일"
              type="text"
              inputMode="numeric"
            />

            <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700" size="lg">
              계산하기
            </Button>
          </div>
        </div>

        {calculated && !result && (
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-center">
            <span className="text-3xl mb-2 block">⚠️</span>
            <p className="font-bold text-amber-800">퇴직금 지급 대상이 아닙니다</p>
            <p className="text-sm text-amber-700 mt-1">
              1년 미만 근무 시 퇴직금이 발생하지 않습니다.
            </p>
          </div>
        )}

        {calculated && result && (
          <>
            {/* 결과 카드 */}
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/30">
              <div className="text-center">
                <p className="text-emerald-100 text-sm mb-1">예상 퇴직금</p>
                <p className="text-4xl font-extrabold mb-4">
                  {formatCurrency(result.retirementPay)}
                  <span className="text-2xl font-normal">원</span>
                </p>
                <div className="bg-white/15 backdrop-blur rounded-2xl p-3 inline-block">
                  <p className="text-emerald-100 text-xs">총 근무기간</p>
                  <p className="text-lg font-bold">
                    {result.years}년 {result.months}개월 {result.days}일
                  </p>
                </div>
              </div>
            </div>

            {/* 계산 과정 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">계산 과정</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-medium text-gray-700 mb-3 text-sm">1. 평균임금 산정 기초</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">3개월 급여 합계</span>
                      <span className="font-medium">{formatCurrency(result.threeMonthWage)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">상여금 가산</span>
                      <span className="font-medium">{formatCurrency(result.bonusAddition)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">연차수당 가산</span>
                      <span className="font-medium">{formatCurrency(result.leaveAddition)}원</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-700 font-medium">총 임금</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(result.totalWageForCalc)}원</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-medium text-gray-700 mb-2 text-sm">2. 평균임금</h4>
                  <p className="text-sm text-gray-500 mb-1">
                    {formatCurrency(result.totalWageForCalc)}원 ÷ {result.daysForCalc}일
                  </p>
                  <p className="font-bold text-emerald-600 text-lg">
                    = {formatCurrency(result.averageDailyWage)}원/일
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <h4 className="font-medium text-emerald-800 mb-2 text-sm">3. 퇴직금 계산</h4>
                  <p className="text-sm text-emerald-600 mb-1">
                    평균임금 × 30 × (재직일수 ÷ 365)
                  </p>
                  <p className="text-sm text-emerald-600 mb-1">
                    {formatCurrency(result.averageDailyWage)} × 30 × ({result.totalDays} ÷ 365)
                  </p>
                  <p className="font-bold text-emerald-700 text-xl">
                    = {formatCurrency(result.retirementPay)}원
                  </p>
                </div>
              </div>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">결과 공유하기</h3>
              <ShareButtons
                title="퇴직금 계산기"
                description={`${result.years}년 ${result.months}개월 근무 시 예상 퇴직금: ${formatCurrency(result.retirementPay)}원`}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
