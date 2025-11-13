# Missing Product Images Issue - Investigation Summary

## Problem
During WebP optimization process, some product images were lost or became mismatched between JSON references and actual files in `/public/` directory.

## Root Cause
The image rename script (`renameProductImages.js`) successfully renamed 200 images to standardized format (`product-{id}-{position}.{ext}`), but some products' original image files either:
1. Didn't exist in the public folder at the time of rename
2. Were deleted during the conversion process
3. Had incorrect/mismatched naming in the JSON

## Affected Products

### Partially Restored ✓
- **product-191** (BlazingStar Maxx Perform 23oz) - Now uses product-197 images

### Still Missing - Need Recovery
- **product-213** (Bold Berry - Gel Polish - Reflective Collection)
  - Found in public-organized: `boldberry/gelpolish/product-213_bold-berry---gel-polish---reflective-collection_*.{png,jpg}`
  - Status: Images copied to `/public/` but need WebP conversion and JSON update

- **product-258** - Need to check `public-organized/`
- **product-304** - Need to check `public-organized/`
- **product-378** - Need to check `public-organized/`
- **product-386** - Need to check `public-organized/`
- **product-297-1, product-297-2** - Need to check `public-organized/`

## Available Resources

### Image Locations
- **Primary**: `/public/` - Currently renamed images (WebP format where available)
- **Backup**: `/public-organized/` - Organized by category/product with original naming
  - Contains many product images organized in subdirectories
  - File naming: `product-{id}_product-name_number.{ext}`

### References
- **image-mapping.json** - Maps old filenames to new standardized names
- Git history shows original image references in commits before WebP optimization

## Recommended Next Steps

1. **For product-213** (STARTED):
   - ✅ Copy images from `public-organized/boldberry/gelpolish/` to `/public/`
   - ✅ Update JSON references
   - TODO: Convert to WebP format (if keeping WebP conversion)
   - TODO: Update JSON to use `.webp` extensions

2. **For remaining products (258, 304, 378, 386, 297-1, 297-2)**:
   - Search `public-organized/` for corresponding product folders
   - Copy images to `/public/` with standardized names: `product-{id}-topLeft/topRight/bottomLeft.{ext}`
   - Update JSON with correct image paths
   - Consider WebP conversion for consistency

3. **Validation**:
   - Run `scripts/findBrokenImages.js` to verify no broken references remain
   - Test PDF export to ensure images render properly
   - Check web catalog displays all product images

## Git History Reference
- Commit `fbabc59` - Last working version before WebP optimization (has correct image references)
- Commit `9145ee5` - WebP optimization started (images began getting lost)
- Use `git show fbabc59:data/products-generated.json` to see original image paths

## Notes
- Original files in `public-organized/` are preserved and can be recovered
- WebP conversion should only happen AFTER all images are restored to `/public/`
- Consider batch processing remaining products to restore all images at once
