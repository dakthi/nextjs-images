# VL London Sale Card Generator

A Next.js application for generating beautiful sale cards for VL London's product promotions.

## Brand Names
- **BB** = Bold Berry
- **MB** = MBerry
- **BS** = BlazingStar

## How to Add Products with Discounts

### Step 1: Update the CSV File

The source of truth is the CSV file located at:
```
public/Penguine Sales 2025 - Sheet2.csv
```

#### CSV Column Structure:
- **CATEGORIES**: Product category (e.g., "BỘT ACRYLIC + OMBRE", "SƠN GEL POLISH")
- **Product Name**: Full product name
- **Packing Size**: Size/variant information
- **Org Price**: Original price (e.g., £36.00)
- **Sale Price**: Discounted price (e.g., £30.60)
- **CANH CUT SALE**: Condition for the discount (e.g., "MUA >=5 GIẢM 15%")
- **Thi**: Tracking column - mark as TRUE when added to JSON
- **Thanh**: Additional tracking column

### Step 2: Add to JSON File

Edit the file:
```
data/products-generated.json
```

#### JSON Structure:
```json
{
  "id": "product-X",
  "category": "CATEGORY_NAME",
  "productName": "Product Name",
  "promotionText": "ÁP DỤNG TỪ NGÀY 14/11 ĐẾN HẾT NGÀY 30/11",
  "discountPercentage": 20,
  "images": {
    "topLeft": "/vllondon-logo.jpeg",
    "topRight": "/vllondon-logo.jpeg",
    "bottomLeft": "/vllondon-logo.jpeg"
  },
  "pricingTable": [
    {
      "size": "SIZE_INFO",
      "price": "ORIGINAL_PRICE",
      "condition": "DISCOUNT_CONDITION",
      "discount": "DISCOUNTED_PRICE"
    }
  ]
}
```

### Step 3: Format Discount Conditions Correctly

#### ✅ CORRECT Format Examples:
- `"MUA >=5"` - Buy 5 or more
- `"MUA >=4 (MIX & MATCH)"` - Buy 4+ with mix & match
- `"SL <3"` - Quantity less than 3
- `"Mua cả set"` - Buy the whole set
- `"SL >=10"` - Quantity 10 or more
- `"SL >=20"` - Quantity 20 or more

#### ❌ WRONG Format Examples (DO NOT USE):
- ~~`"MUA >=5 GIẢM 15%"`~~ - Remove "GIẢM X%"
- ~~`"MUA >=4 - MIX & MATCH"`~~ - Remove the dash, use parentheses
- ~~`"GIẢM 25% TỪ GIÁ GỐC"`~~ - Too verbose, use "Mua cả set"

**Why?** The discount percentage is already shown in the card design, so don't repeat it in the condition text.

## Important Checks Before Adding

### ⚠️ Double-Check These Items:

#### 1. **Discount Makes Sense**
- ✅ Check: Does `Sale Price` actually have a discount?
- ❌ Skip rows where `Org Price = Sale Price` (no discount = no need to add)
- Example: If £36.00 → £36.00, skip this row

#### 2. **Pricing Table Row Limit**
- Maximum **2 rows** per product card (best for readability)
- Maximum **3 rows** if needed (text will be smaller but still readable)
- If a product has more variations, split into separate cards

#### 3. **Merge Similar Products**
When the same product has multiple discount tiers, combine them:

**Example CSV:**
```
BLAZINGSTAR Ombre 2oz,lẻ,£10.00,£9.00,SL >=10
BLAZINGSTAR Ombre 2oz,lẻ,£10.00,£8.00,SL >=20
```

**Becomes ONE JSON entry:**
```json
{
  "productName": "BLAZINGSTAR Ombre 2oz",
  "pricingTable": [
    {
      "size": "2oz",
      "price": "£10.00",
      "condition": "SL >=10",
      "discount": "£9.00"
    },
    {
      "size": "2oz",
      "price": "£10.00",
      "condition": "SL >=20",
      "discount": "£8.00"
    }
  ]
}
```

#### 4. **Size Field Accuracy**
- Use the actual product size (e.g., "23oz", "2oz", "15ml")
- NOT the packing type (e.g., use "23oz" instead of "lẻ")
- For sets, keep the full description (e.g., "Set 31 (22 Ombre + 3 White + 6 French)")

#### 5. **Track What You've Added**
After adding a product to JSON, mark the CSV:
- Set the **"Thi"** column to **TRUE** for those rows
- This prevents duplicate entries

#### 6. **Calculate Discount Percentage**
The `discountPercentage` field should be the maximum discount:
```javascript
discountPercentage = Math.round(((orgPrice - salePrice) / orgPrice) * 100)
```

Example: £36.00 → £30.60 = 15% discount

## Common Mistakes to Avoid

### ❌ Mistake #1: Including "No Discount" Rows
**Wrong:**
```json
{
  "size": "23oz",
  "price": "£70.00",
  "condition": "SL <3",
  "discount": "£70.00"  // Same price = no discount!
}
```
**Skip rows where price equals discount!**

### ❌ Mistake #2: Putting Discount % in Condition
**Wrong:**
```json
{
  "condition": "MUA >=5 GIẢM 15%"
}
```
**Correct:**
```json
{
  "condition": "MUA >=5"
}
```

### ❌ Mistake #3: Wrong Dash Format
**Wrong:**
```json
{
  "condition": "MUA >=4 - MIX & MATCH"
}
```
**Correct:**
```json
{
  "condition": "MUA >=4 (MIX & MATCH)"
}
```

### ❌ Mistake #4: Separate Cards for Same Product
If a product has multiple discount tiers, combine them into ONE card with multiple pricing rows, not separate cards.

## Verification Checklist

Before committing your changes:

- [ ] CSV "Thi" column marked as TRUE for added rows
- [ ] No duplicate entries in JSON
- [ ] All prices have actual discounts (Sale Price < Org Price)
- [ ] Condition text is clean (no "GIẢM X%")
- [ ] Discount percentage is calculated correctly
- [ ] Product name is accurate
- [ ] Size field shows actual size, not packing type
- [ ] Maximum 2-3 pricing rows per product
- [ ] Similar products are merged into one entry

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## Exporting Sale Cards

1. View the generated cards in your browser
2. Click the "Export to PNG" button
3. All cards will be saved as a single PNG file

## Project Structure

```
vl-london/
├── app/
│   ├── page.tsx              # Main page with product cards
│   └── layout.tsx            # Layout with fonts
├── components/
│   └── SaleCard.tsx          # Sale card component
├── data/
│   └── products-generated.json  # Product data (source of truth)
├── public/
│   ├── Penguine Sales 2025 - Sheet2.csv  # CSV reference
│   ├── background.png        # Card background
│   ├── background-overlay.svg # Snowflake overlay
│   ├── discount-badge-10.png # Discount badge
│   ├── penguin-sale-corner.png # Corner decoration
│   └── vllondon-logo.jpeg    # Placeholder image
└── scripts/
    └── convertCsvToJson.js   # CSV converter (if needed)
```

## Questions?

If you encounter issues or have questions about adding products:
1. Double-check the "Verification Checklist" above
2. Review existing entries in `products-generated.json` for examples
3. Make sure your JSON is valid (use a JSON validator)
