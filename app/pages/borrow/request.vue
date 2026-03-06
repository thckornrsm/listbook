<template>
  <div class="h-dvh bg-slate-100 overflow-y-auto no-scrollbar">
    <BorrowTopBar title="ยืม/ขอ/คืน สื่อการเรียนรู้" @back="router.back()" />

    <main class="mx-auto w-full max-w-md space-y-4 px-4 py-4">
      <MediaDetailCard
        :title="media.title"
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
        left-label="ขอยืมสื่อการเรียนรู้"
        right-label="ขอสื่อการเรียนรู้"
        :left-to="leftTo"
        :right-to="rightTo"
        left-desc="ขอยืมสื่อการเรียนรู้โดยมีกำหนดส่งคืน"
        right-desc="ติดต่อเจ้าหน้าที่เพื่อขอสื่อการเรียนรู้โดยไม่มีกำหนดส่งคืน"
        :role="role"
        :mode="mode"
        :staff-extra-to="staffBorrowForMemberTo"
        :expected-return-text="expectedReturnText"
        :expected-return-subtext="expectedReturnSubtext"
        return-to="/return/confirm"
        @openReturnForm="openStaffReturnConfirmInline"
        @cancelReturnForm="cancelStaffReturnConfirmInline"
      />

      <div ref="formAnchor" class="scroll-mt-90" />

      <template v-if="showForm">
        <div class="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <!-- ====== BORROW ====== -->
          <template v-if="mode === 'borrow'">
            <BorrowMemberInfoCard
              v-if="isStaffBorrowForMember"
              ref="memberInfoRef"
              v-model:memberName="memberName"
              v-model:memberPhone="memberPhone"
            />

            <BorrowFormCard
              ref="borrowFormRef"
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
          </template>

          <!-- ====== REQUEST (ขอสื่อ) ====== -->
          <template v-else-if="mode === 'request'">
            <ReturnFormCard v-model:pin="pin" />

            <BorrowFormCard
              ref="borrowFormRef"
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

            <!-- แนบไฟล์ -->
            <div>
              <div class="mb-2 font-semibold">แนบไฟล์</div>
              <UFileUpload
                v-model="attachedFiles"
                icon="i-lucide-paperclip"
                label="วางไฟล์ที่นี่ หรือคลิกเพื่อเลือก"
                description="SVG, PNG, JPG, GIF หรือ PDF (ไม่เกิน 2MB)"
                layout="list"
                multiple
                :interactive="false"
                class="w-full min-h-36"
              >
                <template #actions="{ open }">
                  <UButton
                    label="เลือกไฟล์"
                    icon="i-lucide-upload"
                    color="neutral"
                    variant="outline"
                    @click="open()"
                  />
                </template>
              </UFileUpload>
            </div>

            <BorrowRemarkCard v-model:remark="remark" />
          </template>

          <!-- ====== RETURN (คืนสื่อ) ====== -->
          <template v-else-if="mode === 'return'">
            <template v-if="isStaff">
              <div class="space-y-4">
                <ReturnConditionCard v-model="condition" />
                <ReturnSuggestionCard v-model="suggestion" />
                <ReturnPhotoEvidenceCard v-model="previews" />
              </div>
            </template>
          </template>

          <template v-else>
            <UAlert
              title="ไม่พบประเภทการทำรายการ"
              description="กรุณากดปุ่มใหม่อีกครั้ง"
              color="warning"
              variant="outline"
            />
          </template>
        </div>

        <BorrowSubmitBar
          :loading="submitting"
          :disabled="false"
          :mode="mode"
          :role="role"
          @submit="onSubmit"
        />
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, nextTick, watch } from 'vue'
import { toCalendarDate } from '@internationalized/date'

import BorrowTopBar from '~/components/borrow/BorrowTopBar.vue'
import MediaDetailCard from '~/components/borrow/MediaDetailCard.vue'
import BorrowFormCard from '~/components/borrow/BorrowFormCard.vue'
import BorrowMemberInfoCard from '~/components/borrow/BorrowMemberInfoCard.vue'
import BorrowDateRangeCard from '~/components/borrow/BorrowDateRangeCard.vue'
import BorrowRemarkCard from '~/components/borrow/BorrowRemarkCard.vue'
import BorrowSubmitBar from '~/components/borrow/BorrowSubmitBar.vue'
import ReturnFormCard from '~/components/borrow/ReturnFormCard.vue'

import ReturnConditionCard from '~/components/return/ReturnConditionCard.vue'
import ReturnSuggestionCard from '~/components/return/ReturnSuggestionCard.vue'
import ReturnPhotoEvidenceCard from '~/components/return/ReturnPhotoEvidenceCard.vue'

const router = useRouter()
const route = useRoute()

const role = computed(() => String(route.query.role || 'user'))
const isStaff = computed(() => role.value === 'staff')
const mode = computed(() => String(route.query.mode || ''))

const staffFlow = computed(() => String(route.query.staffFlow || ''))
const isStaffBorrowForMember = computed(
  () => isStaff.value && mode.value === 'borrow' && staffFlow.value === 'borrowForMember'
)

const showForm = computed(() => route.query.step === 'form' && ['borrow', 'request', 'return'].includes(mode.value))

const buildTo = (m: 'borrow' | 'request' | 'return', extra?: Record<string, string>) => {
  const params = new URLSearchParams()
  params.set('mode', m)
  params.set('step', 'form')
  if (isStaff.value) params.set('role', 'staff')
  if (extra) for (const [k, v] of Object.entries(extra)) params.set(k, v)
  return `/borrow/request?${params.toString()}`
}

const leftTo = computed(() => buildTo('borrow'))
const rightTo = computed(() => buildTo('request'))

