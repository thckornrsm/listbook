<template>
  <UTable
    v-model:rowSelection="rowSelectionModel"
    :data="items"
    :columns="columns"
    row-key="id"
    class="w-full"
    :ui="({
      separator: 'hidden',
    th: 'py-4 text-slate-700 font-semibold',
    td: 'py-4 text-slate-600',
    tr: 'border-b border-slate-200 last:border-b-0'
  } as any)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

type RowSelectionState = Record<string, boolean>

const props = withDefaults(
  defineProps<{
    columns: any[]
    items: any[]
    rowSelection: RowSelectionState
  }>(),
  {
    columns: () => [],
    items: () => [],
    rowSelection: () => ({})
  }
)

const emit = defineEmits<{
  (e: 'update:rowSelection', value: RowSelectionState): void
}>()

const rowSelectionModel = computed<RowSelectionState>({
  get: () => props.rowSelection,
  set: (v) => emit('update:rowSelection', v)
})
</script>
