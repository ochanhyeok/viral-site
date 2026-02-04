import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  description: string;
  url?: string;
}

export function ShareButtons({ title, description, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${title}\n${description}`);
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank');
  };

  const handleKakaoShare = () => {
    if (window.Kakao && window.Kakao.Share) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl: `${window.location.origin}/og-image.png`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '결과 보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      alert('카카오 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={handleKakaoShare}
        className="flex items-center gap-2 px-5 py-3 bg-[#FEE500] text-[#3C1E1E] rounded-xl font-medium hover:bg-[#F5DC00] transition-all shadow-md hover:shadow-lg"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.53 1.62 4.74 4.04 6.02-.18.65-.64 2.33-.73 2.69-.12.45.16.44.34.32.14-.1 2.19-1.48 3.1-2.08.41.06.83.09 1.25.09 5.52 0 10-3.48 10-7.04S17.52 3 12 3z"/>
        </svg>
        카카오톡 공유
      </button>

      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X 공유
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all shadow-md hover:shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {copied ? '복사됨!' : '링크 복사'}
      </button>
    </div>
  );
}

declare global {
  interface Window {
    Kakao: {
      Share: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}
