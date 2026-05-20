// 8-bit procedural sound generation using Web Audio API

class AudioSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private getCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playHover() {
    this.playTone(440, 'square', 0.05, 0.02);
  }

  playClick() {
    this.playTone(880, 'square', 0.1, 0.05);
  }

  playSuccess() {
    const ctx = this.getCtx();
    this.playTone(523.25, 'square', 0.1, 0.05);
    setTimeout(() => this.playTone(659.25, 'square', 0.1, 0.05), 100);
    setTimeout(() => this.playTone(783.99, 'square', 0.3, 0.05), 200);
  }

  playError() {
    this.playTone(110, 'sawtooth', 0.3, 0.1);
  }

  playDecrypt() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const duration = 1.5;
    const interval = 0.1;
    
    for (let i = 0; i < duration / interval; i++) {
      setTimeout(() => {
        this.playTone(Math.random() * 1000 + 200, 'sawtooth', 0.05, 0.02);
      }, i * interval * 1000);
    }
  }
}

export const audio = new AudioSystem();
