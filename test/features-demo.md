# Easy Features Demo

This document demonstrates all the newly implemented easy features.

## Toggle Raw/Rendered View

Click the **MD** badge in the top-right corner to toggle between rendered and raw markdown view!

## Copy Code Blocks

Hover over any code block to see the copy button appear:

```javascript
// Example JavaScript code
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to Markdown Parser!`;
}

greet('Developer');
```

```python
# Example Python code
def calculate_sum(numbers):
    return sum(numbers)

result = calculate_sum([1, 2, 3, 4, 5])
print(f"Sum: {result}")
```

```bash
# Example Bash commands
echo "Hello World"
ls -la
cd /home/user
```

## Scroll to Top Button

Scroll down to see the floating "↑" button appear. Click it to smoothly scroll back to the top!

---

## Text File Support

This extension now also works with `.txt` files! Try opening any text file and it will be rendered if it contains markdown-like content.

---

## Image Rendering

### Valid Image
![Sample Image](https://via.placeholder.com/600x300/0366d6/ffffff?text=Markdown+Parser)

### Broken Image (Error Handling)
![This image doesn't exist](./nonexistent-image.png)

---

## Print to PDF

Press **Ctrl+P** (or Cmd+P on Mac) to print this page. Notice:
- The MD badge is hidden
- Copy buttons are hidden
- A "Powered by Markdown Parser" footer is added
- Links show their URLs
- Clean, professional layout

---

## More Content for Scrolling

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Section 1
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Section 2
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Section 3
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Section 4
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

### Section 5
Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

### Section 6
Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.

### Section 7
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

### Section 8
Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

### Section 9
Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.

### Section 10
Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate.

---

## Code Examples in Different Languages

### HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a sample HTML document.</p>
</body>
</html>
```

### CSS
```css
/* Sample CSS */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background: #0366d6;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
}
```

### JSON
```json
{
  "name": "markdown-parser",
  "version": "1.0.0",
  "features": [
    "Toggle view",
    "Copy code blocks",
    "Scroll to top",
    "TXT support",
    "Print styles"
  ],
  "enabled": true
}
```

---

## End of Demo

Scroll back up using the floating button! 🚀

**Remember**: Click the MD badge to see the raw markdown source!
