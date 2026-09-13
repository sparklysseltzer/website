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

This repository is a theme and cannot version merchant-owned definitions as theme files. Merchant-owned definitions are created through the Shopify Admin GraphQL API or a supported CLI operation; creating them is a store-level change and requires separate approval. Computer use is permitted only when the API/CLI route is not possible, and the user must be told the reason and intended browser action first. Follow the hard [store-data tool-choice rule](development.md#store-data-maintenance-tool-choice). Do not put Admin API credentials in this repository. The `merchant` and `merchant_collection` definitions were provisioned on `sparklys-hard-seltzer.myshopify.com` on 2026-08-23; their entries remain merchant-managed store data. FAQ provisioning status is recorded above and in [Implementation status](status.md).

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
| Content → Metaobjects → Subscription benefits | Entry `standard`, seven heading/copy fields | Expanded subscription explanation; the compact purchase summary remains theme UI |
| Existing theme shipping settings / shared payment renderer | Shipping values and payment marks | PDP, cart shipping values and footer payment marks |

Created active, translatable, storefront-readable definitions `usp_item` (caption, optional icon), `usp_set` (name, ordered item references, optional rich-text footnote), and `subscription_benefits` (heading plus savings/shipping/flexibility title and text). Metaobject web-page publishing stays off; these are embedded content, not new indexable pages.

Created five Soda entries (`soda-1…5`) and six Hard Seltzer entries (`seltzer-1…6`). The Hard Seltzer display order is 1, 2, 6, 3, 4, 5, with sugar after calories. Original SVG icons are the default for these stable handles; an uploaded Icon replaces the artwork. Soda and Hard Seltzer USP-set entries are assigned to their canonical collections. Flavour lists are Yuzu / Blueberry / Variety and Maracuja / Holunder / Variety. Trial packs and unrelated merchandise are intentionally absent from these cross-link lists; collection membership is unchanged.

Populated captions and subscription fields render directly from Shopify in the active language. No starter-text matching or translation substitution is permitted. Empty subscription fields retain localized theme fallbacks; an absent USP set retains the approved default list. Optional set footnotes likewise override the approved localized defaults and need their own translations. Renaming an entry handle changes its default-artwork lookup; keep seeded handles stable or upload an explicit icon.

The Product USP image definition is ready. Leave a placed section’s Image blank to use each product’s image, then the existing brand fallback; an explicit section image is a template-wide override. No second Soda template is required. Existing product gallery fields were reused without changing their definitions or values. Maracuja/Holunder have exact Figma marketing fallbacks where those fields remain empty.

Subscription savings copy says **up to 15%**, while the selected allocation provides the actual price/discount. Shipping copy follows existing theme rules; the subscription-free-shipping promise awaits confirmation and matching checkout configuration. No shipping rules were changed.

## Language ownership

The theme source locale (`locales/en.default.json`) and Shopify’s primary merchant-content language are separate settings. The store currently uses **German** as its primary content language. An English string saved in a raw metaobject field is therefore still German source content in Translate & Adapt; Shopify does not detect or relocate it.

- Keep code, documentation, schema labels, definition names and field labels English.
- Write merchant-owned public resource/section/metaobject source values in the store’s actual primary language. Register English and later languages in Shopify translations, never in duplicate fields or duplicate objects.
- Read populated content directly through localized Liquid objects. Never identify starter copy by text equality and substitute theme locale strings; that hides missing translations and overrides merchant intent.
- Use theme locale fallbacks only for genuinely absent content. Short generic UI and the PDP compact subscription summary remain theme translations; long benefits and shared USP captions belong to their metaobjects.
- Before provisioning/importing content, verify Settings → Languages, export or record affected values, preserve existing translations, references, handles and status, then save the primary-language source before secondary translations. Source edits can mark translations outdated; review them afterwards.
- Verify German and English storefront output and Translate & Adapt together. A correct storefront alone does not prove the content records are translated.
- Preserve intentionally English brand/design wording in German content (for example “Swiss made”). Do not translate names, handles, internal set labels or approved brand slogans merely because they look English.

The 2026-09-12 audit found starter-text substitution only in `product-benefits.liquid` and `usp-items.liquid`; both have been removed. The subscription benefits and eleven USP captions are the affected records. Existing FAQ, offer and merchant renderers use their stored content directly. Shopify taxonomy-owned entries are outside this theme-content migration.

References: [Translate & Adapt](https://help.shopify.com/en/manual/international/translate-adapt-app), [Translatable metaobjects](https://shopify.dev/docs/apps/build/metaobjects/use-metaobject-capabilities).

Migration result (2026-09-12): corrected all seven `subscription_benefits/standard` source fields to their existing German theme copy and saved the original English copy as English translations. Registered English translations for all eleven `usp_item` captions; corrected the four differing German captions (Soda calories/sugar, Seltzer calories, gluten and sugar), preserving the intentionally English design captions. References, handles, icons and statuses were preserved. Reviewed the existing FAQ/category and offer lists: their public source copy is already German, while brand/internal names remain intentionally unchanged. This audit does not claim that every legacy resource has complete English translations.

German remains the only published language. English is explicitly held until go-live by the merchant; French and Italian are also unpublished. No language, theme or country was published or enabled during this cleanup.

## Page introductions — 2026-09-12

Pages own two optional, pinned multi-line text metafields: **Intro heading** (`custom.intro_heading`) and **Intro text** (`custom.intro_text`). Definitions are provisioned in Shopify; theme installation alone does not create them. Existing Brand Variant was preserved. No page values were populated or existing translations changed.

Default text pages use page title → H1, Intro text → introduction, and page body → reading content. Editorial pages use page title → small label, Intro heading → H1, and the same Intro text; blank custom headings fall back to the page title without a repeated label. Select/duplicate the `page.editorial` starter and arrange sections below Page intro. Following explicit approval, the development About and Retail templates now use Page intro in place of Main page; their other content and settings are preserved. Default and FAQ templates, page assignments and shared/live theme content are unchanged. Maintain copy on the Page, and translate through Translate & Adapt; do not duplicate it in section settings. Native policies remain in Settings → Policies. See [Page intro](sections/page-intro.md) and [Main page](sections/main-page.md).

Provisioning used the documented browser fallback after checking the available connection: only theme CLI authentication was available, with no authenticated Admin API connector/token. The user was notified before the fallback. At that time no credentials were created or stored. On 2026-09-12 the dedicated Sparklys Store Content API connection was installed and verified for files and metaobject entries; use it for subsequent authorized work. See Development → Admin API connection for credentials, scopes and the read-only connection check. Other operations may require additional approved scopes.

## Product gallery backgrounds

`custom.gallery_gradient` accepts a comma-separated stack of CSS linear/radial gradients; the first layer paints on top. `custom.gallery_background_image` is an optional image-only File reference and takes precedence, without erasing the saved gradient. Use artwork without products, text or logos. Both feed PDP galleries and shared product cards; opaque foreground photographs conceal the background. Clearing the image restores the gradient; clearing both restores existing surface defaults. Page canvas color remains separately owned by `custom.soda_background_color`.

`node scripts/setup-product-backgrounds.mjs` inspects the store and previews the image definition plus Soda Variety Pack gradient. `--execute` creates the definition only if absent and updates only that product's gradient with compare-and-set protection, an ignored backup and read-back. Requires approved `write_products` access. On 2026-09-13, the merchant approved app version content-api-2 product access. The image-only definition was created and the Soda Variety Pack layered gradient was saved, read back through the API and confirmed in local PDP HTML. The initial CSS approximation was subsequently superseded by the exact Figma background image, as described below.

Variety Pack correction (2026-09-13): Figma `11009:46649` contains a five-stop yellow base gradient (`7353:34397`), a pale green ellipse (`7353:34434`, 110px layer blur) and an irregular blue gradient vector (`7353:34432`, 70px layer blur). A simple pair of CSS gradients does not reproduce that geometry. The exact background-only composition was exported at 2× (907×1372) without cans, logos, copy or rounded corners, uploaded as `soda-variety-background-figma.png` (MediaImage `73592900780419`) and assigned to the product's image override via Admin API with compare-and-set protection. The original gradient value is retained as an inactive fallback. Temporary Figma export nodes were removed; the source frame was untouched. Desktop and phone local previews confirmed successful image loading and no horizontal overflow. Native cover cropping adapts the portrait artwork to each gallery's aspect ratio; theme grain remains separate.
