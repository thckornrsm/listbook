<template>
    <div class="min-h-dvh bg-slate-100">
        <!-- Top bar -->
        <div class="sticky top-0 z-20 flex h-14 items-center bg-[#ED7E24] px-4 text-white">
            <button type="button" class="mr-3 grid h-10 w-10 place-items-center rounded-full active:opacity-90"
                @click="router.back()" aria-label="Back">
                <span class="text-2xl leading-none">‹</span>
            </button>

            <div class="flex-1 text-center text-base font-semibold">รายละเอียดการจอง</div>
            <div class="h-10 w-10"></div>
        </div>

        <div class="mx-auto w-full max-w-md px-4 py-4">
            <!-- Card -->
            <div class="rounded-2xl bg-white p-5 shadow-sm">
                <!-- rings + icon -->
                <div class="flex justify-center">
                    <div class="relative grid place-items-center">
                        <div class="h-44 w-44 rounded-full bg-[rgba(143,235,137,0.2)]"></div>
                        <div class="absolute grid h-28 w-28 place-items-center rounded-full bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82" fill="none"
                                class="h-14 w-14 text-[#0B8D6E]" aria-hidden="true">
                                <path
                                    d="M75.1668 37.8566V40.9999C75.1626 48.3677 72.7769 55.5368 68.3654 61.4378C63.9539 67.3389 57.753 71.6559 50.6876 73.7449C43.6222 75.834 36.0708 75.5831 29.1596 73.0298C22.2484 70.4764 16.3477 65.7575 12.3376 59.5766C8.32749 53.3957 6.42278 46.0842 6.90756 38.7324C7.39233 31.3805 10.2406 24.3824 15.0276 18.7816C19.8146 13.1808 26.2838 9.2775 33.4705 7.65378C40.6571 6.03005 48.1761 6.77293 54.906 9.77161"
                                    stroke="#0B8D6E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M75.1667 13.6667L41 47.8676L30.75 37.6176" stroke="#0B8D6E" stroke-width="7"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </div>
                    </div>
                </div>

                <h2 class="mt-6 text-center text-xl font-extrabold" style="color: #0B8D6E;">
                    ยืนยันการจองยืม
                </h2>

                <!-- Detail rows -->
                <div class="mt-5 space-y-3 text-sm">
                    <div class="row">
                        <div class="label">รหัสการจอง</div>
                        <div class="value">TH00001</div>
                    </div>

                    <div class="row">
                        <div class="label">วัตถุประสงค์</div>
                        <div class="value">กิจกรรมภายใน</div>
                    </div>

                    <div class="row">
                        <div class="label">กลุ่มเป้าหมาย</div>
                        <div class="value">นักเรียน</div>
                    </div>

                    <div class="row">
                        <div class="label">จำนวน</div>
                        <div class="value">1 ชิ้น</div>
                    </div>

                    <div class="row">
                        <div class="label">ระยะเวลา</div>
                        <div class="value">10 วัน</div>
                    </div>

                    <div class="row">
                        <div class="label">สถานที่</div>
                        <div class="value">โซน A ชั้น 2 (มุมสื่อสิ่งพิมพ์)</div>
                    </div>
                </div>

                <!-- extra info box -->
                <div class="mt-4">
                    <div class="mb-2 px-3 text-sm font-semibold text-slate-600">ข้อมูลเพิ่มเติม</div>
                    <div class="h-20 w-full rounded-xl border border-dashed border-slate-200 bg-slate-50"></div>
                </div>

                <!-- button -->
                <button type="button"
                    class="mt-5 h-14 w-full rounded-2xl bg-[#0B8D6E] text-lg font-semibold text-white shadow-sm active:scale-[0.99]"
                    @click="onDone">
                    เสร็จสิ้น
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()

const onDone = () => {
    // ปรับปลายทางตาม flow ของคุณ
    router.push('/borrow/success')
}
</script>

<style scoped>
.row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 10px;
    padding: 12px 12px;
    border-bottom: 1px dashed #e2e8f0;
}

.label {
    color: rgba(98, 116, 142, 1);
    font-weight: 600;
}

.value {
    color: #0f172a;
    font-weight: 700;
    text-align: right;
    max-width: 60%;
}
</style>
