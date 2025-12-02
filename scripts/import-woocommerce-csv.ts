import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import {
  getBrandIdFromSKU,
  preloadBrandCache,
  analyzeSkuPatterns,
} from '../lib/sku-to-brand-mapper';

const prisma = new PrismaClient();

// Configuration
const DEFAULT_CSV_PATH = './wc-product-export-2-12-2025-1764680224771.csv';
const BATCH_SIZE = 50;
const CHECKPOINT_FILE = './import-progress.json';
const ERROR_LOG_FILE = './import-errors.csv';

// Statistics
interface ImportStats {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  startTime: Date;
  endTime?: Date;
}

interface ImportError {
  row: number;
  sku: string;
  name: string;
  error: string;
}

interface Checkpoint {
  lastProcessedRow: number;
  timestamp: string;
  stats: ImportStats;
}

// WooCommerce CSV row interface
interface WooCommerceRow {
  '﻿ID'?: string; // BOM prefix
  ID?: string;
  Type: string;
  SKU: string;
  Name: string;
  Published: string;
  Description?: string;
  'Short description'?: string;
  'Regular price'?: string;
  'Sale price'?: string;
  Categories?: string;
  Tags?: string;
  Images?: string;
  Brands?: string;
  Parent?: string;
  'Attribute 1 name'?: string;
  'Attribute 1 value(s)'?: string;
  'Attribute 2 name'?: string;
  'Attribute 2 value(s)'?: string;
  'Attribute 3 name'?: string;
  'Attribute 3 value(s)'?: string;
}

const stats: ImportStats = {
  total: 0,
  created: 0,
  updated: 0,
  skipped: 0,
  failed: 0,
  startTime: new Date(),
};

const errors: ImportError[] = [];
const processedSKUs = new Set<string>();
let currentRow = 0;

/**
 * Generate slug from SKU and name
 */
