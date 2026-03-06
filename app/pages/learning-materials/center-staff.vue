<template>
  <main class=" bg-white font-[Kanit]">
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
      <div class="-mx-8 px-8">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <MediaSearchFilter
              v-model:search="searchQuery"
              search-placeholder="ค้นหา (รหัสเจ้าหน้าที่/ชื่อ-นามสกุล/อีเมล/ติดต่อ/ตำแหน่ง/ผู้สร้าง)"
            />
          </div>

          <MediaSelect v-model:category="selectedStatus" :items="statusItems" placeholder="สถานะ" />

          <MediaColumnToggle :table-ref="table" :exclude="['select','actions']" />
        </div>
      </div>

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
            <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
          </div>
        </div>
      </section>
    </div>

    <CrudFormModal
      v-model:open="openCreate"
      title="เพิ่มเจ้าหน้าที่ศูนย์"
      description="กรอกข้อมูลเพื่อเพิ่มเจ้าหน้าที่ใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <UFormField label="รหัสเจ้าหน้าที่" :error="formCodeError">
          <UInput
            v-model="formCode"
            size="xl"
            placeholder="เช่น CST-001"
            class="w-full"
            :ui="inputUiByError(!!formCodeError)"
          />
        </UFormField>

        <UFormField label="ชื่อ-นามสกุล" :error="formFullNameError">
          <UInput
            v-model="formFullName"
            size="xl"
            placeholder="เช่น สุรีย์พร ชาญชัย"
            class="w-full"
            :ui="inputUiByError(!!formFullNameError)"
          />
        </UFormField>

        <UFormField label="อีเมล" :error="formEmailError">
          <UInput
            v-model="formEmail"
            size="xl"
            placeholder="เช่น sureeporn@agency.go.th"
            class="w-full"
            :ui="inputUiByError(!!formEmailError)"
          />
        </UFormField>

        <UFormField label="เบอร์ติดต่อ" :error="formContactError">
          <UInput
            v-model="formContact"
            size="xl"
            placeholder="เช่น 081-000-1122"
            class="w-full"
            :ui="inputUiByError(!!formContactError)"
          />
        </UFormField>

        <UFormField label="ตำแหน่ง" :error="formPositionError">
          <UInput
            v-model="formPosition"
            size="xl"
            placeholder="เช่น เจ้าหน้าที่คลังสื่อ"
            class="w-full"
            :ui="inputUiByError(!!formPositionError)"
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

    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขเจ้าหน้าที่ศูนย์"
      description="แก้ไขข้อมูลเจ้าหน้าที่"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <UFormField label="รหัสเจ้าหน้าที่" :error="editCodeError">
          <UInput v-model="editCode" size="xl" class="w-full" :ui="inputUiByError(!!editCodeError)" />
        </UFormField>

        <UFormField label="ชื่อ-นามสกุล" :error="editFullNameError">
          <UInput v-model="editFullName" size="xl" class="w-full" :ui="inputUiByError(!!editFullNameError)" />
        </UFormField>

        <UFormField label="อีเมล" :error="editEmailError">
          <UInput v-model="editEmail" size="xl" class="w-full" :ui="inputUiByError(!!editEmailError)" />
        </UFormField>

        <UFormField label="เบอร์ติดต่อ" :error="editContactError">
          <UInput v-model="editContact" size="xl" class="w-full" :ui="inputUiByError(!!editContactError)" />
        </UFormField>

        <UFormField label="ตำแหน่ง" :error="editPositionError">
          <UInput v-model="editPosition" size="xl" class="w-full" :ui="inputUiByError(!!editPositionError)" />
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

    <CrudFormModal
      v-model:open="openDuplicate"
      title="สร้างซ้ำเจ้าหน้าที่ศูนย์"
      description="ระบบคัดลอกข้อมูลจากเจ้าหน้าที่เดิม คุณสามารถแก้ไขก่อนบันทึกได้"
      submit-text="บันทึก"
      @submit="submitDuplicate"
    >
      <div class="space-y-4">
        <UFormField label="รหัสเจ้าหน้าที่" :error="duplicateCodeError">
          <UInput v-model="duplicateCode" size="xl" class="w-full" :ui="inputUiByError(!!duplicateCodeError)" />
        </UFormField>

        <UFormField label="ชื่อ-นามสกุล" :error="duplicateFullNameError">
          <UInput
            v-model="duplicateFullName"
            size="xl"
            class="w-full"
            :ui="inputUiByError(!!duplicateFullNameError)"
          />
        </UFormField>

        <UFormField label="อีเมล" :error="duplicateEmailError">
          <UInput v-model="duplicateEmail" size="xl" class="w-full" :ui="inputUiByError(!!duplicateEmailError)" />
        </UFormField>

        <UFormField label="เบอร์ติดต่อ" :error="duplicateContactError">
          <UInput
            v-model="duplicateContact"
            size="xl"
            class="w-full"
            :ui="inputUiByError(!!duplicateContactError)"
          />
        </UFormField>

        <UFormField label="ตำแหน่ง" :error="duplicatePositionError">
          <UInput
            v-model="duplicatePosition"
            size="xl"
            class="w-full"
            :ui="inputUiByError(!!duplicatePositionError)"
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
import MediaColumnToggle from '~/components/learning-materials/MediaColumnToggle.vue' // ✅ Import Component

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
  updatedAt: string
  updatedBy: string
}

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')

