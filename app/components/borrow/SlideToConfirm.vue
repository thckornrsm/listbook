<!-- SlideToConfirm.vue -->
<template>
  <div class="pb-10 pt-2">
    <div
      class="relative h-16 w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 touch-none select-none"
      :class="(disabled || loading || pending) ? 'opacity-60' : ''"
    >
      <div class="pointer-events-none absolute inset-0 flex items-center px-18">
        <span class="text-base text-slate-600">
          {{ done ? successText : text }}
        </span>
      </div>

      <div
        class="absolute left-0 top-0 h-full bg-[#ED7E24]/10"
        :style="{ width: `${Math.min(100, (x / maxX) * 100)}%` }"
      />

      <button
        ref="knob"
        type="button"
        class="absolute left-1 top-1 grid h-14 w-14 place-items-center rounded-2xl bg-[#ED7E24] shadow-md
               touch-none select-none will-change-transform transition-transform"
        :style="{ transform: `translateX(${x}px)` }"
        :disabled="disabled || loading || pending || done"
        aria-label="Slide to confirm"
        @pointerdown="onDown"
      >
        <UIcon name="i-lucide-arrow-right" class="h-6 w-6 text-white" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  text?: string
  successText?: string
  loading?: boolean
  disabled?: boolean
  threshold?: number
}>()

// ✅ ส่ง callback ให้ parent ตอบกลับว่า ok ไหม
const emit = defineEmits<{
  (e: 'submit', done: (ok: boolean) => void): void
}>()

const text = computed(() => props.text ?? 'สไลด์เพื่อยืนยันการคืน')
const successText = computed(() => props.successText ?? 'ยืนยันแล้ว')
const threshold = computed(() => props.threshold ?? 0.9)

const knob = ref<HTMLButtonElement | null>(null)
const dragging = ref(false)
const startClientX = ref(0)
const startX = ref(0)
const x = ref(0)
const maxX = ref(0)
const done = ref(false)
const pending = ref(false)

const measure = () => {
  const root = knob.value?.parentElement
  if (!root || !knob.value) return
  maxX.value = Math.max(0, root.clientWidth - knob.value.clientWidth - 8)
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))

const reset = () => {
  x.value = 0
}

const onDown = (e: PointerEvent) => {
  if (props.disabled || props.loading || pending.value || done.value) return
  e.preventDefault()
  measure()
  dragging.value = true
  startClientX.value = e.clientX
  startX.value = x.value
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  window.addEventListener('pointermove', onMove, { passive: false })
  window.addEventListener('pointerup', onUp, { once: true })
}

const onMove = (e: PointerEvent) => {
  if (!dragging.value) return
  e.preventDefault()
  const delta = e.clientX - startClientX.value
  x.value = Math.min(maxX.value, Math.max(0, startX.value + delta))
}

const onUp = () => {
  dragging.value = false
  window.removeEventListener('pointermove', onMove)

  const ratio = maxX.value === 0 ? 0 : x.value / maxX.value
  if (ratio >= threshold.value) {
    x.value = maxX.value
    pending.value = true

    emit('submit', (ok: boolean) => {
      pending.value = false
      if (ok) {
        done.value = true
      } else {
        done.value = false
        reset()
      }
    })
  } else {
    reset()
  }
}
</script>