# Completed task records

Historical completion notes moved out of the active backlog on 2026-09-28. These dates describe the original verification; they do not establish current store configuration or authorize deployment. Current capabilities live in [Status](../status.md).

### TASK-010 — Add breakpoint visibility controls to every section

- Add consistent Theme Editor options to every section: **Hide on mobile** and **Hide on desktop**. Both default to off, preserving existing visibility and saved content.
- Use shared breakpoint definitions and CSS visibility behavior across the section library; define tablet behavior explicitly with no gaps or overlapping ranges.
- Hidden sections must not leave empty spacing or keyboard-focusable content. Ensure hidden sections remain discoverable and editable in the Theme Editor, and verify behavior without JavaScript.
- Cover existing and future sections, document any necessary exceptions for essential storefront functionality, and update the shared section contract and owning documentation during implementation.
- Status: Completed locally on 2026-09-11. Shared CSS visibility covers 25 sections; Header, Main product, Main cart and Cart drawer are documented essential-function exceptions. Editor placeholders preserve selection.
- Added: 2026-09-07.

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

## TASK-012 — Design Studio expansion (2026-10-04)

The user subsequently approved and implemented the three-pane workbench, two-level navigation/search and Typography, Colors, Layout, Motion, Atoms, Components and Sections chapters. Real forms, social buttons, button motion, ambient Hero and Content Slider previews use storefront assets. This supersedes the earlier deferred status. Future preview parity remains ongoing maintenance; see [current contract](../design-studio.md).

### TASK-013: Separate product navigation and collection images

- Approved/completed: 2026-10-08, with artwork migration explicitly excluded.
- Renamed Product Teaser Image to Navigation Image while preserving `custom.teaser_image`, the definition ID, access/type/validation settings and all product assignments. Added pinned, image-only Product Collection Image (`custom.collection_image`) with public storefront access. Admin API read-back verified definitions and unchanged image references across all 20 products.
- Collection/catalog and compact Featured collection/Search cards prefer Collection Image independently of navigation. Known bundled flavour/pair artwork remains the empty-field catalog fallback; other/compact cards use the featured product image. Header and PDP flavour navigation retain Navigation Image. No uploaded, migrated, replaced or assigned artwork.
- Added a read-only-by-default, definition-only provisioning script with backups and verification. Reviewed three header menu help strings and the otherwise unchanged schema contract.
- Verified 35 local Liquid image-selection cases, actual empty-field Shopify rendering on desktop/phone, keyboard focus, no-JavaScript product links/images and CollectionPage JSON-LD parsing. Full repository checks passed. Populated new-field behaviour was tested with local render fixtures, not temporary product assignments.
- Store definitions are configured; theme rendering changes are local/development only, not deployed to shared/live themes. Current contracts are in Merchant content and the owning section documents.
