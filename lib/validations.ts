import { z } from 'zod';

// Brand Schemas
export const BrandCreateSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  description: z.string().max(1000).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
});

export const BrandUpdateSchema = BrandCreateSchema.partial();

export type BrandCreate = z.infer<typeof BrandCreateSchema>;
export type BrandUpdate = z.infer<typeof BrandUpdateSchema>;

// Product Schemas
export const ProductCreateSchema = z.object({
  brandId: z.string().uuid('Invalid brand ID'),
  productCode: z.string().min(1, 'Product code is required').max(50),
  name: z.string().min(1, 'Product name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  isActive: z.boolean().default(true),
});

export const ProductUpdateSchema = ProductCreateSchema.partial().omit({ productCode: true });

export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

// Product Content Schemas
export const ProductContentCreateSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
  contentType: z.string().min(1, 'Content type is required').max(50),
  content: z.string().min(1, 'Content is required'),
  language: z.string().max(5).default('en'),
});

export const ProductContentUpdateSchema = z.object({
  id: z.string().uuid('Invalid content ID'),
  contentType: z.string().max(50).optional(),
  content: z.string().min(1).optional(),
  language: z.string().max(5).optional(),
});

export type ProductContentCreate = z.infer<typeof ProductContentCreateSchema>;
export type ProductContentUpdate = z.infer<typeof ProductContentUpdateSchema>;

// Product Image Schemas
export const ProductImageCreateSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
  imageUrl: z.string().url('Invalid image URL'),
  imageType: z.string().min(1).max(50),
  position: z.string().max(50).optional(),
  displayOrder: z.number().int().nonnegative(),
  altText: z.string().max(255).optional(),
  label: z.string().max(255).optional(),
}).passthrough();

export const ProductImageUpdateSchema = z.object({
  id: z.string().uuid('Invalid image ID'),
  imageUrl: z.string().url().optional(),
  imageType: z.string().max(50).optional(),
  position: z.string().max(50).optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  altText: z.string().max(255).optional(),
  label: z.string().max(255).optional(),
});

export const ProductImageBatchCreateSchema = z.array(ProductImageCreateSchema);
export const ProductImageBatchUpdateSchema = z.array(ProductImageUpdateSchema);

export type ProductImageCreate = z.infer<typeof ProductImageCreateSchema>;
export type ProductImageUpdate = z.infer<typeof ProductImageUpdateSchema>;

// Product Property Schemas
export const ProductPropertyCreateSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
  propertyKey: z.string().min(1).max(100),
  propertyValue: z.string().min(1).max(500),
  displayOrder: z.number().int().nonnegative().default(0),
});

export const ProductPropertyUpdateSchema = z.object({
  id: z.string().uuid('Invalid property ID'),
  propertyKey: z.string().max(100).optional(),
  propertyValue: z.string().min(1).max(500).optional(),
  displayOrder: z.number().int().nonnegative().optional(),
});

export type ProductPropertyCreate = z.infer<typeof ProductPropertyCreateSchema>;
export type ProductPropertyUpdate = z.infer<typeof ProductPropertyUpdateSchema>;

// Pricing Schemas
export const PricingCreateSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
  size: z.string().min(1).max(100),
  price: z.string().or(z.number()).refine((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(num) && num > 0;
  }, 'Price must be a positive number'),
  currency: z.string().max(3).default('GBP'),
  condition: z.string().max(100).optional(),
  discountPrice: z.string().or(z.number()).optional().refine((val) => {
    if (!val) return true;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(num) && num > 0;
  }, 'Discount price must be a positive number'),
  discountLabel: z.string().max(255).optional(),
  displayOrder: z.number().int().nonnegative(),
}).passthrough();

export const PricingUpdateSchema = z.object({
  id: z.string().uuid('Invalid pricing ID'),
  size: z.string().max(100).optional(),
  price: z.string().or(z.number()).optional(),
  currency: z.string().max(3).optional(),
  condition: z.string().max(100).optional(),
  discountPrice: z.string().or(z.number()).optional(),
  discountLabel: z.string().max(255).optional(),
  displayOrder: z.number().int().nonnegative().optional(),
});

export type PricingCreate = z.infer<typeof PricingCreateSchema>;
export type PricingUpdate = z.infer<typeof PricingUpdateSchema>;

// Export Info Pack Schemas
export const ExportInfoPackSchema = z.object({
  productIds: z.array(z.string()).optional(),
  brandId: z.string().optional(),
  format: z.enum(['json', 'csv', 'zip']).default('zip'),
  includeImages: z.boolean().default(true),
  includeProperties: z.boolean().default(true),
  includePricing: z.boolean().default(true),
  includeVersions: z.boolean().default(true),
});

export type ExportInfoPack = z.infer<typeof ExportInfoPackSchema>;

// Helper function to validate and parse request body
export async function validateRequestBody<T>(request: Request, schema: z.ZodSchema<T>): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Validation failed', formattedErrors);
    }
    throw new ValidationError('Invalid request body');
  }
}

// Custom error class for validation errors
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
