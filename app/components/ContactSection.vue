<script setup lang="ts">
const {
  buildWhatsAppUrl,
  defaultConsultMessage,
  hasWhatsApp,
  hasInstagram,
  instagramUrl,
  hasPhone,
  phoneUrl,
  hasTelegram,
  telegramUrl,
} = useContact()
const contact = useSiteContent().page.contact

const secondary =
  'inline-flex items-center justify-center rounded-full border border-stone-soft bg-white-soft px-6 py-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent'
</script>

<template>
  <section id="contact" class="scroll-mt-24">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-xs font-medium tracking-[0.18em] text-accent">تماس</p>
        <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">{{ contact.title }}</h2>
        <p class="mt-4 text-sm leading-8 text-ink-muted">{{ contact.intro }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            :href="hasWhatsApp ? buildWhatsAppUrl(defaultConsultMessage) : '#contact'"
            :target="hasWhatsApp ? '_blank' : undefined"
            :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
            class="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:bg-accent"
          >
            گفت‌وگو در واتساپ
          </a>
          <a v-if="hasPhone" :href="phoneUrl" :class="secondary">تماس تلفنی</a>
          <a
            v-if="hasTelegram"
            :href="telegramUrl"
            target="_blank"
            rel="noopener noreferrer"
            :class="secondary"
          >
            تلگرام
          </a>
          <a
            v-if="hasInstagram"
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            :class="secondary"
          >
            اینستاگرام
          </a>
        </div>
        <p v-if="!hasWhatsApp" class="mt-4 text-xs text-ink-muted">
          لینک واتساپ از طریق متغیر محیطی تنظیم می‌شود (فعلاً خالی است).
        </p>
      </div>
    </div>
  </section>
</template>
