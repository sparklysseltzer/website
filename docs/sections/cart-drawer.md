# Cart drawer

Source: `sections/cart-drawer.liquid`, statically included by `layout/theme.liquid` on every page. Shared rows, empty state and totals: `snippets/cart-content.liquid`. Global controller: `assets/theme.js`; shared styling: `assets/base.css`.

## Rendering and behavior

A white right-side native modal dialog, at most 600px wide and full width on phones, follows the reference composition with a bag/title header, close button, cart rows, checkout summary and cart-page link. Short carts push the summary toward the bottom; long carts scroll the entire panel so checkout remains reachable without trapping content in a short inner scroller. The drawer always uses the neutral Newake card-size heading, including on Soda pages. Shared global Cart shipping settings control the free-shipping meter; see below. Compact product rows align quantity controls and line totals; the bottom summary shows the merchandise subtotal, any applicable cart discounts, estimated shipping and estimated total, and retains a cart-page link.

The header's real cart link opens the enhanced drawer. Successful product addition renders Shopify's bundled sections and opens it. Opening from the header refreshes server state. Changes render both surfaces and the badge together from Shopify section HTML; no client-side price arithmetic or duplicated cart templates are used. Mutations are serialized across theme product/cart forms, controls show pending state, Shopify errors are visible, and failed requests reconcile without retrying additions. Missing section responses are treated as failures, not empty carts. Native cart-page links remain recovery paths.

Native `dialog.showModal()` provides modal focus containment and background inertness. Close, backdrop and Escape dismiss it; focus returns to its opener. Quantity refreshes preserve line focus where possible. Reduced motion disables the entry animation. The document is not scroll-locked. Without dialog support or JavaScript, the header navigates to the normal cart and product forms submit normally.

There is no drawer note field; notes belong to the full cart. An existing page-note draft is included in drawer checkout. Empty carts suppress checkout and show the same shopping state as the page. Shared line data, discount display, fallback assets, localization and structured-data decision follow [Main cart](main-cart.md).

## Typography roles

Card heading, bold body product titles, compact total and empty-state quote, body/UI controls, label prices and small metadata/guidance. Newake uses its existing shared heading rhythm and tracking; no composition exceptions.

## Verification and limitations

Local browser fixtures cover phone/desktop sizing, quantity/header synchronization, rejection recovery, note drafts, removal to empty, add/open and Escape/focus restoration. Shopify-hosted preview verification of real product addition, checkout, discounts, long carts, keyboard and no-JavaScript journeys remains required. Subscriptions and recommendations remain deferred. The user explicitly requested Bob Ross artwork on the subsequent visual revision; it is now bundled and shared with the cart page. Shipping progress uses the user-confirmed rule below.

## Section refresh regression — 2026-09-06

Do not send `Accept: application/json` when fetching `/cart?sections=...`: the development storefront negotiates a raw cart object instead of the requested section map, causing every refresh to fail with “Missing cart section.” The section request uses the default Accept header and still parses its JSON section-map response. Explicit JSON headers remain on the Cart Ajax mutation endpoints.

Verified the fix in the Shopify development preview with a real Yuzu & Ginger 12-pack: add opens the drawer, drawer quantity 1 → 2 recalculates the total, cart-page quantity 2 → 3 synchronizes both surfaces/count, and explicit Update succeeds. Tested desktop drawer and phone cart contexts. Checkout was not submitted.

## Visual revision and response time — 2026-09-06

Re-inspected the live empty/filled drawer and restored the framed Bob Ross empty-state composition: centered local artwork, English playful quote, localized copy and shopping action. Asset dimensions, provenance and quote typography are documented in [Main cart](main-cart.md). The image scales to the panel and viewport height; long/short viewport layouts keep content scrollable. The summary stays near the bottom of short filled carts.

