<template>
  <div class="sticky top-0 z-20 flex h-14 items-center bg-[#ED7E24] px-4 text-white">
    <button
      type="button"
      class="mr-3 grid h-10 w-10 place-items-center rounded-full active:opacity-90"
      @click="$router.back()"
      aria-label="Back"
    >
      <span class="text-2xl leading-none">‹</span>
    </button>

    <div class="flex-1 truncate text-base font-semibold">
      {{ title }}
    </div>

    <button
      type="button"
      class="ml-3 grid h-10 w-10 place-items-center rounded-full active:opacity-90"
      aria-label="Favorite"
      @click="$emit('toggle-fav')"
    >
      <span class="text-2xl leading-none">♡</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
defineEmits<{ (e: 'toggle-fav'): void }>()
</script>
