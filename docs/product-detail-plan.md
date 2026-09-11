# Product detail first-section plan

Status: first-section implementation completed in local development, 2026-09-11. See [Main product](sections/main-product.md) for the current contract and [Merchant content](merchant-content.md#product-detail-shared-content--implemented-2026-09-11) for the created content model. The discovery record below explains the decisions.

## Scope

Implement the first product section for the existing Soda and Hard Seltzer templates. Keep one shared implementation with brand-aware presentation. Lower editorial sections remain merchant-composed. Preserve the existing neutral product experience for merchandise.

Figma references: Soda Yuzu `5761:21027`, Soda Blueberry `6092:3509`, Hard Seltzer Maracuja `6619:20364`, Hard Seltzer Holunder `6622:10008`, in file `wU2QCDnknQPBZd4hacOOjq`. Purchase-panel references inspected in detail: `5904:21392`, `6619:20506`; subscription explanation: `5904:21391`.

## Existing product data audited through Shopify Liquid console

| Existing field | Type / observed values | Implemented use |
| --- | --- | --- |
| `custom.brand_variant` | `soda` on Soda products; `hardseltzer` on Maracuja | Canonical explicit product brand classification; normalize to internal `soda` / `seltzer` |
| `custom.contains_alcohol` | Boolean; false on Soda, true on Hard Seltzer | Continue sole age-check eligibility source; never infer from branding |
| `custom.gallery_gradient` | Single-line text containing CSS linear gradients | Gallery background; validate accepted gradient syntax, retain safe fallback |
| `custom.soda_background_color` | Color | Product-section/page canvas background for Soda; retain key despite its Soda-specific name |
| `custom.gallery_image_1`, `_2`, `_3` | File references | Existing marketing media below the product-media slider |
| `custom.teaser_image` | Existing image reference | Audit suitability for flavour links before adding another asset field |
| `custom.hide_in_collection` | Boolean | Preserve its existing listing meaning; do not automatically exclude variety packs from flavour links |
| `custom.teaser_category_name` | Text | Reuse where the existing editorial category label fits |

Observed values: Yuzu page `#f0eee7` with yellow/orange gallery gradient; Blueberry page `#e9edf2` with blue gradient; Soda Variety Pack page `#efede5` with yellow/orange gradient. The three gallery references are populated on those Soda products. Maracuja and Holunder did not expose those fields in their populated custom namespace. The audit found missing brand values on Holunder and Hard Seltzer Variety Pack; both were filled with `hardseltzer` during the authorized cleanup. Template/collection fallbacks remain available for unclassified resources.

This audit covers populated storefront-readable custom fields on representative products, not a complete Admin definition inventory. Confirm missing/unpopulated definitions before any new definition is created. Do not duplicate background, gallery, alcohol or brand fields.

## Shared content ownership

- **Brand resolver:** extend `snippets/brand-context.liquid`, not a separate PDP resolver. Use recognized `custom.brand_variant`, then existing template/collection fallbacks. Normalize the existing `hardseltzer` value to internal `seltzer`; do not read the retired Product world field. The normalized result controls logo, typography, palette, badge choice and related-flavour source consistently. Keep alcohol classification independent.
- **USPs:** use one reusable USP set per brand, referenced from the canonical Soda / Hard Seltzer collection. A set holds ordered USP item references plus its shared footnote; each item holds an icon and translatable caption. PDP and `usp-section` use the same renderer and collection reference. Existing localized SVG defaults remain the fallback until populated. Preserve existing section block IDs and explicit overrides; do not silently erase merchant content.
- **Subscription explanation:** one shop-wide `subscription_benefits` entry at stable handle `standard`, with one heading and savings/shipping/flexibility title/text pairs; the exact shared illustrations remain theme artwork. The purchase-card summary and expanded explanation consume the same entries. Render only when the selected variant has compatible recurring selling-plan allocations. Discount amounts come from the selected allocation, not the benefit text.
- **Flavour links:** an ordered product-reference list per canonical brand collection. Links navigate to separate products; packaging remains the Shopify variant selector. Explicit ordering allows variety packs without including unrelated products or duplicating lists per flavour.
- **Payments:** extract the current eight footer SVG marks into one shared snippet used by footer and PDP. Preserve the current set initially. The footer presently contains static icons, not a verified dynamic list of enabled payment methods.
- **Shipping:** reuse `free_shipping_threshold`, `flat_shipping_rate`, qualifying products, supported destination/currency handling and the store shipping-policy URL. Any subscription free-shipping exception must be represented centrally and reflected in the cart as well; the current implementation has no subscription exception flag.

## Gallery, badges and responsive layout

Desktop follows Figma's approximate 620/520 split within the shared content frame: media slider and marketing grid on the left, purchase information on the right. Use all supported `product.media` entries for the slider, with selected-variant media synchronization, accessible arrows/counter, touch navigation and a usable no-JavaScript fallback. Render the existing three marketing fields as one wide image and two smaller images; absent media leave no empty placeholders.

On phones, use a single DOM reading order: product identity, gallery, description and purchase controls, shipping/payments, USPs, marketing images and subscription explanation. CSS arranges the desktop columns without duplicating interactive forms. The buying controls should not sit below all three marketing images on mobile.

The live Soda badge already consists of two vector-only SVG layers: rotating outer text/background and a stationary central figure. Reuse exact artwork where it matches; separate the text ring from the stationary disc/figure for the new reusable component. Use equivalent exact Figma SVG layers for the alcohol badge. No PNG fallback. Rotation is slow/linear, pauses offscreen and in hidden tabs, stops for reduced motion, and needs a discoverable pause mechanism for continuous decorative motion. Scope any inline SVG IDs per instance. Do not use brand identity alone as proof of 5% ABV for future products with differing strength.

## Subscription and commerce findings

Live Soda Variety Pack and Maracuja plans expose five frequencies: weekly and fortnightly at 15% off; monthly, every two months and every three months at 10% off. The universal 15% statement in the design is therefore not accurate for all current plans. Use selected-plan pricing and savings, including recurring adjustment details where applicable. Do not change plan configuration to match artwork.

Follow Shopify's [subscription theme integration](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/add-subscriptions-to-your-theme): selected-variant allocations, permitted one-time purchase, frequency selector, `selling_plan` submission, price/availability synchronization and cart plan/charge presentation. Audit the subscription app's actual portal and terms before claiming swapping, skipping or cancellation support. Preserve cart coupon, quantity, age-check and native purchase behavior.

Product review counts in Figma are placeholders until a real review source is verified. Do not render fabricated ratings or include them in structured data. Add server-rendered Product/Offer JSON-LD from actual Shopify data in the same implementation, avoiding duplicate entities.

## Resolved content decisions

1. Approved: Hard Seltzer uses six USPs, including the sugar-content item missing from the existing five-item section. Extend the shared set and use all six on both the product detail and USP section. Soda retains five. Reuse the approved Figma wording and artwork without inventing a sugar claim.
2. Subscription copy says up to 15%; actual prices use the 15%/10% allocations. Shipping retains the existing rules because the all-subscription free-shipping exception is unconfirmed. Customer portal / completed payment verification remains a launch check.
3. Definitions were audited and the missing shared USP, benefit, flavour-list and product USP-image definitions were created. Existing backgrounds, gallery fields, alcohol flag and brand field were reused.

## Implementation sequence

1. Finalize the existing-field map, resolver precedence, shared content references and commercial copy decisions.
2. Extract shared payment and USP rendering; add the product gallery, exact SVG badges and responsive first-section composition.
3. Wire packaging variants, subscription allocations/frequencies, quantity/add-to-cart, real price/availability and description expansion through existing form/motion primitives.
4. Connect shared shipping, subscription benefits, translations and Product/Offer structured data.
5. Verify Soda/Seltzer/neutral products, missing data, unavailable variants, one-time/subscription carts, keyboard, no-JavaScript fallback, reduced motion, phone/desktop layouts and interrupted transitions. Run repository quality gates.

Saved template/editor content stays authoritative; no lower sections or shared-theme content are replaced by this plan.

## Implemented verification — 2026-09-11

The complete first section includes the product-media slider, exact spinning SVG badges, marketing grid, flavour cross-links, packaging/quantity controls, one-time/subscription selector, allocation prices, shared USP facts, subscription disclosure, shipping/payment reuse and Shopify Product/ProductGroup JSON-LD. Existing JSON template placements remain unchanged.

Real Shopify preview checks confirmed a Soda 24-pack monthly subscription at CHF 52.92 in the cart, through both Ajax and native JavaScript-disabled submission. Native packaging GET reloads select the correct variant. Phone layouts have no horizontal overflow; keyboard dropdowns and reversible frequency/disclosure transitions were inspected at intermediate and settled frames. Test cart additions were removed. Repository quality gates are recorded at handoff.

No order was placed. Customer portal, payment completion, unusual prepaid/deferred plans and an all-subscription shipping exception are outside the verified current-plan journey.

Final local QA: 390px phone and 1440px desktop previews covered both Soda flavours and both Hard Seltzer flavours, with no horizontal overflow or broken PDP images. Neutral Hoodie XL correctly disabled purchase as sold out. Keyboard packaging selection synchronized variant, price and a 3px focus outline; gallery ArrowRight advanced to image 2/7. Badge pause and reduced motion stopped rotation. Reversed field/disclosure animations retained their current height/opacity and restored interaction. Portrait media are contained without vertical clipping.

Shared USP sections were verified using Shopify section-rendered HTML plus the exact section stylesheet in the isolated preview DOM; this avoids changing merchant template placements. Counts and footnotes were correct for Soda (5) and Hard Seltzer (6). ProductGroup Offer prices/currency matched real variant data. The isolated test cart was confirmed empty after cleanup.

`npm run check` passed (77 Liquid files, asset budgets, typography, eight cart tests, nineteen age tests); both JavaScript syntax checks and `git diff --check` passed. Strict `jq` reports only the existing generated comment headers in `config/settings_data.json` and `templates/index.json`; all 21 JSON files pass after those leading comments are ignored. Protected editor-owned files were preserved.
