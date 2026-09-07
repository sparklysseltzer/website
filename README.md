# Sparklys Shopify theme

Custom native Shopify Online Store 2.0 theme for Sparklys Switzerland.

This repository is a buildless Liquid theme. It deliberately starts small so the visual system can be implemented from approved designs without inheriting a large generic theme.

Start with the [documentation index](docs/README.md) for product context, architecture, current capability status, development rules, and the curated official Shopify reference stack.

The theme provides the global header/footer shell, reusable editorial and merchandising modules, and Shopify resource templates. See the authoritative [Section reference](docs/sections/README.md) for the available sections and their implementation contracts.

## Requirements

- Node.js 22 or newer
- Shopify CLI 4.x
- Access to `sparklys-hard-seltzer.myshopify.com` for preview work

## Local checks

```sh
npm install
npm run check
```

`npm run check` runs Shopify Theme Check, global asset-budget checks, and typography regression checks. It is read-only and does not connect to a Shopify store. See [Development](docs/development.md#read-only-local-validation) for the complete handoff checks.

## Store preview

Running a development server creates or updates a temporary development theme in Shopify. Obtain explicit approval before doing so, then run:

```sh
npm run dev
```

On macOS this runs as a background service that survives terminal closure and restarts after exits. Use `npm run dev:status`, `npm run dev:logs`, and `npm run dev:stop` to manage it. See [Preview workflow and recovery](docs/development.md#preview-workflow) for login startup, sync-conflict handling, and the foreground fallback.

Publishing or pushing a persistent theme is never part of the default development workflow. Do not run `shopify theme push`, `shopify theme publish`, or modify the live theme without explicit approval.

## Architecture

Liquid owns server-rendered content; native CSS and vanilla JavaScript provide presentation and progressive enhancement. JSON templates own editable page composition. The [architecture guide](docs/architecture.md#repository-map) owns the repository map and integration boundaries.
