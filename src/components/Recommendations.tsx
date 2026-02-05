import { Link, useLocation } from 'react-router-dom';

interface Tool {
  path: string;
  emoji: string;
  title: string;
  shortTitle: string;
  description: string;
  gradient: string;
  category: 'calculator' | 'test';
  relatedTo: string[]; // 관련도 높은 도구들의 path
}

const allTools: Tool[] = [
  {
    path: '/salary',
    emoji: '💰',
    title: '연봉 실수령액 계산기',
    shortTitle: '연봉계산기',
    description: '2025년 최신 세율로 실수령액 계산',
    gradient: 'from-blue-500 to-indigo-600',
    category: 'calculator',
    relatedTo: ['/retirement', '/spending-quiz', '/stress-test'],
  },
  {
    path: '/retirement',
    emoji: '🏦',
    title: '퇴직금 계산기',
    shortTitle: '퇴직금계산기',
    description: '예상 퇴직금 미리 계산해보기',
    gradient: 'from-emerald-500 to-teal-600',
    category: 'calculator',
    relatedTo: ['/salary', '/stress-test', '/spending-quiz'],
  },
  {
    path: '/spending-quiz',
    emoji: '💳',
    title: '소비성향 테스트',
    shortTitle: '소비성향',
    description: '나의 소비 스타일 알아보기',
    gradient: 'from-purple-500 to-fuchsia-600',
    category: 'test',
    relatedTo: ['/salary', '/work-mbti', '/kkondae-test'],
  },
  {
    path: '/work-mbti',
    emoji: '👔',
    title: '직장인 MBTI',
    shortTitle: '직장인MBTI',
    description: '회사에서 나의 성격 유형은?',
    gradient: 'from-orange-500 to-yellow-500',
    category: 'test',
    relatedTo: ['/kkondae-test', '/stress-test', '/spending-quiz'],
  },
  {
    path: '/stress-test',
    emoji: '🧠',
    title: '스트레스 테스트',
    shortTitle: '스트레스',
    description: '현재 나의 스트레스 수준 체크',
    gradient: 'from-rose-500 to-red-500',
    category: 'test',
    relatedTo: ['/work-mbti', '/kkondae-test', '/salary'],
  },
  {
    path: '/kkondae-test',
    emoji: '👴',
    title: '꼰대력 테스트',
    shortTitle: '꼰대력',
    description: '나는 MZ? 아니면 꼰대?',
    gradient: 'from-slate-600 to-slate-800',
    category: 'test',
    relatedTo: ['/work-mbti', '/stress-test', '/spending-quiz'],
  },
  {
    path: '/color-test',
    emoji: '🎨',
    title: '색감 테스트',
    shortTitle: '색감테스트',
    description: '당신의 색 구분 능력은?',
    gradient: 'from-violet-500 to-fuchsia-500',
    category: 'test',
    relatedTo: ['/reaction-test', '/stress-test', '/kkondae-test'],
  },
  {
    path: '/reaction-test',
    emoji: '⚡',
    title: '반응속도 테스트',
    shortTitle: '반응속도',
    description: '프로게이머급 반사신경?',
    gradient: 'from-yellow-400 to-orange-500',
    category: 'test',
    relatedTo: ['/color-test', '/emoji-quiz', '/work-mbti'],
  },
  {
    path: '/emoji-quiz',
    emoji: '🧩',
    title: '이모지 퀴즈',
    shortTitle: '이모지퀴즈',
    description: '힌트 보고 정답 맞추기',
    gradient: 'from-pink-500 to-yellow-500',
    category: 'test',
    relatedTo: ['/color-test', '/reaction-test', '/kkondae-test'],
  },
  {
    path: '/burnout-test',
    emoji: '🔥',
    title: '번아웃 위험도 테스트',
    shortTitle: '번아웃테스트',
    description: '나의 번아웃 상태는?',
    gradient: 'from-orange-500 to-rose-600',
    category: 'test',
    relatedTo: ['/stress-test', '/resignation-test', '/work-mbti'],
  },
  {
    path: '/hoesik-test',
    emoji: '🍻',
    title: '회식 생존 테스트',
    shortTitle: '회식테스트',
    description: '나의 회식 생존력은?',
    gradient: 'from-amber-500 to-orange-500',
    category: 'test',
    relatedTo: ['/kkondae-test', '/work-mbti', '/stress-test'],
  },
  {
    path: '/tax-refund',
    emoji: '💸',
    title: '연말정산 환급액 예측',
    shortTitle: '연말정산',
    description: '13월의 월급 미리 계산',
    gradient: 'from-green-500 to-emerald-600',
    category: 'calculator',
    relatedTo: ['/salary', '/retirement', '/spending-quiz'],
  },
  {
    path: '/resignation-test',
    emoji: '🚪',
    title: '퇴사 확률 테스트',
    shortTitle: '퇴사테스트',
    description: '나의 퇴사 욕구는?',
    gradient: 'from-red-500 to-orange-500',
    category: 'test',
    relatedTo: ['/burnout-test', '/stress-test', '/work-mbti'],
  },
  {
    path: '/savings',
    emoji: '🏦',
    title: '적금/예금 이자 계산기',
    shortTitle: '이자계산기',
    description: '세전/세후 이자 한번에 계산',
    gradient: 'from-emerald-500 to-teal-600',
    category: 'calculator',
    relatedTo: ['/salary', '/retirement', '/tax-refund'],
  },
  {
    path: '/loan',
    emoji: '💳',
    title: '대출 이자 계산기',
    shortTitle: '대출계산기',
    description: '월 상환액 미리 계산',
    gradient: 'from-rose-500 to-pink-600',
    category: 'calculator',
    relatedTo: ['/savings', '/salary', '/retirement'],
  },
  {
    path: '/compound',
    emoji: '📈',
    title: '복리 계산기',
    shortTitle: '복리계산기',
    description: '복리의 마법 체험하기',
    gradient: 'from-indigo-500 to-purple-600',
    category: 'calculator',
    relatedTo: ['/savings', '/loan', '/salary'],
  },
  {
    path: '/stock',
    emoji: '📊',
    title: '주식 수익률 계산기',
    shortTitle: '주식계산기',
    description: '수수료/세금 포함 실제 수익',
    gradient: 'from-green-500 to-emerald-600',
    category: 'calculator',
    relatedTo: ['/compound', '/dividend', '/savings'],
  },
  {
    path: '/dividend',
    emoji: '💵',
    title: '배당금 계산기',
    shortTitle: '배당계산기',
    description: '예상 배당 수익 계산',
    gradient: 'from-amber-500 to-orange-600',
    category: 'calculator',
    relatedTo: ['/stock', '/compound', '/savings'],
  },
  {
    path: '/invest-test',
    emoji: '📈',
    title: '투자 성향 테스트',
    shortTitle: '투자성향',
    description: '나에게 맞는 투자 스타일',
    gradient: 'from-violet-500 to-purple-600',
    category: 'test',
    relatedTo: ['/stock', '/dividend', '/spending-quiz'],
  },
];

