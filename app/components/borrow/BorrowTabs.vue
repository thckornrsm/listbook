<template>
  <UCard :ui="{ root: 'rounded-xl' }" class="bg-white p-2">
    <div class="grid grid-cols-2 gap-2">
      <UButton
        :to="leftTo"
        variant="solid"
        class="h-12 rounded-xl"
        :ui="{ base: 'justify-center' }"
        :color="'white'"
      >
        <span class="text-sm font-semibold" :class="isLeftActive ? 'text-[#ED7E24]' : 'text-slate-500'">
          {{ leftLabel }}
        </span>
      </UButton>

      <UButton
        :to="rightTo"
        variant="soft"
        color="gray"
        class="h-12 rounded-xl"
        :ui="{ base: 'justify-center' }"
      >
        <span class="text-sm font-semibold" :class="isLeftActive ? 'text-slate-700' : 'text-[#ED7E24]'">
          {{ rightLabel }}
        </span>
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  leftLabel: string
  rightLabel: string
  leftTo: string
  rightTo: string
  active: 'left' | 'right'
}>()

const isLeftActive = computed(() => props.active === 'left')
</script>
