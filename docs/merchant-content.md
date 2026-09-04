# Merchant content model

Merchant content is shared storefront data, not content owned by one theme section. The Logo Marquee is its first consumer; the planned storefinder and a later CRM or ERP integration must reuse the same records rather than duplicating names, logos, links, or descriptions.

## Product-world classification

Pages, Products, and Collections each have the same merchant-owned metafield definition:

| Admin name | Namespace and key | Shopify type | Allowed values |
| --- | --- | --- | --- |
| Product world | `custom.product_world` | `single_line_text_field` | `soda`, `seltzer` |

Use the field on a resource when it belongs explicitly to one product world. Leave it blank for shared/general content or when the established template and canonical-collection fallbacks are sufficient. The metafield is authoritative over those fallbacks, which makes it suitable for supporting pages and resolves products or collections whose URL, template, or membership is ambiguous.

The field changes the server-rendered header, footer, navigation, and heading typography. It does not change the resource's JSON template or add sections. Choose the appropriate template separately when Soda and Hard Seltzer need different page composition.

The three definitions were provisioned on `sparklys-hard-seltzer.myshopify.com` on 2026-09-01. Values remain merchant-managed store data and are not stored in this repository.

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
