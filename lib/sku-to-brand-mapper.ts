import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * SKU prefix patterns mapped to brand slugs
 * Order matters - more specific patterns first
 */
const SKU_PATTERNS = [
  // Bold Berry patterns
  { regex: /^BBG/i, brand: 'bold-berry', name: 'Bold Berry Gel' },
  { regex: /^bbd/i, brand: 'bold-berry', name: 'Bold Berry Dipping' },

  // BlazingStar patterns
  { regex: /^BSG/i, brand: 'blazingstar', name: 'BlazingStar Gel' },
  { regex: /^bs-/i, brand: 'blazingstar', name: 'BlazingStar Accessories' },
  { regex: /^bsg/i, brand: 'blazingstar', name: 'BlazingStar Gel Top/Base' },
  { regex: /^BST/i, brand: 'blazingstar', name: 'BlazingStar Tips' },

  // MBerry
  { regex: /^mb-/i, brand: 'mberry', name: 'MBerry' },

  // La Palm
  { regex: /^lp-/i, brand: 'lapalm', name: 'La Palm' },

  // CND
  { regex: /^cnd/i, brand: 'cnd', name: 'CND' },

  // DND
  { regex: /^DND/i, brand: 'dnd', name: 'DND' },
  { regex: /^DC2/i, brand: 'dnd', name: 'DND DC Collection' },

  // Chisel (NEW)
  { regex: /^chi/i, brand: 'chisel', name: 'Chisel' },

  // SNS (NEW)
  { regex: /^SNS/i, brand: 'sns', name: 'SNS' },

  // HAT (NEW)
  { regex: /^hat/i, brand: 'hat', name: 'HAT' },

  // KDS
  { regex: /^kds/i, brand: 'kds', name: 'KDS' },

  // OPI
  { regex: /^opi/i, brand: 'opi', name: 'OPI' },
] as const;

// Cache for brand lookups
const brandCache = new Map<string, string>();

/**
 * Extract brand slug from SKU using pattern matching
 * @param sku - Product SKU
 * @returns Brand slug or null if no match
 */
export function extractBrandFromSKU(sku: string): string | null {
  if (!sku) return null;

  for (const pattern of SKU_PATTERNS) {
    if (pattern.regex.test(sku)) {
      return pattern.brand;
    }
  }

  return null;
}

/**
 * Get brand ID by slug (with caching)
 * @param slug - Brand slug
 * @returns Brand ID or null if not found
 */
export async function getBrandIdBySlug(slug: string): Promise<string | null> {
  // Check cache first
  if (brandCache.has(slug)) {
    return brandCache.get(slug)!;
  }

  // Query database
  const brand = await prisma.brand.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (brand) {
    brandCache.set(slug, brand.id);
    return brand.id;
  }

  return null;
}

/**
 * Get brand ID from SKU, with fallback strategies
 * @param sku - Product SKU
 * @param wcBrandName - Optional brand name from WooCommerce
 * @param defaultBrandSlug - Default brand to use if no match (default: 'vl-london')
 * @returns Brand ID or null
 */
export async function getBrandIdFromSKU(
  sku: string,
  wcBrandName?: string,
  defaultBrandSlug: string = 'vl-london'
): Promise<string | null> {
  // Strategy 1: Try SKU pattern matching
  const brandSlug = extractBrandFromSKU(sku);
  if (brandSlug) {
    const brandId = await getBrandIdBySlug(brandSlug);
    if (brandId) return brandId;
  }

  // Strategy 2: Try WooCommerce brand name (if provided)
  if (wcBrandName) {
    const normalizedName = wcBrandName.toLowerCase().trim().replace(/\s+/g, '-');
    const brandId = await getBrandIdBySlug(normalizedName);
    if (brandId) return brandId;
  }

  // Strategy 3: Fallback to default brand
  const defaultBrand = await getBrandIdBySlug(defaultBrandSlug);
  return defaultBrand;
}

/**
 * Validate SKU pattern matches and report statistics
 * Useful for analyzing SKU coverage before import
 */
export function analyzeSkuPatterns(skus: string[]): {
  total: number;
  matched: number;
  unmatched: number;
  byBrand: Record<string, number>;
  unmatchedSkus: string[];
} {
  const byBrand: Record<string, number> = {};
  const unmatchedSkus: string[] = [];

  for (const sku of skus) {
    const brand = extractBrandFromSKU(sku);

    if (brand) {
      byBrand[brand] = (byBrand[brand] || 0) + 1;
    } else {
      unmatchedSkus.push(sku);
    }
  }

  return {
    total: skus.length,
    matched: skus.length - unmatchedSkus.length,
    unmatched: unmatchedSkus.length,
    byBrand,
    unmatchedSkus,
  };
}

/**
 * Pre-load all brands into cache
 * Call this at the start of import for better performance
 */
export async function preloadBrandCache(): Promise<void> {
  const brands = await prisma.brand.findMany({
    select: { slug: true, id: true },
  });

  for (const brand of brands) {
    brandCache.set(brand.slug, brand.id);
  }
}

/**
 * Clear the brand cache
 */
export function clearBrandCache(): void {
  brandCache.clear();
}
