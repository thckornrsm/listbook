<template>
  <main class="bg-white font-[Kanit]">
    <!-- Header -->
    <div
      class="-mx-6 md:-mx-10 mb-5 flex flex-col gap-4 border-b border-slate-200 px-6 md:px-10 pb-4 md:flex-row md:items-start md:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-semibold text-slate-800">ยืม-คืนสื่อการเรียนรู้</h1>
        <p class="mt-1 text-sm text-slate-500">รายการทำธุรกรรมยืม-คืนทั้งหมด</p>
      </div>

      <MediaHeaderActions
        export-label="นำข้อมูลออก"
        create-label="สร้างรายการ"
        @export="handleExport"
        @create="handleCreate"
      />
    </div>

    <div class="mx-auto max-w-6xl">
      <!-- Search + Filter -->
      <div class="-mx-8 px-8">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <MediaSearchFilter
              v-model:search="searchQuery"
              search-placeholder="ค้นหา (รหัสผู้สมาชิก/ชื่อ/สถานที่/วัตถุประสงค์)"
            />
          </div>

          <MediaSelect
            :category="statusValueToThaiFilter(selectedStatus)"
            @update:category="(v) => (selectedStatus = statusThaiToValueFilter(String(v)))"
            :items="statusThaiItems"
            placeholder="สถานะ"
          />

          <!-- ✅ Columns dropdown (เหมือนใน purpose.vue) -->
          <MediaColumnToggle :table-ref="table" :exclude="['select','actions']" />
        </div>
      </div>

      <!-- Table -->
      <section class="mb-6 mt-6 -mx-8 px-8">
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <MediaHQTable
            ref="table"
            v-model:rowSelection="rowSelection"
            :columns="columns"
            :items="paginatedItems"
            @edit="handleEdit"
            @delete="handleDelete"
          />

          <!-- Footer -->
          <div
            class="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between"
          >
            <span>{{ selectedCount }} of {{ totalItems }} row(s) selected.</span>
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- =========================
         CREATE MODAL
    ========================== -->
    <CrudFormModal
      v-model:open="openCreate"
      title="สร้างรายการยืม-คืน"
      description="กรอกข้อมูลเพื่อสร้างรายการใหม่"
      submit-text="บันทึก"
      @submit="submitCreate"
    >
      <div class="space-y-4">
        <UFormField label="วันที่ทำรายการ" :error="formTxnAtError">
          <UInput
            v-model="formTxnAt"
            size="xl"
            placeholder="เช่น 10 ก.พ. 2569 09:10"
            class="w-full"
            :ui="inputUiByError(!!formTxnAtError)"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="รหัสผู้สมาชิก" :error="formUserCodeError">
            <UInput
              v-model="formUserCode"
              size="xl"
              placeholder="เช่น USER-9921"
              class="w-full"
              :ui="inputUiByError(!!formUserCodeError)"
            />
          </UFormField>

          <UFormField label="ชื่อ-นามสกุล" :error="formFullNameError">
            <UInput
              v-model="formFullName"
              size="xl"
              placeholder="เช่น สมศักดิ์ รักดี"
              class="w-full"
              :ui="inputUiByError(!!formFullNameError)"
            />
          </UFormField>
        </div>

        <UFormField label="วัตถุประสงค์" :error="formPurposeError">
          <UInput
            v-model="formPurpose"
            size="xl"
            placeholder="เช่น อบรมเยาวชน"
            class="w-full"
            :ui="inputUiByError(!!formPurposeError)"
          />
        </UFormField>

        <UFormField label="วัตถุประสงค์ (อธิบายเพิ่มเติม)" :error="formPurposeDetailError">
          <UTextarea
            v-model="formPurposeDetail"
            :rows="3"
            placeholder="อธิบายเพิ่มเติม เช่น กลุ่มเป้าหมาย/หัวข้อกิจกรรม/สิ่งที่ต้องการสื่อสาร"
            class="w-full"
            :ui="textareaUiByError(!!formPurposeDetailError)"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="จำนวนผู้เรียน" :error="formLearnerCountError">
            <UInput
              v-model="formLearnerCountText"
              size="xl"
              placeholder="เช่น 30"
              class="w-full"
              :ui="inputUiByError(!!formLearnerCountError)"
            />
          </UFormField>

          <UFormField label="ประเภทผู้รับสื่อ" :error="formReceiverTypeError">
            <UInput
              v-model="formReceiverType"
              size="xl"
              placeholder="เช่น นักเรียนประถม"
              class="w-full"
              :ui="inputUiByError(!!formReceiverTypeError)"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="กลุ่มเป้าหมาย" :error="formTargetGroupError">
            <UInput
              v-model="formTargetGroup"
              size="xl"
              placeholder="เช่น เยาวชน/นักเรียน"
              class="w-full"
              :ui="inputUiByError(!!formTargetGroupError)"
            />
          </UFormField>

          <UFormField label="ระบุสถานที่" :error="formLocationError">
            <UInput
              v-model="formLocation"
              size="xl"
              placeholder="เช่น รพ.สต. บ้านหนองใหญ่"
              class="w-full"
              :ui="inputUiByError(!!formLocationError)"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="วันที่ยืมสื่อ" :error="formBorrowDateError">
            <UPopover v-model:open="borrowCalendarOpen">
              <UButton
                variant="outline"
                size="xl"
                class="w-full justify-start font-normal"
                :class="formBorrowDateError ? 'border-red-500 text-red-600' : 'border-slate-300 text-slate-700'"
                icon="i-heroicons-calendar-days-20-solid"
              >
                {{ formatDisplayDate(formBorrowDate) }}
              </UButton>
              <template #content>
                <UCalendar v-model="calendarBorrowDate" class="p-2" />
              </template>
            </UPopover>
          </UFormField>

          <UFormField label="วันที่คาดว่าจะคืน" :error="formExpectedReturnDateError">
            <UPopover v-model:open="expectedReturnCalendarOpen">
              <UButton
                variant="outline"
                size="xl"
                class="w-full justify-start font-normal"
                :class="formExpectedReturnDateError ? 'border-red-500 text-red-600' : 'border-slate-300 text-slate-700'"
                icon="i-heroicons-calendar-days-20-solid"
              >
                {{ formatDisplayDate(formExpectedReturnDate) }}
              </UButton>
              <template #content>
                <UCalendar v-model="calendarExpectedReturnDate" :is-date-unavailable="isExpectedReturnUnavailable" class="p-2" />
              </template>
            </UPopover>
          </UFormField>
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะ</div>
          <USelect
            :model-value="statusValueToThaiForm(formStatus)"
            @update:model-value="(v: string) => (formStatus = statusThaiToValueForm(v))"
            :items="statusChoiceItems"
            class="w-full"
            :ui="selectUi"
          />
          <div v-if="formStatus === 'returned'" class="mt-2 text-xs text-slate-500">
            ถ้าเลือก “คืนแล้ว” ระบบจะตั้ง “วันที่คืน” เป็นวันนี้ให้อัตโนมัติ
          </div>
        </div>

        <UFormField label="หมายเหตุ" :error="formRemarkError">
          <UTextarea
            v-model="formRemark"
            :rows="3"
            placeholder="เช่น ฝากคืนที่เคาน์เตอร์ / ผู้รับสื่อเป็นตัวแทนห้อง"
            class="w-full"
            :ui="textareaUiByError(!!formRemarkError)"
          />
        </UFormField>
      </div>
    </CrudFormModal>

    <!-- =========================
         EDIT MODAL
    ========================== -->
    <CrudFormModal
      v-model:open="openEdit"
      title="แก้ไขรายการยืม-คืน"
      description="แก้ไขข้อมูล (ถ้าเลือก 'คืนแล้ว' ระบบใส่วันที่คืนเป็นวันนี้ให้อัตโนมัติ)"
      submit-text="บันทึก"
      @submit="submitEdit"
    >
      <div class="space-y-4">
        <UFormField label="วันที่ทำรายการ" :error="formTxnAtError">
          <UInput v-model="formTxnAt" size="xl" class="w-full" :ui="inputUiByError(!!formTxnAtError)" />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="รหัสผู้สมาชิก" :error="formUserCodeError">
            <UInput v-model="formUserCode" size="xl" class="w-full" :ui="inputUiByError(!!formUserCodeError)" />
          </UFormField>

          <UFormField label="ชื่อ-นามสกุล" :error="formFullNameError">
            <UInput v-model="formFullName" size="xl" class="w-full" :ui="inputUiByError(!!formFullNameError)" />
          </UFormField>
        </div>

        <UFormField label="วัตถุประสงค์" :error="formPurposeError">
          <UInput v-model="formPurpose" size="xl" class="w-full" :ui="inputUiByError(!!formPurposeError)" />
        </UFormField>

        <UFormField label="วัตถุประสงค์ (อธิบายเพิ่มเติม)" :error="formPurposeDetailError">
          <UTextarea
            v-model="formPurposeDetail"
            :rows="3"
            class="w-full"
            :ui="textareaUiByError(!!formPurposeDetailError)"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="จำนวนผู้เรียน" :error="formLearnerCountError">
            <UInput v-model="formLearnerCountText" size="xl" class="w-full" :ui="inputUiByError(!!formLearnerCountError)" />
          </UFormField>

          <UFormField label="ประเภทผู้รับสื่อ" :error="formReceiverTypeError">
            <UInput v-model="formReceiverType" size="xl" class="w-full" :ui="inputUiByError(!!formReceiverTypeError)" />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="กลุ่มเป้าหมาย" :error="formTargetGroupError">
            <UInput v-model="formTargetGroup" size="xl" class="w-full" :ui="inputUiByError(!!formTargetGroupError)" />
          </UFormField>

          <UFormField label="ระบุสถานที่" :error="formLocationError">
            <UInput v-model="formLocation" size="xl" class="w-full" :ui="inputUiByError(!!formLocationError)" />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="วันที่ยืมสื่อ" :error="formBorrowDateError">
            <UPopover v-model:open="borrowCalendarOpen">
              <UButton
                variant="outline"
                size="xl"
                class="w-full justify-start font-normal"
                :class="formBorrowDateError ? 'border-red-500 text-red-600' : 'border-slate-300 text-slate-700'"
                icon="i-heroicons-calendar-days-20-solid"
              >
                {{ formatDisplayDate(formBorrowDate) }}
              </UButton>
              <template #content>
                <UCalendar v-model="calendarBorrowDate" class="p-2" />
              </template>
            </UPopover>
          </UFormField>

          <UFormField label="วันที่คาดว่าจะคืน" :error="formExpectedReturnDateError">
            <UPopover v-model:open="expectedReturnCalendarOpen">
              <UButton
                variant="outline"
                size="xl"
                class="w-full justify-start font-normal"
                :class="formExpectedReturnDateError ? 'border-red-500 text-red-600' : 'border-slate-300 text-slate-700'"
                icon="i-heroicons-calendar-days-20-solid"
              >
                {{ formatDisplayDate(formExpectedReturnDate) }}
              </UButton>
              <template #content>
                <UCalendar v-model="calendarExpectedReturnDate" :is-date-unavailable="isExpectedReturnUnavailable" class="p-2" />
              </template>
            </UPopover>
          </UFormField>
        </div>

        <div>
          <div class="mb-2 text-sm font-semibold text-slate-900">สถานะ</div>
          <USelect
            :model-value="statusValueToThaiForm(formStatus)"
            @update:model-value="(v: string) => (formStatus = statusThaiToValueForm(v))"
            :items="statusChoiceItems"
            class="w-full"
            :ui="selectUi"
          />
          <div v-if="formStatus === 'returned'" class="mt-2 text-xs text-slate-500">
            ถ้าเลือก “คืนแล้ว” ระบบจะตั้ง “วันที่คืน” เป็นวันนี้ให้อัตโนมัติ
          </div>
        </div>

        <UFormField label="หมายเหตุ" :error="formRemarkError">
          <UTextarea v-model="formRemark" :rows="3" class="w-full" :ui="textareaUiByError(!!formRemarkError)" />
        </UFormField>
      </div>
    </CrudFormModal>

    <!-- =========================
         DUPLICATE MODAL
    ========================== -->
    <CrudFormModal
      v-model:open="openDuplicate"
      title="ทำสำเนารายการ"
      description="ระบบจะสร้างรายการใหม่จากรายการเดิม (และกันซ้ำให้)"
      submit-text="สร้างสำเนา"
      @submit="submitDuplicate"
    >

