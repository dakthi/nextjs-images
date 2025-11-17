# VL London Product Management API - Complete Documentation

## Overview

The VL London Product Management API is a comprehensive REST API for managing product catalogs, brands, versions, pricing, and media. It provides full CRUD operations, version control with rollback capabilities, bulk import/export functionality, and integration with Cloudflare R2 storage.

## Quick Links

- **Interactive API Documentation**: `/api-docs` - Visit the Swagger UI for interactive exploration
- **OpenAPI Specification**: `/public/api-docs.json` - Machine-readable API schema
- **Admin Dashboard**: `/admin` - Product and brand management UI
- **Base URL**: `/api`

## Table of Contents

1. [Authentication](#authentication)
2. [Core Concepts](#core-concepts)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Usage Examples](#usage-examples)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [File Upload Guide](#file-upload-guide)
9. [CSV Import Guide](#csv-import-guide)
10. [Version Control](#version-control)

## Authentication

Currently, the API uses **header-based authentication** in development mode:

```bash
curl -X GET http://localhost:3000/api/products \
  -H "x-user-id: user123" \
  -H "x-user-role: admin"
```

### Available Roles

- `admin`: Full access to all endpoints
- `editor`: Can create and edit products
- `viewer`: Read-only access

**Note**: For production, implement proper JWT authentication or OAuth2.

## Core Concepts

### Products

Products are the main entity in the system. Each product has:
- Unique product code (required, immutable)
- Product name
- Brand association
- Active/inactive status
- Multiple versions with different content states

### Versions

Products support version control:
- Each product can have multiple versions
- Only one version is marked as "current"
- Versions track all changes (content, images, pricing, properties)
- Rollback creates a new version with previous content

### Brands

Brand grouping for products:
- Standalone entities
- Can have multiple products
- Support custom logos and descriptions

### Content

Flexible content system:
- Multiple content types (short_description, long_description, usage_instructions, ingredients)
- Support for multiple languages
- Per-version content management

### Images

Image management with positioning:
- Positions: topLeft, topRight, bottomLeft, center
- Display order control
- Optional labels
- Integration with Cloudflare R2

### Properties

Flexible key-value storage for custom attributes:
- Examples: category, scents, badgePosition, discountPercentage
- Per-version properties
- Support for comma-separated values

### Pricing

Tiered pricing system:
- Multiple price points per product version
- Size/SKU variation support
- Discount pricing
- Condition tracking (new, refurbished, used)
- Currency support

## API Endpoints

### Products

#### Get All Products
```
GET /products
```

**Parameters:**
- `limit` (integer, default: 100) - Number of products to return
- `offset` (integer, default: 0) - Pagination offset
- `active` (boolean) - Filter by active status
- `brandId` (string) - Filter by brand

**Response:**
```json
[
  {
    "id": "uuid",
    "code": "PROD001",
    "name": "Product Name",
    "slug": "product-name",
    "active": true,
    "brandId": "brand-uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get/Create/Update/Delete Products
```
GET /products/crud?id=PROD001
POST /products/crud
PUT /products/crud
DELETE /products/crud?id=PROD001
```

#### Search Products
```
GET /products/search?q=keyword&limit=20&offset=0
```

#### Clone Product
```
POST /products/clone
```

**Request Body:**
```json
{
  "sourceProductId": "uuid",
  "newProductCode": "NEWPROD001",
  "newProductName": "New Product Name"
}
```

### Brands

#### List All Brands
```
GET /brands/crud
```

#### Get Single Brand
```
GET /brands/crud?id=brand-uuid
```

#### Create Brand
```
POST /brands/crud
```

**Request Body:**
```json
{
  "name": "Brand Name",
  "slug": "brand-name",
  "description": "Brand description",
  "logoUrl": "https://..."
}
```

#### Update Brand
```
PUT /brands/crud
```

#### Delete Brand
```
DELETE /brands/crud?id=brand-uuid
```

### Product Images

#### Get Images
```
GET /product-images/crud?versionId=version-uuid
```

#### Add Image
```
POST /product-images/crud
```

**Request Body:**
```json
{
  "versionId": "uuid",
  "imageUrl": "https://...",
  "position": "topLeft",
  "label": "Product Image",
  "displayOrder": 1
}
```

#### Update Image
```
PUT /product-images/crud
```

#### Delete Image
```
DELETE /product-images/crud?id=image-uuid
```

### Product Content

#### Get Content
```
GET /product-content/crud?versionId=version-uuid
```

#### Add Content
```
POST /product-content/crud
```

**Request Body:**
```json
{
  "versionId": "uuid",
  "contentType": "short_description",
  "content": "Product description text",
  "language": "en"
}
```

Content types:
- `short_description` - Brief product description
- `long_description` - Detailed description
- `usage_instructions` - How to use
- `ingredients` - Product ingredients/materials

#### Update Content
```
PUT /product-content/crud
```

#### Delete Content
```
DELETE /product-content/crud?id=content-uuid
```

### Product Properties

#### Get Properties
```
GET /product-properties/crud?versionId=version-uuid
```

#### Add Property
```
POST /product-properties/crud
```

**Request Body:**
```json
{
  "versionId": "uuid",
  "key": "category",
  "value": "skincare"
}
```

Common properties:
- `category` - Product category
- `scents` - Comma-separated scent list
- `badgePosition` - Badge display position
- `discountPercentage` - Discount amount
- `promotionText` - Promotional text
- `tableTextSize` - Display text size

#### Update Property
```
PUT /product-properties/crud
```

#### Delete Property
```
DELETE /product-properties/crud?id=property-uuid
```

### Pricing

#### Get Pricing
```
GET /pricing/crud?versionId=version-uuid
```

#### Add Pricing
```
POST /pricing/crud
```

**Request Body:**
```json
{
  "versionId": "uuid",
  "size": "250ml",
  "price": 29.99,
  "discountPrice": 24.99,
  "condition": "new",
  "currency": "GBP",
  "displayOrder": 1
}
```

#### Update Pricing
```
PUT /pricing/crud
```

#### Delete Pricing
```
DELETE /pricing/crud?id=pricing-uuid
```

### Versions

#### List Product Versions
```
GET /products/versions?productCode=PROD001
```

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "code": "PROD001",
    "name": "Product Name"
  },
  "versions": [
    {
      "id": "version-uuid",
      "versionNumber": 1,
      "versionName": "Initial Release",
      "isCurrent": true,
      "description": "Version description",
      "createdAt": "2024-01-01T00:00:00Z",
      "contentsCount": 2,
      "imagesCount": 3,
      "propertiesCount": 5,
      "pricingCount": 2
    }
  ]
}
```

#### Compare Versions
```
GET /products/versions?productCode=PROD001&action=compare&v1=version-id-1&v2=version-id-2
```

#### Rollback Version
```
POST /products/versions
```

**Request Body:**
```json
{
  "productCode": "PROD001",
  "versionId": "previous-version-uuid"
}
```

### File Upload

#### Upload Images
```
POST /upload
```

**Form Data:**
- `file` (binary, required) - Image file (JPG, PNG, GIF, WebP, max 10MB)
- `folder` (string, optional) - R2 folder path (default: "product-images")
- `batch` (boolean, optional) - Set to true for batch upload

**Response:**
```json
{
  "success": true,
  "url": "https://vllondon.chartedconsultants.com/product-images/...",
  "filename": "1704067200000-image.jpg"
}
```

**Batch Upload Response:**
```json
{
  "success": true,
  "uploaded": 3,
  "failed": 0,
  "results": [
    {
      "success": true,
      "originalName": "image1.jpg",
      "filename": "1704067200000-image1.jpg",
      "url": "https://..."
    }
  ],
  "errors": []
}
```

### Bulk Import

#### Import CSV
```
POST /products/import
```

**CSV Format:**

Required columns: `Product Code`, `Product Name`

Optional columns:
- `Brand` - Brand name (creates if doesn't exist)
- `Category` - Product category
- `Description` - Product description
- `Price` - Product price
- `Size` - Product size
- `Scents` - Comma-separated scents
- `Active` - true/false (default: true)

**CSV Example:**
```csv
Product Code,Product Name,Brand,Category,Price,Scents,Active
PROD001,Rose Gel,Blazing Star,Skincare,29.99,"Rose, Vanilla",true
PROD002,Lavender Cream,Blazing Star,Skincare,39.99,Lavender,true
```

**Response:**
```json
{
  "total": 2,
  "success": 2,
  "failed": 0,
  "created": [
    {
      "code": "PROD001",
      "name": "Rose Gel"
    }
  ],
  "updated": [],
  "errors": []
}
```

### Export

#### Export Products
```
POST /export/info-pack
```

**Request Body:**
```json
{
  "productIds": ["PROD001", "PROD002"],
  "format": "zip",
  "includeImages": true,
  "includeProperties": true,
  "includePricing": true,
  "includeVersions": true
}
```

**Formats:**
- `json` - JSON format
- `csv` - CSV format
- `zip` - ZIP archive with all data

## Data Models

### Product
```typescript
{
  id: string;
  code: string; // Unique, immutable
  name: string;
  slug: string;
  active: boolean;
  brandId?: string;
  createdAt: Date;
  updatedAt: Date;
  versions: ProductVersion[];
}
```

### ProductVersion
```typescript
{
  id: string;
  productId: string;
  versionNumber: number;
  versionName?: string;
  description?: string;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
  contents: ProductContent[];
  images: ProductImage[];
  properties: ProductProperty[];
  pricing: Pricing[];
}
```

### Brand
```typescript
{
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
}
```

## Usage Examples

### Create a Complete Product

1. **Create the product:**
```bash
curl -X POST http://localhost:3000/api/products/crud \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -H "x-user-role: admin" \
  -d '{
    "code": "ROSE-GEL-001",
    "name": "Rose Healing Gel",
    "slug": "rose-healing-gel",
    "brandId": "brand-uuid",
    "active": true
  }'
```

2. **Upload product images:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@product-image.jpg" \
  -F "folder=product-images" \
  -H "x-user-id: user123"
```

3. **Add product content:**
```bash
curl -X POST http://localhost:3000/api/product-content/crud \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "versionId": "version-uuid",
    "contentType": "short_description",
    "content": "Premium rose healing gel with natural ingredients",
    "language": "en"
  }'
```

4. **Add product images:**
```bash
curl -X POST http://localhost:3000/api/product-images/crud \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "versionId": "version-uuid",
    "imageUrl": "https://vllondon.chartedconsultants.com/...",
    "position": "topLeft",
    "label": "Product Photo",
    "displayOrder": 1
  }'
```

5. **Add pricing:**
```bash
curl -X POST http://localhost:3000/api/pricing/crud \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "versionId": "version-uuid",
    "size": "250ml",
    "price": 29.99,
    "currency": "GBP",
    "condition": "new"
  }'
```

6. **Add properties:**
```bash
curl -X POST http://localhost:3000/api/product-properties/crud \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "versionId": "version-uuid",
    "key": "scents",
    "value": "Rose, Vanilla, Chamomile"
  }'
```

### Bulk Import Products

1. **Create CSV file** (`products.csv`):
```csv
Product Code,Product Name,Brand,Category,Price,Scents,Active
PROD001,Rose Gel,Blazing Star,Skincare,29.99,"Rose, Vanilla",true
PROD002,Lavender Cream,Blazing Star,Skincare,39.99,Lavender,true
PROD003,Mint Serum,Blazing Star,Skincare,34.99,Mint,true
```

2. **Upload CSV:**
```bash
curl -X POST http://localhost:3000/api/products/import \
  -F "file=@products.csv" \
  -H "x-user-id: user123"
```

### Compare and Rollback Versions

1. **Get versions:**
```bash
curl -X GET 'http://localhost:3000/api/products/versions?productCode=PROD001' \
  -H "x-user-id: user123"
```

2. **Compare versions:**
```bash
curl -X GET 'http://localhost:3000/api/products/versions?productCode=PROD001&action=compare&v1=version-id-1&v2=version-id-2' \
  -H "x-user-id: user123"
```

3. **Rollback to previous version:**
```bash
curl -X POST http://localhost:3000/api/products/versions \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "productCode": "PROD001",
    "versionId": "previous-version-uuid"
  }'
