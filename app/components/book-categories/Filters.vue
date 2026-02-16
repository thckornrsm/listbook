<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'all' // ค่าเริ่มต้น: ไม่กรอง
  }
})

const emit = defineEmits(['update:modelValue'])

/**
 * items ของ USelectMenu
 * - ใส่ label / separator ได้
 * - ค่าที่เลือกจะเป็น string: 'all' | 'active' | 'inactive'
 */
const items = ref([
  { type: 'label', label: 'Filter by status' },
  'all',
  { type: 'separator' },
  { type: 'label', label: 'Status' },
  'active',
  'inactive'
])

const valueProxy = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

// ทำให้ dropdown แสดงคำสวยขึ้น (all -> All)
const display = (v) => {
  if (v === 'all') return 'All'
  if (v === 'active') return 'Active'
  if (v === 'inactive') return 'Inactive'
  return v
}
</script>

<template>
  <USelectMenu
    v-model="valueProxy"
    :items="items"
    class="w-48"
  >
    <!-- ปรับข้อความที่แสดงบนปุ่ม -->
    <template #label>
      {{ display(valueProxy) }}
    </template>
  </USelectMenu>
</template>
