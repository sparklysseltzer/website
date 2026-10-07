# Main product

Source: `sections/main-product.liquid`; shared renderer: `snippets/product-detail.liquid`; scoped enhancement: `assets/product-detail.js`; styles: `assets/product-detail.css`.

Templates: existing `product.json`, `product.soda.json` and `product.seltzer.json`. One section implements the complete first product section. Lower editorial sections remain merchant-composed; this change does not replace template JSON.

## Presentation and content

The central `brand-context` resolver supplies Soda, Hard Seltzer or neutral presentation. `custom.brand_variant` is authoritative; `hardseltzer` normalizes to `seltzer`. Alcohol eligibility remains exclusively `custom.contains_alcohol`.

- Desktop uses a 75rem, approximately 620/520 two-column composition. Phone order is identity, gallery, purchase information, then supporting marketing/USPs/benefits. Controls are not duplicated.
- All Shopify product media appear in a horizontal scroll-snap gallery with arrow controls, keyboard Left/Right navigation and touch scrolling. Initial entry shows the first image; explicit variant URLs and subsequent variant changes select assigned media. Images use Shopify responsive CDN output. Native videos pause when their slide leaves view.
- Existing `custom.gallery_gradient` supplies validated layered linear/radial gradients. Optional image-only `custom.gallery_background_image` takes precedence through the shared `product-background` renderer. `custom.soda_background_color` supplies the whole page canvas through the layout’s shared `--color-page-background`, including the PDP and space before the footer. An empty value falls back to white in every brand context. Existing product photographs retain their own background and colors.
- Existing `custom.gallery_image_1`, `_2`, `_3` produce a wide marketing image and two square images below the gallery. Missing references produce no empty placeholders. Soda references are populated. Maracuja and Holunder use the exact three Figma compositions as bundled WebP fallbacks while their existing fields are blank; Shopify-selected images always win. Other products have no inferred marketing fallback.
- Soda uses shared Display typography and Erode; ordinary titles use the Section role. Maracuja/Holunder reuse the exact existing SVG flavour lockups as artwork, with the complete title accessible in the h1. Newake standalone headings do not receive a blind optical offset.
- The canonical brand collection's `custom.flavour_products` ordered product list supplies cross-links. Collection products remain a fallback. Packaging controls select variants of the current product. Known flavours reuse exact SVG fruit artwork; new products fall back to their teaser/featured image.
- `custom.usp_set` on the brand collection supplies the shared USP items and footnote. Soda has five, Hard Seltzer six. See [Product benefits](usp-section.md).
- `subscription_benefits` entry `standard` supplies the illustrated disclosure; the compact purchase summary uses theme locale UI. Defaults say **15% on every subscription order**; actual prices follow the selected selling plan. See [Merchant content](../merchant-content.md).
- Shipping reads the existing threshold, flat rate and qualifying-product theme settings, the CH/LI + CHF gate, and Shopify's shipping-policy URL. Subscriptions use the merchant-confirmed free-shipping exception described below. `payment-icons` is shared with the footer.

## Purchase behavior

The native Shopify buy form submits the selected variant ID, quantity and `selling_plan`. A separately associated GET form reloads the selected variant without JavaScript. The native plan dropdown includes one-time purchase when permitted. Required-plan products select their first available allocation.

JavaScript synchronizes variant price, compare-at price, availability, quantity minimum/increment/maximum, assigned media, plan allocations and URL parameters. Packaging changes preserve a compatible plan, or select the new variant's first allocation when subscription was selected. The quantity total updates in the add button. One-time/subscription radios enhance the native selector; Shopify supplies five delivery frequencies (2, 4, 6, 8 and 12 weeks), each with a real 15% discount.

The existing shared cart controller handles additions, errors, stock warnings and success notifications. `ProductForm` uses the actual submitter, so the native variant-update button cannot become the Ajax loading/focus target. Cart rows retain selling-plan identity and prices during quantity edits.

App blocks are supported deliberately through `@app` blocks. Accelerated checkout, pickup availability and custom line-item property controls are not included in this design.

## Motion and accessibility

Shared duration/easing tokens govern gallery movement, price changes, description expansion, frequency-field expansion and the benefits disclosure. Reversed expansions start at their currently painted height/opacity. Hidden closing controls become inert until the transition completes; unchanged prices and selections do not replay motion. All controls retain shared keyboard focus and native form fallbacks.

