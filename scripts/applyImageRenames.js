const fs = require('fs');
const path = require('path');

// Read the mapping
const mappingPath = path.join(__dirname, '../image-mapping.json');
if (!fs.existsSync(mappingPath)) {
  console.error('❌ image-mapping.json not found. Run renameProductImages.js first');
  process.exit(1);
}

const imageMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
const publicDir = path.join(__dirname, '../public');

let successCount = 0;
let errorCount = 0;

console.log(`Starting file rename operation...\n`);

// Rename files
Object.entries(imageMapping).forEach(([oldName, newName]) => {
  const oldPath = path.join(publicDir, oldName);
  const newPath = path.join(publicDir, newName.replace(/^\//, ''));

  if (!fs.existsSync(oldPath)) {
    console.warn(`⚠️  File not found: ${oldName}`);
    errorCount++;
    return;
  }

  try {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ ${oldName} → ${newName}`);
    successCount++;
  } catch (err) {
    console.error(`❌ Failed to rename ${oldName}: ${err.message}`);
    errorCount++;
  }
});

console.log(`\n📊 Rename Results:`);
console.log(`✅ Successfully renamed: ${successCount}`);
console.log(`❌ Errors: ${errorCount}`);

if (errorCount === 0) {
  console.log(`\n🎉 All files renamed successfully!`);
  console.log(`\n📋 NEXT STEP:`);
  console.log(`Run: node scripts/convertToWebP.js (to convert to WebP format)`);
} else {
  console.log(`\n⚠️  Please review the errors above before proceeding`);
}
