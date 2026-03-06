<!-- BorrowFormCard.vue -->
<template>
  <div class="space-y-4">
    <!-- วัตถุประสงค์ -->
    <div>
      <div class="mb-2 font-semibold">วัตถุประสงค์</div>
      <USelect
        v-model="modelPurpose"
        placeholder="-- เลือกวัตถุประสงค์ --"
        :items="purposeOptions"
        class="w-full"
        size="xl"
        :ui="selectUI(!!errors.purpose)"
        @update:model-value="onFieldChange('purpose')"
      />
      <div v-if="errors.purpose" class="mt-1 text-sm text-red-600">{{ errors.purpose }}</div>
    </div>

    <!-- อื่นๆ -->
    <div v-if="isOtherPurpose">
      <div class="mb-2 font-semibold">อธิบายเพิ่มเติม</div>
      <UTextarea v-model="modelNote" placeholder="ระบุคำอธิบายเพิ่มเติม..." size="xl" class="w-full" />
    </div>

    <!-- จำนวนผู้เรียน -->
    <div>
      <div class="mb-2 font-semibold">จำนวนผู้เรียน</div>
      <UFieldGroup class="w-full" size="xl">
        <UButton
          color="neutral"
          variant="subtle"
          icon="i-lucide:minus"
          class="px-4"
          :disabled="Number(modelQty || 1) <= 1"
          @click="setQtyClamp((Number(modelQty) || 1) - 1)"
        />
        <UInput
          v-model="qtyText"
          type="text"
          inputmode="numeric"
          color="neutral"
          variant="outline"
          placeholder="0"
          class="flex-1"
          :ui="qtyUI(!!errors.qty)"
          @beforeinput="onQtyBeforeInput"
          @input="onQtyInput"
          @blur="onQtyBlur"
        />
        <UButton
          color="neutral"
          variant="subtle"
          icon="i-lucide:plus"
          class="px-4"
          @click="setQtyClamp((Number(modelQty) || 0) + 1)"
        />
      </UFieldGroup>
      <div v-if="errors.qty" class="mt-1 text-sm text-red-600">{{ errors.qty }}</div>
    </div>

    <!-- ประเภทผู้รับสื่อ -->
    <div>
      <div class="mb-2 font-semibold">ประเภทผู้รับสื่อ</div>
      <USelect
        v-model="modelReceiverType"
        placeholder="-- เลือกประเภทผู้รับสื่อ --"
        :items="receiverTypeOptions"
        class="w-full"
        size="xl"
        :ui="selectUI(!!errors.receiverType)"
        @update:model-value="onFieldChange('receiverType')"
      />
      <div v-if="errors.receiverType" class="mt-1 text-sm text-red-600">{{ errors.receiverType }}</div>
    </div>

    <!-- กลุ่มเป้าหมาย -->
    <div>
      <div class="mb-2 font-semibold">กลุ่มเป้าหมาย</div>
      <USelect
        v-model="modelTarget"
        placeholder="-- เลือกกลุ่มเป้าหมาย --"
        :items="targetOptions"
        class="w-full"
        size="xl"
        :ui="selectUI(!!errors.target)"
        @update:model-value="onFieldChange('target')"
      />
      <div v-if="errors.target" class="mt-1 text-sm text-red-600">{{ errors.target }}</div>
    </div>

    <!-- ระบุสถานที่ -->
