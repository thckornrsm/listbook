<script setup lang="ts">
import Sidebar from '~/components/learning-materials/Sidebar.vue'
</script>

<template>
  <!-- ✅ ใช้ 100dvh ให้สูงเท่าหน้าจอจริง (แก้ปัญหา iOS) -->
  <div class="h-[100dvh] bg-white overflow-hidden">
    <div class="flex h-full">
      <Sidebar />

      <!-- Content area -->
      <!-- ✅ ให้ฝั่งขวา scroll ได้เอง -->
      <main class="flex-1 min-w-0 overflow-y-auto">
        <div class="px-6 py-6 md:px-10 md:py-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
