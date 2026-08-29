# Shared section content

Shopify stores the settings of a flexible section instance in the JSON template that contains it. Pages assigned to that same template share the instance, but placing the section in another template creates independent settings. Sparklys uses an explicit Local/Global source choice when one freely placeable section also needs centrally synchronized content.

## Editor contract

The Offer cards section exposes **Content source**:

- **Local to this template** renders the section heading, introduction, and card blocks stored in that template. This is the default and preserves all existing placements.
- **Globally synchronized** renders the active `offer_teaser` entry with handle `global-offer-teaser`. Every placement using this mode updates together.

The per-placement `show_heading` and `show_intro` controls remain local presentation decisions in both modes. When Global is selected, the Theme Editor hides the local heading, introduction, and card fields and displays an inactive-state explanation with Admin links to the canonical teaser and its card entries. Shopify still stores the local values and blocks, so switching back to Local restores the previous template content unchanged.

If the canonical global entry is unavailable, the section falls back to its local content rather than disappearing. Global content is edited under **Content > Metaobjects > Offer teaser**; placement and visibility remain in the Theme Editor.

## Definitions

### `offer_card`

Admin name: **Offer card**. Display name field: `title`.

| Key | Shopify type | Required | Purpose |
| --- | --- | --- | --- |
| `title` | `single_line_text_field` | Yes | Public card heading. |
| `subtitle` | `multi_line_text_field` | No | Desktop hover/focus description. |
| `link` | `url` | No | Optional destination for the complete card. |
| `image` | image-only `file_reference` | No | Canonical card image stored in Shopify Files. |
| `tags` | `list.single_line_text_field` | No | Ordered chip labels. |

The initial `retail`, `gastro`, `events`, and `companies` entries deliberately use their matching theme fallback assets until merchant images are selected. Keep those handles stable while they rely on the fallback mapping. New cards should receive an image.

### `offer_teaser`

Admin name: **Offer teaser**. Display name field: `name`.

| Key | Shopify type | Required | Purpose |
| --- | --- | --- | --- |
| `name` | `single_line_text_field` | Yes | Internal content-library label. |
| `heading` | `single_line_text_field` | No | Shared storefront heading. |
| `intro` | `rich_text_field` | No | Shared introductory copy. |
| `cards` | `list.metaobject_reference` to `offer_card` | Yes | One to four ordered cards. |

Both definitions are merchant-owned, storefront-readable, publishable, and translatable. They were provisioned on `sparklys-hard-seltzer.myshopify.com` on 2026-08-23 together with the active canonical teaser and its four initial cards. The live production theme remains unchanged until an approved deployment references these records.

## Scope rule

Do not apply this model to every section. Keep one-off content local. Introduce a synchronized source only when independently placed instances must share content across unrelated templates. Use store-level metaobjects for structured or API-managed content, and keep presentation settings on the section placement.

Official references: [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates), [sections](https://shopify.dev/docs/storefronts/themes/architecture/sections), and [metaobjects](https://shopify.dev/docs/apps/build/metaobjects).
