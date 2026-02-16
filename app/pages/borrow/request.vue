<template>
  <div class="min-h-dvh bg-slate-100">
    <BorrowTopBar title="ระบบยืมเครื่องมือการเรียนรู้" @back="router.back()" />

    <main class="mx-auto w-full max-w-md px-4 py-4 space-y-4">
      <BorrowTabs
        active="left"
        left-label="ขอสื่อการเรียนรู้"
        right-label="ยืมสื่อการเรียนรู้"
        left-to="/borrow/request"
        right-to="/borrow/borrows"
      />

      <MediaDetailCard
        :title="media.title"
        :subtitle="media.subtitle"
        :cover-url="media.coverUrl"
        :remain="media.remain"
        :total="media.total"
        :waiting="media.waiting"
        :borrowed="media.borrowed"
        :tags="media.tags"
        :storage-location="media.storageLocation"
        :description="media.description"
        :fav="fav"
        @toggleFav="fav = !fav"
        @openPdf="openPdf()"
      />

      <BorrowFormCard
        v-model:purpose="purpose"
        v-model:qty="qty"
        v-model:note="note"
        v-model:receiverType="receiverType"
        v-model:target="target"
        v-model:location="location"
        :purpose-options="purposeOptions"
        :receiver-type-options="receiverTypeOptions"
        :target-options="targetOptions"
      />



      <BorrowDateRangeCard v-model:range="borrowRange" />

      <BorrowRemarkCard v-model:remark="remark" />

      <BorrowSubmitBar :loading="submitting" :disabled="false" @submit="submit" />
    </main>
  </div>
</template>

<script setup lang="ts">
import BorrowTopBar from '~/components/borrow/BorrowTopBar.vue'
import BorrowTabs from '~/components/borrow/BorrowTabs.vue'
import MediaDetailCard from '~/components/borrow/MediaDetailCard.vue'
import BorrowFormCard from '~/components/borrow/BorrowFormCard.vue'
import BorrowDateRangeCard from '~/components/borrow/BorrowDateRangeCard.vue'
import BorrowRemarkCard from '~/components/borrow/BorrowRemarkCard.vue'
import BorrowSubmitBar from '~/components/borrow/BorrowSubmitBar.vue'

import { today, getLocalTimeZone, parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

const router = useRouter()

// mock media
const media = reactive({
  title: 'จดหมายข่าวชุมชนคนรักสุขภาพ',
  subtitle: 'ฉบับสร้างสุข ประจำเดือนมกราคม 2569',
  coverUrl: 'https://picsum.photos/400/540?random=7',
  remain: 10,
  total: 15,
  waiting: 0,
  borrowed: 5,
  tags: ['thaihealth', 'สร้างสุข', 'สสส.', 'สารสุขภาพ', 'สุขภาพ'],
  storageLocation: 'โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)',
  description:
    'จดหมายข่าวฉบับนี้รวบรวมองค์ความรู้ด้านสุขภาพประจำเดือนมกราคม 2569 เน้นเรื่องการดูแลสุขภาพจิตและกาย...'
})

const fav = ref(false)

// form state
const qty = ref(1)
const purpose = ref('')
const note = ref('')
const receiverType = ref('')
const target = ref('')
const location = ref('โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)')
const remark = ref('')


type RangeValue = { start: any; end: any } | null
const tz = getLocalTimeZone()
const t = today(tz)

const borrowRange = ref<RangeValue>(null)

const submitting = ref(false)


// options
const purposeOptions = [
  { label: 'ศึกษาดูงาน', value: 'study' },
  { label: 'ใช้ประกอบการสอน', value: 'teach' },
  { label: 'วิจัย/เก็บข้อมูล', value: 'research' },
  { label: 'อื่น ๆ', value: 'other' }
]

const receiverTypeOptions = [
  { label: 'บุคคลทั่วไป', value: 'person' },
  { label: 'หน่วยงาน/โรงเรียน', value: 'org' },
  { label: 'อาจารย์/เจ้าหน้าที่', value: 'staff' }
]

const targetOptions = [
  { label: 'นักเรียน', value: 'student' },
  { label: 'นักศึกษา', value: 'university' },
  { label: 'ครู/อาจารย์', value: 'teacher' },
  { label: 'ประชาชนทั่วไป', value: 'public' }
]

const openPdf = () => {
  // TODO: route to pdf viewer or open new tab
  console.log('open pdf')
}

const submit = async () => {
  submitting.value = true
  try {
    // TODO: call API
    console.log({
      qty: qty.value,
      purpose: purpose.value,
      note: note.value,
      receiverType: receiverType.value,
      target: target.value,
      location: location.value,
      borrowRange: borrowRange.value,
      remark: remark.value
    })
  } finally {
    submitting.value = false
  }
}
</script>
