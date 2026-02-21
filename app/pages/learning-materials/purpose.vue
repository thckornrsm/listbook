<template>
  <main class="min-h-screen bg-white py-6 font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">จัดการวัตถุประสงค์</h1>
        <p class="mt-1 text-sm text-slate-500">รายการวัตถุประสงค์สำหรับแบบฟอร์มการยืม</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="เพิ่มวัตถุประสงค์"
        @export="handleExport"
        @create="handleCreate"
      />
    </div>

    <div class="mx-auto max-w-6xl">
      <!-- Search + Filter -->
      <div class="-mx-8 px-8">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <MediaSearchFilter v-model:search="searchQuery" search-placeholder="ค้นหาวัตถุประสงค์" />
          </div>

          <MediaFilter v-model:category="selectedFilter" :items="filterItems" placeholder="ตัวกรอง" />
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

    <!-- ✅ Create: ตัด "เพิ่มโดย" ออก -->
    <CrudFormModal
      v-model:open="openCreate"
      title="เพิ่มวัตถุประสงค์"
      description="กรอกข้อมูลเพื่อเพิ่มวัตถุประสงค์ใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ชื่อวัตถุประสงค์</div>
          <UInput
            v-model="formPurpose"
            size="xl"
            placeholder="เช่น ศึกษาดูงาน"
            class="w-full"
            :ui="{
              base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
              root: 'rounded-2xl'
            }"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- ✅ Edit: ตัด "แก้ไขโดย" ออก -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขวัตถุประสงค์"
      description="แก้ไขข้อมูลวัตถุประสงค์"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ชื่อวัตถุประสงค์</div>
          <UInput
            v-model="editPurpose"
            size="xl"
            placeholder="เช่น ศึกษาดูงาน"
            class="w-full"
            :ui="{
              base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
              root: 'rounded-2xl'
            }"
          />
        </div>
      </div>
    </CrudFormModal>
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
import CrudFormModal from '~/components/common/CrudFormModal.vue'

definePageMeta({ layout: 'learning-materials' })

type PurposeItem = {
  id: number
  purpose: string
  createdAt: string
  createdBy: string
  updatedBy: string
}

type RowSelectionState = Record<string, boolean>

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

// ✅ คนที่ล็อกอิน (เอาไปผูกกับ auth จริงทีหลัง)
const currentUserName = computed(() => {
  // ตัวอย่าง: return useAuth().user.value?.name ?? 'แอดมิน'
  return 'แอดมิน'
})

// mock data
const allItems = ref<PurposeItem[]>([
  { id: 1, purpose: 'ศึกษาดูงาน', createdAt: '20 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'แอดมิน' },
  { id: 2, purpose: 'ใช้ประกอบการสอน', createdAt: '21 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 3, purpose: 'วิจัย/เก็บข้อมูล', createdAt: '22 ม.ค. พ.ศ. 2569', createdBy: 'เจ้าหน้าที่คลังสื่อ', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 4, purpose: 'จัดกิจกรรมภายในหน่วยงาน', createdAt: '25 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'แอดมิน' },
  { id: 5, purpose: 'จัดกิจกรรมส่งเสริมสุขภาพ', createdAt: '30 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 6, purpose: 'อื่น ๆ (โปรดระบุรายละเอียดเพิ่มเติม)', createdAt: '05 ก.พ. พ.ศ. 2569', createdBy: 'เจ้าหน้าที่คลังสื่อ', updatedBy: 'แอดมิน' }
])

// actions
const handleExport = (): void => console.log('export excel (purpose)')
const handleDelete = (id: number): void => console.log('delete', id)

// ===== EDIT modal =====
const openEdit = ref(false)
const editingId = ref<number | null>(null)
const editPurpose = ref('')

// ✅ เปิด modal แก้ไข (ไม่ต้องกรอกคนแก้)
const handleEdit = (id: number): void => {
  const found = allItems.value.find(i => i.id === id)
  if (!found) return

  editingId.value = id
  editPurpose.value = found.purpose
  openEdit.value = true
}

// ✅ submit แก้ไข: updatedBy = account ปัจจุบัน
const submitEdit = () => {
  if (editingId.value == null) return

  const item = allItems.value.find(i => i.id === editingId.value)
  if (!item) return

  const p = editPurpose.value.trim()
  if (!p) return

  item.purpose = p
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

// ===== CREATE modal =====
const openCreate = ref(false)
const formPurpose = ref('')

// ✅ เปิด modal ตอนกด "เพิ่มวัตถุประสงค์"
const handleCreate = () => {
  formPurpose.value = ''
  openCreate.value = true
}

// ✅ submit เพิ่ม: createdBy = account ปัจจุบัน, updatedBy = '-'
const submitCreate = () => {
  const purposeText = formPurpose.value.trim()
  if (!purposeText) return

  const nextId = Math.max(0, ...allItems.value.map(i => i.id)) + 1
  const todayTH = new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(new Date())
  const createdAt = todayTH.replace('พ.ศ.', 'พ.ศ. ')

  allItems.value.push({
    id: nextId,
    purpose: purposeText,
    createdAt,
    createdBy: currentUserName.value,
    updatedBy: '-'
  })

  openCreate.value = false
}

// search/filter
const searchQuery = ref<string>('')

// filter (placeholder)
const selectedFilter = ref<string>('ทั้งหมด')
const filterItems = computed<SelectMenuItem[]>(() => ['ทั้งหมด'])

// selection
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

// pagination
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)

const filteredItems = computed<PurposeItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return allItems.value.filter((item) => {
    const matchSearch =
      !q ||
      item.purpose.toLowerCase().includes(q) ||
      String(item.id).includes(q) ||
      item.createdBy.toLowerCase().includes(q) ||
      item.updatedBy.toLowerCase().includes(q)
    return matchSearch
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<PurposeItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const handlePageChange = (page: number): void => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch([searchQuery, selectedFilter], () => {
  currentPage.value = 1
  rowSelection.value = {}
})

// columns
const columns: TableColumn<PurposeItem>[] = [
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
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, `${row.getValue('id')}`),
    meta: { class: { th: 'w-16', td: 'w-16' } }
  },
  {
    accessorKey: 'purpose',
    header: 'วัตถุประสงค์',
    cell: ({ row }) =>
      h('div', { class: 'whitespace-normal break-words leading-5 text-slate-700 text-[13px]' }, String(row.getValue('purpose')))
  },
  {
    accessorKey: 'createdAt',
    header: 'วันที่สร้าง',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('createdAt')))
  },
  {
    accessorKey: 'createdBy',
    header: 'สร้างโดย',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('createdBy')))
  },
  {
    accessorKey: 'updatedBy',
    header: 'อัปเดตโดย',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('updatedBy')))
  },
  {
    id: 'actions',
    header: 'จัดการ',
    // meta: { class: { th: 'text-right', td: 'text-right' } },
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
          { items, content: { align: 'end' }, ui: { content: 'w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1' } },
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
