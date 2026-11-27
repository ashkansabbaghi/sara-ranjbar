// Client for the private content repo, used only by the /studio panel.
//
// The token is a fine-grained PAT limited to the content repo (Contents: read/write).
// It lives in sessionStorage only: it is gone when the tab closes, which matters while the
// site shares the *.github.io origin with other pages. Every action is one atomic commit
// (blobs -> tree -> commit -> fast-forward ref), retried once if the branch moved meanwhile.

import type { GalleryCategory } from '~/utils/gallery'
import { cleanText, unsafeText, validatePage, type PageContent } from '#shared/page-content.mjs'

const API = 'https://api.github.com'
const BRANCH = 'main'
const TOKEN_KEY = 'studio:token'
const FILE_RE = /^[a-z0-9-]{1,80}\.(webp|jpg)$/
export const MAX_ITEMS = 300
const MAX_CAPTION = 120

export interface ContentItem {
  id: string
  file: string
  category: GalleryCategory
  caption?: string
}

export interface SiteDoc {
  heroImage: string
  portraitImage: string
}

export type SiteSlot = keyof SiteDoc

interface Snapshot {
  headSha: string
  treeSha: string
  files: Record<string, string>
  items: ContentItem[]
  site: SiteDoc
  page: PageContent
}

interface Change {
  items?: ContentItem[]
  site?: SiteDoc
  page?: PageContent
  add?: { path: string; sha: string }[]
  remove?: string[]
}

export class RepoError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export class PageInvalidError extends Error {
  constructor(public errors: string[]) {
    super('چند متن مشکل دارد؛ موارد زیر را درست کنید.')
  }
}

export function describeError(e: unknown) {
  if (e instanceof RepoError) {
    if (e.status === 401) return 'کد دسترسی نامعتبر است یا منقضی شده.'
    if (e.status === 403) return 'این کد اجازه‌ی این کار را ندارد یا محدودیت درخواست پر شده.'
    if (e.status === 404) return 'ریپوی محتوا پیدا نشد یا این کد به آن دسترسی ندارد.'
    if (e.status === 409) return 'ریپوی محتوا خالی است. به اشکان خبر بدهید.'
    if (e.status === 422) return 'هم‌زمان تغییر دیگری ثبت شد. صفحه را تازه کنید و دوباره امتحان کنید.'
    return `خطای سرور گیت‌هاب (${e.status}).`
  }
  if (e instanceof TypeError) return 'اتصال برقرار نشد. اینترنت را بررسی کنید.'
  if (e instanceof Error && e.message) return e.message
  return 'خطای ناشناخته.'
}

export const publishedName = (file: string) => file.replace(/\.(webp|jpg)$/, '.webp')

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function writeToken(value: string) {
  try {
    if (value) sessionStorage.setItem(TOKEN_KEY, value)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage blocked: the token stays in memory for this page only.
  }
}

function base64ToUtf8(b64: string) {
  const bin = atob(b64.replace(/\s/g, ''))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function newId() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => (b % 36).toString(36)).join('')
  return `${date}-${rand}`
}

function parseGallery(text: string): ContentItem[] {
  const doc = JSON.parse(text)
  if (!doc || !Array.isArray(doc.items)) throw new Error('فایل گالری خراب است. به اشکان خبر بدهید.')
  return doc.items
}

function parseSite(text: string): SiteDoc {
  const doc = JSON.parse(text) || {}
  const pick = (v: unknown) => (typeof v === 'string' && FILE_RE.test(v) ? v : '')
  return { heroImage: pick(doc.heroImage), portraitImage: pick(doc.portraitImage) }
}

function parsePage(text: string): PageContent {
  let doc: unknown
  try {
    doc = JSON.parse(text)
  } catch {
    throw new Error('فایل متن‌ها خراب است. به اشکان خبر بدهید.')
  }
  // Best effort: the editor shows the cleaned values; saving re-validates everything.
  return validatePage(doc).page
}

const previews = new Map<string, string>()

