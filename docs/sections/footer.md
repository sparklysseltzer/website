# Footer

Source: `sections/footer.liquid`

Group: `sections/footer-group.json`

## Purpose

The persistent footer mirrors the server-resolved `default`, `soda`, and `seltzer` contexts while keeping one shared structural system.

## Merchant controls and data

- separate General, Soda, and Hard Seltzer nested Shopify Navigation menus;
- shared Legal Nav.

Pages and Products explicitly select their context through the existing `custom.brand_variant` metafield (`soda` / `hardseltzer`). The resolver supports the same key for optional future Collection overrides. The canonical `soda` and `hard-seltzer` collection handles remain classification fallbacks and are not Theme Editor settings. Top-level footer menu items create cards and their children create card links. The footer year is rendered from Shopify's server time.

## Rendering contract

Each context selects its matching Arc, Soda, or Hard Seltzer identity and navigation. Footer card headings intentionally use Newake in every context. A native Shopify customer form tagged `newsletter` supplies the newsletter path expected by the existing Shopify–Klaviyo integration. General and Hard Seltzer social links use `@sparklysseltzer`; Soda uses `@sparklyssoda`; LinkedIn is shared.

Payment marks, Store Finder, and language chips currently render as non-interactive visual previews. Legal links and social destinations are active.

## Progressive enhancement and accessibility

`newsletter-form` submits progressively and replaces the form with Shopify's rendered success/error state without losing the native fallback. Shopify's hCaptcha protection remains active, while its injected floating badge is visually suppressed so it cannot cover footer controls. Labels, live error/status regions, focus targets, external-link relations, visible focus, 44px social targets, and reduced-motion behavior are included.

## Known gaps

Verify Shopify-to-Klaviyo list routing and opt-in behavior operationally. Replace placeholder footer-menu destinations. Connect payment rendering, Store Finder, and localization controls only after their authoritative Shopify behavior is defined.

## Typography roles

Compact newsletter/card headings; label navigation/legal copy; UI newsletter input/action; small status text. Newake card-heading family remains unchanged.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

Focus treatment (2026-09-08): newsletter keyboard focus retains the contrasting shell ring; pointer focus suppresses that ring and retains the input caret. The input itself avoids a duplicate ring. Uses the [shared modality contract](../design-system.md#focus-styles), with native focus-visible fallback.

Notifications (2026-09-08): Enhanced newsletter success and server-error feedback use the shared toast system. Server feedback remains available as a hidden field description, including aria-invalid on errors; native no-JavaScript responses stay inline. After an enhanced response, focus returns to the invalid input or submit control rather than moving into the notification. Existing network-failure native-submit fallback remains unchanged. See [Notifications](../design-system.md#notifications).

Shared control refinement (2026-09-09): buttons use the global 3px control outline; cart quantity capsules share it. Normal field/select values explicitly use the regular body face and weight 400, including newsletter and product controls. Labels, button emphasis, field geometry and document artwork typography remain governed by their existing contracts.

Payment marks (2026-09-11): `snippets/payment-icons.liquid` now owns the existing eight SVG marks for both footer and PDP. Change this renderer once to update both. The set remains editorial artwork rather than a verified dynamic gateway inventory.
