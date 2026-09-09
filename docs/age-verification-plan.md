# Local MRZ age check

Status: MVP implemented locally, 2026-09-08. Not published. Final document artwork and store rollout remain pending.

## Confirmed policy

Alcoholic products require age 16. Expired documents are accepted: their dates and check digits must still be structurally valid. This is a local plausibility check, not proof of document authenticity or ownership. Browser time and remembered results are user-controlled; direct checkout URLs and external sales channels can bypass theme code.

## Product configuration

Shopify product metafield **Contains alcohol**, `custom.contains_alcohol`, type boolean, is the sole classification source. The definition was created and pinned on 2026-09-08 with Storefront API access and admin filtering. Set true for alcohol and bundles containing alcohol; explicitly false for Soda, merchandise and other unrestricted goods. Variants inherit the product value. An unset field blocks the enabled cart checkout with a configuration message. Never infer eligibility from names, tags, product type or brand worlds at runtime.

The 16 currently published products were classified: three Hard Seltzer products true; four Soda products and nine merchandise products false. Additional draft/archived Hard Seltzer products were marked true. The draft gift card is still unclassified and must be classified before publishing. Audit new products and bundles before sale. Theme settings → Age check contains the enable switch (default off) and policy version. The isolated local development fixture enables it; protected shared settings are not uploaded. Increment the version when rules change. Do not overwrite shared theme settings or publish to activate this feature.

## Journey and implementation

Both cart surfaces render `cart-age-policy.liquid`. `age-check.js` intercepts their checkout submits and fetches the current server-rendered cart policy. Restricted carts open a native secondary dialog; the existing cart drawer remains visible and inert. Cancel/Escape clears inputs and returns focus. Validation success clears inputs, announces completion, and automatically continues to checkout. The continuation refreshes policy again before posting checkout plus the current draft note. It never posts MRZ fields or stale quantity fields.

The four document choices are Swiss ID, Liechtenstein ID, Swiss passport and Liechtenstein passport. The first two use standard ICAO TD1, passports TD3. Interactive local schematics contain the actual labeled fields and describe where the MRZ is located (ID back; passport personal-data page). They are baseline guides, not issuer artwork or a claim of coverage for every historic edition. Unexpected layouts and extended document numbers are not supported.

`age-validation.js` is a pure validator with ICAO 7/3/1 check digits, document/birth/expiry/composite checks, optional-field handling, real dates, conditional four-digit birth year only when century ambiguity changes eligibility, and calendar age in Europe/Zurich. Leap-day birthdays advance on March 1 in non-leap years. The official Swiss 2023 specimen and ICAO passport example are fixtures; other profile cases are synthetic format tests.

## Remembered result and privacy

Only threshold, customer-or-guest context, policy version, checked-at timestamp and 12-hour expiry are stored in sessionStorage. This survives reload and cart edits within the tab. Account changes, policy changes and expiry invalidate reuse. Storage denial falls back to page memory. No document number, MRZ, birth date, name or image is stored or sent by this feature. Do not put the result into cart attributes or describe it as trusted verification evidence. Logged-in reuse is local to this browser context; cross-device customer-account persistence is a separate extension.

Inputs disable autocomplete and mark the dialog private for common session-replay tools. Any future analytics integration must explicitly exclude these fields; HTML markers alone cannot guarantee third-party scripts obey privacy rules. Input errors remain inline and focus the affected field rather than sending sensitive form feedback to general toasts.

## Accessibility and resilience

Native dialog supplies the focus boundary. Close/back controls remain available, success is announced, and motion respects reduced-motion preferences. Restricted or unclassified checkout buttons are disabled in server HTML until the controller is ready. With JavaScript disabled, the explanation remains visible and cart editing/removal remains usable; unrestricted checkout remains native. This intentional fail-closed exception is limited to the local age gate and is not server enforcement.

## Validation and rollout

Run `npm run check:age` and the full theme checks. Browser coverage must include both cart surfaces, mobile/desktop, keyboard cancel/reopen, invalid fields, success, remembered reuse, stale policy, failed refresh, storage denial and JavaScript disabled. Use specimen/synthetic input only. Never submit an actual order while testing.

Before enabling on a shared theme: finish classification audit, verify the four document guides against intended editions with final design, and review unsupported-document assistance. No Schema.org entity applies to this private checkout interaction; no JSON-LD is emitted.

See [document research](age-verification-documents.md) and [extension backlog](age-verification-extensions.md).

## MVP verification — 2026-09-08

Full `npm run check` passed, including 10 age-validator tests. JavaScript syntax and whitespace checks passed. Strict JSON parsing passed after excluding Shopify-generated comment headers (plain jq reports those existing headers). Isolated headless browser checks at 1440×900 and 390×844 covered cart-page entry, drawer layering/inert state, invalid field focus, specimen success, cleared raw fields, remembered reuse, unknown-policy blocking and Escape. The intercepted final native submission contained only checkout and note. No checkout/order was submitted. With external theme scripts aborted, restricted checkout was disabled with an explanation and native removal worked; a Soda-only cart retained enabled native checkout. Actual Shopify-rendered policy returned age 16 for Hard Seltzer and age 0 for Soda. Local preview has the feature enabled; no shared or live theme was published.

Inline-document UX now replaces the original separate field grid. Liechtenstein IDs have a current/previous visual version selector. The current Liechtenstein ID and passport specimens are additionally covered by checksum fixtures; detailed source corrections and UX contracts live in the document reference.

## Automatic checkout continuation and local reset

Successful validation shows completion feedback while the current cart policy is fetched, then automatically submits checkout. No additional confirmation or artificial delay. A compatible remembered pass proceeds from the initial fresh policy directly to checkout. The action label remains “Check age” / “Alter prüfen”; alcoholic-cart advance notice is a later task. On a continuation failure, keep the modal open and offer a retry; cancellation or a changed/unknown policy must prevent handoff. Double submissions are guarded.

For local testing, run `sessionStorage.removeItem('sparklys:local-age-check:v1'); location.reload();` in the storefront tab's browser console. Reload clears the controller's in-memory fallback as well. This resets only the local convenience record; it does not change the cart, customer account or Shopify configuration. Do not clear all site data merely to reset this check.

### Conditional birth-year clarification

The full birth-year field is hidden and disabled by default. After MRZ checks pass, the validator considers valid, non-future birth dates matching the two-digit year within the existing supported range (1800 through the current year). If all possibilities meet the minimum age, no extra input is needed. If eligibility differs, reveal and focus the full-year field inside the document with a localized explanation. An explicit year must match the MRZ and calendar date; minors remain blocked. Editing the MRZ birth value clears and hides the clarification again. This applies consistently to all supported document profiles. No document data is persisted.

## International coverage and provider direction — 2026-09-09

Keep the local MRZ check for now. See the proposed [international document coverage plan](age-verification-international-plan.md) for a shared foreign-passport path and curated foreign ID coverage, and the [provider reference](age-verification-provider-reference.md) for deferred API/biometric options. These records do not enable new documents or alter the current assurance limitations.
