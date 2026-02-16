<template>
  <div class="min-h-dvh bg-slate-100">
    <!-- Top bar -->
    <div class="sticky top-0 z-20 flex h-14 items-center bg-[#ED7E24] px-4 text-white">
      <button class="mr-3 grid h-10 w-10 place-items-center rounded-full" @click="router.back()">‹</button>
      <div class="flex-1 text-center text-base font-semibold">กรอกข้อมูลการยืม</div>
      <div class="h-10 w-10"></div>
    </div>

    <div class="mx-auto w-full max-w-md px-4 py-4">
      <!-- Tabs -->
      <div class="rounded-2xl bg-white p-2 shadow-sm">
        <div class="grid grid-cols-2 gap-2">
          <NuxtLink
            to="/borrow/request"
            class="grid h-12 place-items-center rounded-xl text-sm font-semibold shadow-sm"
            :class="'bg-white text-[#ED7E24]'"
          >
            ขอสื่อการเรียนรู้
          </NuxtLink>

          <NuxtLink
            to="/borrow/borrows"
            class="grid h-12 place-items-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700"
          >
            ยืมสื่อการเรียนรู้
          </NuxtLink>
        </div>
      </div>

      <!-- Form card (ตัวอย่างเดิม) -->
      <div class="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div class="flex items-center justify-between px-4 py-4">
          <div class="text-base font-semibold text-slate-900">จำนวนที่ต้องการ</div>

          <div class="flex items-center gap-3">
            <button class="grid h-10 w-12 place-items-center rounded-xl border border-slate-200 bg-white text-xl font-bold" @click="dec" :disabled="qty<=1">–</button>
            <div class="w-6 text-center text-base font-semibold">{{ qty }}</div>
            <button class="grid h-10 w-12 place-items-center rounded-xl bg-[#ED7E24] text-xl font-bold text-white" @click="inc">+</button>
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <div class="px-4 py-4">
          <div class="text-base font-semibold text-slate-900">วัตถุประสงค์</div>
          <div class="mt-3 relative">
            <select v-model="purpose" class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-slate-700 outline-none">
              <option value="study">ศึกษาดูงาน</option>
              <option value="teach">ใช้ประกอบการสอน</option>
              <option value="research">วิจัย/เก็บข้อมูล</option>
              <option value="other">อื่น ๆ</option>
            </select>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▾</span>
          </div>
        </div>

        <div class="px-4 pb-4">
          <div class="text-base font-semibold text-slate-900">เพิ่มเติม</div>
          <textarea v-model="note" rows="4" class="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none" placeholder="กรอกรายละเอียดเพิ่มเติม" />
        </div>

        <div class="px-4 pb-4">
          <div class="text-base font-semibold text-slate-900">กลุ่มเป้าหมาย</div>
          <div class="mt-3 relative">
            <select v-model="target" class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-slate-700 outline-none">
              <option value="student">นักเรียน</option>
              <option value="university">นักศึกษา</option>
              <option value="teacher">ครู/อาจารย์</option>
              <option value="public">ประชาชนทั่วไป</option>
            </select>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▾</span>
          </div>
        </div>

        <div class="px-4 pb-6">
          <div class="text-base font-semibold text-slate-900">โลเคชั่น</div>
          <input v-model="location" readonly class="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-700 outline-none" />
        </div>
      </div>

      <div class="mt-16 pb-10">
        <button class="h-14 w-full rounded-2xl bg-[#ED7E24] text-lg font-semibold text-white shadow-sm">
          ยืนยันข้อมูล
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const qty = ref(1)
const purpose = ref('study')
const note = ref('')
const target = ref('student')
const location = ref('โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)')
const inc = () => qty.value++
const dec = () => { if (qty.value > 1) qty.value-- }


</script>
