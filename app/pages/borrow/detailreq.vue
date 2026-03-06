<template>
  <div class="min-h-dvh bg-[#FFEEE2]  ">
    <BorrowTopBar title="รายละเอียดการขอสื่อ" @back="router.back()" />

    <main class="mx-auto w-full max-w-md px-4 py-6">
      <BookingSuccessCard
        title="ยืนยันการขอสื่อการเรียนรู้"
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

// Import components (ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ)
import BorrowTopBar from '~/components/borrow/BorrowTopBar.vue'
import BookingSuccessCard from '~/components/borrow/BookingSuccessCard.vue'

const router = useRouter()

// 3. กำหนดข้อมูลที่ต้องการแสดงใน Card
const rows = [
  { label: 'รหัสการจอง', value: 'TH00001' },
  { label: 'วัตถุประสงค์', value: 'กิจกรรมภายใน' },
  { label: 'กลุ่มเป้าหมาย', value: 'นักเรียน' },
  { label: 'จำนวน', value: '1 ชิ้น' },
  { label: 'ระยะเวลา', value: '10 วัน' },
  { label: 'สถานที่', value: 'โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)' }
]

// ข้อมูลเพิ่มเติม (ถ้ามี)
const note = '“ข้อมูลเพิ่มเติมที่คุณต้องการแสดง”'

const onDone = () => {
  // นำทางไปหน้าถัดไปตาม Flow การยืม
  // router.push('/borrow/success') 
}
</script>

<style scoped>
/* ไม่ต้องใช้ Style เดิมแล้ว เพราะ BookingSuccessCard จัดการให้ข้างในครับ */
</style>