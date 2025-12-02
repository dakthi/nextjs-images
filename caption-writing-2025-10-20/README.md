# Caption Writing System

A multi-brand caption-writing workspace for VLDirect and VLLondon beauty product lines.

## Overview

This system helps LLMs (or humans) write on-brand social media captions using structured brand knowledge bases and consistent templates.

**Supported Stores:**
- **VLDirect** (vldirect.uk) - BlazingStar, MBerry, BoldBerry, Pastel
- **VLLondon** (vllondon.uk) - Configurable for additional brand lines

## Folder Structure

```
/
├── README.md                    # This file
├── fx200-blazingstar.md        # Product-specific content
│
├── docs/                       # Instructions & writing guides
│   ├── CAPTION-INSTRUCTIONS.md # Main guide with examples
│   ├── WRITE-CAPTIONS.md       # Writing methodology
│   └── captions-supplies-that-make-sense.md
│
├── brands/                     # Brand knowledge bases
│   ├── blazingstar/           # Polish, sculpting, essentials, spa
│   ├── boldberry/             # Dip ombre, gel polish, jelly
│   ├── mberry/                # Gel polish, seasonal collections
│   └── pastel/                # Coquette, french-tip, princess
│
├── captions/                   # Output - generated captions
│   ├── brand/                 # Brand-wide assets (footers, templates)
│   ├── products/              # Product-specific captions
│   ├── systems/               # System-level captions
│   ├── sets/                  # Themed sets (e.g., Supplies That Make Sense)
│   └── index.md               # Global caption index
│
├── project/                    # Project management
│   ├── plan.md                # Project planning
│   ├── tasks.md               # Task list
│   ├── notes.md               # Working notes
│   ├── log.md                 # Activity log
│   └── config/                # Configuration files
│       ├── client.json
│       └── context.json
│
└── resources/                  # Supporting materials
    ├── input.md               # Raw content & source material
    ├── inspo/                 # Inspiration references
    └── refs/                  # Additional references
```

## Quick Start

### Writing a Penguin Sale Caption (VL London Campaign)

For the **Penguin Sale (16/11 - 30/11/2025)** campaign:

1. **Load the Penguin Sale guide:**
   - Read `WRITE-PENGUIN-SALE-CAPTIONS.md` (comprehensive style guide for this campaign)

2. **Choose your channel:**
   - **VL London** (Vietnamese): Warm, conversational tone with penguin mascot storytelling
   - **VLDirect** (English): Professional, technical tone for international salons

3. **Choose your caption format:**
   - **Product-Focused** — Highlight product features and benefits directly
   - **Seasonal/Value** — Emphasize timeliness and special offers
   - **Professional Testimonial** — Use salon owner voice, focus on ROI and business impact
   - **Educational** — Share techniques, how-tos, or knowledge alongside product promotion
   - **Nail Health/Customer Care** — Focus on protecting customer nails and building loyalty

4. **Identify the brand and product:**
   - BlazingStar: `brands/blazingstar/`
   - MBerry: `brands/mberry/`
   - BoldBerry: `brands/boldberry/`
   - Pastel: `brands/pastel/`

5. **Reference existing captions for format examples:**
   - `BLAZINGSTAR-ORIGINAL-GEL-POLISH-PENGUIN-SALE.md` (product-focused, timeless hook)
   - `BLAZINGSTAR-MAXX-PERFORM-FAST-SET-PENGUIN-SALE.md` (seasonal value emphasis)
   - `BLAZINGSTAR-MAXX-PERFORM-FAST-SET-AHHPHONG-PENGUIN-SALE.md` (professional testimonial with business ROI)
   - `BLAZINGSTAR-MAXX-PERFORM-POWDER-SPEED-PENGUIN-SALE.md` (educational: powder speed selection)
   - `BLAZINGSTAR-FLEXIBUILD-X-BIAB-GUIDE-PENGUIN-SALE.md` (educational: how-to + nail protection)
   - `BLAZINGSTAR-FRENCH-ACRYLIC-POWDER-PENGUIN-SALE.md` (campaign launch announcement, concise format)
   - `BLAZINGSTAR-ACRYLIC-POWDER-FAST-SET-PENGUIN-SALE.md` (playful wordplay hook, popular product tone)
   - `BLAZINGSTAR-BRUSH-ALL-TYPES-PENGUIN-SALE.md` (life milestone humor, multi-product comparison, educational)

### Writing a Regular Caption

1. **Load the main guide:**
   - Read `docs/CAPTION-INSTRUCTIONS.md`

2. **Identify the brand and product:**
   - BlazingStar: `brands/blazingstar/`
   - MBerry: `brands/mberry/`
   - BoldBerry: `brands/boldberry/`
   - Pastel: `brands/pastel/`

3. **Navigate to product README:**
   ```
   brands/{brand}/{category}/{product}/README.md
   ```

   Examples:
   - `brands/blazingstar/polish-colours/gel-polish/old-money/README.md`
   - `brands/mberry/gel-polish/README.md`
   - `brands/boldberry/dip-ombre/README.md`

4. **Write using the standard format:**
   ```markdown
   # [Brand] — Social Caption ([Theme/Edit])

   [Hook line - one sentence]

   ✨ [Feature/benefit 1]
   ✨ [Feature/benefit 2]
   ✨ [Feature/benefit 3]

   💎 Join our members' list at vldirect.uk for early drops and exclusive offers.
   💅 VLDirect — beauty that makes sense for the tech.

   Shop [product/collection] at vldirect.uk today!
   ```

5. **Save the caption:**
   - Products: `captions/products/{product-slug}/captions.md`
   - Collections: `captions/sets/{theme}/{YYYY-MM-DD}.md`
   - Systems: `captions/systems/{system-slug}/captions.md`

