<template>
  <UCard :ui="{ root: 'rounded-2xl' }" class="bg-white">
    <div class="text-sm font-semibold text-slate-900">หมายเหตุ</div>
    <UTextarea
      v-model="modelRemark"
      :rows="3"
      placeholder="กรอกหมายเหตุ..."
      size="xl"
      class="mt-3 w-full"
      :ui="softFieldUI"
    />
  </UCard>
</template>

<script setup lang="ts">
const modelRemark = defineModel<string>('remark', { required: true })

const softFieldUI = {
  base: 'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/40',
  rounded: 'rounded-2xl'
}
</script>
