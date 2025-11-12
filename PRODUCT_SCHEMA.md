# Product Schema Reference

## Complete Product Object Example

```json
{
  "id": "product-115-test",
  "category": "La Palm",
  "productName": "La Palm Fragrance Oil 2oz",
  "promotionText": "Áp dụng từ ngày 16/11 đến hết ngày 30/11",
  "discountPercentage": 32,

  "images": {
    "topLeft": "/fragrance-3.png",
    "topRight": "/fragrance-2.jpeg",
    "bottomLeft": "/fragrance.png"
  },

  "pricingTable": [
    {
      "size": "2oz (59ml)",
      "price": "£15.00",
      "condition": "OFF 10% - MUA 3 TẶNG 1",
      "discount": "£10.13"
    }
  ],

  "scents": [
    "Aloe Vera",
    "Cucumber Cashmere",
    "Eucalyptus",
    "French Floral",
    "Fresh Linen",
    "Honey Pearl",
    "Lavender Tea",
    "Lemon",
    "Lemongrass & Ginger",
    "Mademoiselle",
    "Mango",
    "Milk & Honey",
    "Orange Tangerine Zest",
    "Perfume No.5",
    "Raspberry Pomegranate",
    "Romance",
    "Rose",
    "Spearmint",
    "Tea Tree",
    "Tropical Citrus"
  ],

  "badgePosition": "middle-right",
  "tableTextSize": "base"
}
```

---

## TypeScript Interface

```typescript
interface Product {
  // Required fields
  id: string;                          // Unique product identifier (e.g., "product-115")
  category: string;                    // Product category
  productName: string;                 // Display name
  promotionText: string;               // Promotion/offer text
  discountPercentage: number;          // Discount percentage (0-100)

  // Image references
  images: {
    topLeft: string;                   // Image path (relative to /public)
    topRight: string;
    bottomLeft: string;
  };

  // Pricing information
  pricingTable: Array<{
    size: string;                      // Size/variant name or "X Case", "X oz", etc.
    price: string;                     // Original price (currency format)
    condition: string;                 // Discount condition/qualifier
    discount: string;                  // Final/discounted price
  }>;

  // Badge positioning
  badgePosition: "bottom-right" | "middle-right";

  // Optional fields
  scents?: string[];                   // Available scents/fragrances
  tableTextSize?: "xs" | "sm" | "base" | "lg" | "xl";  // Table text size
  imageLabels?: {                      // Image overlay labels
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
  };
}

interface ProductsFile {
  products: Product[];
}
```

---

## Field Reference

### Required Fields

#### `id`
- **Type:** string
- **Example:** `"product-115-test"`
- **Rules:** Must be unique, typically "product-{number}" or "product-{number}-{variant}"

#### `category`
- **Type:** string
- **Examples:** `"La Palm"`, `"KDS"`, `"BỘT ACRYLIC + OMBRE"`
- **15 Categories:** KDS, La Palm, SƠN GEL POLISH, ACRYLIC BRUSHES, TOP & BASE, BỘT ACRYLIC + OMBRE, ELECTRICAL, PEDICURE CHAIR, BIAB, NAIL TIP, ACRYLIC LIQUID, NAIL FILE, FURNITURE, NAIL TABLE, SOCIAL

#### `productName`
- **Type:** string
- **Example:** `"La Palm Fragrance Oil 2oz"`
- **Rules:** Remove size/variant suffixes if using scents or tableTextSize
- **Good:** "La Palm Lotion"
- **Bad:** "La Palm Lotion Gallon" (size should be in pricing table)

#### `promotionText`
- **Type:** string
- **Example:** `"Áp dụng từ ngày 16/11 đến hết ngày 30/11"`
- **Format:** Vietnamese date range text
- **Usage:** Displayed in blue banner on product card

#### `discountPercentage`
- **Type:** number (0-100)
- **Example:** `32`
- **Usage:** Determines which discount badge image to display
- **Common values:** 0, 10, 20, 30, 32

#### `images`
- **Type:** object with 3 required keys
- **Keys:** `topLeft`, `topRight`, `bottomLeft`
- **Values:** relative paths to public/images (e.g., `/fragrance-3.png`)
- **Notes:** Can use same image multiple times if needed

#### `pricingTable`
- **Type:** array of objects (1+ items)
- **Minimum size:** 1 pricing row
- **Maximum recommended:** 4 rows (for card layout readability)
- **Each row has 4 fields:**
  - `size`: string - size name or "X oz", "X Case", etc.
  - `price`: string - original price in GBP format (£X.XX)
  - `condition`: string - discount/offer condition (can be empty)
  - `discount`: string - final price in GBP format (£X.XX)

#### `badgePosition`
- **Type:** enum string
- **Values:** `"bottom-right"` | `"middle-right"`
- **Default:** `"bottom-right"`
- **"middle-right":** Used for premium/featured products (42 products)

---

### Optional Fields