<div class="space-y-3">
  <div class="font-semibold">ระบุสถานที่</div>

  <!-- ชื่อสถานที่ -->
  <div class="space-y-2">
    <div>ชื่อสถานที่</div>
    <UInput
      v-model="placeName"
      class="w-full"
      :ui="inputUI(!!errors.placeName)"
      size="xl"
      @blur="onFieldBlur('placeName')"
      @input="onFieldChange('placeName')"
    />
    <div v-if="errors.placeName" class="text-sm text-red-600">{{ errors.placeName }}</div>
  </div>

  <div class="grid grid-cols-2 gap-6">
    <!-- ตำบล autocomplete -->
    <div class="space-y-2">
      <div>ตำบล/แขวง</div>
      <SubdistrictAutocomplete
        v-model="subdistrict"
        :has-error="!!errors.subdistrict"
        @select="onAddressSelect"
        @blur="onFieldBlur('subdistrict')"
      />
      <div v-if="errors.subdistrict" class="text-sm text-red-600">{{ errors.subdistrict }}</div>
    </div>

    <!-- อำเภอ -->
    <div class="space-y-2">
      <div>อำเภอ/เขต</div>
      <UInput
        v-model="district"
        class="w-full"
        :ui="inputUI(!!errors.district)"
        size="xl"
        
        @blur="onFieldBlur('district')"
        @input="onFieldChange('district')"
      />
      <div v-if="errors.district" class="text-sm text-red-600">{{ errors.district }}</div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-6">
    <!-- จังหวัด -->
    <div class="space-y-2">
      <div>จังหวัด</div>
      <UInput
        v-model="province"
        class="w-full"
        :ui="inputUI(!!errors.province)"
        size="xl"
        
        @blur="onFieldBlur('province')"
        @input="onFieldChange('province')"
      />
      <div v-if="errors.province" class="text-sm text-red-600">{{ errors.province }}</div>
    </div>

    <!-- รหัสไปรษณีย์ -->
    <div class="space-y-2">
      <div>รหัสไปรษณีย์</div>
      <UInput
        v-model="postalCode"
        inputmode="numeric"
        class="w-full"
        :ui="inputUI(!!errors.postalCode)"
        size="xl"
        
        @beforeinput="onPostalBeforeInput"
        @input="onFieldChange('postalCode')"
        @blur="onFieldBlur('postalCode')"
      />
      <div v-if="errors.postalCode" class="text-sm text-red-600">{{ errors.postalCode }}</div>
    </div>
  </div>
</div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'
import type { AddressEntry } from '~/composables/useThaiAddress'

type Opt = { label: string; value: string } | string

const props = defineProps<{
  purposeOptions: Opt[]
  receiverTypeOptions: Opt[]
  targetOptions: Opt[]
}>()

const MAX_QTY = 99999

const modelQty = defineModel<number>('qty', { required: true })
const modelPurpose = defineModel<any>('purpose', { default: '' })
const modelNote = defineModel<string>('note', { default: '' })
const modelReceiverType = defineModel<any>('receiverType', { required: true })
const modelTarget = defineModel<any>('target', { required: true })
const modelLocation = defineModel<string>('location', { required: true })

const placeName = ref('')
const subdistrict = ref('')
const district = ref('')
const province = ref('')
const postalCode = ref('')

/** ✅ เมื่อ autocomplete เลือกที่อยู่ */
const onAddressSelect = (item: AddressEntry) => {
  subdistrict.value = item.subdistrict
  district.value = item.district
  province.value = item.province
  postalCode.value = item.zipcode

  // clear errors ที่เกี่ยวข้อง
  delete errors.subdistrict
  delete errors.district
  delete errors.province
  delete errors.postalCode

  if (submitted.value) validate()
}

/** Purpose: อื่นๆ */
const isOtherPurpose = computed(() => {
  const v = modelPurpose.value
  const valueStr = String(v?.value ?? v ?? '')
  if (valueStr === 'อื่นๆ' || valueStr === 'other') return true
  const found = (props.purposeOptions || []).find(
    (o: any) => String(o?.value ?? o ?? '') === valueStr
  )
  const label = String((found as any)?.label ?? '')
  return label.replace(/\s+/g, '') === 'อื่นๆ'
})

watch(
  () => modelPurpose.value,
  () => { if (!isOtherPurpose.value) modelNote.value = '' }
)

/** Qty */
const qtyText = ref('')

const digitsOnly = (s: any) => String(s ?? '').replace(/[^\d]/g, '')
const toNumberOrZero = (s: string) => {
  const d = digitsOnly(s)
  return d ? Number(d) : 0
}
const fmtComma = (n: number) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US')

const syncQtyTextFromModel = () => {
  const n = Number(modelQty.value || 0)
  qtyText.value = n ? fmtComma(n) : ''
}
watch(() => modelQty.value, () => syncQtyTextFromModel(), { immediate: true })

const setQtyClamp = (n: number) => {
  const clamped = Math.min(MAX_QTY, Math.max(1, Math.trunc(Number(n) || 1)))
  modelQty.value = clamped
  qtyText.value = fmtComma(clamped)
  if (submitted.value) validate()
}

const onQtyBeforeInput = (e: InputEvent) => {
  const data = (e as any).data as string | null
  if (data && /[^\d]/.test(data)) e.preventDefault()
}

