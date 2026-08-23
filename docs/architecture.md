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
| `default` | `assets/sparklys-arc-logo.svg` | `main nav general` (`main-nav-general`) | No active product-world tab |
| `soda` | `assets/sparklys-soda-logo.svg` | `main nav soda` (`main-nav-soda`) | Soda tab active |
| `seltzer` | `assets/footer-logo-seltzer.svg`, inverted to black on the white header | `main nav seltzer` (`main-nav-seltzer`) | Hard Seltzer tab active |

The contexts remain explicit server-rendered states. Do not infer Soda or Hard Seltzer context from a logo alone.

The three primary-navigation menus are separate Shopify Navigation resources. Their initial Shop, Learn, and Subscribe items are placeholders until their destinations and dropdown structures are approved. Maintain each context independently in Shopify Admin; do not reuse or overwrite the old `main-menu` navigation.

The server-rendered page context also owns heading typography. `default` and `seltzer` use Newake at weight 400 for `h1` and `h2`; `soda` uses Erode Bold at weight 700 with `-0.03em` letter spacing. Matching alternate-template suffixes apply the context to explicitly classified products and content, while membership in the configured brand collections classifies existing products without waiting for manual template assignment. The header's resolved Soda context remains a CSS fallback when section settings and the layout's bootstrap collection handles temporarily differ. No JavaScript is required for typography selection.

Collection composition is split across three JSON templates:

| Template | Purpose | Initial composition |
| --- | --- | --- |
| `templates/collection.json` | Ordinary collections | Native collection product grid only |
| `templates/collection.soda.json` | Soda brand landing | Soda hero, editable introduction, native collection product grid, editable follow-up content |
| `templates/collection.seltzer.json` | Hard Seltzer brand landing | Hard Seltzer hero, editable introduction, native collection product grid, editable follow-up content |

The branded templates are independent composition roots. They may diverge section-by-section as approved designs arrive; they do not need to retain matching layouts. Both must keep the native `collection.products` grid as the authoritative catalog surface.

Product composition has the same three roots:

| Template | Purpose |
| --- | --- |
| `templates/product.json` | General or not-yet-classified products |
| `templates/product.soda.json` | Explicit Soda product context |
| `templates/product.seltzer.json` | Explicit Hard Seltzer product context |

The branded product templates currently share the same `main-product` composition. Their suffixes exist to make brand ownership explicit and allow the layouts to diverge later without changing the routing contract.

Context resolution must be deterministic on the server so direct links, localized URLs, search engines, and no-JavaScript browsing receive the correct header:

1. Any `.soda` or `.seltzer` alternate-template suffix selects its matching context. This is authoritative for collections, products, and future explicitly branded content.
2. The configured Soda and Hard Seltzer collection objects select their matching collection contexts even before alternate templates are assigned. The known `soda` and `hard-seltzer` handles bootstrap those object references when a fresh development theme has not persisted its collection-picker settings yet; merchant picker selections remain authoritative.
3. A product in exactly one configured brand collection inherits that collection's context, so existing direct product URLs render the correct complete brand shell immediately.
4. A product in both brand collections remains `default` unless an explicit branded product template resolves the ambiguity. Never let collection iteration order choose a product world accidentally.
5. Supporting pages and articles may opt into a product-world context through an explicit `.soda` or `.seltzer` alternate template.
6. Unclassified and shared surfaces fall back to `default`.

Do not use browser session state as the authority for context. A visitor arriving directly on a Soda product must receive the Soda logo/menu, and a visitor arriving directly on a Hard Seltzer product must receive the Hard Seltzer logo/menu. The top tabs render Shopify collection objects and their `.url` values; never output hardcoded `/collections/soda`, `/collections/hard-seltzer`, or vanity paths, because localized storefront paths may change. The bootstrap handles above are only object lookups and must be updated or removed after a collection handle changes.

The black bar is the top-level context switcher. It stays in normal document flow and scrolls away while the white bar becomes sticky at the viewport top. On desktop, progressive JavaScript reveals the complete header after 120px of cumulative upward scrolling, which signals deliberate return navigation rather than a tiny accidental movement. It hides the switcher again after 12px of downward movement. Without JavaScript, the white-bar-only sticky behavior remains the fallback. The white bar is context-dependent and owns the corresponding logo, main menu, and later dropdown content. Dropdown panels, expanded mobile behavior, and context propagation beyond the two landing pages remain separate implementation steps.

The desktop utility navigation in the black bar is owned by the separate Shopify navigation menu `Corporate Nav` (`corporate-nav`). The header renders its top-level items in merchant-defined order. A leaf item renders as a normal link; any item with children automatically renders as a non-link disclosure trigger with a chevron and popover. Shopify's three navigation levels are supported, so a nested item inside the first popover can expose one further disclosure level. The disclosure works without JavaScript through native `details`/`summary`; progressive JavaScript adds outside-click, scroll, and Escape dismissal while restoring focus to the trigger.

