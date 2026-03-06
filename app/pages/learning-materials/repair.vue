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
              search-placeholder="ค้นหา (รหัสแจ้งซ่อม/รหัสสื่อ/ชื่อสื่อ/หมายเหตุ)"
            />
          </div>

          <!-- ✅ status filter (เก็บค่า eng แต่แสดงไทย แบบเดียวกับ borrow-return/purpose) -->
          <MediaSelect
            :category="statusValueToThaiFilter(selectedStatus)"
            @update:category="(v) => (selectedStatus = statusThaiToValueFilter(String(v)))"
            :items="statusThaiItems"
            placeholder="สถานะ"
          />

          <!-- ✅ Columns dropdown (เหมือนใน borrow-return/purpose.vue) -->
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

    <!-- =========================
         CREATE MODAL
    ========================== -->
    <CrudFormModal
      v-model:open="openCreate"
      title="สร้างรายการแจ้งซ่อม"
      description="กรอกข้อมูลเพื่อสร้างรายการใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <UFormField label="วันที่แจ้งซ่อม" :error="formReportedAtError">
          <UInput
            v-model="formReportedAt"
            size="xl"
            placeholder="เช่น 01 มี.ค. 2569 09:10"
            class="w-full"
            :ui="inputUiByError(!!formReportedAtError)"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="รหัสแจ้งซ่อม" :error="formRepairCodeError">
            <UInput
              v-model="formRepairCode"
              size="xl"
              placeholder="เช่น REP-001"
              class="w-full"
              :ui="inputUiByError(!!formRepairCodeError)"
            />
          </UFormField>

          <UFormField label="รหัสสื่อ" :error="formMediaCodeError">
            <UInput
              v-model="formMediaCode"
              size="xl"
              placeholder="เช่น TH-001"
              class="w-full"
              :ui="inputUiByError(!!formMediaCodeError)"
            />
          </UFormField>
        </div>

        <UFormField label="ชื่อสื่อ" :error="formMediaNameError">
          <UInput
            v-model="formMediaName"
            size="xl"
            placeholder="เช่น คู่มือเลิกบุหรี่ภาคประชาชน"
            class="w-full"
            :ui="inputUiByError(!!formMediaNameError)"
          />
        </UFormField>

        <UFormField label="หัวข้อปัญหา (หมายเหตุ)" :error="formRemarkError">
          <UTextarea
            v-model="formRemark"
            :rows="3"
            placeholder="เช่น ปกหลุด/ฉีกขาด (ต้องเข้าเล่มใหม่)"
            class="w-full"
            :ui="textareaUiByError(!!formRemarkError)"
          />
        </UFormField>

        <UFormField label="รูปภาพประกอบ (ใส่ URL ทีละบรรทัด)">
          <UTextarea
            v-model="formImagesText"
            :rows="3"
            placeholder="https://...\nhttps://..."
            class="w-full"
            :ui="textareaUiByError(false)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะ</div>
          <USelect
            :model-value="statusValueToThai(formStatus)"
            @update:model-value="(v: string) => (formStatus = statusThaiToValue(String(v)))"
            :items="statusChoiceItems"
            class="w-full"
            :ui="selectUi"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- =========================
         EDIT MODAL
    ========================== -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขรายการแจ้งซ่อม"
      description="แก้ไขข้อมูลแล้วกดบันทึก"
      submit-text="บันทึกการแก้ไข"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <UFormField label="วันที่แจ้งซ่อม" :error="formReportedAtError">
          <UInput
            v-model="formReportedAt"
            size="xl"
            placeholder="เช่น 01 มี.ค. 2569 09:10"
            class="w-full"
            :ui="inputUiByError(!!formReportedAtError)"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="รหัสแจ้งซ่อม" :error="formRepairCodeError">
            <UInput
              v-model="formRepairCode"
              size="xl"
              placeholder="เช่น REP-001"
              class="w-full"
              :ui="inputUiByError(!!formRepairCodeError)"
            />
          </UFormField>

          <UFormField label="รหัสสื่อ" :error="formMediaCodeError">
            <UInput
              v-model="formMediaCode"
              size="xl"
              placeholder="เช่น TH-001"
              class="w-full"
              :ui="inputUiByError(!!formMediaCodeError)"
            />
          </UFormField>
        </div>

        <UFormField label="ชื่อสื่อ" :error="formMediaNameError">
          <UInput
            v-model="formMediaName"
            size="xl"
            placeholder="เช่น คู่มือเลิกบุหรี่ภาคประชาชน"
            class="w-full"
            :ui="inputUiByError(!!formMediaNameError)"
          />
        </UFormField>

        <UFormField label="หัวข้อปัญหา (หมายเหตุ)" :error="formRemarkError">
          <UTextarea
            v-model="formRemark"
            :rows="3"
            placeholder="เช่น ปกหลุด/ฉีกขาด (ต้องเข้าเล่มใหม่)"
            class="w-full"
            :ui="textareaUiByError(!!formRemarkError)"
          />
        </UFormField>

        <UFormField label="รูปภาพประกอบ (ใส่ URL ทีละบรรทัด)">
          <UTextarea
            v-model="formImagesText"
            :rows="3"
            placeholder="https://...\nhttps://..."
            class="w-full"
            :ui="textareaUiByError(false)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะ</div>
          <USelect
            :model-value="statusValueToThai(formStatus)"
            @update:model-value="(v: string) => (formStatus = statusThaiToValue(String(v)))"
            :items="statusChoiceItems"
            class="w-full"
            :ui="selectUi"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- =========================
         DUPLICATE MODAL
    ========================== -->
    <CrudFormModal
      v-model:open="openDuplicate"
      title="ทำสำเนารายการแจ้งซ่อม"
      description="ระบบคัดลอกข้อมูลจากรายการเดิม คุณสามารถแก้ไขก่อนบันทึกได้"
      submit-text="สร้างสำเนา"
      @submit="submitDuplicate"
    >
      <div class="space-y-4">
        <!-- <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          ระบบจะเสนอ “รหัสแจ้งซ่อม” ใหม่เพื่อกันซ้ำ (คุณแก้ไขได้ก่อนบันทึก)
        </div> -->

        <UFormField label="วันที่แจ้งซ่อม" :error="formReportedAtError">
          <UInput
            v-model="formReportedAt"
            size="xl"
            placeholder="เช่น 01 มี.ค. 2569 09:10"
            class="w-full"
            :ui="inputUiByError(!!formReportedAtError)"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="รหัสแจ้งซ่อม" :error="formRepairCodeError">
            <UInput
              v-model="formRepairCode"
              size="xl"
              placeholder="เช่น REP-001"
              class="w-full"
              :ui="inputUiByError(!!formRepairCodeError)"
            />
          </UFormField>

          <UFormField label="รหัสสื่อ" :error="formMediaCodeError">
            <UInput
              v-model="formMediaCode"
              size="xl"
              placeholder="เช่น TH-001"
              class="w-full"
              :ui="inputUiByError(!!formMediaCodeError)"
            />
          </UFormField>
        </div>

        <UFormField label="ชื่อสื่อ" :error="formMediaNameError">
          <UInput
            v-model="formMediaName"
            size="xl"
            placeholder="เช่น คู่มือเลิกบุหรี่ภาคประชาชน"
            class="w-full"
            :ui="inputUiByError(!!formMediaNameError)"
          />
        </UFormField>

        <UFormField label="หัวข้อปัญหา (หมายเหตุ)" :error="formRemarkError">
          <UTextarea
            v-model="formRemark"
            :rows="3"
            placeholder="เช่น ปกหลุด/ฉีกขาด (ต้องเข้าเล่มใหม่)"
            class="w-full"
            :ui="textareaUiByError(!!formRemarkError)"
          />
        </UFormField>

        <UFormField label="รูปภาพประกอบ (ใส่ URL ทีละบรรทัด)">
          <UTextarea
            v-model="formImagesText"
            :rows="3"
            placeholder="https://...\nhttps://..."
            class="w-full"
            :ui="textareaUiByError(false)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะ</div>
          <USelect
            :model-value="statusValueToThai(formStatus)"
            @update:model-value="(v: string) => (formStatus = statusThaiToValue(String(v)))"
            :items="statusChoiceItems"
            class="w-full"
            :ui="selectUi"
          />
        </div>
      </div>
    </CrudFormModal>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, h, resolveComponent, watch, onMounted } from 'vue'
