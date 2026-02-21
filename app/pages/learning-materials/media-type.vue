<template>
  <main class="min-h-screen bg-white py-6 font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">ประเภทสื่อ</h1>
        <p class="mt-1 text-sm text-slate-500">จัดการประเภทสื่อ / ประเด็นสื่อ / เลขลำดับสื่อ</p>
      </div>

      <MediaHeaderActions export-label="นำข้อมูลออก" create-label="เพิ่มประเภทสื่อ" @export="handleExport"
        @create="handleCreate" />
    </div>

    <div class="mx-auto max-w-6xl">
      <!-- Search + Filter -->
      <div class="-mx-8 px-8">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <MediaSearchFilter v-model:search="searchQuery"
              search-placeholder="ค้นหา (ประเภทสื่อ/ประเด็นสื่อ/เลขลำดับ)" />
          </div>

          <MediaFilter v-model:category="selectedType" :items="typeItems" placeholder="ประเภทสื่อ" />
        </div>
      </div>

      <!-- Table -->
      <section class="mb-6 mt-6 -mx-8 px-8">
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <MediaHQTable v-model:rowSelection="rowSelection" :columns="columns" :items="paginatedItems"
            @edit="handleEdit" @delete="handleDelete" />

          <!-- Footer -->
          <div
            class="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <span>{{ selectedCount }} of {{ totalItems }} row(s) selected.</span>
            <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
          </div>
        </div>
      </section>
    </div>

    <!-- ✅ CREATE modal: ตัด "เพิ่มโดย" ออก -->
    <CrudFormModal v-model:open="openCreate" title="เพิ่มประเภทสื่อ" description="กรอกข้อมูลเพื่อเพิ่มประเภทสื่อใหม่"
      submit-text="บันทึก" @submit="submitCreate">
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">รหัสสื่อ</div>
          <UInput v-model="formMediaOrder" size="xl" placeholder="เช่น MT-006" class="w-full" :ui="{
            base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
            root: 'rounded-2xl'
          }" />
        </div>
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ประเภทสื่อ</div>
          <UInput v-model="formMediaType" size="xl" placeholder="เช่น สื่อสิ่งพิมพ์" class="w-full" :ui="{
            base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
            root: 'rounded-2xl'
          }" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ประเด็นสื่อ</div>
          <UInput v-model="formMediaTopic" size="xl" placeholder="เช่น โภชนาการ" class="w-full" :ui="{
            base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
            root: 'rounded-2xl'
          }" />
        </div>

        <div>
          <UAlert title="หมายเหต" description="- อักษร 2 ตัวแรก คือ ประเภทของสื่อ
- ตัวเลข 4 หลักต่อมา คือ ประเด็นสื่อ
- ตัวเลข 2 หลักต่อมา คือ เลขลำดับสื่อ  
- ตัวเลข 2 หลักสุดท้าย คือ ปีที่ผลิตสื่อ
- หากมีการพิมพ์เพิ่มในปีนั้นๆ จะตามด้วย จุด เช่น พิมพ์ครั้งที่ 1 ปี 17 = xxxxxx-xx-17.1" color="warning"
            variant="outline" />
        </div>
      </div>

    </CrudFormModal>

    <!-- ✅ EDIT modal: ตัด "แก้ไขโดย" ออก -->
    <CrudFormModal v-model:open="openEdit" title="แก้ไขประเภทสื่อ" description="แก้ไขข้อมูลประเภทสื่อ"
      submit-text="บันทึก" @submit="submitEdit">
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ประเภทสื่อ</div>
          <UInput v-model="editMediaType" size="xl" placeholder="เช่น สื่อสิ่งพิมพ์" class="w-full" :ui="{
            base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
            root: 'rounded-2xl'
          }" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ประเด็นสื่อ</div>
          <UInput v-model="editMediaTopic" size="xl" placeholder="เช่น โภชนาการ" class="w-full" :ui="{
            base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
            root: 'rounded-2xl'
          }" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">เลขลำดับสื่อ</div>
          <UInput v-model="editMediaOrder" size="xl" placeholder="เช่น MT-006" class="w-full" :ui="{
            base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
            root: 'rounded-2xl'
          }" />
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

type RowSelectionState = Record<string, boolean>

type MediaTypeRow = {
  id: number
  mediaType: string
  mediaTopic: string
  mediaOrder: string
  createdAt: string
  createdBy: string
  updatedBy: string
}

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

// ✅ คนล็อกอิน (ผูก auth จริงทีหลัง)
const currentUserName = computed(() => {
  // ตัวอย่างจริง: return useAuth().user.value?.name ?? 'แอดมิน'
  return 'แอดมิน'
})

// ✅ helper: วันไทย + เวลา (เช่น 20 ม.ค. 2569 10:20)
const formatThaiDateTime = (d = new Date()) => {
  const date = new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(d)

  const time = new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d)

  return `${date} ${time}`
}

