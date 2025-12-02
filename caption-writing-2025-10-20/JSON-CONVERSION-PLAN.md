# JSON Conversion Plan for README Files

## Objective
Convert all brand README files to structured JSON format to serve as:
- Foundation for RAG (Retrieval Augmented Generation) system
- Structured data for automated caption generation
- Consistent product database for future integrations
- Easy semantic search and filtering

---

## Phase 1: Core Product Categories (Priority 1)
These are actively used for caption writing and have concrete product data.

### 1.1 Brushes (✅ DONE)
- **File:** `brands/blazingstar/sculpting-system/brushes/README.json`
- **Status:** Complete with 3 brush types (Standard, Premium Plus, Premium Pro)
- **Structure:** Bilingual (EN/VI), comparison table, benefits, care instructions

### 1.2 Gel Polish - Original
- **File:** `brands/blazingstar/polish-colours/gel-polish/README.json`
- **Source MD:** Existing README
- **Key Info:** 362 colors, Made in UK, core features (thin, flowing, durable)
- **Data to Include:** Color palettes, application guide, sizing options

### 1.3 Gel Polish - Revive
- **File:** `brands/blazingstar/polish-colours/gel-polish/revive/README.json`
- **Source MD:** Existing README
- **Key Info:** TPO/HEMA-free, 72 colors, new line
- **Data to Include:** Product positioning, features, target audience

### 1.4 Protective Gloves
- **File:** `brands/blazingstar/nail-essentials/gloves/README.json`
- **Source MD:** Existing README
- **Key Info:** 2 types (Latex Protect+, Nitrile), powder-free, UKCA certified
- **Data to Include:** Material comparison, sizing, use cases (allergy considerations)

### 1.5 Acrylic Liquid
- **File:** `brands/blazingstar/sculpting-system/liquids/README.json`
- **Source MD:** Existing README (if available)
- **Key Info:** Multiple types (Purple, Clear, EMA, Winter variants), viscosity options
- **Data to Include:** Liquid types, curing speeds, scent options, applications

### 1.6 Acrylic Powder - Maxx Perform
- **File:** `brands/blazingstar/sculpting-system/acrylic-powder/README.json`
- **Source MD:** Existing README (if available)
- **Key Info:** 3-speed system (Fast/Medium/Slow), seasonal variants
- **Data to Include:** Speed specs, seasonal recommendations, color/texture options

---

## Phase 2: Supporting Product Categories (Priority 2)
Related products that complement caption writing.

### 2.1 Builder Gel
- **Files:**
  - `brands/blazingstar/polish-colours/builder-gel/README.json`
  - `brands/blazingstar/polish-colours/builder-gel/flexibuild/README.json`
  - `brands/blazingstar/polish-colours/builder-gel/strongbuild/README.json`

### 2.2 Top Coats
- **Files:**
  - `brands/blazingstar/polish-colours/top-coats/README.json`
  - `brands/blazingstar/polish-colours/top-coats/durashine/README.json`

### 2.3 Base Coats
- **File:** `brands/blazingstar/polish-colours/base-coats/README.json`

### 2.4 Nail Tips
- **File:** `brands/blazingstar/sculpting-system/tips/README.json`

---

## Phase 3: Brand & Reference (Priority 3)
High-level brand information and guidelines.

### 3.1 Main Brand Hub
- **File:** `brands/blazingstar/README.json`
- **Key Info:** Brand positioning, values, voice, channels, story

### 3.2 Polish Collections
- **File:** `brands/blazingstar/polish-colours/README.json`
- **File:** `brands/blazingstar/polish-colours/gel-polish/old-money/README.json`

### 3.3 Salon/Spa Equipment
- **Files:**
  - `brands/blazingstar/nail-essentials/lamps/README.json`
  - `brands/blazingstar/nail-essentials/e-file/README.json`
  - `brands/blazingstar/furniture/README.json`
  - `brands/blazingstar/spa/README.json`

---

