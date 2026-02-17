<template>
  <div class="min-h-dvh bg-slate-100 text-slate-900">
    <ReturnTopBar title="กรอกข้อมูลการคืน" @back="router.back()" />

    <main class="mx-auto w-full max-w-md px-4 py-4">
      <div class="space-y-4">
        <ReturnConditionCard v-model="condition" />

        <ReturnSuggestionCard v-model="suggestion" />

        <ReturnPhotoEvidenceCard v-model="previews" />
      </div>

      <!-- เว้นพื้นที่กันปุ่มทับ -->
      <div class="h-24" />
    </main>

    <!-- ปุ่มล่างติดจอ -->
    <div class="fixed inset-x-0 bottom-0 z-20 bg-slate-100/80 backdrop-blur px-4 pb-6 pt-3">
      <div class="mx-auto w-full max-w-md">
        <ReturnSubmitBar :disabled="!canSubmit" @submit="onSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import ReturnTopBar from '~/components/return/ReturnTopBar.vue'
import ReturnConditionCard from '~/components/return/ReturnConditionCard.vue'
import ReturnSuggestionCard from '~/components/return/ReturnSuggestionCard.vue'
import ReturnPhotoEvidenceCard from '~/components/return/ReturnPhotoEvidenceCard.vue'
import ReturnSubmitBar from '~/components/return/ReturnSubmitBar.vue'

const router = useRouter()

type Condition = 'good' | 'minor' | 'bad'
const condition = ref<Condition>('good')

const suggestion = ref('')
const previews = ref<string[]>([])

const canSubmit = computed(() => {
  // รูปตามตัวอย่าง: ให้ส่งได้แม้ไม่แนบรูป/ไม่พิมพ์ข้อความ
  return !!condition.value
})

const onSubmit = () => {
  console.log('SUBMIT:', {
    condition: condition.value,
    suggestion: suggestion.value,
    photosCount: previews.value.length
  })
  router.push('/return/confirm')
}
</script>
