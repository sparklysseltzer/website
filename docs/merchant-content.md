# Merchant content model

Merchant content is shared storefront data, not content owned by one theme section. The Logo Marquee is its first consumer; the planned storefinder and a later CRM or ERP integration must reuse the same records rather than duplicating names, logos, links, or descriptions.

## Product-world classification

Products and Pages reuse the existing merchant-owned Brand Variant field:

| Admin name | Namespace and key | Shopify type | Brand values |
| --- | --- | --- | --- |
| Brand Variant | `custom.brand_variant` | `single_line_text_field` | `soda`, `hardseltzer` |

Use the field on branded products and supporting pages. Leave shared/general content blank. The resolver normalizes `hardseltzer` to internal `seltzer` (also accepting `seltzer`) and gives recognized values precedence over template and collection fallbacks. Collections currently use the canonical `soda` and `hard-seltzer` handles; the resolver also supports the same Brand Variant key if a collection override becomes necessary, without requiring duplicate classification data today.

The field changes the server-rendered header, footer, navigation, and heading typography. It does not change the resource's JSON template or add sections. Choose the appropriate template separately when Soda and Hard Seltzer need different page composition. Alcohol eligibility remains exclusively `custom.contains_alcohol`.

The obsolete Product world definitions were audited on 2026-09-10: zero populated Products, Collections or Pages. They were removed using definition-only deletion. Brand Variant already exists on Products and Pages; do not recreate Product world. The four Soda products retain `soda`; Maracuja retains `hardseltzer`, and missing `hardseltzer` values were added to Holunder and the Hard Seltzer Variety Pack. The existing Soda business-subscription Page retains `soda`. Canonical collections need no additional field. Values remain merchant-managed Shopify data, outside this repository.

## Definitions

### `merchant`

Admin name: **Merchants**. Display name field: `name`.

| Key | Shopify type | Required | Purpose |
| --- | --- | --- | --- |
| `name` | `single_line_text_field` | Yes | Public merchant or brand name and the default accessible logo label. |
| `url` | `url` | No | Merchant destination. The theme does not force external links into a new tab. |
| `logo` | `file_reference` limited to images | Yes | Canonical logo stored in Shopify Files. Transparent SVG, PNG, or WebP is preferred. |
| `description` | `rich_text_field` | No | Reusable merchant description for future directory, profile, or storefinder surfaces. It is not rendered by the Logo Marquee. |

Enable storefront `PUBLIC_READ`, the publishable capability, and the translatable capability. Draft entries must remain unavailable to Liquid; activate an entry only when its customer-facing content is ready. The stable metaobject handle is the initial API identity. Add a separate external-system ID only when the CRM or ERP contract requires an identifier that cannot safely map to that handle.

### `merchant_collection`

Admin name: **Merchant Collections**. Display name field: `name`.

| Key | Shopify type | Required | Purpose |
| --- | --- | --- | --- |
| `name` | `single_line_text_field` | Yes | Internal name for selecting the collection in the theme editor. |
| `merchants` | `list.metaobject_reference` restricted to `merchant` | Yes | Ordered merchant list. Its order is the storefront display order. |

Enable storefront `PUBLIC_READ` and the publishable capability. A theme section selects one active `merchant_collection` through Shopify's native `metaobject` setting. Presentation settings such as speed, direction, pause behavior, tile dimensions, and background remain section-owned and never enter the shared content model.

### `faq`

Admin name: **FAQ**. Display name field: `question`.

| Key | Shopify type | Required | Purpose |
| --- | --- | --- | --- |
| `question` | `single_line_text_field` | Yes | Public accordion label and canonical question text. |
| `answer` | `rich_text_field` | Yes | Public answer with paragraphs, emphasis, lists, and links. |

Enable storefront `PUBLIC_READ`, publishable, and translatable capabilities. Draft questions remain unavailable to Liquid. FAQ entries do not receive individual Online Store URLs initially; the FAQ directory and reusable accordion placements are their canonical public surfaces.

### `faq_category`

Admin name: **FAQ Categories**. Display name field: `title`.

| Key | Shopify type | Required | Purpose |
| --- | --- | --- | --- |
| `title` | `single_line_text_field` | Yes | Public filter label and Theme Editor picker label. |
| `faqs` | `list.metaobject_reference` restricted to `faq` | Yes | Ordered reusable FAQ set. The same FAQ may be referenced by multiple categories. |

Enable storefront `PUBLIC_READ`, publishable, and translatable capabilities. Keeping the ordered relationship on the category lets reusable sections resolve one curated set directly without scanning the complete FAQ definition.

