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
    mermaidLoaded: false,
    // Delay for file:// URLs to ensure DOM content is ready before detection
    fileUrlLoadDelay: 100,
    // Counter for generating unique mermaid diagram IDs
    mermaidIdCounter: 0
  };

  /**
   * Check if URL ends with markdown extension
   */
  function hasMarkdownExtension(url) {
    const pathname = new URL(url).pathname.toLowerCase();
    return CONFIG.mdExtensions.some(ext => pathname.endsWith(ext));
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
   * Load external script
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Load marked.js library
   */
  async function loadMarked() {
    if (window.marked) return;
    
    // Use CDN for marked.js
    await loadScript('https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js');
  }

  /**
   * Load mermaid.js library
   */
  async function loadMermaid() {
    if (CONFIG.mermaidLoaded || window.mermaid) return;
    
    // Use CDN for mermaid
    await loadScript('https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js');
    
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

    await loadMermaid();

    for (let i = 0; i < mermaidBlocks.length; i++) {
      const codeBlock = mermaidBlocks[i];
      const preBlock = codeBlock.parentElement;
      const mermaidCode = codeBlock.textContent;
      
      // Create mermaid container
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'mermaid';
      
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
   * Render markdown content to HTML
   */
  async function renderMarkdown(markdown) {
    await loadMarked();

    // Configure marked
    window.marked.setOptions({
      gfm: true,
      breaks: false,
      pedantic: false,
      headerIds: true,
      mangle: false
    });

    // Parse markdown to HTML
    let html = window.marked.parse(markdown);
    
    // Resolve relative URLs
    html = resolveRelativeUrls(html, window.location.href);

    return html;
  }

  /**
   * Create and insert the rendered content
   */
  async function displayRenderedContent(markdown) {
    try {
      // Render markdown to HTML
      const html = await renderMarkdown(markdown);

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
      badge.title = 'Rendered by Markdown Parser Extension';

      // Add elements to body
      document.body.appendChild(container);
      document.body.appendChild(badge);

      // Process mermaid diagrams
      await processMermaidDiagrams(container);

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
    
    // Check 1: URL has markdown extension
    if (hasMarkdownExtension(url)) {
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
