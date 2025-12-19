# Footer Implementation Instructions

The footer component has been created to match the exact Figma design. Here are the ways to include it in your HTML pages:

## Option 1: Direct HTML Include (Recommended)

Simply copy the contents of `footer.html` and paste it before the closing `</body>` tag in your HTML files.

### Steps:

1. Open `footer.html`
2. Copy all the HTML content (from `<footer>` to `</footer>`)
3. Open your HTML file (e.g., `index.html`)
4. Paste the footer code just before the closing `</body>` tag

### Example:

```html
<!-- Your page content -->
</main>

<!-- Include Footer -->
<!-- Copy footer.html content here -->

<script src="js/main.js"></script>
</body>
</html>
```

## Option 2: Using JavaScript (for dynamic loading)

If you're using JavaScript modules, you can use the `createFooter()` function from `shared.js`:

### Steps:

1. In your HTML file, add a div where you want the footer:

```html
<div id="footer-container"></div>
```

2. In your JavaScript file (or in a `<script>` tag), import and use:

```javascript
import { createFooter } from "./js/shared.js";

document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = createFooter();
  }
});
```

### Note: For this to work, your HTML must use ES6 modules:

```html
<script type="module" src="js/main.js"></script>
```

## Option 3: Server-Side Include (if using a server)

If you're using a server like PHP, you can include:

```php
<?php include 'footer.html'; ?>
```

## Files Created:

1. **footer.html** - Standalone footer HTML file
2. **js/shared.js** - Updated with `createFooter()` function
3. **css/main.css** - Added font styling for ImperatorSmallCaps

## Design Specifications:

- **Background Color**: `#2B0809` (dark reddish-brown)
- **Text Colors**:
  - Headings: `#FAFAFA` (Grey-1)
  - Links: `#D4D4D4` (Grey-4)
  - Copyright: `#A3A3A3` (Grey-5)
- **Font**: Inter (with ImperatorSmallCaps fallback for VLAT logo)
- **Responsive**: Works on all device sizes

## Important Notes:

1. The footer uses Tailwind CSS classes, so make sure your CSS is compiled
2. The footer includes social media icons (Instagram, YouTube, Facebook, X, LinkedIn)
3. All links are placeholder links - update them to match your actual page routes
4. The logo path is set to `images/logo1.svg` - adjust if needed

## Testing:

After adding the footer:

1. Open your page in a browser
2. Check that the footer appears at the bottom
3. Test responsiveness by resizing the browser window
4. Verify all links work correctly
5. Check that social media icons are visible and clickable
