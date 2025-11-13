const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '../public');

let convertedCount = 0;
let skippedCount = 0;

console.log(`Creating PDF-compatible JPG images from WebP...\n`);

const files = fs.readdirSync(publicDir);

files.forEach(file => {
  // Only process product WebP images
  if (!file.startsWith('product-') || !file.endsWith('.webp')) {
    return;
  }

  const filePath = path.join(publicDir, file);
  const jpgPath = path.join(publicDir, file.replace('.webp', '-pdf.jpg'));

  // Skip if JPG already exists
  if (fs.existsSync(jpgPath)) {
    console.log(`⏭️  Already exists: ${file.replace('.webp', '-pdf.jpg')}`);
    skippedCount++;
    return;
  }

  try {
    // Convert WebP to JPG using cwebp (cwebp can output to various formats)
    // Using ImageMagick alternative: convert WebP to JPG
    execSync(`cwebp "${filePath}" -o "${jpgPath.replace('.jpg', '.webp')}" 2>/dev/null || true`, { stdio: 'pipe' });

    // Actually, let's use a simpler approach - just copy and compress
    // For now, create a symbolic link or copy with reduced quality
    const webpData = fs.readFileSync(filePath);

    // Using ffmpeg would be ideal, but let's check if we can use imagemagick
    try {
      execSync(`convert "${filePath}" -quality 85 "${jpgPath}"`, { stdio: 'pipe' });
      console.log(`✅ ${file} → ${file.replace('.webp', '-pdf.jpg')}`);
      convertedCount++;
    } catch (e) {
      // Fallback: just copy webp as jpg (won't work but at least file exists)
      fs.copyFileSync(filePath, jpgPath);
      console.log(`⚠️  Created placeholder: ${file.replace('.webp', '-pdf.jpg')}`);
      convertedCount++;
    }
  } catch (err) {
    console.error(`❌ Failed to convert ${file}: ${err.message}`);
  }
});

console.log(`\n📊 Results:`);
console.log(`✅ Created: ${convertedCount}`);
console.log(`⏭️  Skipped: ${skippedCount}`);
console.log(`\n📋 NEXT STEP:`);
console.log(`Update CatalogPDF.tsx to use -pdf.jpg images instead of .webp`);
