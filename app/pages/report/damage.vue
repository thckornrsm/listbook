<template>
    <div class="min-h-dvh bg-slate-100 text-slate-900">
        <!-- Top bar -->
        <div class="sticky top-0 z-20 flex h-14 items-center bg-[#ED7E24] px-4 text-white">
            <button type="button" class="mr-3 grid h-10 w-10 place-items-center rounded-full active:opacity-90"
                @click="router.back()" aria-label="Back">
                <span class="text-2xl leading-none">‹</span>
            </button>

            <div class="flex-1 text-center text-base font-semibold">แจ้งชำรุด/สูญหาย</div>
            <div class="h-10 w-10"></div>
        </div>

        <!-- ✅ Content container -->
        <div class="mx-auto w-full max-w-md px-4 py-4">
            <!-- Main card -->
            <div class="rounded-2xl bg-white p-4 shadow-sm">
                <!-- Search -->
                <div class="mt-1 flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
                    <!-- search icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                        class="shrink-0 text-slate-400">
                        <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                        <path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>

                    <input v-model="q"
                        class="h-full flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        placeholder="ระบุรหัสสินค้า หรือ สแกน" />

                    <!-- qr icon -->
                    <button type="button" class="grid h-9 w-9 shrink-0 place-items-center rounded-lg active:opacity-80"
                        @click="onScan" aria-label="Scan">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M9 4H6a2 2 0 0 0-2 2v3" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
                            <path d="M15 4h3a2 2 0 0 1 2 2v3" stroke="#94A3B8" stroke-width="2"
                                stroke-linecap="round" />
                            <path d="M9 20H6a2 2 0 0 1-2-2v-3" stroke="#94A3B8" stroke-width="2"
                                stroke-linecap="round" />
                            <path d="M15 20h3a2 2 0 0 0 2-2v-3" stroke="#94A3B8" stroke-width="2"
                                stroke-linecap="round" />
                            <path d="M9 9h6v6H9z" stroke="#94A3B8" stroke-width="2" />
                        </svg>
                    </button>
                </div>

                <!-- Dropdown -->
                <div class="mt-4">
                    <div class="text-base font-extrabold text-slate-900">เลือกหัวข้อปัญหา</div>

                    <div class="relative mt-2">
                        <select v-model="topic"
                            class="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 focus:border-[#ED7E24] focus:outline-none focus:ring-2 focus:ring-[#ED7E24]/20">
                            <option value="">-- เลือกปัญหาที่พบ --</option>
                            <option value="damage">อุปกรณ์ชำรุด</option>
                            <option value="lost">อุปกรณ์สูญหาย</option>
                            <option value="missing_parts">อุปกรณ์/อะไหล่ไม่ครบ</option>
                            <option value="other">อื่นๆ</option>
                        </select>

                        <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                fill="none">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Details -->
                <div class="mt-5">
                    <div class="text-base font-extrabold text-slate-900">รายละเอียดความเสียหาย</div>

                    <textarea v-model="detail"
                        class="mt-2 h-32 w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ED7E24] focus:outline-none focus:ring-2 focus:ring-[#ED7E24]/20"
                        placeholder="อธิบายรายละเอียดความเสียหาย...."></textarea>
                </div>

                <!-- Photo -->
                <div class="mt-5">
                    <div class="text-base font-extrabold text-slate-900">รูปถ่ายประกอบ (ถ้ามี)</div>

                    <div class="mt-3">
                        <label
                            class="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#94A3B8] bg-white text-[#62748E]">
                            <!-- camera icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                                fill="none">
                                <path
                                    d="M12.0832 3.3335H7.9165L5.83317 5.8335H3.33317C2.89114 5.8335 2.46722 6.00909 2.15466 6.32165C1.8421 6.63421 1.6665 7.05814 1.6665 7.50016V15.0002C1.6665 15.4422 1.8421 15.8661 2.15466 16.1787C2.46722 16.4912 2.89114 16.6668 3.33317 16.6668H16.6665C17.1085 16.6668 17.5325 16.4912 17.845 16.1787C18.1576 15.8661 18.3332 15.4422 18.3332 15.0002V7.50016C18.3332 7.05814 18.1576 6.63421 17.845 6.32165C17.5325 6.00909 17.1085 5.8335 16.6665 5.8335H14.1665L12.0832 3.3335Z"
                                    stroke="#62748E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path
                                    d="M10 13.3335C11.3807 13.3335 12.5 12.2142 12.5 10.8335C12.5 9.45278 11.3807 8.3335 10 8.3335C8.61929 8.3335 7.5 9.45278 7.5 10.8335C7.5 12.2142 8.61929 13.3335 10 13.3335Z"
                                    stroke="#62748E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            <div class="mt-2 text-sm font-semibold">เพิ่มรูป</div>
                            <input type="file" class="hidden" accept="image/*" multiple @change="onPickFiles" />
                        </label>

                        <!-- previews -->
                        <div v-if="previews.length" class="mt-4 grid grid-cols-3 gap-3">
                            <div v-for="(src, i) in previews" :key="i"
                                class="relative overflow-hidden rounded-xl border border-slate-200">
                                <img :src="src" class="h-24 w-full object-cover" alt="preview" />
                                <button type="button"
                                    class="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white"
                                    @click="removePreview(i)">
                                    ×
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reporter card -->
            <div class="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-4">
                <div class="pb-3 flex items-center gap-3 ">
                    <!-- user icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        class="shrink-0">
                        <path
                            d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                            stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <div class="text-sm font-semibold text-slate-900">ผู้แจ้ง : {{ reporter.name }}</div>
                </div>

                <div class="flex items-center gap-3">
                    <!-- phone icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        class="shrink-0">
                        <path
                            d="M21.9999 16.9201V19.9201C22.0011 20.1986 21.944 20.4743 21.8324 20.7294C21.7209 20.9846 21.5572 21.2137 21.352 21.402C21.1468 21.5902 20.9045 21.7336 20.6407 21.8228C20.3769 21.912 20.0973 21.9452 19.8199 21.9201C16.7428 21.5857 13.7869 20.5342 11.1899 18.8501C8.77376 17.3148 6.72527 15.2663 5.18993 12.8501C3.49991 10.2413 2.44818 7.27109 2.11993 4.1801C2.09494 3.90356 2.12781 3.62486 2.21643 3.36172C2.30506 3.09859 2.4475 2.85679 2.6347 2.65172C2.82189 2.44665 3.04974 2.28281 3.30372 2.17062C3.55771 2.05843 3.83227 2.00036 4.10993 2.0001H7.10993C7.59524 1.99532 8.06572 2.16718 8.43369 2.48363C8.80166 2.80008 9.04201 3.23954 9.10993 3.7201C9.23656 4.68016 9.47138 5.62282 9.80993 6.5301C9.94448 6.88802 9.9736 7.27701 9.89384 7.65098C9.81408 8.02494 9.6288 8.36821 9.35993 8.6401L8.08993 9.9101C9.51349 12.4136 11.5864 14.4865 14.0899 15.9101L15.35993 14.6401C15.6318 14.3712 15.9751 14.1859 16.3491 14.1062C16.723 14.0264 17.112 14.0556 17.4699 14.1901C18.3772 14.5286 19.3199 14.7635 20.2799 14.8901C20.7657 14.9586 21.2093 15.2033 21.5265 15.5776C21.8436 15.9519 22.0121 16.4297 21.9999 16.9201Z"
                            stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <div class="text-sm text-slate-900">{{ reporter.phone }}</div>
                </div>
            </div>

            <!-- Bottom button -->
            <div class="mt-6 pb-6">
                <button type="button"
                    class="h-14 w-full rounded-2xl bg-[#ED7E24] text-lg font-semibold text-white shadow-sm active:scale-[0.99] disabled:opacity-60"
                    :disabled="!canSubmit" @click="onSubmit">
                    ยืนยันข้อมูล
                </button>
            </div>
        </div>

        <!-- Success Modal -->
        <transition name="fade">
            <div v-if="showSuccess" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99999;
      display: grid;
      place-items: center;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      padding: 1rem;
    " @click.self="closeSuccess">
                <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                    <!-- icon -->
                    <div class="flex justify-center">
                        <div class="grid h-28 w-28 place-items-center rounded-full bg-[#FDEFE5]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82" class="h-14 w-14" fill="none">
                                <path
                                    d="M75.1668 37.8566V40.9999C75.1626 48.3677 72.7769 55.5368 68.3654 61.4378C63.9539 67.3389 57.753 71.6559 50.6876 73.7449C43.6222 75.834 36.0708 75.5831 29.1596 73.0298C22.2484 70.4764 16.3477 65.7575 12.3376 59.5766C8.32749 53.3957 6.42278 46.0842 6.90756 38.7324C7.39233 31.3805 10.2406 24.3824 15.0276 18.7816C19.8146 13.1808 26.2838 9.2775 33.4705 7.65378C40.6571 6.03005 48.1761 6.77293 54.906 9.77161"
                                    stroke="#ED7E24" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M75.1667 13.6667L41 47.8676L30.75 37.6176" stroke="#ED7E24" stroke-width="7"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <h3 class="mt-5 text-center text-xl font-extrabold text-slate-900">แจ้งชำรุดเรียบร้อย</h3>

                    <p class="mt-2 text-center text-sm leading-6 text-[#62748E]">
                        ระบบได้บันทึกข้อมูลและส่งแจ้งเตือนไปยังเจ้าหน้าที่แล้ว
                    </p>

                    <div class="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm">
                        <div class="flex items-center justify-between">
                            <div class="text-[#62748E]">Ticket ID :</div>
                            <div class="font-extrabold text-slate-900">{{ successTicketId }}</div>
                        </div>
                        <div class="mt-2 flex items-center justify-between">
                            <div class="text-[#62748E]">สถานะ :</div>
                            <div class="font-extrabold text-[#ED7E24]">{{ successStatus }}</div>
                        </div>
                    </div>

                    <button type="button"
                        class="mt-5 h-14 w-full rounded-2xl bg-[#ED7E24] text-lg font-semibold text-white shadow-sm active:scale-[0.99]"
                        @click="closeSuccess">
                        เสร็จสิ้น
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()