import type { TableColumn, SelectMenuItem } from '@nuxt/ui'

import Pagination from '~/components/Pagination.vue'
import MediaHQTable from '~/components/learning-materials/MediaHQTable.vue'
import MediaSearchFilter from '~/components/learning-materials/MediaSearchFilter.vue'
import MediaHeaderActions from '~/components/learning-materials/MediaHeaderActions.vue'
import MediaSelect from '~/components/learning-materials/MediaSelect.vue'
import MediaColumnToggle from '~/components/learning-materials/MediaColumnToggle.vue'
import CrudFormModal from '~/components/common/CrudFormModal.vue'

definePageMeta({ layout: 'learning-materials' })

type RowSelectionState = Record<string, boolean>

type RepairStatus = 'submitted' | 'in-review' | 'in-progress' | 'repairing' | 'closed'

type RepairRow = {
  id: number
  reportedAt: string // วันที่แจ้งซ่อม (ไทย)
  repairCode: string
  mediaCode: string
  mediaName: string
  remark: string
  images: string[]
  status: RepairStatus
  createdAt: string // ISO
  createdBy: string
  updatedAt: string // ISO
  updatedBy: string
}

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UAvatarGroup = resolveComponent('UAvatarGroup')
const UAvatar = resolveComponent('UAvatar')
const UFormField = resolveComponent('UFormField')
const UInput = resolveComponent('UInput')
const UTextarea = resolveComponent('UTextarea')
const USelect = resolveComponent('USelect')

