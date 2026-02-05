import { toPng, toBlob } from 'html-to-image';

// 이미지 캡처 후 Blob 반환
export async function captureToBlob(elementId: string): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return null;
  }

  try {
    // 스크롤 위치 저장
    const scrollY = window.scrollY;

    // 요소의 위치로 스크롤 (캡처 정확도 향상)
    element.scrollIntoView({ block: 'center' });

    await new Promise(resolve => setTimeout(resolve, 100));

    const blob = await toBlob(element, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      // oklch 색상 무시하고 캡처
      filter: (node) => {
        // script, style 태그 제외
        if (node instanceof HTMLElement) {
          const tagName = node.tagName?.toLowerCase();
          if (tagName === 'script' || tagName === 'noscript') {
            return false;
          }
        }
        return true;
      },
    });

    // 스크롤 복원
    window.scrollTo(0, scrollY);

    return blob;
  } catch (error) {
    console.error('Failed to capture:', error);
    return null;
  }
}

// 이미지 캡처 후 Data URL 반환
export async function captureToDataUrl(elementId: string): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return null;
  }

  try {
    const scrollY = window.scrollY;
    element.scrollIntoView({ block: 'center' });

    await new Promise(resolve => setTimeout(resolve, 100));

    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      filter: (node) => {
        if (node instanceof HTMLElement) {
          const tagName = node.tagName?.toLowerCase();
          if (tagName === 'script' || tagName === 'noscript') {
            return false;
          }
        }
        return true;
      },
    });

    window.scrollTo(0, scrollY);

    return dataUrl;
  } catch (error) {
    console.error('Failed to capture:', error);
    return null;
  }
}

// 다운로드 시도 (데스크톱용)
export function downloadDataUrl(dataUrl: string, filename: string): boolean {
  try {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
}

// 레거시 함수 - 호환성 유지
export async function captureAndDownload(
  elementId: string,
  filename: string
): Promise<boolean> {
  const dataUrl = await captureToDataUrl(elementId);
  if (!dataUrl) {
    return false;
  }
  return downloadDataUrl(dataUrl, filename);
}

export async function captureAndShare(
  elementId: string,
  title: string,
  text: string
): Promise<boolean> {
  const blob = await captureToBlob(elementId);
  if (!blob) {
    return false;
  }

  try {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], 'result.png', { type: 'image/png' });
      const shareData = { title, text, files: [file] };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    }
    return false;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Failed to share:', error);
    }
    return false;
  }
}