interface RecommendationsProps {
  currentPath?: string;
  title?: string;
  maxItems?: number;
}

export function Recommendations({
  currentPath,
  title = "이 테스트도 해보세요!",
  maxItems = 3
}: RecommendationsProps) {
  const location = useLocation();
  const path = currentPath || location.pathname;

  // 현재 도구 찾기
  const currentTool = allTools.find(t => t.path === path);

  // 추천 도구 선택 (관련도 순으로)
  const getRecommendations = (): Tool[] => {
    if (!currentTool) {
      // 현재 도구를 못 찾으면 현재 경로 제외하고 랜덤하게
      return allTools.filter(t => t.path !== path).slice(0, maxItems);
    }

    // 관련 도구 우선 + 나머지
    const related = currentTool.relatedTo
      .map(p => allTools.find(t => t.path === p))
      .filter((t): t is Tool => t !== undefined);

    const others = allTools.filter(
      t => t.path !== path && !currentTool.relatedTo.includes(t.path)
    );

    return [...related, ...others].slice(0, maxItems);
  };

  const recommendations = getRecommendations();

  // 현재 도구가 계산기인지 테스트인지에 따라 제목 변경
  const displayTitle = currentTool?.category === 'calculator'
    ? "이것도 계산해보세요!"
    : title;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">{displayTitle}</h3>

      <div className="space-y-3">
        {recommendations.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${tool.gradient} text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg`}
          >
            <span className="text-3xl">{tool.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{tool.title}</p>
              <p className="text-white/80 text-sm truncate">{tool.description}</p>
            </div>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      <Link
        to="/"
        className="mt-4 flex items-center justify-center gap-2 text-gray-500 hover:text-violet-600 transition-colors text-sm"
      >
        <span>전체 보기</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}
