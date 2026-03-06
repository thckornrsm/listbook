<template>
  <div class="space-y-4">
    <div class="font-semibold">ระยะเวลาการยืม</div>

    <div class="grid grid-cols-2 gap-6">
      <div class="space-y-2">
        <div>วันที่ยืม</div>
        <UInput v-model="startText" readonly class="w-full" :ui="inputUI" size="xl" />
      </div>

      <div class="space-y-2">
        <div>วันที่คาดว่าจะนำมาคืน</div>
        <UInput v-model="endText" readonly class="w-full" :ui="inputUI" size="xl" />
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4">
      <!-- ✅ ใส่ locale เป็นไทย -->
      <UCalendar multiple v-model="selectedDates" :min-value="startFixed" :locale="locale" />
    </div>

    <div class="space-y-2">
      <UInput v-model="summaryText" readonly class="w-full" :ui="inputUI" size="xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getLocalTimeZone, today, toCalendarDate } from '@internationalized/date'

const tz = getLocalTimeZone()

// ✅ เปลี่ยน locale ตรงนี้
// - th-TH = ไทย (ค.ศ.)
// - ถ้าอยากให้ปีเป็น พ.ศ. ใช้: 'th-TH-u-ca-buddhist'
const locale = 'th-TH'

// ✅ วันที่ยืม = วันนี้ (ล็อก)
const startFixed = today(tz)

// ✅ ใช้ multiple: เก็บ [startFixed, returnDate]
const selectedDates = ref<any[]>([startFixed, startFixed])

const asCal = (d: any) => (d ? toCalendarDate(d) : undefined)

const fmt = (d: any) => {
  const cd = asCal(d)
  if (!cd) return ''
  const js = cd.toDate(tz)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(js)
}

const returnDate = computed(() => {
  const arr = (selectedDates.value || []).map(asCal).filter(Boolean) as any[]
  const other = arr.find((d) => d.compare(startFixed) !== 0)
  return other ?? startFixed
})

const startText = computed(() => fmt(startFixed))
const endText = computed(() => fmt(returnDate.value))

const diffDaysExclusive = (start: any, end: any) => {
  const sCal = asCal(start)
  const eCal = asCal(end)
  if (!sCal || !eCal) return 0

  const s = sCal.toDate(tz)
  const e = eCal.toDate(tz)
  s.setHours(0, 0, 0, 0)
  e.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000))
}

// ✅ นับวันเริ่มยืมด้วย (+1)
const summaryText = computed(() => {
  const days = diffDaysExclusive(startFixed, returnDate.value) + 1
  return `${days} วัน`
})

watch(
  () => selectedDates.value,
  (arr) => {
    const list = (arr || []).map(asCal).filter(Boolean) as any[]

    // ใส่ startFixed กลับเข้าไปถ้าหาย
    if (!list.some((d) => d.compare(startFixed) === 0)) list.unshift(startFixed)

    // หา end = ตัวที่ไม่ใช่ startFixed (เอาตัวท้ายสุด)
    const others = list.filter((d) => d.compare(startFixed) !== 0)
    const end = others.length ? others[others.length - 1] : startFixed

    // normalize ให้เหลือ 2 ตัวเสมอ
    const next = [startFixed, end]

    // กัน loop: ถ้าเหมือนเดิมแล้วไม่ set ซ้ำ
    const cur0 = asCal(selectedDates.value?.[0])
    const cur1 = asCal(selectedDates.value?.[1])
    const same =
      cur0?.compare(next[0]) === 0 &&
      cur1?.compare(next[1]) === 0 &&
      (selectedDates.value?.length ?? 0) === 2

    if (same) return
    selectedDates.value = next
  },
  { deep: true, immediate: true }
)

const inputUI = {
  base: 'bg-white ring-1 text-center ring-slate-300 focus-within:ring-2 focus-within:ring-sky-300 text-slate-700',
  rounded: 'rounded-xl'
}
</script>