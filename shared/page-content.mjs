// Page texts: schema, defaults and validation.
//
// Shared by scripts/prepare-content.mjs (build) and the /studio panel, so the panel refuses
// exactly what the build would refuse. The texts come from the content repo, which the panel
// token can write, so treat them as untrusted: they are rendered as plain text only, and
// links, handles and phone numbers are rejected so a stolen token can't send customers to
// someone else. Contact numbers and links live in the site config, not here.

/**
 * @typedef {{ title: string, price: string, description: string }} PagePackage
 * @typedef {{ text: string, name: string }} PageTestimonial
 * @typedef {{
 *   hero: { eyebrow: string, title: string, subtitle: string, badge: string },
 *   highlights: string[],
 *   about: { title: string, paragraphs: string[] },
 *   packages: { title: string, intro: string, items: PagePackage[], extras: string },
 *   testimonials: PageTestimonial[],
 *   contact: { title: string, intro: string },
 *   footer: { tagline: string },
 *   seo: { title: string, description: string, priceRange: string },
 * }} PageContent
 *
 * @typedef {{ kind: 'text', label: string, max: number, required: boolean, hint?: string }} TextNode
 * @typedef {{ kind: 'list', label: string, max: number, item: SchemaNode, hint?: string }} ListNode
 * @typedef {{ kind: 'group', label: string, fields: Record<string, SchemaNode>, hint?: string }} GroupNode
 * @typedef {TextNode | ListNode | GroupNode} SchemaNode
 */

/** @returns {TextNode} */
const text = (label, max, { required = true, hint = undefined } = {}) => ({
  kind: 'text',
  label,
  max,
  required,
  ...(hint ? { hint } : {}),
})
/** @returns {ListNode} */
const list = (label, max, item, hint) => ({ kind: 'list', label, max, item, ...(hint ? { hint } : {}) })
/** @returns {GroupNode} */
const group = (label, fields, hint) => ({ kind: 'group', label, fields, ...(hint ? { hint } : {}) })

/** @type {GroupNode} */
export const PAGE_SCHEMA = group('متن‌های صفحه', {
  hero: group('بالای صفحه', {
    eyebrow: text('خط کوچک بالای عنوان', 60),
    title: text('عنوان اصلی', 90),
    subtitle: text('توضیح زیر عنوان', 200),
    badge: text('برچسب روی عکس', 60, { required: false }),
  }),
  highlights: list('ویژگی‌ها (نوار زیر بالای صفحه)', 5, text('ویژگی', 60)),
  about: group('درباره سارا', {
    title: text('عنوان', 90),
    paragraphs: list('پاراگراف‌ها', 6, text('پاراگراف', 600)),
  }),
  packages: group('پکیج‌ها', {
    title: text('عنوان بخش', 90),
    intro: text('توضیح بخش', 200, { required: false }),
    items: list(
      'لیست پکیج‌ها',
      8,
      group('پکیج', {
        title: text('نام پکیج', 60),
        price: text('قیمت', 40),
        description: text('توضیح', 240),
      }),
    ),
    extras: text('افزودنی‌ها', 300, { required: false }),
  }),
  testimonials: list(
    'نظرات مشتری‌ها',
    12,
    group('نظر', {
      text: text('متن نظر', 400),
      name: text('نام', 40),
    }),
    'فقط نظرهای واقعی که مشتری اجازه‌ی انتشارش را داده. تا وقتی خالی است، این بخش روی سایت نشان داده نمی‌شود.',
  ),
  contact: group('بخش تماس', {
    title: text('عنوان', 90),
    intro: text('توضیح', 240),
  }),
  footer: group('پایین صفحه', {
    tagline: text('معرفی کوتاه', 200),
  }),
  seo: group(
    'گوگل و پیش‌نمایش لینک',
    {
      title: text('عنوان', 70),
      description: text('توضیح', 170),
      priceRange: text('بازه‌ی قیمت', 40, { required: false }),
    },
    'این متن‌ها در نتیجه‌ی جست‌وجوی گوگل و موقع فرستادن لینک سایت دیده می‌شوند.',
  ),
})

