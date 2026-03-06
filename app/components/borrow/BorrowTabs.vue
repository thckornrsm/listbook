<!-- BorrowTabs.vue -->
<template>
  <UFieldGroup class="w-full">
    <template v-if="isOnActionTo">
      <UButton
        :label="cancelLabelResolved"
        color="neutral"
        variant="outline"
        class="h-10 w-full justify-center rounded-lg
               px-6 py-0 text-base font-medium text-[#ED7E24]
               border border-[#ED7E24]
               hover:bg-white active:bg-white"
        @click="go(cancelToResolved)"
      />
    </template>

    <template v-else>
      <UButton
        :label="leftLabel"
        color="neutral"
        variant="solid"
        class="h-10 flex-1 justify-center rounded-l-lg rounded-r-none bg-[#ED7E24]
               px-3 py-0 text-base leading-normal text-white
               hover:bg-[#ED7E24] active:bg-[#ED7E24]/95"
        @click="go(leftTo)"
      />

      <UDrawer v-model:open="open">
        <UButton
          color="neutral"
          variant="solid"
          icon="i-lucide-chevron-down"
          class="h-10 w-12 rounded-r-lg rounded-l-none bg-[#ED7E24]
                 p-0 text-white justify-center hover:bg-[#ED7E24] active:bg-[#ED7E24]/95
                 border-l border-white/40"
          aria-label="Open actions"
        />

        <template #content>
          <div class="p-4">
            <div class="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
              <!-- item 1 -->
              <button
                type="button"
                class="w-full px-6 py-5 text-left hover:bg-slate-50"
                @click="selectAndGo(leftTo)"
              >
                <div class="text-xl text-[#ED7E24]">{{ leftLabel }}</div>
                <div class="text-sm leading-9 text-slate-500">{{ leftDesc }}</div>
              </button>

              <div class="h-px w-full bg-slate-200" />

              <!-- item 2 -->
              <button
                type="button"
                class="w-full px-6 py-5 text-left hover:bg-slate-50"
                @click="selectAndGo(rightTo)"
              >
                <div class="text-xl text-[#ED7E24]">{{ rightLabel }}</div>
                <div class="text-sm leading-9 text-slate-500">{{ rightDesc }}</div>
              </button>

              <!-- ✅ item 3 (เฉพาะ staff) -->
              <template v-if="staffExtraTo">
                <div class="h-px w-full bg-slate-200" />

                <button
                  type="button"
                  class="w-full px-6 py-5 text-left hover:bg-slate-50"
                  @click="selectAndGo(staffExtraTo)"
                >
                  <div class="text-xl text-[#ED7E24]">{{ staffExtraLabel }}</div>
                  <div class="text-sm leading-9 text-slate-500">{{ staffExtraDesc }}</div>
                </button>
              </template>
            </div>
          </div>
        </template>
      </UDrawer>
    </template>
  </UFieldGroup>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const open = ref(false)

const props = withDefaults(
  defineProps<{
    leftLabel?: string
    rightLabel?: string
    leftTo: string
    rightTo: string
    leftDesc?: string
    rightDesc?: string

    // ✅ เพิ่ม: เมนูพิเศษสำหรับ staff
    staffExtraLabel?: string
    staffExtraDesc?: string
    staffExtraTo?: string

    // ✅ เพิ่ม: cancel label ของ staff
    cancelStaffLabel?: string

    cancelBorrowLabel?: string
    cancelReturnLabel?: string
    cancelTo?: string
  }>(),
  {
    leftLabel: 'ขอยืมสื่อการเรียนรู้',
    rightLabel: 'คืนสื่อการเรียนรู้',
    leftDesc: 'ขอยืมสื่อการเรียนรู้โดยมีกำหนดส่งคืน',
    rightDesc: 'เลือกเพื่อไปหน้า “คืน” สื่อการเรียนรู้',

    staffExtraLabel: 'เจ้าหน้าที่ยืมสื่อการเรียนรู้แทนสมาชิก',
    staffExtraDesc: 'ใช้เมื่อสมาชิกไม่มี Line OA หรือให้เจ้าหน้าที่ทำรายการแทน',

    // ✅ ตามที่ต้องการ
    cancelStaffLabel: 'ยกเลิกการยืมสื่อการเรียนรู้แทน',

    cancelBorrowLabel: 'ยกเลิกการยืมสื่อการเรียนรู้',
    cancelReturnLabel: 'ยกเลิกการขอสื่อการเรียนรู้'
  }
)

const go = (to: string) => router.push(to)

const selectAndGo = (to: string) => {
  open.value = false
  go(to)
}

/**
 * ✅ ทำให้ robust: แทนที่จะเทียบ URL เป๊ะ ๆ
 * เราจะเช็คจาก route.path + query.mode เป็นหลัก (step จะเปลี่ยน form/confirm ก็ยังถือว่าอยู่ flow เดิม)
 */
function getPathname(to: string) {
  const url = new URL(to, 'http://local')
  return url.pathname
}

const basePathLeft = computed(() => getPathname(props.leftTo))
const basePathRight = computed(() => getPathname(props.rightTo))

const isOnBorrowMode = computed(() => route.path === basePathLeft.value && String(route.query.mode ?? '') === 'borrow')
const isOnRequestMode = computed(() => route.path === basePathRight.value && String(route.query.mode ?? '') === 'request')

// ✅ โหมด staff ยืมแทน: staffFlow=borrowForMember (สำคัญที่สุด)
const isStaffBorrowForMember = computed(
  () => isOnBorrowMode.value && String(route.query.staffFlow ?? '') === 'borrowForMember'
)

// ✅ ให้ถือว่าเป็น action เมื่ออยู่ใน borrow/request flow (รวม staff ด้วย)
const isOnActionTo = computed(() => isOnBorrowMode.value || isOnRequestMode.value)

const cancelLabelResolved = computed(() => {
  // ✅ เช็ค staff ก่อน เพื่อไม่ให้โดน isOnBorrowMode กลบ
  if (isStaffBorrowForMember.value) return props.cancelStaffLabel
  if (isOnBorrowMode.value) return props.cancelBorrowLabel
  if (isOnRequestMode.value) return props.cancelReturnLabel
  return props.cancelBorrowLabel
})

const cancelToResolved = computed(() => {
  if (props.cancelTo) return props.cancelTo

  // ✅ ยกเลิกแล้วกลับไปหน้าเดิมแบบตัด query (กลับ /borrow/request)
  // ถ้าอยาก "คง query" เดี๋ยวค่อยปรับ
  const activePath = isOnBorrowMode.value ? basePathLeft.value : basePathRight.value
  return activePath
})
</script>