/**
 * sound.ts — Utilidad para generar sonidos procedurales.
 */
let audioCtx: AudioContext | null = null;

export const playGlupSound = async () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Es obligatorio reanudar el contexto si el navegador lo tiene suspendido
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, audioCtx.currentTime); 
  oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1); 

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
};
