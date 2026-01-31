# Markdown Parser Browser Extension - Roadmap

> A comprehensive Chrome extension for rendering Markdown files with advanced features

---

## 🎯 Project Vision

Transform the browser into a powerful Markdown viewer with presentation capabilities, multimedia support, custom renderers, and advanced document features - all while working offline.

---

## 📊 Current Status

**Version:** 1.0.0  
**Status:** Phase 3 Complete ✅  
**Last Updated:** January 2025

### Core Functionality ✅
- ✅ Auto-detect and render `.md` and `.txt` files
- ✅ Support Mermaid diagrams
- ✅ Local library files (no CDN dependencies)
- ✅ Clean, GitHub-style rendering
- ✅ Relative URL resolution

### Phase 1 Features ✅
- ✅ Toggle rendered/raw display (MD badge click)
- ✅ Copy buttons on all code blocks
- ✅ Scroll to top button
- ✅ Print styles with PDF footer
- ✅ Enhanced image rendering with error handling
- ✅ TXT file support

### Phase 2 Features ✅
- ✅ Syntax highlighting with Highlight.js (190+ languages)
- ✅ Auto-generated Table of Contents with scroll tracking
- ✅ Link confirmation modal for external links
- ✅ Copy buttons for Mermaid diagrams

### Phase 3 Features ✅
- ✅ YouTube video embedding (multiple URL formats)
- ✅ Audio file players (MP3, WAV, OGG, M4A, FLAC)
- ✅ ChatBlock custom renderer (5 themes)
- ✅ Media controls for presentation mode

---

## 🗓️ Development Roadmap

### ✅ Phase 1: Foundation & Quick Wins (COMPLETED)
**Timeline:** Week 1  
**Status:** 100% Complete

#### Features Delivered
- [x] Toggle rendered/raw markdown view
- [x] Copy code blocks to clipboard
- [x] Scroll to top button
- [x] TXT file format support
- [x] Print-friendly PDF export with footer
- [x] Enhanced image rendering with broken image handling

**Documentation:**
- [x] Feature requirements documented
- [x] Implementation guide created
- [x] Test demo file created

---

### ✅ Phase 2: Enhanced User Experience (COMPLETED)
**Timeline:** Week 2  
**Status:** 100% Complete  
**Priority:** High

#### Features Delivered
- [x] **Syntax Highlighting** - Highlight.js integration
  - [x] 190+ language support
  - [x] Language badges on code blocks
  - [x] Auto-detection for unlabeled blocks
  - [x] GitHub theme styling
  
- [x] **Table of Contents** - Auto-generated navigation
  - [x] Fixed left sidebar with smooth scrolling
  - [x] Active heading tracking
  - [x] Auto-generated from h1-h6
  - [x] Indented hierarchy display
  
- [x] **Link Safety** - Confirmation modal
  - [x] Intercept external link clicks
  - [x] Preview URL before opening
  - [x] Open in new tab or cancel
  - [x] Keyboard navigation (ESC to close)
  
- [x] **Mermaid Enhancements**
  - [x] Copy original code to clipboard
  - [x] Copy button on each diagram

**Documentation:**
- [x] Phase 2 demo file created
- [x] All features tested

---

### ✅ Phase 3: Multimedia & Special Renderers (COMPLETED)
**Timeline:** Week 3  
**Status:** 100% Complete  
**Priority:** High

#### Features Delivered
- [x] **YouTube Video Embedding**
  - [x] Auto-detect YouTube links (youtube.com/watch, youtu.be)
  - [x] Responsive iframe with 16:9 aspect ratio
  - [x] Fullscreen and controls support
  - [x] Multiple video support
  
- [x] **Audio File Players**
  - [x] HTML5 audio controls
  - [x] Support for MP3, WAV, OGG, M4A, FLAC, AAC, WMA
  - [x] Filename labels with music icon
  - [x] Clean embedded player UI
  
- [x] **ChatBlock Custom Renderer**
  - [x] Custom code block syntax (`chatblock`)
  - [x] 5 theme styles: WhatsApp, Telegram, iMessage, Slack, Discord
  - [x] Theme-specific colors and layouts
  - [x] Left/right bubble positioning
  - [x] User labels and message formatting
  
- [x] **Media Controls**
  - [x] stopAllMedia() function for presentation mode
  - [x] Pause YouTube videos
  - [x] Pause audio players

**Documentation:**
- [x] Phase 3 demo file created
- [x] All multimedia features tested

---

### 🚧 Phase 4: Interactive Features (IN PLANNING)
**Timeline:** Week 4  
**Status:** 0% Complete  
**Priority:** Medium

