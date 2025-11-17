# VL London Product Catalog System - Design Document

## Overview

This is a **dynamic product catalog system** designed for the VL London marketing team. It enables rapid access to product information, batch exports of product data, and templated visual content generation for sales and marketing materials.

**Key Philosophy**: Over-engineered for scale with flexible, reusable properties. Not an e-commerce system—purely for internal marketing operations.

---

## System Purpose

The primary functions are:

1. **Information Pack Downloads** - Marketing team can quickly download comprehensive product information at any granularity (single product, product line, entire brand)
2. **Template-Based Batch Exports** - Use HTML templates with placeholders to automatically generate sales images and marketing materials for multiple products
3. **Version History Tracking** - Track product changes over time (formula updates, color changes, reformulations, etc.)
4. **Change Auditing** - Complete audit trail of all uploads, downloads, edits, and modifications

---

## Data Model

### Core Entities

#### 1. **Brands**
Master list of brands in the system.

**Current Brands:**
- Blazing Star
- Burberry (Burb)
- M Berry (MBerry)

**Fields:**
- ID (UUID)
- Name (unique)
- Slug (URL-friendly)
- Description
- Logo URL (R2)
- Timestamps (created, updated)

**Purpose:** Organizational hierarchy and information packaging.

---

#### 2. **Products**
Individual product records within brands.

**Fields:**
- ID (UUID) - Used as SKU/Product Code for now (can use explicit product code field later)
- Brand ID (foreign key)
- Name
- Slug
- Active/Inactive status
- Timestamps (created, updated)

**Purpose:** Represent individual products (e.g., "Color 729 - Blazing Star Acrylic Powder")

**Note:** No inventory/stock tracking—purely catalog information.

---

#### 3. **Product Versions**
Track product changes over time. Enables marketing to maintain history of product updates.

**Fields:**
- ID (UUID)
- Product ID (foreign key)
- Version Number (sequential)
- Version Name (optional—e.g., "Q4 2024 Formula Update")
- Is Current (boolean—only one active version per product)
- Description (change summary)
- Created By (user/system identifier)
- Timestamps (created)

**Purpose:**
- Maintain history of product changes (formula updates, color shifts, etc.)
- Enable rollback to previous product information
- Audit trail for product evolution

**Example:**
- Color 729 v1: Original acrylic formula
- Color 729 v2: Updated pigment blend (formula changed)
- Color 729 v3: Current - Reformulated to match market standards

---

#### 4. **Product Content**
Multiple descriptions and content variants for each product version.

**Fields:**
- ID (UUID)
- Version ID (foreign key)
- Content Type (e.g., "short_description", "long_description", "ingredients", "usage_instructions", "seo_meta", "marketing_copy")
- Content (text/rich text)
- Language (e.g., "en", "fr"—default: "en")
- Timestamps (created)

**Purpose:**
- Store multiple description types for flexible marketing use
- Support multilingual descriptions (future-ready)
- Reusable across templates and exports

**Flexible Design Note:** Content types are not enum-limited—new types can be added without schema changes.

---

#### 5. **Product Images**
All images associated with a product version. Images are stored in R2, system tracks URLs and metadata.

**Fields:**
- ID (UUID)
- Version ID (foreign key)
- Image URL (R2 storage path)
- Image Type (e.g., "product_shot", "swatch", "lifestyle", "packaging", "angle_1", "angle_2", etc.)
- Position (e.g., "front", "back", "left", "right"—optional)
- Display Order (determines order in templates/exports)
- Alt Text (for accessibility)
- Label (human-readable identifier)
- Timestamps (created)

**Purpose:**
- Reference product images stored in R2
- Organize multiple images per product with metadata
- Enable template placeholders to pull specific image types

**Important:** Images are stored in R2, not the database. Database only tracks references and metadata.

---

#### 6. **Product Properties**
Flexible key-value storage for product attributes. Designed to be reusable across products and avoid over-specificity.

**Fields:**
- ID (UUID)
- Version ID (foreign key)
- Property Key (e.g., "color", "shade", "finish", "size", "volume", "coverage", "texture")
- Property Value (e.g., "Blazing Red #729", "10ml", "Gel Polish")
- Display Order (sequence in information packs)
- Timestamps (created)

**Purpose:**
- Store flexible, reusable product attributes
- Enable broad properties that work across product categories
- Avoid schema bloat from product-specific fields
- Easily filterable and searchable for marketing queries

