<template>
  <main class="min-h-screen bg-white py-6 font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">แจ้งซ่อม</h1>
        <p class="mt-1 text-sm text-slate-500">รายการแจ้งซ่อมสื่อทั้งหมด</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="สร้างรายการแจ้งซ่อม"
        @export="handleExport"
        @create="handleCreate"
      />
    </div>

    <div class="mx-auto max-w-6xl">
      <!-- Search + Filter -->
      <div class="-mx-8 px-8">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <MediaSearchFilter
              v-model:search="searchQuery"
              search-placeholder="ค้นหา (รหัสแจ้งซ่อม/รหัสสื่อ/ชื่อสื่อ/อาการชำรุด)"
            />
          </div>

          <MediaFilter
            v-model:category="selectedStatus"
            :items="statusItems"
            placeholder="สถานะ"
          />
        </div>
      </div>

      <!-- Table -->
      <section class="mb-6 mt-6 -mx-8 px-8">
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
            <span>{{ selectedCount }} of {{ totalItems }} row(s) selected.</span>
            <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, h, resolveComponent, watch } from 'vue'
import type { TableColumn, SelectMenuItem } from '@nuxt/ui'

import Pagination from '~/components/Pagination.vue'
import MediaHQTable from '~/components/learning-materials/MediaHQTable.vue'
import MediaSearchFilter from '~/components/learning-materials/MediaSearchFilter.vue'
import MediaHeaderActions from '~/components/learning-materials/MediaHeaderActions.vue'
import MediaFilter from '~/components/learning-materials/MediaFilter.vue'

definePageMeta({ layout: 'learning-materials' })

type RowSelectionState = Record<string, boolean>

type RepairStatus = 'รอดำเนินการ' | 'กำลังซ่อม' | 'ซ่อมเสร็จ' | 'ยกเลิก/ทิ้ง'

type RepairRow = {
  id: number
  reportedAt: string        // ✅ ไทย เช่น "10 มี.ค. 2569 19:45"
  repairCode: string        // REP-001
  mediaCode: string         // TH-001
  mediaName: string
  symptom: string
  status: RepairStatus
  eta: string               // "-" | "อีก 7 วัน"
}

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')

// ===== mock data (ตามรูป + วันที่ไทย) =====
const allItems = ref<RepairRow[]>([
  {
    id: 1,
    reportedAt: '10 มี.ค. 2569 19:45',
    repairCode: 'REP-001',
    mediaCode: 'TH-001',
    mediaName: 'คู่มือเลิกบุหรี่ภาคประชาชน',
    symptom: 'ฉีกขาด/ปกหาย',
    status: 'รอดำเนินการ',
    eta: '-'
  },
  {
    id: 2,
    reportedAt: '10 มี.ค. 2569 15:55',
    repairCode: 'REP-002',
    mediaCode: 'TH-002',
    mediaName: 'บอร์ดเกมครอบครัวสุขสันต์',
    symptom: 'การ์ดหาย 3 ใบ',
    status: 'กำลังซ่อม',
    eta: 'อีก 7 วัน'
  },
  {
    id: 3,
    reportedAt: '11 มี.ค. 2569 15:34',
    repairCode: 'REP-003',
    mediaCode: 'TH-003',
    mediaName: 'โปสเตอร์ความปลอดภัย',
    symptom: 'สีซีดจาง',
    status: 'ซ่อมเสร็จ',
    eta: '-'
  },
  {
    id: 4,
    reportedAt: '11 มี.ค. 2569 15:36',
    repairCode: 'REP-004',
    mediaCode: 'TH-004',
    mediaName: 'แผ่นพับลดพุง',
    symptom: 'เปียกน้ำ/ชำรุดหนัก',
    status: 'ยกเลิก/ทิ้ง',
    eta: '-'
  }
])

// header actions
const handleExport = () => console.log('export repair')
const handleCreate = () => console.log('create repair')

// search/filter
const searchQuery = ref('')
const selectedStatus = ref<string>('ทั้งหมด')

const statusItems = computed<SelectMenuItem[]>(() => [
  'ทั้งหมด',
  'รอดำเนินการ',
  'กำลังซ่อม',
  'ซ่อมเสร็จ',
  'ยกเลิก/ทิ้ง'
])

