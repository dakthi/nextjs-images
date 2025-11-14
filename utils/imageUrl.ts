/**
 * Get the correct image URL
 * - Always uses R2 bucket URL (https://vllondon.chartedconsultants.com)
 * - Local fallback disabled for debugging R2
 *
 * Example: https://vllondon.chartedconsultants.com/images/product-187-topLeft.webp
 */
export function getImageUrl(fullUrl: string): string {
  // Always return the full R2 URL as-is
  return fullUrl;

  // TODO: Re-enable local fallback after R2 debugging
  // if (process.env.NODE_ENV === 'production') {
  //   return fullUrl;
  // }
  //
  // // For development, extract the filename and use local path
  // try {
  //   const urlObj = new URL(fullUrl);
  //   const pathname = urlObj.pathname;
  //   const filename = pathname.split('/').pop() || '';
  //   return `/${filename}`;
  // } catch (e) {
  //   return fullUrl;
  // }
}
