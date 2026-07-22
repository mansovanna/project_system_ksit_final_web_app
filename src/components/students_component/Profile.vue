<!-- eslint-disable vue/multi-word-component-names -->

<script setup lang="ts">
//------------------------------------
import { ArrowSmallUpIcon, LogoutIcon } from '@/stores/Icons'
import { useAuthStore } from '@/stores/auth'
import Loading from '@/widgets/Loading.vue'

const authStore = useAuthStore()
defineProps<{
  // Define any props if needed

  name: string
  email: string
  avatarUrl: string
  role: string
}>()
</script>
<template>
  <div
    @click.stop
    class="w-64 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg absolute top-16 right-6 overflow-clip"
  >
    <div class="w-full px-4 py-1.5">
      <div>
        <h1>{{ name }}</h1>
        <p class="w-full text-slate-400 text-sm capitalize">{{ role }}</p>
      </div>
    </div>
    <hr class="text-slate-200" />

    <!-- ---------------------- -->

    <button
      @click="$router.push({ name: 'student-settings' })"
      class="w-full px-4 py-2 flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
    >
      <h1 class="font-Kantumruy">View Profile</h1>

      <!--  -->
      <component class="rotate-90 text-slate-500 w-5 h-5" :is="ArrowSmallUpIcon" />
    </button>

    <hr class="text-slate-200" />
    <button
      @click="authStore.logout"
      :disabled="authStore.isLoadings"
      class="w-full text-left hover:text-red-500 font-Kantumruy px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
    >
      <div v-if="authStore.isLoadings" class="flex justify-center items-center gap-1">
        <div class="w-6 h-6"><loading /></div>
        <span>Please Wait...</span>
      </div>
      <div v-else class="flex justify-start items-center gap-1">
        <component :is="LogoutIcon" />
        <h1>Logout</h1>
      </div>
    </button>
  </div>
</template>
