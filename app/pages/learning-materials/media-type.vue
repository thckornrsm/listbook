<template>
  <main class=" bg-white font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">ประเภทสื่อ</h1>
        <p class="mt-1 text-sm text-slate-500">จัดการประเภทสื่อ / ประเด็นสื่อ / รหัสสื่อ</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="เพิ่มประเภทสื่อ"
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
              search-placeholder="ค้นหา (ประเภทสื่อ/ประเด็นสื่อ/เลขลำดับ)"
            />
          </div>

          <!-- filter: ประเภทสื่อ -->
          <MediaSelect v-model:category="selectedType" :items="typeItems" placeholder="ประเภทสื่อ" />

          <!-- filter: สถานะ -->
          <MediaSelect v-model:category="selectedStatus" :items="statusFilterItems" placeholder="สถานะ" />

          <!-- ✅ Columns dropdown -->
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

    <!-- CREATE modal -->
    <CrudFormModal
      v-model:open="openCreate"
      title="เพิ่มประเภทสื่อ"
      description="กรอกข้อมูลเพื่อเพิ่มประเภทสื่อใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <UFormField label="รหัสสื่อ" :error="formMediaOrderError">
          <UInput
            v-model="formMediaOrder"
            size="xl"
            placeholder="เช่น MT-006"
            class="w-full"
            :ui="inputUiByError(!!formMediaOrderError)"
          />
        </UFormField>

        <UFormField label="ประเภทสื่อ" :error="formMediaTypeError">
          <UInput
            v-model="formMediaType"
            size="xl"
            placeholder="เช่น สื่อสิ่งพิมพ์"
            class="w-full"
            :ui="inputUiByError(!!formMediaTypeError)"
          />
        </UFormField>

        <UFormField label="ประเด็นสื่อ" :error="formMediaTopicError">
          <UInput
            v-model="formMediaTopic"
            size="xl"
            placeholder="เช่น โภชนาการ"
            class="w-full"
            :ui="inputUiByError(!!formMediaTopicError)"
          />
        </UFormField>

        <!-- ✅ สถานะ: แสดงไทย แต่เก็บค่า active/inactive -->
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

        <div>
          <UAlert
            title="หมายเหตุ"
            :description="noteDesc"
            color="warning"
            variant="outline"
            :ui="{ description: 'whitespace-pre-line' }"
          />
        </div>
      </div>
    </CrudFormModal>

    <!-- EDIT modal -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขประเภทสื่อ"
      description="แก้ไขข้อมูลประเภทสื่อ"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <UFormField label="ประเภทสื่อ" :error="editMediaTypeError">
          <UInput
            v-model="editMediaType"
            size="xl"
            placeholder="เช่น สื่อสิ่งพิมพ์"
            class="w-full"
            :ui="inputUiByError(!!editMediaTypeError)"
          />
        </UFormField>

        <UFormField label="ประเด็นสื่อ" :error="editMediaTopicError">
          <UInput
            v-model="editMediaTopic"
            size="xl"
            placeholder="เช่น โภชนาการ"
            class="w-full"
            :ui="inputUiByError(!!editMediaTopicError)"
          />
        </UFormField>

        <UFormField label="รหัสสื่อ" :error="editMediaOrderError">
          <UInput
            v-model="editMediaOrder"
            size="xl"
            placeholder="เช่น MT-006"
            class="w-full"
            :ui="inputUiByError(!!editMediaOrderError)"
          />
        </UFormField>

        <!-- ✅ สถานะ -->
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
      title="สร้างซ้ำประเภทสื่อ"
      description="ระบบคัดลอกข้อมูลจากรายการเดิม คุณสามารถแก้ไขก่อนบันทึกได้"
      submit-text="บันทึก"
      @submit="submitDuplicate"
    >
      <div class="space-y-4">
        <UFormField label="รหัสสื่อ" :error="duplicateMediaOrderError">
          <UInput
            v-model="duplicateMediaOrder"
            size="xl"
            placeholder="เช่น MT-006"
            class="w-full"
            :ui="inputUiByError(!!duplicateMediaOrderError)"
          />
        </UFormField>

        <UFormField label="ประเภทสื่อ" :error="duplicateMediaTypeError">
          <UInput
            v-model="duplicateMediaType"
            size="xl"
            placeholder="เช่น สื่อสิ่งพิมพ์"
            class="w-full"
            :ui="inputUiByError(!!duplicateMediaTypeError)"
          />
        </UFormField>

        <UFormField label="ประเด็นสื่อ" :error="duplicateMediaTopicError">
          <UInput
            v-model="duplicateMediaTopic"
            size="xl"
            placeholder="เช่น โภชนาการ"
            class="w-full"
            :ui="inputUiByError(!!duplicateMediaTopicError)"
          />
        </UFormField>

        <!-- ✅ สถานะ -->
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

