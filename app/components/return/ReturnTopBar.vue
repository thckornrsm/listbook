<template>
  <div class="fixed inset-x-0 top-0 z-50 flex h-14 items-center bg-[#ED7E24] px-4 text-white">
    <UButton
      variant="ghost"
      color="neutral"
      class="mr-2 h-10 w-10 rounded-full text-white hover:bg-white/10"
      @click="emit('back')"
      aria-label="Back"
    >
      <span class="text-2xl leading-none">‹</span>
    </UButton>

    <div class="flex-1 text-center text-base font-semibold">
      {{ title }}
    </div>

    <div class="h-10 w-10" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
const emit = defineEmits<{ (e: 'back'): void }>()
</script>