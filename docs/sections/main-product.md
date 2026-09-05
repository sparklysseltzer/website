# Main product

Source: `sections/main-product.liquid`

Display headings use the centrally resolved font-specific line height from the [design system](../design-system.md); section CSS must not introduce a separate heading rhythm.

Templates: `templates/product.json`, `templates/product.soda.json`, `templates/product.seltzer.json`

## Current capability

The section provides a basic server-rendered product journey:

- all Shopify product media, with responsive treatment for images and `media_tag` for other media;
- optional vendor, product title, selected-or-first-available variant price, compare-at price, and description;
- a native Shopify product form submitting variant ID and quantity;
- a simple variant dropdown when more than one variant exists;
- sold-out disabling and localized button/status text;
- progressive Ajax add-to-cart through the global `product-form` custom element, with the normal form as fallback.

The branded product templates currently share this section. Their suffixes select the correct global brand shell and preserve a future divergence point.

## Accessibility and resilience

Every control has a label, the add-to-cart result uses a polite live region, and core submission works without JavaScript. Product media retain Shopify alternative text and intrinsic dimensions.

## Known gaps

Option-based selection, URL state, variant-specific media/price/availability synchronization, quantity rules, inventory messaging, selling plans, accelerated checkout, line-item properties, app blocks, pickup availability, product recommendations, and product structured data remain incomplete. See [Commerce](../commerce.md).

## Shared typography roles

Section-size product title; body description and prices; UI controls.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
