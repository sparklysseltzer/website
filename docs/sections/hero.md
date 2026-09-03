# Hero

Source: `sections/hero.liquid`

## Purpose and placement

The Hero is a reusable full-width introductory section. It is currently the first section on the homepage and both branded collection templates.

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
