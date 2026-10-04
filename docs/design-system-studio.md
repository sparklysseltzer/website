# Design system studio

The current workbench contract, navigation, previews and extension workflow live in [Design Studio](design-studio.md). This page retains the stable startup/isolation reference for existing links.

Run `npm run studio` and open http://127.0.0.1:9293. Stop with Ctrl+C. It is a local buildless workbench, separate from Shopify and requiring no store credentials. A checkout and Node 22+ are sufficient. The localhost URL is not a public sharing link. Preview controls change local proposals only, not source files or Shopify settings.

## Isolation

- `demos/**` is excluded from Shopify uploads through `.shopifyignore`; no theme template, navigation item or sitemap entry points to the studio.
- The server binds only to `127.0.0.1` and serves an allowlist of studio files and public theme assets.
- Every response carries `X-Robots-Tag: noindex, nofollow, noarchive`; the page also has a robots meta tag and `/robots.txt` disallows crawling. These are indexing instructions, not access control; loopback binding provides the local access boundary.
- No analytics or external form submissions are installed. Use sample data.
- Do not publish this studio as part of the storefront. Any future remote designer preview needs separate, access-controlled hosting.

The reusable form primitives remain in `assets/forms.css` and `assets/forms.js`. Their adoption contract is documented in [forms.md](forms.md); studio-only layout and tuning code stay under `demos/design-system/`.
