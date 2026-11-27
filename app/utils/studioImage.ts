// Runs in the studio panel before upload. Drawing to a canvas and re-encoding drops all
// metadata (EXIF, GPS location, camera info) and shrinks phone photos to a web size.
// The build re-encodes again with sharp, so this is about privacy and upload size.

const MAX_EDGE = 2048
const MAX_INPUT_BYTES = 40 * 1024 * 1024
const MAX_OUTPUT_BYTES = 8 * 1024 * 1024

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function prepareImage(file: File): Promise<{ blob: Blob; ext: 'webp' | 'jpg' }> {
  if (file.size > MAX_INPUT_BYTES) throw new Error('حجم این عکس خیلی زیاد است.')
  if (file.type === 'image/svg+xml' || (file.type && !file.type.startsWith('image/'))) {
    throw new Error('فقط عکس معمولی (JPG، PNG، WebP یا عکس گوشی) پذیرفته می‌شود.')
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error(`عکس «${file.name}» باز نشد. عکس دیگری انتخاب کنید.`)
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('مرورگر اجازه‌ی پردازش عکس را نمی‌دهد.')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  // Safari can't encode WebP and silently returns PNG; fall back to JPEG there.
  let result: { blob: Blob; ext: 'webp' | 'jpg' } | null = null
  const webp = await canvasToBlob(canvas, 'image/webp', 0.86)
  if (webp?.type === 'image/webp') result = { blob: webp, ext: 'webp' }
  else {
    const jpeg = await canvasToBlob(canvas, 'image/jpeg', 0.88)
    if (jpeg) result = { blob: jpeg, ext: 'jpg' }
  }
  canvas.width = canvas.height = 0

  if (!result) throw new Error('تبدیل عکس انجام نشد.')
  if (result.blob.size > MAX_OUTPUT_BYTES) throw new Error('حجم عکس بعد از تبدیل هم زیاد است.')
  return result
}
