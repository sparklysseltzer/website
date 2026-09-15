# Implementation status

This is the current capability map, not a promise of production readiness. Reconciled with local code and owning contracts on 2026-09-13. Remote provisioning dates elsewhere are historical records; this audit did not revalidate every store setting or provider integration.

## Implemented in the current theme

- Buildless Shopify Online Store 2.0 theme with Liquid, native CSS, vanilla JavaScript, resource templates and configurable sections. The [section reference](sections/README.md) is the sole complete section inventory.
- Shared General, Soda and Hard Seltzer header/footer contexts, using `custom.brand_variant`, canonical collection fallbacks and merchant-owned menus. General footer cards, newsletter submission, social/legal navigation and shared payment artwork are implemented. Payment artwork is not a verified gateway inventory.
- English source theme UI and German translations. The footer's native language selector uses published/available Shopify languages; English publication remains deferred until go-live. It does not switch countries or currencies.
- Shared typography, palette, radius, form, focus, notification and motion contracts. Editorial heading choices default to Erode; specified merchandising sections and footer card headings retain their established typography. The local Design Studio is preserved outside the storefront.
- Shared PDP media slider, flavour cross-links, packaging and quantity selection, variant URL/media/price/availability state, selling-plan selection, subscription benefits, badges, shipping/payment reuse and product structured data. Current catalog variants are supported; option-by-option and very large variant catalogs remain separate work.
- Product-owned layered gradient and optional background-image rendering for galleries and basic cards. Soda Variety Pack uses the exact Figma background export with the original blurred shapes. Page canvas colors remain separate: default beige, homepage/all collections white, products use their existing background field with white fallback.
- Native/Ajax cart and drawer with synchronized quantities, removal, notes, public properties, selling-plan display, discount allocations and coupon apply/remove feedback. Shared notifications distinguish stock warnings from errors. See [cart drawer](sections/cart-drawer.md) and [cart page](sections/main-cart.md) for verification limits.
- Configurable CH/LI shipping progress in CHF, including the documented trial-pack exception, and curated cart recommendations with variant selection. Commerce values come from current theme/Shopify data; defaults are not universal shipping promises.
- Browser-local MRZ age plausibility check, controlled by explicit alcohol metafields. Minimum age defaults to 18 and is configurable to 16. CH/LI IDs/passports and other-country standard TD3 passports are supported within the documented format limits. This does not authenticate identity, prove residency or enforce Shopify checkout server-side.
- Page-owned intro fields, reusable editorial introductions and default page/policy body rendering. Nested editorial composition includes Accordeon items with Text, Image, Text and image, Poster and optional FAQ entries. Existing internal IDs are preserved.
- Merchant/FAQ/offer and product-world content models, native FAQ directory filtering, and shared FAQ structured data. Product and page structured data follow their owning contracts; other typed-content gaps remain tracked separately.
- Guarded local development preview and shared-theme release workflows, protected editor-owned content, direct Shopify Admin API client, schema contracts, asset budgets, typography checks and commerce regression tests.

## Known incomplete capabilities

| Area | Remaining work |
| --- | --- |
| Launch content | Review merchant text, claims, imagery, menus, placeholder destinations, template assignments and translations against the current shared draft. Local development fixtures are not release content. |
| Full journey QA | Complete repeatable phone/desktop, keyboard, no-JavaScript, reduced-motion and Theme Editor coverage. Individual verification records do not certify every section/configuration combination. |
| Subscriptions | Audit completed checkout, provider account management, unusual selling plans and payment behavior. Custom build-a-box subscriptions remain future work. |
| Discounts and shipping | Reconfirm real campaign-code combinations, checkout retention and actual configured rates/eligibility before launch. PDP coupon discovery/hints remain outside current scope. |
| Age verification | Review classification, document support, privacy, unsupported-document assistance and rollout. Trusted identity verification requires a separate server/provider design. |
| Markets and languages | Verify CH/LI Markets and language publication/translation completeness. French/Italian and other markets are not implemented or implied. |
| Navigation and footer | Local mega-menu/mobile sheet implemented and fixture-tested; configure real nested menus and Navigation images separately, verify published-language navigation, store-finder destination, newsletter/Klaviyo routing and actual payment-provider availability. |
| SEO | Complete the [structured-data backlog](structured-data-tasks.md); verify metadata, canonical URLs, accessible H1s and launch indexing behavior. |
| Collections and search | All-products collection filters and shared cards are implemented locally. Native facet/sort controls, predictive search and richer mixed-result UI remain follow-ups. |
| Customer accounts and apps | Audit Shopify account entry/portal behavior and installed app blocks/embeds end to end. |
| Analytics and consent | Define provider inventory, event ownership, consent requirements and duplicate-event checks. |
| Accessibility and performance | Complete enlarged-text/zoom reflow, full-site accessibility and stable browser regression coverage. Lighthouse CI is not configured. |
| Design Studio | Local forms reference and adjustable Button Motion Lab; broader expansion is deferred in the [task inbox](tasks.md). |

## Recommended next sequence

1. Review shared-draft editorial content, page-template assignments and merchant configuration for launch.
2. Complete representative product/cart/subscription/age-check journeys and responsive accessibility QA.
3. Verify checkout, discounts, shipping, account/provider integrations and CH/LI language/market settings.
4. Close the approved SEO and consent gaps, then add repeatable browser/performance coverage.

The shared `website/main` theme remains unpublished unless explicitly authorized. Store data, app permissions and theme publication have separate scopes; a code commit is not a deployment or publishing action.

### Collection implementation — 2026-09-15

Local all-products filtering and shared collection cards are implemented, with branded/neutral Collection hero, bounded cloud parallax, paused/offscreen ambient color/can motion, existing USP data plus an optional featured benefit, server-rendered CollectionPage/ItemList, and reusable editorial demo compositions. Shared editorial templates and collection suffix assignments are not deployed/changed. Current hidden variety/trial products remain hidden; Clothing and Accessories retain separate filters. See the owning section docs for tested limits and launch copy/data work.
