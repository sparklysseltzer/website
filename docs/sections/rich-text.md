# Rich text

Source: `sections/rich-text.liquid`

## Purpose and placement

Rich text provides a narrow editorial introduction or follow-up block. It is used on both branded collection templates and can be added through a preset.

## Merchant controls

- optional eyebrow;
- optional `h2` heading;
- optional rich text;
- optional secondary-style action, rendered only when label and URL are both present.

## Rendering contract

The section uses the shared `.section`, `.page-width`, `.stack`, `.rte`, and Bubble Sweep button primitives. It contains no JavaScript and no section-specific stylesheet. Merchant content is stored on the section instance in its JSON template.

## Known limits

There is no heading-level, alignment, width, color, or spacing control. Add those only when an approved composition needs them; do not turn this small primitive into a page-builder catch-all.

## Typography roles

Section heading; body reading copy; small eyebrow; UI actions.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Section background

**Section background** is the final group: Default, Transparent, or Custom Color. Only Custom Color shows the picker; Clear means transparent. New add-section presets start transparent; existing saved placements retain their original appearance until a color is chosen. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Narrow**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).
