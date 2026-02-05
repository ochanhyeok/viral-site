import { useState } from 'react';
import html2canvas from 'html2canvas';
import { captureAndDownload } from '../hooks/useResultCapture';

interface ShareButtonsProps {
  title: string;
  description: string;
  url?: string;
  captureElementId?: string;
  captureFileName?: string;
}

declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons?: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}

export function ShareButtons({
  title,
  description,
  url,
  captureElementId,
  captureFileName = 'my-result'
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
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

  // 이미지 캡처 후 공유 (Web Share API Level 2)
  const handleShareWithImage = async () => {
    if (!captureElementId) {
      // 캡처 대상이 없으면 일반 공유
      handleNativeShare();
      return;
    }

    const element = document.getElementById(captureElementId);
    if (!element) {
      handleNativeShare();
      return;
    }

    setSharing(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const file = new File([blob], `${captureFileName}.png`, { type: 'image/png' });

      // Web Share API with files 지원 확인
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text: `${description}\n\n${shareUrl}`,
          files: [file],
        });
      } else {
        // 파일 공유 미지원 시 이미지 다운로드 후 안내
        await captureAndDownload(captureElementId, captureFileName);
        showNotification('이미지가 저장되었습니다! 카카오톡에서 직접 이미지를 첨부해서 공유해주세요.');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
        // 실패 시 일반 공유로 폴백
        handleNativeShare();
      }
    } finally {
      setSharing(false);
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
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description,
          imageUrl: 'https://viral-site-opal.vercel.app/og-share-v2.png',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '나도 테스트하기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
      window.open(kakaoUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleSaveImage = async () => {
    if (!captureElementId) return;
    setCapturing(true);
    try {
      const success = await captureAndDownload(captureElementId, captureFileName);
      if (success) {
        // iOS/Safari가 아닌 경우에만 토스트 표시 (새 탭이 열리면 안내 문구가 거기에 있음)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (!isIOS && !isSafari) {
          showNotification('이미지가 저장되었습니다!');
        }
      }
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* 결과 이미지 공유 버튼 (메인) */}
      {captureElementId && (
        <button
          onClick={handleShareWithImage}
          disabled={sharing}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-2xl font-bold text-lg hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
        >
          {sharing ? (
            <>
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>공유 준비 중...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>내 결과 이미지로 공유하기</span>
            </>
          )}
        </button>
      )}

      {/* 안내 문구 */}
      {captureElementId && (
        <p className="text-center text-xs text-gray-400">
          모바일에서 카톡/인스타 등으로 바로 공유돼요!
        </p>
      )}

      {/* 기타 공유 옵션 */}
      <div className="grid grid-cols-4 gap-2">
        {/* 이미지 저장 */}
        {captureElementId && (
          <button
            onClick={handleSaveImage}
            disabled={capturing}
            className="flex flex-col items-center justify-center gap-1 px-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            {capturing ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            <span>저장</span>
          </button>
        )}

        {/* 카카오톡 */}
        <button
          onClick={handleKakaoShare}
          className="flex flex-col items-center justify-center gap-1 px-2 py-3 bg-[#FEE500] text-[#191919] rounded-xl font-medium hover:bg-[#F5DC00] transition-all active:scale-95 text-xs"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.53 1.62 4.74 4.04 6.02-.18.65-.64 2.33-.73 2.69-.12.45.16.44.34.32.14-.1 2.19-1.48 3.1-2.08.41.06.83.09 1.25.09 5.52 0 10-3.48 10-7.04S17.52 3 12 3z"/>
          </svg>
          <span>카톡</span>
        </button>

        {/* X */}
        <button
          onClick={handleTwitterShare}
          className="flex flex-col items-center justify-center gap-1 px-2 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95 text-xs"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X</span>
        </button>

        {/* 링크 복사 */}
        <button
          onClick={handleCopyLink}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl font-medium transition-all active:scale-95 text-xs ${
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
              <span>완료!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>링크</span>
            </>
          )}
        </button>
      </div>

      {/* 카카오톡 이미지 공유 팁 */}
      {captureElementId && (
        <p className="text-center text-xs text-gray-400 pt-1">
          카카오톡에 내 결과 이미지를 보내려면<br />
          <span className="text-violet-500 font-medium">"내 결과 이미지로 공유하기"</span> 버튼을 눌러주세요!
        </p>
      )}

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          showToast
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-lg max-w-xs text-center">
          <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      </div>
    </div>
  );
}
