<!-- components/Pagination.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
  }>(),
  { currentPage: 1, totalPages: 1 }
)

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const canPrev = computed(() => props.currentPage > 1)
const canNext = computed(() => props.currentPage < props.totalPages)

const go = (p: number) => {
  if (p < 1 || p > props.totalPages) return
  emit('page-change', p)
}

const pages = computed<(number | '...')[]>(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 10) return Array.from({ length: total }, (_, i) => i + 1)

  const res: (number | '...')[] = []
  const push = (x: number | '...') => res.push(x)

  push(1)

  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)

  if (left > 2) push('...')

  for (let i = left; i <= right; i++) push(i)

  if (right < total - 1) push('...')

  push(total)
  return res
})
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- First -->
    <button
      class="h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-700
             hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
      :disabled="!canPrev"
      @click="go(1)"
      aria-label="First page"
      title="First"
    >
      «
    </button>

    <!-- Prev -->
    <button
      class="h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-700
             hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
      :disabled="!canPrev"
      @click="go(currentPage - 1)"
      aria-label="Previous page"
      title="Previous"
    >
      ‹
    </button>

    <!-- Pages -->
    <template v-for="(p, idx) in pages" :key="`${p}-${idx}`">
      <span
        v-if="p === '...'"
        class="mx-1 select-none text-slate-400 text-sm"
      >
        …
      </span>

      <button
        v-else
        class="h-7 min-w-7 rounded-md border text-sm
               px-2.5
               hover:bg-slate-50"
        :class="p === currentPage
          ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-500'
          : 'border-slate-200 bg-white text-slate-700'"
        @click="go(p)"
        :aria-label="`Page ${p}`"
      >
        {{ p }}
      </button>
    </template>

    <!-- Next -->
    <button
      class="h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-700
             hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
      :disabled="!canNext"
      @click="go(currentPage + 1)"
      aria-label="Next page"
      title="Next"
    >
      ›
    </button>

    <!-- Last -->
    <button
      class="h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-700
             hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
      :disabled="!canNext"
      @click="go(totalPages)"
      aria-label="Last page"
      title="Last"
    >
      »
    </button>
  </div>
</template>
