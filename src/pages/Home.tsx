import { Link } from 'react-router-dom';
import { SEO, VisitorCounter, MascotGreeting, DailyFortune, HiddenTests } from '../components';

interface Tool {
  path: string;
  emoji: string;
  title: string;
  description: string;
  gradient: string;
  shadowColor: string;
  badge?: 'hot' | 'new' | 'popular';
  category: 'calculator' | 'test' | 'game';
}

const tools: Tool[] = [
  {
    path: '/salary',
    emoji: '💰',
    title: '연봉 실수령액 계산기',
    description: '2025년 최신 세율 적용',
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    shadowColor: 'shadow-blue-500/30',
    badge: 'popular',
    category: 'calculator',
  },
  {
    path: '/retirement',
    emoji: '🏦',
    title: '퇴직금 계산기',
    description: '예상 퇴직금 미리 계산',
    gradient: 'from-emerald-500 via-green-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/30',
    category: 'calculator',
  },
  {
    path: '/tax-refund',
    emoji: '💸',
    title: '연말정산 환급액 예측',
    description: '13월의 월급 미리 계산',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    shadowColor: 'shadow-green-500/30',
    badge: 'new',
    category: 'calculator',
  },
  {
    path: '/spending-quiz',
    emoji: '💳',
    title: '소비성향 테스트',
    description: '나는 어떤 소비 유형?',
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    shadowColor: 'shadow-purple-500/30',
    badge: 'hot',
    category: 'test',
  },
  {
    path: '/work-mbti',
    emoji: '👔',
    title: '직장인 MBTI',
    description: '회사에서 나의 유형은?',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    shadowColor: 'shadow-orange-500/30',
    badge: 'popular',
    category: 'test',
  },
  {
    path: '/stress-test',
    emoji: '🧠',
    title: '스트레스 지수 테스트',
    description: '현재 나의 스트레스 수준',
    gradient: 'from-rose-500 via-pink-500 to-red-500',
    shadowColor: 'shadow-rose-500/30',
    category: 'test',
  },
  {
    path: '/kkondae-test',
    emoji: '👴',
    title: '꼰대력 테스트',
    description: '나는 MZ? 아니면 꼰대?',
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    shadowColor: 'shadow-slate-500/30',
    category: 'test',
  },
  {
    path: '/color-test',
    emoji: '🎨',
    title: '색감 테스트',
    description: '당신의 색 구분 능력은?',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    shadowColor: 'shadow-violet-500/30',
    badge: 'hot',
    category: 'test',
  },
  {
    path: '/reaction-test',
    emoji: '⚡',
    title: '반응속도 테스트',
    description: '프로게이머급 반사신경?',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/30',
    category: 'test',
  },
  {
    path: '/emoji-quiz',
    emoji: '🧩',
    title: '이모지 퀴즈',
    description: '힌트 보고 정답 맞추기',
    gradient: 'from-pink-500 via-orange-500 to-yellow-500',
    shadowColor: 'shadow-pink-500/30',
    category: 'test',
  },
  {
    path: '/burnout-test',
    emoji: '🔥',
    title: '번아웃 위험도 테스트',
    description: '나의 번아웃 상태는?',
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    shadowColor: 'shadow-orange-500/30',
    badge: 'new',
    category: 'test',
  },
  {
    path: '/hoesik-test',
    emoji: '🍻',
    title: '회식 생존 테스트',
    description: '나의 회식 생존력은?',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    shadowColor: 'shadow-amber-500/30',
    badge: 'hot',
    category: 'test',
  },
  {
    path: '/battleship',
    emoji: '🚢',
    title: '배틀쉽',
    description: '친구와 전략적 해전 대결',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    shadowColor: 'shadow-indigo-500/30',
    badge: 'new',
    category: 'game',
  },
];

const calculators = tools.filter(t => t.category === 'calculator');
const tests = tools.filter(t => t.category === 'test');
const games = tools.filter(t => t.category === 'game');

function BadgeComponent({ badge }: { badge?: 'hot' | 'new' | 'popular' }) {
  if (!badge) return null;

  const styles = {
    hot: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
    new: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    popular: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900',
  };

  const labels = {
    hot: 'HOT',
    new: 'NEW',
    popular: 'BEST',
  };

  return (
    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${styles[badge]} shadow-lg z-10`}>
      {labels[badge]}
    </span>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <Link
      to={tool.path}
      className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${tool.gradient} text-white shadow-xl ${tool.shadowColor} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <BadgeComponent badge={tool.badge} />

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
  );
}

export function Home() {
  return (
    <>
      <SEO
        title="연봉 계산기 & 직장인 심리테스트"
        description="2025 연봉 실수령액 계산기, 퇴직금 계산기, 직장인 MBTI, 소비성향 테스트, 스트레스 테스트, 꼰대력 테스트까지! 직장인 필수 무료 도구 모음."
        keywords="연봉계산기,연봉실수령액,퇴직금계산기,심리테스트,직장인MBTI,스트레스테스트,소비성향테스트,꼰대테스트,무료"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '연봉 계산기 & 직장인 심리테스트 모음',
          description: '2025 연봉 실수령액 계산기, 퇴직금 계산기, 직장인 MBTI, 심리테스트 등 직장인 무료 도구 모음',
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">연봉 계산기</span> &<br className="sm:hidden" /> 직장인 심리테스트
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
            필요한 계산부터 재미있는 테스트까지<br />
            직장인 필수 도구를 한 곳에서!
          </p>
          <VisitorCounter />

          {/* 마스코트 인사 */}
          <div className="mt-6 flex justify-center">
            <MascotGreeting />
          </div>

          {/* 오늘의 운세 */}
          <div className="mt-6 max-w-sm mx-auto">
            <DailyFortune />
          </div>
        </div>

        {/* 계산기 섹션 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">계산기</h2>
            <span className="text-sm text-gray-400">정확한 계산이 필요할 때</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {calculators.map((tool, index) => (
              <ToolCard key={tool.path} tool={tool} index={index} />
            ))}
          </div>
        </div>

        {/* 심리테스트 섹션 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">심리테스트</h2>
            <span className="text-sm text-gray-400">나를 알아가는 시간</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {tests.map((tool, index) => (
              <ToolCard key={tool.path} tool={tool} index={index} />
            ))}
          </div>
        </div>

        {/* 멀티플레이어 게임 섹션 */}
        {games.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-pink-500" />
              <h2 className="text-xl font-bold text-gray-900">멀티플레이어 게임</h2>
              <span className="text-sm text-gray-400">친구와 함께</span>
            </div>
            <div className="space-y-4">
              {games.map((tool, index) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${tool.gradient} text-white shadow-xl ${tool.shadowColor} hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] block`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <BadgeComponent badge={tool.badge} />

                  {/* 배경 장식 */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>

                  <div className="relative flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-5xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {tool.emoji}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black mb-2 group-hover:translate-x-1 transition-transform">
                        {tool.title}
                      </h2>
                      <p className="text-white/80 text-base">
                        {tool.description}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>2인 대전</span>
                      </div>
                    </div>
                    <svg
                      className="w-8 h-8 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all"
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
          </div>
        )}

        {/* 히든 테스트 */}
        <HiddenTests />

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