// ===== mock data (ไทย) =====
const allItems = ref<MediaTypeRow[]>([
  {
    id: 1,
    mediaType: 'สื่อสิ่งพิมพ์',
    mediaTopic: 'โภชนาการ',
    mediaOrder: 'MT-001',
    createdAt: '20 ม.ค. 2569 10:20',
    createdBy: 'แอดมิน',
    updatedBy: 'แอดมิน'
  },
  {
    id: 2,
    mediaType: 'สื่อสิ่งพิมพ์',
    mediaTopic: 'ความปลอดภัยทางถนน',
    mediaOrder: 'MT-002',
    createdAt: '20 ม.ค. 2569 11:05',
    createdBy: 'แอดมิน',
    updatedBy: 'เจ้าหน้าที่'
  },
  {
    id: 3,
    mediaType: 'สื่อดิจิทัล',
    mediaTopic: 'สุขภาพจิต',
    mediaOrder: 'MT-003',
    createdAt: '21 ม.ค. 2569 09:10',
    createdBy: 'แอดมิน',
    updatedBy: 'แอดมิน'
  },
  {
    id: 4,
    mediaType: 'บอร์ด/นิทรรศการ',
    mediaTopic: 'งดเหล้า/บุหรี่',
    mediaOrder: 'MT-004',
    createdAt: '21 ม.ค. 2569 14:30',
    createdBy: 'แอดมิน',
    updatedBy: 'เจ้าหน้าที่'
  },
  {
    id: 5,
    mediaType: 'สื่ออุปกรณ์กิจกรรม',
    mediaTopic: 'ออกกำลังกาย',
    mediaOrder: 'MT-005',
    createdAt: '22 ม.ค. 2569 16:45',
    createdBy: 'แอดมิน',
    updatedBy: 'แอดมิน'
  }
])

// header actions
const handleExport = () => console.log('export media-type')

// ===== CREATE modal =====
const openCreate = ref(false)
const formMediaType = ref('')
const formMediaTopic = ref('')
const formMediaOrder = ref('')

const handleCreate = () => {
  formMediaType.value = ''
  formMediaTopic.value = ''
  formMediaOrder.value = ''
  openCreate.value = true
}

const submitCreate = () => {
  const mediaType = formMediaType.value.trim()
  const mediaTopic = formMediaTopic.value.trim()
  const mediaOrder = formMediaOrder.value.trim()

  if (!mediaType || !mediaTopic || !mediaOrder) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1

  allItems.value.push({
    id: nextId,
    mediaType,
    mediaTopic,
    mediaOrder,
    createdAt: formatThaiDateTime(new Date()),
    createdBy: currentUserName.value,
    updatedBy: '-'
  })

  openCreate.value = false
}

// ===== EDIT modal =====
const openEdit = ref(false)
const editingId = ref<number | null>(null)

const editMediaType = ref('')
const editMediaTopic = ref('')
const editMediaOrder = ref('')

const handleEdit = (id: number) => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editMediaType.value = found.mediaType
  editMediaTopic.value = found.mediaTopic
  editMediaOrder.value = found.mediaOrder
  openEdit.value = true
}

const submitEdit = () => {
  if (editingId.value == null) return
  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const mediaType = editMediaType.value.trim()
  const mediaTopic = editMediaTopic.value.trim()
  const mediaOrder = editMediaOrder.value.trim()

  if (!mediaType || !mediaTopic || !mediaOrder) return

  item.mediaType = mediaType
  item.mediaTopic = mediaTopic
  item.mediaOrder = mediaOrder
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

// delete (mock)
const handleDelete = (id: number) => console.log('delete', id)

// search/filter
const searchQuery = ref('')
const selectedType = ref<string>('ทั้งหมด')

// dropdown filter items (ประเภทสื่อ)
const typeItems = computed<SelectMenuItem[]>(() => {
  const types = Array.from(new Set(allItems.value.map((d) => d.mediaType)))
  return ['ทั้งหมด', ...types]
})

// selection
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

// pagination
const currentPage = ref(1)
const pageSize = ref(10)

// filter
const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const t = selectedType.value

  return allItems.value.filter((it) => {
    const matchSearch =
      !q ||
      it.mediaType.toLowerCase().includes(q) ||
      it.mediaTopic.toLowerCase().includes(q) ||
      it.mediaOrder.toLowerCase().includes(q) ||
      it.createdBy.toLowerCase().includes(q) ||
      it.updatedBy.toLowerCase().includes(q)

    const matchType = !t || t === 'ทั้งหมด' || it.mediaType === t
    return matchSearch && matchType
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

watch([searchQuery, selectedType], () => {
  currentPage.value = 1
  rowSelection.value = {}
})

// columns
const columns: TableColumn<MediaTypeRow>[] = [
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
      h('span', { class: 'text-slate-500 text-[13px]' }, `#${row.getValue('id')}`),
    meta: { class: { th: 'w-20', td: 'w-20' } }
  },
  {
    accessorKey: 'mediaType',
    header: 'ประเภทสื่อ',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('mediaType')))
  },
  {
    accessorKey: 'mediaTopic',
    header: 'ประเด็นสื่อ',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('mediaTopic')))
  },
  {
    accessorKey: 'mediaOrder',
    header: 'เลขลำดับสื่อ',
    cell: ({ row }) =>
      h('span', { class: 'text-orange-500 text-[13px]' }, String(row.getValue('mediaOrder')))
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
      h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('createdBy')))
  },
  {
    accessorKey: 'updatedBy',
    header: 'อัปเดตโดย',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('updatedBy')))
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
