# Sara Ranjbar / سارا رنجبر — Landing

Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS v4 + @nuxt/image (RTL fa), generated as a static
site on GitHub Pages: https://ashkansabbaghi.github.io/sara-ranjbar/

Photos, page texts, packages/prices and testimonials are edited in the `/studio` panel and stored in
a private content repo. Default texts (used until the panel first saves) are `PAGE_DEFAULTS` in
`shared/page-content.mjs`. Contact numbers and links are config, not panel content (see below).

## Run

```sh
npm ci
npm run content:pull   # optional: clone the private content repo into .content/
npm run dev            # predev builds content from .content/ (empty if missing)
npm run generate       # static build in .output/public
```

Copy `.env.example` to `.env` for local overrides. All values are public (they end up in the HTML).

## How content gets onto the site

```
/studio panel (phone) ──commit──▶ private repo sara-ranjbar-content
                                   └─ notify-site.yml ──workflow_dispatch──▶ this repo
                                                         deploy-pages.yml:
                                                         checkout content → validate → re-encode → generate → Pages
```

- `/studio` is a Persian admin panel (not linked, `noindex`) with two tabs: photos, and texts/prices.
  It signs in with a fine-grained token that can only write to the content repo, so it can never
  change site code. Every action is one commit; history is the undo button.
- Photos are resized and re-encoded in the browser before upload, which strips EXIF/GPS.
- `scripts/prepare-content.mjs` runs before every dev/build/generate. It rejects unknown keys,
  bad file names, non-images, symlinks and oversized files, then re-encodes every referenced
  image with sharp into `public/uploads/` and writes `app/data/content.generated.json`.
  A failing check fails the build, so the last good deploy stays live.
- Page images (hero, portrait) are `site.json`; gallery order and categories are `gallery.json`;
  texts, packages, testimonials and SEO title/description are `page.json`.
- `page.json` is checked by `shared/page-content.mjs`, used by both the build and the panel, so the
  panel refuses what the build would refuse. Missing fields fall back to `PAGE_DEFAULTS`. Texts are
  plain text only: `<`, `>`, control/bidi characters, links, `@handles` and phone numbers are
  rejected, so a stolen token can't point customers to another number or page.
- WhatsApp, phone, Instagram and Telegram stay in `deploy-pages.yml` env on purpose: changing where
  customers send messages needs a commit to this repo, not just a panel token.

Content repo template: `content-template/`.

## One-time setup (done by hand)

1. Create a **private** repo `ashkansabbaghi/sara-ranjbar-content` and push the files from
   `content-template/` to `main`.
2. Create three fine-grained tokens (GitHub → Settings → Developer settings → Fine-grained tokens):

   | Name | Repository access | Permissions | Where it goes |
   | --- | --- | --- | --- |
   | `SARA_PANEL` | only `sara-ranjbar-content` | Contents: Read and write | to Sara, for `/studio` |
   | `ADMIN_PANEL` (optional) | only `sara-ranjbar-content` | Contents: Read and write | yours, for `/studio` |
   | `SITE_DISPATCH_TOKEN` | only `sara-ranjbar` | Actions: Read and write | secret in the content repo |
   | `CONTENT_READ_TOKEN` | only `sara-ranjbar-content` | Contents: Read | secret in this repo |

   Give none of them the Workflows permission. Set the panel tokens to expire in 90 days. One token
   per person, so one can be revoked without locking the other out.
3. In both repos: Settings → Rules → add a branch ruleset for `main` that blocks force pushes and
   deletion, so history can always be restored.
4. Send Sara the `SARA_PANEL` token over a private channel, with `docs/studio-guide-fa.md`.

Until `CONTENT_READ_TOKEN` exists, the deploy still runs and the gallery section is hidden.

## If a token leaks or Sara's phone is lost

1. Revoke that panel token on GitHub (fine-grained tokens page). The panel stops working at once.
2. Check the content repo history; revert any unwanted commit (a revert triggers a redeploy).
3. Create a new token and send it to Sara.

Renew `SARA_PANEL` before it expires (every 90 days).

## Security notes

- CSP is added to every prerendered page as a `<meta>` tag (`config/csp.ts`): scripts only from
  the site itself plus hashes of Nuxt's inline scripts, `connect-src` limited to the GitHub API.
  GitHub Pages can't send headers, so HSTS and `frame-ancestors` wait for the custom domain + CDN.
- The site shares the `ashkansabbaghi.github.io` origin with other Pages sites, so the panel token
  lives in `sessionStorage` only (gone when the tab closes). This risk ends with the custom domain.
- Actions are pinned to commit SHAs and updated by Dependabot.

## Moving to a custom domain

1. Buy the domain (suggested: `sararanjbar.com`), point DNS to GitHub Pages and add it under
   Settings → Pages; enable "Enforce HTTPS".
2. Add `public/CNAME` with the domain.
3. In `deploy-pages.yml` set `NUXT_APP_BASE_URL: /` and `NUXT_PUBLIC_SITE_URL: https://<domain>`.
4. Optional: put the domain behind a CDN to add HSTS, `frame-ancestors` and other headers.
