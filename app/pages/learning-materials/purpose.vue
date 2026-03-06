  <template>
    <main class="bg-white font-[Kanit]">
      <!-- Header -->
      <div
        class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between">
        <div class="flex flex-col gap-1">
          <h1 class="text-3xl font-semibold text-slate-800">จัดการวัตถุประสงค์</h1>
          <p class="mt-1 text-sm text-slate-500">รายการวัตถุประสงค์สำหรับแบบฟอร์มการยืม</p>
        </div>

        <MediaHeaderActions
          export-label="นำข้อมูลออก"
          create-label="เพิ่มวัตถุประสงค์"
          @export="handleExport"
          @create="handleCreate"
        />
      </div>

      <div class="mx-auto max-w-6xl">
        <!-- Search + Filter -->
        <div class="-mx-8 px-8">
          <div class="flex items-center gap-2">
            <div class="flex-1">
              <MediaSearchFilter v-model:search="searchQuery" search-placeholder="ค้นหาวัตถุประสงค์" />
            </div>

            <MediaSelect v-model:category="selectedFilter" :items="filterItems" placeholder="สถานะ" />

            <!-- ✅ Columns dropdown -->
            <MediaColumnToggle :table-ref="table" :exclude="['select','actions']" />
          </div>
        </div>
        
        <!-- Table -->
        <section class="mb-6 mt-6 -mx-8 px-8">
          <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <!-- ✅ สำคัญ: ใส่ ref="table" -->
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

      <!-- Create -->
      <CrudFormModal
        v-model:open="openCreate"
        title="เพิ่มวัตถุประสงค์"
        description="กรอกข้อมูลเพื่อเพิ่มวัตถุประสงค์ใหม่"
        submit-text="บันทึก"
        @submit="submitCreate"
      >
        <div class="space-y-4">
          <UFormField label="ชื่อวัตถุประสงค์" :error="formPurposeError">
            <UInput
              v-model="formPurpose"
              size="xl"
              placeholder="เช่น ศึกษาดูงาน"
              class="w-full"
              :ui="inputUiByError(!!formPurposeError)"
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

      <!-- Edit -->
      <CrudFormModal
        v-model:open="openEdit"
        title="แก้ไขวัตถุประสงค์"
        description="แก้ไขข้อมูลวัตถุประสงค์"
        submit-text="บันทึก"
        @submit="submitEdit"
      >
        <div class="space-y-4">
          <UFormField label="ชื่อวัตถุประสงค์" :error="editPurposeError">
            <UInput
              v-model="editPurpose"
              size="xl"
              placeholder="เช่น ศึกษาดูงาน"
              class="w-full"
              :ui="inputUiByError(!!editPurposeError)"
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

      <!-- Duplicate -->
      <CrudFormModal
        v-model:open="openDuplicate"
        title="สร้างซ้ำวัตถุประสงค์"
        description="ระบบคัดลอกข้อมูลจากรายการเดิม คุณสามารถแก้ไขก่อนบันทึกได้"
        submit-text="บันทึก"
        @submit="submitDuplicate"
      >
        <div class="space-y-4">
          <UFormField label="ชื่อวัตถุประสงค์" :error="duplicatePurposeError">
            <UInput
              v-model="duplicatePurpose"
              size="xl"
              placeholder="เช่น ศึกษาดูงาน"
              class="w-full"
              :ui="inputUiByError(!!duplicatePurposeError)"
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
  import { upperFirst } from 'scule'
  import type { TableColumn, SelectMenuItem } from '@nuxt/ui'

  import Pagination from '~/components/Pagination.vue'
  import MediaHQTable from '~/components/learning-materials/MediaHQTable.vue'
  import MediaSearchFilter from '~/components/learning-materials/MediaSearchFilter.vue'
  import MediaHeaderActions from '~/components/learning-materials/MediaHeaderActions.vue'
  import CrudFormModal from '~/components/common/CrudFormModal.vue'
  import MediaSelect from '~/components/learning-materials/MediaSelect.vue'
  import MediaColumnToggle from '~/components/learning-materials/MediaColumnToggle.vue'

  definePageMeta({ layout: 'learning-materials' })

  type PurposeStatus = 'active' | 'inactive'

  type PurposeItem = {
    id: number
    purpose: string
    status: PurposeStatus
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }

  type RowSelectionState = Record<string, boolean>

  const UButton = resolveComponent('UButton')
  const UDropdownMenu = resolveComponent('UDropdownMenu')
  const UCheckbox = resolveComponent('UCheckbox')
  const UBadge = resolveComponent('UBadge')

  /** ✅ สำคัญ: ref สำหรับ MediaHQTable เพื่ออ่าน tableApi */
  const table = ref<any>(null)

  const currentUserName = computed(() => 'แอดมิน')

  /**
   * ✅ UInput กรอบแดงตอน error
   * หมายเหตุ: UFormField :error ต้องเป็น string | boolean | undefined (ห้าม null)
   */
  const inputUiNormal = {
    root: 'rounded-2xl',
    base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40'
  }
  const inputUiError = {
    root: 'rounded-2xl',
    base: 'bg-slate-50 ring-1 ring-red-500 focus-within:ring-2 focus-within:ring-red-500'
  }
  const inputUiByError = (hasError: boolean) => (hasError ? inputUiError : inputUiNormal)

  const selectUi = {
    base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
    rounded: 'rounded-2xl'
  }

  /** ===== date helpers ===== */
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

  /** ===== status mapping ===== */
  const statusThaiItems: string[] = ['เปิดใช้งาน', 'ปิดใช้งาน']
  const statusValueToThai = (value: PurposeStatus): string => (value === 'inactive' ? 'ปิดใช้งาน' : 'เปิดใช้งาน')
  const statusThaiToValue = (label: string): PurposeStatus => (label === 'ปิดใช้งาน' ? 'inactive' : 'active')

  /** ===== filter items ===== */
  const filterItems = computed<SelectMenuItem[]>(() => [
    { label: 'สถานะทั้งหมด', value: 'ทั้งหมด' },
    { label: 'เปิดใช้งาน', value: 'active' },
    { label: 'ปิดใช้งาน', value: 'inactive' }
  ])

  /** ✅ Dropdown Columns items */
  const columnMenuItems = computed(() => {
    const api = table.value?.getTableApi?.()
    if (!api) return []

    return api
      .getAllColumns()
      .filter((c: any) => c.getCanHide?.() && !['select', 'actions'].includes(c.id))
      .map((c: any) => ({
        label: upperFirst(c.id),
        type: 'checkbox' as const,
        checked: c.getIsVisible(),
        onUpdateChecked(checked: boolean) {
          api.getColumn(c.id)?.toggleVisibility(!!checked)
        },
        onSelect(e: Event) {
          e.preventDefault()
        }
      }))
  })

  /** ===== data ===== */
  const allItems = ref<PurposeItem[]>([
    { id: 1, purpose: 'ศึกษาดูงาน', status: 'active', createdAt: '2026-01-20', createdBy: 'แอดมิน', updatedAt: '2026-01-20', updatedBy: 'แอดมิน' },
    { id: 2, purpose: 'ใช้ประกอบการสอน', status: 'active', createdAt: '2026-01-21', createdBy: 'แอดมิน', updatedAt: '2026-01-21', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
    { id: 3, purpose: 'วิจัย/เก็บข้อมูล', status: 'inactive', createdAt: '2026-01-22', createdBy: 'เจ้าหน้าที่คลังสื่อ', updatedAt: '2026-01-22', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
    { id: 4, purpose: 'จัดกิจกรรมภายในหน่วยงาน', status: 'active', createdAt: '2026-01-25', createdBy: 'แอดมิน', updatedAt: '2026-01-25', updatedBy: 'แอดมิน' },
    { id: 5, purpose: 'จัดกิจกรรมส่งเสริมสุขภาพ', status: 'active', createdAt: '2026-01-30', createdBy: 'แอดมิน', updatedAt: '2026-01-30', updatedBy: 'เจ้าหน้าที่คลังสื่อ' },
    { id: 6, purpose: 'อื่น ๆ (โปรดระบุรายละเอียดเพิ่มเติม)', status: 'inactive', createdAt: '2026-02-05', createdBy: 'เจ้าหน้าที่คลังสื่อ', updatedAt: '2026-02-05', updatedBy: 'แอดมิน' }
  ])

  /** ===== actions ===== */
  const handleExport = (): void => console.log('export excel (purpose)')
  const handleDelete = (id: number): void => console.log('delete', id)

  /** ===== validate ===== */
  const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()

  const validatePurposeText = (value: string): string | undefined => {
    const v = value.trim()
    if (v.length < 2) return 'ต้องกรอกอย่างน้อย 2 ตัวอักษร'
    if (v.length > 50) return 'ห้ามเกิน 50 ตัวอักษร'
    return undefined
  }

  const isDuplicatePurpose = (value: string, excludeId?: number | null) => {
    const v = normalize(value)
    return allItems.value.some((it) => {
      if (excludeId != null && it.id === excludeId) return false
      return normalize(it.purpose) === v
    })
  }

  const makeDuplicateName = (base: string) => {
    const raw = base.trim()
    if (!isDuplicatePurpose(raw)) return raw
    let i = 2
    while (true) {
      const next = `${raw} ${i}`
      if (!isDuplicatePurpose(next)) return next
      i++
    }
  }

  /** ===== CREATE ===== */
  const formPurpose = ref('')
  const formStatus = ref<PurposeStatus>('active')
  const formPurposeError = ref<string | undefined>(undefined)
  const openCreate = ref(false)

  watch(formPurpose, (v) => {
    formPurposeError.value = validatePurposeText(v)
    if (!formPurposeError.value && isDuplicatePurpose(v)) {
      formPurposeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    }
  })

  const handleCreate = (): void => {
    formPurpose.value = ''
    formStatus.value = 'active'
    formPurposeError.value = undefined
    openCreate.value = true
  }

  const submitCreate = (): void => {
    const err = validatePurposeText(formPurpose.value)
    if (err) {
      formPurposeError.value = err
      return
    }
    if (isDuplicatePurpose(formPurpose.value)) {
      formPurposeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
      return
    }

    const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
    const dateISO = todayISO.value

    allItems.value.push({
      id: nextId,
      purpose: formPurpose.value.trim(),
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
  const editPurpose = ref('')
  const editStatus = ref<PurposeStatus>('active')
  const editPurposeError = ref<string | undefined>(undefined)

  watch([editPurpose, editingId], () => {
    editPurposeError.value = validatePurposeText(editPurpose.value)
    if (!editPurposeError.value && isDuplicatePurpose(editPurpose.value, editingId.value)) {
      editPurposeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    }
  })

  const handleEdit = (id: number): void => {
    const found = allItems.value.find((i) => i.id === id)
    if (!found) return

    editingId.value = id
    editPurpose.value = found.purpose
    editStatus.value = found.status
    editPurposeError.value = undefined
    openEdit.value = true
  }

  const submitEdit = (): void => {
    if (editingId.value == null) return
    const item = allItems.value.find((i) => i.id === editingId.value)
    if (!item) return

    const err = validatePurposeText(editPurpose.value)
    if (err) {
      editPurposeError.value = err
      return
    }
    if (isDuplicatePurpose(editPurpose.value, editingId.value)) {
      editPurposeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
      return
    }

    item.purpose = editPurpose.value.trim()
    item.status = editStatus.value
    item.updatedAt = todayISO.value
    item.updatedBy = currentUserName.value

    openEdit.value = false
    editingId.value = null
  }

  /** ===== DUPLICATE ===== */
  const openDuplicate = ref(false)
  const duplicatingFromId = ref<number | null>(null)

  const duplicatePurpose = ref('')
  const duplicateStatus = ref<PurposeStatus>('active')
  const duplicatePurposeError = ref<string | undefined>(undefined)

  watch([duplicatePurpose, duplicatingFromId], () => {
    duplicatePurposeError.value = validatePurposeText(duplicatePurpose.value)
    if (!duplicatePurposeError.value && isDuplicatePurpose(duplicatePurpose.value)) {
      duplicatePurposeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
    }
  })

  const handleDuplicate = (id: number): void => {
    const found = allItems.value.find((i) => i.id === id)
    if (!found) return

    duplicatingFromId.value = id
    duplicatePurpose.value = makeDuplicateName(found.purpose)
    duplicateStatus.value = found.status
    duplicatePurposeError.value = undefined
    openDuplicate.value = true
  }

  const submitDuplicate = (): void => {
    const err = validatePurposeText(duplicatePurpose.value)
    if (err) {
      duplicatePurposeError.value = err
      return
    }
    if (isDuplicatePurpose(duplicatePurpose.value)) {
      duplicatePurposeError.value = 'ชื่อนี้มีอยู่แล้ว (ห้ามซ้ำ)'
      return
    }

    const nextId = Math.max(0, ...allItems.value.map((i) => i.id)) + 1
    const dateISO = todayISO.value

    allItems.value.push({
      id: nextId,
      purpose: duplicatePurpose.value.trim(),
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

  const filteredItems = computed<PurposeItem[]>(() => {
    const q = searchQuery.value.trim().toLowerCase()
    const f = selectedFilter.value

    return allItems.value.filter((item) => {
      const matchSearch =
        !q ||
        item.purpose.toLowerCase().includes(q) ||
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

  const paginatedItems = computed<PurposeItem[]>(() => {
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
  const columns: TableColumn<PurposeItem>[] = [
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
      accessorKey: 'purpose',
      header: 'วัตถุประสงค์',
      cell: ({ row }) =>
        h('div', { class: 'whitespace-normal break-words leading-5 text-slate-700 text-[13px]' }, String(row.getValue('purpose')))
    },
    {
      accessorKey: 'status',
      header: 'สถานะ',
      cell: ({ row }) => {
        const status = row.getValue('status') as PurposeStatus
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
      meta: { class: { th: 'w-32', td: 'w-32' } }
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
      meta: { class: { th: 'w-32', td: 'w-32' } }
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