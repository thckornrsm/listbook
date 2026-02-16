<template>
  <div class="min-h-dvh bg-slate-100 text-slate-900">
    <!-- Top bar -->
    <div class="sticky top-0 z-20 flex h-14 items-center bg-[#ED7E24] px-4 text-white">
      <button
        type="button"
        class="mr-3 grid h-10 w-10 place-items-center rounded-full active:opacity-90"
        @click="router.back()"
        aria-label="Back"
      >
        <span class="text-2xl leading-none">‹</span>
      </button>

      <div class="flex-1 text-center text-base font-semibold">
        ระบบคืนเครื่องมือการเรียนรู้
      </div>
      <div class="h-10 w-10"></div>
    </div>

    <div class="mx-auto w-full max-w-md space-y-4 px-4 py-4">
      <!-- Media Card -->
      <div class="rounded-2xl bg-white p-4 shadow-sm">
        <div class="flex justify-center">
          <div class="w-[220px] overflow-hidden rounded-xl bg-slate-50 shadow-sm">
            <img
              src="/upload/book.png"
              alt="cover"
              class="h-auto w-full object-cover"
            />
          </div>
        </div>

        <div class="mt-4">
          <div class="text-base font-extrabold text-slate-900">
            จดหมายข่าวชุมชนรักสุขภาพ
          </div>
          <div class="mt-1 text-sm text-slate-700">
            ฉบับสร้างสุข ประจำเดือนมกราคม 2569
          </div>
        </div>
      </div>

      <!-- Dates Card -->
      <div class="rounded-2xl bg-white px-4 py-4 shadow-sm">
        <div class="grid grid-cols-2">
          <div class="pr-4">
            <div class="text-sm font-medium text-slate-700">วันที่ยืม</div>
            <div class="mt-1 text-base font-extrabold text-slate-900">01 ม.ค. 69</div>
          </div>

          <div class="border-l border-slate-200 pl-4 text-right">
            <div class="text-sm font-medium text-slate-700">กำหนดคืน</div>
            <div class="mt-1 text-base font-extrabold text-[#ED7E24]">วันนี้</div>
          </div>
        </div>
      </div>

      <!-- Return info (collapsible) -->
      <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <button
          type="button"
          class="flex w-full items-center justify-between px-4 py-4"
          @click="open = !open"
        >
          <div class="text-base font-extrabold text-[#ED7E24]">ข้อมูลการคืน</div>
          <span
            class="text-slate-900 transition-transform"
            :class="open ? 'rotate-180' : ''"
          >
            ▾
          </span>
        </button>

        <div v-if="open" class="px-4 pb-4">
          <div class="divide-y divide-dashed divide-slate-200 text-sm">
            <Row label="รหัสการจอง" value="TH00001" />
            <Row label="ผู้ทำรายการ" value="สมชาย ใจดี" />
            <Row label="วัตถุประสงค์" value="กิจกรรมภายใน" />
            <Row label="กลุ่มเป้าหมาย" value="นักเรียน" />
            <Row label="จำนวน" value="1 ชิ้น" />
            <Row label="ระยะเวลา" value="10 วัน" />
            <Row label="วันคืน" value="วันนี้ (10 ม.ค. 2569)" />

            <div class="py-3">
              <div class="font-semibold text-slate-700">ข้อมูลเพิ่มเติม</div>
              <div
                class="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
              >
                “นำไปใช้ประกอบกิจกรรมกลุ่มวิทยาศาสตร์”
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom action -->
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm active:scale-[0.99]"
        @click="onConfirmSlide"
      >
        <div class="grid h-12 w-12 place-items-center rounded-xl bg-[#ED7E24] text-white text-2xl leading-none">
          ›
        </div>

        <div class="flex-1 px-4 text-left text-base font-semibold text-slate-900">
          สไลด์เพื่อยืนยันการคืน
        </div>

        <div class="h-12 w-6"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const open = ref(true)

const onConfirmSlide = () => {
  // เปลี่ยนเป็น route หน้ายืนยันคืนจริงของคุณ
  router.push('/return/confirm')
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Row: defineComponent({
      props: {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
      template: `
        <div class="flex items-start justify-between gap-4 py-3">
          <div class="font-semibold text-slate-700">{{ label }}</div>
          <div class="max-w-[60%] text-right font-extrabold text-slate-900">{{ value }}</div>
        </div>
      `,
    }),
  },
})
</script>
