<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineOptions({ inheritAttrs: false })

type Opt = { label: string; value: string }

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  options: Opt[]
  heightClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const open = ref(false)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found?.label || (props.placeholder ?? '-- เลือก --')
})

const pick = (v: string) => {
  emit('update:modelValue', v)
  open.value = false
}

const items = computed<DropdownMenuItem[]>(() =>
  props.options.map(o => ({
    label: o.label,
    // ✅ รองรับทั้ง 2 แบบ (ต่างเวอร์ชันใช้ไม่เหมือนกัน)
    click: () => pick(o.value),
    onSelect: () => pick(o.value)
  }))
)

const triggerClass = computed(() => {
  const h = props.heightClass ?? 'h-14'
  return [
    'w-full', h,
    'rounded-2xl',
    'bg-white',
    'ring-1 ring-slate-200',
    'justify-between',
    'px-4',
    'text-left',
    'hover:bg-white',
    'active:bg-white'
  ].join(' ')
})
</script>

<template>
  <div v-bind="$attrs">
    <div v-if="label" class="mb-2 text-sm font-semibold text-slate-900">
      {{ label }}
    </div>

    <UDropdownMenu
      v-model:open="open"
      :items="items"
      :ui="{ content: 'w-[calc(100vw-2rem)] max-w-md z-[999999]' }"
    >
      <UButton variant="outline" color="gray" :class="triggerClass">
        <span :class="props.modelValue ? 'text-slate-900 font-semi' : 'text-slate-500 font-normal'">
          {{ selectedLabel }}
        </span>
        <UIcon class="text-slate-500" name="i-heroicons-chevron-down" />
      </UButton>
    </UDropdownMenu>
  </div>
</template>
