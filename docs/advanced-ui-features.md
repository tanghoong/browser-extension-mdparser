# Advanced UI & File Format Features

This document covers table of contents, syntax highlighting, TTS, and special file format handling.

---

## 1. Automatic Table of Contents (TOC)

### Description
Auto-generate a table of contents from markdown headings, displayed in a left sidebar with scroll tracking and smooth navigation.

### User Story
As a user, I want to quickly navigate long markdown documents using an interactive table of contents that tracks my current position.

### Implementation Difficulty
**Medium** - Requires DOM parsing, scroll tracking, and smooth scrolling

### Technical Details

#### 1.1 TOC Generation

**File**: `content.js`

```javascript
/**
 * Generate table of contents from headings
 */
function generateTableOfContents(container) {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  if (headings.length < 2) {
    return null; // Don't show TOC if too few headings
  }
  
  // Create TOC container
  const tocContainer = document.createElement('div');
  tocContainer.className = 'toc-container';
  tocContainer.innerHTML = `
    <div class="toc-header">
      <span class="toc-title">Table of Contents</span>
      <button class="toc-toggle" title="Toggle TOC">◀</button>
    </div>
    <nav class="toc-nav"></nav>
  `;
  
  const tocNav = tocContainer.querySelector('.toc-nav');
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  headings.forEach((heading, index) => {
    // Add ID to heading if not present
    if (!heading.id) {
      heading.id = `heading-${index}-${slugify(heading.textContent)}`;
    }
    
    const level = parseInt(heading.tagName.charAt(1));
    const listItem = document.createElement('li');
    listItem.className = `toc-item toc-level-${level}`;
    listItem.setAttribute('data-heading-id', heading.id);
    
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.className = 'toc-link';
    
    // Smooth scroll on click
    link.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update active state
      document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
    
    listItem.appendChild(link);
    tocList.appendChild(listItem);
  });
  
  tocNav.appendChild(tocList);
  
  // Toggle functionality
  const toggleBtn = tocContainer.querySelector('.toc-toggle');
  toggleBtn.addEventListener('click', () => {
    tocContainer.classList.toggle('collapsed');
    toggleBtn.textContent = tocContainer.classList.contains('collapsed') ? '▶' : '◀';
  });
  
  return tocContainer;
}

/**
 * Create URL-friendly slug from text
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Track scroll position and highlight active TOC item
 */
function setupTOCScrollTracking() {
  let isScrolling = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const tocItem = document.querySelector(`.toc-item[data-heading-id="${id}"]`);
        
        if (tocItem) {
          // Remove active from all
          document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
          
          // Add active to current
          const link = tocItem.querySelector('.toc-link');
          link.classList.add('active');
          
          // Scroll TOC to show active item
          link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px' // Trigger when heading is in top 30% of viewport
  });
  
  // Observe all headings
  const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
  headings.forEach(heading => observer.observe(heading));
}
```

**CSS Styles**:

```css
/* TOC Container */
.toc-container {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: #ffffff;
  border-right: 1px solid #e1e4e8;
  z-index: 100;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.toc-container.collapsed {
  transform: translateX(-280px);
}

.toc-header {
  padding: 16px;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.toc-title {
  font-weight: 600;
  font-size: 14px;
  color: #24292e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toc-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  color: #586069;
  border-radius: 4px;
  transition: background 0.2s;
}

.toc-toggle:hover {
  background: #e1e4e8;
}

.toc-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  margin: 0;
}

.toc-link {
  display: block;
  padding: 6px 16px;
  color: #586069;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.toc-link:hover {
  color: #0366d6;
  background: #f6f8fa;
}

.toc-link.active {
  color: #0366d6;
  background: #f1f8ff;
  border-left-color: #0366d6;
  font-weight: 600;
}

/* Indentation for different heading levels */
.toc-level-1 .toc-link { padding-left: 16px; font-weight: 600; }
.toc-level-2 .toc-link { padding-left: 28px; }
.toc-level-3 .toc-link { padding-left: 40px; font-size: 13px; }
.toc-level-4 .toc-link { padding-left: 52px; font-size: 13px; }
.toc-level-5 .toc-link { padding-left: 64px; font-size: 12px; }
.toc-level-6 .toc-link { padding-left: 76px; font-size: 12px; }

/* Adjust main content when TOC is visible */
body:has(.toc-container:not(.collapsed)) .md-parser-container {
  margin-left: 280px;
  transition: margin-left 0.3s ease;
}

/* Hide TOC in print */
@media print {
  .toc-container {
    display: none;
  }
  
  body:has(.toc-container) .md-parser-container {
    margin-left: 0 !important;
  }
}
```

