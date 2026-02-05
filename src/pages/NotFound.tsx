import { Link } from 'react-router-dom';
import { SEO } from '../components';

export function NotFound() {
  return (
    <>
      <SEO
        title="페이지를 찾을 수 없습니다"
        description="요청하신 페이지를 찾을 수 없습니다. 연봉계산기 & 심리테스트 홈으로 이동해주세요."
      />

      <div className="max-w-lg mx-auto text-center py-12">
        {/* 이모지 아이콘 */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
          <span className="text-5xl">🔍</span>
        </div>

        {/* 에러 메시지 */}
        <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          요청하신 페이지가 삭제되었거나<br />
          주소가 변경되었을 수 있습니다.
        </p>

        {/* 홈으로 버튼 */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/30 hover:shadow-xl active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          홈으로 돌아가기
        </Link>

        {/* 추천 페이지 */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">이런 페이지는 어떠세요?</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/salary"
              className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left"
            >
              <span className="text-xl mb-1 block">💰</span>
              <span className="text-sm font-medium text-gray-700">연봉 계산기</span>
            </Link>
            <Link
              to="/spending-quiz"
              className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left"
            >
              <span className="text-xl mb-1 block">💳</span>
              <span className="text-sm font-medium text-gray-700">소비성향 테스트</span>
            </Link>
            <Link
              to="/work-mbti"
              className="p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-left"
            >
              <span className="text-xl mb-1 block">👔</span>
              <span className="text-sm font-medium text-gray-700">직장인 MBTI</span>
            </Link>
            <Link
              to="/retirement"
              className="p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left"
            >
              <span className="text-xl mb-1 block">🏦</span>
              <span className="text-sm font-medium text-gray-700">퇴직금 계산기</span>
            </Link>
          </div>
        </div>

        {/* 서비스 소개 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            연봉계산기 & 심리테스트 - 직장인을 위한 필수 도구 모음
          </p>
        </div>
      </div>
    </>
  );
}
