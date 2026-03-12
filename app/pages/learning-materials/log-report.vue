<template>
  <main class="bg-white font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 pb-4 md:flex-row md:items-start md:justify-between md:px-10"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">ประวัติการส่งข้อความ</h1>
        <p class="mt-1 text-sm text-slate-500">จัดการข้อมูลประวัติการส่งข้อความของระบบ</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="เพิ่มประวัติการส่งข้อความ"
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
              search-placeholder="ค้นหาประวัติการส่งข้อความ"
            />
          </div>

          <MediaSelect
            v-model:category="selectedFilter"
            :items="filterItems"
            placeholder="ประเภท"
          />

          <MediaColumnToggle :table-ref="table" :exclude="['select', 'actions']" />
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

    <!-- CREATE modal -->
    <CrudFormModal
      v-model:open="openCreate"
      title="เพิ่มประวัติการส่งข้อความ"
      description="กรอกข้อมูลเพื่อเพิ่มประวัติการส่งข้อความใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <UFormField label="วันที่" :error="formDateError">
          <UInput
            v-model="formDate"
            type="date"
            size="xl"
            class="w-full"
            :ui="inputUiByError(!!formDateError)"
          />
        </UFormField>

        <UFormField label="ประเภท" :error="formTypeError">
          <USelect
            v-model="formType"
            :items="typeItems"
            class="w-full"
            :ui="selectUi"
          />
        </UFormField>

        <UFormField label="ชื่อผู้รับข้อความ" :error="formRecipientNameError">
          <UInput
            v-model="formRecipientName"
            size="xl"
            placeholder="เช่น สมชาย ใจดี"
            class="w-full"
            :ui="inputUiByError(!!formRecipientNameError)"
          />
        </UFormField>

        <UFormField label="UID ผู้รับข้อความ" :error="formRecipientUidError">
          <UInput
            v-model="formRecipientUid"
            size="xl"
            placeholder="เช่น 123e4567-e89b-12d3-a456-426655440000"
            class="w-full"
            :ui="inputUiByError(!!formRecipientUidError)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะการส่ง</div>
          <USelect
            v-model="formStatus"
            :items="statusItems"
            class="w-full"
            :ui="selectUi"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- EDIT modal -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขประวัติการส่งข้อความ"
      description="แก้ไขข้อมูลประวัติการส่งข้อความ"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <UFormField label="วันที่" :error="editDateError">
          <UInput
            v-model="editDate"
            type="date"
            size="xl"
            class="w-full"
            :ui="inputUiByError(!!editDateError)"
          />
        </UFormField>

        <UFormField label="ประเภท" :error="editTypeError">
          <USelect
            v-model="editType"
            :items="typeItems"
            class="w-full"
            :ui="selectUi"
          />
        </UFormField>

        <UFormField label="ชื่อผู้รับข้อความ" :error="editRecipientNameError">
          <UInput
            v-model="editRecipientName"
            size="xl"
            placeholder="เช่น สมชาย ใจดี"
            class="w-full"
            :ui="inputUiByError(!!editRecipientNameError)"
          />
        </UFormField>

        <UFormField label="UID ผู้รับข้อความ" :error="editRecipientUidError">
          <UInput
            v-model="editRecipientUid"
            size="xl"
            placeholder="เช่น 123e4567-e89b-12d3-a456-426655440000"
            class="w-full"
            :ui="inputUiByError(!!editRecipientUidError)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะการส่ง</div>
          <USelect
            v-model="editStatus"
            :items="statusItems"
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

type MessageType = 'การยืม' | 'การคืน' | 'การประเมิน' | 'การยืมแทน' | 'การขอ'
type MessageStatus = 'ส่งสำเร็จ' | 'ส่งไม่สำเร็จ'

type MessageHistoryItem = {
  id: number
  date: string
  type: MessageType
  recipientName: string
  recipientUid: string
  status: MessageStatus
}

type RowSelectionState = Record<string, boolean>

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')

const table = ref<any>(null)

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

const typeItems: MessageType[] = ['การยืม', 'การคืน', 'การประเมิน', 'การยืมแทน', 'การขอ']
const statusItems: MessageStatus[] = ['ส่งสำเร็จ', 'ส่งไม่สำเร็จ']

const filterItems = computed<SelectMenuItem[]>(() => [
  { label: 'ประเภททั้งหมด', value: 'ทั้งหมด' },
  { label: 'การยืม', value: 'การยืม' },
  { label: 'การคืน', value: 'การคืน' },
  { label: 'การประเมิน', value: 'การประเมิน' },
  { label: 'การยืมแทน', value: 'การยืมแทน' },
  { label: 'การขอ', value: 'การขอ' }
])

