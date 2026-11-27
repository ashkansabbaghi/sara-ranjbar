<script setup lang="ts">
// Shows the published thumbnail; for photos the site hasn't rebuilt yet, falls back to
// fetching the file from the content repo with the panel token.
const props = defineProps<{ file: string; alt: string }>()
const repo = useContentRepo()

const published = () => withBase(`/uploads/thumbs/${publishedName(props.file)}`)
const src = ref(published())
const triedRepo = ref(false)

watch(
  () => props.file,
  () => {
    triedRepo.value = false
    src.value = published()
  },
)

async function onError() {
  if (triedRepo.value) {
    src.value = ''
    return
  }
  triedRepo.value = true
  try {
    src.value = await repo.previewUrl(props.file)
  } catch {
    src.value = ''
  }
}
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :alt="alt"
    loading="lazy"
    class="h-full w-full object-cover"
    @error="onError"
  >
  <div v-else class="flex h-full items-center justify-center p-2 text-center text-xs text-ink-muted">
    پیش‌نمایش در دسترس نیست
  </div>
</template>
