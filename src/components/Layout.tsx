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
            <span className="text-xl sm:text-2xl">🛠️</span>
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              직장인 꿀툴
            </span>
          </Link>
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">홈으로</span>
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 sm:py-8">
        {children}
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 mt-auto safe-area-bottom">
        <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 text-center text-gray-400 text-xs">
          <p>© 2025 직장인 꿀툴 모음</p>
        </div>
      </footer>
    </div>
  );
}
