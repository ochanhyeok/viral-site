import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;

    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        isLoaded.current = true;
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  // AdSense가 설정되지 않았으면 빈 공간 표시 (개발용)
  const isAdSenseEnabled = false; // AdSense 승인 후 true로 변경

  if (!isAdSenseEnabled) {
    return (
      <div className={`bg-gray-100 rounded-2xl p-4 text-center text-gray-400 text-sm ${className}`}>
        <p>광고 영역</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_ADSENSE_ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
