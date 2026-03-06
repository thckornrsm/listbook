<template>
  <main class="bg-white font-[Kanit]">
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">คำถามแบบประเมินความพึงพอใจ</h1>
        <p class="mt-1 text-sm text-slate-500">จัดการคำถามสำหรับแบบประเมินความพึงพอใจ</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="เพิ่มคำถาม"
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
              search-placeholder="ค้นหา (คำถาม/รูปแบบการตอบ/ผู้สร้าง/ผู้อัปเดต)"
            />
          </div>

          <MediaSelect
            v-model:category="selectedAnswerType"
            :items="answerTypeFilterItems"
            placeholder="รูปแบบการตอบ"
            all-label="ประเภทคำตอบทั้งหมด"
          />

          <MediaSelect v-model:category="selectedStatus" :items="statusFilterItems" placeholder="สถานะ" />

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
      title="เพิ่มคำถามความพึงพอใจ"
      description="กรอกคำถามและเลือกรูปแบบการตอบ"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <UFormField label="คำถามความพึงพอใจ" :error="formQuestionError">
          <UTextarea
            v-model="formQuestion"
            :rows="4"
            placeholder="พิมพ์คำถาม เช่น คุณพึงพอใจต่อการให้บริการมากน้อยเพียงใด?"
            class="w-full"
            :ui="textareaUiByError(!!formQuestionError)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">รูปแบบการตอบ</div>
          <USelect v-model="formAnswerType" :items="answerTypeSelectItems" class="w-full" :ui="selectUi" />
          <div class="mt-1 text-xs text-slate-500">
            <template v-if="formAnswerType === 'Star Rating'">ให้คะแนนแบบดาว สูงสุด 5 ดาว</template>
            <template v-else-if="formAnswerType === 'Yes/No'">ตอบ Yes/No</template>
            <template v-else>Text ข้อเสนอแนะ</template>
          </div>
        </div>

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
      title="แก้ไขคำถามความพึงพอใจ"
      description="แก้ไขคำถาม/รูปแบบการตอบ"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <UFormField label="คำถามความพึงพอใจ" :error="editQuestionError">
          <UTextarea v-model="editQuestion" :rows="4" class="w-full" :ui="textareaUiByError(!!editQuestionError)" />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">รูปแบบการตอบ</div>
          <USelect v-model="editAnswerType" :items="answerTypeSelectItems" class="w-full" :ui="selectUi" />
        </div>

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
      title="สร้างซ้ำคำถามความพึงพอใจ"
      description="ระบบคัดลอกข้อมูลจากคำถามเดิม คุณสามารถแก้ไขก่อนบันทึกได้"
      submit-text="บันทึก"
      @submit="submitDuplicate"
    >
      <div class="space-y-4">
        <UFormField label="คำถามความพึงพอใจ" :error="duplicateQuestionError">
          <UTextarea
            v-model="duplicateQuestion"
            :rows="4"
            class="w-full"
            :ui="textareaUiByError(!!duplicateQuestionError)"
          />
        </UFormField>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">รูปแบบการตอบ</div>
          <USelect
            v-model="duplicateAnswerType"
            :items="answerTypeSelectItems"
            class="w-full"
            :ui="selectUi"
          />
        </div>

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
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'learning-materials' })

type RowSelectionState = Record<string, boolean>
type AnswerType = 'Star Rating' | 'Yes/No' | 'Text'
type QuestionStatus = 'active' | 'inactive'

type SatisfactionQuestionRow = {
  id: number
  answerOrder: number
  question: string
  answerType: AnswerType
  status: QuestionStatus
  createdAt: string // ISO: YYYY-MM-DD
  createdBy: string
  updatedAt: string // ISO: YYYY-MM-DD
  updatedBy: string
}

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const USelectMenu = resolveComponent('USelectMenu') // ใช้กับ answerType
const USelect = resolveComponent('USelect')         // ✅ ใช้กับ status
const UTextarea = resolveComponent('UTextarea')

/** ✅ สำคัญ: ref สำหรับ MediaHQTable เพื่อส่งไปให้ MediaColumnToggle */
const table = ref<any>(null)

// คนที่ล็อกอิน
const currentUserName = computed(() => 'แอดมิน')

// ui
const selectUi = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
}

// ✅ textarea กรอบแดงตอน error
const textareaUiNormal = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
}
const textareaUiError = {
  base: 'bg-slate-50 ring-1 ring-red-500 focus-within:ring-2 focus-within:ring-red-500',
  rounded: 'rounded-2xl'
}
const textareaUiByError = (hasError: boolean) => (hasError ? textareaUiError : textareaUiNormal)

