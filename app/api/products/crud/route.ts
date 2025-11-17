import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single product or all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const brandId = searchParams.get('brandId');

    if (id) {
      // Get single product with all versions and relations
      const product = await prisma.product.findUnique({
        where: { productCode: id },
        include: {
          brand: true,
          versions: {
            include: {
              contents: true,
              images: { orderBy: { displayOrder: 'asc' } },
              properties: { orderBy: { displayOrder: 'asc' } },
              pricing: { orderBy: { displayOrder: 'asc' } },
            },
            orderBy: { versionNumber: 'desc' },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    } else if (brandId) {
      // Get all products for a brand
      const products = await prisma.product.findMany({
        where: { brandId },
        include: {
          brand: true,
          versions: {
            where: { isCurrent: true },
            include: {
              contents: true,
              images: true,
              properties: true,
              pricing: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(products);
    } else {
      // Get all products
      const products = await prisma.product.findMany({
        include: {
          brand: true,
          _count: { select: { versions: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(products);
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// CREATE product
export async function POST(request: NextRequest) {
  try {
    const {
      brandId,
      productCode,
      name,
      slug,
      description,
      isActive = true,
    } = await request.json();

    if (!brandId || !productCode || !name) {
      return NextResponse.json(
        { error: 'brandId, productCode, and name are required' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        brandId,
        productCode,
        name,
        slug: slug || `${productCode}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        isActive,
      },
    });

    // Create initial version
    const version = await prisma.productVersion.create({
      data: {
        productId: product.id,
        versionNumber: 1,
        versionName: 'Initial version',
        isCurrent: true,
        description: description || 'Initial product version',
        createdBy: 'system',
      },
    });

    // Create initial content if provided
    if (description) {
      await prisma.productContent.create({
        data: {
          versionId: version.id,
          contentType: 'short_description',
          content: description,
          language: 'en',
        },
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'Product',
        entityId: product.id,
        action: 'CREATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(
      {
        product,
        version,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(request: NextRequest) {
  try {
    const {
      productCode,
      name,
      slug,
      isActive,
      description,
      createNewVersion = false,
    } = await request.json();

    if (!productCode) {
      return NextResponse.json(
        { error: 'productCode is required' },
        { status: 400 }
      );
    }

    // Update product basic info
    const product = await prisma.product.update({
      where: { productCode },
      data: {
        name,
        slug,
        isActive,
      },
      include: {
        versions: {
          where: { isCurrent: true },
          take: 1,
        },
      },
    });

    let currentVersion = product.versions[0];

    // If creating new version, create it; otherwise update current
    if (createNewVersion) {
      const lastVersion = await prisma.productVersion.findFirst({
        where: { productId: product.id },
        orderBy: { versionNumber: 'desc' },
      });

      const newVersionNumber = (lastVersion?.versionNumber || 0) + 1;

      // Mark old version as not current
      await prisma.productVersion.update({
        where: { id: currentVersion.id },
        data: { isCurrent: false },
      });

      // Create new version
      currentVersion = await prisma.productVersion.create({
        data: {
          productId: product.id,
          versionNumber: newVersionNumber,
          versionName: `Version ${newVersionNumber}`,
          isCurrent: true,
          description: description || `Updated version ${newVersionNumber}`,
          createdBy: 'system',
        },
      });
    }

    // Update or create content
    if (description) {
      const existingContent = await prisma.productContent.findFirst({
        where: {
          versionId: currentVersion.id,
          contentType: 'short_description',
        },
      });

      if (existingContent) {
        await prisma.productContent.update({
          where: { id: existingContent.id },
          data: { content: description },
        });
      } else {
        await prisma.productContent.create({
          data: {
            versionId: currentVersion.id,
            contentType: 'short_description',
            content: description,
            language: 'en',
          },
        });
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'Product',
        entityId: product.id,
        action: 'UPDATE',
        performedBy: 'system',
        changes: { name, slug, isActive, description },
      },
    });

    return NextResponse.json({ product, version: currentVersion });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get('id');

    if (!productCode) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.delete({
      where: { productCode },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'Product',
        entityId: product.id,
        action: 'DELETE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
