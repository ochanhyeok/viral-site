import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from 'recharts';
import type { StressResult, StressLevel } from '../../types/stressTest';
import { STRESS_LEVELS } from '../../types/stressTest';
import { stressTips } from '../../data/stressQuestions';
import { ShareButtons } from '../ShareButtons';

interface ResultProps {
  result: StressResult;
  onRetry: () => void;
}

export function Result({ result, onRetry }: ResultProps) {
  const levelInfo = STRESS_LEVELS[result.level];
  const maxScore = 50;
  const percentage = Math.round((result.totalScore / maxScore) * 100);

  const gaugeData = [
    {
      name: 'score',
      value: percentage,
      fill: levelInfo.color,
    },
  ];

  const categoryData = result.categoryScores.map((cat) => ({
    name: cat.category,
    score: cat.score,
    fill: getCategoryColor(cat.score, cat.maxScore),
  }));

  const tips = stressTips[result.level] || stressTips.moderate;

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          스트레스 지수 테스트 결과
        </h2>
        <p className="text-gray-600">당신의 현재 스트레스 수준을 확인해보세요</p>
      </div>

      {/* 게이지 차트 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              barSize={20}
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background={{ fill: '#e5e7eb' }}
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* 중앙 점수 표시 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="text-5xl font-bold"
              style={{ color: levelInfo.color }}
            >
              {result.totalScore}
            </div>
            <div className="text-gray-500 text-sm">/ {maxScore}점</div>
          </div>
        </div>

        {/* 스트레스 레벨 */}
        <div className="text-center mt-4">
          <span
            className="inline-block px-6 py-2 rounded-full text-white font-bold text-lg"
            style={{ backgroundColor: levelInfo.color }}
          >
            스트레스 {levelInfo.label}
          </span>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {levelInfo.description}
          </p>
        </div>
      </div>

      {/* 카테고리별 점수 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          카테고리별 분석
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 5]} />
              <YAxis type="category" dataKey="name" width={60} />
              <Tooltip
                formatter={(value) => [`${value}점`, '점수']}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 스트레스 관리 팁 */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>💡</span>
          스트레스 관리 팁
        </h3>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-700"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 공유 버튼 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          결과 공유하기
        </h3>
        <ShareButtons
          title={`나의 스트레스 지수: ${result.totalScore}점 (${levelInfo.label})`}
          description={`스트레스 테스트 결과 ${levelInfo.label} 수준으로 나왔어요! 당신도 테스트해보세요.`}
        />
      </div>

      {/* 다시하기 버튼 */}
      <button
        onClick={onRetry}
        className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
      >
        테스트 다시하기
      </button>
    </div>
  );
}

function getCategoryColor(score: number, maxScore: number): string {
  const ratio = score / maxScore;
  if (ratio <= 0.4) return '#22c55e';
  if (ratio <= 0.6) return '#eab308';
  if (ratio <= 0.8) return '#f97316';
  return '#ef4444';
}

export function getStressLevel(totalScore: number): StressLevel {
  if (totalScore <= 20) return 'low';
  if (totalScore <= 30) return 'moderate';
  if (totalScore <= 40) return 'high';
  return 'veryHigh';
}
