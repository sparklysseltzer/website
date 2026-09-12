# Main product

Source: `sections/main-product.liquid`; scoped enhancement: `assets/product-detail.js`; styles: `assets/product-detail.css`.

Templates: existing `product.json`, `product.soda.json` and `product.seltzer.json`. One section implements the complete first product section. Lower editorial sections remain merchant-composed; this change does not replace template JSON.

## Presentation and content

The central `brand-context` resolver supplies Soda, Hard Seltzer or neutral presentation. `custom.brand_variant` is authoritative; `hardseltzer` normalizes to `seltzer`. Alcohol eligibility remains exclusively `custom.contains_alcohol`.

- Desktop uses a 75rem, approximately 620/520 two-column composition. Phone order is identity, gallery, purchase information, then supporting marketing/USPs/benefits. Controls are not duplicated.
- All Shopify product media appear in a horizontal scroll-snap gallery with arrow controls, keyboard Left/Right navigation, counter and touch scrolling. Initial entry shows the first image; explicit variant URLs and subsequent variant changes select assigned media. Images use Shopify responsive CDN output. Native videos pause when their slide leaves view.
- Existing `custom.gallery_gradient` supplies a validated linear-gradient background. `custom.soda_background_color` supplies the whole page canvas through the layout’s shared `--color-page-background`, including the PDP and space before the footer. An empty value falls back to white in every brand context. Existing product photographs retain their own background and colors.
- Existing `custom.gallery_image_1`, `_2`, `_3` produce a wide marketing image and two square images below the gallery. Missing references produce no empty placeholders. Soda references are populated. Maracuja and Holunder use the exact three Figma compositions as bundled WebP fallbacks while their existing fields are blank; Shopify-selected images always win. Other products have no inferred marketing fallback.
- Soda uses shared Display typography and Erode; ordinary titles use the Section role. Maracuja/Holunder reuse the exact existing SVG flavour lockups as artwork, with the complete title accessible in the h1. Newake standalone headings do not receive a blind optical offset.
- The canonical brand collection's `custom.flavour_products` ordered product list supplies cross-links. Collection products remain a fallback. Packaging controls select variants of the current product. Known flavours reuse exact SVG fruit artwork; new products fall back to their teaser/featured image.
- `custom.usp_set` on the brand collection supplies the shared USP items and footnote. Soda has five, Hard Seltzer six. See [USP](usp-section.md).
- `subscription_benefits` entry `standard` supplies the illustrated disclosure; the compact purchase summary uses theme locale UI. Defaults say **up to 15%**; actual savings follow the selected selling plan. See [Merchant content](../merchant-content.md).
- Shipping reads the existing threshold, flat rate and qualifying-product theme settings, the CH/LI + CHF gate, and Shopify's shipping-policy URL. No unconfirmed subscription-free-shipping exception is introduced. `payment-icons` is shared with the footer.

## Purchase behavior

The native Shopify buy form submits the selected variant ID, quantity and `selling_plan`. A separately associated GET form reloads the selected variant without JavaScript. The native plan dropdown includes one-time purchase when permitted. Required-plan products select their first available allocation.

JavaScript synchronizes variant price, compare-at price, availability, quantity minimum/increment/maximum, assigned media, plan allocations and URL parameters. Packaging changes preserve a compatible plan, or select the new variant's first allocation when subscription was selected. The quantity total updates in the add button. One-time/subscription radios enhance the native selector; Shopify supplies the five current frequencies and their real 15%/10% prices.

The existing shared cart controller handles additions, errors, stock warnings and success notifications. `ProductForm` uses the actual submitter, so the native variant-update button cannot become the Ajax loading/focus target. Cart rows retain selling-plan identity and prices during quantity edits.

App blocks are supported deliberately through `@app` blocks. Accelerated checkout, pickup availability and custom line-item property controls are not included in this design.

## Motion and accessibility

Shared duration/easing tokens govern gallery movement, price changes, description expansion, frequency-field expansion and the benefits disclosure. Reversed expansions start at their currently painted height/opacity. Hidden closing controls become inert until the transition completes; unchanged prices and selections do not replay motion. All controls retain shared keyboard focus and native form fallbacks.

SVG badge text rotates over a stationary disc/symbol. It pauses offscreen, in hidden tabs, and for reduced motion; it loops every 40 seconds, with a keyboard-accessible pause toggle. The Soda text ring occupies 92% of the badge instead of 84%. The 5% artwork is restricted to the three audited Hard Seltzer products with alcohol explicitly true; future strengths require approved artwork/data. Decorative assets have empty alt text; the badge exposes one translated description.

## Structured data

