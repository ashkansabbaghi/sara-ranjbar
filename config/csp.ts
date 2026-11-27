import { createHash } from 'node:crypto'

// GitHub Pages can't send response headers, so the policy ships as a <meta> tag that is
// added to every prerendered HTML page. Inline executable scripts (Nuxt's config bootstrap)
// are allowed by hash; data blocks (application/json, ld+json) are not executed and need none.
// frame-ancestors and HSTS need real headers and wait for the custom domain + CDN.

const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const DATA_TYPE_RE = /\btype\s*=\s*["']?application\/(?:ld\+)?json/i
const SRC_RE = /\bsrc\s*=/i
// Inline event handlers rendered by Nuxt itself, e.g. NuxtImg's onerror="this.setAttribute('data-error', 1)".
const HANDLER_RE = /\son[a-z]+="([^"]*)"/gi

const sha256 = (text: string) => `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`

const decodeAttr = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

function scriptSources(html: string) {
  const hashes = new Set<string>()
  for (const [, attrs = '', body = ''] of html.matchAll(SCRIPT_RE)) {
    if (SRC_RE.test(attrs) || DATA_TYPE_RE.test(attrs) || !body.trim()) continue
    hashes.add(sha256(body))
  }
  // Only these exact handler bodies are allowed; any other inline handler stays blocked.
  const handlers = new Set<string>()
  for (const [, value = ''] of html.matchAll(HANDLER_RE)) handlers.add(sha256(decodeAttr(value)))
  if (handlers.size) hashes.add(`'unsafe-hashes'`)
  return [...hashes, ...handlers]
}

export function buildCsp(html: string) {
  return [
    `default-src 'self'`,
    `script-src 'self' ${scriptSources(html).join(' ')}`.trim(),
    // Vue/Nuxt emit inline <style> blocks and style attributes.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    // The studio panel talks to the GitHub API; nothing else leaves the site.
    `connect-src 'self' https://api.github.com`,
    `object-src 'none'`,
    `frame-src 'none'`,
    `worker-src 'none'`,
    `base-uri 'self'`,
    `form-action 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}

export function injectCsp(html: string) {
  if (html.includes('http-equiv="Content-Security-Policy"')) return html
  const meta = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(html)}">`
  // Must come before any script; keep <meta charset> first.
  const charset = html.match(/<meta charset="[^"]*">/i)
  if (charset?.index !== undefined) {
    const at = charset.index + charset[0].length
    return html.slice(0, at) + meta + html.slice(at)
  }
  return html.replace(/<head[^>]*>/i, (m) => m + meta)
}
