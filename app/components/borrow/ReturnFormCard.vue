<template>
  <div class="space-y-4">
    <div class="font-semibold">ขอสื่อการเรียนรู้</div>
    <div class="leading-6">
      เจ้าหน้าที่ดำเนินการติดต่อพูดคุยกับเจ้าหน้าที่ประจำศูนย์เรียนรู้แล้ว
      <br />
      โดยมี PIN Code ดังนี้
    </div>

    <div class="flex items-center justify-between gap-2">
      <UInput
        v-for="i in 6"
        :key="i"
        ref="inputRefs"
        :model-value="digits[i - 1]"
        inputmode="numeric"
        maxlength="1"
        size="xl"
        class="w-12 text-center"
        :ui="pinUI"
        :color="errorMessage ? 'error' : 'neutral'"
        @update:model-value="(v) => onDigit(i - 1, String(v || ''))"
        @keydown="onKeyDown(i - 1, $event)"
      />
    </div>

    <div v-if="errorMessage" class="text-sm font-medium text-red-500 text-center">
      {{ errorMessage }}
    </div>

    <UButton
      label="ตรวจสอบรหัสเจ้าหน้าที่"
      class="h-12 w-full justify-center rounded-xl text-base font-semibold bg-[#0B8D6E] text-white hover:bg-[#0B8D6E]/90"
      @click="handleCheck"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { z } from 'zod'

const pinModel = defineModel<string>('pin', { default: '' })

// DOM Refs สำหรับ Auto-focus
const inputRefs = ref<any[]>([])

// ข้อความ Error จาก Zod
const errorMessage = ref('')

// Zod Schema: บังคับ 6 หลัก และต้องเป็นตัวเลข 0-9 เท่านั้น
const pinSchema = z
  .string()
  .length(6, { message: 'กรุณากรอกรหัส PIN ให้ครบ 6 หลัก' })
  .regex(/^\d+$/, { message: 'กรุณากรอกเฉพาะตัวเลขเท่านั้น' })

const digits = computed(() => {
  const s = (pinModel.value || '').slice(0, 6)
  return Array.from({ length: 6 }, (_, idx) => s[idx] ?? '')
})

// Focus ไปที่ช่องที่กำหนด
const focusInput = (index: number) => {
  const targetInput = inputRefs.value[index]
  if (targetInput?.input) {
    targetInput.input?.focus()
  } else if (targetInput?.$el) {
    const el = targetInput.$el.querySelector('input') as HTMLInputElement | null
    el?.focus()
  }
}

const onDigit = (idx: number, v: string) => {
  errorMessage.value = '' // เคลียร์ Error เวลามีการพิมพ์ใหม่

  // เอาเฉพาะตัวเลข (เผื่อหลุดจากการ Copy/Paste)
  const onlyNum = v.replace(/\D/g, '').slice(0, 1)
  const arr = digits.value.slice()
  arr[idx] = onlyNum
  pinModel.value = arr.join('').slice(0, 6)

  // ถ้าเป็นตัวเลข ให้เด้งไปช่องขวา
  if (onlyNum && idx < 5) {
    nextTick(() => {
      focusInput(idx + 1)
    })
  }
}

// 🛑 จัดการตอนกดคีย์บอร์ด (บล็อกตัวอักษร + ทำ Backspace)
const onKeyDown = (idx: number, e: KeyboardEvent) => {
  // 1. ถ้ากด Backspace และช่องปัจจุบันว่างอยู่ ให้ถอยหลังไป 1 ช่อง
  if (e.key === 'Backspace') {
    if (!digits.value[idx] && idx > 0) {
      focusInput(idx - 1)
    }
    return // ปล่อยให้ Backspace ทำงานลบตัวอักษรตามปกติ
  }

  // 2. อนุญาตให้กดปุ่มควบคุมพื้นฐานได้ (Tab, ลูกศรซ้ายขวา, Delete)
  const allowedKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'Delete']
  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
    return
  }

  // 3. ถ้าปุ่มที่กด "ไม่ใช่ตัวเลข 0-9" ให้บล็อกการพิมพ์ทิ้งทันที!
  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
  }
}

// ตรวจสอบข้อมูลตอนกดปุ่ม
const handleCheck = () => {
  const result = pinSchema.safeParse(pinModel.value)

  if (!result.success) {
    errorMessage.value = result.error.issues[0]?.message || 'รหัส PIN ไม่ถูกต้อง'
    return
  }

  if (import.meta.client) {
    console.log('✅ CHECK PIN SUCCESS:', result.data)
    // TODO: ยิง API ตรวจสอบ PIN ที่นี่
  }
}

const pinUI = {
  base: 'bg-white ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-emerald-300 text-center text-xl font-semibold',
  rounded: 'rounded-xl'
}
</script>