SVG badge text rotates over a stationary disc/symbol. It pauses offscreen, in hidden tabs, and for reduced motion; it loops every 40 seconds independently of gallery hover, focus and manual interaction. The Soda text ring occupies 92% of the badge instead of 84%. The 5% artwork is restricted to the three audited Hard Seltzer products with alcohol explicitly true; future strengths require approved artwork/data. Decorative assets have empty alt text; the badge exposes one translated description.

## Structured data

One server-rendered Shopify `product | structured_data` entity supplies real Product/ProductGroup and Offer data, including variant URLs, prices, currency and availability. No invented ratings or reviews. Interactive variant data is separately escaped JSON, not another SEO entity.

## Scope and remaining verification

The current catalog uses a small packaging variant list and standard recurring plans. Liquid's product-variant limit applies; catalogs exceeding 250 variants need an option-based section-fetch implementation. Prepaid/deferred plans, external-video pause integration, the subscription customer portal and completed checkout/payment flows require their own end-to-end verification before claiming full support. The current implementation does not change Shopify shipping or subscription rules.

Local preview checks cover phone/desktop layouts, real plan/pack changes and subscription add-to-cart. See the implementation verification notes in [PDP plan](../archive/product-detail-plan.md).

Crossed-out original prices use the shared second accent (`--color-accent-secondary`, default `#FF6600`), including subscription comparisons where rendered. Price calculations and discount eligibility are unchanged.

## Breakpoint visibility

Essential-function exception: this section stays available at every breakpoint and does not expose hide controls. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Ananotes refinements — 2026-09-11

Desktop identity and purchase controls share a sticky column. A ResizeObserver updates its offset so tall purchase content can scroll far enough to expose the add button; mobile retains identity, gallery, purchase and supporting content order. Description truncation measures after fonts load and on resize in every brand world.

Subscription frequency sits inside the compact subscription panel before its centered Figma tick list. Original/current prices appear together in that panel; the redundant price row is hidden only for enhanced plan products. Native fallback and products without plans retain their price row, plan select and product form. The summary uses localized approved Figma copy (15%, Swiss free shipping, swap/skip/cancel), independently of long-form merchant benefit descriptions; this does not change Shopify shipping rules.

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

