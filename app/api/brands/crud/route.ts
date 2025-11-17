import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single brand or all brands
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single brand with products
      const brand = await prisma.brand.findUnique({
        where: { id },
        include: {
          products: {
            include: {
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
          },
        },
      });

      if (!brand) {
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
      }

      return NextResponse.json(brand);
    } else {
      // Get all brands
      const brands = await prisma.brand.findMany({
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { name: 'asc' },
      });

      return NextResponse.json(brands);
    }
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

// CREATE brand
export async function POST(request: NextRequest) {
  try {
    const { name, slug, description, logoUrl } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description,
        logoUrl,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'Brand',
        entityId: brand.id,
        action: 'CREATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Failed to create brand:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create brand' },
      { status: 500 }
    );
  }
}

// UPDATE brand
export async function PUT(request: NextRequest) {
  try {
    const { id, name, slug, description, logoUrl } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        logoUrl,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'Brand',
        entityId: brand.id,
        action: 'UPDATE',
        performedBy: 'system',
        changes: { name, slug, description, logoUrl },
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Failed to update brand:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE brand
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'Brand',
        entityId: brand.id,
        action: 'DELETE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Failed to delete brand:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
