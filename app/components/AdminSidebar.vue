<template>
  <div class="w-64 bg-gray-900 text-white h-screen flex flex-col">
    <!-- Logo Section -->
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold">Web Book</h1>
          <p class="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li>
          <NuxtLink 
            to="/admin/book-categories" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
            :class="{ 'bg-gray-800': $route.path.includes('book-categories') }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span>ประเภทหนังสือ</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/admin/user-types" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
            :class="{ 'bg-gray-800': $route.path.includes('user-types') }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span>ประเภทผู้ใช้สื่อ</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- User Section -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium">Admin</p>
          <p class="text-xs text-gray-400">admin@webbook.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// No additional logic needed for now
</script>