<div class="space-y-4">

  <UFormField label="วันที่ทำรายการ" :error="formTxnAtError">
    <UInput v-model="formTxnAt" size="xl" class="w-full" :ui="inputUiByError(!!formTxnAtError)" />
  </UFormField>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <UFormField label="รหัสผู้สมาชิก" :error="formUserCodeError">
      <UInput v-model="formUserCode" size="xl" class="w-full" :ui="inputUiByError(!!formUserCodeError)" />
    </UFormField>

    <UFormField label="ชื่อ-นามสกุล" :error="formFullNameError">
      <UInput v-model="formFullName" size="xl" class="w-full" :ui="inputUiByError(!!formFullNameError)" />
    </UFormField>
  </div>

  <UFormField label="วัตถุประสงค์" :error="formPurposeError">
    <UInput v-model="formPurpose" size="xl" class="w-full" :ui="inputUiByError(!!formPurposeError)" />
  </UFormField>

  <UFormField label="วัตถุประสงค์ (อธิบายเพิ่มเติม)" :error="formPurposeDetailError">
    <UTextarea
      v-model="formPurposeDetail"
      :rows="3"
      class="w-full"
      :ui="textareaUiByError(!!formPurposeDetailError)"
    />
  </UFormField>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <UFormField label="จำนวนผู้เรียน" :error="formLearnerCountError">
      <UInput v-model="formLearnerCountText" size="xl" class="w-full" :ui="inputUiByError(!!formLearnerCountError)" />
    </UFormField>

    <UFormField label="ประเภทผู้รับสื่อ" :error="formReceiverTypeError">
      <UInput v-model="formReceiverType" size="xl" class="w-full" :ui="inputUiByError(!!formReceiverTypeError)" />
    </UFormField>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <UFormField label="กลุ่มเป้าหมาย" :error="formTargetGroupError">
      <UInput v-model="formTargetGroup" size="xl" class="w-full" :ui="inputUiByError(!!formTargetGroupError)" />
    </UFormField>

    <UFormField label="ระบุสถานที่" :error="formLocationError">
      <UInput v-model="formLocation" size="xl" class="w-full" :ui="inputUiByError(!!formLocationError)" />
    </UFormField>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <UFormField label="วันที่ยืมสื่อ" :error="formBorrowDateError">
      <UPopover v-model:open="borrowCalendarOpen">
        <UButton
          variant="outline"
          size="xl"
          class="w-full justify-start font-normal"
          :class="formBorrowDateError ? 'border-red-500 text-red-600' : 'border-slate-300 text-slate-700'"
          icon="i-heroicons-calendar-days-20-solid"
        >
          {{ formatDisplayDate(formBorrowDate) }}
        </UButton>
        <template #content>
          <UCalendar v-model="calendarBorrowDate" class="p-2" />
        </template>
      </UPopover>
    </UFormField>

    <UFormField label="วันที่คาดว่าจะคืน" :error="formExpectedReturnDateError">
      <UPopover v-model:open="expectedReturnCalendarOpen">
        <UButton
          variant="outline"
          size="xl"
          class="w-full justify-start font-normal"
          :class="formExpectedReturnDateError ? 'border-red-500 text-red-600' : 'border-slate-300 text-slate-700'"
          icon="i-heroicons-calendar-days-20-solid"
        >
          {{ formatDisplayDate(formExpectedReturnDate) }}
        </UButton>
        <template #content>
          <UCalendar v-model="calendarExpectedReturnDate" :is-date-unavailable="isExpectedReturnUnavailable" class="p-2" />
        </template>
      </UPopover>
    </UFormField>
  </div>

  <div>
    <div class="mb-2 text-sm font-semibold text-slate-900">สถานะ</div>
    <USelect
      :model-value="statusValueToThaiForm(formStatus)"
      @update:model-value="(v: string) => (formStatus = statusThaiToValueForm(v))"
      :items="statusChoiceItems"
      class="w-full"
      :ui="selectUi"
    />
    <div v-if="formStatus === 'returned'" class="mt-2 text-xs text-slate-500">
      ถ้าเลือก “คืนแล้ว” ระบบจะตั้ง “วันที่คืน” เป็นวันนี้ให้อัตโนมัติ
    </div>
  </div>

  <UFormField label="หมายเหตุ" :error="formRemarkError">
    <UTextarea v-model="formRemark" :rows="3" class="w-full" :ui="textareaUiByError(!!formRemarkError)" />
  </UFormField>
