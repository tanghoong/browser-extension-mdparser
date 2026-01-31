# Feature Requirements

This document outlines the planned features for the Markdown Parser browser extension, organized by implementation difficulty.

## Phase 1: Easy Features (Quick Wins)

### 1.1 Toggle Rendered/Raw Display
- **Description**: Clicking the "MD" badge in top-right corner toggles between rendered markdown and raw source
- **User Story**: As a user, I want to quickly switch between rendered and raw markdown to verify the source
- **Implementation**: 
  - Click on MD badge switches view
  - Store current view state
  - Add visual indicator for current mode

### 1.2 Copy Code Blocks
- **Description**: Add a "Copy" button to all code blocks for easy copying
- **User Story**: As a developer, I want to quickly copy code snippets from markdown files
- **Implementation**:
  - Add copy button to each `<pre><code>` block
  - Show "Copied!" feedback on click
  - Use Clipboard API

### 1.3 Default PDF Footer
- **Description**: When using Ctrl+P (Save as PDF), add default footer text
- **User Story**: As a user, I want rendered PDFs to indicate they were created by this extension
- **Implementation**:
  - Add "Powered by Markdown Parser" footer to print stylesheet
  - Use CSS `@page` rules for print media

### 1.4 Image Rendering
- **Description**: Properly render images referenced in markdown
- **User Story**: As a user, I want to see images embedded in my markdown files
- **Implementation**:
  - Already handled by marked.js
  - Ensure relative paths resolve correctly
  - Add error handling for broken images

---

## Phase 2: Medium Features

### 2.1 Link Confirmation Modal
- **Description**: Show confirmation modal when clicking any link in rendered content
- **User Story**: As a user, I want to confirm before opening external links
- **Implementation**:
  - Intercept all link clicks
  - Show modal with link URL
  - Options: "Open in New Tab" or "Cancel"
  - Remember "Don't ask again" preference (optional)

### 2.2 Copy Mermaid Block Code
- **Description**: Add "Copy Code" button to mermaid diagram blocks
- **User Story**: As a user, I want to copy the mermaid source code
- **Implementation**:
  - Store original mermaid code as data attribute
  - Add copy button next to rendered diagram
  - Copy raw mermaid syntax to clipboard

### 2.3 Download Mermaid as Image
- **Description**: Export rendered mermaid diagrams as PNG/SVG images
- **User Story**: As a user, I want to save mermaid diagrams for use in other documents
- **Implementation**:
  - Add "Download" button to mermaid blocks
  - Export SVG directly or convert to PNG using canvas
  - Use browser download API

### 2.4 Mermaid Zoom and Pan Controls
- **Description**: For large mermaid diagrams, add zoom in/out, fit-to-container, and pan controls
- **User Story**: As a user, I want to navigate large complex diagrams easily
- **Implementation**:
  - Add zoom controls (+, -, fit)
  - Implement pan/scroll for overflow
  - Use CSS transforms or SVG manipulation
  - Add mousewheel zoom support

### 2.5 A4 Page Size Toggle (Vertical/Horizontal)
- **Description**: Toggle between portrait and landscape layout for PDF printing
- **User Story**: As a user, I want to choose page orientation for better PDF output
- **Implementation**:
  - Add orientation toggle button in top-right
  - Apply CSS classes for A4 portrait/landscape
  - Update print styles accordingly
  - Default: A4 vertical (portrait)

### 2.6 Frontmatter Sidebar
- **Description**: Extract YAML/TOML frontmatter and display in toggleable right sidebar
- **User Story**: As a user, I want to see document metadata in a dedicated panel
- **Implementation**:
  - Parse frontmatter from markdown (before first content)
  - Render as key-value pairs in sidebar
  - Maintain original order
  - Support image thumbnails for image URLs
  - Toggle button to show/hide sidebar
  - Example frontmatter:
    ```yaml
    ---
    title: My Document
    author: John Doe
    date: 2026-01-31
    image: ./cover.png
    ---
    ```

---

## Phase 3: Advanced Features

