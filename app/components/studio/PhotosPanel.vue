<script setup lang="ts">
import type { GalleryCategory } from '~/utils/gallery'
import type { SiteSlot } from '~/composables/useContentRepo'

const repo = useContentRepo()
const snapshot = repo.snapshot
const { busy, run, info } = useStudioTask()

const picked = ref<{ file: File; url: string }[]>([])
const category = ref<GalleryCategory | ''>('')
const caption = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const slots: { key: SiteSlot; label: string }[] = [
  { key: 'heroImage', label: 'عکس اصلی بالای صفحه' },
  { key: 'portraitImage', label: 'عکس بخش «درباره سارا»' },
]

const fa = (n: number) => n.toLocaleString('fa-IR')

onBeforeUnmount(clearPicked)

function revokePicked() {
  for (const p of picked.value) URL.revokeObjectURL(p.url)
  picked.value = []
}

function clearPicked() {
  revokePicked()
  if (fileInput.value) fileInput.value.value = ''
}

function onPick(e: Event) {
  // Read the files before touching the input: resetting its value empties the list.
  const files = Array.from((e.target as HTMLInputElement).files ?? []).slice(0, 20)
  revokePicked()
  picked.value = files.map((file) => ({ file, url: URL.createObjectURL(file) }))
}

function upload() {
  if (!picked.value.length || !category.value) return
  const files = picked.value.map((p) => p.file)
  const cat = category.value
  run(async () => {
    await repo.addPhotos(files, cat, caption.value, info)
    clearPicked()
    caption.value = ''
  })
}

function remove(id: string) {
  if (!confirm('این عکس از سایت حذف شود؟')) return
  run(() => repo.removePhoto(id))
}

function move(id: string, delta: -1 | 1) {
  run(() => repo.movePhoto(id, delta))
}

function replaceSlot(slot: SiteSlot, e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (file) run(() => repo.setSiteImage(slot, file))
}

function clearSlot(slot: SiteSlot) {
  if (!confirm('این عکس برداشته شود؟')) return
  run(() => repo.setSiteImage(slot, null))
}

const button =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50'
const primary = `${button} bg-ink text-cream hover:bg-accent`
const secondary = `${button} border border-stone-soft bg-white-soft text-ink hover:border-accent`
</script>

<template>
  <div v-if="snapshot" class="space-y-6">
    <!-- Upload -->
    <form
      class="space-y-5 rounded-3xl border border-stone-soft/70 bg-white-soft p-5"
      @submit.prevent="upload"
    >
      <h2 class="text-base font-semibold">افزودن عکس به گالری</h2>

      <label class="block">
        <span class="mb-2 block text-sm text-ink-muted">عکس‌ها (حداکثر ۲۰ عکس در هر بار)</span>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          :disabled="busy"
          class="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-cream"
          @change="onPick"
        >
      </label>

      <div v-if="picked.length" class="grid grid-cols-4 gap-2 sm:grid-cols-6">
        <img
          v-for="p in picked"
          :key="p.url"
          :src="p.url"
          alt=""
          class="aspect-square w-full rounded-xl object-cover ring-1 ring-stone-soft/60"
        >
      </div>

      <fieldset>
        <legend class="mb-2 text-sm text-ink-muted">دسته</legend>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="key in GALLERY_CATEGORIES"
            :key="key"
            class="cursor-pointer rounded-full border px-4 py-1.5 text-sm transition"
            :class="category === key ? 'border-ink bg-ink text-cream' : 'border-stone-soft bg-cream text-ink'"
          >
            <input v-model="category" type="radio" name="category" :value="key" class="sr-only">
            {{ CATEGORY_LABELS[key] }}
          </label>
        </div>
      </fieldset>

      <label class="block text-sm">
        <span class="mb-1 block text-ink-muted">توضیح کوتاه (اختیاری)</span>
        <input
          v-model="caption"
          type="text"
          maxlength="120"
          class="w-full rounded-xl border border-stone-soft bg-cream px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
      </label>

      <button type="submit" :class="primary" :disabled="busy || !picked.length || !category">
        آپلود {{ picked.length ? `${fa(picked.length)} عکس` : '' }}
      </button>
    </form>

    <!-- Page images -->
    <section class="space-y-4 rounded-3xl border border-stone-soft/70 bg-white-soft p-5">
      <h2 class="text-base font-semibold">عکس‌های صفحه</h2>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="slot in slots" :key="slot.key" class="space-y-2">
          <div class="aspect-[4/5] overflow-hidden rounded-2xl bg-sand ring-1 ring-stone-soft/60">
            <StudioThumb
              v-if="snapshot.site[slot.key]"
              :file="snapshot.site[slot.key]"
              :alt="slot.label"
            />
            <div v-else class="flex h-full items-center justify-center text-xs text-ink-muted">خالی</div>
          </div>
          <p class="text-xs text-ink-muted">{{ slot.label }}</p>
          <div class="flex flex-wrap gap-2">
            <label :class="[secondary, busy ? 'pointer-events-none opacity-50' : 'cursor-pointer']">
              انتخاب عکس
              <input
                type="file"
                accept="image/*"
                class="sr-only"
                :disabled="busy"
                @change="replaceSlot(slot.key, $event)"
              >
            </label>
            <button
              v-if="snapshot.site[slot.key]"
              type="button"
              :class="secondary"
              :disabled="busy"
              @click="clearSlot(slot.key)"
            >
              برداشتن
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="space-y-4 rounded-3xl border border-stone-soft/70 bg-white-soft p-5">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">گالری</h2>
        <span class="text-xs text-ink-muted">{{ fa(snapshot.items.length) }} عکس</span>
      </div>
      <p v-if="!snapshot.items.length" class="text-sm text-ink-muted">هنوز عکسی اضافه نشده.</p>
      <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <li
          v-for="(item, i) in snapshot.items"
          :key="item.id"
          class="overflow-hidden rounded-2xl border border-stone-soft/60 bg-cream"
        >
          <div class="aspect-[4/5] bg-sand">
            <StudioThumb :file="item.file" :alt="item.caption || CATEGORY_LABELS[item.category]" />
          </div>
          <div class="space-y-2 p-3">
            <p class="text-xs text-accent">{{ CATEGORY_LABELS[item.category] }}</p>
            <p v-if="item.caption" class="line-clamp-2 text-xs text-ink-muted">{{ item.caption }}</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                type="button"
                :class="secondary"
                class="!px-3 !py-1 text-xs"
                :disabled="busy || i === 0"
                @click="move(item.id, -1)"
              >
                قبل
              </button>
              <button
                type="button"
                :class="secondary"
                class="!px-3 !py-1 text-xs"
                :disabled="busy || i === snapshot.items.length - 1"
                @click="move(item.id, 1)"
              >
                بعد
              </button>
              <button
                type="button"
                class="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700 disabled:opacity-50"
                :disabled="busy"
                @click="remove(item.id)"
              >
                حذف
              </button>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <p class="text-xs leading-6 text-ink-muted">
      فقط عکس‌هایی را منتشر کنید که مشتری اجازه داده. اطلاعات مکان و دوربین قبل از ارسال از عکس پاک
      می‌شود.
    </p>
  </div>
</template>