const onQtyInput = () => {
  const n = toNumberOrZero(qtyText.value)
  modelQty.value = n || 0
  qtyText.value = n ? fmtComma(n) : ''
  if (submitted.value) validate()
}

const onQtyBlur = () => {
  const n = toNumberOrZero(qtyText.value)
  const clamped = Math.min(MAX_QTY, Math.max(1, Math.trunc(n || 0)))
  modelQty.value = clamped
  qtyText.value = fmtComma(clamped)
  if (submitted.value) validate()
}

/** Postal digits only */
const onPostalBeforeInput = (e: InputEvent) => {
  const data = (e as any).data as string | null
  if (data && /[^\d]/.test(data)) e.preventDefault()
}

/** Location string */
watch(
  [placeName, subdistrict, district, province, postalCode],
  () => {
    const parts = [
      placeName.value?.trim(),
      subdistrict.value?.trim(),
      district.value?.trim(),
      province.value?.trim(),
      postalCode.value?.trim()
    ].filter(Boolean)
    modelLocation.value = parts.join(' ')
  },
  { immediate: true }
)

/** Validation */
const requiredMsgSelect = 'ต้องเลือก'
const requiredMsgInput = 'ต้องกรอก'
const normalizeSelect = (v: any) => String(v?.value ?? v ?? '').trim()

const Schema = z.object({
  purpose: z.string().min(1, { message: requiredMsgSelect }),
  receiverType: z.string().min(1, { message: requiredMsgSelect }),
  target: z.string().min(1, { message: requiredMsgSelect }),
  qty: z
    .number()
    .min(1, { message: requiredMsgInput })
    .max(MAX_QTY, { message: `ต้องไม่เกิน ${MAX_QTY.toLocaleString()}` }),
  placeName: z.string().trim().min(1, { message: requiredMsgInput }),
  subdistrict: z.string().trim().min(1, { message: requiredMsgInput }),
  district: z.string().trim().min(1, { message: requiredMsgInput }),
  province: z.string().trim().min(1, { message: requiredMsgInput }),
  postalCode: z
    .string()
    .trim()
    .min(1, { message: requiredMsgInput })
    .regex(/^\d+$/, { message: 'ต้องเป็นตัวเลขเท่านั้น' })
})

type ErrMap = Partial<Record<keyof z.infer<typeof Schema>, string>>
const errors = reactive<ErrMap>({})
const submitted = ref(false)

const clearError = (key: keyof ErrMap) => { delete errors[key] }

const onFieldChange = (key: keyof ErrMap) => {
  if (!submitted.value) return
  clearError(key)
  validate()
}

const onFieldBlur = (key: keyof ErrMap) => {
  if (!submitted.value) return
  clearError(key)
  validate()
}

const validate = () => {
  submitted.value = true

  const rawQty = toNumberOrZero(qtyText.value)
  const clampedQty = Math.min(MAX_QTY, Math.max(1, Math.trunc(rawQty || 0)))
  modelQty.value = clampedQty
  qtyText.value = fmtComma(clampedQty)

  Object.keys(errors).forEach((k) => delete (errors as any)[k])

  const payload = {
    purpose: normalizeSelect(modelPurpose.value),
    receiverType: normalizeSelect(modelReceiverType.value),
    target: normalizeSelect(modelTarget.value),
    qty: clampedQty,
    placeName: placeName.value,
    subdistrict: subdistrict.value,
    district: district.value,
    province: province.value,
    postalCode: postalCode.value
  }

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

/** UI helpers */
const selectUI = (hasError: boolean) =>
  hasError
    ? { base: 'ring-2 ring-red-500 focus-visible:ring-2 focus-visible:ring-red-500' }
    : {}

const qtyUI = (hasError: boolean) =>
  hasError
    ? {
        base: 'text-center ring-2 ring-red-500 focus-within:ring-2 focus-within:ring-red-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
      }
    : {
        base: 'text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
      }

const inputUI = (hasError: boolean) =>
  hasError
    ? {
        base: 'bg-white ring-2 ring-red-500 focus-within:ring-2 focus-within:ring-red-500',
        rounded: 'rounded-xl'
      }
    : {
        base: 'bg-white ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-sky-300',
        rounded: 'rounded-xl'
      }
</script>