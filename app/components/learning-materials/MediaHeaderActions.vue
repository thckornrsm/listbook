<script setup lang="ts">
const emit = defineEmits<{
  (e: 'export'): void
  (e: 'create'): void
}>()
</script>

<template>
  <div class="flex gap-2">
    <UButton
      icon="i-heroicons-arrow-down-tray"
      color="neutral"
      variant="solid"
      label="Export Excel"
      class="h-9 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-normal text-sm"
      @click="emit('export')"
    />
    <UButton
      icon="i-heroicons-plus"
      color="orange"
      variant="solid"
      label="เพิ่มสื่อใหม่"
      class="h-9 px-3 bg-orange-500 hover:bg-orange-600 font-normal text-sm text-white"
      @click="emit('create')"
    />
  </div>
</template>
