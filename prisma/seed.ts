import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface ProductJSON {
  id: string;
  category: string;
  productName: string;
  promotionText?: string;
  discountPercentage?: number;
  images?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
  };
  pricingTable?: Array<{
    size: string;
    price: string;
    condition: string;
    discount: string;
  }>;
  badgePosition?: 'middle-right' | 'bottom-right';
  [key: string]: any;
}

interface BrandConfig {
  name: string;
  slug: string;
  description?: string;
  keywords: string[];
}

// Brand configuration with keyword matching
const brandConfigs: BrandConfig[] = [
  {
    name: 'Blazing Star',
    slug: 'blazing-star',
    description: 'BlazingStar products including gel polish, acrylic powders, and nail accessories',
    keywords: ['blazingstar', 'blaze star'],
  },
  {
    name: 'Bold Berry',
    slug: 'bold-berry',
    description: 'Bold Berry gel polish and nail products',
    keywords: ['bold berry', 'boldberry'],
  },
  {
    name: 'KDS',
    slug: 'kds',
    description: 'KDS nail care and pedicure products',
    keywords: ['kds'],
  },
  {
    name: 'Flexibuild',
    slug: 'flexibuild',
    description: 'Flexibuild nail extension systems',
    keywords: ['flexibuild'],
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    description: 'Salon furniture and equipment',
    keywords: ['ghế', 'chair', 'table', 'máy'],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Nail accessories and supplies',
    keywords: ['găng tay', 'gloves', 'tool', 'file', 'brush'],
  },
];

// Identify brand from product name
function identifyBrand(productName: string): string {
  const nameLower = productName.toLowerCase();

  for (const brand of brandConfigs) {
    for (const keyword of brand.keywords) {
      if (nameLower.includes(keyword)) {
        return brand.name;
      }
    }
  }

  // Default to category if no brand found
  return 'Other';
}

