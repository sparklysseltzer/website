# Architecture

Last reconciled with the repository on 2026-09-04.

## System boundary

```text
Shopify Admin and commerce data
            |
            v
Liquid objects + JSON templates
            |
            v
Configurable sections and snippets
            |
            v
Semantic HTML + native CSS + progressive JavaScript
            |
            v
Shopify-hosted checkout
```

Sparklys is a buildless Shopify Online Store 2.0 theme. Shopify renders Liquid on the server, JSON templates select page sections, and a small native CSS and JavaScript layer enhances the resulting HTML. Webflow/Udesly, Hydrogen, commercial themes, and frontend build frameworks are outside the current architecture.

## Repository map

| Path | Responsibility |
| --- | --- |
| `layout/theme.liquid` | Global HTML shell, metadata, assets, header/footer groups, and `content_for_layout`. |
| `templates/*.json` | Resource-to-section composition and merchant-editable page layouts. |
| `sections/*.liquid` | Reusable storefront features with local schemas and settings. |
| `sections/*-group.json` | Persistent header and footer composition. |
| `snippets/*.liquid` | Small rendering primitives such as icons, prices, cards, and metadata. |
| `assets/` | Theme-owned CSS, JavaScript, fonts, icons, textures, and starter artwork. |
| `config/` | Global Theme Editor schema and current settings data. |
| `locales/` | English source/default UI and German storefront translation. |
| `docs/sections/` | Detailed contract and current state of every Liquid section. |

Shopify accepts only its supported theme directories in an uploaded theme. Documentation, tests, and development tooling remain repository-only.

## Composition and ownership

JSON templates own page composition. A section owns its markup, section-level settings, blocks, scoped behavior, and progressive enhancement. Snippets render small shared primitives and must not hide page-level behavior.

Each section instance stores its own settings and blocks in the JSON template that contains it. Alternate templates can therefore reuse the same Liquid section with different content. Do not duplicate a section merely to create a content variant.

Three explicit shared-content patterns exist:

- `logo-marquee` reads an ordered merchant collection built from reusable Merchant metaobjects.
- `offer-cards` can use local template blocks or the canonical global offer-teaser metaobject while retaining local presentation settings.
- `faq` reads reusable FAQ entries directly, through an ordered FAQ Category, or from both sources with duplicate removal; `main-faq` exposes the complete active library with client-side search and filtering.

See [Section reference](sections/README.md), [Merchant content](merchant-content.md), and [Shared section content](shared-section-content.md) for the detailed contracts. Section-specific implementation notes belong in the corresponding file under `docs/sections/`, not in this architecture overview.

## Current template map

| Template | Main composition |
| --- | --- |
| Home | Hero, Rich text, Product Overview Teaser, Offer Cards, Logo Marquee |
| Product | Main Product |
| Collection | Main Collection; Soda and Seltzer alternate templates add context-aware Hero, Rich text, and USP editorial modules |
| Cart | Main Cart |
| Search | Main Search |
| Collections list | Main List Collections |
| Page | Main Page; the `page.faq` alternate template renders the searchable FAQ directory |
| Blog | Main Blog |
| Article | Main Article |
| 404 | Main 404 |

Poster, Split Image-Text, and Featured Collection are reusable preset sections but are not currently placed in the homepage template. The exact section identifiers, blocks, settings, assets, and known gaps are catalogued in [Section reference](sections/README.md).

## Theme Editor configuration design

Section schemas should expose only controls that are relevant to the merchant's current choices. Use Shopify's `visible_if` attribute for dependent settings, such as showing heading fields only when a heading is enabled or action fields only when an action is enabled. Hidden settings retain their stored values, so merchants can switch options without losing prior configuration.

Before shipping any new or changed section, audit every checkbox and select setting for dependent controls. Every supported dependent control must use `visible_if`. Shopify does not currently support conditional visibility on resource pickers such as `metaobject`, `metaobject_list`, product, collection, or page settings. When one of those pickers would become irrelevant, prefer an additive contract or separate focused sections instead of exposing a mode selector beside permanently visible inactive fields. Record any unavoidable exception in the section document.

Organize longer schemas with concise `header` settings in the same order as the rendered composition: layout, media, content, appearance, and spacing where applicable. Prefer sensible presets and a small number of meaningful controls. When layouts have substantially different structure or configuration, implement separate sections instead of combining them behind a large layout selector. Do not misuse blocks as visual fieldsets; blocks represent independently editable or repeatable content.

