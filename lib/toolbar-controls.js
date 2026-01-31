/**
 * Unified Toolbar Controls
 * Groups all main controls in a clean, compact toolbar (top-right corner)
 * Using shadcn/ui inspired design
 */

window.ToolbarManager = {
  toolbar: null,
  isRendered: true,
  
  init() {
    this.createToolbar();
  },
  
  createToolbar() {
    // Create toolbar container
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'md-toolbar';
    this.toolbar.setAttribute('role', 'toolbar');
    this.toolbar.setAttribute('aria-label', 'Document controls');
    
    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'md-toolbar-group';
    
    // MD Logo button (first button) - shows about modal
    const logoBtn = this.createToolbarButton(
      'markdown',
      'About Markdown Parser',
      () => this.showAboutModal()
    );
    logoBtn.classList.add('md-logo-btn');
    buttonGroup.appendChild(logoBtn);
    
    // Divider
    const divider1 = document.createElement('div');
    divider1.className = 'md-toolbar-divider';
    buttonGroup.appendChild(divider1);
    
    // Rendered/Raw toggle button
    const toggleBtn = this.createToolbarButton(
      'code',
      'Toggle Raw/Rendered View',
      () => this.toggleRawView()
    );
    toggleBtn.setAttribute('data-view-toggle', 'true');
    buttonGroup.appendChild(toggleBtn);
    
    // Presentation Mode button (only show if slides detected)
    const presentationBtn = document.querySelector('.presentation-mode-btn');
    if (presentationBtn) {
      const btn = this.createToolbarButton(
        'presentation',
        'Presentation Mode (slides detected)',
        () => window.PresentationManager?.enterPresentationMode()
      );
      btn.setAttribute('data-presentation', 'true');
      buttonGroup.appendChild(btn);
      // Remove the old floating button completely
      presentationBtn.remove();
    }
    
    // TTS Player button
    const ttsBtn = this.createToolbarButton(
      'volume',
      'Text-to-Speech Player',
      () => window.TTSManager?.toggle()
    );
    ttsBtn.setAttribute('data-tts-toggle', 'true');
    buttonGroup.appendChild(ttsBtn);
    
    // Dark Mode Toggle button
    const darkModeBtn = document.querySelector('.dark-mode-toggle');
    if (darkModeBtn) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const btn = this.createToolbarButton(
        isDark ? 'sun' : 'moon',
        'Toggle Theme',
        () => window.DarkModeManager?.toggle()
      );
      btn.setAttribute('data-theme-toggle', 'true');
      buttonGroup.appendChild(btn);
      // Remove the old floating button
      darkModeBtn.remove();
    }
    
    // Search button
    const searchBtn = document.querySelector('.document-search-btn');
    if (searchBtn) {
      const btn = this.createToolbarButton(
        'search',
        'Search in Document (Ctrl+F)',
        () => window.DocumentSearchManager?.open()
      );
      buttonGroup.appendChild(btn);
      // Remove the old floating button
      searchBtn.remove();
    }
    
    // Reading Stats button
    const statsPanel = document.querySelector('.reading-stats-panel');
    if (statsPanel) {
      const btn = this.createToolbarButton(
        'chart',
        'Reading Statistics',
        () => {
          statsPanel.classList.toggle('expanded');
        }
      );
      buttonGroup.appendChild(btn);
      // Update stats panel to work with new button
      const oldToggle = statsPanel.querySelector('.reading-stats-toggle');
      if (oldToggle) {
        oldToggle.style.display = 'none';
      }
    }
    
    this.toolbar.appendChild(buttonGroup);
    document.body.appendChild(this.toolbar);
  },
  
  createToolbarButton(iconName, title, onClick) {
    const btn = document.createElement('button');
    btn.className = 'md-toolbar-btn';
    btn.setAttribute('type', 'button');
    btn.setAttribute('title', title);
    btn.setAttribute('aria-label', title);
    
    const iconHTML = window.SVGIcons ? window.SVGIcons.getHTML(iconName) : '';
    btn.innerHTML = iconHTML;
    
    if (onClick) {
      btn.addEventListener('click', onClick);
    }
    
    return btn;
  },
  
  toggleRawView() {
    this.isRendered = !this.isRendered;
    const container = document.querySelector('.md-parser-container');
    const toggleBtn = this.toolbar?.querySelector('[data-view-toggle]');
    
    if (this.isRendered) {
      // Show rendered view
      if (container) container.style.display = 'block';
      const rawPre = document.body.querySelector('pre.raw-content');
      if (rawPre) rawPre.remove();
      if (toggleBtn) {
        toggleBtn.innerHTML = window.SVGIcons ? window.SVGIcons.getHTML('code') : '';
        toggleBtn.setAttribute('title', 'View Raw Markdown');
      }
    } else {
      // Show raw view
      if (container) container.style.display = 'none';
      const rawContent = window.__mdParserRawContent || '';
      const pre = document.createElement('pre');
      pre.className = 'raw-content';
      pre.textContent = rawContent;
      document.body.appendChild(pre);
      if (toggleBtn) {
        toggleBtn.innerHTML = window.SVGIcons ? window.SVGIcons.getHTML('eye') : '';
        toggleBtn.setAttribute('title', 'View Rendered');
      }
    }
  },
  
  showAboutModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.md-about-modal');
    if (existingModal) {
      existingModal.remove();
      return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'md-about-modal';
    modal.innerHTML = `
      <div class="md-about-content">
        <div class="md-about-header">
          <div class="md-about-logo">MD</div>
          <button class="md-about-close" title="Close">&times;</button>
        </div>
        <h2>Markdown Parser</h2>
        <p class="md-about-version">Version 1.0.0</p>
        <p class="md-about-desc">A powerful browser extension that automatically detects and beautifully renders Markdown files with advanced features.</p>
        <div class="md-about-features">
          <h3>Features</h3>
          <ul>
            <li>🎨 Beautiful Markdown rendering</li>
            <li>📊 Mermaid diagram support</li>
            <li>🎭 Presentation mode</li>
            <li>🔍 Document search</li>
            <li>🌙 Dark mode</li>
            <li>🔊 Text-to-speech</li>
            <li>📑 Table of contents</li>
          </ul>
        </div>
        <div class="md-about-shortcuts">
          <h3>Keyboard Shortcuts</h3>
          <div class="shortcut-grid">
            <span class="key">Ctrl+F</span><span>Search</span>
            <span class="key">F</span><span>Fullscreen (presentation)</span>
            <span class="key">N</span><span>Toggle notes (presentation)</span>
            <span class="key">Space/→</span><span>Next slide</span>
            <span class="key">←</span><span>Previous slide</span>
            <span class="key">Esc</span><span>Exit presentation</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    modal.querySelector('.md-about-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },
  
  updateThemeIcon() {
    const themeBtn = this.toolbar?.querySelector('[data-theme-toggle]');
    if (themeBtn) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const iconHTML = window.SVGIcons ? window.SVGIcons.getHTML(isDark ? 'sun' : 'moon') : '';
      themeBtn.innerHTML = iconHTML;
      themeBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  }
};
    }
  }
};