const allItems = ref<MessageHistoryItem[]>([
  {
    id: 1,
    date: '2026-01-20',
    type: 'การยืม',
    recipientName: 'สมชาย ใจดี',
    recipientUid: '123e4567-e89b-12d3-a456-426655440000',
    status: 'ส่งสำเร็จ'
  },
  {
    id: 2,
    date: '2026-01-18',
    type: 'การคืน',
    recipientName: 'สุดา พรหมดี',
    recipientUid: '987e6543-e21b-12d3-a456-426655440001',
    status: 'ส่งไม่สำเร็จ'
  },
  {
    id: 3,
    date: '2026-01-15',
    type: 'การประเมิน',
    recipientName: 'กิตติพงศ์ แสนสุข',
    recipientUid: '456e1234-e89b-12d3-a456-426655440002',
    status: 'ส่งสำเร็จ'
  },
  {
    id: 4,
    date: '2026-01-12',
    type: 'การขอ',
    recipientName: 'พิมพ์ชนก บุญมา',
    recipientUid: '741e2589-e89b-12d3-a456-426655440003',
    status: 'ส่งสำเร็จ'
  },
  {
    id: 5,
    date: '2026-01-10',
    type: 'การยืมแทน',
    recipientName: 'ณัฐวุฒิ ศรีสวัสดิ์',
    recipientUid: '852e3691-e89b-12d3-a456-426655440004',
    status: 'ส่งสำเร็จ'
  },
  {
    id: 6,
    date: '2026-01-08',
    type: 'การยืม',
    recipientName: 'อรทัย ทองสุข',
    recipientUid: '963e1472-e89b-12d3-a456-426655440005',
    status: 'ส่งสำเร็จ'
  }
])

const handleExport = (): void => console.log('export excel (message-history)')
const handleDelete = (id: number): void => console.log('delete', id)

const thaiMonthShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

const formatThaiDate = (value: string): string => {
  if (!value) return '-'

  const [yearText, monthText, dayText] = value.split('-')
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)

  if (!year || !month || !day) return value

  return `${day} ${thaiMonthShort[month - 1]} ${year + 543}`
}

/** validate */
const validateDate = (value: string): string | undefined => {
  if (!value.trim()) return 'กรุณาเลือกวันที่'
  return undefined
}

const validateRecipientName = (value: string): string | undefined => {
  const v = value.trim()
  if (!v) return 'กรุณากรอกชื่อผู้รับข้อความ'
  if (v.length < 3) return 'กรอกชื่อผู้รับข้อความไม่ถูกต้อง'
  if (v.length > 100) return 'ห้ามเกิน 100 ตัวอักษร'
  return undefined
}

const validateRecipientUid = (value: string): string | undefined => {
  const v = value.trim()
  if (!v) return 'กรุณากรอก UID ผู้รับข้อความ'
  if (v.length < 6) return 'กรอก UID ผู้รับข้อความไม่ถูกต้อง'
  if (v.length > 100) return 'ห้ามเกิน 100 ตัวอักษร'
  return undefined
}

const validateType = (value: string): string | undefined => {
  if (!value) return 'กรุณาเลือกประเภท'
  return undefined
}

/** create */
const openCreate = ref(false)
const formDate = ref('')
const formType = ref<MessageType>('การยืม')
const formRecipientName = ref('')
const formRecipientUid = ref('')
const formStatus = ref<MessageStatus>('ส่งสำเร็จ')

const formDateError = ref<string | undefined>(undefined)
const formTypeError = ref<string | undefined>(undefined)
const formRecipientNameError = ref<string | undefined>(undefined)
const formRecipientUidError = ref<string | undefined>(undefined)

watch(formDate, (v) => {
  formDateError.value = validateDate(v)
})
watch(formType, (v) => {
  formTypeError.value = validateType(v)
})
watch(formRecipientName, (v) => {
  formRecipientNameError.value = validateRecipientName(v)
})
watch(formRecipientUid, (v) => {
  formRecipientUidError.value = validateRecipientUid(v)
})

const handleCreate = (): void => {
  formDate.value = ''
  formType.value = 'การยืม'
  formRecipientName.value = ''
  formRecipientUid.value = ''
  formStatus.value = 'ส่งสำเร็จ'
  formDateError.value = undefined
  formTypeError.value = undefined
  formRecipientNameError.value = undefined
  formRecipientUidError.value = undefined
  openCreate.value = true
}

const submitCreate = (): void => {
  formDateError.value = validateDate(formDate.value)
  formTypeError.value = validateType(formType.value)
  formRecipientNameError.value = validateRecipientName(formRecipientName.value)
  formRecipientUidError.value = validateRecipientUid(formRecipientUid.value)

  if (
    formDateError.value ||
    formTypeError.value ||
    formRecipientNameError.value ||
    formRecipientUidError.value
  ) {
    return
  }

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1

  allItems.value.unshift({
    id: nextId,
    date: formDate.value.trim(),
    type: formType.value,
    recipientName: formRecipientName.value.trim(),
    recipientUid: formRecipientUid.value.trim(),
    status: formStatus.value
  })

  openCreate.value = false
}

/** edit */
const openEdit = ref(false)
const editingId = ref<number | null>(null)

const editDate = ref('')
const editType = ref<MessageType>('การยืม')
const editRecipientName = ref('')
const editRecipientUid = ref('')
const editStatus = ref<MessageStatus>('ส่งสำเร็จ')

