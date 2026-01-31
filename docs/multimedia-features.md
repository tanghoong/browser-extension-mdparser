# Multimedia & Special Rendering Features

This document covers advanced rendering features for multimedia content and custom code blocks.

---

## 1. YouTube Video Embedding

### Description
Automatically detect YouTube links and render them as embedded iframe players for in-page playback.

### User Story
As a user, I want YouTube videos embedded in my markdown to play directly in the page without opening a new tab.

### Implementation Difficulty
**Medium** - Requires URL parsing, iframe embedding, and presentation mode integration

### Technical Details

#### 1.1 YouTube Link Detection

Support multiple YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

#### 1.2 Implementation

**File**: `content.js`

```javascript
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
  // Find all links
  const links = container.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
  
  links.forEach((link) => {
    const videoId = getYouTubeVideoId(link.href);
    if (!videoId) return;
    
    // Create wrapper for responsive iframe
    const wrapper = document.createElement('div');
    wrapper.className = 'youtube-embed-wrapper';
    wrapper.setAttribute('data-video-id', videoId);
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'youtube-embed';
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    
    wrapper.appendChild(iframe);
    
    // Replace link with embedded player
    // Check if link is in its own paragraph
    const parent = link.parentElement;
    if (parent.tagName === 'P' && parent.childNodes.length === 1) {
      parent.parentNode.replaceChild(wrapper, parent);
    } else {
      link.parentNode.replaceChild(wrapper, link);
    }
  });
}
```

**CSS Styles**:

```css
.youtube-embed-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  margin: 20px 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.youtube-embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

/* Print styles - show link instead of iframe */
@media print {
  .youtube-embed-wrapper::after {
    content: "YouTube: https://youtube.com/watch?v=" attr(data-video-id);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #f0f0f0;
    padding: 20px;
    border-radius: 4px;
  }
  
  .youtube-embed {
    display: none;
  }
}
```

#### 1.3 Presentation Mode Integration

Stop videos when scrolling away from slide:

```javascript
/**
 * Stop all YouTube videos in presentation mode
 */
function stopAllYouTubeVideos() {
  const iframes = document.querySelectorAll('.youtube-embed');
  iframes.forEach((iframe) => {
    // Send postMessage to stop video
    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  });
}

/**
 * In presentation mode slide change handler
 */
function onSlideChange(newSlideIndex) {
  // Stop all videos when changing slides
  stopAllYouTubeVideos();
  
  // Show new slide
  showSlide(newSlideIndex);
}
```

---

## 2. Audio File Support

### Description
Detect audio file links and render them as HTML5 audio players for in-page playback.

### User Story
As a user, I want to play audio files referenced in my markdown directly in the browser.

### Implementation Difficulty
**Easy-Medium** - HTML5 audio API is straightforward

### Technical Details

#### 2.1 Supported Audio Formats
- MP3 (`.mp3`)
- WAV (`.wav`)
- OGG (`.ogg`)
- M4A (`.m4a`)
- FLAC (`.flac`)

#### 2.2 Implementation

**File**: `content.js`

```javascript
/**
 * Check if URL is an audio file
 */
function isAudioFile(url) {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma'];
  const urlLower = url.toLowerCase();
  return audioExtensions.some(ext => urlLower.endsWith(ext));
}

/**
 * Convert audio links to embedded players
 */
function embedAudioPlayers(container) {
  const links = container.querySelectorAll('a');
  
  links.forEach((link) => {
    if (!isAudioFile(link.href)) return;
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'audio-player-wrapper';
    
    // Create audio element
    const audio = document.createElement('audio');
    audio.className = 'audio-player';
    audio.controls = true;
    audio.preload = 'metadata';
    
    // Create source
    const source = document.createElement('source');
    source.src = link.href;
    source.type = getAudioMimeType(link.href);
    
    audio.appendChild(source);
    
    // Create label with filename
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
 * Get MIME type for audio file
 */
function getAudioMimeType(url) {
  const ext = url.toLowerCase().split('.').pop();
  const mimeTypes = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'm4a': 'audio/mp4',
    'flac': 'audio/flac',
    'aac': 'audio/aac'
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
 * Stop all audio in presentation mode
 */
function stopAllAudio() {
  const audioElements = document.querySelectorAll('.audio-player');
  audioElements.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}
```

**CSS Styles**:

