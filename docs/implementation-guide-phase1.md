# Implementation Guide - Phase 1 (Easy Features)

This guide provides detailed implementation steps for the quick-win features.

## 1. Toggle Rendered/Raw Display

### Files to Modify
- `content.js`
- `styles.css`

### Implementation Steps

1. **Add state management**
```javascript
const STATE = {
  isRendered: true,
  rawContent: ''
};
```

2. **Update MD badge click handler**
```javascript
function setupBadgeToggle(badge, container, rawContent) {
  badge.style.cursor = 'pointer';
  badge.addEventListener('click', () => {
    STATE.isRendered = !STATE.isRendered;
    
    if (STATE.isRendered) {
      // Show rendered view
      container.style.display = 'block';
      document.body.querySelector('pre.raw-content')?.remove();
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
```

3. **Add CSS for raw view**
```css
pre.raw-content {
  margin: 20px;
  padding: 20px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
```

---

## 2. Copy Code Blocks

### Files to Modify
- `content.js`
- `styles.css`

### Implementation Steps

1. **Add copy button to all code blocks**
```javascript
function addCopyButtonsToCodeBlocks(container) {
  const codeBlocks = container.querySelectorAll('pre > code');
  
  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    
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
```

2. **Add CSS for copy button**
```css
.code-block-wrapper {
  position: relative;
  margin: 1em 0;
}

.copy-code-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
  z-index: 10;
}

.code-block-wrapper:hover .copy-code-btn {
  opacity: 1;
}

.copy-code-btn:hover {
  background: #34495e;
}

.copy-code-btn.copied {
  background: #27ae60;
}

.copy-code-btn:active {
  transform: scale(0.95);
}
```

---

## 3. Default PDF Footer

### Files to Modify
- `styles.css`

### Implementation Steps

1. **Add print media query with @page rules**
```css
@media print {
  /* Hide UI elements */
  .md-parser-badge {
    display: none !important;
  }
  
  .copy-code-btn {
    display: none !important;
  }
  
  /* Page setup */
  @page {
    margin: 2cm;
    size: A4 portrait;
    
    @bottom-center {
      content: "Powered by Markdown Parser";
      font-size: 10pt;
      color: #666;
    }
    
    @bottom-right {
      content: "Page " counter(page);
      font-size: 10pt;
      color: #666;
    }
  }
  
  /* Content styles for print */
  .md-parser-container {
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
  
  /* Avoid page breaks */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
  }
  
  pre, blockquote, table {
    page-break-inside: avoid;
  }
  
  /* Code blocks */
  pre {
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }
  
  /* Links */
  a {
    text-decoration: underline;
    color: #0066cc;
  }
  
  a[href^="http"]:after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
  
  /* Images */
  img {
    max-width: 100%;
    page-break-inside: avoid;
  }
}
```

**Note**: Browser support for `@page` at-rules varies. Chrome has limited support. For full control, consider:
- Using CSS to add footer element that only shows in print
- Or intercepting `window.print()` to show custom dialog first

2. **Alternative approach using fixed footer element**
```javascript
function addPrintFooter() {
  const footer = document.createElement('div');
  footer.className = 'print-footer';
  footer.innerHTML = `
    <span>Powered by Markdown Parser</span>
    <span class="print-page-number"></span>
  `;
  document.body.appendChild(footer);
}
```

```css
.print-footer {
  display: none;
}

@media print {
  .print-footer {
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px;
    font-size: 10pt;
    color: #666;
    border-top: 1px solid #ddd;
  }
}
```

---

## 4. Image Rendering Verification

### Files to Modify
- `content.js`

### Implementation Steps

1. **Verify existing image resolution works**
The `resolveRelativeUrls()` function already handles images. Test and add error handling:

```javascript
function enhanceImageRendering(container) {
  const images = container.querySelectorAll('img');
  
  images.forEach((img) => {
    // Add loading indicator
    img.style.opacity = '0';
    
    img.addEventListener('load', () => {
      img.style.opacity = '1';
      img.style.transition = 'opacity 0.3s';
    });
    
    img.addEventListener('error', () => {
      // Show broken image placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'broken-image';
      placeholder.innerHTML = `
        <div class="broken-image-icon">🖼️</div>
        <div class="broken-image-text">Image not found</div>
        <div class="broken-image-url">${img.alt || img.src}</div>
      `;
      img.parentNode.replaceChild(placeholder, img);
    });
    
    // Add click to zoom (optional enhancement)
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'image-modal';
      modal.innerHTML = `
        <img src="${img.src}" alt="${img.alt}">
        <button class="close-modal">×</button>
      `;
      document.body.appendChild(modal);
      
      modal.addEventListener('click', () => {
        modal.remove();
      });
    });
  });
}
```

2. **Add CSS for image enhancements**
```css
.md-parser-container img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.broken-image {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 4px;
  color: #666;
  margin: 10px 0;
}

.broken-image-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.broken-image-text {
  font-weight: bold;
  margin-bottom: 5px;
}

.broken-image-url {
  font-size: 12px;
  font-family: monospace;
  color: #999;
  word-break: break-all;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: zoom-out;
}

.image-modal img {
  max-width: 90%;
  max-height: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.image-modal .close-modal {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  border: none;
  font-size: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  line-height: 1;
}
```

---

## Integration Checklist

After implementing each feature:

- [ ] Test with sample markdown files
- [ ] Verify no regression in existing features
- [ ] Check browser console for errors
- [ ] Test edge cases (empty files, large files, special characters)
- [ ] Verify accessibility (keyboard navigation, screen readers)
- [ ] Test print functionality (Ctrl+P)
- [ ] Update documentation

---

## Testing Scenarios

### Toggle View
1. Load markdown file
2. Click MD badge → should show raw markdown
3. Click RAW badge → should show rendered view
4. Verify badge text changes appropriately

### Copy Code
1. Load markdown with code blocks
2. Hover over code block → copy button appears
3. Click copy → button shows "Copied!"
4. Paste in text editor → code matches

### PDF Export
1. Load markdown file
2. Press Ctrl+P
3. Verify footer appears
4. Save as PDF
5. Open PDF → verify footer text

### Images
1. Load markdown with images
2. Verify images load correctly
3. Test broken image handling
4. Test relative and absolute paths