// selection
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

// pagination
const currentPage = ref(1)
const pageSize = ref(5) // ✅ กำหนด “กี่แถวต่อหน้า” ที่นี่

// filter
const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const s = selectedStatus.value

  return allItems.value.filter((it) => {
    const matchSearch =
      !q ||
      it.repairCode.toLowerCase().includes(q) ||
      it.mediaCode.toLowerCase().includes(q) ||
      it.mediaName.toLowerCase().includes(q) ||
      it.symptom.toLowerCase().includes(q)

    const matchStatus = !s || s === 'ทั้งหมด' || it.status === s
    return matchSearch && matchStatus
  })
})

const totalItems = computed(() => filteredItems.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1
  rowSelection.value = {}
})

// row actions
const handleEdit = (id: number) => console.log('edit', id)
const handleDelete = (id: number) => console.log('delete', id)

// status badge style (ให้เหมือนรูป)
const statusBadge = (status: RepairStatus) => {
  if (status === 'รอดำเนินการ') {
    return { label: 'รอดำเนินการ', class: 'bg-orange-50 text-orange-600 ring-1 ring-orange-200' }
  }
  if (status === 'กำลังซ่อม') {
    return { label: 'กำลังซ่อม', class: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' }
  }
  if (status === 'ซ่อมเสร็จ') {
    return { label: 'ซ่อมเสร็จ', class: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' }
  }
  return { label: 'ยกเลิก/ทิ้ง', class: 'bg-red-50 text-red-600 ring-1 ring-red-200' }
}

// columns
const columns: TableColumn<RepairRow>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox as any, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox as any, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      }),
    meta: { class: { th: 'w-10', td: 'w-10' } }
  },

  {
    accessorKey: 'reportedAt',
    header: 'วันที่แจ้ง',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('reportedAt')))
  },

  {
    accessorKey: 'repairCode',
    header: 'รหัสแจ้งซ่อม',
    cell: ({ row }) =>
      h('span', { class: 'text-orange-500  text-[13px]' }, String(row.getValue('repairCode')))
  },

  {
    accessorKey: 'mediaCode',
    header: 'รหัสสื่อ',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('mediaCode')))
  },

  {
    accessorKey: 'mediaName',
    header: 'ชื่อสื่อ',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('mediaName')))
  },

  {
    accessorKey: 'symptom',
    header: 'อาการชำรุด',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('symptom')))
  },

  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const s = row.getValue('status') as RepairStatus
      const b = statusBadge(s)
      return h(UBadge as any, { class: b.class, variant: 'subtle' }, () => b.label)
    }
  },

  {
    accessorKey: 'eta',
    header: 'คาดว่าจะเสร็จ',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('eta')))
  },

  {
    id: 'actions',
    header: 'จัดการ',
    meta: { class: { th: 'text-right', td: 'text-right' } },
    cell: ({ row }) => {
      const id = row.original.id

      const items = [
        [
          {
            label: 'สร้างซ้ำ',
            icon: 'i-heroicons-clipboard-20-solid',
            onSelect: async () => await navigator.clipboard.writeText(String(id))
          }
        ],
        [
          {
            label: 'ลบออก',
            icon: 'i-heroicons-trash-20-solid',
            onSelect: () => handleDelete(id),
            class: 'text-red-600'
          }
        ]
      ]

      return h('div', { class: 'flex justify-end items-center gap-1' }, [
        h(UButton as any, {
          icon: 'i-heroicons-pencil-square-20-solid',
          variant: 'ghost',
          color: 'neutral',
          class: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg',
          'aria-label': 'Edit',
          onClick: () => handleEdit(id)
        }),

        h(
          UDropdownMenu as any,
          {
            items,
            content: { align: 'end' },
            ui: { content: 'w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1' }
          },
          () =>
            h(UButton as any, {
              icon: 'i-heroicons-ellipsis-vertical-20-solid',
              variant: 'ghost',
              color: 'neutral',
              class: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg',
              'aria-label': 'More actions'
            })
        )
      ])
    }
  }
]
</script>