```css
.audio-player-wrapper {
  margin: 20px 0;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.audio-label {
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.audio-label::before {
  content: '🎵';
  margin-right: 8px;
  font-size: 18px;
}

.audio-player {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  outline: none;
}

/* Custom audio player styling (optional - browser-dependent) */
.audio-player::-webkit-media-controls-panel {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}

@media print {
  .audio-player-wrapper::after {
    content: "Audio: " attr(data-src);
    color: #333;
  }
  
  .audio-player {
    display: none;
  }
}
```

---

## 3. ChatBlock - Custom Chat Interface Renderer

### Description
Special code block type that renders chat conversations with theme-specific styling (WhatsApp, Telegram, iMessage, etc.).

### User Story
As a user, I want to display chat conversations in my documentation with authentic messaging app themes.

### Implementation Difficulty
**Medium** - Requires custom parser and CSS theming

### Syntax

````markdown
```chatblock
WHATSAPP
userA: Hello there!
userB: Hi! How are you?
userA: I'm good, thanks!
```
````

````markdown
```chatblock
TELEGRAM
alice: Check out this cool feature
bob: That's amazing!
bob: How does it work?
alice: Let me explain...
```
````

### Technical Details

#### 3.1 Supported Themes
- **WHATSAPP** - WhatsApp style (green theme)
- **TELEGRAM** - Telegram style (blue theme)
- **IMESSAGE** - iMessage style (blue/gray bubbles)
- **SLACK** - Slack style
- **DISCORD** - Discord style

#### 3.2 Implementation

**File**: `content.js`

```javascript
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
        isRight: user === firstUser // First user always on right
      });
    }
  }
  
  return { theme, messages };
}

/**
 * Render chat block with theme
 */
function renderChatBlock(chatData) {
  const { theme, messages } = chatData;
  
  const container = document.createElement('div');
  container.className = `chat-block chat-theme-${theme.toLowerCase()}`;
  
  // Add header
  const header = document.createElement('div');
  header.className = 'chat-header';
  header.innerHTML = `
    <span class="chat-theme-badge">${theme}</span>
    <span class="chat-theme-icon">${getChatIcon(theme)}</span>
  `;
  container.appendChild(header);
  
  // Add messages
  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'chat-messages';
  
  messages.forEach((msg, index) => {
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
```

**CSS Styles**:

```css
/* Base chat block styles */
.chat-block {
  margin: 20px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.chat-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: white;
}

.chat-theme-badge {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.chat-theme-icon {
  font-size: 20px;
}

.chat-messages {
  padding: 16px;
  min-height: 100px;
}

.chat-bubble {
  margin-bottom: 12px;
  max-width: 70%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-left {
  margin-right: auto;
}

.chat-right {
  margin-left: auto;
  text-align: right;
}

.chat-user {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
  opacity: 0.8;
}

.chat-text {
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

/* WhatsApp Theme */
.chat-theme-whatsapp .chat-header {
  background: #075e54;
}

.chat-theme-whatsapp .chat-messages {
  background: #ece5dd url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23e5ddd5" width="100" height="100"/></svg>');
}

.chat-theme-whatsapp .chat-left .chat-text {
  background: white;
  color: #303030;
}

.chat-theme-whatsapp .chat-right .chat-text {
  background: #dcf8c6;
  color: #303030;
}

.chat-theme-whatsapp .chat-left .chat-user {
  color: #075e54;
}

.chat-theme-whatsapp .chat-right .chat-user {
  color: #128c7e;
}

/* Telegram Theme */
.chat-theme-telegram .chat-header {
  background: #0088cc;
}

.chat-theme-telegram .chat-messages {
  background: #ffffff;
}

.chat-theme-telegram .chat-left .chat-text {
  background: #f0f0f0;
  color: #000;
}

.chat-theme-telegram .chat-right .chat-text {
  background: #0088cc;
  color: white;
}

.chat-theme-telegram .chat-left .chat-user {
  color: #0088cc;
}

.chat-theme-telegram .chat-right .chat-user {
  color: #006ba1;
}

/* iMessage Theme */
.chat-theme-imessage .chat-header {
  background: #007aff;
}

.chat-theme-imessage .chat-messages {
  background: #f2f2f7;
}

.chat-theme-imessage .chat-left .chat-text {
  background: #e5e5ea;
  color: #000;
}

.chat-theme-imessage .chat-right .chat-text {
  background: #007aff;
  color: white;
}

.chat-theme-imessage .chat-text {
  border-radius: 20px;
}

/* Slack Theme */
.chat-theme-slack .chat-header {
  background: #4a154b;
}

.chat-theme-slack .chat-messages {
  background: white;
  border-left: 4px solid #4a154b;
}

.chat-theme-slack .chat-bubble {
  max-width: 100%;
  text-align: left;
}

.chat-theme-slack .chat-text {
  background: transparent;
  padding: 4px 0;
  border-radius: 0;
  color: #1d1c1d;
}

.chat-theme-slack .chat-user {
  color: #1d1c1d;
  font-weight: 900;
}

/* Discord Theme */
.chat-theme-discord .chat-header {
  background: #5865f2;
}

.chat-theme-discord .chat-messages {
  background: #36393f;
}

.chat-theme-discord .chat-bubble {
  max-width: 100%;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.chat-theme-discord .chat-user {
  color: #fff;
  margin-bottom: 0;
  min-width: 80px;
}

.chat-theme-discord .chat-text {
  background: transparent;
  padding: 0;
  border-radius: 0;
  color: #dcddde;
}

/* Print styles */
@media print {
  .chat-block {
    page-break-inside: avoid;
    border: 1px solid #ddd;
  }
  
  .chat-messages {
    background: white !important;
  }
}
```

