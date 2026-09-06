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
    id: 'companion',
    title: 'میکاپ همراه',
    price: '۵ میلیون تومان',
    description: 'آرایش صورت برای همراهان — تمیز، هماهنگ و مناسب مراسم.',
  },
  {
    id: 'companionVip',
    title: 'میکاپ همراه VIP',
    price: '۶ میلیون تومان',
    description: 'نسخه VIP همراه با ماندگاری و جزئیات بیشتر.',
  },
  {
    id: 'bridalVip',
    title: 'میکاپ عروس VIP',
    price: '۱۳ میلیون تومان',
    description: 'عروس VIP با رویکرد پوست‌محور و camera-ready.',
  },
  {
    id: 'bridalCip',
    title: 'میکاپ عروس CIP',
    price: '۱۵ میلیون تومان',
    description: 'بالاترین سطح خدمات عروس — ماندگار و کامل.',
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
          قیمت‌های اعلام‌شده برای هر پکیج. جزئیات نهایی در مشاوره کوتاه هماهنگ می‌شود.
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
        ایاب‌وذهاب، مژه پریمیوم، کیت تاچ‌آپ و آموزش کوتاه بازتولید — با هماهنگی هنگام مشاوره.
      </p>
    </div>
  </section>
</template>
