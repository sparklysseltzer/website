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
