'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { getImageUrl } from '@/utils/imageUrl';

// Register font with Vietnamese support
// Using Open Sans from Google Fonts with Vietnamese subset
Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4nY1M2xLER.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Open Sans',
  },
  coverPage: {
    backgroundColor: '#667eea',
    color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    fontFamily: 'Open Sans',
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Open Sans',
  },
  coverSubtitle: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Open Sans',
  },
  coverDates: {
    fontSize: 14,
    marginBottom: 30,
    fontFamily: 'Open Sans',
  },
  categoryHeader: {
    backgroundColor: '#4a5568',
    color: '#ffffff',
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promotionHeader: {
    backgroundColor: '#667eea',
    color: '#ffffff',
    padding: 6,
    fontSize: 11,
    marginBottom: 10,
    textAlign: 'center',
  },
  productItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
  },
  productInfo: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPromotion: {
    fontSize: 10,
    color: '#555555',
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: '#f56565',
    color: '#ffffff',
    padding: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  scentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  scentBadge: {
    fontSize: 9,
    padding: 3,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    color: '#1a202c',
    marginRight: 5,
    marginBottom: 5,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
    gap: 4,
  },
  productImage: {
    width: '32%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    borderBottomStyle: 'solid',
  },
  tableCell: {
    padding: 8,
    fontSize: 12,
    flex: 1,
  },
  tableCellHeader: {
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  priceOriginal: {
    textDecoration: 'line-through',
    color: '#666666',
  },
  priceDiscount: {
    color: '#c53030',
    fontWeight: 'bold',
    fontSize: 14,
  },
  backCover: {
    backgroundColor: '#2d3748',
    color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  backCoverTitle: {
    fontSize: 24,
    marginBottom: 30,
  },
  contactInfo: {
    fontSize: 14,
    marginBottom: 40,
    textAlign: 'center',
  },
  contactLine: {
    marginBottom: 10,
  },
  footer: {
    fontSize: 12,
    opacity: 0.7,
  },
});

interface Product {
  id: string;
  productName: string;
  category: string;
  promotionText?: string;
  discountPercentage?: number;
  images: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
  };
  pricingTable: Array<{
    size?: string;
    price: string;
    condition?: string;
    discount: string;
  }>;
  scents?: string[];
  [key: string]: any;
}

interface CatalogPDFProps {
  products: Product[];
}

export default function CatalogPDF({ products }: CatalogPDFProps) {
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.coverTitle}>VL LONDON</Text>
          <Text style={styles.coverSubtitle}>Winter Sale 2025</Text>
          <Text style={styles.coverDates}>Áp dụng từ ngày 16/11 đến hết ngày 30/11</Text>
        </View>
      </Page>

      {/* Product Pages by Category */}
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <Page key={category} size="A4" style={styles.page} wrap>
          <Text style={styles.categoryHeader}>{category}</Text>
          <Text style={styles.promotionHeader}>{categoryProducts[0]?.promotionText}</Text>
          {categoryProducts.map((product) => (
            <View key={product.id} style={styles.productItem} wrap={false}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.productName}</Text>
                {product.discountPercentage != null && product.discountPercentage > 0 && (
                  <Text style={styles.discountBadge}>
                    -{product.discountPercentage}% OFF
                  </Text>
                )}
                {product.scents && (
                  <View style={styles.scentsContainer}>
                    {product.scents.map((scent, idx) => (
                      <Text key={idx} style={styles.scentBadge}>
                        {scent}
                      </Text>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.imagesContainer}>
                {product.images.topLeft && product.images.topLeft !== '/vllondon-logo.jpeg' && (
                  <Image
                    src={getImageUrl(product.images.topLeft)}
                    style={styles.productImage}
                    cache={false}
                  />
                )}
                {product.images.topRight && product.images.topRight !== '/vllondon-logo.jpeg' && (
                  <Image
                    src={getImageUrl(product.images.topRight)}
                    style={styles.productImage}
                    cache={false}
                  />
                )}
                {product.images.bottomLeft && product.images.bottomLeft !== '/vllondon-logo.jpeg' && (
                  <Image
                    src={getImageUrl(product.images.bottomLeft)}
                    style={styles.productImage}
                    cache={false}
                  />
                )}
              </View>

              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  {product.pricingTable[0].size && (
                    <Text style={styles.tableCellHeader}>Size</Text>
                  )}
                  <Text style={styles.tableCellHeader}>Price</Text>
                  {product.pricingTable[0].condition && (
                    <Text style={styles.tableCellHeader}>Condition</Text>
                  )}
                  <Text style={styles.tableCellHeader}>Sale Price</Text>
                </View>
                {product.pricingTable.map((row, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    {row.size && <Text style={styles.tableCell}>{row.size}</Text>}
                    <Text style={[styles.tableCell, styles.priceOriginal]}>{row.price}</Text>
                    {row.condition && <Text style={styles.tableCell}>{row.condition}</Text>}
                    <Text style={[styles.tableCell, styles.priceDiscount]}>{row.discount}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Page>
      ))}

      {/* Back Cover */}
      <Page size="A4" style={styles.backCover}>
        <View>
          <Text style={styles.backCoverTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLine}>VL London</Text>
            <Text style={styles.contactLine}>Email: contact@vllondon.com</Text>
            <Text style={styles.contactLine}>Phone: +44 XXX XXX XXXX</Text>
          </View>
          <Text style={styles.footer}>© 2025 VL London. All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );
}
