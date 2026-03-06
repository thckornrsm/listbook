<template>
  <div class="flex gap-4 py-5">
    <div class="shrink-0">
      <img 
        :src="item.image" 
        class="w-[90px] h-[125px] object-cover rounded border border-slate-100 shadow-sm"
        alt="book cover"
      />
    </div>
    
    <div class="flex-1 min-w-0 flex flex-col">
      <h3 class="font-bold text-slate-800 text-[15px] leading-tight line-clamp-2">
        {{ item.title }}
      </h3>
      <p class="text-xs text-slate-500 mt-1 line-clamp-1">
        {{ item.subtitle }}
      </p>
      
      <div class="flex justify-end mt-1 mb-2">
        <UBadge color="blue" variant="subtle" size="sm" class="rounded-full text-[10px] px-2 font-medium">
          {{ item.status }}
        </UBadge>
      </div>

      <div class="space-y-1.5 text-xs mt-auto">
        <div class="flex justify-between items-start gap-2">
          <span class="text-slate-500 shrink-0">วัตถุประสงค์</span>
          <span class="font-semibold text-slate-800 text-right">{{ item.objective }}</span>
        </div>
        <div class="flex justify-between items-start gap-2">
          <span class="text-slate-500 shrink-0">ระยะเวลา</span>
          <span class="font-semibold text-[#398F6C] text-right">{{ item.duration }}</span>
        </div>
        <div class="flex justify-between items-start gap-2">
          <span class="text-slate-500 shrink-0">สถานที่</span>
          <span class="font-semibold text-slate-800 text-right line-clamp-1">{{ item.location }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// รับค่า Props จากหน้าหลัก
defineProps<{
  item: {
    image: string
    title: string
    subtitle: string
    status: string
    objective: string
    duration: string
    location: string
  }
}>()
</script>