<!-- eslint-disable vue/multi-word-component-names -->

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { LogoutIcon, SettingFillIcon } from '@/stores/Icons'
import Loading from '@/widgets/Loading.vue'
//------------------------------------
const authStore = useAuthStore()

const prop = defineProps({
  user: {
    type: String,
  },
  role: {
    type: String,
  },
})
</script>
<template>
  <div
    @click.stop
    class="w-64 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg absolute top-16 right-6 overflow-clip"
  >
    <div class="w-full h-18 px-4 py-1.5">
      <div>
        <h1 class="capitalize">{{ prop.user ?? 'NULL' }}</h1>
        <p class="w-full text-slate-400 text-sm capitalize">
          {{ prop.role ?? 'NULL' }} Profile Component
        </p>
      </div>
    </div>
    <hr class="text-slate-200" />

    <!-- ---------------------- -->
    <!--
    <div class="w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
      <h1>View Profile</h1>
    </div> -->
    <button
      @click="$router.push('/admin/setting')"
      class="w-full flex justify-start items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
    >
      <component :is="SettingFillIcon" />
      <h1>Settings</h1>
    </button>
    <hr class="text-slate-200" />
    <button
      @click="authStore.logout"
      :disabled="authStore.isLoadings"
      class="w-full px-4 py-2 font-Kantumruy hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800 cursor-pointer"
    >
      <h1 v-if="authStore.isLoadings" class="flex justify-start items-center gap-2">
        <div class="w-5 h-5">
          <Loading class="w-2 h-2" :fill="'fill-red-500'" />
        </div>
        <span class="font-Kantumruy font-medium text-red-500">Loading...</span>
      </h1>
      <div v-else class="flex justify-start items-center">
        <component :is="LogoutIcon" />
        <h1>Logout</h1>
      </div>
    </button>
  </div>
</template>