```

### Export Products

```bash
curl -X POST http://localhost:3000/api/export/info-pack \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "productIds": ["PROD001", "PROD002", "PROD003"],
    "format": "zip",
    "includeImages": true,
    "includeProperties": true,
    "includePricing": true,
    "includeVersions": false
  }' \
  --output products-export.zip
```

## Error Handling

### Error Response Format
```json
{
  "error": "Human-readable error message",
  "details": "Technical details (development only)"
}
```

### Common HTTP Status Codes

- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **207 Multi-Status**: Partial success in batch operations
- **400 Bad Request**: Invalid parameters or malformed request
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server-side error occurred

### Example Error Responses

**Invalid product code:**
```json
{
  "error": "Product not found"
}
```

**Failed file upload:**
```json
{
  "error": "File size too large. Maximum 10MB allowed."
}
```

**CSV import with errors:**
```json
{
  "total": 3,
  "success": 2,
  "failed": 1,
  "created": [...],
  "updated": [...],
  "errors": [
    {
      "row": 3,
      "error": "Missing product name (required field)"
    }
  ]
}
```

## Rate Limiting

- No strict rate limits implemented (development)
- For production, implement rate limiting middleware
- Default timeouts:
  - Regular requests: 2 minutes
  - File uploads: 1 minute
  - CSV import: 5 minutes

## File Upload Guide

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Constraints
- Maximum file size: 10MB
- Upload directory: Cloudflare R2 bucket
- Automatic retry: Up to 3 attempts with exponential backoff
- Cache control: 1 year public caching

### Upload Process

1. **Client validation** - File type and size checked
2. **Generate unique filename** - Timestamp + UUID + original name
3. **Upload to R2** - With retry logic
4. **Return public URL** - Ready to use immediately

### Error Handling

- Invalid file type: Returns 400 with specific error
- File too large: Returns 400 with size information
- R2 connection failed: Returns 500 with connection details
- Credentials missing: Logged at startup

## CSV Import Guide

### Column Requirements

**Required:**
- `Product Code` - Unique identifier
- `Product Name` - Product display name

**Optional:**
- `Brand` - Brand name (auto-creates if doesn't exist)
- `Category` - Product category string
- `Description` - Product description text
- `Price` - Numeric price value
- `Size` - Product size/SKU
- `Scents` - Comma-separated scent list
- `Active` - true/false (defaults to true)

### CSV Processing

1. **Row validation** - Each row checked for required fields
2. **Brand resolution** - Finds or creates brand
3. **Product creation/update** - Creates new or updates existing
4. **Version management** - Creates initial version with content
5. **Property/pricing assignment** - Adds provided attributes

### Error Handling

- Missing required fields: Row skipped, error recorded
- Invalid data types: Logged and skipped
- Partial success: Returns 207 with detailed error list
- Complete failure: Returns 400 with summary

### Example with Headers

```csv
Product Code,Product Name,Brand,Category,Description,Price,Size,Scents,Active
BZ-ROSE-001,Rose Healing Gel,Blazing Star,Skincare,Premium rose gel,29.99,250ml,"Rose, Vanilla",true
BZ-LAV-002,Lavender Cream,Blazing Star,Skincare,Soothing lavender cream,39.99,200ml,Lavender,true
BZ-MINT-003,Mint Serum,Blazing Star,Skincare,Cooling mint serum,34.99,100ml,Mint,true
```

## Version Control

### How Versions Work

1. Each product has multiple versions
2. Only one version is marked as "current"
3. Creating new content automatically creates new version
4. Previous versions are preserved for history/rollback

### Version Rollback

When rolling back:
1. Current version is marked as inactive
2. New version is created with number = max + 1
3. Content copied from source version
4. New version marked as current
5. Original version preserved in history

### Version Metadata

- `versionNumber` - Sequential version identifier
- `versionName` - Optional custom name
- `isCurrent` - Whether this is the active version
- `description` - Changelog/notes
- `createdAt` - When version was created
- `updatedAt` - Last modification time

## Support & Troubleshooting

### Common Issues

**"Product not found"**
- Verify product code exists
- Check code is case-sensitive

**"File upload failed"**
- Ensure file is valid image format
- Check file size is under 10MB
- Verify R2 credentials are configured

**"CSV import failed"**
- Validate CSV formatting
- Check required columns are present
- Ensure product codes are unique

**"R2 credentials missing"**
- Check all R2_* environment variables
- Verify values in .env file
- Restart development server

### Debug Tips

1. Check server logs for detailed error messages
2. Use Swagger UI at `/api-docs` to test endpoints
3. Verify authentication headers in requests
4. Enable detailed logging in development mode
5. Check network tab in browser for response bodies

## Environment Setup

### Required Environment Variables

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com/
R2_BUCKET_NAME=bucket-name
R2_PUBLIC_URL=https://your-public-url.com
R2_REGION=auto
```

### Setup Instructions

1. Install dependencies: `npm install`
2. Configure `.env` file with all variables
3. Run database migrations: `npx prisma migrate deploy`
4. Start development server: `npm run dev`
5. Access API docs at `http://localhost:3000/api-docs`

---

**Last Updated**: 2024
**API Version**: 1.0.0
**Status**: Production Ready (with proper authentication configuration)
