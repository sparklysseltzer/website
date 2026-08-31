# Sparklys Shopify theme

Custom native Shopify Online Store 2.0 theme for Sparklys Switzerland.

This repository is a buildless Liquid theme. It deliberately starts small so the visual system can be implemented from approved designs without inheriting a large generic theme.

Start with the [documentation index](docs/README.md) for product context, architecture, current capability status, development rules, and the curated official Shopify reference stack.

The theme currently provides 19 documented Liquid sections covering the global header/footer shell, reusable editorial and merchandising modules, and Shopify resource templates. See the authoritative [Section reference](docs/sections/README.md) for the available sections and their implementation contracts.

## Requirements

- Node.js 22 or newer
- Shopify CLI 4.x
- Access to `sparklys-hard-seltzer.myshopify.com` for preview work

## Local checks

```sh
npm install
npm run check
```

`npm run check` runs Shopify Theme Check. It is read-only and does not connect to a Shopify store.

## Store preview

Running a development server creates or updates a temporary development theme in Shopify. Obtain explicit approval before doing so, then run:

```sh
npm run dev
```

Publishing or pushing a persistent theme is never part of the default development workflow. Do not run `shopify theme push`, `shopify theme publish`, or modify the live theme without explicit approval.

## Architecture

- `layout/` contains the global document shell.
- `templates/` maps Shopify resources to sections.
- `sections/` contains merchant-configurable page modules and section groups.
- `docs/sections/` documents every Liquid section and its current contract.
- `snippets/` contains small reusable rendering primitives.
- `assets/` contains buildless CSS and JavaScript.
- `config/` contains global theme settings and their current values.
- `locales/` contains storefront and theme-editor translations.

Keep Liquid responsible for content and server rendering. Use JavaScript only for progressive enhancement. Prefer sections and blocks over hardcoded page composition so content remains editable in Shopify.
