<template>
    <UCard :ui="{ root: 'rounded-2xl', body: { base: 'p-4' } }" class="bg-white shadow-sm">
        <div class="text-sm font-semibold text-slate-900">3. หลักฐานรูปถ่าย</div>

        <div class="mt-3">
            <label class="mt-3 flex h-28 w-full cursor-pointer flex-col items-center justify-center
         rounded-2xl border border-dashed border-slate-300 bg-white
         text-slate-700 active:scale-[0.99]">
                <UIcon name="i-heroicons-camera" class="h-6 w-6 text-slate-500" />
                <div class="mt-2 text-sm font-semibold text-slate-700">เพิ่มรูป</div>
                <input type="file" class="hidden" accept="image/*" multiple @change="onPickFiles" />
            </label>


            <div v-if="model.length" class="mt-4 grid grid-cols-3 gap-3">
                <div v-for="(src, i) in model" :key="i"
                    class="relative overflow-hidden rounded-xl border border-slate-200">
                    <img :src="src" class="h-24 w-full object-cover" alt="preview" />

                    <UButton variant="solid" color="neutral"
                        class="absolute right-1 top-1 h-7 w-7 rounded-full bg-black/50 p-0 text-white hover:bg-black/60"
                        @click.prevent="removePreview(i)" aria-label="remove">
                        ×
                    </UButton>
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
const model = defineModel<string[]>({ default: [] })

const onPickFiles = (e: Event) => {
    const input = e.target as HTMLInputElement
    const files = input.files
    if (!files?.length) return

    const next = [...model.value]
    Array.from(files).forEach((f) => next.push(URL.createObjectURL(f)))
    model.value = next

    input.value = ''
}

const removePreview = (i: number) => {
    const url = model.value[i]
    if (url) URL.revokeObjectURL(url)
    model.value = model.value.filter((_, idx) => idx !== i)
}
</script>
