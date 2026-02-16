<template>
  <div class="pb-10 pt-2">
    <div
      class="relative h-16 w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 touch-none select-none"
  :class="disabled || loading ? 'opacity-60' : ''"
    >
      <!-- text -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span class="text-base font-semibold text-slate-600">
          {{ done ? successText : text }}
        </span>
      </div>

      <!-- progress fill -->
      <div
        class="absolute left-0 top-0 h-full bg-[#ED7E24]/10"
        :style="{ width: `${Math.min(100, (x / maxX) * 100)}%` }"
      />

      <!-- draggable knob -->
      <button
        ref="knob"
  type="button"
  class="absolute left-1 top-1 grid h-14 w-14 place-items-center rounded-2xl bg-[#ED7E24] shadow-md
         touch-none select-none will-change-transform"
  :style="{ transform: `translateX(${x}px)` }"
        :disabled="disabled || loading || done"
        aria-label="Slide to confirm"
        @pointerdown="onDown"
      >
        <UIcon name="i-lucide-arrow-right" class="h-6 w-6 text-white" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text?: string
  successText?: string
  loading?: boolean
  disabled?: boolean
  // ระยะที่ต้องลากให้ผ่าน (0-1)
  threshold?: number
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const text = computed(() => props.text ?? 'สไลด์เพื่อยืนยันการยืม')
const successText = computed(() => props.successText ?? 'ยืนยันแล้ว')

const threshold = computed(() => props.threshold ?? 0.9)

const knob = ref<HTMLButtonElement | null>(null)
const dragging = ref(false)
const startClientX = ref(0)
const startX = ref(0)
const x = ref(0)
const maxX = ref(0)
const done = ref(false)

const measure = () => {
  const root = knob.value?.parentElement
  if (!root || !knob.value) return
  const rootW = root.clientWidth
  const knobW = knob.value.clientWidth
  // left-1 / top-1 → เว้นขอบ 4px ทั้ง 2 ฝั่ง (Tailwind: 0.25rem)
  maxX.value = Math.max(0, rootW - knobW - 8)
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))

const onDown = (e: PointerEvent) => {
  if (props.disabled || props.loading || done.value) return
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


const reset = () => {
  x.value = 0
}

const onUp = () => {
  dragging.value = false
  window.removeEventListener('pointermove', onMove)

  const ratio = maxX.value === 0 ? 0 : x.value / maxX.value
  if (ratio >= threshold.value) {
    x.value = maxX.value
    done.value = true
    emit('submit')
    // ถ้าต้องการให้กลับมาใช้งานได้อีกอัตโนมัติ เปิดบล็อกนี้
    // setTimeout(() => { done.value = false; reset() }, 1200)
  } else {
    reset()
  }
}
</script>
