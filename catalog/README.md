# Product Catalog Generator

A standalone HTML catalog generator that creates a professional, print-ready PDF catalog from your product data.

## Features

- **Professional Layout**: Clean, organized catalog with cover page, product pages grouped by category, and back cover
- **Print-Optimized**: A4 page size with proper margins and page breaks
- **Automatic Grouping**: Products automatically grouped by category
- **Product Information**:
  - Product images (3 per product)
  - Product name and description
  - Promotion text
  - Discount badges
  - Scent/variant badges
  - Complete pricing table with size, original price, conditions, and sale price
- **Filtering Options**:
  - Show only products with images
  - Filter by specific category
- **PDF Export**: Use browser's print function to save as PDF

## How to Use

1. **Open the catalog**:
   - Simply open `index.html` in your browser
   - Or use a local server: `python -m http.server` from the project root

2. **View the catalog**:
   - Products are automatically loaded from `../data/products-generated.json`
   - Catalog shows cover page, product pages by category, and back cover

3. **Filter products** (optional):
   - Check/uncheck "Only products with images" to include/exclude placeholder products
   - Select a specific category from the dropdown
   - Click "Regenerate" to update the catalog

4. **Export to PDF**:
   - Click "Print Catalog / Save as PDF" button
   - Or use Ctrl+P (Cmd+P on Mac)
   - Choose "Save as PDF" as your printer
   - Adjust print settings:
     - Paper size: A4
     - Margins: None (or minimal)
     - Background graphics: ON
   - Save your PDF

## File Structure

```
catalog/
├── index.html          # Main catalog page
├── catalog-styles.css  # Styling for catalog and print layout
├── catalog-script.js   # JavaScript to generate catalog from data
└── README.md          # This file
```

## Customization

### Colors and Branding
Edit `catalog-styles.css`:
- Cover page gradient: `.cover-page { background: ... }`
- Category headers: `.category-header { background: ... }`
- Discount badges: `.product-discount-badge { background: ... }`

### Layout
Edit `catalog-styles.css`:
- Page size: `.page { width: 210mm; min-height: 297mm; }` (A4 default)
- Product spacing: `.product-item { margin-bottom: ... }`
- Images per row: `.product-images { grid-template-columns: repeat(3, 1fr); }`

### Content
Edit `index.html`:
- Cover page title and dates
- Contact information on back cover
- Footer text

## Tips

- **Best Results**: Use products with actual images (not placeholders)
- **Category Pages**: Each category starts on a new page automatically
- **Page Breaks**: Products won't break across pages
- **Print Settings**: Make sure "Background graphics" is enabled for best results
- **Browser**: Chrome/Edge recommended for best PDF export quality

## Troubleshooting

**Images not showing?**
- Check that image paths in `products-generated.json` are correct
- Ensure images exist in the `public/` folder
- Images use relative paths (`../public/...`)

**Products not loading?**
- Check browser console for errors
- Verify `products-generated.json` is in the correct location
- Make sure you're serving from a web server (not just file://)

**PDF looks different?**
- Enable "Background graphics" in print settings
- Set margins to "None" or "Minimal"
- Try different browsers (Chrome usually works best)
