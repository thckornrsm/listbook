<template>
  <div class="min-h-dvh bg-slate-50">
    <div class="mx-auto w-full max-w-md px-6 py-8">
      <!-- Logo -->
      <div class="flex flex-col items-center">
        <img src="/upload/sorsor.png" alt="สสส." class="h-24 w-auto" />
        <h1 class="mt-5 text-2xl font-bold text-slate-900">ลงทะเบียนสมาชิก</h1>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-5" @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600">ชื่อ</label>
            <input v-model="form.firstName" type="text" class="input" placeholder="ชื่อ" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600">นามสกุล</label>
            <input v-model="form.lastName" type="text" class="input" placeholder="นามสกุล" />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">อีเมล</label>
          <input v-model="form.email" type="email" class="input" placeholder="name@email.com" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">รหัสผ่าน</label>
          <input v-model="form.password" type="password" class="input" placeholder="รหัสผ่าน" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">ยืนยันรหัสผ่าน</label>
          <input v-model="form.confirmPassword" type="password" class="input" placeholder="ยืนยันรหัสผ่าน" />
        </div>

        <!-- Submit -->
        <button class="btn-primary" @click="onSubmit">ลงทะเบียน</button>
      </form>

      <!-- Divider -->
      <div class="my-7 flex items-center gap-3">
        <div class="h-px flex-1 bg-slate-200"></div>
        <div class="text-sm font-medium text-slate-500">ลงทะเบียนด้วย</div>
        <div class="h-px flex-1 bg-slate-200"></div>
      </div>

      <!-- Social -->
      <!-- Social -->
<div class="flex justify-center gap-4">
  <button class="social-btn" type="button" @click="onPhone" aria-label="Register with phone">
    <img src="/icons/Phone.svg" alt="Phone" class="h-7 w-7" />
  </button>

  <button class="social-btn" type="button" @click="onLine" aria-label="Register with LINE">
    <img src="/icons/line.svg" alt="LINE" class="h-7 w-7" />
  </button>

  <button class="social-btn" type="button" @click="onGoogle" aria-label="Register with Google">
    <img src="/icons/google.svg" alt="Google" class="h-7 w-7" />
  </button>

  <button class="social-btn" type="button" @click="onFacebook" aria-label="Register with Facebook">
    <img src="/icons/facebook.svg" alt="Facebook" class="h-7 w-7" />
  </button>
</div>


      <!-- Bottom -->
      <div class="mt-8 text-center text-sm text-slate-600">
        มีบัญชีอยู่แล้ว?
        <NuxtLink to="/login" class="font-semibold text-[#ED7E24]">เข้าสู่ระบบ</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const onSubmit = () => {
  if (form.password !== form.confirmPassword) {
    alert('รหัสผ่านไม่ตรงกัน')
    return
  }

  console.log('REGISTER:', { ...form })
  // TODO: call API register

  router.push('/register/phone')
}

const onPhone = () => router.push('/register/phone')
const onLine = () => console.log('Register with LINE')
const onGoogle = () => console.log('Register with Google')
const onFacebook = () => console.log('Register with Facebook')
</script>


<style scoped>
.input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #dbe3f0;
  background: #fff;
  padding: 12px 14px;
  outline: none;
}
.input:focus {
  border-color: #9bb7ff;
  box-shadow: 0 0 0 3px rgba(155, 183, 255, 0.25);
}
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
