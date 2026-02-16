<template>
  <UCard :ui="{ root: 'rounded-2xl' }" class="bg-white ">
    <div class="flex justify-center">
      <div class="w-[220px] overflow-hidden rounded-xl bg-slate-50 shadow-sm">
        <img :src="coverUrl" alt="cover" class="h-auto w-full object-cover" />
      </div>
    </div>

    <div class="flex flex-col items-center mt-4">
      <div class=" text-base - text-slate-900">
        {{ title }}
      </div>
      <div class="mt-1 text-sm text-slate-500">
        {{ subtitle }}
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  coverUrl: string
  title: string
  subtitle: string
}>()
</script>
