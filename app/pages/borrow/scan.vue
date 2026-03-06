<template>
  <div class="min-h-dvh bg-slate-100">
    <BorrowTopBar title="สแกน QR เพื่อทำรายการ" @back="router.back()" />

    <main class="mx-auto w-full max-w-md space-y-4 px-4 py-4">
      <!-- กล่องกล้อง -->
      <div class="overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div class="text-sm font-semibold text-slate-900">กล้องสแกน QR</div>
        <p class="mt-1 text-sm text-slate-500">
          สแกน QR บนสื่อการเรียนรู้ เพื่อไปหน้าเลือกฟอร์ม (ยืม/ขอ) ตามสิทธิ์ของผู้ใช้
        </p>

        <div class="mt-4 overflow-hidden rounded-xl bg-slate-900">
          <video ref="videoEl" class="h-72 w-full object-cover" muted playsinline />
        </div>

        <div class="mt-4 flex gap-2">
          <UButton
            color="neutral"
            variant="outline"
            class="h-11 flex-1 justify-center rounded-xl bg-white"
            :disabled="scanning"
            label="เริ่มสแกน"
            @click="startScan"
          />
          <UButton
            color="neutral"
            variant="outline"
            class="h-11 flex-1 justify-center rounded-xl bg-white"
            :disabled="!scanning"
            label="หยุดสแกน"
            @click="stopScan"
          />
        </div>

        <div v-if="lastText" class="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
          <div class="font-semibold text-slate-900">ค่าที่สแกนได้</div>
          <div class="mt-1 break-all">{{ lastText }}</div>
        </div>
      </div>

      <!-- ปุ่มทดสอบ role -->
      <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div class="text-sm font-semibold text-slate-900">ทดสอบการนำทาง</div>
        <p class="mt-1 text-sm text-slate-500">
          ปุ่มนี้ไว้เทสว่า staff ไป <code>/borrow/request?role=staff</code> และ user ไป <code>/borrow/request</code>
        </p>

        <div class="mt-3 grid grid-cols-2 gap-2">
          <UButton
            class="h-11 justify-center rounded-xl"
            color="neutral"
            variant="solid"
            label="จำลองเป็น User"
            @click="goAfterScan({ mediaId: 'M001' }, 'user')"
          />
          <UButton
            class="h-11 justify-center rounded-xl bg-slate-700 text-white hover:bg-slate-700 active:bg-slate-700/95"
            color="neutral"
            variant="solid"
            label="จำลองเป็น Staff"
            @click="goAfterScan({ mediaId: 'M001' }, 'staff')"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { BrowserMultiFormatReader } from '@zxing/browser'
import { computed, onBeforeUnmount, ref } from 'vue'
import BorrowTopBar from '~/components/borrow/BorrowTopBar.vue'

const router = useRouter()
const route = useRoute()

/**
 * ✅ ตรงนี้คือจุด "แยก role"
 * - ถ้าโปรเจกต์คุณมี auth store จริง ให้เปลี่ยนมาอ่านจาก store ได้เลย
 * - ตอนนี้ทำ fallback: ถ้ามี query role=staff มาก็ถือว่าเป็น staff (ไว้เทส/ดีบัก)
 */
const roleFromSession = ref<'user' | 'staff'>('user') // TODO: เปลี่ยนไปอ่านจาก auth จริง
const role = computed<'user' | 'staff'>(() => {
  const q = String(route.query.role || '')
  if (q === 'staff') return 'staff'
  return roleFromSession.value
})

const videoEl = ref<HTMLVideoElement | null>(null)
const scanning = ref(false)
const lastText = ref('')

let codeReader: BrowserMultiFormatReader | null = null
let stopFn: (() => void) | null = null

type QRPayload = {
  mediaId?: string
  // ถ้าอนาคตมี borrowId / action อื่น ๆ ค่อยเพิ่มได้
}

/**
 * ✅ แปลงข้อความจาก QR ให้เป็น payload
 * รองรับ 2 แบบ:
 * 1) JSON: {"mediaId":"M001"}
 * 2) querystring: mediaId=M001
 */
const parseQrText = (text: string): QRPayload => {
  const raw = text.trim()

  // JSON
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const obj = JSON.parse(raw)
      return { mediaId: obj.mediaId }
    } catch {
      return {}
    }
  }

  // querystring
  const qs = new URLSearchParams(raw)
  if (qs.has('mediaId')) return { mediaId: qs.get('mediaId') || undefined }

  // ถ้าเป็น URL: https://xxx?mediaId=M001
  try {
    const u = new URL(raw)
    const q = new URLSearchParams(u.search)
    if (q.has('mediaId')) return { mediaId: q.get('mediaId') || undefined }
  } catch {
    // not a url
  }

  return {}
}

/**
 * ✅ จุดสำคัญที่สุด: สแกนแล้วไปหน้าไหน
 * - user → /borrow/request
 * - staff → /borrow/request?role=staff
 * - และพ่วง mediaId (ถ้ามี)
 */
const goAfterScan = async (payload: QRPayload, forceRole?: 'user' | 'staff') => {
  const r = forceRole || role.value

  const params = new URLSearchParams()
  if (r === 'staff') params.set('role', 'staff')
  if (payload.mediaId) params.set('mediaId', payload.mediaId)

  const url = params.toString() ? `/borrow/request?${params.toString()}` : '/borrow/request'
  await router.push(url)
}

const startScan = async () => {
  if (scanning.value) return
  scanning.value = true

  try {
    if (!videoEl.value) throw new Error('video not ready')

    codeReader = new BrowserMultiFormatReader()
    stopFn = await codeReader.decodeFromVideoDevice(undefined, videoEl.value, async (result, err) => {
      if (result) {
        const text = result.getText()
        lastText.value = text

        // ✅ กันสแกนซ้ำรัว
        await stopScan()

        const payload = parseQrText(text)
        await goAfterScan(payload)
      }
    })
  } catch (e) {
    scanning.value = false
    console.error(e)
  }
}

const stopScan = async () => {
  scanning.value = false
  try {
    if (stopFn) stopFn()
  } finally {
    stopFn = null
    if (codeReader) {
      codeReader.reset()
      codeReader = null
    }
  }
}

onBeforeUnmount(() => {
  stopScan()
})
</script>