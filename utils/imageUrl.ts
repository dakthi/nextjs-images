/**
 * Get the correct image URL
 * - Uses R2 bucket URL (both development and production)
 * - R2 CORS must be configured to allow http://localhost:3000
 *
 * Example: https://vllondon.chartedconsultants.com/images/product-187-topLeft.webp
 */
export function getImageUrl(fullUrl: string): string {
  // Always return the R2 URL as-is
  // CORS is configured on R2 to allow canvas access
  return fullUrl;
}
