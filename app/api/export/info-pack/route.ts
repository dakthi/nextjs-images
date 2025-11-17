import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';

const prisma = new PrismaClient();

interface ExportOptions {
  productIds?: string[];
  brandId?: string;
  format: 'json' | 'csv' | 'zip';
  includeImages?: boolean;
  includeProperties?: boolean;
  includePricing?: boolean;
  includeVersions?: boolean;
}

async function buildProductInfo(productCode: string) {
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
    brand: { id: product.brand.id, name: product.brand.name, slug: product.brand.slug },
    currentVersion: {
      versionNumber: version.versionNumber,
      versionName: version.versionName,
      description: version.description,
      createdBy: version.createdBy,
      createdAt: version.createdAt.toISOString(),
    },
    content: version.contents.map((c: any) => ({
      type: c.contentType,
      text: c.content,
      language: c.language,
    })),
    images: version.images.map((img: any) => ({
      url: img.imageUrl,
      type: img.imageType,
      position: img.position,
      altText: img.altText,
      label: img.label,
    })),
    properties: version.properties
      .filter((prop: any) => {
        const saleCardProps = ['promotionText', 'badgePosition', 'showOnlyPriceColumn', 'showSizeAndConditionColumnsOnly', 'discountPercentage'];
        return !saleCardProps.includes(prop.propertyKey);
      })
      .map((prop: any) => ({ key: prop.propertyKey, value: prop.propertyValue })),
    pricing: version.pricing.map((p: any) => ({
      size: p.size,
      price: p.price.toString(),
      currency: p.currency,
      condition: p.condition,
      discountPrice: p.discountPrice?.toString(),
      discountLabel: p.discountLabel,
    })),
  };
}

async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error(`Error downloading image:`, error);
    return null;
  }
}

function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.(\w+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
  } catch {
    return 'jpg';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ExportOptions;
    const { productIds, brandId, format = 'zip', includeImages = true, includeProperties = true, includePricing = true } = body;

    let productsToExport = [];

    if (productIds && productIds.length > 0) {
      for (const id of productIds) {
        const product = await buildProductInfo(id);
        if (product) productsToExport.push(product);
      }
    } else if (brandId) {
      const products = await prisma.product.findMany({ where: { brandId }, select: { productCode: true } });
      for (const p of products) {
        const product = await buildProductInfo(p.productCode);
        if (product) productsToExport.push(product);
      }
    } else {
      const products = await prisma.product.findMany({ select: { productCode: true } });
      for (const p of products) {
        const product = await buildProductInfo(p.productCode);
        if (product) productsToExport.push(product);
      }
    }

    const filteredProducts = productsToExport.map((p) => ({
      ...p,
      images: includeImages ? p.images : undefined,
      properties: includeProperties ? p.properties : undefined,
      pricing: includePricing ? p.pricing : undefined,
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `product-info-pack-${filteredProducts.length}-items-${timestamp}`;

    if (format === 'zip') {
      const zip = new JSZip();
      zip.file('products.json', JSON.stringify(filteredProducts, null, 2));

      for (const product of filteredProducts) {
        const folder = zip.folder(`${product.productCode}`);
        if (!folder) continue;

        folder.file('product.json', JSON.stringify(product, null, 2));

        if (includeImages && product.images && product.images.length > 0) {
          const imagesFolder = folder.folder('images');
          if (imagesFolder) {
            for (let i = 0; i < product.images.length; i++) {
              const image = product.images[i];
              const ext = getFileExtension(image.url);
              const imageName = `${i}-${image.type}.${ext}`;
              const imageBuffer = await downloadImage(image.url);
              if (imageBuffer) imagesFolder.file(imageName, imageBuffer);
            }
          }
        }
      }

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return new NextResponse(new Uint8Array(zipBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}.zip"`,
        },
      });
    }

    return new NextResponse(JSON.stringify(filteredProducts, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}.json"`,
      },
    });
  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Export failed' }, { status: 500 });
  }
}
