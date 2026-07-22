<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ArrowSmallUpIcon, SearchIcon } from '@/stores/Icons'
import { useStaffStore } from '@/stores/staffStore'
import InputTextField from '@/widgets/InputTextField.vue'
import { watch } from 'vue'

const authStore = useAuthStore()
const staffStore = useStaffStore()

let timer: ReturnType<typeof setTimeout>
watch([() => staffStore.search, () => staffStore.per_page], ([search]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    staffStore.get_staff_all(search, staffStore.per_page, staffStore.page)
  }, 500)
})
</script>

<template>
  <div class="w-full p-4 border border-slate-300 bg-white dark:bg-slate-800 rounded-xl">
    <div class="w-full flex justify-between items-center">
      <div>
        <div class="flex justify-start items-center">
          <h1 class="font-Kantumruy text-slate-500">Dashboard</h1>
          <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
          <h1 class="font-Kantumruy text-blue-500">Staffs</h1>
        </div>
        <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
      </div>
      <button
        v-if="authStore.current_use?.role == 'admin'"
        class="px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600 cursor-pointer font-Kantumruy"
        @click="staffStore.handleCrate"
      >
        Add New
      </button>
    </div>
    <hr class="text-slate-300 my-2" />
    <div class="w-full flex justify-between gap-2">
      <InputTextField placeholder="Search..." v-model="staffStore.search">
        <template #suffix>
          <component :is="SearchIcon" class="text-slate-400" />
        </template>
      </InputTextField>
      <!-- ------- -->
    </div>
  </div>
</template>