const staffBorrowForMemberTo = computed(() => {
  if (!isStaff.value) return undefined
  return buildTo('borrow', { staffFlow: 'borrowForMember' })
})

/** ✅ refs สำหรับ validate */
type ExposeValidate = { validate?: () => { ok: boolean } }
const borrowFormRef = ref<ExposeValidate | null>(null)
const memberInfoRef = ref<ExposeValidate | null>(null)

// mock media
const media = reactive({
  title: 'จดหมายข่าวชุมชนคนรักสุขภาพ ฉบับสร้างสุข ประจำเดือนมกราคม 2569',
  coverUrl: 'https://picsum.photos/400/540?random=7',
  remain: 10,
  total: 15,
  waiting: 0,
  borrowed: 5,
  tags: ['thaihealth', 'สร้างสุข', 'สสส.', 'สารสุขภาพ', 'สุขภาพ'],
  storageLocation: 'โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)',
  description: 'รายระเอียดของสื่อการเรียนรู้ เช่น บทคัดย่อ สารบัญ หรือข้อมูลอื่น ๆ ที่ช่วยให้ผู้ใช้ตัดสินใจได้ว่าจะยืมหรือไม่'
})

const expectedReturnText = computed(() => '24/2/2569')
const expectedReturnSubtext = computed(() => '(วันนี้)')

const fav = ref(false)

// shared form state
const qty = ref(1)
const purpose = ref('')
const note = ref('')
const receiverType = ref('')
const target = ref('')
const location = ref('')
const remark = ref('')

// staff borrow for member
const memberName = ref('')
const memberPhone = ref('')

type RangeValue = { start: any; end: any } | null
const borrowRange = ref<RangeValue>(null)

const pin = ref('')
const attachedFiles = ref<File[]>([])
const submitting = ref(false)

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

const toISO = (d: any) => {
  if (!d) return null
  const cd = toCalendarDate(d)
  return `${cd.year}-${String(cd.month).padStart(2, '0')}-${String(cd.day).padStart(2, '0')}`
}

/* ======================
   STAFF return state
   ====================== */
type Condition = 'good' | 'minor' | 'bad'
const condition = ref<Condition>('good')
const suggestion = ref('')
const previews = ref<string[]>([])

const formAnchor = ref<HTMLElement | null>(null)

watch(
  () => [route.query.step, route.query.mode] as const,
  async ([step, m]) => {
    if (step !== 'form') return
    if (m !== 'borrow' && m !== 'request') return
    await nextTick()
    formAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
)

const openStaffReturnConfirmInline = async () => {
  await router.replace({
    path: route.path,
    query: { ...route.query, role: 'staff', mode: 'return', step: 'form' }
  })

  await nextTick()
  formAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const cancelStaffReturnConfirmInline = async () => {
  const q: Record<string, any> = { ...route.query }
  delete q.step
  q.role = 'staff'
  q.mode = 'return'
  await router.replace({ path: route.path, query: q })
}

/* ======================
   submit handlers
   ====================== */
const submitBorrow = async () => {
  submitting.value = true
  try {
    const plain: any = {
      role: role.value,
      mode: 'borrow',
      qty: qty.value,
      purpose: purpose.value,
      note: note.value,
      receiverType: receiverType.value,
      target: target.value,
      location: location.value,
      borrowRange: borrowRange.value ? { start: toISO(borrowRange.value.start), end: toISO(borrowRange.value.end) } : null,
      remark: remark.value
    }

    if (isStaffBorrowForMember.value) {
      plain.staffFlow = 'borrowForMember'
      plain.member = { name: memberName.value, phone: memberPhone.value }
    }

    if (import.meta.client) console.log('SUBMIT', plain)
    await router.push({ path: '/borrow/success', query: { mode: 'borrow' } })
  } finally {
    submitting.value = false
  }
}

const submitRequest = async () => {
  submitting.value = true
  try {
    const plain = {
      role: role.value,
      mode: 'request',
      qty: qty.value,
      purpose: purpose.value,
      note: note.value,
      receiverType: receiverType.value,
      target: target.value,
      location: location.value,
      remark: remark.value
    }
    if (import.meta.client) console.log('SUBMIT', plain)
    await router.push({ path: '/borrow/req', query: { mode: 'request' } })
  } finally {
    submitting.value = false
  }
}

const submitReturn = async () => {
  submitting.value = true
  try {
    const plain = {
      role: role.value,
      mode: 'return',
      pin: pin.value,
      qty: qty.value,
      purpose: purpose.value,
      note: note.value,
      receiverType: receiverType.value,
      target: target.value,
      location: location.value,
      remark: remark.value
    }
    if (import.meta.client) console.log('SUBMIT', plain)
    await router.push({ path: '/return/success', query: { mode: 'return' } })
  } finally {
    submitting.value = false
  }
}

/** ✅ สำคัญ: onSubmit รับ done callback จากปุ่มสไลด์ */
const onSubmit = (done: (ok: boolean) => void) => {
  if (mode.value === 'borrow' || mode.value === 'request') {
    const memberRes = isStaffBorrowForMember.value
      ? memberInfoRef.value?.validate?.()
      : { ok: true }

    const formRes = borrowFormRef.value?.validate?.()

    const memberOk = (memberRes as any)?.ok === true
    const formOk = (formRes as any)?.ok === true

    if (!memberOk || !formOk) {
      done(false)
      return
    }
  }

  done(true)

  if (mode.value === 'borrow') return submitBorrow()
  if (mode.value === 'request') return submitRequest()
  if (mode.value === 'return') return submitReturn()
}
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* ปรับกรอบไฟล์แต่ละรายการใน UFileUpload */
:deep([data-slot="file"]) {
  border-color: rgb(203 213 225) !important;
}
</style>