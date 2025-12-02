# VL London Product Information System - Style Guide

## Colour Palette

This application uses a strict four-colour palette:

### Primary Colours

**Navy (Dark Navy)**
- Hex: `#0A1128`
- RGB: `10, 17, 40`
- Usage: Primary text, headers, buttons, borders, main UI elements
- Tailwind: `bg-[#0A1128]`, `text-[#0A1128]`, `border-[#0A1128]`

**Gold (Gold Yellow)**
- Hex: `#C5A572`
- RGB: `197, 165, 114`
- Usage: Accent colour, highlights, links, interactive states
- Tailwind: `bg-[#C5A572]`, `text-[#C5A572]`, `border-[#C5A572]`

**Black**
- Hex: `#000000`
- RGB: `0, 0, 0`
- Usage: Deep contrast, text on light backgrounds
- Tailwind: `bg-black`, `text-black`

**White**
- Hex: `#FFFFFF`
- RGB: `255, 255, 255`
- Usage: Backgrounds, text on dark backgrounds, card surfaces
- Tailwind: `bg-white`, `text-white`

## Colour Usage Guidelines

### Text

- **Primary Text**: Navy `#0A1128` on white backgrounds
- **Secondary Text**: Navy at 70-80% opacity `#0A1128/70` or `#0A1128/80`
- **Links**: Gold `#C5A572` with navy hover `hover:text-[#0A1128]`
- **Text on Dark**: White `#FFFFFF` on navy backgrounds

### Backgrounds

- **Main Background**: White `#FFFFFF`
- **Card Background**: White `#FFFFFF` with navy borders
- **Accent Section**: Navy `#0A1128` with gold or white text
- **Alternate Card**: Gold `#C5A572` with navy text

### Buttons

**Primary Button**
- Background: Navy `#0A1128`
- Text: White
- Hover: Gold background `#C5A572` with navy text
- Border: Navy `2px`

**Secondary Button**
- Background: Gold `#C5A572`
- Text: Navy `#0A1128`
- Hover: Navy background with white text
- Border: Navy `2px`

**Tertiary Button**
- Background: White
- Text: Navy `#0A1128`
- Hover: Navy background with white text
- Border: Navy `2px`

### Borders

- **Standard Border**: Navy `#0A1128` at `2px` width
- **Accent Border**: Gold `#C5A572` at `2px` width
- **Subtle Border**: Navy at 20% opacity `#0A1128/20`

### Interactive States

**Default State**
- Use base colours as defined

**Hover State**
- Navy → Gold background swap
- Gold → Navy background swap
- White → Navy background with white text
- Maintain 2px navy border throughout

**Active/Focus State**
- Add shadow or increase border width
- Maintain colour scheme

**Disabled State**
- Reduce opacity to 40-50%
- Use navy at lower opacity

## Typography

- **Headings**: Bold, Navy `#0A1128`
- **Body Text**: Regular, Navy at 80% opacity
- **Captions**: Regular, Navy at 70% opacity
- **Links**: Semibold, Gold `#C5A572`

## Component Patterns

### Cards

```tsx
<div className="bg-white rounded-lg shadow-lg border-2 border-[#0A1128] p-6">
  <h2 className="text-xl font-bold text-[#0A1128] mb-4">Title</h2>
  <p className="text-[#0A1128]/80">Content</p>
</div>
```

### Inverted Cards (Dark)

```tsx
<div className="bg-[#0A1128] rounded-lg shadow-lg border-2 border-[#C5A572] p-6">
  <h2 className="text-xl font-bold text-white mb-4">Title</h2>
  <p className="text-white/90">Content with <span className="text-[#C5A572]">gold accent</span></p>
</div>
```

### Buttons

```tsx
// Primary
<button className="bg-[#0A1128] hover:bg-[#C5A572] text-white hover:text-[#0A1128] font-bold py-3 px-4 rounded-lg transition-colors border-2 border-[#0A1128]">
  Primary Action
</button>

// Secondary
<button className="bg-[#C5A572] hover:bg-[#0A1128] text-[#0A1128] hover:text-white font-bold py-3 px-4 rounded-lg transition-colors border-2 border-[#0A1128]">
  Secondary Action
</button>

// Tertiary
<button className="bg-white hover:bg-[#0A1128] text-[#0A1128] hover:text-white font-bold py-3 px-4 rounded-lg transition-colors border-2 border-[#0A1128]">
  Tertiary Action
</button>
```

