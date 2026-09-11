# Structured-data task list

This file tracks deferred Schema.org and JSON-LD work discovered during the 2026-09-04 storefront audit. These items are pending by default and must not be implemented without explicit approval. The implementation rules in [Architecture](architecture.md#structured-data) remain authoritative.

## Completed foundation

- [x] Reusable FAQ sections emit server-rendered `FAQPage` JSON-LD for the questions and answers actually rendered.
- [x] The full FAQ directory emits the same deduplicated `FAQPage`, `Question`, and `Answer` model.
- [x] Add a repository rule requiring applicable structured data for every new or materially changed entity-like content feature.

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

- [x] Add Product JSON-LD to all product templates through one shared renderer (`main-product`, Shopify `structured_data`, 2026-09-11).
- [x] Include truthful Shopify-backed name, canonical URL, description, images, brand, SKU/GTIN identifiers when present, and variant/offer availability through Shopify’s native Product/ProductGroup output.
- [x] Use active-market prices/currency and truthful variant availability. Verified CHF 28.80/57.60 offers against the actual Holunder variant data and visible selectable one-time prices.
- [ ] Link the Product brand or seller/publisher to the canonical store entity rather than defining a competing organization.
- [x] Revalidate the rendered result after the product variant UI is completed: parsed one ProductGroup with two real variant Offers; no duplicate product entity or invented reviews.

### Articles and news

- [ ] Add `BlogPosting` or the most accurate Article subtype to individual article pages.
- [ ] Include headline, canonical URL, image when present, publication/modification dates, author when available, and the canonical Sparklys publisher reference.
- [ ] Do not emit full Article entities for cards on blog index, search, or recommendation surfaces.

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
