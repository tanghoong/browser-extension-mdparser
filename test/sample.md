# Sample Markdown Document

This is a test markdown file for the **Markdown Parser** browser extension.

## Features Showcase

### Text Formatting

- **Bold text** using double asterisks
- *Italic text* using single asterisks
- ~~Strikethrough~~ using double tildes
- `Inline code` using backticks

### Lists

#### Unordered List
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

#### Ordered List
1. First item
2. Second item
3. Third item

### Code Block

```javascript
function helloWorld() {
  console.log("Hello, World!");
  return true;
}
```

### Blockquote

> This is a blockquote.
> It can span multiple lines.

### Table

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### Link

[Visit GitHub](https://github.com)

### Image

![Placeholder Image](https://via.placeholder.com/150)

---

## Mermaid Diagrams

### Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Extension
    participant Browser
    
    User->>Browser: Open .md file
    Browser->>Extension: Trigger content script
    Extension->>Extension: Detect markdown
    Extension->>Extension: Parse & render
    Extension->>Browser: Display formatted content
    Browser->>User: Show beautiful markdown
```

### Class Diagram

```mermaid
classDiagram
    class MarkdownParser {
        +detect()
        +parse()
        +render()
    }
    class MermaidRenderer {
        +initialize()
        +renderDiagram()
    }
    MarkdownParser --> MermaidRenderer
```

---

## Task List

- [x] Markdown detection
- [x] Auto rendering
- [x] Mermaid support
- [x] File:// support
- [ ] Theme switching (v1.1)

---

*This document was rendered by the Markdown Parser browser extension.*
