<template>
  <main class=" bg-white  font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">ยืม-คืนสื่อการเรียนรู้</h1>
        <p class="mt-1 text-sm text-slate-500">รายการทำธุรกรรมยืม-คืนทั้งหมด</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="สร้างรายการ"
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
              search-placeholder="ค้นหา (รหัสผู้สมาชิก/ชื่อ/สถานที่)"
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
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- ===== UPDATE modal (โชว์แค่สถานะ) ===== -->
    <CrudFormModal
      v-model:open="openUpdate"
      title="อัปเดตรายการยืม-คืน"
      description="เลือกสถานะ (ถ้าเลือก 'คืนแล้ว' ระบบใส่วันที่คืนเป็นวันนี้ให้อัตโนมัติ)"
      submit-text="บันทึก"
      @submit="submitUpdate"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะ</div>

          <USelectMenu
            v-model="editStatusChoice"
            :items="statusChoiceItems"
            class="w-full"
            :ui="selectUi"
          />

          <div v-if="editStatusChoice === 'คืนแล้ว'" class="mt-2 text-xs text-slate-500">
            ระบบจะตั้ง “วันที่คืน” เป็นวันนี้ให้อัตโนมัติ
          </div>
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

type BorrowReturnStatus = 'ขอ' | 'กำลังยืม' | 'คืนแล้ว' | 'เกินกำหนด'
type BorrowStage = 'ขอ' | 'กำลังยืม'

type BorrowReturnRow = {
  id: number
  txnAt: string
  userCode: string
  fullName: string
  place: string
  purpose: string
  receiverType: string

  targetGroup: string
  mediaBorrowed: string

  stage: BorrowStage
  borrowDate: string // YYYY-MM-DD
  expectedReturnDate: string // YYYY-MM-DD
  returnDate?: string | null // YYYY-MM-DD | null
}

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const USelectMenu = resolveComponent('USelectMenu')

// ui
const selectUi = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
}

// ===== Helpers (วันที่) =====
const pad2 = (n: number) => String(n).padStart(2, '0')

const parseISODate = (iso: string) => {
  const m = iso?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  return new Date(y, mo - 1, d, 0, 0, 0, 0)
}
const toISODate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

const formatThaiBuddhistDate = (iso: string) => {
  const d = parseISODate(iso)
  if (!d) return '-'
  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { dateStyle: 'medium' }).format(d)
}

