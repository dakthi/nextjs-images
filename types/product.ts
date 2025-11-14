export interface PricingRow {
  size: string;
  price: string;
  condition: string;
  discount: string;
}

export interface Product {
  id: string;
  category: string;
  productName: string;
  promotionText?: string;
  discountPercentage?: number;
  images?: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
  };
  pricingTable: PricingRow[];
  badgePosition?: string;
  tableTextSize?: string;
  scents?: string[];
  showOnlyPriceColumn?: boolean;
  showSizeAndConditionColumnsOnly?: boolean;
  [key: string]: any;
}
