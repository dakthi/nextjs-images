import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Search products by query, brand, or status
 * Supports filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const brand = searchParams.get('brand');
    const active = searchParams.get('active');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    // Search query (name or code)
    if (q && q.trim()) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { productCode: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Brand filter
    if (brand) {
      where.brandId = brand;
    }

    // Active status filter (default to true for active)
    where.isActive = active !== 'false';

    // Get total count
    const total = await prisma.product.count({ where });

    // Get paginated results
    const products = await prisma.product.findMany({
      where,
      include: {
        brand: { select: { id: true, name: true, slug: true } },
        versions: {
          where: { isCurrent: true },
          select: {
            id: true,
            versionNumber: true,
            description: true,
            images: { select: { id: true }, take: 1 },
            pricing: { select: { id: true }, take: 1 },
          },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    return NextResponse.json({
      data: products.map((p) => ({
        id: p.id,
        productCode: p.productCode,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        isActive: p.isActive,
        hasImages: (p.versions[0]?.images.length || 0) > 0,
        hasPricing: (p.versions[0]?.pricing.length || 0) > 0,
        description: p.versions[0]?.description,
      })),
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
