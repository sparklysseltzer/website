# Merchant content model

Merchant content is shared storefront data, not content owned by one theme section. The Logo Marquee is its first consumer; the planned storefinder and a later CRM or ERP integration must reuse the same records rather than duplicating names, logos, links, or descriptions.

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

## Storefinder extension

A later `store_location` definition should reference one `merchant` entry and own only location-specific data such as address, coordinates, opening hours, phone, and a location-specific URL. The reference can remain optional for independent locations. The Merchant record remains the canonical source for its reusable name, logo, URL, and description.

## Provisioning boundary

This repository is a theme and cannot version merchant-owned definitions as theme files. Merchant-owned definitions are created through the Shopify Admin GraphQL API or deliberately configured in Shopify Admin; creating them is a store-level change and requires separate approval. Do not put Admin API credentials in this repository. The `merchant` and `merchant_collection` definitions were provisioned on `sparklys-hard-seltzer.myshopify.com` on 2026-08-23; their entries remain merchant-managed store data.

After the definitions exist:

1. Create active Merchant entries under **Content > Metaobjects**.
2. Create an active Merchant Collection and order its Merchant references.
3. Select that collection in a Logo Marquee section in the theme editor.
4. In the later integration, upload files through Shopify Files and use `metaobjectUpsert` with stable handles to create or update records.

Official references: [About metaobjects](https://shopify.dev/docs/apps/build/metaobjects), [metaobject theme settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings), and [dynamic sources](https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources).
