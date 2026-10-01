# Documentation

## Start here

Read [Product](product.md), [Architecture](architecture.md), and [Development](development.md) before changing behavior. Use [Status](status.md) for implemented capabilities and launch gaps. Before section work, read the [section reference](sections/README.md) and its owning document; before styling, read the [design system](design-system.md).

## Current contracts

| Area | Authoritative guide |
| --- | --- |
| Scope, audience, markets and non-goals | [Product](product.md) |
| Theme boundaries, brand resolution, composition and editor conventions | [Architecture](architecture.md) |
| Available sections and their individual contracts | [Section reference](sections/README.md) — the only complete section inventory |
| Typography, colors, spacing, icons and motion | [Design system](design-system.md) |
| Inputs, dropdowns, checkboxes and radios | [Form controls](forms.md) |
| Brand personality and storefront writing | [Tone and voice](tone-and-voice.md) |
| CSS/JS ownership, images, exports and budgets | [Frontend assets](frontend-assets.md) |
| Metafields, metaobjects and language ownership | [Merchant content](merchant-content.md) |
| Shared/local Offer content ownership | [Shared section content](shared-section-content.md) |
| Commerce integration boundaries and provider verification | [Commerce](commerce.md) |
| Browser-only MRZ implementation and privacy | [Local age check](age-verification-plan.md) |
| Document specimens and supported formats | [Document references](age-verification-documents.md), [international coverage](age-verification-international-plan.md) |

## Working on the theme

| Need | Guide |
| --- | --- |
| Setup, preview, checks, Admin API, annotations and safe delivery | [Development](development.md) |
| Accessibility, performance, SEO and verification criteria | [Quality](quality.md) |
| Local designer playground and tuning workflow | [Design Studio](design-system-studio.md) |
| Official platform documentation by topic | [Shopify reference](shopify-reference.md) |

## Open work

| List | Scope |
| --- | --- |
| [Status](status.md#known-incomplete-capabilities) | Launch readiness and integration verification |
| [Feature backlog](tasks.md) | Discrete future features awaiting approval |
| [Structured-data tasks](structured-data-tasks.md) | Remaining Schema.org implementation and validation |
| [Age-check extensions](age-verification-extensions.md) | Separately scoped document, privacy and enforcement follow-ups |

Keep each task in one owning list. Other guides link to that list instead of copying its checkboxes. Recording, prioritizing or documenting a task does not authorize implementation.

## Historical decisions and research

- [Decision and completion archive](archive/README.md): completed PDP, cart, coupon and navigation plans, plus completed task records.
- [Annotation history](annotation-history.md): dated feedback and verification references; preserve original annotation provenance.
- [Future verification-provider reference](age-verification-provider-reference.md): deferred options and dated pricing, not current quotes or adoption approval.
- [Icon license](untitled-ui-icons-license.txt): retained asset licensing terms.

## Maintenance and source policy

Each fact has one current owner. Section documents describe local contracts and exceptions, linking to shared rules rather than duplicating them. JSON templates own actual page composition. Completed plans belong in the archive; historical observations must not read as present-day instructions. Preserve useful decision rationale and verification limits.

Local guides define Sparklys decisions. Official [Shopify theme documentation](https://shopify.dev/docs/storefronts/themes) and the [Liquid reference](https://shopify.dev/docs/api/liquid) define platform behavior; verify current guidance when implementing, and link to sources rather than copying manuals.

Reconciled with local implementation and existing verification records on 2026-09-28. This cleanup does not revalidate external links, current store settings or provider integrations.
