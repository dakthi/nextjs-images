# Caption Writing System Documentation

## 🎯 Overview

This documentation explains the complete system for writing product captions for VL London's Penguin Sale campaign using Claude Code.

---

## 📁 Information Architecture

### **1. Product Data Storage**

**Main Product Database:**
- **Location**: `/products-generated.json`
- **Purpose**: Single source of truth for all product information
- **Structure**:
```json
{
  "products": [
    {
      "id": "product-XXX",
      "category": "CATEGORY NAME",
      "productName": "Brand - Product Name",
      "discountPercentage": 20,
      "pricingTable": [
        {
          "size": "15ml",
          "price": "£9.00",
          "condition": "SL <12 CHAI",
          "discount": "£6.00"
        }
      ],
      "scents": ["Variant 1", "Variant 2"]
    }
  ]
}
```

**What's Stored:**
- Product ID and category
- Full product name (Brand + Product Type)
- Discount percentages (badge display)
- Complete pricing table with conditions
- Product variants (scents/types/colors)
- Image URLs
- Promotion period text
- Badge positioning

---

### **2. Brand Information**

**Location**: `/brands/[brand-name]/`

**Structure:**
```
brands/
├── blazingstar/
│   ├── README.json          # Brand overview
│   └── [product-category]/
│       └── README.json      # Product details
├── boldberry/
├── mberry/
└── lapalm/
```

**What's Stored:**
- Brand positioning & values
- Product features & benefits
- Technical specifications
- Target audience
- Usage instructions
- Product relationships

**Example Usage:**
```bash
# Read brand info for context
/brands/blazingstar/sculpting-system/acrylic-powder/README.json
```

---

### **3. Campaign Information**

**Main Style Guide:**
- **Location**: `/WRITE-PENGUIN-SALE-CAPTIONS.md`
- **Contains**:
  - Campaign details (dates, discount structure)
  - Writing guidelines
  - Dos & Don'ts table (64+ rules)
  - Hook strategies
  - Pricing format examples
  - Vietnamese tone guidance
  - Footer template

**Hook Library:**
- **Location**: `/captions/batch-20251124/HOOK-LINES-INVITATIONS.md`
- **Contains**: 30+ pre-written hook variations for different products/situations

---

### **4. Output Locations**

**Caption Files:**
```
captions/
├── batch-20251124/        # First batch (21 captions)
└── batch-20251124-2/      # Second batch (15+ captions)
```

**File Naming Convention:**
```
[BRAND]-[PRODUCT-TYPE]-CAPTION.md
Example: BLAZINGSTAR-GEL-TOP-SUNSHIELD-CAPTION.md
```

**File Structure:**
```markdown
[First draft - by Claude]

---

[Revised version - by user]
```

---

## 🤖 Using Claude Code to Write Captions

### **Method 1: Search & Extract Pricing**

**Use Claude Code's Bash tool to search JSON:**

```bash
# Search for specific product
grep -A 30 "BlazingStar.*Gel Top" /path/to/products-generated.json

# Get pricing for specific product ID
grep -A 40 "product-396" /path/to/products-generated.json

# Find all products of a type
grep -i "dipping powder" /path/to/products-generated.json
```

**Use Claude Code's Read tool to read JSON:**
```
Read file: /products-generated.json
Filter: Search for "BlazingStar - Gel Top"
Extract: pricingTable, scents, discountPercentage
```

---

### **Method 2: Verify Pricing Accuracy**

**Have Claude Code cross-check all captions:**

```
Task: Check all caption files in /captions/batch-20251124/
Against: /products-generated.json
Report: Which files have incorrect pricing
```

**Claude Code will:**
1. Read each caption file
2. Extract product name and pricing
3. Search JSON for matching product
4. Compare prices line-by-line
5. Report discrepancies with corrections

---

### **Method 3: Generate Multiple Captions**

**Use Claude Code's Task tool with specialized agents:**

```
Agent: general-purpose
Task: Create 15 caption files for these products:
- Product 1: [name]
- Product 2: [name]
...

Requirements:
- Extract pricing from /products-generated.json
- Follow style guide in /WRITE-PENGUIN-SALE-CAPTIONS.md
- Use hooks from /HOOK-LINES-INVITATIONS.md
- Save to /captions/batch-[date]-2/
```

**Claude Code will:**
1. Search JSON for each product
2. Extract accurate pricing
3. Read style guide for tone/format
4. Generate caption following patterns
5. Write files to specified location

---

