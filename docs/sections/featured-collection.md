# Featured collection

Source: `sections/featured-collection.liquid`

## Purpose and placement

Featured collection renders a merchant-selected collection preview through the shared `snippets/product-card.liquid` primitive. It is available as a reusable section preset.

## Merchant controls

- heading;
- Shopify collection;
- two to eight products, default four.

## Rendering contract

When a collection exists, the section links to `collection.url` and renders the configured number of products in collection order. When no collection is selected, four Shopify placeholder product cards keep the Theme Editor preview understandable. The section is server-rendered and requires no JavaScript.

## Known limits

The section inherits the basic shared product card and grid. It does not provide merchandising overrides, quick add, variant selection, badges, slider behavior, or per-product blocks.

## Typography roles

Section heading; compact product-card names; body prices; UI actions.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Product backgrounds

Shared product cards use `product-background.liquid`: optional product `custom.gallery_background_image` overrides layered `custom.gallery_gradient`. Backgrounds remain behind product photography; opaque product photos naturally conceal them. Empty or rejected fields retain the existing neutral card surface. Decorative Shopify images use responsive delivery and their native focal point; they introduce no structured-data changes.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Page**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.

Product card images (TASK-013, 2026-10-08): compact cards prefer product **Collection Image** (`custom.collection_image`), then the featured product image. They do not consume Navigation Image. Responsive Shopify CDN delivery, native focal points and image alt text are retained. No artwork migration or product-image assignment is included. This source substitution adds no new structured-data entity; existing entity/SEO contracts remain unchanged.
