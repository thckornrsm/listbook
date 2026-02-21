<template>
  <main class="min-h-screen bg-white py-6 font-[Kanit]">
    <!-- Header -->
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
      <!-- Search + Filter -->
      <div class="-mx-8 px-8">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <MediaSearchFilter
              v-model:search="searchQuery"
              search-placeholder="ค้นหา (คำถาม/รูปแบบการตอบ/ผู้สร้าง/ผู้อัปเดต)"
            />
          </div>

          <MediaFilter
            v-model:category="selectedAnswerType"
            :items="answerTypeItems"
            placeholder="รูปแบบการตอบ"
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

    <!-- ✅ Create: ไม่มีช่อง "สร้างโดย/อัปเดตโดย" -->
    <CrudFormModal
      v-model:open="openCreate"
      title="เพิ่มคำถามความพึงพอใจ"
      description="กรอกคำถามและเลือกรูปแบบการตอบ"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">คำถามความพึงพอใจ</div>
          <UTextarea
            v-model="formQuestion"
            :rows="4"
            placeholder="พิมพ์คำถาม เช่น คุณพึงพอใจต่อการให้บริการมากน้อยเพียงใด?"
            class="w-full"
            :ui="textareaUi"
          />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">รูปแบบการตอบ</div>
          <USelectMenu
            v-model="formAnswerType"
            :items="answerTypeSelectItems"
            class="w-full"
            :ui="selectUi"
          />
          <div class="mt-1 text-xs text-slate-500">
            <template v-if="formAnswerType === 'Star Rating'">ให้คะแนนแบบดาว สูงสุด 5 ดาว</template>
            <template v-else-if="formAnswerType === 'Yes/No'">ตอบ Yes/No</template>
            <template v-else>Text ข้อเสนอแนะ</template>
          </div>
        </div>
      </div>
    </CrudFormModal>

    <!-- ✅ Edit: ไม่มีช่อง "สร้างโดย/อัปเดตโดย" -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขคำถามความพึงพอใจ"
      description="แก้ไขคำถาม/รูปแบบการตอบ"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">คำถามความพึงพอใจ</div>
          <UTextarea v-model="editQuestion" :rows="4" class="w-full" :ui="textareaUi" />
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">รูปแบบการตอบ</div>
          <USelectMenu
            v-model="editAnswerType"
            :items="answerTypeSelectItems"
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
import MediaFilter from '~/components/learning-materials/MediaFilter.vue'
import CrudFormModal from '~/components/common/CrudFormModal.vue'

definePageMeta({ layout: 'learning-materials' })

type RowSelectionState = Record<string, boolean>
type AnswerType = 'Star Rating' | 'Yes/No' | 'Text'

type SatisfactionQuestionRow = {
  id: number
  question: string
  answerType: AnswerType
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
const USelectMenu = resolveComponent('USelectMenu')
const UTextarea = resolveComponent('UTextarea')

// ✅ คนที่ล็อกอิน (ไปผูก auth จริงทีหลัง)
const currentUserName = computed(() => {
  // ตัวอย่าง: return useAuth().user.value?.name ?? 'แอดมิน'
  return 'แอดมิน'
})

// ui (ให้เหมือนหน้าอื่น)
const selectUi = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
}
const textareaUi = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
}

// ===== Helpers (วันที่ไทย พ.ศ.) =====
const pad2 = (n: number) => String(n).padStart(2, '0')
const toISODate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

const formatThaiBuddhistDate = (isoDate: string) => {
  const m = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return '-'
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { dateStyle: 'medium' }).format(d)
}

const todayISO = computed(() => {
  const now = new Date()
  return toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
})

// ===== dropdown items =====
const answerTypeSelectItems = ['Star Rating', 'Yes/No', 'Text'] as const
const answerTypeItems = computed<SelectMenuItem[]>(() => ['ทั้งหมด', ...answerTypeSelectItems])

