import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SEO, Card, Button, Input, Select, ShareButtons } from '../../components';
import { useSalaryCalc, formatCurrency } from './useSalaryCalc';

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
        { name: '실수령액', value: result.monthlyNetSalary, color: '#3B82F6' },
        { name: '국민연금', value: result.deductions.nationalPension, color: '#10B981' },
        { name: '건강보험', value: result.deductions.healthInsurance, color: '#F59E0B' },
        { name: '장기요양', value: result.deductions.longTermCare, color: '#8B5CF6' },
        { name: '고용보험', value: result.deductions.employmentInsurance, color: '#EC4899' },
        { name: '소득세', value: result.deductions.incomeTax, color: '#EF4444' },
        { name: '지방소득세', value: result.deductions.localIncomeTax, color: '#6366F1' },
      ]
    : [];

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
        description="2025년 최신 세율 적용! 연봉에서 4대보험과 세금을 제외한 실수령액을 정확하게 계산해보세요."
        keywords="연봉계산기,실수령액,세후연봉,4대보험,소득세계산"
      />

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">연봉 실수령액 계산기</h1>
          <p className="text-gray-600">2025년 최신 세율 적용</p>
        </div>

        <Card>
          <div className="space-y-5">
            <Input
              label="연봉 (세전)"
              value={salary}
              onChange={handleSalaryChange}
              placeholder="5,000만원"
              suffix="원"
              type="text"
              inputMode="numeric"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="부양가족 수 (본인 포함)"
                options={dependentOptions}
                value={dependents}
                onChange={(e) => {
                  setDependents(parseInt(e.target.value));
                  setCalculated(false);
                }}
              />
              <Select
                label="20세 이하 자녀 수"
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

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRetirement}
                onChange={(e) => {
                  setIncludeRetirement(e.target.checked);
                  setCalculated(false);
                }}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">퇴직금 포함 (연봉의 1/12)</span>
            </label>

            <Button onClick={handleCalculate} className="w-full" size="lg">
              계산하기
            </Button>
          </div>
        </Card>

        {calculated && result && (
          <>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="text-center">
                <p className="text-blue-100 mb-1">예상 월 실수령액</p>
                <p className="text-4xl font-bold mb-4">
                  {formatCurrency(result.monthlyNetSalary)}원
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-blue-100">연 실수령액</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(result.annualNetSalary)}원
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-blue-100">월 공제액</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(result.totalDeduction)}원
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">공제 내역</h3>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${formatCurrency(value as number)}원`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">국민연금 (4.5%)</span>
                  <span className="font-medium">
                    {formatCurrency(result.deductions.nationalPension)}원
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">건강보험 (3.545%)</span>
                  <span className="font-medium">
                    {formatCurrency(result.deductions.healthInsurance)}원
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">장기요양보험 (12.95%)</span>
                  <span className="font-medium">
                    {formatCurrency(result.deductions.longTermCare)}원
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">고용보험 (0.9%)</span>
                  <span className="font-medium">
                    {formatCurrency(result.deductions.employmentInsurance)}원
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">소득세</span>
                  <span className="font-medium">
                    {formatCurrency(result.deductions.incomeTax)}원
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">지방소득세 (소득세의 10%)</span>
                  <span className="font-medium">
                    {formatCurrency(result.deductions.localIncomeTax)}원
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                결과 공유하기
              </h3>
              <ShareButtons
                title="연봉 실수령액 계산기"
                description={`내 월 실수령액: ${formatCurrency(result.monthlyNetSalary)}원`}
              />
            </Card>
          </>
        )}
      </div>
    </>
  );
}
