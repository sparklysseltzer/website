# Section reference

This directory documents every Liquid section in `sections/`. Keep implementation details here; keep cross-cutting rules in [Architecture](../architecture.md), commerce requirements in [Commerce](../commerce.md), and capability state in [Status](../status.md).

Last reconciled with the repository: 2026-09-15. The tables below cover all 34 Liquid sections; variants and presets do not count as separate sections.

## Shared contracts

All sections follow the [design system](../design-system.md), [asset-delivery rules](../frontend-assets.md), [Theme Editor conventions](../architecture.md#theme-editor-configuration-design), and [quality standards](../quality.md). Section documents list their typography role mappings and genuine exceptions; shared numeric scales and general rules live only in the owning guides. For current placement and merchant settings, inspect the relevant JSON template rather than treating a preset's availability as proof of placement.

## Global shell

| Section | Role | Placement |
| --- | --- | --- |
| [Header](header.md) | Brand-context navigation, utility menu, store finder, account preview, and cart link | `header-group.json` |
| [Cart drawer](cart-drawer.md) | Global modal cart with synchronized rows, totals and checkout | Static section in `layout/theme.liquid` |
| [Footer](footer.md) | Brand-context newsletter, navigation, legal, social, and commerce preview | `footer-group.json` |

## Reusable editorial and merchandising sections

| Section | Add-section category | Role |
| --- | --- | --- |
| [Page intro](page-intro.md) | Brand storytelling | Page-owned label, H1 and introduction with decorative Arc |
| [Hero](hero.md) | Brand storytelling | Full-width heading, optional image, copy, and action |
| [Rich text](rich-text.md) | Brand storytelling | Narrow editorial copy and optional action |
| [Two-column layout](two-column.md) | Brand storytelling | Nested editorial content and repeatable sidebar/link boxes |
| [Text and image](text-image.md) | Brand storytelling | Open image/copy composition with matching mobile reading order |
| [Accordeon](faq-accordion.md) | Trust & information | Custom text/image accordion with optional FAQs, also available inside Two-column layout |
| [Poster](poster.md) | Brand storytelling | Full-image editorial poster with overlaid content |
| [Subscription](subscription.md) | Brand storytelling | Soda/Hard Seltzer subscription poster with benefits, subscribe action and sign-in link |
| [Image and text panel](split-image-text.md) | Brand storytelling | Side-by-side editorial image and content panel |
| [Product benefits](usp-section.md) | Brand storytelling | Context-aware Soda or Hard Seltzer image, copy, and five Soda / six Hard Seltzer USP items |
| [Hard Seltzer ingredients](hard-seltzer-ingredients.md) | Trust & information | Three-part Hard Seltzer ingredient story with replaceable illustrations |
| [Hard Seltzer awards](hard-seltzer-awards.md) | Trust & information | Hard Seltzer award presentation with an optional shop action |
| [Soda ingredients](soda-ingredients.md) | Trust & information | Six-item Soda ingredient overview and legal footnote |
| [Soda — Three reasons](soda-three-reasons.md) | Trust & information | Three illustrated Soda benefit statements and legal footnote |
| [Product comparison](versus.md) | Trust & information | Soda or Hard Seltzer comparison cards in a responsive horizontal flow |
| [FAQ with categories](faq.md) | Trust & information | Additive selected and category-driven FAQ accordion with a closing contact link |
| [Featured collection](featured-collection.md) | Products & offers | Configured collection preview using the shared product card |
| [Product overview](product-overview-teaser.md) | Products & offers | Four-card Soda and Hard Seltzer editorial product navigation |
| [Offer cards](offer-cards.md) | Products & offers | Local or globally synchronized audience/use-case cards |
| [Merchant marquee](logo-marquee.md) | Trust & partners | Metaobject-driven merchant-logo loop |

## Resource sections

| Section | Template |
| --- | --- |
| [Product](main-product.md) | `product*.json` |
| [Collection hero](collection-hero.md) | `collection*.json` |
| [Collection](main-collection.md) | `collection*.json` |
| [Cart](main-cart.md) | `cart.json` |
| [Search](main-search.md) | `search.json` |
| [Blog](main-blog.md) | `blog.json` |
| [Article](main-article.md) | `article.json` |
| [Page](main-page.md) | `page.json` |
| [FAQ directory](main-faq.md) | `page.faq.json` |
| [Collection list](main-list-collections.md) | `list-collections.json` |
| [404](main-404.md) | `404.json` |

## Maintenance rule

When a section's schema, rendering contract, fallback assets, motion, data source, or known limitation changes, update its file in the same change. Do not put detailed section behavior back into `architecture.md` or duplicate capability claims across several root documents.

## Breakpoint visibility

Every non-essential section exposes **Visibility → Hide on mobile / Hide on desktop**, both defaulting to false. Mobile is `width < 768px`; desktop includes tablets at `width >= 768px`, with no fractional-width gap. Both enabled hides the section everywhere. Existing saved JSON is unchanged.

`snippets/section-visibility.liquid` owns both media queries and targets Shopify's outer section wrapper. Storefront hiding uses CSS `display: none`, leaving no layout gap, focusable descendants or accessibility-tree content, including without JavaScript. Viewport changes apply immediately rather than animating responsive layout disappearance. Normal section motion remains unchanged. CSS hiding is presentation only: it does not prevent Liquid rendering, asset downloads, app activity or provide access control.

In the Theme Editor, a hidden section's children are replaced visually by an English administrative placeholder at the affected width. Its wrapper and sidebar entry remain selectable; switch off the relevant setting to edit the full content. This deliberately identifies a configured hidden section rather than presenting it as storefront content. No editor JavaScript is needed, including after section reloads.

Essential-function exceptions: Header, Main product, Main cart and Cart drawer do not expose these settings, preserving navigation, purchase forms and the shared modal/age-check host. All other current sections, including the footer and resource content sections, use the same contract. Future sections must adopt the controls and renderer unless an essential-function exception is documented here.

FAQ sections suppress their JSON-LD when both hide settings are enabled; with one enabled, their content remains accessible at the other viewport. No new structured-data entity is introduced by visibility controls. Hidden duplicate editorial copies should not carry independent conflicting content.
