<!-- components/learning-materials/Sidebar.vue (Nuxt UI + โทนขาวเหมือนเดิม) -->
<script setup lang="ts">
import { ref, computed, resolveComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type NavItem = { label: string; to: string }
type NavGroup = { title: string; items: NavItem[] }
type MenuItem = { label: string; icon?: string; click?: () => void }
type MenuItems = MenuItem[][]

type NuxtUiInputUi = {
  base?: string
  rounded?: string
  icon?: {
    leading?: { wrapper?: string; padding?: string }
    trailing?: { wrapper?: string; padding?: string }
  }
  padding?: { sm?: string; md?: string; lg?: string }
  variant?: Record<string, string>
}

const route = useRoute()
const router = useRouter()
const sidebarQ = ref<string>('')

/** Nuxt UI components (ถ้าโปรเจกต์คุณ auto-import อยู่แล้ว ก็ลบ resolveComponent แล้วใช้ <UInput> ตรงๆ ได้) */
const UInput = resolveComponent('UInput')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatar = resolveComponent('UAvatar')

const navGroups: NavGroup[] = [
  {
    title: 'เมนู',
    items: [
      { label: 'ยืมคืนสื่อการเรียนรู้', to: '/learning-materials/borrow-return' },
      { label: 'แจ้งซ่อมสื่อการเรียนรู้', to: '/learning-materials/repair' },
      { label: 'สื่อการเรียนรู้ทั้งหมด', to: '/learning-materials/' },
      // { label: 'ประวัติ ขอ-ยืม-คืน-แจ้งซ่อม (จนท. สสส.)', to: '/learning-materials/history-staff' }
    ]
  },
  {
    title: 'รายงาน',
    items: [{ label: 'รายงานแบบประเมินความพึงพอใจ', to: '/learning-materials/satisfaction-report' },
      { label: 'รายงานยืมคืนสื่อการเรียนรู้', to: '/learning-materials/borrow-return-report' },
      { label: 'รายงานสื่อการเรียนรู้แยกตามประเภทของสื่อ/ประเด็นสื่อ/เลขลำดับสื่อ', to: '/learning-materials/media-report' }
    ]
  },
  {
    title: 'จัดการข้อมูล',
    items: [
      { label: 'วัตถุประสงค์การใช้งาน', to: '/learning-materials/purpose' },
      { label: 'ประภทผู้รับสื่อ', to: '/learning-materials/receiver-type' },
      { label: 'กลุ่มเป้าหมาย', to: '/learning-materials/target' },
      { label: 'ประเภทสื่อ/ประเด็นสื่อ/เลขลำดับสื่อ', to: '/learning-materials/media-type' },
      { label: 'สมาชิก', to: '/learning-materials/user' },
      { label: 'เจ้าหน้าที่ศูนย์', to: '/learning-materials/center-staff' },
      { label: 'คําถามแบบประเมินความพึงพอใจ', to: '/learning-materials/satisfaction-question' }

    ]
  }
]

const filteredGroups = computed<NavGroup[]>(() => {
  const q = sidebarQ.value.trim().toLowerCase()
  if (!q) return navGroups
  return navGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.toLowerCase().includes(q))
    }))
    .filter((g) => g.items.length > 0)
})

const isActive = (to: string): boolean => route.path === to

const userMenuItems: MenuItems = [[
  { label: 'โปรไฟล์', icon: 'i-heroicons-user', click: () => router.push('/settings/store') },
  { label: 'ออกจากระบบ', icon: 'i-heroicons-arrow-right-on-rectangle', click: () => router.push('/logout') }
]]

/** ✅ UI Override: บังคับให้ UInput เป็นโทนขาว (กันโดน theme/dark override) */
const whiteInputUi: NuxtUiInputUi = {
  base: 'h-8 text-[12px] font-normal !bg-white',
  rounded: 'rounded-lg',
  icon: { leading: { wrapper: 'text-slate-400', padding: 'ps-2.5' } },
  padding: { sm: 'ps-9' },
  variant: {
    outline:
      '!bg-white !border-slate-400 text-slate-900 placeholder:text-slate-400 ' +
      'focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:border-slate-300'
  }
}
</script>

<template>
  <aside
    class="hidden md:flex w-[260px] h-screen flex-col bg-white border-r border-slate-200 font-[Kanit] overflow-hidden"
  >
    <!-- Logo -->
    <div class="px-6 pt-8 pb-5 flex flex-col items-center">
      <img
        src="/upload/sorsor.png"
        alt="sorsor"
        class="h-14 w-auto object-contain"
        onerror="this.style.display='none'"
      />
      <div class="mt-1 text-[11px] font-normal text-slate-400 text-center leading-tight">
        สำนักงานกองทุนสนับสนุน<br />การสร้างเสริมสุขภาพ
      </div>
    </div>

    <!-- Search (Nuxt UI แต่บังคับเป็นสีขาวเหมือนเดิม) -->
    <div class="px-6 pb-4">
      <component
        :is="UInput"
        v-model="sidebarQ"
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass-20-solid"
        variant="outline"
        size="sm"
        :ui="whiteInputUi"
      />
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto px-6 pb-6">
      <div v-for="(g, gi) in filteredGroups" :key="g.title" class="pb-6">
        <div class="text-[12px] font-normal text-slate-400 mb-3">
          {{ g.title }}
        </div>

        <div class="space-y-2">
          <NuxtLink v-for="it in g.items" :key="it.to" :to="it.to" class="block">
            <div
              class="rounded-xl px-3 py-2 text-[13px] font-normal leading-snug transition"
              :class="isActive(it.to)
                ? 'bg-orange-50 text-orange-600'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              {{ it.label }}
            </div>
          </NuxtLink>
        </div>

        <div v-if="gi !== filteredGroups.length - 1" class="mt-6 border-t border-slate-200"></div>
      </div>
    </nav>

    <!-- User bar (Nuxt UI) -->
    <div class="border-t border-slate-200 bg-white px-6 py-3">
      <component
        :is="UDropdownMenu"
        :items="userMenuItems"
        :content="{ align: 'start' }"
        :ui="{ content: 'w-52' }"
      >
        <template #default>
          <component
            :is="UButton"
            color="neutral"
            variant="ghost"
            class="w-full justify-start px-2 py-2 hover:bg-slate-50"
          >
            <span class="flex w-full items-center gap-3">
              <component :is="UAvatar" alt="User" size="sm" />

              <span class="min-w-0 flex-1">
                <span class="block truncate text-[13px] font-normal text-slate-900">User</span>
              </span>

              <span class="text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.08.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </span>
          </component>
        </template>
      </component>
    </div>
  </aside>
</template>