</div>
    </CrudFormModal>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, h, resolveComponent, watch } from 'vue'
import { type DateValue, CalendarDate, parseDate, today, getLocalTimeZone } from '@internationalized/date'
import { z } from 'zod'
import type { TableColumn, SelectMenuItem } from '@nuxt/ui'

import Pagination from '~/components/Pagination.vue'
import MediaHQTable from '~/components/learning-materials/MediaHQTable.vue'
import MediaSearchFilter from '~/components/learning-materials/MediaSearchFilter.vue'
import MediaHeaderActions from '~/components/learning-materials/MediaHeaderActions.vue'
import MediaFilter from '~/components/learning-materials/MediaFilter.vue'
import MediaColumnToggle from '~/components/learning-materials/MediaColumnToggle.vue'
import CrudFormModal from '~/components/common/CrudFormModal.vue'
import MediaSelect from '~/components/learning-materials/MediaSelect.vue'

definePageMeta({ layout: 'learning-materials' })

type RowSelectionState = Record<string, boolean>

// ✅ table ref for MediaColumnToggle (เหมือนใน purpose.vue)
const table = ref<any>(null)

/** เก็บค่าอังกฤษ แต่แสดงไทย */
type BorrowStatus = 'borrowing' | 'handover' | 'returned' | 'overdue'

type BorrowReturnRow = {
  id: number

  // main columns
  txnAt: string // แสดงในตาราง (text)
  userCode: string
  fullName: string
  purpose: string
  purposeDetail: string
  learnerCount: number
  receiverType: string
  targetGroup: string
  location: string
  borrowDate: string // YYYY-MM-DD
  expectedReturnDate: string // YYYY-MM-DD
  returnDate?: string | null // YYYY-MM-DD | null
  remark: string

  // status (english)
  status: Exclude<BorrowStatus, 'overdue'> // เก็บฐานสถานะ (ไม่ต้องเก็บ overdue) แต่ render จะ derive ให้เอง

  // audit columns
  createdAt: string // ISO datetime
  createdBy: string
  updatedAt: string // ISO datetime
  updatedBy: string
}

// Nuxt UI components
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UInput = resolveComponent('UInput')
const UTextarea = resolveComponent('UTextarea')
const UFormField = resolveComponent('UFormField')
const USelectMenu = resolveComponent('USelectMenu')

// ===== UI helpers (เหมือน purpose.vue) =====
const inputUiNormal = {
  base: 'w-full',
  rounded: 'rounded-2xl',
  color: {
    white: {
      outline:
        'bg-white ring-1 ring-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#ED7E24]'
    }
  }
} as const

const inputUiError = {
  base: 'w-full',
  rounded: 'rounded-2xl',
  color: {
    white: {
      outline: 'bg-white ring-1 ring-red-400 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500'
    }
  }
} as const

const textareaUiNormal = {
  base: 'w-full',
  rounded: 'rounded-2xl',
  color: {
    white: {
      outline:
        'bg-white ring-1 ring-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#ED7E24]'
    }
  }
} as const

const textareaUiError = {
  base: 'w-full',
  rounded: 'rounded-2xl',
  color: {
    white: {
      outline: 'bg-white ring-1 ring-red-400 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500'
    }
  }
} as const

function inputUiByError(hasError: boolean) {
  return hasError ? inputUiError : inputUiNormal
}
function textareaUiByError(hasError: boolean) {
  return hasError ? textareaUiError : textareaUiNormal
}

const selectUi = {
  rounded: 'rounded-2xl',
  base: 'w-full',
  ring: 'ring-1 ring-slate-200 focus:ring-2 focus:ring-[#ED7E24]'
} as const

