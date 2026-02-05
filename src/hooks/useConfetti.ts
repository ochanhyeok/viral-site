import confetti from 'canvas-confetti';

export function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // 왼쪽에서 발사
  const fireLeft = () => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
  };

  // 오른쪽에서 발사
  const fireRight = () => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  };

  // 연속 발사
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }
    fireLeft();
    fireRight();
  }, 250);

  // 첫 발사
  fireLeft();
  fireRight();

  // 중앙 폭발
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
    });
  }, 500);
}

export function fireStars() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
  };

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle'],
    });
  };

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}