function generateSlug(sku: string, name: string): string {
  const baseName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const skuSlug = sku
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${baseName}-${skuSlug}`.substring(0, 255);
}

/**
 * Ensure slug is unique by appending suffix if needed
 */
async function ensureUniqueSlug(
  baseSlug: string,
  existingProductId?: string
): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || (existingProductId && existing.id === existingProductId)) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }
}

/**
 * Parse comma-separated image URLs
 */
function parseImageUrls(imagesString?: string): string[] {
  if (!imagesString) return [];

  return imagesString
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && url.startsWith('http'));
}

/**
 * Get WooCommerce product ID (handles BOM character)
 */
function getWooCommerceId(row: WooCommerceRow): string {
  return row['﻿ID'] || row.ID || '';
}

/**
 * Create or update a product from CSV row
 */
async function importProduct(
  row: WooCommerceRow,
  rowNumber: number,
  isDryRun: boolean
): Promise<'created' | 'updated' | 'skipped'> {
  const sku = row.SKU?.trim();
  const name = row.Name?.trim();

  // Validation
  if (!sku) {
    throw new Error('Missing SKU');
  }

  if (!name) {
    throw new Error('Missing product name');
  }

  // Check for duplicate SKU in this import
  if (processedSKUs.has(sku)) {
    console.log(`    ⚠️  Duplicate SKU ${sku}, skipping`);
    return 'skipped';
  }

  processedSKUs.add(sku);

  // Get brand ID
  const brandId = await getBrandIdFromSKU(sku, row.Brands);
  if (!brandId) {
    throw new Error(`Could not determine brand for SKU ${sku}`);
  }

  // Check if product exists
  const existing = await prisma.product.findFirst({
    where: {
      OR: [{ productCode: sku }, { sku }],
    },
    include: {
      versions: {
        where: { isCurrent: true },
        take: 1,
      },
    },
  });

  if (isDryRun) {
    return existing ? 'updated' : 'created';
  }

  if (existing) {
    await updateProduct(existing, row, brandId);
    return 'updated';
  } else {
    await createProduct(row, brandId);
    return 'created';
  }
}

/**
 * Create new product
 */
async function createProduct(row: WooCommerceRow, brandId: string): Promise<void> {
  const sku = row.SKU.trim();
  const name = row.Name.trim();
  const baseSlug = generateSlug(sku, name);
  const slug = await ensureUniqueSlug(baseSlug);
  const isActive = row.Published === '1';

  // Create product
  const product = await prisma.product.create({
    data: {
      brandId,
      productCode: sku,
      sku,
      name: name.substring(0, 255),
      slug,
      isActive,
    },
  });

  // Create version 1
  const version = await prisma.productVersion.create({
    data: {
      productId: product.id,
      versionNumber: 1,
      versionName: 'WooCommerce Import',
      isCurrent: true,
      createdBy: 'woocommerce_import',
      description: `Imported from WooCommerce on ${new Date().toISOString()}`,
    },
  });

  // Create content (description and short description)
  const contentData = [];

  if (row.Description) {
    contentData.push({
      versionId: version.id,
      contentType: 'description',
      content: row.Description,
      language: 'en',
    });
  }

  if (row['Short description']) {
    contentData.push({
      versionId: version.id,
      contentType: 'short_description',
      content: row['Short description'],
      language: 'en',
    });
  }

  if (contentData.length > 0) {
    await prisma.productContent.createMany({ data: contentData });
  }

  // Create images
  const imageUrls = parseImageUrls(row.Images);
  if (imageUrls.length > 0) {
    const imageData = imageUrls.map((url, index) => ({
      versionId: version.id,
      imageUrl: url,
      imageType: index === 0 ? 'main' : 'detail',
      position: index === 0 ? 'main' : `detail_${index}`,
      displayOrder: index,
      altText: `${name} - Image ${index + 1}`,
    }));

    await prisma.productImage.createMany({ data: imageData });
  }

  // Create properties
  const propertyData = [];

  // Product type
  propertyData.push({
    versionId: version.id,
    propertyKey: 'wc_product_type',
    propertyValue: row.Type,
    displayOrder: 0,
  });

  // Parent SKU (for variations)
  if (row.Parent) {
    propertyData.push({
      versionId: version.id,
      propertyKey: 'parent_sku',
      propertyValue: row.Parent,
      displayOrder: 1,
    });
  }

  // Categories
  if (row.Categories) {
    propertyData.push({
      versionId: version.id,
      propertyKey: 'categories',
      propertyValue: row.Categories,
      displayOrder: 2,
    });
  }

  // Tags
  if (row.Tags) {
    propertyData.push({
      versionId: version.id,
      propertyKey: 'tags',
      propertyValue: row.Tags,
      displayOrder: 3,
    });
  }

  // WooCommerce ID
  const wcId = getWooCommerceId(row);
  if (wcId) {
    propertyData.push({
      versionId: version.id,
      propertyKey: 'wc_product_id',
      propertyValue: wcId,
      displayOrder: 4,
    });
  }

  // Attributes
  let attrOrder = 10;
  for (let i = 1; i <= 3; i++) {
    const attrName = row[`Attribute ${i} name` as keyof WooCommerceRow];
    const attrValue = row[`Attribute ${i} value(s)` as keyof WooCommerceRow];

    if (attrName && attrValue) {
      propertyData.push({
        versionId: version.id,
        propertyKey: `attribute_${attrName}`,
        propertyValue: attrValue,
        displayOrder: attrOrder++,
      });
    }
  }

  if (propertyData.length > 0) {
    await prisma.productProperty.createMany({ data: propertyData });
  }

  // Create pricing
  const regularPrice = parseFloat(row['Regular price'] || '0');
  const salePrice = parseFloat(row['Sale price'] || '0');

  if (regularPrice > 0) {
    await prisma.pricing.create({
      data: {
        versionId: version.id,
        size: 'Standard',
        price: regularPrice,
        currency: 'GBP',
        condition: 'new',
        discountPrice: salePrice > 0 ? salePrice : null,
        displayOrder: 0,
      },
    });
  }

  // Create audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'product',
      entityId: product.id,
      action: 'wc_import_create',
      performedBy: 'woocommerce_import_script',
      changes: {
        source: 'woocommerce_csv',
        sku,
        wc_id: wcId,
        timestamp: new Date().toISOString(),
      },
    },
  });
}

/**
 * Update existing product (create new version)
 */
async function updateProduct(
  existing: any,
  row: WooCommerceRow,
  brandId: string
): Promise<void> {
  const sku = row.SKU.trim();
  const name = row.Name.trim();

  // Update product basic info
  const baseSlug = generateSlug(sku, name);
  const slug = await ensureUniqueSlug(baseSlug, existing.id);

  await prisma.product.update({
    where: { id: existing.id },
    data: {
      brandId,
      sku,
      name: name.substring(0, 255),
      slug,
      isActive: row.Published === '1',
    },
  });

  // Mark current version as not current
  await prisma.productVersion.updateMany({
    where: {
      productId: existing.id,
      isCurrent: true,
    },
    data: {
      isCurrent: false,
    },
  });

  // Get next version number
  const maxVersion = await prisma.productVersion.findFirst({
    where: { productId: existing.id },
    orderBy: { versionNumber: 'desc' },
    select: { versionNumber: true },
  });

  const nextVersion = (maxVersion?.versionNumber || 0) + 1;

  // Create new version
  const version = await prisma.productVersion.create({
    data: {
      productId: existing.id,
      versionNumber: nextVersion,
      versionName: `WooCommerce Import ${new Date().toISOString()}`,
      isCurrent: true,
      createdBy: 'woocommerce_import',
      description: 'Updated from WooCommerce CSV import',
    },
  });

  // Create all version-related data (same as createProduct)
  const contentData = [];

  if (row.Description) {
    contentData.push({
      versionId: version.id,
      contentType: 'description',
      content: row.Description,
      language: 'en',
    });
  }

  if (row['Short description']) {
    contentData.push({
      versionId: version.id,
      contentType: 'short_description',
      content: row['Short description'],
      language: 'en',
    });
  }

  if (contentData.length > 0) {
    await prisma.productContent.createMany({ data: contentData });
  }

  // Images
  const imageUrls = parseImageUrls(row.Images);
  if (imageUrls.length > 0) {
    const imageData = imageUrls.map((url, index) => ({
      versionId: version.id,
      imageUrl: url,
      imageType: index === 0 ? 'main' : 'detail',
      position: index === 0 ? 'main' : `detail_${index}`,
      displayOrder: index,
      altText: `${name} - Image ${index + 1}`,
    }));

    await prisma.productImage.createMany({ data: imageData });
  }

  // Properties (same as create)
  const propertyData = [];

  propertyData.push({
    versionId: version.id,
    propertyKey: 'wc_product_type',
    propertyValue: row.Type,
    displayOrder: 0,
  });

  if (row.Parent) {
    propertyData.push({
      versionId: version.id,
      propertyKey: 'parent_sku',
      propertyValue: row.Parent,
      displayOrder: 1,
    });
  }

  if (row.Categories) {
    propertyData.push({
      versionId: version.id,
      propertyKey: 'categories',
      propertyValue: row.Categories,
      displayOrder: 2,
    });
  }

  if (row.Tags) {
    propertyData.push({
      versionId: version.id,
      propertyKey: 'tags',
      propertyValue: row.Tags,
      displayOrder: 3,
    });
  }

  const wcId = getWooCommerceId(row);
  if (wcId) {
    propertyData.push({
      versionId: version.id,
      propertyKey: 'wc_product_id',
      propertyValue: wcId,
      displayOrder: 4,
    });
  }

  let attrOrder = 10;
  for (let i = 1; i <= 3; i++) {
    const attrName = row[`Attribute ${i} name` as keyof WooCommerceRow];
    const attrValue = row[`Attribute ${i} value(s)` as keyof WooCommerceRow];

    if (attrName && attrValue) {
      propertyData.push({
        versionId: version.id,
        propertyKey: `attribute_${attrName}`,
        propertyValue: attrValue,
        displayOrder: attrOrder++,
      });
    }
  }

  if (propertyData.length > 0) {
    await prisma.productProperty.createMany({ data: propertyData });
  }

  // Pricing
  const regularPrice = parseFloat(row['Regular price'] || '0');
  const salePrice = parseFloat(row['Sale price'] || '0');

  if (regularPrice > 0) {
    await prisma.pricing.create({
      data: {
        versionId: version.id,
        size: 'Standard',
        price: regularPrice,
        currency: 'GBP',
        condition: 'new',
        discountPrice: salePrice > 0 ? salePrice : null,
        displayOrder: 0,
      },
    });
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'product',
      entityId: existing.id,
      action: 'wc_import_update',
      performedBy: 'woocommerce_import_script',
      changes: {
        source: 'woocommerce_csv',
        sku,
        wc_id: wcId,
        version: nextVersion,
        timestamp: new Date().toISOString(),
      },
    },
  });
}

/**
 * Save checkpoint
 */
function saveCheckpoint(): void {
  const checkpoint: Checkpoint = {
    lastProcessedRow: currentRow,
    timestamp: new Date().toISOString(),
    stats,
  };

  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2));
}

/**
 * Load checkpoint
 */
function loadCheckpoint(): Checkpoint | null {
  try {
    if (fs.existsSync(CHECKPOINT_FILE)) {
      const data = fs.readFileSync(CHECKPOINT_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load checkpoint:', error);
  }

  return null;
}

/**
 * Save error log
 */
function saveErrorLog(): void {
  if (errors.length === 0) return;

  const csv = [
    'Row,SKU,Name,Error',
    ...errors.map((e) => `${e.row},"${e.sku}","${e.name}","${e.error}"`),
  ].join('\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `import-errors-${timestamp}.csv`;

  fs.writeFileSync(filename, csv);
  console.log(`\n📄 Error log saved to: ${filename}`);
}

/**
 * Process CSV file
 */
async function processCSV(
  csvPath: string,
  isDryRun: boolean,
  limit?: number,
  resume?: boolean
): Promise<void> {
  console.log(`\n📂 Reading CSV: ${csvPath}`);

  let skipUntilRow = 0;

  if (resume) {
    const checkpoint = loadCheckpoint();
    if (checkpoint) {
      skipUntilRow = checkpoint.lastProcessedRow;
      console.log(`📍 Resuming from row ${skipUntilRow + 1}`);
      Object.assign(stats, checkpoint.stats);
    } else {
      console.log('⚠️  No checkpoint found, starting from beginning');
    }
  }

  const rows: WooCommerceRow[] = [];

  // Read CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          relax_column_count: true, // Allow inconsistent column counts
          relax_quotes: true, // Allow unquoted fields
        })
      )
      .on('data', (row: WooCommerceRow) => {
        rows.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`✅ Loaded ${rows.length} products from CSV\n`);

  // SKU analysis (dry run only)
  if (isDryRun) {
    const skus = rows.map((r) => r.SKU).filter(Boolean);
    const analysis = analyzeSkuPatterns(skus);

    console.log('📊 SKU Pattern Analysis:');
    console.log(`   Total: ${analysis.total}`);
    console.log(`   Matched: ${analysis.matched} (${Math.round((analysis.matched / analysis.total) * 100)}%)`);
    console.log(`   Unmatched: ${analysis.unmatched}\n`);

    console.log('Distribution by brand:');
    Object.entries(analysis.byBrand)
      .sort(([, a], [, b]) => b - a)
      .forEach(([brand, count]) => {
        console.log(`   ${brand}: ${count}`);
      });

    if (analysis.unmatchedSkus.length > 0) {
      console.log(`\n⚠️  First 10 unmatched SKUs:`);
      analysis.unmatchedSkus.slice(0, 10).forEach((sku) => {
        console.log(`   - ${sku}`);
      });
    }

    console.log('');
  }

  // Apply limit
  const rowsToProcess = limit ? rows.slice(0, limit) : rows;
  stats.total = rowsToProcess.length;

  console.log(`🚀 ${isDryRun ? 'DRY RUN - ' : ''}Processing ${rowsToProcess.length} products...\n`);

  // Process in batches
  const batches = [];
  for (let i = 0; i < rowsToProcess.length; i += BATCH_SIZE) {
    batches.push(rowsToProcess.slice(i, i + BATCH_SIZE));
  }

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchStart = batchIndex * BATCH_SIZE;

    // Skip batches if resuming
    if (skipUntilRow > 0 && batchStart + BATCH_SIZE <= skipUntilRow) {
      continue;
    }

    console.log(`📦 Batch ${batchIndex + 1}/${batches.length} (rows ${batchStart + 1}-${batchStart + batch.length})`);

    for (let i = 0; i < batch.length; i++) {
      const row = batch[i];
      currentRow = batchStart + i;

      // Skip if resuming and haven't reached checkpoint yet
      if (skipUntilRow > 0 && currentRow <= skipUntilRow) {
        continue;
      }

      try {
        const result = await importProduct(row, currentRow + 1, isDryRun);

        if (result === 'created') {
          stats.created++;
        } else if (result === 'updated') {
          stats.updated++;
        } else if (result === 'skipped') {
          stats.skipped++;
        }

        // Progress indicator
        if ((stats.created + stats.updated + stats.skipped) % 10 === 0) {
          process.stdout.write('.');
        }
      } catch (error) {
        stats.failed++;
        errors.push({
          row: currentRow + 1,
          sku: row.SKU || 'UNKNOWN',
          name: row.Name || 'UNKNOWN',
          error: error instanceof Error ? error.message : String(error),
        });

        // Show first few errors
        if (errors.length <= 5) {
          console.log(`\n   ❌ Row ${currentRow + 1} (${row.SKU}): ${error instanceof Error ? error.message : error}`);
        }
      }
    }

    console.log(' ✓');

    // Save checkpoint after each batch
    if (!isDryRun) {
      saveCheckpoint();
    }
  }
}

/**
 * Print final report
 */
function printReport(isDryRun: boolean): void {
  stats.endTime = new Date();
  const duration = stats.endTime.getTime() - stats.startTime.getTime();
  const durationMin = Math.floor(duration / 60000);
  const durationSec = Math.floor((duration % 60000) / 1000);

  console.log('\n' + '='.repeat(60));
  console.log(`${isDryRun ? 'DRY RUN ' : ''}IMPORT COMPLETE`);
  console.log('='.repeat(60));
  console.log(`\n📊 Statistics:`);
  console.log(`   Total: ${stats.total}`);
  console.log(`   ✅ Created: ${stats.created}`);
  console.log(`   🔄 Updated: ${stats.updated}`);
  console.log(`   ⚠️  Skipped: ${stats.skipped}`);
  console.log(`   ❌ Failed: ${stats.failed}`);
  console.log(`   ⏱️  Duration: ${durationMin}m ${durationSec}s`);

  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} errors occurred`);
    if (!isDryRun) {
      saveErrorLog();
    }
  }

  if (!isDryRun && stats.failed === 0) {
    console.log('\n🎉 All products imported successfully!');

    // Clean up checkpoint file
    if (fs.existsSync(CHECKPOINT_FILE)) {
      fs.unlinkSync(CHECKPOINT_FILE);
      console.log('🧹 Checkpoint file removed');
    }
  }

  console.log('');
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  const csvPath = args.find((arg) => arg.startsWith('--csv='))?.split('=')[1] || DEFAULT_CSV_PATH;
  const isDryRun = args.includes('--dry-run');
  const confirm = args.includes('--confirm');
  const resume = args.includes('--resume');
  const limitArg = args.find((arg) => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;

  // Validation
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  if (!isDryRun && !confirm) {
    console.log('❌ This script requires --confirm flag for actual import');
    console.log('');
    console.log('Usage:');
    console.log('  Dry run:    npx ts-node scripts/import-woocommerce-csv.ts --dry-run');
    console.log('  Test 100:   npx ts-node scripts/import-woocommerce-csv.ts --limit=100 --confirm');
    console.log('  Full import: npx ts-node scripts/import-woocommerce-csv.ts --confirm');
    console.log('  Resume:     npx ts-node scripts/import-woocommerce-csv.ts --resume --confirm');
    process.exit(0);
  }

  console.log('\n' + '='.repeat(60));
  console.log('WOOCOMMERCE PRODUCT IMPORT');
  console.log('='.repeat(60));
  console.log(`\nCSV File: ${csvPath}`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes)' : 'IMPORT (will modify database)'}`);
  if (limit) console.log(`Limit: ${limit} products`);
  if (resume) console.log(`Resume: Yes`);

  // Preload brand cache
  console.log('\n⚡ Preloading brand cache...');
  await preloadBrandCache();
  console.log('✅ Brand cache loaded');

  // Process CSV
  await processCSV(csvPath, isDryRun, limit, resume);

  // Print report
  printReport(isDryRun);
}

main()
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