// ===== Date utils (แนวเดียวกับ purpose.vue) =====
function pad2(n: number) {
  return String(n).padStart(2, '0')
}
function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
function parseISODate(iso: string | null | undefined) {
  if (!iso) return null
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const da = Number(m[3])
  const dt = new Date(y, mo, da)
  if (Number.isNaN(dt.getTime())) return null
  return dt
}
function formatThaiBuddhistDate(isoDate: string) {
  // รับ YYYY-MM-DD -> แสดง dd/mm/yyyy(พ.ศ.)
  const d = parseISODate(isoDate)
  if (!d) return '-'
  const day = pad2(d.getDate())
  const mon = pad2(d.getMonth() + 1)
  const buddhistYear = d.getFullYear() + 543
  return `${day}/${mon}/${buddhistYear}`
}
function formatThaiBuddhistDateTime(isoDateTime: string) {
  // รับ ISO datetime -> แสดง dd/mm/yyyy(พ.ศ.) HH:MM
  const dt = new Date(isoDateTime)
  if (Number.isNaN(dt.getTime())) return '-'
  const day = pad2(dt.getDate())
  const mon = pad2(dt.getMonth() + 1)
  const buddhistYear = dt.getFullYear() + 543
  const hh = pad2(dt.getHours())
  const mm = pad2(dt.getMinutes())
  return `${day}/${mon}/${buddhistYear} ${hh}:${mm}`
}

const todayISO = computed(() => toISODate(new Date()))

function diffDays(startISO: string, endISO: string) {
  const s = parseISODate(startISO)
  const e = parseISODate(endISO)
  if (!s || !e) return null
  const ms = e.getTime() - s.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

// ===== Status mapping (เหมือน purpose.vue) =====
function statusValueToThai(value: BorrowStatus) {
  if (value === 'borrowing') return 'กำลังยืม'
  if (value === 'handover') return 'มอบให้ไปแล้ว'
  if (value === 'returned') return 'คืนแล้ว'
  if (value === 'overdue') return 'เกินกำหนด'
  return 'กำลังยืม'
}
function statusThaiToValue(label: string): BorrowStatus {
  if (label === 'กำลังยืม') return 'borrowing'
  if (label === 'มอบให้ไปแล้ว') return 'handover'
  if (label === 'คืนแล้ว') return 'returned'
  if (label === 'เกินกำหนด') return 'overdue'
  return 'borrowing'
}

// ===== normalize + validation (แนวเดียวกับ purpose.vue) =====
function normalize(s: string) {
  return String(s ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function validateRequiredText(value: string, label: string, minLen = 1) {
  const v = String(value ?? '').trim()
  if (!v) return `กรุณากรอก${label}`
  if (v.length < minLen) return `${label}สั้นเกินไป`
  return undefined
}

function validatePositiveIntText(value: string, label: string) {
  const v = String(value ?? '').trim()
  if (!v) return `กรุณากรอก${label}`
  const n = Number(v)
  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) return `${label}ต้องเป็นจำนวนเต็มมากกว่า 0`
  return undefined
}

function validateIsoDate(value: string, label: string) {
  const d = parseISODate(value)
  if (!d) return `กรุณาเลือก${label}`
  return undefined
}

// ===== Zod schema: validate วันที่คืน >= วันที่ยืม =====
const dateRangeSchema = z
  .object({
    borrowDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'กรุณาเลือกวันที่ยืมสื่อ'),
    expectedReturnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'กรุณาเลือกวันที่คาดว่าจะคืน')
  })
  .refine(
    (data) => {
      const b = parseISODate(data.borrowDate)
      const e = parseISODate(data.expectedReturnDate)
      if (!b || !e) return true // ให้ field-level error จัดการ
      return e.getTime() >= b.getTime()
    },
    {
      message: 'วันที่คาดว่าจะคืนต้องไม่ก่อนวันที่ยืม',
      path: ['expectedReturnDate']
    }
  )

// ===== isDateUnavailable: ล็อค calendar ไม่ให้เลือกก่อนวันยืม =====
const isExpectedReturnUnavailable = (date: DateValue): boolean => {
  if (!formBorrowDate.value) return false
  const borrow = toCalendarDate(formBorrowDate.value)
  if (!borrow) return false
  return date.compare(borrow) < 0
}

// “กันซ้ำ” แบบง่าย: userCode + borrowDate + expectedReturnDate
function isDuplicateTxn(
  draft: Pick<BorrowReturnRow, 'userCode' | 'borrowDate' | 'expectedReturnDate'>,
  excludeId?: number | null
) {
  const key = `${normalize(draft.userCode)}|${draft.borrowDate}|${draft.expectedReturnDate}`
  return allItems.value.some((it) => {
    if (excludeId && it.id === excludeId) return false
    const itKey = `${normalize(it.userCode)}|${it.borrowDate}|${it.expectedReturnDate}`
    return itKey === key
  })
}

// เพิ่ม suffix ให้ userCode กรณีทำ duplicate แล้วชน (เช่น USER-9921-2)
function makeDuplicateUserCode(base: string) {
  const raw = String(base ?? '').trim() || 'USER'
  let i = 2
  let next = `${raw}-${i}`
  const exists = (code: string) => allItems.value.some((x) => normalize(x.userCode) === normalize(code))
  while (exists(next) && i < 9999) {
    i += 1
    next = `${raw}-${i}`
  }
  return next
}