Blog and Contact are resource-backed menu items rather than hardcoded theme paths. Their destinations and labels belong to Shopify Navigation and can be maintained in Admin without a theme change. Do not repurpose or edit `Main Menu`, `Übersicht`, or the customer-account menu for this utility navigation. Keep `Corporate Nav` separate so development can evolve without altering a live menu's contents.

The white-bar Store Finder action is backed by the Shopify `Händler` Page selected in the header settings, with `pages['haendler']` only as a bootstrap fallback. Its 46px pill matches the account and cart control height and transitions a rounded black border on hover and keyboard focus without changing layout.

The account and cart controls both use 46px circles, but their Figma-exported glyph bounds are intentionally different inside the shared 18px icon frame: account is 13.6702×15.17px and cart is 16.5865×16.67px. Both source SVGs use the same 1.67px stroke. Preserve those exported glyph dimensions instead of forcing both files to 18px wide, which enlarges the narrower account mark and makes its stroke appear heavier.

The desktop product-world tabs follow this interaction contract:

- The active tab is a plain white surface with matching concave white joins into the white navigation bar. It never uses the noise texture.
- An inactive tab has a stable 33px interaction box. Its 25px inner surface moves down 4px on hover or keyboard focus while the outer box stays fixed, preventing pointer-boundary oscillation when the cursor enters from above.
- The inactive hover/focus surface and its joins use `bg-noise-pattern2x.png` over `#4d4d4d`. The 200px source is rendered at 100px CSS size to respect its 2x density.
- The brand-tab container clips its animated joins at the switcher boundary, preventing their translated start state from flashing into the white navigation bar. The switcher itself remains overflow-visible so utility popovers are not clipped.
- Hover styling is guarded by `(hover: hover)`, keyboard focus receives the equivalent visual state, and the global reduced-motion rule collapses the transitions for visitors who request it.

Storefront motion uses one shared response curve, `cubic-bezier(0.22, 1, 0.36, 1)`, exposed as `--motion-ease`. Durations remain proportional to the interaction: `--motion-duration-fast` (200ms) for color, opacity, border, icon, and chevron states; `--motion-duration-base` (260ms) for tabs, buttons, and header movement; and `--motion-duration-slow` (360ms) for product-image zoom. Declare transitioned properties individually rather than using `transition: all`, and preserve the global `prefers-reduced-motion` override.

## Footer brand-context routing

The footer resolves the same `default`, `soda`, and `seltzer` contexts on the server. It uses the configured Soda and Hard Seltzer collection objects, their alternate template suffixes, and the same bootstrap handles as the header. The variants are:

| Context | Newsletter identity | Navigation composition |
| --- | --- | --- |
| `default` | Sparklys Arc | Combined Shop, Learn, and Get to know cards |
| `soda` | Sparklys Soda | Soda Shop, Learn, and Get to know cards |
| `seltzer` | Sparklys Hard Seltzer | Hard Seltzer Shop, Learn, and Get to know cards |

Each context owns a separate Shopify Navigation resource: `footer nav general` (`footer-nav-general`), `footer nav soda` (`footer-nav-soda`), and `footer nav seltzer` (`footer-nav-seltzer`). Top-level menu items create footer cards, and their child links create the card content. All three menus must keep the Shop, Learn, and Get to know top-level structure unless a new footer design is approved. The initial destinations are placeholders pending the final routing concept.

All footer contexts share `Legal Nav` (`legal-nav`) for policy links. Its AGB, Datenschutz, Impressum, Versandinformationen, and Rückgaberecht items are Shopify `SHOP_POLICY` resources for Terms of service, Privacy policy, Legal notice, Shipping policy, and Refund policy. Keep these resource-backed rather than hardcoding policy paths in Liquid so Shopify can render the appropriate storefront URLs.

All variants are full-bleed black surfaces with a centered 1200px desktop container. The Seltzer frame's outer gaps in Figma are placement artifacts, not storefront spacing. The copyright year is rendered from Shopify's server-side `now` value and interpolated into the locale string. Newsletter submission, legal and social destinations, payment rendering, store finder, and localization controls remain visual-only until their behavior is explicitly defined.

Footer card headings deliberately do not inherit the page-context heading family. `.site-footer__card-heading` always uses `--font-heading-default` (Newake) at weight 400, including on Soda pages where content-level `h1` and `h2` headings use Erode Bold. Preserve this exception when adding or reorganizing footer cards.

## Brand asset inventory

| Asset | Current use |
| --- | --- |
| `maison-neue-demi.woff2` | Body copy, UI text, and headings from `h3` onward in every context |
| `maison-neue-bold.woff2` | Registered for future approved uses; not preloaded |
| `newake-regular.woff2` | General and Hard Seltzer `h1`/`h2` headings |
| `erode-bold.woff2` | Soda `h1`/`h2` headings at weight 700 |
| `sparklys-arc-logo.svg` | General header/footer identity |
| `sparklys-soda-logo.svg` | Soda header/footer identity |
| `footer-logo-seltzer.svg` | Hard Seltzer header/footer identity |
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
