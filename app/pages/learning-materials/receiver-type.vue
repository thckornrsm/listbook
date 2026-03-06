<template>
  <main class="bg-white font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between">
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
            <MediaSearchFilter v-model:search="searchQuery" search-placeholder="ค้นหาประเภทผู้รับสื่อ" />
          </div>

          <!-- filter: สถานะ -->
          <MediaSelect v-model:category="selectedFilter" :items="filterItems" placeholder="สถานะ" />

          <!-- ✅ Columns dropdown -->
          <MediaColumnToggle :table-ref="table" :exclude="['select','actions']" />
        </div>
      </div>

      <!-- Table -->
      <section class="mb-6 mt-6 -mx-8 px-8">
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <MediaHQTable
            ref="table"
            v-model:rowSelection="rowSelection"
            :columns="columns"
            :items="paginatedItems"
            @edit="handleEdit"
            @delete="handleDelete"
          />

          <!-- Footer -->
          <div
            class="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <span>{{ selectedCount }} of {{ totalItems }} row(s) selected.</span>
            <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
          </div>
        </div>
      </section>
    </div>

    <!-- CREATE modal -->
    <CrudFormModal
      v-model:open="openCreate"
      title="เพิ่มประเภทผู้รับสื่อ"
      description="กรอกข้อมูลเพื่อเพิ่มประเภทผู้รับสื่อใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <!-- ✅ UFormField + กรอบแดงตอน error -->
        <UFormField label="ชื่อประเภทผู้รับสื่อ" :error="formReceiverTypeError">
          <UInput
            v-model="formReceiverType"
            size="xl"
            placeholder="เช่น บุคคลทั่วไป"
            class="w-full"
            :ui="inputUiByError(!!formReceiverTypeError)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะการใช้งาน</div>
          <USelect
            :model-value="statusValueToThai(formStatus)"
            @update:model-value="(v: string) => (formStatus = statusThaiToValue(v))"
            :items="statusThaiItems"
            class="w-full"
            :ui="selectUi"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- EDIT modal -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขประเภทผู้รับสื่อ"
      description="แก้ไขข้อมูลประเภทผู้รับสื่อ"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <!-- ✅ UFormField + กรอบแดงตอน error -->
        <UFormField label="ชื่อประเภทผู้รับสื่อ" :error="editReceiverTypeError">
          <UInput
            v-model="editReceiverType"
            size="xl"
            placeholder="เช่น บุคคลทั่วไป"
            class="w-full"
            :ui="inputUiByError(!!editReceiverTypeError)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะการใช้งาน</div>
          <USelect
            :model-value="statusValueToThai(editStatus)"
            @update:model-value="(v: string) => (editStatus = statusThaiToValue(v))"
            :items="statusThaiItems"
            class="w-full"
            :ui="selectUi"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- DUPLICATE modal -->
    <CrudFormModal
      v-model:open="openDuplicate"
      title="สร้างซ้ำประเภทผู้รับสื่อ"
      description="ระบบคัดลอกข้อมูลจากรายการเดิม คุณสามารถแก้ไขก่อนบันทึกได้"
      submit-text="บันทึก"
      @submit="submitDuplicate"
    >
      <div class="space-y-4">
        <!-- ✅ UFormField + กรอบแดงตอน error -->
        <UFormField label="ชื่อประเภทผู้รับสื่อ" :error="duplicateReceiverTypeError">
          <UInput
            v-model="duplicateReceiverType"
            size="xl"
            placeholder="เช่น บุคคลทั่วไป"
            class="w-full"
            :ui="inputUiByError(!!duplicateReceiverTypeError)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะการใช้งาน</div>
          <USelect
            :model-value="statusValueToThai(duplicateStatus)"
            @update:model-value="(v: string) => (duplicateStatus = statusThaiToValue(v))"
            :items="statusThaiItems"
            class="w-full"
            :ui="selectUi"
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
import CrudFormModal from '~/components/common/CrudFormModal.vue'
import MediaSelect from '~/components/learning-materials/MediaSelect.vue'
import MediaColumnToggle from '~/components/learning-materials/MediaColumnToggle.vue'