/** ===== Helpers (วันที่ไทย พ.ศ.) ===== */
const pad2 = (n: number) => String(n).padStart(2, '0')
const toISODate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

const formatThaiBuddhistDate = (isoDate: string) => {
  const m = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return '-'
  const y = m[1]
  const mo = m[2]
  const da = m[3]
  if (!y || !mo || !da) return '-'
  const d = new Date(Number(y), Number(mo) - 1, Number(da))
  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { dateStyle: 'medium' }).format(d)
}

const todayISO = computed(() => {
  const now = new Date()
  return toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
})

/** =========================
 * STATUS (ไทยใน USelect แต่เก็บค่าอังกฤษ)
 * ========================= */
const statusThaiItems: string[] = ['เปิดใช้งาน', 'ปิดใช้งาน']

const statusValueToThai = (value: QuestionStatus): string =>
  value === 'inactive' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'

const statusThaiToValue = (label: string): QuestionStatus =>
  label === 'ปิดใช้งาน' ? 'inactive' : 'active'

/** =========================
 * VALIDATE (>=2, <=200, no dup)
 * ========================= */
const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()

const validateQuestionText = (value: string): string | undefined => {
  const v = value.trim()
  if (v.length < 2) return 'ต้องกรอกอย่างน้อย 2 ตัวอักษร'
  if (v.length > 200) return 'ห้ามเกิน 200 ตัวอักษร'
  return undefined
}

const allItems = ref<SatisfactionQuestionRow[]>([
  {
    id: 1,
    answerOrder: 1,
    question: 'คุณพึงพอใจต่อการให้บริการของเจ้าหน้าที่มากน้อยเพียงใด?',
    answerType: 'Star Rating',
    status: 'active',
    createdAt: '2026-02-10',
    createdBy: 'แอดมิน',
    updatedAt: '2026-02-10',
    updatedBy: 'แอดมิน'
  },
  {
    id: 2,
    answerOrder: 2,
    question: 'คุณได้รับสื่อการเรียนรู้ครบถ้วนตามที่ขอยืมหรือไม่?',
    answerType: 'Yes/No',
    status: 'active',
    createdAt: '2026-02-10',
    createdBy: 'แอดมิน',
    updatedAt: '2026-02-11',
    updatedBy: 'เจ้าหน้าที่คลังสื่อ'
  },
  {
    id: 3,
    answerOrder: 3,
    question: 'ข้อเสนอแนะเพิ่มเติมเกี่ยวกับระบบยืม-คืนสื่อการเรียนรู้',
    answerType: 'Text',
    status: 'inactive',
    createdAt: '2026-02-11',
    createdBy: 'เจ้าหน้าที่คลังสื่อ',
    updatedAt: '2026-02-11',
    updatedBy: 'เจ้าหน้าที่คลังสื่อ'
  }
])

const isDuplicateQuestion = (value: string, excludeId?: number | null) => {
  const v = normalize(value)
  return allItems.value.some((it) => {
    if (excludeId != null && it.id === excludeId) return false
    return normalize(it.question) === v
  })
}

// ✅ UFormField :error ต้องเป็น string | boolean | undefined (ห้าม null)
const formQuestionError = ref<string | undefined>(undefined)
const editQuestionError = ref<string | undefined>(undefined)
const duplicateQuestionError = ref<string | undefined>(undefined)

const answerTypeSelectItems = ['Star Rating', 'Yes/No', 'Text'] as const

const answerTypeFilterItems = computed<SelectMenuItem[]>(() => [
  { label: 'รูปแบบทั้งหมด', value: 'ทั้งหมด' },
  { label: 'Star Rating', value: 'Star Rating' },
  { label: 'Yes/No', value: 'Yes/No' },
  { label: 'Text', value: 'Text' }
])

/** ===== status items (filter) ===== */
const statusFilterItems = computed<SelectMenuItem[]>(() => [
  { label: 'สถานะทั้งหมด', value: 'ทั้งหมด' },
  { label: 'เปิดใช้งาน', value: 'active' },
  { label: 'ปิดใช้งาน', value: 'inactive' }
])

/** ===== actions ===== */
const handleExport = (): void => console.log('export satisfaction-questions')
const handleDelete = (id: number): void => console.log('delete', id)

/** ===== เรียงตามลำดับ (answerOrder) ===== */
const orderedItems = computed<SatisfactionQuestionRow[]>(() => {
  return [...allItems.value].sort((a, b) => a.answerOrder - b.answerOrder)
})

/** ===== CREATE modal ===== */
const openCreate = ref(false)
const formQuestion = ref('')
const formAnswerType = ref<AnswerType>('Star Rating')
const formStatus = ref<QuestionStatus>('active')

