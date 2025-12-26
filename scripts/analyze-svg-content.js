import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Analyze SVG file to find embedded images
 */
import { statSync } from 'fs';

function analyzeSVG(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const stats = {
      file: filePath.replace(rootDir + '\\', '').replace(rootDir + '/', ''),
      sizeKB: (statSync(filePath).size / 1024).toFixed(2),
      hasEmbeddedImages: false,
      embeddedImageCount: 0,
      base64Size: 0,
      recommendations: []
    };

    // Check for embedded images
    const imageMatches = content.match(/<image[^>]*>/gi) || [];
    const dataImageMatches = content.match(/data:image\/[^;]+;base64,[^"'\s]+/gi) || [];
    const foreignObjectMatches = content.match(/<foreignObject[^>]*>/gi) || [];

    stats.embeddedImageCount = imageMatches.length + dataImageMatches.length;
    stats.hasEmbeddedImages = stats.embeddedImageCount > 0 || foreignObjectMatches.length > 0;

    // Calculate base64 size
    dataImageMatches.forEach(match => {
      const base64Data = match.split(',')[1] || '';
      stats.base64Size += (base64Data.length * 3) / 4; // Approximate binary size
    });

    // Generate recommendations
    if (stats.hasEmbeddedImages) {
      stats.recommendations.push('Contains embedded images - extract and optimize separately');
      stats.recommendations.push('Consider converting to PNG/WebP if SVG complexity is low');
    }

    if (stats.base64Size > 100 * 1024) {
      stats.recommendations.push(`Large embedded images (${(stats.base64Size / 1024).toFixed(2)} KB) - extract and optimize`);
    }

    // Check for complex paths
    const pathMatches = content.match(/<path[^>]*>/gi) || [];
    if (pathMatches.length > 100) {
      stats.recommendations.push(`Very complex SVG (${pathMatches.length} paths) - consider simplifying`);
    }

    // Check for gradients/filters
    const gradientMatches = content.match(/<linearGradient|<radialGradient|<filter/gi) || [];
    if (gradientMatches.length > 20) {
      stats.recommendations.push(`Many gradients/filters (${gradientMatches.length}) - may impact performance`);
    }

    return stats;
  } catch (error) {
    return {
      file: filePath,
      error: error.message
    };
  }
}

/**
 * Analyze large SVG files
 */
function analyzeLargeSVGs() {
  const largeFiles = [
    'images/contactus-image3.svg',
    'images/homeimage.svg',
    'images/homebg.svg',
    'images/vmls-red.svg',
    'images/vmls-white.svg',
    'images/footer-logo.svg',
    'images/header-logo.svg',
    'images/blog1.svg',
    'images/blog9.svg'
  ];

  console.log('\n🔍 Analyzing large SVG files for embedded content...\n');

  largeFiles.forEach(file => {
    const filePath = join(rootDir, file);
    if (existsSync(filePath)) {
      const analysis = analyzeSVG(filePath);
      
      if (analysis.error) {
        console.log(`❌ ${analysis.file}`);
        console.log(`   Error: ${analysis.error}\n`);
        return;
      }

      console.log(`📄 ${analysis.file} (${analysis.sizeKB} KB)`);
      
      if (analysis.hasEmbeddedImages) {
        console.log(`   ⚠️  Contains ${analysis.embeddedImageCount} embedded image(s)`);
        if (analysis.base64Size > 0) {
          console.log(`   📦 Base64 image data: ${(analysis.base64Size / 1024).toFixed(2)} KB`);
        }
      } else {
        console.log(`   ✓ No embedded images detected`);
      }

      if (analysis.recommendations.length > 0) {
        console.log(`   💡 Recommendations:`);
        analysis.recommendations.forEach(rec => {
          console.log(`      - ${rec}`);
        });
      }
      console.log('');
    }
  });

  console.log('\n📋 NEXT STEPS:\n');
  console.log('1. For SVGs with embedded images:');
  console.log('   - Extract images using: https://svgtomagextractor.com/');
  console.log('   - Optimize extracted images with TinyPNG or Squoosh');
  console.log('   - Replace embedded images with <image href="optimized.png">');
  console.log('');
  console.log('2. For complex SVGs:');
  console.log('   - Simplify paths using: https://jakearchibald.github.io/svgomg/');
  console.log('   - Remove unused gradients/filters');
  console.log('   - Consider converting to PNG/WebP if SVG benefits are minimal');
  console.log('');
  console.log('3. Alternative: Use online tools');
  console.log('   - SVGOMG: https://jakearchibald.github.io/svgomg/');
  console.log('   - Squoosh: https://squoosh.app/ (can convert SVG to optimized formats)');
  console.log('');
}

analyzeLargeSVGs();

