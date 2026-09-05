<script setup lang="ts">
const quotes = [
  {
    text: 'آرایشش دقیقاً همون چیزیه که می‌خواستم: تمیز، طبیعی و بدون اغراق.',
    name: 'ن.م — کرج',
  },
  {
    text: 'برای ایونت نرم و شیک بود؛ تا آخر شب فرم صورتم حفظ شد.',
    name: 'آ.ر — تهران (با هماهنگی)',
  },
  {
    text: 'عروس مینیمال دقیقاً استایل منه. حس می‌کردم خودمم، فقط مرتب‌تر.',
    name: 'س.ک — کرج',
  },
]
</script>

<template>
  <section class="border-y border-sand bg-white-soft/50" aria-label="نظرات">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.18em] text-accent">نظرات</p>
        <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">از زبان مراجعین (نمونه)</h2>
        <p class="mt-3 text-sm leading-7 text-ink-muted">
          متن‌های زیر جای‌نگهدارند و با نظرات واقعی جایگزین می‌شوند.
        </p>
      </div>

      <div class="mt-10 grid gap-4 md:grid-cols-3">
        <blockquote
          v-for="(q, i) in quotes"
          :key="i"
          class="flex flex-col rounded-3xl border border-stone-soft/60 bg-cream p-6"
        >
          <p class="flex-1 text-sm leading-8 text-ink-muted">«{{ q.text }}»</p>
          <footer class="mt-5 text-xs font-medium text-ink">{{ q.name }}</footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>
