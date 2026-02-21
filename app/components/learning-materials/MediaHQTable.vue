<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, h, resolveComponent } from 'vue'
import type { TableColumn, TableRow } from '@nuxt/ui'

type RowSelectionState = Record<string, boolean>
const UCheckbox = resolveComponent('UCheckbox')

const props = withDefaults(
  defineProps<{
    columns: TableColumn<T>[]
    items: T[]
    rowSelection: RowSelectionState
    rowKey?: keyof T | string
    selectable?: boolean
  }>(),
  { columns: () => [], items: () => [], rowSelection: () => ({}), rowKey: 'id', selectable: true }
)

const emit = defineEmits<{
  (e: 'update:rowSelection', v: RowSelectionState): void
  (e: 'select', row: T): void
}>()

const rowSelectionModel = computed<RowSelectionState>({
  get: () => props.rowSelection,
  set: (v) => emit('update:rowSelection', v)
})

const cleanedColumns = computed(() =>
  (props.columns || []).filter((c: any) => c?.id !== 'select')
)

const columnsWithSelect = computed<TableColumn<T>[]>(() => {
  if (!props.selectable) return cleanedColumns.value

  const selectCol: TableColumn<T> = {
    id: 'select',
    header: ({ table }: any) =>
      h(UCheckbox as any, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all',
        onClick: (e: MouseEvent) => e.stopPropagation()
      }),
    cell: ({ row }: any) =>
      h(UCheckbox as any, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row',
        onClick: (e: MouseEvent) => e.stopPropagation()
      }),
    meta: { class: { th: 'w-10', td: 'w-10' } }
  }

  return [selectCol, ...cleanedColumns.value]
})

function onSelect(_e: Event, row: TableRow<T>) {
  row.toggleSelected(!row.getIsSelected())
  emit('select', row.original)
}

/** ✅ ui เป็น object ตรงๆ ตาม TableUi */
const ui = {
  wrapper: 'w-full overflow-x-auto',
  base: 'min-w-full w-max',
  thead: 'bg-white',
  th: 'h-11 border-b border-slate-200 text-slate-900 font-semibold text-[13px] px-3 align-middle whitespace-nowrap',
  td: 'h-12 border-b border-slate-200 text-slate-600 text-[13px] px-3 align-middle whitespace-nowrap',
  tr: 'hover:bg-slate-50/50'
}
</script>

<template>
  <div class="bg-white">
    <UTable
      v-model:row-selection="rowSelectionModel"
      :data="items"
      :columns="columnsWithSelect"
      :row-key="(rowKey as string)"
      :ui="ui"
      @select="onSelect"
    />
  </div>
</template>

<style scoped>
:deep(thead tr.absolute) { display: none !important; }
:deep(table) { width: max-content; min-width: 100%; }
</style>
