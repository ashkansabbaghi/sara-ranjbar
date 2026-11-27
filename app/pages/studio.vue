<script setup lang="ts">
useHead({
  title: 'پنل مدیریت سایت',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'referrer', content: 'no-referrer' },
  ],
})

const repo = useContentRepo()
const { busy, status, run } = useStudioTask()
const textsDirty = useState('studio-texts-dirty', () => false)

const ready = ref(false)
const tokenInput = ref('')
const tab = ref<'photos' | 'texts'>('photos')

const tabs = [
  { key: 'photos', label: 'عکس‌ها' },
  { key: 'texts', label: 'متن‌ها و قیمت‌ها' },
] as const

onMounted(async () => {
  try {
    await repo.restore()
  } catch (e) {
    status.value = { kind: 'error', text: describeError(e) }
  } finally {
    ready.value = true
  }
})

function signIn() {
  run(async () => {
    await repo.signIn(tokenInput.value)
    tokenInput.value = ''
  }, 'وارد شدید.')
}

function signOut() {
  if (textsDirty.value && !confirm('تغییرهای متن ذخیره نشده‌اند. خارج شوید؟')) return
  repo.signOut()
  status.value = { kind: 'info', text: 'خارج شدید.' }
}

const fa = (n: number) => n.toLocaleString('fa-IR')
const MAX_DETAILS = 6

const button =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50'
const primary = `${button} bg-ink text-cream hover:bg-accent`
const secondary = `${button} border border-stone-soft bg-white-soft text-ink hover:border-accent`
</script>

<template>
  <div class="min-h-screen bg-cream font-sans text-ink">
    <header class="sticky top-0 z-10 border-b border-sand bg-cream/95 backdrop-blur">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <p class="text-sm font-semibold">پنل مدیریت سایت</p>
        <button v-if="repo.signedIn.value" type="button" :class="secondary" :disabled="busy" @click="signOut">
          خروج
        </button>
      </div>

      <div
        v-if="status"
        role="status"
        aria-live="polite"
        class="mx-auto mb-3 flex max-w-3xl items-start gap-3 px-4"
      >
        <div
          class="flex-1 rounded-2xl px-4 py-3 text-sm leading-7"
          :class="{
            'bg-red-50 text-red-800 ring-1 ring-red-200': status.kind === 'error',
            'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200': status.kind === 'ok',
            'bg-sand text-ink': status.kind === 'info',
          }"
        >
          <p>{{ status.text }}</p>
          <ul v-if="status.details?.length" class="mt-2 list-disc space-y-1 ps-5 text-xs leading-6">
            <li v-for="(line, i) in status.details.slice(0, MAX_DETAILS)" :key="i">{{ line }}</li>
            <li v-if="status.details.length > MAX_DETAILS">
              و {{ fa(status.details.length - MAX_DETAILS) }} مورد دیگر
            </li>
          </ul>
        </div>
        <button
          v-if="!busy"
          type="button"
          class="mt-2 text-lg leading-none text-ink-muted"
          aria-label="بستن پیام"
          @click="status = null"
        >
          ×
        </button>
      </div>

      <nav
        v-if="ready && repo.signedIn.value"
        class="mx-auto flex max-w-3xl gap-2 px-4 pb-3"
        aria-label="بخش‌های پنل"
      >
        <button
          v-for="t in tabs"
          :key="t.key"
          type="button"
          :aria-pressed="tab === t.key"
          class="rounded-full border px-4 py-1.5 text-sm transition"
          :class="tab === t.key ? 'border-ink bg-ink text-cream' : 'border-stone-soft bg-white-soft text-ink'"
          @click="tab = t.key"
        >
          {{ t.label }}
          <span v-if="t.key === 'texts' && textsDirty" class="ms-1 text-accent" aria-label="ذخیره‌نشده">●</span>
        </button>
      </nav>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-6 pb-16">
      <p v-if="!ready" class="text-sm text-ink-muted">در حال بارگذاری…</p>

      <!-- Sign in -->
      <form
        v-else-if="!repo.signedIn.value"
        class="space-y-4 rounded-3xl border border-stone-soft/70 bg-white-soft p-5"
        @submit.prevent="signIn"
      >
        <h1 class="text-lg font-semibold">ورود</h1>
        <p class="text-sm leading-7 text-ink-muted">
          کد دسترسی را از جای امنی که ذخیره کرده‌اید کپی کنید و اینجا بگذارید. با بستن این صفحه، کد پاک
          می‌شود و دفعه‌ی بعد دوباره باید واردش کنید.
        </p>
        <label class="block text-sm">
          <span class="mb-1 block text-ink-muted">کد دسترسی</span>
          <input
            v-model="tokenInput"
            type="password"
            dir="ltr"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            required
            class="w-full rounded-xl border border-stone-soft bg-cream px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
        </label>
        <button type="submit" :class="primary" :disabled="busy || !tokenInput.trim()">
          {{ busy ? 'در حال بررسی…' : 'ورود' }}
        </button>
      </form>

      <!-- v-show keeps unsaved text edits while switching tabs. -->
      <template v-else-if="repo.snapshot.value">
        <StudioPhotosPanel v-show="tab === 'photos'" />
        <StudioTextsPanel v-show="tab === 'texts'" />
      </template>
    </main>
  </div>
</template>
