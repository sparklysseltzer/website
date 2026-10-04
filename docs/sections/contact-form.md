# Contact form

Source: `sections/contact-form.liquid`, `assets/contact-form.js`, shared `assets/forms.css`, `templates/page.kontakt.json`.

## Composition and content

The Contact template contains one Page intro followed by one Contact form. It deliberately omits Main page: Page intro owns the sole H1. The existing Kontakt Page already has template suffix `kontakt`; adding this template to development requires no Page reassignment. The shared/live theme has not been deployed.

The form recreates the existing storefront's first name, last name, email, optional telephone and required message fields. First/last name and telephone keep their existing submission keys. Message uses Shopify's standard `contact[body]` for its spam filtering. All reusable copy lives in English/German locale keys under `contact`. The left-aligned form H2 uses Section; the confirmation H3 uses Card; labels use the shared enquiry-form UI role; controls and message use UI/Body. Native focus, keyboard validation, 48px controls and reduced-motion button treatments are inherited.

German page-owned intro fields were added through Admin GraphQL on 2026-10-01, with compare-and-set protection against overwriting existing values and a private external backup. H1: “Kontakt zu Sparklys”. Introduction names Soda, Hard Seltzer, orders, bars, retail and events, with the brand's dry inbox joke. These are editorial Page fields, not strings replaced in Liquid. English editorial translation remains pending: the connected Admin app currently lacks translation scopes. Proposed English copy: “Questions about your order, Sparklys Soda or Hard Seltzer? Want to bring Sparklys to your bar, shop or event? Write to us — our inbox could use something other than invoices.”

## Submission and feedback

Shopify's native contact form owns posting, redirects, server validation and any platform CAPTCHA. No fetch interception, automatic enquiry retry or JavaScript-only contact endpoint. Required field checks remain native with scripts disabled. Shopify validates email server-side; other required fields use browser validation and are not a trusted server-side enforcement mechanism.

After a successful native response, a durable confirmation replaces the fields and offers a new-message link. Server errors stay inline and email errors link to and describe the field. These are native response states/actionable validation, not temporary toasts. Normal document changes inherit the shared cross-document transition; unsupported/reduced-motion browsers use normal navigation. No Ajax section replacement or local form entrance animation is introduced.

Messages go to Shopify's configured sender email address. The theme cannot choose a per-section recipient or change Shopify's email subject. A real delivery/CAPTCHA test and mailbox receipt verification are still required; automated verification must not send live enquiries.

## Optional Klaviyo newsletter

The checkbox is optional and unchecked. It appears only when enabled and both public routing IDs are present; configuration guidance is visible in the Theme Editor otherwise. The development Contact template uses the existing public storefront site ID `Vv6a6f` and the merchant-confirmed newsletter list `TwzfPb` (provided on 2026-10-01). The checkbox is enabled in development. **Real subscription delivery, account-side list ownership and opt-in behavior still require provider verification.** Never put a private API key in theme settings or assets.

When JavaScript and session storage are available, an explicitly checked newsletter choice saves first name, last name, email and optional phone in tab-local `sessionStorage` for the native redirect. No enquiry text is saved or sent to Klaviyo. Records older than 15 minutes or addressed to different configured IDs are discarded on initialization. Expiration is checked on access, not a browser-enforced storage TTL; abandoned entries can remain until next initialization or tab closure. Successful requests remove the saved record.

Only Shopify's successful contact response triggers Klaviyo's public Client Subscriptions API, revision `2026-07-15`. It sends explicit **email marketing** consent and the configured list; its existing opt-in settings apply. Phone is preserved verbatim as the custom profile property `contact_phone`, not used as an SMS subscription or guessed international identifier. Existing profile data is not touched for unchecked enquiries. The enquiry itself belongs in the mailbox or a future Helpdesk integration, not a marketing profile property.

Klaviyo acceptance is HTTP 202, meaning request accepted, not proof of confirmed list membership. The result tells visitors to follow any confirmation email. A timeout, blocker or API failure does not resend the contact message: the durable newsletter result provides a separate retry. Pending/error/accepted copy crossfades and interpolates its own height with shared motion; reduced motion is immediate. The configured checkbox stays disabled with a clear explanation if JavaScript/storage is unavailable; the native enquiry still works. This is a browser enhancement, not a durable server queue: closing the page before the follow-up request can prevent signup. No enquiry delivery depends on it.

## Theme Editor review

Preset: Contact form, Trust & information, Page templates only, maximum one per template. Field inventory and dependencies:

| Group/control | Fields enabled |
| --- | --- |
| Content: Heading | Always available; escaped plain text overrides the translated `contact.heading` fallback; blank retains the current localized heading |
| Appearance: Heading font, Erode/Newake | No dependent fields; shared heading tokens and authored casing |
| Newsletter: Offer newsletter signup | Public site ID and newsletter list ID, each conditionally visible |
| Visibility: Hide on mobile / Hide on desktop | No dependent fields; independent shared breakpoint visibility |
| Section background: Default / Transparent / Custom Color | Color picker only for Custom Color; clear means transparent |

Both-hidden form configurations are editorial visibility choices, not access control. Keep an accessible contact route when hiding the form. Native Page intro remains independent. New placements start with a transparent canvas. No destructive IDs or legacy fingerprint changes.

## SEO

Page intro emits one `ContactPage` using the existing canonical `#webpage` ID on the `kontakt` template. It specializes the existing WebPage entity rather than introducing a duplicate entity. Only the visible H1/intro and real canonical/language are included; no invented contact address or organization details. The form introduces no additional entity.

