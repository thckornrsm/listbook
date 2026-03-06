<template>
  <USelect
    v-model="model"
    :items="items"
    :placeholder="placeholder"
    class="w-44"
    :ui="({
      /* เปลี่ยน focus เป็น: focus:ring-2 focus:ring-slate-400 focus:border-slate-400 */
      base: 'h-10 w-full rounded-lg bg-white border border-slate-300 text-slate-700 text-sm focus:ring-1 focus:ring-slate-300 focus:border-slate-300 focus:outline-none hover:bg-slate-50 transition-colors',
      content: 'bg-white border border-slate-200 shadow-lg rounded-xl ring-0 outline-none',
      input: 'bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 px-3 text-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-400 focus:outline-none',
    } as any)"
  /> 
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SelectMenuItem } from '@nuxt/ui'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    category?: string
    items?: SelectMenuItem[]
    placeholder?: string
  }>(),
  {
    category: '',
    items: () => [],
    placeholder: 'หมวดหมู่'
  }
)

const emit = defineEmits<{
  (e: 'update:category', v: string): void
}>()

const model = computed<string>({
  get: () => props.category ?? '',
  set: (v) => emit('update:category', v)
})
</script>
