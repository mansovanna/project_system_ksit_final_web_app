<script setup lang="ts">
import { SearchIcon, ArrowSmallUpIcon } from '@/stores/Icons'
</script>

<template>
  <div
    class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
  >
    <div class="w-full flex justify-between items-center">
      <h1 class="font-Kantumruy font-medium text-slate-500">History Stays</h1>
      <div>
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
    </div>
    <div class="w-full overflow-x-auto mt-4">
      <table class="w-full">
        <thead>
          <tr
            class="w-full bg-slate-100 dark:bg-slate-500 font-Kantumruy text-nowrap text-slate-500 uppercase"
          >
            <td class="px-3 py-2 text-left">ID Student</td>

            <td class="px-3 py-2 text-left">Build</td>
            <td class="px-3 py-2 text-left">Room Num</td>
            <td class="px-3 py-2 text-left">Start Date</td>
            <td class="px-3 py-2 text-left">Last Date</td>
            <td class="px-3 py-2 text-center">Gender</td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">Admin</td>
            <td class="px-3 py-2 text-center">Status</td>
            <td class="px-3 py-2 text-center">Actions</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in 10"
            :key="item"
            class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
          >
            <td class="px-3 py-2 font-Kantumruy text-slate-500">KSIT-0245{{ item + 1 }}</td>

            <td class="px-3 py-2 font-Kantumruy text-slate-500">KSIT-NTN</td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500">20</td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500">30-04-2025</td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500">30-04-2025</td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">Male</td>

            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">
              <!--  -->
              <span class="px-2 py-1 bg-slate-500/10 rounded-full border border-slate-200 text-xs"
                >Admin</span
              >
            </td>

            <td class="px-3 py-2 text-center">
              <!--  -->
              <div class="flex justify-center">
                <div class="border border-green-100 rounded-full px-3 py-1 bg-green-600">
                  <p class="text-xs text-white font-Kantumruy">Complete</p>
                </div>
              </div>
            </td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">x</td>
          </tr>
        </tbody>
      </table>
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
</template>
