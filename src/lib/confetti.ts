import confetti from 'canvas-confetti';

export function createConfettiAnimation() {
  return confetti({
    particleCount: 300,
    spread: 150,
    origin: { y: 0.8 },
    colors: ['#FF69B4', '#9370DB', '#BA55D3', '#FF1493', '#DDA0DD'],
    ticks: 150,
    startVelocity: 30,
    shapes: ['circle', 'square'],
    zIndex: 1,
    scalar: 1.2,
    disableForReducedMotion: true
  });
}

export function runStackedConfetti(onComplete: () => void) {
  const animation = createConfettiAnimation();
  if (animation) {
    animation.then(onComplete);
  }
}