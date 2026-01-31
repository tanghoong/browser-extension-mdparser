/**
 * Markdown Parser Browser Extension
 * Content Script - Detects and renders Markdown content
 */

(function() {
  'use strict';

  // Prevent double initialization
  if (window.__mdParserInitialized) return;
  window.__mdParserInitialized = true;

  // Configuration
  const CONFIG = {
    maxFileSize: 1024 * 1024, // 1MB limit for performance
    mdExtensions: ['.md', '.markdown', '.mdown', '.mkd', '.mkdn'],
    txtExtensions: ['.txt'],
    mermaidLoaded: false,
    // Delay for file:// URLs to ensure DOM content is ready before detection
    fileUrlLoadDelay: 100,
    // Counter for generating unique mermaid diagram IDs
    mermaidIdCounter: 0
  };

  // State management
  const STATE = {
    isRendered: true,
    rawContent: '',
    container: null,
    badge: null
  };

  /**
   * Check if URL ends with markdown extension
   */
  function hasMarkdownExtension(url) {
    const pathname = new URL(url).pathname.toLowerCase();
    return CONFIG.mdExtensions.some(ext => pathname.endsWith(ext));
  }

  /**
   * Check if URL ends with text extension
   */
  function hasTextExtension(url) {
    const pathname = new URL(url).pathname.toLowerCase();
    return CONFIG.txtExtensions.some(ext => pathname.endsWith(ext));
  }

  /**
   * Check if content type indicates markdown
   */
  function isMarkdownContentType(contentType) {
    if (!contentType) return false;
    return contentType.includes('text/markdown') || 
           contentType.includes('text/x-markdown');
  }

  /**
   * Detect if content appears to be Markdown
   * Checks first few lines for markdown patterns
   */
  function looksLikeMarkdown(content) {
    if (!content || typeof content !== 'string') return false;
    
    const lines = content.trim().split('\n').slice(0, 20);
    const joinedLines = lines.join('\n');
    
    // Patterns that indicate markdown content
    const markdownPatterns = [
      /^#{1,6}\s+.+/m,           // Headers (# Header)
      /^---\s*$/m,               // Horizontal rule or frontmatter
      /^\*{3,}\s*$/m,            // Horizontal rule (asterisks)
      /^```[\w]*\s*$/m,          // Code block start
      /^\s*[-*+]\s+.+/m,         // Unordered list items
      /^\s*\d+\.\s+.+/m,         // Ordered list items
      /\[.+\]\(.+\)/,            // Links
      /!\[.*\]\(.+\)/,           // Images
      /^\s*>\s+.+/m,             // Blockquotes
      /\*\*.+\*\*/,              // Bold
      /__.+__/,                  // Bold (underscores)
      /\*.+\*/,                  // Italic
      /_.+_/,                    // Italic (underscores)
      /`[^`]+`/,                 // Inline code
      /^\|.+\|.+\|/m,            // Tables
    ];

    let matchCount = 0;
    for (const pattern of markdownPatterns) {
      if (pattern.test(joinedLines)) {
        matchCount++;
      }
    }

    // Need at least 2 patterns to be confident it's markdown
    return matchCount >= 2;
  }

  /**
   * Check if we're viewing a plain text file (raw content in <pre> tag)
   */
  function isPlainTextView() {
    const body = document.body;
    if (!body) return false;

    // Chrome/Firefox show plain text in a single <pre> element
    const pre = body.querySelector('pre');
    if (pre && body.children.length === 1) {
      return true;
    }

    // Also check if body only has text content
    if (body.children.length === 0 && body.textContent.trim().length > 0) {
      return true;
    }

    return false;
  }

  /**
   * Get raw markdown content from page
   */
  function getRawContent() {
    const pre = document.body.querySelector('pre');
    if (pre) {
      return pre.textContent;
    }
    return document.body.textContent;
  }



  /**
   * Initialize mermaid.js library
   */
  function initMermaid() {
    if (CONFIG.mermaidLoaded || !window.mermaid) return;
    
    // Initialize mermaid with config
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      }
    });
    
    CONFIG.mermaidLoaded = true;
  }

  /**
   * Resolve relative URLs to absolute URLs
   */
  function resolveRelativeUrls(html, baseUrl) {
    const base = new URL(baseUrl);
    const basePath = base.href.substring(0, base.href.lastIndexOf('/') + 1);
    
    // Resolve image src
    html = html.replace(/(<img[^>]+src=")([^"]+)(")/gi, (match, prefix, src, suffix) => {
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('file://')) {
        return match;
      }
      try {
        const resolved = new URL(src, basePath).href;
        return prefix + resolved + suffix;
      } catch {
        return match;
      }
    });

    // Resolve link href
    html = html.replace(/(<a[^>]+href=")([^"]+)(")/gi, (match, prefix, href, suffix) => {
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('file://')) {
        return match;
      }
      try {
        const resolved = new URL(href, basePath).href;
        return prefix + resolved + suffix;
      } catch {
        return match;
      }
    });

    return html;
  }

  /**
   * Process mermaid diagrams in content
   */
  async function processMermaidDiagrams(container) {
    const mermaidBlocks = container.querySelectorAll('pre > code.language-mermaid');
    
    if (mermaidBlocks.length === 0) return;

    initMermaid();

    for (let i = 0; i < mermaidBlocks.length; i++) {
      const codeBlock = mermaidBlocks[i];
      const preBlock = codeBlock.parentElement;
      const mermaidCode = codeBlock.textContent;
      
      // Create mermaid container
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'mermaid';
      mermaidDiv.setAttribute('data-mermaid-code', mermaidCode); // Store original code
      
      try {
        // Generate unique ID using counter and random suffix for robustness
        CONFIG.mermaidIdCounter++;
        const id = `mermaid-${CONFIG.mermaidIdCounter}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Render mermaid diagram
        const { svg } = await window.mermaid.render(id, mermaidCode);
        mermaidDiv.innerHTML = svg;
        
        // Replace pre block with rendered diagram
        preBlock.parentElement.replaceChild(mermaidDiv, preBlock);
      } catch (error) {
        // Show error with original code
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mermaid-error';
        errorDiv.innerHTML = `
          <div class="mermaid-error-message">⚠️ Mermaid diagram error: ${error.message || 'Invalid syntax'}</div>
          <pre><code>${escapeHtml(mermaidCode)}</code></pre>
        `;
        preBlock.parentElement.replaceChild(errorDiv, preBlock);
      }
    }
  }

  /**
   * Escape HTML special characters
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Apply syntax highlighting to all code blocks
   */
  function applySyntaxHighlighting(container) {
    if (!window.hljs) {
      console.warn('Highlight.js not loaded');
      return;
    }
    
    const codeBlocks = container.querySelectorAll('pre > code:not(.language-mermaid)');
    
    codeBlocks.forEach((block) => {
      // Skip if already highlighted
      if (block.classList.contains('hljs')) return;
      
      // Auto-detect and highlight
      hljs.highlightElement(block);
      
      // Add language badge
      const language = block.result?.language || 
                      block.className.match(/language-(\w+)/)?.[1] || 
                      'text';
      
      const badge = document.createElement('span');
      badge.className = 'code-language-badge';
      badge.textContent = language;
      
      const pre = block.parentElement;
      if (pre.tagName === 'PRE') {
        const wrapper = pre.parentElement;
        if (wrapper && wrapper.classList.contains('code-block-wrapper')) {
          if (!wrapper.querySelector('.code-language-badge')) {
            wrapper.insertBefore(badge, wrapper.firstChild);
          }
        }
      }
    });
  }

  /**
   * Add copy button to Mermaid diagrams
   */
  function addCopyButtonsToMermaid(container) {
    const mermaidDivs = container.querySelectorAll('.mermaid');
    
    mermaidDivs.forEach((mermaidDiv) => {
      // Skip if already wrapped
      if (mermaidDiv.parentElement.classList.contains('mermaid-wrapper')) {
        return;
      }
      
      const mermaidCode = mermaidDiv.getAttribute('data-mermaid-code');
      
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-wrapper';
      mermaidDiv.parentNode.insertBefore(wrapper, mermaidDiv);
      wrapper.appendChild(mermaidDiv);
      
      // Copy Code button
      const copyCodeBtn = document.createElement('button');
      copyCodeBtn.className = 'copy-mermaid-btn';
      copyCodeBtn.textContent = 'Copy Code';
      copyCodeBtn.title = 'Copy Mermaid code to clipboard';
      
      copyCodeBtn.addEventListener('click', async () => {
        if (mermaidCode) {
          try {
            await navigator.clipboard.writeText(mermaidCode);
            copyCodeBtn.textContent = 'Copied!';
            setTimeout(() => copyCodeBtn.textContent = 'Copy Code', 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
        }
      });
      
      wrapper.appendChild(copyCodeBtn);
    });
  }

  /**
   * Generate table of contents from headings
   */
  function generateTableOfContents(container) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length < 2) {
      return null;
    }
    
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    tocContainer.innerHTML = `
      <div class="toc-header">
        <span class="toc-title">📑 Contents</span>
        <button class="toc-toggle" title="Toggle TOC">◀</button>
      </div>
      <nav class="toc-nav"></nav>
    `;
    
    const tocNav = tocContainer.querySelector('.toc-nav');
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
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
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
    
    tocNav.appendChild(tocList);
    
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
   * Setup TOC scroll tracking
   */
  function setupTOCScrollTracking() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const tocItem = document.querySelector(`.toc-item[data-heading-id="${id}"]`);
          
          if (tocItem) {
            document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
            
            const link = tocItem.querySelector('.toc-link');
            link.classList.add('active');
            link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });
    
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    headings.forEach(heading => observer.observe(heading));
  }

  /**
   * Setup link confirmation modal
   */
  function setupLinkConfirmation(container) {
    const links = container.querySelectorAll('a[href]');
    
    links.forEach((link) => {
      // Skip TOC links and anchor links
      if (link.classList.contains('toc-link') || link.getAttribute('href').startsWith('#')) {
        return;
      }
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        showLinkModal(href);
      });
    });
  }

  /**
   * Show link confirmation modal
   */
  function showLinkModal(url) {
    const modal = document.createElement('div');
    modal.className = 'link-modal';
    modal.innerHTML = `
      <div class="link-modal-content">
        <h3>Open External Link?</h3>
        <div class="link-url">${escapeHtml(url)}</div>
        <div class="link-modal-buttons">
          <button class="link-btn link-btn-primary" data-action="open">Open in New Tab</button>
          <button class="link-btn link-btn-secondary" data-action="cancel">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('[data-action="open"]').addEventListener('click', () => {
      window.open(url, '_blank');
      modal.remove();
    });
    
    modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Extract YouTube video ID from various URL formats
   */
  function getYouTubeVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  /**
   * Convert YouTube links to embedded players
   */
  function embedYouTubeVideos(container) {
    const links = container.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
    
    links.forEach((link) => {
      const videoId = getYouTubeVideoId(link.href);
      if (!videoId) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'youtube-embed-wrapper';
      wrapper.setAttribute('data-video-id', videoId);
      
      const iframe = document.createElement('iframe');
      iframe.className = 'youtube-embed';
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      
      wrapper.appendChild(iframe);
      
      // Replace link with embedded player
      const parent = link.parentElement;
      if (parent.tagName === 'P' && parent.childNodes.length === 1) {
        parent.parentNode.replaceChild(wrapper, parent);
      } else {
        link.parentNode.replaceChild(wrapper, link);
      }
    });
  }

  /**
   * Check if URL is an audio file
   */
  function isAudioFile(url) {
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma'];
    const urlLower = url.toLowerCase();
    return audioExtensions.some(ext => urlLower.endsWith(ext));
  }

  /**
   * Get MIME type for audio file
   */
  function getAudioMimeType(url) {
    const ext = url.toLowerCase().split('.').pop().split('?')[0];
    const mimeTypes = {
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'm4a': 'audio/mp4',
      'flac': 'audio/flac',
      'aac': 'audio/aac',
      'wma': 'audio/x-ms-wma'
    };
    return mimeTypes[ext] || 'audio/mpeg';
  }

  /**
   * Extract filename from URL
   */
  function getFilenameFromUrl(url) {
    return url.split('/').pop().split('?')[0];
  }

  /**
   * Convert audio links to embedded players
   */
  function embedAudioPlayers(container) {
    const links = container.querySelectorAll('a');
    
    links.forEach((link) => {
      if (!isAudioFile(link.href)) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'audio-player-wrapper';
      
      const audio = document.createElement('audio');
      audio.className = 'audio-player';
      audio.controls = true;
      audio.preload = 'metadata';
      
      const source = document.createElement('source');
      source.src = link.href;
      source.type = getAudioMimeType(link.href);
      
      audio.appendChild(source);
      
      const label = document.createElement('div');
      label.className = 'audio-label';
      label.textContent = link.textContent || getFilenameFromUrl(link.href);
      
      wrapper.appendChild(label);
      wrapper.appendChild(audio);
      
      // Replace link
      const parent = link.parentElement;
      if (parent.tagName === 'P' && parent.childNodes.length === 1) {
        parent.parentNode.replaceChild(wrapper, parent);
      } else {
        link.parentNode.replaceChild(wrapper, link);
      }
    });
  }

  /**
   * Parse chatblock syntax
   */
  function parseChatBlock(content) {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return null;
    
    const theme = lines[0].trim().toUpperCase();
    const messages = [];
    let firstUser = null;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, user, text] = match;
        
        if (!firstUser) {
          firstUser = user;
        }
        
        messages.push({
          user,
          text,
          isRight: user === firstUser
        });
      }
    }
    
    return { theme, messages };
  }

  /**
   * Get icon for chat theme
   */
  function getChatIcon(theme) {
    const icons = {
      'WHATSAPP': '💬',
      'TELEGRAM': '✈️',
      'IMESSAGE': '💬',
      'SLACK': '💼',
      'DISCORD': '🎮'
    };
    return icons[theme] || '💬';
  }

  /**
   * Render chat block with theme
   */
  function renderChatBlock(chatData) {
    const { theme, messages } = chatData;
    
    const container = document.createElement('div');
    container.className = `chat-block chat-theme-${theme.toLowerCase()}`;
    
    const header = document.createElement('div');
    header.className = 'chat-header';
    header.innerHTML = `
      <span class="chat-theme-badge">${theme}</span>
      <span class="chat-theme-icon">${getChatIcon(theme)}</span>
    `;
    container.appendChild(header);
    
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'chat-messages';
    
    messages.forEach((msg) => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.isRight ? 'chat-right' : 'chat-left'}`;
      
      const userLabel = document.createElement('div');
      userLabel.className = 'chat-user';
      userLabel.textContent = msg.user;
      
      const textContent = document.createElement('div');
      textContent.className = 'chat-text';
      textContent.textContent = msg.text;
      
      bubble.appendChild(userLabel);
      bubble.appendChild(textContent);
      messagesContainer.appendChild(bubble);
    });
    
    container.appendChild(messagesContainer);
    
    return container;
  }

  /**
   * Process all chatblocks in container
   */
  function processChatBlocks(container) {
    const chatBlocks = container.querySelectorAll('pre > code.language-chatblock');
    
    chatBlocks.forEach((codeBlock) => {
      const content = codeBlock.textContent;
      const chatData = parseChatBlock(content);
      
      if (chatData) {
        const chatUI = renderChatBlock(chatData);
        const pre = codeBlock.parentElement;
        pre.parentNode.replaceChild(chatUI, pre);
      }
    });
  }

  /**
   * Stop all media (for presentation mode)
   */
  function stopAllMedia() {
    // Stop YouTube videos
    const youtubeIframes = document.querySelectorAll('.youtube-embed');
    youtubeIframes.forEach((iframe) => {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
    
    // Stop audio players
    const audioPlayers = document.querySelectorAll('.audio-player');
    audioPlayers.forEach((audio) => {
      audio.pause();
    });
  }

  /**
   * Render markdown content to HTML
   */
  function renderMarkdown(markdown) {
    // In marked v9+, marked is the default export
    const marked = window.marked?.marked || window.marked;
    
    if (!marked) {
      throw new Error('Marked library not available');
    }

    // Configure marked
    marked.setOptions({
      gfm: true,
      breaks: false,
      pedantic: false,
      headerIds: true,
      mangle: false
    });

    // Parse markdown to HTML
    let html = marked.parse(markdown);
    
    // Resolve relative URLs
    html = resolveRelativeUrls(html, window.location.href);

    return html;
  }

  /**
   * Add copy buttons to all code blocks
   */
  function addCopyButtonsToCodeBlocks(container) {
    const codeBlocks = container.querySelectorAll('pre > code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      
      // Skip if already has copy button
      if (pre.parentElement.classList.contains('code-block-wrapper')) {
        return;
      }
      
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      
      // Create copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.title = 'Copy code to clipboard';
      
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeBlock.textContent);
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          copyBtn.textContent = 'Failed';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 2000);
        }
      });
      
      wrapper.appendChild(copyBtn);
    });
  }

  /**
   * Setup badge toggle functionality
   */
  function setupBadgeToggle(badge, container, rawContent) {
    badge.style.cursor = 'pointer';
    
    badge.addEventListener('click', () => {
      STATE.isRendered = !STATE.isRendered;
      
      if (STATE.isRendered) {
        // Show rendered view
        container.style.display = 'block';
        const rawPre = document.body.querySelector('pre.raw-content');
        if (rawPre) rawPre.remove();
        badge.textContent = 'MD';
        badge.title = 'Rendered by Markdown Parser (Click to view raw)';
      } else {
        // Show raw view
        container.style.display = 'none';
        const pre = document.createElement('pre');
        pre.className = 'raw-content';
        pre.textContent = rawContent;
        document.body.appendChild(pre);
        badge.textContent = 'RAW';
        badge.title = 'Raw Markdown (Click to view rendered)';
      }
    });
  }

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
        setTimeout(() => button.classList.add('visible'), 10);
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

  /**
   * Enhance image rendering with error handling
   */
  function enhanceImageRendering(container) {
    const images = container.querySelectorAll('img');
    
    images.forEach((img) => {
      // Add loading transition
      img.style.opacity = '0';
      
      img.addEventListener('load', () => {
        img.style.opacity = '1';
        img.style.transition = 'opacity 0.3s';
      });
      
      img.addEventListener('error', () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'broken-image';
        placeholder.innerHTML = `
          <div class="broken-image-icon">🖼️</div>
          <div class="broken-image-text">Image not found</div>
          <div class="broken-image-url">${img.alt || img.src}</div>
        `;
        img.parentNode.replaceChild(placeholder, img);
      });
    });
  }

  /**
   * Create and insert the rendered content
   */
  async function displayRenderedContent(markdown) {
    try {
      // Store raw content for toggle
      STATE.rawContent = markdown;
      
      // Render markdown to HTML
      const html = renderMarkdown(markdown);

      // Clear existing content
      document.body.innerHTML = '';

      // Create container
      const container = document.createElement('div');
      container.className = 'md-parser-container';
      container.innerHTML = html;

      // Create badge
      const badge = document.createElement('div');
      badge.className = 'md-parser-badge';
      badge.textContent = 'MD';
      badge.title = 'Rendered by Markdown Parser (Click to toggle raw)';

      // Add elements to body
      document.body.appendChild(container);
      document.body.appendChild(badge);

      // Store references
      STATE.container = container;
      STATE.badge = badge;

      // Process mermaid diagrams
      await processMermaidDiagrams(container);

      // Apply syntax highlighting
      applySyntaxHighlighting(container);

      // Add copy buttons to code blocks
      addCopyButtonsToCodeBlocks(container);

      // Add copy buttons to mermaid diagrams
      addCopyButtonsToMermaid(container);

      // Generate and add Table of Contents
      const toc = generateTableOfContents(container);
      if (toc) {
        document.body.appendChild(toc);
        setupTOCScrollTracking();
      }

      // Setup link confirmation
      setupLinkConfirmation(container);

      // Embed multimedia (Phase 3)
      embedYouTubeVideos(container);
      embedAudioPlayers(container);
      processChatBlocks(container);

      // Setup badge toggle
      setupBadgeToggle(badge, container, markdown);

      // Create scroll to top button
      createScrollToTopButton();

      // Enhance image rendering
      enhanceImageRendering(container);

      // Set page title from first h1 if available
      const h1 = container.querySelector('h1');
      if (h1) {
        document.title = h1.textContent + ' - Markdown';
      } else {
        // Use filename from URL
        const pathname = window.location.pathname;
        const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
        if (filename) {
          document.title = filename + ' - Markdown';
        }
      }

    } catch (error) {
      console.error('Markdown Parser: Error rendering content', error);
    }
  }

  /**
   * Main detection and rendering logic
   */
  async function main() {
    const url = window.location.href;
    
    // Check 1: URL has markdown or text extension
    if (hasMarkdownExtension(url) || hasTextExtension(url)) {
      // Wait for content to load for file:// URLs (browser may still be loading DOM)
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

    // Check 2: Content appears to be markdown (for pages without .md extension)
    if (isPlainTextView()) {
      const content = getRawContent();
      if (content && content.length <= CONFIG.maxFileSize && looksLikeMarkdown(content)) {
        await displayRenderedContent(content);
        return;
      }
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

})();
