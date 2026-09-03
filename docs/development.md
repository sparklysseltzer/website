# Development workflow

## Language policy

English is the source language and default theme locale. Always author code, identifiers, comments, tests, commits, technical documentation, Shopify definition names and field labels, Theme Editor schema names/labels/help text, and every other technical or administrative interface in English. Reusable storefront UI starts in `locales/en.default.json` and is translated into `locales/de.json`; never author German as the source. Merchant content follows the same source-first translation model when Shopify translation support is configured.

## Toolchain

- Node.js 22 or newer
- npm
- Shopify CLI pinned in `devDependencies`
- Theme Check through Shopify CLI
- `jq` for local JSON verification

Install dependencies:

```sh
npm install
```

## Read-only local validation

Run before every implementation handoff:

```sh
npm run check
node --check assets/theme.js
find config locales sections templates -type f -name '*.json' -print0 | xargs -0 -n1 jq empty
git diff --check
```

Theme Check detects Liquid/JSON syntax problems, missing templates, deprecated constructs, unused code, and selected performance issues. Configuration lives in `.theme-check.yml`. See [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) and its [configuration reference](https://shopify.dev/docs/storefronts/themes/tools/theme-check/configuration).

`npm run check` also runs `npm run check:assets`, which reports raw, gzip, and Brotli estimates and enforces review thresholds for the global CSS and JavaScript payloads. Shopify performs the actual production minification, compression negotiation, versioning, and CDN caching. See [Frontend asset structure and delivery](frontend-assets.md) for placement rules and release verification.

## Searching current Shopify documentation

The pinned CLI can query Shopify's current documentation directly:

```sh
npx shopify doc search --query "locale-aware cart Ajax URLs"
npx shopify doc fetch --url https://shopify.dev/docs/api/ajax/reference/cart
```

Use `doc search` to discover the correct current page and `doc fetch` when full context is needed. Add durable conclusions and links to `docs/shopify-reference.md`; do not commit verbatim copies of entire Shopify manuals.

## Figma production-component typography

The `Components - Production` page in the Sparklys Figma file mirrors the live section library. Keep editable text mapped to the same native font family and style pairs as the theme:

- Maison Neue / DemiBold for body copy and standard UI;
- Maison Neue / Bold for emphasized UI;
- Newake / Regular for general and Hard Seltzer display headings;
- Erode / Bold for Soda display headings.

Figma's remote automation runtime cannot access fonts installed only on the local Mac. Use a temporary local Figma development plugin when a generated component library must be remapped to locally installed licensed fonts. The plugin must discover the exact names with `figma.listAvailableFontsAsync()`, load every target with `figma.loadFontAsync()`, and then update each text range. Do not upload or redistribute licensed font files unless the license and destination have been explicitly approved.

Figma Desktop can retain its previous glyph raster even after the inspector shows the corrected family and style. Selecting a text node or toggling its opacity is insufficient to invalidate this cache. Force a real text-layout pass for each affected node by loading all fonts used by that node, inserting a zero-width space (`U+200B`) at the end, yielding briefly, and deleting it again. This preserves the original characters and range styling while reproducing the refresh caused by entering text-edit mode. Verify both the inspector assignment and the visible canvas before considering the typography synchronized.

## Preview workflow

`shopify theme dev` creates or updates a temporary remote development theme. This is a Shopify write and requires explicit approval.

After approval:

```sh
npm run dev
```

The command targets `sparklys-hard-seltzer.myshopify.com`, uses real store data, supports hot reload, and opens a theme preview. Shopify states that development themes are hidden, temporary, and deleted after seven days of inactivity. See [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli).

The development script enables Theme Editor synchronization. Editor changes are written back to the local JSON files, while local theme changes continue to update the development theme. Startup reconciliation aborts on a genuine JSON conflict instead of silently discarding either local or remote settings; resolve the conflict deliberately, then restart. Review and commit intentional synchronized JSON changes with the corresponding implementation work.

Do not use the embedded Theme Editor canvas as the final reference for high-frequency visual effects. Shopify renders that preview inside a potentially scaled iframe, and its inspector adds translucent hover and selection layers. Resampling and overlays can make the global grain—especially with `mix-blend-mode: overlay`—look softer than it does on the storefront. Disable the preview inspector and open the editor's standalone Preview for a closer comparison; use `http://127.0.0.1:9292/` at native browser scale as the local visual-QA reference.

Before previewing, confirm the authenticated store with:

```sh
npx shopify theme info
```

Always target the store's permanent `.myshopify.com` domain, not its public custom domain or a guessed Shopify hostname. If normal browser authentication succeeds but the CLI reports that the account is not authorized for the provided store, verify the hostname first. For this project, the permanent domain is `sparklys-hard-seltzer.myshopify.com`.

## Remote safety levels

| Action | Default authorization |
| --- | --- |
| `npm run check`, local file inspection | Allowed |
| `shopify theme info` | Read-only, but may trigger authentication |
| `shopify theme dev` | Requires explicit approval because it updates a development theme |
| `shopify theme push` to an unpublished theme | Requires explicit approval and exact target confirmation |
| Publish, delete, overwrite live settings, add credentials | Requires explicit approval and exact target confirmation |

Never put passwords or tokens on a command line that will be committed or documented. Use Shopify-supported authentication and secret storage.

## Implementation loop

1. Read the product, architecture, and development docs.
2. Find the existing section, template, or primitive that owns the behavior. For section work, read its file in [Section reference](sections/README.md).
3. Verify current Shopify platform requirements for unfamiliar or unstable behavior.
4. Implement the narrowest durable change.
5. Run local quality gates.
6. With approved store access, verify the theme editor and storefront using real data.
7. Test phone and desktop layouts, keyboard navigation, reduced motion, and no-JavaScript fallback where relevant.
8. Update the owning section reference plus capability status or architecture decisions when their contract changes.

## Git and delivery

- Keep commits focused and written in English.
- Do not commit secrets, `.env` files, Shopify auth data, or generated preview artifacts.
- CI runs Theme Check on pushes to `main` and pull requests.
- Lighthouse CI should be added only after a dedicated development store and repository secrets are approved. Shopify's action uploads theme code and needs `read_products` and `write_themes`; see [Shopify Lighthouse CI](https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci).
