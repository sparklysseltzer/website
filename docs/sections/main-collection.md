# Main collection

Source: `sections/main-collection.liquid`

Templates: `templates/collection.json`, `templates/collection.soda.json`, `templates/collection.seltzer.json`

## Merchant controls

- show or visually hide the collection title and description;
- paginate 8 to 32 products in steps of four, default 16.

## Rendering contract

The section is the authoritative catalog surface for ordinary and branded collection templates. It renders `collection.products` through `snippets/product-card.liquid`, an empty-state locale string, and shared pagination. When the visible header is disabled, the collection title remains as a visually hidden `h1`.

Soda and Hard Seltzer collection templates place editorial Hero and Rich text sections around this same native product grid; they do not duplicate the catalog on regular Pages.

## Known gaps

Sorting, filtering, active-filter state, merchandising badges, quick add, and richer collection SEO presentation are not implemented.

## Shared typography roles

Hero-size page title; body description; compact product-card names.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
