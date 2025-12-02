# Product Code System Analysis & Recommendations

**Date:** December 2, 2025
**Current Database:** 84 products across 6 brands
**WooCommerce Export:** 7,957 products

---

## Current State

### Your Database (84 products)
- **Product Code Format:** `product-{number}` or `product-{number}-{variant}`
  - Examples: `product-1`, `product-297-1`, `product-115-test`
  - No standardized naming convention
  - No brand prefix
  - Numbers don't follow any clear pattern

**Brands in Your Database:**
- BlazingStar: 37 products
- Bold Berry: 9 products
- KDS: 6 products
- La Palm: 18 products
- MBerry: 5 products
- VL London: 9 products

---

## WooCommerce Export Analysis (7,957 products)

### Product Types
- **Variation:** 3,964 (49.8%) - Color/size variants
- **Simple:** 2,511 (31.6%) - Single products
- **Variable:** 1,475 (18.5%) - Parent products with variants
- **Other:** 7 products

### SKU Prefix Distribution (Top 15)

| Prefix | Count | Brand/Product Line | Example SKU |
|--------|-------|-------------------|-------------|
| BBG*** | 1,418 | Bold Berry Gel Polish | BBG401-PR |
| BSG*** | 1,088 | BlazingStar Gel Polish | BSG499PR |
| mb-*** | 662 | MBerry Gel Polish | mb-gp-006-pr |
| chi*** | 562 | Chisel (NEW BRAND) | chi-candy-2oz-pr |
| SNS*** | 454 | SNS (NEW BRAND) | SNSGTHINNER2oz-bk |
| DND*** | 451 | DND (in your system) | DND401 |
| bs-*** | 388 | BlazingStar accessories | bs-br-nor-pr |
| lp-*** | 341 | La Palm | lp-calr-superlemon-pr |
| bsg*** | 279 | BlazingStar Gel Top/Base | bsgt-sunshield-pr |
| bbd*** | 242 | Bold Berry Dipping | bbdo-231 |
| 100*** | 238 | Miscellaneous | 1001622 |
| cnd*** | 191 | CND (in your system) | cnd_aurora |
| DC2*** | 171 | DND DC Collection | DC201 |
| hat*** | 170 | HAT (NEW BRAND) | hat_n01 |
| BST*** | 164 | BlazingStar Tips | BSTipStraight |

### Major Categories
1. Bold Berry Gel Polish: 483 products
2. SNS Dip Powder: 462 products
3. DND Duo: 451 products
4. DND DC Duo Gel: 396 products
5. BlazingStar Gel Polish: 368 products
6. Chisel Dipping Powder: 266 products
7. MBerry Gel Polish: 217 products
8. CND Shellac: 189 products
9. HAT Powder: 170 products
10. OPI products: 242 products total

### New Brands Not in Your Database
- **Chisel** - 562 products
- **SNS** - 454 products
- **HAT** - 170 products
- **OPI** - 242 products (you added the brand but have no products)

---

## Problems with Current System

### 1. **No Standard Naming Convention**
- `product-1` vs `product-297-1` vs `product-115-test`
- No way to identify brand from code
- Hard to search/filter
- Not user-friendly

### 2. **Number Conflicts**
- Your DB: `product-401` (BlazingStar Tip Natural)
- WooCommerce: `BBG401-PR` (Bold Berry D401 - Moulin Rouge)
- These are completely different products!

### 3. **Brand Information Lost**
- Can't tell what brand a product belongs to from the code
- Requires database lookup every time

### 4. **Variant Naming Inconsistent**
- Sometimes: `product-297-1`, `product-297-2`
- Sometimes: `product-115-test`
- No clear pattern

---

## Recommendations

### Option 1: Adopt WooCommerce SKU System (RECOMMENDED)

**Pros:**
✅ Already used in your WooCommerce store
✅ Brand-prefixed (BBG, BSG, mb-, etc.)
✅ Consistent structure
✅ Easy to identify product line
✅ 7,890 products already have SKUs
✅ Matches customer expectations

**Cons:**
❌ Need to migrate existing 84 products
❌ Some products might not have SKUs (67 products)

**Action Plan:**
1. **Backup** (✅ DONE)
2. **Add SKU column** to products table
3. **Map existing products** to WooCommerce SKUs
4. **Import WooCommerce products** using their SKUs
5. **Update all references** from `product_code` to `sku`

---

### Option 2: Create New Unified System

**Pros:**
✅ Clean slate
✅ Full control
✅ Can be simpler

**Cons:**
❌ Doesn't match WooCommerce
❌ Requires remapping 7,957 products
❌ Customer confusion
❌ More work

**Proposed Format:**
```
{BRAND}-{CATEGORY}-{NUMBER}[-{VARIANT}]

Examples:
BS-GP-499      BlazingStar Gel Polish #499
BB-GP-401      Bold Berry Gel Polish #401
LP-CR-001      La Palm Cream #1
VL-CH-001      VL London Chair #1
```

---

### Option 3: Keep Current System, Map to SKUs

**Pros:**
✅ No changes to current code
✅ Maintain compatibility

**Cons:**
❌ Still have the same problems
❌ Need mapping table
❌ Confusing to maintain

---

## My Recommendation

**Adopt Option 1: Use WooCommerce SKU System**

### Migration Strategy:

#### Phase 1: Preparation
1. ✅ Backup complete
2. Add `sku` column to products table (keep product_code for now)
3. Create SKU mapping for existing 84 products

#### Phase 2: Mapping Current Products
Map your 84 products to WooCommerce SKUs:
- `product-1` → Find matching WooCommerce product and use its SKU
- `product-297-1` → `bs-br-nor-16` (BlazingStar Brush Size 16)
- etc.

#### Phase 3: Import WooCommerce Data
1. Import all 7,957 products using their WooCommerce SKUs
2. Match by SKU and update existing products
3. Create new products for items not in your database

#### Phase 4: Switch Over
1. Update all code references from `product_code` to `sku`
2. Deprecate `product_code` column
3. Test thoroughly

---

## Data Quality Issues to Address

### Products with Images: 4,869 / 7,957 (61%)
- 3,088 products have NO images
- Need to add images for these

### Products without SKU: 67 / 7,957 (0.8%)
- Need to generate SKUs for these
- Or exclude from import

### Brand Column Mostly Empty
- Only 89 products have brand field populated
- Need to derive brand from:
  - SKU prefix
  - Category name
  - Product name

---

## Next Steps

**What do you want to do?**

1. **Adopt WooCommerce SKU system** and start migration?
2. **Create custom SKU system** and remap everything?
3. **Keep current system** and just import as-is?
4. **Something else?**

Let me know your choice and I'll proceed with the implementation!
