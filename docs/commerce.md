# Commerce integration guide

## Product page

Shopify expects a product template to expose product media/content and a product form containing variant selection and quantity. Accelerated checkout, line-item properties, and recommendations are additional supported surfaces. See [Product template](https://shopify.dev/docs/storefronts/themes/architecture/templates/product).

Our rules:

- Submit Shopify variant IDs, never product IDs, in add-to-cart forms.
- Keep a normal server-rendered product form as the fallback.
- When variant selection changes, update price, availability, media, quantity rules, and accessible status together.
- Do not assume all products have only a small number of variants or one option.
- Add accelerated checkout only after its placement and compatibility are intentionally designed.

## Cart

The cart must display line items, quantities, totals, discounts, properties, selling-plan details, and a reliable checkout action as applicable. See [Cart template](https://shopify.dev/docs/storefronts/themes/architecture/templates/cart).

For JavaScript enhancement, use the locale-aware [Cart Ajax API](https://shopify.dev/docs/api/ajax/reference/cart). Build endpoints from `window.Shopify.routes.root` and handle non-2xx JSON responses visibly.

Current cart gaps before production:

- cart-level and line-level discounts;
- selling-plan names and checkout charge details;
- line-item properties;
- quantity rules and inventory-specific messaging;
- optional notes/attributes if the business requires them;
- more accessible table semantics and price labels.

## Subscriptions

Subscriptions are supported by Shopify but not automatically supported by a custom theme. Shopify requires coordinated behavior across product and cart surfaces. See [Add subscriptions to your theme](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/add-subscriptions-to-your-theme).

Required before claiming subscription support:

1. render selling plan groups and allocations for the selected variant;
2. offer one-time purchase when permitted;
3. submit the selected `selling_plan` ID with the variant;
4. update available plans and pricing when variants change;
5. show applied plan names, pricing, and checkout charge information in the cart;
6. preserve selling-plan data in Ajax cart changes;
7. verify the chosen subscription app's customer management portal and theme extension;
8. test discounts, currencies, inventory, checkout, and accessibility.

No provider-specific subscription behavior should be invented before the installed app is identified and audited.

## Age verification and MRZ

The desired journey includes age verification using the MRZ of supported identity documents. Theme JavaScript may present a provider UI, but must not be the verification authority or contain long-lived verification secrets.

Discovery must cover:

- applicable Swiss and destination-market requirements with qualified legal/privacy review;
- trigger point: storefront entry, product interaction, cart, checkout, delivery, or a combination;
- Shopify-compatible app/provider capabilities and checkout compatibility;
- server-side verification, signed result handling, replay/fraud protection, and availability;
- data minimization, retention/deletion, processor agreements, hosting region, and consent notices;
- accessible fallback, manual review, retry, device/camera limitations, and support operations;
- analytics redaction so MRZ or document data never enters storefront events.

Until that is resolved, age verification is a product requirement and architecture decision record—not a client-side component task.

## Coupon experience

Shopify's Cart Ajax API now supports adding or removing discount codes through the `discount` parameter on `cart/update.js`; see [Update discounts in the cart](https://shopify.dev/docs/api/ajax/reference/cart#update-discounts-in-the-cart). Final behavior still depends on Shopify's discount validation and combinations.

Desired surfaces:

- full cart: entry, apply/remove feedback, applied codes, savings, and invalid/inapplicable states;
- cart drawer: the same state without divergence from the full cart;
- product detail: applied-code visibility where it can be derived reliably;
- product detail with no code: an eligible coupon hint that never implies guaranteed savings.

The implementation must use one source of cart truth, preserve locale-aware routes, refresh totals after every change, announce status accessibly, treat codes case-insensitively, and avoid exposing private/segment-specific codes to ineligible visitors.

Open decisions include whether product-page hints are configured in Shopify, driven by a promotion app, or supplied by a custom service; how multiple/combined codes appear; and how automatic discounts are explained alongside codes.

## Cart-drawer offers and free-shipping upsell

The cart drawer should support two future conversion patterns:

1. a “last-minute sale” or “others took this” module whose exact product meaning still needs definition;
2. relevant add-on recommendations plus progress toward free shipping.

Before building either, define recommendation source, eligibility, inventory handling, merchandising control, analytics, dismiss behavior, repetition limits, and fallbacks. An app, Shopify product recommendations, manually selected products, or custom logic might own the offers.

Free-shipping progress must be calculated from the same effective threshold used by Shopify for the current market/currency and must account for qualifying subtotal semantics and discounts. If the shipping rule cannot be read reliably by the theme, use a synchronized configuration or app rather than silently duplicating business logic.

## Markets, currencies, and languages

Shopify Markets can introduce locale and market path prefixes. [Support multiple currencies and languages](https://shopify.dev/docs/storefronts/themes/markets/multiple-currencies-languages) requires:

- `routes` and resource URLs in Liquid;
- `window.Shopify.routes.root` for storefront Ajax;
- localization forms for country/language selection;
- a no-JavaScript form fallback;
- structured-data currency from `cart.currency.iso_code`;
- translation keys in storefront locale files and, when needed, schema locale files.

The current theme is URL-aware but does not yet expose country or language selectors.

Planned rollout:

- initial markets: Switzerland and Liechtenstein;
- required storefront languages: German and English;
- likely additional Swiss languages: French and Italian;
- possible later markets: Germany, Austria, France, and Italy.

The repository can supply theme-interface translations, but Shopify must separately publish the languages and hold translations for merchant content such as products, collections, pages, policies, menus, section values, and SEO fields. Do not expose a language or market selector option that Shopify has not enabled.

Before adding a later market, verify catalog availability, currency and rounding, prices, discount/free-shipping thresholds, taxes/duties, shipping, subscriptions, age verification, consent/legal copy, analytics, checkout, and translated content.

## App compatibility

Backend/admin apps that operate on orders, fulfilment, inventory, or accounting usually do not require theme code. Storefront apps often do.

Classify every business-critical app as:

1. backend-only/no theme work;
2. theme app block or app embed;
3. storefront API plus custom theme UI;
4. script/pixel and consent integration;
5. incompatible or replacement required.

Sections that are valid storefront app hosts should deliberately support Shopify app blocks. Until that support is implemented and tested, app-block compatibility is a known gap.

## Integration audit inputs

Before finalizing commerce architecture, inventory the exact installed providers for:

- subscriptions;
- Klaviyo/newsletter and customer identification;
- Google, Meta, and TikTok analytics/advertising;
- consent management;
- reviews, recommendations, bundles, or upsells;
- retailer/store finder;
- customer accounts and subscription management.

For each provider, record placement, data source, required scripts/API, consent category, checkout behavior, failure mode, and test plan.
