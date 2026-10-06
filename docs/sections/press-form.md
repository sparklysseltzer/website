# Press form

Source: `sections/press-form.liquid`, shared `assets/inquiry-form.css`, `assets/forms.css` and `assets/contact-form.js`.

## Purpose and ownership

A separate native Shopify enquiry section for media requests. Press and Contact own separate field markup and schemas so their inventories can evolve independently. They share enquiry styling, progressive form controls and the consent/success controller; adding a Press-only field does not require changing Contact. The custom element remains `sparklys-contact` because it owns the common native-contact/newsletter lifecycle rather than a field inventory.

Current fields match Contact: required first name, last name, email and message, plus optional phone and optional unchecked newsletter consent. Shopify's native `contact` form and `contact[body]` remain authoritative. Messages go to the same configured sender email; this split does not create separate mailbox routing or change Shopify's subject. See [Contact form](contact-form.md) for native errors/success, CAPTCHA, privacy and success-only Klaviyo semantics. No inquiry text is sent to Klaviyo.

Press IDs use `PressForm-` / `PressHeading-` plus the section ID. Its editable, left-aligned H2 falls back to the translated `press.form_heading`. Common field labels and feedback remain shared translations until their meanings diverge. No new Schema.org entity applies to the form; Page intro continues to own the page entity.

## Theme Editor contract

Preset: **Press form**, Trust & information, Page templates, limit one per template. Content contains Heading; Appearance contains Heading font (Erode/Newake, no dependent fields). Newsletter signup enables both public Klaviyo ID fields, each individually conditional. Mobile/Desktop visibility toggles are independent. Section background Custom alone exposes Color. IDs/options/defaults match the reviewed Contact controls; the independent schema has its own editor contract, including newsletter on/off and custom/default/transparent background cases.

## Development migration

Read the latest saved development Press template before replacing only its `contact` section's type with `press-form`. Its section ID, heading, newsletter IDs, visibility, background and position remain unchanged. Contact page stays on `contact-form`. No store page assignment, shared theme or live theme changes. Saved content on the shared editorial theme must be merged independently at an explicitly authorized release.

## Verification — 2026-10-02

Development rendering confirms a `PressForm-` ID on the Press page and a `ContactForm-` ID on Contact, each with the same five current fields and four required constraints. The store currently redirects the old `/pages/press-media-kit` URL to `/pages/press-media`; the existing template assignment still renders the migrated section. Saved heading, optional newsletter routing and all other template settings were retained. Both forms retain 388px desktop columns, 2px enquiry borders and phone layouts without horizontal overflow. Press native validity rejects empty fields; no inquiry or subscription was sent. Full schema/repository checks, JS syntax, JSON parsing and whitespace checks passed. Test browser closed.

Ananotes 166: shared newsletter alignment now centers checkbox and copy for single-line and wrapped labels, matching Contact; no consent or submission behavior change.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Narrow**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).
