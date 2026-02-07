import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { SEO, Button, Input, Select, ShareButtons, Recommendations, FAQ, salaryFAQ, MascotWithTyping, mascotComments, getRandomComment, Percentile } from '../../components';
import { useSalaryCalc, formatCurrency } from './useSalaryCalc';

// 만원 단위로 포맷
const formatWon = (num: number) => {
  if (num >= 100000000) {
    const uk = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);
    return man > 0 ? `${uk}억 ${man.toLocaleString()}만원` : `${uk}억원`;
  } else if (num >= 10000) {
    return `${Math.floor(num / 10000).toLocaleString()}만원`;
  }
  return `${num.toLocaleString()}원`;
};
import type { MascotMood } from '../../components';

export function SalaryCalculator() {
  const [salary, setSalary] = useState('');
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);
  const [nonTaxable, setNonTaxable] = useState(0);
  const [includeRetirement, setIncludeRetirement] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const result = useSalaryCalc({
    annualSalary: parseInt(salary.replace(/,/g, '')) || 0,
    dependents,
    children,
    nonTaxable,
    includeRetirement,
  });

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      setSalary(formatCurrency(parseInt(value)));
    } else {
      setSalary('');
    }
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (salary) {
      setCalculated(true);
    }
  };

  const chartData = result
    ? [
        { name: '실수령액', value: result.monthlyNetSalary, color: '#6366F1' },
        { name: '국민연금', value: result.deductions.nationalPension, color: '#10B981' },
        { name: '건강보험', value: result.deductions.healthInsurance, color: '#F59E0B' },
        { name: '장기요양', value: result.deductions.longTermCare, color: '#8B5CF6' },
        { name: '고용보험', value: result.deductions.employmentInsurance, color: '#EC4899' },
        { name: '소득세', value: result.deductions.incomeTax, color: '#EF4444' },
        { name: '지방소득세', value: result.deductions.localIncomeTax, color: '#06B6D4' },
      ]
    : [];

  // 마스코트 코멘트 계산
  const mascotComment = useMemo(() => {
    if (!calculated || !result) return null;

    const annualSalary = parseInt(salary.replace(/,/g, '')) || 0;

    // 연봉 수준에 따른 코멘트 선택
    let level: 'high' | 'medium' | 'low';
    if (annualSalary >= 80000000) {
      level = 'high';
    } else if (annualSalary >= 40000000) {
      level = 'medium';
    } else {
      level = 'low';
    }

    return getRandomComment(mascotComments.salary[level]);
  }, [calculated, result, salary]);

  const dependentOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}명`,
  }));

  const childrenOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: i === 0 ? '없음' : `${i}명`,
  }));

  return (
    <>
      <SEO
        title="연봉 실수령액 계산기"
        description="2026년 최신 세율 적용! 연봉에서 4대보험과 세금을 제외한 실수령액을 정확하게 계산해보세요. 국민연금 4.75%, 건강보험 3.595% 반영."
        keywords="연봉계산기,실수령액,세후연봉,4대보험,소득세계산,2025연봉계산,월급계산기"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '연봉 실수령액 계산기',
          description: '2025년 최신 세율로 연봉 실수령액을 계산하는 무료 온라인 도구',
          url: 'https://viral-site-opal.vercel.app/salary',
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
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">연봉 실수령액 계산기</h1>
          <p className="text-gray-500 text-sm">2026년 최신 세율 적용</p>
        </div>

        {/* 정보 섹션 */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <h2 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>💡</span> 2026년 연봉 계산 시 알아두세요
          </h2>
          <div className="text-blue-800 text-sm space-y-2">
            <p>
              본 계산기는 2026년 최신 4대보험 요율을 적용합니다. 국민연금 4.5% (상한 590만원),
              건강보험 3.545%, 장기요양보험 12.95% (건강보험료의), 고용보험 0.9%가 적용됩니다.
              소득세는 간이세액표 기준으로 계산되며, 부양가족 수에 따라 달라집니다.
            </p>
            <p>
              비과세 항목에는 식대(월 20만원 한도), 자가운전보조금(월 20만원), 출산/보육수당(월 20만원) 등이
              포함될 수 있습니다. 실제 실수령액은 회사의 복리후생 정책에 따라 차이가 있을 수 있으니 참고용으로 활용해주세요.
            </p>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-5">
            <Input
              label="연봉 (세전)"
              value={salary}
              onChange={handleSalaryChange}
              placeholder="예: 50,000,000"
              suffix="원"
              type="text"
              inputMode="numeric"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="부양가족 수"
                options={dependentOptions}
                value={dependents}
                onChange={(e) => {
                  setDependents(parseInt(e.target.value));
                  setCalculated(false);
                }}
              />
              <Select
                label="20세 이하 자녀"
                options={childrenOptions}
                value={children}
                onChange={(e) => {
                  setChildren(parseInt(e.target.value));
                  setCalculated(false);
                }}
              />
            </div>

            <Input
              label="비과세액 (월)"
              value={nonTaxable === 0 ? '' : formatCurrency(nonTaxable)}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setNonTaxable(value ? parseInt(value) : 0);
                setCalculated(false);
              }}
              placeholder="식대, 차량유지비 등"
              suffix="원"
              type="text"
              inputMode="numeric"
            />

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={includeRetirement}
                onChange={(e) => {
                  setIncludeRetirement(e.target.checked);
                  setCalculated(false);
                }}
                className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">퇴직금 포함 여부</span>
            </label>

            <Button onClick={handleCalculate} className="w-full" size="lg">
              계산하기
            </Button>
          </div>
        </div>

        {calculated && result && (
          <>
            {/* 결과 카드 */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/30">
              <div className="text-center">
                <p className="text-blue-100 text-sm mb-1">예상 월 실수령액</p>
                <p className="text-4xl font-extrabold mb-1">
                  {formatWon(result.monthlyNetSalary)}
                </p>
                <p className="text-blue-200 text-sm mb-4">
                  {formatCurrency(result.monthlyNetSalary)}원
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/15 backdrop-blur rounded-2xl p-3">
                    <p className="text-blue-100 text-xs">연 실수령액</p>
                    <p className="text-lg font-bold">{formatWon(result.annualNetSalary)}</p>
                    <p className="text-blue-200 text-xs">{formatCurrency(result.annualNetSalary)}원</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur rounded-2xl p-3">
                    <p className="text-blue-100 text-xs">월 공제액</p>
                    <p className="text-lg font-bold">{formatWon(result.totalDeduction)}</p>
                    <p className="text-blue-200 text-xs">{formatCurrency(result.totalDeduction)}원</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 상위 몇% */}
            <Percentile value={parseInt(salary.replace(/,/g, '')) || 0} type="salary" />

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

            {/* 차트 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">공제 내역</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-4">
                {[
                  { label: '국민연금 (4.75%)', value: result.deductions.nationalPension, color: 'bg-emerald-500' },
                  { label: '건강보험 (3.595%)', value: result.deductions.healthInsurance, color: 'bg-amber-500' },
                  { label: '장기요양 (12.95%)', value: result.deductions.longTermCare, color: 'bg-violet-500' },
                  { label: '고용보험 (0.9%)', value: result.deductions.employmentInsurance, color: 'bg-pink-500' },
                  { label: '소득세', value: result.deductions.incomeTax, color: 'bg-red-500' },
                  { label: '지방소득세', value: result.deductions.localIncomeTax, color: 'bg-cyan-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">{formatWon(item.value)}</span>
                      <p className="text-xs text-gray-400">{formatCurrency(item.value)}원</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 이미지 저장용 캡처 카드 - 프리미엄 디자인 */}
            <div
              id="salary-result-capture"
              className="rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 relative"
            >
              {/* 배경 장식 */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              </div>

              <div className="relative p-8 text-white">
                {/* 상단 뱃지 */}
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium">2026 연봉 계산기</span>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full shadow-lg">
                    <span className="text-xs font-bold text-white">💎 PREMIUM</span>
                  </div>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="text-center">
                  {/* 이모지 */}
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg border border-white/30">
                    <span className="text-4xl">💰</span>
                  </div>

                  {/* 연봉 */}
                  <p className="text-white/60 text-sm font-medium mb-1">연봉</p>
                  <h2 className="text-3xl font-black mb-4 drop-shadow-lg">{formatWon(parseInt(salary.replace(/,/g, '')))}</h2>

                  {/* 구분선 */}
                  <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-4" />

                  {/* 실수령액 카드 */}
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-white/20">
                    <p className="text-white/70 text-sm mb-2">월 실수령액</p>
                    <p className="text-4xl font-black mb-1">{formatWon(result.monthlyNetSalary)}</p>
                    <p className="text-white/50 text-sm">{formatCurrency(result.monthlyNetSalary)}원</p>
                  </div>

                  {/* 상세 정보 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <p className="text-white/60 text-xs mb-1">연 실수령액</p>
                      <p className="font-bold text-lg">{formatWon(result.annualNetSalary)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <p className="text-white/60 text-xs mb-1">월 공제액</p>
                      <p className="font-bold text-lg">{formatWon(result.totalDeduction)}</p>
                    </div>
                  </div>
                </div>

                {/* 하단 브랜딩 */}
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-white/20">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                  <span className="text-white/60 text-xs font-medium">viral-site-opal.vercel.app</span>
                </div>
              </div>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">결과 공유하기</h3>
              <ShareButtons
                title="연봉 실수령액 계산기"
                description={`내 월 실수령액: ${formatCurrency(result.monthlyNetSalary)}원`}
                captureElementId="salary-result-capture"
                captureFileName="salary-result"
              />
            </div>

            {/* 다른 도구 추천 */}
            <Recommendations currentPath="/salary" />

            {/* FAQ */}
            <FAQ items={salaryFAQ} />
          </>
        )}
      </div>
    </>
  );
}
