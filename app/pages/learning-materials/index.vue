<template>
  <main class="min-h-screen bg-white py-6 font-[Kanit]">
    <!-- Header + ปุ่มโปรไฟล์/ออกจากระบบ -->
    <div class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200
         px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between">
      <div class="flex flex-col gap-1">

        <h1 class="text-3xl font-semibold text-slate-800">
          คลังสื่อสารการเรียนรู้ (ศูนย์ใหญ่)
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          ข้อมูลสต็อกกลางสำหรับกระจายสู่ศูนย์ย่อย
        </p>
      </div>

      <MediaHeaderActions @export="handleExport" @create="handleCreate" />

    </div>

    <div class="mx-auto max-w-6xl">
      <!-- แถบค้นหา + ฟิลเตอร์ -->
      <div class="-mx-8 px-8">
  <div class="flex items-center gap-2">
    <div class="flex-1">
      <MediaSearchFilter
        v-model:search="searchQuery"
        search-placeholder="ค้นหา"
      />
    </div>

    <MediaFilter v-model:category="selectedCategory" :items="categoryItems" placeholder="หมวดหมู่" />

  </div>
</div>

      <!-- ตารางข้อมูล -->
      <section class="mb-6 mt-6 -mx-8 px-8">
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <MediaHQTable v-model:rowSelection="rowSelection" :columns="columns" :items="paginatedItems"
            @edit="handleEdit" @delete="handleDelete" />

          <!-- Footer ใต้ตาราง -->
          <div
            class="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <span>
              {{ Object.keys(rowSelection).length }} of {{ totalItems }} row(s) selected.
            </span>

            <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
          </div>
        </div>
      </section>
    </div>
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

definePageMeta({ layout: 'learning-materials' })

type MediaItem = {
  id: number
  date: string
  code: string
  name: string
  category: string
  total: number
  pack: string
  location: string
}

type RowSelectionState = Record<string, boolean>

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// mock data
const allItems = ref<MediaItem[]>([
  { id: 1, date: 'Mar 10, 19:45', code: 'MEDIA-HQ-001', name: 'ชุดนิทรรศการพุงกะทิ (ชุดใหญ่)', category: 'โภชนาการ', total: 15, pack: '-', location: 'อาคาร A ชั้น 1' },
  { id: 2, date: 'Mar 10, 15:55', code: 'MEDIA-HQ-002', name: 'ชุดโปสเตอร์ "ลดพุง ลดโรค"', category: 'สุขภาพกาย', total: 5000, pack: '50 แพ็ค', location: 'ชั้น 2 โซน C แถวที่ 5' },
  { id: 3, date: 'Mar 09, 10:20', code: 'MEDIA-HQ-003', name: 'แผ่นพับ รณรงค์งดเหล้าเข้าพรรษา', category: 'แอลกอฮอล์', total: 12000, pack: '100 แพ็ค', location: 'อาคาร B คลัง 3' },
  { id: 4, date: 'Mar 08, 14:30', code: 'MEDIA-HQ-004', name: 'สติกเกอร์ "สวมหมวกกันน็อค"', category: 'ความปลอดภัย', total: 2500, pack: '25 แพ็ค', location: 'ชั้น 1 โซน A' },
  { id: 5, date: 'Mar 08, 09:15', code: 'MEDIA-HQ-005', name: 'หนังสือภาพสำหรับเด็ก', category: 'เด็กและเยาวชน', total: 800, pack: '-', location: 'อาคาร A ชั้น 2' },
  { id: 6, date: 'Mar 07, 16:20', code: 'MEDIA-HQ-006', name: 'แผ่นพับสุขภาพช่องปาก', category: 'สุขภาพกาย', total: 3000, pack: '30 แพ็ค', location: 'อาคาร A ชั้น 3' },
  { id: 7, date: 'Mar 07, 11:10', code: 'MEDIA-HQ-007', name: 'โปสเตอร์โภชนาการเด็ก', category: 'โภชนาการ', total: 2000, pack: '20 แพ็ค', location: 'ชั้น 1 โซน B' },
  { id: 8, date: 'Mar 06, 14:45', code: 'MEDIA-HQ-008', name: 'คู่มือการออกกำลังกาย', category: 'สุขภาพกาย', total: 1500, pack: '15 แพ็ค', location: 'อาคาร B คลัง 2' },
  { id: 9, date: 'Mar 06, 09:30', code: 'MEDIA-HQ-009', name: 'สติกเกอร์งดสูบบุหรี่', category: 'บุหรี่', total: 5000, pack: '50 แพ็ค', location: 'ชั้น 2 โซน A' },
  { id: 10, date: 'Mar 05, 13:15', code: 'MEDIA-HQ-010', name: 'แผ่นพับสุขภาพจิต', category: 'สุขภาพจิต', total: 4000, pack: '40 แพ็ค', location: 'อาคาร A ชั้น 2' }
])

