# Implementation status

This file is a capability map, not a promise of production readiness.

Last reconciled with the repository on 2026-09-04.

## Implemented in the current theme

- Shopify theme directory structure and global `theme.liquid` layout.
- English source/default and German translated storefront UI locale files.
- Global color, logo, and favicon settings, a fixed shared 1920px layout-frame token, and a lightweight Figma-derived page-grain treatment.
- Persistent header and footer section groups.
- Figma-based responsive header shell with configurable default, Soda, and Hard Seltzer navigation contexts.
- Desktop brand switcher with active concave joins, textured hover/focus treatment, stable animated hit areas, and scroll-intent restoration of the black bar.
- Shopify-managed `Corporate Nav` black-bar navigation with resource-backed Blog and Contact links, automatic disclosure popovers and chevrons for nested items, and keyboard-accessible native details behavior.
- Separate Shopify-managed General, Soda, and Hard Seltzer primary-navigation menus, each initialized with Shop, Learn, and Subscribe placeholders and connected to its matching header context.
- Resource-backed Store Finder header action linked to the Shopify Händler page with an accessible animated pill treatment.
- Three context-aware Figma footer shells with separate Shopify-managed General, Soda, and Hard Seltzer nested navigation menus and a native Shopify newsletter form prepared for the existing Klaviyo sync; social, payment, store-finder, and language controls remain static previews.
- Shared Shopify-managed Legal Nav with resource-backed AGB, Datenschutz, Impressum, and Versandinformationen policy links across every footer context.
- Context-specific Arc, Soda, and Hard Seltzer header identities, plus a server-rendered localized footer year.
- Default grid-only, Soda brand, and Hard Seltzer brand collection templates.
- Context-aware local typography: Maison Neue Demi for body/UI and h3-h6, Erode Bold with −3% letter spacing for Soda h1/h2, and Newake for general and Hard Seltzer h1/h2, with Maison Neue Bold registered for future use.
- Context-independent footer card typography: Newake at weight 400 in General, Soda, and Hard Seltzer variants.
- Product detail pages inherit the complete Soda or Hard Seltzer shell through explicit branded templates or unambiguous membership in the configured brand collection.
- Merchant-owned `custom.product_world` definitions for Pages, Products, and Collections provide an explicit Soda or Hard Seltzer classification that overrides template and canonical-collection fallbacks.
- Twenty-eight documented Liquid sections cover the persistent shell, resource templates, and reusable editorial modules. The synchronized development homepage includes the new ingredient, reasons, awards, comparison and Subscription sections alongside existing modules; it retains merchant-entered test content and is not launch-ready copy. The `page.faq` template provides a server-rendered FAQ directory with progressive client-side search and category filtering. See the authoritative [Section reference](sections/README.md) for available sections, settings, responsive rules, assets, accessibility contracts, and known gaps.
- Shared fluid typography roles normalize body copy, headings, labels and actions across sections, with documented artwork exceptions and an automated regression check.
- A polished four-card Product Overview composition with responsive no-overlap scaling, a shared product floor, product-specific glows and tinted progressive SVG shadows, 90% Soda and 105% Hard Seltzer can scales, wave-logo SVG titles for Maracuja and Holunder, and horizontally scrollable phone layouts.
- JSON templates for home, product, collection, collection list, cart, search, page, blog, article, and 404.
- Responsive product cards and basic product media.
- Server-rendered product and cart forms.
- Progressively enhanced Ajax add-to-cart with status messaging.
- Canonical, description, Open Graph, and Twitter metadata.
- Mobile-first layout primitives, focus styles, skip link, and reduced-motion handling.
- Theme Check configuration and CI.
- Documented frontend asset ownership and Shopify CDN delivery rules, with enforced raw/gzip/Brotli reporting for global CSS and JavaScript.
- Local development and safety documentation.

## Known incomplete capabilities