// ===== mock data (ปรับ schema + audit) =====
const allItems = ref<BorrowReturnRow[]>([
  {
    id: 1,
    txnAt: '01 มี.ค. 2569 09:10',
    userCode: 'USER-9921',
    fullName: 'สมศักดิ์ รักดี',
    purpose: 'อบรมเยาวชน',
    purposeDetail: 'ใช้สื่อเพื่ออบรมเรื่องสุขภาพและโภชนาการในชั้นเรียน',
    learnerCount: 30,
    receiverType: 'นักเรียนประถม',
    targetGroup: 'เยาวชน/นักเรียน',
    location: 'รพ.สต. บ้านหนองใหญ่',
    borrowDate: '2026-03-01',
    expectedReturnDate: '2026-03-03',
    returnDate: null,
    remark: 'ฝากคืนที่เคาน์เตอร์',
    status: 'handover',
    createdAt: '2026-03-01T09:10:00',
    createdBy: 'Admin',
    updatedAt: '2026-03-01T09:10:00',
    updatedBy: 'Admin'
  },
  {
    id: 2,
    txnAt: '02 มี.ค. 2569 10:25',
    userCode: 'USER-4452',
    fullName: 'วิภาวรรณ สุขุม',
    purpose: 'ตั้งบูธรณรงค์',
    purposeDetail: 'บูธให้ความรู้ผู้สูงอายุเรื่องการเลือกอาหาร',
    learnerCount: 45,
    receiverType: 'ผู้สูงอายุ',
    targetGroup: 'ผู้สูงอายุ',
    location: 'รพ.สต. คลองสาม',
    borrowDate: '2026-03-02',
    expectedReturnDate: '2026-03-10',
    returnDate: null,
    remark: '-',
    status: 'borrowing',
    createdAt: '2026-03-02T10:25:00',
    createdBy: 'Admin',
    updatedAt: '2026-03-02T10:25:00',
    updatedBy: 'Admin'
  },
  {
    id: 3,
    txnAt: '25 ก.พ. 2569 13:40',
    userCode: 'USER-1100',
    fullName: 'อรทัย วรรณดี',
    purpose: 'จัดกิจกรรมสุขศึกษา',
    purposeDetail: 'กิจกรรมกลุ่มย่อยเรื่องการแปรงฟันและสุขอนามัย',
    learnerCount: 60,
    receiverType: 'นักเรียนมัธยม',
    targetGroup: 'นักเรียนมัธยม',
    location: 'โรงเรียนบ้านทุ่ง',
    borrowDate: '2026-02-25',
    expectedReturnDate: '2026-02-27',
    returnDate: null,
    remark: 'ขอขยายเวลาถ้าจำเป็น',
    // ✅ ตั้งฐานเป็น borrowing แต่ deriveStatus จะคำนวณเป็น overdue ถ้าวันนี้เลยกำหนดแล้ว
    status: 'borrowing',
    createdAt: '2026-02-25T13:40:00',
    createdBy: 'Admin',
    updatedAt: '2026-02-25T13:40:00',
    updatedBy: 'Admin'
  },
  {
    id: 4,
    txnAt: '20 ก.พ. 2569 09:05',
    userCode: 'USER-7788',
    fullName: 'ชาญชัย ใจดี',
    purpose: 'สอนเสริม',
    purposeDetail: 'ใช้สื่อประกอบการสอนเสริมเรื่องโภชนาการ',
    learnerCount: 25,
    receiverType: 'นักเรียนประถม',
    targetGroup: 'เยาวชน/นักเรียน',
    location: 'โรงเรียนวัดกลาง',
    borrowDate: '2026-02-20',
    expectedReturnDate: '2026-02-22',
    returnDate: '2026-02-22',
    remark: 'คืนครบ',
    status: 'returned',
    createdAt: '2026-02-20T09:05:00',
    createdBy: 'Admin',
    updatedAt: '2026-02-22T16:10:00',
    updatedBy: 'Admin'
  }
])

// ===== derive status (คำนวณ overdue) =====
function deriveStatus(it: BorrowReturnRow): BorrowStatus {
  // ถ้าคืนแล้ว ให้คืนแล้วเสมอ
  if (it.status === 'returned') return 'returned'

  const t = parseISODate(todayISO.value)
  const exp = parseISODate(it.expectedReturnDate)
  if (t && exp && t.getTime() > exp.getTime()) return 'overdue'

  // ยังไม่เกิน -> คงสถานะฐาน
  return it.status
}

function borrowDateDisplay(it: BorrowReturnRow) {
  return formatThaiBuddhistDate(it.borrowDate)
}
function expectedReturnDisplay(it: BorrowReturnRow) {
  return formatThaiBuddhistDate(it.expectedReturnDate)
}
function returnDateDisplay(it: BorrowReturnRow) {
  return it.returnDate ? formatThaiBuddhistDate(it.returnDate) : '-'
}

function durationSummary(it: BorrowReturnRow) {
  const d = diffDays(it.borrowDate, it.expectedReturnDate)
  if (d === null) return '-'
  // ถ้ายืมวันเดียวคืนวันเดียว = 0 วัน -> แสดง 1 วันเพื่ออ่านง่าย
  const days = Math.max(1, d + 1)
  return `${days} วัน`
}

// ===== search + filter + pagination =====
const searchQuery = ref('')
const selectedStatus = ref<BorrowStatus | ''>('')

// ✅ status filter (เก็บค่า eng แต่แสดงไทย แบบเดียวกับ purpose.vue)
const statusThaiItems: SelectMenuItem[] = [
  { label: 'ทั้งหมด', value: 'ทั้งหมด' },
  { label: 'กำลังยืม', value: 'กำลังยืม' },
  { label: 'มอบให้ไปแล้ว', value: 'มอบให้ไปแล้ว' },
  { label: 'คืนแล้ว', value: 'คืนแล้ว' },
  { label: 'เกินกำหนด', value: 'เกินกำหนด' }
] as any

const statusValueToThaiFilter = (value: BorrowStatus | ''): string => {
  if (!value) return 'ทั้งหมด'
  return statusValueToThai(value)
}

const statusThaiToValueFilter = (label: string): BorrowStatus | '' => {
  if (label === 'ทั้งหมด') return ''
  return statusThaiToValue(label)
}

const filteredItems = computed(() => {
  const q = normalize(searchQuery.value)
  const statusFilter = selectedStatus.value

  return allItems.value
    .map((it) => ({
      ...it,
      // ข้อมูลเสริมสำหรับ table
      statusView: deriveStatus(it),
      borrowDateText: borrowDateDisplay(it),
      expectedReturnText: expectedReturnDisplay(it),
      returnDateText: returnDateDisplay(it),
      durationText: durationSummary(it),
      createdAtText: formatThaiBuddhistDateTime(it.createdAt),
      updatedAtText: formatThaiBuddhistDateTime(it.updatedAt)
    }))
    .filter((it) => {
      const matchesQuery =
        !q ||
        normalize(it.userCode).includes(q) ||
        normalize(it.fullName).includes(q) ||
        normalize(it.location).includes(q) ||
        normalize(it.purpose).includes(q)

      const matchesStatus = !statusFilter || it.statusView === statusFilter
      return matchesQuery && matchesStatus
    })
})

const pageSize = 8
const currentPage = ref(1)

const totalItems = computed(() => filteredItems.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredItems.value.slice(start, end)
})

function handlePageChange(page: number) {
  currentPage.value = page
}

watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1
})

// ===== row selection =====
const rowSelection = ref<RowSelectionState>({})
const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

