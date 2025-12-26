import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const imagesDir = join(rootDir, 'images');
const outputDir = join(imagesDir, 'optimized');

// Files to process (the largest ones with embedded images)
const filesToProcess = [
  { svg: 'images/contactus-image3.svg', html: 'contact-us.html', line: 589 },
  { svg: 'images/homeimage.svg', html: 'index.html', line: 387 },
  { svg: 'images/homebg.svg', html: 'index.html', line: null }, // Check if used
];

/**
 * Extract base64 image from SVG
 */
function extractBase64Image(svgContent) {
  // Match data:image/png;base64,... or data:image/jpeg;base64,...
  const base64Match = svgContent.match(/data:image\/(png|jpeg|jpg);base64,([^"'\s>]+)/i);
  
  if (!base64Match) {
    return null;
  }

  return {
    format: base64Match[1],
    data: base64Match[2]
  };
}

/**
 * Convert base64 to buffer and save as PNG
 */
function saveBase64AsImage(base64Data, outputPath) {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    writeFileSync(outputPath, buffer);
    return true;
  } catch (error) {
    console.error(`Error saving image: ${error.message}`);
    return false;
  }
}

/**
 * Convert PNG to WebP using sharp (if available) or keep PNG
 */
async function convertToWebP(pngPath, webpPath) {
  try {
    // Try to use sharp if available
    const sharp = await import('sharp').catch(() => null);
    
    if (sharp) {
      await sharp.default(pngPath)
        .webp({ quality: 85 })
        .toFile(webpPath);
      return true;
    } else {
      console.log('⚠️  Sharp not installed. Install with: npm install sharp --save-dev');
      return false;
    }
  } catch (error) {
    console.error(`Error converting to WebP: ${error.message}`);
    return false;
  }
}

/**
 * Update HTML file to use new image
 */
function updateHTMLFile(htmlPath, oldSrc, newSrc, lineNumber) {
  try {
    let content = readFileSync(htmlPath, 'utf8');
    
    // Replace the old src with new src
    const oldPattern = new RegExp(`src=["']${oldSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'gi');
    const newSrcAttr = `src="${newSrc}"`;
    
    if (oldPattern.test(content)) {
      content = content.replace(oldPattern, newSrcAttr);
      writeFileSync(htmlPath, content, 'utf8');
      return true;
    } else {
      // Try without quotes
      const oldPattern2 = new RegExp(`src=${oldSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
      if (oldPattern2.test(content)) {
        content = content.replace(oldPattern2, `src="${newSrc}"`);
        writeFileSync(htmlPath, content, 'utf8');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error updating HTML: ${error.message}`);
    return false;
  }
}

/**
 * Process a single SVG file
 */
async function processSVGFile(fileInfo) {
  const svgPath = join(rootDir, fileInfo.svg);
  
  if (!existsSync(svgPath)) {
    console.log(`⚠️  File not found: ${fileInfo.svg}`);
    return false;
  }

  console.log(`\n📄 Processing: ${fileInfo.svg}`);

  try {
    const svgContent = readFileSync(svgPath, 'utf8');
    const imageData = extractBase64Image(svgContent);

    if (!imageData) {
      console.log(`   ⚠️  No embedded image found in ${fileInfo.svg}`);
      return false;
    }

    console.log(`   ✓ Found embedded ${imageData.format.toUpperCase()} image`);

    // Create output directory
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Extract base name
    const baseName = basename(fileInfo.svg, '.svg');
    const pngPath = join(outputDir, `${baseName}.png`);
    const webpPath = join(outputDir, `${baseName}.webp`);

    // Save as PNG first
    console.log(`   💾 Extracting to: ${pngPath}`);
    if (!saveBase64AsImage(imageData.data, pngPath)) {
      return false;
    }

    const pngSize = (statSync(pngPath).size / 1024).toFixed(2);
    console.log(`   ✓ Saved PNG: ${pngSize} KB`);

    // Try to convert to WebP
    console.log(`   🔄 Converting to WebP...`);
    const webpConverted = await convertToWebP(pngPath, webpPath);

    if (webpConverted) {
      const webpSize = (statSync(webpPath).size / 1024).toFixed(2);
      const savings = ((1 - parseFloat(webpSize) / parseFloat(pngSize)) * 100).toFixed(1);
      console.log(`   ✓ WebP created: ${webpSize} KB (${savings}% smaller)`);
      
      // Update HTML to use WebP
      const htmlPath = join(rootDir, fileInfo.html);
      const newSrc = `images/optimized/${baseName}.webp`;
      
      if (existsSync(htmlPath)) {
        if (updateHTMLFile(htmlPath, fileInfo.svg, newSrc, fileInfo.line)) {
          console.log(`   ✓ Updated ${fileInfo.html} to use WebP`);
        } else {
          console.log(`   ⚠️  Could not update ${fileInfo.html} automatically`);
          console.log(`   📝 Manual update needed: Change "${fileInfo.svg}" to "${newSrc}"`);
        }
      }
    } else {
      // Use PNG if WebP conversion failed
      const htmlPath = join(rootDir, fileInfo.html);
      const newSrc = `images/optimized/${baseName}.png`;
      
      if (existsSync(htmlPath)) {
        if (updateHTMLFile(htmlPath, fileInfo.svg, newSrc, fileInfo.line)) {
          console.log(`   ✓ Updated ${fileInfo.html} to use PNG`);
        }
      }
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Error processing ${fileInfo.svg}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting SVG Image Extraction and Conversion...\n');
  console.log('This will:');
  console.log('1. Extract embedded images from SVG files');
  console.log('2. Save as PNG');
  console.log('3. Convert to WebP (if sharp is installed)');
  console.log('4. Update HTML files to use optimized images\n');

  let successCount = 0;
  let failCount = 0;

  for (const fileInfo of filesToProcess) {
    const success = await processSVGFile(fileInfo);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Extraction complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  
  if (successCount > 0) {
    console.log(`\n📁 Optimized images saved to: images/optimized/`);
    console.log(`\n⚠️  IMPORTANT: Manually optimize PNG files with:`);
    console.log(`   - TinyPNG: https://tinypng.com/`);
    console.log(`   - Squoosh: https://squoosh.app/`);
    console.log(`\n   Then replace WebP files if optimization is better.`);
  }
}

main().catch(console.error);

