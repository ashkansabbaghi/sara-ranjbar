<script setup lang="ts">
const { highlights } = useSiteContent().page
</script>

<template>
  <section v-if="highlights.length" class="border-y border-sand bg-white-soft/60" aria-label="اعتماد">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <ul class="flex flex-col gap-3 text-center text-sm text-ink sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-2 sm:text-base">
        <template v-for="(item, i) in highlights" :key="i">
          <li v-if="i > 0" class="hidden text-stone-soft sm:inline" aria-hidden="true">·</li>
          <li class="font-medium">{{ item }}</li>
        </template>
      </ul>
    </div>
  </section>
</template>
