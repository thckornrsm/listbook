<template>
  <div class="pb-6 pt-2">
    <UButton
      block
      size="xl"
      class="h-14 rounded-2xl bg-[#ED7E24] text-lg font-semibold text-white hover:bg-[#ED7E24]/90 active:scale-[0.99]"
      :disabled="disabled"
      @click="emit('submit')"
    >
      ยืนยันข้อมูล
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ (e: 'submit'): void }>()
</script>
