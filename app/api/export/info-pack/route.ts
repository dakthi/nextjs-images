import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ExportOptions {
  productIds?: string[];
  brandId?: string;
  format: 'json' | 'csv';
  includeImages?: boolean;
  includeProperties?: boolean;
  includePricing?: boolean;
  includeVersions?: boolean;
}

// Build comprehensive product data object
async function buildProductInfo(productCode: string) {
  const product = await prisma.product.findUnique({
    where: { productCode },
    include: {
      brand: true,
      versions: {
        where: { isCurrent: true },
        include: {
          content: true,
          images: { orderBy: { displayOrder: 'asc' } },
          pricing: { orderBy: { displayOrder: 'asc' } },
          properties: { orderBy: { displayOrder: 'asc' } },
        },
        take: 1,
      },
    },
  });

  if (!product || !product.versions[0]) {
    return null;
  }

  const version = product.versions[0];

  return {
    id: product.id,
    productCode: product.productCode,
    name: product.name,
    slug: product.slug,
    isActive: product.isActive,
    brand: {
      id: product.brand.id,
      name: product.brand.name,
      slug: product.brand.slug,
    },
    currentVersion: {
      versionNumber: version.versionNumber,
      versionName: version.versionName,
      description: version.description,
      createdBy: version.createdBy,
      createdAt: version.createdAt.toISOString(),
    },
    content: version.content.map((c) => ({
      type: c.contentType,
      text: c.content,
      language: c.language,
    })),
    images: version.images.map((img) => ({
      url: img.imageUrl,
      type: img.imageType,
      position: img.position,
      altText: img.altText,
      label: img.label,
    })),
    properties: version.properties.map((prop) => ({
      key: prop.propertyKey,
      value: prop.propertyValue,
    })),
    pricing: version.pricing.map((p) => ({
      size: p.size,
      price: p.price.toString(),
      currency: p.currency,
      condition: p.condition,
      discountPrice: p.discountPrice?.toString(),
      discountLabel: p.discountLabel,
    })),
  };
}

// Convert to CSV format
function convertToCSV(products: any[]): string {
  if (products.length === 0) {
    return 'No products found';
  }

  // Flatten product data for CSV
  const rows: string[] = [];

  // Header
  const headers = [
    'Product ID',
    'Product Code',
    'Product Name',
    'Brand',
    'Category',
    'Status',
    'Version',
    'Description',
    'Image URLs',
    'Sizes',
    'Prices (GBP)',
    'Discount Prices',
    'Conditions',
    'Properties',
  ];
  rows.push(headers.map((h) => `"${h}"`).join(','));

  // Data rows
  for (const product of products) {
    const category =
      product.properties.find((p: any) => p.key === 'category')?.value || '';
    const imageurls = product.images.map((img: any) => img.url).join('; ');
    const sizes = product.pricing.map((p: any) => p.size).join('; ');
    const prices = product.pricing.map((p: any) => p.price).join('; ');
    const discountPrices = product.pricing
      .map((p: any) => p.discountPrice || p.price)
      .join('; ');
    const conditions = product.pricing.map((p: any) => p.condition || '').join('; ');
    const propertiesStr = product.properties
      .map((p: any) => `${p.key}=${p.value}`)
      .join('; ');

    const row = [
      product.id,
      product.productCode,
      product.name,
      product.brand.name,
      category,
      product.isActive ? 'Active' : 'Inactive',
      `v${product.currentVersion.versionNumber}`,
      product.currentVersion.description || '',
      imageurls,
      sizes,
      prices,
      discountPrices,
      conditions,
      propertiesStr,
    ];

    rows.push(row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','));
  }

  return rows.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ExportOptions;
    const {
      productIds,
      brandId,
      format = 'json',
      includeImages = true,
      includeProperties = true,
      includePricing = true,
      includeVersions = true,
    } = body;

    let productsToExport = [];

    // Get products based on filter
    if (productIds && productIds.length > 0) {
      // Specific products
      for (const id of productIds) {
        const product = await buildProductInfo(id);
        if (product) {
          productsToExport.push(product);
        }
      }
    } else if (brandId) {
      // All products from a brand
      const products = await prisma.product.findMany({
        where: { brandId },
        select: { productCode: true },
      });
      for (const p of products) {
        const product = await buildProductInfo(p.productCode);
        if (product) {
          productsToExport.push(product);
        }
      }
    } else {
      // All products
      const products = await prisma.product.findMany({
        select: { productCode: true },
      });
      for (const p of products) {
        const product = await buildProductInfo(p.productCode);
        if (product) {
          productsToExport.push(product);
        }
      }
    }

    // Filter based on options
    const filteredProducts = productsToExport.map((p) => ({
      ...p,
      images: includeImages ? p.images : undefined,
      properties: includeProperties ? p.properties : undefined,
      pricing: includePricing ? p.pricing : undefined,
      content: p.content || undefined,
      currentVersion: includeVersions ? p.currentVersion : undefined,
    }));

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const count = filteredProducts.length;
    const filename = `product-info-pack-${count}-items-${timestamp}`;

    // Return in requested format
    if (format === 'csv') {
      const csv = convertToCSV(filteredProducts);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      });
    } else {
      // JSON format
      const json = {
        metadata: {
          exportedAt: new Date().toISOString(),
          totalProducts: filteredProducts.length,
          filters: {
            productIds: productIds?.length ?? 'all',
            brandId: brandId || 'all',
          },
        },
        products: filteredProducts,
      };

      return new NextResponse(JSON.stringify(json, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}.json"`,
        },
      });
    }
  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    );
  }
}
