import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const productCode = request.nextUrl.searchParams.get('productCode');
    const action = request.nextUrl.searchParams.get('action');

    if (!productCode) {
      return NextResponse.json(
        { error: 'Product code is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { productCode: productCode },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          include: {
            contents: true,
            images: true,
            properties: true,
            pricing: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // For comparison action, return detailed data
    if (action === 'compare') {
      const v1Id = request.nextUrl.searchParams.get('v1');
      const v2Id = request.nextUrl.searchParams.get('v2');

      if (!v1Id || !v2Id) {
        return NextResponse.json(
          { error: 'v1 and v2 parameters required' },
          { status: 400 }
        );
      }

      const version1 = product.versions.find(v => v.id === v1Id);
      const version2 = product.versions.find(v => v.id === v2Id);

      if (!version1 || !version2) {
        return NextResponse.json(
          { error: 'One or both versions not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        product: {
          code: product.productCode,
          name: product.name,
        },
        version1: {
          ...version1,
          changedAt: version1.createdAt,
        },
        version2: {
          ...version2,
          changedAt: version2.createdAt,
        },
      });
    }

    // Return all versions
    return NextResponse.json({
      product: {
        id: product.id,
        code: product.productCode,
        name: product.name,
      },
      versions: product.versions.map(v => ({
        id: v.id,
        versionNumber: v.versionNumber,
        versionName: v.versionName,
        isCurrent: v.isCurrent,
        description: v.description,
        createdAt: v.createdAt,
        updatedAt: v.createdAt,
        contentsCount: v.contents?.length || 0,
        imagesCount: v.images?.length || 0,
        propertiesCount: v.properties?.length || 0,
        pricingCount: v.pricing?.length || 0,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Version list error:', message);

    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

// Rollback to a specific version
export async function POST(request: NextRequest) {
  try {
    const { productCode, versionId } = await request.json();

    if (!productCode || !versionId) {
      return NextResponse.json(
        { error: 'Product code and version ID are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { productCode: productCode },
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

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const sourceVersion = product.versions.find(v => v.id === versionId);
    if (!sourceVersion) {
      return NextResponse.json(
        { error: 'Source version not found' },
        { status: 404 }
      );
    }

    // Set all versions to not current
    await prisma.productVersion.updateMany({
      where: { productId: product.id },
      data: { isCurrent: false },
    });

    // Create new version as copy
    const currentVersion = product.versions.find(v => v.isCurrent);
    const newVersionNumber = (currentVersion?.versionNumber || 0) + 1;

    const newVersion = await prisma.productVersion.create({
      data: {
        productId: product.id,
        versionNumber: newVersionNumber,
        versionName: `Rollback from v${sourceVersion.versionNumber}`,
        description: sourceVersion.description,
        isCurrent: true,
        createdBy: 'rollback',
        contents: {
          createMany: {
            data: sourceVersion.contents.map(c => ({
              contentType: c.contentType,
              content: c.content,
              language: c.language,
            })),
          },
        },
        images: {
          createMany: {
            data: sourceVersion.images.map(img => ({
              imageUrl: img.imageUrl,
              imageType: img.imageType,
              position: img.position,
              displayOrder: img.displayOrder,
              label: img.label,
            })),
          },
        },
        properties: {
          createMany: {
            data: sourceVersion.properties.map(p => ({
              propertyKey: p.propertyKey,
              propertyValue: p.propertyValue,
            })),
          },
        },
        pricing: {
          createMany: {
            data: sourceVersion.pricing.map(pr => ({
              size: pr.size,
              price: pr.price,
              discountPrice: pr.discountPrice,
              condition: pr.condition,
              currency: pr.currency,
              displayOrder: pr.displayOrder,
            })),
          },
        },
      },
      include: {
        contents: true,
        images: true,
        properties: true,
        pricing: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully rolled back to version ${sourceVersion.versionNumber}`,
        newVersion,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Rollback error:', message);

    return NextResponse.json(
      { error: 'Failed to rollback version' },
      { status: 500 }
    );
  }
}
