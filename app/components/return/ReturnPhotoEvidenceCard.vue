<template>
  <div class="space-y-4">
    <div class="text-base font-semibold">แนบหลักฐานรูปถ่าย</div>

    <label class="block cursor-pointer">
      <input
        type="file"
        class="hidden"
        accept="image/*"
        multiple
        @change="onPick"
      />

      <div
        class="flex h-24 w-full flex-col items-center justify-center rounded-md border border-dashed border-[#94A3B8] bg-white text-[#62748E]"
      >
        <div class="text-center space-y-2">
          <UIcon
            name="i-lucide-camera"
            class="mx-auto h-8 w-8 text-slate-500"
          />
          <div class="font-semibold">เพิ่มรูป</div>
        </div>
      </div>
    </label>

    <div v-if="modelValue?.length" class="grid grid-cols-3 gap-2">
      <div
        v-for="(img, idx) in modelValue"
        :key="idx"
        class="relative aspect-square overflow-hidden rounded-md ring-1 ring-slate-200"
      >
        <img :src="img" class="h-full w-full object-cover" />

        <button
          type="button"
          class="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/90 ring-1 ring-slate-200"
          @click="remove(idx)"
          aria-label="remove"
        >
          <UIcon name="i-lucide-x" class="h-4 w-4 text-slate-700" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string[]): void;
}>();

const onPick = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  if (!files.length) return;

  const urls = await Promise.all(
    files.map(
      (f) =>
        new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.readAsDataURL(f);
        }),
    ),
  );

  emit("update:modelValue", [...(props.modelValue || []), ...urls]);
  input.value = "";
};

const remove = (idx: number) => {
  emit(
    "update:modelValue",
    (props.modelValue || []).filter((_, i) => i !== idx),
  );
};
</script>