const editDateError = ref<string | undefined>(undefined)
const editTypeError = ref<string | undefined>(undefined)
const editRecipientNameError = ref<string | undefined>(undefined)
const editRecipientUidError = ref<string | undefined>(undefined)

watch(editDate, (v) => {
  editDateError.value = validateDate(v)
})
watch(editType, (v) => {
  editTypeError.value = validateType(v)
})
watch(editRecipientName, (v) => {
  editRecipientNameError.value = validateRecipientName(v)
})
watch(editRecipientUid, (v) => {
  editRecipientUidError.value = validateRecipientUid(v)
})

const handleEdit = (id: number): void => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editDate.value = found.date
  editType.value = found.type
  editRecipientName.value = found.recipientName
  editRecipientUid.value = found.recipientUid
  editStatus.value = found.status

  editDateError.value = undefined
  editTypeError.value = undefined
  editRecipientNameError.value = undefined
  editRecipientUidError.value = undefined

  openEdit.value = true
}

const submitEdit = (): void => {
  if (editingId.value == null) return

  const found = allItems.value.find((i) => i.id === editingId.value)
  if (!found) return

  editDateError.value = validateDate(editDate.value)
  editTypeError.value = validateType(editType.value)
  editRecipientNameError.value = validateRecipientName(editRecipientName.value)
  editRecipientUidError.value = validateRecipientUid(editRecipientUid.value)

  if (
    editDateError.value ||
    editTypeError.value ||
    editRecipientNameError.value ||
    editRecipientUidError.value
  ) {
    return
  }

  found.date = editDate.value.trim()
  found.type = editType.value
  found.recipientName = editRecipientName.value.trim()
  found.recipientUid = editRecipientUid.value.trim()
  found.status = editStatus.value

  openEdit.value = false
  editingId.value = null
}

/** search/filter */
const searchQuery = ref<string>('')
const selectedFilter = ref<string>('ทั้งหมด')

/** selection */
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

/** pagination */
const currentPage = ref<number>(1)
const pageSize = ref<number>(8)

const filteredItems = computed<MessageHistoryItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const f = selectedFilter.value

  return allItems.value.filter((item) => {
    const matchSearch =
      !q ||
      formatThaiDate(item.date).toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.recipientName.toLowerCase().includes(q) ||
      item.recipientUid.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      String(item.id).includes(q)

    const matchType = !f || f === 'ทั้งหมด' || item.type === f

    return matchSearch && matchType
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<MessageHistoryItem[]>(() => {
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

/** columns */
const columns: TableColumn<MessageHistoryItem>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h('div', { class: 'flex items-center justify-center' }, [
        h(UCheckbox as any, {
          modelValue: table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            table.toggleAllPageRowsSelected(!!value),
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
    accessorKey: 'date',
    header: 'วันที่',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-[13px] font-semibold ' },
        formatThaiDate(String(row.getValue('date')))
      ),
    meta: { class: { th: 'w-36', td: 'w-36' } }
  },
  {
    accessorKey: 'type',
    header: 'หัวข้อแจ้งเตือน',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-[#ED7E24] text-[13px] font-semibold' },
        String(row.getValue('type'))
      ),
    meta: { class: { th: 'w-36', td: 'w-36' } }
  },
  {
    id: 'recipient',
    header: 'ผู้รับข้อความ',
    cell: ({ row }) => {
      const { recipientName, recipientUid } = row.original

      return h('div', { class: 'flex flex-col leading-5' }, [
        h('span', { class: 'text-[13px] font-semibold text-slate-700' }, recipientName),
        h('span', { class: 'text-[12px] text-slate-400 break-all' }, recipientUid)
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const status = row.getValue('status') as MessageStatus
      const isSuccess = status === 'ส่งสำเร็จ'

      return h(
        UBadge as any,
        {
          color: isSuccess ? 'success' : 'error',
          variant: 'soft',
          size: '',
          ui: {
            base: 'rounded-md px-2 py-0.5 font-medium'
          }
        },
        () => status
      )
    },
    meta: { class: { th: 'w-32', td: 'w-32' } }
  },
  {
    id: 'actions',
    header: 'จัดการ',
    meta: { class: { th: 'text-center w-28', td: 'text-center w-28' } },
    cell: ({ row }) => {
      const id = row.original.id

      const items = [
        [
          {
            label: 'แก้ไข',
            icon: 'i-heroicons-pencil-square-20-solid',
            onSelect: () => handleEdit(id)
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

      return h('div', { class: 'flex items-center justify-center gap-1' }, [
        h(
          UDropdownMenu as any,
          {
            items,
            content: { align: 'end' },
            ui: {
              content: 'w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg'
            }
          },
          () =>
            h(UButton as any, {
              icon: 'i-heroicons-ellipsis-vertical-20-solid',
              variant: 'ghost',
              color: 'neutral',
              class: 'rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200',
              'aria-label': 'More actions'
            })
        )
      ])
    }
  }
]
</script>