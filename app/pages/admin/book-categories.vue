<script setup>
import { h, resolveComponent, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import AdminTable from '~/components/admin/AdminTable.vue'
definePageMeta({ layout: 'admin' })

// --- 1. Setup Utilities ---
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UIcon = resolveComponent('UIcon')

const toast = useToast()
const { copy } = useClipboard()

// --- 2. Mock Data ---
const categories = ref([
  {
    id: 'CAT-001',
    name: 'Fiction',
    slug: 'fiction',
    count: 1250,
    status: 'active',
    createdAt: '2024-01-15T10:00:00'
  },
  {
    id: 'CAT-002',
    name: 'Technology',
    slug: 'technology',
    count: 850,
    status: 'active',
    createdAt: '2024-02-01T09:30:00'
  },
  {
    id: 'CAT-003',
    name: 'History',
    slug: 'history',
    count: 420,
    status: 'inactive',
    createdAt: '2024-03-10T14:20:00'
  },
  {
    id: 'CAT-004',
    name: 'Science',
    slug: 'science',
    count: 600,
    status: 'active',
    createdAt: '2024-03-11T11:00:00'
  }
])

// --- 3. Column Definitions ---
const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => h('span', { class: 'text-gray-500 font-mono text-xs' }, row.getValue('id'))
  },
  {
    accessorKey: 'name',
    header: 'Category Name',
    cell: ({ row }) => {
    const name = row.getValue('name')
    // const slug = row.original.slug

    return h('div', { class: 'flex flex-col leading-tight' }, [
      h('div', { class: 'font-semibold text-slate-900' }, name),
      // h('div', { class: 'text-xs text-slate-400' }, `/${slug}`)
    ])
  }
},
  {
    accessorKey: 'count',
    header: 'Books',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-1' }, [
      h(UIcon, { name: 'i-lucide-book', class: 'w-4 h-4 text-gray-400' }),
      h('span', {}, new Intl.NumberFormat('en-US').format(row.getValue('count')))
    ])
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')
      
      const color = {
        active: 'success',
        inactive: 'error'
      }[status]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => status)
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: { align: 'end' },
          items: getRowItems(row),
          'aria-label': 'Actions'
        },
        () => h(UButton, {
          icon: 'i-lucide-ellipsis-vertical',
          color: 'black',
          variant: 'ghost',
          'aria-label': 'Actions',
          class: [
    'text-black',                 // ไอคอนดำ
    'hover:bg-gray-100',          // ตอนเอาเมาส์ชี้
    'active:bg-gray-200',         // ตอนกดค้าง (mousedown)
    'focus-visible:bg-gray-100',  // ตอนโฟกัสด้วยคีย์บอร์ด (optional)
    'rounded-lg'                  // ให้ดูนุ่มๆ
  ].join(' ')
          
        })
      )
    }
  }
]

// --- 4. Action Logic ---
function getRowItems(row) {
  return [
    {
      label: 'Actions',
      type: 'label'
    },
  
    {
      label: 'Edit Category',
      icon: 'i-lucide-pencil',
      onSelect() {
        console.log('Edit', row.original)
        toast.add({ title: `Edit: ${row.original.name}` })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect() {
        toast.add({ 
          title: 'Deleted', 
          description: `${row.original.name} has been removed.`,
          color: 'error' 
        })
      }
    }
  ]
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <UButton icon="i-lucide-plus" color="primary">Add Category</UButton>
    </div>

    <AdminTable 
      :data="categories" 
      :columns="columns" 
    />
  </div>
</template>