/** ✅ สำคัญ: ref สำหรับ MediaHQTable เพื่อส่งไปให้ MediaColumnToggle */
const table = ref<any>(null)

// คนล็อกอิน
const currentUserName = computed(() => 'แอดมิน')

/** ✅ input ui: ปกติ vs error (กรอบแดง) */
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
  const y = m[1]
  const mo = m[2]
  const da = m[3]
  if (!y || !mo || !da) return isoDate || '-'
  const d = new Date(Number(y), Number(mo) - 1, Number(da))
  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { dateStyle: 'medium' }).format(d)
}

const todayISO = computed(() => {
  const now = new Date()
  return toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
})

/** ===== STATUS (ไทยใน USelect แต่เก็บค่าอังกฤษ) ===== */
const statusThaiItems: string[] = ['บัญชีปกติ', 'บัญชีถูกระงับ']
const statusValueToThai = (value: StaffStatus): string => (value === 'inactive' ? 'บัญชีถูกระงับ' : 'บัญชีปกติ')
const statusThaiToValue = (label: string): StaffStatus => (label === 'บัญชีถูกระงับ' ? 'inactive' : 'active')

/** ===== mock data ===== */
const allItems = ref<CenterStaffRow[]>([
  {
    id: 1,
    code: 'CST-001',
    fullName: 'สุรีย์พร ชาญชัย',
    email: 'sureeporn@agency.go.th',
    contact: '081-000-1122',
    position: 'เจ้าหน้าที่คลังสื่อ',
    status: 'active',
    createdAt: '2026-01-20',
    createdBy: 'แอดมิน',
    updatedAt: '2026-01-20',
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
    createdAt: '2026-01-21',
    createdBy: 'แอดมิน',
    updatedAt: '2026-01-21',
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
    createdAt: '2026-01-22',
    createdBy: 'เจ้าหน้าที่คลังสื่อ',
    updatedAt: '2026-01-22',
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
    createdAt: '2026-01-25',
    createdBy: 'แอดมิน',
    updatedAt: '2026-01-25',
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
    createdAt: '2026-01-30',
    createdBy: 'แอดมิน',
    updatedAt: '2026-01-30',
    updatedBy: 'เจ้าหน้าที่คลังสื่อ'
  }
])

/** ===== validate & duplicate ===== */
const normalize = (s: string) => s.trim().toLowerCase()

const validateText2to50 = (value: string, label: string): string | undefined => {
  const v = value.trim()
  if (v.length < 2) return `${label}ต้องกรอกอย่างน้อย 2 ตัวอักษร`
  if (v.length > 50) return `${label}ห้ามเกิน 50 ตัวอักษร`
  return undefined
}

