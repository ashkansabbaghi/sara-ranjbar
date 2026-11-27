// Keep the keys in sync with CATEGORIES in scripts/prepare-content.mjs
export const GALLERY_CATEGORIES = ['bride', 'companion', 'event', 'detail'] as const

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  bride: 'عروس',
  companion: 'همراه',
  event: 'ایونت',
  detail: 'جزئیات',
}

/** Prefix a root-relative public path ("/uploads/x.webp") with the app baseURL. */
export function withBase(path: string) {
  const base = useRuntimeConfig().app.baseURL || '/'
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')
}
