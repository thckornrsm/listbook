<template>
  <div class="badge-outer">
    <div class="badge-inner">
      <img :src="iconSrc" alt="success" class="badge-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** icon ตรงกลาง */
  iconSrc?: string
}>()

const iconSrc = computed(() => props.iconSrc ?? '/icons/check-circle.svg')
</script>

<style scoped>
/* วงแหวนด้านนอก */
.badge-outer{
  width: 260px;              /* ปรับได้ */
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  background: rgba(253, 212, 180, 1); /* #FDD4B4 */
  display: grid;
  place-items: center;
}

/* วงในสีขาวเพื่อทำเป็น “รู” ให้เป็น donut */
.badge-inner{
  width: 190px;              /* ปรับได้: ยิ่งใหญ่ วงแหวนยิ่งหนา */
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  background: #fff;
  display: grid;
  place-items: center;
}

/* ไอคอนตรงกลาง */
.badge-icon{
  width: 120px;              /* ปรับได้ */
  height: 120px;
  object-fit: contain;
  display: block;
}
</style>
