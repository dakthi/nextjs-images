import { Product, PricingRow } from '@/types/product';
import { prisma } from '@/lib/prisma';

/**
 * Transform database product record to frontend Product format
 */
export async function dbProductToFrontend(productWithRelations: any): Promise<Product> {
  // Get the current version
  const currentVersion = productWithRelations.versions.find((v: any) => v.isCurrent) ||
                         productWithRelations.versions[0];

  if (!currentVersion) {
    throw new Error(`No version found for product ${productWithRelations.id}`);
  }

  // Extract properties from ProductProperty records
  const propertiesMap = new Map<string, string>();
  currentVersion.properties?.forEach((prop: any) => {
    propertiesMap.set(prop.propertyKey, prop.propertyValue);
  });

  // Extract images
  const imagesMap: Record<string, string> = {};
  currentVersion.images?.forEach((img: any) => {
    if (img.position === 'topLeft' || img.position === 'topRight' || img.position === 'bottomLeft') {
      imagesMap[img.position] = img.imageUrl;
    }
  });

  // Extract pricing table
  const pricingTable: PricingRow[] = (currentVersion.pricing || [])
    .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
    .map((p: any) => ({
      size: p.size,
      price: `£${p.price.toString()}`,
      condition: p.condition || '',
      discount: `£${p.discountPrice?.toString() || p.price.toString()}`,
    }));

  // Build the product object
  const product: Product = {
    id: productWithRelations.productCode,
    category: propertiesMap.get('category') || '',
    productName: productWithRelations.name,
    promotionText: propertiesMap.get('promotionText'),
    discountPercentage: parseInt(propertiesMap.get('discountPercentage') || '0'),
    images: {
      topLeft: imagesMap['topLeft'] || '',
      topRight: imagesMap['topRight'] || '',
      bottomLeft: imagesMap['bottomLeft'] || '',
    },
    pricingTable: pricingTable,
    badgePosition: propertiesMap.get('badgePosition'),
    tableTextSize: propertiesMap.get('tableTextSize'),
    scents: propertiesMap.get('scents')?.split(',').map(s => s.trim()) || [],
    showOnlyPriceColumn: propertiesMap.get('showOnlyPriceColumn') === 'true',
    showSizeAndConditionColumnsOnly: propertiesMap.get('showSizeAndConditionColumnsOnly') === 'true',
  };

  return product;
}

/**
 * Get all products from database in frontend format
 */
export async function getAllProductsFromDb(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      versions: {
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
          pricing: {
            orderBy: { displayOrder: 'asc' },
          },
          properties: {
            orderBy: { displayOrder: 'asc' },
          },
        },
        orderBy: { versionNumber: 'desc' },
      },
      brand: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return Promise.all(
    products.map((p) => dbProductToFrontend(p))
  );
}

/**
 * Get single product by ID (productCode)
 */
export async function getProductFromDb(productCode: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { productCode },
    include: {
      versions: {
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
          pricing: {
            orderBy: { displayOrder: 'asc' },
          },
          properties: {
            orderBy: { displayOrder: 'asc' },
          },
        },
        orderBy: { versionNumber: 'desc' },
      },
      brand: true,
    },
  });

  if (!product) return null;
  return dbProductToFrontend(product);
}

/**
 * Update product in database
 */
export async function updateProductInDb(productCode: string, updates: Partial<Product>, userId: string = 'system'): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { productCode },
    include: {
      versions: {
        where: { isCurrent: true },
        include: {
          images: true,
          pricing: true,
          properties: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error(`Product not found: ${productCode}`);
  }

  const currentVersion = product.versions[0];
  if (!currentVersion) {
    throw new Error(`No current version found for product: ${productCode}`);
  }

  // Update basic product info
  await prisma.product.update({
    where: { productCode },
    data: {
      name: updates.productName || product.name,
    },
  });

  // Update properties
  const propertiesToUpdate = [
    { key: 'category', value: updates.category },
    { key: 'promotionText', value: updates.promotionText },
    { key: 'discountPercentage', value: updates.discountPercentage?.toString() },
    { key: 'badgePosition', value: updates.badgePosition },
    { key: 'tableTextSize', value: updates.tableTextSize },
    { key: 'showOnlyPriceColumn', value: updates.showOnlyPriceColumn?.toString() },
    { key: 'showSizeAndConditionColumnsOnly', value: updates.showSizeAndConditionColumnsOnly?.toString() },
  ];

  for (const { key, value } of propertiesToUpdate) {
    if (value !== undefined) {
      const existing = await prisma.productProperty.findFirst({
        where: {
          versionId: currentVersion.id,
          propertyKey: key,
        },
      });

      if (existing) {
        await prisma.productProperty.update({
          where: { id: existing.id },
          data: { propertyValue: value },
        });
      } else {
        await prisma.productProperty.create({
          data: {
            versionId: currentVersion.id,
            propertyKey: key,
            propertyValue: value,
          },
        });
      }
    }
  }

  // Update images
  if (updates.images) {
    const positions = ['topLeft', 'topRight', 'bottomLeft'] as const;
    for (let idx = 0; idx < positions.length; idx++) {
      const position = positions[idx];
      const imageUrl = updates.images[position];

      if (imageUrl) {
        const existing = await prisma.productImage.findFirst({
          where: {
            versionId: currentVersion.id,
            position,
          },
        });

        if (existing) {
          await prisma.productImage.update({
            where: { id: existing.id },
            data: { imageUrl },
          });
        } else {
          await prisma.productImage.create({
            data: {
              versionId: currentVersion.id,
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

  // Update pricing
  if (updates.pricingTable) {
    // Delete old pricing rows
    await prisma.pricing.deleteMany({
      where: { versionId: currentVersion.id },
    });

    // Create new pricing rows
    for (let idx = 0; idx < updates.pricingTable.length; idx++) {
      const row = updates.pricingTable[idx];
      const price = parseFloat(row.price.replace('£', '').trim());
      const discountPrice = parseFloat(row.discount.replace('£', '').trim());

      await prisma.pricing.create({
        data: {
          versionId: currentVersion.id,
          size: row.size,
          price,
          condition: row.condition,
          discountPrice,
          displayOrder: idx,
          currency: 'GBP',
        },
      });
    }
  }

  // Create audit log
  await prisma.auditLog.create({
    data: {
      entityType: 'product',
      entityId: product.id,
      action: 'update',
      performedBy: userId,
      changes: updates,
    },
  });

  // Fetch and return updated product
  return getProductFromDb(productCode) as Promise<Product>;
}
