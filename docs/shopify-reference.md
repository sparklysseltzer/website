# Shopify theme development reference

This is the fast routing index for official Shopify documentation. Search this file by implementation topic, then open the linked official page for current details.

Reviewed: 2026-08-08.

## Architecture and rendering

| Topic / search terms | Official source | Local conclusion |
| --- | --- | --- |
| directories, layout, assets, config, locales, sections, snippets, templates | [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) | Keep the uploaded theme in Shopify's supported directory structure. `layout/theme.liquid` is the required shell. |
| JSON template, section order, alternate template | [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates) | JSON owns composition; rendered markup lives in referenced sections. |
| section schema, presets, section group, app blocks | [Sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) | Make page modules merchant-configurable and add app-block support deliberately. |
| theme block, section block, app block, nesting | [Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) | Prefer section blocks for local content; use theme blocks for genuinely reusable nested composition. |
| theme settings, section settings, dynamic source, visible_if, blank | [Settings](https://shopify.dev/docs/storefronts/themes/architecture/settings) | Global brand tokens belong in config; local behavior belongs in section/block settings; guard optional resources with `blank`. |
| locale JSON, default locale, schema translations | [Locales](https://shopify.dev/docs/storefronts/themes/architecture/locales) | One `*.default.json` is required; schema translations are separate from storefront translations. |
| tag, filter, object, form, paginate, image_tag | [Liquid reference](https://shopify.dev/docs/api/liquid) | Shopify Liquid extends open-source Liquid; verify Shopify-specific object availability by template/context. |

## Tools and workflow

| Topic / search terms | Official source | Local conclusion |
| --- | --- | --- |
| CLI, theme dev, development theme, authentication, ignore | [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) | Use a pinned CLI. `theme dev` is a remote write to a temporary hidden theme and needs approval. |
| environment, store config, Theme Access | [Theme environments](https://shopify.dev/docs/storefronts/themes/tools/cli/environments) | Introduce environment files only when multiple approved store/theme targets exist. Never commit credentials. |
| lint Liquid JSON, checks, configuration | [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) and [configuration](https://shopify.dev/docs/storefronts/themes/tools/theme-check/configuration) | Keep `theme-check:recommended` clean locally and in CI. |
| performance CI, accessibility CI, benchmark store | [Shopify Lighthouse CI](https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci) | Add only with a dedicated store and approved secrets; it requires theme-write capability. |
| Liquid render profiling | [Theme Inspector](https://shopify.dev/docs/storefronts/themes/tools/theme-inspector) | Use when real-store Liquid render cost becomes measurable. |

## Storefront foundations

| Topic / search terms | Official source | Local conclusion |
| --- | --- | --- |
| performance, progressive enhancement, JS budget, responsive images, lazy load | [Performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance) | Prefer HTML/CSS, defer small native JS, host assets on Shopify, and test realistic home/product/collection pages. |
| keyboard, focus, skip link, forms, contrast, touch, dialog | [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) | Accessibility is an implementation gate. Primary touch targets are at least 44 by 44 CSS pixels. |
| javascript tag, stylesheet tag, section assets, CSS subsetting | [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) | Assets can stay global while small; section-bundled assets must avoid hidden cross-file dependencies. |
| title, description, canonical | [SEO metadata](https://shopify.dev/docs/storefronts/themes/seo/metadata) | Derive metadata from Shopify Liquid objects in `theme.liquid`. |
| image_url, image_tag, srcset, sizes | [Performance: responsive images](https://shopify.dev/docs/storefronts/themes/best-practices/performance#use-responsive-images) | Always request a bounded source width and supply realistic `sizes`. |

## Products and merchandising

| Topic / search terms | Official source | Local conclusion |
| --- | --- | --- |
| product template, product form, variant, quantity, payment button, recommendations | [Product template](https://shopify.dev/docs/storefronts/themes/architecture/templates/product) | Preserve a server-rendered product form; build dynamic selection as enhancement. |
| variant selector, option values, high variant count | [Product variants](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants) | Do not assume every option combination is small or available; synchronize URL, media, price, and availability. |
| product recommendations | [Product recommendations](https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations) | Load recommendations contextually and avoid making them critical to purchase. |
| selling plan, subscriptions, recurring purchase | [Subscriptions](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions) and [theme integration](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/add-subscriptions-to-your-theme) | Subscription support spans selector, variant changes, form payload, pricing, cart display, checkout charge, and provider UX. |
| accelerated checkout, dynamic checkout button | [Accelerated checkout](https://shopify.dev/docs/storefronts/themes/pricing-payments/accelerated-checkout) | Add through Shopify's supported form filter and test compatibility with purchase options. |

## Cart and checkout handoff

| Topic / search terms | Official source | Local conclusion |
| --- | --- | --- |
| cart template, updates, remove, checkout, discounts, notes, properties | [Cart template](https://shopify.dev/docs/storefronts/themes/architecture/templates/cart) | Cart support includes more than line items and subtotal; render discounts, properties, plans, and usable update/checkout actions. |
| cart add.js, change.js, update.js, locale-aware Ajax | [Cart Ajax API](https://shopify.dev/docs/api/ajax/reference/cart) | Prefix endpoints with `window.Shopify.routes.root`; handle 422 and other errors visibly. |
| apply coupon, remove coupon, cart/update.js discount | [Cart Ajax API: update discounts](https://shopify.dev/docs/api/ajax/reference/cart#update-discounts-in-the-cart) | Apply one or multiple codes through the cart endpoint, then re-render state from Shopify's validated cart response. |
| discount allocations, cart discount | [Discounts](https://shopify.dev/docs/storefronts/themes/pricing-payments/discounts) | Show both cart-level and line-level discounts with original/final amounts. |

## Markets and internationalization

| Topic / search terms | Official source | Local conclusion |
| --- | --- | --- |
| country selector, language selector, localization form, route prefix | [Multiple currencies and languages](https://shopify.dev/docs/storefronts/themes/markets/multiple-currencies-languages) | Never hardcode storefront paths; selectors need accessible JavaScript and a no-JavaScript fallback. |
| localization object, country, language | [Liquid localization object](https://shopify.dev/docs/api/liquid/objects/localization) | Use enabled Shopify configuration rather than maintaining a country/language list in theme code. |
| localized product structured data, priceCurrency | [Markets SEO considerations](https://shopify.dev/docs/storefronts/themes/markets/multiple-currencies-languages#search-engine-optimization) | Use `cart.currency.iso_code` for product structured-data currency. Shopify supplies hreflang through `content_for_header`. |

## App integrations

| Topic / search terms | Official source | Local conclusion |
| --- | --- | --- |
| theme app extension, app block, app embed | [Theme app extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions) | Prefer supported extension surfaces over manually pasted vendor code. Audit placement and performance. |
| support app blocks in section | [App blocks for themes](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks) | Add `@app` blocks only to legitimate app hosts. Render section-defined app blocks with `{% render block %}`; theme blocks use `{% content_for 'blocks' %}`. |
| web pixel, customer events, consent | [Web pixels](https://shopify.dev/docs/apps/build/marketing/pixels) | Analytics and advertising require an explicit event/consent design; avoid duplicate vendor events. |

## Fast official search

Use Shopify CLI when a topic is missing or might have changed:

```sh
npx shopify doc search --query "theme app blocks product section"
npx shopify doc fetch --url https://shopify.dev/docs/storefronts/themes/architecture/sections
```

After research, update the relevant local guide with the project decision and a direct official link.
