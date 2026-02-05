import { useState } from 'react';
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
    description: '2026년 최신 세율 적용',
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
    category: 'calculator',
  },
  {
    path: '/savings',
    emoji: '🏦',
    title: '적금/예금 이자 계산기',
    description: '세전/세후 이자 한번에',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    shadowColor: 'shadow-emerald-500/30',
    badge: 'new',
    category: 'calculator',
  },
  {
    path: '/loan',
    emoji: '💳',
    title: '대출 이자 계산기',
    description: '월 상환액 미리 계산',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    shadowColor: 'shadow-rose-500/30',
    badge: 'new',
    category: 'calculator',
  },
  {
    path: '/compound',
    emoji: '📈',
    title: '복리 계산기',
    description: '복리의 마법, 72법칙',
    gradient: 'from-indigo-500 via-purple-500 to-violet-500',
    shadowColor: 'shadow-indigo-500/30',
    badge: 'new',
    category: 'calculator',
  },
  {
    path: '/stock',
    emoji: '📊',
    title: '주식 수익률 계산기',
    description: '수수료/세금 포함 순수익',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    shadowColor: 'shadow-green-500/30',
    badge: 'new',
    category: 'calculator',
  },
  {
    path: '/dividend',
    emoji: '💵',
    title: '배당금 계산기',
    description: '예상 배당 수익 계산',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    shadowColor: 'shadow-amber-500/30',
    badge: 'new',
    category: 'calculator',
  },
  {
    path: '/invest-test',
    emoji: '📈',
    title: '투자 성향 테스트',
    description: '나에게 맞는 투자 스타일',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    shadowColor: 'shadow-violet-500/30',
    badge: 'new',
    category: 'test',
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

// 인기 TOP PICK (가장 중요한 콘텐츠)
const topPicks = [
  tools.find(t => t.path === '/salary')!,      // 연봉 계산기
  tools.find(t => t.path === '/spending-quiz')!, // 소비성향 테스트
  tools.find(t => t.path === '/work-mbti')!,     // 직장인 MBTI
];

function BadgeComponent({ badge }: { badge?: 'hot' | 'new' | 'popular' }) {
  if (!badge) return null;

  const styles = {
    hot: 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse',
    new: 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-white',
    popular: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900',
  };

  const labels = {
    hot: '🔥 HOT',
    new: '✨ NEW',
    popular: '👑 BEST',
  };

  return (
    <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-black ${styles[badge]} shadow-lg z-10 backdrop-blur-sm`}>
      {labels[badge]}
    </span>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <Link
      to={tool.path}
      className={`group relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br ${tool.gradient} text-white shadow-xl ${tool.shadowColor} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] min-h-[140px]`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <BadgeComponent badge={tool.badge} />

      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />

      {/* 화살표 - 우상단 */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-1 transition-all z-10">
        <svg
          className="w-4 h-4 opacity-70 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* 세로 배치: 이모지 + 텍스트 */}
      <div className="relative flex flex-col h-full">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-3">
          <span className="text-3xl filter drop-shadow-lg">
            {tool.emoji}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-base font-extrabold mb-1 group-hover:translate-x-1 transition-transform leading-tight">
            {tool.title}
          </h2>
          <p className="text-white/80 text-sm leading-snug">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ icon, title, subtitle, gradient }: { icon: string; title: string; subtitle: string; gradient: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

// 큰 카드 (TOP PICK용)
function TopPickCard({ tool }: { tool: Tool }) {
  return (
    <Link
      to={tool.path}
      className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${tool.gradient} text-white shadow-xl ${tool.shadowColor} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]`}
    >
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        {/* 이모지 */}
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <span className="text-4xl filter drop-shadow-lg">{tool.emoji}</span>
        </div>

        {/* 제목 */}
        <h3 className="text-xl font-black mb-2 group-hover:translate-x-1 transition-transform">
          {tool.title}
        </h3>
        <p className="text-white/80 text-sm mb-4">{tool.description}</p>

        {/* CTA 버튼 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold group-hover:bg-white/30 transition-colors">
          <span>시작하기</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// 접기/펼치기 섹션
function CollapsibleSection({
  title,
  subtitle,
  icon,
  gradient,
  items,
  defaultExpanded = false
}: {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  items: Tool[];
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const displayItems = expanded ? items : items.slice(0, 4);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        {items.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span>{expanded ? '접기' : `+${items.length - 4}개 더보기`}</span>
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {displayItems.map((tool, index) => (
          <ToolCard key={tool.path} tool={tool} index={index} />
        ))}
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <SEO
        title="연봉 계산기 & 직장인 심리테스트"
        description="2026 연봉 실수령액 계산기, 퇴직금 계산기, 직장인 MBTI, 소비성향 테스트, 스트레스 테스트, 꼰대력 테스트까지! 직장인 필수 무료 도구 모음."
        keywords="연봉계산기,연봉실수령액,퇴직금계산기,심리테스트,직장인MBTI,스트레스테스트,소비성향테스트,꼰대테스트,무료"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '연봉 계산기 & 직장인 심리테스트 모음',
          description: '2026 연봉 실수령액 계산기, 퇴직금 계산기, 직장인 MBTI, 심리테스트 등 직장인 무료 도구 모음',
          url: 'https://viral-site-opal.vercel.app',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://viral-site-opal.vercel.app/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      <div className="space-y-12">
        {/* 히어로 섹션 */}
        <div className="relative text-center py-10 overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 rounded-full text-violet-700 text-sm font-bold mb-6 shadow-sm border border-violet-200/50">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
            </span>
            무료로 이용 가능
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">연봉 계산기</span>
            <br className="sm:hidden" />
            <span className="text-gray-500 mx-2">&</span>
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">심리테스트</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            필요한 계산부터 재미있는 테스트까지<br />
            <span className="font-semibold text-gray-700">직장인 필수 도구</span>를 한 곳에서!
          </p>

          <VisitorCounter />

          {/* 마스코트 인사 */}
          <div className="mt-8 flex justify-center">
            <MascotGreeting />
          </div>

          {/* 오늘의 운세 */}
          <div className="mt-8 max-w-sm mx-auto">
            <DailyFortune />
          </div>
        </div>

        {/* 🔥 TOP PICKS - 가장 인기있는 콘텐츠 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">인기 TOP 3</h2>
              <p className="text-sm text-gray-600">가장 많이 사용하는 콘텐츠</p>
            </div>
          </div>
          <div className="grid gap-4">
            {topPicks.map((tool) => (
              <TopPickCard key={tool.path} tool={tool} />
            ))}
          </div>
        </section>

        {/* 계산기 섹션 (접기 가능) */}
        <CollapsibleSection
          title="계산기"
          subtitle="정확한 계산이 필요할 때"
          icon="🧮"
          gradient="from-blue-500 to-indigo-600"
          items={calculators.filter(c => !topPicks.some(t => t.path === c.path))}
          defaultExpanded={false}
        />

        {/* 심리테스트 섹션 (접기 가능) */}
        <CollapsibleSection
          title="심리테스트"
          subtitle="나를 알아가는 시간"
          icon="🧪"
          gradient="from-violet-500 to-purple-600"
          items={tests.filter(t => !topPicks.some(p => p.path === t.path))}
          defaultExpanded={false}
        />

        {/* 멀티플레이어 게임 섹션 */}
        {games.length > 0 && (
          <section>
            <SectionHeader
              icon="🎮"
              title="멀티플레이어 게임"
              subtitle="친구와 함께 즐기기"
              gradient="from-indigo-500 to-pink-500"
            />
            <div className="space-y-4">
              {games.map((tool, index) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${tool.gradient} text-white shadow-xl ${tool.shadowColor} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.99] block`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <BadgeComponent badge={tool.badge} />

                  {/* 배경 장식 */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>

                  <div className="relative flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <span className="text-5xl filter drop-shadow-lg">
                        {tool.emoji}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black mb-2 group-hover:translate-x-1 transition-transform">
                        {tool.title}
                      </h2>
                      <p className="text-white/80 text-base mb-3">
                        {tool.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>2인 대전</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-2 transition-all">
                      <svg
                        className="w-7 h-7 opacity-70 group-hover:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 히든 테스트 */}
        <HiddenTests />

        {/* 푸터 안내 */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            모든 계산 결과는 참고용이며, 실제 금액과 다를 수 있습니다.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 10px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
