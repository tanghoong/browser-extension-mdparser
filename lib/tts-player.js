/**
 * Text-to-Speech (TTS) Player Module
 * Provides text-to-speech functionality with controls
 */

window.TTSManager = {
  isPlaying: false,
  isPaused: false,
  currentUtterance: null,
  currentPosition: 0,
  text: '',
  panel: null,
  synthesis: null,
  
  init() {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech not supported in this browser');
      return false;
    }
    
    this.synthesis = window.speechSynthesis;
    this.extractText();
    this.createPanel();
    return true;
  },
  
  extractText() {
    const container = document.querySelector('.md-parser-container');
    if (!container) return;
    
    // Clone and remove code blocks and other non-readable elements
    const clone = container.cloneNode(true);
    clone.querySelectorAll('pre, code, script, style, .mermaid-wrapper').forEach(el => el.remove());
    
    this.text = clone.textContent.trim();
  },
  
  createPanel() {
    this.panel = document.createElement('div');
    this.panel.className = 'tts-panel';
    this.panel.innerHTML = `
      <div class="tts-controls">
        <button class="tts-btn tts-play" title="Play" aria-label="Play">
          ${window.SVGIcons ? window.SVGIcons.getHTML('play') : '▶'}
        </button>
        <button class="tts-btn tts-pause" title="Pause" aria-label="Pause" disabled>
          ${window.SVGIcons ? window.SVGIcons.getHTML('pause') : '⏸'}
        </button>
        <button class="tts-btn tts-stop" title="Stop" aria-label="Stop" disabled>
          ${window.SVGIcons ? window.SVGIcons.getHTML('stop') : '⏹'}
        </button>
        <div class="tts-divider"></div>
        <div class="tts-rate-control">
          <label for="tts-rate" class="tts-label">Speed:</label>
          <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1" class="tts-slider">
          <span class="tts-rate-value">1.0x</span>
        </div>
        <button class="tts-close" title="Close" aria-label="Close TTS Player">
          ${window.SVGIcons ? window.SVGIcons.getHTML('close') : '×'}
        </button>
      </div>
      <div class="tts-status">Ready to read</div>
    `;
    
    document.body.appendChild(this.panel);
    this.attachEventListeners();
  },
  
  attachEventListeners() {
    const playBtn = this.panel.querySelector('.tts-play');
    const pauseBtn = this.panel.querySelector('.tts-pause');
    const stopBtn = this.panel.querySelector('.tts-stop');
    const closeBtn = this.panel.querySelector('.tts-close');
    const rateSlider = this.panel.querySelector('#tts-rate');
    const rateValue = this.panel.querySelector('.tts-rate-value');
    
    playBtn.addEventListener('click', () => this.play());
    pauseBtn.addEventListener('click', () => this.pause());
    stopBtn.addEventListener('click', () => this.stop());
    closeBtn.addEventListener('click', () => this.toggle());
    
    rateSlider.addEventListener('input', (e) => {
      const rate = parseFloat(e.target.value);
      rateValue.textContent = rate.toFixed(1) + 'x';
      if (this.currentUtterance) {
        // Restart with new rate
        const wasPlaying = this.isPlaying && !this.isPaused;
        this.stop();
        if (wasPlaying) {
          setTimeout(() => this.play(), 100);
        }
      }
    });
  },
  
  play() {
    if (this.isPaused && this.currentUtterance) {
      // Resume
      this.synthesis.resume();
      this.isPaused = false;
      this.updateStatus('Playing...');
      this.updateButtons();
      return;
    }
    
    // Start new
    if (this.isPlaying) {
      this.stop();
    }
    
    // Check if synthesis is available
    if (!this.synthesis || !window.speechSynthesis) {
      this.updateStatus('Error: TTS not supported');
      return;
    }
    
    // Wait for voices to be loaded
    let voices = this.synthesis.getVoices();
    if (voices.length === 0) {
      // Some browsers need a moment to load voices
      this.updateStatus('Loading voices...');
      setTimeout(() => this.play(), 200);
      return;
    }
    
    this.currentUtterance = new SpeechSynthesisUtterance(this.text);
    const rate = parseFloat(this.panel.querySelector('#tts-rate').value);
    this.currentUtterance.rate = rate;
    this.currentUtterance.pitch = 1;
    this.currentUtterance.volume = 1;
    
    // Select a default voice (prefer English)
    const defaultVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (defaultVoice) {
      this.currentUtterance.voice = defaultVoice;
    }
    
    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      this.updateStatus('Playing...');
      this.updateButtons();
    };
    
    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.updateStatus('Finished reading');
      this.updateButtons();
    };
    
    this.currentUtterance.onerror = (event) => {
      // Handle specific error types
      const errorType = event.error || 'unknown';
      console.error('TTS Error:', errorType, event);
      
      // Don't show error for 'interrupted' (normal when stopping)
      if (errorType === 'interrupted' || errorType === 'canceled') {
        this.updateStatus('Stopped');
      } else if (errorType === 'not-allowed') {
        this.updateStatus('Error: Audio not allowed');
      } else if (errorType === 'network') {
        this.updateStatus('Error: Network issue');
      } else {
        this.updateStatus('Error: ' + errorType);
      }
      
      this.isPlaying = false;
      this.isPaused = false;
      this.updateButtons();
    };
    
    this.synthesis.speak(this.currentUtterance);
  },
  
  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.synthesis.pause();
      this.isPaused = true;
      this.updateStatus('Paused');
      this.updateButtons();
    }
  },
  
  stop() {
    this.synthesis.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.updateStatus('Stopped');
    this.updateButtons();
  },
  
  toggle() {
    if (this.panel) {
      this.panel.classList.toggle('tts-visible');
    }
  },
  
  updateStatus(message) {
    const status = this.panel?.querySelector('.tts-status');
    if (status) {
      status.textContent = message;
    }
  },
  
  updateButtons() {
    const playBtn = this.panel?.querySelector('.tts-play');
    const pauseBtn = this.panel?.querySelector('.tts-pause');
    const stopBtn = this.panel?.querySelector('.tts-stop');
    
    if (this.isPlaying && !this.isPaused) {
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
    } else if (this.isPaused) {
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = false;
    } else {
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
    }
  }
};