// ===== status mapping (แบบเดียวกับ borrow-return/purpose: เก็บค่า eng แต่แสดงไทย) =====
const statusThaiItems: SelectMenuItem[] = [
  { label: 'ทั้งหมด', value: 'ทั้งหมด' },
  { label: 'รับเรื่อง', value: 'submitted' },
  { label: 'กำลังรีวิว', value: 'in-review' },
  { label: 'กำลังดำเนินการ', value: 'in-progress' },
  { label: 'กำลังซ่อมแซม', value: 'repairing' },
  { label: 'เสร็จสิ้น', value: 'closed' }
]

const statusChoiceItems: string[] = ['รับเรื่อง', 'กำลังรีวิว', 'กำลังดำเนินการ', 'กำลังซ่อมแซม', 'เสร็จสิ้น']

function statusValueToThai(v: RepairStatus): string {
  if (v === 'submitted') return 'รับเรื่อง'
  if (v === 'in-review') return 'กำลังรีวิว'
  if (v === 'in-progress') return 'กำลังดำเนินการ'
  if (v === 'repairing') return 'กำลังซ่อมแซม'
  return 'เสร็จสิ้น'
}

function statusThaiToValue(label: string): RepairStatus {
  if (label === 'รับเรื่อง') return 'submitted'
  if (label === 'กำลังรีวิว') return 'in-review'
  if (label === 'กำลังดำเนินการ') return 'in-progress'
  if (label === 'กำลังซ่อมแซม') return 'repairing'
  return 'closed'
}

const statusValueToThaiFilter = (v: string): string => {
  if (v === 'ทั้งหมด') return 'ทั้งหมด'
  return statusValueToThai(v as RepairStatus)
}

const statusThaiToValueFilter = (label: string): string => {
  if (label === 'ทั้งหมด') return 'ทั้งหมด'
  if (label === 'รับเรื่อง') return 'submitted'
  if (label === 'กำลังรีวิว') return 'in-review'
  if (label === 'กำลังดำเนินการ') return 'in-progress'
  if (label === 'กำลังซ่อมแซม') return 'repairing'
  return 'closed'
}

