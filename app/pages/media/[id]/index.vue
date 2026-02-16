<template>
  <div class="min-h-dvh bg-slate-100">
    <MediaTopBar title="ระบบยืมเครื่องมือการเรียนรู้" @toggle-fav="isFav = !isFav" />

    <div class="mx-auto w-full max-w-md px-4 py-4">
      <!-- main card -->
      <div class="rounded-2xl bg-white p-4 shadow-sm">
        <!-- cover + heart (บนการ์ด) -->
        <div class="relative">
          <div class="flex justify-center">
            <img
              :src="item.cover"
              alt="cover"
              class="h-72 w-auto rounded-xl object-contain"
            />
          </div>

          <button
            type="button"
            class="absolute right-0 top-0 grid h-10 w-10 place-items-center text-slate-500"
            @click="isFav = !isFav"
            aria-label="Favorite"
          >
            <span class="text-2xl">{{ isFav ? '♥' : '♡' }}</span>
          </button>
        </div>

        <!-- title + subtitle -->
        <div class="mt-4">
          <div class="text-lg font-bold text-slate-900">
            {{ item.title }}
          </div>
          <div class="mt-1 text-sm text-slate-500">
            {{ item.subtitle }}
          </div>
        </div>

        <!-- stats -->
        <div class="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-white py-3">
          <div class="text-center">
            <div class="text-sm text-slate-500">คงเหลือ</div>
            <div class="mt-1 text-xl font-extrabold text-[#ED7E24]">
              {{ item.remaining }}/{{ item.total }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-slate-500">รอคิว</div>
            <div class="mt-1 text-xl font-extrabold text-slate-900">
              {{ item.queue }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-slate-500">ยืมแล้ว</div>
            <div class="mt-1 text-xl font-extrabold text-[#ED7E24]">
              {{ item.borrowed }}
            </div>
          </div>
        </div>

        <!-- tags -->
        <MediaTags :tags="item.tags" />

        <!-- location -->
        <div class="mt-4">
          <div class="text-base font-bold text-slate-900">สถานที่จัดเก็บ</div>
          <div class="mt-1 text-sm text-slate-600">
            {{ item.location }}
          </div>
        </div>

        <!-- description -->
        <div class="mt-4">
          <div class="text-base font-bold text-slate-900">ข้อมูลเพิ่มเติม</div>
          <div class="mt-1 text-sm leading-6 text-slate-600">
            {{ item.description }}
          </div>
        </div>

        <!-- CTA -->
        <button
          type="button"
          class="mt-5 h-12 w-full rounded-2xl bg-[#ED7E24] text-base font-semibold text-white shadow-sm active:scale-[0.99]"
          @click="onOpenSample"
        >
          อ่านไฟล์ตัวอย่าง PDF
        </button>
      </div>

      <!-- bottom slide card -->
      <div class="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-[#ED7E24] text-white">
            <span class="text-2xl">›</span>
          </div>

          <div class="flex-1">
            <div class="text-base font-semibold text-slate-900">สไลด์เพื่อยืนยันการยืม</div>
          </div>
        </div>
      </div>

      <div class="h-6"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MediaTopBar from '~/components/media/MediaTopBar.vue'
import MediaTags from '~/components/media/MediaTags.vue'

const route = useRoute()
const isFav = ref(false)

// mock data (แทน API)
const item = computed(() => {
  const id = route.params.id
  return {
    id,
    cover: '/upload/book.png', // เปลี่ยนเป็นรูปจริงของคุณ
    title: 'จดหมายข่าวชุมชนรักสุขภาพ',
    subtitle: 'ฉบับสร้างสุข ประจำเดือนมกราคม 2569',
    remaining: 10,
    total: 15,
    queue: 0,
    borrowed: 5,
    tags: ['thaihealth', 'สร้างสุข', 'สสส.', 'สาระสุขภาพ', 'สุขภาพ'],
    location: 'โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)',
    description:
      'จดหมายข่าวฉบับนี้รวบรวมองค์ความรู้ด้านสุขภาพประจำเดือนมกราคม 2569 เน้นเรื่องการดูแลสุขภาพจิตและกายในยุคดิจิทัล',
  }
})

const onOpenSample = () => {
  // TODO: เปิด pdf จริง เช่น window.open('/pdf/sample.pdf', '_blank')
  alert('เปิดไฟล์ PDF ตัวอย่าง')
}
</script>