---

## 2. Syntax Highlighting for Code Blocks

### Description
Add syntax highlighting to code blocks using Prism.js or Highlight.js with color-coded keywords, strings, comments, etc.

### User Story
As a developer, I want code snippets to be syntax-highlighted for better readability.

### Implementation Difficulty
**Easy** - Use existing library

### Technical Details

#### 2.1 Using Highlight.js

**Download library**:
```bash
curl -o "lib/highlight.min.js" "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
curl -o "lib/highlight-github.min.css" "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
```

**Update manifest.json**:
```json
"content_scripts": [{
  "js": [
    "lib/marked.min.js",
    "lib/mermaid.min.js",
    "lib/highlight.min.js",
    "content.js"
  ],
  "css": [
    "styles.css",
    "lib/highlight-github.min.css"
  ]
}]
```

**File**: `content.js`

```javascript
/**
 * Apply syntax highlighting to all code blocks
 */
function applySyntaxHighlighting(container) {
  if (!window.hljs) {
    console.warn('Highlight.js not loaded');
    return;
  }
  
  const codeBlocks = container.querySelectorAll('pre code:not(.language-mermaid):not(.language-chatblock)');
  
  codeBlocks.forEach((block) => {
    // Auto-detect language if not specified
    if (!block.className || block.className === 'hljs') {
      hljs.highlightElement(block);
    } else {
      // Already has language class
      hljs.highlightElement(block);
    }
    
    // Add language badge
    const language = block.className.match(/language-(\w+)/)?.[1] || 
                    block.result?.language || 'text';
    
    const badge = document.createElement('span');
    badge.className = 'code-language-badge';
    badge.textContent = language;
    
    const pre = block.parentElement;
    if (pre.tagName === 'PRE' && !pre.querySelector('.code-language-badge')) {
      pre.style.position = 'relative';
      pre.insertBefore(badge, pre.firstChild);
    }
  });
}
```

**CSS Styles**:

```css
/* Code language badge */
.code-language-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-family: monospace;
  text-transform: uppercase;
  z-index: 5;
  pointer-events: none;
}

/* Adjust copy button position when language badge is present */
.code-block-wrapper:has(.code-language-badge) .copy-code-btn {
  top: 8px;
  right: 8px;
}
```

---

## 3. Text-to-Speech (TTS) with Language Detection

### Description
Built-in browser TTS with automatic language detection (English/Chinese), sticky player that follows scroll.

### User Story
As a user, I want to listen to markdown content read aloud while following along or multitasking.

### Implementation Difficulty
**Medium-Hard** - Requires Web Speech API, language detection, and sticky UI

### Technical Details

#### 3.1 Language Detection

```javascript
/**
 * Detect if text contains Chinese characters
 */
function detectLanguage(text) {
  const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf]/;
  const sample = text.substring(0, 1000);
  
  // Count Chinese vs English characters
  const chineseChars = (sample.match(chineseRegex) || []).length;
  const totalChars = sample.replace(/\s/g, '').length;
  
  // If more than 30% Chinese characters, use Chinese voice
  return (chineseChars / totalChars) > 0.3 ? 'zh-CN' : 'en-US';
}
```

#### 3.2 TTS Player Implementation

