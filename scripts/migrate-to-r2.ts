import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import * as fsp from 'fs/promises';

// Load environment variables
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'bucket-vllondon';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://vllondon.chartedconsultants.com';
const R2_REGION = process.env.R2_REGION || 'auto';

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
  console.error('Missing R2 credentials in .env');
  process.exit(1);
}

const s3Client = new S3Client({
  region: R2_REGION,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  endpoint: R2_ENDPOINT,
});

interface Product {
  id: string;
  images?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
  };
  [key: string]: any;
}

interface ProductsData {
  products: Product[];
}

async function uploadFileToR2(filePath: string, key: string): Promise<string> {
  try {
    const fileContent = await fsp.readFile(filePath);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: 'image/webp',
    });

    await s3Client.send(command);
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    console.log(`✓ Uploaded: ${key}`);
    return publicUrl;
  } catch (error) {
    console.error(`✗ Failed to upload ${key}:`, error);
    throw error;
  }
}

async function migrateImages() {
  console.log('🚀 Starting image migration to R2...\n');

  const productsPath = path.join(process.cwd(), 'data', 'products-generated.json');
  const publicPath = path.join(process.cwd(), 'public');

  // Read products JSON
  const productsData: ProductsData = JSON.parse(
    fs.readFileSync(productsPath, 'utf-8')
  );

  let uploadedCount = 0;
  let skippedCount = 0;

  // Migrate each product's images
  for (const product of productsData.products) {
    if (!product.images) continue;

    const { topLeft, topRight, bottomLeft } = product.images;

    // Check and migrate topLeft
    if (topLeft && !topLeft.includes('http')) {
      const localPath = path.join(publicPath, topLeft);
      if (fs.existsSync(localPath)) {
        try {
          const r2Key = `images/${path.basename(topLeft)}`;
          const r2Url = await uploadFileToR2(localPath, r2Key);
          product.images.topLeft = r2Url;
          uploadedCount++;
        } catch (error) {
          console.error(`Failed to upload ${product.id} topLeft`);
        }
      } else {
        console.log(`⊘ Local file not found: ${localPath}`);
        skippedCount++;
      }
    } else if (topLeft?.includes('http')) {
      console.log(`⊘ Already migrated: ${product.id} topLeft`);
      skippedCount++;
    }

    // Check and migrate topRight
    if (topRight && !topRight.includes('http')) {
      const localPath = path.join(publicPath, topRight);
      if (fs.existsSync(localPath)) {
        try {
          const r2Key = `images/${path.basename(topRight)}`;
          const r2Url = await uploadFileToR2(localPath, r2Key);
          product.images.topRight = r2Url;
          uploadedCount++;
        } catch (error) {
          console.error(`Failed to upload ${product.id} topRight`);
        }
      } else {
        console.log(`⊘ Local file not found: ${localPath}`);
        skippedCount++;
      }
    } else if (topRight?.includes('http')) {
      console.log(`⊘ Already migrated: ${product.id} topRight`);
      skippedCount++;
    }

    // Check and migrate bottomLeft
    if (bottomLeft && !bottomLeft.includes('http')) {
      const localPath = path.join(publicPath, bottomLeft);
      if (fs.existsSync(localPath)) {
        try {
          const r2Key = `images/${path.basename(bottomLeft)}`;
          const r2Url = await uploadFileToR2(localPath, r2Key);
          product.images.bottomLeft = r2Url;
          uploadedCount++;
        } catch (error) {
          console.error(`Failed to upload ${product.id} bottomLeft`);
        }
      } else {
        console.log(`⊘ Local file not found: ${localPath}`);
        skippedCount++;
      }
    } else if (bottomLeft?.includes('http')) {
      console.log(`⊘ Already migrated: ${product.id} bottomLeft`);
      skippedCount++;
    }
  }

  // Save updated products JSON
  fs.writeFileSync(
    productsPath,
    JSON.stringify(productsData, null, 2)
  );

  console.log(`\n✅ Migration complete!`);
  console.log(`📤 Uploaded: ${uploadedCount} images`);
  console.log(`⊘ Skipped: ${skippedCount} images`);
  console.log(`📝 Updated: ${productsPath}`);
}

migrateImages().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
