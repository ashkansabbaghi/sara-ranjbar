<script setup lang="ts">
const { instagramUrl, hasInstagram, buildWhatsAppUrl, defaultConsultMessage, hasWhatsApp } =
  useContact()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-sand bg-white-soft/70 pb-24 md:pb-10">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
      <div>
        <p class="text-sm font-semibold text-ink">سارا رنجبر</p>
        <p class="mt-2 max-w-sm text-sm leading-7 text-ink-muted">
          آرایش صورت مینیمال و مدرن در کرج. پوست تمیز، فرم طبیعی، بدون شلوغی.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <a
          href="#booking"
          class="rounded-full bg-ink px-4 py-2 text-sm text-cream transition hover:bg-accent"
        >
          رزرو مشاوره
        </a>
        <a
          :href="hasWhatsApp ? buildWhatsAppUrl(defaultConsultMessage) : '#booking'"
          :target="hasWhatsApp ? '_blank' : undefined"
          :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
          class="rounded-full border border-stone-soft px-4 py-2 text-sm text-ink transition hover:border-accent"
        >
          واتساپ
        </a>
        <a
          v-if="hasInstagram"
          :href="instagramUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full border border-stone-soft px-4 py-2 text-sm text-ink transition hover:border-accent"
        >
          اینستاگرام
        </a>
      </div>
    </div>
    <div class="mx-auto max-w-6xl border-t border-sand px-4 py-6 text-xs text-ink-muted sm:px-6">
      © {{ year }} سارا رنجبر · قیمت‌ها نیاز به تأیید دارند · شماره تماس واقعی در env تنظیم شود
    </div>
  </footer>
</template>