// ===== Table columns (เพิ่มครบตามที่ขอ) =====
const columns: TableColumn<any>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox as any, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox as any, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      }),
    meta: { class: { th: 'w-10', td: 'w-10' } }
  },

  // 1) columns ที่ต้องมี
  {
    accessorKey: 'txnAt',
    header: 'วันที่ทำรายการ',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('txnAt')))
  },
  {
    accessorKey: 'userCode',
    header: 'รหัสผู้สมาชิก',
    cell: ({ row }) => h('span', { class: 'text-orange-500 text-[13px]' }, String(row.getValue('userCode')))
  },
  {
    accessorKey: 'fullName',
    header: 'ชื่อ-นามสกุล',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('fullName')))
  },
  {
    accessorKey: 'purpose',
    header: 'วัตถุประสงค์',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('purpose')))
  },
  {
    accessorKey: 'purposeDetail',
    header: 'วัตถุประสงค์(อธิบายเพิ่มเติม)',
    cell: ({ row }) =>
      h('div', { class: 'whitespace-normal break-words leading-5 text-slate-600 text-[13px]' }, String(row.getValue('purposeDetail')))
  },
  {
  accessorKey: 'learnerCount',
  header: () => h('div', { class: 'w-full text-center' }, 'จำนวนผู้เรียน'),
  meta: { class: { th: 'text-center', td: 'text-center' } },
  cell: ({ row }) =>
    h('div', { class: 'w-full text-center text-slate-600 text-[13px]' }, String(row.getValue('learnerCount')))
},
  {
    accessorKey: 'receiverType',
    header: 'ประเภทผู้รับสื่อ',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('receiverType')))
  },
  {
    accessorKey: 'targetGroup',
    header: 'กลุ่มเป้าหมาย',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('targetGroup')))
  },
  {
    accessorKey: 'location',
    header: 'ระบุสถานที่',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('location')))
  },

  // 2) วันที่ยืม/คืน/สรุป
  {
    accessorKey: 'borrowDateText',
    header: 'วันที่ยืมสื่อ',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('borrowDateText')))
  },
  {
    accessorKey: 'expectedReturnText',
    header: 'วันที่คาดว่าจะคืน',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('expectedReturnText')))
  },
  {
    accessorKey: 'durationText',
    header: () => h('div', { class: 'w-full text-center' }, 'สรุประยะเวลาคืน'),
  meta: { class: { th: 'text-center', td: 'text-center' } },
  cell: ({ row }) =>
    h('div', { class: 'w-full text-center text-slate-600 text-[13px]' }, String(row.getValue('durationText')))
},
  {
    accessorKey: 'returnDateText',
    header: 'วันที่คืน',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('returnDateText')))
  },

  // 3) สถานะ (เก็บอังกฤษ แสดงไทย)
  {
    accessorKey: 'statusView',
    header: 'สถานะ',
    cell: ({ row }) => {
      const v = row.getValue('statusView') as BorrowStatus
      const label = statusValueToThai(v)

      const map = {
        borrowing: { color: 'info' as const },
        handover: { color: 'warning' as const },
        returned: { color: 'success' as const },
        overdue: { color: 'error' as const }
      } as const

      const m = map[v] ?? { color: 'neutral' as const }
      return h(UBadge as any, { variant: 'subtle', color: m.color }, () => label)
    }
  },

  // 4) หมายเหตุ
  {
    accessorKey: 'remark',
    header: 'หมายเหตุ',
    cell: ({ row }) =>
      h('div', { class: 'whitespace-normal break-words leading-5 text-slate-600 text-[13px]' }, String(row.getValue('remark')))
  },

  // 5) เพิ่ม audit columns ตามที่ขอ
  {
    accessorKey: 'createdAtText',
    header: 'วันที่สร้าง',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('createdAtText')))
  },
  {
    accessorKey: 'createdBy',
    header: 'สร้างโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('createdBy')))
  },
  {
    accessorKey: 'updatedAtText',
    header: 'วันที่อัปเดต',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-[13px]' }, String(row.getValue('updatedAtText')))
  },
  {
    accessorKey: 'updatedBy',
    header: 'อัปเดตโดย',
    cell: ({ row }) => h('span', { class: 'text-slate-600 text-[13px]' }, String(row.getValue('updatedBy')))
  },

  // actions
  {
      id: 'actions',
      header: 'จัดการ',
      meta: { class: { th: 'text-center', td: 'text-center' } },
      cell: ({ row }) => {
        const id = row.original.id

        const items = [
          [
            { label: 'สร้างซ้ำ', icon: 'i-heroicons-clipboard-20-solid', onSelect: () => handleDuplicate(id) }
          ],
          [
            { label: 'ลบออก', icon: 'i-heroicons-trash-20-solid', onSelect: () => handleDelete(id), class: 'text-red-600' }
          ]
        ]

        return h('div', { class: 'flex justify-center items-center gap-1' }, [
          h(UButton as any, {
            icon: 'i-heroicons-pencil-square-20-solid',
            variant: 'ghost',
            color: 'neutral',
            class: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg',
            'aria-label': 'Edit',
            onClick: () => handleEdit(id)
          }),
          h(
            UDropdownMenu as any,
            { items, content: { align: 'end' }, ui: { content: 'w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1' } },
            () =>
              h(UButton as any, {
                icon: 'i-heroicons-ellipsis-vertical-20-solid',
                variant: 'ghost',
                color: 'neutral',
                class: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg',
                'aria-label': 'More actions'
              })
          )
        ])
      }
    }
]

// ===== header actions =====
function handleExport() {
  // ทำตามระบบจริงได้ภายหลัง (ตอนนี้ทำ demo เหมือนเดิม)
  if (import.meta.client) console.log('export borrow-return', allItems.value)
}

// ===== CRUD states (เหมือน purpose.vue) =====
const openCreate = ref(false)
const openEdit = ref(false)
const openDuplicate = ref(false)

const editingId = ref<number | null>(null)
const duplicatingId = ref<number | null>(null)

// ===== form models =====
const formTxnAt = ref('')
const formUserCode = ref('')
const formFullName = ref('')
const formPurpose = ref('')
const formPurposeDetail = ref('')
const formLearnerCountText = ref('') // เก็บเป็น string ใน form
const formReceiverType = ref('')
const formTargetGroup = ref('')
const formLocation = ref('')
const formBorrowDate = ref('')
const formExpectedReturnDate = ref('')
const formStatus = ref<Exclude<BorrowStatus, 'overdue'>>('borrowing')

// ===== Calendar popover open states =====
const borrowCalendarOpen = ref(false)
const expectedReturnCalendarOpen = ref(false)

// ===== CalendarDate <-> string (YYYY-MM-DD) helpers =====
function toCalendarDate(iso: string): CalendarDate | undefined {
  if (!iso) return undefined
  try { return parseDate(iso) as CalendarDate } catch { return undefined }
}
function fromCalendarDate(d: CalendarDate | undefined): string {
  if (!d) return ''
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}
function formatDisplayDate(iso: string): string {
  if (!iso) return 'เลือกวันที่'
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return 'เลือกวันที่'
  const buddhistYear = Number(y) + 543
  const monthNamesTh = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  return `${Number(d)} ${monthNamesTh[Number(m) - 1]} ${buddhistYear}`
}

const calendarBorrowDate = computed({
  get: () => toCalendarDate(formBorrowDate.value),
  set: (v) => {
    formBorrowDate.value = fromCalendarDate(v)
    borrowCalendarOpen.value = false
  }
})
const calendarExpectedReturnDate = computed({
  get: () => toCalendarDate(formExpectedReturnDate.value),
  set: (v) => {
    formExpectedReturnDate.value = fromCalendarDate(v)
    expectedReturnCalendarOpen.value = false
  }
})

