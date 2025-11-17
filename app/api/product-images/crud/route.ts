import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

// CREATE image(s) - single or batch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle batch create
    if (Array.isArray(body)) {
      const images = [];
      for (const item of body) {
        const {
          versionId,
          imageUrl,
          imageType,
          position,
          displayOrder = 0,
          altText,
          label,
        } = item;

        if (!versionId || !imageUrl || !imageType) {
          return NextResponse.json(
            { error: 'Each image requires versionId, imageUrl, and imageType' },
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

        images.push(image);
      }
      return NextResponse.json(images, { status: 201 });
    }

    // Handle single create
    const {
      versionId,
      imageUrl,
      imageType,
      position,
      displayOrder = 0,
      altText,
      label,
    } = body;

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

// UPDATE image(s) - single or batch
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle batch update
    if (Array.isArray(body)) {
      const images = [];
      for (const item of body) {
        const {
          id,
          imageUrl,
          imageType,
          position,
          displayOrder,
          altText,
          label,
        } = item;

        if (!id) {
          return NextResponse.json(
            { error: 'Each image update requires an id' },
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

        images.push(image);
      }
      return NextResponse.json(images);
    }

    // Handle single update
    const {
      id,
      imageUrl,
      imageType,
      position,
      displayOrder,
      altText,
      label,
    } = body;

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

// DELETE image(s) - single or batch
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const idsParam = searchParams.get('ids');

    // Handle batch delete with ids parameter (comma-separated)
    if (idsParam) {
      const ids = idsParam.split(',').filter((id) => id.trim());

      if (ids.length === 0) {
        return NextResponse.json(
          { error: 'At least one image ID is required' },
          { status: 400 }
        );
      }

      const images = [];
      for (const id of ids) {
        const image = await prisma.productImage.delete({
          where: { id: id.trim() },
        });

        await prisma.auditLog.create({
          data: {
            entityType: 'ProductImage',
            entityId: id.trim(),
            action: 'DELETE',
            performedBy: 'system',
          },
        });

        images.push(image);
      }
      return NextResponse.json(images);
    }

    // Handle single delete
    if (!idParam) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const image = await prisma.productImage.delete({
      where: { id: idParam },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'ProductImage',
        entityId: idParam,
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

// PATCH - Batch operations (reorder, update specific fields)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, updates } = body;

    // Reorder images by updating displayOrder
    if (action === 'reorder' && Array.isArray(updates)) {
      const images = [];
      for (const item of updates) {
        const { id, displayOrder } = item;

        if (!id || displayOrder === undefined) {
          return NextResponse.json(
            { error: 'Each reorder item requires id and displayOrder' },
            { status: 400 }
          );
        }

        const image = await prisma.productImage.update({
          where: { id },
          data: { displayOrder },
        });

        await prisma.auditLog.create({
          data: {
            entityType: 'ProductImage',
            entityId: id,
            action: 'UPDATE',
            performedBy: 'system',
          },
        });

        images.push(image);
      }
      return NextResponse.json(images);
    }

    // Bulk update specific fields
    if (action === 'bulkUpdate' && Array.isArray(updates)) {
      const images = [];
      for (const item of updates) {
        const {
          id,
          imageUrl,
          imageType,
          position,
          displayOrder,
          altText,
          label,
        } = item;

        if (!id) {
          return NextResponse.json(
            { error: 'Each update requires an id' },
            { status: 400 }
          );
        }

        const updateData: any = {};
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (imageType !== undefined) updateData.imageType = imageType;
        if (position !== undefined) updateData.position = position;
        if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
        if (altText !== undefined) updateData.altText = altText;
        if (label !== undefined) updateData.label = label;

        const image = await prisma.productImage.update({
          where: { id },
          data: updateData,
        });

        await prisma.auditLog.create({
          data: {
            entityType: 'ProductImage',
            entityId: id,
            action: 'UPDATE',
            performedBy: 'system',
          },
        });

        images.push(image);
      }
      return NextResponse.json(images);
    }

    return NextResponse.json(
      { error: 'action must be "reorder" or "bulkUpdate" with updates array' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Failed to perform batch operation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to perform batch operation' },
      { status: 500 }
    );
  }
}