const CODE_RE = /^[A-Za-z]{2,5}-\d{3}$/
const validateStaffCode = (value: string): string | undefined => {
  const v = value.trim()
  if (v.length < 2) return 'รหัสเจ้าหน้าที่ต้องกรอกอย่างน้อย 2 ตัวอักษร'
  if (v.length > 50) return 'รหัสเจ้าหน้าที่ห้ามเกิน 50 ตัวอักษร'
  if (!CODE_RE.test(v)) return 'รูปแบบรหัสเจ้าหน้าที่ไม่ถูกต้อง (เช่น CST-001)'
  return undefined
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const validateEmail = (value: string): string | undefined => {
  const v = value.trim()
  if (v.length < 2) return 'อีเมลต้องกรอกอย่างน้อย 2 ตัวอักษร'
  if (v.length > 50) return 'อีเมลห้ามเกิน 50 ตัวอักษร'
  if (!EMAIL_RE.test(v)) return 'กรุณากรอกอีเมลให้ถูกต้อง'
  return undefined
}

const isDuplicateCode = (code: string, excludeId?: number | null) =>
  allItems.value.some((u) => (excludeId != null && u.id === excludeId ? false : normalize(u.code) === normalize(code)))

const isDuplicateEmail = (email: string, excludeId?: number | null) =>
  allItems.value.some((u) => (excludeId != null && u.id === excludeId ? false : normalize(u.email) === normalize(email)))

/** ===== helpers for duplicate generation ===== */
const pad3 = (n: number) => String(n).padStart(3, '0')
const parseStaffCode = (code: string): { prefix: string; num: number } | null => {
  const m = code.trim().match(/^([A-Za-z]{2,5})-(\d{3})$/)
  if (!m) return null
  const prefix = m[1]
  const numStr = m[2]
  if (!prefix || !numStr) return null
  return { prefix: prefix.toUpperCase(), num: Number(numStr) }
}

const makeNextStaffCode = (base: string) => {
  const parsed = parseStaffCode(base)
  if (!parsed) return base.trim()

  const { prefix, num } = parsed
  const candidate = `${prefix}-${pad3(num)}`
  if (!isDuplicateCode(candidate)) return candidate

  let i = num + 1
  while (true) {
    const next = `${prefix}-${pad3(i)}`
    if (!isDuplicateCode(next)) return next
    i++
  }
}

const makeNextEmail = (base: string) => {
  const raw = base.trim()
  if (!raw) return raw
  if (!isDuplicateEmail(raw)) return raw

  const at = raw.indexOf('@')
  if (at <= 0) {
    let i = 2
    while (true) {
      const next = `${raw}${i}`
      if (!isDuplicateEmail(next)) return next
      i++
    }
  }

  const local = raw.slice(0, at)
  const domain = raw.slice(at + 1)
  let i = 2
  while (true) {
    const next = `${local}+${i}@${domain}`
    if (!isDuplicateEmail(next)) return next
    i++
  }
}

const makeNextName = (base: string) => {
  const raw = base.trim()
  if (!raw) return raw
  let i = 2
  while (true) {
    const next = `${raw} ${i}`
    const exists = allItems.value.some((u) => normalize(u.fullName) === normalize(next))
    if (!exists) return next
    i++
  }
}

/** ===== header actions ===== */
const handleExport = () => console.log('export center-staff')

/** ===== CREATE ===== */
const openCreate = ref(false)
const formCode = ref('')
const formFullName = ref('')
const formEmail = ref('')
const formContact = ref('')
const formPosition = ref('')
const formStatus = ref<StaffStatus>('active')

const formCodeError = ref<string | undefined>(undefined)
const formFullNameError = ref<string | undefined>(undefined)
const formEmailError = ref<string | undefined>(undefined)
const formContactError = ref<string | undefined>(undefined)
const formPositionError = ref<string | undefined>(undefined)

watch([formCode, formFullName, formEmail, formContact, formPosition], () => {
  formCodeError.value = validateStaffCode(formCode.value)
  if (!formCodeError.value && isDuplicateCode(formCode.value)) formCodeError.value = 'รหัสเจ้าหน้าที่นี้มีอยู่แล้ว (ห้ามซ้ำ)'

  formFullNameError.value = validateText2to50(formFullName.value, 'ชื่อ-นามสกุล')

  formEmailError.value = validateEmail(formEmail.value)
  if (!formEmailError.value && isDuplicateEmail(formEmail.value)) formEmailError.value = 'อีเมลนี้มีอยู่แล้ว (ห้ามซ้ำ)'

  formContactError.value = validateText2to50(formContact.value, 'เบอร์ติดต่อ')
  formPositionError.value = validateText2to50(formPosition.value, 'ตำแหน่ง')
})

const handleCreate = () => {
  formCode.value = ''
  formFullName.value = ''
  formEmail.value = ''
  formContact.value = ''
  formPosition.value = ''
  formStatus.value = 'active'

  formCodeError.value = undefined
  formFullNameError.value = undefined
  formEmailError.value = undefined
  formContactError.value = undefined
  formPositionError.value = undefined

  openCreate.value = true
}

const submitCreate = () => {
  formCodeError.value = validateStaffCode(formCode.value)
  formFullNameError.value = validateText2to50(formFullName.value, 'ชื่อ-นามสกุล')
  formEmailError.value = validateEmail(formEmail.value)
  formContactError.value = validateText2to50(formContact.value, 'เบอร์ติดต่อ')
  formPositionError.value = validateText2to50(formPosition.value, 'ตำแหน่ง')

  if (!formCodeError.value && isDuplicateCode(formCode.value)) formCodeError.value = 'รหัสเจ้าหน้าที่นี้มีอยู่แล้ว (ห้ามซ้ำ)'
  if (!formEmailError.value && isDuplicateEmail(formEmail.value)) formEmailError.value = 'อีเมลนี้มีอยู่แล้ว (ห้ามซ้ำ)'

  if (formCodeError.value || formFullNameError.value || formEmailError.value || formContactError.value || formPositionError.value) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const dateISO = todayISO.value

  allItems.value.push({
    id: nextId,
    code: formCode.value.trim(),
    fullName: formFullName.value.trim(),
    email: formEmail.value.trim(),
    contact: formContact.value.trim(),
    position: formPosition.value.trim(),
    status: formStatus.value,
    createdAt: dateISO,
    createdBy: currentUserName.value,
    updatedAt: dateISO,
    updatedBy: '-'
  })

  openCreate.value = false
}

/** ===== EDIT ===== */
const openEdit = ref(false)
const editingId = ref<number | null>(null)

const editCode = ref('')
const editFullName = ref('')
const editEmail = ref('')
const editContact = ref('')
const editPosition = ref('')
const editStatus = ref<StaffStatus>('active')

const editCodeError = ref<string | undefined>(undefined)
const editFullNameError = ref<string | undefined>(undefined)
const editEmailError = ref<string | undefined>(undefined)
const editContactError = ref<string | undefined>(undefined)
const editPositionError = ref<string | undefined>(undefined)

watch([editCode, editFullName, editEmail, editContact, editPosition, editingId], () => {
  const exId = editingId.value

  editCodeError.value = validateStaffCode(editCode.value)
  if (!editCodeError.value && isDuplicateCode(editCode.value, exId)) editCodeError.value = 'รหัสเจ้าหน้าที่นี้มีอยู่แล้ว (ห้ามซ้ำ)'

  editFullNameError.value = validateText2to50(editFullName.value, 'ชื่อ-นามสกุล')

  editEmailError.value = validateEmail(editEmail.value)
  if (!editEmailError.value && isDuplicateEmail(editEmail.value, exId)) editEmailError.value = 'อีเมลนี้มีอยู่แล้ว (ห้ามซ้ำ)'

  editContactError.value = validateText2to50(editContact.value, 'เบอร์ติดต่อ')
  editPositionError.value = validateText2to50(editPosition.value, 'ตำแหน่ง')
})

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

  editCodeError.value = undefined
  editFullNameError.value = undefined
  editEmailError.value = undefined
  editContactError.value = undefined
  editPositionError.value = undefined

  openEdit.value = true
}

