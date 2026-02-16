<template>
  <div class="min-h-dvh bg-white">
    <div class="mx-auto w-full max-w-md px-6 py-10">
      <!-- Logo -->
      <div class="flex flex-col items-center">
        <img src="/upload/sorsor.png" alt="สสส." class="h-28 w-auto" />
        <h1 class="mt-6 text-3xl font-extrabold text-slate-900">เข้าสู่ระบบ</h1>
      </div>

      <!-- Form -->
      <form class="mt-10 space-y-6" @submit.prevent="onLogin">
        <div>
          <label class="mb-2 block text-base font-medium text-slate-600">อีเมล</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            class="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg outline-none shadow-sm focus:border-slate-300"
          />
        </div>

        <div>
          <label class="mb-2 block text-base font-medium text-slate-600">รหัสผ่าน</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg outline-none shadow-sm focus:border-slate-300"
          />
        </div>

        <button class="btn-primary" @click="onLogin">เข้าสู่ระบบ</button>
      </form>

      <!-- Divider -->
      <div class="my-8 flex items-center gap-3">
        <div class="h-px flex-1 bg-slate-200"></div>
        <div class="text-base font-medium text-slate-500">เข้าสู่ระบบด้วย</div>
        <div class="h-px flex-1 bg-slate-200"></div>
      </div>

      <!-- Social -->
      <div class="flex justify-center gap-4">
        <button class="social-btn" type="button" @click="onPhone" aria-label="Login with phone">
          <img src="/icons/Phone.svg" alt="Phone" class="h-7 w-7" />
        </button>

        <button class="social-btn" type="button" @click="onLine" aria-label="Login with LINE">
          <img src="/icons/line.svg" alt="LINE" class="h-7 w-7" />
        </button>

        <button class="social-btn" type="button" @click="onGoogle" aria-label="Login with Google">
          <img src="/icons/google.svg" alt="Google" class="h-7 w-7" />
        </button>

        <button class="social-btn" type="button" @click="onFacebook" aria-label="Login with Facebook">
          <img src="/icons/facebook.svg" alt="Facebook" class="h-7 w-7" />
        </button>
      </div>

      <!-- Bottom (เหมือนรูป: มีบัญชีอยู่แล้ว? ลงทะเบียน) -->
      <div class="mt-12 border-t border-slate-100 pt-6 text-center text-base text-slate-700">
        มีบัญชีอยู่แล้ว?
        <NuxtLink to="/register" class="font-semibold text-[#ED7E24]">ลงทะเบียน</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const email = ref('')
const password = ref('')

const onLogin = () => {
  console.log('LOGIN:', { email: email.value, password: password.value })
  // TODO: call API login
  // สำเร็จแล้วค่อยไปหน้า home/dashboard
  // router.push('/home')
}

const onPhone = () => router.push('/register/phone') // ถ้าคุณใช้ flow phone/otp
const onLine = () => console.log('Login with LINE')
const onGoogle = () => console.log('Login with Google')
const onFacebook = () => console.log('Login with Facebook')
</script>

<style scoped>
.social-btn {
  display: grid;
  place-items: center;
  width: 64px;
  height: 56px;
  border-radius: 14px;
  border: 1px solid #dbe3f0;
  background: #fff;
}
</style>
