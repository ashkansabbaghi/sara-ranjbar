// Validates the content repo checkout (.content/) and turns it into publishable files.
//
// Content comes from a separate repo that the studio panel writes to, so treat it as
// untrusted: unknown keys, odd file names, non-image files and oversized inputs fail the
// build, which keeps the last good deploy live. Every referenced image is decoded and
// re-encoded by sharp, so metadata (EXIF/GPS) and anything that is not pixel data is dropped.
//
// Output:
//   public/uploads/<name>.webp, public/uploads/thumbs/<name>.webp, public/uploads/og.jpg
//   app/data/content.generated.json (images + page texts from page.json, see shared/page-content.mjs)

import { lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { cleanText, unsafeText, validatePage } from '../shared/page-content.mjs'

const root = resolve(import.meta.dirname, '..')
const contentDir = resolve(root, process.env.CONTENT_DIR || '.content')
const uploadsOut = join(root, 'public', 'uploads')
const dataOut = join(root, 'app', 'data', 'content.generated.json')

// Keep in sync with app/utils/gallery.ts
const CATEGORIES = ['bride', 'companion', 'event', 'detail']
const FILE_RE = /^[a-z0-9-]{1,80}\.(webp|jpg)$/
const ID_RE = /^[a-z0-9-]{1,80}$/
const MAX_ITEMS = 300
const MAX_CAPTION = 120
const MAX_JSON_BYTES = 512 * 1024
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_EDGE = 2048
const THUMB_EDGE = 400

const errors = []
const fail = (msg) => errors.push(msg)

async function readJson(name, fallback) {
  const path = join(contentDir, name)
  if (!existsSync(path)) return fallback
  const info = await lstat(path)
  if (!info.isFile()) return fail(`${name}: not a regular file`), fallback
  if (info.size > MAX_JSON_BYTES) return fail(`${name}: larger than ${MAX_JSON_BYTES} bytes`), fallback
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch (e) {
    return fail(`${name}: invalid JSON (${e.message})`), fallback
  }
}

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

function checkKeys(where, obj, allowed) {
  for (const key of Object.keys(obj)) {
    if (!allowed.includes(key)) fail(`${where}: unknown key "${key}"`)
  }
}

function validateGallery(doc) {
  if (!isPlainObject(doc)) return fail('gallery.json: must be an object'), []
  checkKeys('gallery.json', doc, ['items'])
  const items = doc.items ?? []
  if (!Array.isArray(items)) return fail('gallery.json: items must be an array'), []
  if (items.length > MAX_ITEMS) return fail(`gallery.json: more than ${MAX_ITEMS} items`), []

  const ids = new Set()
  const files = new Set()
  const out = []
  items.forEach((item, i) => {
    const where = `gallery.json items[${i}]`
    if (!isPlainObject(item)) return fail(`${where}: must be an object`)
    checkKeys(where, item, ['id', 'file', 'caption', 'category'])
    const { id, file, category } = item
    const caption = item.caption ?? ''
    if (typeof id !== 'string' || !ID_RE.test(id)) fail(`${where}: invalid id`)
    else if (ids.has(id)) fail(`${where}: duplicate id ${id}`)
    if (typeof file !== 'string' || !FILE_RE.test(file)) fail(`${where}: invalid file name`)
    else if (files.has(file)) fail(`${where}: duplicate file ${file}`)
    if (!CATEGORIES.includes(category)) fail(`${where}: invalid category`)
    const text = typeof caption === 'string' ? cleanText(caption) : ''
    if (typeof caption !== 'string' || text.length > MAX_CAPTION) fail(`${where}: invalid caption`)
    else if (unsafeText(text)) fail(`${where}: caption ${unsafeText(text)}`)
    ids.add(id)
    files.add(file)
    out.push({ id, file, category, caption: text })
  })
  return out
}

function validateSite(doc) {
  const empty = { heroImage: '', portraitImage: '' }
  if (!isPlainObject(doc)) return fail('site.json: must be an object'), empty
  checkKeys('site.json', doc, ['heroImage', 'portraitImage'])
  const out = { ...empty }
  for (const key of ['heroImage', 'portraitImage']) {
    const v = doc[key] ?? ''
    if (v !== '' && (typeof v !== 'string' || !FILE_RE.test(v))) fail(`site.json: invalid ${key}`)
    else out[key] = v
  }
  return out
}

const published = (file) => file.replace(/\.(webp|jpg)$/, '.webp')

async function processImage(file) {
  const src = join(contentDir, 'uploads', file)
  let info
  try {
    info = await lstat(src)
  } catch {
    return fail(`uploads/${file}: missing`)
  }
  if (!info.isFile()) return fail(`uploads/${file}: not a regular file`)
  if (info.size > MAX_IMAGE_BYTES) return fail(`uploads/${file}: larger than ${MAX_IMAGE_BYTES} bytes`)

  const input = await readFile(src)
  const opts = { limitInputPixels: 60_000_000, failOn: 'error' }
  let meta
  try {
    meta = await sharp(input, opts).metadata()
  } catch (e) {
    return fail(`uploads/${file}: not a decodable image (${e.message})`)
  }
  const expected = file.endsWith('.webp') ? 'webp' : 'jpeg'
  if (meta.format !== expected) return fail(`uploads/${file}: content is ${meta.format}, expected ${expected}`)

  const name = published(file)
  const base = sharp(input, opts).rotate()
  const full = await base
    .clone()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(uploadsOut, name))
  await base
    .clone()
    .resize({ width: THUMB_EDGE, height: THUMB_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(join(uploadsOut, 'thumbs', name))
  return { src: `/uploads/${name}`, width: full.width, height: full.height, input }
}

async function main() {
  const hasContent = existsSync(contentDir)
  if (!hasContent) console.warn(`[content] ${contentDir} not found, building with empty content`)

  const galleryDoc = hasContent ? await readJson('gallery.json', { items: [] }) : { items: [] }
  const siteDoc = hasContent ? await readJson('site.json', {}) : {}
  const items = validateGallery(galleryDoc)
  const site = validateSite(siteDoc)
  const pageDoc = hasContent ? await readJson('page.json', undefined) : undefined
  const { page, errors: pageErrors } = validatePage(pageDoc)
  for (const e of pageErrors) fail(`page.json ${e}`)
  if (errors.length) return report()

  await rm(uploadsOut, { recursive: true, force: true })
  await mkdir(join(uploadsOut, 'thumbs'), { recursive: true })

  const images = new Map()
  const wanted = new Set([...items.map((i) => i.file), site.heroImage, site.portraitImage].filter(Boolean))
  for (const file of wanted) {
    const result = await processImage(file)
    if (result) images.set(file, result)
  }
  if (errors.length) return report()

  const pick = (file) => {
    if (!file) return null
    const { src, width, height } = images.get(file)
    return { src, width, height }
  }

  let ogImage = null
  if (site.heroImage) {
    await sharp(images.get(site.heroImage).input, { limitInputPixels: 60_000_000 })
      .rotate()
      .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(join(uploadsOut, 'og.jpg'))
    ogImage = { src: '/uploads/og.jpg', width: 1200, height: 630 }
  }

  const content = {
    gallery: items.map((item) => ({
      id: item.id,
      category: item.category,
      caption: item.caption,
      ...pick(item.file),
    })),
    heroImage: pick(site.heroImage),
    portraitImage: pick(site.portraitImage),
    ogImage,
    page,
  }

  await mkdir(join(root, 'app', 'data'), { recursive: true })
  await writeFile(dataOut, JSON.stringify(content, null, 2) + '\n')
  console.log(`[content] ${content.gallery.length} gallery images, hero: ${!!content.heroImage}, portrait: ${!!content.portraitImage}`)
}

function report() {
  console.error('[content] content validation failed:')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

await main()
