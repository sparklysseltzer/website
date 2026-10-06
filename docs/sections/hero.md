# Hero

Source: `sections/hero.liquid`

## Purpose and placement

The Hero is a reusable full-width introductory section. It remains available for static introductions and existing branded collection placements. The development homepage now uses [Hero slider](hero-slider.md).

## Merchant controls

- optional Shopify image;
- eyebrow, heading, rich text, and optional linked button;
- background and foreground colors;
- image-overlay opacity from 0% to 80%.

## Rendering contract

The heading is an `h1`. When an image is selected, Shopify renders responsive widths through `image_url` and `image_tag`, preserves intrinsic dimensions, applies its saved focal point automatically, and gives the image high fetch priority because this placement is expected to be above the fold. The action renders only when both label and URL exist. Without an image, the configured background remains the complete surface.

The section uses shared Hero styles from `assets/base.css` and inherits the server-resolved brand-context heading font.

## Accessibility and gaps

Image alternative text comes from the selected Shopify image. The overlay is decorative. Content and the action work without JavaScript. The current section has no separate heading-level control, mobile image, or section-owned motion; crop adjustments belong to Shopify's native focal-point editor rather than another section setting.

## Typography roles

Hero heading; body copy; small eyebrow; UI actions.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Section background

The existing `background` color ID is reused; there is no second section-color control. **Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Narrow**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.
