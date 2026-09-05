export function useContact() {
  const config = useRuntimeConfig()

  const whatsappNumber = computed(() => {
    const raw = String(config.public.whatsapp || '').replace(/\D/g, '')
    return raw
  })

  const instagramHandle = computed(() => {
    return String(config.public.instagram || '').replace(/^@/, '').trim()
  })

  const hasWhatsApp = computed(() => whatsappNumber.value.length >= 10)
  const hasInstagram = computed(() => instagramHandle.value.length > 0)

  const instagramUrl = computed(() =>
    hasInstagram.value
      ? `https://instagram.com/${instagramHandle.value}`
      : '#instagram',
  )

  function buildWhatsAppUrl(message: string) {
    if (!hasWhatsApp.value) return '#whatsapp'
    const text = encodeURIComponent(message)
    return `https://wa.me/${whatsappNumber.value}?text=${text}`
  }

  const defaultConsultMessage =
    'سلام سارا، برای مشاوره آرایش صورت پیام می‌دم.'

  return {
    whatsappNumber,
    instagramHandle,
    hasWhatsApp,
    hasInstagram,
    instagramUrl,
    buildWhatsAppUrl,
    defaultConsultMessage,
  }
}
