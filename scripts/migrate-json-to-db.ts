import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface PricingRow {
  size: string;
  price: string;
  condition: string;
  discount: string;
}

interface ProductJSON {
  id: string;
  category: string;
  productName: string;
  promotionText: string;
  discountPercentage: number;
  images: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
  };
  pricingTable: PricingRow[];
  badgePosition: string;
}

interface DataJSON {
  products: ProductJSON[];
}

const log = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  warning: (msg: string) => console.log(`⚠️  ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
};

async function main() {
  try {
    log.info('🚀 Starting JSON to Database migration...\n');

    // Step 1: Load and validate JSON
    log.info('Step 1: Loading JSON file...');
    const jsonPath = path.join(process.cwd(), 'public/data/products-generated.json');

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found: ${jsonPath}`);
    }

    const jsonData: DataJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    log.success(`Loaded ${jsonData.products.length} products from JSON\n`);

    // Step 2: Extract unique brands from category field
    log.info('Step 2: Extracting brands from categories...');
    const brandSet = new Set<string>();
    jsonData.products.forEach(product => {
      // Extract brand from category (e.g., "BỘT ACRYLIC + OMBRE" -> "ACRYLIC")
      const brandMatch = product.category.match(/ACRYLIC|OMBRE|BLAZINGSTAR|BOLD BERRY|MBERRY/i);
      if (brandMatch) {
        brandSet.add(brandMatch[0].toUpperCase());
      } else {
        brandSet.add('UNKNOWN');
      }
    });

    log.success(`Found ${brandSet.size} unique brands: ${Array.from(brandSet).join(', ')}\n`);

    // Step 3: Check existing data
    log.info('Step 3: Checking existing data in database...');
    const existingBrands = await prisma.brand.count();
    const existingProducts = await prisma.product.count();
    log.info(`Existing brands: ${existingBrands}`);
    log.info(`Existing products: ${existingProducts}\n`);

    if (existingProducts > 0) {
      log.warning('⚠️  Database already has products!');
      log.warning('This migration will ADD NEW products, not replace existing ones.\n');
    }

    // Step 4: Dry run - show what will be inserted
    log.info('Step 4: DRY RUN - Showing what will be inserted...\n');
    jsonData.products.slice(0, 3).forEach((product, idx) => {
      log.info(`  Product ${idx + 1}: ${product.productName}`);
      log.info(`    - Category: ${product.category}`);
      log.info(`    - Images: 3 (topLeft, topRight, bottomLeft)`);
      log.info(`    - Pricing rows: ${product.pricingTable.length}`);
    });
    if (jsonData.products.length > 3) {
      log.info(`  ... and ${jsonData.products.length - 3} more products\n`);
    }

    // Step 5: Ask for confirmation
    log.warning('⚠️  IMPORTANT: This will INSERT new data into the database.');
    log.warning('Please ensure you have a BACKUP of your database.\n');

    const confirmed = process.argv.includes('--confirm');
    if (!confirmed) {
      log.info('Run with --confirm flag to proceed with migration');
      log.info('Example: npx ts-node scripts/migrate-json-to-db.ts --confirm\n');
      process.exit(0);
    }

    log.info('Proceeding with migration...\n');

    // Step 6: Create or get brands
    log.info('Step 5: Creating/updating brands...');
    const brandMap = new Map<string, string>(); // brand name -> id

    for (const brandName of Array.from(brandSet)) {
      const brand = await prisma.brand.upsert({
        where: { slug: brandName.toLowerCase() },
        update: {},
        create: {
          name: brandName,
          slug: brandName.toLowerCase(),
          description: `${brandName} brand products`,
        },
      });
      brandMap.set(brandName, brand.id);
      log.success(`  Brand: ${brandName}`);
    }
    log.success(`${brandSet.size} brands ready\n`);

    // Step 7: Migrate products with versions
    log.info('Step 6: Migrating products...');
    let successCount = 0;
    let errorCount = 0;

    for (const jsonProduct of jsonData.products) {
      try {
        // Extract brand
        const brandMatch = jsonProduct.category.match(/ACRYLIC|OMBRE|BLAZINGSTAR|BOLD BERRY|MBERRY/i);
        const brandName = brandMatch ? brandMatch[0].toUpperCase() : 'UNKNOWN';
        const brandId = brandMap.get(brandName);

        if (!brandId) {
          throw new Error(`Brand not found: ${brandName}`);
        }

        // Check if product already exists
        const existingProduct = await prisma.product.findUnique({
          where: { productCode: jsonProduct.id },
        });

        let product;
        if (existingProduct) {
          log.warning(`  Product already exists: ${jsonProduct.id}, skipping...`);
          continue;
        }

        // Create product
        product = await prisma.product.create({
          data: {
            productCode: jsonProduct.id,
            name: jsonProduct.productName,
            slug: jsonProduct.productName.toLowerCase().replace(/\s+/g, '-'),
            brandId: brandId,
            isActive: true,
          },
        });

        // Create version 1
        const version = await prisma.productVersion.create({
          data: {
            productId: product.id,
            versionNumber: 1,
            versionName: 'Initial Version',
            isCurrent: true,
            createdBy: 'migration-script',
            description: `Migrated from JSON on ${new Date().toISOString()}`,
          },
        });

        // Create images
        const imagePositions = ['topLeft', 'topRight', 'bottomLeft'] as const;
        for (let idx = 0; idx < imagePositions.length; idx++) {
          const position = imagePositions[idx];
          const imageUrl = jsonProduct.images[position];

          await prisma.productImage.create({
            data: {
              versionId: version.id,
              imageUrl: imageUrl,
              imageType: 'product',
              position: position,
              displayOrder: idx,
              label: `${position}`,
            },
          });
        }

        // Create pricing rows
        for (let idx = 0; idx < jsonProduct.pricingTable.length; idx++) {
          const row = jsonProduct.pricingTable[idx];
          const price = parseFloat(row.price.replace('£', '').trim());
          const discountPrice = parseFloat(row.discount.replace('£', '').trim());

          await prisma.pricing.create({
            data: {
              versionId: version.id,
              size: row.size,
              price: price,
              condition: row.condition,
              discountPrice: discountPrice,
              displayOrder: idx,
              currency: 'GBP',
            },
          });
        }

        // Create properties
        await prisma.productProperty.create({
          data: {
            versionId: version.id,
            propertyKey: 'category',
            propertyValue: jsonProduct.category,
            displayOrder: 0,
          },
        });

        await prisma.productProperty.create({
          data: {
            versionId: version.id,
            propertyKey: 'promotionText',
            propertyValue: jsonProduct.promotionText,
            displayOrder: 1,
          },
        });

        await prisma.productProperty.create({
          data: {
            versionId: version.id,
            propertyKey: 'discountPercentage',
            propertyValue: jsonProduct.discountPercentage.toString(),
            displayOrder: 2,
          },
        });

        await prisma.productProperty.create({
          data: {
            versionId: version.id,
            propertyKey: 'badgePosition',
            propertyValue: jsonProduct.badgePosition,
            displayOrder: 3,
          },
        });

        // Create audit log entry
        await prisma.auditLog.create({
          data: {
            entityType: 'product',
            entityId: product.id,
            action: 'create',
            performedBy: 'migration-script',
            changes: {
              source: 'json-migration',
              timestamp: new Date().toISOString(),
            },
          },
        });

        log.success(`  ✓ ${jsonProduct.id}: ${jsonProduct.productName}`);
        successCount++;
      } catch (error) {
        log.error(`  ✗ Failed to migrate ${jsonProduct.id}: ${error instanceof Error ? error.message : String(error)}`);
        errorCount++;
      }
    }

    log.success(`\nMigration complete! ✅`);
    log.success(`  Successful: ${successCount}`);
    if (errorCount > 0) {
      log.error(`  Failed: ${errorCount}`);
    }

    // Step 8: Summary
    log.info('\nStep 7: Final database stats...');
    const finalBrands = await prisma.brand.count();
    const finalProducts = await prisma.product.count();
    const finalVersions = await prisma.productVersion.count();
    const finalImages = await prisma.productImage.count();
    const finalPricing = await prisma.pricing.count();

    log.success(`  Brands: ${finalBrands}`);
    log.success(`  Products: ${finalProducts}`);
    log.success(`  Versions: ${finalVersions}`);
    log.success(`  Images: ${finalImages}`);
    log.success(`  Pricing rows: ${finalPricing}\n`);

    log.success('🎉 Migration completed successfully!');
  } catch (error) {
    log.error(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
