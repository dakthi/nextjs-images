# VL London Sale Card Data Summary

## Overview
Complete product catalog compiled from 3 CSV sources with **391 total products** ready for sale card generation.

## Product Sources
| Source | Products | Categories |
|--------|----------|------------|
| **La Palm** | 133 | Skincare & Beauty Products |
| **KDS** | 47 | Pedicure & Salon Products |
| **Manicure & Supplies** | 211 | Tools, Equipment, Accessories |
| **TOTAL** | **391** | **15+ Categories** |

## La Palm Products (133)
- Liquids, Callus Removers, Masks & Lotions
- Cuticle Oils & Softeners, Lotions
- Massage Oils, Sea Salts, Scrubs
- Flower Soaps, Pedicure Trays
- Volcano Collections, Collagen Products
- Fragrance Oils (22 scents)

**Price Range:** £2.50 - £125.00

## KDS Products (47)
- Callus Removers & Clay Masks
- Deluxe 4-Step Collections (18 scents)
- Liquid Coffee Products
- Pedi Salts, Scrubs
- Sugar Scrubs

**Price Range:** £2.50 - £105.00

## Manicure & Supplies (211)
- Acrylic Brushes (34)
- Drill Bits (32)
- Gel Polishes (26)
- Nail Tips (24)
- Acrylic Powders (23)
- Electrical Equipment (20)
- Top & Base Coats (13)
- Acrylic Liquids (10)
- Furniture & Equipment (13)
- Nails, Files, BIAB (11)

**Price Range:** £2.40 - £2,400.00

## Data Accuracy
✅ All 391 products verified
✅ Pricing: Original → Sale Price
✅ Discounts: Auto-calculated from price difference
✅ All product names cleaned and standardized
✅ All scents and variants included

## Discount Distribution
- 0% off: 47 products (no sale)
- 10% off: 89 products
- 15% off: 21 products
- 20% off: 97 products
- 25% off: 3 products
- 28-32% off: 134 products

## JSON File
**Location:** `/data/products-generated.json`
**Format:** Standard JSON with flat structure
**Fields:** id, category, productName, promotionText, discountPercentage, images, pricingTable

### Sample Product Structure
```json
{
  "id": "product-1",
  "category": "La Palm",
  "productName": "La Palm Liquid 4 Season - Mango",
  "promotionText": "Winter Sale 2025",
  "discountPercentage": 0,
  "images": {
    "topLeft": "/vllondon-logo.jpeg",
    "topRight": "/vllondon-logo.jpeg",
    "bottomLeft": "/vllondon-logo.jpeg"
  },
  "pricingTable": [
    {
      "size": "4",
      "price": "£50.00",
      "condition": "Standard",
      "discount": "£50.00"
    }
  ]
}
```

## Ready For
✅ Sale Card Generation
✅ Price Display
✅ Export to Multiple Formats
✅ Bulk Catalog Distribution

---
Generated: November 10, 2025
Data Quality: ✅ 100% Complete & Verified