// ===== mock data =====
const allItems = ref<SatisfactionQuestionRow[]>([
  {
    id: 1,
    question: 'คุณพึงพอใจต่อการให้บริการของเจ้าหน้าที่มากน้อยเพียงใด?',
    answerType: 'Star Rating',
    createdAt: '2026-02-10',
    createdBy: 'แอดมิน',
    updatedAt: '2026-02-10',
    updatedBy: 'แอดมิน'
  },
  {
    id: 2,
    question: 'คุณได้รับสื่อการเรียนรู้ครบถ้วนตามที่ขอยืมหรือไม่?',
    answerType: 'Yes/No',
    createdAt: '2026-02-10',
    createdBy: 'แอดมิน',
    updatedAt: '2026-02-11',
    updatedBy: 'เจ้าหน้าที่คลังสื่อ'
  },
  {
    id: 3,
    question: 'ข้อเสนอแนะเพิ่มเติมเกี่ยวกับระบบยืม-คืนสื่อการเรียนรู้',
    answerType: 'Text',
    createdAt: '2026-02-11',
    createdBy: 'เจ้าหน้าที่คลังสื่อ',
    updatedAt: '2026-02-11',
    updatedBy: 'เจ้าหน้าที่คลังสื่อ'
  }
])

// actions
const handleExport = (): void => console.log('export satisfaction-questions')
const handleDelete = (id: number): void => console.log('delete', id)

// ===== CREATE modal =====
const openCreate = ref(false)
const formQuestion = ref('')
const formAnswerType = ref<AnswerType>('Star Rating')

const handleCreate = (): void => {
  formQuestion.value = ''
  formAnswerType.value = 'Star Rating'
  openCreate.value = true
}

const submitCreate = (): void => {
  const q = formQuestion.value.trim()
  if (!q) return

  const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
  const dateISO = todayISO.value

  allItems.value.push({
    id: nextId,
    question: q,
    answerType: formAnswerType.value,
    createdAt: dateISO,
    createdBy: currentUserName.value,
    updatedAt: dateISO,
    updatedBy: '-'
  })

  openCreate.value = false
}

// ===== EDIT modal =====
const openEdit = ref(false)
const editingId = ref<number | null>(null)

const editQuestion = ref('')
const editAnswerType = ref<AnswerType>('Star Rating')

const handleEdit = (id: number): void => {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  editQuestion.value = found.question
  editAnswerType.value = found.answerType
  openEdit.value = true
}

const submitEdit = (): void => {
  if (editingId.value == null) return
  const item = allItems.value.find((i) => i.id === editingId.value)
  if (!item) return

  const q = editQuestion.value.trim()
  if (!q) return

  item.question = q
  item.answerType = editAnswerType.value
  item.updatedAt = todayISO.value
  item.updatedBy = currentUserName.value

  openEdit.value = false
  editingId.value = null
}

// ===== Search / Filter / Pagination =====
const searchQuery = ref<string>('')
const selectedAnswerType = ref<string>('ทั้งหมด')

const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

const currentPage = ref<number>(1)
const pageSize = ref<number>(5)

const filteredItems = computed<SatisfactionQuestionRow[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const t = selectedAnswerType.value

  return allItems.value.filter((it) => {
    const matchSearch =
      !q ||
      it.question.toLowerCase().includes(q) ||
      it.answerType.toLowerCase().includes(q) ||
      it.createdBy.toLowerCase().includes(q) ||
      it.updatedBy.toLowerCase().includes(q) ||
      String(it.id).includes(q)

    const matchType = !t || t === 'ทั้งหมด' || it.answerType === t
    return matchSearch && matchType
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

watch([searchQuery, selectedAnswerType], () => {
  currentPage.value = 1
  rowSelection.value = {}
})

// ===== Columns =====
const columns: TableColumn<SatisfactionQuestionRow>[] = [
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
    header: 'ข้อ',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('id'))),
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
      const map = {
        'Star Rating': { color: 'warning' as const, label: 'Star Rating' },
        'Yes/No': { color: 'info' as const, label: 'Yes/No' },
        Text: { color: 'neutral' as const, label: 'Text' }
      } as const
      const m = map[t] ?? { color: 'neutral' as const, label: String(t) }
      return h(UBadge as any, { variant: 'subtle', color: m.color }, () => m.label)
    },
    meta: { class: { th: 'w-40', td: 'w-40' } }
  },
  {
    accessorKey: 'answerOrder',
    header: 'ลำดับคำตอบ',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('answerOrder'))),
    meta: { class: { th: 'w-28', td: 'w-28' } }
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
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('createdBy'))),
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
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('updatedBy'))),
    meta: { class: { th: 'w-32', td: 'w-32' } }
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
