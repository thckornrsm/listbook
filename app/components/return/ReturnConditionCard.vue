<template>
  <div class="space-y-4">
    <div class="text-base font-semibold ">สภาพการใช้งาน</div>

    <div class="mt-3 space-y-3">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="w-full rounded-2xl border px-4 py-4 text-left transition active:scale-[0.99]"
        :class="cardClass(opt.value)"
        @click="model = opt.value"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- ✅ เอาวงกลมใหญ่ออก แล้วทำ ICON ให้ใหญ่เท่าเดิม (48x48) -->
            <UIcon
              :name="iconName(opt.value)"
              class="h-12 w-12 shrink-0 transition"
              :class="[iconColorClass(opt.value), iconScaleClass(opt.value)]"
            />

            <div>
              <div class="text-base " :class="titleClass(opt.value)">
                {{ opt.label }}
              </div>
              <div class="mt-1 text-sm" :class="descClass(opt.value)">
                {{ opt.description }}
              </div>
            </div>
          </div>

          <!-- จุดเล็กขวา -->
          <div class="h-4 w-4 rounded-full border-2 transition" :class="rightDotClass(opt.value)" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type Condition = 'good' | 'minor' | 'bad'
const model = defineModel<Condition>({ default: 'good' })

const options: { label: string; description: string; value: Condition }[] = [
  { label: 'สภาพสมบูรณ์', description: 'ไม่มีรอยขีดข่วน ไม่มีฉีกขาด', value: 'good' },
  { label: 'ชำรุดเล็กน้อย', description: 'มีรอยยับ หรือรอยเปื้อน', value: 'minor' },
  { label: 'ชำรุดมาก / สูญหาย', description: 'ใช้งานต่อไม่ได้ หรือของหาย', value: 'bad' }
]

// theme 3 สี (เหมือนเดิม)
const theme = {
  good: {
    border: 'border-[#0B8D6E]',
    bg: 'bg-[#E7F4F1]',
    text: 'text-[#0B8D6E]',
    dotBorder: 'border-[#0B8D6E]',
    dotBg: 'bg-[#0B8D6E]'
  },
  minor: {
    border: 'border-[#ED7E24]',
    bg: 'bg-[#FFF2E9]',
    text: 'text-[#ED7E24]',
    dotBorder: 'border-[#ED7E24]',
    dotBg: 'bg-[#ED7E24]'
  },
  bad: {
    border: 'border-[#FF2D2D]',
    bg: 'bg-[#FFF0F0]',
    text: 'text-[#FF2D2D]',
    dotBorder: 'border-[#FF2D2D]',
    dotBg: 'bg-[#FF2D2D]'
  }
} as const

const isSelected = (v: Condition) => model.value === v

const cardClass = (v: Condition) =>
  isSelected(v)
    ? `${theme[v].border} ${theme[v].bg}`
    : 'border-slate-200 bg-white hover:bg-slate-50'

// ✅ mapping: เขียว = smile, เหลือง = meh, แดง = frown
const iconName = (v: Condition) =>
  v === 'good' ? 'lucide:smile' : v === 'minor' ? 'lucide:meh' : 'lucide:frown'

const iconColorClass = (v: Condition) =>
  isSelected(v) ? theme[v].text : 'text-slate-500'

// ✅ เพิ่มความเด่นเล็กน้อยตอนเลือก (จะเอาออกก็ได้)
const iconScaleClass = (v: Condition) => (isSelected(v) ? 'scale-110' : 'scale-100')

const rightDotClass = (v: Condition) =>
  isSelected(v)
    ? `${theme[v].dotBorder} ${theme[v].dotBg}`
    : 'border-slate-400 bg-white'

const titleClass = (v: Condition) =>
  isSelected(v) ? theme[v].text : 'text-slate-900'

const descClass = (v: Condition) =>
  isSelected(v) ? 'text-slate-600' : 'text-slate-500'
</script>