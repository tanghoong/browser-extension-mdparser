# Markdown Parser Browser Extension - Roadmap

> A comprehensive Chrome extension for rendering Markdown files with advanced features

---

## 🎯 Project Vision

Transform the browser into a powerful Markdown viewer with presentation capabilities, multimedia support, custom renderers, and advanced document features - all while working offline.

---

## 📊 Current Status

**Version:** 1.0.0  
**Status:** Phase 6 Complete ✅  
**Last Updated:** January 2026

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

### Phase 4 Features ✅
- ✅ Text-to-Speech with full controls (play/pause/stop/speed/voice)
- ✅ JSON tree viewer with expand/collapse and path copying
- ✅ Mermaid diagram PNG download

### Phase 5 Features ✅
- ✅ Presentation Mode with slide detection (split by `---`)
- ✅ Full-screen slideshow with keyboard/mouse navigation
- ✅ Drawing tools (pen, highlighter) with canvas overlay
- ✅ Laser pointer with animated effect
- ✅ Presentation toolbar with controls
- ✅ Slide counter display

### Phase 6 Features ✅
- ✅ Dark/Light mode toggle with system preference detection
- ✅ In-document search with highlighting (Ctrl+F)
- ✅ Reading progress tracker with statistics
- ✅ Word count, character count, and reading time estimates

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

### ✅ Phase 4: Interactive Features (COMPLETED)
**Timeline:** Week 4  
**Status:** 100% Complete  
**Priority:** Medium

#### Features Delivered
- [x] **Text-to-Speech Controls**
  - [x] Play/pause/stop buttons in fixed toolbar
  - [x] Speech rate control slider (0.5x - 2.0x)
  - [x] Voice selection dropdown (system voices)
  - [x] Highlight current paragraph being read (yellow background)
  - [x] Auto-scroll to keep reading position visible
  - [x] Reads all paragraphs, headings, and list items
  
- [x] **JSON Tree Viewer**
  - [x] Auto-detect and replace `json` code blocks
  - [x] Interactive collapsible tree view
  - [x] Type-based syntax highlighting (string, number, boolean, null)
  - [x] Copy JSON path on hover for any property
  - [x] Expand/collapse all buttons in toolbar
  - [x] Copy entire JSON to clipboard
  - [x] Clean, readable layout with proper indentation
  
- [x] **Mermaid Download Feature**
  - [x] Download button on each diagram (top-right corner)
  - [x] Export as PNG format
  - [x] High-quality output with white background
  - [x] Timestamp-based filename generation
  - [x] Client-side Canvas API conversion

**Documentation:**
- [x] Phase 4 demo file created with comprehensive examples
- [x] All features tested and working

---

### ✅ Phase 5: Presentation Mode (COMPLETED)
**Timeline:** Week 5  
**Status:** 100% Complete  
**Priority:** Medium

#### Features Delivered

##### 5.1 Basic Slideshow ✅
- [x] **Slide Detection & Navigation**
  - [x] Detect multiple `---` as slide separators
  - [x] "Presentation Mode" button when detected
  - [x] Navigation: left click (next), right click (prev), spacebar (next)
  - [x] Arrow keys navigation (Home/End support)
  - [x] Slide counter (e.g., "3 / 12")
  - [x] ESC to exit presentation mode
  - [x] stopAllMedia() integration on slide change

##### 5.2 Presentation Tools ✅
- [x] **Drawing & Annotation Tools**
  - [x] Drawing toolbar in presentation mode
  - [x] Drawing modes: pen, highlighter
  - [x] "Clear Drawing" button
  - [x] Temporary drawings (canvas-based)
  - [x] HTML5 Canvas overlay
  
- [x] **Laser Pointer Mode**
  - [x] Toggle button in presentation toolbar
  - [x] Red animated laser pointer effect
  - [x] Pulsing animation for visibility
  - [x] Follows mouse movement

##### 5.3 Implementation Details ✅
- [x] Modular architecture (`lib/presentation-mode.js`)
- [x] Separate styles (`lib/phase5-styles.css`)
- [x] Full-screen overlay with dark background
- [x] Responsive design for all screen sizes
- [x] Print-friendly output (hides overlays)

**Documentation:**
- [x] Phase 5 demo file created (`test/phase5-demo.md`) with 21 slides
- [x] Comprehensive examples including code, diagrams, multimedia

