# Sparklys storefront repository guidelines

## Start here

Read these files before changing behavior:

1. `docs/product.md`
2. `docs/architecture.md`
3. `docs/development.md`
4. The relevant topic in `docs/shopify-reference.md`

`docs/status.md` is the current capability map and implementation backlog.

## Product and language

- This repository is the custom native Shopify Online Store 2.0 theme for Sparklys Switzerland.
- German is the default storefront language, and English is required for launch readiness. French and Italian are likely additions for the Swiss market. Put reusable customer-facing UI in locale files rather than hardcoding it in Liquid. Use English for code, identifiers, comments, tests, commits, and technical documentation.
- Do not reintroduce Webflow/Udesly, Hydrogen, a commercial theme, or another frontend framework without an explicit architecture decision.
- Do not invent product claims, ingredients, legal copy, subscription terms, shipping rules, discounts, or market behavior.

## Theme architecture

- Keep the theme buildless: Liquid, JSON templates, native CSS, and carefully scoped vanilla JavaScript.
- Keep page composition in JSON templates and merchant-configurable sections or blocks.
- Use snippets for small rendering primitives, not hidden page-level behavior.
- Use Shopify Liquid objects and `routes`; never hardcode locale-sensitive storefront paths.
- Treat Switzerland and Liechtenstein as the initial markets. Do not enable or assume France, Italy, Germany, Austria, their currencies, taxes, shipping, or legal behavior until those markets are explicitly configured.
- Treat JavaScript as progressive enhancement. Core navigation, product submission, cart editing, and checkout entry must remain usable without JavaScript.
- Use responsive Shopify CDN images through `image_url` and `image_tag`. Do not add remote runtime assets without review.
- Preserve semantic HTML, keyboard navigation, visible focus, reduced-motion support, descriptive labels, and 44 by 44 pixel primary touch targets.
- Do not claim support for a commerce feature until all required surfaces are implemented. Subscriptions, discounts, selling plans, app blocks, localization controls, and structured data each require deliberate end-to-end work.

## Remote safety

- Local inspection and `npm run check` are safe defaults.
- `shopify theme dev` creates or updates a remote development theme and requires explicit user approval.
- Never run `shopify theme push`, `shopify theme publish`, delete a theme, modify the live theme, or add Shopify/GitHub secrets without explicit approval.
- Never commit store credentials, Theme Access passwords, tokens, customer data, `.env` files, or browser/auth state.

## Quality gates

Before handing off implementation changes, run:

```sh
npm run check
node --check assets/theme.js
find config locales sections templates -type f -name '*.json' -print0 | xargs -0 -n1 jq empty
git diff --check
```

Once an approved development theme is available, verify every affected journey at a representative phone and desktop viewport, with keyboard navigation and JavaScript disabled where core behavior is involved.