Quantity edits now reuse Shopify’s bundled section response instead of issuing a follow-up refresh. Active-line taps remain responsive while requests run, with pending values shared across both surfaces and final totals confirmed by Shopify. See the shared controller contract in [Main cart](main-cart.md#faster-quantity-updates).

## Free-shipping progress — 2026-09-06

The user confirmed a CHF 50 minimum and the trial-pack exception. `snippets/cart-shipping.liquid` renders the shared meter in both surfaces, including zero progress for an empty cart. Theme settings → Cart shipping exposes the CHF threshold (default 50; nonpositive disables the meter and shipping estimates) and qualifying products. An empty product selection falls back to the catalog's exact `sparklys-soda-probierpaket` handle; a nonempty selection replaces that fallback. Product IDs, not title/tag guesses, match selected products. A cart containing a qualifying product receives full progress regardless of total.

For CH/LI with CHF presentment, remaining value is `max(threshold - cart.total_price, 0)` in currency subunits; progress is clamped to 0–100%. The total includes Shopify-applied cart/line discounts. At the threshold or with an eligible trial pack, show the localized qualifying message. Other destinations/currencies and disabled thresholds retain neutral shipping copy. Country is the current localization country, not a verified checkout address. Shopify checkout remains authoritative; these display settings do not alter rates and must be kept aligned manually with shipping rules, product exceptions and discount semantics. No additional rate request is issued.

The meter uses the global accent for its fill, the shared neutral progress-track token, label type, a pill track and accessible progress semantics. The shipping element intentionally has no policy link, including its neutral fallback. It is server-rendered, works on native cart reloads, and updates through existing bundled section responses after additions, quantity changes and removals. Values remain Shopify-confirmed while a mutation is pending; no animation or duplicated price calculation is introduced. Existing cart structured-data handling remains appropriate; progress is not a new entity.

Preview verification: CHF 29.40 → CHF 20.60 remaining / 59%; quantity increase to CHF 58.80 → 100%; the CHF 19.90 trial pack → 100%. Cart and drawer agree. Checked 390px phone and 1440px desktop, no horizontal overflow, and drawer Escape dismissal. A native form submission (bypassing the JavaScript handler) removed the trial pack and returned the empty-cart CHF 50.00 / 0% state. Actual checkout shipping rates and discounted-order combinations were not submitted/tested in this change.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

## Coupon entry and visibility — MVP

`snippets/cart-coupons.liquid` provides the shared known-code field, Apply action, code list, remove controls and feedback inside the existing cart form, without nested forms. Entry is enhanced only when the cart controller is available. Without JavaScript, server-rendered discount allocations remain visible and a localized message directs code entry/management to checkout. Empty carts retain the illustrated shopping state; coupon entry appears once a product is present.

The controller reads Shopify's `discount_codes` on initialization and cart refresh, retaining code applicability separately from merchandise allocations. Initial hydration completes before mutations to prevent stale state overwrites. Normal coupon application uses one `cart/update.js` request with the complete intended code set and bundled sections. Quantity changes still use `change.js`; coupon payloads never include quantities. Cart opening/reconciliation reads section HTML and code state in parallel; additions also read code state because the add response is not a complete cart snapshot. All mutations share the existing busy lock.

Line/product allocations show beside the affected item; order allocations are labeled in totals, with automatic promotions distinguished from entered codes. Shopify totals and savings remain authoritative. Codes are compared case-insensitively and escaped in Liquid or rendered with textContent. Accepted codes with no visible merchandise allocation receive a neutral checkout-confirmation message, never an inferred free-shipping claim. Inapplicable codes are explicitly labeled and removable. Adding/removing a code preserves the other submitted codes, including temporarily inapplicable ones. Comma-separated input is rejected with a request to enter one code at a time.

Note/coupon drafts survive section replacement; rejected input stays editable, successful input clears, and focus returns to the originating field unless the drawer was closed. Offline/missing-response recovery reads state without blindly retrying a mutation. Checkout is disabled during mutations and restored afterward. Discounts update the shipping threshold from the returned cart total; final shipping-only benefits remain checkout-dependent. No promotion catalog, private-code discovery, app, new icon or additional JSON-LD is introduced.

Validation: seven state-regression tests run in `npm run check:cart` and the main check command. Actual preview tests verified invalid-code applicability responses, removal, cart/drawer synchronization, quantity updates, draft persistence, offline recovery, phone/desktop layout and Escape. A browser with scripts disabled verified hidden enhanced entry, visible checkout fallback and native quantity updates. Accepted-code, combination and unallocated-benefit branches are covered by fixtures; real successful product/order/shipping codes and checkout retention still require merchant-provided valid test codes. No discounts were created and no order was placed.


## Shipping estimate — 2026-09-06

The confirmed rule is CHF 9 below CHF 50, free from CHF 50 or when a qualifying trial pack is present. Theme settings → Cart shipping now exposes the flat rate (default CHF 9) alongside the threshold and qualifying products. These merchant-maintained settings do not configure Shopify shipping rates.

The shared `cart-shipping` snippet renders totals with `mode: 'totals'`, reusing the progress meter's destination, currency, discounted cart total and product eligibility logic. Both cart surfaces show merchandise subtotal, existing order discounts, estimated shipping, and estimated total (`cart.total_price` plus shipping). Carts not requiring shipping receive zero shipping. Empty carts have no totals. Unsupported destinations/currencies or a disabled threshold retain the merchandise total and checkout guidance. The estimate follows the localization country, not a verified shipping address. Final shipping, taxes and shipping-code benefits are explicitly confirmed at checkout; shipping discounts are not inferred from accepted codes.

Liquid renders the estimate without JavaScript, and existing bundled section updates refresh it without another network request or client-side price calculation. English and German labels are localized. No additional structured entity is introduced. Preview checks at phone and desktop sizes confirmed CHF 29.40 + CHF 9 = CHF 38.40, CHF 58.80 with free shipping, and the CHF 19.90 qualifying trial pack with free shipping on both surfaces. Checkout rates and real successful shipping-code combinations remain unverified.


### Fixed shipping labels and currency — 2026-09-06

The merchant confirmed the simple shipping rules are maintained consistently with checkout. Supported carts now label the rows Shipping and Total, without estimated wording or a checkout-confirmation notice; the tax-included line remains when Shopify reports included taxes. Unsupported-market fallback guidance and unallocated coupon feedback remain applicable. Calculations and editable shipping settings are unchanged. Shopify checkout still determines the actual charge; maintain these settings alongside Shopify rates.

All cart amounts, including progress, line prices, allocations and totals, use `cart-money.liquid`: Shopify's `cart.currency.iso_code` followed by `money_without_currency`. This displays the presentment ISO code once (CHF 38.40), avoiding the store's configured `SFr. 38.40 CHF` format without changing global Shopify settings or checkout. This revision supersedes earlier estimate-label and checkout-notice descriptions above.

Discount-code and order-discount labels end with a decorative 🏷️ emoji; savings ends with 🤑 and the shipping cost label ends with 🚚. These user-requested emojis are hidden from assistive technology, preserving the translated text labels.


### Shipping progress panel — 2026-09-07

The shared progress message and meter sit in a padded, rounded General Muted surface panel with centered text. A decorative 📦 precedes the label and ✌️ follows it. At the existing qualifying threshold or trial-pack condition, the panel uses shared Success surface and Success text tokens, and the trailing emoji becomes 🥳. Returning below eligibility restores the neutral panel. Empty carts remain neutral. Emojis are hidden from assistive technology; translated messages and accessible progress semantics remain unchanged. The track uses Surface to remain visible within the muted panel; the fill retains the global Accent. Server-rendered state updates through the existing section responses without extra requests or animation.


### Drawer footer — 2026-09-07

The drawer ends with the checkout button. The merchant requested removal of the secondary View cart link (Warenkorb ansehen); the cart page remains available at Shopify’s cart route.

The compact shipping panel uses 8px vertical / 12px horizontal padding, 6px message-to-track spacing, a 6px track, and 16px bottom spacing. Message typography uses the shared Small role. These dimensions apply consistently to both cart surfaces and both eligibility states.

Cart supporting panels, product image tiles and applied-code rows use the shared 8px Compact radius. Buttons, quantity controls, form fields and the pill-shaped progress meter retain their existing radii. The coupon field label is visually hidden but remains accessible; its placeholder is Enter discount code / Rabattcode eingeben. The existing decorative 🏷️ emoji now precedes each applied-code row in both Liquid and JavaScript rendering.

The shipping progress panel uses General Warm surface (`--color-surface-warm`, currently #f2f2f2) for a lighter neutral gray than Muted surface. The qualified state continues to use shared Success surface/text.