#### 4.1 Text-to-Speech
- [ ] **TTS Controls**
  - [ ] Play/pause/stop buttons in toolbar
  - [ ] Speech rate control slider
  - [ ] Voice selection dropdown
  - [ ] Highlight current paragraph being read
  - [ ] Auto-scroll with speech
  - **Effort:** Medium | **Priority:** Medium

#### 4.2 JSON Viewer
- [ ] **JSON Code Block Renderer**
  - [ ] Detect `json` code blocks
  - [ ] Collapsible tree view
  - [ ] Syntax highlighting for JSON
  - [ ] Copy JSON path on hover
  - [ ] Expand/collapse all buttons
  - **Effort:** Medium | **Priority:** Medium

#### 4.3 Additional Mermaid Features
- [ ] **Download Mermaid as Image**
  - [ ] Export as PNG/SVG
  - [ ] Download button on each diagram
  - **Effort:** Medium | **Priority:** Low

- [ ] **Mermaid Zoom & Pan Controls**
  - [ ] Zoom in/out buttons
  - [ ] Fit to container
  - [ ] Pan/scroll for large diagrams
  - [ ] Mousewheel zoom support
  - **Effort:** Medium | **Priority:** Low

**Documentation:**
- [ ] Phase 4 demo file to be created

---

### 🎯 Phase 5: Presentation Mode (IN PLANNING)
**Timeline:** Week 5  
**Status:** 0% Complete  
**Priority:** Medium

**Documentation:**
- [x] Features documented in `docs/multimedia-features.md`

---

### 🎤 Phase 4: Accessibility & Advanced UI (IN PLANNING)
**Timeline:** Week 6-7  
**Status:** 0% Complete  
**Priority:** Medium

#### 4.1 Text-to-Speech
- [ ] **TTS with Language Detection**
  - [ ] Built-in Web Speech API integration
  - [ ] Auto-detect English/Chinese
  - [ ] Sticky player that follows scroll
---

### 🎯 Phase 5: Presentation Mode (IN PLANNING)
**Timeline:** Week 5  
**Status:** 0% Complete  
**Priority:** Medium

#### 5.1 Basic Slideshow
- [ ] **Slide Detection & Navigation**
  - [ ] Detect multiple `---` as slide separators
  - [ ] "Presentation Mode" button when detected
  - [ ] Navigation: left click (next), right click (prev), spacebar (next)
  - [ ] Arrow keys navigation
  - [ ] Slide counter (e.g., "3 / 12")
  - [ ] ESC to exit presentation mode
  - [ ] stopAllMedia() integration on slide change
  - **Effort:** Hard | **Priority:** Medium

#### 5.2 Presentation Tools
- [ ] **Drawing & Annotation Tools**
  - [ ] Drawing toolbar in presentation mode
  - [ ] Color palette for pen colors
  - [ ] Drawing modes: pen, highlighter
  - [ ] "Reset Drawing" button
  - [ ] Temporary drawings (not saved)
  - [ ] HTML5 Canvas overlay
  - **Effort:** Hard | **Priority:** Low

- [ ] **Laser Pointer Mode**
  - [ ] Toggle button in presentation toolbar
  - [ ] Red dot/beam cursor effect
  - [ ] Trailing effect for visibility
  - [ ] Color selection option
  - **Effort:** Medium | **Priority:** Low

**Documentation:**
- [ ] Phase 5 demo file to be created

---

### 📄 Phase 6: Advanced PDF & Layout Features (IN PLANNING)
**Timeline:** Week 6  
**Status:** 0% Complete  
**Priority:** Low

#### 6.1 Layout Options
- [ ] **A4 Page Size Toggle**
  - [ ] Portrait/landscape orientation toggle
  - [ ] Button in top-right corner
  - [ ] Update print styles accordingly
  - **Effort:** Medium | **Priority:** Low

#### 6.2 Metadata Display
- [ ] **Frontmatter Sidebar**
  - [ ] Parse YAML/TOML frontmatter
  - [ ] Display in toggleable right sidebar
  - [ ] Render image thumbnails for image URLs
  - [ ] Maintain original key order
  - **Effort:** Medium | **Priority:** Low

#### 5.3 Media Control in Slides
- [ ] **Auto-stop media on slide change**
  - [ ] Stop YouTube videos when scrolling away
  - [ ] Pause audio players
  - [ ] Prevent background playback
  - **Effort:** Easy | **Priority:** Medium

---

### 📝 Phase 6: Advanced PDF & Customization (IN PLANNING)
**Timeline:** Week 11-12  
**Status:** 0% Complete  
**Priority:** Low

