import { readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const imagesDir = join(rootDir, 'images');

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  try {
    const stats = statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    return 0;
  }
}

/**
 * Find large image files
 */
function findLargeImages() {
  if (!existsSync(imagesDir)) {
    console.error('❌ Images directory not found:', imagesDir);
    return;
  }

  console.log('\n🔍 Scanning for large image files...\n');

  const files = readdirSync(imagesDir, { withFileTypes: true });
  const largeImages = [];

  files.forEach(file => {
    if (file.isFile()) {
      const ext = extname(file.name).toLowerCase();
      const imageExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif'];
      
      if (imageExtensions.includes(ext)) {
        const filePath = join(imagesDir, file.name);
        const sizeKB = parseFloat(getFileSizeKB(filePath));
        
        // Flag files larger than 100KB
        if (sizeKB > 100) {
          largeImages.push({
            name: file.name,
            size: sizeKB,
            path: filePath
          });
        }
      }
    }
  });

  if (largeImages.length === 0) {
    console.log('✅ No large images found (all under 100KB)');
    return;
  }

  // Sort by size (largest first)
  largeImages.sort((a, b) => b.size - a.size);

  console.log('⚠️  LARGE IMAGES FOUND:\n');
  console.log('File Name'.padEnd(40) + 'Size (KB)'.padEnd(15) + 'Recommendation');
  console.log('-'.repeat(80));

  largeImages.forEach(img => {
    let recommendation = '';
    const ext = extname(img.name).toLowerCase();
    
    if (ext === '.svg' && img.size > 50) {
      recommendation = '→ Optimize with SVGO (target: < 50 KB)';
    } else if (ext === '.png' && img.size > 50) {
      recommendation = '→ Convert to WebP (target: < 50 KB)';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      recommendation = '→ Compress or convert to WebP';
    } else {
      recommendation = '→ Review and optimize';
    }

    console.log(
      img.name.padEnd(40) + 
      `${img.size} KB`.padEnd(15) + 
      recommendation
    );
  });

  console.log('\n📋 OPTIMIZATION COMMANDS:\n');

  const svgFiles = largeImages.filter(img => extname(img.name).toLowerCase() === '.svg');
  const pngFiles = largeImages.filter(img => extname(img.name).toLowerCase() === '.png');

  if (svgFiles.length > 0) {
    console.log('1. Optimize SVG files:');
    console.log('   npm install -g svgo');
    console.log(`   svgo -f images -r --multipass`);
    console.log('');
  }

  if (pngFiles.length > 0) {
    console.log('2. Convert PNG to WebP:');
    console.log('   npm install sharp --save-dev');
    console.log('   node scripts/convert-to-webp.js');
    console.log('');
  }

  console.log('3. Online optimization tools:');
  console.log('   - SVGO: https://jakearchibald.github.io/svgomg/');
  console.log('   - TinyPNG: https://tinypng.com/');
  console.log('   - Squoosh: https://squoosh.app/\n');
}

// Run the scan
findLargeImages();
