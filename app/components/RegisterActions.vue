<template>
  <div class="space-y-3">
    <button
      type="button"
      class="w-full rounded-xl bg-orange-500 py-4 text-lg font-semibold text-white shadow-sm active:scale-[0.99]"
      @click="$emit('register')"
    >
      ลงทะเบียนใหม่
    </button>

    <button
      type="button"
      class="w-full rounded-xl bg-orange-50 py-4 text-lg font-semibold text-slate-900 active:scale-[0.99]"
      @click="$emit('already')"
    >
      เคยลงทะเบียนแล้ว
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'register'): void
  (e: 'already'): void
}>()
</script>
