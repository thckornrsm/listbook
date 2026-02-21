<template>
  <main class="min-h-screen bg-white py-6 font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">จัดการประเภทผู้รับสื่อ</h1>
        <p class="mt-1 text-sm text-slate-500">รายการประเภทผู้รับสื่อสำหรับแบบฟอร์มการยืม</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="เพิ่มประเภทผู้รับสื่อ"
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
              search-placeholder="ค้นหาประเภทผู้รับสื่อ"
            />
          </div>

          <!-- placeholder filter -->
          <MediaFilter
            v-model:category="selectedFilter"
            :items="filterItems"
            placeholder="ตัวกรอง"
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
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- ✅ CREATE modal: ตัด "เพิ่มโดย" ออก -->
    <CrudFormModal
      v-model:open="openCreate"
      title="เพิ่มประเภทผู้รับสื่อ"
      description="กรอกข้อมูลเพื่อเพิ่มประเภทผู้รับสื่อใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ชื่อประเภทผู้รับสื่อ</div>
          <UInput
            v-model="formReceiverType"
            size="xl"
            placeholder="เช่น บุคคลทั่วไป"
            class="w-full"
            :ui="{
              base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
              root: 'rounded-2xl'
            }"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- ✅ EDIT modal: ตัด "แก้ไขโดย" ออก -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขประเภทผู้รับสื่อ"
      description="แก้ไขข้อมูลประเภทผู้รับสื่อ"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ชื่อประเภทผู้รับสื่อ</div>
          <UInput
            v-model="editReceiverType"
            size="xl"
            placeholder="เช่น บุคคลทั่วไป"
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

type ReceiverTypeItem = {
  id: number
  receiverType: string
  createdAt: string
  createdBy: string
  updatedBy: string
}

type RowSelectionState = Record<string, boolean>

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

// ✅ คนล็อกอิน (ผูก auth จริงทีหลัง)
const currentUserName = computed(() => {
  // ตัวอย่างจริง: return useAuth().user.value?.name ?? 'แอดมิน'
  return 'แอดมิน'
})

// ✅ mock data แบบไทย/ราชการ
const allItems = ref<ReceiverTypeItem[]>([
  { id: 1, receiverType: 'บุคคลทั่วไป', createdAt: '20 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'แอดมิน' },
  { id: 2, receiverType: 'หน่วยงาน/โรงเรียน', createdAt: '21 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 3, receiverType: 'อาจารย์/เจ้าหน้าที่', createdAt: '22 ม.ค. พ.ศ. 2569', createdBy: 'เจ้าหน้าที่คลังสื่อ', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 4, receiverType: 'องค์กรปกครองส่วนท้องถิ่น', createdAt: '25 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'แอดมิน' },
  { id: 5, receiverType: 'สถานพยาบาล/หน่วยบริการสุขภาพ', createdAt: '30 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'เจ้าหน้าที่คลังสื่อ' }
])

// actions
const handleExport = (): void => console.log('export excel (receiver-type)')
const handleDelete = (id: number): void => console.log('delete', id)

// ===== EDIT modal =====
const openEdit = ref(false)
const editingId = ref<number | null>(null)
const editReceiverType = ref('')

const handleEdit = (id: number): void => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editReceiverType.value = found.receiverType
  openEdit.value = true
}

const submitEdit = () => {
  if (editingId.value == null) return

  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const rt = editReceiverType.value.trim()
  if (!rt) return

  item.receiverType = rt
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

// ===== CREATE modal =====
const openCreate = ref(false)
const formReceiverType = ref('')

const handleCreate = () => {
  formReceiverType.value = ''
  openCreate.value = true
}

const submitCreate = () => {
  const receiverTypeText = formReceiverType.value.trim()
  if (!receiverTypeText) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const todayTH = new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(new Date())
  const createdAt = todayTH.replace('พ.ศ.', 'พ.ศ. ')

  allItems.value.push({
    id: nextId,
    receiverType: receiverTypeText,
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

const handlePageChange = (page: number): void => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch([searchQuery, selectedFilter], () => {
  currentPage.value = 1
  rowSelection.value = {}
})

// list rendering
const filteredItems = computed<ReceiverTypeItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return allItems.value.filter((item) => {
    const matchSearch =
      !q ||
      item.receiverType.toLowerCase().includes(q) ||
      String(item.id).includes(q) ||
      item.createdBy.toLowerCase().includes(q) ||
      item.updatedBy.toLowerCase().includes(q)

    return matchSearch
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<ReceiverTypeItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

// columns
const columns: TableColumn<ReceiverTypeItem>[] = [
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
    header: '#',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, `#${row.getValue('id')}`),
    meta: { class: { th: 'w-16', td: 'w-16' } }
  },
  {
    accessorKey: 'receiverType',
    header: 'ประเภทผู้รับสื่อ',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'whitespace-normal break-words leading-5 text-slate-700 text-[13px]' },
        String(row.getValue('receiverType'))
      )
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
