<script setup lang="ts">
const { portraitImage, page } = useSiteContent()
const about = page.about
</script>

<template>
  <section id="about" class="scroll-mt-24">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:py-24">
      <div class="lg:col-span-5">
        <div class="relative aspect-[5/6] overflow-hidden rounded-3xl bg-sand ring-1 ring-stone-soft/50">
          <NuxtImg
            v-if="portraitImage"
            :src="portraitImage.src"
            :width="portraitImage.width"
            :height="portraitImage.height"
            sizes="xs:100vw sm:100vw md:640px lg:440px"
            alt="سارا رنجبر"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div v-else class="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <div class="h-24 w-24 rounded-full bg-cream/90 ring-1 ring-accent-soft/40" aria-hidden="true" />
            <p class="mt-4 text-sm text-ink">سارا رنجبر</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center lg:col-span-7">
        <p class="text-xs font-medium tracking-[0.18em] text-accent">درباره سارا</p>
        <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">{{ about.title }}</h2>
        <div class="mt-6 space-y-4 text-base leading-8 text-ink-muted">
          <p v-for="(text, i) in about.paragraphs" :key="i">{{ text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
