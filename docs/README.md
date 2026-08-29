# Documentation

This directory is the durable context for the Sparklys storefront. It records our decisions and routes developers to the current official Shopify source instead of copying large manuals that will become stale.

## Reading order

1. [Product](product.md) — what we are building and why.
2. [Architecture](architecture.md) — how the theme is organized and the rules behind it.
3. [Section reference](sections/README.md) — index and detailed contract for every Liquid section.
4. [Development](development.md) — setup, validation, previewing, and delivery safety.
5. [Quality](quality.md) — accessibility, performance, SEO, and verification standards.
6. [Commerce](commerce.md) — product, cart, subscriptions, markets, and app integration boundaries.
7. [Status](status.md) — what the current theme supports and what remains.
8. [Task inbox](tasks.md) — temporary pending ideas that must not be implemented without explicit approval.
9. [Merchant content](merchant-content.md) — shared Merchant and Merchant Collection model for the Logo Marquee, storefinder, and later integrations.
10. [Shared section content](shared-section-content.md) — Local/Global content-source contract for freely placed synchronized sections.
11. [Shopify reference](shopify-reference.md) — searchable topic index into official documentation.

## Source policy

- Local docs define Sparklys decisions and constraints.
- [Shopify developer documentation](https://shopify.dev/docs/storefronts/themes) defines platform behavior.
- The [Shopify Liquid reference](https://shopify.dev/docs/api/liquid) defines available tags, filters, and objects.
- When platform behavior matters, verify the current official page before implementing. Record new durable conclusions here, but link to the source rather than vendoring the whole page.

Official resources and repository contracts in this stack were reviewed on 2026-08-29.
