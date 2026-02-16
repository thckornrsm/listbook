<template>
    <UCard :ui="{ root : 'rounded-2xl' }" class="bg-white">
        <div class="flex items-start justify-end">

            <UButton variant="ghost" color="gray" class="ml-auto h-10 w-10 rounded-full"
                :icon="fav ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" @click="emit('toggleFav')" />
        </div>

        <div class="mt-4 grid place-items-center">
            <div class="aspect-[3/4] w-48 overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                <img :src="coverUrl" alt="cover" class="h-full w-full object-cover" />
            </div>

            <div class="min-w-0">
                <p class="text-sm  text-slate-900 line-clamp-2">
                    {{ title }}
                </p>
                <p class="mt-1 text-xs text-slate-500 line-clamp-2">
                    {{ subtitle }}
                </p>
            </div>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-2 text-center">
            <div>
                <div class="text-xs text-slate-500">คงเหลือ</div>
                <div class="mt-1 text-lg font-bold text-[#ED7E24]">{{ remainText }}</div>
            </div>
            <div>
                <div class="text-xs text-slate-500">รอคิว</div>
                <div class="mt-1 text-lg font-bold text-[#ED7E24]">{{ waiting }}</div>
            </div>
            <div>
                <div class="text-xs text-slate-500">ยืมแล้ว</div>
                <div class="mt-1 text-lg font-bold text-[#ED7E24]">{{ borrowed }}</div>
            </div>
        </div>

        <UDivider class="my-4" />

        <div class="flex flex-wrap gap-2">
            <UBadge v-for="t in tags" :key="t" color="gray" variant="soft">{{ t }}</UBadge>
        </div>

        <div class="mt-4 space-y-3">
            <div>
                <div class="text-sm font-semibold text-slate-900">สถานที่จัดเก็บ</div>
                <div class="mt-1 text-sm text-slate-600">{{ storageLocation }}</div>
            </div>

            <div v-if="description">
                <div class="text-sm font-semibold text-slate-900">ข้อมูลเพิ่มเติม</div>
                <div class="mt-1 text-sm text-slate-600">
                    {{ description }}
                </div>
            </div>

            <UButton variant="outline" color="orange" class="justify-center h-12 w-full rounded-2xl
         border border-[#ED7E24] text-[#ED7E24]
         hover:bg-[#ED7E24]/5
         ring-0 focus:ring-0 focus-visible:ring-0
         focus-visible:ring-offset-0
         focus-visible:outline-none" @click="emit('openPdf')">
                อ่านไฟล์ตัวอย่าง PDF
            </UButton>
        </div>
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string
    subtitle?: string
    coverUrl: string
    remain: number
    total: number
    waiting: number
    borrowed: number
    tags: string[]
    storageLocation: string
    description?: string
    fav?: boolean
}>()

const emit = defineEmits<{
    (e: 'toggleFav'): void
    (e: 'openPdf'): void
}>()

const remainText = computed(() => `${props.remain}/${props.total}`)
</script>
