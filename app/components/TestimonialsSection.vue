<script setup lang="ts">
// Edited in the /studio panel (real, permitted quotes only). Hidden while the list is empty.
const quotes = useSiteContent().page.testimonials
</script>

<template>
  <section v-if="quotes.length" class="border-y border-sand bg-white-soft/50" aria-label="نظرات">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.18em] text-accent">نظرات</p>
        <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">از زبان مراجعین</h2>
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