The `faq` and `faq_category` definitions were provisioned on `sparklys-hard-seltzer.myshopify.com` on 2026-09-04. Eleven German FAQ entries were imported from the previous public FAQ page and organized into four active categories: Product & Production, Ingredients & Nutrition, Dietary & Allergens, and Availability & Buying. The category labels are stored in German for the current storefront. Entries, category membership, review status, and translations remain merchant-managed store data and are not stored in this repository.

## Storefinder extension

A later `store_location` definition should reference one `merchant` entry and own only location-specific data such as address, coordinates, opening hours, phone, and a location-specific URL. The reference can remain optional for independent locations. The Merchant record remains the canonical source for its reusable name, logo, URL, and description.

## Provisioning boundary

This repository is a theme and cannot version merchant-owned definitions as theme files. Merchant-owned definitions are created through the Shopify Admin GraphQL API or deliberately configured in Shopify Admin; creating them is a store-level change and requires separate approval. Do not put Admin API credentials in this repository. The `merchant` and `merchant_collection` definitions were provisioned on `sparklys-hard-seltzer.myshopify.com` on 2026-08-23; their entries remain merchant-managed store data. FAQ provisioning status is recorded above and in [Implementation status](status.md).

After the definitions exist:

1. Create active Merchant entries under **Content > Metaobjects**.
2. Create an active Merchant Collection and order its Merchant references.
3. Select that collection in a Logo Marquee section in the theme editor.
4. In the later integration, upload files through Shopify Files and use `metaobjectUpsert` with stable handles to create or update records.

Official references: [Metafield definitions](https://shopify.dev/docs/apps/build/metafields/definitions), [Liquid metafields](https://shopify.dev/docs/api/liquid/objects/metafield), [About metaobjects](https://shopify.dev/docs/apps/build/metaobjects), [metaobject theme settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings), and [dynamic sources](https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources).

## Product detail shared content — implemented 2026-09-11

Content ownership is deliberately small:

| Edit location | Content | Consumers |
| --- | --- | --- |
| Product | Existing background/gradient, media, `gallery_image_1…3`; new `custom.usp_image` | Product gallery/marketing and that product’s Automatic USP section |
| Canonical brand collection | `custom.usp_set` and ordered `custom.flavour_products` | Every product in the brand and Automatic USP sections |
| Content → Metaobjects → USP item / USP set | Reusable approved facts and shared footnote | The collection reference selects the set once |
| Content → Metaobjects → Subscription benefits | Entry `standard`, seven heading/copy fields | Purchase summary and expanded subscription explanation |
| Existing theme shipping settings / shared payment renderer | Shipping values and payment marks | PDP, cart shipping values and footer payment marks |

Created active, translatable, storefront-readable definitions `usp_item` (caption, optional icon), `usp_set` (name, ordered item references, optional rich-text footnote), and `subscription_benefits` (heading plus savings/shipping/flexibility title and text). Metaobject web-page publishing stays off; these are embedded content, not new indexable pages.

Created five Soda entries (`soda-1…5`) and six Hard Seltzer entries (`seltzer-1…6`). The Hard Seltzer display order is 1, 2, 6, 3, 4, 5, with sugar after calories. Original SVG icons are the default for these stable handles; an uploaded Icon replaces the artwork. Soda and Hard Seltzer USP-set entries are assigned to their canonical collections. Flavour lists are Yuzu / Blueberry / Variety and Maracuja / Holunder / Variety. Trial packs and unrelated merchandise are intentionally absent from these cross-link lists; collection membership is unchanged.

Unchanged English seed captions and subscription copy use the existing theme EN/DE translations automatically. Once a merchant customizes a source entry, maintain its translations through Shopify; actual translated values take precedence. Optional set footnotes likewise override the approved localized defaults and need their own translations. Renaming an entry handle changes its default-artwork lookup; keep seeded handles stable or upload an explicit icon.

The Product USP image definition is ready. Leave a placed section’s Image blank to use each product’s image, then the existing brand fallback; an explicit section image is a template-wide override. No second Soda template is required. Existing product gallery fields were reused without changing their definitions or values. Maracuja/Holunder have exact Figma marketing fallbacks where those fields remain empty.

Subscription savings copy says **up to 15%**, while the selected allocation provides the actual price/discount. Shipping copy follows existing theme rules; the subscription-free-shipping promise awaits confirmation and matching checkout configuration. No shipping rules were changed.
