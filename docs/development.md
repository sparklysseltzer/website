# Development workflow

## Language policy

English is the source language and default theme locale. Always author code, identifiers, comments, tests, commits, technical documentation, Shopify definition names and field labels, Theme Editor schema names/labels/help text, and every other technical or administrative interface in English. Reusable storefront UI starts in `locales/en.default.json` and is translated into `locales/de.json`; never author German as the source. Merchant content follows the same source-first translation model when Shopify translation support is configured.

## Toolchain

- Node.js 22 or newer
- npm
- Shopify CLI pinned in `devDependencies`
- Theme Check through Shopify CLI
- `jq` for local JSON verification

Install dependencies:

```sh
npm install
```

## Read-only local validation

`npm run check:typography` enforces the shared typography roles and documented composition exceptions. It runs as part of `npm run check`. Update roles centrally in `assets/base.css`, never through section-local clamps. See [Design system](design-system.md).

Run before every implementation handoff:

```sh
npm run check
node --check assets/theme.js
find config locales sections templates -type f -name '*.json' -print0 | xargs -0 -n1 jq empty
git diff --check
```

Theme Check detects Liquid/JSON syntax problems, missing templates, deprecated constructs, unused code, and selected performance issues. Configuration lives in `.theme-check.yml`. See [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) and its [configuration reference](https://shopify.dev/docs/storefronts/themes/tools/theme-check/configuration).

Shopify may write a leading generated `/* ... */` comment into synchronized JSON templates/settings. Raw `jq empty` rejects that comment even when Theme Check accepts the file. If this is the only parsing failure, validate the remaining JSON after stripping only that leading comment in memory; do not rewrite merchant settings or remove source headers merely to satisfy the standalone parser. Other JSON errors still fail the handoff.

`npm run check` also runs `npm run check:assets`, which reports raw, gzip, and Brotli estimates and enforces review thresholds for the global CSS and JavaScript payloads. Shopify performs the actual production minification, compression negotiation, versioning, and CDN caching. See [Frontend asset structure and delivery](frontend-assets.md) for placement rules and release verification.

## Searching current Shopify documentation

The pinned CLI can query Shopify's current documentation directly:

```sh
npx shopify doc search --query "locale-aware cart Ajax URLs"
npx shopify doc fetch --url https://shopify.dev/docs/api/ajax/reference/cart
```

Use `doc search` to discover the correct current page and `doc fetch` when full context is needed. Add durable conclusions and links to `docs/shopify-reference.md`; do not commit verbatim copies of entire Shopify manuals.

## Ananotes browser annotations

Ananotes is Sandro's own fork of onUI and is the active storefront annotation tool as of 2026-09-06. Its controls live in the browser-extension toolbar popup. It requires no theme-code integration. The local source is `/Users/sandrohagen/Github/v2-ananotes`; consult that repository's `docs/ananotes-installation.md` for extension installation and data migration. The original onUI extension is no longer the project review tool.

Use Ananotes comments as visual feedback tied to the annotated page and element. Inspect the annotation and page context before implementing a fix; follow the design system and owning section contract. Use the actual review browser: an isolated automated browser does not automatically share its extension or annotations.

### Local MCP bridge

The current fork deliberately retains `com.onui.native`, `onui_*` MCP tool names and the existing native-store format for compatibility. These identifiers do not mean that the upstream extension is still in use. Do not rename them in storefront configuration or delete their data directories.

This Mac's configured bridge:

- Codex server: `ananotes-local` in `~/.codex/config.toml`, replacing `onui-local`.
- Command: `/Users/sandrohagen/.nvm/versions/node/v22.12.0/bin/node`.
- Arguments: `/Users/sandrohagen/Github/v2-ananotes/packages/mcp-server/dist/bin/onui-cli.js`, `mcp`.
- Chrome native manifest: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.onui.native.json`.
- Allowed origin: `chrome-extension://fekpkhffbdkifpfaokhijlcfbiplnpkj/` (Ananotes only).
- Native wrapper: `~/Library/Application Support/Ananotes/runtime/ananotes-native-host.sh`, executing the same fork CLI with `native-host`.
- Compatible annotation store: `~/Library/Application Support/onui/store.v1.json`. Existing data was preserved, not relabeled as newly synced Ananotes feedback.

Configuration and store backups were saved outside this repository under `~/Library/Application Support/Ananotes/backups/20260906-122218/`. No annotation data, browser state or machine-specific configuration is committed to the theme. Other clients and browsers were not reconfigured.

Verification on 2026-09-06: the registered native host completed a protocol roundtrip; the fork's MCP runtime started and exposed eight tools; `codex mcp get ananotes-local` confirmed the fork command. Browser-to-store synchronization of a new Ananotes note still needs to be observed after reconnecting the extension. An existing note in the shared store alone is not proof of that sync.

After changing the registration, reopen Ananotes and reconnect its bridge (reload the extension if it retains an old connection), then start a fresh Codex session to discover `ananotes-local`. Read pages with `onui_list_pages` and retrieve notes with `onui_get_annotations` using the exact returned URL. Check a newly created Ananotes note to verify end-to-end sync.

If connection fails, check the installed extension ID against `allowed_origins`, the fork build and Node paths, and the wrapper's executable permission. Rebuilding or moving the fork or upgrading Node may require updating both commands. Avoid blindly running the inherited `setup:mcp`: it reinstalls upstream origins and the old client registration name. Its full doctor also expects upstream registrations; use targeted runtime/roundtrip checks and inspect the Ananotes origin directly.

Codex supports user-level and trusted project-level MCP configuration; see the [official MCP configuration documentation](https://developers.openai.com/codex/mcp). This machine uses the user-level entry, so do not add a duplicate project server.

[Annotation history](annotation-history.md) preserves approved feedback and its archival/removal workflow. Keep original tool provenance in historical records. Delete annotations only when explicitly approved and archived; switching tools is not authorization to delete notes.

## Figma production-component typography

The `Components - Production` page in the Sparklys Figma file mirrors the live section library. Keep editable text mapped to the same native font family and style pairs as the theme:

- Maison Neue / DemiBold for body copy and standard UI;
- Maison Neue / Bold for emphasized UI;
- Newake / Regular for general and Hard Seltzer display headings;
- Erode / Bold for Soda display headings.

Figma's remote automation runtime cannot access fonts installed only on the local Mac. Use a temporary local Figma development plugin when a generated component library must be remapped to locally installed licensed fonts. The plugin must discover the exact names with `figma.listAvailableFontsAsync()`, load every target with `figma.loadFontAsync()`, and then update each text range. Do not upload or redistribute licensed font files unless the license and destination have been explicitly approved.

Figma Desktop can retain its previous glyph raster even after the inspector shows the corrected family and style. Selecting a text node or toggling its opacity is insufficient to invalidate this cache. Force a real text-layout pass for each affected node by loading all fonts used by that node, inserting a zero-width space (`U+200B`) at the end, yielding briefly, and deleting it again. This preserves the original characters and range styling while reproducing the refresh caused by entering text-edit mode. Verify both the inspector assignment and the visible canvas before considering the typography synchronized.

## Preview workflow

`shopify theme dev` creates or updates a temporary remote development theme. This is a Shopify write and requires explicit approval.

After approval:

```sh
npm run dev
```

On macOS, `npm run dev` starts an idempotent user `launchd` service at `http://127.0.0.1:9292/`. It returns control to the terminal while the preview continues running. The service survives terminal/app closure, restarts after process exits (with a 30-second throttle), and starts again at login until explicitly stopped. It targets only the store's development theme at `sparklys-hard-seltzer.myshopify.com`. Shopify remains responsible for the remote development theme's lifetime.

| Command | Behavior |
| --- | --- |
| `npm run dev` | Start the background service; an already loaded service is not duplicated. |
| `npm run dev:status` | Show service state/PID and probe the local HTTP endpoint. |
| `npm run dev:logs` | Follow the last 80 log lines; Ctrl-C stops following, not the preview. |
| `npm run dev:restart` | Stop and reload the service, including updated Node/repository paths. |
| `npm run dev:stop` | Stop the service and remove its login startup registration. |
| `npm run dev:foreground` | Original terminal-bound Shopify CLI, for interactive troubleshooting or other operating systems. Stop the background service first. |

The manager is `scripts/dev-preview.mjs`; the supervised worker is `scripts/dev-preview-worker.mjs`. The generated service lives at `~/Library/LaunchAgents/ch.sparklys.theme-preview.plist`, and logs at `~/Library/Logs/Sparklys/theme-preview.log`. Neither is stored in Git. The service records the current absolute Node and repository paths; after moving the checkout or replacing the Node installation, run `npm run dev:restart` using the new environment. It binds only to loopback and refuses to replace an unrelated process on port 9292. The registered service continues syncing local changes to the development theme until stopped.

The Mac must be awake, logged in, online and authenticated with Shopify. A local preview cannot serve requests while the laptop sleeps or is shut down. `launchd` provides process supervision, not immunity to network, authentication, Shopify or rendering errors. See [Apple's launchd guide](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html).

### Why the preview went down on 2026-09-06

No process was listening on port 9292, and no Shopify development process remained. The earlier foreground command had no supervisor; the exact event that ended it was not recorded. Restarting then aborted because Shopify CLI 4.6.1 detected JSON checksum conflicts. The locale differences were the newly implemented cart UI. For `config/settings_data.json`, even a fresh pull was byte-identical to the local file, but the CLI still reported a checksum conflict on the next startup. Blanket restart attempts with `--reconciliation-strategy=abort` therefore could not restore service.

The cart translations were deliberately reconciled into the development theme. On every supervised startup, the worker now downloads development-theme JSON into a temporary directory and compares actual parsed contents, ignoring only leading generated comments, whitespace and object-key order. Only when every JSON document matches does it permit `keep-local` to normalize Shopify checksum/format differences for that startup. Temporary downloads are removed afterward. It never blindly uses `keep-local` for real content differences.

Theme Editor synchronization remains enabled: editor changes flow into local JSON while the preview is running, and local edits hot reload. Restart preflight protects changes made while the preview was stopped. A true mismatch, missing/extra JSON file, invalid JSON, empty download or authentication failure keeps the preview unavailable with a diagnostic in the log. The supervisor retries; it does not overwrite that conflict.

### Verification on 2026-09-06

Verified generated plist syntax, successful detached startup, idempotent repeated start, stop/restart, and automatic recovery after deliberately terminating the supervised Shopify child with SIGKILL. The worker PID changed from 98888 to 99170, and both `/` and `/cart` returned HTTP 200 afterward without a manual restart. Theme Check, asset/typography checks, JavaScript syntax and whitespace checks passed. Login/reboot and sleep/wake were not simulated; their lifecycle follows the per-user launch agent behavior described above.

### Recovering from a genuine sync conflict

1. Run `npm run dev:logs` and identify the differing file paths, then `npm run dev:stop` to suspend retries.
2. Pull the development theme's affected files into a separate temporary directory using `shopify theme pull --development --store sparklys-hard-seltzer.myshopify.com --path <temporary-directory> --only <file>`. Do not pull over the working checkout.
3. Compare and merge the intended local implementation with merchant editor changes. Preserve both versions until the reconciliation is reviewed. Never resolve this by targeting the live theme.
4. If local JSON deliberately needs uploading, run `npm run dev:foreground -- --reconciliation-strategy=keep-local` only after reviewing all JSON differences. Stop the foreground process after synchronization, then run `npm run dev` again. If the remote version wins, copy the reviewed remote content locally before starting.
5. Confirm `npm run dev:status` reports HTTP 200. Check logs for startup/upload errors if it does not.

For a first checkout with no existing development theme, authenticate and initialize with the approved foreground workflow, then start the supervised service. The worker deliberately refuses an empty preflight download. Do not embed passwords or tokens in the service plist or scripts.

Do not use the embedded Theme Editor canvas as the final reference for high-frequency visual effects. Shopify renders that preview inside a potentially scaled iframe, and its inspector adds translucent hover and selection layers. Resampling and overlays can make the global grain—especially with `mix-blend-mode: overlay`—look softer than it does on the storefront. Disable the preview inspector and open the editor's standalone Preview for a closer comparison; use `http://127.0.0.1:9292/` at native browser scale as the local visual-QA reference.

Before previewing, confirm the authenticated store with:

```sh
npx shopify theme info
```

Always target the store's permanent `.myshopify.com` domain, not its public custom domain or a guessed Shopify hostname. If normal browser authentication succeeds but the CLI reports that the account is not authorized for the provided store, verify the hostname first. For this project, the permanent domain is `sparklys-hard-seltzer.myshopify.com`.

## Remote safety levels

| Action | Default authorization |
| --- | --- |
| `npm run check`, local file inspection | Allowed |
| `shopify theme info` | Read-only, but may trigger authentication |
| `shopify theme dev` | Requires explicit approval because it updates a development theme |
| `shopify theme push` to an unpublished theme | Requires explicit approval and exact target confirmation |
| Publish, delete, overwrite live settings, add credentials | Requires explicit approval and exact target confirmation |

Never put passwords or tokens on a command line that will be committed or documented. Use Shopify-supported authentication and secret storage.

## Implementation loop

1. Read the product, architecture, and development docs.
2. Find the existing section, template, or primitive that owns the behavior. For section work, read its file in [Section reference](sections/README.md).
3. Verify current Shopify platform requirements for unfamiliar or unstable behavior.
4. For entity-like content, implement the applicable Schema.org vocabulary as server-rendered JSON-LD and validate the rendered data against the visible content. Document an explicit exception when no honest mapping exists.
5. Implement the narrowest durable change.
6. Run local quality gates.
7. With approved store access, verify the theme editor and storefront using real data.
8. Test phone and desktop layouts, keyboard navigation, reduced motion, and no-JavaScript fallback where relevant.
9. Update the owning section reference plus capability status or architecture decisions when their contract changes.

## Git and delivery

- Keep commits focused and written in English.
- Do not commit secrets, `.env` files, Shopify auth data, or generated preview artifacts.
- CI runs `npm run check` (Theme Check, asset budgets, and typography checks) on pushes to `main` and pull requests. JavaScript syntax, JSON parsing, and whitespace checks remain separate local handoff gates.
- Lighthouse CI should be added only after a dedicated development store and repository secrets are approved. Shopify's action uploads theme code and needs `read_products` and `write_themes`; see [Shopify Lighthouse CI](https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci).


## Shared editorial theme — 2026-09-07

Colleagues edit the permanent unpublished **website/main** theme, ID `199388037507`, on `sparklys-hard-seltzer.myshopify.com`. Do not use the temporary development theme (`199384498563`) for shared editorial work. Local preview continues targeting the separate development theme.

Use `npm run deploy:plan` to download a backup and prepare a code manifest without uploading. After explicit deployment authorization, use `npm run deploy:team`. The wrapper pins the shared theme ID, checks its role is unpublished before and after upload, clears inherited Shopify flag overrides, and never passes publish or allow-live flags. Backups and staged files live outside Git under `~/Library/Application Support/Sparklys/theme-backups/<timestamp>/`.

The deployment uploads only assets, Liquid layouts/sections/snippets/blocks and `config/settings_schema.json`, plus additive locale keys. It excludes **all templates**, `config/settings_data.json`, and section-group JSON. `--nodelete` preserves remote-only files. Shopify is authoritative for editor content, template composition, app embeds and saved design settings; local copies are development fixtures, not deployment sources. Products, collections, pages, metafields and metaobjects are store data and are not uploaded by this command.

The existing shared theme has German-default locale filenames. Preserve that setup during code deployment; locale/default-language migration is a separate reviewed task. Locale handling adds missing local keys to the matching remote language file while retaining every existing remote value and filename. Existing wording changes are deliberately not shipped automatically. A second pull detects changes before the locale upload; Shopify does not provide an atomic compare-and-swap here, so avoid concurrent translation edits during deployment. Theme Editor template/content work remains safe from this command because its files are never uploaded.

New local templates and migrations to saved settings must be handled separately: pull current remote files into a temporary folder, review the exact difference with the editor, merge only the intended addition, and upload only those approved files during a short editing pause. Never copy the whole local settings/templates folder over Shopify. Adding schema options is code work, but renaming/removing section types, block types, or setting IDs can invalidate existing content even when JSON is excluded; preserve those identifiers and review migrations explicitly.

Before changing code around colleagues' layouts, pull their current JSON into a temporary folder and reconcile it into local development intentionally. Do not aim the automatic localhost watcher at the shared theme. Do not use an unfiltered `theme push` or a blanket `keep-local` reconciliation on the shared theme.

The theme name `website/main` resembles a GitHub-connected theme. Verify the Shopify GitHub integration before pushing Git branches: this wrapper cannot protect content from an independent GitHub deployment. Keep editorial JSON changes synchronized on any connected branch, or use a separate deployment branch/workflow. This CLI deployment does not push Git or publish the theme.


### Initial baseline and subsequent GitHub releases

The merchant explicitly authorized the first 2026-09-07 upload to include all local content, templates, locale setup and saved settings. This is a one-time baseline exception, not permission for future content replacement. GitHub integration deploys the connected branch into the existing unpublished theme; it does not publish it.

After the baseline, install the repository push guard with `git config core.hooksPath .githooks` (required on each developer checkout). The pre-push hook blocks non-fast-forward pushes and differences to `config/settings_data.json`, all templates, section-group JSON and locales on the shared main branch. It compares against the server's current commit, so fetch/merge is required when colleagues have saved changes. Normal releases must keep protected files identical to that latest remote commit. Intentional new templates, translations and settings migrations require separate explicit review; do not bypass the hook for routine deployment. Local hooks can be bypassed and are not a substitute for GitHub branch protection; branch protection has not been configured by this change.

Shopify Theme Editor and code-editor saves are automatically committed by the GitHub integration. Store-level products, pages, collections, files, metafields and metaobjects are not versioned as theme JSON. Keep the development watcher isolated. Code changes must preserve setting/section/block IDs so retained content remains renderable.

For future releases: fetch origin; merge editor commits; review code against current shared content; restore shared editorial files to the latest origin/main versions in a separate release worktree if local development fixtures differ; run checks; push normally. Never force-push. The content-preserving CLI wrapper is available for explicitly approved code-only theme updates, but GitHub is the normal versioned delivery route.

Baseline delivery completed on 2026-09-07: GitHub main received commit `1d501ba`; because automatic theme synchronization was not yet visible, the explicitly authorized full baseline was also uploaded directly to theme `199388037507`. Shopify returned role `unpublished`. Saved settings and cart shipping code were pulled back and verified against local files. The one-time content-overwrite exception is exhausted. Future releases follow the protected-content rule above.
