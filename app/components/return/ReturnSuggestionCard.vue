<template>
  
    <div class="space-y-4">
      <div class="text-base font-semibold ">ข้อเสนอเพิ่มเติม</div>

      <UTextarea
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        placeholder="เขียนข้อเสนอเพิ่มเติม..."
       
        class="w-full"
        size="xl"
      />
    </div>
  
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()
</script>