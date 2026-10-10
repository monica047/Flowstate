/**
 * Web Audio API synthesized sound generator for Flowstate.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playSessionCompleteSound(volume = 0.7) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), now);
    masterGain.connect(ctx.destination);

    // Warm resonant bell chord
    const freqs = [698.46, 880.0, 1046.5, 1318.5];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      noteGain.gain.setValueAtTime(0, now + i * 0.08);
      noteGain.gain.linearRampToValueAtTime(0.3, now + i * 0.08 + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 2.5);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 2.6);
    });
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

export function playXpRewardSound(volume = 0.7) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.35)), now);
    masterGain.connect(ctx.destination);

    const notes = [523.25, 587.33, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.95);
    });
  } catch (err) {
    console.warn('XP Sound error:', err);
  }
}

export function playLevelUpSound(volume = 0.7) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.45)), now);
    masterGain.connect(ctx.destination);

    const fanfare = [
      { f: 392.0, t: 0.0, d: 0.15 },
      { f: 523.25, t: 0.14, d: 0.15 },
      { f: 659.25, t: 0.28, d: 0.15 },
      { f: 783.99, t: 0.42, d: 0.3 },
      { f: 1046.5, t: 0.72, d: 1.8 },
    ];

    fanfare.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const startTime = now + t;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.35, startTime + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + d);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + d + 0.1);
    });
  } catch (err) {
    console.warn('Level up sound error:', err);
  }
}
