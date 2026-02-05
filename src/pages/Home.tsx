import { Link } from 'react-router-dom';
import { SEO, VisitorCounter } from '../components';

const tools = [
  {
    path: '/salary',
    emoji: '💰',
    title: '연봉 실수령액 계산기',
    description: '2025년 최신 세율 적용',
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    shadowColor: 'shadow-blue-500/30',
  },
  {
    path: '/retirement',
    emoji: '🏦',
    title: '퇴직금 계산기',
    description: '예상 퇴직금 미리 계산',
    gradient: 'from-emerald-500 via-green-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/30',
  },
  {
    path: '/spending-quiz',
    emoji: '💸',
    title: '소비성향 테스트',
    description: '나는 어떤 소비 유형?',
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    shadowColor: 'shadow-purple-500/30',
  },
  {
    path: '/work-mbti',
    emoji: '💼',
    title: '직장인 MBTI',
    description: '회사에서 나의 유형은?',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    shadowColor: 'shadow-orange-500/30',
  },
  {
    path: '/stress-test',
    emoji: '🧠',
    title: '스트레스 지수 테스트',
    description: '현재 나의 스트레스 수준',
    gradient: 'from-rose-500 via-pink-500 to-red-500',
    shadowColor: 'shadow-rose-500/30',
  },
];

export function Home() {
  return (
    <>
      <SEO
        title="홈"
        description="연봉 실수령액 계산기, 퇴직금 계산기, 소비성향 테스트, 직장인 MBTI, 스트레스 테스트까지! 20-30대 직장인을 위한 필수 무료 도구 모음."
        keywords="연봉계산기,퇴직금계산기,소비성향테스트,직장인MBTI,실수령액,2025연봉,심리테스트"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '직장인 꿀툴 모음',
          description: '연봉 계산기, 퇴직금 계산기, 심리테스트 등 직장인을 위한 무료 도구 모음',
          url: 'https://viral-site-opal.vercel.app',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://viral-site-opal.vercel.app/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      <div className="space-y-10">
        {/* 히어로 섹션 */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full text-violet-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            무료로 이용 가능
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            직장인 <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">꿀툴</span> 모음
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
            필요한 계산부터 재미있는 테스트까지<br />
            직장인 필수 도구를 한 곳에서!
          </p>
          <VisitorCounter />
        </div>

        {/* 도구 그리드 */}
        <div className="grid gap-5 sm:grid-cols-2">
          {tools.map((tool, index) => (
            <Link
              key={tool.path}
              to={tool.path}
              className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${tool.gradient} text-white shadow-xl ${tool.shadowColor} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex items-start gap-4">
                <span className="text-5xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {tool.emoji}
                </span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1 group-hover:translate-x-1 transition-transform">
                    {tool.title}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {tool.description}
                  </p>
                </div>
                <svg
                  className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* 푸터 안내 */}
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm">
            모든 계산 결과는 참고용이며, 실제 금액과 다를 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
}
