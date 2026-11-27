# sara-ranjbar-content

Photos and page texts for the site. Written by the `/studio` panel; do not edit by hand
unless you know the format checked by `scripts/prepare-content.mjs` and
`shared/page-content.mjs` in the site repo.

- `gallery.json`: `{ items: [{ id, file, category, caption? }] }`, category is one of
  `bride`, `companion`, `event`, `detail`
- `site.json`: `{ heroImage, portraitImage }` (file names in `uploads/`, or empty)
- `page.json` (created by the first save in the panel's texts tab): hero, highlights, about,
  packages, testimonials, contact, footer and SEO texts. Missing fields use the site's defaults.
- `uploads/`: `.webp` or `.jpg` files named `[a-z0-9-].webp|jpg`

Each push runs `notify-site.yml`, which starts the site deploy.
