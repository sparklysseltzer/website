# Main page

Source: `sections/main-page.liquid`

Template: `templates/page.json`

The section renders the Shopify Page title as the only `h1` and outputs `page.content` inside the shared rich-text primitive. It has no section settings, blocks, or JavaScript. Supporting pages can select Soda or Hard Seltzer through the Page's `custom.product_world` metafield; that classification changes the shared shell and heading typography but does not change this section's composition. Brand-context resolution is documented in [Architecture](../architecture.md).
