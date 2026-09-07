# Cart coupon experience — implementation plan

Status: MVP implemented; successful live-code/checkout verification remains pending merchant-provided test codes. Requested by Sandro on 2026-09-06. Applies to the full cart and drawer. The confirmed MVP shows already-applied codes and lets customers enter known campaign/newsletter codes. Product-page hints, coupon discovery and personalized offers are outside scope.

## Decision

Implement the core experience in this native Shopify theme: applied-code visibility, entry, removal, multiple-code handling and an honest discount breakdown. No custom app is required for those controls. Shopify owns discount validity, eligibility, combinations and calculated amounts.

The reference [Discount Code Display app](https://apps.shopify.com/available-discount-coupon-list-on-cart-page) inspired the interaction, but the MVP does not list available coupons, synchronize a discount catalog, or offer private/customer-specific suggestions. Customers bring a known code from a campaign or newsletter. No promotion metaobjects, app or backend are needed for this scope.

## Customer experience

Both surfaces share one coupon component above the totals/checkout area:

- A visible Discount code field and Apply button, usable with Enter.
- Existing Shopify-confirmed codes shown immediately, each with a remove action. Applied codes remain visible without opening another disclosure.
- An explicit distinction between code discounts and automatic discounts. Automatic promotions have no fake remove button.
- Product discounts shown beside the affected product with their name and allocated saving; order-wide discounts shown in the totals area. Where Shopify provides allocations, a disclosure can explain affected items without subtracting the order discount twice.
- Original/final prices and a single total-savings summary derived from Shopify. Compare-at pricing is not a coupon saving.
- Inline pending, applied, not applicable and request-failed states. Preserve the entered code after rejection so it can be corrected. Do not claim “expired” or “minimum not met” unless the returned data proves that reason.

Use the General cart palette, shared typography, status colors, accessible labels/live announcements, 44px controls and Untitled UI icons where needed. No new popup is necessary inside the modal drawer. Update the existing checkout notice, which currently says discount codes are handled in the next step, to match the new behavior.

## Phase 1 — verify Shopify's response contract

Use an isolated preview cart and approved existing test codes. Do not create or alter live discounts during this step. Cover an order code, a product code, an automatic promotion, combinable/non-combinable codes and a shipping-only code. Inspect the returned code status, discount applications, line allocations and bundled section HTML.

The current [Cart Ajax reference](https://shopify.dev/docs/api/ajax/reference/cart#update-discounts-in-the-cart) supports a `discount` string on `cart/update.js`: comma-separated codes, with an empty string removing all submitted codes. Shopify's [Horizon cart summary](https://github.com/Shopify/horizon/blob/main/snippets/cart-summary.liquid) discovers applied codes from order/line discount applications. Its [discount controller](https://github.com/Shopify/horizon/blob/main/assets/cart-discount.js) inspects returned `discount_codes` applicability and treats shipping-only cases separately. Use these as contract references, not dependencies to copy into this theme. Older theme documentation still contains checkout-only statements; verify against the current API and actual store behavior.

Record a compact capability matrix before finalizing messaging. In particular, an HTTP 200 or a nonzero cart discount does not establish that the newly entered code applied. An accepted code without a merchandise allocation must not automatically be labeled a free-shipping code.

## Phase 2 — shared entry and state

Extend the existing cart controller and shared Liquid renderer; keep the buildless architecture.

1. Collect/deduplicate confirmed codes from Shopify's applications and, where available, its returned code-status list. Normalize comparison case while preserving display text. Never use local storage as proof of application.
2. Add/remove by submitting the complete intended code set, preserving other codes. Reconcile the entire result because Shopify may reject or replace a combination. Automatic discounts remain Shopify-controlled.
3. Serialize coupon mutations with quantity/add/remove operations through the existing controller. Do not abort an in-flight mutation and assume Shopify cancelled it. Coupon-only requests must not include quantity updates.
4. Render both cart surfaces, totals and shipping progress from the same bundled response. Normal application should need one mutation request. Use the existing read-only reconciliation path on missing sections or transport failures; never retry a mutation blindly.
5. Preserve note drafts, coupon input, focus and drawer state across section replacements. Disable checkout while a mutation is unresolved. Avoid nested forms: use a sibling coupon form or correctly associated external form controls.
6. Rehydrate existing codes on direct entry, drawer opening, reload, discount-link landing and return from checkout. Verify codes that appear in JSON but not Liquid allocations; do not lose them when applying a second code. Cross-tab changes must reconcile on the next cart refresh.

Keep core cart editing and checkout available without JavaScript. Verify a native apply/return flow rather than assuming Ajax parameters behave identically on native POST. If inline validation cannot be provided without JavaScript, display confirmed server-rendered allocations and a clear checkout-code fallback. Do not show an apparently working button that silently fails.

## Shipping and changing eligibility

Recalculate the current threshold meter from Shopify's updated merchandise total after discounts. An order code can move a cart below the CHF 50 threshold; the confirmed trial-pack exception still applies.

A shipping-code benefit is separate from the spend threshold. Only describe confirmed shipping status and amounts that the available Shopify response supports. Otherwise say that the benefit is checked at checkout, without claiming shipping is already free or fabricating a monetary saving. Revalidate after quantity changes, removals, sign-in and destination changes. Checkout remains the authority.

## Explicitly outside the MVP

Available-offer lists, coupon recommendations, promotion metaobjects, discount-catalog synchronization, personalized/private offers, product-page coupon hints and automatic best-code selection. Shopify still validates whatever known code the customer enters; the theme does not manufacture or advertise eligibility.

## Acceptance and delivery

- Cart and drawer show the same codes, allocations, totals and savings before and after reload.
- Order, product, automatic, fixed/percentage, stacked and rejected combinations display accurately; one removal preserves remaining codes.
- Invalid/unavailable codes, whitespace/case duplicates, empty cart, quantity-dependent eligibility, slow responses, missing sections and offline failures have clear behavior.
- Test shipping-only and discount-link entry explicitly; do not infer them from product/order code tests.
- Native checkout entry and express checkout where present retain the confirmed codes. Inspect checkout without placing an order.
- Verify EN/DE, CH/LI in CHF, phone/desktop, keyboard, focus restoration, reduced motion and JavaScript-disabled fallback.
- Test fixtures should cover state reconciliation and discount arithmetic boundaries; real preview codes verify Shopify behavior that mocks cannot prove.
- Run the repository quality gates and update cart/drawer contracts, commerce/status docs and locale copy in the implementation change. No new Product/Offer JSON-LD for transactional cart discounts; the existing cart decision remains valid. Reassess structured data if a later public promotion model represents an independently meaningful entity.

Implement phases 1–2 only. They deliver known-code entry and transparent applied-discount visibility in both cart surfaces without an app. No coupon-discovery work is required for this MVP.

Implementation details and validation limits: [Main cart](sections/main-cart.md#coupon-entry-and-visibility--mvp).
