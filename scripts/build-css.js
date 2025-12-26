import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// HTML files to copy
const htmlFiles = [
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

// Directories to copy
const dirsToCopy = ['js', 'images', 'data', 'translations'];

/**
 * Recursively copy directory
 */
function copyDir(src, dest) {
  if (!existsSync(src)) {
    console.warn(`⚠️  Source directory does not exist: ${src}`);
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
function copyFileIfExists(filename) {
  const srcPath = join(rootDir, filename);
  const destPath = join(distDir, filename);

  if (existsSync(srcPath)) {
    const destDirPath = dirname(destPath);
    mkdirSync(destDirPath, { recursive: true });
    copyFileSync(srcPath, destPath);
    console.log(`✓ Copied: ${filename}`);
  } else {
    console.warn(`⚠️  File not found: ${filename}`);
  }
}

console.log('\n🚀 Starting VLAT Production Build...\n');

// Step 1: Clean dist directory
console.log('📁 Step 1: Cleaning dist directory...');
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}
mkdirSync(distDir, { recursive: true });
mkdirSync(join(distDir, 'css'), { recursive: true });
console.log('✓ Dist directory cleaned and created\n');

// Step 2: Build Tailwind CSS
console.log('🎨 Step 2: Building Tailwind CSS...');
try {
  execSync(
    'npx tailwindcss -i css/main.css -o dist/css/main.css --minify',
    { 
      cwd: rootDir, 
      stdio: 'inherit',
      shell: true 
    }
  );
  console.log('✓ Tailwind CSS compiled and minified\n');
} catch (error) {
  console.error('❌ Failed to build Tailwind CSS:', error.message);
  process.exit(1);
}

// Step 3: Copy HTML files
console.log('📄 Step 3: Copying HTML files...');
htmlFiles.forEach(file => copyFileIfExists(file));
console.log('');

// Step 4: Copy asset directories
console.log('📦 Step 4: Copying asset directories...');
dirsToCopy.forEach(dir => {
  const srcPath = join(rootDir, dir);
  const destPath = join(distDir, dir);
  if (existsSync(srcPath)) {
    copyDir(srcPath, destPath);
    console.log(`✓ Copied directory: ${dir}`);
  } else {
    console.warn(`⚠️  Directory not found: ${dir}`);
  }
});

// Step 5: Copy cache configuration files
console.log('\n⚙️  Step 5: Copying cache configuration files...');
const configFiles = ['_headers', '.htaccess', 'robots.txt', 'sitemap.xml'];
configFiles.forEach(file => {
  copyFileIfExists(file);
});

console.log('\n✅ Build complete!');
console.log(`📂 Output directory: ${distDir}`);
console.log('\n📋 Next steps for Hostinger cPanel:');
console.log('   1. Open the "dist" folder');
console.log('   2. Upload ALL contents to public_html/vlat-mock-test/');
console.log('   3. Make sure css/main.css is the COMPILED version (not source)\n');

