<template>
  <UCard :ui="{ root: 'rounded-2xl' }" class="bg-white">
    <!-- cover -->
    <div v-if="props.coverUrl" class="mt-4 grid place-items-center">
      <div
        class="aspect-[3/4] w-72 overflow-hidden rounded-xl bg-slate-100 shadow-sm"
      >
        <img src="/upload/book.png" alt="สสส." class="h-full w-full" />
      </div>
    </div>

    <!-- tags -->
    <div
      v-if="props.tags?.length"
      class="mt-4 flex gap-2 overflow-x-scroll pb-1 tags-scroll"
    >
      <span
        v-for="t in props.tags"
        :key="t"
        class="shrink-0 rounded-full bg-slate-100 px-3 py-1 font-medium"
      >
        {{ t }}
      </span>
    </div>

    <!-- title + borrowed -->
    <div class="mt-4 flex items-start justify-between gap-4 text-xl">
      <div class="min-w-0 flex-1">
        <p>{{ props.title }}</p>
      </div>

      <div class="shrink-0 text-right">
        <div class="px-5 text-3xl font-semibold leading-none text-[#ED7E24]">
          {{ props.borrowed }}
        </div>
        <div class="mt-1 text-base">ยืมแล้ว</div>
      </div>
    </div>

    <!-- description -->
    <div v-if="props.description" class="mt-2">
      <p
        class="text-base leading-6"
        :class="[
          isDescExpanded ? '' : 'line-clamp-3',
          isDescTruncatable ? 'cursor-pointer select-none' : '',
        ]"
        role="button"
        tabindex="0"
        @click="toggleDesc"
        @keydown.enter.prevent="toggleDesc"
        @keydown.space.prevent="toggleDesc"
      >
        {{ props.description }}
      </p>

      <button
        v-if="isDescTruncatable && isDescExpanded"
        type="button"
        class="mt-2 font-semibold hover:text-slate-900"
        @click="isDescExpanded = false"
      >
        ย่อ
      </button>
    </div>

    <!-- rows -->
    <div class="space-y-3">
      <!-- storage -->
      <div class="mt-3 grid grid-cols-[120px_1fr] items-start gap-4">
        <div>สถานที่จัดเก็บ</div>
        <div class="text-right">
          {{ props.storageLocation }}
        </div>
      </div>

      <!-- status -->
      <div class="grid grid-cols-[120px_1fr] items-center gap-4">
        <div class="">สถานะ:</div>

        <div class="text-right">
          <UBadge
            :color="statusColor"
            variant="soft"
            class="rounded-full px-3 py-1"
          >
            {{ statusText }}
          </UBadge>
        </div>
      </div>

      <!-- ✅ staff คืน: แสดงวันที่คาดว่าจะคืน -->
      <div
        v-if="
          isStaffReturn &&
          (props.expectedReturnText || props.expectedReturnSubtext)
        "
        class="mb-4 grid grid-cols-[120px_1fr] items-center gap-4"
      >
        <div>วันที่คาดว่าจะคืน</div>

        <div class="text-right">
          <span>{{ props.expectedReturnText }}</span>
          <span v-if="props.expectedReturnSubtext" class="ml-2 text-slate-500">
            {{ props.expectedReturnSubtext }}
          </span>
        </div>
      </div>

      <!-- ✅ โหมดปกติ: BorrowTabs -->
      <BorrowTabs
        v-if="!isStaffReturn"
        :left-label="props.leftLabel"
        :right-label="props.rightLabel"
        :left-to="props.leftTo"
        :right-to="props.rightTo"
        :left-desc="props.leftDesc"
        :right-desc="props.rightDesc"
        :staff-extra-label="props.staffExtraLabel"
        :staff-extra-desc="props.staffExtraDesc"
        :staff-extra-to="props.staffExtraTo"
      />

      <!-- ✅ staff คืน -->
      <div v-else class="space-y-3">
        <!-- แถว 1: เทา disabled -->
        <UFieldGroup class="w-full">
          <UButton
            :label="props.leftLabel || 'ขอยืมสื่อการเรียนรู้'"
            color="neutral"
            variant="outline"
            disabled
            class="h-10 flex-1 justify-center rounded-l-lg rounded-r-none bg-slate-100 px-3 py-0 text-base font-medium leading-normal text-slate-400 disabled:opacity-100"
          />

          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-down"
            disabled
            class="h-10 w-12 rounded-r-lg rounded-l-none bg-slate-100 p-0 text-slate-400 justify-center disabled:opacity-100 border-l border-white/40"
            aria-label="Disabled actions"
          />
        </UFieldGroup>

        <!-- แถว 2: ทำแบบ BorrowTabs (ก่อนกด=เขียว / หลังกด=outline ขอบเขียว) -->
        <template v-if="isStaffReturnFormOpen">
          <!-- ✅ หลังกดแล้ว: outline -->
          <UButton
            label="ยกเลิกคืนสื่อการเรียนรู้"
            color="neutral"
            variant="outline"
            class="h-10 w-full justify-center rounded-lg border border-[#0B8D6E] bg-white px-6 py-0 text-base font-medium text-[#0B8D6E] hover:bg-white active:bg-white"
            @click="emit('cancelReturnForm')"
          />
        </template>

        <template v-else>
          <!-- ✅ ก่อนกด: เขียว solid -->
          <UButton
            color="neutral"
            variant="solid"
            class="h-10 w-full justify-center rounded-lg bg-emerald-600 px-4 py-0 text-base font-semibold text-white hover:bg-emerald-600 active:bg-emerald-600/95"
            @click="emit('openReturnForm')"
          >
            <span>รับคืนสื่อการเรียนรู้</span>
            <!-- placeholder ด้านขวา (ไม่ต้องมี icon ก็ได้) -->
            <span class="h-5 w-5" />
          </UButton>
        </template>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import BorrowTabs from "~/components/borrow/BorrowTabs.vue";

