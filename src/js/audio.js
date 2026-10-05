class SpaceAudioSystem {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.ambianceGain = null;
    this.thrusterOsc = null;
    this.thrusterGain = null;
    this.isMuted = true;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    this.ctx = new AudioContext();

    // Ambiance Drone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    this.ambianceGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);

    this.ambianceGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.ambianceGain);
    this.ambianceGain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();

    // Thruster rumble sound
    this.thrusterOsc = this.ctx.createOscillator();
    const thrusterFilter = this.ctx.createBiquadFilter();
    this.thrusterGain = this.ctx.createGain();

    this.thrusterOsc.type = 'sawtooth';
    this.thrusterOsc.frequency.setValueAtTime(40, this.ctx.currentTime);

    thrusterFilter.type = 'lowpass';
    thrusterFilter.frequency.setValueAtTime(120, this.ctx.currentTime);

    this.thrusterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.thrusterOsc.connect(thrusterFilter);
    thrusterFilter.connect(this.thrusterGain);
    this.thrusterGain.connect(this.ctx.destination);

    this.thrusterOsc.start();
  }

  toggle() {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted && this.ambianceGain) {
      this.ambianceGain.gain.setTargetAtTime(0.12, this.ctx.currentTime, 0.2);
    } else if (this.ambianceGain) {
      this.ambianceGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }

    return !this.isMuted;
  }

  updateThrusterSound(speedRatio) {
    if (!this.ctx || this.isMuted || !this.thrusterGain) return;
    const targetGain = Math.min(speedRatio * 0.15, 0.2);
    const targetFreq = 30 + speedRatio * 80;
    this.thrusterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    this.thrusterOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
  }

  playChime() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.3); // C6

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch(e) {}
  }

  playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  }
}

export const spaceAudio = new SpaceAudioSystem();
