<template>
    <div class="min-h-dvh bg-white">
        <!-- top bar -->
        <div class="h-2 bg-slate-600"></div>

        <div class="mx-auto w-full max-w-md px-6 pt-10 pb-8">
            <!-- logo -->
            <div class="flex flex-col items-center">
                <img src="/upload/sorsor.png" alt="สสส." class="h-28 w-auto" />
                <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
                    ลงทะเบียนสมาชิก
                </h1>
            </div>

            <!-- form -->
            <div class="mt-8">
                <label class="block text-base font-medium text-slate-600">
                    กรอกหมายเลขโทรศัพท์
                </label>

                <div class="mt-3 flex gap-3">
                    <!-- country -->
                    <button type="button"
                        class="flex h-14 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-slate-600 shadow-sm">
                        <span class="text-lg font-semibold">+66</span>
                        <span class="text-lg">▾</span>
                    </button>

                    <!-- phone input -->
                    <input v-model="phone" inputmode="numeric" autocomplete="tel" placeholder=""
                        class="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg outline-none shadow-sm focus:border-slate-300" />
                </div>

                <!-- otp button -->
                <button type="button" class="btn-primary mt-7" :disabled="!canSubmit" @click="onRequestOtp">
                    รับ OTP
                </button>


                <p class="mt-6 text-center text-sm leading-6 text-slate-500">
                    การดำเนินการต่อแสดงว่าคุณยอมรับ
                    <span class="underline">ข้อกำหนดการใช้งาน</span>
                    <br />
                    และ<span class="underline">นโยบายความเป็นส่วนตัว</span>ของเรา
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
const phone = ref('')

const canSubmit = computed(() => {
    // รับเฉพาะตัวเลข 9-10 หลัก (ไทย) ปรับได้
    const digits = phone.value.replace(/\D/g, '')
    return digits.length >= 9 && digits.length <= 10
})

const onRequestOtp = () => {
    const digits = phone.value.replace(/\D/g, '')
    console.log('request otp for', '+66' + digits)

    // TODO: call API request OTP
    // เสร็จแล้วค่อยไปหน้าใส่ OTP เช่น /register/otp
    router.push({ path: '/register/otp', query: { phone: `+66${digits}` } })

}


</script>