// Parse price string to number
function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace('£', '').trim();
  return parseFloat(cleaned) || 0;
}

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Read products JSON
    const productsPath = path.join(__dirname, '../data/products-generated.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const products: ProductJSON[] = productsData.products || [];

    console.log(`📦 Found ${products.length} products to seed\n`);

    // Step 1: Create/Get Brands
    console.log('🏢 Creating brands...');
    const brands: Record<string, any> = {};

    for (const brandConfig of brandConfigs) {
      const brand = await prisma.brand.upsert({
        where: { slug: brandConfig.slug },
        update: {},
        create: {
          name: brandConfig.name,
          slug: brandConfig.slug,
          description: brandConfig.description,
        },
      });
      brands[brandConfig.name] = brand;
      console.log(`  ✓ ${brandConfig.name}`);
    }

    console.log();

    // Step 2: Seed Products
    console.log('📝 Seeding products...');
    let productCount = 0;
    let skippedCount = 0;

    for (const productData of products) {
      try {
        const brandName = identifyBrand(productData.productName);
        const brand = brands[brandName] || brands['Accessories'];

        // Create or update product
        const product = await prisma.product.upsert({
          where: { productCode: productData.id },
          update: {
            name: productData.productName,
            isActive: true,
          },
          create: {
            productCode: productData.id,
            name: productData.productName,
            slug: `${productData.id}-${productData.productName.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}`,
            brandId: brand.id,
            isActive: true,
          },
        });

        // Create or get current version
        const existingVersion = await prisma.productVersion.findFirst({
          where: {
            productId: product.id,
            isCurrent: true,
          },
        });

        let version = existingVersion;

        if (!version) {
          version = await prisma.productVersion.create({
            data: {
              productId: product.id,
              versionNumber: 1,
              versionName: 'Initial version',
              isCurrent: true,
              description: `Seeded from products-generated.json`,
              createdBy: 'system-seed',
            },
          });
        }

        // Create product content (description)
        await prisma.productContent.deleteMany({
          where: { versionId: version.id },
        });

        await prisma.productContent.create({
          data: {
            versionId: version.id,
            contentType: 'short_description',
            content: productData.productName,
            language: 'en',
          },
        });

        // Add category as a property
        if (productData.category) {
          let categoryProp = await prisma.productProperty.findFirst({
            where: {
              versionId: version.id,
              propertyKey: 'category',
            },
          });

          if (categoryProp) {
            await prisma.productProperty.update({
              where: { id: categoryProp.id },
              data: { propertyValue: productData.category },
            });
          } else {
            await prisma.productProperty.create({
              data: {
                versionId: version.id,
                propertyKey: 'category',
                propertyValue: productData.category,
                displayOrder: 0,
              },
            });
          }
        }

        // Add other properties
        const propertiesToAdd: Record<string, string | number | boolean | undefined> = {
          promotionText: productData.promotionText,
          badgePosition: productData.badgePosition,
          discountPercentage: productData.discountPercentage,
        };

        let displayOrder = 1;
        for (const [key, value] of Object.entries(propertiesToAdd)) {
          if (value !== undefined && value !== null && value !== '') {
            let existingProp = await prisma.productProperty.findFirst({
              where: {
                versionId: version.id,
                propertyKey: key,
              },
            });

            if (existingProp) {
              await prisma.productProperty.update({
                where: { id: existingProp.id },
                data: { propertyValue: String(value) },
              });
            } else {
              await prisma.productProperty.create({
                data: {
                  versionId: version.id,
                  propertyKey: key,
                  propertyValue: String(value),
                  displayOrder,
                },
              });
            }
            displayOrder++;
          }
        }

        // Seed images
        if (productData.images) {
          const positions = ['topLeft', 'topRight', 'bottomLeft'] as const;

          for (let idx = 0; idx < positions.length; idx++) {
            const position = positions[idx];
            const imageUrl = productData.images[position];

            if (imageUrl) {
              let existingImage = await prisma.productImage.findFirst({
                where: {
                  versionId: version.id,
                  position,
                },
              });

              if (existingImage) {
                await prisma.productImage.update({
                  where: { id: existingImage.id },
                  data: { imageUrl },
                });
              } else {
                await prisma.productImage.create({
                  data: {
                    versionId: version.id,
                    imageUrl,
                    imageType: 'product',
                    position,
                    displayOrder: idx,
                  },
                });
              }
            }
          }
        }

        // Seed pricing
        if (productData.pricingTable && Array.isArray(productData.pricingTable)) {
          // Delete existing pricing for this version
          await prisma.pricing.deleteMany({
            where: { versionId: version.id },
          });

          for (let idx = 0; idx < productData.pricingTable.length; idx++) {
            const row = productData.pricingTable[idx];
            const price = parsePrice(row.price);
            const discountPrice = parsePrice(row.discount);

            await prisma.pricing.create({
              data: {
                versionId: version.id,
                size: row.size,
                price,
                currency: 'GBP',
                condition: row.condition,
                discountPrice,
                displayOrder: idx,
              },
            });
          }
        }

        productCount++;
        if (productCount % 50 === 0) {
          console.log(`  ✓ Seeded ${productCount} products...`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to seed product ${productData.id}:`, error);
        skippedCount++;
      }
    }

    console.log(
      `\n✅ Successfully seeded ${productCount} products (${skippedCount} skipped)\n`
    );

    // Step 3: Summary
    console.log('📊 Database Summary:');

    const brandCount = await prisma.brand.count();
    const productsInDb = await prisma.product.count();
    const versionsInDb = await prisma.productVersion.count();
    const imagesInDb = await prisma.productImage.count();
    const pricingInDb = await prisma.pricing.count();
    const propertiesInDb = await prisma.productProperty.count();

    console.log(`  • Brands: ${brandCount}`);
    console.log(`  • Products: ${productsInDb}`);
    console.log(`  • Versions: ${versionsInDb}`);
    console.log(`  • Images: ${imagesInDb}`);
    console.log(`  • Pricing Rows: ${pricingInDb}`);
    console.log(`  • Properties: ${propertiesInDb}`);

    console.log(
      '\n🎉 Seeding completed successfully!\n'
    );
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
