# Cart drawer

Source: `sections/cart-drawer.liquid`, statically included by `layout/theme.liquid` on every page. Shared rows, empty state and totals: `snippets/cart-content.liquid`. Global controller: `assets/theme.js`; shared styling: `assets/base.css`.

## Rendering and behavior

A white right-side native modal dialog, at most 600px wide and full width on phones, follows the reference composition with a bag/title header, close button, cart rows, checkout summary and cart-page link. Short carts push the summary toward the bottom; long carts scroll the entire panel so checkout remains reachable without trapping content in a short inner scroller. The drawer always uses the neutral Newake card-size heading, including on Soda pages. Shared global Cart → Shipping settings control the free-shipping meter; see below. Compact product rows align quantity controls and line totals; the bottom summary shows the merchandise subtotal, any applicable cart discounts, estimated shipping and estimated total, and retains a cart-page link.

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

The user confirmed a CHF 50 minimum and the trial-pack exception. `snippets/cart-shipping.liquid` renders the shared meter in both surfaces, including zero progress for an empty cart. Theme settings → Cart → Shipping exposes the CHF threshold (default 50; nonpositive disables the meter and shipping estimates) and qualifying products. An empty product selection falls back to the catalog's exact `sparklys-soda-probierpaket` handle; a nonempty selection replaces that fallback. Product IDs, not title/tag guesses, match selected products. Only a nonempty cart consisting entirely of qualifying products receives the exception, regardless of total. Any nonqualifying item restores the normal threshold rule.

For CH/LI with CHF presentment, remaining value is `max(threshold - cart.total_price, 0)` in currency subunits; progress is clamped to 0–100%. The total includes Shopify-applied cart/line discounts. At the threshold or with only eligible trial-pack products, show the localized qualifying message. Other destinations/currencies and disabled thresholds retain neutral shipping copy. Country is the current localization country, not a verified checkout address. Shopify checkout remains authoritative; these display settings do not alter rates and must be kept aligned manually with shipping rules, product exceptions and discount semantics. No additional rate request is issued.

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

The confirmed rule is CHF 9 below CHF 50, free from CHF 50 or when the cart contains only qualifying trial-pack products. Theme settings → Cart → Shipping now exposes the flat rate (default CHF 9) alongside the threshold and qualifying products. These merchant-maintained settings do not configure Shopify shipping rates.

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

Item discount allocations use compact badges with shared Success surface/text and a decorative 🎟️ voucher emoji. Displayed coupon codes are uppercase, including applied-code rows above totals, without changing submitted identifiers. Applicable code rows use Success surface/text; rejected codes retain neutral styling and explicit rejection feedback. Savings label and amount use Success text, with 🤑 before the label; 🚚 precedes Shipping. The tax-included note appears beside Total using the existing Small type role (German: inkl. MwSt.), only when Shopify reports included taxes. No amounts or eligibility rules change.


### Cart control refinement — 2026-09-07

Quantity inputs use the Shopify variant minimum (at least one); stepping down clamps at that minimum and manual zero/negative values normalize before enhanced updates. Only the dedicated remove action sends zero; its native removal URL remains available without JavaScript. Stepper keyboard focus uses a neutral inset outline rather than the global accent.

Item removal uses Untitled UI trash-01 with no circular surface and retains its 44px target. Coupon markers use Untitled UI tag-01 in Success text, replacing emojis in Liquid and JavaScript. Original Line SVGs are stored locally as icon-trash.svg and icon-tag.svg from https://github.com/untitleduico/icons/tree/main/icons; license retained in docs/untitled-ui-icons-license.txt. Masks inherit semantic colors and decorative icons are hidden from assistive technology.

Shipping progress has no enclosing background or padding; its track retains Muted surface and its fill the global Accent. Cart runtime notices sit after the meter in a centered Warning surface/text panel with no View cart recovery link. Existing retry, native form and checkout behavior remains available. Original struck-through prices and subtotal/savings/shipping rows use General Notice text. Shared Success text defaults to #287a50; new Warning surface/text settings default to #fff3cd / #664d03. Existing merchant-saved values are preserved.

The drawer header retains shared heading typography and centers a 28px cart icon vertically beside it. Exact Figma-frame comparison is pending the requested frame link; no cart-frame link was present in the documentation.

Coupon feedback also uses the centered Warning surface/text treatment. Preview verification confirmed manual zero normalizes to one, trash removal returns the empty state, real SPARKLYS10 allocations render the local tag icon, and a simulated availability notice appears below the meter. Phone screenshot and desktop overflow checks passed; a fresh real inventory-limit response was not generated.

The savings row label and amount use shared Success text. Subtotal, shipping and struck-through original prices retain the lighter Notice text.

Ananotes refinements: item allocation badges use the shared Badge text role and inline-flex centering of icon/copy. Coupon chips size to their content and use the local Untitled UI Line x-close icon for removal with a 44px target and translated accessible name. Quantity focus uses a neutral background fill instead of an outline; enabled buttons transition their hover fill with reduced-motion support.