**Reusability Examples:**
- "color" → used for nail polish, gel, acrylic powders
- "shade" → used for cosmetics, powders
- "finish" → used for multiple product lines
- "volume" → standard across liquid products
- "coverage" → relevant to paints, powders, gels

**Note:** Properties are **not** for inventory/variants—purely descriptive attributes.

---

#### 7. **Pricing**
Pricing information with discount support.

**Fields:**
- ID (UUID)
- Version ID (foreign key)
- Size (e.g., "10ml", "15ml", "full size", "sample")
- Price (decimal, max 2 places)
- Currency (default: "GBP")
- Condition (optional—e.g., "wholesale", "retail", "promotion")
- Discount Price (optional)
- Discount Label (optional—e.g., "Spring Sale 20% Off")
- Display Order (sequence in exports)
- Timestamps (created)

**Purpose:**
- Track pricing per product size variant
- Support discount information for marketing materials
- Flexible enough for future discount management needs

**Note:** No complex discount management logic currently—straightforward fields for when promotions run.

---

#### 8. **Shared Images**
Reusable images across multiple products. Prevents duplication and enables tracking image usage.

**Fields:**
- ID (UUID)
- Image URL (R2—unique)
- Image Type (e.g., "backdrop", "lifestyle", "model", "group_shot")
- Tags (array—e.g., ["professional", "outdoor", "packaging"])
- Used Count (tracks usage frequency)
- Timestamps (created)

**Purpose:**
- Store images used across multiple products
- Track image reusability
- Enable efficient R2 storage management

**Example:** A professional backdrop photo used in 15 product marketing images.

---

#### 9. **Image Usage**
Many-to-many relationship linking shared images to product versions.

**Fields:**
- ID (UUID)
- Shared Image ID (foreign key)
- Version ID (foreign key)
- Position (optional—e.g., "background", "foreground")
- Timestamps (created)

**Purpose:**
- Map shared images to specific product versions
- Track which products use which shared images
- Enable image replacement across multiple products

---

#### 10. **Sales Templates**
HTML templates used to batch-generate marketing materials.

**Fields:**
- ID (UUID)
- Name (e.g., "Instagram Post Template", "Sales Card Design")
- Description
- Template Config (JSON—stores template configuration/metadata)
- HTML Template (text—stores HTML with placeholders)
- Preview URL (R2 or public URL—preview of rendered template)
- Is Active (boolean)
- Timestamps (created, updated)

**Purpose:**
- Store reusable HTML templates with placeholders
- Support batch rendering across multiple products
- Enable template versioning and management

**Placeholder System:**
Templates use dynamic placeholders like:
```html
<div class="product-name">{{product.name}}</div>
<div class="product-description">{{product.content.short_description}}</div>
<div class="product-price">{{product.pricing[0].price}}</div>
<img src="{{product.images[0].url}}" alt="{{product.images[0].altText}}">
<div class="custom-property">{{product.properties.color}}</div>
```

---

#### 11. **Template Renders**
Batch export history—tracks when templates are rendered against product sets.

**Fields:**
- ID (UUID)
- Template ID (foreign key)
- Product IDs (array—list of products rendered)
- Render Config (JSON—configuration used for this render)
- Output Format (e.g., "pdf", "png", "jpg", "html", "zip")
- Output URL (R2—location of rendered output)
- Status (e.g., "pending", "processing", "completed", "failed")
- Created By (user identifier)
- Timestamps (created)

**Purpose:**
- Track all template render operations
- Enable re-rendering with same configuration
- Generate information packs on demand
- Link to audit logs for compliance

**Example Workflow:**
1. Marketing team selects "All Blazing Star Products"
2. Selects "Sales Card Template"
3. System renders 47 product cards as PNG images
4. Exports as ZIP file
5. Record created in TemplateRenders with product list, config, output URL, status

---

#### 12. **Audit Log**
Complete change tracking across all entities.

**Fields:**
- ID (UUID)
- Entity Type (e.g., "Product", "ProductVersion", "ProductImage", "TemplateRender")
- Entity ID (ID of changed record)
- Action (e.g., "CREATE", "UPDATE", "DELETE", "EXPORT", "DOWNLOAD")
- Changes (JSON—before/after values for updates)
- Performed By (user identifier)
- IP Address (optional—for security tracking)
- Timestamps (created)

**Purpose:**
- Complete audit trail of all system changes
- Track uploads, downloads, edits, deletions
- Compliance and accountability
- Debug problematic changes

**Example Actions:**
- `CREATE` - New product or version added
- `UPDATE` - Product content, images, or properties changed
- `DELETE` - Product or version removed
- `EXPORT` - Template rendered/exported
- `DOWNLOAD` - Information pack downloaded

