/**
 * Get the correct image URL based on environment
 * - Production: Uses R2 bucket URL (https://vllondon.chartedconsultants.com)
 * - Development: Falls back to local /public files
 *
 * Example: https://vllondon.chartedconsultants.com/images/product-187-topLeft.webp
 * In dev: /product-187-topLeft.webp (looks for file in /public/)
 */
export function getImageUrl(fullUrl: string): string {
  // If running in production environment, use the full URL as-is
  if (process.env.NODE_ENV === 'production') {
    return fullUrl;
  }

  // For development, extract the filename and use local path
  // Example: https://vllondon.chartedconsultants.com/images/product-187-topLeft.webp
  // becomes: /product-187-topLeft.webp

  try {
    const urlObj = new URL(fullUrl);
    const pathname = urlObj.pathname;

    // Extract filename from path (e.g., "product-187-topLeft.webp" from "/images/product-187-topLeft.webp")
    const filename = pathname.split('/').pop() || '';

    // Return relative path to /public
    return `/${filename}`;
  } catch (e) {
    // If URL parsing fails, return as-is
    return fullUrl;
  }
}