Theme Editor labels, option names, headers, help text, and other merchant-facing schema copy must describe the editable content or behavior, never its implementation source. Do not use “Figma” in schema copy; use terms such as “default image” or “default content” where a default needs to be explained.

Prefer Shopify's native image controls over duplicate section settings. Merchant-selected cover images must render through `image_url` and `image_tag`, which automatically applies the focal point saved in Shopify as `object-position`; do not add image-anchor or offset controls for the same crop. Transparent product artwork may retain explicit scale/translation controls when positioning the complete object—not cropping it—is part of the approved composition.

When a section has approved bundled Figma artwork, that asset is the automatic blank-state fallback. Expose only the Shopify image picker: a merchant-selected image replaces the bundled asset, while a blank picker renders the fallback. Do not expose fallback selectors, “None” switches, or Figma implementation terminology in the Theme Editor. Keep the fallback filename, intrinsic dimensions, alternative-text contract, and any source-controlled crop in the section implementation and its section document.

## Product-world context

The server resolves one of three presentation contexts: `default`, `soda`, or `seltzer`. Header identity, navigation, heading typography, and footer variant follow that context.

Resolution order:

1. The current Page, Product, or Collection's `custom.product_world` metafield wins when its value is `soda` or `seltzer`.
2. An explicit alternate template suffix such as `.soda` or `.seltzer` is the compatibility fallback.
3. The canonical `soda` or `hard-seltzer` collection resolves its own context when it has no explicit metafield value.
4. A product belonging to exactly one canonical brand collection inherits that context when it has no explicit metafield value or branded template.
5. A product in both canonical brand collections remains `default` unless its metafield or alternate template resolves the ambiguity.
6. Shared or unclassified surfaces remain `default`.

`custom.product_world` is a merchant-owned single-line text definition provisioned for Pages, Products, and Collections. Shopify restricts each field to `soda` or `seltzer`; leaving it blank preserves the fallback behavior. This classification controls presentation and navigation only. JSON templates still own section composition, so classifying a resource does not automatically add product-world sections to its template.

Browser session state is never the authority. A direct product URL must render the correct complete shell on the server.

| Context | `h1`/`h2` family | Header/footer identity |
| --- | --- | --- |
| General | Newake | Sparklys Arc |
| Soda | Erode Bold, `-0.03em` tracking | Sparklys Soda |
| Hard Seltzer | Newake | Sparklys Hard Seltzer |

Maison Neue Demi remains the body, UI, and `h3`–`h6` family. Footer card headings intentionally use Newake in every context.

## Navigation and URL rules

- Render Shopify resource URLs and `routes`; never hardcode locale-sensitive storefront paths.
- The black header bar switches product worlds. The white bar owns context-specific primary navigation and becomes sticky after the black bar leaves normal flow.
- `Corporate Nav` owns utility links and native nested disclosures.
- Separate General, Soda, and Hard Seltzer menus own primary and footer navigation.
- `Legal Nav` uses Shopify policy resources rather than hand-authored policy paths.
- The Store Finder action resolves a selected Shopify Page, with the documented Händler bootstrap fallback.

Header and footer interaction details live in [Header](sections/header.md) and [Footer](sections/footer.md).

## Structured data

Structured data is part of the rendering contract for every entity-like content feature. Products, offers, FAQs, articles/news, events, organizations, recipes, reviews, and other typed models must ship with an applicable Schema.org representation serialized as server-rendered JSON-LD in the same change. Treat this as an implementation requirement, not deferred SEO polish.

The JSON-LD must be derived from the same Shopify data rendered for visitors, describe only content accessible on that page, follow the active locale and market, suppress duplicate entities, and omit unknown values rather than inventing them. Prefer one shared renderer per entity type so reusable sections and resource templates cannot drift. If no applicable Schema.org type or honest mapping exists, document that decision in the owning feature reference. Validate rendered output, not merely Liquid source, before claiming support.

Schema.org supplies the entity vocabulary and property meanings. JSON-LD is the preferred serialization used to place those definitions in an `application/ld+json` script without coupling them to the visible HTML structure.

## Localization

English is the source language and default locale in `locales/en.default.json`; German is the required translation in `locales/de.json`. Reusable customer-facing UI belongs in locale JSON and is rendered with the `t` filter. Merchant-entered resource and section content is translated through Shopify. French and Italian remain future candidates and must not be claimed as enabled.

## Layout and visual tokens