// ===== watch borrowDate: ถ้าเปลี่ยนแล้วทำให้ expectedReturn ย้อนหลัง → clear error realtime =====
watch(formBorrowDate, (newBorrow) => {
  if (!formExpectedReturnDate.value) return
  const b = parseISODate(newBorrow)
  const e = parseISODate(formExpectedReturnDate.value)
  if (b && e && e.getTime() < b.getTime()) {
    formExpectedReturnDate.value = ''
    formExpectedReturnDateError.value = 'วันที่คาดว่าจะคืนต้องไม่ก่อนวันที่ยืม'
  } else {
    formExpectedReturnDateError.value = undefined
  }
})
const formRemark = ref('')

// ===== form errors =====
const formTxnAtError = ref<string | undefined>()
const formUserCodeError = ref<string | undefined>()
const formFullNameError = ref<string | undefined>()
const formPurposeError = ref<string | undefined>()
const formPurposeDetailError = ref<string | undefined>()
const formLearnerCountError = ref<string | undefined>()
const formReceiverTypeError = ref<string | undefined>()
const formTargetGroupError = ref<string | undefined>()
const formLocationError = ref<string | undefined>()
const formBorrowDateError = ref<string | undefined>()
const formExpectedReturnDateError = ref<string | undefined>()
const formRemarkError = ref<string | undefined>()

const statusChoiceItems = ref<string[]>(['กำลังยืม', 'มอบให้ไปแล้ว', 'คืนแล้ว'])

const statusValueToThaiForm = (value: Exclude<BorrowStatus, 'overdue'>): string => statusValueToThai(value)
const statusThaiToValueForm = (label: string): Exclude<BorrowStatus, 'overdue'> => {
  const v = statusThaiToValue(label)
  // ไม่ให้เลือก overdue ในฟอร์ม (overdue เป็นสถานะคำนวณจากกำหนดคืน)
  return v === 'overdue' ? 'borrowing' : (v as Exclude<BorrowStatus, 'overdue'>)
}

function clearFormErrors() {
  formTxnAtError.value = undefined
  formUserCodeError.value = undefined
  formFullNameError.value = undefined
  formPurposeError.value = undefined
  formPurposeDetailError.value = undefined
  formLearnerCountError.value = undefined
  formReceiverTypeError.value = undefined
  formTargetGroupError.value = undefined
  formLocationError.value = undefined
  formBorrowDateError.value = undefined
  formExpectedReturnDateError.value = undefined
  formRemarkError.value = undefined
}

function resetForm() {
  const now = new Date()
  formTxnAt.value = `${pad2(now.getDate())}/${pad2(now.getMonth() + 1)}/${now.getFullYear() + 543} ${pad2(
    now.getHours()
  )}:${pad2(now.getMinutes())}`

  formUserCode.value = ''
  formFullName.value = ''
  formPurpose.value = ''
  formPurposeDetail.value = ''
  formLearnerCountText.value = ''
  formReceiverType.value = ''
  formTargetGroup.value = ''
  formLocation.value = ''
  formBorrowDate.value = todayISO.value
  formExpectedReturnDate.value = todayISO.value
  formStatus.value = 'borrowing'
  formRemark.value = ''
  clearFormErrors()
}

function validateForm() {
  clearFormErrors()

  formTxnAtError.value = validateRequiredText(formTxnAt.value, 'วันที่ทำรายการ', 5)
  formUserCodeError.value = validateRequiredText(formUserCode.value, 'รหัสผู้สมาชิก', 3)
  formFullNameError.value = validateRequiredText(formFullName.value, 'ชื่อ-นามสกุล', 3)
  formPurposeError.value = validateRequiredText(formPurpose.value, 'วัตถุประสงค์', 2)

  // purposeDetail ไม่บังคับมาก แต่ถ้ากรอกให้ไม่น้อยเกินไป
  if (String(formPurposeDetail.value ?? '').trim() && String(formPurposeDetail.value).trim().length < 3) {
    formPurposeDetailError.value = 'อธิบายเพิ่มเติมสั้นเกินไป'
  }

  formLearnerCountError.value = validatePositiveIntText(formLearnerCountText.value, 'จำนวนผู้เรียน')
  formReceiverTypeError.value = validateRequiredText(formReceiverType.value, 'ประเภทผู้รับสื่อ', 2)
  formTargetGroupError.value = validateRequiredText(formTargetGroup.value, 'กลุ่มเป้าหมาย', 2)
  formLocationError.value = validateRequiredText(formLocation.value, 'สถานที่', 2)

  formBorrowDateError.value = validateIsoDate(formBorrowDate.value, 'วันที่ยืมสื่อ')
  formExpectedReturnDateError.value = validateIsoDate(formExpectedReturnDate.value, 'วันที่คาดว่าจะคืน')

  // ===== Zod: validate date range =====
  if (!formBorrowDateError.value && !formExpectedReturnDateError.value) {
    const result = dateRangeSchema.safeParse({
      borrowDate: formBorrowDate.value,
      expectedReturnDate: formExpectedReturnDate.value
    })
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors
      if (errs.borrowDate?.[0]) formBorrowDateError.value = errs.borrowDate[0]
      if (errs.expectedReturnDate?.[0]) formExpectedReturnDateError.value = errs.expectedReturnDate[0]
    }
  }

  // หมายเหตุไม่บังคับ แต่ถ้ากรอกให้ยาวพอ
  if (String(formRemark.value ?? '').trim() && String(formRemark.value).trim().length < 2) {
    formRemarkError.value = 'หมายเหตุสั้นเกินไป'
  }

  const hasError = [
    formTxnAtError.value,
    formUserCodeError.value,
    formFullNameError.value,
    formPurposeError.value,
    formPurposeDetailError.value,
    formLearnerCountError.value,
    formReceiverTypeError.value,
    formTargetGroupError.value,
    formLocationError.value,
    formBorrowDateError.value,
    formExpectedReturnDateError.value,
    formRemarkError.value
  ].some(Boolean)

  return !hasError
}

// ===== handlers (เหมือน purpose.vue) =====
function handleCreate() {
  editingId.value = null
  duplicatingId.value = null
  
  resetForm()
  openCreate.value = true
}

function handleEdit(id: number) {
  const found = allItems.value.find((i) => i.id === id)
  if (!found) return

  editingId.value = id
  duplicatingId.value = null

  // ✅ เหมือน duplicate: เช็ค overdue ผ่าน deriveStatus (เพราะ found.status ไม่เคยเป็น overdue)
  const s = deriveStatus(found)

  formTxnAt.value = found.txnAt
  formUserCode.value = found.userCode
  formFullName.value = found.fullName
  formPurpose.value = found.purpose
  formPurposeDetail.value = found.purposeDetail
  formLearnerCountText.value = String(found.learnerCount)
  formReceiverType.value = found.receiverType
  formTargetGroup.value = found.targetGroup
  formLocation.value = found.location
  formBorrowDate.value = found.borrowDate
  formExpectedReturnDate.value = found.expectedReturnDate

  // ✅ ถ้ารายการถูก derive ว่า overdue → ให้ฟอร์มเริ่มที่ borrowing (เหมือน handleDuplicate)
  formStatus.value = (s === 'overdue' ? 'borrowing' : found.status) as Exclude<BorrowStatus, 'overdue'>

  formRemark.value = found.remark

  clearFormErrors()
  openEdit.value = true
}


