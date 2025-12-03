import { NextRequest, NextResponse } from 'next/server';
import {
  buildProductInfo,
  getProductsByBrand,
  getAllActiveProducts,
  searchProducts,
  generateJSONExport,
  generateCSVExport,
  generateZIPExport,
  getExportFileName,
} from '@/lib/export-utils';
import { ExportInfoPackSchema } from '@/lib/validations';

interface ExportOptions {
  productIds?: string[];
  brandId?: string;
  search?: string;
  allActive?: boolean;
  format: 'json' | 'csv' | 'zip';
  includeImages?: boolean;
  nailArtImage?: string;
  nailArtInfo?: {
    artist: string;
    description: string;
    uploadDate: string;
    products?: any[];
  };
}

/**
 * Enhanced export endpoint supporting:
 * - Single or multiple products by ID
 * - All products from a specific brand
 * - Search by name or product code
 * - All active products
 * - Multiple formats: JSON, CSV, ZIP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ExportOptions;
    const {
      productIds,
      brandId,
      search,
      allActive = false,
      format = 'zip',
      includeImages = true,
      nailArtImage,
      nailArtInfo,
    } = body;

    let productCodes: string[] = [];

    // Determine which products to export
    if (productIds && productIds.length > 0) {
      productCodes = productIds;
    } else if (brandId) {
      productCodes = await getProductsByBrand(brandId);
    } else if (search) {
      productCodes = await searchProducts(search);
    } else if (allActive) {
      productCodes = await getAllActiveProducts();
    } else {
      return NextResponse.json(
        { error: 'Please specify productIds, brandId, search query, or set allActive=true' },
        { status: 400 }
      );
    }

    if (productCodes.length === 0) {
      return NextResponse.json(
        { error: 'No products found matching your criteria' },
        { status: 404 }
      );
    }

    // Fetch product details
    const productsToExport = [];
    for (const code of productCodes) {
      const product = await buildProductInfo(code);
      if (product) productsToExport.push(product);
    }

    if (productsToExport.length === 0) {
      return NextResponse.json(
        { error: 'Could not load product details' },
        { status: 500 }
      );
    }

    const filename = getExportFileName(
      format,
      productsToExport.length,
      brandId ? 'brand' : 'products',
      brandId ? productsToExport[0]?.brandName : undefined
    );

    // Generate export based on format
    if (format === 'json') {
      const jsonData = generateJSONExport(productsToExport);
      return new NextResponse(jsonData, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    if (format === 'csv') {
      const csvData = generateCSVExport(productsToExport);
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    if (format === 'zip') {
      const zipBuffer = await generateZIPExport(productsToExport, includeImages, nailArtImage, nailArtInfo);
      const buffer = Buffer.from(zipBuffer);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid format. Use: json, csv, or zip' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    );
  }
}
