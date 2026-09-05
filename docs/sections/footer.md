# Footer

Source: `sections/footer.liquid`

Display headings use the centrally resolved font-specific line height from the [design system](../design-system.md); section CSS must not introduce a separate heading rhythm.

Group: `sections/footer-group.json`

## Purpose

The persistent footer mirrors the server-resolved `default`, `soda`, and `seltzer` contexts while keeping one shared structural system.

## Merchant controls and data

- separate General, Soda, and Hard Seltzer nested Shopify Navigation menus;
- shared Legal Nav.

Pages, Products, and Collections can explicitly select their context through the `custom.product_world` metafield. The canonical `soda` and `hard-seltzer` collection handles remain classification fallbacks and are not Theme Editor settings. Top-level footer menu items create cards and their children create card links. The footer year is rendered from Shopify's server time.

## Rendering contract

Each context selects its matching Arc, Soda, or Hard Seltzer identity and navigation. Footer card headings intentionally use Newake in every context. A native Shopify customer form tagged `newsletter` supplies the newsletter path expected by the existing Shopify–Klaviyo integration. General and Hard Seltzer social links use `@sparklysseltzer`; Soda uses `@sparklyssoda`; LinkedIn is shared.

Payment marks, Store Finder, and language chips currently render as non-interactive visual previews. Legal links and social destinations are active.

## Progressive enhancement and accessibility

`newsletter-form` submits progressively and replaces the form with Shopify's rendered success/error state without losing the native fallback. Shopify's hCaptcha protection remains active, while its injected floating badge is visually suppressed so it cannot cover footer controls. Labels, live error/status regions, focus targets, external-link relations, visible focus, 44px social targets, and reduced-motion behavior are included.

## Known gaps

Verify Shopify-to-Klaviyo list routing and opt-in behavior operationally. Replace placeholder footer-menu destinations. Connect payment rendering, Store Finder, and localization controls only after their authoritative Shopify behavior is defined.

## Shared typography roles

Compact newsletter/card headings; label navigation/legal copy; UI newsletter input/action; small status text. Newake card-heading family remains unchanged.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
