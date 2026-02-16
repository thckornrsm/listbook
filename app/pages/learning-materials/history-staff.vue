<!-- pages/learning-materials/history-staff.vue -->
<template>
  <main class="min-h-screen  bg-white py-6 font-[Kanit]">
    <!-- Header -->
    <div class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200
         px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between">
      <div class="flex flex-col gap-1">
        
        <h1 class="text-3xl font-semibold text-slate-900">
          ประวัติการใช้งานจากเจ้าหน้าที่
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          รวมข้อมูลการ ขอ-ยืม-คืน และแจ้งซ่อมจากทุกศูนย์ย่อย
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-6xl">
      <!-- Search + Category -->
      <MediaSearchFilter
        v-model:search="searchQuery"
        v-model:category="selectedCategory"
        :category-options="categoryOptions"
        search-placeholder="ค้นหา"
        category-placeholder="หมวดหมู่"
      />

      <!-- Table -->
      <section class="mb-6 mt-6 -mx-6 md:-mx-10 px-6 md:px-10">
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <MediaHQTable
            v-model:rowSelection="rowSelection"
            :columns="columns"
            :items="paginatedItems"
          />

          <!-- Footer -->
          <div
            class="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between"
          >
            <span>
              {{ Object.keys(rowSelection).length }} of {{ totalItems }} row(s) selected.
            </span>

            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, h } from 'vue'
import type { ColumnDef, RowSelectionState } from '@tanstack/vue-table'

import MediaHQTable from '~/components/learning-materials/MediaHQTable.vue'
import MediaSearchFilter from '~/components/learning-materials/MediaSearchFilter.vue'
import Pagination from '~/components/Pagination.vue'

definePageMeta({ layout: 'learning-materials' })

type StaffHistoryItem = {
  id: number
  date: string
  org: string
  staffCode: string
  staffName: string
  workPlace: string
  qty: number
  objective: string
  receiverType: string
  status: 'ยืม' | 'คืน' | string
}

type SelectOption = { value: string; label: string }
type TableRowCtx = { row: { original: StaffHistoryItem } }

// mock data (ปรับเป็นข้อมูลจริงทีหลังได้)
const allItems = ref<StaffHistoryItem[]>([
  {
    id: 1,
    date: 'Mar 10, 19:45',
    org: 'ศูนย์หลัก',
    staffCode: 'ST-HQ-005',
    staffName: 'นายมานะ ภารดี',
    workPlace: 'รพ.ราชาธิบดี',
    qty: 500,
    objective: 'ออกบูธรณรงค์สุขบุรี่',
    receiverType: 'ประชาชนทั่วไป',
    status: 'ยืม'
  }
])

// filters
const searchQuery = ref<string>('')
const selectedCategory = ref<string>('') // ในหน้านี้ใช้เป็น status ก็ได้

// selection
const rowSelection = ref<RowSelectionState>({})

// pagination
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)

// dropdown options (ใช้ status เป็นหมวดหมู่ ตามรูป)
const categoryOptions = computed<SelectOption[]>(() => {
  const set = new Set(allItems.value.map((d) => d.status))
  return Array.from(set).map((c) => ({ value: c, label: c }))
})

const filteredItems = computed<StaffHistoryItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()

  return allItems.value.filter((item) => {
    const matchSearch =
      !q ||
      String(item.staffName).toLowerCase().includes(q) ||
      String(item.staffCode).toLowerCase().includes(q) ||
      String(item.org).toLowerCase().includes(q) ||
      String(item.workPlace).toLowerCase().includes(q) ||
      String(item.objective).toLowerCase().includes(q)

    const matchCategory = !selectedCategory.value || item.status === selectedCategory.value
    return matchSearch && matchCategory
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<StaffHistoryItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const handlePageChange = (page: number): void => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const formatNumber = (n: number | string): string => Number(n).toLocaleString('en-US')

// columns (ตามรูป)
const columns: ColumnDef<StaffHistoryItem, unknown>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.date)
  },
  {
    accessorKey: 'org',
    header: 'ต้นสังกัด',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.org)
  },
  {
    accessorKey: 'staffCode',
    header: 'รหัสเจ้าหน้าที่',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-orange-500 font-semibold text-[13px]' }, row.original.staffCode)
  },
  {
    accessorKey: 'staffName',
    header: 'ชื่อเจ้าหน้าที่',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.staffName)
  },
  {
    accessorKey: 'workPlace',
    header: 'สถานที่ปฏิบัติงาน',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.workPlace)
  },
  {
    accessorKey: 'qty',
    header: 'จำนวนสื่อ',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, `${formatNumber(row.original.qty)} ชิ้น`)
  },
  {
    accessorKey: 'objective',
    header: 'วัตถุประสงค์',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.objective)
  },
  {
    accessorKey: 'receiverType',
    header: 'ประเภทผู้รับสื่อ',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.receiverType)
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }: TableRowCtx) =>
      h(
        'span',
        {
          class:
            'inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-normal ' +
            (row.original.status === 'ยืม'
              ? 'bg-blue-600 text-white'
              : row.original.status === 'คืน'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-700')
        },
        row.original.status
      )
  }
]
</script>

