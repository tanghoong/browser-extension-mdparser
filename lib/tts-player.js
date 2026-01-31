/**
 * Text-to-Speech (TTS) Player Module
 * iOS Dynamic Island inspired design with smart text extraction
 */

window.TTSManager = {
  isPlaying: false,
  isPaused: false,
  currentUtterance: null,
  currentPosition: 0,
  text: '',
  panel: null,
  synthesis: null,
  selectedVoice: null,
  
  init() {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech not supported in this browser');
      return false;
    }
    
    this.synthesis = window.speechSynthesis;
    this.extractText();
    this.createPanel();
    this.setupPageUnloadHandler();
    this.loadVoices();
    return true;
  },
  
  // Stop TTS when page is reloaded or closed
  setupPageUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      this.stop();
    });
    
    window.addEventListener('pagehide', () => {
      this.stop();
    });
  },
  
  // Load voices and prefer female English voice
  loadVoices() {
    const setVoice = () => {
      const voices = this.synthesis.getVoices();
      if (voices.length === 0) return;
      
      // Prefer female English voices (common female voice names)
      const femaleKeywords = ['female', 'woman', 'samantha', 'karen', 'moira', 'tessa', 'fiona', 'victoria', 'zira', 'hazel', 'susan', 'linda', 'catherine', 'allison', 'ava', 'nicky', 'siri'];
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      
      // Try to find a female voice
      this.selectedVoice = englishVoices.find(v => 
        femaleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
      );
      
      // Fallback to any English voice with higher pitch
      if (!this.selectedVoice) {
        this.selectedVoice = englishVoices.find(v => v.name.includes('Google')) || 
                            englishVoices[0] || 
                            voices[0];
      }
    };
    
    // Load voices (may be async in some browsers)
    setVoice();
    this.synthesis.onvoiceschanged = setVoice;
  },
  
  extractText() {
    const container = document.querySelector('.md-parser-container');
    if (!container) return;
    
    // Only extract headings and paragraphs (skip code, emoji, etc.)
    const readableElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote, td, th');
    
    const textParts = [];
    readableElements.forEach(el => {
      // Skip elements inside code blocks or mermaid
      if (el.closest('pre') || el.closest('code') || el.closest('.mermaid-wrapper') || el.closest('.code-block-wrapper')) {
        return;
      }
      
      let text = el.textContent.trim();
      
      // Remove emoji (Unicode emoji ranges)
      text = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '');
      
      // Remove special characters that don't read well
      text = text.replace(/[#*`~|<>{}\[\]]/g, '');
      
      // Clean up extra whitespace
      text = text.replace(/\s+/g, ' ').trim();
      
      if (text.length > 0) {
        // Add pause after headings
        if (el.tagName.match(/^H[1-6]$/)) {
          textParts.push(text + '.');
        } else {
          textParts.push(text);
        }
      }
    });
    
    this.text = textParts.join(' ');
  },
  
  createPanel() {
    this.panel = document.createElement('div');
    this.panel.className = 'tts-panel';
    this.panel.innerHTML = `
      <div class="tts-island">
        <div class="tts-island-left">
          <div class="tts-waveform">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <div class="tts-info">
            <div class="tts-title">Text-to-Speech</div>
            <div class="tts-status">Ready</div>
          </div>
        </div>
        <div class="tts-island-controls">
          <button class="tts-btn tts-play" title="Play" aria-label="Play">
            ${window.SVGIcons ? window.SVGIcons.getHTML('play') : '▶'}
          </button>
          <button class="tts-btn tts-pause" title="Pause" aria-label="Pause" style="display:none;">
            ${window.SVGIcons ? window.SVGIcons.getHTML('pause') : '⏸'}
          </button>
          <button class="tts-btn tts-stop" title="Stop" aria-label="Stop">
            ${window.SVGIcons ? window.SVGIcons.getHTML('stop') : '⏹'}
          </button>
        </div>
        <div class="tts-island-right">
          <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1" class="tts-slider" title="Speed">
          <span class="tts-rate-value">1×</span>
          <button class="tts-close" title="Close" aria-label="Close">
            ${window.SVGIcons ? window.SVGIcons.getHTML('close') : '×'}
          </button>
        </div>
      </div>
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
      rateValue.textContent = rate.toFixed(1) + '×';
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
    this.currentUtterance.pitch = 1.1; // Slightly higher pitch for more natural female voice
    this.currentUtterance.volume = 1;
    
    // Use pre-selected female voice
    if (this.selectedVoice) {
      this.currentUtterance.voice = this.selectedVoice;
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
    const waveform = this.panel?.querySelector('.tts-waveform');
    
    if (this.isPlaying && !this.isPaused) {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-flex';
      waveform?.classList.add('playing');
    } else {
      playBtn.style.display = 'inline-flex';
      pauseBtn.style.display = 'none';
      waveform?.classList.remove('playing');
    }
  }
};
