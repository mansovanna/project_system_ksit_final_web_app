<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useExportToCSV } from '@/stores/exportCSV'
import { ArrowSmallUpIcon, CSVIcon, PrintIcon, SearchIcon } from '@/stores/Icons'
import { useStaffStore } from '@/stores/staffStore'

const staffStore = useStaffStore()
const exportData = useExportToCSV()
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
        class="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 font-Kantumruy"
        @click="staffStore.handleCrate"
      >
        Add New
      </button>
    </div>
    <hr class="text-slate-300 my-2" />
    <div class="w-full flex justify-between gap-2">
      <div class="flex w-1/2">
        <div class="w-full relative">
          <input
            type="text"
            class="border pl-4 pr-10 py-2 rounded-md border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
            placeholder="Search..."
          />
          <!-- icon -->
          <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
            <component :is="SearchIcon" class="text-slate-400" />
          </div>
        </div>
      </div>
      <!-- ------- -->
      <div class="flex justify-end items-center gap-3">
        <button
          @click="
            exportData.exportCSV([
              { id: 1, name: 'Sovanna', age: 22 },
              { id: 2, name: 'Dara', age: 24 },
            ])
          "
          class="p-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-500 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
        >
          Export
          <component :is="CSVIcon" />
        </button>
        <button
          @click="
            exportData.printPDFDocument([
              { id: 1, name: 'Cashew', qty: 120, price: 5 },
              { id: 2, name: 'Rice', qty: 300, price: 1.2 },
            ])
          "
          class="p-2 px-4 bg-warning text-white rounded-md hover:bg-warning/80 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
        >
          Print
          <component :is="PrintIcon" />
        </button>
      </div>
    </div>
  </div>
</template>
