class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private initialized = false;
  private muted = false;

  initialize() {
    if (this.initialized || typeof window === 'undefined') return;
    
    // Create sound effects using Web Audio API
    this.createBeepSound('scan-start');
    this.createBeepSound('vulnerability-found', 800, 0.3);
    this.createBeepSound('critical-alert', 400, 0.5);
    this.createBeepSound('exploit-success', 1200, 0.4);
    this.createBeepSound('exploit-fail', 200, 0.3);
    this.createBeepSound('typing', 1000, 0.05);
    
    this.initialized = true;
  }

  private createBeepSound(name: string, frequency = 600, volume = 0.2) {
    // We'll use a data URL for simple beep sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    // Store a function to recreate the sound
    const audio = new Audio();
    this.sounds.set(name, audio);
  }

  play(soundName: string) {
    if (this.muted || typeof window === 'undefined') return;
    
    try {
      // Create new audio context for each play
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      let frequency = 600;
      let volume = 0.2;
      let duration = 0.3;
      
      switch (soundName) {
        case 'scan-start':
          frequency = 600;
          volume = 0.3;
          duration = 0.5;
          break;
        case 'vulnerability-found':
          frequency = 800;
          volume = 0.3;
          duration = 0.2;
          break;
        case 'critical-alert':
          frequency = 400;
          volume = 0.5;
          duration = 0.8;
          break;
        case 'exploit-success':
          frequency = 1200;
          volume = 0.4;
          duration = 0.4;
          break;
        case 'exploit-fail':
          frequency = 200;
          volume = 0.3;
          duration = 0.5;
          break;
        case 'typing':
          frequency = 1000;
          volume = 0.05;
          duration = 0.05;
          break;
      }
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  playSequence(sounds: Array<{ name: string; delay: number }>) {
    sounds.forEach(({ name, delay }) => {
      setTimeout(() => this.play(name), delay);
    });
  }

  toggle() {
    this.muted = !this.muted;
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }
}

export const audioManager = new AudioManager();