definePageMeta({ layout: 'learning-materials' })

type ReceiverTypeStatus = 'active' | 'inactive'

type ReceiverTypeItem = {
  id: number
  receiverType: string
  status: ReceiverTypeStatus
  createdAt: string // ISO: YYYY-MM-DD
  createdBy: string
  updatedAt: string // ISO: YYYY-MM-DD
  updatedBy: string
}

type RowSelectionState = Record<string, boolean>

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')

/** ✅ สำคัญ: ref สำหรับ MediaHQTable เพื่ออ่าน tableApi */
const table = ref<any>(null)

// คนล็อกอิน
const currentUserName = computed(() => 'แอดมิน')

/**
 * ✅ UFormField :error ต้องเป็น string | boolean | undefined (ห้าม null)
 * เลยทำ error เป็น string | undefined และทำ UI กรอบแดงให้ UInput ตอนมี error
 */
const inputUiNormal = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  root: 'rounded-2xl'
}
const inputUiError = {
  base: 'bg-slate-50 ring-1 ring-red-500 focus-within:ring-2 focus-within:ring-red-500',
  root: 'rounded-2xl'
}
const inputUiByError = (hasError: boolean) => (hasError ? inputUiError : inputUiNormal)

const selectUi = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
}

/** ===== Helpers (วันที่ไทย พ.ศ.) ===== */
const pad2 = (n: number) => String(n).padStart(2, '0')
const toISODate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

const formatThaiBuddhistDate = (isoDate: string) => {
  const m = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return isoDate || '-'
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { dateStyle: 'medium' }).format(d)
}

const todayISO = computed(() => {
  const now = new Date()
  return toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
})

/** ===== status ===== */
const statusThaiItems: string[] = ['เปิดใช้งาน', 'ปิดใช้งาน']

const statusValueToThai = (value: ReceiverTypeStatus): string =>
  value === 'inactive' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'

const statusThaiToValue = (label: string): ReceiverTypeStatus =>
  label === 'ปิดใช้งาน' ? 'inactive' : 'active'

// filter items
const filterItems = computed<SelectMenuItem[]>(() => [
  { label: 'สถานะทั้งหมด', value: 'ทั้งหมด' },
  { label: 'เปิดใช้งาน', value: 'active' },
  { label: 'ปิดใช้งาน', value: 'inactive' }
])

