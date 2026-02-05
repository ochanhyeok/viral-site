// 고퀄리티 CSS/SVG 기반 뱃지 아이콘 컴포넌트
import type { ReactNode } from 'react';

interface BadgeIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

// SVG 아이콘 정의
const icons: Record<string, (size: string) => ReactNode> = {
  // === 일반 뱃지 ===
  'first-test': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
      </svg>
    </div>
  ),
  'test-5': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  'test-10': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  'test-30': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
  ),
  'test-100': (size) => (
    <div className={`${size} rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg ring-2 ring-yellow-300/50`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2a1 1 0 01.894.553l2.991 5.994 6.642.965a1 1 0 01.555 1.706l-4.814 4.681 1.138 6.6a1 1 0 01-1.451 1.054L10 20.3l-5.955 3.253a1 1 0 01-1.451-1.054l1.138-6.6-4.814-4.68a1 1 0 01.555-1.707l6.642-.965 2.991-5.994A1 1 0 0110 2z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  'all-rounder': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
  ),

  // === 색감 테스트 뱃지 ===
  'color-first': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 flex items-center justify-center shadow-lg`}>
      <div className="w-1/2 h-1/2 rounded-full bg-white/30 border-2 border-white" />
    </div>
  ),
  'color-master': (size) => (
    <div className={`${size} rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg overflow-hidden`}>
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 bg-red-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-blue-400" />
      </div>
    </div>
  ),
  'color-perfect': (size) => (
    <div className={`${size} rounded-xl bg-gradient-to-br from-violet-400 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg ring-2 ring-fuchsia-300/50`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
      </svg>
    </div>
  ),

  // === 반응속도 테스트 뱃지 ===
  'reaction-first': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  'reaction-fast': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  'reaction-pro': (size) => (
    <div className={`${size} rounded-lg bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v8h12V6H4zm5 2a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
      </svg>
    </div>
  ),
  'reaction-god': (size) => (
    <div className={`${size} rounded-xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg ring-2 ring-yellow-300/50`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    </div>
  ),

  // === 이모지 퀴즈 뱃지 ===
  'emoji-first': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-pink-400 to-orange-500 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  'emoji-good': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    </div>
  ),
  'emoji-master': (size) => (
    <div className={`${size} rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  'emoji-perfect': (size) => (
    <div className={`${size} rounded-xl bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 flex items-center justify-center shadow-lg ring-2 ring-yellow-300/50`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
  ),

  // === 성격 테스트 뱃지 ===
  'personality-explorer': (size) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  'personality-master': (size) => (
    <div className={`${size} rounded-lg bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg`}>
      <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    </div>
  ),

  // 기본 잠금 아이콘
  'locked': (size) => (
    <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center`}>
      <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    </div>
  ),
};

export function BadgeIcon({ type, size = 'md', className = '' }: BadgeIconProps) {
  const sizeClass = sizeClasses[size];
  const IconComponent = icons[type] || icons['locked'];

  return (
    <div className={className}>
      {IconComponent(sizeClass)}
    </div>
  );
}

// 뱃지 ID를 아이콘 타입으로 매핑
export function getBadgeIconType(badgeId: string): string {
  return icons[badgeId] ? badgeId : 'locked';
}
