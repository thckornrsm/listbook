<!-- pages/learning-materials/history-external.vue -->
<template>
  <main class="min-h-screen  bg-white py-6 font-[Kanit]">
    <!-- Header (ทำแบบเดียวกับหน้าแรก) -->
    <div class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200
         px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between">
      <div class="flex flex-col gap-1">
    
        <h1 class="text-3xl font-semibold text-slate-900">
          ประวัติการใช้งานจากบุคคลภายนอก
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
            @edit="handleEdit"
            @delete="handleDelete"
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
import { computed, ref, h, resolveComponent } from 'vue'
import type { Ref } from 'vue'
import type { RowSelectionState, ColumnDef } from '@tanstack/vue-table'

import MediaHQTable from '~/components/learning-materials/MediaHQTable.vue'
import MediaSearchFilter from '~/components/learning-materials/MediaSearchFilter.vue'
import Pagination from '~/components/Pagination.vue'

definePageMeta({ layout: 'learning-materials' })

type MediaItem = {
  id: number
  date: string
  code: string
  name: string
  category: string
  total: number
  pack: string
  location: string
}

type SelectOption = { value: string; label: string }
type TableRowCtx = { row: { original: MediaItem } }

/**
 * mock data (หน้านี้คุณค่อยเปลี่ยนเป็นข้อมูลจริงทีหลังได้)
 * คอลัมน์ยังใช้โครงเดียวกับ MediaHQTable เดิม (date, code, name, category, total, pack, location)
 */
const allItems = ref<MediaItem[]>([
  { id: 1, date: 'Mar 10, 19:45', code: 'EXT-001', name: 'ขอยืมสื่อชุดนิทรรศการ', category: 'ขอยืม', total: 1, pack: '-', location: 'ศูนย์ย่อย A' },
  { id: 2, date: 'Mar 10, 15:55', code: 'EXT-002', name: 'คืนสื่อโปสเตอร์ชุด "ลดพุง"', category: 'คืน', total: 1, pack: '-', location: 'ศูนย์ย่อย B' },
  { id: 3, date: 'Mar 09, 10:20', code: 'EXT-003', name: 'แจ้งซ่อมสื่อสติกเกอร์', category: 'แจ้งซ่อม', total: 1, pack: '-', location: 'ศูนย์ย่อย C' },
  { id: 4, date: 'Mar 08, 14:30', code: 'EXT-004', name: 'ขอ-ยืมแผ่นพับรณรงค์', category: 'ขอยืม', total: 2, pack: '-', location: 'ศูนย์ย่อย A' },
  { id: 5, date: 'Mar 08, 09:15', code: 'EXT-005', name: 'คืนหนังสือภาพเด็ก', category: 'คืน', total: 1, pack: '-', location: 'ศูนย์ย่อย D' }
])

// filter
const searchQuery = ref<string>('')
const selectedCategory = ref<string>('')

// selection
const rowSelection = ref<RowSelectionState>({})

// pagination
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)

const categoryOptions = computed<SelectOption[]>(() => {
  const set = new Set(allItems.value.map((d) => d.category))
  return Array.from(set).map((c) => ({ value: c, label: c }))
})

const filteredItems = computed<MediaItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()

  return allItems.value.filter((item) => {
    const matchSearch =
      !q ||
      String(item.name).toLowerCase().includes(q) ||
      String(item.code).toLowerCase().includes(q) ||
      String(item.location).toLowerCase().includes(q)

    const matchCategory = !selectedCategory.value || item.category === selectedCategory.value
    return matchSearch && matchCategory
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<MediaItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const handlePageChange = (page: number): void => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// actions
const handleEdit = (id: number): void => console.log('edit', id)
const handleDelete = (id: number): void => console.log('delete', id)

// columns
const formatNumber = (n: number | string): string => Number(n).toLocaleString('en-US')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: ColumnDef<MediaItem, unknown>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.date)
  },
  {
    accessorKey: 'code',
    header: 'รหัสสื่อ',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-orange-500 font-semibold text-[13px]' }, row.original.code)
  },
  {
    accessorKey: 'name',
    header: 'ชื่อรายการ',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.name)
  },
  {
    accessorKey: 'category',
    header: 'หมวดหมู่',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.category)
  },
  {
    accessorKey: 'total',
    header: 'จำนวนทั้งหมด',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, formatNumber(row.original.total))
  },
  {
    accessorKey: 'pack',
    header: 'จำนวนแพ็ค',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.pack)
  },
  {
    accessorKey: 'location',
    header: 'ศูนย์ย่อย',
    cell: ({ row }: TableRowCtx) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.original.location)
  },
  {
    id: 'actions',
    header: 'จัดการ',
    cell: ({ row }: TableRowCtx) => {
      const id = row.original.id
      const items = [[
        { label: 'Edit', icon: 'i-heroicons-pencil-square-20-solid', click: () => handleEdit(id) },
        { label: 'Delete', icon: 'i-heroicons-trash-20-solid', click: () => handleDelete(id) }
      ]]

      return h(
        'div',
        { class: 'flex justify-end' },
        h(
          UDropdownMenu,
          { items, content: { align: 'end' }, ui: { content: 'w-40' } } as any,
          () =>
            h(UButton as any, {
              icon: 'i-heroicons-ellipsis-vertical-20-solid',
              variant: 'ghost',
              color: 'neutral',
              class: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg',
              'aria-label': 'Actions'
            })
        )
      )
    }
  }
]

// (ถ้าคุณใช้ใน template)
const items: Ref<MediaItem[]> = paginatedItems
</script>