// ===== UI (เหมือน borrow-return) =====
const inputUiNormal = {
  rounded: 'rounded-2xl',
  base: 'w-full',
  ring: 'ring-1 ring-slate-200 focus:ring-2 focus:ring-[#ED7E24]'
} as const

const inputUiError = {
  rounded: 'rounded-2xl',
  base: 'w-full',
  ring: 'ring-1 ring-red-300 focus:ring-2 focus:ring-red-400'
} as const

const textareaUiNormal = {
  rounded: 'rounded-2xl',
  base: 'w-full',
  ring: 'ring-1 ring-slate-200 focus:ring-2 focus:ring-[#ED7E24]'
} as const

const textareaUiError = {
  rounded: 'rounded-2xl',
  base: 'w-full',
  ring: 'ring-1 ring-red-300 focus:ring-2 focus:ring-red-400'
} as const

function inputUiByError(hasError: boolean) {
  return hasError ? inputUiError : inputUiNormal
}

function textareaUiByError(hasError: boolean) {
  return hasError ? textareaUiError : textareaUiNormal
}

const selectUi = {
  rounded: 'rounded-2xl',
  base: 'w-full',
  ring: 'ring-1 ring-slate-200 focus:ring-2 focus:ring-[#ED7E24]'
} as const

// ===== Date utils (ยืมจาก borrow-return) =====
function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatThaiBuddhistDateTime(isoDateTime: string) {
  const dt = new Date(isoDateTime)
  if (Number.isNaN(dt.getTime())) return '-'
  const day = pad2(dt.getDate())
  const mon = pad2(dt.getMonth() + 1)
  const buddhistYear = dt.getFullYear() + 543
  const hh = pad2(dt.getHours())
  const mm = pad2(dt.getMinutes())
  return `${day}/${mon}/${buddhistYear} ${hh}:${mm}`
}

