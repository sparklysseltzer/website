# Main cart

Source: `sections/main-cart.liquid`

Template: `templates/cart.json`

## Current capability

The cart is a complete no-JavaScript form surface for the current basic catalog. It renders localized empty and non-empty states, line titles and variants, final unit and line prices, quantity updates, remove URLs, subtotal, tax/shipping guidance, update, and checkout actions.

All endpoints and destinations come from Shopify objects and routes. Quantity zero removes a line through the normal cart update.

## Known gaps

Discount allocations, selling plans, line-item properties, notes/attributes, quantity rules, richer inventory errors, product images, and final accessible table/price semantics remain incomplete. The cart drawer, coupon entry, recommendations, last-minute offers, and free-shipping progress are not implemented. See [Commerce](../commerce.md).

## Shared typography roles

Hero-size page title; body cart text; UI controls.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
