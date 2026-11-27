// Shared busy flag and status line for the /studio panel: one GitHub write at a time, and one
// place (the sticky header) where its result is shown.

export interface StudioStatus {
  kind: 'error' | 'ok' | 'info'
  text: string
  details?: string[]
}

export const PUBLISHED_MESSAGE = 'ثبت شد. حدود ۲ دقیقه دیگر روی سایت دیده می‌شود.'

export function useStudioTask() {
  const busy = useState('studio-busy', () => false)
  const status = useState<StudioStatus | null>('studio-status', () => null)

  async function run(task: () => Promise<void>, done = PUBLISHED_MESSAGE) {
    if (busy.value) return false
    busy.value = true
    status.value = null
    try {
      await task()
      status.value = { kind: 'ok', text: done }
      return true
    } catch (e) {
      status.value = {
        kind: 'error',
        text: describeError(e),
        details: e instanceof PageInvalidError ? e.errors : undefined,
      }
      return false
    } finally {
      busy.value = false
    }
  }

  const info = (text: string) => {
    status.value = { kind: 'info', text }
  }

  return { busy, status, run, info }
}
