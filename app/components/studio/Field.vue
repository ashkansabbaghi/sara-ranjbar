<script setup lang="ts">
// Renders one node of PAGE_SCHEMA (shared/page-content.mjs) as a form control, recursively:
// text -> input/textarea, list -> repeatable items, group -> its fields.
import { emptyOf, type SchemaNode } from '#shared/page-content.mjs'

const props = defineProps<{
  node: SchemaNode
  /** Hide the label/legend, e.g. when a list item header already names it. */
  bare?: boolean
}>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model = defineModel<any>({ required: true })
const { busy } = useStudioTask()

const fa = (n: number) => n.toLocaleString('fa-IR')
const id = useId()

function add() {
  if (props.node.kind === 'list') model.value.push(emptyOf(props.node.item))
}

function remove(i: number) {
  if (props.node.kind !== 'list') return
  if (!confirm(`«${props.node.item.label} ${fa(i + 1)}» حذف شود؟`)) return
  model.value.splice(i, 1)
}

function move(i: number, delta: -1 | 1) {
  const list = model.value as unknown[]
  const j = i + delta
  if (j < 0 || j >= list.length) return
  ;[list[i], list[j]] = [list[j], list[i]]
}

const input =
  'w-full rounded-xl border border-stone-soft bg-cream px-3 py-2.5 text-sm leading-7 outline-none focus:border-accent'
const small =
  'rounded-full border border-stone-soft bg-white-soft px-3 py-1 text-xs text-ink transition hover:border-accent disabled:opacity-40'
</script>

<template>
  <!-- Text -->
  <div v-if="node.kind === 'text'" class="space-y-1 text-sm">
    <label v-if="!bare" :for="id" class="block text-ink-muted">
      {{ node.label }}<span v-if="!node.required" class="text-xs"> (اختیاری)</span>
    </label>
    <textarea
      v-if="node.max > 150"
      :id="id"
      v-model="model"
      :aria-label="bare ? node.label : undefined"
      :maxlength="node.max"
      :required="node.required"
      :disabled="busy"
      rows="4"
      :class="input"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      :aria-label="bare ? node.label : undefined"
      type="text"
      :maxlength="node.max"
      :required="node.required"
      :disabled="busy"
      :class="input"
    >
    <p class="flex justify-between gap-2 text-[11px] text-ink-muted">
      <span>{{ node.hint }}</span>
      <span class="tabular-nums">{{ fa(model.length) }} / {{ fa(node.max) }}</span>
    </p>
  </div>

  <!-- List -->
  <fieldset v-else-if="node.kind === 'list'" class="space-y-3">
    <legend v-if="!bare" class="mb-2 text-sm font-semibold">{{ node.label }}</legend>
    <p v-if="node.hint" class="text-xs leading-6 text-ink-muted">{{ node.hint }}</p>
    <div
      v-for="(_, i) in model"
      :key="i"
      class="space-y-2 rounded-2xl border border-stone-soft/60 bg-cream/60 p-3"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs font-medium text-accent">{{ node.item.label }} {{ fa(i + 1) }}</span>
        <div class="flex gap-1.5">
          <button type="button" :class="small" :disabled="busy || i === 0" @click="move(i, -1)">بالا</button>
          <button
            type="button"
            :class="small"
            :disabled="busy || i === model.length - 1"
            @click="move(i, 1)"
          >
            پایین
          </button>
          <button
            type="button"
            class="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700 disabled:opacity-40"
            :disabled="busy"
            @click="remove(i)"
          >
            حذف
          </button>
        </div>
      </div>
      <StudioField v-model="model[i]" :node="node.item" bare />
    </div>
    <button type="button" :class="small" :disabled="busy || model.length >= node.max" @click="add">
      + افزودن {{ node.item.label }}
    </button>
  </fieldset>

  <!-- Group -->
  <fieldset v-else class="space-y-4">
    <legend v-if="!bare" class="mb-2 text-sm font-semibold">{{ node.label }}</legend>
    <p v-if="node.hint" class="text-xs leading-6 text-ink-muted">{{ node.hint }}</p>
    <StudioField
      v-for="(field, key) in node.fields"
      :key="key"
      v-model="model[key]"
      :node="field"
    />
  </fieldset>
</template>
