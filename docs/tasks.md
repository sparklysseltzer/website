# Task backlog

Open, separately scoped feature and maintenance proposals. Launch verification belongs in [Status](status.md#known-incomplete-capabilities); SEO implementation work belongs in [Structured-data tasks](structured-data-tasks.md); age-check extensions belong in [Age-check extensions](age-verification-extensions.md). None of these lists grants implementation approval.

## Approval rule

- Every item in this file is pending by default.
- Do not implement, start, or otherwise act on an item until Sandro gives explicit approval for that specific task.
- Adding, clarifying, prioritizing, or reorganizing an item does not constitute implementation approval.
- When an item is explicitly approved, move it to **Approved** before implementation. Remove completed items from this active list once the owning contract and Status record the result. Preserve useful dated evidence in [completed task records](archive/completed-tasks.md), rather than maintaining a second capability list here.

## Pending approval

Structured-data retrofit work is maintained in the separate [Structured-data task list](structured-data-tasks.md). Every unchecked item there follows the same pending-approval rule as this inbox.

### TASK-016: Audit and clean up the storefront

- Status: Plan recorded at Sandro's request. Audit execution and implementation have not started; move to Approved when execution is requested.
- Added: 2026-10-10.
- Scope: `sparklys-website` only. Gamebox and the separate age-check application are excluded. Review the theme's age-check integration where it affects storefront behavior.
- Goal: Identify confirmed technical defects, frontend bugs, measurable performance problems, unnecessary complexity and stale documentation, then address them in small, reviewable batches.

#### Phase 1: Establish the baseline

- [ ] Read repository instructions, product/architecture/development guides, quality and asset contracts, the section index and relevant owning documents.
- [ ] Inspect branch, working tree and recent changes. Preserve unrelated work, including the currently uncommitted age-check setting; record the commit and environment used for the audit.
- [ ] Map representative homepage, collection, PDP, cart, search, editorial, blog/article, navigation/footer and Design Studio surfaces. Use current saved configuration rather than assuming every feature is enabled.
- [ ] Run required repository gates and record their exit status. Separate baseline failures from regressions introduced by cleanup.
- [ ] Create one findings register with ID, priority, evidence/reproduction, affected files or surfaces, proposed fix, risk, verification method and status. Link existing launch, SEO and age-check tasks instead of duplicating them.

#### Phase 2: Investigate and prioritize

- [ ] Commerce: trace availability and overselling policy through PDP and upsells; variant/quantity updates, cart races, discounts, selling plans, shipping feedback, empty/error states and native form fallbacks. Separate theme behavior from checkout/provider configuration requiring independent verification.
- [ ] Frontend: inspect responsive layouts, menu/cart interactions, sticky elements, toasts, localization, image sizing and animation continuity. Include recent Brand statement, mobile cart, footer and Safari fixes as regression targets.
- [ ] Accessibility: check keyboard paths, focus restoration, dialogs, labels/announcements, contrast, zoom/reflow, touch targets, reduced motion and no-JavaScript core journeys.
- [ ] Code health: review duplicated logic, CSS conflicts, stale selectors, DOM assumptions, event/observer cleanup, Theme Editor reloads, asynchronous requests and error handling. Identify simplifications that preserve behavior and saved IDs.
- [ ] Performance: collect repeatable baseline measurements for representative pages with recorded viewport, device/network settings and cache state. Inspect LCP, CLS, interaction/main-thread work, image/font delivery, eager media, unused page assets and animation costs. Label lab results; do not present them as real-user metrics.
- [ ] Theme Editor/content: review schema dependencies, defaults, translation ownership and saved-content compatibility. Check applicable server-rendered structured data against visible content and record gaps in the existing SEO backlog.
- [ ] Repository/docs: identify obsolete instructions, inconsistent capability claims, temporary artifacts and potentially unused assets/dependencies. Confirm dynamic Liquid, JSON, merchant settings, app and Studio references before proposing deletion.
- [ ] Present findings in priority order: P0 critical commerce/security failures; P1 broken journeys or substantial accessibility regressions; P2 measured performance and maintainability issues; P3 optional polish. Distinguish reproduced defects, suspected issues and unverified external dependencies.

#### Phase 3: Apply focused cleanup batches

- [ ] Batch 1: confirmed commerce and functional defects.
- [ ] Batch 2: frontend, responsive and accessibility regressions.
- [ ] Batch 3: measured performance problems, with comparable before/after evidence.
- [ ] Batch 4: behavior-preserving simplification and removal of confirmed unused files. Review broad refactors, new dependencies and architectural changes before implementation.
- [ ] Batch 5: reconcile remaining documentation with actual implementation and verification limits. Update owning documents alongside every preceding batch that changes a contract; do not defer those updates to this final pass.

#### Verification and completion

- [ ] For each batch, run `npm run check`, affected JavaScript syntax checks including `node --check assets/theme.js`, JSON parsing and `git diff --check`. Add focused regression coverage for reproduced defects where practical.
- [ ] Verify affected journeys in isolated headless browsers at representative phone/desktop sizes, keyboard, reduced motion and no-JavaScript where applicable. Include intermediate animation states and rapid/repeated interactions. Follow the repository's fractional-width/DPR matrix when changing shared geometry or paint.
- [ ] Record physical iPhone Safari checks separately from responsive emulation. If hardware or provider access is unavailable, explicitly leave those checks unverified. Close every task-created browser session.
- [ ] Close findings only with recorded evidence. Summarize fixed items, measured improvements, deferred risks and remaining checks; update Status and owning contracts without claiming universal production readiness.
- [ ] Prepare meaningful change batches for review. Commit/push, remote content changes and publication are separate execution steps requiring applicable authorization; this plan authorizes none of them.

Safeguards: preserve Shopify/editor-owned content, setting/section/block IDs and unrelated local changes. Do not delete remote resources, submit real orders or change subscriptions/provider settings as audit probes. Use an already approved development preview; starting or recreating a remote development theme follows the existing approval rule. Avoid a wholesale rewrite, speculative optimization or dependency upgrades without a demonstrated need.

### TASK-015: Evaluate autoplay video reliability and fallback concepts

- Assess how problematic autoplay videos are across the storefront, especially hero and decorative media. Investigate the reported iPhone Low Power Mode behavior: autoplay stops and a native play overlay appears that the current implementation cannot remove. Reproduce on physical iPhones and distinguish browser-owned controls from theme controls before drawing conclusions.
- Discuss concepts and tradeoffs with Sandro before implementation: a curated static image fallback; a poster shown until playback actually starts; or an intentional, accessible tap-to-play experience for meaningful video. Consider separate treatments for decorative loops and content visitors need to watch.
- Explore detecting rejected playback attempts and stalled or interrupted playback rather than assuming battery mode can be reliably detected. Decide how to show a clean fallback without a blank frame, unwanted native overlay, layout shift, repeated retries or flickering when switching slides or returning to the page.
- Evaluate poster quality and merchant image selection, existing ready assets, loading cost, mobile data and battery use, reduced motion, accessibility, no-JavaScript rendering, and Shopify Theme Editor lifecycle. Preserve the media panel’s responsive dimensions and links/actions.
- Validate normal and Low Power Mode on physical iPhone Safari, plus representative Android and desktop browsers, slow connections and background/foreground transitions. Document browser limitations and which behaviors the theme can actually control; do not promise CSS can suppress browser-owned UI.
- Deliver a recommendation and a reviewable concept comparison before choosing a fallback or implementing changes.
- Status: Pending discovery and implementation approval. Record for later discussion; no implementation requested.
- Added: 2026-10-09.

### TASK-014: Floating drink can hover with a responsive ground shadow

- Explore a new hover treatment for drink cans: pointer entry lifts the can off the floor and tilts it slightly to one side. It remains gently hovering while the pointer stays over the product.
- Animate the ground shadow together with the can. Its position, perspective, shape, softness and opacity should respond coherently to the can's height and lean so it reads as a shadow on the floor.
- On pointer exit, smoothly lower the can back to its grounded resting pose and return the shadow to its contact state. Rapid entry/exit must reverse from the current pose without snapping.
- Prototype using the existing drink artwork. Confirm the applicable product surfaces and tune lift, lean and hover motion before rollout; keep card layout and click targets stable.
- Follow shared motion timing and reduced-motion behavior. Preserve keyboard focus and touch interaction without requiring hover, and keep the resting product usable without JavaScript.
- Status: Pending approval. Record the idea for later; no implementation requested.
- Added: 2026-10-08.

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
