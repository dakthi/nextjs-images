WRITE CAPTIONS — BlazingStar

Purpose
- This file instructs an LLM how to write on-brand captions using the BlazingStar knowledge base at `blazingstar/`.
 - Where to save captions and how they’re organized lives under `captions/`.

What to load (in order)
- Brand voice + positioning: brand README in the relevant folder
- Product/topic context: navigate directly to the product/system README in the brand folder
  - Polish Colours
    - Gel Polish: `blazingstar/polish-colours/gel-polish/README.md`
    - Builder Gel: `blazingstar/polish-colours/builder-gel/README.md`
    - FlexiBuild: `blazingstar/polish-colours/builder-gel/flexibuild/README.md`
    - StrongBuild: `blazingstar/polish-colours/builder-gel/strongbuild/README.md`
    - Top Gels: `blazingstar/nail-essentials/top-gels/README.md`
    - Base Gels: `blazingstar/nail-essentials/base-gels/README.md`
  - Sculpting System
    - Liquids (Monomer): `blazingstar/sculpting-system/liquids/README.md`
    - Acrylic Powder: `blazingstar/sculpting-system/acrylic-powder/README.md`
    - Brushes: `blazingstar/sculpting-system/brushes/README.md`
    - Drill Bits: `blazingstar/sculpting-system/drill-bits/README.md`
    - Tips: `blazingstar/sculpting-system/tips/README.md`
  - Nail Essentials
    - Lamps: `blazingstar/nail-essentials/lamps/README.md`
    - Gloves: `blazingstar/nail-essentials/gloves/README.md`
  - Spa
    - Foot Soak: `blazingstar/spa/foot-soak/README.md`

Tone and rules (must follow)
- Professional, technical, elegant, and approachable; education-first.
- Emphasize performance, technique, safety; avoid price-only messaging.
- Only make claims present in the loaded files. No unverified benefits.
- Keep copy concise and useful to salon pros; prefer specifics over hype.

Required footer (append to every caption)
- 💎 Join our members’ list at vldirect.uk for early drops and exclusive offers.
- 💅 VLDirect — beauty that makes sense for the tech.
- 📲 Follow @vldirect.uk on Instagram for pro tips, trends, and tech-focused education.
- Default CTA: Shop BlazingStar at vldirect.uk today.

Collection CTA wording
- Prefer “shades” over “edit”. Example: “Shop the Old Money shades at vldirect.uk today!”
- Use “Edit” only if explicitly requested for an editorial series.

Input pattern examples
- “Write an Instagram caption for BlazingStar shade 508 (Old Money vibe).”
  - Load: brand README; gel-polish README; Old Money README (if relevant); top coat/base coat if referenced.
- “Write a caption for BlazingStar Maxx Perform Liquid (Winter Formula).”
  - Load: brand README; sculpting-system/liquids README; maxx-perform-liquid README; acrylic-powder README (optional pairing).

Output checklist
- One to three short paragraphs or bullets (platform-appropriate).
- Use correct product names and variants.
- If technique is mentioned, include the relevant system step (e.g., “cure under BlazingStar LED”, “pair with Revive Base”).
- Append the Required footer verbatim.

Preferred caption structure (use this format)
- Title line (H1): `# <Collection/Brand> — Social Caption (<Edit/Theme>)`
- Hook line: 1 sentence that sets mood or benefit.
- Three bullets (emoji-led), each one concrete feature/benefit/application.
- Required footer (three lines), appended verbatim.

Example
```
# MBerry — Social Caption (Autumn Edit)

Wrap your fingertips in autumn’s glow with MBerry.

✨ Warm, romantic tones that flatter every skin tone
✨ Sheer-to-bold finishes you can layer or wear solo
✨ Nails that look effortless, polished, and perfectly seasonal

💎 Join our members’ list at vldirect.uk for early drops and exclusive offers.
💅 VLDirect — beauty that makes sense for the tech.

Shop the MBerry Autumn shades at vldirect.uk today! 🍂🍷
```

Index for retrieval
- Navigate by README paths listed above
- Fallback source of truth: `input.md`

Additional brand KB (README-only)
- MBerry: `mberry/README.md`, `mberry/gel-polish/README.md`
- BoldBerry: `boldberry/README.md`, `boldberry/dip-ombre/README.md`, `boldberry/gel-polish/README.md`

Where to save (file structure)
- All captions live in `captions/`
- Brand-wide assets: `captions/brand/` (footer, templates)
- Product captions: `captions/products/<product-slug>/captions.md`
- System captions: `captions/systems/<system-slug>/captions.md`
- Set captions (Supplies That Make Sense): `captions/sets/<theme>/<YYYY-MM-DD>.md`
- Global index: `captions/index.md`
