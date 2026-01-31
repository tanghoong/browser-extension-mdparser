/**
 * Unified Toolbar Controls
 * Groups all main controls in a clean, compact toolbar (top-right corner)
 * Using shadcn/ui inspired design
 */

window.ToolbarManager = {
  toolbar: null,
  
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
    
    // Presentation Mode button (only show if slides detected)
    const presentationBtn = document.querySelector('.presentation-mode-btn');
    if (presentationBtn) {
      const btn = this.createToolbarButton(
        'presentation',
        'Presentation Mode',
        () => window.PresentationManager?.enterPresentationMode()
      );
      buttonGroup.appendChild(btn);
      // Hide the old floating button
      presentationBtn.style.display = 'none';
    }
    
    // TTS Player button (placeholder for now)
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
      // Hide the old floating button
      darkModeBtn.style.display = 'none';
    }
    
    // Search button
    const searchBtn = document.querySelector('.document-search-btn');
    if (searchBtn) {
      const btn = this.createToolbarButton(
        'search',
        'Search in Document',
        () => window.DocumentSearchManager?.open()
      );
      buttonGroup.appendChild(btn);
      // Hide the old floating button
      searchBtn.style.display = 'none';
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