const route = useRoute();

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    coverUrl?: string;
    remain: number;
    total: number;
    waiting: number;
    borrowed: number;
    tags: string[];
    storageLocation: string;
    description?: string;
    fav?: boolean;

    leftLabel?: string;
    rightLabel?: string;
    leftTo?: string;
    rightTo?: string;
    leftDesc?: string;
    rightDesc?: string;

    // ✅ เพิ่ม: เมนูพิเศษสำหรับ staff ใน chevron-down
    staffExtraLabel?: string;
    staffExtraDesc?: string;
    staffExtraTo?: string;

    role?: "user" | "staff" | string;
    mode?: "borrow" | "request" | "return" | string;

    expectedReturnText?: string;
    expectedReturnSubtext?: string;

    returnTo?: string;
  }>(),
  {
    leftLabel: "ขอยืมสื่อการเรียนรู้",
    rightLabel: "ขอสื่อการเรียนรู้",
    leftTo: "/borrow/request?mode=borrow&step=form",
    rightTo: "/borrow/request?mode=request&step=form",
    leftDesc: "ขอยืมสื่อการเรียนรู้โดยมีกำหนดส่งคืน",
    rightDesc: "ติดต่อเจ้าหน้าที่เพื่อขอสื่อการเรียนรู้โดยไม่มีกำหนดส่งคืน",

    // ปล่อยค่า default ให้ BorrowTabs จัดให้ ถ้าไม่ส่งมา
    staffExtraLabel: undefined,
    staffExtraDesc: undefined,
    staffExtraTo: undefined,
    coverUrl: "",
    tags: () => [],
    role: "user",
    mode: "borrow",
  },
);

const emit = defineEmits<{
  (e: "toggleFav"): void;
  (e: "openReturnForm"): void;
  (e: "cancelReturnForm"): void;
  (e: "cancelReturnForm"): void;
}>();

const isStaffReturn = computed(
  () => String(props.role) === "staff" && String(props.mode) === "return",
);
const isStaffReturnFormOpen = computed(
  () => isStaffReturn.value && String(route.query.step || "") === "form",
);

// สถานะ
const statusText = computed(() => {
  if (isStaffReturn.value) return "สื่อกำลังถูกยืม";
  return props.remain > 0 ? "พร้อมยืม" : "ไม่พร้อมยืม";
});
const statusColor = computed(() => {
  if (isStaffReturn.value) return "neutral";
  return props.remain > 0 ? "success" : "neutral";
});

// description toggle
const isDescExpanded = ref(false);
const isDescTruncatable = computed(
  () => (props.description?.length ?? 0) > 140,
);

const toggleDesc = () => {
  if (!isDescTruncatable.value) return;
  isDescExpanded.value = !isDescExpanded.value;
};
</script>

<style scoped>
.tags-scroll {
  scrollbar-width: none;
}

.tags-scroll::-webkit-scrollbar {
  display: none;
}
</style>