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
| `assets/base.css` | Design tokens, primitives, responsive layout, and shared component styling. |
| `assets/theme.js` | Progressive enhancement only. |
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

## Styling

- CSS custom properties in `theme.liquid` expose global design tokens.
- `base.css` owns current primitives and shared component styles. Split assets only when page cost or ownership becomes clearer than a single small stylesheet.
- Use native CSS and avoid Sass. Shopify serves and optimizes assets from its CDN.
- Section-specific `{% stylesheet %}` can be introduced for portable sections, but cross-file selector dependencies must remain explicit because Shopify may subset these styles. See [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags).

## JavaScript

- JavaScript is progressive enhancement. Server-rendered forms and links are the fallback.
- Use custom elements to scope behavior and avoid global selectors or state.
- Load scripts with `defer`; never add parser-blocking scripts.
- Use native browser APIs rather than a frontend framework or general-purpose dependency.
- Dynamic messages must be surfaced through an appropriate live region.

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
