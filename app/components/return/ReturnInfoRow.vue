<template>
  <div class="flex items-start justify-between gap-4 py-3">
    <div class=" text-slate-700">{{ label }}</div>
    <div class="max-w-[60%] text-right  text-slate-900">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>