function handleDuplicate(id: number) {
  const src = allItems.value.find((i) => i.id === id)
  if (!src) return

  duplicatingId.value = id
  editingId.value = null

  resetForm()

  // ✅ ใช้ derived status เพื่อเช็ค overdue (เพราะ src.status ไม่เคยเป็น overdue)
  const s = deriveStatus(src)

  formUserCode.value = makeDuplicateUserCode(src.userCode)
  formFullName.value = src.fullName
  formPurpose.value = src.purpose
  formPurposeDetail.value = src.purposeDetail
  formLearnerCountText.value = String(src.learnerCount)
  formReceiverType.value = src.receiverType
  formTargetGroup.value = src.targetGroup
  formLocation.value = src.location
  formBorrowDate.value = src.borrowDate
  formExpectedReturnDate.value = src.expectedReturnDate

  // ถ้า src ถูก derive ว่า overdue/returned → ตอน duplicate ให้เริ่ม borrowing
  formStatus.value = (s === 'returned' || s === 'overdue' ? 'borrowing' : src.status) as Exclude<BorrowStatus, 'overdue'>

  formRemark.value = src.remark

  clearFormErrors()
  openDuplicate.value = true
}

function handleDelete(id: number) {
  // แบบเดียวกับไฟล์เดิม: ตอนนี้ลบเลย (ถ้าต้องมี confirm ค่อยเพิ่มภายหลัง)
  allItems.value = allItems.value.filter((x) => x.id !== id)
}

// ===== submit (เหมือน purpose.vue) =====
function submitCreate() {
  if (!validateForm()) return

  const draftKey = {
    userCode: formUserCode.value,
    borrowDate: formBorrowDate.value,
    expectedReturnDate: formExpectedReturnDate.value
  }

  if (isDuplicateTxn(draftKey)) {
    formUserCodeError.value = 'พบรายการซ้ำ (รหัสผู้สมาชิก + ช่วงวันยืม/คืน)'
    return
  }

  const now = new Date()
  const nowISO = now.toISOString()

  const nextId = Math.max(0, ...allItems.value.map((x) => x.id)) + 1
  const learnerCount = Number(formLearnerCountText.value)

  const newRow: BorrowReturnRow = {
    id: nextId,
    txnAt: String(formTxnAt.value).trim(),
    userCode: String(formUserCode.value).trim(),
    fullName: String(formFullName.value).trim(),
    purpose: String(formPurpose.value).trim(),
    purposeDetail: String(formPurposeDetail.value).trim(),
    learnerCount,
    receiverType: String(formReceiverType.value).trim(),
    targetGroup: String(formTargetGroup.value).trim(),
    location: String(formLocation.value).trim(),
    borrowDate: formBorrowDate.value,
    expectedReturnDate: formExpectedReturnDate.value,
    returnDate: formStatus.value === 'returned' ? todayISO.value : null,
    remark: String(formRemark.value).trim() || '-',
    status: formStatus.value,
    createdAt: nowISO,
    createdBy: 'Admin',
    updatedAt: nowISO,
    updatedBy: 'Admin'
  }

  allItems.value = [newRow, ...allItems.value]
  openCreate.value = false
}

function submitEdit() {
  if (!editingId.value) return
  if (!validateForm()) return

  const draftKey = {
    userCode: formUserCode.value,
    borrowDate: formBorrowDate.value,
    expectedReturnDate: formExpectedReturnDate.value
  }

  if (isDuplicateTxn(draftKey, editingId.value)) {
    formUserCodeError.value = 'พบรายการซ้ำ (รหัสผู้สมาชิก + ช่วงวันยืม/คืน)'
    return
  }

  const nowISO = new Date().toISOString()
  const learnerCount = Number(formLearnerCountText.value)

  allItems.value = allItems.value.map((it) => {
    if (it.id !== editingId.value) return it

    const nextReturnDate = formStatus.value === 'returned' ? (it.returnDate ?? todayISO.value) : null

    return {
      ...it,
      txnAt: String(formTxnAt.value).trim(),
      userCode: String(formUserCode.value).trim(),
      fullName: String(formFullName.value).trim(),
      purpose: String(formPurpose.value).trim(),
      purposeDetail: String(formPurposeDetail.value).trim(),
      learnerCount,
      receiverType: String(formReceiverType.value).trim(),
      targetGroup: String(formTargetGroup.value).trim(),
      location: String(formLocation.value).trim(),
      borrowDate: formBorrowDate.value,
      expectedReturnDate: formExpectedReturnDate.value,
      returnDate: nextReturnDate,
      remark: String(formRemark.value).trim() || '-',
      status: formStatus.value,
      updatedAt: nowISO,
      updatedBy: 'Admin'
    }
  })

  openEdit.value = false
  editingId.value = null
}

function submitDuplicate() {
  if (!duplicatingId.value) return

  // ✅ เหมือน purpose.vue: validate + กันซ้ำ ก่อนสร้างรายการใหม่
  if (!validateForm()) return

  const draftKey = {
    userCode: formUserCode.value,
    borrowDate: formBorrowDate.value,
    expectedReturnDate: formExpectedReturnDate.value
  }

  if (isDuplicateTxn(draftKey)) {
    formUserCodeError.value = 'พบรายการซ้ำ (รหัสผู้สมาชิก + ช่วงวันยืม/คืน)'
    return
  }

  const now = new Date()
  const nowISO = now.toISOString()
  const nextId = Math.max(0, ...allItems.value.map((x) => x.id)) + 1
  const learnerCount = Number(formLearnerCountText.value)

  const newRow: BorrowReturnRow = {
    id: nextId,
    txnAt: String(formTxnAt.value).trim(),
    userCode: String(formUserCode.value).trim(),
    fullName: String(formFullName.value).trim(),
    purpose: String(formPurpose.value).trim(),
    purposeDetail: String(formPurposeDetail.value).trim(),
    learnerCount,
    receiverType: String(formReceiverType.value).trim(),
    targetGroup: String(formTargetGroup.value).trim(),
    location: String(formLocation.value).trim(),
    borrowDate: formBorrowDate.value,
    expectedReturnDate: formExpectedReturnDate.value,
    returnDate: formStatus.value === 'returned' ? todayISO.value : null,
    remark: String(formRemark.value).trim() || '-',
    status: formStatus.value,
    createdAt: nowISO,
    createdBy: 'Admin',
    updatedAt: nowISO,
    updatedBy: 'Admin'
  }

  allItems.value = [newRow, ...allItems.value]
  openDuplicate.value = false
  duplicatingId.value = null
}
</script>