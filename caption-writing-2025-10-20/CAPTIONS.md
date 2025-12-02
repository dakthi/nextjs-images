# Captions — Start Here

Goal: make it fast and obvious to write on‑brand captions.

Quick Start
- Pick a brand hub in `captions/brand/` for voice, footer, and links.
- Open a template from `captions/templates/` (e.g., Instagram) and fill in.
- Include the correct footer for the brand using `{% include %}`.
- Save your caption under `captions/<type>/...` following the patterns below.

Footers
- Default (VLDirect): `captions/brand/footer.md`
- VL London: `captions/brand/vllondon-footer.md`
- Shared variant: `captions/shared/footer.md`

Where Things Live
- Brand hubs: `captions/brand/` (voice, footers, links)
- Product captions: `captions/products/<product-slug>/captions.md`
- System captions: `captions/systems/<system-slug>/captions.md`
- Sets/edits: `captions/sets/<theme>/<YYYY-MM-DD>.md`
- Global index: `captions/index.md`

How to Use Templates
1) Copy a template from `captions/templates/instagram.md`.
2) Replace placeholders (brand, product, hooks, bullets).
3) Keep technique accurate and claims from brand docs.
4) Append the correct footer via `{% include <path-to-footer> %}`.

Rules of Thumb
- Professional, technical, educational; avoid hypey claims.
- Only claim what exists in brand/product docs.
- Prefer short, scannable bullets for features/benefits.

Useful References
- VLDirect brand footer: `captions/brand/footer.md`
- VL London footer: `captions/brand/vllondon-footer.md`
- Caption instructions: `WRITE CAPTIONS.md`, `CAPTION-INSTRUCTIONS.md`