#### 6.1 Advanced PDF Features
- [ ] **Customizable PDF Header/Footer**
  - [ ] Dialog on Ctrl+P
  - [ ] Input fields for custom text
  - [ ] Support variables: `{title}`, `{date}`, `{page}`
  - [ ] Save preferences per domain/file
  - **Effort:** Hard | **Priority:** Low

---

## 📦 Technical Stack

### Core Libraries
- **marked.js** v9.1.6 - Markdown parser
- **mermaid.js** v10.6.1 - Diagram rendering
- **highlight.js** v11.9.0 - Syntax highlighting (planned)

### Browser APIs
- Clipboard API - Copy functionality
- Web Speech API - Text-to-speech
- Intersection Observer - Scroll tracking
- Canvas API - Drawing tools (planned)

### Development
- Manifest V3
- No external CDN dependencies
- Local library files only

---

## 🎯 Success Metrics

### User Experience
- [ ] Load time < 500ms for files < 1MB
- [ ] Smooth 60fps scrolling
- [ ] Keyboard accessible
- [ ] Print-friendly output

### Feature Adoption
- [ ] 90% of users use copy code feature
- [ ] 70% try presentation mode
- [ ] 50% use TTS feature

---

## 🚀 Future Enhancements (Backlog)

### Additional Features (Not Prioritized)
- [ ] Export to standalone HTML
- [ ] Dark mode theme toggle
- [ ] In-document search functionality
- [ ] Custom print preview
- [ ] Slide templates for presentations
- [ ] Export slides as PDF/images
- [ ] Speaker notes support
- [ ] Slide timer and progress indicator
- [ ] Remote control via phone/tablet
- [ ] Support for more file formats (YAML, TOML, CSV, MDX)
- [ ] Spotify embeds
- [ ] SoundCloud embeds
- [ ] Twitter/X embeds
- [ ] CodePen embeds
- [ ] More chat themes (Facebook Messenger, WeChat, Line)
- [ ] Chat timestamps and reactions
- [ ] Custom CSS themes
- [ ] Extension settings page
- [ ] Keyboard shortcuts customization

---

## 📚 Documentation Status

### Completed Documentation
- ✅ [README.md](README.md) - Project overview and setup
- ✅ [PRD-en.md](PRD-en.md) - Product requirements
- ✅ [docs/feature-requirements.md](docs/feature-requirements.md) - All feature specs
- ✅ [docs/implementation-guide-phase1.md](docs/implementation-guide-phase1.md) - Phase 1 guide
- ✅ [docs/multimedia-features.md](docs/multimedia-features.md) - Multimedia specs
- ✅ [docs/advanced-ui-features.md](docs/advanced-ui-features.md) - Advanced UI specs
- ✅ [test/features-demo.md](test/features-demo.md) - Phase 1 demo file

### Planned Documentation
- [ ] API documentation
- [ ] Contributing guidelines
- [ ] User manual
- [ ] Keyboard shortcuts reference
- [ ] Troubleshooting guide

---

## 🐛 Known Issues & Limitations

### Current Limitations
- Maximum file size: 1MB (for performance)
- Mermaid diagrams require manual refresh if too complex
- Print footer has limited browser support
- No support for custom markdown extensions yet

### Future Improvements
- Optimize for larger files (virtual scrolling)
- Better error handling and user feedback
- Localization support (i18n)
- Cloud sync for preferences

---

## 🤝 Contributing

This is an active development project. Features are being implemented in phases according to this roadmap.

### How to Contribute
1. Check the roadmap for planned features
2. Pick an unclaimed task from current phase
3. Follow implementation guides in `/docs`
4. Test with demo files in `/test`
5. Submit PR with clear description

---

## 📊 Version History

### v1.0.0 - Current (January 31, 2026)
- ✅ Core markdown rendering
- ✅ Mermaid diagram support
- ✅ Local library files (offline support)
- ✅ Phase 1 easy features complete

### v1.1.0 - Planned (February 2026)
- TOC with scroll tracking
- Syntax highlighting
- Link confirmation modal
- Mermaid enhancements

### v1.2.0 - Planned (March 2026)
- YouTube and audio embedding
- ChatBlock custom renderer
- JSON tree viewer
- TTS support

### v2.0.0 - Planned (April 2026)
- Presentation mode with slides
- Drawing and annotation tools
- Laser pointer mode

---

## 📞 Contact & Support

- **Repository:** github.com/tanghoong/browser-extension-mdparser
- **Issues:** Use GitHub Issues for bug reports
- **Discussions:** Use GitHub Discussions for feature requests

---

**Last Updated:** January 31, 2026  
**Next Review:** February 7, 2026  
**Status:** 🟢 Active Development
