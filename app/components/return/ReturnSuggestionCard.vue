<template>
  <UCard :ui="{ root: 'rounded-2xl', body: { base: 'p-4' } }" class="bg-white shadow-sm">
    <div class="text-sm font-semibold text-slate-900">ข้อเสนอเพิ่มเติม</div>

    <UTextarea
      v-model="model"
      :rows="4"
      placeholder="เขียนข้อเสนอเพิ่มเติม..."
      class="mt-3 w-full"
      :ui="softFieldUI"
    />
  </UCard>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const softFieldUI = {
  base:
    'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/30',
  rounded: 'rounded-2xl'
}
</script>
