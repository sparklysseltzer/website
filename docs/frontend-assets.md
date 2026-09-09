# Frontend asset structure and delivery

This guide defines how Sparklys CSS, JavaScript, fonts, and other static assets are owned, loaded, and kept small. It applies to every storefront implementation.

## Delivery contract

- Keep source CSS and JavaScript readable and unminified in this repository.
- Load theme assets through Shopify Liquid filters and tags such as `asset_url`, `stylesheet_tag`, and a deferred `script` tag. Do not hardcode Shopify CDN URLs.
- Do not create committed `.min.css`, `.min.js`, `.gz`, or `.br` copies. Shopify automatically minifies valid CSS and JavaScript and serves supported assets through its CDN with Brotli or gzip compression.
- Shopify's versioned asset URLs and CDN response headers own browser caching. Do not add a custom cache-busting query string.
- Do not introduce Vite, Webpack, Sass, Tailwind, a JavaScript framework, or another build pipeline solely for minification. A build step requires an explicit architecture decision with a measured benefit.
- Do not load remote runtime fonts, scripts, stylesheets, or images without review. Theme-owned assets belong in `assets/`; merchant images use Shopify's image pipeline.

See Shopify's [platform performance guidance](https://shopify.dev/docs/storefronts/themes/best-practices/performance/platform) for CDN minification, compression, and caching behavior.

## CSS ownership

| Location | Owns | Loading behavior |
| --- | --- | --- |
| `assets/base.css` | Tokens, reset, typography, accessibility primitives, global layout, header, footer, and genuinely shared components | Loaded once on every storefront page |
| A section or snippet `{% stylesheet %}` block | A portable component's substantial, self-contained styles | Shopify includes relevant compiled CSS according to the page's render tree |
| A separate asset stylesheet | An unusually large page feature that cannot be cleanly colocated | Reference it only from the owning section or template context |
| Inline `style` attributes or blocks | Instance values that must come from Liquid, preferably exposed as custom properties | Rendered with that instance; never use for reusable rule sets |

Rules:

- Start shared primitives in `base.css`. Move substantial feature styling closer to its owner when this reduces global page cost and leaves a clear boundary.
- A section stylesheet must style its own markup and direct rendering primitives. Do not create hidden selector dependencies on unrelated sections because Shopify can subset section CSS.
- Use native CSS, existing custom properties, and mobile-first media queries. Avoid duplicate tokens and broad selectors that leak across components.
- CSS inside `{% stylesheet %}` cannot contain Liquid. Pass merchant-configured values through instance-level custom properties when required.
- Avoid one-file-per-tiny-component fragmentation. A network or ownership split must have a measurable or architectural reason.

