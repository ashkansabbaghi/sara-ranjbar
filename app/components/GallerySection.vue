<script setup lang="ts">
const { gallery } = useSiteContent()

type Filter = 'all' | GalleryCategory
const filter = ref<Filter>('all')

const categories = computed(() =>
  GALLERY_CATEGORIES.filter((c) => gallery.some((item) => item.category === c)),
)
const visible = computed(() =>
  filter.value === 'all' ? gallery : gallery.filter((item) => item.category === filter.value),
)

const dialog = ref<HTMLDialogElement | null>(null)
const current = ref(0)
// Render the full-size image only while the dialog is open, so it isn't fetched on page load.
const isOpen = ref(false)
const active = computed(() => visible.value[current.value])

function open(index: number) {
  current.value = index
  isOpen.value = true
  dialog.value?.showModal()
}

function step(delta: number) {
  const count = visible.value.length
  current.value = (current.value + delta + count) % count
}

// RTL: the left arrow moves forward.
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') step(1)
  else if (e.key === 'ArrowRight') step(-1)
}

function altFor(item: GalleryImage) {
  return item.caption || `نمونه‌کار میکاپ ${CATEGORY_LABELS[item.category]}`
}
</script>

<template>
  <section v-if="gallery.length" id="gallery" class="scroll-mt-24">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.18em] text-accent">گالری</p>
        <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">نمونه‌کارها</h2>
      </div>

      <div
        v-if="categories.length > 1"
        class="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="فیلتر نمونه‌کارها"
      >
        <button
          v-for="key in (['all', ...categories] as Filter[])"
          :key="key"
          type="button"
          :aria-pressed="filter === key"
          class="rounded-full border px-4 py-1.5 text-sm transition"
          :class="filter === key
            ? 'border-ink bg-ink text-cream'
            : 'border-stone-soft bg-white-soft text-ink-muted hover:border-accent hover:text-ink'"
          @click="filter = key"
        >
          {{ key === 'all' ? 'همه' : CATEGORY_LABELS[key] }}
        </button>
      </div>

      <div class="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <figure
          v-for="(item, i) in visible"
          :key="item.id"
          class="group overflow-hidden rounded-3xl border border-stone-soft/60 bg-sand"
        >
          <button
            type="button"
            class="relative block aspect-[4/5] w-full overflow-hidden"
            :aria-label="`نمایش بزرگ: ${altFor(item)}`"
            @click="open(i)"
          >
            <NuxtImg
              :src="item.src"
              :width="item.width"
              :height="item.height"
              sizes="xs:50vw sm:50vw md:50vw lg:384px"
              :alt="altFor(item)"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </button>
          <figcaption
            class="border-t border-stone-soft/40 bg-cream/80 px-4 py-3 text-xs text-ink-muted sm:text-sm"
          >
            {{ item.caption || `میکاپ ${CATEGORY_LABELS[item.category]}` }}
          </figcaption>
        </figure>
      </div>
    </div>

    <dialog
      ref="dialog"
      class="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink/85"
      aria-label="نمایش بزرگ نمونه‌کار"
      @keydown="onKey"
      @click.self="dialog?.close()"
      @close="isOpen = false"
    >
      <div v-if="isOpen && active" class="flex max-h-[100dvh] w-[min(100vw,56rem)] flex-col items-center gap-3 p-4">
        <img
          :key="active.id"
          :src="withBase(active.src)"
          :width="active.width"
          :height="active.height"
          :alt="altFor(active)"
          class="max-h-[78dvh] w-auto rounded-2xl object-contain"
        >
        <p v-if="active.caption" class="text-center text-sm text-cream">{{ active.caption }}</p>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="rounded-full bg-cream/90 px-4 py-2 text-sm text-ink"
            @click="step(-1)"
          >
            قبلی
          </button>
          <span class="text-xs text-cream/80">
            {{ (current + 1).toLocaleString('fa-IR') }} / {{ visible.length.toLocaleString('fa-IR') }}
          </span>
          <button
            type="button"
            class="rounded-full bg-cream/90 px-4 py-2 text-sm text-ink"
            @click="step(1)"
          >
            بعدی
          </button>
          <button
            type="button"
            class="rounded-full border border-cream/60 px-4 py-2 text-sm text-cream"
            @click="dialog?.close()"
          >
            بستن
          </button>
        </div>
      </div>
    </dialog>
  </section>
</template>
