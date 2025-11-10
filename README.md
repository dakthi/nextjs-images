# VL London - Winter Sale Cards

A Next.js project with Tailwind CSS for creating beautiful winter-themed sale cards for products.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your product images:**
   - Place your product images in the `public` folder
   - Reference them in the component like `/your-image.jpg`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Using the SaleCard Component

```tsx
import SaleCard from '@/components/SaleCard';

<SaleCard
  productImages={['/product-colors.jpg', '/product-example.jpg']}
  resultImage="/product-result.jpg"
  promotionText="ÁP DỤNG TỪ NGÀY 14/11 ĐẾN HẾT NGÀY 30/11"
  productName="Bold Berry"
  discountPercentage={10}
  pricingTable={[
    {
      size: '15ml',
      price: '£5',
      condition: 'Mua từ 12 chai trở lên',
      discount: '£4.5',
    },
  ]}
/>
```

## Customization

The component is built with Tailwind CSS, making it easy to customize:
- Edit colors in `components/SaleCard.tsx`
- Modify the winter decorations (snowflakes, gifts)
- Adjust spacing and sizing
- Change the discount badge style

## Features

- Winter-themed sale frame with snowflakes
- Product image gallery
- Pricing table with conditions
- Discount badge
- Fully responsive design
- Built with Next.js 15 and Tailwind CSS
