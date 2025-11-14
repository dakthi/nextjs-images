import { NextRequest, NextResponse } from 'next/server';
import { getAllProductsFromDb, updateProductInDb } from '@/lib/db-product-transformer';

// GET: Read products from database
export async function GET() {
  try {
    const products = await getAllProductsFromDb();

    return NextResponse.json({
      products,
      locked: false, // Database handles concurrent access with transactions
    });
  } catch (error) {
    console.error('Failed to read products from database:', error);
    return NextResponse.json(
      { error: 'Failed to read products' },
      { status: 500 }
    );
  }
}

// POST: Save products to database
export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid request: products must be an array' },
        { status: 400 }
      );
    }

    // Update each product in the database
    const userId = request.headers.get('x-user-id') || 'system';

    for (const product of products) {
      await updateProductInDb(product.id, product, userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save products to database:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save products' },
      { status: 500 }
    );
  }
}
