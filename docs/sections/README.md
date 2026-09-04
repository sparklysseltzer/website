# Section reference

This directory documents every Liquid section in `sections/`. Keep implementation details here; keep cross-cutting rules in [Architecture](../architecture.md), commerce requirements in [Commerce](../commerce.md), and capability state in [Status](../status.md).

Last reconciled with the repository: 2026-09-04.

## Global shell

| Section | Role | Placement |
| --- | --- | --- |
| [Header](header.md) | Brand-context navigation, utility menu, store finder, account preview, and cart link | `header-group.json` |
| [Footer](footer.md) | Brand-context newsletter, navigation, legal, social, and commerce preview | `footer-group.json` |

## Reusable editorial and merchandising sections

| Section | Add-section category | Role |
| --- | --- | --- |
| [Hero](hero.md) | Brand storytelling | Full-width heading, optional image, copy, and action |
| [Rich text](rich-text.md) | Brand storytelling | Narrow editorial copy and optional action |
| [Poster](poster.md) | Brand storytelling | Full-image editorial poster with overlaid content |
| [Split Image-Text](split-image-text.md) | Brand storytelling | Side-by-side editorial image and content panel |
| [USP](usp-section.md) | Brand storytelling | Context-aware Soda or Hard Seltzer image, copy, and five USP items |
| [FAQ](faq.md) | Trust & information | Additive selected and category-driven FAQ accordion with a closing contact link |
| [Featured collection](featured-collection.md) | Products & offers | Configured collection preview using the shared product card |
| [Product overview teaser](product-overview-teaser.md) | Products & offers | Four-card Soda and Hard Seltzer editorial product navigation |
| [Offer cards](offer-cards.md) | Products & offers | Local or globally synchronized audience/use-case cards |
| [Merchant marquee](logo-marquee.md) | Trust & partners | Metaobject-driven merchant-logo loop |

## Resource sections

| Section | Template |
| --- | --- |
| [Main product](main-product.md) | `product*.json` |
| [Main collection](main-collection.md) | `collection*.json` |
| [Main cart](main-cart.md) | `cart.json` |
| [Main search](main-search.md) | `search.json` |
| [Main blog](main-blog.md) | `blog.json` |
| [Main article](main-article.md) | `article.json` |
| [Main page](main-page.md) | `page.json` |
| [FAQ directory](main-faq.md) | `page.faq.json` |
| [Main collection list](main-list-collections.md) | `list-collections.json` |
| [Main 404](main-404.md) | `404.json` |

## Maintenance rule

When a section's schema, rendering contract, fallback assets, motion, data source, or known limitation changes, update its file in the same change. Do not put detailed section behavior back into `architecture.md` or duplicate capability claims across several root documents.
