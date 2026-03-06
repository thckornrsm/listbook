<template>
  <div class="min-h-dvh bg-[#F8F9FA] p-4 space-y-4 pb-10 max-w-md mx-auto">
    <!-- Profile Card -->
    <UCard
      :ui="{ root: 'rounded-xl shadow-sm', body: 'p-4' }"
      class="border-none"
    >
      <div class="flex gap-4 items-start">
        <UAvatar
          src="/upload/profile.jpg"
          alt="Profile"
          size="3xl"
          :ui="{ root: 'rounded-xl', image: 'rounded-xl' }"
          class="object-cover bg-slate-200"
        />
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <p class="text-sm text-slate-800">
                <span class="font-bold">ชื่อ : </span>
                <span class="text-slate-600">สมชาย รักดี</span>
              </p>
              <p class="text-sm text-slate-800">
                <span class="font-bold">เบอร์โทร : </span>
                <span class="text-[#2980B9]">098-123-4567</span>
              </p>
              <p class="text-sm text-slate-800 truncate">
                <span class="font-bold">อีเมล : </span>
                <span class="text-[#2980B9]">somchai.r@thaihealth.or.th</span>
              </p>
            </div>
            <UBadge
              v-if="role === 'user'"
              color="success"
              variant="subtle"
              size="sm"
              class="rounded-full font-medium px-2 py-0.5 shrink-0 ml-2"
            >
              สมาชิกทั่วไป
            </UBadge>
            <UBadge
              v-else
              color="success"
              variant="subtle"
              size="sm"
              class="rounded-full font-medium px-2 py-0.5 shrink-0 ml-2"
            >
              เจ้าหน้าที่
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>

    <!-- USER -->
    <div v-if="role === 'user'" class="space-y-3">
      <UButton
        block
        color="warning"
        variant="solid"
        class="h-[65px] rounded-xl px-4 flex items-center justify-center gap-4 bg-[#ED7E24] hover:bg-[#d4711f] active:scale-[0.98] transition-transform"
        @click="onScanBorrow"
      >
        <UIcon name="i-lucide-scan-qr-code" class="w-10 h-10 shrink-0" />
        <div class="text-left">
          <div class="font-semibold text-[16px]">
            สแกนเพื่อขอ/ยืมสื่อการเรียนรู้
          </div>
          <div class="text-sm font-light text-white/90">
            ใช้กล่องเพื่ออ่าน QR Code
          </div>
        </div>
      </UButton>

      <UButton
        block
        color="error"
        variant="solid"
        class="h-[65px] rounded-xl px-4 flex items-center justify-center gap-4 bg-[#C0392B] hover:bg-[#a93226] active:scale-[0.98] transition-transform"
        @click="onReportDamage"
      >
        <UIcon name="i-lucide-triangle-alert" class="w-10 h-10 shrink-0" />
        <div class="text-left">
          <div class="font-semibold text-[16px]">แจ้งชำรุด</div>
          <div class="text-sm font-light text-white/90">
            แจ้งหากพบสื่อการเรียนรู้ชำรุด
          </div>
        </div>
      </UButton>
    </div>

    <!-- STAFF -->
    <div v-else class="space-y-3">
      <UButton
        block
        color="warning"
        variant="solid"
        class="h-[65px] rounded-xl px-4 flex items-center justify-center gap-4 bg-[#ED7E24] hover:bg-[#d4711f] active:scale-[0.98] transition-transform"
        @click="onScanBorrow"
      >
        <UIcon name="i-lucide-scan-qr-code" class="w-10 h-10 shrink-0" />
        <div class="text-left">
          <div class="font-semibold text-[16px]">
            สแกนเพื่อขอ/ยืมสื่อการเรียนรู้
          </div>
          <div class="text-sm font-light text-white/90">
            ใช้กล่องเพื่ออ่าน QR Code
          </div>
        </div>
      </UButton>

      <UButton
        block
        color="success"
        variant="solid"
        class="h-[65px] rounded-xl px-4 flex items-center justify-center gap-4 bg-[#398F6C] hover:bg-[#2f7a5c] active:scale-[0.98] transition-transform"
        @click="onScanReturn"
      >
        <UIcon name="i-lucide-scan-qr-code" class="w-10 h-10 shrink-0" />
        <div class="text-left">
          <div class="font-semibold text-[16px]">
            สแกนเพื่อคืนสื่อการเรียนรู้
          </div>
          <div class="text-sm font-light text-white/90">
            ใช้กล่องเพื่ออ่าน QR Code
          </div>
        </div>
      </UButton>

      <UButton
        block
        color="error"
        variant="solid"
        class="h-[65px] rounded-xl px-4 flex items-center justify-center gap-4 bg-[#C0392B] hover:bg-[#a93226] active:scale-[0.98] transition-transform"
        @click="onReportDamage"
      >
        <UIcon name="i-lucide-triangle-alert" class="w-10 h-10 shrink-0" />
        <div class="text-left">
          <div class="font-semibold text-[16px]">แจ้งชำรุด</div>
          <div class="text-sm font-light text-white/90">
            แจ้งหากพบสื่อการเรียนรู้ชำรุด
          </div>
        </div>
      </UButton>
    </div>

    <!-- Borrow/Return List -->
    <UCard
      :ui="{ root: 'rounded-xl overflow-hidden shadow-sm', body: 'p-0' }"
      class="border-none"
    >
      <div
        class="flex items-center justify-between px-4 pt-4 border-b border-slate-100"
      >
        <div class="flex gap-6 text-base">
          <UButton
            variant="ghost"
            color="neutral"
            class="pb-3 px-0 rounded-none transition-colors duration-200"
            :class="
              activeTab === 'borrowing'
                ? 'border-b-2 border-[#ED7E24] text-[#ED7E24]'
                : 'text-slate-400 hover:text-slate-600'
            "
            @click="activeTab = 'borrowing'"
          >
            กำลังยืม({{ borrowedItems.length }})
          </UButton>
          <UButton
            variant="ghost"
            color="neutral"
            class="pb-3 px-0 rounded-none transition-colors duration-200"
            :class="
              activeTab === 'returned'
                ? 'border-b-2 border-[#ED7E24] text-[#ED7E24]'
                : 'text-slate-400 hover:text-slate-600'
            "
            @click="activeTab = 'returned'"
          >
            คืนแล้ว({{ returnedItems.length }})
          </UButton>
        </div>
        <UButton
          variant="ghost"
          color="neutral"
          class="pb-3 text-slate-500"
          size="sm"
        >
          <UIcon name="i-heroicons-funnel" class="w-6 h-6" />
        </UButton>
      </div>

      <div class="divide-y divide-slate-100 px-4">
        <div
          v-if="currentItems.length === 0"
          class="py-10 text-center text-slate-400 text-sm"
        >
          ไม่มีรายการสื่อการเรียนรู้
        </div>

        <div
          v-else
          v-for="(item, index) in currentItems"
          :key="index"
          class="flex gap-3 py-5"
        >
          <!-- รูปปก -->
          <div class="shrink-0">
            <img
              :src="item.image"
              class="w-[90px] h-[125px] object-cover rounded-lg border border-slate-100 shadow-sm"
              alt="book cover"
            />
          </div>

          <!-- ข้อมูล -->
          <div class="flex-1 min-w-0 flex flex-col gap-1">
            <!-- แถว 1: ชื่อ (ซ้าย) + bookingId (ขวา) -->
            <div class="flex items-start justify-between gap-2">
              <h3
                class="font-bold text-slate-800 text-[15px] leading-tight flex-1"
              >
                {{ item.title }}
              </h3>
              <span
                class="text-sm font-bold text-slate-700 shrink-0 whitespace-nowrap"
              >
                {{ item.bookingId }}
              </span>
            </div>

            <!-- แถว 2: subtitle (ซ้าย) + badge (ขวา) -->
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs text-slate-500 line-clamp-1 flex-1">
                {{ item.subtitle }}
              </p>
              <UBadge
                :color="item.status === 'คืนแล้ว' ? 'neutral' : 'info'"
                variant="subtle"
                size="sm"
                class="rounded-full text-[10px] px-2 font-medium shrink-0 whitespace-nowrap"
              >
                {{ item.status }}
              </UBadge>
            </div>

            <!-- เส้นแบ่ง -->
            <div class="border-t border-slate-100 my-1" />

            <!-- แถว details -->
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between items-center gap-2">
                <span class="text-slate-500 shrink-0">วัตถุประสงค์</span>
                <span class="font-semibold text-slate-800 text-right">{{
                  item.objective
                }}</span>
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-slate-500 shrink-0">ระยะเวลา</span>
                <span class="font-semibold text-[#398F6C] text-right">{{
                  item.duration
                }}</span>
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-slate-500 shrink-0">สถานที่</span>
                <span class="font-semibold text-slate-800 text-right">{{
                  item.location
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const role = computed(() => {
  return route.query.role === "staff" ? "staff" : "user";
});

const onScanBorrow = () => console.log("เปิดกล้องสแกนเพื่อ ยืม");
const onScanReturn = () => console.log("เปิดกล้องสแกนเพื่อ คืน");
const onReportDamage = () => console.log("เปิดหน้าแจ้งชำรุด");
const onManage = () => console.log("เปิดหน้าจัดการสื่อ");

const activeTab = ref<"borrowing" | "returned">("borrowing");

const borrowedItems = ref([
  {
    bookingId: "TH00001",
    image: "/upload/book.png",
    title: "จดหมายข่าวชุมชนคนรักสุขภาพ",
    subtitle: "ฉบับสร้างสุข ประจำเดือนมกราคม 2569",
    status: "ครบกำหนด 5 วัน",
    objective: "กิจกรรมภายใน",
    duration: "10 วัน",
    location: "โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)",
  },
  {
    bookingId: "TH00002",
    image: "/upload/book2.png",
    title: "จดหมายข่าวชุมชนคนรักสุขภาพ",
    subtitle: "ฉบับสร้างสุข ประจำเดือนธันวาคม 2568",
    status: "ครบกำหนด 5 วัน",
    objective: "กิจกรรมภายใน",
    duration: "7 วัน",
    location: "โซน C ชั้น 2 (มุมสื่อสิ่งพิมพ์)",
  },
]);

const returnedItems = ref([
  {
    bookingId: "TH00099",
    image: "/upload/book1.png",
    title: "คู่มือโภชนาการสำหรับวัยเรียน",
    subtitle: "ฉบับปรับปรุง 2568",
    status: "คืนแล้ว",
    objective: "จัดนิทรรศการ",
    duration: "3 วัน",
    location: "โซน B ชั้น 1",
  },
]);

const currentItems = computed(() => {
  return activeTab.value === "borrowing"
    ? borrowedItems.value
    : returnedItems.value;
});
</script>