Cart annotation follow-up (2026-09-07): subtotal and shipping supporting rows now use the General Primary text role, superseding the earlier Notice-text treatment. Savings retains Success text and struck-through original prices retain Notice text. Tag icons inside item allocation micro-badges scale to 1.2em (12px with the 10px Badge role); other tag icons retain the shared 1rem size.

Applied-code chips use zero vertical and 8px horizontal padding with 44px remove controls, reducing the previous 52px chip height to 44px. Checkout uses the shared responsive Bubble Sweep, which covers the entire button at hover/focus completion.

The Newake drawer title uses the shared .06em downward optical offset to center visible capitals beside the cart icon. Flex still centers their boxes; this corrects the font-metric imbalance without altering heading line height or document flow.

Coupon chip optical spacing now uses 12px at the leading icon and a 2px rightward correction of the close glyph within its unchanged 44px target, balancing visible edge spacing. Stepper button circles are fixed inset pseudo-elements; hover/focus transitions only their fill color, never their size.

2026-09-08 Ananotes: shipping progress again uses a compact Warm surface panel with Compact radius and default text in both eligibility states. Coupon removal has an animated, low-opacity circular hover/focus surface. Changed line prices fade in over 200ms after Shopify-confirmed section replacement, with no artificial network delay and no animation for reduced motion.


### Floating cart overlay — 2026-09-08

The native dialog now floats at the right of the viewport with an 8–16px responsive gap on all surrounding edges and the shared Large radius on its outer shell. Its width remains capped at 600px and its dynamic-viewport height subtracts the outer gaps; the dialog scrolls internally for long carts. This shell intentionally uses Large radius while compact interior elements keep Compact radius. Entrance motion is a short fade/rise/scale, disabled for reduced motion. Native modal semantics, backdrop dismissal, Escape, focus handling and cart behavior are unchanged.

The floating modal now slides in from the right over 500ms with shared easing and fades its backdrop. Close button, backdrop click and Escape route through a 400ms rightward exit before native dialog.close(), retaining modal focus containment until exit completes and then restoring opener focus. Exit begins at the current transform so closing during entry does not jump; reopening cancels an outstanding exit. Reduced-motion users open/close immediately. This supersedes the earlier fade/rise/scale entrance.

The modal shell uses the shared Small radius (`--radius-small`), replacing the earlier Large radius at the merchant’s request.


### Persistent checkout footer — 2026-09-08

The shipping cost label and amount use Success text when calculated shipping is zero. The shared totals snippet accepts shipping/total parts to place only the total and checkout button in a dedicated footer, retaining one native form and one total per surface. Cart page uses a bottom-sticky footer; the drawer uses a fixed-height flex layout with an independently scrolling items/coupon/summary area, leaving shipping progress above it and checkout below it. Footer shadow appears when content remains below the scroll position and fades out at the bottom; scroll and ResizeObserver updates refresh it after cart mutations and resizing. Reduced motion disables the shadow transition. Layout works without JavaScript; overflow-sensitive shadow is progressive enhancement. Verified at 390×650 and 1440×1000, including footer visibility, green free shipping and shadow removal at scroll end. This supersedes the earlier whole-dialog scrolling contract.

The fixed shipping/status area mirrors the footer’s soft shadow downward once the inner cart scrollTop exceeds 1px; it clears at the top. Both shadows use the same blur, spread, opacity and timing, and respect reduced motion.

The top and checkout shadow surfaces extend through the modal’s horizontal inner padding to its full width. Matching negative margins and compensating padding preserve content alignment at phone and desktop sizes; the dialog clips them to its rounded shell.

For supported fixed-shipping totals with taxes included, the small inline note reads inkl. Versand & MwSt. (English: Incl. shipping & tax). Unsupported-market fallback totals retain their tax-only wording and checkout guidance.

The inner scroller clips horizontal overflow and adds 12px end padding whenever content overflows vertically, keeping rows clear of the scrollbar. Row remove targets sit inside the row’s right edge rather than extending 6px beyond it; 6px top scroller padding protects the first remove target. Full-width header/footer shadow surfaces remain outside the scroller.

Shipping progress uses global Accent while incomplete and shared Success text green for the completed/free-shipping fill. The message retains its normal text color and the surrounding light-gray surface is unchanged.

