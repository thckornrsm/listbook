<template>
  <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
    <button
      type="button"
      class="flex w-full items-center justify-between px-4 py-4"
      @click="modelOpen = !modelOpen"
    >
      <div class="text-base font-extrabold text-[#ED7E24]">{{ title }}</div>
      <UIcon
        name="i-heroicons-chevron-down"
        class="h-5 w-5 text-slate-700 transition-transform"
        :class="modelOpen ? 'rotate-180' : ''"
      />
    </button>

    <div v-if="modelOpen" class="px-4 pb-4">
      <div class="divide-y divide-dashed divide-slate-200 text-sm">
        <ReturnInfoRow
          v-for="(r, i) in rows"
          :key="i"
          :label="r.label"
          :value="r.value"
        />

        <div class="py-3">
          <div class="font-semibold text-slate-700">ข้อมูลเพิ่มเติม</div>
          <div class="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">
            {{ note }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReturnInfoRow from './ReturnInfoRow.vue'

type Row = { label: string; value: string }

const props = defineProps<{
  title: string
  rows: Row[]
  note: string
}>()

const modelOpen = defineModel<boolean>('open', { default: true })
</script>
