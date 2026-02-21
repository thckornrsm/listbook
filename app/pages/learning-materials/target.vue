<template>
  <main class="min-h-screen bg-white py-6 font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">จัดการกลุ่มเป้าหมาย</h1>
        <p class="mt-1 text-sm text-slate-500">รายการกลุ่มเป้าหมายสำหรับแบบฟอร์มการยืม</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="เพิ่มกลุ่มเป้าหมาย"
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
              search-placeholder="ค้นหากลุ่มเป้าหมาย"
            />
          </div>

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
      title="เพิ่มกลุ่มเป้าหมาย"
      description="กรอกข้อมูลเพื่อเพิ่มกลุ่มเป้าหมายใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ชื่อกลุ่มเป้าหมาย</div>
          <UInput
            v-model="formTarget"
            size="xl"
            placeholder="เช่น นักเรียน"
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
      title="แก้ไขกลุ่มเป้าหมาย"
      description="แก้ไขข้อมูลกลุ่มเป้าหมาย"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ชื่อกลุ่มเป้าหมาย</div>
          <UInput
            v-model="editTarget"
            size="xl"
            placeholder="เช่น นักเรียน"
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

type TargetItem = {
  id: number
  target: string
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

// ✅ mock data
const allItems = ref<TargetItem[]>([
  { id: 1, target: 'นักเรียน', createdAt: '20 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'แอดมิน' },
  { id: 2, target: 'นักศึกษา', createdAt: '21 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 3, target: 'ครู/อาจารย์', createdAt: '22 ม.ค. พ.ศ. 2569', createdBy: 'เจ้าหน้าที่คลังสื่อ', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 4, target: 'ประชาชนทั่วไป', createdAt: '25 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'แอดมิน' },
  { id: 5, target: 'เจ้าหน้าที่ภาครัฐ/หน่วยงาน', createdAt: '30 ม.ค. พ.ศ. 2569', createdBy: 'แอดมิน', updatedBy: 'เจ้าหน้าที่คลังสื่อ' }
])

// actions
const handleExport = (): void => console.log('export excel (target)')
const handleDelete = (id: number): void => console.log('delete', id)

// ===== CREATE =====
const openCreate = ref(false)
const formTarget = ref('')

const handleCreate = (): void => {
  formTarget.value = ''
  openCreate.value = true
}

const submitCreate = (): void => {
  const targetText = formTarget.value.trim()
  if (!targetText) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const todayTH = new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(new Date())
  const createdAt = todayTH.replace('พ.ศ.', 'พ.ศ. ') // กันชิดติดกันบางเครื่อง

  allItems.value.push({
    id: nextId,
    target: targetText,
    createdAt,
    createdBy: currentUserName.value,
    updatedBy: '-'
  })

  openCreate.value = false
}

// ===== EDIT =====
const openEdit = ref(false)
const editingId = ref<number | null>(null)
const editTarget = ref('')

const handleEdit = (id: number): void => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editTarget.value = found.target
  openEdit.value = true
}

const submitEdit = (): void => {
  if (editingId.value == null) return

  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const targetText = editTarget.value.trim()
  if (!targetText) return

  item.target = targetText
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

// search/filter
const searchQuery = ref<string>('')

// filter placeholder
const selectedFilter = ref<string>('ทั้งหมด')
const filterItems = computed<SelectMenuItem[]>(() => ['ทั้งหมด'])

// selection
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

// pagination
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)

const filteredItems = computed<TargetItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return allItems.value.filter((item) => {
    const matchSearch =
      !q ||
      item.target.toLowerCase().includes(q) ||
      String(item.id).includes(q) ||
      item.createdBy.toLowerCase().includes(q) ||
      item.updatedBy.toLowerCase().includes(q)
    return matchSearch
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<TargetItem[]>(() => {
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
const columns: TableColumn<TargetItem>[] = [
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
    accessorKey: 'target',
    header: 'กลุ่มเป้าหมาย',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'whitespace-normal break-words leading-5 text-slate-700 text-[13px]' },
        String(row.getValue('target'))
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
            onSelect: async () => {
              await navigator.clipboard.writeText(String(id))
            }
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
