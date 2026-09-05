<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'fa', dir: 'rtl' },
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
      <BookingSection />
    </main>
    <SiteFooter />
    <StickyMobileCta />
  </div>
</template>
