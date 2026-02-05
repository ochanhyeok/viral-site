import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { SEO, Button, Input, ShareButtons } from '../../components';
import { useRetirementCalc, formatCurrency } from './useRetirementCalc';
import 'react-datepicker/dist/react-datepicker.css';

export function RetirementCalculator() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [salary1, setSalary1] = useState('');
  const [salary2, setSalary2] = useState('');
  const [salary3, setSalary3] = useState('');
  const [annualBonus, setAnnualBonus] = useState('');
  const [unusedLeave, setUnusedLeave] = useState('');
  const [calculated, setCalculated] = useState(false);

  const parseSalary = (value: string) => parseInt(value.replace(/,/g, '')) || 0;

  const formatDateString = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const result = useRetirementCalc({
    startDate: formatDateString(startDate),
    endDate: formatDateString(endDate),
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
        description="입사일, 퇴사일, 최근 3개월 급여를 입력하면 예상 퇴직금을 정확하게 계산해드립니다. 평균임금 기준 법정 퇴직금 자동 계산."
        keywords="퇴직금계산기,퇴직금,평균임금,퇴직급여,퇴직금정산,1년퇴직금"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '퇴직금 계산기',
          description: '근무기간과 급여 정보로 예상 퇴직금을 계산하는 무료 온라인 도구',
          url: 'https://viral-site-opal.vercel.app/retirement',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'KRW'
          }
        }}
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
            {/* 날짜 선택 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  입사일
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => {
                    setStartDate(date);
                    setCalculated(false);
                  }}
                  dateFormat="yyyy년 MM월 dd일"
                  locale={ko}
                  placeholderText="날짜 선택"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={30}
                  scrollableYearDropdown
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
                  calendarClassName="custom-calendar"
                  wrapperClassName="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  퇴사일
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => {
                    setEndDate(date);
                    setCalculated(false);
                  }}
                  dateFormat="yyyy년 MM월 dd일"
                  locale={ko}
                  placeholderText="날짜 선택"
                  minDate={startDate || undefined}
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={30}
                  scrollableYearDropdown
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
                  calendarClassName="custom-calendar"
                  wrapperClassName="w-full"
                />
              </div>
            </div>

            {/* 근무 기간 표시 */}
            {startDate && endDate && (
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700 font-medium">예상 근무기간</span>
                  <span className="text-emerald-800 font-bold">
                    {result ? `${result.years}년 ${result.months}개월 ${result.days}일` : '-'}
                  </span>
                </div>
              </div>
            )}

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

      <style>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          font-family: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .react-datepicker__header {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-bottom: none;
          border-radius: 1rem 1rem 0 0;
          padding-top: 12px;
        }
        .react-datepicker__current-month {
          color: white;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 8px;
        }
        .react-datepicker__day-name {
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }
        .react-datepicker__day {
          border-radius: 0.5rem;
          transition: all 0.15s;
        }
        .react-datepicker__day:hover {
          background-color: #d1fae5;
          border-radius: 0.5rem;
        }
        .react-datepicker__day--selected {
          background: linear-gradient(135deg, #10b981, #14b8a6) !important;
          border-radius: 0.5rem;
          font-weight: 600;
        }
        .react-datepicker__day--keyboard-selected {
          background: #d1fae5;
          border-radius: 0.5rem;
        }
        .react-datepicker__day--today {
          font-weight: 700;
          color: #10b981;
        }
        .react-datepicker__navigation {
          top: 12px;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white;
        }
        .react-datepicker__year-dropdown,
        .react-datepicker__month-dropdown {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
        }
        .react-datepicker__year-option:hover,
        .react-datepicker__month-option:hover {
          background-color: #d1fae5;
        }
        .react-datepicker__year-option--selected,
        .react-datepicker__month-option--selected {
          background-color: #10b981 !important;
          color: white;
        }
        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </>
  );
}
