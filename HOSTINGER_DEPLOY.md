# VLAT - Hostinger cPanel Deployment Guide

## 🚨 THE PROBLEM YOU HAD

Your Tailwind CSS was NOT working in production because you were uploading **uncompiled source files**.

### What was happening:

**Your `css/main.css` (SOURCE - browsers CAN'T read this):**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
/* ... @apply directives ... */
```

**What browsers NEED (COMPILED CSS):**

```css
*,
:after,
:before {
  --tw-border-spacing-x: 0;
  box-sizing: border-box;
}
.flex {
  display: flex;
}
.bg-primary {
  background-color: rgb(141 25 28);
}
/* ... actual CSS rules ... */
```

---

## ✅ THE FIX - BUILD BEFORE DEPLOY

### Step 1: Build Production Files

Run this command in your project folder:

```bash
npm run build
```

This creates a `dist/` folder with:

- ✅ **Compiled CSS** - `dist/css/main.css` (actual CSS, not Tailwind directives)
- ✅ **All HTML files** - copied as-is
- ✅ **All JS files** - copied as-is
- ✅ **All images** - copied as-is
- ✅ **All data files** - copied as-is

### Step 2: Upload to Hostinger cPanel

**📁 WHAT TO UPLOAD - SIMPLE EXPLANATION:**

Think of the `dist` folder like a **box**. You don't upload the box itself - you take everything OUT of the box and upload those items.

**Real-world analogy:**

- ❌ Wrong: Mailing a box with a label "dist" on it
- ✅ Right: Taking items out of the box and mailing them directly

After running `npm run build`, you'll have a `dist` folder on your computer. Here's what's inside:

```
📂 dist/                    ← This folder is on YOUR COMPUTER
   ├── 📄 index.html
   ├── 📄 about-vlat.html
   ├── 📄 login.html
   ├── 📄 (all other HTML files)
   ├── 📂 css/
   │   └── 📄 main.css      ← The compiled CSS file
   ├── 📂 js/
   │   └── 📄 (all JS files)
   ├── 📂 images/
   │   └── 📄 (all images)
   └── 📂 data/
       └── 📄 (all data files)
```

**❌ WRONG WAY (Don't do this):**

- Uploading the `dist` folder itself
- Result: Your files end up at `public_html/vlat-mock-test/dist/index.html` ❌

**✅ CORRECT WAY (Do this):**

1. **Open the `dist` folder** on your computer
2. **Select ALL files and folders INSIDE** (not the `dist` folder itself)
3. **Upload them** to `public_html/vlat-mock-test/`
4. Result: Your files are at `public_html/vlat-mock-test/index.html` ✅

**Step-by-step in cPanel:**

1. **Login to Hostinger cPanel**
2. **Open File Manager**
3. **Navigate to**: `public_html/vlat-mock-test/`
4. **Delete all existing files** (backup first if needed)
5. **On your computer**: Open the `dist` folder
6. **Select everything inside** (Ctrl+A or Cmd+A)
7. **Drag and drop** or **Upload** to cPanel
8. **Make sure** the files go directly into `vlat-mock-test/`, NOT into a subfolder

**Final structure on server should be:**

```
public_html/
└── vlat-mock-test/         ← Your files go HERE
    ├── index.html           ← Directly here, not in a subfolder
    ├── about-vlat.html
    ├── login.html
    ├── css/
    │   └── main.css        ← Compiled CSS
    ├── js/
    │   └── *.js
    ├── images/
    │   └── *.svg, *.png
    └── data/
        └── *.json, *.pdf
```

**🔍 How to verify you did it right:**

- ✅ If your URL is `vmls.edu.in/vlat-mock-test/index.html` → CORRECT
- ❌ If your URL is `vmls.edu.in/vlat-mock-test/dist/index.html` → WRONG (you uploaded the folder)

---

## 🔄 DEPLOYMENT WORKFLOW

### Every time you make changes:

1. **Develop locally** using `npm run dev` (Vite dev server)
2. **Test your changes** at `http://localhost:5173`
3. **Build for production**: `npm run build`
4. **Upload `dist/` contents** to Hostinger

### Quick Commands Reference:

| Command               | Purpose                           |
| --------------------- | --------------------------------- |
| `npm run dev`         | Start local development server    |
| `npm run build`       | Build production files to `dist/` |
| `npm run build:css`   | Only rebuild CSS (faster)         |
| `npm run build:watch` | Watch CSS changes and rebuild     |

---

## 🛠️ TROUBLESHOOTING

### CSS not loading?

1. **Check the CSS file content** on the server

   - Open `https://vmls.edu.in/vlat-mock-test/css/main.css` in browser
   - If you see `@tailwind base;` → You uploaded the SOURCE file, not the compiled one
   - If you see minified CSS like `*,:after,:before{...}` → Correct!

2. **Clear browser cache**

   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or open in Incognito/Private mode

3. **Check file permissions**
   - CSS file should be readable (644 or 0644)

### New Tailwind classes not working?

The build script only includes CSS classes that are **actually used** in your HTML/JS files. If you add new classes:

1. Make sure the class is in a file covered by `tailwind.config.js`:

   ```js
   content: ["./*.html", "./pages/**/*.html", "./js/**/*.js"];
   ```

2. Rebuild: `npm run build`

3. Re-upload `dist/css/main.css`

---

## 🚀 ADVANCED: AUTOMATING DEPLOYMENT

### Option 1: FTP Deployment Script

You can automate uploads using `lftp` or a Node.js FTP package.

### Option 2: GitHub Actions (Recommended for future)

Set up a CI/CD pipeline that:

1. Runs `npm run build` on every push
2. Uploads to Hostinger via FTP/SFTP

---

## 📝 IMPORTANT NOTES

1. **Never upload the `node_modules/` folder** - it's only for development
2. **Never upload the source `css/main.css`** - always use the one from `dist/`
3. **The `dist/` folder is gitignored** - don't commit it to version control
4. **Keep your `.gitignore` updated** to exclude `dist/` and `node_modules/`

---

## 🔧 Project Scripts Explained

| Script                | What it does                                        |
| --------------------- | --------------------------------------------------- |
| `npm run dev`         | Starts Vite dev server with hot reload              |
| `npm run build`       | Compiles Tailwind CSS + copies all files to `dist/` |
| `npm run build:css`   | Only compiles CSS (quick rebuild)                   |
| `npm run build:watch` | Watches for CSS changes and auto-rebuilds           |

---

## 💡 WHY THIS MATTERS FOR SCALING

As you scale your application:

1. **Tailwind purges unused CSS** - Your production CSS only contains classes you actually use
2. **Minified output** - Smaller file size = faster page loads
3. **Consistent workflow** - Same build process works for any hosting provider
4. **Easy migration** - When you move to Vercel/Netlify/AWS, the build command stays the same

---

## 📞 QUICK FIX CHECKLIST

If production is broken:

- [ ] Run `npm run build`
- [ ] Check `dist/css/main.css` starts with `*,:after,:before{` (compiled)
- [ ] Upload ALL contents of `dist/` folder to server
- [ ] Clear browser cache
- [ ] Check browser DevTools → Network tab → is `main.css` loading?
- [ ] Check browser DevTools → Console → any 404 errors?