---

### ✅ Phase 6: Advanced UI Features (COMPLETED)
**Timeline:** Week 6  
**Status:** 100% Complete  
**Priority:** High

#### Features Delivered

##### 6.1 Dark Mode Toggle ✅
- [x] **Theme Management**
  - [x] System preference detection (`prefers-color-scheme`)
  - [x] Manual toggle button (☀️/🌙)
  - [x] LocalStorage persistence
  - [x] Smooth theme transitions
  - [x] All components styled for dark mode
  - [x] Print-friendly (forces light mode)

##### 6.2 Document Search ✅
- [x] **In-Document Search**
  - [x] Search overlay with Ctrl+F shortcut
  - [x] Real-time search highlighting
  - [x] Navigation between matches (Enter/Shift+Enter)
  - [x] Match counter ("3 of 15")
  - [x] ESC to close
  - [x] Active match highlighting
  - [x] Text node search (preserves structure)

##### 6.3 Reading Progress ✅
- [x] **Progress Tracker**
  - [x] Top progress bar (0-100%)
  - [x] Expandable stats panel
  - [x] Word count display
  - [x] Character count display
  - [x] Reading time estimate (225 WPM)
  - [x] Real-time scroll tracking
  - [x] Responsive design

##### 6.4 Implementation Details ✅
- [x] Modular architecture (`lib/phase6-features.js`)
- [x] Separate styles (`lib/phase6-styles.css`)
- [x] Dark mode support for all features
- [x] Keyboard accessibility
- [x] Mobile responsive

**Documentation:**
- [x] Features integrated into main extension
- [x] All Phase 6 components tested

---

### 📋 Completed Phases Summary

**Phase 1:** Foundation & Quick Wins ✅  
**Phase 2:** Enhanced User Experience ✅  
**Phase 3:** Multimedia Integration ✅  
**Phase 4:** Advanced Features (TTS, JSON, Mermaid PNG) ✅  
**Phase 5:** Presentation Mode ✅  
**Phase 6:** Dark Mode, Search, Reading Progress ✅

**Total Features Delivered:** 40+ features across 6 phases

---

### 🚀 Future Phases (Backlog)

### 📄 Phase 7: Advanced PDF & Layout Features (PLANNED)
**Timeline:** Week 7-8  
**Status:** 0% Complete  
**Priority:** Low

#### 7.1 Layout Options
- [ ] **A4 Page Size Toggle**
  - [ ] Portrait/landscape orientation toggle
  - [ ] Button in top-right corner
  - [ ] Update print styles accordingly
  - **Effort:** Medium | **Priority:** Low

#### 7.2 Metadata Display
- [ ] **Frontmatter Sidebar**
  - [ ] Parse YAML/TOML frontmatter
  - [ ] Display in toggleable right sidebar
  - [ ] Render image thumbnails for image URLs
  - [ ] Maintain original key order
  - **Effort:** Medium | **Priority:** Low

---

### 📝 Phase 8: Advanced Customization (PLANNED)
**Timeline:** Week 9-10  
**Status:** 0% Complete  
**Priority:** Low

#### 8.1 Advanced PDF Features
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
- [x] Dark mode theme toggle ✅ (Phase 6)
- [x] In-document search functionality ✅ (Phase 6)
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
- ✅ [test/phase2-demo.md](test/phase2-demo.md) - Phase 2 demo file
- ✅ [test/phase3-demo.md](test/phase3-demo.md) - Phase 3 demo file
- ✅ [test/phase4-demo.md](test/phase4-demo.md) - Phase 4 demo file
- ✅ [test/phase5-demo.md](test/phase5-demo.md) - Phase 5 demo file (21 slides)

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
- ✅ Phase 1-6 complete (40+ features)
- ✅ Presentation mode with drawing tools
- ✅ Dark mode toggle
- ✅ In-document search
- ✅ Reading progress tracker

### v1.1.0 - Planned (February 2026)
- Advanced PDF export features
- Frontmatter metadata display
- Custom CSS themes

---

## 📞 Contact & Support

- **Repository:** github.com/tanghoong/browser-extension-mdparser
- **Issues:** Use GitHub Issues for bug reports
- **Discussions:** Use GitHub Discussions for feature requests

---

**Last Updated:** January 31, 2026  
**Next Review:** February 7, 2026  
**Status:** 🟢 Active Development
