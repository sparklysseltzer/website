# Quality standards

## Accessibility

The target is WCAG-aligned storefront behavior, verified manually and with automated tools. Shopify's baseline is documented in [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility).

Required conventions:

- page language follows `request.locale.iso_code`;
- viewport zoom remains enabled;
- a visible-on-focus skip link targets a focusable main element;
- DOM order and keyboard focus order match;
- visible focus is never removed;
- no functionality depends on hover;
- headings describe content hierarchy;
- navigation uses `nav` and current links use `aria-current`;
- links navigate and buttons perform actions;
- every form control has a label and errors/status changes are announced;
- product images have contextual alt text and decorative images use empty alt text;
- color is not the only status signal;
- primary controls have at least 44 by 44 CSS pixel targets;
- motion respects `prefers-reduced-motion`;
- interactive state changes follow the [smooth-transition contract](design-system.md#interactive-state-transitions), including entry, exit, updates, interruption, and preserved focus/scroll position;
- drawers and dialogs manage focus, Escape, and focus restoration;
- transient feedback uses the [shared notification contract](design-system.md#notifications), with modal-safe layering, pausable dismissal, and retained field error descriptions.

Current remediation is tracked in [Status](status.md#known-incomplete-capabilities) and the owning section references. In particular, validate cart table semantics, sale-price labels, and enlarged-text reflow before production readiness.

## Performance

Follow Shopify's [Performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance):

- prefer HTML and CSS, using JavaScript only as progressive enhancement;
- keep JavaScript small, native, deferred, and free of broad dependencies;
- serve theme assets and images from Shopify's CDN;
- use responsive image widths and accurate `sizes`;
- eagerly load only critical above-the-fold resources and lazy-load below-the-fold imagery;
- avoid repeated expensive Liquid work inside loops;
- use resource hints sparingly;
- test home, product, and collection pages with realistic data.

Asset ownership, actual loading patterns and budgets are defined in [Frontend assets](frontend-assets.md). The theme uses shared global assets plus section-compiled CSS and the FAQ stylesheet; do not assume every style is loaded globally.

## SEO

The layout currently provides page titles, meta descriptions, canonical URLs, Open Graph metadata, and Twitter card metadata. Shopify's required metadata pattern is documented in [Add SEO metadata to your theme](https://shopify.dev/docs/storefronts/themes/seo/metadata).

Remaining SEO work:

- complete applicable entity markup following the [structured-data retrofit checklist](structured-data-tasks.md), without duplicating its task inventory here;
- validate sharing metadata for products and articles;
- verify heading hierarchy against real editor configurations;
- validate indexability and canonical behavior on preview and production domains;
- avoid manually duplicating hreflang tags because Shopify provides them through `content_for_header`.

## Functional verification matrix

For every affected journey, cover applicable rows:

| Dimension | Minimum verification |
| --- | --- |
| Viewport | Representative phone and desktop widths |
| Input | Touch, mouse, and keyboard |
| JavaScript | Enabled; disabled for navigation, product form, cart update, and checkout entry |
| Motion | Default and reduced motion |
| Content | Empty, normal, long text, missing image, sold out, sale price, and many items where relevant |
| Theme editor | Add/remove/reorder section, blank settings, invalid/deleted resource selection |
| Commerce | Variant, quantity, inventory error, discount, cart update, checkout handoff |
| Localization | Default locale and any enabled market/language path |

## Automated gates

`npm run check` runs Theme Check, global asset-budget checks, and shared typography regression checks locally and in GitHub Actions. JavaScript syntax, JSON parsing, and whitespace validation are additional local handoff gates. The [development guide](development.md#read-only-local-validation) owns the commands and the handling of Shopify-generated JSON headers.

Not yet automated on the connected development theme:

- Shopify Lighthouse CI for home, product, and collection pages;
- browser journey tests for navigation, product selection, add-to-cart, cart editing, and checkout handoff;
- screenshot comparisons against approved designs;
- HTML and accessibility audits on rendered pages.

The development theme is available for approved manual phone and desktop QA, but that does not replace the missing repeatable browser, accessibility, screenshot, and Lighthouse suites.
