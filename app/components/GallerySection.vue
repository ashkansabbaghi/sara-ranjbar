<script setup lang="ts">
const items = [
  { caption: 'میکاپ همراه — تمیز و هماهنگ' },
  { caption: 'میکاپ همراه VIP — ماندگارتر' },
  { caption: 'عروس VIP / CIP — پوست‌محور' },
  { caption: 'جزئیات چشم — بدون شلوغی' },
  { caption: 'گلای پوست — قبل از فینیش' },
  { caption: 'نمای نزدیک — لب و گونه' },
]
</script>

<template>
  <section id="gallery" class="scroll-mt-24">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.18em] text-accent">گالری</p>
        <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">نمونه‌کارها (جای‌نگهدار)</h2>
        <p class="mt-3 text-sm leading-7 text-ink-muted">
          تصاویر واقعی به‌زودی جایگزین می‌شوند. فعلاً قاب‌های مینیمال با کپشن سبک کار.
        </p>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <figure
          v-for="(item, i) in items"
          :key="i"
          class="group overflow-hidden rounded-3xl border border-stone-soft/60 bg-sand"
        >
          <div class="relative aspect-[4/5] bg-gradient-to-br from-sand via-cream to-stone-soft/40">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs tracking-wide text-ink-muted/70">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
          </div>
          <figcaption class="border-t border-stone-soft/40 bg-cream/80 px-4 py-3 text-sm text-ink-muted">
            {{ item.caption }}
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
