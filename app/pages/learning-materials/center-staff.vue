<template>
  <main class="min-h-screen bg-white py-6 font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">เจ้าหน้าที่ศูนย์</h1>
        <p class="mt-1 text-sm text-slate-500">จัดการข้อมูลเจ้าหน้าที่ผู้ใช้งานของศูนย์คลังสื่อ</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="เพิ่มเจ้าหน้าที่"
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
              search-placeholder="ค้นหา (รหัสเจ้าหน้าที่/ชื่อ-นามสกุล/อีเมล/ติดต่อ/ตำแหน่ง/ผู้สร้าง)"
            />
          </div>

          <MediaFilter v-model:category="selectedStatus" :items="statusItems" placeholder="สถานะ" />
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

    <!-- ✅ CREATE modal: ตัด "สร้างโดย" ออก -->
    <CrudFormModal
      v-model:open="openCreate"
      title="เพิ่มเจ้าหน้าที่ศูนย์"
      description="กรอกข้อมูลเพื่อเพิ่มเจ้าหน้าที่ใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">รหัสเจ้าหน้าที่</div>
          <UInput v-model="formCode" size="xl" placeholder="เช่น CST-001" class="w-full" :ui="inputUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ชื่อ-นามสกุล</div>
          <UInput v-model="formFullName" size="xl" placeholder="เช่น สุรีย์พร ชาญชัย" class="w-full" :ui="inputUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">อีเมล</div>
          <UInput
            v-model="formEmail"
            size="xl"
            placeholder="เช่น sureeporn@agency.go.th"
            class="w-full"
            :ui="inputUi"
          />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">เบอร์ติดต่อ</div>
          <UInput v-model="formContact" size="xl" placeholder="เช่น 081-000-1122" class="w-full" :ui="inputUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ตำแหน่ง</div>
          <UInput
            v-model="formPosition"
            size="xl"
            placeholder="เช่น เจ้าหน้าที่คลังสื่อ"
            class="w-full"
            :ui="inputUi"
          />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะการใช้งาน</div>
          <USelectMenu
            v-model="formStatus"
            :items="statusSelectItems"
            class="w-full"
            :ui="{
              base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
              rounded: 'rounded-2xl'
            }"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- ✅ EDIT modal: ตัด "อัปเดตโดย" ออก -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขเจ้าหน้าที่ศูนย์"
      description="แก้ไขข้อมูลเจ้าหน้าที่"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">รหัสเจ้าหน้าที่</div>
          <UInput v-model="editCode" size="xl" class="w-full" :ui="inputUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ชื่อ-นามสกุล</div>
          <UInput v-model="editFullName" size="xl" class="w-full" :ui="inputUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">อีเมล</div>
          <UInput v-model="editEmail" size="xl" class="w-full" :ui="inputUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">เบอร์ติดต่อ</div>
          <UInput v-model="editContact" size="xl" class="w-full" :ui="inputUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">ตำแหน่ง</div>
          <UInput v-model="editPosition" size="xl" class="w-full" :ui="inputUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะการใช้งาน</div>
          <USelectMenu
            v-model="editStatus"
            :items="statusSelectItems"
            class="w-full"
            :ui="{
              base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
              rounded: 'rounded-2xl'
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

type RowSelectionState = Record<string, boolean>
type StaffStatus = 'active' | 'inactive'

type CenterStaffRow = {
  id: number
  code: string
  fullName: string
  email: string
  contact: string
  position: string
  status: StaffStatus
  createdAt: string
  createdBy: string
  updatedBy: string
}

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const USelectMenu = resolveComponent('USelectMenu')
const UBadge = resolveComponent('UBadge')

// ✅ คนล็อกอิน (ผูก auth จริงทีหลัง)
const currentUserName = computed(() => {
  // ตัวอย่างจริง: return useAuth().user.value?.name ?? 'แอดมิน'
  return 'แอดมิน'
})

const inputUi = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  root: 'rounded-2xl'
}

// ===== mock data (ไทย) =====
const allItems = ref<CenterStaffRow[]>([
  {
    id: 1,
    code: 'CST-001',
    fullName: 'สุรีย์พร ชาญชัย',
    email: 'sureeporn@agency.go.th',
    contact: '081-000-1122',
    position: 'เจ้าหน้าที่คลังสื่อ',
    status: 'active',
    createdAt: '20 ม.ค. พ.ศ. 2569',
    createdBy: 'แอดมิน',
    updatedBy: 'แอดมิน'
  },
  {
    id: 2,
    code: 'CST-002',
    fullName: 'ธนกฤต วงศ์ดี',
    email: 'thanakrit@agency.go.th',
    contact: '02-111-2233 ต่อ 12',
    position: 'หัวหน้าคลังสื่อ',
    status: 'active',
    createdAt: '21 ม.ค. พ.ศ. 2569',
    createdBy: 'แอดมิน',
    updatedBy: 'เจ้าหน้าที่คลังสื่อ'
  },
  {
    id: 3,
    code: 'CST-003',
    fullName: 'ปัทมาภรณ์ สีสัน',
    email: 'patmaporn@agency.go.th',
    contact: '089-333-4445',
    position: 'เจ้าหน้าที่ทะเบียน',
    status: 'inactive',
    createdAt: '22 ม.ค. พ.ศ. 2569',
    createdBy: 'เจ้าหน้าที่คลังสื่อ',
    updatedBy: 'เจ้าหน้าที่คลังสื่อ'
  },
  {
    id: 4,
    code: 'CST-004',
    fullName: 'ศรายุทธ พานิช',
    email: 'sarayut@agency.go.th',
    contact: '081-987-6543',
    position: 'ผู้ประสานงานศูนย์',
    status: 'active',
    createdAt: '25 ม.ค. พ.ศ. 2569',
    createdBy: 'แอดมิน',
    updatedBy: 'แอดมิน'
  },
  {
    id: 5,
    code: 'CST-005',
    fullName: 'กนกวรรณ แสงทอง',
    email: 'kanokwan@agency.go.th',
    contact: '086-555-0009',
    position: 'เจ้าหน้าที่คลังสื่อ',
    status: 'inactive',
    createdAt: '30 ม.ค. พ.ศ. 2569',
    createdBy: 'แอดมิน',
    updatedBy: 'เจ้าหน้าที่คลังสื่อ'
  }
])

