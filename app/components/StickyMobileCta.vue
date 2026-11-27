<script setup lang="ts">
const { buildWhatsAppUrl, defaultConsultMessage, hasWhatsApp, hasPhone, phoneUrl } = useContact()
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-50 border-t border-sand bg-cream/95 p-3 backdrop-blur md:hidden">
    <div class="flex gap-2">
      <a
        :href="hasWhatsApp ? buildWhatsAppUrl(defaultConsultMessage) : '#contact'"
        :target="hasWhatsApp ? '_blank' : undefined"
        :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
        class="flex flex-1 items-center justify-center rounded-full bg-ink py-3 text-sm font-medium text-cream shadow-sm"
      >
        واتساپ
      </a>
      <a
        v-if="hasPhone"
        :href="phoneUrl"
        class="flex flex-1 items-center justify-center rounded-full border border-stone-soft bg-white-soft py-3 text-sm font-medium text-ink shadow-sm"
      >
        تماس
      </a>
    </div>
  </div>
</template>
