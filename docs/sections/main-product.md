# Main product

Source: `sections/main-product.liquid`; scoped enhancement: `assets/product-detail.js`; styles: `assets/product-detail.css`.

Templates: existing `product.json`, `product.soda.json` and `product.seltzer.json`. One section implements the complete first product section. Lower editorial sections remain merchant-composed; this change does not replace template JSON.

## Presentation and content

The central `brand-context` resolver supplies Soda, Hard Seltzer or neutral presentation. `custom.brand_variant` is authoritative; `hardseltzer` normalizes to `seltzer`. Alcohol eligibility remains exclusively `custom.contains_alcohol`.

- Desktop uses a 75rem, approximately 620/520 two-column composition. Phone order is identity, gallery, purchase information, then supporting marketing/USPs/benefits. Controls are not duplicated.
- All Shopify product media appear in a horizontal scroll-snap gallery with arrow controls, keyboard Left/Right navigation, counter and touch scrolling. Initial entry shows the first image; explicit variant URLs and subsequent variant changes select assigned media. Images use Shopify responsive CDN output. Native videos pause when their slide leaves view.
- Existing `custom.gallery_gradient` supplies a validated linear-gradient background. `custom.soda_background_color` supplies the section canvas. Existing product photographs retain their own background and colors.
- Existing `custom.gallery_image_1`, `_2`, `_3` produce a wide marketing image and two square images below the gallery. Missing references produce no empty placeholders. Soda references are populated. Maracuja and Holunder use the exact three Figma compositions as bundled WebP fallbacks while their existing fields are blank; Shopify-selected images always win. Other products have no inferred marketing fallback.
- Soda uses shared Display typography and Erode; ordinary titles use the Section role. Maracuja/Holunder reuse the exact existing SVG flavour lockups as artwork, with the complete title accessible in the h1. Newake standalone headings do not receive a blind optical offset.
- The canonical brand collection's `custom.flavour_products` ordered product list supplies cross-links. Collection products remain a fallback. Packaging controls select variants of the current product. Known flavours reuse exact SVG fruit artwork; new products fall back to their teaser/featured image.
- `custom.usp_set` on the brand collection supplies the shared USP items and footnote. Soda has five, Hard Seltzer six. See [USP](usp-section.md).
- `subscription_benefits` entry `standard` supplies one reusable explanation to the purchase summary and illustrated disclosure. Defaults say **up to 15%**; actual savings follow the selected selling plan. See [Merchant content](../merchant-content.md).
- Shipping reads the existing threshold, flat rate and qualifying-product theme settings, the CH/LI + CHF gate, and Shopify's shipping-policy URL. No unconfirmed subscription-free-shipping exception is introduced. `payment-icons` is shared with the footer.

## Purchase behavior

The native Shopify buy form submits the selected variant ID, quantity and `selling_plan`. A separately associated GET form reloads the selected variant without JavaScript. The native plan dropdown includes one-time purchase when permitted. Required-plan products select their first available allocation.

JavaScript synchronizes variant price, compare-at price, availability, quantity minimum/increment/maximum, assigned media, plan allocations and URL parameters. Packaging changes preserve a compatible plan, or select the new variant's first allocation when subscription was selected. The quantity total updates in the add button. One-time/subscription radios enhance the native selector; Shopify supplies the five current frequencies and their real 15%/10% prices.

The existing shared cart controller handles additions, errors, stock warnings and success notifications. `ProductForm` uses the actual submitter, so the native variant-update button cannot become the Ajax loading/focus target. Cart rows retain selling-plan identity and prices during quantity edits.

App blocks are supported deliberately through `@app` blocks. Accelerated checkout, pickup availability and custom line-item property controls are not included in this design.

## Motion and accessibility

Shared duration/easing tokens govern gallery movement, price changes, description expansion, frequency-field expansion and the benefits disclosure. Reversed expansions start at their currently painted height/opacity. Hidden closing controls become inert until the transition completes; unchanged prices and selections do not replay motion. All controls retain shared keyboard focus and native form fallbacks.

SVG badge text rotates over a stationary disc/symbol. It pauses offscreen, in hidden tabs, through an accessible 44px pause toggle, and for reduced motion. The 5% artwork is restricted to the three audited Hard Seltzer products with alcohol explicitly true; future strengths require approved artwork/data. Decorative assets have empty alt text; the badge exposes one translated description.

## Structured data

One server-rendered Shopify `product | structured_data` entity supplies real Product/ProductGroup and Offer data, including variant URLs, prices, currency and availability. No invented ratings or reviews. Interactive variant data is separately escaped JSON, not another SEO entity.

## Scope and remaining verification

The current catalog uses a small packaging variant list and standard recurring plans. Liquid's product-variant limit applies; catalogs exceeding 250 variants need an option-based section-fetch implementation. Prepaid/deferred plans, external-video pause integration, the subscription customer portal and completed checkout/payment flows require their own end-to-end verification before claiming full support. The current implementation does not change Shopify shipping or subscription rules.

Local preview checks cover phone/desktop layouts, real plan/pack changes and subscription add-to-cart. See the implementation verification notes in [PDP plan](../product-detail-plan.md).
