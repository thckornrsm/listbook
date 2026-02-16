<template>
  <div class="min-h-dvh bg-white">
    <div class="h-2 bg-slate-600"></div>

    <div class="mx-auto w-full max-w-md px-6 pt-12 pb-10">
      <h1 class="text-center text-3xl font-extrabold text-slate-900">
        ยืนยันเบอร์โทรศัพท์
      </h1>

      <p class="mt-3 text-center text-sm leading-6 text-slate-500">
        กรุณากรอกรหัส 4 ตัว ส่งถึง
        <span class="font-semibold text-slate-700">{{ displayPhone }}</span>
        ทางข้อความ
      </p>

      <!-- OTP boxes -->
      <div class="mt-12 flex justify-center gap-10">
        <div
          v-for="i in 4"
          :key="i"
          class="w-16"
        >
          <input
            :ref="(el) => setRef(el, i - 1)"
            v-model="otp[i - 1]"
            inputmode="numeric"
            maxlength="1"
            class="w-full bg-transparent text-center text-3xl font-semibold text-slate-900 outline-none"
            @input="onInput(i - 1)"
            @keydown.backspace.prevent="onBackspace(i - 1)"
          />
          <div class="mt-3 h-[3px] w-full rounded bg-slate-900"></div>
        </div>
      </div>

      <!-- resend -->
      <div class="mt-8 text-center text-base text-slate-500">
        ยังไม่ได้รับรหัสใช่หรือไม่ ?
        <button
          type="button"
          class="font-semibold text-[#ED7E24]"
          @click="onResend"
        >
          ส่งรหัสอีกครั้ง
        </button>
      </div>

      <!-- error -->
      <div v-if="showPhoneError" class="mt-6 text-center text-lg font-semibold text-slate-700">
        กรอกเบอร์โทรศัพท์ผิด
      </div>

      <!-- confirm -->
      <button
  type="button"
  class="btn-primary btn-lg mt-10"
  :disabled="!isComplete"
  @click="onConfirm"
>
  ยืนยันรหัส
</button>


      <p class="mt-6 text-center text-sm leading-6 text-slate-500">
        การดำเนินการต่อแสดงว่าคุณยอมรับ
        <span class="underline">ข้อกำหนดการใช้งาน</span>
        <br />
        และ<span class="underline">นโยบายความเป็นส่วนตัว</span>ของเรา
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const displayPhone = computed(() => {
  const p = route.query.phone
  return typeof p === 'string' && p.length ? p : '+66 xxx xxxx'
})

const otp = reactive<string[]>(['', '', '', ''])
const refs = ref<HTMLInputElement[]>([])

const setRef = (el: Element | null, idx: number) => {
  if (el) refs.value[idx] = el as HTMLInputElement
}

const focusAt = (idx: number) => {
  refs.value[idx]?.focus()
  refs.value[idx]?.select?.()
}

onMounted(() => focusAt(0))

const isComplete = computed(() => otp.every((x) => /^\d$/.test(x)))

const onInput = (idx: number) => {
  // รับเฉพาะตัวเลข
  otp[idx] = (otp[idx] || '').replace(/\D/g, '').slice(0, 1)
  if (otp[idx] && idx < 3) focusAt(idx + 1)
}

const onBackspace = (idx: number) => {
  if (otp[idx]) {
    otp[idx] = ''
    return
  }
  if (idx > 0) {
    otp[idx - 1] = ''
    focusAt(idx - 1)
  }
}

const showPhoneError = ref(false)

const onResend = () => {
  console.log('resend otp to', displayPhone.value)
  // TODO: call API resend
}

const onConfirm = () => {
  const code = otp.join('')
  console.log('confirm otp', code, 'for', displayPhone.value)

  // TODO: call API verify OTP
  // ถ้าผิด:
  // showPhoneError.value = true
  // ถ้าถูก: ไปหน้าถัดไป เช่น /register/profile หรือ /home
  router.push('/login')
}
</script>
