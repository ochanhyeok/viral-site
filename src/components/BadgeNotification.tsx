import { useEffect, useState } from 'react';
import type { BadgeDefinition } from '../data/badges';
import { rarityColors, rarityNames } from '../data/badges';
import { BadgeIcon } from './BadgeIcon';

interface BadgeNotificationProps {
  badge: BadgeDefinition | null;
  onDismiss: () => void;
}

export function BadgeNotification({ badge, onDismiss }: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      // 5초 후 자동으로 닫기
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badge, onDismiss]);

  if (!badge) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onDismiss, 300);
        }}
      />

      {/* 뱃지 카드 */}
      <div
        className={`relative bg-gradient-to-br ${rarityColors[badge.rarity].gradient} rounded-3xl p-6 text-white shadow-2xl max-w-sm w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100' : 'scale-90'
        }`}
      >
        {/* 빛나는 효과 */}
        <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse" />

        <div className="relative text-center">
          {/* NEW 뱃지 */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-amber-500 rounded-full text-sm font-bold shadow-lg">
            NEW!
          </div>

          {/* 아이콘 */}
          <div className="my-4 flex justify-center">
            <div className="w-20 h-20 animate-bounce">
              <BadgeIcon type={badge.id} size="lg" className="w-full h-full [&>div]:w-full [&>div]:h-full" />
            </div>
          </div>

          {/* 타이틀 */}
          <h2 className="text-2xl font-black mb-2">뱃지 획득!</h2>
          <p className="text-xl font-bold mb-1">{badge.name}</p>
          <p className="text-white/80 text-sm mb-3">{badge.description}</p>

          {/* 레어리티 */}
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
            {rarityNames[badge.rarity]}
          </span>

          {/* 닫기 버튼 */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-all"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
