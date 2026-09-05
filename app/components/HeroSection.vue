<script setup lang="ts">
const { buildWhatsAppUrl, defaultConsultMessage, hasWhatsApp } = useContact()
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#ebe6df_0%,_transparent_55%)]" />
    <div class="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-28">
      <div class="lg:col-span-7">
        <p class="mb-4 text-xs font-medium tracking-[0.2em] text-accent sm:text-sm">
          سارا رنجبر · کرج
        </p>
        <h1 class="text-3xl font-semibold leading-snug text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          آرایش صورت، مینیمال و مدرن — در کرج
        </h1>
        <p class="mt-5 max-w-xl text-base leading-8 text-ink-muted sm:text-lg">
          پوست تمیز، فرم طبیعی، بدون شلوغی. برای روز، ایونت، و عروس.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a
            href="#booking"
            class="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:bg-accent"
          >
            رزرو مشاوره
          </a>
          <a
            :href="hasWhatsApp ? buildWhatsAppUrl(defaultConsultMessage) : '#booking'"
            :target="hasWhatsApp ? '_blank' : undefined"
            :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
            class="inline-flex items-center justify-center rounded-full border border-stone-soft bg-white-soft px-6 py-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
          >
            گفت‌وگو در واتساپ
          </a>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand shadow-sm ring-1 ring-stone-soft/60">
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div class="h-20 w-20 rounded-full border border-accent-soft/60 bg-cream/80" />
            <p class="text-sm text-ink-muted">فضای بصری مینیمال</p>
            <p class="text-xs text-ink-muted/80">جای تصویر پرتره / نمونه کار</p>
          </div>
          <div class="absolute bottom-4 start-4 end-4 rounded-2xl bg-cream/90 px-4 py-3 backdrop-blur">
            <p class="text-xs text-ink-muted">تمیز · طبیعی · بدون شلوغی</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