/** @type {PageContent} */
export const PAGE_DEFAULTS = {
  hero: {
    eyebrow: 'سارا رنجبر · کرج',
    title: 'میکاپ عروس و همراه، مینیمال و مدرن — در کرج',
    subtitle: 'پوست تمیز، فرم طبیعی، بدون شلوغی. برای روز، ایونت، و عروس.',
    badge: 'تمیز · طبیعی · بدون شلوغی',
  },
  highlights: [
    'فقط آرایش صورت',
    'سبک مدرن و مینیمال',
    'خدمت در کرج (و با هماهنگی، خارج از شهر)',
  ],
  about: {
    title: 'زیبایی مینیمال، با دقت روی پوست و فرم',
    paragraphs: [
      'من سارا رنجبرم؛ آرایشگر تخصصی صورت در کرج. کارم روی پوست تمیز، فرم طبیعی و ظاهری سبک و مدرن تمرکز دارد — بدون شلوغی و بدون اغراق.',
      'از آرایش روزمره تا ایونت و عروس مینیمال، هدفم این است که چهره‌ات مثل خودت بماند؛ فقط مرتب‌تر، درخشان‌تر و هماهنگ‌تر با مناسبتت.',
      'خدمت اصلی در کرج است و در صورت هماهنگی، امکان حضور خارج از شهر هم وجود دارد. اگر مطمئن نیستی کدام پکیج مناسب توست، از مشاوره کوتاه شروع کنیم.',
    ],
  },
  packages: {
    title: 'انتخاب بر اساس مناسبت',
    intro: 'قیمت‌های اعلام‌شده برای هر پکیج. جزئیات نهایی در مشاوره کوتاه هماهنگ می‌شود.',
    items: [
      {
        title: 'میکاپ همراه',
        price: '۵ میلیون تومان',
        description: 'آرایش صورت برای همراهان — تمیز، هماهنگ و مناسب مراسم.',
      },
      {
        title: 'میکاپ همراه VIP',
        price: '۶ میلیون تومان',
        description: 'نسخه VIP همراه با ماندگاری و جزئیات بیشتر.',
      },
      {
        title: 'میکاپ عروس VIP',
        price: '۱۳ میلیون تومان',
        description: 'عروس VIP با رویکرد پوست‌محور و camera-ready.',
      },
      {
        title: 'میکاپ عروس CIP',
        price: '۱۵ میلیون تومان',
        description: 'بالاترین سطح خدمات عروس — ماندگار و کامل.',
      },
    ],
    extras: 'ایاب‌وذهاب، مژه پریمیوم، کیت تاچ‌آپ و آموزش کوتاه بازتولید — با هماهنگی هنگام مشاوره.',
  },
  testimonials: [],
  contact: {
    title: 'مشاوره و هماهنگی',
    intro: 'برای انتخاب پکیج یا هماهنگی وقت، در واتساپ پیام بدهید یا تماس بگیرید.',
  },
  footer: {
    tagline: 'آرایش صورت مینیمال و مدرن در کرج. پوست تمیز، فرم طبیعی، بدون شلوغی.',
  },
  seo: {
    title: 'میکاپ عروس و همراه در کرج | سارا رنجبر',
    description:
      'میکاپ عروس و همراه در کرج با سارا رنجبر — آرایش صورت مینیمال و مدرن، پوست تمیز و فرم طبیعی. مشاوره و رزرو از واتساپ.',
    priceRange: '۵ تا ۱۵ میلیون تومان',
  },
}

// C0/C1 controls and bidi overrides/isolates (they can visually reorder text).
const CONTROL_RE = /[\u0000-\u001f\u007f-\u009f‪-‮⁦-⁩]/
const LINK_RE =
  /https?:|www\.|wa\.me|t\.me|[a-z0-9-]\.(com|ir|me|net|org|io|co|app|link|site|xyz|info)\b|@[a-z0-9_.]{3,}/i
const SEPARATORS_RE = /[\s\-–—.,٫٬،()+_/]/g
const LONG_NUMBER_RE = /[0-9۰-۹٠-٩]{10,}/

const fa = (n) => n.toLocaleString('fa-IR')

/** Collapse whitespace (including new lines) and trim. */
export const cleanText = (value) => value.replace(/\s+/g, ' ').trim()

/**
 * Why a visible text can't be published, or '' when it's fine.
 * Applies to every text shown on the site, including gallery captions.
 */
export function unsafeText(value) {
  if (CONTROL_RE.test(value)) return 'نویسه‌ی نامعتبر دارد'
  if (/[<>]/.test(value)) return 'نویسه‌ی < یا > نمی‌تواند داشته باشد'
  if (LINK_RE.test(value)) return 'لینک یا آیدی نمی‌تواند داشته باشد'
  if (LONG_NUMBER_RE.test(value.replace(SEPARATORS_RE, ''))) return 'شماره تلفن نمی‌تواند داشته باشد'
  return ''
}

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/** An empty value for a schema node (used when adding a list item). */
export function emptyOf(node) {
  if (node.kind === 'text') return ''
  if (node.kind === 'list') return []
  return Object.fromEntries(Object.entries(node.fields).map(([k, f]) => [k, emptyOf(f)]))
}

const join = (where, label) => (where ? `${where} › ${label}` : label)

function check(node, value, fallback, where, errors) {
  if (value === undefined) value = fallback
  const fail = (msg) => errors.push(`«${where || 'page.json'}»: ${msg}`)

  if (node.kind === 'text') {
    if (value === undefined) value = ''
    if (typeof value !== 'string') return fail('باید متن باشد'), ''
    const v = cleanText(value)
    if (node.required && !v) fail('خالی است')
    if (v.length > node.max) fail(`بیشتر از ${fa(node.max)} نویسه است`)
    const reason = unsafeText(v)
    if (reason) fail(reason)
    return v
  }

  if (node.kind === 'list') {
    if (value === undefined) value = []
    if (!Array.isArray(value)) return fail('باید فهرست باشد'), []
    if (value.length > node.max) return fail(`بیشتر از ${fa(node.max)} مورد است`), []
    return value.map((v, i) => check(node.item, v, undefined, join(where, `${node.item.label} ${fa(i + 1)}`), errors))
  }

  if (value === undefined) value = {}
  if (!isPlainObject(value)) return fail('ساختار نامعتبر'), emptyOf(node)
  for (const key of Object.keys(value)) {
    if (!Object.hasOwn(node.fields, key)) fail(`کلید ناشناخته "${key}"`)
  }
  return Object.fromEntries(
    Object.entries(node.fields).map(([key, field]) => [
      key,
      check(field, value[key], fallback?.[key], join(where, field.label), errors),
    ]),
  )
}

/**
 * Validate page.json from the content repo. Missing fields fall back to PAGE_DEFAULTS, so a
 * missing file gives the default page. Returns the cleaned page and a list of Persian errors.
 *
 * @param {unknown} doc
 * @returns {{ page: PageContent, errors: string[] }}
 */
export function validatePage(doc) {
  /** @type {string[]} */
  const errors = []
  const page = /** @type {PageContent} */ (
    check(PAGE_SCHEMA, doc, PAGE_DEFAULTS, '', errors)
  )
  return { page, errors }
}
