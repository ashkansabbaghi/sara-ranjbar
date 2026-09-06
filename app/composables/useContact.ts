export function useContact() {
  const config = useRuntimeConfig()

  const whatsappRaw = computed(() => String(config.public.whatsapp || '').trim())

  const isWhatsAppUrl = computed(() => {
    const v = whatsappRaw.value
    return /^https?:\/\//i.test(v) || v.includes('wa.me')
  })

  const whatsappNumber = computed(() => {
    if (isWhatsAppUrl.value) return ''
    return whatsappRaw.value.replace(/\D/g, '')
  })

  const instagramHandle = computed(() => {
    return String(config.public.instagram || '').replace(/^@/, '').trim()
  })

  const hasWhatsApp = computed(
    () => isWhatsAppUrl.value || whatsappNumber.value.length >= 10,
  )
  const hasInstagram = computed(() => instagramHandle.value.length > 0)

  const instagramUrl = computed(() =>
    hasInstagram.value
      ? `https://www.instagram.com/${instagramHandle.value}`
      : '#instagram',
  )

  function buildWhatsAppUrl(message: string) {
    if (!hasWhatsApp.value) return '#whatsapp'

    if (isWhatsAppUrl.value) {
      const base = whatsappRaw.value
      // QR deep links usually ignore prefilled text
      if (base.includes('/qr/')) return base
      const sep = base.includes('?') ? '&' : '?'
      return `${base}${sep}text=${encodeURIComponent(message)}`
    }

    return `https://wa.me/${whatsappNumber.value}?text=${encodeURIComponent(message)}`
  }

  const defaultConsultMessage =
    'سلام سارا، برای مشاوره آرایش صورت پیام می‌دم.'

  return {
    whatsappNumber,
    whatsappRaw,
    instagramHandle,
    hasWhatsApp,
    hasInstagram,
    instagramUrl,
    buildWhatsAppUrl,
    defaultConsultMessage,
  }
}
