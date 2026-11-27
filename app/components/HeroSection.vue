<script setup lang="ts">
const {
  buildWhatsAppUrl,
  defaultConsultMessage,
  hasWhatsApp,
  hasInstagram,
  instagramUrl,
  hasPhone,
  phoneUrl,
} = useContact()
const { heroImage, page } = useSiteContent()
const hero = page.hero
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#ebe6df_0%,_transparent_55%)]" />
    <div class="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-28">
      <div class="lg:col-span-7">
        <p class="mb-4 text-xs font-medium tracking-[0.2em] text-accent sm:text-sm">
          {{ hero.eyebrow }}
        </p>
        <h1 class="text-3xl font-semibold leading-snug text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {{ hero.title }}
        </h1>
        <p class="mt-5 max-w-xl text-base leading-8 text-ink-muted sm:text-lg">
          {{ hero.subtitle }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a
            :href="hasWhatsApp ? buildWhatsAppUrl(defaultConsultMessage) : '#contact'"
            :target="hasWhatsApp ? '_blank' : undefined"
            :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
            class="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:bg-accent"
          >
            گفت‌وگو در واتساپ
          </a>
          <a
            v-if="hasPhone"
            :href="phoneUrl"
            class="inline-flex items-center justify-center rounded-full border border-stone-soft bg-white-soft px-6 py-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
          >
            تماس تلفنی
          </a>
          <a
            v-if="hasInstagram"
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-full border border-stone-soft bg-white-soft px-6 py-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
          >
            اینستاگرام
          </a>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand shadow-sm ring-1 ring-stone-soft/60">
          <NuxtImg
            v-if="heroImage"
            :src="heroImage.src"
            :width="heroImage.width"
            :height="heroImage.height"
            sizes="xs:100vw sm:100vw md:640px lg:480px"
            alt="نمونه‌کار میکاپ سارا رنجبر"
            preload
            loading="eager"
            fetchpriority="high"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div
            v-else
            class="absolute inset-0 bg-gradient-to-br from-sand via-cream to-stone-soft/50"
            aria-hidden="true"
          />
          <div v-if="hero.badge" class="absolute bottom-4 start-4 end-4 rounded-2xl bg-cream/90 px-4 py-3 backdrop-blur">
            <p class="text-xs text-ink-muted">{{ hero.badge }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
