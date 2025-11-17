import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET images for a product version
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('versionId');
    const imageId = searchParams.get('id');

    if (imageId) {
      const image = await prisma.productImage.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(image);
    } else if (versionId) {
      const images = await prisma.productImage.findMany({
        where: { versionId },
        orderBy: { displayOrder: 'asc' },
      });

      return NextResponse.json(images);
    } else {
      return NextResponse.json(
        { error: 'versionId or imageId is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// CREATE image
export async function POST(request: NextRequest) {
  try {
    const {
      versionId,
      imageUrl,
      imageType,
      position,
      displayOrder = 0,
      altText,
      label,
    } = await request.json();

    if (!versionId || !imageUrl || !imageType) {
      return NextResponse.json(
        { error: 'versionId, imageUrl, and imageType are required' },
        { status: 400 }
      );
    }

    const image = await prisma.productImage.create({
      data: {
        versionId,
        imageUrl,
        imageType,
        position,
        displayOrder,
        altText,
        label,
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'ProductImage',
        entityId: image.id,
        action: 'CREATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Failed to create image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create image' },
      { status: 500 }
    );
  }
}

// UPDATE image
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      imageUrl,
      imageType,
      position,
      displayOrder,
      altText,
      label,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const image = await prisma.productImage.update({
      where: { id },
      data: {
        imageUrl,
        imageType,
        position,
        displayOrder,
        altText,
        label,
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'ProductImage',
        entityId: id,
        action: 'UPDATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Failed to update image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const image = await prisma.productImage.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'ProductImage',
        entityId: id,
        action: 'DELETE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Failed to delete image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete image' },
      { status: 500 }
    );
  }
}
