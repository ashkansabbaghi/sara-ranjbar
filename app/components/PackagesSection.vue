<script setup lang="ts">
import type { PackageId } from '~/composables/useBooking'

const { selectPackage } = useBooking()

const packages: {
  id: Exclude<PackageId, ''>
  title: string
  price: string
  description: string
}[] = [
  {
    id: 'day',
    title: 'روز مینیمال',
    price: 'از ۱٫۵ میلیون',
    description: 'پوست تمیز، ابرو و گونه ملایم — مناسب روزمره و جلسات.',
  },
  {
    id: 'event',
    title: 'ایونت سافت',
    price: 'از ۳ میلیون',
    description: 'نرم و درخشان برای مهمانی و مناسبت‌های عصرانه.',
  },
  {
    id: 'bridal',
    title: 'عروس مینیمال',
    price: 'از ۶٫۵ میلیون',
    description: 'عروس سبک و مدرن با ماندگاری و فرم طبیعی.',
  },
  {
    id: 'companions',
    title: 'همراهان',
    price: 'از ۱٫۵ میلیون / نفر',
    description: 'هماهنگ با عروس یا ایونت، برای همراهان نزدیک.',
  },
]
</script>

<template>
  <section id="packages" class="scroll-mt-24 border-y border-sand bg-white-soft/50">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.18em] text-accent">پکیج‌ها</p>
        <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">انتخاب بر اساس مناسبت</h2>
        <p class="mt-3 text-sm leading-7 text-ink-muted">
          قیمت‌ها تقریبی‌اند و نیاز به تأیید نهایی دارند. با انتخاب هر کارت، فرم رزرو از پیش پر می‌شود.
        </p>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="pkg in packages"
          :key="pkg.id"
          class="flex flex-col rounded-3xl border border-stone-soft/70 bg-cream p-5 shadow-sm transition hover:border-accent-soft"
        >
          <h3 class="text-lg font-semibold text-ink">{{ pkg.title }}</h3>
          <p class="mt-2 text-sm font-medium text-accent">{{ pkg.price }}</p>
          <p class="mt-3 flex-1 text-sm leading-7 text-ink-muted">{{ pkg.description }}</p>
          <button
            type="button"
            class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm text-cream transition hover:bg-accent"
            @click="selectPackage(pkg.id)"
          >
            انتخاب و رزرو
          </button>
        </article>
      </div>

      <p class="mt-8 text-sm leading-7 text-ink-muted">
        <span class="font-medium text-ink">افزودنی‌ها:</span>
        اکستنشن مژه موقت، تثبیت بیشتر، و خدمات جانبی با هماهنگی — جزئیات هنگام مشاوره.
      </p>
    </div>
  </section>
</template>
