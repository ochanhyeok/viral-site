import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* 상단 그라데이션 라인 */}
      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 safe-area-top shadow-sm">
        <nav className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-gray-800 hover:text-violet-600 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 group-hover:scale-110 transition-all">
              <span className="text-white text-lg">✨</span>
            </div>
            <span className="text-base sm:text-lg bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">
              연봉계산기
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {!isHome && (
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">홈</span>
              </Link>
            )}
            <Link
              to="/ranking"
              aria-label="랭킹"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all active:scale-95 ${
                isActive('/ranking')
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">랭킹</span>
            </Link>
            <Link
              to="/my"
              aria-label="마이페이지"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all active:scale-95 ${
                isActive('/my')
                  ? 'text-violet-600 bg-violet-50'
                  : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">MY</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-10">
        {children}
      </main>

      <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200/50 mt-auto safe-area-bottom">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* 로고 & 슬로건 */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <span className="text-sm font-bold text-gray-700">연봉계산기 & 심리테스트</span>
            </div>
            <p className="text-xs text-gray-500">직장인을 위한 필수 도구 모음</p>
          </div>

          {/* 링크 */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-6 text-sm">
            <Link to="/about" className="text-gray-500 hover:text-violet-600 transition-colors">
              소개
            </Link>
            <span className="text-gray-300">·</span>
            <Link to="/terms" className="text-gray-500 hover:text-violet-600 transition-colors">
              이용약관
            </Link>
            <span className="text-gray-300">·</span>
            <Link to="/privacy" className="text-gray-500 hover:text-violet-600 transition-colors">
              개인정보처리방침
            </Link>
            <span className="text-gray-300">·</span>
            <Link to="/contact" className="text-gray-500 hover:text-violet-600 transition-colors">
              문의하기
            </Link>
          </div>

          {/* 저작권 */}
          <p className="text-center text-xs text-gray-500">
            © 2026 연봉계산기 & 심리테스트. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
