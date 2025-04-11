// import confetti from 'canvas-confetti';

// export function createConfettiAnimation() {
//   return confetti({
//     particleCount: 300,
//     spread: 150,
//     origin: { y: 0.8 },
//     colors: ['#FF69B4', '#9370DB', '#BA55D3', '#FF1493', '#DDA0DD'],
//     ticks: 150,
//     startVelocity: 30,
//     shapes: ['circle', 'square'],
//     zIndex: 1,
//     scalar: 1.2,
//     disableForReducedMotion: true
//   });
// }

// export function runStackedConfetti(onComplete: () => void) {
//   const animation = createConfettiAnimation();
//   if (animation) {
//     animation.then(onComplete);
//   }
// }

export function createNeonAnimation(element: HTMLElement) {
  element.style.animation = 'none';
  element.offsetHeight; // Trigger reflow
  element.style.animation = 'neonPulse 2s ease-in-out';
  element.style.textShadow = '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #a855f7, 0 0 82px #a855f7, 0 0 92px #a855f7';
  element.style.color = '#f3f4f6';
  
  setTimeout(() => {
    element.style.textShadow = '';
    element.style.color = '';
  }, 5000);
}