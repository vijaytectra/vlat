import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, extname, basename } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const imagesDir = join(rootDir, 'images');

/**
 * Check if file is actually an SVG (not a PNG masquerading as SVG)
 */
function isValidSVG(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8').trim();
    // Check if it starts with SVG tag or XML declaration
    return content.startsWith('<svg') || 
           content.startsWith('<?xml') || 
           content.startsWith('<!DOCTYPE svg');
  } catch (error) {
    // If we can't read it as text, it's probably binary (PNG/JPG)
    return false;
  }
}

/**
 * Get all SVG files recursively
 */
function getAllSVGFiles(dir, fileList = []) {
  if (!existsSync(dir)) {
    return fileList;
  }

  const files = readdirSync(dir, { withFileTypes: true });

  files.forEach(file => {
    const filePath = join(dir, file.name);
    
    if (file.isDirectory()) {
      getAllSVGFiles(filePath, fileList);
    } else if (file.isFile() && extname(file.name).toLowerCase() === '.svg') {
      // Check if it's a valid SVG before adding
      if (isValidSVG(filePath)) {
        fileList.push(filePath);
      } else {
        console.warn(`⚠️  Skipping invalid SVG (likely PNG): ${filePath}`);
      }
    }
  });

  return fileList;
}

/**
 * Optimize SVG files with SVGO
 */
function optimizeSVGs() {
  console.log('\n🔍 Scanning for SVG files...\n');

  const svgFiles = getAllSVGFiles(imagesDir);
  
  if (svgFiles.length === 0) {
    console.log('✅ No valid SVG files found');
    return;
  }

  console.log(`Found ${svgFiles.length} valid SVG files\n`);

  // Filter files larger than 50KB
  const largeSVGs = svgFiles.filter(filePath => {
    const stats = statSync(filePath);
    return stats.size > 50 * 1024; // 50KB
  });

  if (largeSVGs.length === 0) {
    console.log('✅ All SVGs are already optimized (< 50KB)');
    return;
  }

  console.log(`⚠️  Found ${largeSVGs.length} large SVG files (> 50KB):\n`);
  
  largeSVGs.forEach(filePath => {
    const stats = statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const relativePath = filePath.replace(rootDir + '\\', '').replace(rootDir + '/', '');
    console.log(`  ${relativePath.padEnd(50)} ${sizeKB} KB`);
  });

  console.log('\n🚀 Optimizing large SVG files with SVGO...\n');

  let successCount = 0;
  let errorCount = 0;

  largeSVGs.forEach(filePath => {
    try {
      const relativePath = filePath.replace(rootDir + '\\', '').replace(rootDir + '/', '');
      const beforeSize = statSync(filePath).size;
      
      // Run SVGO on individual file
      execSync(`svgo "${filePath}" --multipass`, {
        cwd: rootDir,
        stdio: 'pipe',
        shell: true
      });

      const afterSize = statSync(filePath).size;
      const savedKB = ((beforeSize - afterSize) / 1024).toFixed(2);
      const savedPercent = ((1 - afterSize / beforeSize) * 100).toFixed(1);
      
      console.log(`✓ ${relativePath.padEnd(50)} ${savedKB} KB saved (${savedPercent}%)`);
      successCount++;
    } catch (error) {
      const relativePath = filePath.replace(rootDir + '\\', '').replace(rootDir + '/', '');
      console.error(`✗ Failed: ${relativePath}`);
      console.error(`  Error: ${error.message.split('\n')[0]}`);
      errorCount++;
    }
  });

  console.log(`\n✅ Optimization complete!`);
  console.log(`   Success: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount}`);
  }
}

// Check if SVGO is installed
try {
  execSync('svgo --version', { stdio: 'pipe' });
  optimizeSVGs();
} catch (error) {
  console.error('\n❌ SVGO is not installed!\n');
  console.log('Install it with:');
  console.log('  npm install -g svgo\n');
  console.log('Or use online tool:');
  console.log('  https://jakearchibald.github.io/svgomg/\n');
  process.exit(1);
}

