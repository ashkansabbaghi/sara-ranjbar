<script setup lang="ts">
import { PAGE_SCHEMA, type PageContent } from '#shared/page-content.mjs'

const repo = useContentRepo()
const { busy, run } = useStudioTask()

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const draft = ref<PageContent>(clone(repo.snapshot.value!.page))
/** What the draft started from: the page.json blob ('' = no file yet, defaults) and its texts. */
const base = shallowRef({ sha: '', json: '' })
const currentSha = computed(() => repo.snapshot.value?.files['page.json'] ?? '')

function resetDraft() {
  const snap = repo.snapshot.value
  if (!snap) return
  draft.value = clone(snap.page)
  base.value = { sha: snap.files['page.json'] ?? '', json: JSON.stringify(snap.page) }
}

const isDirty = () => JSON.stringify(draft.value) !== base.value.json
const dirty = useState('studio-texts-dirty', () => false)
watchEffect(() => {
  dirty.value = isDirty()
})

// page.json changed in the repo (e.g. a save from another device). Follow it unless the user
// has unsaved edits: never drop typed work. A photo commit leaves the sha alone.
resetDraft()
watch(currentSha, () => {
  if (!isDirty()) resetDraft()
})
/** Someone else saved since this draft started; saving would be refused. */
const stale = computed(() => base.value.sha !== currentSha.value)

function onBeforeUnload(e: BeforeUnloadEvent) {
  if (dirty.value) e.preventDefault()
}
onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', onBeforeUnload)
  dirty.value = false
})

async function save() {
  const sha = base.value.sha
  if (await run(() => repo.savePage(draft.value, sha))) resetDraft()
}

function discard() {
  if (!confirm('تغییرهای ذخیره‌نشده پاک شود؟')) return
  resetDraft()
}

const sections = Object.entries(PAGE_SCHEMA.fields) as [keyof PageContent, (typeof PAGE_SCHEMA.fields)[string]][]

const button =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50'
</script>

<template>
  <!-- novalidate: fields sit in closed <details>; savePage() validates and lists errors in Persian. -->
  <form class="space-y-4" novalidate @submit.prevent="save">
    <p class="text-sm leading-7 text-ink-muted">
      هر بخش را باز کنید، متن را عوض کنید و در آخر «ذخیره» را بزنید. شماره‌ها و لینک‌های تماس از اینجا
      عوض نمی‌شوند؛ برای تغییرشان به اشکان خبر بدهید.
    </p>

    <details
      v-for="[key, node] in sections"
      :key="key"
      class="group rounded-3xl border border-stone-soft/70 bg-white-soft open:pb-5"
    >
      <summary class="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-base font-semibold">
        {{ node.label }}
        <span class="text-xs text-ink-muted transition group-open:rotate-180" aria-hidden="true">▾</span>
      </summary>
      <div class="px-5">
        <StudioField v-model="draft[key]" :node="node" bare />
      </div>
    </details>

    <p v-if="stale && !busy" class="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900 ring-1 ring-amber-200">
      متن‌ها از دستگاه دیگری ذخیره شده‌اند. «بازگردانی» را بزنید تا نسخه‌ی تازه بیاید، بعد تغییرتان را
      دوباره وارد کنید.
    </p>

    <div
      class="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-sand bg-cream/95 px-4 py-3 backdrop-blur"
    >
      <button type="submit" :class="[button, 'bg-ink text-cream hover:bg-accent']" :disabled="busy || !dirty">
        {{ busy ? 'در حال ذخیره…' : 'ذخیره' }}
      </button>
      <button
        type="button"
        :class="[button, 'border border-stone-soft bg-white-soft text-ink hover:border-accent']"
        :disabled="busy || !dirty"
        @click="discard"
      >
        بازگردانی
      </button>
      <span class="text-xs text-ink-muted">{{ dirty ? 'تغییرها هنوز ذخیره نشده‌اند.' : 'همه‌چیز ذخیره شده.' }}</span>
    </div>
  </form>
</template>
