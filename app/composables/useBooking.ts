export type PackageId = 'day' | 'event' | 'bridal' | 'companions' | ''

export const packageLabels: Record<Exclude<PackageId, ''>, string> = {
  day: 'روز مینیمال',
  event: 'ایونت سافت',
  bridal: 'عروس مینیمال',
  companions: 'همراهان',
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
