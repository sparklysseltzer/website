# Collection list

Source: `sections/main-list-collections.liquid`
Template: `templates/list-collections.json`
Route: `/collections`

## Rendering and content

Automatically lists all storefront collections in Shopify's default alphabetical order, paginated by 50. Each item reuses `poster-content` and `component-poster.css`, with a wide rounded image, left-aligned title/description and a localized collection link. Figma reference: `4936:24671`. The all-products panel, subscription panel and FAQ area are deliberately outside this page's implementation.

Edit each collection in Shopify to maintain its title, description and collection image. The collection image is preferred, followed by Shopify's featured image. If neither exists, the poster has a plain dark surface; unrelated subscription artwork is never substituted. Native focal points control responsive cover crops. No duplicated section copy, manually selected collection list, new metafields or remote store changes are required. Images come from Shopify rather than expired Figma URLs.

The page has one localized H1 and each poster has an H2. A server-rendered CollectionPage/ItemList describes exactly the collection destinations displayed on the current pagination page. No product offers or FAQ entities are emitted.

## Styling and motion

The directory uses the shared Poster width, radius, overlay, buttons and section heading size. Desktop minimum height is 545px, phone minimum height 480px; content can expand naturally. Posters stack with a 2rem gap. The page title uses the hero role and shared section spacing. `/collections` has the same white page background as individual collection pages.

The existing Poster scroll reveal and media parallax are reused, including reduced-motion and no-JavaScript static presentation. Collection links and pagination are native anchors. Existing standalone and embedded Poster configurations retain their prior behavior.

## Editor controls

The existing Heading font selector remains authoritative (Erode default, optional Newake). It applies to headings, including rich-text headings, while body/UI copy remains Maison Neue. No schema or setting IDs changed. Existing Hide on mobile / Hide on desktop controls follow the shared visibility contract.

## Verification

Local desktop and phone checks cover collection destination links, responsive images, one H1, matching ItemList entries, reduced motion and keyboard access. Store/editor-owned template content is unchanged; deployment remains separate.