// realtime validate (create)
watch(formQuestion, (v) => {
  formQuestionError.value = validateQuestionText(v)
  if (!formQuestionError.value && isDuplicateQuestion(v)) {
    formQuestionError.value = 'คำถามนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const handleCreate = (): void => {
  formQuestion.value = ''
  formAnswerType.value = 'Star Rating'
  formStatus.value = 'active'
  formQuestionError.value = undefined
  openCreate.value = true
}

const submitCreate = (): void => {
  const err = validateQuestionText(formQuestion.value)
  if (err) {
    formQuestionError.value = err
    return
  }
  if (isDuplicateQuestion(formQuestion.value)) {
    formQuestionError.value = 'คำถามนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    return
  }

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const nextOrder = Math.max(0, ...allItems.value.map((i) => i.answerOrder)) + 1
  const dateISO = todayISO.value

  allItems.value.push({
    id: nextId,
    answerOrder: nextOrder,
    question: formQuestion.value.trim(),
    answerType: formAnswerType.value,
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
const editQuestion = ref('')
const editAnswerType = ref<AnswerType>('Star Rating')
const editStatus = ref<QuestionStatus>('active')

// realtime validate (edit)
watch([editQuestion, editingId], () => {
  editQuestionError.value = validateQuestionText(editQuestion.value)
  if (!editQuestionError.value && isDuplicateQuestion(editQuestion.value, editingId.value)) {
    editQuestionError.value = 'คำถามนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const handleEdit = (id: number): void => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editQuestion.value = found.question
  editAnswerType.value = found.answerType
  editStatus.value = found.status
  editQuestionError.value = undefined
  openEdit.value = true
}

const submitEdit = (): void => {
  if (editingId.value == null) return
  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const err = validateQuestionText(editQuestion.value)
  if (err) {
    editQuestionError.value = err
    return
  }
  if (isDuplicateQuestion(editQuestion.value, editingId.value)) {
    editQuestionError.value = 'คำถามนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    return
  }

  item.question = editQuestion.value.trim()
  item.answerType = editAnswerType.value
  item.status = editStatus.value
  item.updatedAt = todayISO.value
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

/** ===== DUPLICATE ===== */
const openDuplicate = ref(false)
const duplicatingFromId = ref<number | null>(null)

const duplicateQuestion = ref('')
const duplicateAnswerType = ref<AnswerType>('Star Rating')
const duplicateStatus = ref<QuestionStatus>('active')

// ไม่ใช้คำว่า "สำเนา" -> เติมเลข 2,3,4...
const makeDuplicateQuestionText = (base: string) => {
  const raw = base.trim()
  if (!isDuplicateQuestion(raw)) return raw

  let i = 2
  while (true) {
    const next = `${raw} ${i}`
    if (!isDuplicateQuestion(next)) return next
    i++
  }
}

// realtime validate (duplicate)
watch([duplicateQuestion, duplicatingFromId], () => {
  duplicateQuestionError.value = validateQuestionText(duplicateQuestion.value)
  if (!duplicateQuestionError.value && isDuplicateQuestion(duplicateQuestion.value)) {
    duplicateQuestionError.value = 'คำถามนี้มีอยู่แล้ว (ห้ามซ้ำ)'
  }
})

const handleDuplicate = (id: number): void => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  duplicatingFromId.value = id
  duplicateQuestion.value = makeDuplicateQuestionText(found.question)
  duplicateAnswerType.value = found.answerType
  duplicateStatus.value = found.status

  duplicateQuestionError.value = undefined
  openDuplicate.value = true
}

const submitDuplicate = (): void => {
  const err = validateQuestionText(duplicateQuestion.value)
  if (err) {
    duplicateQuestionError.value = err
    return
  }

  if (isDuplicateQuestion(duplicateQuestion.value)) {
    duplicateQuestionError.value = 'คำถามนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    return
  }

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const nextOrder = Math.max(0, ...allItems.value.map((i) => i.answerOrder)) + 1
  const dateISO = todayISO.value

  allItems.value.push({
    id: nextId,
    answerOrder: nextOrder,
    question: duplicateQuestion.value.trim(),
    answerType: duplicateAnswerType.value,
    status: duplicateStatus.value,
    createdAt: dateISO,
    createdBy: currentUserName.value,
    updatedAt: dateISO,
    updatedBy: '-'
  })

  openDuplicate.value = false
  duplicatingFromId.value = null
}

/** ===== Search / Filter / Pagination ===== */
const searchQuery = ref<string>('')
const selectedAnswerType = ref<string>('ทั้งหมด')
const selectedStatus = ref<string>('ทั้งหมด')

const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

const currentPage = ref<number>(1)
const pageSize = ref<number>(8)

const filteredItems = computed<SatisfactionQuestionRow[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const t = selectedAnswerType.value
  const s = selectedStatus.value

  return orderedItems.value.filter((it) => {
    const matchSearch =
      !q ||
      it.question.toLowerCase().includes(q) ||
      it.answerType.toLowerCase().includes(q) ||
      it.createdBy.toLowerCase().includes(q) ||
      it.updatedBy.toLowerCase().includes(q) ||
      String(it.id).includes(q) ||
      String(it.answerOrder).includes(q)

    const matchType = !t || t === 'ทั้งหมด' || it.answerType === t
    const matchStatus = !s || s === 'ทั้งหมด' || it.status === s

    return matchSearch && matchType && matchStatus
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<SatisfactionQuestionRow[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const handlePageChange = (page: number): void => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch([searchQuery, selectedAnswerType, selectedStatus], () => {
  currentPage.value = 1
  rowSelection.value = {}
})

/** =========================
 * MOVE ORDER (↑/↓)
 * ========================= */
const moveOrder = (id: number, dir: 'up' | 'down') => {
  const list = filteredItems.value
  const idx = list.findIndex((x) => x.id === id)
  if (idx < 0) return

  const targetIdx = dir === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= list.length) return

  const a = list[idx]
  const b = list[targetIdx]
  if (!a || !b) return

  const aReal = allItems.value.find((x) => x.id === a.id)
  const bReal = allItems.value.find((x) => x.id === b.id)
  if (!aReal || !bReal) return

  const tmp = aReal.answerOrder
  aReal.answerOrder = bReal.answerOrder
  bReal.answerOrder = tmp
}

/** ===== Columns ===== */
const columns: TableColumn<SatisfactionQuestionRow>[] = [
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
    header: 'ข้อ',
    cell: ({ row }) => {
      const displayNo = (currentPage.value - 1) * pageSize.value + row.index + 1
      return h('span', { class: 'text-slate-500 text-[13px]' }, String(displayNo))
    },
    meta: { class: { th: 'w-16', td: 'w-16' } }
  },
  {
    accessorKey: 'question',
    header: 'คำถามความพึงพอใจ',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'whitespace-normal break-words leading-5 text-slate-700 text-[13px]' },
        String(row.getValue('question'))
      )
  },
  {
    accessorKey: 'answerType',
    header: 'รูปแบบการตอบ',
    cell: ({ row }) => {
      const t = row.getValue('answerType') as AnswerType

      const iconMap = {
        'Star Rating': 'lucide:star',
        'Yes/No': 'lucide:square-check-big',
        Text: 'lucide:letter-text'
      } as const

      const icon = iconMap[t] ?? 'lucide:circle-help'

      return h('div', { class: 'inline-flex items-center gap-2 text-slate-600' }, [
        h(Icon as any, { name: icon, class: 'h-4 w-4' }),
        h('span', { class: 'text-[13px]' }, String(t))
      ])
    },
    meta: { class: { th: 'w-30', td: 'w-30' } }
  },
  {
    accessorKey: 'answerOrder',
    header: 'ลำดับสื่อ',
    meta: { class: { th: 'w-24 text-center', td: 'w-24 text-center' } },
    cell: ({ row }) => {
      const id = row.original.id
      const list = filteredItems.value
      const idx = list.findIndex((x) => x.id === id)
      const isFirst = idx <= 0
      const isLast = idx === list.length - 1

      const btnBase =
        'inline-flex items-center justify-center rounded-md p-1.5 hover:bg-slate-100 active:bg-slate-200 ' +
        'disabled:opacity-40 disabled:hover:bg-transparent'

      return h('div', { class: 'flex items-center justify-center gap-2' }, [
        h(
          'button',
          {
            type: 'button',
            class: btnBase,
            disabled: isFirst,
            onClick: () => moveOrder(id, 'up'),
            'aria-label': 'Move up'
          },
          [h(Icon as any, { name: 'lucide:arrow-up', class: 'h-4 w-4 text-slate-600' })]
        ),
        h(
          'button',
          {
            type: 'button',
            class: btnBase,
            disabled: isLast,
            onClick: () => moveOrder(id, 'down'),
            'aria-label': 'Move down'
          },
          [h(Icon as any, { name: 'lucide:arrow-down', class: 'h-4 w-4 text-slate-600' })]
        )
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const status = row.getValue('status') as QuestionStatus
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
              icon: 'i-lucide-ellipsis-vertical',
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