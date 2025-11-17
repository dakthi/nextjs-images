import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET pricing for a product version
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('versionId');
    const pricingId = searchParams.get('id');

    if (pricingId) {
      const pricing = await prisma.pricing.findUnique({
        where: { id: pricingId },
      });

      if (!pricing) {
        return NextResponse.json(
          { error: 'Pricing not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(pricing);
    } else if (versionId) {
      const pricing = await prisma.pricing.findMany({
        where: { versionId },
        orderBy: { displayOrder: 'asc' },
      });

      return NextResponse.json(pricing);
    } else {
      return NextResponse.json(
        { error: 'versionId or pricingId is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Failed to fetch pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}

// CREATE pricing
export async function POST(request: NextRequest) {
  try {
    const {
      versionId,
      size,
      price,
      currency = 'GBP',
      condition,
      discountPrice,
      discountLabel,
      displayOrder = 0,
    } = await request.json();

    if (!versionId || !size || !price) {
      return NextResponse.json(
        { error: 'versionId, size, and price are required' },
        { status: 400 }
      );
    }

    const pricing = await prisma.pricing.create({
      data: {
        versionId,
        size,
        price: parseFloat(price),
        currency,
        condition,
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        discountLabel,
        displayOrder,
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'Pricing',
        entityId: pricing.id,
        action: 'CREATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(pricing, { status: 201 });
  } catch (error) {
    console.error('Failed to create pricing:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create pricing' },
      { status: 500 }
    );
  }
}

// UPDATE pricing
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      size,
      price,
      currency,
      condition,
      discountPrice,
      discountLabel,
      displayOrder,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Pricing ID is required' },
        { status: 400 }
      );
    }

    const pricing = await prisma.pricing.update({
      where: { id },
      data: {
        size,
        price: price ? parseFloat(price) : undefined,
        currency,
        condition,
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        discountLabel,
        displayOrder,
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'Pricing',
        entityId: id,
        action: 'UPDATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Failed to update pricing:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update pricing' },
      { status: 500 }
    );
  }
}

// DELETE pricing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Pricing ID is required' },
        { status: 400 }
      );
    }

    const pricing = await prisma.pricing.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        entityType: 'Pricing',
        entityId: id,
        action: 'DELETE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Failed to delete pricing:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete pricing' },
      { status: 500 }
    );
  }
}
