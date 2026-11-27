// Written by scripts/prepare-content.mjs (runs before dev/build/generate).
import content from '~/data/content.generated.json'
import type { GalleryCategory } from '~/utils/gallery'
import type { PageContent } from '#shared/page-content.mjs'

export type { PageContent }

export interface SiteImage {
  src: string
  width: number
  height: number
}

export interface GalleryImage extends SiteImage {
  id: string
  category: GalleryCategory
  caption: string
}

export interface SiteContent {
  gallery: GalleryImage[]
  heroImage: SiteImage | null
  portraitImage: SiteImage | null
  ogImage: SiteImage | null
  page: PageContent
}

export function useSiteContent() {
  return content as SiteContent
}