### 3.1 Customizable PDF Header/Footer
- **Description**: Allow users to customize header/footer text when printing to PDF
- **User Story**: As a user, I want to add custom headers/footers to my PDF exports
- **Implementation**:
  - Show dialog when Ctrl+P is pressed
  - Input fields for header/footer text
  - Support variables: `{title}`, `{date}`, `{page}`
  - Save preferences per domain/file
  - Fallback to default "Powered by Markdown Parser"

### 3.2 Slideshow Presentation Mode
- **Description**: Detect slide separators (`---`) and offer presentation mode
- **User Story**: As a presenter, I want to use my markdown file as presentation slides
- **Implementation**:
  - Detect multiple `---` horizontal rules as slide separators
  - Show "Presentation Mode" button when detected
  - Each section between `---` becomes a slide
  - Navigation controls:
    - Left mouse click → next slide
    - Right mouse click → previous slide
    - Spacebar → next slide
    - Arrow keys → navigate slides
  - Show slide counter (e.g., "3 / 12")
  - Press ESC to exit presentation mode

### 3.3 Presentation Drawing Tools
- **Description**: In presentation mode, allow temporary drawing/highlighting on slides
- **User Story**: As a presenter, I want to highlight and annotate slides during presentation
- **Implementation**:
  - Add drawing toolbar in presentation mode
  - Color palette for pen colors
  - Drawing modes: pen, highlighter
  - "Reset Drawing" button to clear current slide
  - Drawings are temporary (not saved)
  - Use HTML5 Canvas overlay

### 3.4 Laser Pointer Mode
- **Description**: Option to display mouse cursor as a laser pointer in presentation mode
- **User Story**: As a presenter, I want to emphasize points with a laser pointer effect
- **Implementation**:
  - Toggle button in presentation toolbar
  - Replace cursor with red dot/beam effect
  - Add trailing effect for visibility
  - Option to choose laser color

---

## Implementation Priority

### Recommended Implementation Order:

1. **Sprint 1** (Quick Wins)
   - Toggle rendered/raw display
   - Copy code blocks
   - Default PDF footer
   - Image rendering verification

2. **Sprint 2** (User Experience)
   - Link confirmation modal
   - Copy mermaid code
   - Download mermaid as image
   - Mermaid zoom/pan controls

3. **Sprint 3** (Layout & Metadata)
   - A4 page size toggle
   - Frontmatter sidebar

4. **Sprint 4** (Advanced PDF)
   - Customizable PDF header/footer

5. **Sprint 5** (Presentation Mode - Part 1)
   - Slideshow detection and basic navigation
   - Slide counter and keyboard controls

6. **Sprint 6** (Presentation Mode - Part 2)
   - Drawing tools
   - Laser pointer mode

---

## Technical Considerations

### Dependencies
- Clipboard API (already available)
- Canvas API (for drawing and image export)
- CSS `@page` rules (for PDF printing)
- YAML/TOML parser (for frontmatter)
- SVG manipulation (for mermaid export)

### Browser Compatibility
- Target: Chrome, Edge, Brave (Chromium-based)
- Manifest V3 compliance
- No external CDN dependencies (use local libraries)

### Performance
- Large mermaid diagrams: use virtualization or lazy rendering
- Presentation mode: optimize slide transitions
- Drawing canvas: use requestAnimationFrame for smooth rendering

### User Experience
- Maintain current functionality while adding features
- Non-intrusive UI additions
- Keyboard shortcuts for power users
- Responsive design for different screen sizes

---

## Future Enhancements (Backlog)

- **Export to HTML**: Save rendered markdown as standalone HTML file
- **Table of Contents**: Auto-generate TOC from headings
- **Dark Mode**: Theme toggle for rendered content
- **Search**: In-document search functionality
- **Print Preview**: Custom print preview before PDF generation
- **Slide Templates**: Pre-designed themes for presentation mode
- **Export Slides**: Export presentation as PDF or images
- **Speaker Notes**: Support for presenter notes in slides
- **Slide Timer**: Presentation timer and progress indicator
- **Remote Control**: Phone/tablet as presentation remote
