const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../data/split');
const targetDir = path.join(__dirname, '../public/data/split');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all JSON files
const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✅ Copied ${file}`);
});

console.log(`\n📁 Copied ${files.length} files from data/split/ to public/data/split/`);
