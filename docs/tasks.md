# Task inbox

This file is temporary storage for ideas and follow-up work that arise while another task is in progress.

## Approval rule

- Every item in this file is pending by default.
- Do not implement, start, or otherwise act on an item until Sandro gives explicit approval for that specific task.
- Adding, clarifying, prioritizing, or reorganizing an item does not constitute implementation approval.
- When an item is explicitly approved, move it to **Approved** before implementation. Move completed work to **Completed** with its completion date.

## Pending approval

Structured-data retrofit work is maintained in the separate [Structured-data task list](structured-data-tasks.md). Every unchecked item there follows the same pending-approval rule as this inbox.

### TASK-012 — Extend the design system studio

- Preserve the existing local form studio as the foundation for a broader designer reference and tuning suite.
- Add collections for typography, colors, spacing and radii; buttons and icons; cards; and shared motion examples with replay and reduced-motion comparisons.
- Reuse actual theme tokens and components, show relevant states at phone and desktop sizes, and support reviewing proposed token adjustments with the designer.
- Keep the studio separate from the storefront, excluded from Shopify uploads and indexing. Startup and isolation details: [Design system studio](design-system-studio.md).
- Status: Deferred for future work at Sandro's request; no expansion is being implemented now.
- Added: 2026-09-09.

### TASK-010 — Add breakpoint visibility controls to every section

- Add consistent Theme Editor options to every section: **Hide on mobile** and **Hide on desktop**. Both default to off, preserving existing visibility and saved content.
- Use shared breakpoint definitions and CSS visibility behavior across the section library; define tablet behavior explicitly with no gaps or overlapping ranges.
- Hidden sections must not leave empty spacing or keyboard-focusable content. Ensure hidden sections remain discoverable and editable in the Theme Editor, and verify behavior without JavaScript.
- Cover existing and future sections, document any necessary exceptions for essential storefront functionality, and update the shared section contract and owning documentation during implementation.
- Status: Pending implementation approval; recording this task does not authorize implementation.
- Added: 2026-09-07.

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

## Completed

### TASK-011 — Keep existing cart rows stable during quantity updates

- Fixed the discounted Maracuja row replaying an entrance animation when its quantity changes. Visual matching used Shopify line keys, which can change with discount allocations.
- Added a presentation-only identity from variant, selling plan and line properties; current Shopify keys remain authoritative for mutations. Repeated configurations receive separate visual slots. Quantity-input focus survives discount key changes.
- Verified both cart surfaces with simulated section responses on desktop/phone: discounted and undiscounted quantity updates animate prices without row entrances; new lines enter and removed lines exit. Reduced motion suppresses these animations.
- Status: Completed locally; not published.
- Approved and completed: 2026-09-09.

### TASK-008 — Eliminate the newsletter button sweep edge bleed

- Removed the separate border-color animation from the shared Bubble Sweep instead of continuing to tune competing timelines.
- Primary and secondary buttons now keep a permanent black 2px border; the footer newsletter button keeps a permanent white 2px border. Only the clipped fill circle animates, matching the motion lab and removing the border/fill timing seam.
- Status: Completed.
- Added: 2026-08-23.
- Approved and completed: 2026-08-23.

### TASK-007 — Apply the approved Bubble Sweep tuning candidate

- Updated the shared `.button` Bubble Sweep to the approved preview parameters: 800ms entrance, 880ms exit, symmetric easing, 336px bubble, `-216px` horizontal origin, `-168px` vertical origin, and scale `0.30` to `2.45`.
- The shared primitive carries the change into primary, secondary, footer newsletter, pointer-hover, keyboard-focus, and reduced-motion states without altering their semantic behavior.
- Status: Completed.
- Added: 2026-08-23.
- Approved and completed: 2026-08-23.

### TASK-005 — Integrate the footer newsletter field with Klaviyo

- Replaced the static footer preview with an accessible Shopify customer form tagged `newsletter`, matching the production storefront's form contract and relying on the existing Shopify–Klaviyo integration for synchronization.
- Added localized German and English labels, placeholders, submit text, and success feedback while preserving Shopify's server-rendered errors and a complete no-JavaScript submission path.
- Kept Klaviyo list routing, double opt-in, and consent behavior out of theme code; these remain provider-account configuration that must be verified before launch.
- Status: Theme implementation completed; provider synchronization verification remains an operational launch check.
- Added: 2026-08-23.
- Approved and completed: 2026-08-23.

### TASK-003 — Optically align the black-bar brand tabs

- Reduced the desktop brand-tab inset by 4px so the visible “Sparklys Hard Seltzer” label aligns with the white-bar Shop label while preserving the utility-navigation edge.
- Verified desktop hover alignment and the unchanged mobile header in the connected development preview.
- Status: Completed.
- Added: 2026-08-16.
- Approved and completed: 2026-08-23.

### TASK-001 — Dynamic footer year

- Replaced the hardcoded footer year with Shopify's server-rendered current year while preserving localized German and English copyright strings.
- Status: Completed.
- Added: 2026-08-16.
- Approved and completed: 2026-08-16.

### TASK-002 — Hard Seltzer header logo

- Replaced the Arc with the Hard Seltzer logo on Hard Seltzer pages while preserving the Arc for general pages and the Soda logo for Soda pages.
- Status: Completed.
- Added: 2026-08-16.
- Approved and completed: 2026-08-16.

## Local age check — 2026-09-08

MVP code implemented and enabled in local development fixtures; the 16 published products are classified. Shared-theme activation defaults off pending document-guide rollout review. Product metafield `custom.contains_alcohol` created. See [implementation](age-verification-plan.md) and [specific extensions](age-verification-extensions.md).
