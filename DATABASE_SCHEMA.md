# VL London Database Schema - Prisma

## Overview
Comprehensive PostgreSQL schema for VL London's dynamic product catalog system. Designed for:
- Version control of products (track formula/color changes)
- Multi-brand organization
- Flexible properties (color, scent, size, etc.)
- Template-based batch exports
- Complete audit trail

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// BRANDS
// ============================================
model Brand {
  id          String    @id @default(uuid())
  name        String    @unique
  slug        String    @unique
  description String?
  logoUrl     String?   @map("logo_url")
  products    Product[]
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@map("brands")
}

// ============================================
// PRODUCTS
// ============================================
model Product {
  id          String           @id @default(uuid())
  brandId     String           @map("brand_id")
  brand       Brand            @relation(fields: [brandId], references: [id])
  productCode String           @unique @map("product_code")
  name        String
  slug        String           @unique
  isActive    Boolean          @default(true) @map("is_active")
  versions    ProductVersion[]
  createdAt   DateTime         @default(now()) @map("created_at")
  updatedAt   DateTime         @updatedAt @map("updated_at")

  @@index([brandId])
  @@index([productCode])
  @@index([isActive])
  @@map("products")
}

// ============================================
// PRODUCT VERSIONS (for tracking changes)
// ============================================
model ProductVersion {
  id            String            @id @default(uuid())
  productId     String            @map("product_id")
  product       Product           @relation(fields: [productId], references: [id], onDelete: Cascade)
  versionNumber Int               @map("version_number")
  versionName   String?           @map("version_name")
  isCurrent     Boolean           @default(true) @map("is_current")
  description   String?
  createdBy     String            @map("created_by")
  createdAt     DateTime          @default(now()) @map("created_at")

  contents      ProductContent[]
  images        ProductImage[]
  properties    ProductProperty[]
  pricing       Pricing[]
  imageUsage    ImageUsage[]

  @@index([productId])
  @@index([isCurrent])
  @@map("product_versions")
}

// ============================================
// PRODUCT CONTENT (multiple descriptions)
// ============================================
model ProductContent {
  id          String         @id @default(uuid())
  versionId   String         @map("version_id")
  version     ProductVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  contentType String         @map("content_type") // "short_description", "full_description", "marketing_copy", "technical_specs"
  content     String         @db.Text
  language    String         @default("en")
  createdAt   DateTime       @default(now()) @map("created_at")

  @@index([versionId])
  @@index([contentType])
  @@map("product_content")
}

// ============================================
// PRODUCT IMAGES
// ============================================
model ProductImage {
  id           String         @id @default(uuid())
  versionId    String         @map("version_id")
  version      ProductVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  imageUrl     String         @map("image_url")
  imageType    String         @map("image_type") // "product", "swatch", "lifestyle", "marketing"
  position     String?        // "topLeft", "topRight", "bottomLeft"
  displayOrder Int            @default(0) @map("display_order")
  altText      String?        @map("alt_text")
  label        String?        // e.g., "Natural Pink", "Light Taupe"
  createdAt    DateTime       @default(now()) @map("created_at")

  @@index([versionId])
  @@index([imageType])
  @@map("product_images")
}

// ============================================
// PRODUCT PROPERTIES (flexible key-value)
// ============================================
model ProductProperty {
  id            String         @id @default(uuid())
  versionId     String         @map("version_id")
  version       ProductVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  propertyKey   String         @map("property_key") // "color", "scent", "finish", "size", "texture"
  propertyValue String         @map("property_value")
  displayOrder  Int            @default(0) @map("display_order")
  createdAt     DateTime       @default(now()) @map("created_at")

  @@index([versionId])
  @@index([propertyKey])
  @@map("product_properties")
}

// ============================================
// PRICING
// ============================================
model Pricing {
  id            String         @id @default(uuid())
  versionId     String         @map("version_id")
  version       ProductVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  size          String
  price         Decimal        @db.Decimal(10, 2)
  currency      String         @default("GBP")
  condition     String?        // "Buy 3+", "Buy 6+"
  discountPrice Decimal?       @map("discount_price") @db.Decimal(10, 2)
  discountLabel String?        @map("discount_label")
  displayOrder  Int            @default(0) @map("display_order")
  createdAt     DateTime       @default(now()) @map("created_at")

  @@index([versionId])
  @@map("pricing")
}

// ============================================
// SALES TEMPLATES (for rendering cards)
// ============================================
model SalesTemplate {
  id             String           @id @default(uuid())
  name           String
  description    String?
  templateConfig Json             @map("template_config") // JSON structure with placeholders
  htmlTemplate   String?          @map("html_template") @db.Text
  previewUrl     String?          @map("preview_url")
  isActive       Boolean          @default(true) @map("is_active")
  renders        TemplateRender[]
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @updatedAt @map("updated_at")

  @@map("sales_templates")
}

