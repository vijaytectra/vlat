import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const imagesDir = join(rootDir, 'images');
const optimizedDir = join(imagesDir, 'optimized');

/**
 * Convert PNG to WebP
 */
async function convertPNGToWebP(pngPath, quality = 85) {
  try {
    const baseName = basename(pngPath, '.png');
    const webpPath = join(optimizedDir, `${baseName}.webp`);
    
    // Create optimized directory if it doesn't exist
    if (!existsSync(optimizedDir)) {
      mkdirSync(optimizedDir, { recursive: true });
    }

    await sharp(pngPath)
      .webp({ quality })
      .toFile(webpPath);

    const originalSize = statSync(pngPath).size;
    const webpSize = statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    return {
      success: true,
      webpPath: `images/optimized/${baseName}.webp`,
      originalSizeKB: (originalSize / 1024).toFixed(2),
      webpSizeKB: (webpSize / 1024).toFixed(2),
      savings: parseFloat(savings)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Convert specific PNG files
 */
async function convertSpecificPNGs() {
  const filesToConvert = [
    'images/aboutvmls1.png'
  ];

  console.log('🖼️  Converting PNG files to WebP...\n');

  for (const file of filesToConvert) {
    const filePath = join(rootDir, file);
    
    if (!existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }

    const sizeKB = (statSync(filePath).size / 1024).toFixed(2);
    console.log(`📄 Processing: ${file} (${sizeKB} KB)`);

    const result = await convertPNGToWebP(filePath);

    if (result.success) {
      console.log(`   ✓ WebP created: ${result.webpPath}`);
      console.log(`   ✓ Size: ${result.originalSizeKB} KB → ${result.webpSizeKB} KB (${result.savings}% smaller)\n`);
    } else {
      console.log(`   ❌ Error: ${result.error}\n`);
    }
  }
}

convertSpecificPNGs().catch(console.error);

