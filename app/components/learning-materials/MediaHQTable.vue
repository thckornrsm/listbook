<!-- MediaHQTable.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, h, resolveComponent, ref } from 'vue'
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

/** ✅ เปิดระบบซ่อน/แสดงคอลัมน์ (default = แสดงทั้งหมด) */
const columnVisibility = ref<Record<string, boolean>>({})

/** ✅ อ้างอิง UTable เพื่อ expose tableApi ให้ข้างนอก */
const table = ref<any>(null)

/** ✅ สำคัญมาก: คืน “ของจริง” ไม่ใช่ ref */
const getTableApi = () => table.value?.tableApi?.value ?? table.value?.tableApi
const tableApi = computed(() => table.value?.tableApi?.value ?? table.value?.tableApi)

defineExpose({ getTableApi, tableApi })

/** กันซ้ำถ้าหน้า parent ใส่ select มาเอง */
const cleanedColumns = computed(() => (props.columns || []).filter((c: any) => c?.id !== 'select'))

const columnsWithSelect = computed<TableColumn<T>[]>(() => {
  if (!props.selectable) return cleanedColumns.value

  const selectCol: TableColumn<T> = {
    id: 'select',
    header: ({ table }: any) =>
      h('div', { class: 'flex items-center justify-center', onClick: (e: MouseEvent) => e.stopPropagation() }, [
        h(UCheckbox as any, {
          modelValue: table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
          'aria-label': 'Select all',
          onClick: (e: MouseEvent) => e.stopPropagation()
        })
      ]),
    cell: ({ row }: any) =>
      h('div', { class: 'flex items-center justify-center', onClick: (e: MouseEvent) => e.stopPropagation() }, [
        h(UCheckbox as any, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'aria-label': 'Select row',
          onClick: (e: MouseEvent) => e.stopPropagation()
        })
      ]),
    meta: {
      class: {
        th: 'w-10 !px-0 text-center align-middle',
        td: 'w-10 !px-0 text-center align-middle'
      }
    }
  }

  return [selectCol, ...cleanedColumns.value]
})

function onSelect(_e: Event, row: TableRow<T>) {
  row.toggleSelected(!row.getIsSelected())
  emit('select', row.original)
}

const ui = {
  wrapper: 'w-full overflow-x-auto',
  base: 'min-w-full w-max',
  thead: 'bg-white',
  th: 'px-2 py-4 border-b border-slate-200 text-slate-900 font-semibold text-[13px] align-middle whitespace-nowrap',
  td: 'px-2 py-2 border-b border-slate-200 text-slate-600 text-[13px] align-middle whitespace-nowrap',
  tr: 'hover:bg-slate-50/50'
}
</script>

<template>
  <div class="bg-white">
    <UTable
      ref="table"
      v-model:row-selection="rowSelectionModel"
      v-model:column-visibility="columnVisibility"
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