// ============================================
// TEMPLATE RENDERS (export history)
// ============================================
model TemplateRender {
  id           String        @id @default(uuid())
  templateId   String        @map("template_id")
  template     SalesTemplate @relation(fields: [templateId], references: [id])
  productIds   String[]      @map("product_ids") // Array of product IDs
  renderConfig Json          @map("render_config")
  outputFormat String        @map("output_format") // "png", "jpg", "pdf", "zip"
  outputUrl    String?       @map("output_url")
  status       String        @default("pending") // "pending", "processing", "completed", "failed"
  createdBy    String        @map("created_by")
  createdAt    DateTime      @default(now()) @map("created_at")

  @@index([templateId])
  @@index([status])
  @@map("template_renders")
}

// ============================================
// SHARED IMAGES (images used by multiple products)
// ============================================
model SharedImage {
  id         String       @id @default(uuid())
  imageUrl   String       @unique @map("image_url")
  imageType  String       @map("image_type")
  tags       String[]
  usedCount  Int          @default(0) @map("used_count")
  imageUsage ImageUsage[]
  createdAt  DateTime     @default(now()) @map("created_at")

  @@index([imageType])
  @@map("shared_images")
}

// ============================================
// IMAGE USAGE (many-to-many: shared images <-> product versions)
// ============================================
model ImageUsage {
  id            String         @id @default(uuid())
  sharedImageId String         @map("shared_image_id")
  sharedImage   SharedImage    @relation(fields: [sharedImageId], references: [id])
  versionId     String         @map("version_id")
  version       ProductVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  position      String?
  createdAt     DateTime       @default(now()) @map("created_at")

  @@index([sharedImageId])
  @@index([versionId])
  @@map("image_usage")
}

// ============================================
// AUDIT LOG (track all changes)
// ============================================
model AuditLog {
  id           String   @id @default(uuid())
  entityType   String   @map("entity_type") // "product", "brand", "template"
  entityId     String   @map("entity_id")
  action       String   // "create", "update", "delete", "export", "download"
  changes      Json?    // Old/new values
  performedBy  String   @map("performed_by")
  ipAddress    String?  @map("ip_address")
  createdAt    DateTime @default(now()) @map("created_at")

  @@index([entityType])
  @@index([entityId])
  @@index([createdAt])
  @@map("audit_log")
}
```

## Design Decisions

### 1. Version Control
- Every product change creates a new version (versionNumber auto-increments)
- Only one version is marked as `isCurrent = true`
- Old versions remain accessible for audit/history
- Useful for tracking formula/color changes over time

### 2. Flexible Properties
- `ProductProperty` uses key-value pairs (propertyKey → propertyValue)
- No need to predefined columns for color, scent, size, etc.
- New property types can be added without schema changes
- Examples: "color" → "Natural Pink", "scent" → "Mango", "size" → "23oz"

### 3. Multiple Content Types
- Products can have multiple descriptions (short, full, marketing, technical)
- Language support built-in for future internationalization
- Different teams can manage different content types

### 4. Image Management
- `ProductImage`: Direct images linked to versions
- `SharedImage`: Images that can be reused across products (many-to-many through ImageUsage)
- All images stored on R2, only URLs in database

### 5. Template System
- `SalesTemplate`: Stores template configuration as JSON
- `TemplateRender`: Tracks every export/batch render
- Complete history of what was exported and when

### 6. Audit Trail
- `AuditLog`: Every action logged (create, update, delete, export, download)
- Tracks who performed action, when, what changed
- Invaluable for accountability and debugging

### 7. Scalability
- UUID primary keys for distributed systems
- JSONB for flexible data structures
- Array fields for tags/lists
- Strategic indexes for query performance

## Relationships

```
Brand
  ├── Product (1:many)
      └── ProductVersion (1:many)
          ├── ProductContent (1:many)
          ├── ProductImage (1:many)
          ├── ProductProperty (1:many)
          ├── Pricing (1:many)
          └── ImageUsage (1:many)
              └── SharedImage (many:1)

SalesTemplate
  └── TemplateRender (1:many)
```

## Key Tables Summary

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **brands** | Organize products by brand | name, slug |
| **products** | Core product info | productCode, name, isActive |
| **product_versions** | Track version history | versionNumber, isCurrent, createdBy |
| **product_content** | Multiple descriptions | contentType, content, language |
| **product_images** | Product images in R2 | imageUrl, imageType, position |
| **product_properties** | Flexible attributes | propertyKey, propertyValue |
| **pricing** | Price by size/condition | size, price, discountPrice |
| **sales_templates** | Export templates | templateConfig (JSON) |
| **template_renders** | Export history | status, outputFormat, productIds |
| **shared_images** | Reusable images | imageUrl, usedCount |
| **image_usage** | Image <-> product mapping | sharedImageId, versionId |
| **audit_log** | Complete change history | entityType, action, changes |

## Next Steps

1. Initialize Prisma in project
2. Create migration from this schema
3. Migrate existing JSON data
4. Create API routes for CRUD operations
5. Update frontend to use API
6. Add admin UI for product management
