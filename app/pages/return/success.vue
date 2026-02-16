<template>
  <div class="min-h-dvh bg-[#FFEEE2]">
    <div class="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6">
      <!-- Center content -->
      <div class="flex flex-1 flex-col items-center justify-center">
        <!-- rings -->
        <div class="relative grid place-items-center">
          <!-- outer ring -->
          <div class="h-56 w-56 rounded-full bg-[#F8B87B] opacity-70"></div>
          <!-- middle ring -->
          <div class="absolute h-40 w-40 rounded-full bg-[#FFD8B8]"></div>
          <!-- inner white -->
          <div class="absolute grid h-28 w-28 place-items-center rounded-full bg-white">
            <!-- check icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82" class="h-14 w-14" fill="none">
              <path
                d="M75.1668 37.8566V40.9999C75.1626 48.3677 72.7769 55.5368 68.3654 61.4378C63.9539 67.3389 57.753 71.6559 50.6876 73.7449C43.6222 75.834 36.0708 75.5831 29.1596 73.0298C22.2484 70.4764 16.3477 65.7575 12.3376 59.5766C8.32749 53.3957 6.42278 46.0842 6.90756 38.7324C7.39233 31.3805 10.2406 24.3824 15.0276 18.7816C19.8146 13.1808 26.2838 9.2775 33.4705 7.65378C40.6571 6.03005 48.1761 6.77293 54.906 9.77161"
                stroke="#ED7E24"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M75.1667 13.6667L41 47.8676L30.75 37.6176"
                stroke="#ED7E24"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <!-- text -->
        <h1 class="mt-10 text-center text-3xl font-extrabold text-[#ED7E24]">
          คืนสื่อเสร็จสิ้น
        </h1>

        <p class="mt-3 text-center text-sm leading-6 text-[#62748E]">
          ระบบบันทึกการคืนเรียบร้อยแล้ว<br />
          กรุณารอรับข้อความยืนยันทาง Line
        </p>
      </div>

      <!-- bottom button -->
      <div class="pb-10">
        <button
          type="button"
          class="h-14 w-full rounded-2xl bg-[#ED7E24] text-lg font-semibold text-white shadow-sm active:scale-[0.99]"
          @click="onDone"
        >
          เสร็จสิ้น
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const onDone = () => {
  // ปรับปลายทางได้ เช่น กลับหน้า list หรือ home
  router.push('/media/1')
}
</script>
