<script setup lang="ts">
const { buildWhatsAppUrl, hasWhatsApp } = useContact()

const packages = useSiteContent().page.packages

function packageWhatsAppUrl(title: string) {
  return buildWhatsAppUrl(
    `سلام سارا، درباره پکیج «${title}» پیام می‌دم.`,
  )
}
</script>

<template>
  <section v-if="packages.items.length" id="packages" class="scroll-mt-24 border-y border-sand bg-white-soft/50">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.18em] text-accent">پکیج‌ها</p>
        <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">{{ packages.title }}</h2>
        <p v-if="packages.intro" class="mt-3 text-sm leading-7 text-ink-muted">{{ packages.intro }}</p>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(pkg, i) in packages.items"
          :key="i"
          class="flex flex-col rounded-3xl border border-stone-soft/70 bg-cream p-5 shadow-sm transition hover:border-accent-soft"
        >
          <h3 class="text-lg font-semibold text-ink">{{ pkg.title }}</h3>
          <p class="mt-2 text-sm font-medium text-accent">{{ pkg.price }}</p>
          <p class="mt-3 flex-1 text-sm leading-7 text-ink-muted">{{ pkg.description }}</p>
          <a
            :href="hasWhatsApp ? packageWhatsAppUrl(pkg.title) : '#contact'"
            :target="hasWhatsApp ? '_blank' : undefined"
            :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
            class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm text-cream transition hover:bg-accent"
          >
            گفت‌وگو در واتساپ
          </a>
        </article>
      </div>

      <p v-if="packages.extras" class="mt-8 text-sm leading-7 text-ink-muted">
        <span class="font-medium text-ink">افزودنی‌ها:</span>
        {{ packages.extras }}
      </p>
    </div>
  </section>
</template>
