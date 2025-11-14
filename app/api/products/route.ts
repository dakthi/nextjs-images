import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products-generated.json');
const LOCK_FILE = path.join(process.cwd(), 'data', '.products-lock');
const LOCK_TIMEOUT = 10 * 60 * 1000; // 10 minutes

// Check and manage locks
function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    const lockTime = fs.statSync(LOCK_FILE).mtime.getTime();
    const now = Date.now();
    if (now - lockTime < LOCK_TIMEOUT) {
      return false; // Lock still active
    } else {
      fs.unlinkSync(LOCK_FILE); // Remove expired lock
    }
  }
  fs.writeFileSync(LOCK_FILE, Date.now().toString());
  return true;
}

function releaseLock() {
  if (fs.existsSync(LOCK_FILE)) {
    fs.unlinkSync(LOCK_FILE);
  }
}

// GET: Read products
export async function GET() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);
    const lockExists = fs.existsSync(LOCK_FILE);

    return NextResponse.json({
      products: products.products,
      locked: lockExists,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read products' },
      { status: 500 }
    );
  }
}

// POST: Save products with lock
export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    if (!acquireLock()) {
      return NextResponse.json(
        { error: 'File is being edited. Please try again in a few moments.' },
        { status: 409 }
      );
    }

    try {
      const data = { products };
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
      releaseLock();

      return NextResponse.json({ success: true });
    } catch (error) {
      releaseLock();
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save products' },
      { status: 500 }
    );
  }
}