## JSON Structure Standard

### Base Template (All Products)
```json
{
  "product": {
    "brand": "BlazingStar",
    "category": "",
    "vietnameseName": "",
    "overview": {
      "english": "",
      "vietnamese": ""
    },
    "keyFeatures": [],
    "variants": [],
    "benefits": [],
    "applications": [],
    "relatedProducts": [],
    "careInstructions": {},
    "comparisonTable": {},
    "tags": []
  }
}
```

### Bilingual Requirements
- **All descriptions:** English + Vietnamese side-by-side
- **All product names:** English + Vietnamese
- **All feature lists:** English + Vietnamese

### Data Points to Capture
1. **Product Info**
   - Brand, category, name (EN/VI)
   - Product type, variants
   - Material, origin (if relevant)

2. **Features & Benefits**
   - Core characteristics
   - Unique selling points
   - Comparison with alternatives

3. **Usage & Application**
   - Best for (use cases)
   - Techniques/methods
   - Step-by-step instructions (if applicable)

4. **Care & Maintenance**
   - Initial setup
   - Daily care
   - Storage
   - Cleaning methods

5. **Relationships**
   - Works with (compatible products)
   - Similar products (comparison)
   - Product ecosystems

6. **Tags for RAG**
   - Season (summer, winter, seasonal)
   - Technique (patting, dragging, smoothing)
   - Skill level (beginner, intermediate, advanced)
   - Use case (professional, home, salon)

---

## Conversion Process

### For Each README File:

1. **Extract Key Sections**
   - Overview/Introduction
   - Product variants/types
   - Features & characteristics
   - Benefits
   - Instructions/techniques
   - Care & maintenance
   - Comparisons

2. **Translate Missing Content**
   - Ensure all descriptions have EN/VI versions
   - Add clear, concise translations

3. **Structure Data**
   - Use consistent JSON schema
   - Create comparison tables where relevant
   - Add tags for semantic search

4. **Validate Structure**
   - Ensure all required fields present
   - Check bilingual consistency
   - Verify cross-references to other products

---

## Timeline & Resource Allocation

**Phase 1 (Core - HIGH PRIORITY)**
- Brushes: ✅ Done
- Gel Polish (Original + Revive): ~2 hours
- Gloves: ~1.5 hours
- Acrylic Liquid: ~1.5 hours
- Acrylic Powder: ~1.5 hours
**Total Phase 1:** ~6.5 hours

**Phase 2 (Supporting - MEDIUM PRIORITY)**
- Builder Gel: ~1.5 hours
- Top Coats & Base Coats: ~2 hours
- Tips: ~0.5 hours
**Total Phase 2:** ~4 hours

**Phase 3 (Reference - LOW PRIORITY)**
- Main brand README: ~1 hour
- Collections & Collections: ~1 hour
- Equipment & Spa: ~2 hours
**Total Phase 3:** ~4 hours

**GRAND TOTAL:** ~14.5 hours

---

## Benefits of This Approach

✅ **RAG Foundation**
- Structured data perfect for semantic search
- Bilingual support for broader querying
- Tagged content for filtering

✅ **Automated Caption Generation**
- Extract product details programmatically
- Pre-populated templates with verified data
- Consistency across all captions

✅ **Future Integrations**
- API-ready format
- Database import capability
- Multi-platform compatibility

✅ **Maintainability**
- Single source of truth
- Easy updates across all channels
- Version control friendly

---

## Recommended Execution Order

1. **Start with Phase 1** (core products actively used for captions)
2. **Then Phase 2** (supporting products referenced in captions)
3. **Finally Phase 3** (brand positioning & reference material)

This ensures the most impactful data is available first for RAG training.

---

## Success Metrics

- [ ] All Phase 1 files converted to JSON
- [ ] Bilingual consistency verified
- [ ] Comparison tables created where relevant
- [ ] Tags applied for semantic search
- [ ] Cross-references checked
- [ ] Ready for RAG integration