| Area | Status | Required work |
| --- | --- | --- |
| Approved brand design | Homepage and global shell substantially implemented | Header, three footer shells, and the principal homepage editorial modules use supplied Figma references and brand assets. Continue representative responsive/editor QA and complete dedicated Soda, Hard Seltzer, product, and commerce surfaces. |
| Merchant content | Definitions and theme contract implemented; entries pending | The merchant-owned `merchant` and `merchant_collection` definitions exist on the connected store. Create the approved Merchant entries and collection, then select that collection in the Logo Marquee section. Future storefinder locations should reference these Merchant records. |
| Shared offer content | Implemented on development store | The `offer_card` and `offer_teaser` definitions and active canonical entries exist. Offer cards placements default to Local and can opt into the synchronized global record; verify editing and translation workflows before production deployment. |
| FAQ content | German legacy content imported; review and translations pending | The connected store has 11 active FAQ entries and four ordered categories imported from the previous public FAQ page. Review the inherited claims and destinations, add English source content and further translations, assign `page.faq` to the Shopify FAQ Page, and verify the section picker plus full directory against real data. The structured nutrition table remains outside the FAQ model pending a dedicated data decision. |
| Real store preview | Development theme connected | Normal Shopify authentication and `theme dev` are working against `sparklys-hard-seltzer.myshopify.com`; representative storefront and editor QA remain. |
| Product variants | Basic only | Option-based UI, variant URL state, media/price/availability sync, quantity rules, high-variant cases. |
| Discounts | Incomplete | Accessible regular/sale labels, line/cart discount allocations, checkout consistency. |
| Subscriptions | Promotional section implemented; commerce not implemented | Soda/Hard Seltzer promotional presets reuse Poster motion, responsive media and editable benefits/actions. Selling-plan selector, pricing, cart display, provider audit and account portal verification remain pending. |
| Age verification / MRZ | Discovery required | Legal/privacy review, provider-vs-custom decision, server-side trust boundary, data minimization, fallback journey. |
| Coupon entry and visibility | Not implemented | Apply/remove via cart state, full-cart and drawer UI, PDP applied state/hints, accessible validation feedback. |
| Cart drawer | Not implemented | Drawer interaction, synchronized cart state, focus management, no-JavaScript fallback. |
| Last-minute sale / “others took this” | Definition required | Clarify product behavior, merchandising source, eligibility, inventory, analytics, and app-vs-custom ownership. |
| Free-shipping upsell | Discovery required | Authoritative threshold by market/currency, qualifying subtotal, recommendations, progress UI, checkout consistency. |
| App blocks/embeds | Not implemented | Add supported hosts and audit installed apps. |
| Navigation | Basic | The general/Soda/Hard Seltzer context contract is documented; collection and product routing, Page/Product/Collection classification metafields, and all four Shopify-managed menus are connected. Assign product-world values to supporting resources as their content is created, replace placeholder destinations, then add main-navigation dropdown panels, robust mobile disclosures, and long-content testing. |
| Footer | Menu-driven shell with newsletter submission and social links | Replace footer-card placeholder destinations, then connect Shopify-supported payment methods, store finder, and accessible localization controls after their behavior is defined. Instagram, TikTok, and Facebook follow the Soda or Hard Seltzer footer context, while LinkedIn uses the shared company profile. Legal policy destinations are connected through the shared Legal Nav. Verify Shopify-to-Klaviyo list routing and opt-in behavior in the provider account before launch. |
| Cart | Basic | Discounts, properties, notes if required, selling plans, richer errors, accessible table semantics. |
| Markets/localization | Partial | Initial scope is Switzerland and Liechtenstein. URLs and Ajax are locale-aware; language/market selectors and real Markets QA remain. |
| Languages | Partial | German and English theme UI strings exist. Merchant content, published-language configuration, and likely French/Italian locale files remain. |
| SEO | Partial | FAQ sections and the FAQ directory emit server-rendered, deduplicated `FAQPage` JSON-LD matching their visible content. Company/site identity, Product, Article, and later applicable model work is tracked in the [structured-data task list](structured-data-tasks.md). |
| Search | Basic | Predictive search and refined mixed-result UI remain. |
| Customer accounts | Platform-dependent | Decide new customer accounts behavior and required storefront entry points. |
| Analytics/consent | Not implemented | Provider inventory, event contract, consent mode, duplication tests. |
| Automated browser tests | Not implemented | A connected development theme and real store data are available; define stable selectors and add repeatable journey, accessibility, and visual-regression coverage. |
| Lighthouse CI | Not configured | Requires dedicated store and approved GitHub secrets. |

## Recommended next sequence

1. Finish representative phone, desktop, keyboard, reduced-motion, and Theme Editor QA for the implemented homepage and shell.
2. Create and select the approved Merchant records required by Logo Marquee and verify the shared offer editing/translation workflow.
3. Confirm Shopify Markets and published-language configuration for Switzerland/Liechtenstein, including German and English content ownership.
4. Inventory installed storefront apps, subscription provider, discount setup, shipping thresholds, and age-verification options.
5. Complete Soda, Hard Seltzer, and one representative product journey to production quality.
6. Close product/cart accessibility and commerce gaps exposed by real data.
7. Add visual, journey, accessibility, and Lighthouse checks against a stable preview target.
