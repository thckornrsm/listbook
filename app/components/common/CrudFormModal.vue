<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    submitText?: string
  }>(),
  { submitText: 'บันทึก' }
)

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'submit'): void
}>()
</script>

<template>
  <UModal
    :open="props.open"
    @update:open="(v) => emit('update:open', v)"
    :title="props.title"
    :description="props.description"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <slot />
    </template>

    <template #footer="{ close }">
      <UButton
        label="ยกเลิก"
        color="neutral"
        variant="outline"
        class="rounded-xl"
        @click="close"
      />
      <UButton
        :label="props.submitText"
        class="rounded-xl bg-[#ED7E24] text-white hover:bg-[#F4A23A]"
        @click="emit('submit')"
      />
    </template>
  </UModal>
</template>
