# Main product

Source: `sections/main-product.liquid`

Templates: `templates/product.json`, `templates/product.soda.json`, `templates/product.seltzer.json`

## Current capability

The section provides a basic server-rendered product journey:

- all Shopify product media, with responsive treatment for images and `media_tag` for other media;
- optional vendor, product title, selected-or-first-available variant price, compare-at price, and description;
- a native Shopify product form submitting variant ID and quantity;
- a simple variant dropdown when more than one variant exists;
- sold-out disabling and localized button/status text;
- progressive Ajax add-to-cart through the global `product-form` custom element, with the normal form as fallback. The shared cart controller serializes additions, refreshes cart sections/count and opens the drawer after success; errors are announced without automatically retrying additions.

The branded product templates currently share this section. Their suffixes select the correct global brand shell and preserve a future divergence point.

## Accessibility and resilience

Every control has a label, the add-to-cart result uses a polite live region, and core submission works without JavaScript. Product media retain Shopify alternative text and intrinsic dimensions.

## Known gaps

Option-based selection, URL state, variant-specific media/price/availability synchronization, quantity rules, inventory messaging, selling plans, accelerated checkout, line-item properties, app blocks, pickup availability, product recommendations, and product structured data remain incomplete. See [Commerce](../commerce.md).

## Typography roles

Section-size product title; body description and prices; UI controls.

Desktop sticky product information uses the measured full header height plus 16px clearance instead of a fixed 32px top offset. Header ResizeObserver updates the shared --sticky-header-height variable for responsive/font/layout changes; reserving the full header keeps content clear when the world switcher returns on upward scroll. Without JavaScript, the offset falls back to 8.5rem plus clearance. Mobile remains nonsticky.

Notifications (2026-09-08): Product-add success uses the shared toast system after the drawer opens. Cart errors are reported by the shared controller once. The local product feedback element is visually hidden and does not duplicate live announcements; native product submission is unchanged. See [Notifications](../design-system.md#notifications).

Shared control refinement (2026-09-09): buttons use the global 3px control outline; cart quantity capsules share it. Normal field/select values explicitly use the regular body face and weight 400, including newsletter and product controls. Labels, button emphasis, field geometry and document artwork typography remain governed by their existing contracts.
