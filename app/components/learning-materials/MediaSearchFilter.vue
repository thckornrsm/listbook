<template>
  <div class="-mx-8 px-8">
    <div class="flex items-center gap-2 bg-transparent px-0 py-3">
      <div class="flex-1">
        <UInput
          :model-value="searchValue"
          @update:model-value="(v) => emit('update:search', v)"
          :placeholder="searchPlaceholderValue"
          size="sm"
          class="w-full"
          color="neutral"
          variant="outline"
          :ui="{
            base: 'h-9 w-full rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 focus:border-slate-300'
          }"
        >
          <template #leading>
            <UIcon name="i-heroicons-magnifying-glass-20-solid" class="h-4 w-4 text-slate-400" />
          </template>
        </UInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  search?: string
  searchPlaceholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:search', v: string): void
}>()

const searchValue = computed(() => props.search ?? '')
const searchPlaceholderValue = computed(() => props.searchPlaceholder ?? 'ค้นหา')
</script>