/** ===== mock data ===== */
const allItems = ref<ReceiverTypeItem[]>([
  { id: 1, receiverType: 'บุคคลทั่วไป', status: 'active', createdAt: '2026-01-20', createdBy: 'แอดมิน', updatedAt: '2026-01-20', updatedBy: 'แอดมิน' },
  { id: 2, receiverType: 'หน่วยงาน/โรงเรียน', status: 'active', createdAt: '2026-01-21', createdBy: 'แอดมิน', updatedAt: '2026-01-21', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 3, receiverType: 'อาจารย์/เจ้าหน้าที่', status: 'inactive', createdAt: '2026-01-22', createdBy: 'เจ้าหน้าที่คลังสื่อ', updatedAt: '2026-01-22', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
  { id: 4, receiverType: 'องค์กรปกครองส่วนท้องถิ่น', status: 'active', createdAt: '2026-01-25', createdBy: 'แอดมิน', updatedAt: '2026-01-25', updatedBy: 'แอดมิน' },
  { id: 5, receiverType: 'สถานพยาบาล/หน่วยบริการสุขภาพ', status: 'inactive', createdAt: '2026-01-30', createdBy: 'แอดมิน', updatedAt: '2026-01-30', updatedBy: 'เจ้าหน้าที่คลังสื่อ' }
])

/** ===== actions ===== */
const handleExport = (): void => console.log('export excel (receiver-type)')
const handleDelete = (id: number): void => console.log('delete', id)

/** ===== validate (>=2, <=50, no dup) ===== */
const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()

const validateReceiverTypeText = (value: string): string | undefined => {
  const v = value.trim()
  if (v.length < 2) return 'ต้องกรอกอย่างน้อย 2 ตัวอักษร'
  if (v.length > 50) return 'ห้ามเกิน 50 ตัวอักษร'
  return undefined
}

const isDuplicateReceiverType = (value: string, excludeId?: number | null) => {
  const v = normalize(value)
  return allItems.value.some((it) => {
    if (excludeId != null && it.id === excludeId) return false
    return normalize(it.receiverType) === v
  })
}

// เติมเลข 2,3,4...
const makeDuplicateReceiverTypeName = (base: string) => {
  const raw = base.trim()
  if (!isDuplicateReceiverType(raw)) return raw

  let i = 2
  while (true) {
    const next = `${raw} ${i}`
    if (!isDuplicateReceiverType(next)) return next
    i++
  }
}

/** ✅ error ต้องเป็น string | undefined (ห้าม null) */
const formReceiverTypeError = ref<string | undefined>(undefined)
const editReceiverTypeError = ref<string | undefined>(undefined)
const duplicateReceiverTypeError = ref<string | undefined>(undefined)

/** ===== CREATE modal ===== */
const openCreate = ref(false)
const formReceiverType = ref('')
const formStatus = ref<ReceiverTypeStatus>('active')

watch(formReceiverType, (v) => {
  formReceiverTypeError.value = validateReceiverTypeText(v)
  if (!formReceiverTypeError.value && isDuplicateReceiverType(v)) {
    formReceiverTypeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const handleCreate = (): void => {
  formReceiverType.value = ''
  formStatus.value = 'active'
  formReceiverTypeError.value = undefined
  openCreate.value = true
}

const submitCreate = (): void => {
  const err = validateReceiverTypeText(formReceiverType.value)
  if (err) {
    formReceiverTypeError.value = err
    return
  }

  if (isDuplicateReceiverType(formReceiverType.value)) {
    formReceiverTypeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    return
  }

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const dateISO = todayISO.value

  allItems.value.push({
    id: nextId,
    receiverType: formReceiverType.value.trim(),
    status: formStatus.value,
    createdAt: dateISO,
    createdBy: currentUserName.value,
    updatedAt: dateISO,
    updatedBy: '-'
  })

  openCreate.value = false
}

/** ===== EDIT modal ===== */
const openEdit = ref(false)
const editingId = ref<number | null>(null)
const editReceiverType = ref('')
const editStatus = ref<ReceiverTypeStatus>('active')

watch([editReceiverType, editingId], () => {
  editReceiverTypeError.value = validateReceiverTypeText(editReceiverType.value)
  if (!editReceiverTypeError.value && isDuplicateReceiverType(editReceiverType.value, editingId.value)) {
    editReceiverTypeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const handleEdit = (id: number): void => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editReceiverType.value = found.receiverType
  editStatus.value = found.status
  editReceiverTypeError.value = undefined
  openEdit.value = true
}

const submitEdit = (): void => {
  if (editingId.value == null) return
  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const err = validateReceiverTypeText(editReceiverType.value)
  if (err) {
    editReceiverTypeError.value = err
    return
  }

  if (isDuplicateReceiverType(editReceiverType.value, editingId.value)) {
    editReceiverTypeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    return
  }

  item.receiverType = editReceiverType.value.trim()
  item.status = editStatus.value
  item.updatedAt = todayISO.value
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

/** ===== DUPLICATE modal ===== */
const openDuplicate = ref(false)
const duplicatingFromId = ref<number | null>(null)

const duplicateReceiverType = ref('')
const duplicateStatus = ref<ReceiverTypeStatus>('active')

watch([duplicateReceiverType, duplicatingFromId], () => {
  duplicateReceiverTypeError.value = validateReceiverTypeText(duplicateReceiverType.value)
  if (!duplicateReceiverTypeError.value && isDuplicateReceiverType(duplicateReceiverType.value)) {
    duplicateReceiverTypeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const handleDuplicate = (id: number): void => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  duplicatingFromId.value = id
  duplicateReceiverType.value = makeDuplicateReceiverTypeName(found.receiverType)
  duplicateStatus.value = found.status
  duplicateReceiverTypeError.value = undefined
  openDuplicate.value = true
}

const submitDuplicate = (): void => {
  const err = validateReceiverTypeText(duplicateReceiverType.value)
  if (err) {
    duplicateReceiverTypeError.value = err
    return
  }

  if (isDuplicateReceiverType(duplicateReceiverType.value)) {
    duplicateReceiverTypeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    return
  }

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const dateISO = todayISO.value

  allItems.value.push({
    id: nextId,
    receiverType: duplicateReceiverType.value.trim(),
    status: duplicateStatus.value,
    createdAt: dateISO,
    createdBy: currentUserName.value,
    updatedAt: dateISO,
    updatedBy: '-'
  })

  openDuplicate.value = false
  duplicatingFromId.value = null
}

/** ===== search/filter ===== */
const searchQuery = ref<string>('')
const selectedFilter = ref<string>('ทั้งหมด')

/** ===== selection ===== */
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

/** ===== pagination ===== */
const currentPage = ref<number>(1)
const pageSize = ref<number>(8)

const filteredItems = computed<ReceiverTypeItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const f = selectedFilter.value

  return allItems.value.filter((item) => {
    const matchSearch =
      !q ||
      item.receiverType.toLowerCase().includes(q) ||
      String(item.id).includes(q) ||
      item.createdBy.toLowerCase().includes(q) ||
      item.updatedBy.toLowerCase().includes(q) ||
      item.createdAt.includes(q) ||
      item.updatedAt.includes(q)

    const matchStatus = !f || f === 'ทั้งหมด' || item.status === f
    return matchSearch && matchStatus
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<ReceiverTypeItem[]>(() => {
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

/** ===== columns ===== */
const columns: TableColumn<ReceiverTypeItem>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h('div', { class: 'flex items-center justify-center' }, [
        h(UCheckbox as any, {
          modelValue: table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
          'aria-label': 'Select all'
        })
      ]),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-center' }, [
        h(UCheckbox as any, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'aria-label': 'Select row'
        })
      ]),
    meta: { class: { th: 'w-10 !px-0', td: 'w-10 !px-0' } }
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('id'))),
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
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const status = row.getValue('status') as ReceiverTypeStatus
      const map = {
        active: { color: 'success' as const, label: 'เปิดใช้งาน' },
        inactive: { color: 'neutral' as const, label: 'ปิดใช้งาน' }
      } as const
      const m = map[status] ?? { color: 'neutral' as const, label: String(status) }
      return h(UBadge as any, { variant: 'subtle', color: m.color }, () => m.label)
    },
    meta: { class: { th: 'w-32', td: 'w-32' } }
  },
  {
    accessorKey: 'createdAt',
    header: 'วันที่สร้าง',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, formatThaiBuddhistDate(String(row.getValue('createdAt')))),
    meta: { class: { th: 'w-28', td: 'w-28' } }
  },
  {
    accessorKey: 'createdBy',
    header: 'สร้างโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('createdBy'))),
    meta: { class: { th: 'w-32', td: 'w-32' } }
  },
  {
    accessorKey: 'updatedAt',
    header: 'วันที่อัปเดต',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, formatThaiBuddhistDate(String(row.getValue('updatedAt')))),
    meta: { class: { th: 'w-28', td: 'w-28' } }
  },
  {
    accessorKey: 'updatedBy',
    header: 'อัปเดตโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('updatedBy'))),
    meta: { class: { th: 'w-32', td: 'w-32' } }
  },
  {
    id: 'actions',
    header: 'จัดการ',
    meta: { class: { th: 'text-center', td: 'text-center' } },
    cell: ({ row }) => {
      const id = row.original.id

      const items = [
        [
          {
            label: 'สร้างซ้ำ',
            icon: 'i-heroicons-clipboard-20-solid',
            onSelect: () => handleDuplicate(id)
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

      return h('div', { class: 'flex justify-center items-center gap-1' }, [
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