One server-rendered Shopify `product | structured_data` entity supplies real Product/ProductGroup and Offer data, including variant URLs, prices, currency and availability. No invented ratings or reviews. Interactive variant data is separately escaped JSON, not another SEO entity.

## Scope and remaining verification

The current catalog uses a small packaging variant list and standard recurring plans. Liquid's product-variant limit applies; catalogs exceeding 250 variants need an option-based section-fetch implementation. Prepaid/deferred plans, external-video pause integration, the subscription customer portal and completed checkout/payment flows require their own end-to-end verification before claiming full support. The current implementation does not change Shopify shipping or subscription rules.

Local preview checks cover phone/desktop layouts, real plan/pack changes and subscription add-to-cart. See the implementation verification notes in [PDP plan](../product-detail-plan.md).

Crossed-out original prices use the shared second accent (`--color-accent-secondary`, default `#FF6600`), including subscription comparisons where rendered. Price calculations and discount eligibility are unchanged.

## Breakpoint visibility

Essential-function exception: this section stays available at every breakpoint and does not expose hide controls. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Ananotes refinements — 2026-09-11

Desktop identity and purchase controls share a sticky column. A ResizeObserver updates its offset so tall purchase content can scroll far enough to expose the add button; mobile retains identity, gallery, purchase and supporting content order. Description truncation measures after fonts load and on resize in every brand world.

Subscription frequency sits inside the compact subscription panel before its centered Figma tick list. Original/current prices appear together in that panel; the redundant price row is hidden only for enhanced plan products. Native fallback and products without plans retain their price row, plan select and product form. The summary uses localized approved Figma copy (up to 15%, Swiss free shipping, swap/skip/cancel), independently of long-form merchant benefit descriptions; this does not change Shopify shipping rules.

Flavour artwork uses its individual Figma proportions; Soda variety uses the exact two exported composite layers. The Seltzer text ring fills its badge bounds. Fine-pointer gallery arrows fade in on hover or focus; touch arrows remain visible. Duplicate brand logos are removed, and the add button reuses the header cart glyph. Shared payment assets have transparent ancestor canvases and fill the PDP row. Shipping omits trailing zero decimals only for whole amounts and has no extra policy link; fractional rates remain exact.

Verified on Yuzu, Blueberry and Maracuja: desktop/phone overflow, sticky offset, corrected artwork, description cutoff, subscription form payload, and native plan selection with product scripts blocked. Shopify checkout/payment was not submitted.

Merchant translation correction (2026-09-12): populated subscription fields and shared USP captions render directly from localized Shopify metaobjects. Blank subscription fields retain theme locale fallbacks. Never replace populated starter text with theme translations; see [language ownership](../merchant-content.md#language-ownership).

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Ananotes refinements — 2026-09-12

Flavour prompts are omitted; purchase-group and delivery labels remain screen-reader-only. Choice prices have no extra top gap, and compact benefits use a 2px row gap. The plan dropdown omits the duplicated price; German plan names normalize the known Shopify wording to `Lieferung … (15% Rabatt)`, preserving unknown names and real plan data. The same Liquid formatter supplies native options and enhanced option data. Expanding the delivery control measures its rendered border box, not scroll overflow from the visually hidden native select; the native select also has no inherited minimum height/padding. Reversals retain the currently painted starting frame.

The add-to-cart glyph uses the standard 20px inline size. No shopping-cart-plus component was returned by the connected Figma library search, so the existing library cart is retained. Shared payment artwork has a merchant-approved 5px corner treatment (an artwork exception to the general card radii).

Verification: desktop subscription expansion sampled across 25 animation frames grew monotonically from 0 to 50px, with no overshoot. Phone layout has no horizontal overflow; keyboard radio and frequency selection preserves the selected selling-plan ID. Badge pause and reduced motion work. With JavaScript disabled the 48px native plan select remains visible, with the same formatted labels, and the pause control stays hidden. Subscription add-to-cart succeeded in an isolated test session.

Subscription details (Ananotes, 2026-09-12): the delivery selector, plan terms and compact tick list share one collapsible group. Enhanced one-time purchase hides the whole group; subscription reveals it together. Height uses the rendered group size, with content fading in after expansion starts and fading out before collapse completes. Reversals start from the painted height/opacity, closing content is inert, and settled overflow is restored so the dropdown can open freely. Reduced motion settles immediately. Without JavaScript, the native selector and benefits remain visible.

Verified at 1440px and 390px: collapsed benefits are absent, opening grows monotonically with a staged fade, interrupted closure/reopening preserves the exact painted height, keyboard frequency selection retains the selling-plan ID, and the open menu is not clipped. Reduced motion hides the group immediately; no-JavaScript rendering keeps both the native selector and tick list visible.