// ===== normalize + validation (แนวเดียวกับ purpose/borrow-return) =====
function normalize(s: string) {
  return String(s ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function validateRequiredText(value: string, label: string, minLen = 1) {
  const v = String(value ?? '').trim()
  if (!v) return `กรุณากรอก${label}`
  if (v.length < minLen) return `${label}สั้นเกินไป`
  return undefined
}

function parseImages(text: string): string[] {
  return String(text ?? '')
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)
}

// ===== mock data =====
const allItems = ref<RepairRow[]>([
  {
    id: 1,
    reportedAt: '01 มี.ค. 2569 09:10',
    repairCode: 'REP-001',
    mediaCode: 'TH-001',
    mediaName: 'คู่มือเลิกบุหรี่ภาคประชาชน',
    remark: 'ปกหลุด/ฉีกขาด (ต้องเข้าเล่มใหม่)',
    images: ['https://i.pravatar.cc/80?img=11', 'https://i.pravatar.cc/80?img=12', 'https://i.pravatar.cc/80?img=13'],
    status: 'submitted',
    createdAt: '2026-03-01T02:10:00.000Z',
    createdBy: 'Admin',
    updatedAt: '2026-03-01T02:10:00.000Z',
    updatedBy: 'Admin'
  },
  {
    id: 2,
    reportedAt: '02 มี.ค. 2569 10:25',
    repairCode: 'REP-002',
    mediaCode: 'TH-002',
    mediaName: 'บอร์ดเกมครอบครัวสุขสันต์',
    remark: 'การ์ดหาย 3 ใบ (รบกวนพิมพ์ทดแทน)',
    images: ['https://i.pravatar.cc/80?img=14'],
    status: 'in-review',
    createdAt: '2026-03-02T03:25:00.000Z',
    createdBy: 'Admin',
    updatedAt: '2026-03-02T04:05:00.000Z',
    updatedBy: 'Admin'
  },
  {
    id: 3,
    reportedAt: '25 ก.พ. 2569 13:40',
    repairCode: 'REP-003',
    mediaCode: 'TH-003',
    mediaName: 'โปสเตอร์ความปลอดภัย',
    remark: 'สีซีด/รอยยับ (ต้องเคลือบใหม่)',
    images: ['https://i.pravatar.cc/80?img=15', 'https://i.pravatar.cc/80?img=16'],
    status: 'in-progress',
    createdAt: '2026-02-25T06:40:00.000Z',
    createdBy: 'Admin',
    updatedAt: '2026-02-27T02:20:00.000Z',
    updatedBy: 'Admin'
  },
  {
    id: 4,
    reportedAt: '28 ก.พ. 2569 16:05',
    repairCode: 'REP-004',
    mediaCode: 'TH-004',
    mediaName: 'แผ่นพับลดพุง',
    remark: 'เปียกน้ำ/ชำรุดหนัก (กำลังซ่อมแซม)',
    images: ['https://i.pravatar.cc/80?img=17', 'https://i.pravatar.cc/80?img=18', 'https://i.pravatar.cc/80?img=19', 'https://i.pravatar.cc/80?img=20'],
    status: 'repairing',
    createdAt: '2026-02-28T09:05:00.000Z',
    createdBy: 'Admin',
    updatedAt: '2026-03-01T07:12:00.000Z',
    updatedBy: 'Admin'
  },
  {
    id: 5,
    reportedAt: '20 ก.พ. 2569 09:05',
    repairCode: 'REP-005',
    mediaCode: 'TH-005',
    mediaName: 'ชุดการ์ดโภชนาการ',
    remark: 'ซ่อมเสร็จแล้ว (พร้อมนำกลับเข้าคลัง)',
    images: [],
    status: 'closed',
    createdAt: '2026-02-20T02:05:00.000Z',
    createdBy: 'Admin',
    updatedAt: '2026-02-22T09:10:00.000Z',
    updatedBy: 'Admin'
  }
])

// header actions
const handleExport = () => console.log('export repair')

function handleCreate() {
  editingId.value = null
  duplicatingId.value = null
  resetForm()
  clearFormErrors()
  openCreate.value = true
}

// search/filter
const searchQuery = ref('')
const selectedStatus = ref<string>('ทั้งหมด')

// selection
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

// pagination
const currentPage = ref(1)
const pageSize = ref(8)

onMounted(() => {
  const headerAndPadding = 320
  const rowHeight = 56
  const available = window.innerHeight - headerAndPadding
  pageSize.value = Math.max(5, Math.floor(available / rowHeight))
})

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
      it.remark.toLowerCase().includes(q)

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

// ===== CRUD state =====
const openCreate = ref(false)
const openEdit = ref(false)
const openDuplicate = ref(false)
const editingId = ref<number | null>(null)
const duplicatingId = ref<number | null>(null)

// ===== form state =====
const formReportedAt = ref('')
const formRepairCode = ref('')
const formMediaCode = ref('')
const formMediaName = ref('')
const formRemark = ref('')
const formImagesText = ref('')
const formStatus = ref<RepairStatus>('submitted')

// errors
const formReportedAtError = ref<string | undefined>()
const formRepairCodeError = ref<string | undefined>()
const formMediaCodeError = ref<string | undefined>()
const formMediaNameError = ref<string | undefined>()
const formRemarkError = ref<string | undefined>()

function clearFormErrors() {
  formReportedAtError.value = undefined
  formRepairCodeError.value = undefined
  formMediaCodeError.value = undefined
  formMediaNameError.value = undefined
  formRemarkError.value = undefined
}

function resetForm() {
  // default
  formReportedAt.value = ''
  formRepairCode.value = ''
  formMediaCode.value = ''
  formMediaName.value = ''
  formRemark.value = ''
  formImagesText.value = ''
  formStatus.value = 'submitted'
}

function validateForm() {
  clearFormErrors()

  formReportedAtError.value = validateRequiredText(formReportedAt.value, 'วันที่แจ้งซ่อม')
  formRepairCodeError.value = validateRequiredText(formRepairCode.value, 'รหัสแจ้งซ่อม', 3)
  formMediaCodeError.value = validateRequiredText(formMediaCode.value, 'รหัสสื่อ', 2)
  formMediaNameError.value = validateRequiredText(formMediaName.value, 'ชื่อสื่อ', 2)
  formRemarkError.value = validateRequiredText(formRemark.value, 'หมายเหตุ', 2)

  return !(
    formReportedAtError.value ||
    formRepairCodeError.value ||
    formMediaCodeError.value ||
    formMediaNameError.value ||
    formRemarkError.value
  )
}

function isDuplicateTxn(key: { repairCode: string }, exceptId?: number) {
  const code = normalize(key.repairCode)
  if (!code) return false
  return allItems.value.some((it) => {
    if (exceptId && it.id === exceptId) return false
    return normalize(it.repairCode) === code
  })
}

function makeDuplicateRepairCode(code: string) {
  const base = String(code ?? '').trim()
  if (!base) return 'REP-COPY'

  let candidate = `${base}-COPY`
  if (!isDuplicateTxn({ repairCode: candidate })) return candidate

  for (let i = 2; i <= 99; i++) {
    candidate = `${base}-COPY${i}`
    if (!isDuplicateTxn({ repairCode: candidate })) return candidate
  }

  return `${base}-COPY${Date.now()}`
}

// actions
function handleEdit(id: number) {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  duplicatingId.value = null

  formReportedAt.value = found.reportedAt
  formRepairCode.value = found.repairCode
  formMediaCode.value = found.mediaCode
  formMediaName.value = found.mediaName
  formRemark.value = found.remark
  formImagesText.value = (found.images || []).join('\n')
  formStatus.value = found.status

  clearFormErrors()
  openEdit.value = true
}

function handleDuplicate(id: number) {
  const src = allItems.value.find((i) => i.id === id)
  if (!src) return

  duplicatingId.value = id
  editingId.value = null

  resetForm()

  formReportedAt.value = src.reportedAt
  formRepairCode.value = makeDuplicateRepairCode(src.repairCode)
  formMediaCode.value = src.mediaCode
  formMediaName.value = src.mediaName
  formRemark.value = src.remark
  formImagesText.value = (src.images || []).join('\n')
  formStatus.value = src.status

  clearFormErrors()
  openDuplicate.value = true
}

function handleDelete(id: number) {
  allItems.value = allItems.value.filter((x) => x.id !== id)
  rowSelection.value = {}
}

function submitCreate() {
  if (!validateForm()) return

  const draftKey = { repairCode: formRepairCode.value }
  if (isDuplicateTxn(draftKey)) {
    formRepairCodeError.value = 'พบรายการซ้ำ (รหัสแจ้งซ่อม)' 
    return
  }

  const nowISO = new Date().toISOString()
  const nextId = Math.max(0, ...allItems.value.map((x) => x.id)) + 1

  const newRow: RepairRow = {
    id: nextId,
    reportedAt: String(formReportedAt.value).trim(),
    repairCode: String(formRepairCode.value).trim(),
    mediaCode: String(formMediaCode.value).trim(),
    mediaName: String(formMediaName.value).trim(),
    remark: String(formRemark.value).trim(),
    images: parseImages(formImagesText.value),
    status: formStatus.value,
    createdAt: nowISO,
    createdBy: 'Admin',
    updatedAt: nowISO,
    updatedBy: 'Admin'
  }

  allItems.value = [newRow, ...allItems.value]
  openCreate.value = false
}

function submitEdit() {
  if (!editingId.value) return
  if (!validateForm()) return

  const draftKey = { repairCode: formRepairCode.value }
  if (isDuplicateTxn(draftKey, editingId.value)) {
    formRepairCodeError.value = 'พบรายการซ้ำ (รหัสแจ้งซ่อม)'
    return
  }

  const nowISO = new Date().toISOString()

  allItems.value = allItems.value.map((it) => {
    if (it.id !== editingId.value) return it

    return {
      ...it,
      reportedAt: String(formReportedAt.value).trim(),
      repairCode: String(formRepairCode.value).trim(),
      mediaCode: String(formMediaCode.value).trim(),
      mediaName: String(formMediaName.value).trim(),
      remark: String(formRemark.value).trim(),
      images: parseImages(formImagesText.value),
      status: formStatus.value,
      updatedAt: nowISO,
      updatedBy: 'Admin'
    }
  })

  openEdit.value = false
  editingId.value = null
}

function submitDuplicate() {
  if (!duplicatingId.value) return
  if (!validateForm()) return

  const draftKey = { repairCode: formRepairCode.value }
  if (isDuplicateTxn(draftKey)) {
    formRepairCodeError.value = 'พบรายการซ้ำ (รหัสแจ้งซ่อม)'
    return
  }

  const nowISO = new Date().toISOString()
  const nextId = Math.max(0, ...allItems.value.map((x) => x.id)) + 1

  const newRow: RepairRow = {
    id: nextId,
    reportedAt: String(formReportedAt.value).trim(),
    repairCode: String(formRepairCode.value).trim(),
    mediaCode: String(formMediaCode.value).trim(),
    mediaName: String(formMediaName.value).trim(),
    remark: String(formRemark.value).trim(),
    images: parseImages(formImagesText.value),
    status: formStatus.value,
    createdAt: nowISO,
    createdBy: 'Admin',
    updatedAt: nowISO,
    updatedBy: 'Admin'
  }

  allItems.value = [newRow, ...allItems.value]
  openDuplicate.value = false
  duplicatingId.value = null
}

// status badge style
const statusBadge = (status: RepairStatus) => {
  if (status === 'submitted') {
    return { label: 'รับเรื่อง', class: 'bg-orange-50 text-orange-600 ring-1 ring-orange-200' }
  }
  if (status === 'in-review') {
    return { label: 'กำลังรีวิว', class: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' }
  }
  if (status === 'in-progress') {
    return { label: 'กำลังดำเนินการ', class: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' }
  }
  if (status === 'repairing') {
    return { label: 'กำลังซ่อมแซม', class: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' }
  }
  return { label: 'เสร็จสิ้น', class: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' }
}

// columns
const table = ref()

const columns: TableColumn<RepairRow>[] = [
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
    accessorKey: 'reportedAt',
    header: 'วันที่แจ้งซ่อม',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('reportedAt')))
  },
  {
    accessorKey: 'repairCode',
    header: 'รหัสแจ้งซ่อม',
    cell: ({ row }) => h('span', { class: 'text-orange-500 text-[13px] font-medium' }, String(row.getValue('repairCode')))
  },
  {
    accessorKey: 'mediaCode',
    header: 'รหัสสื่อ',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('mediaCode')))
  },
  {
    accessorKey: 'mediaName',
    header: 'ชื่อสื่อ',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('mediaName')))
  },
  {
    accessorKey: 'remark',
    header: 'หัวข้อปัญหา(หมายเหตุ)',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('remark')))
  },
  {
    accessorKey: 'images',
    header: 'รูปภาพประกอบ',
    cell: ({ row }) => {
      const imgs = (row.original.images || []).slice(0, 5)
      if (!imgs.length) return h('span', { class: 'text-slate-400 text-[13px]' }, '-')

      return h(
        UAvatarGroup as any,
        { max: 4, class: 'justify-start' },
        {
          default: () =>
            imgs.map((src, idx) =>
              h(UAvatar as any, {
                key: `${row.original.id}-${idx}`,
                src,
                alt: `img-${idx + 1}`,
                size: 'xs'
              })
            )
        }
      )
    }
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
    accessorKey: 'createdAt',
    header: 'วันที่สร้าง',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, formatThaiBuddhistDateTime(String(row.getValue('createdAt'))))
  },
  {
    accessorKey: 'createdBy',
    header: 'สร้างโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('createdBy')))
  },
  {
    accessorKey: 'updatedAt',
    header: 'วันที่อัปเดต',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, formatThaiBuddhistDateTime(String(row.getValue('updatedAt'))))
  },
  {
    accessorKey: 'updatedBy',
    header: 'อัปเดตโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('updatedBy')))
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
            icon: 'i-heroicons-clipboard-document-20-solid',
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