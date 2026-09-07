# Documentation

This directory is the durable context for the Sparklys storefront. It records our decisions and routes developers to the current official Shopify source instead of copying large manuals that will become stale.

## Start here

Read [Product](product.md), [Architecture](architecture.md), and [Development](development.md) first. Use [Status](status.md) for current capabilities and open gaps. Before section work, read the [Section reference](sections/README.md) and the owning section document; before styling, read the [Design system](design-system.md).

## Documentation ownership

| Guide | Authoritative content |
| --- | --- |
| [Product](product.md) | Product goals, audience, markets, and non-goals |
| [Architecture](architecture.md) | Theme boundaries, brand-context resolution, schema conventions, and shared rendering rules |
| [Section reference](sections/README.md) | The only complete section inventory; individual section contracts and exceptions |
| [Design system](design-system.md) | Typography roles, visual tokens, normalization, and approved composition exceptions |
| [Frontend assets](frontend-assets.md) | CSS/JS ownership, fonts, image delivery, exports, and budgets |
| [Development](development.md) | Setup, local checks, preview synchronization, Ananotes annotations, Figma workflow, and delivery safety |
| [Quality](quality.md) | Accessibility, performance, SEO, and verification criteria |
| [Commerce](commerce.md) | Integration requirements for products, cart, subscriptions, and apps—not capability claims |
| [Cart coupon plan](cart-coupons-plan.md) | MVP plan for known-code entry, applied-code visibility and discount breakdowns |
| [Cart rebuild reference](cart-reference.md) | Live-site cart observations, state coverage, and pending rebuild decisions |
| [Merchant content](merchant-content.md) | Product-world metafields, Merchant and FAQ definitions, provisioning history |
| [Shared section content](shared-section-content.md) | Local/global Offer content contract and definitions |
| [Status](status.md) | Current capability map and remaining launch gaps |
| [Task inbox](tasks.md) | Unapproved ideas, explicit approvals, and completed task history |
| [Structured-data tasks](structured-data-tasks.md) | Dedicated deferred Schema.org/JSON-LD retrofit checklist |
| [Annotation history](annotation-history.md) | Approved visual feedback and its implementation references |
| [Shopify reference](shopify-reference.md) | Topic routing to official platform documentation |

Keep each fact in its owning guide and link to it elsewhere. Section docs describe their own role mappings and exceptions, not copies of the shared system. Current template composition belongs in `templates/*.json`, not duplicated lists across prose guides. Historical task/annotation records remain historical; do not rewrite them as current capability claims. Recording a backlog item does not authorize implementation.

## Source policy

- Local docs define Sparklys decisions and constraints.
- [Shopify developer documentation](https://shopify.dev/docs/storefronts/themes) defines platform behavior.
- The [Shopify Liquid reference](https://shopify.dev/docs/api/liquid) defines available tags, filters, and objects.
- When platform behavior matters, verify the current official page before implementing. Record new durable conclusions here, but link to the source rather than vendoring the whole page.

Documentation structure and repository descriptions were reconciled on 2026-09-06. This is not a fresh verification of every external platform link or remote store setting.
