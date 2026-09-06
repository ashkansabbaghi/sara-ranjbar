export type PackageId =
  | 'companion'
  | 'companionVip'
  | 'bridalVip'
  | 'bridalCip'
  | ''

export const packageLabels: Record<Exclude<PackageId, ''>, string> = {
  companion: 'میکاپ همراه',
  companionVip: 'میکاپ همراه VIP',
  bridalVip: 'میکاپ عروس VIP',
  bridalCip: 'میکاپ عروس CIP',
}

const selectedPackage = ref<PackageId>('')

export function useBooking() {
  function selectPackage(id: PackageId) {
    selectedPackage.value = id
    if (import.meta.client) {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return {
    selectedPackage,
    selectPackage,
    packageLabels,
  }
}
