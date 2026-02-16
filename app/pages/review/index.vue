<template>
  <div class="min-h-dvh bg-slate-50 font-sans text-slate-900">
    
    <div class="sticky top-0 z-20 flex h-14 items-center bg-[#ED7E24] px-4 text-white shadow-sm">
      <button 
        type="button" 
        class="mr-3 flex h-10 w-10 items-center justify-center rounded-full active:bg-white/20"
        @click="router.back()" 
        aria-label="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div class="flex-1 text-center text-lg font-bold">รายละเอียดการจอง</div>
      <div class="h-10 w-10"></div>
    </div>

    <div class="mx-auto w-full max-w-md px-4 py-6">
      
      <div class="flex flex-col items-center rounded-2xl bg-white px-6 py-10 shadow-sm">
        
        <div class="relative flex items-center justify-center">
          <div class="h-28 w-28 rounded-full bg-[#FFBD89]"></div>
          
          <div class="absolute h-20 w-20 rounded-full bg-[#FDD4B4]"></div>
          
          <div class="absolute flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7 text-[#ED7E24]">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        </div>

        <h2 class="mt-6 text-center text-2xl font-bold text-[#ED7E24]">ความพึงพอใจ</h2>
        <p class="mt-2 text-center text-sm text-[#64748B]">บริการของเราเป็นอย่างไร?</p>

        <div class="mt-6 flex items-center justify-center gap-3">
          <button 
            v-for="n in 5" 
            :key="n" 
            type="button" 
            class="transition-transform active:scale-90 focus:outline-none"
            @click="rating = n"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              class="h-10 w-10"
              :class="n <= rating ? 'text-[#ED7E24]' : 'text-slate-200'"
            >
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="mt-8 w-full">
          <label class="mb-2 block text-left text-sm font-bold text-slate-700">
            ข้อเสนอเพิ่มเติม
          </label>
          <textarea 
            v-model="comment"
            class="h-32 w-full resize-none rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ED7E24] focus:bg-white focus:outline-none focus:ring-0"
            placeholder="เขียนข้อเสนอเพิ่มเติม....."
          ></textarea>
        </div>

        <button 
          type="button"
          class="mt-8 h-12 w-full rounded-xl bg-[#ED7E24] text-lg font-bold text-white shadow-sm transition-all hover:bg-[#d96d1f] active:scale-[0.98] disabled:opacity-50"
          :disabled="rating === 0"
          @click="onFinish"
        >
          เสร็จสิ้น
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const rating = ref<number>(4) // Default 4 ดาวตามรูป
const comment = ref('')

const onFinish = () => {
  console.log('Submitted:', { rating: rating.value, comment: comment.value })
  // Logic เมื่อกดเสร็จสิ้น
}
</script>