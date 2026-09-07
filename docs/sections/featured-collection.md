# Featured collection

Source: `sections/featured-collection.liquid`

## Purpose and placement

Featured collection renders a merchant-selected collection preview through the shared `snippets/product-card.liquid` primitive. It is available as a reusable section preset.

## Merchant controls

- heading;
- Shopify collection;
- two to eight products, default four.

## Rendering contract

When a collection exists, the section links to `collection.url` and renders the configured number of products in collection order. When no collection is selected, four Shopify placeholder product cards keep the Theme Editor preview understandable. The section is server-rendered and requires no JavaScript.

## Known limits

The section inherits the basic shared product card and grid. It does not provide merchandising overrides, quick add, variant selection, badges, slider behavior, or per-product blocks.

## Typography roles

Section heading; compact product-card names; body prices; UI actions.
