<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineOptions({ inheritAttrs: false })

type Opt = { label: string; value: string }

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  options: Opt[]
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean // ✅ เพิ่ม: ให้ dropdown กว้างเท่าปุ่ม
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const selectedLabel = computed(() => {
  const found = props.options.find((o) => o.value === props.modelValue)
  return found?.label || (props.placeholder ?? '-- เลือก --')
})

const pick = (v: string) => {
  emit('update:modelValue', v)
}

const items = computed<DropdownMenuItem[][]>(() => [
  props.options.map((o) => ({
    label: o.label,
    // รองรับต่างเวอร์ชันของ Nuxt UI
    onSelect: () => pick(o.value),
    click: () => pick(o.value)
  }))
])

// ✅ content width: ถ้า fullWidth=true ให้กว้างเท่าปุ่ม
const contentClass = computed(() => {
  if (props.fullWidth) {
    // อันนี้จะพยายามทำให้กว้างเท่า trigger
    // ถ้าเวอร์ชันคุณรองรับตัวแปร anchor width จะเนียนมาก
    return 'w-full min-w-[var(--reka-popper-anchor-width)]'
  }
  // ค่าแบบ docs
  return 'w-48'
})
</script>

<template>
  <div v-bind="$attrs" class="w-full">
    <div v-if="label" class="mb-2  font-semibold ">
      {{ label }}
    </div>

    <UDropdownMenu
      :items="items"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8
      }"
      size="xl"
      :ui="{
        // ✅ ปล่อยกรอบ/สไตล์เป็น default ของ Nuxt UI
        // เราคุมแค่ “ความกว้าง” ของกล่อง dropdown
        content: contentClass
      }"
    >
      <!-- ✅ Trigger ใช้ default Nuxt UI (เหมือน docs) -->
      <UButton
        :label="selectedLabel"
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-chevron-down"
       
        class="w-full justify-between"
      />
    </UDropdownMenu>
  </div>
</template>