### **Method 4: Learn & Update Style Guide**

**Have Claude Code analyze your revisions:**

```
Task: Analyze all revised versions (after ---) in both:
- /captions/batch-20251124/
- /captions/batch-20251124-2/

Compare first draft vs revision to identify patterns.
Update /WRITE-PENGUIN-SALE-CAPTIONS.md Dos & Don'ts section.
```

**Claude Code will:**
1. Read all caption files
2. Compare first vs revised copies
3. Identify consistent changes:
   - Hook style preferences
   - Removed elements
   - Tone adjustments
   - Pricing format changes
4. Update style guide with new patterns

---

## 🔍 Data Extraction Process

### **Step 1: Identify Product**

**Option A - By Product Name:**
```bash
grep -i "bold berry.*dipping" products-generated.json
```

**Option B - By Product ID:**
```bash
grep -A 50 "product-200" products-generated.json
```

**Option C - By Category:**
```bash
grep -B 5 "\"category\": \"SƠN GEL POLISH\"" products-generated.json
```

---

### **Step 2: Extract Pricing Data**

**Pricing is stored in `pricingTable` array:**

```json
"pricingTable": [
  {
    "size": "15ml",              // Product size
    "price": "£9.00",            // Original price
    "condition": "SL <12 CHAI",  // Purchase condition
    "discount": "£6.00"          // Discounted price
  }
]
```

**Multiple pricing tiers:**
```json
"pricingTable": [
  {"size": "15ml", "price": "£9.00", "condition": "SL <12", "discount": "£6.00"},
  {"size": "15ml", "price": "£9.00", "condition": "SL ≥12 MIX & MATCH", "discount": "£5.40"},
  {"size": "480ml", "price": "£70.00", "condition": "MUA 2 TẶNG 1", "discount": "£42.00"}
]
```

---

### **Step 3: Extract Product Variants**

**Variants stored in `scents` array:**
```json
"scents": [
  "Durashine",
  "Original",
  "Sunshield",
  "Matte"
]
```

**Or in product name for collections:**
```json
"productName": "BlazingStar French Collection",
"scents": ["Milky White", "French White", "Soft White"]
```

---

### **Step 4: Format for Caption**

**Transform JSON data to caption format:**

**Input (JSON):**
```json
{
  "size": "15ml",
  "price": "£9.00",
  "condition": "SL <12 CHAI",
  "discount": "£6.00"
}
```

**Output (Caption):**
```
£9.00 15ml SL <12 CHAI → £6.00
```

**Key transformations:**
- Remove "Lẻ" prefix (redundant)
- Use arrow (→) instead of "Giảm X% Còn"
- Keep conditions in CAPS
- Line-by-line (not slashed format)

---

## 🔄 Quality Control Workflow

### **1. Pricing Verification**

**Command Claude Code:**
```
Check all files in /captions/batch-20251124-2/
Verify pricing against /products-generated.json
Report any mismatches
```

**Claude Code checks:**
- ✅ Product names match
- ✅ All pricing tiers included
- ✅ Original prices correct
- ✅ Discounted prices correct
- ✅ Conditions accurate
- ✅ Sizes/units correct (oz vs g)

---

### **2. Format Consistency**

**Claude Code verifies:**
- ✅ Pricing uses arrow (→) format
- ✅ Deals in CAPS (MUA 2 TẶNG 1)
- ✅ Line-by-line pricing (not slashed)
- ✅ CÁNH CỤT SALE banner present
- ✅ Date range: 16/11 - 30/11
- ✅ VL London footer complete
- ✅ No CTA in 90% of captions

---

### **3. Batch Processing**

**Fix all pricing errors at once:**

```
Task: Fix pricing in all caption files with errors
Location: /captions/batch-20251124-2/
Source: /products-generated.json
Action: Update incorrect prices using Edit tool
```

**Claude Code will:**
1. Identify files with errors (from verification report)
2. Find correct pricing in JSON
3. Use Edit tool to replace incorrect prices
4. Update all occurrences (first + revised copies)
5. Report which files were updated

---

## 📝 Caption Writing Workflow

### **Standard Process:**