export function useContentRepo() {
  const repo = String(useRuntimeConfig().public.contentRepo)
  const token = useState('studio-token', () => '')
  const snapshot = useState<Snapshot | null>('studio-snapshot', () => null)

  const signedIn = computed(() => !!token.value && !!snapshot.value)

  async function api<T>(path: string, init: { method?: string; body?: unknown; accept?: string } = {}) {
    const res = await fetch(`${API}/repos/${repo}${path}`, {
      method: init.method || 'GET',
      cache: 'no-store',
      headers: {
        Accept: init.accept || 'application/vnd.github+json',
        Authorization: `Bearer ${token.value}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
    })
    if (!res.ok) {
      if (res.status === 401) signOut()
      throw new RepoError(res.status, res.statusText)
    }
    return res as Response & { json(): Promise<T> }
  }

  const getJson = async <T>(path: string) => (await api<T>(path)).json()

  async function readText(sha: string) {
    const blob = await getJson<{ content: string }>(`/git/blobs/${sha}`)
    return base64ToUtf8(blob.content)
  }

  async function load() {
    const ref = await getJson<{ object: { sha: string } }>(`/git/ref/heads/${BRANCH}`)
    const commit = await getJson<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`)
    const tree = await getJson<{ tree: { path: string; type: string; sha: string }[] }>(
      `/git/trees/${commit.tree.sha}?recursive=1`,
    )
    const files: Record<string, string> = {}
    for (const entry of tree.tree) if (entry.type === 'blob') files[entry.path] = entry.sha

    const items = files['gallery.json'] ? parseGallery(await readText(files['gallery.json'])) : []
    const site = files['site.json']
      ? parseSite(await readText(files['site.json']))
      : { heroImage: '', portraitImage: '' }
    const page = files['page.json'] ? parsePage(await readText(files['page.json'])) : validatePage(undefined).page

    snapshot.value = { headSha: ref.object.sha, treeSha: commit.tree.sha, files, items, site, page }
    return snapshot.value
  }

  async function signIn(raw: string) {
    const value = raw.trim()
    if (value.startsWith('ghp_') || value.startsWith('gho_')) {
      throw new Error('این کد از نوع قدیمی و با دسترسی زیاد است. فقط کد مخصوص پنل را وارد کنید.')
    }
    if (!/^github_pat_[A-Za-z0-9_]{20,}$/.test(value)) throw new Error('کد دسترسی درست وارد نشده.')
    token.value = value
    try {
      await load()
      writeToken(value)
    } catch (e) {
      token.value = ''
      throw e
    }
  }

  async function restore() {
    const saved = readToken()
    if (!saved) return
    token.value = saved
    try {
      await load()
    } catch (e) {
      signOut()
      throw e
    }
  }

  function signOut() {
    token.value = ''
    snapshot.value = null
    writeToken('')
    for (const url of previews.values()) URL.revokeObjectURL(url)
    previews.clear()
  }

  async function createBlob(blob: Blob) {
    const res = await api<{ sha: string }>('/git/blobs', {
      method: 'POST',
      body: { content: await blobToBase64(blob), encoding: 'base64' },
    })
    return (await res.json()).sha
  }

  async function commitChange(message: string, build: (snap: Snapshot) => Change) {
    let snap = snapshot.value ?? (await load())
    for (let attempt = 0; ; attempt++) {
      const change = build(snap)
      const tree: Record<string, unknown>[] = []
      const json = (path: string, data: unknown) => ({
        path,
        mode: '100644',
        type: 'blob',
        content: JSON.stringify(data, null, 2) + '\n',
      })
      if (change.items) tree.push(json('gallery.json', { items: change.items }))
      if (change.site) tree.push(json('site.json', change.site))
      if (change.page) tree.push(json('page.json', change.page))
      for (const a of change.add ?? []) tree.push({ path: a.path, mode: '100644', type: 'blob', sha: a.sha })
      for (const path of change.remove ?? []) {
        if (snap.files[path]) tree.push({ path, mode: '100644', type: 'blob', sha: null })
      }
      if (!tree.length) return

      const newTree = await (await api<{ sha: string }>('/git/trees', {
        method: 'POST',
        body: { base_tree: snap.treeSha, tree },
      })).json()
      const commit = await (await api<{ sha: string }>('/git/commits', {
        method: 'POST',
        body: { message, tree: newTree.sha, parents: [snap.headSha] },
      })).json()
      try {
        await api(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: { sha: commit.sha, force: false } })
        break
      } catch (e) {
        if (attempt === 0 && e instanceof RepoError && e.status === 422) {
          snap = await load()
          continue
        }
        throw e
      }
    }
    await load()
  }

  async function addPhotos(
    files: File[],
    category: GalleryCategory,
    caption: string,
    onProgress: (text: string) => void,
  ) {
    const fa = (n: number) => n.toLocaleString('fa-IR')
    const current = snapshot.value?.items.length ?? 0
    if (current + files.length > MAX_ITEMS) throw new Error(`حداکثر ${fa(MAX_ITEMS)} عکس در گالری جا می‌شود.`)
    const text = cleanText(caption)
    if (text.length > MAX_CAPTION) throw new Error(`توضیح حداکثر ${fa(MAX_CAPTION)} نویسه است.`)
    const reason = unsafeText(text)
    if (reason) throw new Error(`توضیح ${reason}.`)

    const added: { item: ContentItem; path: string; sha: string }[] = []
    for (const [i, file] of files.entries()) {
      onProgress(`آماده‌سازی و ارسال عکس ${fa(i + 1)} از ${fa(files.length)}…`)
      const { blob, ext } = await prepareImage(file)
      const id = newId()
      const sha = await createBlob(blob)
      added.push({
        item: { id, file: `${id}.${ext}`, category, ...(text ? { caption: text } : {}) },
        path: `uploads/${id}.${ext}`,
        sha,
      })
    }

    onProgress('ثبت تغییرات…')
    const n = added.length
    await commitChange(`chore(content): add ${n} photo${n > 1 ? 's' : ''}`, (snap) => ({
      items: [...added.map((a) => a.item), ...snap.items],
      add: added.map(({ path, sha }) => ({ path, sha })),
    }))
  }

  function isUsed(snap: Snapshot, file: string, except: { item?: string; slot?: SiteSlot }) {
    return (
      snap.items.some((i) => i.file === file && i.id !== except.item) ||
      (Object.keys(snap.site) as SiteSlot[]).some((k) => k !== except.slot && snap.site[k] === file)
    )
  }

  function removePhoto(id: string) {
    return commitChange('chore(content): remove photo', (snap) => {
      const item = snap.items.find((i) => i.id === id)
      if (!item) return {}
      return {
        items: snap.items.filter((i) => i.id !== id),
        remove: isUsed(snap, item.file, { item: id }) ? [] : [`uploads/${item.file}`],
      }
    })
  }

  function movePhoto(id: string, delta: -1 | 1) {
    return commitChange('chore(content): reorder photos', (snap) => {
      const items = [...snap.items]
      const from = items.findIndex((i) => i.id === id)
      const to = from + delta
      if (from < 0 || to < 0 || to >= items.length) return {}
      ;[items[from], items[to]] = [items[to]!, items[from]!]
      return { items }
    })
  }

  async function setSiteImage(slot: SiteSlot, file: File | null) {
    let added: { name: string; sha: string } | null = null
    if (file) {
      const { blob, ext } = await prepareImage(file)
      added = { name: `${newId()}.${ext}`, sha: await createBlob(blob) }
    }
    await commitChange(`chore(content): ${added ? 'update' : 'clear'} ${slot}`, (snap) => {
      const old = snap.site[slot]
      return {
        site: { ...snap.site, [slot]: added?.name ?? '' },
        add: added ? [{ path: `uploads/${added.name}`, sha: added.sha }] : [],
        remove: old && !isUsed(snap, old, { slot }) ? [`uploads/${old}`] : [],
      }
    })
  }

  /**
   * Save the page texts as one commit. `baseSha` is the page.json blob the editor started from;
   * if someone else saved meanwhile, refuse instead of overwriting their edit.
   */
  function savePage(draft: unknown, baseSha: string) {
    const { page, errors } = validatePage(draft)
    if (errors.length) throw new PageInvalidError(errors)
    return commitChange('chore(content): update page texts', (snap) => {
      if ((snap.files['page.json'] ?? '') !== baseSha) {
        throw new Error('متن‌ها هم‌زمان از دستگاه دیگری ذخیره شده و تغییر شما ثبت نشد.')
      }
      return { page }
    })
  }

  async function previewUrl(file: string) {
    const cached = previews.get(file)
    if (cached) return cached
    const sha = snapshot.value?.files[`uploads/${file}`]
    if (!sha) throw new Error('missing')
    const res = await api(`/git/blobs/${sha}`, { accept: 'application/vnd.github.raw+json' })
    const type = file.endsWith('.jpg') ? 'image/jpeg' : 'image/webp'
    const url = URL.createObjectURL(new Blob([await res.arrayBuffer()], { type }))
    previews.set(file, url)
    return url
  }

  return {
    snapshot,
    signedIn,
    signIn,
    restore,
    signOut,
    reload: load,
    addPhotos,
    removePhoto,
    movePhoto,
    setSiteImage,
    savePage,
    previewUrl,
  }
}
