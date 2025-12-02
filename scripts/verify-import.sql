-- ============================================
-- WooCommerce Import Verification Queries
-- ============================================

\echo ''
\echo '=========================================='
\echo '1. TOTAL PRODUCT COUNT'
\echo '=========================================='

SELECT COUNT(*) as total_products FROM products;

\echo ''
\echo '=========================================='
\echo '2. PRODUCTS BY BRAND'
\echo '=========================================='

SELECT
    b.name as brand_name,
    b.slug as brand_slug,
    COUNT(p.id) as product_count
FROM brands b
LEFT JOIN products p ON b.id = p.brand_id
GROUP BY b.id, b.name, b.slug
ORDER BY product_count DESC;

\echo ''
\echo '=========================================='
\echo '3. PRODUCTS WITH/WITHOUT IMAGES'
\echo '=========================================='

SELECT
    COUNT(DISTINCT p.id) as products_with_images
FROM products p
JOIN product_versions pv ON p.id = pv.product_id AND pv.is_current = true
JOIN product_images pi ON pv.id = pi.version_id;

SELECT
    COUNT(DISTINCT p.id) as products_without_images
FROM products p
JOIN product_versions pv ON p.id = pv.product_id AND pv.is_current = true
LEFT JOIN product_images pi ON pv.id = pi.version_id
WHERE pi.id IS NULL;

\echo ''
\echo '=========================================='
\echo '4. PRODUCTS BY WOOCOMMERCE TYPE'
\echo '=========================================='

SELECT
    pp.property_value as wc_product_type,
    COUNT(DISTINCT p.id) as count
FROM products p
JOIN product_versions pv ON p.id = pv.product_id AND pv.is_current = true
JOIN product_properties pp ON pv.id = pp.version_id
WHERE pp.property_key = 'wc_product_type'
GROUP BY pp.property_value
ORDER BY count DESC;

\echo ''
\echo '=========================================='
\echo '5. PRODUCTS WITH PARENT SKU (VARIATIONS)'
\echo '=========================================='

SELECT
    COUNT(DISTINCT p.id) as variation_count
FROM products p
JOIN product_versions pv ON p.id = pv.product_id AND pv.is_current = true
JOIN product_properties pp ON pv.id = pp.version_id
WHERE pp.property_key = 'parent_sku';

\echo ''
\echo '=========================================='
\echo '6. PRODUCTS WITH PRICING'
\echo '=========================================='

SELECT
    COUNT(DISTINCT p.id) as products_with_pricing
FROM products p
JOIN product_versions pv ON p.id = pv.product_id AND pv.is_current = true
JOIN pricing pr ON pv.id = pr.version_id;

\echo ''
\echo '=========================================='
\echo '7. PRODUCTS WITH SALE PRICES'
\echo '=========================================='

SELECT
    COUNT(DISTINCT p.id) as products_with_sale_price
FROM products p
JOIN product_versions pv ON p.id = pv.product_id AND pv.is_current = true
JOIN pricing pr ON pv.id = pr.version_id
WHERE pr.discount_price IS NOT NULL AND pr.discount_price > 0;

\echo ''
\echo '=========================================='
\echo '8. AUDIT LOG ENTRIES (WOOCOMMERCE IMPORT)'
\echo '=========================================='

SELECT
    action,
    COUNT(*) as count
FROM audit_log
WHERE performed_by = 'woocommerce_import_script'
GROUP BY action
ORDER BY count DESC;

\echo ''
\echo '=========================================='
\echo '9. PRODUCTS WITH SKU FIELD POPULATED'
\echo '=========================================='

SELECT
    COUNT(*) as products_with_sku
FROM products
WHERE sku IS NOT NULL;

\echo ''
\echo '=========================================='
\echo '10. SAMPLE PRODUCTS (First 5 from each brand)'
\echo '=========================================='

SELECT
    b.name as brand,
    p.product_code,
    p.sku,
    p.name,
    p.is_active
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE p.id IN (
    SELECT id FROM products
    WHERE brand_id = b.id
    ORDER BY created_at DESC
    LIMIT 5
)
ORDER BY b.name, p.created_at DESC
LIMIT 50;

\echo ''
\echo '=========================================='
\echo 'VERIFICATION COMPLETE'
\echo '=========================================='
\echo ''
