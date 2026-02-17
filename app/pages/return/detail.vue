<template>
  <div class="min-h-dvh bg-slate-100 text-slate-900">
    <!-- อ้างอิงจาก borrow/detail: ใช้ topbar เดิม -->
    <BorrowTopBar title="รายละเอียดการจอง" @back="router.back()" />

    <main class="mx-auto w-full max-w-md px-4 py-6">
      <BookingSuccessCard
        title="ยืนยันการคืน"
        :rows="rows"
        :note="note"
        button-text="เสร็จสิ้น"
        @done="onDone"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// ✅ ใช้ topbar ของ borrow/detail
import BorrowTopBar from '~/components/borrow/BorrowTopBar.vue'

// ✅ shared components
import BookingSuccessCard from '~/components/return/BookingSuccessCard.vue'

const router = useRouter()

// mock data (เปลี่ยนเป็นของจริงจาก API/route params)
const rows = [
  { label: 'รหัสการจอง', value: 'TH00001' },
  { label: 'ผู้ทำรายการ', value: 'สมชาย ใจดี' },
  { label: 'วัตถุประสงค์', value: 'กิจกรรมภายใน' },
  { label: 'จำนวน', value: '1 ชิ้น' },
  { label: 'ระยะเวลา', value: '10 วัน' },
  { label: 'วันที่คืน/เวลา', value: '10 ม.ค. 2569 14:30 น.' },
  { label: 'สถานที่', value: 'โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)' }
]

const note = '“นำไปใช้ประกอบกิจกรรมกลุ่มวิทยาศาสตร์”'

const onDone = () => {
  router.push('/return') // ปรับปลายทาง
}
</script>
