<template>
  <div class="min-h-dvh bg-slate-100 text-slate-900">
    <ReturnTopBar title="ระบบคืนเครื่องมือการเรียนรู้" @back="router.back()" />

    <main class="mx-auto w-full max-w-md space-y-4 px-4 py-4">
      <ReturnMediaCard
        cover-url="/upload/book.png"
        title="จดหมายข่าวชุมชนรักสุขภาพ"
        subtitle="ฉบับสร้างสุข ประจำเดือนมกราคม 2569"
      />

      <ReturnDatesCard borrow-date="01 ม.ค. 69" due-text="วันนี้" />

      <ReturnInfoCard
        v-model:open="open"
        title="ข้อมูลการคืน"
        :rows="rows"
        note="“นำไปใช้ประกอบกิจกรรมกลุ่มวิทยาศาสตร์”"
      />

      <BorrowSubmitBar :loading="loading" :disabled="disabled" @submit="onConfirmReturn" />
    </main>
  </div>
</template>

<script setup lang="ts">
import ReturnTopBar from '~/components/return/ReturnTopBar.vue'
import ReturnMediaCard from '~/components/return/ReturnMediaCard.vue'
import ReturnDatesCard from '~/components/return/ReturnDatesCard.vue'
import ReturnInfoCard from '~/components/return/ReturnInfoCard.vue'
import BorrowSubmitBar from '~/components/borrow/BorrowSubmitBar.vue'

const router = useRouter()
const open = ref(true)
const loading = ref(false)
const disabled = ref(false)

const rows = [
  { label: 'รหัสการจอง', value: 'TH00001' },
  { label: 'ผู้ทำรายการ', value: 'สมชาย ใจดี' },
  { label: 'วัตถุประสงค์', value: 'กิจกรรมภายใน' },
  { label: 'กลุ่มเป้าหมาย', value: 'นักเรียน' },
  { label: 'จำนวน', value: '1 ชิ้น' },
  { label: 'ระยะเวลา', value: '10 วัน' },
  { label: 'กำหนดคืน', value: 'วันนี้ (10 ม.ค. 2569)' }
]

const onConfirmReturn = () => {
  router.push('/return/confirm')
}
</script>