```
1. User requests caption for [Product]
   ↓
2. Claude searches products-generated.json
   ↓
3. Claude extracts:
   - Product name
   - All pricing tiers
   - Variants/scents
   - Discount percentage
   ↓
4. Claude reads style guide:
   - /WRITE-PENGUIN-SALE-CAPTIONS.md
   - /HOOK-LINES-INVITATIONS.md
   ↓
5. Claude generates first draft following patterns:
   - Hook (1 of 5 styles)
   - Product name (clean, no subtitle)
   - 2-3 features (ultra short)
   - Pricing (→ format, CAPS deals, line-by-line)
   - Banner + Footer
   ↓
6. Claude writes file to /captions/batch-[date]-2/
   ↓
7. User reads and revises second copy (after ---)
   ↓
8. Claude analyzes revisions → Updates style guide
```

---

### **Batch Creation Process:**

```
1. User provides list of 15 products
   ↓
2. Claude uses Task tool with general-purpose agent
   ↓
3. Agent searches JSON for all products in parallel
   ↓
4. Agent extracts pricing for each
   ↓
5. Agent reads style guide once (shared context)
   ↓
6. Agent generates all 15 captions
   ↓
7. Agent writes all files to batch folder
   ↓
8. Claude adds duplicate copies (for user revision)
   ↓
9. User revises second copies
   ↓
10. Claude analyzes all revisions → Mass style guide update
```

---

## 🎯 Key Commands for Claude Code

### **Search Commands:**
```bash
# Find product by name
grep -A 30 "Product Name" products-generated.json

# Find product by ID
grep -A 50 "product-XXX" products-generated.json

# Find all products in category
grep -B 5 "\"category\": \"CATEGORY\"" products-generated.json

# Check if pricing exists
grep -i "sunshield\|matte\|durashine" products-generated.json
```

---

### **Read Commands:**
```
Read: /products-generated.json
Offset: [line number]
Limit: 50 lines

Read: /WRITE-PENGUIN-SALE-CAPTIONS.md
Section: Dos & Don'ts

Read: /brands/blazingstar/sculpting-system/acrylic-powder/README.json
```

---

### **Write Commands:**
```
Write new file:
Path: /captions/batch-20251124-2/[PRODUCT]-CAPTION.md
Content: [Generated caption]

Edit existing file:
Path: /captions/batch-20251124-2/[PRODUCT]-CAPTION.md
Find: [old pricing format]
Replace: [new pricing format]
```

---

### **Task Commands:**
```
Task tool → general-purpose agent:
"Create 15 caption files for [products]
Extract pricing from JSON
Follow style guide
Write to batch-20251124-2/"

Task tool → Explore agent:
"Find all gel polish products in JSON
Return product names and IDs"
```

---

## 💾 Information Flow Diagram

```
INPUT SOURCES
    │
    ├─→ products-generated.json ──→ PRICING DATA
    │                              (source of truth)
    │
    ├─→ brands/[brand]/README.json ──→ BRAND CONTEXT
    │                                  (features, benefits)
    │
    ├─→ WRITE-PENGUIN-SALE-CAPTIONS.md ──→ STYLE RULES
    │                                      (tone, format)
    │
    └─→ HOOK-LINES-INVITATIONS.md ──→ HOOK VARIATIONS
                                       (opening lines)
         │
         ↓
    CLAUDE CODE PROCESSING
    - Search JSON (Bash/Grep)
    - Extract pricing
    - Read style guide
    - Generate caption
    - Write file (Write tool)
         │
         ↓
    OUTPUT FILES
    - /captions/batch-[date]/[PRODUCT]-CAPTION.md
    - Two copies: Draft | Revised (by user)
         │
         ↓
    FEEDBACK LOOP
    - Claude reads revised versions
    - Analyzes pattern changes
    - Updates style guide (Edit tool)
    - Improves future captions
```

---

## 📊 Summary

**Information Storage:**
- ✅ Pricing → `products-generated.json`
- ✅ Brand info → `brands/[brand]/README.json`
- ✅ Style rules → `WRITE-PENGUIN-SALE-CAPTIONS.md`
- ✅ Hooks → `HOOK-LINES-INVITATIONS.md`
- ✅ Captions → `captions/batch-[date]/`

**Use Claude Code to:**
- ✅ Search JSON with Bash/Grep
- ✅ Extract accurate pricing
- ✅ Read style guide
- ✅ Generate captions (Task tool)
- ✅ Verify pricing accuracy
- ✅ Fix errors in batch (Edit tool)
- ✅ Analyze revisions
- ✅ Update style guide

**Workflow:**
```
Search JSON → Extract Data → Follow Style Guide → Generate Caption →
User Revises → Claude Analyzes → Update Style Guide → Improve Next Batch
```

This self-improving system ensures every batch of captions is more accurate and closer to your preferred style! 🎯
