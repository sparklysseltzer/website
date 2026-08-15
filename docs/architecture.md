# Architecture

## System boundary

```text
Shopify Admin and commerce data
            |
            v
Liquid objects + JSON templates
            |
            v
Configurable sections and snippets
            |
            v
Semantic HTML + native CSS + progressive JavaScript
            |
            v
Shopify-hosted checkout
```

This is a buildless theme. Shopify renders Liquid on the server, JSON templates select sections, and the browser receives HTML enhanced by a small CSS and JavaScript layer. Shopify documents the supported structure in [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture).

## Repository map

| Path | Responsibility |
| --- | --- |
| `layout/theme.liquid` | Global HTML document, metadata, assets, header/footer groups, and `content_for_layout`. |
| `templates/*.json` | Resource-to-section composition and merchant-editable page layouts. |
| `sections/*.liquid` | Reusable storefront features with local schema and settings. |
| `sections/*-group.json` | Persistent header and footer section groups. |
| `snippets/*.liquid` | Small rendering primitives such as product cards, pagination, and metadata. |
| `assets/base.css` | Global design tokens, primitives, responsive layout, header/footer, and genuinely shared component styling. |
| `assets/theme.js` | Small progressive enhancement used across most pages. |
| `config/` | Global theme settings and their current values. |
| `locales/` | Customer-facing translations. |
| `docs/` | Product decisions, platform references, and delivery guidance. |

Shopify supports only its defined theme directories for uploaded theme files. Non-theme repository content is excluded through `.shopifyignore`.

## Composition rules