```javascript
/**
 * Create TTS player
 */
function createTTSPlayer(container) {
  // Check browser support
  if (!('speechSynthesis' in window)) {
    console.warn('TTS not supported in this browser');
    return null;
  }
  
  const player = document.createElement('div');
  player.className = 'tts-player';
  player.innerHTML = `
    <div class="tts-controls">
      <button class="tts-btn tts-play" title="Play">▶️</button>
      <button class="tts-btn tts-pause" title="Pause" disabled>⏸️</button>
      <button class="tts-btn tts-stop" title="Stop" disabled>⏹️</button>
      <select class="tts-rate">
        <option value="0.5">0.5x</option>
        <option value="0.75">0.75x</option>
        <option value="1" selected>1x</option>
        <option value="1.25">1.25x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2x</option>
      </select>
      <select class="tts-voice">
        <option value="auto">Auto</option>
      </select>
      <div class="tts-progress">
        <span class="tts-current">Ready</span>
      </div>
    </div>
  `;
  
  // Get available voices
  const voiceSelect = player.querySelector('.tts-voice');
  let voices = [];
  
  function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '<option value="auto">Auto Detect</option>';
    
    // Add English voices
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    if (enVoices.length > 0) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = 'English';
      enVoices.forEach(v => {
        const option = document.createElement('option');
        option.value = v.name;
        option.textContent = v.name;
        optgroup.appendChild(option);
      });
      voiceSelect.appendChild(optgroup);
    }
    
    // Add Chinese voices
    const zhVoices = voices.filter(v => v.lang.startsWith('zh'));
    if (zhVoices.length > 0) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = 'Chinese';
      zhVoices.forEach(v => {
        const option = document.createElement('option');
        option.value = v.name;
        option.textContent = v.name;
        optgroup.appendChild(option);
      });
      voiceSelect.appendChild(optgroup);
    }
  }
  
  // Load voices (may be async)
  loadVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  
  // TTS state
  const ttsState = {
    isPlaying: false,
    isPaused: false,
    currentUtterance: null,
    textSegments: [],
    currentSegment: 0
  };
  
  // Extract text content
  function extractTextContent() {
    const textContent = container.textContent;
    // Split into sentences for better pause/resume
    const segments = textContent.match(/[^.!?]+[.!?]+/g) || [textContent];
    return segments;
  }
  
  // Button handlers
  const playBtn = player.querySelector('.tts-play');
  const pauseBtn = player.querySelector('.tts-pause');
  const stopBtn = player.querySelector('.tts-stop');
  const rateSelect = player.querySelector('.tts-rate');
  const currentSpan = player.querySelector('.tts-current');
  
  playBtn.addEventListener('click', () => {
    if (ttsState.isPaused) {
      // Resume
      speechSynthesis.resume();
      ttsState.isPaused = false;
    } else {
      // Start from beginning
      ttsState.textSegments = extractTextContent();
      ttsState.currentSegment = 0;
      speakNextSegment();
    }
    
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    ttsState.isPlaying = true;
  });
  
  pauseBtn.addEventListener('click', () => {
    speechSynthesis.pause();
    ttsState.isPaused = true;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
  });
  
  stopBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    ttsState.isPlaying = false;
    ttsState.isPaused = false;
    ttsState.currentSegment = 0;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    currentSpan.textContent = 'Stopped';
  });
  
  function speakNextSegment() {
    if (ttsState.currentSegment >= ttsState.textSegments.length) {
      // Finished
      stopBtn.click();
      currentSpan.textContent = 'Finished';
      return;
    }
    
    const text = ttsState.textSegments[ttsState.currentSegment];
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    const selectedVoice = voiceSelect.value;
    if (selectedVoice !== 'auto') {
      utterance.voice = voices.find(v => v.name === selectedVoice);
    } else {
      // Auto-detect language
      const lang = detectLanguage(text);
      utterance.lang = lang;
      const voiceForLang = voices.find(v => v.lang === lang);
      if (voiceForLang) utterance.voice = voiceForLang;
    }
    
    // Set rate
    utterance.rate = parseFloat(rateSelect.value);
    
    utterance.onstart = () => {
      currentSpan.textContent = `Reading (${ttsState.currentSegment + 1}/${ttsState.textSegments.length})`;
    };
    
    utterance.onend = () => {
      ttsState.currentSegment++;
      if (ttsState.isPlaying) {
        speakNextSegment();
      }
    };
    
    utterance.onerror = (event) => {
      console.error('TTS error:', event);
      currentSpan.textContent = 'Error';
    };
    
    ttsState.currentUtterance = utterance;
    speechSynthesis.speak(utterance);
  }
  
  return player;
}

/**
 * Make TTS player sticky on scroll
 */
function makeTTSPlayerSticky(player) {
  let isSticky = false;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (scrollY > 200 && !isSticky) {
      player.classList.add('sticky');
      isSticky = true;
    } else if (scrollY <= 200 && isSticky) {
      player.classList.remove('sticky');
      isSticky = false;
    }
  });
}
```