The existing live Page SEO title/description are preserved because changing them affects the live storefront too. Suggested release title: “Kontakt | Sparklys Soda & Hard Seltzer Schweiz”. Suggested description: “Fragen zu deiner Bestellung, Sparklys Soda oder Hard Seltzer? Kontaktiere uns für Feedback und Anfragen aus Gastronomie, Detailhandel oder für Events.” Review and apply at release.

## Verification

`npm run check:contact` verifies explicit consent, no inquiry/SMS payload, success-only dispatch, list routing, retry isolation, expiration and storage failure with mocked requests. Browser and final gate results are recorded after implementation review below. Real newsletter list routing, confirmation email and mailbox delivery remain separate integration checks.

2026-10-01: all repository gates passed (including six newsletter tests), JavaScript syntax and diff whitespace checks passed. All 35 JSON documents parse; strict `jq` rejects 12 existing Shopify comment headers, so these were stripped in memory for validation without rewriting merchant files. Isolated headless Chromium checked 390px/1440px form layouts and mocked configured opt-in/error/retry/accepted states, including an intermediate crossfade, unchanged-state no-replay and reduced motion. Checked 320px overflow, computed Erode casing, one H1/ContactPage, and pointer focus versus the 3px keyboard ring. Actual JavaScript-disabled rendering and native required-field focus passed on phone, with no overflow at phone/desktop. Native success markup was inspected using Shopify's success query parameter without sending a message. Browser-only fixtures exercised the configured checkbox before the real list ID was supplied. Full authenticated Theme Editor interaction, English editorial rendering, actual email delivery and live Klaviyo acceptance are not claimed by these checks.

List configuration verification (2026-10-01): development rendering confirmed site `Vv6a6f`, list `TwzfPb`, and an enabled, unchecked opt-in control. Phone/desktop layout and mocked request/error/retry checks passed again; no live enquiry or subscription was sent. All repository checks passed and the isolated browser was closed.

Contact intro canvas correction (2026-10-01): the Contact template uses Page intro’s Default background mode, matching Team and the established editorial templates. Transparent mode removes the white-to-transparent gradient and makes the pale Arc blend into the beige page canvas. The form section remains transparent. No shared artwork, opacity or global style was changed.

Contact intro follow-up (2026-10-01): the latest saved development template had returned to Transparent while About remained Default. Pulled the latest remote template with the watcher stopped, changed only `intro.settings.section_background_mode` to `original`, and preserved all current form and Poster settings. Default is required to match About’s white-to-transparent intro gradient; Transparent intentionally removes that gradient.
Verified the rendered Kontakt and Über uns intros at 390px and 1440px: identical computed white-to-transparent gradient, identical Arc asset and opacity, and no horizontal overflow. Kontakt screenshots were reviewed at both sizes. Preview startup also confirmed local/remote JSON agreement after the targeted save.

Heading editor update (2026-10-02): Contact form → Content → Heading edits the form H2 independently from Page intro. Blank preserves the locale fallback; custom merchant text is rendered as authored and escaped, with translations managed through Shopify. The section retains its heading ID and accessible region label. No saved template content is migrated.
Verified the default heading at 390px/1440px: H2, left alignment, shared Section size, Erode with authored casing, and no horizontal overflow. Schema contracts cover blank/default and custom-heading field availability. Repository checks passed; no live enquiry was sent.

Intro rebuild (2026-10-02): following the merchant’s explicit request, removed the old `intro` instance from the latest development template, then added `intro_about` as an exact copy of About’s saved Page intro configuration. This intentionally replaces only the intro ID; all other section IDs, settings, blocks and relative order are preserved. The old instance had again been saved as Transparent. Verified the rebuilt remote JSON before restarting the watcher. Reopen/refresh the editor before further edits so it loads the new instance.

Ananotes 162 (2026-10-02): removed the separate required-fields explanation above the form. Individual labels, asterisks, native `required` attributes and field validation remain. The locale key is retained to preserve saved translation ownership; the same CSS helper remains used for editor configuration guidance.

Enquiry styling (2026-10-02): the section explicitly opts into `form--inquiry`, following [Forms](../forms.md#enquiry-forms--2026-10-02). Native fields use 2px warm borders, Small-radius corners and flush sentence-case labels. The same section on Press receives this treatment. Field names, heading alignment/settings, validation, native posting and newsletter consent are unchanged. Commerce controls do not opt in.
Verified the new enquiry controls at 1440px/390px, including keyboard/pointer focus, no overflow and script-blocked native required-field validation. No form delivery was attempted. PDP control geometry was independently checked unchanged. See Forms for the full studio and fallback verification.

## Independent Press form — 2026-10-02

The Press page now uses [Press form](press-form.md), with its own schema and field markup. Contact remains this section; shared visual layout moved unchanged to `assets/inquiry-form.css`, loaded by both sections. Both reuse `contact-form.js` for the existing native-contact/Klaviyo lifecycle. Fields currently match but can evolve separately. This supersedes earlier references to the Press page reusing Contact form.

Ananotes 166 (2026-10-02): removed newsletter-specific top alignment and indicator margin. The shared centered choice layout now aligns checkbox and copy for both one-line desktop and wrapped phone labels, retaining the 44px target. Verified equal indicator/text centers at 1732px and 390px. Shared inquiry CSS gives Press the same correction.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Narrow**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).
