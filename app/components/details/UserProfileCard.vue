<template>
  <UCard :ui="{ base: 'rounded-xl', body: { padding: 'p-4' }, shadow: 'shadow-sm' }" class="border-none">
    <div class="flex gap-4 items-start">
      <UAvatar 
        :src="avatar" 
        alt="Profile" 
        size="3xl" 
        :ui="{ rounded: 'rounded-xl' }"
        class="object-cover bg-slate-200"
      />
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start">
          <p class="text-sm text-slate-800">
            <span class="font-bold">ชื่อ :</span> {{ name }}
          </p>
          <UBadge color="green" variant="subtle" size="sm" class="rounded-full font-medium px-2 py-0.5">
            {{ role }}
          </UBadge>
        </div>
        <p class="text-sm text-slate-600 mt-1">
          <span class="font-bold">เบอร์โทร :</span> {{ phone }}
        </p>
        <p class="text-sm text-slate-600 mt-1 truncate">
          <span class="font-bold">อีเมล :</span> {{ email }}
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  phone: string
  email: string
  avatar: string
  role: string
}>()
</script>