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

### Lotion Products (Max 4 Rows Per Card)
- [x] **product-27**: Split into 4 products (27, 27-2, 27-1, 27-3) - 4 rows each
- [x] **product-27-2, product-27-3**: Set to middle-right badge position
- [x] **product-267**: Updated "(4 Gallon)" to Case size labels, removed duplicate OFF text

### Removed Products
- [x] **All DRILL BIT products** (28 items): product-333, 317, 323, 324, 321, 322, 327, 328, 325, 326, 331, 332, 329, 330, 315, 316, 313, 314, 335, 336, 337, 338, 339, 340, 341, 342, 311, 312

### La Palm Merged Products
- [x] **product-7, product-8**: Cooling Gel - Merged into product-7 (12oz + Gallon)
- [x] **product-17, 18, 19**: Cuticle Oil - Merged into product-17 (Peach + Yellow Pineapple + Case)
- [x] **products 84, 90, 91, 85, 92, 86, 87, 88, 93, 94, 89, 95**: Pedicure Trays - Split into 3 cards (4 rows max each)
- [x] **product-115-test**: Fragrance Oil - Consolidated main product with 20 scents (Aloe Vera added)
- [x] **products 115, 115-1, 115-2, 115-3**: Fragrance Oil duplicates - Removed, kept only product-115-test
- [x] **product-53**: Jojoba Scrub - Merged 2 products into 1, uses scents prop for 3 scents, badge to middle-right
- [x] **product-107 (Collagen)**: Merged 2 products into 1, uses scents prop for 8 scents, smaller table text (sm)
- [x] **product-9 (Cream Mask)**: Simplified pricing, uses scents prop for 3 scents (removed Orange from Gallon per CSV), larger table text (base), badge to middle-right
- [x] **product-3 (Callus Remover)**: Simplified pricing, uses scents prop for 2 scents, badge to middle-right
- [x] **product-27 (Lotion)**: Simplified to single size, uses scents prop for 4 scents, larger table text (base), badge to middle-right
- [x] **product-42 (Massage Oil Gallon)**: Simplified to single size, uses scents prop for 3 scents, larger table text (base), badge to middle-right

### Component Enhancements
- [x] **Added `badgePosition` prop** to SaleCard component - Controls badge placement on product card:
  - `"bottom-right"` - Default position (bottom right of card)
  - `"middle-right"` - Recommended for merged products with scents (center-right of card for better visibility)
  - Used when merging multiple variants/scents into single card to distinguish from basic product cards

- [x] **Added `scents` prop** to SaleCard component - Displays scent/flavor variants as colored badges:
  - Array of scent names that appear as interactive color-coded badges on card
  - Used for products with multiple flavor/scent options (e.g., fragrances, scrubs, specialty items)
  - Replaces individual product listings when consolidating scent variants
  - Semantic color mapping applied automatically based on scent keywords

- [x] **Added `tableTextSize` prop** to SaleCard component - Controls pricing table text size (xs/sm/base/lg/xl)

- [x] **Added semantic scent color mapping** - Scents now display with colors based on their type:
  - Green: Aloe, Eucalyptus, Lemongrass, Green Tea, Tea Tree, Spearmint
  - Yellow: Lemon, Citrus
  - Orange: Orange, Tangerine
  - Pink: Rose, Floral, Raspberry, Pomegranate
  - Purple: Lavender, Perfume, Luxury, Mademoiselle, Romance
  - Blue: Honey, Pearl, Milk & Honey, Crystal Waters
  - Red/Warm: Mango, Tropical, Ginger, Sweet flavors
  - Indigo: Default fallback

## Pending Work

### To Merge (Max 4 Rows Per Card Rule)
- [ ] **La Palm Sugar Scrub** - 12 variants across types (regular, extreme) and sizes (12oz, bucket, gallon) with 2-3 scents
- [ ] **La Palm Volcano 6 Step** - 6+ scent variants
- [ ] **KDS products** - callus remover, deluxe, pedi salt, scrub (need to locate)
- [ ] **BlazingStar Brush French** - Check if Size 12/14/16 variants need merging
- [ ] **BlazingStar Brush Gel** - Check if Size 6/8 variants need merging
- [ ] **BlazingStar Brush Premium Plus** - Check if multiple size variants need consolidation
- [ ] **BlazingStar Brush Premium Pro** - Check if multiple size variants need consolidation
- [ ] **BlazingStar File** - Check if variants need consolidation
- [ ] **Bào Carbide** products - Multiple variants may need consolidation
- [ ] **Bold Berry Gel Polish** colors/variants - May have redundant entries
- [ ] **Tip Thường Curve Tip - NATURAL** - Likely similar to other nail tip merges

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
