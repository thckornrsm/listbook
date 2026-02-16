<template>
  <header class="sticky top-0 z-20 h-14 bg-[#ED7E24] text-white">
    <div class="mx-auto flex h-14 w-full max-w-md items-center px-4">
      <UButton
        variant="ghost"
        color="white"
        class="h-10 w-10 rounded-full text-white hover:bg-white/15"
        icon="i-heroicons-chevron-left"
        @click="onBack"
      />
      <div class="flex-1 text-center text-base font-semibold">
        {{ title }}
      </div>
      <div class="h-10 w-10" />
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const onBack = () => emit('back')
</script>
