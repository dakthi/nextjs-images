import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all RSS feeds or a specific one
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single feed
      const feed = await prisma.rSSFeed.findUnique({
        where: { id },
      });

      if (!feed) {
        return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
      }

      return NextResponse.json(feed);
    } else {
      // Get all feeds
      const feeds = await prisma.rSSFeed.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(feeds);
    }
  } catch (error) {
    console.error('Failed to fetch RSS feeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    );
  }
}

// POST - Create a new RSS feed
export async function POST(request: NextRequest) {
  try {
    const { name, url, category, isEnabled } = await request.json();

    if (!name || !url || !category) {
      return NextResponse.json(
        { error: 'Name, URL, and category are required' },
        { status: 400 }
      );
    }

    const feed = await prisma.rSSFeed.create({
      data: {
        name,
        url,
        category,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
      },
    });

    return NextResponse.json(feed, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create RSS feed:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A feed with this URL already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create RSS feed' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing RSS feed
export async function PUT(request: NextRequest) {
  try {
    const { id, name, url, category, isEnabled } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const feed = await prisma.rSSFeed.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(url !== undefined && { url }),
        ...(category !== undefined && { category }),
        ...(isEnabled !== undefined && { isEnabled }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(feed);
  } catch (error: any) {
    console.error('Failed to update RSS feed:', error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A feed with this URL already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update RSS feed' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an RSS feed
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.rSSFeed.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Feed deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete RSS feed:', error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to delete RSS feed' },
      { status: 500 }
    );
  }
}
