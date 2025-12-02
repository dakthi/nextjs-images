import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand'); // Filter by brand slug
    const active = searchParams.get('active'); // Filter by active status

    const where: any = {};

    if (brand) {
      // Filter by brand slug
      where.brand = { slug: brand };
    }

    if (active === 'true') {
      where.isActive = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        versions: {
          take: 1,
          orderBy: { versionNumber: 'desc' },
          include: {
            contents: {
              where: { contentType: 'description' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Latest 50 products
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const feedTitle = brand
      ? `VL London - ${brand.charAt(0).toUpperCase() + brand.slice(1)} Products`
      : 'VL London Products';

    const feedDescription = brand
      ? `Latest ${brand} products from VL London`
      : 'Latest products from VL London';

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss/feed.xml${brand ? `?brand=${brand}` : ''}" rel="self" type="application/rss+xml"/>
    ${products
      .map((product) => {
        const description = product.versions[0]?.contents[0]?.content || 'No description available';
        const cleanDescription = description
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\r\n/g, ' ')
          .replace(/\n/g, ' ')
          .substring(0, 200); // Limit to 200 chars

        return `
    <item>
      <title>${escapeXml(product.name)}</title>
      <link>${baseUrl}/catalog?product=${product.slug}</link>
      <guid isPermaLink="true">${baseUrl}/catalog?product=${product.slug}</guid>
      <description>${escapeXml(cleanDescription)}</description>
      <category>${escapeXml(product.brand?.name || 'Unknown')}</category>
      <pubDate>${new Date(product.createdAt).toUTCString()}</pubDate>
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Failed to generate RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    );
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
