import html2canvas from 'html2canvas';

export async function captureAndDownload(
  elementId: string,
  filename: string
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    alert('캡처할 영역을 찾을 수 없습니다.');
    return false;
  }

  try {
    // 캡처 전 스타일 조정 - 요소가 보이도록 보장
    const originalStyle = element.style.cssText;
    const originalPosition = element.style.position;
    const originalOpacity = element.style.opacity;

    // 캡처를 위해 요소를 확실히 보이게 함
    element.style.borderRadius = '0';
    element.style.position = 'relative';
    element.style.opacity = '1';

    // 약간의 딜레이로 스타일 적용 보장
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // 고해상도
      useCORS: true,
      allowTaint: true,
      logging: false,
      // 캡처 품질 향상
      imageTimeout: 15000,
      removeContainer: true,
    });

    // 스타일 복원
    element.style.cssText = originalStyle;
    element.style.position = originalPosition;
    element.style.opacity = originalOpacity;

    // 다운로드 - Safari/iOS 호환성 개선
    const dataUrl = canvas.toDataURL('image/png');

    // iOS Safari 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      // iOS/Safari에서는 새 탭에서 이미지 열기
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`
          <html>
            <head>
              <title>${filename}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f3f4f6; }
                img { max-width: 100%; height: auto; }
                .info { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; padding: 15px; background: rgba(0,0,0,0.8); color: white; font-family: -apple-system, sans-serif; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="${filename}" />
              <div class="info">
                이미지를 길게 눌러 저장하세요!<br/>
                <small>(또는 우클릭 → 이미지 저장)</small>
              </div>
            </body>
          </html>
        `);
        newTab.document.close();
      } else {
        alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
        return false;
      }
    } else {
      // 다른 브라우저에서는 일반 다운로드
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      // DOM에 추가 후 클릭 (일부 브라우저 호환성)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return true;
  } catch (error) {
    console.error('Failed to capture:', error);
    alert('이미지 캡처에 실패했습니다. 다시 시도해주세요.');
    return false;
  }
}

export async function captureAndShare(
  elementId: string,
  title: string,
  text: string
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return false;
  }

  try {
    // 캡처 전 스타일 조정
    const originalStyle = element.style.cssText;
    element.style.borderRadius = '0';
    element.style.position = 'relative';
    element.style.opacity = '1';

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
    });

    // 스타일 복원
    element.style.cssText = originalStyle;

    // Canvas to Blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });

    // Web Share API with file
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], 'result.png', { type: 'image/png' });
      const shareData = {
        title,
        text,
        files: [file],
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    }

    // Fallback: download with better compatibility
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'result.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Failed to share:', error);
    }
    return false;
  }
}
