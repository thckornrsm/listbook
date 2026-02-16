<template>
  <UCard :ui="{ root  : 'rounded-2xl' }" class="bg-white">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold text-slate-900">ระยะเวลาในการยืม</div>

      <!-- @nuxt/ui v3: trigger = default slot, content = #content -->
      <UPopover :content="{ side: 'bottom', align: 'end', sideOffset: 8 }">
        <UButton variant="ghost" color="gray" class="h-10 w-10 rounded-full">
          <UIcon name="i-heroicons-calendar-days" class="h-5 w-5" />
        </UButton>

        <template #content>
          <div class="p-2">
            <UCalendar v-model="modelRange as any" :is-range="true" />
          </div>
        </template>
      </UPopover>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-2">
      <div class="rounded-2xl bg-slate-50 p-3">
        <div class="text-xs text-slate-500">วันเริ่ม</div>
        <div class="mt-1 text-sm font-semibold text-slate-900">
          {{ fmtDate(modelRange?.start) || '-' }}
        </div>
      </div>

      <div class="rounded-2xl bg-slate-50 p-3">
        <div class="text-xs text-slate-500">วันสิ้นสุด</div>
        <div class="mt-1 text-sm font-semibold text-slate-900">
          {{ fmtDate(modelRange?.end) || '-' }}
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

type RangeValue = { start: any; end: any } | null
const modelRange = defineModel<RangeValue>('range', { default: null })

const fmtDate = (d?: any) => {
  if (!d) return ''
  const js = new Date(d.year, d.month - 1, d.day)
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(js)
}
</script>


