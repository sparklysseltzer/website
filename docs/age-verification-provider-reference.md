# Future age-verification provider reference

Recorded and sources checked: 2026-09-09. Reference only; no provider selected, purchased or integrated.

## Current decision

The merchant chooses to retain the local MRZ plausibility/age check for now. Broader document support is planned in [International document coverage](age-verification-international-plan.md). Facial checks, paid providers, OCR capture, a backend and account persistence are separate future work, not authorized by this documentation update.

The current checker validates entered structure, calendar dates and check digits. It does not authenticate an issuer, prove possession or ownership, or prevent browser/direct-checkout bypass. MRZ checksums are not issuer signatures. Camera OCR alone would reduce typing, not establish document authenticity. These limits remain when foreign documents are added.

## Services to distinguish

| Service | Purpose | Remaining gap |
| --- | --- | --- |
| MRZ parsing/checksums | Read data and identify inconsistent input | Authenticity and ownership |
| Local camera/OCR | Reduce manual transcription | Authenticity and ownership |
| Facial age estimation | Estimate whether a person is sufficiently above a threshold | Exact DOB; uncertain cases require a fallback |
| Liveness | Assess whether a live person is present rather than a presentation/injection spoof | Age and document authenticity |
| Document verification plus selfie match | Assess document authenticity and match its portrait to the presenter | Provider-specific coverage, fraud limitations and operational handling |

Facial age estimation for the storefront's configured age threshold needs a validated decision threshold/buffer, appropriate liveness and an alternative for uncertain outcomes. Do not simply compare an estimated age to 16. [Yoti's description](https://www.yoti.com/business/facial-age-estimation/) distinguishes estimation, live capture and threshold configuration.

## Public cost benchmarks

Snapshot only, not a quote or a cheapest-provider conclusion. Recheck pricing, Swiss merchant eligibility, supported ages/documents and integration entitlements before procurement. Prices use their published currencies, exclude our engineering/operations costs and are not exchange-rate-normalized.

| Candidate | Published benchmark | Assessment |
| --- | --- | --- |
| Veriff Essential | US$0.80 per verification; US$49/month minimum | Automated document verification with biometric/liveness checks; confirm API/custom-capture availability and billing conditions for the selected plan. [Pricing](https://www.veriff.com/plans/self-serve) |
| Stripe Identity, Swiss pricing | CHF1.25 per completed document/selfie verification | Useful usage-based benchmark; standard capture uses Stripe's verification interface. Completed unverified reports can also be billable. [Pricing](https://stripe.com/en-ch/pricing), [billing](https://support.stripe.com/questions/billing-for-stripe-identity?locale=en-GB) |
| Yoti facial age estimation | Quote required; no current public per-check price verified | Candidate for age-focused checks without routinely collecting an ID. Ask for liveness, fallback, retries, setup fees and minimum commitments in the quote. [Product](https://www.yoti.com/business/facial-age-estimation/), [terms](https://www.yoti.com/terms/age-verification/organisations/) |
| AWS Rekognition Face Liveness | US$0.015/check for first 500,000 in the published US East (N. Virginia) example | Liveness component only, not an end-to-end age or document verification price. Region, SDK and other processing costs matter. [Pricing](https://aws.amazon.com/rekognition/pricing/), [integration](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness.html) |

## Owning the interface

A provider API does not necessarily permit replacement of its secure capture component. Veriff documents [direct media upload](https://devdocs.veriff.com/apidocs/v1sessionsidmedia-3); contractual availability and security expectations still need confirmation. Stripe's normal [Verification Session integration](https://docs.stripe.com/identity/verification-sessions) creates a session on a server and launches its capture flow. Yoti offers an [age-estimation API](https://developers.yoti.com/facial-age-estimation-api); secure capture/liveness requirements must be reviewed with the intended integration.

A future integration needs a separately designed backend to protect credentials, validate signed callbacks/results, bind results to the correct customer/session and retain only minimal verification metadata. Trusted Shopify checkout enforcement across direct/express paths is separate work; installing an API behind the existing browser gate does not automatically solve it. Keep the native Shopify theme and isolate any required capture SDK instead of replacing the storefront architecture.

## Future selection process

1. Measure verification demand without collecting MRZ, DOB, document numbers or images in analytics.
2. Compare quotes at realistic low/medium/high monthly volumes, including minimum charges, failed attempts, retries, fallback checks, setup, retention and support.
3. Test mobile completion, document coverage, accessibility, 16-year threshold behavior and fraud controls with permitted specimen/test data.
4. Compare total cost per completed eligible customer, including engineering and manual support, rather than the cheapest standalone API call.
5. Review data handling, account persistence, expiry and checkout enforcement before adoption.

Initial shortlist: quote Yoti for age estimation with liveness/fallback, and compare with Veriff and Stripe for document/selfie verification. Do not build a biometric verification stack solely because liveness API calls are inexpensive.
