<script setup>
const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  loading: { type: Boolean, default: false },

  class: { type: String, default: '' }
})
</script>

<template>
  <!-- ✅ กรอบแบบ Nuxt UI: border + rounded + overflow-hidden -->
  <div class="overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-500 ">
    <UTable
      :data="data"
      :columns="columns"
      :loading="loading"
      :class="props.class"
    />
  </div>
</template>

<style scoped>
/* ✅ แก้เฉพาะ “สีหัวข้อ column” ให้ดำ */
:deep(thead th) {
  color: #000 !important;
}

/* ✅ ให้เส้นคั่นแถวดูเหมือนในรูป (ถ้ามีอยู่แล้วจะไม่เสียหาย) */

/* :deep(tbody tr) {   เอาส้น rows ออก
  border-bottom: 0 !important;
  border-top: 0 !important;
} */
</style>
