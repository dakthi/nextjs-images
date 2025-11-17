import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Brand mapping based on manual analysis
const productBrandMapping: Record<string, string> = {
  // BlazingStar Products
  'product-187': 'blazing-star',
  'product-197': 'blazing-star',
  'product-189': 'blazing-star',
  'product-191': 'blazing-star',
  'product-184': 'blazing-star',
  'product-185': 'blazing-star',
  'product-275': 'blazing-star',
  'product-270': 'blazing-star',
  'product-267': 'blazing-star',
  'product-1': 'blazing-star',
  'product-297-1': 'blazing-star',
  'product-297-2': 'blazing-star',
  'product-297-3': 'blazing-star',
  'product-405': 'blazing-star',
  'product-404': 'blazing-star',
  'product-403': 'blazing-star',
  'product-277': 'blazing-star',
  'product-394': 'blazing-star',
  'product-395': 'blazing-star',
  'product-396': 'blazing-star',
  'product-237': 'blazing-star',
  'product-397': 'blazing-star',
  'product-398': 'blazing-star',
  'product-238': 'blazing-star',
  'product-348': 'blazing-star',
  'product-352': 'blazing-star',
  'product-370': 'blazing-star',
  'product-400': 'blazing-star',
  'product-399': 'blazing-star',
  'product-401': 'blazing-star',
  'product-386': 'blazing-star',
  'product-385': 'blazing-star',
  'product-393': 'blazing-star',

  // Bold Berry Products
  'product-208': 'bold-berry',
  'product-209': 'bold-berry',
  'product-213': 'bold-berry',
  'product-218': 'bold-berry',
  'product-216': 'bold-berry',
  'product-204': 'bold-berry',
  'product-200': 'bold-berry',
  'product-210': 'bold-berry',
  'product-356': 'bold-berry',

  // MBerry Products
  'product-225': 'mberry',
  'product-225-1': 'mberry',
  'product-406': 'mberry',
  'product-360': 'mberry',
  'product-371': 'mberry',

  // Flexibuild Products (under BlazingStar ecosystem)
  'product-343': 'flexibuild',
  'product-347': 'flexibuild',
  'product-343-1': 'flexibuild',
  'product-347-1': 'flexibuild',

  // Furniture Products
  'product-378': 'furniture',
  'product-377': 'furniture',
  'product-372': 'furniture',
  'product-381': 'furniture',
  'product-384': 'furniture',
  'product-382': 'furniture',

  // KDS Products
  'product-137': 'kds',
  'product-138': 'kds',
  'product-150': 'kds',
  'product-158': 'kds',
  'product-161': 'kds',
  'product-180': 'kds',

  // La Palm Products
  'product-3': 'lapalm',
  'product-107': 'lapalm',
  'product-7': 'lapalm',
  'product-9': 'lapalm',
  'product-17': 'lapalm',
  'product-21': 'lapalm',
  'product-67': 'lapalm',
  'product-115-test': 'lapalm',
  'product-53': 'lapalm',
  'product-27': 'lapalm',
  'product-402': 'lapalm',
  'product-15': 'lapalm',
  'product-42': 'lapalm',
  'product-84': 'lapalm',
  'product-47': 'lapalm',
  'product-58': 'lapalm',
  'product-58-1': 'lapalm',
  'product-96': 'lapalm',

  // Miscellaneous/Accessories
  'product-366': 'accessories',
  'product-366-1': 'accessories',
  'product-392': 'accessories',
};

async function updateProductBrands() {
  console.log('🔄 Updating product brands in database...\n');

  try {
    // First, create La Palm brand if it doesn't exist
    await prisma.brand.upsert({
      where: { slug: 'lapalm' },
      update: {},
      create: {
        name: 'La Palm',
        slug: 'lapalm',
        description: `Premium spa and pedicure products. Professional-grade treatments for salons.

**Positioning:** Spa treatments, pedicure systems, professional salon products

**Product Lines:**
- Callus removers
- Multi-step pedicure systems (4-step, 5-step, 6-step)
- Masks and scrubs
- Massage oils and lotions
- Sea salts and soaks`,
      },
    });
    console.log('✓ Created/verified La Palm brand');

    // Get all brands
    const brands = await prisma.brand.findMany();
    const brandMap = new Map(brands.map(b => [b.slug, b.id]));

    let updatedCount = 0;
    let skippedCount = 0;

    // Update each product
    for (const [productCode, brandSlug] of Object.entries(productBrandMapping)) {
      const brandId = brandMap.get(brandSlug);

      if (!brandId) {
        console.log(`  ⚠ Brand not found: ${brandSlug} for product ${productCode}`);
        skippedCount++;
        continue;
      }

      try {
        const product = await prisma.product.findUnique({
          where: { productCode },
        });

        if (!product) {
          console.log(`  ⚠ Product not found: ${productCode}`);
          skippedCount++;
          continue;
        }

        // Only update if brand is different
        if (product.brandId !== brandId) {
          await prisma.product.update({
            where: { productCode },
            data: { brandId },
          });

          // Create audit log
          await prisma.auditLog.create({
            data: {
              entityType: 'Product',
              entityId: product.id,
              action: 'UPDATE',
              performedBy: 'system-brand-mapping',
              changes: {
                brandId: { from: product.brandId, to: brandId },
              },
            },
          });

          updatedCount++;
        }
      } catch (error) {
        console.error(`  ✗ Failed to update ${productCode}:`, error);
        skippedCount++;
      }
    }

    console.log(`\n✅ Updated ${updatedCount} products`);
    console.log(`⚠️  Skipped ${skippedCount} products\n`);

    // Show summary by brand
    console.log('📊 Products by Brand:');
    for (const brand of brands) {
      const count = await prisma.product.count({
        where: { brandId: brand.id },
      });
      console.log(`  • ${brand.name}: ${count} products`);
    }

    console.log('\n✅ Brand mapping update completed!\n');
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateProductBrands();