All text sizes use the centrally defined fluid roles in [Design system](design-system.md#shared-fluid-roles). Standard body copy shares the 16–17px curve across 390–1440px, independent of section and product world. Labels, actions and heading tiers have their own shared roles; documented artwork compositions are the only local size exceptions. The root remains 100%. `npm run check:typography` prevents new section-specific size rules.

[Design system](design-system.md) owns the visual normalization rules. Heading rhythm is centralized in `assets/base.css`: Newake uses `--line-height-heading-newake` (`0.95`), Erode uses `--line-height-heading-erode` (`0.9`), and `--line-height-heading` resolves the active font. Explicit font choices also select their matching rhythm. Do not copy inconsistent line-height values from individual frames into section CSS.

Small multiline Erode editorial card titles use the centrally mapped `--line-height-heading-small-erode` (`1`) role rather than large-display leading. Compact editorial body/UI copy can use `--line-height-body-compact` (`1.3`). Keep role definitions shared across sections; composition-specific exceptions remain documented in the design system.

- `--page-width` is the shared 120rem/1920px outer-frame limit.
- `--page-gutter` is 1rem below 768px and 2rem from 768px.
- `.section` and the compatibility alias `.section--tight` use one shared vertical rhythm: `clamp(2rem, 5vw, 4rem)`, or 32–64px per side. Do not introduce a looser default section gap.
- `--radius-small` and `--radius-large` map the Theme Settings border-radius controls. Their defaults are 1rem/16px for compact UI panels and tiles, and 1.875rem/30px for editorial panels, generic cards, and collection/product media. Pills, circles, controls, and special header geometry keep purpose-specific radii.
- The global background, foreground, accent, and surface palette is fixed in the theme CSS rather than exposed as generic Theme Settings; section-specific color controls remain local to the sections that use them.
- `--page-grain-opacity` maps Theme Settings grain intensity; the current project default is 30%.
- One document-attached `.page-grain` layer repeats `noise-3.webp` at Retina density and scrolls with the content.
- `base.css` owns global primitives and shared components. A section may own substantial portable styling when its dependencies remain explicit.

Theme assets are local and referenced with `asset_url`. Shopify-hosted merchant images use `image_url` and `image_tag` with responsive widths, accurate `sizes`, dimensions, loading intent, and useful alt text.

## Motion language

The base motion is calm, reversible, and hierarchy-led. Scroll scenes reveal primary content through opacity and no more than 48px of upward travel; grouped cards use restrained staggering; oversized clipped media may move approximately ±4%. Pointer hover transforms media rather than layout.

The current scroll enhancements derive their target state from viewport progress and use a short catch-up response, so upward scrolling reverses them. The complete final content remains visible without JavaScript. `prefers-reduced-motion: reduce` disables non-essential reveal, parallax, and zoom behavior.

Shared interaction primitives include:

- `--motion-ease`: `cubic-bezier(0.22, 1, 0.36, 1)` for general responsive motion;
- Highlight Sweep for standalone text links;
- Bubble Sweep for primary, secondary, and footer newsletter buttons;
- purpose-specific header controls, cards, logos, and linked media.

Do not use `transition: all`, scroll locking, delayed one-shot reveals, or motion that changes document layout.

## JavaScript contract

JavaScript is progressive enhancement and loads deferred. Core navigation, product submission, cart editing, and checkout entry remain server-rendered and usable without it.

Current custom elements/controllers are:

| Component | Ownership |
| --- | --- |
| `product-form` | Ajax add-to-cart and live status feedback |
| `header-corporate-menu` | Enhanced dismissal for native header disclosures |
| Header scroll-intent controller | Desktop restoration/hiding of the black switcher bar |
| `newsletter-form` | In-place rendering of Shopify's native form response |
| `offer-cards-motion` | Reversible card reveal, media parallax, and hover zoom |
| `product-overview-motion` | Reversible Product Overview reveal and artwork parallax |
| `poster-motion` | Reversible Poster reveal and media parallax |
| `usp-section-motion` | Reversible USP panel/content reveals, item staggering, and media parallax |
| `faq-section-motion` | Reversible FAQ heading, controls, item, and closing-link reveals |
| `faq-accordion` | One-open-at-a-time enhancement for native FAQ details elements |
| `faq-directory` | Client-side FAQ text search, category filtering, count feedback, and URL state |

Use custom elements to scope behavior, native browser APIs instead of broad dependencies, and live regions for dynamic status. Follow [Frontend asset structure and delivery](frontend-assets.md) for budgets and placement.

## Extension points

The architecture anticipates, but does not yet claim, support for app blocks, selling plans, localization controls, product recommendations, predictive search, structured product data, analytics/consent integration, and richer cart behavior. Each capability requires an end-to-end contract across every affected surface before it is marked supported.
