<template>
  <div class="pb-10 pt-2">
    <SlideToConfirm
      :loading="loading"
      :disabled="disabled"
      text="สไลด์เพื่อยืนยันการยืม"
      @submit="emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import SlideToConfirm from './SlideToConfirm.vue'

const props = defineProps<{
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const { loading, disabled } = toRefs(props)
</script>
