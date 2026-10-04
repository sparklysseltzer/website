# Feature backlog

Open, separately scoped feature proposals only. Launch verification belongs in [Status](status.md#known-incomplete-capabilities); SEO implementation work belongs in [Structured-data tasks](structured-data-tasks.md); age-check extensions belong in [Age-check extensions](age-verification-extensions.md). None of these lists grants implementation approval.

## Approval rule

- Every item in this file is pending by default.
- Do not implement, start, or otherwise act on an item until Sandro gives explicit approval for that specific task.
- Adding, clarifying, prioritizing, or reorganizing an item does not constitute implementation approval.
- When an item is explicitly approved, move it to **Approved** before implementation. Remove completed items from this active list once the owning contract and Status record the result. Preserve useful dated evidence in [completed task records](archive/completed-tasks.md), rather than maintaining a second capability list here.

## Pending approval

Structured-data retrofit work is maintained in the separate [Structured-data task list](structured-data-tasks.md). Every unchecked item there follows the same pending-approval rule as this inbox.

### TASK-009 — Validate demand before building back-in-stock notifications

- Add a lightweight out-of-stock interest “trapdoor” before committing to a complete notification feature. Its only initial purpose is to measure whether visitors want to buy the unavailable product.
- Present an honest, localized action on unavailable product surfaces without promising that the visitor will receive a notification. Keep the interaction low-friction and make the distinction between registering interest and subscribing to marketing explicit.
- Define the smallest trustworthy demand signal before implementation: product and variant identity, interaction event, reporting destination, duplicate handling, consent implications, and the success metric that would justify the next stage. Prefer an anonymous interaction if it provides enough evidence; do not collect email addresses merely for analytics.
- Preserve the normal unavailable-product and no-JavaScript experience. The trapdoor must not imply inventory reservation, product availability, a purchase commitment, or a guaranteed restock.
- Stage two, only after demand is validated: design a real back-in-stock notification flow with variant-level subscriptions, email consent and confirmation behavior, Klaviyo/Shopify ownership, inventory-trigger reliability, localization, unsubscribe handling, privacy retention, accessibility, and end-to-end testing.
- Status: Pending discovery and implementation approval for the demand-validation stage. Back-in-stock notifications are deliberately deferred.
- Added: 2026-08-25.

### TASK-006 — Evaluate motion-runtime expansion and storefront build-up intro

- The native CSS/Web Animations framework is already implemented across editorial sections and FAQ interactions; its current contract is in [Architecture](architecture.md#motion-language). This pending task concerns optional runtime expansion and a new header/footer intro, not replacing the existing engine without approval.
- Decide whether GSAP Core plus ScrollTrigger should become the project motion runtime now that multiple heavy, coordinated, and scroll-scrubbed scenes are planned. Compare locally vendored GSAP against project-owned Web Animations/CSS, including payload, buildless-theme integration, lifecycle cleanup in the Shopify Theme Editor, browser consistency, reduced-motion behavior, and long-term maintenance. Do not load animation libraries from a third-party CDN.
- Treat the intro as a calm construction of the storefront rather than a blocking splash screen. The page background and usable document remain present immediately; motion progressively layers the interface into place.
- Header storyline:
  1. Establish the black product-world strip with a short opacity reveal and restrained downward settle.
  2. Reveal the white navigation surface from the top edge without bouncing or overshooting.
  3. Settle the centered Sparklys identity with a small fade/vertical movement rather than an attention-seeking scale effect.
  4. Bring in the left navigation group and right utility group with opposing 8–12px horizontal movements and a quiet 50–70ms internal stagger.
  5. Finish on the active navigation state so the header is completely stable before the primary page content takes visual priority.
- First-content handoff: after the header establishes the frame, allow the first page heading, supporting copy, and primary action to fade and rise in sequence. Avoid animating every word or character by default; use grouped elements and long, smooth easing to prevent nervous motion.
- Footer storyline:
  1. Let the black footer surface establish itself without moving the document layout.
  2. Fade and lift the brand/newsletter column first, making it the footer anchor.
  3. Bring in the navigation cards from left to right with a restrained stagger and matching vertical travel.
  4. Resolve legal, copyright, social, payment, store-finder, and language surfaces as the final quieter layer.
  5. Decide during prototyping whether the footer entrance should play once per visit or use a shallow reversible scrub; it must not repeatedly flash during small scroll-direction changes.
- Motion direction: favor opacity plus 8–48px translations, smooth non-bouncy easing, limited simultaneous movement, and clear visual hierarchy. Keep hover motion independent from entrance timelines.
- Accessibility and resilience: render the complete final state without JavaScript, skip non-essential animation for `prefers-reduced-motion`, preserve focus order and interaction during playback, avoid scroll locking, and prevent layout shifts.
- Build an isolated tuning preview before applying the intro globally. Expose duration, stagger, travel, easing, and scrub/catch-up values so the motion can be approved visually before hardening.
- Status: Existing native framework implemented; alternative-runtime evaluation and header/footer intro remain pending explicit approval.
- Added: 2026-08-23.

### TASK-004 — Define and implement smooth scrolling

- Consult Sandro before implementation and compare native CSS scrolling with established libraries such as Lenis and other credible alternatives.
- Present the tradeoffs for feel, browser support, bundle size, maintenance, accessibility, sticky-header behavior, anchor links, touch input, and Shopify theme compatibility.
- Preserve normal scrolling without JavaScript and disable enhanced motion for visitors who request reduced motion.
- Do not add a dependency or implement scrolling behavior until the preferred approach is explicitly approved.
- Status: Pending discovery and approval.
- Added: 2026-08-23.

## Approved

None.

## Maintenance

Last reconciled with local code and documented implementation records on 2026-10-04. The Admin API connection and local MRZ baseline are implemented and are no longer next-step tasks. See [Development](development.md#admin-api-connection) and [the age-check contract](age-verification-plan.md).
