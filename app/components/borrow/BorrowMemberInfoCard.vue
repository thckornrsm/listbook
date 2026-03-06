<!-- BorrowMemberInfoCard.vue -->
<template>
  <div class="space-y-4">
    <div class="text-base font-semibold ">
      ยืมสื่อการเรียนรู้ (เจ้าหน้าที่ทำรายการแทน)
    </div>

    <!-- ชื่อ-นามสกุล -->
    <div class="space-y-2">
      <div class="text-base  ">
        ชื่อจริงนามสกุลจริงของสมาชิก
      </div>
      <UInput
        v-model="modelName"
        size="xl"
        placeholder="กรอกชื่อ-นามสกุลสมาชิก"
        class="w-full"
        :ui="inputUI(!!errors.memberName)"
        @input="onFieldChange('memberName')"
        @blur="onFieldBlur('memberName')"
      />
      <div v-if="errors.memberName" class="text-sm text-red-600">{{ errors.memberName }}</div>
    </div>

    <!-- เบอร์โทร -->
    <div class="space-y-2">
      <div class="text-base  ">
        เบอร์โทรศัพท์ที่ติดต่อได้ของสมาชิก
      </div>
      <UInput
        v-model="modelPhone"
        size="xl"
        inputmode="numeric"
        placeholder="กรอกเบอร์โทรศัพท์ (เช่น 08xxxxxxxx)"
        class="w-full"
        :ui="inputUI(!!errors.memberPhone)"
        @keydown="onlyNumberKey"
        @input="onFieldChange('memberPhone')"
        @blur="onFieldBlur('memberPhone')"
      />
      <div v-if="errors.memberPhone" class="text-sm text-red-600">{{ errors.memberPhone }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'

const modelName = defineModel<string>('memberName', { default: '' })
const modelPhone = defineModel<string>('memberPhone', { default: '' })

const onlyNumberKey = (e: KeyboardEvent) => {
  const allow = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
  if (allow.includes(e.key)) return
  if (!/^\d$/.test(e.key)) e.preventDefault()
}

/** ✅ Zod */
const Schema = z.object({
  memberName: z.string().trim().min(1, { message: 'ต้องกรอกชื่อสมาชิก' }),
  memberPhone: z
    .string()
    .trim()
    .min(1, { message: 'ต้องกรอกเบอร์โทรสมาชิก' })
    .regex(/^\d+$/, { message: 'ต้องเป็นตัวเลขเท่านั้น' })
    .regex(/^0\d{9}$/, { message: 'ต้องเป็นเบอร์โทร 10 หลัก' })
})

type ErrMap = Partial<Record<keyof z.infer<typeof Schema>, string>>
const errors = reactive<ErrMap>({})
const submitted = ref(false)

const clearError = (k: keyof ErrMap) => {
  delete errors[k]
}

const onFieldChange = (k: keyof ErrMap) => {
  if (!submitted.value) return
  clearError(k)
  validate()
}
const onFieldBlur = (k: keyof ErrMap) => {
  if (!submitted.value) return
  clearError(k)
  validate()
}

const validate = () => {
  submitted.value = true
  Object.keys(errors).forEach((k) => delete (errors as any)[k])

  const payload = { memberName: modelName.value, memberPhone: modelPhone.value }
  const res = Schema.safeParse(payload)

  if (!res.success) {
    for (const issue of res.error.issues) {
      const key = issue.path[0] as keyof ErrMap
      if (key && !errors[key]) errors[key] = issue.message
    }
    return { ok: false, errors }
  }

  return { ok: true }
}

defineExpose({ validate })

const inputUI = (hasError: boolean) => ({
  base: hasError
    ? 'bg-white ring-2 ring-red-500 focus-within:ring-2 focus-within:ring-red-500'
    : 'bg-white ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
})
</script>