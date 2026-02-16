<template>
  <UCard
    class="bg-white shadow-sm"
    :ui="{
      root: 'rounded-2xl',
      body: 'relative p-0'  // ✅ ตัด padding ของ UCard ออก
    }"
  >
    <!-- เส้นกลางยาวเต็มการ์ด -->
    <div class="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-200" />

    <!-- เนื้อหา (ค่อยใส่ padding ที่นี่แทน) -->
    <div class="relative z-10 px-4 py-4">
      <div class="grid grid-cols-2">
        <div class=" pr-4">
          <div class="text-sm font-medium text-slate-700">วันที่ยืม</div>
          <div class="mt-1 text-base font-extrabold text-slate-900">{{ borrowDate }}</div>
        </div>

        <div class="pl-4 text-right">
          <div class="text-sm font-medium text-slate-700">กำหนดคืน</div>
          <div class="mt-1 text-base font-extrabold text-[#ED7E24]">{{ dueText }}</div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  borrowDate: string
  dueText: string
}>()
</script>
