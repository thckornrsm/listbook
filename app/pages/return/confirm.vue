<template>
  <div class="min-h-dvh bg-slate-100 text-slate-900">
    <div class="sticky top-0 z-20 flex h-14 items-center bg-[#ED7E24] px-4 text-white">
      <button type="button" class="mr-3 grid h-10 w-10 place-items-center rounded-full active:opacity-90"
        @click="router.back()" aria-label="Back">
        <span class="text-2xl leading-none">‹</span>
      </button>

      <div class="flex-1 text-center text-base font-semibold">กรอกข้อมูลการยืม</div>
      <div class="h-10 w-10"></div>
    </div>

    <div class="mx-auto w-full max-w-md px-4 py-4">
      <div class="rounded-2xl bg-white p-4 shadow-sm">
        <div class="text-sm font-semibold text-slate-900 hidden">จำนวนที่ต้องการ</div>

        <div class="text-sm font-semibold text-slate-900">1. ตรวจสอบอุปกรณ์</div>

        <div class="mt-3 space-y-3">
          <label class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 cursor-pointer">
            <span class="grid h-6 w-6 place-items-center rounded-md border transition-colors"
              :class="checks.device ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-white'">
              <svg v-if="checks.device" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" class="h-4 w-4">
                <path d="M4 10.5l3.2 3.2L16 5.9" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="text-sm text-slate-900">ตัวเล่นหนังสือ/สื่อการเรียนรู้</span>
            <input class="hidden" type="checkbox" v-model="checks.device" />
          </label>

          <label class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 cursor-pointer">
            <span class="grid h-6 w-6 place-items-center rounded-md border transition-colors"
              :class="checks.box ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-white'">
              <svg v-if="checks.box" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" class="h-4 w-4">
                <path d="M4 10.5l3.2 3.2L16 5.9" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="text-sm text-slate-900">กล่องบรรจุภัณฑ์</span>
            <input class="hidden" type="checkbox" v-model="checks.box" />
          </label>

          <div class="space-y-2">
            <label class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 cursor-pointer">
              <span class="grid h-6 w-6 place-items-center rounded-md border transition-colors"
                :class="checks.other ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-white'">
                <svg v-if="checks.other" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" class="h-4 w-4">
                  <path d="M4 10.5l3.2 3.2L16 5.9" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span class="text-sm text-slate-900">อื่นๆ</span>
              <input class="hidden" type="checkbox" v-model="checks.other" />
            </label>

            <textarea v-if="checks.other" v-model="otherText"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ED7E24] focus:outline-none focus:ring-2 focus:ring-[#ED7E24]/20"
              rows="3" placeholder="กรอกรายละเอียด...."></textarea>
          </div>
        </div>

        <div class="mt-6 text-sm font-semibold text-slate-900">2. สภาพการใช้งาน</div>

        <div class="mt-3 space-y-3">
          <div @click="condition = 'good'"
            class="rounded-2xl border px-4 py-4 cursor-pointer select-none transition flex items-center justify-between gap-4"
            :style="condition === 'good' 
              ? 'border-color: #0B8D6E; background-color: #E7F4F1;' 
              : 'border-color: #e2e8f0; background-color: white;'">
            
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full flex items-center justify-center transition-all"
                 :style="condition === 'good' 
                   ? 'background-color: #0B8D6E;' 
                   : 'background-color: white; border: 2px solid #cbd5e1;'">
              </div>
              
              <div>
                <div class="text-base font-extrabold"
                  :style="{ color: condition === 'good' ? '#0B8D6E' : '#0f172a' }">
                  สภาพสมบูรณ์
                </div>
                <div class="mt-1 text-sm text-slate-500">ไม่มีรอยขีดข่วน ไม่มีฉีกขาด</div>
              </div>
            </div>

            <div class="h-5 w-5 rounded-full border-2"
              :style="condition === 'good' 
                ? 'border-color: #0B8D6E; background-color: #0B8D6E;' 
                : 'border-color: #cbd5e1; background-color: white;'">
            </div>
          </div>

          <div @click="condition = 'minor'"
            class="rounded-2xl border px-4 py-4 cursor-pointer select-none transition flex items-center justify-between gap-4"
            :style="condition === 'minor' 
              ? 'border-color: #ED7E24; background-color: #FFF2E9;' 
              : 'border-color: #e2e8f0; background-color: white;'">
            
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full flex items-center justify-center transition-all"
                :style="condition === 'minor' 
                   ? 'background-color: #ED7E24;' 
                   : 'background-color: white; border: 2px solid #cbd5e1;'">
              </div>

              <div>
                <div class="text-base font-extrabold"
                  :style="{ color: condition === 'minor' ? '#ED7E24' : '#0f172a' }">
                  ชำรุดเล็กน้อย
                </div>
                <div class="mt-1 text-sm text-slate-500">มีรอยยับ หรือรอยเปื้อน</div>
              </div>
            </div>
            
             <div class="h-5 w-5 rounded-full border-2"
              :style="condition === 'minor' 
                ? 'border-color: #ED7E24; background-color: #ED7E24;' 
                : 'border-color: #cbd5e1; background-color: white;'">
            </div>
          </div>

          <div @click="condition = 'bad'"
            class="rounded-2xl border px-4 py-4 cursor-pointer select-none transition flex items-center justify-between gap-4"
            :style="condition === 'bad' 
              ? 'border-color: #FF2D2D; background-color: #FFF0F0;' 
              : 'border-color: #e2e8f0; background-color: white;'">
            
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full flex items-center justify-center transition-all"
                :style="condition === 'bad' 
                   ? 'background-color: #FF2D2D;' 
                   : 'background-color: white; border: 2px solid #cbd5e1;'">
              </div>

              <div>
                <div class="text-base font-extrabold"
                  :style="{ color: condition === 'bad' ? '#FF2D2D' : '#0f172a' }">
                  ชำรุดมาก / สูญหาย
                </div>
                <div class="mt-1 text-sm text-slate-500">ใช้งานต่อไม่ได้ หรือของหาย</div>
              </div>
            </div>

            <div class="h-5 w-5 rounded-full border-2"
              :style="condition === 'bad' 
                ? 'border-color: #FF2D2D; background-color: #FF2D2D;' 
                : 'border-color: #cbd5e1; background-color: white;'">
            </div>
          </div>
        </div>

        <div class="mt-6 text-sm font-semibold text-slate-900">3. หลักฐานรูปถ่าย</div>

        <div class="mt-3">
          <label
            class="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-700 active:scale-[0.99]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.0832 3.3335H7.9165L5.83317 5.8335H3.33317C2.89114 5.8335 2.46722 6.00909 2.15466 6.32165C1.8421 6.63421 1.6665 7.05814 1.6665 7.50016V15.0002C1.6665 15.4422 1.8421 15.8661 2.15466 16.1787C2.46722 16.4912 2.89114 16.6668 3.33317 16.6668H16.6665C17.1085 16.6668 17.5325 16.4912 17.845 16.1787C18.1576 15.8661 18.3332 15.4422 18.3332 15.0002V7.50016C18.3332 7.05814 18.1576 6.63421 17.845 6.32165C17.5325 6.00909 17.1085 5.8335 16.6665 5.8335H14.1665L12.0832 3.3335Z"
                stroke="#62748E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M10 13.3335C11.3807 13.3335 12.5 12.2142 12.5 10.8335C12.5 9.45278 11.3807 8.3335 10 8.3335C8.61929 8.3335 7.5 9.45278 7.5 10.8335C7.5 12.2142 8.61929 13.3335 10 13.3335Z"
                stroke="#62748E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <div class="mt-2 text-xs font-semibold text-slate-700">เพิ่มรูป</div>
            <input type="file" class="hidden" accept="image/*" multiple @change="onPickFiles" />
          </label>

          <div v-if="previews.length" class="mt-4 grid grid-cols-3 gap-3">
            <div v-for="(src, i) in previews" :key="i" class="relative overflow-hidden rounded-xl border border-slate-200">
              <img :src="src" class="h-24 w-full object-cover" alt="preview" />
              <button type="button"
                class="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white"
                @click="removePreview(i)" aria-label="remove">
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 pb-6">
        <button type="button"
          class="h-14 w-full rounded-2xl bg-[#ED7E24] text-lg font-semibold text-white shadow-sm active:scale-[0.99] disabled:opacity-60"
          :disabled="!canSubmit" @click="onSubmit">
          ยืนยันข้อมูล
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const checks = reactive({
  device: false,
  box: false,
  other: false,
})

const otherText = ref('')

type Condition = 'good' | 'minor' | 'bad'
const condition = ref<Condition>('good')

const previews = ref<string[]>([])

const canSubmit = computed(() => {
  const hasAnyCheck = checks.device || checks.box || checks.other
  const otherOk = !checks.other || otherText.value.trim().length > 0
  return hasAnyCheck && otherOk && !!condition.value
})

const onPickFiles = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  Array.from(files).forEach((f) => {
    const url = URL.createObjectURL(f)
    previews.value.push(url)
  })

  // reset เพื่อเลือกไฟล์เดิมซ้ำได้
  input.value = ''
}

const removePreview = (i: number) => {
  const url = previews.value[i]
  if (url) URL.revokeObjectURL(url)
  previews.value.splice(i, 1)
}

const onSubmit = () => {
  // mock payload
  const payload = {
    checks: { ...checks },
    otherText: otherText.value,
    condition: condition.value,
    photosCount: previews.value.length,
  }
  console.log('SUBMIT BORROW FORM:', payload)

  // ปรับ route ตามจริง
  router.push('/return/confirm')
}
</script>