import { useState } from 'react';
import { SEO, Card, Button, Input, ShareButtons } from '../../components';
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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">퇴직금 계산기</h1>
          <p className="text-gray-600">1년 이상 근무 시 퇴직금 지급 대상</p>
        </div>

        <Card>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                최근 3개월 월급 (세전)
              </label>
              <div className="grid grid-cols-3 gap-3">
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
              <p className="text-xs text-gray-500">
                * 매월 급여가 같다면 한 칸만 입력해도 됩니다
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

            <Button onClick={handleCalculate} className="w-full" size="lg">
              계산하기
            </Button>
          </div>
        </Card>

        {calculated && !result && (
          <Card className="bg-yellow-50 border border-yellow-200">
            <div className="text-center text-yellow-800">
              <p className="font-medium">퇴직금 지급 대상이 아닙니다</p>
              <p className="text-sm mt-1">
                1년 미만 근무 시 퇴직금 지급 대상에서 제외됩니다.
              </p>
            </div>
          </Card>
        )}

        {calculated && result && (
          <>
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <div className="text-center">
                <p className="text-emerald-100 mb-1">예상 퇴직금</p>
                <p className="text-4xl font-bold mb-4">
                  {formatCurrency(result.retirementPay)}원
                </p>
                <div className="bg-white/10 rounded-xl p-3 inline-block">
                  <p className="text-emerald-100 text-sm">총 근무기간</p>
                  <p className="text-xl font-semibold">
                    {result.years}년 {result.months}개월 {result.days}일
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 과정</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-2">1. 평균임금 산정 기초</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">최근 3개월 급여 합계</span>
                      <span className="font-medium">{formatCurrency(result.threeMonthWage)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">상여금 가산 (연간÷12×3)</span>
                      <span className="font-medium">{formatCurrency(result.bonusAddition)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">연차수당 가산</span>
                      <span className="font-medium">{formatCurrency(result.leaveAddition)}원</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-700 font-medium">총 임금</span>
                      <span className="font-bold text-blue-600">{formatCurrency(result.totalWageForCalc)}원</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-2">2. 평균임금</h4>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">
                      {formatCurrency(result.totalWageForCalc)}원 ÷ {result.daysForCalc}일
                    </p>
                    <p className="font-bold text-lg text-blue-600">
                      = {formatCurrency(result.averageDailyWage)}원/일
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-2">3. 퇴직금 계산</h4>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">
                      평균임금 × 30일 × (재직일수 ÷ 365)
                    </p>
                    <p className="text-gray-600 mb-1">
                      {formatCurrency(result.averageDailyWage)}원 × 30 × ({result.totalDays} ÷ 365)
                    </p>
                    <p className="font-bold text-lg text-emerald-600">
                      = {formatCurrency(result.retirementPay)}원
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                결과 공유하기
              </h3>
              <ShareButtons
                title="퇴직금 계산기"
                description={`${result.years}년 ${result.months}개월 근무 시 예상 퇴직금: ${formatCurrency(result.retirementPay)}원`}
              />
            </Card>
          </>
        )}
      </div>
    </>
  );
}