**CSS Styles**:

```css
/* TTS Player */
.tts-player {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 99;
}

.tts-player.sticky {
  position: fixed;
  top: 20px;
  right: 20px;
  left: auto;
  margin: 0;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.tts-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.tts-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
}

.tts-btn:hover:not(:disabled) {
  background: white;
  transform: scale(1.05);
}

.tts-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tts-rate,
.tts-voice {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
}

.tts-progress {
  flex: 1;
  min-width: 120px;
  text-align: right;
}

.tts-current {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

@media print {
  .tts-player {
    display: none;
  }
}
```

---

## 4. Scroll to Top Button

### Description
Floating button that appears when scrolling down, returns to top of page when clicked.

### Implementation Difficulty
**Easy** - Simple scroll event handling

### Implementation

```javascript
/**
 * Create scroll to top button
 */
function createScrollToTopButton() {
  const button = document.createElement('button');
  button.className = 'scroll-to-top';
  button.innerHTML = '↑';
  button.title = 'Scroll to top';
  button.style.display = 'none';
  
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Show/hide based on scroll position
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (scrollY > 400) {
      button.style.display = 'block';
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
      scrollTimeout = setTimeout(() => {
        button.style.display = 'none';
      }, 300);
    }
  });
  
  document.body.appendChild(button);
  return button;
}
```

**CSS**:

```css
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 98;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.scroll-to-top.visible {
  opacity: 1;
  transform: scale(1);
}

.scroll-to-top:hover {
  background: #34495e;
  transform: scale(1.1);
}

.scroll-to-top:active {
  transform: scale(0.95);
}

@media print {
  .scroll-to-top {
    display: none;
  }
}
```

---

## 5. TXT File Support

### Description
Detect `.txt` files and render them with markdown parser (many txt files contain markdown-like syntax).

### Implementation Difficulty
**Easy** - Extend existing detection

### Implementation

```javascript
/**
 * Check if URL is a text file
 */
function hasTextExtension(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  return pathname.endsWith('.txt');
}

/**
 * Modified main function to include TXT support
 */
async function main() {
  const url = window.location.href;
  
  // Check 1: URL has markdown or text extension
  if (hasMarkdownExtension(url) || hasTextExtension(url)) {
    if (url.startsWith('file://')) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.fileUrlLoadDelay));
    }
    
    if (isPlainTextView()) {
      const content = getRawContent();
      if (content && content.length <= CONFIG.maxFileSize) {
        await displayRenderedContent(content);
        return;
      }
    }
  }
  
  // ... rest of detection logic
}
```

---

## 6. JSON File Viewer with Tree View

### Description
Auto-detect JSON files and render as expandable/collapsible tree structure.

### Implementation Difficulty
**Medium** - Requires JSON parsing and tree UI

### Technical Details

#### 6.1 JSON Detection

```javascript
/**
 * Check if content is JSON
 */
function isJSONContent(content) {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if URL is JSON file
 */
function hasJSONExtension(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  return pathname.endsWith('.json');
}
```

#### 6.2 JSON Tree Renderer