// header actions
const handleExport = () => console.log('export center-staff')

// ===== CREATE modal =====
const openCreate = ref(false)
const formCode = ref('')
const formFullName = ref('')
const formEmail = ref('')
const formContact = ref('')
const formPosition = ref('')
const formStatus = ref<StaffStatus>('active')

const statusSelectItems = ['active', 'inactive'] as const

const handleCreate = () => {
  formCode.value = ''
  formFullName.value = ''
  formEmail.value = ''
  formContact.value = ''
  formPosition.value = ''
  formStatus.value = 'active'
  openCreate.value = true
}

const submitCreate = () => {
  const code = formCode.value.trim()
  const fullName = formFullName.value.trim()
  const email = formEmail.value.trim()
  const contact = formContact.value.trim()
  const position = formPosition.value.trim()
  const status = formStatus.value

  if (!code || !fullName || !email) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const createdAt = new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(new Date())

  allItems.value.push({
    id: nextId,
    code,
    fullName,
    email,
    contact,
    position,
    status,
    createdAt,
    createdBy: currentUserName.value,
    updatedBy: '-'
  })

  openCreate.value = false
}

// ===== EDIT modal =====
const openEdit = ref(false)
const editingId = ref<number | null>(null)

const editCode = ref('')
const editFullName = ref('')
const editEmail = ref('')
const editContact = ref('')
const editPosition = ref('')
const editStatus = ref<StaffStatus>('active')

const handleEdit = (id: number) => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editCode.value = found.code
  editFullName.value = found.fullName
  editEmail.value = found.email
  editContact.value = found.contact
  editPosition.value = found.position
  editStatus.value = found.status
  openEdit.value = true
}

const submitEdit = () => {
  if (editingId.value == null) return
  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const code = editCode.value.trim()
  const fullName = editFullName.value.trim()
  const email = editEmail.value.trim()
  const contact = editContact.value.trim()
  const position = editPosition.value.trim()
  const status = editStatus.value

  if (!code || !fullName || !email) return

  item.code = code
  item.fullName = fullName
  item.email = email
  item.contact = contact
  item.position = position
  item.status = status
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

// delete (mock)
const handleDelete = (id: number) => console.log('delete', id)

// ===== Search / Filter =====
const searchQuery = ref('')
const selectedStatus = ref<string>('ทั้งหมด')
const statusItems = computed<SelectMenuItem[]>(() => ['ทั้งหมด', 'active', 'inactive'])

// selection
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

// pagination
const currentPage = ref(1)
const pageSize = ref(8)

// filter list
const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const s = selectedStatus.value

  return allItems.value.filter((it) => {
    const matchSearch =
      !q ||
      String(it.id).includes(q) ||
      it.code.toLowerCase().includes(q) ||
      it.fullName.toLowerCase().includes(q) ||
      it.email.toLowerCase().includes(q) ||
      it.contact.toLowerCase().includes(q) ||
      it.position.toLowerCase().includes(q) ||
      it.createdBy.toLowerCase().includes(q) ||
      it.updatedBy.toLowerCase().includes(q)

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

// ===== Columns =====
const columns: TableColumn<CenterStaffRow>[] = [
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
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, `${row.getValue('id')}`),
    meta: { class: { th: 'w-16', td: 'w-16' } }
  },
  {
    accessorKey: 'code',
    header: 'รหัสเจ้าหน้าที่',
    cell: ({ row }) => h('span', { class: 'text-orange-500 text-[13px]' }, String(row.getValue('code')))
  },
  {
    accessorKey: 'fullName',
    header: 'ชื่อ-นามสกุล',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'whitespace-normal break-words leading-5 text-slate-700 text-[13px]' },
        String(row.getValue('fullName'))
      )
  },
  {
    accessorKey: 'email',
    header: 'อีเมล',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('email')))
  },
  {
    accessorKey: 'contact',
    header: 'เบอร์ติดต่อ',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('contact')))
  },
  {
    accessorKey: 'position',
    header: 'ตำแหน่ง',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('position')))
  },
  {
    accessorKey: 'createdAt',
    header: 'วันที่สร้าง',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('createdAt')))
  },
  {
    accessorKey: 'createdBy',
    header: 'สร้างโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('createdBy')))
  },
  {
    accessorKey: 'updatedBy',
    header: 'อัปเดตโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('updatedBy')))
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const status = row.getValue('status') as StaffStatus

      const map = {
        active: { color: 'success' as const, label: 'active' },
        'inactive': { color: 'neutral' as const, label: 'inactive' }
      } as const

      const m = map[status] ?? { color: 'neutral' as const, label: String(status) }
      return h(UBadge as any, { variant: 'subtle', color: m.color }, () => m.label)
    }
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
