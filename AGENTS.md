# Sparklys storefront repository guidelines

## Start here

Read these files before changing behavior:

1. `docs/product.md`
2. `docs/architecture.md`
3. `docs/development.md`
4. The relevant topic in `docs/shopify-reference.md`

`docs/status.md` is the current capability map and implementation backlog.

Before changing a section:

1. Read `docs/sections/README.md`.
2. Read the matching `docs/sections/<section-name>.md` file.
3. Update that section document in the same change when its schema, rendering contract, fallback assets, motion, data source, or known limitations change.

Keep `docs/sections/README.md` as the single authoritative list of available sections. Do not duplicate that complete list in `AGENTS.md` or other documentation indexes.

## Product and language

- This repository is the custom native Shopify Online Store 2.0 theme for Sparklys Switzerland.
- English is the source language and default theme locale. German is a required storefront translation. French and Italian are likely additions for the Swiss market. Put reusable customer-facing UI in locale files rather than hardcoding it in Liquid.
- Always author code, identifiers, comments, tests, commits, technical documentation, Shopify definition names and field labels, Theme Editor schema names/labels/help text, and other administrative interfaces in English. Author reusable storefront UI in English in `locales/en.default.json`, then translate it in `locales/de.json` and later locale files. Never use German as the source for technical, administrative, or reusable theme content.
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
- Treat structured data as part of every entity-like content feature, not as optional follow-up SEO work. Whenever implementing or materially changing products, offers, FAQs, articles/news, events, organizations, recipes, reviews, or another typed content model, implement and validate the applicable Schema.org vocabulary as server-rendered JSON-LD in the same change. The JSON-LD must describe only content that visitors can access on that page, use real Shopify data, avoid duplicate entities, and never invent required values. If no applicable Schema.org type or honest mapping exists, document that decision explicitly instead of emitting misleading markup.

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