The cart shipping track uses General Notice text (`--color-notice-text`, default #9e9e9d) as its darker unfilled gray, improving separation from the light panel. Accent and qualified Success fills are unchanged.

### Curated cart recommendations — 2026-09-08

**Theme settings → Cart → Recommendations** exposes an ordered **Cart recommendations** product picker (up to Shopify’s 50-product picker limit), stored in `settings.cart_recommendation_products`. Shipping controls share the same global Cart group under Shipping. The static cart drawer section has no separate settings. No products are preselected. Merchants maintain the list in the Theme Editor; no catalog synchronization or app is required. The shared `cart-recommendations` snippet renders all selected available products whose product IDs are absent from the cart. A blank or exhausted list and an empty cart render no recommendation area. Filtering is server-rendered again with each bundled cart section response.

At widths of 1000px and above, cards float left of the 600px cart panel with a 16px gap inside the same native dialog. The dialog grows to 944px with a transparent gap, while each card and the main panel retain the shared Small radius and General surface. Short desktop viewports allow independent recommendation scrolling. Below 1000px, the same cards flow inside the cart scroller above the coupon/summary area; checkout remains fixed. No duplicate cards, focus trap, or separate overlay is introduced. Existing reduced-motion and modal entry/exit behavior applies to the complete composition.

Cards use real product titles, responsive Shopify images, and the first available variant price. Products with options or required selling plans link to their product page; no variant or plan is silently chosen. Default-variant products provide Add to cart using their minimum quantity. Associated native POST forms sit outside the main cart form to prevent nesting and unintended cart fields in the add request. JavaScript reuses the existing cart mutation/error pipeline and restores focus to the close control after section replacement. Without enhancement the associated form submits normally; the drawer itself remains progressive enhancement of the full cart page.

These are contextual navigation/purchase cards in a private cart, not new canonical product entities. No additional Product JSON-LD is emitted here; canonical product pages retain ownership of product/offer structured data. No invented savings, urgency, social proof, or product claims are shown.

Validation used a temporary development-only section sourcing real catalog products, removed after testing; saved merchant content was not changed. Verified three-card filtering, replacement after an actual add, native form submission with the cart listener disconnected, variant-option links, desktop/390px mobile layout, visible checkout, no horizontal scroller overflow, and keyboard focus wrapping. Full automated theme checks pass. Product curation remains for the merchant.

The free-shipping message displays whole CHF rounded up (`ceil`) rather than decimal money formatting: CHF 50.00 becomes CHF 50 and CHF 20.60 becomes CHF 21. Calculations, progress percentage, item prices and checkout totals retain exact cents.

### Stable editor controls and exclusive shipping exception — 2026-09-08

Both cart sections unconditionally reference all four shared Cart settings inside a design-mode-only inert template. This lets Shopify discover the same global controls in each section’s contextual Theme Settings panel even with an empty cart. No duplicate section settings or saved values are introduced; the storefront renders no editor metadata outside design mode.

The free-shipping product list is exclusive: every line must match a selected product (blank list falls back to the Soda trial pack). A mixed cart uses the discounted CHF threshold and normal flat rate, regardless of which line comes first. Quantity does not change product eligibility: multiple units of eligible products remain eligible. Empty carts do not qualify. The shared shipping snippet drives both progress and totals, including green states. Weight is not part of the confirmed rule: mixed orders at or above CHF 50 still ship free, however heavy. Theme settings do not change Shopify checkout rates; the actual checkout configuration must separately enforce the same rule.

Verified in the Shopify development Theme Editor with an empty cart: both Cart and Cart drawer contextual panels expose all four shared controls, including the existing recommendation selection. No settings were saved or changed during inspection. Real isolated cart checks passed for trial-only, mixed below threshold, mixed above threshold, and empty states; the test cart was cleared. Theme Check, cart tests, JavaScript syntax, JSON validation and whitespace checks passed.

### Product and fixed-variant recommendations — 2026-09-08

There is no three-card display limit. The existing `cart_recommendation_products` selections remain intact and render in order. `cart_variant_recommendations` is an additional ordered native metaobject-list picker; these cards follow the product cards. Both selectors are visible globally and in the contextual settings for both cart sections, including empty-cart previews. Each picker supports up to 50 selections; all eligible selections render. Empty carts still hide storefront recommendations.

Editors choose whole products with the existing product picker. Customers choose available variants through native radio chips inside each product card; each chip represents a complete Shopify variant (combined option values when applicable). Selecting a chip updates the displayed price, image, product links and quantity minimum. The external native add form submits the selected variant ID only, without nesting in or leaking fields from the main cart form. Unavailable variants are visibly disabled. Subscription-required products and products exceeding Liquid’s 250-variant enumeration boundary link to their product page for full selection rather than displaying an incomplete picker. Fixed variant references bypass this enumeration boundary.

For a specific variant, create a **Cart variant recommendation** entry under **Content → Metaobjects**, provide an administrative Name, and use Shopify’s native **Select variant** picker. Save the entry as Active, then choose it in **Theme settings → Cart → Specific variant recommendations**. This definition was provisioned in Shopify on 2026-09-08 with type `cart_variant_recommendation`, required `name` (single_line_text_field) and required `variant` (variant_reference), Active/Draft and storefront access enabled, and standalone web pages disabled. No merchandising entries or theme selections were created or overwritten during setup.

Fixed-variant cards show the referenced variant’s name, image and price and add it directly without chips. They are filtered by exact variant ID already in the cart, while whole-product recommendations retain product-ID filtering. Duplicate fixed variant references are collapsed. An editor can deliberately recommend a whole product and a particular variant of it; these remain distinct cards. Missing, draft, deleted and unavailable variant entries do not render. Product and variant availability and pricing come from Shopify; no separate JSON-LD entities or invented offer claims are introduced.

Card rendering is shared in `snippets/cart-recommendation-card.liquid`. Small buttons and product titles follow the shared design-system contract. Recommendations scroll independently on desktop; mobile cards stay above the summary in the inner cart scroller with checkout visible.

Verification: Shopify Admin’s native Add variants dialog was inspected, and the new global Specific variant recommendations picker is visible in the development Theme Editor. Real cart tests added a chosen hoodie M through chips and a fixed hoodie S without replacing M. A temporary catalog fixture rendered 11 eligible cards, then was removed. At 390×650, checkout remained at the modal bottom, there was no horizontal scroll overflow, and the small action measured 44px tall. Desktop styling was visually reviewed at 1440×1000. The isolated browser was closed; no order or shared theme-content changes were made. Automated theme, asset, typography and cart checks, JavaScript syntax, JSON and whitespace validation passed.

The recommendation heading card is removed; the aside retains its translated accessible name. Product cards start at the top of the desktop column. The native cart backdrop applies an 8px Gaussian blur alongside its existing dark scrim, animating both from transparent/unblurred over 500ms and back over 400ms with the existing slide motion. Close captures the currently rendered backdrop values to avoid a jump when interrupted during entry; reopening during exit resumes from its current backdrop. Reduced motion disables animations, and browsers without backdrop-filter retain the dark scrim.

Recommendation purchase buttons now display the selected variant’s price followed by a middle dot and the translated add label. Variant changes update only the price span, preserving the action label. The separate price row is removed for direct-add cards; product-page fallback cards retain it. Images grow from 80px to 104px with matching Shopify image sizes. Chips use 32px visual bounds with compact spacing; coarse pointers retain 44px label targets. Below 400px the button spans the grid beneath the image/details to prevent cramped price labels.

Recommendation buttons use the merchant-approved German action “Einpacken” and a single-line compact CHF price: integer francs render as `CHF 39`, fractional amounts retain their exact cents (for example `CHF 29.40`). The button reads `CHF 39 · Einpacken`; the earlier `39.-` format was rejected. This formatter is limited to recommendation buttons and their variant data; ordinary cart money remains unchanged, and other currencies retain the shared currency-aware formatter. The existing Label font role remains unchanged.

On modal entry, recommendation cards fade and slide downward from 12px above their resting position over 550ms after a 400ms delay, staggered by 90ms per card with the index capped at six so long lists are not delayed indefinitely. The main cart starts immediately. Section replacements during entry preserve the original animation timeline; ordinary cart updates do not replay it. Reduced motion shows cards immediately. Verified desktop and phone single-line labels, 104px images, compact chips, staged opacities and no replay after refresh.


### Cart update motion — 2026-09-08

After Shopify confirms a mutation, disappearing recommendation cards and cart lines dissolve over 180ms before section replacement. Retained items move into their new vertical positions over 360ms; newly added lines and returning recommendations fade downward over 420ms using the shared easing. Scroll positions are preserved. Ordinary quantity changes do not wait for an exit unless a line actually disappears. Rejected mutations do not optimistically hide cards. Reduced motion replaces content immediately.

Recommendations now also render in the empty drawer, superseding the earlier empty-cart suppression. Removing the last qualifying cart line restores its curated recommendation, in the original editor order, as long as it remains available. Whole-product cards return only when all variants of that product have left the cart; fixed-variant cards return when that exact variant leaves. On phones the empty state and recommendations share the inner scroller; on desktop recommendations retain the left column. Saved merchandising selections and checkout rules are unchanged.

Validation: real isolated desktop and phone cart additions/removals verified the 180ms exit, 360ms repositioning and 420ms return animation; removing the last item restored its recommendation. Reduced-motion verification emitted no item animations. The test cart was cleared. Phone overflow checks confirmed a single empty-state scroller and no horizontal overflow. Theme, JavaScript, JSON and whitespace checks passed.

Shipping progress updates (2026-09-08): the shared renderer carries the currently painted fill width and color across section replacement, then eases to the confirmed Shopify progress over 420ms. Changed shipping messages crossfade over 240–300ms, with height changes eased over 420ms. The old visual copy is hidden from assistive technology and removed after the fade. No additional network request or mutation delay is introduced; reduced motion applies the confirmed state immediately.

Focus treatment (2026-09-08): coupon inputs use the shared darker-border pointer focus and accent keyboard ring. Quantity inputs remain transparent, with an inset keyboard ring that fits the stepper. The global modality helper preserves the current interaction mode through programmatic focus after cart updates. See [Focus styles](../design-system.md#focus-styles).

Scrollbar gutter (2026-09-08): the inner scroller extends through the panel side padding, with its native thin scrollbar at the outer edge. Internal padding preserves the same content edges as shipping and checkout. The shared resize/scroll observer measures the native scrollbar width and subtracts it from end padding; stable gutter allocation prevents content-width changes when overflow starts. This replaces the earlier scroll-only 12px end-padding rule. Both side gutters and 6px vertical padding leave room for the standard keyboard outline. Header/footer shadows remain full width.

Notifications (2026-09-08): Temporary cart errors/inventory notices and coupon results now use the shared toast layer above the native modal. Coupon feedback retains a visually hidden description and invalid field state; duplicate in-flow announcements and layout-shifting banners are removed. Routine update/pending states remain quiet. Persistent code applicability and allocations remain in the cart. See [Notifications](../design-system.md#notifications).

Stable scroll shadows (2026-09-08): section replacements carry the existing header/footer shadow classes and scrollbar measurement into the detached fragment before insertion, and restore scroll positions immediately after insertion. This prevents quantity updates from restarting the shadow fade from zero. Overflow observation still changes shadows when the user actually reaches an edge or the content height changes.

Small-button refinement (2026-09-08): recommendation actions now use the revised shared Small button: 32px visible minimum height, tighter padding and the Small text role, compared with 48px Regular buttons. Transparent coarse-pointer hit extensions retain a 44px target without making the card visually taller. Existing native form submission and Bubble Sweep remain unchanged.

Recommendation action alignment (2026-09-08): each card keeps its natural content-driven height, with no equal-row sizing or fixed minimum. The details column stretches within that card and pushes its Small action to the bottom, leaving flexible space after shorter titles or absent variant chips. Below 400px, explicit title/options/action rows retain the bottom action placement beneath the two-row image. The merchant explicitly rejected equal-height cards; only bottom alignment within each card is intended.

Product image surfaces (2026-09-08): cart lines and recommendation thumbnails have no dedicated background surface. Product images render unmodified, without blending or color filters. The merchant owns image backgrounds and transparency: opaque backgrounds stay as supplied, while transparent areas reveal the surrounding cart or card. Source images and CDN sizing remain unchanged.

Recommendation heading (2026-09-08): localized “You can ignore this stuff, in theory. Just wanted to show you.” / “Die Sachen kannst du ignorieren, theoretisch. Wolltens nur mal zeigen.” appears above eligible cards without a surface. It uses Maison Neue Bold, the Compact size role and existing body-compact leading. Desktop uses inverse white over the dark backdrop; phone uses Primary text inside the light cart. It enters downward with the same 550ms motion, starting at 310ms, one stagger step before the cards. It participates in section-update appearance/removal and preserves the opening timeline; reduced motion remains immediate.

Recommendation entrance refinement (2026-09-08): the introductory copy is a styled paragraph, not an h3; the aside retains its accessible name. The desktop recommendation scroller extends 12px upward with matching internal padding, preserving the resting layout and bottom boundary while allowing the full entrance translation. The transparent outer dialog permits overflow; the cart panel retains its own rounded clipping and the recommendation list retains independent scrolling.

Recommendation copy styling (2026-09-08): center the introductory paragraph and render it uppercase through CSS, retaining sentence case in translations and the approved punctuation. Existing typography, no-surface treatment and staggered motion remain unchanged. See [Tone and voice](../tone-and-voice.md) for copy guidance.

Recommendation vertical alignment (2026-09-08): at desktop widths, center the complete visible introduction and natural-height card stack beside the cart panel. Position the independently scrollable aside at 50% and translate it by half its height, with a 6px correction for its invisible 12px top animation allowance. Tall lists retain the existing maximum height and scrolling; their visible bounds match the cart panel. Mobile placement and the staggered entrance remain unchanged. Section-update FLIP motion includes the positions changed by recentering after additions/removals.

## Local age-check contract

Checkout shares the metadata-based local 16+ gate with the other cart surface. The secondary native dialog preserves the cart, clears document fields on close/success, and automatically continues to checkout after a fresh policy check. See [age-check implementation](../age-verification-plan.md) for classification, no-JavaScript behavior, privacy, limitations and rollout requirements. No section schema or editorial content is used for product eligibility.

### Inline age-document guides

The shared age modal places its real inputs inside responsive ID/passport schematics, with a current/previous Liechtenstein ID switch. Values survive a visual-version change and clear on document-type changes, cancellation or success. See [document guide contract](../age-verification-documents.md#inline-document-ux--2026-09-08). Cart policy, metadata, checkout handoff and section settings are unchanged.

### Conditional birth-year clarification

The full birth-year field is hidden and disabled by default. After MRZ checks pass, the validator considers valid, non-future birth dates matching the two-digit year within the existing supported range (1800 through the current year). If all possibilities meet the minimum age, no extra input is needed. If eligibility differs, reveal and focus the full-year field below the card inside its surrounding panel with a localized explanation. An explicit year must match the MRZ and calendar date; minors remain blocked. Editing the MRZ birth value clears and hides the clarification again. This applies consistently to all supported document profiles. No document data is persisted.

### Swiss ID mask simplification — 2026-09-09

Swiss ID optional blocks are rendered as fixed fillers: 15 on line one and 11 before the final digit on line two. The controller reconstructs these blocks for the unchanged strict composite validation. Only the final numeric check digit is editable; no filler checkbox or live visible field-help paragraph remains. Other profiles retain their optional-data inputs. Non-filler Swiss layouts are not supported by this simplified mask and must never bypass checksum failure. Document-number input is uppercased; numeric inputs filter typing/paste and enforce maximum lengths. Check digits have compact 44px controls with accessible labels. Screen-reader field descriptions remain. Privacy information uses the existing general info surface and accurately describes tab-only, 12-hour storage; customer-account persistence is still future work.

### Supplied Swiss ID background — 2026-09-09

The Swiss ID uses the merchant-supplied `idschweizformbackground.webp`, retained unchanged as `assets/age-swiss-id.webp` (1200 × 750). CSS displays only its upper 430px illustration region; the baked-in code area is replaced by an HTML grid containing five real inputs and fixed characters. The centered card is capped at 37.5rem (600px), or 21.25rem (340px) below the 600px viewport breakpoint, and shrinks to available space. A padded Warm surface panel with Compact radius surrounds it. Two equal grid tracks align desktop code lines; below a 32rem card width, complete groups stack in reading order. Below 16rem, dates stack individually and the document prefix moves above the number. Inputs retain dedicated document sizing, Courier text, accessible labels and at least 44px targets, with no coordinate overlays or horizontal scrolling. The full-year clarification sits below the card inside the gray panel for every profile. Other profiles retain their schematic artwork. No external runtime assets or document uploads are used.

The primary action is now “Verify & checkout” / “Prüfen & zur Kasse”. The redundant bottom back button is removed; close icon, Escape and backdrop dismissal remain. The requested privacy wording says logged-in users' age checks are remembered; implementation remains scoped to the current customer context and tab for 12 hours, not server-side customer-account persistence. The wording change does not change storage behaviour.

Document inputs use `Courier, "Courier New", monospace` to distinguish fixed-width document characters. Labels retain the shared UI font; input sizes retain shared typography roles.

### Swiss ID annotation refinements — 2026-09-09

The Swiss code guide uses the shared Compact typography role for both Courier input values and fixed characters (18–20px at a normal root). Fixed text, including all fillers and the example name line, uses Primary text. A decorative `M/F` replaces the middle dot between date fields; a decorative `<` follows the document-number field before its check digit. The localized name example is `SURNAME<<GIVENNAME` in English and `NACHNAME<<VORNAME` in German. Filler spans include surplus decorative characters clipped to the available track width, including after the example names. These spans are aria-hidden and never submitted: checksum reconstruction still uses exactly 15 and 11 fillers, and no name or sex data is collected. Narrow layouts preserve the M/F guide and move only the document prefix above its input group. No schema, commerce policy, or structured-data entity changes.

Verified headlessly at 320, 390, 599, 600, 768 and 1440px: five unique Swiss fields, no overlap, controls contained within the card, no horizontal dialog overflow, and at least 44px targets. The 390px view also passed at a 150% root size; keyboard Tab reaches the check digit with a visible focus ring. Phone and desktop screenshots were reviewed. Theme checks and all 14 validator tests passed. Strict jq rejects existing Shopify-generated comments in settings_data.json and templates/index.json; parsing after removing only those leading comments validates all JSON without editing protected files.

Swiss ID number-length correction (2026-09-09): the first input accepts at most eight characters, and validation requires exactly eight alphanumeric characters for `ch-id`. The ninth code-zone position is the fixed `<` shown after that field and appended internally for checksums. Other document profiles retain their existing number-length rules. Regression coverage rejects both seven- and nine-character Swiss ID numbers.

### Dedicated Swiss ID typography — 2026-09-09

The merchant explicitly approved independent styling for this document composition, superseding the Compact-role assignment above. Scoped `--age-document-*` tokens control Courier family, font size, 1.15 line height and input padding. Code characters and inputs use 1.5rem (24px) from 600px viewport width and 1.25rem (20px) below it, with root-relative enlargement preserved. Every input has identical .375rem horizontal and .25rem vertical padding and centered values, including single check digits. The 44px minimum target remains; inter-row spacing is .375rem. The eight-character Swiss document-number limit remains enforced. Other document profiles, modal copy and the full-year question retain shared typography. No commerce/data or JSON-LD changes.

The document-specific `--age-document-letter-spacing: .1em` applies the merchant-requested 10% tracking to fixed characters and entered values. Desktop code lines use 3:2 tracks to accommodate complete date values at 24px with tracking; narrow cards continue stacking complete groups.

The Swiss document-number field now sizes to eight Courier characters, their .1em tracking, the common horizontal padding and border. The first row uses a content-sized identity group so decorative fillers receive the released space; constrained cards can still shrink the field track. Centering, type sizes and the eight-character limit remain unchanged.

### Card-local help view — 2026-09-09

An accent pill with the existing Untitled UI alert-circle icon floats at the upper right of the document surface. Its translated Help/Hilfe label changes to Back/Zurück with the existing x-close icon while expanded. The button controls an inline help panel through aria-controls/aria-expanded; it never submits the form. The help panel replaces the entry view in the same surface. The Swiss profile uses the merchant-supplied Downloads/idschweizcallouts.webp, copied unchanged to assets/age-swiss-id-help.webp (1200 × 750), with translated alt text and an ordered legend using existing field labels. Other profiles show the shared support text without the Swiss illustration. The former bottom support disclosure is removed and its title/body live in this panel. Further merchant-written explanatory copy remains pending.

Toggling preserves the mounted inputs and entered values. Inactive content is inert during the crossfade and hidden afterward. Shared Base duration (260ms) and easing animate both opacity and container height; content is clipped only during the transition to prevent collisions with following content. Interrupted toggles resume from painted opacity/height, cancel prior animations, and discard stale cleanup. Reduced motion switches immediately. Document changes, dialog cleanup and verification return to entry; validation can focus its real field even when submitted from help. Keyboard focus stays on the toggle and skips inactive inputs.

Verified in an isolated headless browser at phone/desktop sizes: supplied image and support text, no horizontal overflow at 320/390/1440px, retained eight-character entry after toggling, rapid reversals, keyboard activation and hidden-field exclusion, profile changes, and zero animations with actual prefers-reduced-motion emulation. Full theme checks and 15 validator tests passed; JSON validates after excluding the existing Shopify-generated leading comments. No new entity or applicable JSON-LD, remote runtime image, document upload, or shared-theme deployment is introduced.

### Ananotes refinements #49–59 — 2026-09-09

The privacy notice uses the requested light blue information surface (#eaf4ff) and dark blue text (#164b76), scoped to this persistent age-check notice; global Info toasts remain unchanged. Help uses inverse white text/icons over an accent-derived background darkened by 12% for legibility, with Untitled UI Line help-circle and arrow-left replacing alert-circle/x-close. Local assets retain the official SVG geometry and existing license.

The normal card and callout image share a soft two-layer shadow. The normal illustration displays at 101% width inside a 1200:420 crop to exclude the source image’s pale right/bottom edge; source pixels/files are unchanged. Decorative filler runs are measured using the rendered Courier metrics and letter spacing, and a ResizeObserver updates them to a whole-character count. No partial trailing characters or surplus hidden runs remain. At very narrow widths the localized name example wraps between surname and given name; fixed validator filler counts remain unchanged.

The document label is Choose your ID / Wähle deinen Ausweis. Label/select share a flex row where space permits and wrap on narrow phones, with the native select constrained to available width. The location paragraph above the card is removed; other profiles retain location guidance within help. Intro copy omits the expired-document sentence, without changing expired-document acceptance. Swiss help uses the merchant-requested instructions and clickable hallo@sparklys.ch contact with the request for a Swiss ID copy; this is email copy only, not a new upload or automated verification feature. It supersedes the former Swiss visible support text; other document profiles retain existing support guidance. The numbered legend remains available to assistive technology but is visually hidden beneath the explanatory image.

Verified desktop and phone screenshots, complete filler glyphs at 320/390/599/600/768/1440px, 44px inputs without overlap, keyboard access to help/contact, preserved input on rapid toggle reversals and immediate reduced-motion switching. Full checks and all 15 validator tests passed; existing Shopify-generated comment headers require comment-aware JSON validation. No new Schema.org entity or shared-theme deployment.

### International passport form — 2026-09-09

The local age dialog now includes `international-passport` alongside existing CH/LI choices. All passports share a 600px desktop / 340px phone Courier card and seven lower-line inputs, including separate optional-data and final check characters. Help explains the two-by-44 layout and unsupported variants. See [international passport support](../age-verification-international-plan.md) for the exact field, validation and coverage contract. No commerce market or server-side verification capability is added.

### Background checkout policy check — 2026-09-09

Checkout refreshes the authoritative cart age policy before opening the age dialog. The originating checkout button shows an inline spinner with accessible busy/disabled semantics; repeat submissions are ignored while pending. No age dialog opens for alcohol-free carts or a reusable age result. Only a required age entry opens the modal and makes the cart drawer inert. Failed requests or missing product classification use the shared error toast and leave the cart available for retry. Replaced cart content, pending cart mutations and a closed originating drawer prevent a stale response from proceeding. Loading cleanup restores the button; reduced motion keeps a static loading indicator. Native form and no-JavaScript age-gate fallbacks are preserved.

### Cart-line animation identity — 2026-09-09

`cart-content.liquid` emits `data-cart-motion-key`, a hash of variant ID, selling-plan ID and line properties, solely for visual continuity. The renderer assigns occurrence slots for repeated configurations and matches before/after rows using these slots. Shopify's `data-cart-line` key remains the mutation identity. Quantity and discount changes therefore retain existing rows; new configurations receive entrance motion and removed configurations exit. Quantity-input focus falls back to the presentation identity when a discount changes the Shopify key. No schema or merchant content changes.

Cause: [Shopify documents that line-item keys can change with discounts and properties](https://shopify.dev/docs/api/liquid/objects/line_item#key). The observed product difference was consistent with a discounted line being mistaken for a new row. Headless desktop/phone regression checks used simulated authoritative section responses for both surfaces, including key churn, unchanged keys, insertion, removal and reduced motion.

### Ananotes 60–64 — 2026-09-09

The Swiss ID help illustration is cropped inside a rounded 1200:750 frame, removing the source's pale right edge without changing the supplied image. Help/back keeps a constant-width floating button and anchors the open dialog's top during height changes, with a viewport-bounded scroll area. Opacity transitions retain visible overflow so card shadows do not pop when clipping ends. Swiss instructions now simply ask visitors to enter the marked characters. Inapplicable coupons retain a red voucher badge and tag icon, with a separate red explanation and local Untitled UI alert-circle icon beneath. Applied coupon appearance and removal controls are preserved.

### Ananotes 65–68 — 2026-09-09

Recommendation chips shorten the exact merchant drink-pack title pattern (for example `12er Packung`) using the localized compact-pack label; cart rows and product pages retain full variant titles. Other variant names are preserved. Available, unselected chips have a subtle shared warm-gray hover surface with the standard transition and reduced-motion fallback. Rejected coupon explanations vertically center their icon. After section replacement, coupon controls are synchronously restored from the retained code state before the browser can paint the shorter server-only badge; the subsequent authoritative discount response updates applicability. Phone/desktop checks confirm identical badge dimensions and a retained remove button through rejected-to-valid updates.

### Ananotes 69–70 — 2026-09-09

Entry and help panels now share the canvas top inset instead of adding padding only to help. Their card/image top coordinates remain identical during and after help toggles; phone help width matches the entry card cap. Field validation lives directly after the card inside the entry panel, before the optional birth-year prompt, with a red error surface and local Untitled UI alert-circle icon. Existing live regions, input descriptions, invalid state and focus behavior remain connected; errors fade in through shared motion and respect reduced motion. Desktop/phone checks confirmed stable card tops and error containment.

Merchant refinement (2026-09-09): removed the extra shared top clearance added for Ananotes 69. Both card views now begin at the normal canvas inset (16px desktop / 8px phone), while the help/back button floats over them with natural compact width and 8px horizontal padding. The button retains its 44px touch height; changing its label cannot affect document layout.

The helper image frame shares the entry card’s Small corner-radius token (2026-09-09).

### Coupon semantic transitions — 2026-09-09

Cart section replacement retains the coupon panel; server allocation codes are captured from the incoming sections before that panel is preserved. Coupon rendering compares a semantic code/applicability/allocation signature, so unchanged refreshes only update disabled controls. Changed lists crossfade through an inert, aria-hidden outgoing copy and animate their height over the shared Base duration/easing. Final validity changes still come from the authoritative cart response. Removal controls remain in the active list; clones cannot receive focus or input, are removed after transitions and are cleaned up on replacement. Reduced motion displays final state immediately. This also prevents the server-only badge shrinking between enhanced renders.

Verification: headless desktop/phone checks sampled intermediate opacity and height during rejected-to-valid changes, reverse changes, repeated identical refreshes, rapid reversals and removal. Outgoing copies were inert/aria-hidden and removed after completion; reduced motion left no copies or stale error state. `npm run check`, JavaScript syntax and whitespace checks passed.

Coupon loading-state regression fix (2026-09-09): retained controls must be registered only once in the pending-control restoration list. Re-registering an already-disabled input overwrote its original enabled state during cleanup. Section rendering now skips already-tracked nodes. Three consecutive simulated coupon submissions through the real click/update/render flow preserved enabled inputs and Apply buttons; browser typing succeeded afterward.

### Configurable minimum age — 2026-09-09

Theme settings → Age check → Minimum age offers 16 or 18 years, defaulting to 18. `age_check_minimum_age` supplies the server-rendered policy for explicitly alcoholic items; alcohol-free carts still require no age check. The dialog intro and underage message interpolate the freshly fetched policy threshold in English/German. Raising the threshold invalidates a remembered result that only met the lower minimum without requiring a manual policy-version change. Existing saved settings are not overwritten. Regression coverage includes a 17-year-old failing the 18-year threshold, exact 18th birthday, old-result invalidation, and rendered 18-year copy.

## Form baseline adoption — 2026-09-09

Coupon entry uses the shared pill `form-control` in both cart surfaces, with the baseline border, spacing, typography and focus treatment. The age-check document selector uses the shared `sparklys-select` enhancement: a native select value source/fallback, keyboard option selection and Fast fade/4px motion. MRZ artwork inputs retain their dedicated styling. Global form assets load through the layout; coupon mutation, draft and pending-state handling is unchanged.

Shared control refinement (2026-09-09): buttons use the global 3px control outline; cart quantity capsules share it. Normal field/select values explicitly use the regular body face and weight 400, including newsletter and product controls. Labels, button emphasis, field geometry and document artwork typography remain governed by their existing contracts.

Quantity button surfaces (2026-09-09): the plus/minus background fills its full 44px button box with zero inset, meeting the capsule outline without a white gap. Shared hover/focus transitions and the 3px capsule border are retained.

Youth-protection copy (2026-09-09): the localized age-check introduction explains the merchant’s online alcohol sales policy, interpolating the configured minimum age in server and refreshed text. It asks for ID/passport confirmation without making a general statutory consumption-age claim.

Stock adjustment feedback (2026-09-09): known Shopify EN/DE partial-availability and maximum-quantity 422 descriptions are warnings, with the shared triangle icon and five-second timed dismissal (paused during hover/focus or hidden tabs). Unknown 422 descriptions and server/network failures remain persistent errors. Ajax exposes no stable inventory reason code, so additional locale/message variants require explicit mapping. Cart reconciliation still runs once; no automatic mutation retry or success message is introduced.
