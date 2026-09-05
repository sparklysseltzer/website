# Main page

Source: `sections/main-page.liquid`

Template: `templates/page.json`

The section renders the Shopify Page title as the only `h1` and outputs `page.content` inside the shared rich-text primitive. It has no section settings, blocks, or JavaScript. Supporting pages can select Soda or Hard Seltzer through the Page's `custom.product_world` metafield; that classification changes the shared shell and heading typography but does not change this section's composition. Brand-context resolution is documented in [Architecture](../architecture.md).

## Shared typography roles

Hero-size page title; body reading copy; shared semantic heading roles inside rich text.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
