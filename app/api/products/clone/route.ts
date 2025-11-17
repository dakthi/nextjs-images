import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Clone/Duplicate a product with all its content, images, pricing, and properties
 * Creates a new product with unique code and slug
 */
export async function POST(request: NextRequest) {
  try {
    const { productCode, newProductCode, newName } = await request.json();

    if (!productCode || !newProductCode || !newName) {
      return NextResponse.json(
        { error: 'productCode, newProductCode, and newName are required' },
        { status: 400 }
      );
    }

    // Check if source product exists
    const sourceProduct = await prisma.product.findUnique({
      where: { productCode },
      include: {
        versions: {
          include: {
            contents: true,
            images: true,
            properties: true,
            pricing: true,
          },
        },
      },
    });

    if (!sourceProduct) {
      return NextResponse.json(
        { error: 'Source product not found' },
        { status: 404 }
      );
    }

    // Check if new code already exists
    const existingCode = await prisma.product.findUnique({
      where: { productCode: newProductCode },
    });

    if (existingCode) {
      return NextResponse.json(
        { error: `Product code "${newProductCode}" already exists` },
        { status: 400 }
      );
    }

    // Generate slug from name
    const newSlug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug: newSlug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: `Slug "${newSlug}" already exists` },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        brandId: sourceProduct.brandId,
        productCode: newProductCode,
        name: newName,
        slug: newSlug,
        isActive: sourceProduct.isActive,
      },
    });

    // Clone all versions and related data
    for (const version of sourceProduct.versions) {
      const newVersion = await prisma.productVersion.create({
        data: {
          productId: newProduct.id,
          versionNumber: version.versionNumber,
          versionName: version.versionName,
          isCurrent: version.isCurrent,
          description: version.description,
          createdBy: version.createdBy,
        },
      });

      // Clone content
      if (version.contents.length > 0) {
        await prisma.productContent.createMany({
          data: version.contents.map((content) => ({
            versionId: newVersion.id,
            contentType: content.contentType,
            content: content.content,
            language: content.language,
          })),
        });
      }

      // Clone images
      if (version.images.length > 0) {
        await prisma.productImage.createMany({
          data: version.images.map((image) => ({
            versionId: newVersion.id,
            imageUrl: image.imageUrl,
            imageType: image.imageType,
            position: image.position,
            displayOrder: image.displayOrder,
            altText: image.altText,
            label: image.label,
          })),
        });
      }

      // Clone properties
      if (version.properties.length > 0) {
        await prisma.productProperty.createMany({
          data: version.properties.map((prop) => ({
            versionId: newVersion.id,
            propertyKey: prop.propertyKey,
            propertyValue: prop.propertyValue,
            displayOrder: prop.displayOrder,
          })),
        });
      }

      // Clone pricing
      if (version.pricing.length > 0) {
        await prisma.pricing.createMany({
          data: version.pricing.map((price) => ({
            versionId: newVersion.id,
            size: price.size,
            price: price.price,
            currency: price.currency,
            condition: price.condition,
            discountPrice: price.discountPrice,
            discountLabel: price.discountLabel,
            displayOrder: price.displayOrder,
          })),
        });
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'Product',
        entityId: newProduct.id,
        action: 'CLONE',
        performedBy: 'system',
        changes: {
          sourceProductCode: productCode,
          newProductCode: newProductCode,
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Product cloned successfully',
        product: {
          id: newProduct.id,
          productCode: newProduct.productCode,
          name: newProduct.name,
          slug: newProduct.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Clone product failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Clone failed' },
      { status: 500 }
    );
  }
}
