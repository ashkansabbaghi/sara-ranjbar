<script setup lang="ts">
import type { PackageId } from '~/composables/useBooking'

const { selectedPackage, packageLabels } = useBooking()
const { buildWhatsAppUrl, hasWhatsApp, defaultConsultMessage } = useContact()

const form = reactive({
  name: '',
  mobile: '',
  packageId: '' as PackageId,
  date: '',
  message: '',
})

watch(
  selectedPackage,
  (id) => {
    if (id) form.packageId = id
  },
  { immediate: true },
)

const packageOptions = [
  { value: 'day', label: packageLabels.day },
  { value: 'event', label: packageLabels.event },
  { value: 'bridal', label: packageLabels.bridal },
  { value: 'companions', label: packageLabels.companions },
]

function composeMessage() {
  const pkgLabel =
    form.packageId && form.packageId in packageLabels
      ? packageLabels[form.packageId as Exclude<PackageId, ''>]
      : 'هنوز انتخاب نشده'

  return [
    'سلام سارا، درخواست رزرو مشاوره:',
    `نام: ${form.name || '—'}`,
    `موبایل: ${form.mobile || '—'}`,
    `پکیج: ${pkgLabel}`,
    `تاریخ تقریبی: ${form.date || '—'}`,
    `پیام: ${form.message || '—'}`,
  ].join('\n')
}

const whatsappFormUrl = computed(() => buildWhatsAppUrl(composeMessage()))

function onSubmit() {
  if (!hasWhatsApp.value) {
    alert('شماره واتساپ هنوز تنظیم نشده است. لطفاً NUXT_PUBLIC_WHATSAPP را در .env پر کنید.')
    return
  }
  window.open(whatsappFormUrl.value, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section id="booking" class="scroll-mt-24">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-5">
          <p class="text-xs font-medium tracking-[0.18em] text-accent">رزرو</p>
          <h2 class="mt-3 text-2xl font-semibold text-ink sm:text-3xl">مشاوره و هماهنگی</h2>
          <p class="mt-4 text-sm leading-8 text-ink-muted">
            فرم را پر کنید تا پیام آمادهٔ واتساپ ساخته شود. می‌توانید مستقیم هم گفت‌وگو را شروع کنید.
          </p>
          <a
            :href="hasWhatsApp ? buildWhatsAppUrl(defaultConsultMessage) : '#booking'"
            :target="hasWhatsApp ? '_blank' : undefined"
            :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
            class="mt-6 inline-flex items-center justify-center rounded-full border border-stone-soft bg-white-soft px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
          >
            گفت‌وگو در واتساپ
          </a>
          <p v-if="!hasWhatsApp" class="mt-3 text-xs text-ink-muted">
            شماره واتساپ از طریق متغیر محیطی تنظیم می‌شود (فعلاً خالی است).
          </p>
        </div>

        <form
          class="space-y-4 rounded-3xl border border-stone-soft/70 bg-cream p-6 shadow-sm lg:col-span-7"
          @submit.prevent="onSubmit"
        >
          <div>
            <label for="name" class="mb-1.5 block text-xs font-medium text-ink">نام</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              class="w-full rounded-xl border border-stone-soft bg-white-soft px-4 py-3 text-sm outline-none ring-accent/30 transition focus:ring-2"
              placeholder="نام شما"
            />
          </div>

          <div>
            <label for="mobile" class="mb-1.5 block text-xs font-medium text-ink">موبایل</label>
            <input
              id="mobile"
              v-model="form.mobile"
              type="tel"
              required
              inputmode="tel"
              autocomplete="tel"
              class="w-full rounded-xl border border-stone-soft bg-white-soft px-4 py-3 text-sm outline-none ring-accent/30 transition focus:ring-2"
              placeholder="۰۹۱۲…"
              dir="ltr"
            />
          </div>

          <div>
            <label for="package" class="mb-1.5 block text-xs font-medium text-ink">پکیج</label>
            <select
              id="package"
              v-model="form.packageId"
              class="w-full rounded-xl border border-stone-soft bg-white-soft px-4 py-3 text-sm outline-none ring-accent/30 transition focus:ring-2"
            >
              <option value="">انتخاب پکیج (اختیاری)</option>
              <option v-for="opt in packageOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div>
            <label for="date" class="mb-1.5 block text-xs font-medium text-ink">تاریخ تقریبی</label>
            <input
              id="date"
              v-model="form.date"
              type="text"
              class="w-full rounded-xl border border-stone-soft bg-white-soft px-4 py-3 text-sm outline-none ring-accent/30 transition focus:ring-2"
              placeholder="مثلاً هفته آخر مهر"
            />
          </div>

          <div>
            <label for="message" class="mb-1.5 block text-xs font-medium text-ink">پیام</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              class="w-full resize-y rounded-xl border border-stone-soft bg-white-soft px-4 py-3 text-sm outline-none ring-accent/30 transition focus:ring-2"
              placeholder="توضیح کوتاه درباره مناسبت یا ترجیحات…"
            />
          </div>

          <button
            type="submit"
            class="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream transition hover:bg-accent"
          >
            ارسال در واتساپ
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