const handleExport = (): void => console.log('export excel')
const handleCreate = (): void => console.log('create new')

// search/filter
const searchQuery = ref<string>('')

// ✅ ให้ default เป็น “ทั้งหมด” (ตรงกับ dropdown)
const selectedCategory = ref<string>('ทั้งหมด')

// selection
const rowSelection = ref<RowSelectionState>({})

// pagination
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)

// ✅ items แบบตัวอย่างของคุณ (SelectMenuItem[] + string)
const categoryItems = computed<SelectMenuItem[]>(() => {
  const cats = Array.from(new Set(allItems.value.map((d) => d.category)))
  return [
    { type: 'label', label: 'หมวดหมู่' },
    'ทั้งหมด',
    ...cats
  ]
})

// filter
const filteredItems = computed<MediaItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const c = selectedCategory.value

  return allItems.value.filter((item) => {
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)

    const matchCategory = !c || c === 'ทั้งหมด' || item.category === c

    return matchSearch && matchCategory
  })
})

const totalItems = computed<number>(() => filteredItems.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedItems = computed<MediaItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const handlePageChange = (page: number): void => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// ✅ reset page เมื่อค้นหา/เปลี่ยนหมวด
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

// actions
const handleEdit = (id: number): void => console.log('edit', id)
const handleDelete = (id: number): void => console.log('delete', id)

// columns
const formatNumber = (n: unknown): string => Number(n).toLocaleString('en-US')

// ✅ ใช้ row.getValue() กัน data ไม่แสดง
const columns: TableColumn<MediaItem>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, row.getValue('date'))
  },
  {
    accessorKey: 'code',
    header: 'รหัสสื่อ',
    cell: ({ row }) =>
      h('span', { class: 'text-orange-500 font-semibold text-[13px]' }, row.getValue('code'))
  },
  {
    accessorKey: 'name',
    header: 'ชื่อสื่อการเรียนรู้',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, row.getValue('name'))
  },
  {
    accessorKey: 'category',
    header: 'หมวดหมู่',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, row.getValue('category'))
  },
  {
    accessorKey: 'total',
    header: 'จำนวนทั้งหมด',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, formatNumber(row.getValue('total')))
  },
  {
    accessorKey: 'pack',
    header: 'จำนวนแพ็ค',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, row.getValue('pack'))
  },
  {
    accessorKey: 'location',
    header: 'ที่อยู่ของสื่อ',
    cell: ({ row }) =>
      h('span', { class: 'text-slate-500 text-[13px]' }, row.getValue('location'))
  },
  {
  id: 'actions',
  header: 'จัดการ',
  cell: ({ row }) => {
    const id = row.original.id

    const items = [
      [
        {
          label: 'Copy ID',
          icon: 'i-heroicons-clipboard-20-solid',
          onSelect: async () => {
            await navigator.clipboard.writeText(String(id))
          }
        }
      ],
      [
        {
          label: 'Delete',
          icon: 'i-heroicons-trash-20-solid',
          onSelect: () => handleDelete(id)
        }
      ]
    ]

    return h('div', { class: 'flex justify-end items-center gap-1' }, [
      // ✅ Edit อยู่นอกเมนู
      h(UButton as any, {
        icon: 'i-heroicons-pencil-square-20-solid',
        variant: 'ghost',
        color: 'neutral',
        class: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg',
        'aria-label': 'Edit',
        onClick: () => handleEdit(id)
      }),

      // ✅ ... เมนู (Copy ID + Delete)
      h(
        UDropdownMenu as any,
        { items, content: { align: 'end' }, ui: {
      content: 'w-44 bg-white ',
      item: 'text-slate-700 hover:bg-slate-20 rounded-lg'
    } },
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

