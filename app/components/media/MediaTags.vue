<template>
  <div class="mt-4 flex flex-wrap gap-2">
    <span
      v-for="t in tags"
      :key="t"
      class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600"
    >
      {{ t }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ tags: string[] }>()
</script>
