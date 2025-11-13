const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '../public');
const imageExtensions = ['.jpg', '.jpeg', '.png'];

let convertedCount = 0;
let skippedCount = 0;

console.log(`Starting WebP conversion...\n`);

const files = fs.readdirSync(publicDir);

files.forEach(file => {
  const ext = path.extname(file).toLowerCase();

  // Only convert product images (those matching product-* pattern)
  if (!file.startsWith('product-') || !imageExtensions.includes(ext)) {
    return;
  }

  const filePath = path.join(publicDir, file);
  const webpPath = path.join(publicDir, file.replace(ext, '.webp'));

  // Skip if WebP already exists
  if (fs.existsSync(webpPath)) {
    console.log(`⏭️  Already WebP: ${file}`);
    skippedCount++;
    return;
  }

  try {
    // Convert using cwebp with quality settings
    execSync(`cwebp -q 80 "${filePath}" -o "${webpPath}"`, { stdio: 'pipe' });

    // Delete original file after successful conversion
    fs.unlinkSync(filePath);
    console.log(`✅ ${file} → ${file.replace(ext, '.webp')}`);
    convertedCount++;
  } catch (err) {
    console.error(`❌ Failed to convert ${file}: ${err.message}`);
  }
});

console.log(`\n📊 Conversion Results:`);
console.log(`✅ Converted: ${convertedCount}`);
console.log(`⏭️  Skipped: ${skippedCount}`);

if (convertedCount > 0) {
  console.log(`\n🎉 WebP conversion complete!`);
  console.log(`\n📋 IMPORTANT:`);
  console.log(`Update image references in JSON to use .webp extensions`);
  console.log(`Or the app will try to load .jpg/.png files that no longer exist`);
} else {
  console.log(`\n⚠️  No images were converted. Check file naming.`);
}