#### `scents`
- **Type:** array of strings
- **When to use:** Products with multiple fragrance/scent variants
- **Display:** Colored badges below pricing table
- **Color mapping:** Semantic based on scent type (Green, Yellow, Orange, Pink, Purple, Blue, Red, Teal, Brown, Indigo)
- **Products using:** 7 total
  - product-115-test (20 scents)
  - product-53 (3 scents)
  - product-107 (8 scents)
  - product-9 (3 scents)
  - product-3 (2 scents)
  - product-27 (8 scents)
  - product-42 (3 scents)

#### `tableTextSize`
- **Type:** enum string
- **Values:** `"xs"` | `"sm"` | `"base"` | `"lg"` | `"xl"`
- **Default:** `"xs"`
- **When to use:** When pricing table needs custom text size
- **Products using:** 4 total
  - product-107: `"sm"` (smaller)
  - product-9: `"base"` (medium)
  - product-27: `"base"` (medium)
  - product-42: `"base"` (medium)

#### `imageLabels`
- **Type:** object with optional keys
- **Keys:** `topLeft`, `topRight`, `bottomLeft` (all optional)
- **Values:** string labels to overlay on images
- **When to use:** Product images with brand names or style codes
- **Example:** `{ "topLeft": "Kira", "topRight": "MAIA", "bottomLeft": "NORA" }`
- **Currently used:** 0 products

---

## Scent Color Mapping System

10 semantic color categories automatically applied:

| Category | Colors | Scents |
|----------|--------|--------|
| **Warm/Spicy** | Red badge | Mango, Ginger, Vanilla, Cinnamon, Cocoa, Coffee, etc. |
| **Teal/Cool Mint** | Teal badge | Mint, Spearmint, Peppermint |
| **Green/Herbal** | Green badge | Aloe, Eucalyptus, Basil, Pine, Cedarwood, etc. |
| **Yellow/Citrus** | Yellow badge | Lemon, Lime, Grapefruit, Passion, Pineapple |
| **Orange/Warm Citrus** | Orange badge | Orange, Tangerine, Mandarin, Peach, Apricot |
| **Pink/Floral** | Pink badge | Rose, Berry, Raspberry, Cherry, Peony, Lilac |
| **Purple/Luxury** | Purple badge | Lavender, Perfume, Iris, Violet, Jasmine, Oud |
| **Blue/Creamy** | Blue badge | Honey, Milk, Cream, Almond, Aqua, Ocean, Rain |
| **Brown/Woody** | Amber badge | Sandalwood, Patchouli, Vetiver, Leather, Tobacco |
| **Unknown** | Indigo badge | Unrecognized scent names (fallback) |

---

## Data Validation Rules

### Required Fields Checklist
- [ ] `id` - unique and valid format
- [ ] `category` - exists in 15 categories list
- [ ] `productName` - concise, no size suffix if using scents
- [ ] `promotionText` - non-empty promotion message
- [ ] `discountPercentage` - 0-100 number
- [ ] `images.topLeft` - valid path
- [ ] `images.topRight` - valid path
- [ ] `images.bottomLeft` - valid path
- [ ] `pricingTable` - 1+ rows with all 4 fields per row
- [ ] `badgePosition` - "bottom-right" or "middle-right"

### Pricing Table Rules
- ✓ Each row must have all 4 fields (size, price, condition, discount)
- ✓ Prices should be in GBP format (£X.XX)
- ✓ Discount should not exceed original price
- ✓ Keep to ≤ 4 rows for readability
- ✓ Remove scent names from size field if using `scents` array

### File Rules
- ✓ Valid JSON structure
- ✓ Root must have `products` array
- ✓ All products must have 8 required fields minimum
- ✓ File size: currently 127.42 KB (4,436 lines)
- ✓ Total products: 166

---

## Common Patterns

### Simple Product (1 pricing row, no special features)
```json
{
  "id": "product-X",
  "category": "Category Name",
  "productName": "Product Name",
  "promotionText": "Áp dụng từ...",
  "discountPercentage": 10,
  "images": { "topLeft": "...", "topRight": "...", "bottomLeft": "..." },
  "pricingTable": [{ "size": "Size", "price": "£X.XX", "condition": "", "discount": "£X.XX" }],
  "badgePosition": "bottom-right"
}
```

### Complex Product (multiple sizes + scents)
```json
{
  "id": "product-X",
  "category": "La Palm",
  "productName": "Product Name",
  "promotionText": "Áp dụng từ...",
  "discountPercentage": 10,
  "images": { "topLeft": "...", "topRight": "...", "bottomLeft": "..." },
  "pricingTable": [
    { "size": "24oz", "price": "£7.00", "condition": "OFF 10%", "discount": "£6.30" },
    { "size": "Gallon", "price": "£25.00", "condition": "OFF 10%", "discount": "£16.88" }
  ],
  "scents": ["Scent 1", "Scent 2", "Scent 3"],
  "badgePosition": "middle-right",
  "tableTextSize": "base"
}
```

---

## Statistics Summary

| Metric | Value |
|--------|-------|
| Total Products | 166 |
| Total Categories | 15 |
| Total File Size | 127.42 KB |
| Avg Product Size | ~770 bytes |
| Products with scents | 7 (4.2%) |
| Products with tableTextSize | 4 (2.4%) |
| Products with imageLabels | 0 (0%) |
| Average pricing rows | 1.5 rows/product |
| Max pricing rows | 4+ rows |
