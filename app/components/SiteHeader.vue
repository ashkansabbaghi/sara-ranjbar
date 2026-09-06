<script setup lang="ts">
const { instagramUrl, hasInstagram, buildWhatsAppUrl, defaultConsultMessage, hasWhatsApp } =
  useContact()

const links = [
  { href: '#about', label: 'درباره' },
  { href: '#packages', label: 'پکیج‌ها' },
  { href: '#gallery', label: 'گالری' },
  { href: '#contact', label: 'تماس' },
]

const open = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-sand/80 bg-cream/90 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <a href="#" class="group flex flex-col leading-tight">
        <span class="text-sm font-semibold tracking-wide text-ink">سارا رنجبر</span>
        <span class="text-[11px] text-ink-muted">آرایش صورت · کرج</span>
      </a>

      <nav class="hidden items-center gap-6 md:flex" aria-label="منوی اصلی">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-sm text-ink-muted transition hover:text-ink"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <a
          v-if="hasInstagram"
          :href="instagramUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full px-3 py-1.5 text-sm text-ink-muted transition hover:bg-sand hover:text-ink"
        >
          اینستاگرام
        </a>
        <a
          :href="hasWhatsApp ? buildWhatsAppUrl(defaultConsultMessage) : '#contact'"
          :target="hasWhatsApp ? '_blank' : undefined"
          :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
          class="rounded-full bg-ink px-4 py-2 text-sm text-cream transition hover:bg-accent"
        >
          گفت‌وگو در واتساپ
        </a>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg p-2 text-ink md:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        @click="open = !open"
      >
        <span class="sr-only">منو</span>
        <svg v-if="!open" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-width="1.5" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <div
      v-show="open"
      id="mobile-nav"
      class="border-t border-sand bg-cream px-4 py-3 md:hidden"
    >
      <nav class="flex flex-col gap-2" aria-label="منوی موبایل">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-sand"
          @click="open = false"
        >
          {{ link.label }}
        </a>
      </nav>
    </div>
  </header>
</template>
