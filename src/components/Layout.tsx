import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 safe-area-top">
        <nav className="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-800 hover:text-violet-600 transition-colors active:scale-95"
          >
            <span className="text-xl sm:text-2xl">✦</span>
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              연봉계산기 & 심리테스트
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {!isHome && (
              <Link
                to="/"
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">홈</span>
              </Link>
            )}
            <Link
              to="/ranking"
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">랭킹</span>
            </Link>
            <Link
              to="/my"
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">MY</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 sm:py-8">
        {children}
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 mt-auto safe-area-bottom">
        <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 text-center text-gray-400 text-xs space-y-2">
          <div className="flex items-center justify-center gap-4">
            <Link to="/privacy" className="hover:text-gray-600 transition-colors">
              개인정보처리방침
            </Link>
            <span>|</span>
            <a href="mailto:contact@example.com" className="hover:text-gray-600 transition-colors">
              문의하기
            </a>
          </div>
          <p>© 2025 연봉계산기 & 심리테스트 모음</p>
        </div>
      </footer>
    </div>
  );
}
