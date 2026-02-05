import { Link } from 'react-router-dom';
import { SEO } from '../components';

const features = [
  {
    emoji: '💰',
    title: '연봉 계산기',
    description: '2025년 최신 세율을 적용한 연봉 실수령액 계산',
  },
  {
    emoji: '🏦',
    title: '퇴직금 계산기',
    description: '예상 퇴직금을 미리 계산하고 준비하세요',
  },
  {
    emoji: '🧠',
    title: '심리테스트',
    description: '재미있는 테스트로 나를 알아가는 시간',
  },
  {
    emoji: '🎮',
    title: '멀티플레이 게임',
    description: '친구와 함께 즐기는 배틀쉽 대전',
  },
];

const stats = [
  { number: '10+', label: '테스트 & 계산기' },
  { number: '20+', label: '획득 가능 뱃지' },
  { number: '100%', label: '무료 서비스' },
];

export function About() {
  return (
    <>
      <SEO
        title="소개"
        description="연봉계산기 & 심리테스트 - 직장인을 위한 무료 계산기와 재미있는 테스트를 제공하는 서비스입니다."
        keywords="연봉계산기,심리테스트,직장인,무료,서비스소개"
      />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-500/30">
            <span className="text-5xl">🎯</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            연봉계산기 & 심리테스트
          </h1>
          <p className="text-gray-500 text-lg">
            직장인을 위한 필수 도구 모음
          </p>
        </div>

        {/* 소개 카드 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">서비스 소개</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              안녕하세요! <strong>연봉계산기 & 심리테스트</strong>는 직장인들의 일상에
              필요한 계산 도구와 재미있는 테스트를 제공하는 무료 서비스입니다.
            </p>
            <p>
              복잡한 세금 계산부터 나를 알아가는 심리테스트까지, 모든 것을 한 곳에서
              쉽고 빠르게 이용할 수 있습니다.
            </p>
            <p>
              회원가입 없이 누구나 무료로 이용할 수 있으며, 테스트 결과는 브라우저에
              안전하게 저장되어 언제든 다시 확인할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 text-white text-center shadow-lg"
            >
              <div className="text-2xl sm:text-3xl font-black">{stat.number}</div>
              <div className="text-sm text-violet-100">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 주요 기능 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">주요 기능</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-xl hover:bg-violet-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{feature.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우리의 약속 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🤝</span> 우리의 약속
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>무료 서비스</strong> - 모든 기능을 무료로 이용할 수 있습니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>개인정보 보호</strong> - 민감한 정보는 브라우저에만 저장됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>최신 정보</strong> - 계산기는 최신 세율을 반영합니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>지속적인 업데이트</strong> - 새로운 테스트가 계속 추가됩니다</span>
            </li>
          </ul>
        </div>

        {/* 문의 안내 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">문의하기</h2>
          <p className="text-gray-600 mb-4">
            서비스 이용 중 불편한 점이나 제안사항이 있으시면 언제든 연락주세요!
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors"
          >
            <span>📧</span> 문의하기
          </Link>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-3">지금 바로 시작하세요!</h2>
          <p className="text-violet-100 mb-6">
            회원가입 없이 바로 이용할 수 있습니다
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-violet-50 transition-colors"
          >
            홈으로 가기 →
          </Link>
        </div>

        {/* 하단 링크 */}
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <Link to="/terms" className="hover:text-violet-600 transition-colors">
            이용약관
          </Link>
          <Link to="/privacy" className="hover:text-violet-600 transition-colors">
            개인정보처리방침
          </Link>
          <Link to="/contact" className="hover:text-violet-600 transition-colors">
            문의하기
          </Link>
        </div>
      </div>
    </>
  );
}
