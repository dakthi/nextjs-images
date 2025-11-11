# Product Data Consolidation - Work in Progress

## Overview
Consolidating duplicate product variants into single product cards with combined pricing tables. This reduces data redundancy and provides better UX by showing all size/quantity options on one card.

## Current Status
Working through product merges systematically by product type and brand.

## Completed Merges ✓

### Display Updates
- [x] Changed from auto-increment card numbers to product IDs
- [x] Product ID displays below card in HTML (not in exports)
- [x] Removed ID badges from card images

### Gel Top/Base Products
- [x] **product-238**: BlazingStar Gel Top Original - Split into 15ml and 480ml Refill
- [x] **products 231 & 232**: Bold Berry Gel Top 480ml - Merged into product-231
- [x] **products 239 & 240**: BlazingStar Revive Base 15ml - Merged into product-239
- [x] **product-242**: Fixed duplicate "480ml" in name

### Gel Polish Products
- [x] **products 228 & 229**: MBerry Gel Polish - Merged with new single bottle pricing
- [x] **product-11**: La Palm Cream Mask (identified but needs images)

### Nail Tips - NATURAL variants
- [x] **products 250-253**: Tip Nhọn Stilletto - NATURAL - Merged into product-250
- [x] **products 254-257**: Tip Thẳng Coffin - NATURAL - Merged into product-254
- [x] **products 243-246**: Tip Thẳng Straight Tip - NATURAL - Merged into product-243

### Liquid Products
- [x] **products 270-273**: BlazingStar Liquid EMA Purple - Merged into product-270

### Brush Products
- [x] **products 309-310**: 3D Brush - Merged into product-309
- [x] **products 277-282**: BlazingStar Brush Standard - Merged into product-277 with sizes 14/16/18 in size column

## Pending Work

### To Merge (Similar Pattern Products)
The following product groups appear to have similar patterns and should be reviewed for merging:

1. **BlazingStar Brush French** - Check if Size 12/14/16 variants need merging
2. **BlazingStar Brush Gel** - Check if Size 6/8 variants need merging
3. **BlazingStar Brush Premium Plus** - Check if multiple size variants need consolidation
4. **BlazingStar Brush Premium Pro** - Check if multiple size variants need consolidation
5. **BlazingStar File** - Check if variants need consolidation
6. **Bào Carbide** products - Multiple variants may need consolidation
7. **Bold Berry Gel Polish** colors/variants - May have redundant entries
8. **Tip Thường Curve Tip - NATURAL** - Likely similar to other nail tip merges
9. **La Palm** product variants - Multiple scent/size combinations

### Image Assignment Needed
- [ ] **product-11**: La Palm Cream Mask 12oz - Orange Tangerine Zest (needs images)
- [ ] Other products with `/vllondon-logo.jpeg` placeholders (278 products total need real images)

### Code Changes
- [ ] If doing more product ID display changes, remember to update:
  - `components/SaleCard.tsx` - Component properties
  - `app/page.tsx` - Visible and hidden card rendering

## Merge Pattern Used
When merging products:
1. Keep the earliest product ID as the main product
2. Combine all pricing rows into single `pricingTable` array
3. Update product name to remove size/variant specifics
4. Add size/variant info to the `size` column if not already present
5. Delete duplicate product entries

## Instructions for Next Person
**Make changes as user requests** - Don't work through the entire pending list proactively. Wait for user to specify which products to merge or modify.

### Best Practices
- Use `grep -n "product name"` to find line numbers - avoid reading large file sections
- Only read the specific lines needed for the edit using `Read` tool with offset/limit
- Use `Edit` tool to make targeted changes
- Don't save checkpoint commits after each merge; batch multiple changes
- Update `CHANGELOG.md` and this file after each session

### Technical Notes
- All changes are in `/data/products-generated.json`
- Product IDs don't auto-update - if deleting products, subsequent IDs stay the same
- When merging: keep earliest product ID, combine pricing tables, remove size from name, add size to size column