### Example Request

**Input:**
> "Write an Instagram caption for BlazingStar Old Money shade 508"

**Process:**
1. Load: `brands/blazingstar/polish-colours/gel-polish/README.md`
2. Load: `brands/blazingstar/polish-colours/gel-polish/old-money/README.md`
3. Write caption following format
4. Save to: `captions/products/blazingstar-old-money-508/captions.md`

## Brand-Specific Configuration

### VLDirect Brands

**BlazingStar**
- Professional nail tech products
- Categories: Polish Colours, Sculpting System, Nail Essentials, Spa, Furniture
- Tone: Technical, performance-focused, education-first
- CTA: "Shop BlazingStar at vldirect.uk today"

**MBerry**
- Romantic, seasonal gel polish collections
- Focus: Sheer-to-bold finishes, versatile layering
- Tone: Elegant, approachable, effortless
- CTA: "Shop MBerry [collection] shades at vldirect.uk today"

**Bold Berry** (folder: `boldberry`)
- Dip ombre and gel polish systems
- Focus: Wide color range, clean application, value
- Tone: Bold, creative, accessible
- CTA: "Shop Bold Berry at vldirect.uk today"

**Pastel**
- Soft, romantic collections (Coquette, French Tip, Princess)
- Focus: Delicate finishes, bridal, feminine aesthetics
- Tone: Dreamy, romantic, refined
- CTA: "Shop Pastel [collection] at vldirect.uk today"

### Required Footer (VLDirect)

```
💎 Join our members' list at vldirect.uk for early drops and exclusive offers.
💅 VLDirect — beauty that makes sense for the tech.
📲 Follow @vldirectuk on Instagram for pro tips, trends, and tech-focused education.
```

**Important:**
- Instagram handle: @vldirectuk (no dot)
- Website URL: vldirect.uk (with dot)

### VLLondon Configuration

**VL London** (vllondon.uk) targets Vietnamese-speaking customers in the UK.

**Key Differences from VLDirect:**
- **Language:** Vietnamese (exclusively)
- **Tone:** Warm, conversational, personal ("Anh/Chị")
- **Storytelling:** Penguin mascot, campaign narratives
- **Focus:** Community, accessibility, value for money
- **Footer:** Vietnamese contact info and MyVL signup (see `captions/brand/vllondon-footer.md`)
- **CTA Examples:** "Tranh thủ mua sắm," "Đăng ký tại MyVL"

**Writing for VL London:**
1. **Always use Vietnamese** - no code-switching
2. **Match the penguin-sale-announcement.md tone** - warm, festive, personal
3. **Use `vllondon-footer.md`** - never VLDirect footer
4. **Reference the `WRITE-PENGUIN-SALE-CAPTIONS.md` style guide** for comprehensive Vietnamese caption guidelines
5. **Include practical business benefits** - ROI, productivity, customer satisfaction (especially for testimonial-style captions)

**Style Guide for VL London:**
- Consult `WRITE-PENGUIN-SALE-CAPTIONS.md` for:
  - Opening line strategies (value hooks, seasonal angles, professional questions)
  - Product feature language (evocative Vietnamese terms)
  - Pricing format ("Giá gốc & Giảm còn" with arrow notation)
  - Professional testimonial format
  - Punctuation and emoji guidelines
  - Penguin Sale messaging structure

## Writing Rules

### Tone & Voice
- Professional, technical, elegant, and approachable
- Education-first (emphasize technique, performance, safety)
- Avoid hype; prefer specifics over superlatives
- Only make claims present in loaded README files

### Content Guidelines
- Keep copy concise and useful to salon professionals
- Use correct product names and variant codes
- Include technique steps when relevant (e.g., "cure under BlazingStar LED")
- Pair products logically (e.g., base + color + top coat)

### CTA Wording
- Prefer "shades" over "edit" for collections
  - ✅ "Shop the Old Money shades at vldirect.uk today"
  - ⚠️ "Shop the Old Money Edit" (only for editorial series)
- Match CTA to content type (product, collection, system, set)

## File Naming Conventions

### Product Captions
```
captions/products/{brand}-{product-slug}/captions.md
```
Examples:
- `captions/products/blazingstar-old-money-508/captions.md`
- `captions/products/mberry-autumn-reflections/captions.md`

### Collection/Set Captions
```
captions/sets/{theme}/{YYYY-MM-DD}.md
```
Examples:
- `captions/sets/supplies-that-make-sense/2025-11-05.md`
- `captions/sets/autumn-nails/2025-10-20.md`

### System Captions
```
captions/systems/{system-slug}/captions.md
```
Examples:
- `captions/systems/gel-system/captions.md`
- `captions/systems/sculpting-essentials/captions.md`

## Workflow Tips

1. **Start with the brand README** to understand voice and positioning
2. **Navigate to product README** for specific claims and features
3. **Check related products** (base coats, top coats, pairings)
4. **Write caption** using standard format
5. **Verify claims** - only use information from README files
6. **Save and index** - update `captions/index.md` if needed

## Maintenance

- Update brand knowledge bases in `brands/` when products change
- Archive old captions in `captions/archive/` by date
- Keep `docs/CAPTION-INSTRUCTIONS.md` as single source of truth
- Log significant changes in `project/log.md`

## Resources

- **Main guide:** `docs/CAPTION-INSTRUCTIONS.md`
- **Raw content:** `resources/input.md`
- **Inspiration:** `resources/inspo/`
- **References:** `resources/refs/`
- **Project tracking:** `project/tasks.md`, `project/plan.md`

---

**System Version:** 1.0 (Reorganized 2025-11-05)
