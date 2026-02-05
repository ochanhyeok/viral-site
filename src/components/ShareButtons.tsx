import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  description: string;
  url?: string;
}

export function ShareButtons({ title, description, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${title}\n${description}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank');
  };

  const handleKakaoShare = () => {
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(kakaoUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {/* 네이티브 공유 (모바일) */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        공유하기
      </button>

      {/* 카카오스토리 */}
      <button
        onClick={handleKakaoShare}
        className="flex items-center gap-2 px-5 py-3 bg-[#FEE500] text-[#3C1E1E] rounded-2xl font-semibold hover:bg-[#F5DC00] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.53 1.62 4.74 4.04 6.02-.18.65-.64 2.33-.73 2.69-.12.45.16.44.34.32.14-.1 2.19-1.48 3.1-2.08.41.06.83.09 1.25.09 5.52 0 10-3.48 10-7.04S17.52 3 12 3z"/>
        </svg>
        카카오
      </button>

      {/* X (트위터) */}
      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </button>

      {/* 링크 복사 */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {copied ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            복사됨!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            링크 복사
          </>
        )}
      </button>
    </div>
  );
}