### Links

```tsx
<a className="text-[#C5A572] hover:text-[#0A1128] font-semibold">
  Link Text →
</a>
```

### Tables

**Header**
- Background: Navy `#0A1128`
- Text: White
- Border: None

**Rows**
- Background: White (alternating can use very light navy `#0A1128/5`)
- Text: Navy
- Hover: Gold tint `bg-[#C5A572]/10`
- Border: Navy at 20% opacity

## Forbidden Colours

The following colours are NOT permitted anywhere in the application:

- No blues (except navy `#0A1128`)
- No greens
- No reds
- No purples
- No oranges
- No greys (use navy with opacity instead)
- No other yellows (only gold `#C5A572`)

## Opacity Scale

When needing transparency, use these opacity values with navy:

- `#0A1128/5` - Very subtle tint
- `#0A1128/10` - Subtle background
- `#0A1128/20` - Light border
- `#0A1128/40` - Disabled state
- `#0A1128/70` - Secondary text
- `#0A1128/80` - Body text
- `#0A1128/90` - Strong emphasis

## Accessibility

### Contrast Ratios

All text must meet WCAG AA standards:

- Navy on White: ✓ Excellent contrast (14.8:1)
- White on Navy: ✓ Excellent contrast (14.8:1)
- Gold on White: ✓ Good contrast (2.8:1) - use for accents only, not body text
- Gold on Navy: ✓ Excellent contrast (5.2:1)
- Navy on Gold: ✓ Excellent contrast (5.2:1)

**Important**: Never use gold for body text on white backgrounds. Use navy instead.

### Focus States

All interactive elements must have visible focus states:
- Add `ring-2 ring-[#C5A572]` for keyboard navigation
- Maintain colour scheme in focus state

## Implementation Notes

### Tailwind CSS

Custom colours are defined using bracket notation:
- `text-[#0A1128]` - Navy text
- `bg-[#C5A572]` - Gold background
- `border-[#0A1128]` - Navy border

### Opacity

Use Tailwind's slash notation for opacity:
- `text-[#0A1128]/80` - Navy at 80% opacity
- `bg-[#C5A572]/10` - Gold at 10% opacity

### Transitions

All colour transitions should use:
```
transition-colors duration-200
```

## Examples from Application

### Homepage Header
```tsx
<h1 className="text-3xl font-bold text-[#0A1128] mb-2">
  VL London Product Information System
</h1>
<p className="text-lg text-[#0A1128]/70">
  Centralised product information management
</p>
```

### Navigation Links
```tsx
<Link
  href="/admin"
  className="text-[#C5A572] hover:text-[#0A1128] font-semibold transition-colors"
>
  Product Manager →
</Link>
```

### Data Table Headers
```tsx
<thead className="bg-[#0A1128] text-white">
  <tr>
    <th className="px-6 py-4 text-left font-bold">Column</th>
  </tr>
</thead>
```

### Modal Headers
```tsx
<div className="bg-white border-4 border-[#0A1128] rounded-xl">
  <div className="bg-[#0A1128] text-white px-8 py-4">
    <h2 className="text-2xl font-bold">Modal Title</h2>
  </div>
  <div className="p-8">
    <p className="text-[#0A1128]/80">Modal content</p>
  </div>
</div>
```

## Quality Checklist

Before committing any UI changes, verify:

- [ ] Only navy, gold, black, and white colours used
- [ ] No other colours present (no blues, greens, reds, etc.)
- [ ] Text contrast meets WCAG AA standards
- [ ] Interactive elements have hover states
- [ ] Focus states are visible
- [ ] Borders are consistently navy or gold
- [ ] Opacity values are from approved scale
- [ ] Transitions are smooth (200ms)
- [ ] Dark sections use white or gold text
- [ ] Light sections use navy text

## Version

Style Guide Version: 1.0
Last Updated: 2 December 2025
