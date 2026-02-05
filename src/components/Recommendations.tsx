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
    emoji: '💸',
    title: '소비성향 테스트',
    shortTitle: '소비성향',
    description: '나의 소비 스타일 알아보기',
    gradient: 'from-purple-500 to-fuchsia-600',
    category: 'test',
    relatedTo: ['/salary', '/work-mbti', '/kkondae-test'],
  },
  {
    path: '/work-mbti',
    emoji: '💼',
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
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-xl">🎯</span> {displayTitle}
      </h3>

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
