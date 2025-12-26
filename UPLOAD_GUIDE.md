# 📤 Simple Upload Guide - Step by Step

## 🎯 The Main Point

**You have a folder called `dist` on your computer.**
**Inside that folder are your website files.**
**Upload the FILES, not the FOLDER.**

---

## 📂 What You See on Your Computer

after you make any changes you need to run the build and follow the instructions
After running `npm run build`, you'll see this:

```
C:\Users\Vijayakumar R\Desktop\vlat\
└── 📂 dist/                    ← DON'T upload this folder
    ├── 📄 index.html           ← UPLOAD THIS
    ├── 📄 login.html           ← UPLOAD THIS
    ├── 📄 register.html        ← UPLOAD THIS
    ├── 📄 (20 more HTML files)  ← UPLOAD ALL OF THESE
    ├── 📂 css/                 ← UPLOAD THIS FOLDER
    │   └── 📄 main.css         ← (and everything inside)
    ├── 📂 js/                  ← UPLOAD THIS FOLDER
    │   └── 📄 (all JS files)   ← (and everything inside)
    ├── 📂 images/              ← UPLOAD THIS FOLDER
    │   └── 📄 (all images)     ← (and everything inside)
    └── 📂 data/                ← UPLOAD THIS FOLDER
        └── 📄 (all data files) ← (and everything inside)
```

---

## ✅ CORRECT WAY - Visual Steps

### Step 1: Open the `dist` folder

Double-click on `dist` folder to open it.

### Step 2: Select everything inside

- Press `Ctrl + A` (Windows) or `Cmd + A` (Mac)
- OR click and drag to select all files and folders

You should see:

- ✅ All HTML files selected
- ✅ `css` folder selected
- ✅ `js` folder selected
- ✅ `images` folder selected
- ✅ `data` folder selected

### Step 3: Upload to cPanel

- Drag and drop into cPanel File Manager
- OR use the Upload button

### Step 4: Check the result

After uploading, in cPanel you should see:

```
public_html/vlat-mock-test/
├── index.html          ← Files are HERE (correct!)
├── login.html
├── css/
│   └── main.css
└── ...
```

---

## ❌ WRONG WAY - What NOT to Do

### Don't do this:

1. Selecting the `dist` folder itself
2. Uploading the entire `dist` folder
3. Result: Files end up in `public_html/vlat-mock-test/dist/index.html` ❌

**Why this is wrong:**

- Your website URL would be: `vmls.edu.in/vlat-mock-test/dist/index.html`
- But it should be: `vmls.edu.in/vlat-mock-test/index.html`

---

## 🔍 Quick Check: Did I Do It Right?

After uploading, check your cPanel File Manager:

**✅ CORRECT Structure:**

```
public_html/
└── vlat-mock-test/
    ├── index.html          ← Files directly here
    ├── css/
    └── js/
```

**❌ WRONG Structure:**

```
public_html/
└── vlat-mock-test/
    └── dist/               ← Extra folder (WRONG!)
        ├── index.html
        ├── css/
        └── js/
```

---

## 💡 Simple Rule to Remember

**"Open the box, take everything out, upload what's inside"**

The `dist` folder is just a temporary container.
You only need the files inside it.

---

## 🎬 Visual Example

**On Your Computer:**

```
📂 Desktop
  └── 📂 vlat
      └── 📂 dist          ← Open this folder
          ├── 📄 index.html
          ├── 📂 css
          └── 📂 js
```

**What to Upload:**

```
📄 index.html      ← Upload this
📂 css             ← Upload this folder
📂 js              ← Upload this folder
```

**NOT:**

```
📂 dist            ← DON'T upload this folder
```

---

## ✅ Final Checklist

Before uploading, make sure:

- [ ] You opened the `dist` folder
- [ ] You selected all files and folders INSIDE `dist`
- [ ] You did NOT select the `dist` folder itself
- [ ] You're uploading to `public_html/vlat-mock-test/`
- [ ] After upload, files are directly in `vlat-mock-test/`, not in a subfolder

---

## 🆘 Still Confused?

**Think of it like this:**

You have a shopping bag (`dist` folder) with groceries (your files) inside.

- ❌ Wrong: Mailing the entire shopping bag
- ✅ Right: Taking groceries out and mailing them

The server doesn't need the bag - just the groceries!
