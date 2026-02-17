<!-- <template>
  <UCard :ui="{ root: 'rounded-2xl', body: { base: 'p-4' } }" class="bg-white shadow-sm">
    <div class="text-sm font-semibold text-slate-900">1. ตรวจสอบอุปกรณ์</div>

    <div class="mt-3 space-y-3">
      <div class="rounded-xl border border-slate-200 bg-white px-4 py-3">
        <UCheckbox v-model="model.device" label="ตัวเล่นหนังสือ/สื่อการเรียนรู้" />
      </div>

      <div class="rounded-xl border border-slate-200 bg-white px-4 py-3">
        <UCheckbox v-model="model.box" label="กล่องบรรจุภัณฑ์" />
      </div>

      <div class="space-y-2">
        <div class="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <UCheckbox v-model="model.other" label="อื่นๆ" />
        </div>

        <UTextarea
          v-if="model.other"
          v-model="modelOtherText"
          :rows="3"
          placeholder="กรอกรายละเอียด...."
          class="w-full"
          :ui="softFieldUI"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
type Checks = { device: boolean; box: boolean; other: boolean }

const model = defineModel<Checks>({ required: true })
const modelOtherText = defineModel<string>('otherText', { default: '' })

const softFieldUI = {
  base:
    'bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#ED7E24]/30',
  rounded: 'rounded-xl'
}
</script> -->
