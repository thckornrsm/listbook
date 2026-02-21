<script setup lang="ts">
import Sidebar from '~/components/learning-materials/Sidebar.vue'
</script>

<template>
  <!-- ✅ สูงเท่าหน้าจอจริง + กันหน้าเด้ง -->
  <div class="h-[100dvh] bg-white overflow-hidden">
    <div class="flex h-full">
      <Sidebar />

      <!-- ✅ ฝั่งขวา scroll เอง + กัน flex ทำให้ตารางล้น -->
      <main class="flex-1 min-w-0 overflow-y-auto">
        <div class="px-6 py-6 md:px-10 md:py-8 min-w-0">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
