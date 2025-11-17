import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET properties for a product version
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('versionId');
    const propertyId = searchParams.get('id');

    if (propertyId) {
      const property = await prisma.productProperty.findUnique({
        where: { id: propertyId },
      });

      if (!property) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(property);
    } else if (versionId) {
      const properties = await prisma.productProperty.findMany({
        where: { versionId },
        orderBy: { displayOrder: 'asc' },
      });

      return NextResponse.json(properties);
    } else {
      return NextResponse.json(
        { error: 'versionId or propertyId is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// CREATE property
export async function POST(request: NextRequest) {
  try {
    const { versionId, propertyKey, propertyValue, displayOrder = 0 } =
      await request.json();

    if (!versionId || !propertyKey || !propertyValue) {
      return NextResponse.json(
        { error: 'versionId, propertyKey, and propertyValue are required' },
        { status: 400 }
      );
    }

    const property = await prisma.productProperty.create({
      data: {
        versionId,
        propertyKey,
        propertyValue,
        displayOrder,
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'ProductProperty',
        entityId: property.id,
        action: 'CREATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create property' },
      { status: 500 }
    );
  }
}

// UPDATE property
export async function PUT(request: NextRequest) {
  try {
    const { id, propertyKey, propertyValue, displayOrder } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const property = await prisma.productProperty.update({
      where: { id },
      data: {
        propertyKey,
        propertyValue,
        displayOrder,
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'ProductProperty',
        entityId: id,
        action: 'UPDATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Failed to update property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE property
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const property = await prisma.productProperty.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'ProductProperty',
        entityId: id,
        action: 'DELETE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete property' },
      { status: 500 }
    );
  }
}
