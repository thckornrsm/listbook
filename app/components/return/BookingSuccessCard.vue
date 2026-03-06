<template>
  <UCard :ui="{ root: 'rounded-2xl',  body: 'p-5'}" class="bg-white shadow-sm">
    <!-- Icon (แบบรูป 2 ใช้ SuccessBadge อย่างเดียว) -->
    <div class="flex justify-center">
      <SuccessBadge src="/icons/check-circle.svg" />
    </div>

    <!-- Title -->
    <div class="mt-6 text-center text-xl font-semibold text-[#0B8D6E]">
      {{ title }}
    </div>

    <!-- Rows -->
    <div class="mt-5 divide-y divide-dashed divide-slate-200 text-sm">
      <BookingDetailRow
        v-for="(r, i) in rows"
        :key="i"
        :label="r.label"
        :value="r.value"
      />
    </div>

    <!-- Note -->
    <div
      v-if="note"
      class="mt-4 min-h-[50px] rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-slate-700 flex items-start"
    >
      {{ note }}
    </div>

    <!-- Button -->
    <div class="mt-5">
      <UButton
        block
        size="xl"
        class="h-14 rounded-2xl bg-[#0B8D6E]text-lg  text-white hover:bg-[#0B8D6E]/90"
        @click="$emit('done')"
      >
        {{ buttonText || 'เสร็จสิ้น' }}
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import BookingDetailRow from './BookingDetailRow.vue'
import SuccessBadge from './SuccessBadge.vue'

defineProps<{
  title: string
  rows: { label: string; value: string }[]
  note?: string
  buttonText?: string
}>()

defineEmits<{ (e: 'done'): void }>()
</script>