const showSuccess = ref(false)
const successTicketId = ref('TH00001')
const successStatus = ref('รอตรวจสอบ')

const openSuccess = () => {
    showSuccess.value = true
}

const closeSuccess = () => {
    showSuccess.value = false
    // router.push('/somewhere') // ถ้าต้องการนำทางหลังปิด
}

// mock
const reporter = reactive({
    name: 'สมชาย ใจดี',
    phone: '081-234-1234',
})

const q = ref('')
const topic = ref('')
const detail = ref('')
const previews = ref<string[]>([])

const canSubmit = computed(() => {
    const okTopic = topic.value.trim().length > 0
    const okDetail = detail.value.trim().length > 0
    return okTopic && okDetail
})

const onScan = () => {
    console.log('scan clicked')
}

const onPickFiles = (e: Event) => {
    const input = e.target as HTMLInputElement
    const files = input.files
    if (!files?.length) return
    Array.from(files).forEach((f) => previews.value.push(URL.createObjectURL(f)))
    input.value = ''
}

const removePreview = (i: number) => {
    const url = previews.value[i]
    if (url) URL.revokeObjectURL(url)
    previews.value.splice(i, 1)
}

const onSubmit = () => {
    // mock ยิง API สำเร็จแล้ว
    successTicketId.value = 'TH00001'
    successStatus.value = 'รอตรวจสอบ'
    openSuccess()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
