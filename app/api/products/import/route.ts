import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const maxDuration = 300;
export const runtime = 'nodejs';

// CSV row schema - flexible to allow various column names
const csvRowSchema = z.object({
  'Product Code': z.string().min(1).optional(),
  'product_code': z.string().min(1).optional(),
  'Code': z.string().min(1).optional(),
  'Product Name': z.string().min(1).optional(),
  'product_name': z.string().min(1).optional(),
  'Name': z.string().min(1).optional(),
  'Brand': z.string().optional(),
  'brand': z.string().optional(),
  'Category': z.string().optional(),
  'category': z.string().optional(),
  'Description': z.string().optional(),
  'description': z.string().optional(),
  'Price': z.string().optional(),
  'price': z.string().optional(),
  'Size': z.string().optional(),
  'size': z.string().optional(),
  'Scents': z.string().optional(),
  'scents': z.string().optional(),
  'Active': z.string().optional(),
  'active': z.string().optional(),
});

type CSVRow = z.infer<typeof csvRowSchema>;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only CSV files are supported.' },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const records: CSVRow[] = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (!records.length) {
      return NextResponse.json(
        { error: 'CSV file is empty' },
        { status: 400 }
      );
    }

    const results = {
      total: records.length,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as any[],
      created: [] as any[],
      updated: [] as any[],
    };

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 2; // +2 because 1-based + header row

      try {
        // Extract values from flexible column names
        const productCode = row['Product Code'] || row['product_code'] || row['Code'];
        const productName = row['Product Name'] || row['product_name'] || row['Name'];
        const brand = row['Brand'] || row['brand'];
        const category = row['Category'] || row['category'];
        const description = row['Description'] || row['description'];
        const price = row['Price'] || row['price'];
        const size = row['Size'] || row['size'];
        const scents = row['Scents'] || row['scents'];
        const activeStr = row['Active'] || row['active'];

        if (!productCode) {
          results.errors.push({
            row: rowNum,
            error: 'Missing product code (required field)',
          });
          results.failed++;
          continue;
        }

        if (!productName) {
          results.errors.push({
            row: rowNum,
            error: 'Missing product name (required field)',
          });
          results.failed++;
          continue;
        }

        const isActive = !activeStr || activeStr.toLowerCase() === 'true' || activeStr === '1';

        // Find or create brand
        let brandRecord = null;
        if (brand) {
          brandRecord = await prisma.brand.findUnique({
            where: { name: brand },
          });

          if (!brandRecord) {
            brandRecord = await prisma.brand.create({
              data: {
                name: brand,
                slug: brand.toLowerCase().replace(/\s+/g, '-'),
              },
            });
          }
        }

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
          where: { productCode: productCode },
        });

        if (existingProduct) {
          // Update existing product
          const updateData: any = {
            name: productName,
            active: isActive,
          };
          if (brandRecord) {
            updateData.brandId = brandRecord.id;
          }

          await prisma.product.update({
            where: { productCode: productCode },
            data: updateData,
          });

          results.updated.push({
            code: productCode,
            name: productName,
          });
        } else {
          // Create new product
          const createData: any = {
            productCode: productCode,
            name: productName,
            slug: productName.toLowerCase().replace(/\s+/g, '-'),
            active: isActive,
          };
          if (brandRecord) {
            createData.brandId = brandRecord.id;
          }

          const newProduct = await prisma.product.create({
            data: createData,
          });

          // Create initial version
          const version = await prisma.productVersion.create({
            data: {
              productId: newProduct.id,
              versionNumber: 1,
              isCurrent: true,
              createdBy: 'csv-import',
            },
          });

          // Add description if provided
          if (description) {
            await prisma.productContent.create({
              data: {
                versionId: version.id,
                contentType: 'short_description',
                content: description,
              },
            });
          }

          // Add properties
          const properties: Record<string, string> = {};
          if (category) properties['category'] = category;
          if (scents) properties['scents'] = scents;

          for (const [key, value] of Object.entries(properties)) {
            await prisma.productProperty.create({
              data: {
                versionId: version.id,
                propertyKey: key,
                propertyValue: value,
              },
            });
          }

          // Add pricing if provided
          if (price) {
            const priceNum = parseFloat(price);
            if (!isNaN(priceNum)) {
              await prisma.pricing.create({
                data: {
                  versionId: version.id,
                  size: size || 'Standard',
                  price: priceNum,
                  condition: 'new',
                  displayOrder: 1,
                },
              });
            }
          }

          results.created.push({
            code: productCode,
            name: productName,
          });
        }

        results.success++;
      } catch (error) {
        results.errors.push({
          row: rowNum,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        results.failed++;
      }
    }

    return NextResponse.json(results, {
      status: results.failed === 0 ? 201 : 207,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('CSV import error:', message, error);

    return NextResponse.json(
      {
        error: 'Failed to import CSV',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: 500 }
    );
  }
}
