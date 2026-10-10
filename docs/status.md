# Implementation status

This is the current capability map, not a promise of production readiness. Reconciled with local code and owning contracts on 2026-10-04. Remote provisioning dates elsewhere are historical records; this audit did not revalidate every store setting or provider integration.

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
- Independent product Navigation Image (`custom.teaser_image`, renamed existing definition) and Collection Image (`custom.collection_image`) sources are implemented for navigation versus collection/featured/search cards. Definitions were verified on 2026-10-08; artwork migration and product assignments were excluded. See [Merchant content](merchant-content.md#product-navigation-and-collection-images).
- Collection filtering, shared catalog cards, branded/neutral collection heroes and collection overview are implemented. CollectionPage/ItemList markup uses real resources; merchant compositions and resource template assignments require separate review.
- News teaser, paginated blog listing and article detail share responsive cards. Detail includes accessible sharing/copy, related posts and Shopify Article markup; lists emit ItemList. See the owning section contracts for verification limits.

Team page addition (2026-10-02): reusable Team section and merchant-owned Team metaobjects support single/selected/all-active cards, responsive contacts and an independently placeable Shopify-hosted Video section with shared width presets. Nine active entries and two drafts were copied from the published theme, with existing portraits and contact data preserved. Development template only; see [Team](sections/team.md).

## Known incomplete capabilities

Contact page addition (2026-10-01): native enquiry form and Page intro are available on the development `kontakt` template. Optional direct Klaviyo newsletter signup is configured for merchant-confirmed list `TwzfPb`; real provider verification remains pending; see [Contact form](sections/contact-form.md). No shared/live deployment. Contact intro English translation and release SEO metadata remain pending.

This is the launch-readiness list. Separately scoped feature and maintenance proposals live in the [task backlog](tasks.md), including the [storefront audit and cleanup plan](tasks.md#task-016-audit-and-clean-up-the-storefront). Specific [SEO](structured-data-tasks.md) and [age-check](age-verification-extensions.md) work stays in its owning list.

| Area | Remaining work |
| --- | --- |
| Launch content | Review merchant text, claims, imagery, menus, placeholder destinations, template assignments and translations against the current shared draft. Local development fixtures are not release content. |
| Full journey QA | Complete repeatable phone/desktop, keyboard, no-JavaScript, reduced-motion and Theme Editor coverage. Individual verification records do not certify every section/configuration combination. |
| Subscriptions | Audit completed checkout, provider account management, unusual selling plans and payment behavior. Custom build-a-box subscriptions remain future work. |
| Discounts and shipping | Reconfirm real campaign-code combinations, checkout retention and actual configured rates/eligibility before launch. PDP coupon discovery/hints remain outside current scope. |
| Age verification | Review classification, document support, privacy, unsupported-document assistance and rollout. Trusted identity verification requires a separate server/provider design. |
| Markets and languages | Verify CH/LI Markets and language publication/translation completeness. French/Italian and other markets are not implemented or implied. |
| Navigation and footer | Mega-menu/mobile sheet, menu structure copying and resource Navigation image definitions are implemented. Review final menu/image content and verify published-language navigation, store-finder destination, newsletter/Klaviyo routing and actual payment-provider availability. |
| SEO | Complete the [structured-data backlog](structured-data-tasks.md); verify metadata, canonical URLs, accessible H1s and launch indexing behavior. |
| Collections and search | All-products collection filters and shared cards are implemented. Native facet/sort controls, predictive search and richer mixed-result UI remain follow-ups. |
| Customer accounts and apps | Audit Shopify account entry/portal behavior and installed app blocks/embeds end to end. |
| Analytics and consent | Define provider inventory, event ownership, consent requirements and duplicate-event checks. |
| Accessibility and performance | Complete enlarged-text/zoom reflow, full-site accessibility and stable browser regression coverage. Lighthouse CI is not configured. |
| Design Studio | Three-pane workbench, navigation/search and several real component previews are implemented; maintain parity as new components are added. See [Design Studio](design-studio.md). |

## Recommended next sequence

1. Review shared-draft editorial content, page-template assignments and merchant configuration for launch.
2. Complete representative product/cart/subscription/age-check journeys and responsive accessibility QA.
3. Verify checkout, discounts, shipping, account/provider integrations and CH/LI language/market settings.
4. Close the approved SEO and consent gaps, then add repeatable browser/performance coverage.

The shared `website/main` theme remains unpublished unless explicitly authorized. Store data, app permissions and theme publication have separate scopes; a code commit is not a deployment or publishing action.

About page (2026-10-02): development `page.ueber-uns` composes the published origin story, original polaroid collage and merchant-authorized Huber/Lars continuation in Two-column layout, with relevant sidebar navigation and brand promotions. Page intro emits AboutPage. Live page assignment and published theme remain unchanged.

Press page (2026-10-02): development `page.press-media-kit` reuses shared intro, rich text, marquee, link boxes, editorial photographs and the independent Press form. Press/Press article metaobjects centralize publisher logos and repeatable article links, with a reusable selected-publication article section and ItemList data. Published theme untouched.

Press form separation (2026-10-02): Press and Contact now have independent section schemas and field markup, sharing enquiry CSS and the native-contact/newsletter controller. The development Press template was migrated from its latest saved content with all settings and section identity preserved. Both currently expose the same field inventory; future media-specific fields belong only to Press. No shared/live deployment.

Hero slider (2026-10-02): shared Slides metaobjects, ordered per-placement selection, responsive image/video media, progress navigation and media-hover-paused autoplay. Development homepage fixture only; no shared/live deployment. See [Hero slider](sections/hero-slider.md).

## Current editorial tooling and follow-ups

- Consolidated content widths: Narrow 800px, Editorial 1400px and Page 1920px outer frame, with controls on suitable sections. Two-column layout offers an optional sticky sidebar.
- Native nested Image and text panel columns contain independent tick blocks. Existing flat content remains compatible; a reviewed migration script creates separate output files, without remote writes.
- Content Slider supports local crosslink/benefit blocks, drag settling, card background/blending and optional viewport bleed. Brand statement uses reversible word-level blur reveal.
- Hero slider uses viewport-height composition only in landscape; portrait stacks 16:9 media and title naturally. Separate Poster Slideshow uses image/video blocks and Poster height controls.
- Product overview now has the consolidated 1200px responsive composition; its owning document records the current artwork and badge proportions.
- Native Contact and Press fields share enquiry styling, separate from PDP variant selectors. PDP dynamic money formatting combines storefront language with market country; this does not activate new markets.
- The reported intermittent scroll-reveal disappearance has not been reproduced or fixed. In the user tab inspected on 2026-10-04, cards were present and visible without reloading; capture the failing state before attributing a cause.
- The [content transfer controller plan](content-transfer-controller-plan.md) covers Dev ↔ website/main only, with explicit template/all-content scope and code-only defaults. Implementation is pending; store records stay shared and the live theme is excluded.
