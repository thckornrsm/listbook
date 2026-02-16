<template>
  <UCard :ui="{ root: 'rounded-2xl' }" class="bg-white">
    <div class="space-y-4">
      <div>
        <SelectDropdown
            v-model="modelPurpose"
            label="วัตถุประสงค์"
            placeholder="-- เลือกวัตถุประสงค์ --"
            :options="props.purposeOptions"
            
        />
      </div>

      <div>
        <div class="mb-2 text-sm font-semibold text-slate-900">อธิบายเพิ่มเติม</div>
        <UTextarea
          v-model="modelNote"
          :rows="4"
          placeholder="กรอกคำอธิบายเพิ่มเติม..."
          size="xl"
          class="w-full"
          :ui="softFieldUI"
        />
      </div>

      <div>
        <div class="mb-2 text-sm font-semibold text-slate-900">จำนวนผู้เรียน</div>
        <div class="flex items-center justify-between rounded-2xl bg-slate-200 p-2">
          <UButton
            variant="outline"
            color="gray"
            class="justify-center h-12 w-12 rounded-xl border-slate-200 bg-white text-xl font-bold"
            :disabled="modelQty <= 1"
            @click="modelQty = Math.max(1, modelQty - 1)"
          >
            <span class="text-2xl font-bold text-black">–</span>
          </UButton>

          <div class="text-base font-semibold text-slate-900">{{ modelQty }}</div>

          <UButton
            variant="solid"
            class="justify-center h-12 w-12 rounded-xl bg-white hover:bg-[#ED7E24]/90"
            @click="modelQty = modelQty + 1"
          >
            <span class="text-2xl font-bold text-black">+</span>
          </UButton>
        </div>
      </div>

      <div>
        <SelectDropdown
          v-model="modelReceiverType"
          label="ประเภทผู้รับสื่อ"
          placeholder="-- เลือกประเภทผู้รับสื่อ --"
          :options="props.receiverTypeOptions"
        />
      </div>

      <div>
        <SelectDropdown
          v-model="modelTarget"
          label="กลุ่มเป้าหมาย"
          placeholder="-- เลือกกลุ่มเป้าหมาย --"
          :options="props.targetOptions"
        />
      </div>

      <div>
        <div class="mb-2 text-sm font-semibold text-slate-900">ระบุสถานที่</div>
        <UInput
          v-model="modelLocation"
          readonly
          size="xl"
          class="w-full"
          :ui="softFieldUI"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import SelectDropdown from './SelectDropdown.vue'

type Opt = { label: string; value: string }

const props = defineProps<{
  purposeOptions: Opt[]
  receiverTypeOptions: Opt[]
  targetOptions: Opt[]
}>()

const modelQty = defineModel<number>('qty', { required: true })
const modelPurpose = defineModel<string>('purpose', { default: '' })
const modelNote = defineModel<string>('note', { required: true })
const modelReceiverType = defineModel<string>('receiverType', { required: true })
const modelTarget = defineModel<string>('target', { required: true })
const modelLocation = defineModel<string>('location', { required: true })
    

const softFieldUI = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
}


</script>
