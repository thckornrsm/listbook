<template>
  <!-- ภาพ 2 พื้นหลังขาว -->
  <div class="min-h-dvh bg-white">
    <!-- แถบบน: ให้บางลง -->
    

    <div class="mx-auto w-full max-w-md px-4 pt-4 pb-8">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <!-- Logo -->
        <div class="h-10 w-10 flex-none overflow-hidden rounded-lg bg-white">
          <img
            src="/upload/sorsor.png"
            alt="สสส."
            class="h-full w-full object-contain"
          />
        </div>

        <!-- Title -->
        <h1 class="flex-1 text-center text-xl font-semibold text-slate-900">
          ลงทะเบียนสมาชิกกับ<span class="text-[#ED7E24]">สสส.</span>
        </h1>

        <!-- Spacer -->
        <div class="h-10 w-10 flex-none"></div>
      </div>

      <!-- กล่อง: ลดความสูง + ไม่ดันปุ่มลงเกิน -->
      <div class="mt-4 rounded-2xl border border-[#ED7E24] bg-white p-3">
        <div class="h-[58vh] max-h-[620px] rounded-2xl bg-white"></div>
      </div>

      <!-- ปุ่ม: ให้ทรงเหมือนรูป 2 -->
      <div class="mt-6 flex flex-col gap-3">
        <button class="btn-primary " @click="onRegister">ลงทะเบียนใหม่</button>

        <button class="btn-secondary" @click="onAlready">เคยลงทะเบียนแล้ว</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const onRegister = () => router.push('/register')
const onAlready = () => router.push('/login')
</script>
