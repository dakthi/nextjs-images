import { prisma } from './prisma';
import JSZip from 'jszip';
import { Parser } from 'json2csv';

/**
 * Export utilities for generating product info packs in various formats
 */

export interface ProductExportData {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  isActive: boolean;
  brandId: string;
  brandName: string;
  description?: string;
  images: Array<{
    url: string;
    type: string;
    position?: string;
    label?: string;
    altText?: string;
  }>;
  properties: Array<{ key: string; value: string }>;
  pricing: Array<{
    size: string;
    price: string;
    currency: string;
    condition?: string;
    discountPrice?: string;
  }>;
  content: Array<{
    type: string;
    text: string;
    language: string;
  }>;
}

/**
 * Build complete product information for export
 */
export async function buildProductInfo(productCode: string): Promise<ProductExportData | null> {
  const product = await prisma.product.findUnique({
    where: { productCode },
    include: {
      brand: true,
      versions: {
        where: { isCurrent: true },
        include: {
          contents: true,
          images: { orderBy: { displayOrder: 'asc' } },
          pricing: { orderBy: { displayOrder: 'asc' } },
          properties: { orderBy: { displayOrder: 'asc' } },
        },
        take: 1,
      },
    },
  });

  if (!product || !product.versions[0]) return null;
  const version = product.versions[0];

  return {
    id: product.id,
    productCode: product.productCode,
    name: product.name,
    slug: product.slug,
    isActive: product.isActive,
    brandId: product.brandId,
    brandName: product.brand.name,
    description: version.description || undefined,
    images: version.images.map((img: any) => ({
      url: img.imageUrl,
      type: img.imageType,
      position: img.position,
      label: img.label,
      altText: img.altText,
    })),
    properties: version.properties
      .filter((prop: any) => {
        const saleCardProps = [
          'promotionText',
          'badgePosition',
          'showOnlyPriceColumn',
          'showSizeAndConditionColumnsOnly',
          'discountPercentage',
        ];
        return !saleCardProps.includes(prop.propertyKey);
      })
      .map((prop: any) => ({ key: prop.propertyKey, value: prop.propertyValue })),
    pricing: version.pricing.map((p: any) => ({
      size: p.size,
      price: p.price.toString(),
      currency: p.currency,
      condition: p.condition,
      discountPrice: p.discountPrice?.toString(),
    })),
    content: version.contents.map((c: any) => ({
      type: c.contentType,
      text: c.content,
      language: c.language,
    })),
  };
}

/**
 * Get products by brand
 */
export async function getProductsByBrand(brandId: string): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { brandId, isActive: true },
    select: { productCode: true },
  });
  return products.map((p) => p.productCode);
}

/**
 * Get all active products
 */
export async function getAllActiveProducts(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { productCode: true },
  });
  return products.map((p) => p.productCode);
}

/**
 * Search products by name or code
 */
export async function searchProducts(query: string, limit: number = 100): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { productCode: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { productCode: true },
    take: limit,
  });
  return products.map((p) => p.productCode);
}

/**
 * Download image as buffer with error handling
 */
export async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.(\w+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
  } catch {
    return 'jpg';
  }
}

/**
 * Generate JSON export
 */
export function generateJSONExport(products: ProductExportData[]): string {
  return JSON.stringify(products, null, 2);
}

/**
 * Generate CSV export
 */
export function generateCSVExport(products: ProductExportData[]): string {
  const flatData = products.map((p) => ({
    productCode: p.productCode,
    name: p.name,
    brand: p.brandName,
    active: p.isActive ? 'Yes' : 'No',
    description: p.description || '',
    imageCount: p.images.length,
    propertyCount: p.properties.length,
    pricingCount: p.pricing.length,
  }));

  const parser = new Parser();
  return parser.parse(flatData);
}

/**
 * Generate ZIP export with folder structure
 */
export async function generateZIPExport(
  products: ProductExportData[],
  includeImages: boolean = true
): Promise<Uint8Array> {
  const zip = new JSZip();

  // Add main products file
  zip.file('products.json', generateJSONExport(products));
  zip.file('products.csv', generateCSVExport(products));

  // Add individual product folders
  for (const product of products) {
    const folder = zip.folder(product.productCode);
    if (!folder) continue;

    // Product details
    folder.file('product.json', JSON.stringify(product, null, 2));

    // Summary file
    const summary = `
Product: ${product.name}
Code: ${product.productCode}
Brand: ${product.brandName}
Active: ${product.isActive ? 'Yes' : 'No'}
Description: ${product.description || 'N/A'}

Images: ${product.images.length}
Properties: ${product.properties.length}
Pricing Options: ${product.pricing.length}

Generated: ${new Date().toISOString()}
    `.trim();
    folder.file('README.txt', summary);

    // Images
    if (includeImages && product.images.length > 0) {
      const imagesFolder = folder.folder('images');
      if (imagesFolder) {
        for (let i = 0; i < product.images.length; i++) {
          const image = product.images[i];
          const ext = getFileExtension(image.url);
          const imageName = `${i + 1}-${image.type}.${ext}`;
          const imageBuffer = await downloadImage(image.url);
          if (imageBuffer) {
            imagesFolder.file(imageName, imageBuffer);
          }
        }
      }
    }

    // Properties
    if (product.properties.length > 0) {
      const propsData = product.properties
        .map((p) => `${p.key}: ${p.value}`)
        .join('\n');
      folder.file('properties.txt', propsData);
    }

    // Pricing
    if (product.pricing.length > 0) {
      const pricingCSV = [
        'Size,Price,Currency,Condition,Discount Price',
        ...product.pricing.map(
          (p) =>
            `"${p.size}",${p.price},${p.currency},"${p.condition || ''}",${p.discountPrice || ''}`
        ),
      ].join('\n');
      folder.file('pricing.csv', pricingCSV);
    }

    // Content
    if (product.content.length > 0) {
      for (const content of product.content) {
        const contentFile = `content-${content.type}-${content.language}.txt`;
        folder.file(contentFile, content.text);
      }
    }
  }

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  return new Uint8Array(zipBuffer);
}

/**
 * Export summary
 */
export interface ExportSummary {
  format: string;
  productCount: number;
  timestamp: string;
  fileName: string;
  fileSize: number;
}

export function getExportFileName(
  format: 'json' | 'csv' | 'zip',
  productCount: number,
  type: 'products' | 'brand',
  name?: string
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  if (type === 'brand' && name) {
    return `${name}-info-pack-${productCount}-products-${timestamp}.${format}`;
  }
  return `products-info-pack-${productCount}-items-${timestamp}.${format}`;
}
