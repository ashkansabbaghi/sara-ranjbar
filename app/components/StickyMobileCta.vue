<script setup lang="ts">
const { buildWhatsAppUrl, defaultConsultMessage, hasWhatsApp } = useContact()
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-50 border-t border-sand bg-cream/95 p-3 backdrop-blur md:hidden">
    <a
      :href="hasWhatsApp ? buildWhatsAppUrl(defaultConsultMessage) : '#contact'"
      :target="hasWhatsApp ? '_blank' : undefined"
      :rel="hasWhatsApp ? 'noopener noreferrer' : undefined"
      class="flex w-full items-center justify-center rounded-full bg-ink py-3 text-sm font-medium text-cream shadow-sm"
    >
      گفت‌وگو در واتساپ
    </a>
  </div>
</template>