const submitEdit = () => {
  if (editingId.value == null) return
  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  editCodeError.value = validateStaffCode(editCode.value)
  editFullNameError.value = validateText2to50(editFullName.value, 'ชื่อ-นามสกุล')
  editEmailError.value = validateEmail(editEmail.value)
  editContactError.value = validateText2to50(editContact.value, 'เบอร์ติดต่อ')
  editPositionError.value = validateText2to50(editPosition.value, 'ตำแหน่ง')

  if (!editCodeError.value && isDuplicateCode(editCode.value, editingId.value)) editCodeError.value = 'รหัสเจ้าหน้าที่นี้มีอยู่แล้ว (ห้ามซ้ำ)'
  if (!editEmailError.value && isDuplicateEmail(editEmail.value, editingId.value)) editEmailError.value = 'อีเมลนี้มีอยู่แล้ว (ห้ามซ้ำ)'

  if (editCodeError.value || editFullNameError.value || editEmailError.value || editContactError.value || editPositionError.value) return

  item.code = editCode.value.trim()
  item.fullName = editFullName.value.trim()
  item.email = editEmail.value.trim()
  item.contact = editContact.value.trim()
  item.position = editPosition.value.trim()
  item.status = editStatus.value
  item.updatedAt = todayISO.value
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

/** ===== DUPLICATE ===== */
const openDuplicate = ref(false)
const duplicatingFromId = ref<number | null>(null)

const duplicateCode = ref('')
const duplicateFullName = ref('')
const duplicateEmail = ref('')
const duplicateContact = ref('')
const duplicatePosition = ref('')
const duplicateStatus = ref<StaffStatus>('active')

const duplicateCodeError = ref<string | undefined>(undefined)
const duplicateFullNameError = ref<string | undefined>(undefined)
const duplicateEmailError = ref<string | undefined>(undefined)
const duplicateContactError = ref<string | undefined>(undefined)
const duplicatePositionError = ref<string | undefined>(undefined)

watch([duplicateCode, duplicateFullName, duplicateEmail, duplicateContact, duplicatePosition], () => {
  duplicateCodeError.value = validateStaffCode(duplicateCode.value)
  if (!duplicateCodeError.value && isDuplicateCode(duplicateCode.value)) duplicateCodeError.value = 'รหัสเจ้าหน้าที่นี้มีอยู่แล้ว (ห้ามซ้ำ)'

  duplicateFullNameError.value = validateText2to50(duplicateFullName.value, 'ชื่อ-นามสกุล')

  duplicateEmailError.value = validateEmail(duplicateEmail.value)
  if (!duplicateEmailError.value && isDuplicateEmail(duplicateEmail.value)) duplicateEmailError.value = 'อีเมลนี้มีอยู่แล้ว (ห้ามซ้ำ)'

  duplicateContactError.value = validateText2to50(duplicateContact.value, 'เบอร์ติดต่อ')
  duplicatePositionError.value = validateText2to50(duplicatePosition.value, 'ตำแหน่ง')
})

const handleDuplicate = (id: number) => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  duplicatingFromId.value = id

  duplicateCode.value = makeNextStaffCode(found.code)
  duplicateFullName.value = makeNextName(found.fullName)
  duplicateEmail.value = makeNextEmail(found.email)
  duplicateContact.value = found.contact
  duplicatePosition.value = found.position
  duplicateStatus.value = found.status

  duplicateCodeError.value = undefined
  duplicateFullNameError.value = undefined
  duplicateEmailError.value = undefined
  duplicateContactError.value = undefined
  duplicatePositionError.value = undefined

  openDuplicate.value = true
}

