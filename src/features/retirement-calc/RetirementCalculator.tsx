import { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { getMonth, getYear } from 'date-fns';
import { SEO, Button, Input, ShareButtons, Recommendations, FAQ, retirementFAQ, MascotWithTyping, mascotComments, getRandomComment, Percentile } from '../../components';
import type { MascotMood } from '../../components';
import { useRetirementCalc, formatCurrency } from './useRetirementCalc';
import 'react-datepicker/dist/react-datepicker.css';

const months = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

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

  // 마스코트 코멘트 계산
  const mascotComment = useMemo(() => {
    if (!calculated || !result) return null;

    // 퇴직금 수준에 따른 코멘트 선택
    let level: 'high' | 'medium' | 'low';
    if (result.retirementPay >= 30000000) {
      level = 'high';
    } else if (result.retirementPay >= 10000000) {
      level = 'medium';
    } else {
      level = 'low';
    }

    return getRandomComment(mascotComments.retirement[level]);
  }, [calculated, result]);

  // 커스텀 헤더 컴포넌트
  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: {
    date: Date;
    changeYear: (year: number) => void;
    changeMonth: (month: number) => void;
    decreaseMonth: () => void;
    increaseMonth: () => void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
  }) => (
    <div className="custom-header">
      {/* 년도 선택 */}
      <div className="year-selector">
        <button
          type="button"
          onClick={() => changeYear(getYear(date) - 1)}
          className="year-nav-btn"
        >
          ‹‹
        </button>
        <span className="year-text">{getYear(date)}년</span>
        <button
          type="button"
          onClick={() => changeYear(getYear(date) + 1)}
          className="year-nav-btn"
          disabled={getYear(date) >= getYear(new Date())}
        >
          ››
        </button>
      </div>

      {/* 월 선택 */}
      <div className="month-selector">
        <button
          type="button"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="month-nav-btn"
        >
          ‹
        </button>
        <span className="month-text">{months[getMonth(date)]}</span>
        <button
          type="button"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="month-nav-btn"
        >
          ›
        </button>
      </div>

      {/* 빠른 월 선택 그리드 */}
      <div className="month-grid">
        {months.map((month, index) => (
          <button
            key={month}
            type="button"
            onClick={() => changeMonth(index)}
            className={`month-btn ${getMonth(date) === index ? 'active' : ''}`}
          >
            {index + 1}월
          </button>
        ))}
      </div>
    </div>
  );

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
                  dateFormat="yyyy.MM.dd"
                  locale={ko}
                  placeholderText="날짜 선택"
                  maxDate={new Date()}
                  renderCustomHeader={CustomHeader}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 cursor-pointer text-center font-medium"
                  calendarClassName="custom-calendar"
                  wrapperClassName="w-full"
                  showPopperArrow={false}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  퇴사일 {!startDate && <span className="text-gray-400 text-xs">(입사일 먼저 선택)</span>}
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => {
                    setEndDate(date);
                    setCalculated(false);
                  }}
                  dateFormat="yyyy.MM.dd"
                  locale={ko}
                  placeholderText={startDate ? "날짜 선택" : "입사일 먼저 선택"}
                  minDate={startDate || undefined}
                  disabled={!startDate}
                  renderCustomHeader={CustomHeader}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 text-center font-medium ${!startDate ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  calendarClassName="custom-calendar"
                  wrapperClassName="w-full"
                  showPopperArrow={false}
                  popperClassName="datepicker-popper"
                  popperPlacement="bottom-start"
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

            {/* 상위 몇% */}
            <Percentile value={result.retirementPay} type="retirement" />

            {/* 마스코트 코멘트 */}
            {mascotComment && (
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <MascotWithTyping
                  mood={mascotComment.mood as MascotMood}
                  message={mascotComment.message}
                  size="md"
                />
              </div>
            )}

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

            {/* 이미지 저장용 캡처 카드 - 프리미엄 디자인 */}
            <div
              id="retirement-result-capture"
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-2xl"
            >
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/4 left-6 w-3 h-3 bg-white/30 rounded-full" />
              <div className="absolute top-1/3 right-10 w-2 h-2 bg-white/40 rounded-full" />
              <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-white/20 rounded-full" />
              <div className="absolute top-8 left-1/4 text-white/20 text-2xl">💼</div>
              <div className="absolute bottom-16 right-6 text-white/20 text-xl">📈</div>

              <div className="relative p-6 text-white text-center space-y-4">
                {/* 타이틀 뱃지 */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                  <span className="text-white/80 text-sm font-medium">퇴직금 계산 결과</span>
                </div>

                {/* 메인 금액 */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5">
                  <p className="text-white/70 text-sm mb-1">예상 퇴직금</p>
                  <p className="text-4xl font-black drop-shadow-md">
                    {formatCurrency(result.retirementPay)}
                    <span className="text-xl font-bold">원</span>
                  </p>
                </div>

                {/* 상세 정보 그리드 */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-white/60">근속기간</p>
                    <p className="text-lg font-bold">{result.years}년 {result.months}개월</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-white/60">총 근무일</p>
                    <p className="text-lg font-bold">{result.totalDays}일</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-white/60">일 평균임금</p>
                    <p className="text-lg font-bold">{formatCurrency(result.averageDailyWage)}원</p>
                  </div>
                </div>

                {/* 워터마크 */}
                <p className="text-xs text-white/40 pt-2">viral-site-opal.vercel.app</p>
              </div>
            </div>

            {/* 공유 */}
            <ShareButtons
              title="퇴직금 계산기"
              description={`${result.years}년 ${result.months}개월 근무 시 예상 퇴직금: ${formatCurrency(result.retirementPay)}원`}
              captureElementId="retirement-result-capture"
              captureFileName="retirement-result"
            />

            {/* 다른 도구 추천 */}
            <Recommendations currentPath="/retirement" />

            {/* FAQ */}
            <FAQ items={retirementFAQ} />
          </>
        )}
      </div>

      <style>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          font-family: inherit;
          border: none;
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .react-datepicker__header {
          background: white;
          border-bottom: none;
          padding: 0;
        }

        /* 커스텀 헤더 스타일 */
        .custom-header {
          padding: 16px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
        }
        .year-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 8px;
        }
        .year-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          min-width: 80px;
          text-align: center;
        }
        .year-nav-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 1rem;
          font-weight: bold;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .year-nav-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.3);
        }
        .year-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .month-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .month-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          min-width: 50px;
          text-align: center;
        }
        .month-nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 1.25rem;
          font-weight: bold;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .month-nav-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }
        .month-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .month-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
        }
        .month-btn {
          padding: 6px 4px;
          border-radius: 8px;
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.9);
          font-size: 0.75rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .month-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        .month-btn.active {
          background: white;
          color: #10b981;
          font-weight: 700;
        }

        /* 요일 헤더 */
        .react-datepicker__day-names {
          background: #f0fdf4;
          padding: 8px 0;
          margin: 0;
        }
        .react-datepicker__day-name {
          color: #059669;
          font-weight: 600;
          font-size: 0.8rem;
          width: 2.5rem;
          margin: 0;
        }

        /* 날짜 */
        .react-datepicker__month {
          margin: 0;
          padding: 8px;
        }
        .react-datepicker__week {
          display: flex;
        }
        .react-datepicker__day {
          width: 2.5rem;
          height: 2.5rem;
          line-height: 2.5rem;
          margin: 2px;
          border-radius: 50%;
          font-weight: 500;
          transition: all 0.15s;
        }
        .react-datepicker__day:hover {
          background: #d1fae5;
          border-radius: 50%;
        }
        .react-datepicker__day--selected {
          background: linear-gradient(135deg, #10b981, #14b8a6) !important;
          color: white !important;
          font-weight: 700;
        }
        .react-datepicker__day--keyboard-selected {
          background: #d1fae5;
        }
        .react-datepicker__day--today {
          font-weight: 700;
          color: #10b981;
          border: 2px solid #10b981;
        }
        .react-datepicker__day--outside-month {
          color: #d1d5db;
        }
        .react-datepicker__day--disabled {
          color: #e5e7eb;
        }

        /* 팝업 z-index */
        .datepicker-popper {
          z-index: 9999 !important;
        }
        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        /* 모바일 최적화 */
        @media (max-width: 640px) {
          .react-datepicker {
            width: 100%;
            max-width: 320px;
          }
          .month-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .react-datepicker__day,
          .react-datepicker__day-name {
            width: 2.2rem;
            height: 2.2rem;
            line-height: 2.2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}
