# Section reference

This directory documents every Liquid section in `sections/`. Keep implementation details here; keep cross-cutting rules in [Architecture](../architecture.md), commerce requirements in [Commerce](../commerce.md), and capability state in [Status](../status.md).

Last reconciled with the repository: 2026-08-29.

## Global shell

| Section | Role | Placement |
| --- | --- | --- |
| [Header](header.md) | Brand-context navigation, utility menu, store finder, account preview, and cart link | `header-group.json` |
| [Footer](footer.md) | Brand-context newsletter, navigation, legal, social, and commerce preview | `footer-group.json` |

## Reusable editorial and merchandising sections

| Section | Role |
| --- | --- |
| [Hero](hero.md) | Full-width heading, optional image, copy, and action |
| [Rich text](rich-text.md) | Narrow editorial copy and optional action |
| [Featured collection](featured-collection.md) | Configured collection preview using the shared product card |
| [Product overview teaser](product-overview-teaser.md) | Four-card Soda and Hard Seltzer editorial product navigation |
| [Offer cards](offer-cards.md) | Local or globally synchronized audience/use-case cards |
| [Poster](poster.md) | Full-image or split editorial poster |
| [Merchant marquee](logo-marquee.md) | Metaobject-driven merchant-logo loop |

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
| [Main collection list](main-list-collections.md) | `list-collections.json` |
| [Main 404](main-404.md) | `404.json` |

## Maintenance rule

When a section's schema, rendering contract, fallback assets, motion, data source, or known limitation changes, update its file in the same change. Do not put detailed section behavior back into `architecture.md` or duplicate capability claims across several root documents.