```javascript
/**
 * Render JSON as tree view
 */
function renderJSONTree(jsonString) {
  const data = JSON.parse(jsonString);
  
  const container = document.createElement('div');
  container.className = 'json-viewer';
  
  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'json-toolbar';
  toolbar.innerHTML = `
    <button class="json-btn" data-action="expand-all">Expand All</button>
    <button class="json-btn" data-action="collapse-all">Collapse All</button>
    <button class="json-btn" data-action="copy">Copy JSON</button>
    <span class="json-info"></span>
  `;
  
  // Tree container
  const tree = document.createElement('div');
  tree.className = 'json-tree';
  tree.appendChild(renderJSONNode('root', data, true));
  
  container.appendChild(toolbar);
  container.appendChild(tree);
  
  // Button handlers
  toolbar.querySelector('[data-action="expand-all"]').addEventListener('click', () => {
    container.querySelectorAll('.json-node.collapsed').forEach(node => {
      node.classList.remove('collapsed');
    });
  });
  
  toolbar.querySelector('[data-action="collapse-all"]').addEventListener('click', () => {
    container.querySelectorAll('.json-node').forEach(node => {
      node.classList.add('collapsed');
    });
  });
  
  toolbar.querySelector('[data-action="copy"]').addEventListener('click', async () => {
    await navigator.clipboard.writeText(jsonString);
    const btn = toolbar.querySelector('[data-action="copy"]');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
  
  // Show stats
  const stats = analyzeJSON(data);
  toolbar.querySelector('.json-info').textContent = 
    `${stats.keys} keys, ${stats.arrays} arrays, ${stats.objects} objects`;
  
  return container;
}

/**
 * Render individual JSON node
 */
function renderJSONNode(key, value, isRoot = false) {
  const node = document.createElement('div');
  node.className = 'json-node';
  
  const type = Array.isArray(value) ? 'array' : typeof value;
  
  if (type === 'object' && value !== null) {
    node.classList.add('json-object');
    
    const header = document.createElement('div');
    header.className = 'json-header';
    
    const toggle = document.createElement('span');
    toggle.className = 'json-toggle';
    toggle.textContent = '▼';
    
    const keySpan = document.createElement('span');
    keySpan.className = 'json-key';
    keySpan.textContent = isRoot ? '' : `${key}: `;
    
    const preview = document.createElement('span');
    preview.className = 'json-preview';
    preview.textContent = `{${Object.keys(value).length} properties}`;
    
    header.appendChild(toggle);
    header.appendChild(keySpan);
    header.appendChild(preview);
    
    const children = document.createElement('div');
    children.className = 'json-children';
    
    Object.entries(value).forEach(([k, v]) => {
      children.appendChild(renderJSONNode(k, v));
    });
    
    header.addEventListener('click', () => {
      node.classList.toggle('collapsed');
      toggle.textContent = node.classList.contains('collapsed') ? '▶' : '▼';
    });
    
    node.appendChild(header);
    node.appendChild(children);
    
  } else if (type === 'array') {
    node.classList.add('json-array');
    
    const header = document.createElement('div');
    header.className = 'json-header';
    
    const toggle = document.createElement('span');
    toggle.className = 'json-toggle';
    toggle.textContent = '▼';
    
    const keySpan = document.createElement('span');
    keySpan.className = 'json-key';
    keySpan.textContent = `${key}: `;
    
    const preview = document.createElement('span');
    preview.className = 'json-preview';
    preview.textContent = `[${value.length} items]`;
    
    header.appendChild(toggle);
    header.appendChild(keySpan);
    header.appendChild(preview);
    
    const children = document.createElement('div');
    children.className = 'json-children';
    
    value.forEach((item, index) => {
      children.appendChild(renderJSONNode(index, item));
    });
    
    header.addEventListener('click', () => {
      node.classList.toggle('collapsed');
      toggle.textContent = node.classList.contains('collapsed') ? '▶' : '▼';
    });
    
    node.appendChild(header);
    node.appendChild(children);
    
  } else {
    // Primitive value
    node.classList.add('json-leaf');
    
    const keySpan = document.createElement('span');
    keySpan.className = 'json-key';
    keySpan.textContent = `${key}: `;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = `json-value json-${type}`;
    valueSpan.textContent = JSON.stringify(value);
    
    node.appendChild(keySpan);
    node.appendChild(valueSpan);
  }
  
  return node;
}

/**
 * Analyze JSON structure
 */
function analyzeJSON(obj) {
  let keys = 0;
  let arrays = 0;
  let objects = 0;
  
  function traverse(value) {
    if (Array.isArray(value)) {
      arrays++;
      value.forEach(traverse);
    } else if (typeof value === 'object' && value !== null) {
      objects++;
      keys += Object.keys(value).length;
      Object.values(value).forEach(traverse);
    }
  }
  
  traverse(obj);
  return { keys, arrays, objects };
}

/**
 * Display JSON content
 */
async function displayJSONContent(jsonString) {
  try {
    const viewer = renderJSONTree(jsonString);
    
    document.body.innerHTML = '';
    
    const badge = document.createElement('div');
    badge.className = 'md-parser-badge';
    badge.textContent = 'JSON';
    badge.title = 'JSON Viewer';
    
    document.body.appendChild(viewer);
    document.body.appendChild(badge);
    
    document.title = 'JSON Viewer';
    
  } catch (error) {
    console.error('JSON Viewer: Error rendering', error);
  }
}
```

