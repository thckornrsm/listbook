<template>
  <div>
    <!-- Header Actions -->
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input 
            type="text" 
            placeholder="ค้นหาประเภทผู้ใช้สื่อ..." 
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          >
          <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      <UButton color="primary" @click="showAddModal = true">
        <template #leading>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </template>
        เพิ่มประเภทผู้ใช้สื่อ
      </UButton>
    </div>

    <!-- User Types Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="userType in userTypes" 
        :key="userType.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <span :class="[
            'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
            userType.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]">
            {{ userType.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
          </span>
        </div>

        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ userType.name }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ userType.description }}</p>
        
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">รหัส:</span>
            <span class="font-medium">{{ userType.code }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">จำนวนผู้ใช้:</span>
            <span class="font-medium">{{ userType.userCount }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">สิทธิ์การยืม:</span>
            <span class="font-medium">{{ userType.maxBooks }} เล่ม</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">ระยะเวลายืม:</span>
            <span class="font-medium">{{ userType.borrowDays }} วัน</span>
          </div>
        </div>

        <div class="flex space-x-2">
          <button 
            @click="editUserType(userType)" 
            class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            แก้ไข
          </button>
          <button 
            @click="deleteUserType(userType.id)" 
            class="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <UModal v-model="showAddModal" :ui="{ width: 'sm:max-w-md' }">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingUserType ? 'แก้ไขประเภทผู้ใช้สื่อ' : 'เพิ่มประเภทผู้ใช้สื่อ' }}
          </h3>
        </template>

        <form @submit.prevent="saveUserType" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ชื่อประเภทผู้ใช้สื่อ <span class="text-red-500">*</span>
            </label>
            <UInput 
              v-model="formData.name" 
              placeholder="กรอกชื่อประเภทผู้ใช้สื่อ"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              รหัสประเภท <span class="text-red-500">*</span>
            </label>
            <UInput 
              v-model="formData.code" 
              placeholder="กรอกรหัสประเภท"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              รายละเอียด
            </label>
            <UTextarea 
              v-model="formData.description" 
              placeholder="กรอกรายละเอียดประเภทผู้ใช้สื่อ"
              :rows="3"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                จำนวนหนังสือที่ยืมได้
              </label>
              <UInput 
                v-model.number="formData.maxBooks" 
                type="number"
                min="1"
                placeholder="จำนวนเล่ม"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ระยะเวลายืม (วัน)
              </label>
              <UInput 
                v-model.number="formData.borrowDays" 
                type="number"
                min="1"
                placeholder="จำนวนวัน"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              สถานะ
            </label>
            <USelect 
              v-model="formData.status" 
              :options="[
                { label: 'ใช้งาน', value: 'active' },
                { label: 'ไม่ใช้งาน', value: 'inactive' }
              ]"
            />
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton color="gray" variant="outline" @click="closeModal">
              ยกเลิก
            </UButton>
            <UButton color="primary" @click="saveUserType">
              {{ editingUserType ? 'บันทึกการแก้ไข' : 'เพิ่มประเภท' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script>
export default {
  setup() {
    // Page setup
    definePageMeta({
      layout: 'admin'
    })
    // State
    const showAddModal = ref(false)
    const editingUserType = ref(null)
    const userTypes = ref([
      {
        id: 1,
        name: 'นักเรียน',
        code: 'STUDENT',
        description: 'นักเรียนในระบบการศึกษา',
        userCount: 245,
        maxBooks: 3,
        borrowDays: 7,
        status: 'active'
      },
      {
        id: 2,
        name: 'ครู',
        code: 'TEACHER',
        description: 'ครูและบุคลากรทางการศึกษา',
        userCount: 45,
        maxBooks: 5,
        borrowDays: 14,
        status: 'active'
      },
      {
        id: 3,
        name: 'บุคคลทั่วไป',
        code: 'PUBLIC',
        description: 'บุคคลทั่วไปที่สมัครใช้บริการ',
        userCount: 128,
        maxBooks: 2,
        borrowDays: 7,
        status: 'active'
      },
      {
        id: 4,
        name: 'นักวิจัย',
        code: 'RESEARCHER',
        description: 'นักวิจัยและนักวิชาการ',
        userCount: 12,
        maxBooks: 10,
        borrowDays: 30,
        status: 'inactive'
      }
    ])

    const formData = ref({
      name: '',
      code: '',
      description: '',
      maxBooks: 3,
      borrowDays: 7,
      status: 'active'
    })

    // Methods
    const editUserType = (userType) => {
      editingUserType.value = userType
      formData.value = { ...userType }
      showAddModal.value = true
    }

    const deleteUserType = (id) => {
      if (confirm('คุณต้องการลบประเภทผู้ใช้สื่อนี้ใช่หรือไม่?')) {
        userTypes.value = userTypes.value.filter(type => type.id !== id)
      }
    }

    const saveUserType = () => {
      if (editingUserType.value) {
        // Update existing user type
        const index = userTypes.value.findIndex(type => type.id === editingUserType.value.id)
        if (index !== -1) {
          userTypes.value[index] = { ...formData.value, id: editingUserType.value.id, userCount: editingUserType.value.userCount }
        }
      } else {
        // Add new user type
        const newUserType = {
          ...formData.value,
          id: Math.max(...userTypes.value.map(type => type.id)) + 1,
          userCount: 0
        }
        userTypes.value.push(newUserType)
      }
      closeModal()
    }

    const closeModal = () => {
      showAddModal.value = false
      editingUserType.value = null
      formData.value = {
        name: '',
        code: '',
        description: '',
        maxBooks: 3,
        borrowDays: 7,
        status: 'active'
      }
    }

    return {
      showAddModal,
      editingUserType,
      userTypes,
      formData,
      editUserType,
      deleteUserType,
      saveUserType,
      closeModal
    }
  }
}
</script>
