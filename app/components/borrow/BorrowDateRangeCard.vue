<template>
  <UCard :ui="{ root: 'rounded-2xl', body: { base: 'p-4' } }" class="bg-white shadow-sm">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold text-slate-900">ระยะเวลาในการยืม</div>

      <UPopover placement="bottom-end">
        <UButton
          variant="ghost"
          color="gray"
          class="h-10 w-10 rounded-full"
          icon="i-heroicons-calendar-days"
        />

        <template #content>
          <div class="p-2">
            <UCalendar v-model="modelRange" is-range />
          </div>
        </template>
      </UPopover>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-2">
      <div class="rounded-2xl bg-slate-50 p-3">
        <div class="text-xs text-slate-500">วันเริ่ม</div>
        <div class="mt-1 text-sm font-semibold text-slate-900">
          {{ fmt(modelRange?.start) || '-' }}
        </div>
      </div>

      <div class="rounded-2xl bg-slate-50 p-3">
        <div class="text-xs text-slate-500">วันสิ้นสุด</div>
        <div class="mt-1 text-sm font-semibold text-slate-900">
          {{ fmt(modelRange?.end) || '-' }}
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
type Range = { start?: Date; end?: Date } | null
const modelRange = defineModel<Range>('range', { required: true })

const fmt = (d?: Date) => {
  if (!d) return ''
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(d)
}
</script>