type RowSelectionState = Record<string, boolean>
type MediaStatus = 'active' | 'inactive'

type MediaTypeRow = {
  id: number
  mediaType: string
  mediaTopic: string
  mediaOrder: string
  status: MediaStatus
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

/** ✅ สำคัญ: ref สำหรับ MediaHQTable เพื่ออ่าน tableApi */
const table = ref<any>(null)

// คนล็อกอิน
const currentUserName = computed(() => 'แอดมิน')

// UI (ทำกรอบแดงตอน validate)
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

const noteDesc =
  `- อักษร 2 ตัวแรก คือ ประเภทของสื่อ
- ตัวเลข 4 หลักต่อมา คือ ประเด็นสื่อ
- ตัวเลข 2 หลักต่อมา คือ รหัสสื่อ
- ตัวเลข 2 หลักสุดท้าย คือ ปีที่ผลิตสื่อ
- หากมีการพิมพ์เพิ่มในปีนั้นๆ จะตามด้วย จุด เช่น พิมพ์ครั้งที่ 1 ปี 17 = xxxxxx-xx-17.1`

// helper: วันไทย + เวลา
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

/** =========================
 * STATUS (ไทยใน USelect แต่เก็บค่าอังกฤษ)
 * ========================= */
const statusThaiItems: string[] = ['เปิดใช้งาน', 'ปิดใช้งาน']

const statusValueToThai = (value: MediaStatus): string =>
  value === 'inactive' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'

const statusThaiToValue = (label: string): MediaStatus =>
  label === 'ปิดใช้งาน' ? 'inactive' : 'active'

/** ===== filter items (สถานะ) ===== */
const statusFilterItems = computed<SelectMenuItem[]>(() => [
  { label: 'สถานะทั้งหมด', value: 'ทั้งหมด' },
  { label: 'เปิดใช้งาน', value: 'active' },
  { label: 'ปิดใช้งาน', value: 'inactive' }
])

/** ===== validate helpers ===== */
const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()

const validateText2to50 = (value: string, label = 'ข้อมูล'): string | undefined => {
  const v = value.trim()
  if (v.length < 2) return `${label}ต้องกรอกอย่างน้อย 2 ตัวอักษร`
  if (v.length > 50) return `${label}ห้ามเกิน 50 ตัวอักษร`
  return undefined
}

// รหัสสื่อเดิม: MT-006
const ORDER_RE = /^[A-Za-z]{2}-\d{3}$/i
const validateMediaOrder = (value: string): string | undefined => {
  const v = value.trim()
  if (!v) return 'รหัสสื่อต้องกรอกอย่างน้อย 2 ตัวอักษร'
  if (!ORDER_RE.test(v)) return 'รูปแบบรหัสสื่อไม่ถูกต้อง (เช่น MT-006)'
  return undefined
}

/** ===== mock data ===== */
const allItems = ref<MediaTypeRow[]>([
  {
    id: 1,
    mediaType: 'สื่อสิ่งพิมพ์',
    mediaTopic: 'โภชนาการ',
    mediaOrder: 'MT-001',
    status: 'active',
    createdAt: '20 ม.ค. 2569 10:20',
    createdBy: 'แอดมิน',
    updatedAt: '20 ม.ค. 2569 10:20',
    updatedBy: 'แอดมิน'
  },
  {
    id: 2,
    mediaType: 'สื่อสิ่งพิมพ์',
    mediaTopic: 'ความปลอดภัยทางถนน',
    mediaOrder: 'MT-002',
    status: 'active',
    createdAt: '20 ม.ค. 2569 11:05',
    createdBy: 'แอดมิน',
    updatedAt: '20 ม.ค. 2569 11:05',
    updatedBy: 'เจ้าหน้าที่'
  },
  {
    id: 3,
    mediaType: 'สื่อดิจิทัล',
    mediaTopic: 'สุขภาพจิต',
    mediaOrder: 'MT-003',
    status: 'inactive',
    createdAt: '21 ม.ค. 2569 09:10',
    createdBy: 'แอดมิน',
    updatedAt: '21 ม.ค. 2569 09:10',
    updatedBy: 'แอดมิน'
  },
  {
    id: 4,
    mediaType: 'บอร์ด/นิทรรศการ',
    mediaTopic: 'งดเหล้า/บุหรี่',
    mediaOrder: 'MT-004',
    status: 'active',
    createdAt: '21 ม.ค. 2569 14:30',
    createdBy: 'แอดมิน',
    updatedAt: '21 ม.ค. 2569 14:30',
    updatedBy: 'เจ้าหน้าที่'
  },
  {
    id: 5,
    mediaType: 'สื่ออุปกรณ์กิจกรรม',
    mediaTopic: 'ออกกำลังกาย',
    mediaOrder: 'MT-005',
    status: 'inactive',
    createdAt: '22 ม.ค. 2569 16:45',
    createdBy: 'แอดมิน',
    updatedAt: '22 ม.ค. 2569 16:45',
    updatedBy: 'แอดมิน'
  }
])

/** ===== duplicate checks ===== */
const isDuplicateMediaType = (value: string, excludeId?: number | null) => {
  const v = normalize(value)
  return allItems.value.some((it) => {
    if (excludeId != null && it.id === excludeId) return false
    return normalize(it.mediaType) === v
  })
}

const isDuplicateTopicUnderType = (typeVal: string, topicVal: string, excludeId?: number | null) => {
  const t = normalize(typeVal)
  const p = normalize(topicVal)
  return allItems.value.some((it) => {
    if (excludeId != null && it.id === excludeId) return false
    return normalize(it.mediaType) === t && normalize(it.mediaTopic) === p
  })
}

const isDuplicateMediaOrder = (value: string, excludeId?: number | null) => {
  const v = normalize(value)
  return allItems.value.some((it) => {
    if (excludeId != null && it.id === excludeId) return false
    return normalize(it.mediaOrder) === v
  })
}

// ✅ สร้างชื่อ topic แบบไม่ใช้ "สำเนา" -> เติมเลข 2,3,4...
const makeDuplicateTopicName = (typeVal: string, topicVal: string, excludeId?: number | null) => {
  const raw = topicVal.trim()
  if (!isDuplicateTopicUnderType(typeVal, raw, excludeId)) return raw
  let i = 2
  while (true) {
    const next = `${raw} ${i}`
    if (!isDuplicateTopicUnderType(typeVal, next, excludeId)) return next
    i++
  }
}

// ✅ สร้างรหัสสื่อใหม่แบบ MT-001 → MT-002 ... (กันซ้ำตาม regex เดิม)
const pad3 = (n: number) => String(n).padStart(3, '0')
const parseOrder = (order: string): { prefix: string; num: number } | null => {
  const m = order.trim().match(/^([A-Za-z]{2})-(\d{3})$/)
  if (!m) return null

  const prefix = m[1]
  const numStr = m[2]
  if (!prefix || !numStr) return null

  return { prefix: prefix.toUpperCase(), num: Number(numStr) }
}

const makeNextOrder = (baseOrder: string, excludeId?: number | null) => {
  const parsed = parseOrder(baseOrder)
  if (!parsed) return baseOrder.trim()

  const { prefix, num } = parsed
  const base = `${prefix}-${pad3(num)}`
  if (!isDuplicateMediaOrder(base, excludeId)) return base

  let n = num + 1
  while (true) {
    const next = `${prefix}-${pad3(n)}`
    if (!isDuplicateMediaOrder(next, excludeId)) return next
    n++
  }
}

/** ===== actions ===== */
const handleExport = () => console.log('export media-type')
const handleDelete = (id: number) => console.log('delete', id)

/** ===== CREATE ===== */
const openCreate = ref(false)
const formMediaType = ref('')
const formMediaTopic = ref('')
const formMediaOrder = ref('')
const formStatus = ref<MediaStatus>('active')

// ✅ UFormField :error ต้องเป็น string | boolean | undefined (ห้าม null)
const formMediaTypeError = ref<string | undefined>(undefined)
const formMediaTopicError = ref<string | undefined>(undefined)
const formMediaOrderError = ref<string | undefined>(undefined)

const handleCreate = () => {
  formMediaType.value = ''
  formMediaTopic.value = ''
  formMediaOrder.value = ''
  formStatus.value = 'active'

  formMediaTypeError.value = undefined
  formMediaTopicError.value = undefined
  formMediaOrderError.value = undefined

  openCreate.value = true
}

watch([formMediaType, formMediaTopic, formMediaOrder], () => {
  formMediaTypeError.value = validateText2to50(formMediaType.value, 'ประเภทสื่อ')
  if (!formMediaTypeError.value && isDuplicateMediaType(formMediaType.value)) {
    formMediaTypeError.value = 'ประเภทสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }

  formMediaTopicError.value = validateText2to50(formMediaTopic.value, 'ประเด็นสื่อ')
  if (!formMediaTopicError.value && formMediaType.value.trim()) {
    if (isDuplicateTopicUnderType(formMediaType.value, formMediaTopic.value)) {
      formMediaTopicError.value = 'ประเด็นสื่อนี้มีอยู่แล้วภายใต้ประเภทสื่อนี้ (ห้ามซ้ำ)'
    }
  }

  formMediaOrderError.value = validateMediaOrder(formMediaOrder.value)
  if (!formMediaOrderError.value && isDuplicateMediaOrder(formMediaOrder.value)) {
    formMediaOrderError.value = 'รหัสสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const submitCreate = () => {
  const type = formMediaType.value.trim()
  const topic = formMediaTopic.value.trim()
  const order = formMediaOrder.value.trim()

  formMediaTypeError.value = validateText2to50(type, 'ประเภทสื่อ')
  formMediaTopicError.value = validateText2to50(topic, 'ประเด็นสื่อ')
  formMediaOrderError.value = validateMediaOrder(order)

  if (!formMediaTypeError.value && isDuplicateMediaType(type)) {
    formMediaTypeError.value = 'ประเภทสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
  if (!formMediaTopicError.value && type && isDuplicateTopicUnderType(type, topic)) {
    formMediaTopicError.value = 'ประเด็นสื่อนี้มีอยู่แล้วภายใต้ประเภทสื่อนี้ (ห้ามซ้ำ)'
  }
  if (!formMediaOrderError.value && isDuplicateMediaOrder(order)) {
    formMediaOrderError.value = 'รหัสสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }

  if (formMediaTypeError.value || formMediaTopicError.value || formMediaOrderError.value) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const now = formatThaiDateTime(new Date())

  allItems.value.push({
    id: nextId,
    mediaType: type,
    mediaTopic: topic,
    mediaOrder: order,
    status: formStatus.value,
    createdAt: now,
    createdBy: currentUserName.value,
    updatedAt: now,
    updatedBy: '-'
  })

  openCreate.value = false
}

/** ===== EDIT ===== */
const openEdit = ref(false)
const editingId = ref<number | null>(null)

const editMediaType = ref('')
const editMediaTopic = ref('')
const editMediaOrder = ref('')
const editStatus = ref<MediaStatus>('active')

const editMediaTypeError = ref<string | undefined>(undefined)
const editMediaTopicError = ref<string | undefined>(undefined)
const editMediaOrderError = ref<string | undefined>(undefined)

const handleEdit = (id: number) => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editMediaType.value = found.mediaType
  editMediaTopic.value = found.mediaTopic
  editMediaOrder.value = found.mediaOrder
  editStatus.value = found.status

  editMediaTypeError.value = undefined
  editMediaTopicError.value = undefined
  editMediaOrderError.value = undefined

  openEdit.value = true
}

watch([editMediaType, editMediaTopic, editMediaOrder, editingId], () => {
  const exId = editingId.value

  editMediaTypeError.value = validateText2to50(editMediaType.value, 'ประเภทสื่อ')
  if (!editMediaTypeError.value && isDuplicateMediaType(editMediaType.value, exId)) {
    editMediaTypeError.value = 'ประเภทสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }

  editMediaTopicError.value = validateText2to50(editMediaTopic.value, 'ประเด็นสื่อ')
  if (!editMediaTopicError.value && editMediaType.value.trim()) {
    if (isDuplicateTopicUnderType(editMediaType.value, editMediaTopic.value, exId)) {
      editMediaTopicError.value = 'ประเด็นสื่อนี้มีอยู่แล้วภายใต้ประเภทสื่อนี้ (ห้ามซ้ำ)'
    }
  }

  editMediaOrderError.value = validateMediaOrder(editMediaOrder.value)
  if (!editMediaOrderError.value && isDuplicateMediaOrder(editMediaOrder.value, exId)) {
    editMediaOrderError.value = 'รหัสสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const submitEdit = () => {
  if (editingId.value == null) return
  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const type = editMediaType.value.trim()
  const topic = editMediaTopic.value.trim()
  const order = editMediaOrder.value.trim()

  editMediaTypeError.value = validateText2to50(type, 'ประเภทสื่อ')
  editMediaTopicError.value = validateText2to50(topic, 'ประเด็นสื่อ')
  editMediaOrderError.value = validateMediaOrder(order)

  if (!editMediaTypeError.value && isDuplicateMediaType(type, editingId.value)) {
    editMediaTypeError.value = 'ประเภทสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
  if (!editMediaTopicError.value && type && isDuplicateTopicUnderType(type, topic, editingId.value)) {
    editMediaTopicError.value = 'ประเด็นสื่อนี้มีอยู่แล้วภายใต้ประเภทสื่อนี้ (ห้ามซ้ำ)'
  }
  if (!editMediaOrderError.value && isDuplicateMediaOrder(order, editingId.value)) {
    editMediaOrderError.value = 'รหัสสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }

  if (editMediaTypeError.value || editMediaTopicError.value || editMediaOrderError.value) return

  item.mediaType = type
  item.mediaTopic = topic
  item.mediaOrder = order
  item.status = editStatus.value
  item.updatedAt = formatThaiDateTime(new Date())
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

/** ===== DUPLICATE ===== */
const openDuplicate = ref(false)
const duplicatingFromId = ref<number | null>(null)

const duplicateMediaType = ref('')
const duplicateMediaTopic = ref('')
const duplicateMediaOrder = ref('')
const duplicateStatus = ref<MediaStatus>('active')

const duplicateMediaTypeError = ref<string | undefined>(undefined)
const duplicateMediaTopicError = ref<string | undefined>(undefined)
const duplicateMediaOrderError = ref<string | undefined>(undefined)

watch([duplicateMediaType, duplicateMediaTopic, duplicateMediaOrder, duplicatingFromId], () => {
  duplicateMediaTypeError.value = validateText2to50(duplicateMediaType.value, 'ประเภทสื่อ')

  duplicateMediaTopicError.value = validateText2to50(duplicateMediaTopic.value, 'ประเด็นสื่อ')
  if (!duplicateMediaTopicError.value && duplicateMediaType.value.trim()) {
    if (isDuplicateTopicUnderType(duplicateMediaType.value, duplicateMediaTopic.value)) {
      duplicateMediaTopicError.value = 'ประเด็นสื่อนี้มีอยู่แล้วภายใต้ประเภทสื่อนี้ (ห้ามซ้ำ)'
    }
  }

  duplicateMediaOrderError.value = validateMediaOrder(duplicateMediaOrder.value)
  if (!duplicateMediaOrderError.value && isDuplicateMediaOrder(duplicateMediaOrder.value)) {
    duplicateMediaOrderError.value = 'รหัสสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const handleDuplicate = (id: number) => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  duplicatingFromId.value = id

  duplicateMediaType.value = found.mediaType
  duplicateMediaTopic.value = makeDuplicateTopicName(found.mediaType, found.mediaTopic)
  duplicateMediaOrder.value = makeNextOrder(found.mediaOrder)
  duplicateStatus.value = found.status

  duplicateMediaTypeError.value = undefined
  duplicateMediaTopicError.value = undefined
  duplicateMediaOrderError.value = undefined

  openDuplicate.value = true
}

const submitDuplicate = () => {
  const type = duplicateMediaType.value.trim()
  const topic = duplicateMediaTopic.value.trim()
  const order = duplicateMediaOrder.value.trim()

  duplicateMediaTypeError.value = validateText2to50(type, 'ประเภทสื่อ')
  duplicateMediaTopicError.value = validateText2to50(topic, 'ประเด็นสื่อ')
  duplicateMediaOrderError.value = validateMediaOrder(order)

  if (!duplicateMediaTopicError.value && type && isDuplicateTopicUnderType(type, topic)) {
    duplicateMediaTopicError.value = 'ประเด็นสื่อนี้มีอยู่แล้วภายใต้ประเภทสื่อนี้ (ห้ามซ้ำ)'
  }
  if (!duplicateMediaOrderError.value && isDuplicateMediaOrder(order)) {
    duplicateMediaOrderError.value = 'รหัสสื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }

  if (duplicateMediaTypeError.value || duplicateMediaTopicError.value || duplicateMediaOrderError.value) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const now = formatThaiDateTime(new Date())

  allItems.value.push({
    id: nextId,
    mediaType: type,
    mediaTopic: topic,
    mediaOrder: order,
    status: duplicateStatus.value,
    createdAt: now,
    createdBy: currentUserName.value,
    updatedAt: now,
    updatedBy: '-'
  })

  openDuplicate.value = false
  duplicatingFromId.value = null
}

/** ===== filters/search ===== */
const searchQuery = ref('')
const selectedType = ref<string>('ทั้งหมด')
const selectedStatus = ref<string>('ทั้งหมด')

const typeItems = computed<SelectMenuItem[]>(() => {
  const types = Array.from(new Set(allItems.value.map((d) => d.mediaType)))
  return [{ label: 'ทั้งหมด', value: 'ทั้งหมด' }, ...types.map((t) => ({ label: t, value: t }))]
})

const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

const currentPage = ref(1)
const pageSize = ref(8)

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const t = selectedType.value
  const s = selectedStatus.value

  return allItems.value.filter((it) => {
    const matchSearch =
      !q ||
      it.mediaType.toLowerCase().includes(q) ||
      it.mediaTopic.toLowerCase().includes(q) ||
      it.mediaOrder.toLowerCase().includes(q) ||
      it.createdBy.toLowerCase().includes(q) ||
      it.updatedBy.toLowerCase().includes(q) ||
      it.createdAt.toLowerCase().includes(q) ||
      it.updatedAt.toLowerCase().includes(q)

    const matchType = !t || t === 'ทั้งหมด' || it.mediaType === t
    const matchStatus = !s || s === 'ทั้งหมด' || it.status === s

    return matchSearch && matchType && matchStatus
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

watch([searchQuery, selectedType, selectedStatus], () => {
  currentPage.value = 1
  rowSelection.value = {}
})

/** ===== columns ===== */
const columns: TableColumn<MediaTypeRow>[] = [
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
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, `${row.getValue('id')}`),
    meta: { class: { th: 'w-10', td: 'w-10' } }
  },
  {
    accessorKey: 'mediaOrder',
    header: 'รหัสสื่อ',
    cell: ({ row }) => h('span', { class: 'text-orange-500 text-[13px]' }, String(row.getValue('mediaOrder')))
  },
  {
    accessorKey: 'mediaType',
    header: 'ประเภทสื่อ',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('mediaType')))
  },
  {
    accessorKey: 'mediaTopic',
    header: 'ประเด็นสื่อ',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('mediaTopic')))
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const status = row.getValue('status') as MediaStatus
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
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('createdAt'))),
    meta: { class: { th: 'w-36', td: 'w-36' } }
  },
  {
    accessorKey: 'createdBy',
    header: 'สร้างโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('createdBy'))),
    meta: { class: { th: 'w-28', td: 'w-28' } }
  },
  {
    accessorKey: 'updatedAt',
    header: 'วันที่อัปเดต',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('updatedAt'))),
    meta: { class: { th: 'w-36', td: 'w-36' } }
  },
  {
    accessorKey: 'updatedBy',
    header: 'อัปเดตโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('updatedBy'))),
    meta: { class: { th: 'w-28', td: 'w-28' } }
  },
  {
    id: 'actions',
    header: 'จัดการ',
    meta: { class: { th: 'text-center', td: 'text-center' } },
    cell: ({ row }) => {
      const id = row.original.id
      const items = [
        [
          { label: 'สร้างซ้ำ', icon: 'i-heroicons-clipboard-20-solid', onSelect: () => handleDuplicate(id) }
        ],
        [
          { label: 'ลบออก', icon: 'i-heroicons-trash-20-solid', onSelect: () => handleDelete(id), class: 'text-red-600' }
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