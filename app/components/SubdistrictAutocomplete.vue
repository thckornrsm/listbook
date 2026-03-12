<!-- components/SubdistrictAutocomplete.vue -->
<template>
  <div class="relative">
    <UInput
      v-model="query"
      :placeholder="placeholder ?? 'พิมพ์ตำบล/แขวง'"
      size="xl"
      :ui="inputUI"
      autocomplete="off"
      @update:model-value="onInput"
      @blur="onBlur"
      @keydown.down.prevent="moveDown"
      @keydown.up.prevent="moveUp"
      @keydown.enter.prevent="selectHighlighted"
      @keydown.escape="close"
    />

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="showDropdown && query.length >= 2"
        class="absolute z-50 min-w-full w-max max-w-[360px] mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
      >
        <ul
          v-if="suggestions.length > 0"
          class="max-h-60 overflow-y-auto overflow-x-hidden py-1"
        >
          <li
            v-for="(item, i) in suggestions"
            :key="`${item.subdistrict}-${item.district}-${item.province}-${item.zipcode}-${i}`"
            class="px-4 py-3 cursor-pointer text-sm transition-colors select-none"
            :class="
              i === highlightedIndex
                ? 'bg-sky-50 text-sky-700'
                : 'hover:bg-slate-50 text-slate-700'
            "
            @mousedown.prevent="selectItem(item)"
          >
            <div
              class="font-semibold text-slate-800"
              v-html="highlight(item.subdistrict)"
            />
            <div class="text-xs text-slate-400 mt-0.5">
              {{ item.district }} · {{ item.province }}{{ item.zipcode ? ` · ${item.zipcode}` : '' }}
            </div>
          </li>
        </ul>

        <div v-else class="px-4 py-3 text-sm text-slate-400 text-center">
          ไม่พบตำบล/แขวง "<span class="font-medium text-slate-500">{{ query }}</span>"
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThaiAddress, type AddressEntry } from '~/composables/useThaiAddress'

const props = defineProps<{
  modelValue: string
  hasError?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [item: AddressEntry]
  blur: []
}>()

const { searchBySubdistrict } = await useThaiAddress()

const query = ref(props.modelValue ?? '')
const suggestions = ref<AddressEntry[]>([])
const showDropdown = ref(false)
const highlightedIndex = ref(-1)

watch(
  () => props.modelValue,
  (val) => {
    if (val !== query.value) query.value = val ?? ''
  }
)

const inputUI = computed(() =>
  props.hasError
    ? {
        base: 'bg-white ring-2 ring-red-500 focus-within:ring-2 focus-within:ring-red-500',
        rounded: 'rounded-xl'
      }
    : {
        base: 'bg-white ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-sky-300',
        rounded: 'rounded-xl'
      }
)

const highlight = (text: string) => {
  if (!query.value) return text
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="bg-yellow-100 text-yellow-800 rounded px-0.5">$1</mark>'
  )
}

const onInput = (val: string) => {
  query.value = val
  emit('update:modelValue', val)
  suggestions.value = searchBySubdistrict(val)
  showDropdown.value = true
  highlightedIndex.value = -1
}

const selectItem = (item: AddressEntry) => {
  query.value = item.subdistrict
  emit('update:modelValue', item.subdistrict)
  emit('select', item)
  close()
}

const selectHighlighted = () => {
  const item = suggestions.value[highlightedIndex.value]
  if (highlightedIndex.value >= 0 && item) {
    selectItem(item)
  }
}

const moveDown = () => {
  if (!showDropdown.value) {
    showDropdown.value = true
    return
  }
  if (highlightedIndex.value < suggestions.value.length - 1) {
    highlightedIndex.value++
  }
}

const moveUp = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

const close = () => {
  showDropdown.value = false
  highlightedIndex.value = -1
}

const onBlur = () => {
  setTimeout(() => {
    close()
    emit('blur')
  }, 150)
}
</script>