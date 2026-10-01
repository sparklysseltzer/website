# Structured-data task list

This file tracks deferred Schema.org and JSON-LD work discovered during the 2026-09-04 storefront audit. These items are pending by default and must not be implemented without explicit approval. The implementation rules in [Architecture](architecture.md#structured-data) remain authoritative.

## Existing implementation

FAQ, Product/ProductGroup, Article and collection/blog ItemList markup are implemented. Their owning section contracts are indexed in the [section reference](sections/README.md); do not rebuild them from this backlog. Remaining organization references and external validation are tracked below.

## Pending retrofit work

### Company and website identity

- [ ] Add one canonical homepage JSON-LD graph containing an `OnlineStore` entity and, where useful, a linked `WebSite` entity.
- [ ] Source the store name and canonical URL from Shopify's `shop` object.
- [ ] Source logo, square logo, description, slogan, and available social profiles from `shop.brand`; do not create a duplicate company metaobject for the current single-company storefront.
- [ ] Give the store a stable identifier such as `{{ shop.url }}/#organization` so Product and Article publishers can reference the same entity.
- [ ] Add verified legal name, public contact details, address, VAT ID, return policy, or shipping policy only when an authoritative Shopify source exists and publication has been approved. Omit unknown data instead of inventing it.
- [ ] Use `LocalBusiness` only if Sparklys later represents a public physical location and has the required verified location data.
- [ ] Validate the square logo against Google's current crawlability, format, white-background, and minimum-size guidance.

### Product detail pages

- [ ] Link the Product brand or seller/publisher to the canonical store entity rather than defining a competing organization.

### Articles and news

- [ ] Connect the native article output to the canonical Sparklys publisher identity once the homepage organization graph is defined, without emitting a duplicate Article entity. Preserve Shopify-backed headline, URLs, image, dates and author.

### Page hierarchy and remaining models

- [ ] Decide whether visible breadcrumb navigation will be introduced on product, collection, article, and standard page templates; add matching `BreadcrumbList` JSON-LD only with that deliberate navigation contract.
- [ ] Review future storefinder/location data for the appropriate `LocalBusiness` subtype only after the location model and public details exist.
- [ ] Review future events, recipes, reviews, subscriptions, and other typed models when they are designed; implement their applicable Schema.org representation in the same feature change.

## Deliberate non-targets

- Offer Cards are editorial navigation/use-case cards, not purchasable Schema.org `Offer` entities. Do not mark them as offers unless their product meaning changes.
- Product cards on collection, featured-collection, overview, and search surfaces link to canonical product pages; do not duplicate full Product entities across listing pages by default.
- Merchant Marquee records are outbound retailer references, not Sparklys organization entities. Do not publish Organization JSON-LD for each logo without sufficient public company data and a clear page purpose.
- Generic Hero, Poster, Split Image-Text, Rich Text, USP, cart, search, and error sections do not currently represent standalone typed entities.

## Validation before completion

- [ ] Parse every rendered `application/ld+json` block as JSON.
- [ ] Confirm each entity matches content visible and accessible on the same canonical page.
- [ ] Check locale, market, currency, URLs, images, availability, and duplicate `@id` values.
- [ ] Run Schema.org Validator and Google's Rich Results Test against an accessible development or production URL where the type is supported.
- [ ] Update the owning section documentation and [Implementation status](status.md) when each retrofit is completed.