const submitDuplicate = () => {
  duplicateCodeError.value = validateStaffCode(duplicateCode.value)
  duplicateFullNameError.value = validateText2to50(duplicateFullName.value, 'ชื่อ-นามสกุล')
  duplicateEmailError.value = validateEmail(duplicateEmail.value)
  duplicateContactError.value = validateText2to50(duplicateContact.value, 'เบอร์ติดต่อ')
  duplicatePositionError.value = validateText2to50(duplicatePosition.value, 'ตำแหน่ง')

  if (!duplicateCodeError.value && isDuplicateCode(duplicateCode.value)) duplicateCodeError.value = 'รหัสเจ้าหน้าที่นี้มีอยู่แล้ว (ห้ามซ้ำ)'
  if (!duplicateEmailError.value && isDuplicateEmail(duplicateEmail.value)) duplicateEmailError.value = 'อีเมลนี้มีอยู่แล้ว (ห้ามซ้ำ)'

  if (
    duplicateCodeError.value ||
    duplicateFullNameError.value ||
    duplicateEmailError.value ||
    duplicateContactError.value ||
    duplicatePositionError.value
  ) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const dateISO = todayISO.value

  allItems.value.push({
    id: nextId,
    code: duplicateCode.value.trim(),
    fullName: duplicateFullName.value.trim(),
    email: duplicateEmail.value.trim(),
    contact: duplicateContact.value.trim(),
    position: duplicatePosition.value.trim(),
    status: duplicateStatus.value,
    createdAt: dateISO,
    createdBy: currentUserName.value,
    updatedAt: dateISO,
    updatedBy: '-'
  })

  openDuplicate.value = false
  duplicatingFromId.value = null
}

