# USP Section

Source: `sections/usp-section.liquid`

## Purpose and placement

USP Section implements the shared Soda and Hard Seltzer Figma module in one reusable section. It is currently placed after the introduction in both branded collection templates.

## Context and defaults

`Automatic — page context` is the safe default. The section resolves the existing server-side brand context through `snippets/brand-context.liquid`:

- Soda pages render the approved Soda background, Erode heading, copy, image, five icons, and labels.
- Hard Seltzer pages render the approved black/white treatment, Newake heading, copy, image, five icons, and labels.
- Unclassified pages render no storefront section in Automatic mode; the Theme Editor shows an explanatory note. Select an explicit Soda or Hard Seltzer variant when placing the section on a shared page.

This runtime resolution is intentional because Shopify section-schema defaults cannot vary by the template being previewed. Moving an Automatic instance between classified templates therefore updates its complete product-world presentation without saving a stale brand choice.

For Pages, Products, and Collections, the resource's `custom.product_world` metafield is the authoritative Automatic classification. Branded template suffixes and canonical collection membership remain fallbacks when that field is blank.

## Merchant controls

- automatic, Soda, or Hard Seltzer content variant;
- optional heading, rich text, and Shopify background-image overrides;
- left, center, or right custom-image position;
- automatic, Newake, or Erode heading typeface;
- automatic product-world colors or custom background/text colors;
- up to five custom USP blocks, each with an image icon and label.

Blank section-level content uses localized Figma defaults. When no custom USP blocks exist, the section renders the five exact product-world icon/label defaults. Adding any custom blocks replaces that default set for the current section instance.

## Rendering contract

Desktop reproduces the 1400 by 630 composition inside a centered 16px-radius panel. The exact flattened Figma media/gradient export remains decorative background artwork; the title, description, and USP labels remain real localized HTML. Original Figma SVG layers render the icons without remote runtime assets.

Below 896px the panel stacks the cropped media above the content. The five USP items use a centered two-row grid with three items on the first row and two on the second; shorter custom sets are centered where necessary. The section requires no JavaScript and has no motion-only content.

## Accessibility and maintenance

The title is an `h2`, the USP collection exposes list semantics, decorative images have empty alternative text, and all claims remain readable without images or JavaScript. Do not change fallback claims or icons without approved Soda/Hard Seltzer content. If either Figma composition changes, re-export the media and vector layers rather than recreating them in CSS.