const diffDays = (fromISO: string, toISO: string) => {
  const a = parseISODate(fromISO)
  const b = parseISODate(toISO)
  if (!a || !b) return null
  const ms = b.getTime() - a.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

// ===== Today ISO =====
const todayISO = computed(() => {
  const now = new Date()
  return toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
})

// ===== mock data =====
const allItems = ref<BorrowReturnRow[]>([
  // ✅ ขอ
  {
    id: 1,
    txnAt: '10 ก.พ. 2569 09:10',
    userCode: 'USER-9921',
    fullName: 'สมศักดิ์ รักดี',
    place: 'รพ.สต. บ้านหนองใหญ่',
    purpose: 'อบรมเยาวชน',
    receiverType: 'นักเรียนประถม',
    targetGroup: 'เยาวชน/นักเรียน',
    mediaBorrowed: 'ชุดโปสเตอร์สุขภาพ (5 ชิ้น)',
    stage: 'ขอ',
    borrowDate: '2026-02-10',
    expectedReturnDate: '2026-02-12',
    returnDate: null
  },

  // ✅ กำลังยืม (ยังไม่ถึงกำหนด)
  {
    id: 2,
    txnAt: '10 ก.พ. 2569 10:25',
    userCode: 'USER-4452',
    fullName: 'วิภาวรรณ สุขุม',
    place: 'รพ.สต. คลองสาม',
    purpose: 'ตั้งบูธรณรงค์',
    receiverType: 'ผู้สูงอายุ',
    targetGroup: 'ผู้สูงอายุ',
    mediaBorrowed: 'แผ่นพับโภชนาการ (500 ใบ)',
    stage: 'กำลังยืม',
    borrowDate: '2026-02-10',
    expectedReturnDate: '2026-02-20',
    returnDate: null
  },

  // ✅ เกินกำหนด (stage ยืมอยู่ + expectedReturnDate เลยวันนี้)
  {
    id: 3,
    txnAt: '01 ก.พ. 2569 16:40',
    userCode: 'USER-7788',
    fullName: 'กิตติพงศ์ แสงแก้ว',
    place: 'รพ.สต. คลองสาม',
    purpose: 'อุบัติเหตุ',
    receiverType: 'ประชาชนทั่วไป',
    targetGroup: 'ประชาชนทั่วไป',
    mediaBorrowed: 'สื่อดิจิทัลความปลอดภัย (1 ชุด)',
    stage: 'กำลังยืม',
    borrowDate: '2026-02-01',
    expectedReturnDate: '2026-02-05',
    returnDate: null
  },

  // ✅ คืนแล้ว
  {
    id: 4,
    txnAt: '12 ก.พ. 2569 09:30',
    userCode: 'USER-9900',
    fullName: 'อรทัย พรหมมา',
    place: 'รพ.สต. บ้านคลองใหม่',
    purpose: 'สอนสุขศึกษา',
    receiverType: 'นักเรียนมัธยม',
    targetGroup: 'นักเรียน',
    mediaBorrowed: 'ชุดนิทรรศการโภชนาการ (1 ชุด)',
    stage: 'กำลังยืม',
    borrowDate: '2026-02-10',
    expectedReturnDate: '2026-02-12',
    returnDate: '2026-02-12'
  }
])

// header actions
const handleExport = () => console.log('export borrow-return')
const handleCreate = () => console.log('create borrow-return')

// ===== derive status =====
const deriveStatus = (it: BorrowReturnRow): BorrowReturnStatus => {
  if (it.stage === 'ขอ') return 'ขอ'
  if (it.returnDate && parseISODate(it.returnDate)) return 'คืนแล้ว'

  const t = parseISODate(todayISO.value)
  const exp = parseISODate(it.expectedReturnDate)
  if (t && exp && t.getTime() > exp.getTime()) return 'เกินกำหนด'
  return 'กำลังยืม'
}

const expectedReturnDisplay = (it: BorrowReturnRow) => {
  if (!it.expectedReturnDate) return '-'
  const dateText = formatThaiBuddhistDate(it.expectedReturnDate)

  // ถ้าคืนแล้ว ไม่ต้องใส่วงเล็บ
  if (it.returnDate && parseISODate(it.returnDate)) return dateText
  if (it.stage === 'ขอ') return dateText

  const d = diffDays(todayISO.value, it.expectedReturnDate)
  if (d == null) return dateText
  if (d > 0) return `${dateText} (อีก ${d} วัน)`
  if (d === 0) return `${dateText} (วันนี้)`
  return `${dateText} (เกิน ${Math.abs(d)} วัน)`
}

const borrowDateDisplay = (it: BorrowReturnRow) => (it.borrowDate ? formatThaiBuddhistDate(it.borrowDate) : '-')
const returnDateDisplay = (it: BorrowReturnRow) => (it.returnDate ? formatThaiBuddhistDate(it.returnDate) : '-')

// rows for display
const displayRows = computed(() =>
  allItems.value.map((it) => ({
    ...it,
    status: deriveStatus(it),
    borrowDateText: borrowDateDisplay(it),
    expectedReturnText: expectedReturnDisplay(it),
    returnDateText: returnDateDisplay(it)
  }))
)

// ===== Search / Filter / Pagination =====
const searchQuery = ref('')
const selectedStatus = ref<string>('ทั้งหมด')
const statusItems = computed<SelectMenuItem[]>(() => ['ทั้งหมด', 'ขอ', 'กำลังยืม', 'คืนแล้ว', 'เกินกำหนด'])

const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

const currentPage = ref(1)
const pageSize = ref(5)

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const s = selectedStatus.value

  return displayRows.value.filter((it) => {
    const matchSearch =
      !q ||
      it.userCode.toLowerCase().includes(q) ||
      it.fullName.toLowerCase().includes(q) ||
      it.place.toLowerCase().includes(q) ||
      it.purpose.toLowerCase().includes(q)

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

// delete (mock)
const handleDelete = (id: number) => console.log('delete', id)

// ===== UPDATE modal (โชว์แค่สถานะ แต่ทำงานเดิม) =====
const openUpdate = ref(false)
const editingId = ref<number | null>(null)

// ตัวเลือกสถานะใน modal (ปรับตามสถานะจริงของรายการ)
const statusChoiceItems = ref<BorrowReturnStatus[]>(['ขอ', 'กำลังยืม'])
const editStatusChoice = ref<BorrowReturnStatus>('ขอ')

const handleEdit = (id: number) => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  const currentStatus = deriveStatus(found)

  // ✅ คืนแล้ว: ห้ามแก้ไข
  if (currentStatus === 'คืนแล้ว') return

  // ✅ กำลังยืม/เกินกำหนด: มี "คืนแล้ว" ให้เลือก
  if (currentStatus === 'กำลังยืม' || currentStatus === 'เกินกำหนด') {
    statusChoiceItems.value = ['กำลังยืม', 'เกินกำหนด', 'คืนแล้ว']
    editStatusChoice.value = currentStatus
  } else {
    // ✅ ขอ: ไม่มีคืนแล้วให้เลือก
    statusChoiceItems.value = ['ขอ', 'กำลังยืม']
    editStatusChoice.value = 'ขอ'
  }

  editingId.value = id
  openUpdate.value = true
}

const submitUpdate = () => {
  if (editingId.value == null) return
  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const choice = editStatusChoice.value

  // ✅ apply status choice (เหมือนเดิม)
  if (choice === 'ขอ') {
    item.stage = 'ขอ'
    item.returnDate = null
  }

  if (choice === 'กำลังยืม') {
    item.stage = 'กำลังยืม'
    item.returnDate = null
  }

  if (choice === 'เกินกำหนด') {
    // จริงๆ เกินกำหนด derive จากวัน แต่ให้เลือกไว้ = ยังยืมอยู่
    item.stage = 'กำลังยืม'
    item.returnDate = null
  }

  if (choice === 'คืนแล้ว') {
    // ✅ auto returnDate = today
    item.stage = 'กำลังยืม'
    item.returnDate = todayISO.value
  }

  openUpdate.value = false
  editingId.value = null
}

// ===== Columns =====
const columns: TableColumn<any>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox as any, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
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
    accessorKey: 'txnAt',
    header: 'วันที่ทำรายการ',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('txnAt')))
  },
  {
    accessorKey: 'userCode',
    header: 'รหัสผู้สมาชิก',
    cell: ({ row }) => h('span', { class: 'text-orange-500 text-[13px]' }, String(row.getValue('userCode')))
  },
  {
    accessorKey: 'fullName',
    header: 'ชื่อ-นามสกุล',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('fullName')))
  },
  {
    accessorKey: 'place',
    header: 'สถานที่ใช้งาน',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('place')))
  },
  {
    accessorKey: 'purpose',
    header: 'วัตถุประสงค์',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('purpose')))
  },
  {
    accessorKey: 'receiverType',
    header: 'ประเภทผู้รับสื่อ',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('receiverType')))
  },
  {
    accessorKey: 'targetGroup',
    header: 'กลุ่มเป้าหมาย',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('targetGroup')))
  },
  {
    accessorKey: 'mediaBorrowed',
    header: 'ยืมสื่อการเรียนรู้',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'whitespace-normal break-words leading-5 text-slate-600 text-[13px]' },
        String(row.getValue('mediaBorrowed'))
      )
  },

  // ✅ สถานะก่อนวันที่ยืม
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const status = row.getValue('status') as BorrowReturnStatus
      const map = {
        ขอ: { color: 'warning' as const },
        กำลังยืม: { color: 'info' as const },
        คืนแล้ว: { color: 'success' as const },
        เกินกำหนด: { color: 'error' as const }
      } as const
      const m = map[status] ?? { color: 'neutral' as const }
      return h(UBadge as any, { variant: 'subtle', color: m.color }, () => status)
    }
  },
  {
    accessorKey: 'borrowDateText',
    header: 'วันที่ยืม',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('borrowDateText')))
  },
  {
    accessorKey: 'expectedReturnText',
    header: 'วันที่คาดว่าจะคืน',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('expectedReturnText')))
  },
  {
    accessorKey: 'returnDateText',
    header: 'วันที่คืน',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('returnDateText')))
  },

  {
    id: 'actions',
    header: 'จัดการ',
    meta: { class: { th: 'text-right', td: 'text-right' } },
    cell: ({ row }) => {
      const id = row.original.id
      const status = row.original.status as BorrowReturnStatus
      const isReturned = status === 'คืนแล้ว'

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
          class: `rounded-lg ${
            isReturned ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 active:bg-slate-200'
          }`,
          disabled: isReturned,
          'aria-label': 'Edit',
          onClick: () => {
            if (isReturned) return
            handleEdit(id)
          }
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
