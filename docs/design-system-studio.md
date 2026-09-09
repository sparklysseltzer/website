# Design system studio

The permanent, local design reference lives in `demos/design-system/`. It uses the actual theme assets and shared tokens so designers can review real controls instead of a separate mockup.

Expansion status: deferred on 2026-09-09 while other storefront work takes priority. The existing forms collection remains available; future collections are tracked as [TASK-012](tasks.md#task-012--extend-the-design-system-studio).

## Open it

From the repository root, run `npm run studio`, then open http://127.0.0.1:9293. Stop it with Ctrl+C. It runs independently of Shopify and needs no store credentials. A designer with a repository checkout and Node 22 or newer can run the same command locally. The localhost link only works on the computer running the server; it is not a public sharing link.

## Review and tune

Forms are the first working collection: fields, dropdowns, radio buttons, checkboxes, validation and disabled states. The controls at the top change preview tokens; Copy tokens exports the proposed values for review. Changes currently last only for the page session. Approved values should be applied to the shared source and reviewed before storefront adoption.

Keep new collections in this studio. Future additions can cover typography/colors/spacing/radii, buttons and icons, cards, and motion examples with replay and reduced-motion comparisons. Show real shared components wherever possible, include phone and desktop layouts, and identify prototypes clearly. This is the extension roadmap; those additional collections are not implemented yet.

## Isolation

- `demos/**` is excluded from Shopify uploads through `.shopifyignore`; no theme template, navigation item or sitemap entry points to the studio.
- The server binds only to `127.0.0.1` and serves an allowlist of studio files and public theme assets.
- Every response carries `X-Robots-Tag: noindex, nofollow, noarchive`; the page also has a robots meta tag and `/robots.txt` disallows crawling. These are indexing instructions, not access control; loopback binding provides the local access boundary.
- No analytics or external form submissions are installed. Use sample data.
- Do not publish this studio as part of the storefront. Any future remote designer preview needs separate, access-controlled hosting.

The reusable form primitives remain in `assets/forms.css` and `assets/forms.js`. Their adoption contract is documented in [forms.md](forms.md); studio-only layout and tuning code stay under `demos/design-system/`.
