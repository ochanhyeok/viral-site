import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <nav className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            직장인 꿀툴 모음
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>© 2025 직장인 꿀툴 모음. 모든 계산 결과는 참고용이며, 실제와 다를 수 있습니다.</p>
        </div>
      </footer>
    </div>
  );
}