// delete (mock)
const handleDelete = (id: number) => console.log('delete', id)

/** ===== Search / Filter ===== */
const searchQuery = ref('')
const selectedStatus = ref<string>('ทั้งหมด')
const statusItems = computed<SelectMenuItem[]>(() => [
  { label: 'สถานะทั้งหมด', value: 'ทั้งหมด' },
  { label: 'บัญชีปกติ', value: 'active' },
  { label: 'บัญชีถูกระงับ', value: 'inactive' }
])

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
      it.updatedBy.toLowerCase().includes(q) ||
      it.createdAt.includes(q) ||
      it.updatedAt.includes(q)

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

/** ===== Columns ===== */
const columns: TableColumn<CenterStaffRow>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h('div', { class: 'flex items-center justify-center' }, [
        h(UCheckbox as any, {
          modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
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
    accessorKey: 'code',
    header: 'รหัสเจ้าหน้าที่',
    cell: ({ row }) => h('span', { class: 'text-orange-500 text-[13px]' }, String(row.getValue('code')))
  },
  {
    accessorKey: 'fullName',
    header: 'ชื่อ-นามสกุล',
    cell: ({ row }) =>
      h('div', { class: 'whitespace-normal break-words leading-5 text-slate-700 text-[13px]' }, String(row.getValue('fullName')))
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
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const status = row.getValue('status') as StaffStatus
      const map = {
        active: { color: 'success' as const, label: 'บัญชีปกติ' },
        inactive: { color: 'neutral' as const, label: 'บัญชีถูกระงับ' }
      } as const
      const m = map[status] ?? { color: 'neutral' as const, label: String(status) }
      return h(UBadge as any, { variant: 'subtle', color: m.color }, () => m.label)
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'วันที่สร้าง',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, formatThaiBuddhistDate(String(row.getValue('createdAt')))),
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
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, formatThaiBuddhistDate(String(row.getValue('updatedAt')))),
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
        [{ label: 'สร้างซ้ำ', icon: 'i-heroicons-clipboard-20-solid', onSelect: () => handleDuplicate(id) }],
        [{ label: 'ลบออก', icon: 'i-heroicons-trash-20-solid', onSelect: () => handleDelete(id), class: 'text-red-600' }]
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