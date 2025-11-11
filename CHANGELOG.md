# Product Data Changes Changelog

## Changes Made

### Product Merges and Consolidations

#### 1. Product Display Updates
- Changed from displaying auto-increment card numbers to displaying product IDs
- Product ID now displays below the card in HTML preview only (not in exported images)
- Removed product ID badges from inside the card to avoid interference with html-to-image exports

#### 2. BlazingStar Gel Top Products
- **Merged product-238**: Split into two separate listings
  - `product-238`: BlazingStar Gel Top Original - 15ml (with bulk pricing options)
  - `product-238-refill`: BlazingStar Gel Top Original - Refill 480ml

#### 3. Bold Berry Products
- **Merged products 231 & 232**: Bold Berry Gel Top - 480ml
  - Combined two variants with different discount tiers into single product
  - Includes pricing for single bottle and buy 2 get 1 free promotion

#### 4. MBerry Gel Polish
- **Merged products 228 & 229**: MBerry Gel Polish - 15ml
  - Added new first line pricing: Lẻ £5.50 (bulk discount £4.95)
  - Combined with Set 36 and Set 180 pricing options
  - Single product with three size tiers

#### 5. BlazingStar Revive Base
- **Merged products 239 & 240**: BlazingStar Revive Base / Revive Base HF / Durabase HF - 15ml
  - Combined quantity-based pricing tiers into single product

#### 6. Nail Tip Products - NATURAL variants
- **Merged products 250-253**: Tip Nhọn Stilletto - NATURAL
  - Consolidated Pack 10, Pack 100, Case 0-10, and Set box variants

- **Merged products 254-257**: Tip Thẳng Coffin - NATURAL
  - Consolidated all size options into single product

- **Merged products 243-246**: Tip Thẳng Straight Tip - NATURAL
  - Combined all size variants with unified pricing

#### 7. Gel Polish Products
- **Fixed product-242**: Removed duplicate "480ml" in name
  - Changed from "MBerry Gel Top 480ml - 480ml" to "MBerry Gel Top - 480ml"

#### 8. Liquid Products
- **Merged products 270-273**: BlazingStar Liquid EMA Purple - LIQUID CHẢY
  - Combined 16fl/480ml, Gal, and Case (2 variants) pricing into single product
  - All size options now in one card with different discount tiers

#### 9. Brush Products
- **Merged products 309-310**: 3D Brush
  - Consolidated Size 4 and Size 6 into single product

- **Merged products 277-282**: BlazingStar Brush Standard - LÔNG CỨNG
  - Combined all 6 products (sizes 14, 16, 18 with 2 discount tiers each)
  - Added size numbers (14, 16, 18) to size column
  - Single product with 6 pricing options for different sizes and quantities

## Summary
- **Total products merged**: 30+ duplicate/variant products consolidated
- **Net reduction**: ~160 lines of JSON removed
- **File optimization**: Cleaner, more maintainable product data structure
- **User experience**: Customers see all options for a product on one card instead of multiple separate listings
