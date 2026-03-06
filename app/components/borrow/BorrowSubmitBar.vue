<!-- BorrowSubmitBar.vue -->
<template>
  <div class="pb-10 pt-2">
    <SlideToConfirm
      :loading="loading"
      :disabled="disabled"
      :text="slideText"
      @submit="onSlideSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import SlideToConfirm from './SlideToConfirm.vue'

type Mode = 'borrow' | 'request' | 'return' | string
type Role = 'user' | 'staff' | string

const props = withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    mode?: Mode
    role?: Role
    text?: string
  }>(),
  {
    mode: 'borrow',
    role: 'user'
  }
)

// ✅ เปลี่ยน emit ให้ส่ง callback done
const emit = defineEmits<{
  (e: 'submit', done: (ok: boolean) => void): void
}>()

const { loading, disabled } = toRefs(props)

const slideText = computed(() => {
  if (props.text) return props.text
  if (props.mode === 'request') return 'สไลด์เพื่อยืนยันการขอ'
  if (props.mode === 'return') return 'สไลด์เพื่อยืนยันการคืนสื่อ'
  return 'สไลด์เพื่อยืนยันการยืม'
})

const onSlideSubmit = (done: (ok: boolean) => void) => {
  emit('submit', done)
}
</script>