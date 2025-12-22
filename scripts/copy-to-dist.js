import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Files and directories to copy
const filesToCopy = [
  'index.html',
  'about-vlat.html',
  'about-vmls.html',
  'blogs.html',
  'contact-us.html',
  'dashboard.html',
  'exam-structure.html',
  'forgot-password.html',
  'how-to-register.html',
  'instructions.html',
  'login.html',
  'mock-test.html',
  'password-reset-successful.html',
  'register.html',
  'reset-password.html',
  'results.html',
  'review-answers.html',
  'welcome-screen.html',
  'check-your-email.html',
  'footer.html',
];

const dirsToCopy = [
  'css',
  'js',
  'images',
  'data',
];

/**
 * Recursively copy directory
 */
function copyDir(src, dest) {
  if (!existsSync(src)) {
    console.warn(`Source directory does not exist: ${src}`);
    return;
  }

  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy file if it exists
 */
function copyFileIfExists(src, dest) {
  const srcPath = join(rootDir, src);
  const destPath = join(distDir, src);

  if (existsSync(srcPath)) {
    const destDirPath = dirname(destPath);
    mkdirSync(destDirPath, { recursive: true });
    copyFileSync(srcPath, destPath);
    console.log(`Copied: ${src}`);
  } else {
    console.warn(`File not found: ${src}`);
  }
}

// Create dist directory
if (existsSync(distDir)) {
  console.log('Cleaning existing dist directory...');
  // For simplicity, we'll just overwrite - Vercel will clean it anyway
}

mkdirSync(distDir, { recursive: true });

// Copy HTML files
console.log('Copying HTML files...');
filesToCopy.forEach(file => copyFileIfExists(file, file));

// Copy directories
console.log('Copying directories...');
dirsToCopy.forEach(dir => {
  const srcPath = join(rootDir, dir);
  const destPath = join(distDir, dir);
  if (existsSync(srcPath)) {
    copyDir(srcPath, destPath);
    console.log(`Copied directory: ${dir}`);
  } else {
    console.warn(`Directory not found: ${dir}`);
  }
});

console.log('Build complete! Files copied to dist/');

