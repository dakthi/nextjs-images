import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET content for a product version
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('versionId');
    const contentId = searchParams.get('id');

    if (contentId) {
      // Get single content
      const content = await prisma.productContent.findUnique({
        where: { id: contentId },
      });

      if (!content) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(content);
    } else if (versionId) {
      // Get all content for a version
      const content = await prisma.productContent.findMany({
        where: { versionId },
      });

      return NextResponse.json(content);
    } else {
      return NextResponse.json(
        { error: 'versionId or contentId is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// CREATE content
export async function POST(request: NextRequest) {
  try {
    const { versionId, contentType, content, language = 'en' } = await request.json();

    if (!versionId || !contentType || !content) {
      return NextResponse.json(
        { error: 'versionId, contentType, and content are required' },
        { status: 400 }
      );
    }

    const newContent = await prisma.productContent.create({
      data: {
        versionId,
        contentType,
        content,
        language,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'ProductContent',
        entityId: newContent.id,
        action: 'CREATE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('Failed to create content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create content' },
      { status: 500 }
    );
  }
}

// UPDATE content
export async function PUT(request: NextRequest) {
  try {
    const { id, contentType, content, language } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const updatedContent = await prisma.productContent.update({
      where: { id },
      data: {
        contentType,
        content,
        language,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'ProductContent',
        entityId: id,
        action: 'UPDATE',
        performedBy: 'system',
        changes: { contentType, language },
      },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const content = await prisma.productContent.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'ProductContent',
        entityId: id,
        action: 'DELETE',
        performedBy: 'system',
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to delete content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete content' },
      { status: 500 }
    );
  }
}
