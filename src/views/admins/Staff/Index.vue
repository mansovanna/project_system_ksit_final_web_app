<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import Headers from './Headers.vue'
import { ArrowSmallUpIcon } from '@/stores/Icons'
import TabldData from './TabldData.vue'

import FormCreate from './FormCreate.vue'

// import Loading from '@/widgets/Loading.vue'
// import AvailableData from '@/widgets/AvailableData.vue'
import { useStaffStore } from '@/stores/staffStore'

const staffStore = useStaffStore()
</script>
<template>
  <FormCreate v-if="staffStore.isShowCreate" />
  <AdminLayouts title="Dashboard">
    <div class="p-4">
      <!-- Add your admin home content here -->
      <Headers />

      <!--  -->

      <!-- Loading -->

      <div
        class="bg-white dark:bg-slate-800 rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:text-white"
      >
        <div class="w-full overflow-x-auto">
          <!-- Table for Staff and Admin -->
          <TabldData />
        </div>

        <!--  -->
        <hr class="text-slate-300" />
        <div class="w-full mt-4 flex justify-between items-center gap-3">
          <!--  -->
          <div class="relative">
            <div class="flex justify-start items-center absolute top-0 bottom-0 left-0.5">
              <p
                class="bg-slate-100 px-2 border-r border-slate-300 py-1 font-Kantumruy text-slate-500 rounded-l-md"
              >
                Page
              </p>
            </div>
            <input
              type="number"
              value="1"
              class="border border-slate-300 px-3 py-1 pl-15 w-36 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 font-Kantumruy font-medium text-slate-400"
            />
          </div>

          <!--  -->
          <div class="flex justify-center items-center gap-2">
            <button
              class="w-8 h-8 bg-slate-100 justify-center items-center flex rounded-full text-blue-600 cursor-pointer hover:bg-slate-200"
            >
              <component class="-rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>
            <button
              class="w-8 h-8 bg-blue-600 text-white justify-center items-center flex rounded-full hover:bg-blue-400 cursor-pointer"
            >
              <p class="font-Kantumruy font-medium">1</p>
            </button>
            <button
              class="w-8 h-8 bg-slate-100 text-blue-600 justify-center items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <p class="font-Kantumruy font-medium">2</p>
            </button>
            <!-- more.. -->
            ...
            <button
              class="w-8 h-8 bg-slate-100 text-blue-600 justify-center items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <p class="font-Kantumruy font-medium">100</p>
            </button>
            <!--  -->
            <button
              class="w-8 h-8 bg-blue-600 text-white justify-center items-center flex rounded-full hover:bg-blue-400 cursor-pointer"
            >
              <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>
          </div>
        </div>
      </div>

      <!--  -->
      <!-- <AvailableData />
      <Loading /> -->
    </div>
  </AdminLayouts>
</template>