**CSS**:

```css
/* JSON Viewer */
.json-viewer {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.json-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: #f6f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
}

.json-btn {
  padding: 6px 12px;
  background: #0366d6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.json-btn:hover {
  background: #0256c2;
}

.json-info {
  margin-left: auto;
  font-size: 13px;
  color: #586069;
}

.json-tree {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.json-node {
  margin-left: 20px;
}

.json-header {
  cursor: pointer;
  user-select: none;
  padding: 2px 4px;
  border-radius: 3px;
  transition: background 0.2s;
}

.json-header:hover {
  background: #f6f8fa;
}

.json-toggle {
  display: inline-block;
  width: 16px;
  color: #586069;
  font-size: 12px;
}

.json-key {
  color: #005cc5;
  font-weight: 600;
}

.json-preview {
  color: #6a737d;
  font-style: italic;
  margin-left: 8px;
}

.json-children {
  margin-left: 16px;
  border-left: 1px solid #e1e4e8;
  padding-left: 8px;
}

.json-node.collapsed > .json-children {
  display: none;
}

.json-leaf {
  padding: 2px 4px;
}

.json-value {
  color: #032f62;
}

.json-value.json-string {
  color: #032f62;
}

.json-value.json-number {
  color: #005cc5;
}

.json-value.json-boolean {
  color: #e36209;
}

.json-value.json-null {
  color: #6a737d;
  font-style: italic;
}

@media print {
  .json-toolbar {
    display: none;
  }
  
  .json-node.collapsed > .json-children {
    display: block !important;
  }
}
```

#### 6.3 Integration

```javascript
async function main() {
  const url = window.location.href;
  
  // Check for JSON files first
  if (hasJSONExtension(url) || document.contentType === 'application/json') {
    if (isPlainTextView()) {
      const content = getRawContent();
      if (content && isJSONContent(content)) {
        await displayJSONContent(content);
        return;
      }
    }
  }
  
  // ... rest of detection logic
}
```

---

## Integration Checklist

- [ ] Add TOC generation and scroll tracking
- [ ] Download and integrate Highlight.js
- [ ] Implement TTS player with language detection
- [ ] Add scroll to top button
- [ ] Extend detection to include .txt files
- [ ] Implement JSON tree viewer
- [ ] Test all features together
- [ ] Verify print output for all features
- [ ] Test performance with large files

---

## Performance Considerations

- **Large JSON files**: Implement virtual scrolling for 1000+ nodes
- **TTS**: Limit text length, split into chunks
- **Syntax highlighting**: Use Web Workers for large code blocks
- **TOC**: Use Intersection Observer (already implemented)
- **Scroll tracking**: Debounce scroll events
