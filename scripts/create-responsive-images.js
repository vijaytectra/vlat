import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const optimizedDir = join(rootDir, 'images', 'optimized');

/**
 * Create responsive image sizes
 */
async function createResponsiveImages() {
  const imageConfig = {
    'homeimage.webp': [
      { width: 448, suffix: '-sm' },   // Small (mobile)
      { width: 570, suffix: '-md' },   // Medium (tablet) - actual display size
      { width: 896, suffix: '-lg' },   // Large (desktop) - 2x for retina
    ]
  };

  console.log('📱 Creating responsive image sizes...\n');

  for (const [imageName, sizes] of Object.entries(imageConfig)) {
    const sourcePath = join(optimizedDir, imageName);
    
    if (!existsSync(sourcePath)) {
      console.log(`⚠️  Source image not found: ${imageName}`);
      continue;
    }

    const baseName = basename(imageName, '.webp');
    const originalSize = statSync(sourcePath).size;
    console.log(`📄 Processing: ${imageName} (${(originalSize / 1024).toFixed(2)} KB)`);

    for (const size of sizes) {
      try {
        const outputPath = join(optimizedDir, `${baseName}${size.suffix}.webp`);
        
        await sharp(sourcePath)
          .resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: 85 })
          .toFile(outputPath);

        const outputSize = statSync(outputPath).size;
        const savings = ((1 - outputSize / originalSize) * 100).toFixed(1);
        
        console.log(`   ✓ Created ${size.width}px: ${basename(outputPath)} (${(outputSize / 1024).toFixed(2)} KB, ${savings}% smaller)`);
      } catch (error) {
        console.error(`   ❌ Error creating ${size.width}px: ${error.message}`);
      }
    }
    console.log('');
  }

  console.log('✅ Responsive images created!\n');
  console.log('📝 Update HTML to use srcset:');
  console.log('   <source srcset="images/optimized/homeimage-sm.webp 448w,');
  console.log('                   images/optimized/homeimage-md.webp 570w,');
  console.log('                   images/optimized/homeimage-lg.webp 896w"');
  console.log('           sizes="(max-width: 640px) 448px,');
  console.log('                  (max-width: 1024px) 570px,');
  console.log('                  896px"');
  console.log('           type="image/webp">');
}

createResponsiveImages().catch(console.error);

