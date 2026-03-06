<!-- MediaColumnToggle.vue -->
<template>
  <UDropdownMenu :items="menuItems" :content="{ align: 'end' }">
    <UButton
      label="คอลัมน์"
      color="neutral"
      variant="outline"
      trailing-icon="i-lucide-chevron-down"
      class="h-10 w-44 justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-700 hover:bg-slate-50 active:bg-white"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { upperFirst } from 'scule'

const props = defineProps<{
  tableRef: any
  exclude?: string[]
}>()

const excludeSet = computed(() => new Set(props.exclude ?? []))

const inst = computed(() => {
  const t = props.tableRef
  return t && typeof t === 'object' && 'value' in t ? t.value : t
})

const api = computed(() => {
  const t = inst.value
  if (!t) return null

  const raw = t.getTableApi?.() ?? t.tableApi?.value ?? t.tableApi ?? null
  return raw && typeof raw === 'object' && 'value' in raw ? (raw as any).value : raw
})

/** ✅ ดึงชื่อคอลัมน์ให้เป็นภาษาไทยตาม header ของตาราง (ถ้าเป็น string) */
const getColumnLabel = (c: any) => {
  const h = c?.columnDef?.header
  if (typeof h === 'string') return h
  return upperFirst(c.id)
}

const menuItems = computed(() => {
  const a = api.value
  if (!a) return []

  return a
    .getAllColumns()
    .filter((c: any) => c.getCanHide?.() && !excludeSet.value.has(c.id))
    .map((c: any) => ({
      label: getColumnLabel(c),
      type: 'checkbox' as const,
      checked: c.getIsVisible(),
      onUpdateChecked: (checked: boolean) => {
        a.getColumn(c.id)?.toggleVisibility(!!checked)
      },
      onSelect: (e: Event) => e.preventDefault()
    }))
})
</script>