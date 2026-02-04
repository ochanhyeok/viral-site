import { Link } from 'react-router-dom';
import { SEO, Card } from '../components';

const tools = [
  {
    path: '/salary',
    emoji: '💰',
    title: '연봉 실수령액 계산기',
    description: '2025년 최신 세율로 실수령액 계산',
    color: 'from-blue-500 to-blue-600',
  },
  {
    path: '/retirement',
    emoji: '🏦',
    title: '퇴직금 계산기',
    description: '예상 퇴직금 미리 계산해보기',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    path: '/spending-quiz',
    emoji: '💸',
    title: '소비성향 테스트',
    description: '나는 어떤 유형의 소비자?',
    color: 'from-purple-500 to-pink-500',
  },
  {
    path: '/work-mbti',
    emoji: '💼',
    title: '직장인 MBTI',
    description: '회사에서 나의 성격 유형은?',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    path: '/stress-test',
    emoji: '🧠',
    title: '스트레스 지수 테스트',
    description: '현재 나의 스트레스 수준은?',
    color: 'from-rose-500 to-orange-500',
  },
];

export function Home() {
  return (
    <>
      <SEO
        title="직장인 꿀툴 모음"
        description="연봉 계산기, 퇴직금 계산기, 소비성향 테스트, 직장인 MBTI까지! 20-30대 직장인을 위한 필수 도구 모음"
        keywords="연봉계산기,퇴직금계산기,소비성향테스트,직장인MBTI,실수령액"
      />

      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            직장인 꿀툴 모음
          </h1>
          <p className="text-gray-600">
            필요한 계산부터 재미있는 테스트까지!
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link key={tool.path} to={tool.path}>
              <Card className={`bg-gradient-to-br ${tool.color} text-white hover:scale-[1.02] transition-transform cursor-pointer h-full`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{tool.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold mb-1">{tool.title}</h2>
                    <p className="text-white/80">{tool.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="text-center bg-gray-50">
          <p className="text-gray-500 text-sm">
            모든 계산 결과는 참고용이며, 실제 금액과 다를 수 있습니다.<br />
            정확한 금액은 해당 기관에 문의해주세요.
          </p>
        </Card>
      </div>
    </>
  );
}
