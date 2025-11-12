# products-generated.json Structure Breakdown

## Overview
- **File Size:** 127.42 KB
- **Total Products:** 166
- **Total Categories:** 15
- **Lines of Code:** 4,436

---

## Root Structure

```json
{
  "products": [
    { product object 1 },
    { product object 2 },
    ...
    { product object 166 }
  ]
}
```

---

## Product Object Schema

### Required Properties (8 fields)

```json
{
  "id": "product-187",                          // string: unique identifier
  "category": "BỘT ACRYLIC + OMBRE",           // string: product category
  "productName": "BlazingStar Maxx Perform",   // string: display name
  "promotionText": "Áp dụng từ ngày...",       // string: promotion message
  "discountPercentage": 10,                     // number: discount %

  "images": {                                   // object: image references
    "topLeft": "/image-path.jpg",              // string: image path
    "topRight": "/image-path.jpg",
    "bottomLeft": "/image-path.jpg"
  },

  "pricingTable": [                            // array: pricing rows
    {
      "size": "23oz",                          // string: size/variant
      "price": "£70.00",                       // string: original price
      "condition": "SL <3",                    // string: discount condition
      "discount": "£63.00"                     // string: final price
    },
    { pricing row 2 },
    ...
  ],

  "badgePosition": "bottom-right"              // string: 'bottom-right' or 'middle-right'
}
```

### Optional Properties

| Property | Type | Used By | Count |
|----------|------|---------|-------|
| `scents` | array[string] | Fragrance/Lotion products | 7 products |
| `tableTextSize` | string | Products needing larger text | 4 products |
| `imageLabels` | object | Products with label overlays | 0 products |

---

## Category Distribution

| Category | Count | Primary Type |
|----------|-------|--------------|
| KDS | 47 | Beauty products |
| La Palm | 40 | Hand care products |
| SƠN GEL POLISH | 14 | Gel polish colors |
| ACRYLIC BRUSHES | 12 | Nail brushes |
| TOP & BASE | 11 | Gel top/base coats |
| BỘT ACRYLIC + OMBRE | 9 | Acrylic powders |
| ELECTRICAL | 7 | Equipment |
| PEDICURE CHAIR | 6 | Furniture |
| BIAB | 4 | Builder-in-a-bottle |
| NAIL TIP | 3 | Artificial tips |
| ACRYLIC LIQUID | 3 | Liquid products |
| NAIL FILE | 3 | Filing tools |
| FURNITURE | 3 | Furniture items |
| NAIL TABLE | 3 | Work tables |
| SOCIAL | 1 | Misc |

---

## Data Type Distribution Per Product

- **String Fields:** ~6 per product
- **Number Fields:** ~1 per product
- **Array Fields:** ~2 per product
- **Object Fields:** ~1 per product

---

## Optional Features Breakdown

### Scents Property (7 Products)
Used for fragrance/scent-based products to display available variants:
```json
"scents": [
  "Green Tea",
  "Lemongrass & Ginger",
  "Spearmint Eucalyptus"
]
```
**Products with scents:**
- product-115-test: La Palm Fragrance Oil (20 scents)
- product-53: La Palm Jojoba Scrub (3 scents)
- product-107: La Palm Collagen (8 scents)
- product-9: La Palm Cream Mask (3 scents)
- product-3: La Palm Callus Remover (2 scents)
- product-27: La Palm Lotion (8 scents)
- product-42: La Palm Massage Oil (3 scents)

### TableTextSize Property (4 Products)
Controls pricing table text size for better readability:
```json
"tableTextSize": "base"  // values: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
```
**Products with tableTextSize:**
- product-107: 'sm' (smaller text)
- product-9: 'base' (medium text)
- product-27: 'base' (medium text)
- product-42: 'base' (medium text)

### ImageLabels Property (0 Products Currently)
For labeling images on product cards:
```json
"imageLabels": {
  "topLeft": "Label 1",
  "topRight": "Label 2",
  "bottomLeft": "Label 3"
}
```

---

## Pricing Table Structure

Each product has a pricing table with 1+ rows showing:
- **Size:** Product size/variant (e.g., "24oz", "Gallon", "2oz")
- **Price:** Original/list price (e.g., "£7.00")
- **Condition:** Discount qualifier (e.g., "OFF 10% MUA 3 TẶNG 1")
- **Discount:** Final/discounted price (e.g., "£6.30")

### Examples

**Simple pricing (1 row):**
```json
"pricingTable": [
  {
    "size": "24oz",
    "price": "£7.00",
    "condition": "OFF 10% MUA TRÊN 3",
    "discount": "£6.30"
  }
]
```

**Complex pricing (2+ rows with multiple sizes):**
```json
"pricingTable": [
  {
    "size": "24oz",
    "price": "£7.00",
    "condition": "OFF 10% MUA TRÊN 3",
    "discount": "£6.30"
  },
  {
    "size": "Gallon",
    "price": "£25.00",
    "condition": "OFF 10% MUA 3 TẶNG 1",
    "discount": "£16.88"
  }
]
```

---

## Merged Products (Consolidation Status)

### Fully Merged
- **product-115-test:** Fragrance Oil (consolidated 4 products)
- **product-53:** Jojoba Scrub (consolidated 2 products)
- **product-107:** Collagen (consolidated 2 products)
- **product-27:** Lotion (consolidated 4 → 2 products)
- **product-3:** Callus Remover (simplified)
- **product-9:** Cream Mask (simplified)
- **product-42:** Massage Oil (consolidated 2 products)
- **product-1:** Liquid Mango (consolidated 2 products)
- **product-58:** Sugar Scrub (removed duplicate product-57)
- **product-64:** Sugar Scrub Extreme (removed duplicate product-63)

---

## Badge Positioning

Two available positions for discount badge:
- **`bottom-right`:** Badge positioned at bottom right of card (default)
- **`middle-right`:** Badge positioned at middle right of card (premium products)

**Products with middle-right badge:** 42
**Products with bottom-right badge:** 124

---

## Size Guidelines

### Pricing Table Text Sizes
| Value | Use Case | Text Size |
|-------|----------|-----------|
| `xs` | Default, compact tables | Extra Small |
| `sm` | Smaller text for long content | Small (product-107) |
| `base` | Standard, readable text | Medium (product-9, 27, 42) |
| `lg` | Large text for simple tables | Large |
| `xl` | Extra large for emphasis | Extra Large |

---

## Notes for Developers

1. **Images:** All image paths are relative to `/public` directory
2. **Scents:** Use semantic color mapping in SaleCard component (10 color categories)
3. **Pricing:** Currency is GBP (£) - update if needed
4. **Conditions:** Vietnamese text - "OFF %" = discount, "MUA" = purchase, "TẶNG" = gift
5. **consolidation:** Prefer single products with scents/pricing arrays over duplicates
6. **Maximum pricing rows:** Keep pricing tables ≤ 4 rows per product card for readability
