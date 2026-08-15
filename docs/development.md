# Development workflow

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

## Preview workflow

`shopify theme dev` creates or updates a temporary remote development theme. This is a Shopify write and requires explicit approval.

After approval:

```sh
npm run dev
```

The command targets `sparklys-hard-seltzer.myshopify.com`, uses real store data, supports hot reload, and opens a theme preview. Shopify states that development themes are hidden, temporary, and deleted after seven days of inactivity. See [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli).

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

1. Read the product and architecture docs.
2. Find the existing section, template, or primitive that owns the behavior.
3. Verify current Shopify platform requirements for unfamiliar or unstable behavior.
4. Implement the narrowest durable change.
5. Run local quality gates.
6. With approved store access, verify the theme editor and storefront using real data.
7. Test phone and desktop layouts, keyboard navigation, reduced motion, and no-JavaScript fallback where relevant.
8. Record new capability status and architecture decisions.

## Git and delivery

- Keep commits focused and written in English.
- Do not commit secrets, `.env` files, Shopify auth data, or generated preview artifacts.
- CI runs Theme Check on pushes to `main` and pull requests.
- Lighthouse CI should be added only after a dedicated development store and repository secrets are approved. Shopify's action uploads theme code and needs `read_products` and `write_themes`; see [Shopify Lighthouse CI](https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci).