Soda Variety Pack uses the exact background-only Figma export through `custom.gallery_background_image`; its blurred vector composition supersedes the initial CSS approximation. See [product background ownership](../merchant-content.md#product-gallery-backgrounds) for source nodes and export provenance.

## Subscription motion — Ananotes 157

The collapsible group includes its fixed top spacing inside the content, so only the outer height animates. The delivery label and benefit ticks remain stationary relative to the wrapper while content fades in. Fast duration and shared UI easing replace the long settling tail. Closing content remains inert; reversal starts at its painted height/opacity, and settled overflow permits the dropdown. Native rendering retains the same spacing.

Verified in headless Chromium at 2074px and 390px: zero relative label/tick drift across sampled frames, zero height discontinuity on reversal, visible unclipped dropdown and retained plan selection. Inspected an intermediate phone frame; reduced-motion closure is immediate and blocked storefront scripts retain the native select, benefits and buy form.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

## Ananotes 159–160 — purchase and gallery continuity

Enhanced subscription frequency options contain only real selling plans. One-time purchase is owned by its radio; the frequency select retains its value and label while the panel closes, but is disabled so native FormData/Ajax submission excludes `selling_plan`. Returning to Subscribe restores that frequency. Compatible selections survive variant changes; required-plan products still submit a valid plan. The unenhanced native selector retains its one-time option, because it is the no-JavaScript purchase-type control. URL, price and submit state follow the selected purchase type independently from the remembered frequency.

The visible gallery counter and badge play/pause control are removed. Slide groups retain accessible position/count labels. Visible image galleries advance every six seconds; badge rotation runs automatically. Pointer hover pauses gallery switching and leaving resumes; clicking, touching, keyboard focus/interaction or wheel interaction stops gallery switching for that page visit. The decorative badge keeps looping independently while visible. Manual arrows and native touch/keyboard scrolling remain available. Offscreen, hidden-tab and reduced-motion states pause automatic motion. Video/model slides are not advanced automatically, and no media playback is started. Timers, observers and listeners clean up when the section disconnects. No new locale values, content migrations or commerce rules are introduced.

Verification (2026-09-28): phone/desktop frequency transitions retained the exact label across 16–17 sampled frames, with zero inner-content drift and zero reversal jump. FormData and URL checks verified selected subscriptions, one-time exclusion, frequency retention and compatible variant changes. An isolated script-blocked browser retained six native purchase options and submitted the chosen plan value. Gallery checks verified six-second advancement, hover pause/resume, persistent keyboard/touch stop (including phone autoplay 0 → 1, then remaining at 1 after touch) and no advancement under reduced motion. Visible counter/toggle elements are absent; accessible slide counts remain. No checkout or orders were submitted.

Panel-shadow rollout (2026-10-01): Gallery, marketing images, shipping, USP/benefits and subscription panels share the subtle panel shadow across all product templates. Selection borders and focus indicators are preserved; nested purchase controls remain flat. See the [shared contract](../design-system.md#panel-shadows).

Ananotes 165 (2026-10-02): at wide desktop widths (90rem and above), only the packaging trigger's value span trims its text box to cap/alphabetic edges so the visible label centers within the pill. No font, line-height, select geometry or global field styling changes. Browsers without text-box trimming retain the existing flex-centered fallback. Verified at 1881px with before/after screenshots and centered cap bounds; 390px retains `text-box-trim: none` and no overflow. Native select/value behavior is unchanged.

Regional money formatting (2026-10-02): dynamic PDP prices combine `request.locale.iso_code` with Shopify’s active `localization.country.iso_code` through `Intl.Locale`. German CH/LI uses decimal points; German DE uses commas. The currency still comes from `cart.currency.iso_code`, never from a guessed country mapping. Server-rendered prices retain Shopify’s money formatting. No language publication, market activation, currency, conversion or shop-format setting is changed. Regression tests cover CH/LI, DE (including CHF), explicit region overrides and exact fractional cents. This is preparation for regional display, not certification of unconfigured markets.
Verified development output reads language `de` / country `CH` and displays `CHF 29.40` / subscription `CHF 24.99`. Changing the actual variant to 24-pack updates to `CHF 58.80` / `CHF 49.98` and the matching add-button total. Phone has no overflow; test browser closed. Full checks include the four regional-format regression tests. Germany was tested in the formatter only, not enabled or exercised as a live market.

Ananotes 174 (2026-10-04): decoupled badge rotation from the gallery interaction-stop flag. Offscreen, hidden-tab and reduced-motion suspension remain; manual image selection does not stop the ring.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

Flavour-navigation startup stability (2026-10-06): server markup starts descriptions collapsed. Before the deferred custom element upgrades, CSS reserves the 44px disclosure-button space; JavaScript still measures overflow and preserves explicit expansion. The no-JavaScript document exposes the complete description without a mask. Maracuja/Holunder artwork shares a 320:124 box with contained intrinsic proportions, preventing image decoding from changing the identity height. No transition duration or commerce state changes.

Startup verification: at 1440px, blocking and then loading the product script kept Maracuja description height at 140px (96px text plus 44px action), with `aria-expanded=false`; expansion reached 280.5px text height. Both flavour logo boxes stayed 124px. Holunder remained collapsed at 390px with no overflow. A blocked-script/no-js CSS probe exposed the full description without masking. Full checks passed; isolated browser closed. Global navigation duration remains 400ms.


Add-to-cart fill correction (2026-10-06): removed the PDP-specific solid background and foreground overrides. The purchase button now inherits the shared primary button treatment: black fill and white label/icon at rest, then the black layer sweeps away to the transparent surface with dark text on hover or keyboard focus. Size, disabled state, price updates and native form submission are unchanged.

## Featured Soda benefit

Soda PDPs read the canonical Soda collection's optional `custom.featured_usp` and render it before `custom.usp_set` in the white benefits panel. The shared `featured-usp` snippet preserves the collection hero's merchant image, stable SVG fallback and accessible caption. The badge remains separate from the ordinary list because it is standalone, larger artwork. Blank references add no badge or empty cell. At a panel content width of 32rem or more, all six benefits share a row with a wider badge column; narrower panels use three columns. Hard Seltzer retains its existing regular set. No settings, store records or template assignments change. Existing Product structured data remains authoritative; this artwork adds no separate entity.

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.

## Single published variant

The packaging dropdown and native update-options button appear only when Liquid exposes more than one published variant. Sold-out published variants still count. A single meaningful variant title renders as plain text beside quantity, without a field border, fill, arrow or focus stop. It uses the shared UI size (16px on phones, 17px on desktop) and the quantity field font, vertically centered in the purchase row with natural wrapping. A sole default variant omits the packaging detail entirely. A hidden variant input preserves the existing enhancement contract; the native add-to-cart form retains its separate authoritative variant ID. Prices, quantity rules, subscriptions and product structured data remain Shopify-driven.

Verified at 390px and 1440px using Maracuja (one named pack), Can Opener (default variant) and Yuzu (multiple packs). Static packaging uses the 16px/17px UI size beside the 14px/15px quantity value, with matching vertical centers and no overflow. Quantity changes work; multi-pack changes update the variant form payload; one-pack subscription retains its selling-plan ID. Script-disabled rendering preserves the correct variant ID and editable quantity in all three modes. Existing server-rendered structured data is unchanged. Full repository gates, syntax, header-aware JSON and whitespace checks passed.

## Subscription shipping policy (2026-10-07)

For CH/LI in CHF, selecting a real selling-plan allocation replaces the threshold/rate hint with free subscription shipping on every delivery, without a minimum order. Initial plan URLs and required-plan defaults render the same hint in Liquid. Enhanced purchase/variant changes crossfade only changed copy and ease any resulting height change using shared motion tokens; reduced motion settles immediately. Returning to one-time purchase restores the ordinary threshold/rate and eligible-product text. A disabled threshold does not disable the subscription entitlement; unsupported destinations/currencies retain neutral checkout guidance.

English and German transactional copy and blank benefit fallbacks are localized. The shared `subscription_benefits/standard` German `shipping_text` was updated through Admin GraphQL after backing up its prior fields outside the repository. Its existing English merchant translation remains the generic rates-shown-for-your-order text: the connected app lacks translation permissions, so the theme does not override the populated translation. No discount percentages, plan frequencies or theme content JSON were changed. Product JSON-LD remains Shopify's real product/offer data; this conditional order-level shipping policy does not introduce a separate entity or an unconditional free-shipping claim on one-time offers.

Verification: phone (390px) and desktop (1440px) purchase-type switches, subscription URL initial rendering, English/German hint text and no horizontal overflow passed. Sampled 22 transition frames: copy opacity eased from 0.35 to 1 without a height jump; reduced motion created no animations. With scripts disabled, subscription and one-time URLs rendered their correct hints, and a subscription cart retained free shipping. All repository gates and JavaScript syntax checks passed. All 31 JSON files passed jq after stripping only Shopify-generated leading comment headers in memory; the raw required jq command rejects those pre-existing headers. The isolated headless browser was closed.

## Ananotes 193 (2026-10-07)

Add to cart retains an opaque shared Surface backing under its existing black oval sweep, producing black-to-white hover/keyboard-focus feedback instead of exposing the product canvas. Outline, label/icon contrast, dimensions, disabled state, native submission and reduced motion remain unchanged. Verified the white backing and no overflow at 390px/1440px and visually inspected the settled hover state.

## Shared subscription landing renderer

The section delegates its existing rendering to `product-detail` without changing its schema, section IDs or ordinary PDP behavior. The [Subscription product](subscription-product.md) section passes an explicit subscription-only mode to the same renderer, reusing commerce controls rather than maintaining a separate purchase implementation. Only that mode changes the heading level, native flavour/variant routes, required-plan presentation, description/marketing visibility and static purchase positioning.

Footnote readability (Ananotes 197 and follow-up, 2026-10-08): dedicated notes now use the [shared footnote contrast treatment](../design-system.md#footnote-contrast-ananotes-197-and-follow-up), replacing the low-contrast Notice/muted color. USP panels retain their own inherited foreground, while open notes follow the canvas. Copy, typography roles and layout are unchanged.

Ananotes 195–196: a selected subscription gives the shipping hint the shared Success surface/text colors; one-time purchase restores its Warm surface. Base transitions preserve smooth changes, with immediate reduced-motion states. Both initial Liquid plans and enhanced plan changes use the same attribute-based styling. Shared dropdown labels now receive optical trimming at every viewport. Phone/desktop rendering, keyboard plan selection and one-time/subscription color switching were verified.

## Flat subscription model (2026-10-08)

All six subscription products and their assigned variants share 2, 4, 6, 8 and 12-week billing/delivery intervals with 15% off. The localized badge says “Save 15%” / “Spare 15%”. Shared benefit source content and English translations describe the same rule. `product-plan-label` removes only the recognized trailing Shopify discount clause, preserving the frequency; the native/enhanced selectors and cart rows reuse it. Authoritative prices and plan IDs still come from allocations. Existing subscriber contracts were not changed.

Subscription-only default selection is documented in [Subscription product](subscription-product.md#default-selection-2026-10-08). The ordinary PDP retains Shopify’s selected/first available variant and one-time purchase behavior.
