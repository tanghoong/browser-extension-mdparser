/**
 * Phase 6: Dark Mode Module
 * Handles dark/light theme toggling with system preference detection
 */

window.DarkModeManager = {
  isDarkMode: false,
  themeKey: 'md-parser-theme',
  
  init() {
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem(this.themeKey);
    
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Detect system preference
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Apply theme
    this.applyTheme();
    
    // Create toggle button
    this.createToggleButton();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.themeKey)) {
        this.isDarkMode = e.matches;
        this.applyTheme();
        this.updateButton();
      }
    });
  },
  
  createToggleButton() {
    const btn = document.createElement('button');
    btn.className = 'dark-mode-toggle';
    btn.title = 'Toggle dark/light mode';
    const iconHTML = this.isDarkMode 
      ? (window.SVGIcons ? window.SVGIcons.getHTML('sun') : '☀️')
      : (window.SVGIcons ? window.SVGIcons.getHTML('moon') : '🌙');
    btn.innerHTML = iconHTML;
    
    btn.addEventListener('click', () => this.toggle());
    
    document.body.appendChild(btn);
  },
  
  toggle() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(this.themeKey, this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
    this.updateButton();
    // Notify toolbar of theme change
    if (window.ToolbarManager) {
      window.ToolbarManager.updateThemeIcon();
    }
  },
  
  applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  },
  
  updateButton() {
    const btn = document.querySelector('.dark-mode-toggle');
    if (btn) {
      const iconHTML = this.isDarkMode 
        ? (window.SVGIcons ? window.SVGIcons.getHTML('sun') : '☀️')
        : (window.SVGIcons ? window.SVGIcons.getHTML('moon') : '🌙');
      btn.innerHTML = iconHTML;
      btn.title = this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
};

/**
 * Phase 6: Document Search Module
 * Provides in-document search with highlighting
 */

window.DocumentSearchManager = {
  isActive: false,
  currentIndex: -1,
  matches: [],
  searchOverlay: null,
  
  init() {
    this.createSearchButton();
    this.setupKeyboardShortcut();
  },
  
  createSearchButton() {
    const btn = document.createElement('button');
    btn.className = 'document-search-btn';
    btn.innerHTML = window.SVGIcons ? window.SVGIcons.getHTML('search') : '🔍';
    btn.title = 'Search in document (Ctrl+F)';
    
    btn.addEventListener('click', () => this.open());
    
    document.body.appendChild(btn);
  },
  
  setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        this.open();
      }
      
      // ESC to close
      if (e.key === 'Escape' && this.isActive) {
        this.close();
      }
    });
  },
  
  open() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.createSearchOverlay();
    
    // Focus search input
    setTimeout(() => {
      const input = this.searchOverlay.querySelector('.search-input');
      if (input) input.focus();
    }, 100);
  },
  
  createSearchOverlay() {
    this.searchOverlay = document.createElement('div');
    this.searchOverlay.className = 'search-overlay';
    this.searchOverlay.innerHTML = `
      <div class="search-box">
        <input type="text" class="search-input" placeholder="Search in document...">
        <div class="search-controls">
          <button class="search-nav-btn" data-dir="prev" title="Previous (Shift+Enter)">▲</button>
          <button class="search-nav-btn" data-dir="next" title="Next (Enter)">▼</button>
          <span class="search-counter">0 of 0</span>
          <button class="search-close-btn" title="Close (ESC)">✕</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.searchOverlay);
    
    const input = this.searchOverlay.querySelector('.search-input');
    const prevBtn = this.searchOverlay.querySelector('[data-dir="prev"]');
    const nextBtn = this.searchOverlay.querySelector('[data-dir="next"]');
    const closeBtn = this.searchOverlay.querySelector('.search-close-btn');
    
    input.addEventListener('input', (e) => this.search(e.target.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.navigatePrevious();
        } else {
          this.navigateNext();
        }
      }
    });
    
    prevBtn.addEventListener('click', () => this.navigatePrevious());
    nextBtn.addEventListener('click', () => this.navigateNext());
    closeBtn.addEventListener('click', () => this.close());
  },
  
  search(query) {
    // Clear previous highlights
    this.clearHighlights();
    this.matches = [];
    this.currentIndex = -1;
    
    if (!query || query.length < 2) {
      this.updateCounter();
      return;
    }
    
    const container = document.querySelector('.md-parser-container');
    if (!container) return;
    
    // Search and highlight
    this.highlightText(container, query);
    
    // Update counter and navigate to first match
    this.updateCounter();
    if (this.matches.length > 0) {
      this.currentIndex = 0;
      this.focusMatch();
    }
  },
  
  highlightText(node, query) {
    const regex = new RegExp(this.escapeRegex(query), 'gi');
    
    const walk = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script, style, and already highlighted nodes
          if (node.parentElement.closest('script, style, .search-highlight')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    const nodesToReplace = [];
    let currentNode;
    
    while (currentNode = walk.nextNode()) {
      if (regex.test(currentNode.textContent)) {
        nodesToReplace.push(currentNode);
      }
    }
    
    nodesToReplace.forEach(textNode => {
      const parent = textNode.parentNode;
      const text = textNode.textContent;
      const fragment = document.createDocumentFragment();
      
      let lastIndex = 0;
      let match;
      regex.lastIndex = 0;
      
      while (match = regex.exec(text)) {
        // Add text before match
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        
        // Add highlighted match
        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = match[0];
        fragment.appendChild(span);
        this.matches.push(span);
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      
      parent.replaceChild(fragment, textNode);
    });
  },
  
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },
  
  clearHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(span => {
      const text = document.createTextNode(span.textContent);
      span.parentNode.replaceChild(text, span);
    });
    
    // Normalize text nodes
    const container = document.querySelector('.md-parser-container');
    if (container) {
      container.normalize();
    }
  },
  
  navigateNext() {
    if (this.matches.length === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.matches.length;
    this.focusMatch();
  },
  
  navigatePrevious() {
    if (this.matches.length === 0) return;
    
    this.currentIndex = (this.currentIndex - 1 + this.matches.length) % this.matches.length;
    this.focusMatch();
  },
  
  focusMatch() {
    // Remove active class from all
    this.matches.forEach(m => m.classList.remove('search-highlight-active'));
    
    // Add active class to current
    if (this.currentIndex >= 0 && this.currentIndex < this.matches.length) {
      const match = this.matches[this.currentIndex];
      match.classList.add('search-highlight-active');
      
      // Scroll into view
      match.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    this.updateCounter();
  },
  
  updateCounter() {
    const counter = this.searchOverlay?.querySelector('.search-counter');
    if (counter) {
      if (this.matches.length === 0) {
        counter.textContent = '0 of 0';
      } else {
        counter.textContent = `${this.currentIndex + 1} of ${this.matches.length}`;
      }
    }
  },
  
  close() {
    this.isActive = false;
    this.clearHighlights();
    
    if (this.searchOverlay) {
      this.searchOverlay.remove();
      this.searchOverlay = null;
    }
    
    this.matches = [];
    this.currentIndex = -1;
  }
};

/**
 * Phase 6: Reading Progress Tracker
 * Shows reading progress and estimated time
 */

window.ReadingProgressManager = {
  progressBar: null,
  statsPanel: null,
  observer: null,
  
  init() {
    this.createProgressBar();
    this.createStatsPanel();
    this.setupScrollTracking();
    this.calculateReadingTime();
  },
  
  createProgressBar() {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'reading-progress-bar';
    this.progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(this.progressBar);
  },
  
  createStatsPanel() {
    this.statsPanel = document.createElement('div');
    this.statsPanel.className = 'reading-stats-panel';
    const iconHTML = window.SVGIcons ? window.SVGIcons.getHTML('chart') : '📊';
    this.statsPanel.innerHTML = `
      <div class="reading-stats-toggle" title="Reading stats">${iconHTML}</div>
      <div class="reading-stats-content">
        <div class="stat-item">
          <span class="stat-label">Progress:</span>
          <span class="stat-value" data-stat="progress">0%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Words:</span>
          <span class="stat-value" data-stat="words">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Reading Time:</span>
          <span class="stat-value" data-stat="time">0 min</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Characters:</span>
          <span class="stat-value" data-stat="chars">0</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.statsPanel);
    
    const toggle = this.statsPanel.querySelector('.reading-stats-toggle');
    toggle.addEventListener('click', () => {
      this.statsPanel.classList.toggle('expanded');
    });
  },
  
  setupScrollTracking() {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
      
      const fill = this.progressBar?.querySelector('.reading-progress-fill');
      const progressValue = this.statsPanel?.querySelector('[data-stat="progress"]');
      
      if (fill) {
        fill.style.width = progress + '%';
      }
      
      if (progressValue) {
        progressValue.textContent = Math.round(progress) + '%';
      }
    };
    
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    
    updateProgress();
  },
  
  calculateReadingTime() {
    const container = document.querySelector('.md-parser-container');
    if (!container) return;
    
    const text = container.textContent || '';
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    
    // Average reading speed: 200-250 words per minute
    const readingSpeed = 225;
    const minutes = Math.ceil(words / readingSpeed);
    
    const wordsValue = this.statsPanel?.querySelector('[data-stat="words"]');
    const timeValue = this.statsPanel?.querySelector('[data-stat="time"]');
    const charsValue = this.statsPanel?.querySelector('[data-stat="chars"]');
    
    if (wordsValue) wordsValue.textContent = words.toLocaleString();
    if (charsValue) charsValue.textContent = chars.toLocaleString();
    
    if (timeValue) {
      if (minutes < 1) {
        timeValue.textContent = '< 1 min';
      } else if (minutes === 1) {
        timeValue.textContent = '1 min';
      } else {
        timeValue.textContent = minutes + ' min';
      }
    }
  }
};
