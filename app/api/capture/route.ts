import { NextRequest, NextResponse } from 'next/server';
import captureWebsite from 'capture-website';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const { productIds, format = 'png' } = await request.json();

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided' },
        { status: 400 }
      );
    }

    // Create temporary directory
    const tmpDir = path.join(os.tmpdir(), 'vl-london-exports');
    await fs.mkdir(tmpDir, { recursive: true });

    const files: Array<{ filename: string; path: string }> = [];

    // Generate screenshots for each product
    for (const productId of productIds) {
      const url = `http://localhost:3000/?product=${productId}`;
      const filename = `product-${productId}.${format}`;
      const filepath = path.join(tmpDir, filename);

      try {
        await captureWebsite.file(url, filepath, {
          type: format as any,
          width: 1200,
          height: 1200,
          scale: 2,
          timeout: 30,
          waitForNetworkIdle: true,
        });

        files.push({ filename, path: filepath });
      } catch (error) {
        console.error(`Failed to capture ${productId}:`, error);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Failed to capture any products' },
        { status: 500 }
      );
    }

    // Return file paths for client to download
    return NextResponse.json({
      success: true,
      files: files.map(f => ({
        filename: f.filename,
        url: `/api/download/${encodeURIComponent(f.filename)}`
      }))
    });
  } catch (error) {
    console.error('Capture API error:', error);
    return NextResponse.json(
      { error: 'Failed to capture screenshots' },
      { status: 500 }
    );
  }
}
