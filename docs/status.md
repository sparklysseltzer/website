# Implementation status

This file is a capability map, not a promise of production readiness.

## Implemented in the skeleton

- Shopify theme directory structure and global `theme.liquid` layout.
- German default and English storefront UI locale files.
- Global color, width, logo, and favicon settings.
- Configurable header and footer section groups.
- Configurable hero, rich text, and featured collection sections.
- JSON templates for home, product, collection, collection list, cart, search, page, blog, article, and 404.
- Responsive product cards and basic product media.
- Server-rendered product and cart forms.
- Progressively enhanced Ajax add-to-cart with status messaging.
- Canonical, description, Open Graph, and Twitter metadata.
- Mobile-first layout primitives, focus styles, skip link, and reduced-motion handling.
- Theme Check configuration and CI.
- Local development and safety documentation.

## Known incomplete capabilities

| Area | Status | Required work |
| --- | --- | --- |
| Approved brand design | Blocked on design inputs | Replace placeholder visual language with supplied Figma/assets/tokens. |
| Real store preview | Development theme connected | Normal Shopify authentication and `theme dev` are working against `sparklys-hard-seltzer.myshopify.com`; representative storefront and editor QA remain. |
| Product variants | Basic only | Option-based UI, variant URL state, media/price/availability sync, quantity rules, high-variant cases. |
| Discounts | Incomplete | Accessible regular/sale labels, line/cart discount allocations, checkout consistency. |
| Subscriptions | Not implemented | Selling-plan selector, pricing, cart display, provider audit, account portal verification. |
| Age verification / MRZ | Discovery required | Legal/privacy review, provider-vs-custom decision, server-side trust boundary, data minimization, fallback journey. |
| Coupon entry and visibility | Not implemented | Apply/remove via cart state, full-cart and drawer UI, PDP applied state/hints, accessible validation feedback. |
| Cart drawer | Not implemented | Drawer interaction, synchronized cart state, focus management, no-JavaScript fallback. |
| Last-minute sale / “others took this” | Definition required | Clarify product behavior, merchandising source, eligibility, inventory, analytics, and app-vs-custom ownership. |
| Free-shipping upsell | Discovery required | Authoritative threshold by market/currency, qualifying subtotal, recommendations, progress UI, checkout consistency. |
| App blocks/embeds | Not implemented | Add supported hosts and audit installed apps. |
| Navigation | Basic | Nested menus, robust mobile disclosure behavior, long-content testing. |
| Cart | Basic | Discounts, properties, notes if required, selling plans, richer errors, accessible table semantics. |
| Markets/localization | Partial | Initial scope is Switzerland and Liechtenstein. URLs and Ajax are locale-aware; language/market selectors and real Markets QA remain. |
| Languages | Partial | German and English theme UI strings exist. Merchant content, published-language configuration, and likely French/Italian locale files remain. |
| SEO | Partial | Product structured data and rendered validation remain. |
| Search | Basic | Predictive search and refined mixed-result UI remain. |
| Customer accounts | Platform-dependent | Decide new customer accounts behavior and required storefront entry points. |
| Analytics/consent | Not implemented | Provider inventory, event contract, consent mode, duplication tests. |
| Automated browser tests | Not implemented | Requires approved preview/store data and stable selectors. |
| Lighthouse CI | Not configured | Requires dedicated store and approved GitHub secrets. |

## Recommended next sequence

1. Inspect real catalog, navigation, theme settings, and current storefront apps through the connected development theme.
2. Confirm Shopify Markets and published-language configuration for Switzerland/Liechtenstein, including German and English content ownership.
3. Inventory installed storefront apps, subscription provider, discount setup, shipping thresholds, and age-verification options.
4. Collect Figma, brand assets, fonts, and responsive design rules.
5. Implement one representative homepage and product journey to production quality.
6. Close product/cart accessibility and commerce gaps exposed by real data.
7. Add visual, journey, and Lighthouse checks once preview URLs are stable.