Shopify documents section asset compilation and CSS subsetting in [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) and [stylesheet subsetting](https://shopify.dev/docs/storefronts/themes/best-practices/performance/stylesheet-subsetting).

## JavaScript ownership

| Location | Owns | Loading behavior |
| --- | --- | --- |
| `assets/theme.js` | Small behavior required across most pages, such as global header enhancement | Loaded once with `defer` |
| `assets/notifications.js` | Shared notification layer, lifetime, modal placement and accessible dismissal; separate service boundary used by multiple sections | Loaded once with `defer` before `theme.js`; 4 KiB gzip review budget |
| A section or snippet `{% javascript %}` block | Small, portable behavior owned by that component | Shopify compiles and defers the code; it is registered once per file |
| A separate JavaScript asset | A large or page-specific feature | Reference with `defer` or `type="module"` only from its owning context |
| A dynamically imported module | Heavy optional behavior that is not needed for initial rendering | Import on first interaction or immediately before the feature is needed |

Rules:

- JavaScript is progressive enhancement. Navigation, product submission, cart editing, and checkout entry must retain a server-rendered fallback.
- Prefer custom elements or an equally explicit component root. Initialize each rendered instance without relying on global DOM order.
- Use native browser APIs. Do not add a general-purpose dependency for behavior the platform already provides.
- Never add parser-blocking scripts. Use `defer`, modules, or interaction-time loading as appropriate.
- Code in `{% javascript %}` cannot contain Liquid. Expose Shopify data through semantic HTML, `data-*` attributes, or scoped JSON.
- Account for Shopify theme-editor section insertion and replacement when a component gains interactive behavior.
- Keep third-party app scripts within their supported extension or embed surface and audit their page coverage and cost separately.

## Fonts, images, and preloads

For design exports, exclude the separate grain layer: the theme adds grain at runtime. Preserve required transparency and complete effect bounds (including shadows) and verify the exported asset before replacing it. Photographic texture already present in the source photo is distinct from the removable grain overlay. Blank image pickers use the approved bundled asset automatically; never expose the implementation source in merchant labels. See [Theme Editor conventions](architecture.md#theme-editor-configuration-design) for fallback and native focal-point rules.

- Serve theme fonts as local WOFF2 assets through `asset_url`.
- Preload only fonts required for above-the-fold rendering. Maison Neue Demi is global; Erode Bold is preloaded only in Soda context and Newake only outside Soda context. Soda pages may load Newake normally when the below-the-fold footer renders its context-independent card headings; that exception does not justify a second heading-font preload. Maison Neue Bold must remain non-preloaded until an above-the-fold use justifies it.
- Keep decorative theme textures local. `bg-noise-pattern2x.png` is a 2x source and is rendered at 100 by 100 CSS pixels where the header hover state uses it; active tabs deliberately remain untextured.
- Render merchant images through `image_url` and `image_tag` with bounded widths, realistic `sizes`, and intrinsic dimensions.
- Do not preload below-the-fold assets. Every preload competes with critical CSS, fonts, and the likely LCP image.

## UI icons

Use Untitled UI Icons as the primary source, following the [iconography contract](design-system.md#iconography). Bundle only the SVGs actually used, as local assets or reusable Liquid snippets. The official SVG catalog and the original components in the Sparklys Figma file are source options; no runtime icon dependency is required.

## Project review thresholds

`npm run check:assets` reports raw, gzip, and Brotli sizes using Node's standard compression implementations. It fails when a global source exceeds these gzip thresholds:

| Global asset | Gzip review threshold |
| --- | ---: |
| `assets/base.css` | 30 KiB |
| `assets/theme.js` | 15 KiB |

These are Sparklys review thresholds, not Shopify platform limits. Crossing one does not mean that functionality should be deleted; it means page coverage and ownership must be reviewed before raising the threshold. Prefer moving a genuinely page-specific feature to its owner over increasing every page's global payload.

The local compression numbers are deterministic comparison estimates. The Shopify CDN decides the actual production encoding based on the request and platform configuration.

## Verification

Before handoff, run the [development quality gates](development.md#read-only-local-validation). `npm run check` includes Theme Check, the global asset budget, and typography regression checks.

For release performance verification on a Shopify-hosted preview or production theme:

1. Inspect the Network panel with caching disabled and confirm only page-relevant assets load.
2. Confirm theme asset URLs are Shopify-generated and versioned.
3. Inspect a real `GET` response with `Accept-Encoding: br, gzip`; expect Shopify CDN delivery to negotiate Brotli or gzip where supported.
4. Compare transferred sizes and Lighthouse results on representative home, collection, and product pages at phone and desktop widths.
5. Use browser coverage as diagnostic evidence, not as an automatic instruction to split shared assets.

`shopify theme dev` is useful for functionality and layout, but local proxy behavior is not proof of the final CDN cache or compression headers. Verify delivery against a Shopify-hosted URL before launch.

## Local age-check assets

`age-validation.js` supplies pure TD1/TD3 validation; `age-check.js` owns the secondary native dialog and fresh cart-policy handoff. Both are deferred before `theme.js`; they use no remote runtime assets. Gzip budgets are checked by `check-assets.mjs`.

Swiss ID help: assets/age-swiss-id-help.webp is the unchanged merchant-supplied idschweizcallouts.webp (1200 × 750), used only in the Swiss card help view. The five visual callouts have a translated HTML field legend. Existing local Untitled UI alert-circle and x-close icons supply the help/back toggle.

ID help icon refinement: icon-help-circle.svg and icon-arrow-left.svg are unchanged Untitled UI Line exports from the official untitleduico/icons repository, covered by docs/untitled-ui-icons-license.txt. The normal Swiss artwork retains its source file; CSS excludes its embedded pale right/bottom edge with 101% width and a 1200:420 crop.

Background checkout review (2026-09-09): age-check.js now owns the checkout-button pending state and pre-dialog policy branching, including repeated-submit and stale-cart guards. It remains relevant to the globally available cart drawer, so moving it to a page-only bundle would omit that journey. The reviewed gzip threshold increases from 6 to 6.5 KiB (measured 6.25 KiB); no dependency or additional request is introduced.

Form baseline (2026-09-09): `forms.css` and `forms.js` are opt-in local component assets, currently loaded only by the disposable `demos/design-system/` page. No global storefront payload is added. `icon-check.svg` and `icon-form-chevron-down.svg` are unchanged Figma exports from existing Untitled UI components; see [forms](forms.md).

Form baseline adoption (2026-09-09): the layout now loads `forms.css` and deferred `forms.js` globally for cart coupon inputs and the age-check document dropdown. Both have explicit 3 KiB gzip review budgets in `check-assets.mjs`. Other controls remain opt-in; the studio stays excluded from theme uploads.