#### 3.3 Integration in displayRenderedContent

```javascript
async function displayRenderedContent(markdown) {
  try {
    const html = renderMarkdown(markdown);
    
    document.body.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'md-parser-container';
    container.innerHTML = html;
    
    const badge = document.createElement('div');
    badge.className = 'md-parser-badge';
    badge.textContent = 'MD';
    badge.title = 'Rendered by Markdown Parser Extension';
    
    document.body.appendChild(container);
    document.body.appendChild(badge);
    
    // Process special content types
    await processMermaidDiagrams(container);
    processChatBlocks(container);           // NEW: Process chat blocks
    embedYouTubeVideos(container);          // NEW: Embed YouTube videos
    embedAudioPlayers(container);           // NEW: Embed audio players
    
    // ... rest of the code
  } catch (error) {
    console.error('Markdown Parser: Error rendering content', error);
  }
}
```

---

## 4. Presentation Mode Media Controls

### Description
When in presentation mode, stop all media (video/audio) when navigating away from slides.

### Implementation

```javascript
/**
 * Stop all media on slide change
 */
function stopAllMediaOnSlide(slideElement) {
  // Stop YouTube videos
  const youtubeIframes = slideElement.querySelectorAll('.youtube-embed');
  youtubeIframes.forEach((iframe) => {
    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  });
  
  // Stop audio players
  const audioPlayers = slideElement.querySelectorAll('.audio-player');
  audioPlayers.forEach((audio) => {
    audio.pause();
  });
  
  // Could also stop HTML5 videos if we add support for those
  const videos = slideElement.querySelectorAll('video');
  videos.forEach((video) => {
    video.pause();
  });
}

/**
 * Enhanced slide navigation
 */
function navigateToSlide(direction) {
  // Stop media on current slide before leaving
  const currentSlide = document.querySelector('.slide.active');
  if (currentSlide) {
    stopAllMediaOnSlide(currentSlide);
    currentSlide.classList.remove('active');
  }
  
  // Navigate to new slide
  // ... slide navigation logic
}
```

---

## Testing Checklist

### YouTube Embedding
- [ ] Test standard YouTube URL
- [ ] Test shortened youtu.be URL
- [ ] Test embed URL format
- [ ] Verify responsive sizing
- [ ] Test in presentation mode (video stops on slide change)
- [ ] Verify print output shows URL instead of player

### Audio Players
- [ ] Test MP3 files
- [ ] Test other formats (WAV, OGG)
- [ ] Test relative and absolute URLs
- [ ] Verify controls work properly
- [ ] Test multiple audio files on same page
- [ ] Verify audio stops in presentation mode

### ChatBlocks
- [ ] Test WhatsApp theme
- [ ] Test Telegram theme
- [ ] Test with multiple messages
- [ ] Test with long messages (word wrap)
- [ ] Verify first user always on right
- [ ] Test all supported themes
- [ ] Verify print output looks good

---

## Future Enhancements

- **Video files**: Direct MP4/WebM file support
- **Spotify embeds**: Detect and embed Spotify links
- **SoundCloud**: Embed SoundCloud tracks
- **Twitter embeds**: Embed tweets
- **CodePen embeds**: Embed CodePen demos
- **More chat themes**: Add Facebook Messenger, WeChat, Line, etc.
- **Chat timestamps**: Optional timestamp support in chatblocks
- **Chat reactions**: Emoji reactions in chat bubbles
- **Chat attachments**: Support for image/file attachments in chatblocks