- Use JSON templates as the composition layer. HTML and Liquid referenced by a JSON template belong in sections. See [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates).
- Put merchant-adjustable content and layout decisions in section settings or blocks. Put genuinely global brand tokens in `settings_schema.json`. See [Settings](https://shopify.dev/docs/storefronts/themes/architecture/settings).
- Check resource settings against `blank`; a resource may be unselected, deleted, or hidden.
- Use section blocks for content owned by one section. Use theme blocks only when a reusable nested block system is actually needed. See [Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks).
- Use app blocks in relevant sections when an installed storefront app needs merchant-controlled placement. App-block support is not yet implemented in the skeleton.

## Liquid and URLs

- Use Shopify's Liquid reference rather than generic Liquid assumptions: [Liquid reference](https://shopify.dev/docs/api/liquid).
- Use resource `.url` properties and the [`routes` object](https://shopify.dev/docs/api/liquid/objects/routes) in Liquid.
- In JavaScript, prefix Ajax endpoints with `window.Shopify.routes.root` so market and language subfolders are preserved.
- Never hardcode `/cart`, `/search`, product paths, a currency, or the shop's primary locale.

## Localization

- German is the default locale; English is required. French and Italian remain planned candidates.
- Reusable UI strings belong in storefront locale JSON and are rendered with the `t` filter.
- Theme editor labels should move to schema locale files when editor translation becomes a requirement.
- Merchant-entered settings and resource content are translated in Shopify, not by duplicating Liquid templates.
- Render only countries and languages exposed by Shopify's `localization` object.

## Header and brand-context routing

The header has three explicit server-rendered contexts: `default`, `soda`, and `seltzer`.

| Context | Logo asset | Navigation source | Switcher state |
| --- | --- | --- | --- |
| `default` | `assets/sparklys-arc-logo.svg` | Default header menu | No active product-world tab |
| `soda` | `assets/sparklys-soda-logo.svg` | Soda header menu | Soda tab active |
| `seltzer` | Approved Hard Seltzer mark; currently `assets/sparklys-arc-logo.svg` based on the live collection reference | Hard Seltzer header menu | Hard Seltzer tab active |

The contexts remain distinct even when two contexts temporarily share the same logo asset. Do not infer Soda or Hard Seltzer context from a logo alone.

The server-rendered page context also owns heading typography. `default` and `seltzer` use Newake for `h1` and `h2`; `soda` uses Erode Regular. A matching alternate-template suffix applies the context to future explicitly classified product and content templates, while the known collection handles bootstrap the two current brand landings. The header's resolved Soda context remains a CSS fallback for a merchant-configured Soda collection before its alternate template is assigned. No JavaScript is required for typography selection.

Collection composition is split across three JSON templates:

| Template | Purpose | Initial composition |
| --- | --- | --- |
| `templates/collection.json` | Ordinary collections | Native collection product grid only |
| `templates/collection.soda.json` | Soda brand landing | Soda hero, editable introduction, native collection product grid, editable follow-up content |
| `templates/collection.seltzer.json` | Hard Seltzer brand landing | Hard Seltzer hero, editable introduction, native collection product grid, editable follow-up content |

The branded templates are independent composition roots. They may diverge section-by-section as approved designs arrive; they do not need to retain matching layouts. Both must keep the native `collection.products` grid as the authoritative catalog surface.

Context resolution must be deterministic on the server so direct links, localized URLs, search engines, and no-JavaScript browsing receive the correct header:

1. The `collection.soda` and `collection.seltzer` template suffixes select their matching contexts.
2. The configured Soda and Hard Seltzer collection objects also select their matching contexts, including before alternate templates are assigned. The known `soda` and `hard-seltzer` handles bootstrap those object references when a fresh development theme has not persisted its collection-picker settings yet; merchant picker selections remain authoritative.
3. Product pages must later inherit context through explicit Shopify-owned classification, such as dedicated JSON templates or a validated metafield/taxonomy rule.
4. Supporting pages and articles may opt into a product-world context through the same explicit mechanism.
5. Unclassified and shared surfaces fall back to `default`.

Do not use browser session state as the authority for context. A visitor arriving directly on a Soda product must receive the Soda logo/menu, and a visitor arriving directly on a Hard Seltzer product must receive the Hard Seltzer logo/menu. The top tabs render Shopify collection objects and their `.url` values; never output hardcoded `/collections/soda`, `/collections/hard-seltzer`, or vanity paths, because localized storefront paths may change. The bootstrap handles above are only object lookups and must be updated or removed after a collection handle changes.

The black bar is the top-level context switcher. It stays in normal document flow and scrolls away while the white bar becomes sticky at the viewport top. On desktop, progressive JavaScript reveals the complete header after 120px of cumulative upward scrolling, which signals deliberate return navigation rather than a tiny accidental movement. It hides the switcher again after 12px of downward movement. Without JavaScript, the white-bar-only sticky behavior remains the fallback. The white bar is context-dependent and owns the corresponding logo, main menu, and later dropdown content. Dropdown panels, expanded mobile behavior, and context propagation beyond the two landing pages remain separate implementation steps.

The desktop product-world tabs follow this interaction contract:

- The active tab is a plain white surface with matching concave white joins into the white navigation bar. It never uses the noise texture.
- An inactive tab has a stable 33px interaction box. Its 25px inner surface moves down 4px on hover or keyboard focus while the outer box stays fixed, preventing pointer-boundary oscillation when the cursor enters from above.
- The inactive hover/focus surface and its joins use `bg-noise-pattern2x.png` over `#4d4d4d`. The 200px source is rendered at 100px CSS size to respect its 2x density.
- Hover styling is guarded by `(hover: hover)`, keyboard focus receives the equivalent visual state, and the global reduced-motion rule collapses the transitions for visitors who request it.

## Footer brand-context routing

The footer resolves the same `default`, `soda`, and `seltzer` contexts on the server. It uses the configured Soda and Hard Seltzer collection objects, their alternate template suffixes, and the same bootstrap handles as the header. The variants are:

| Context | Newsletter identity | Navigation composition |
| --- | --- | --- |
| `default` | Sparklys Arc | Separate Hard Seltzer and Soda product-world cards plus stacked Learn and Get to know cards |
| `soda` | Sparklys Soda | Soda Shop, Learn, and Get to know cards |
| `seltzer` | Sparklys Hard Seltzer | Hard Seltzer Shop, Learn, and Get to know cards |

All variants are full-bleed black surfaces with a centered 1200px desktop container. The Seltzer frame's outer gaps in Figma are placement artifacts, not storefront spacing. Footer destinations, newsletter submission, payment rendering, store finder, social links, and localization controls remain visual-only until their behavior is explicitly defined.

## Brand asset inventory

| Asset | Current use |
| --- | --- |
| `maison-neue-demi.woff2` | Body copy, UI text, and headings from `h3` onward in every context |
| `maison-neue-bold.woff2` | Registered for future approved uses; not preloaded |
| `newake-regular.woff2` | General and Hard Seltzer `h1`/`h2` headings |
| `erode-regular.woff2` | Soda `h1`/`h2` headings |
| `sparklys-arc-logo.svg` | General header/footer identity and temporary Hard Seltzer header identity |
| `sparklys-soda-logo.svg` | Soda header/footer identity and general-footer Soda card |
| `footer-logo-seltzer.svg` | Hard Seltzer footer identity and general-footer Hard Seltzer card |
| `bg-noise-pattern2x.png` | Inactive desktop brand-tab hover/focus texture only |

These are theme-owned local assets and must be referenced through `asset_url`. Do not replace them with remote runtime URLs. Any logo replacement must preserve the three-context routing contract rather than changing every surface globally.

## Styling

- CSS custom properties in `theme.liquid` expose global design tokens.
- `base.css` owns global primitives and shared component styles. Substantial portable feature styles should move into their owning section when page cost and ownership become clearer than one small global stylesheet.
- Use native CSS and avoid Sass. Shopify serves and optimizes assets from its CDN.
- Section-specific `{% stylesheet %}` can be introduced for portable sections, but cross-file selector dependencies must remain explicit because Shopify may subset these styles. See [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags).
- Keep repository source readable; Shopify owns production minification, Brotli/gzip negotiation, versioned URLs, and CDN caching. Do not commit pre-minified or pre-compressed duplicates.
- Follow the ownership rules and enforced global budgets in [Frontend asset structure and delivery](frontend-assets.md).

## JavaScript

- JavaScript is progressive enhancement. Server-rendered forms and links are the fallback.
- Use custom elements to scope behavior and avoid global selectors or state.
- Load scripts with `defer`; never add parser-blocking scripts.
- Use native browser APIs rather than a frontend framework or general-purpose dependency.
- Dynamic messages must be surfaced through an appropriate live region.
- Keep only broadly used behavior in `theme.js`; load large page-specific behavior from its owning context or on interaction.
- Follow [Frontend asset structure and delivery](frontend-assets.md) for script placement, loading, and size review.

## Images and media

- Render Shopify-hosted images using `image_url` and `image_tag` with explicit responsive widths and `sizes`.
- Do not lazy-load likely above-the-fold/LCP imagery. Lazy-load media below the fold.
- Preserve width/height metadata and useful alt text. Decorative images use empty alt text.
- Do not autoplay media with sound.

## Extension points

The architecture anticipates, but does not yet claim, support for:

- theme app blocks in product and content sections;
- selling plans and subscriptions;
- market and language selectors;
- product recommendations and predictive search;
- structured product data;
- app-specific analytics and consent integration.

Each extension must be designed and tested end to end rather than inserted as an isolated widget.
