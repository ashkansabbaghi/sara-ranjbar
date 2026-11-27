<script setup lang="ts">
const config = useRuntimeConfig().public
const { heroImage, ogImage, page } = useSiteContent()
const { seo } = page
const { instagramUrl, hasInstagram, hasPhone, phoneUrl } = useContact()

const pageUrl = `${config.siteUrl}/`
// Absolute URL for files under public/: siteUrl already includes the base path.
const absolute = (path: string) => `${config.siteUrl}${path}`

useSeoMeta({
  title: seo.title,
  description: seo.description,
  ogTitle: seo.title,
  ogDescription: seo.description,
  ogType: 'website',
  ogLocale: 'fa_IR',
  ogSiteName: 'سارا رنجبر',
  ogUrl: pageUrl,
  ogImage: ogImage ? absolute(ogImage.src) : undefined,
  ogImageWidth: ogImage?.width,
  ogImageHeight: ogImage?.height,
  twitterCard: ogImage ? 'summary_large_image' : 'summary',
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'سارا رنجبر',
  description: seo.description,
  url: pageUrl,
  ...(heroImage ? { image: absolute(heroImage.src) } : {}),
  ...(hasPhone.value ? { telephone: phoneUrl.value.replace(/^tel:/, '') } : {}),
  areaServed: { '@type': 'City', name: 'کرج' },
  address: { '@type': 'PostalAddress', addressLocality: 'کرج', addressCountry: 'IR' },
  ...(seo.priceRange ? { priceRange: seo.priceRange } : {}),
  ...(hasInstagram.value ? { sameAs: [instagramUrl.value] } : {}),
}

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      // Escape "<" so no value can close the script tag.
      innerHTML: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-cream text-ink font-sans">
    <SiteHeader />
    <main>
      <HeroSection />
      <TrustBar />
      <AboutSection />
      <PackagesSection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
    </main>
    <SiteFooter />
    <StickyMobileCta />
  </div>
</template>
