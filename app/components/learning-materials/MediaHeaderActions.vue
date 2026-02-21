<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    exportLabel?: string
    createLabel?: string
    exportIcon?: string
    createIcon?: string
  }>(),
  {
    exportLabel: 'นำข้อมูลออก',
    createLabel: 'เพิ่มรายการ',
    exportIcon: 'i-heroicons-arrow-down-tray',
    createIcon: 'i-heroicons-plus'
  }
)

const emit = defineEmits<{
  (e: 'export'): void
  (e: 'create'): void
}>()
</script>

<template>
  <div class="flex gap-2">
    <UButton
      :icon="props.exportIcon"
      color="neutral"
      variant="solid"
      :label="props.exportLabel"
      class="h-9 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 font-normal text-sm"
      @click="emit('export')"
    />

    <UButton
      :icon="props.createIcon"
      color="orange"
      variant="solid"
      :label="props.createLabel"
      class="h-9 px-3 bg-[#ED7E24] hover:bg-[#F4A23A] font-normal text-sm text-white"
      @click="emit('create')"
    />
  </div>
</template>
