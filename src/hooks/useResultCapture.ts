import html2canvas from 'html2canvas';

export async function captureAndDownload(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    // 캡처 전 스타일 조정
    const originalStyle = element.style.cssText;
    element.style.borderRadius = '0';

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // 고해상도
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    // 스타일 복원
    element.style.cssText = originalStyle;

    // 다운로드
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to capture:', error);
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
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

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

    // Fallback: download
    const link = document.createElement('a');
    link.download = 'result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Failed to share:', error);
    }
    return false;
  }
}