---

## Key Design Decisions

### 1. **Flexible Properties Over Specific Fields**
Instead of `acrylic_finish`, `gel_shade`, `polish_color`—use a single `ProductProperty` model with reusable keys. This:
- Avoids schema bloat
- Enables new product types without migrations
- Remains queryable and indexed

### 2. **Image URL References, Not Uploads**
Database stores R2 URLs and metadata only. Images are stored externally:
- Reduces database size
- Leverages R2 CDN for delivery
- Simplifies backup/restore

### 3. **Version History on Products**
Each product version is immutable once created:
- Tracks historical changes
- Enables rollback if needed
- Supports audit requirements
- One version marked as "current" for active use

### 4. **Batch Export Ready**
Template + TemplateRender models support:
- Dynamic placeholder replacement
- Batch processing across product sets
- Export history tracking
- Flexible output formats (PNG, PDF, HTML, ZIP)

### 5. **Image Sharing**
SharedImage + ImageUsage enables:
- Efficient storage (one image, many products)
- Usage tracking
- Cross-product updates (replace image in multiple products atomically)

### 6. **No Inventory/Stock**
Pure catalog system—no stock levels, inventory management, or reservation logic.

### 7. **Simple User Model**
Only "Created By" fields track user actions. No user roles/permissions in DB:
- Marketing team has single access level
- Single admin account required
- Audit logs capture who did what

---

## Query Patterns & Use Cases

### Use Case 1: Download Product Information Pack
```
1. User selects product(s) by Brand, Product, or filtered criteria
2. System queries Product → ProductVersion (current) → ProductContent, ProductImage, ProductProperty, Pricing
3. Compile into JSON/CSV export
4. Record in AuditLog: action=DOWNLOAD
```

### Use Case 2: Batch Export with Template
```
1. User selects template and product set (e.g., all Blazing Star products)
2. System queries each product's current version data
3. Renders HTML template with placeholders replaced
4. Exports images to R2 as PNG/JPG/PDF
5. Creates ZIP file with all exports
6. Record in TemplateRender: status=completed, output_url=R2 path
7. Record in AuditLog: action=EXPORT
```

### Use Case 3: Update Product Information
```
1. User edits product content/images/properties
2. System creates new ProductVersion (increments version_number, sets is_current=true)
3. Updates ProductContent, ProductImage, ProductProperty records
4. Old version(s) remain with is_current=false
5. Records in AuditLog: action=UPDATE, changes={before/after values}
```

### Use Case 4: Track Formula Changes
```
1. Color 729 formula updated by supplier
2. New ProductVersion created for Color 729
3. Version description: "Updated acrylic formula - new pigment blend"
4. New ProductProperty entries reflect updated specs
5. History preserved: old version still queryable
```

### Use Case 5: Audit Trail
```
1. Track all changes: CREATE, UPDATE, DELETE, EXPORT, DOWNLOAD
2. Query by entity type, date range, or user
3. See complete before/after for updates
4. Accountability and compliance
```

---

## Technology Stack

- **Database:** PostgreSQL (configured)
- **ORM:** Prisma (v6.19.0)
- **Storage:** Cloudflare R2
- **API:** Next.js (app router)
- **Export Formats:** PNG, JPG, PDF, HTML, CSV, JSON, ZIP

---

## Future Extensibility

The design supports future additions without major refactoring:

1. **Multi-language support** - ProductContent already has language field
2. **Product categories/filtering** - Can add Category model linked to Products
3. **Advanced discounts** - Pricing model supports discount logic
4. **User permissions** - Can add User/Role models linked to AuditLog
5. **Product variants** - Can extend ProductProperty or create Variant model
6. **Additional export formats** - TemplateRender.outputFormat supports any format
7. **Workflow approvals** - Can add status fields to ProductVersion

---

## Current Scope Exclusions

- **E-commerce:** No shopping cart, orders, or customer accounts
- **Inventory:** No stock levels, warehouse management, or reservations
- **Customer Features:** No reviews, ratings, or customer-facing portal
- **Complex Discounts:** Basic discount fields only; no tiered/percentage logic
- **User Management:** Single admin account; no role-based access control

---

## Summary

This is a **purpose-built internal marketing catalog system**. It's over-engineered for flexibility and scale while remaining simple for the core use case: enabling the marketing team to rapidly package and export product information in various formats.

The version history, shared images, and audit logging provide comprehensive tracking without unnecessary complexity for e-commerce concerns.
