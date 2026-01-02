<script setup lang="ts">
import { ArrowSmallUpIcon, CheckIcon, SearchIcon, ViewIcon } from '@/stores/Icons'
</script>

<template>
  <div
    class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
  >
    <div class="flex justify-between items-center">
      <h1 class="text-wrap w-full font-Kantumruy font-medium text-slate-600 dark:text-slate-300">
        Student is not Assign
      </h1>
      <div class="w-full justify-end flex gap-3">
        <div class="w-full relative">
          <input
            type="text"
            class="border pl-4 pr-10 py-2 rounded-md border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
            placeholder="Search..."
          />

          <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
            <component :is="SearchIcon" class="text-slate-400" />
          </div>
        </div>
      </div>
      <!--  -->
    </div>
    <hr class="text-slate-300 dark:text-slate-400 my-4" />
    <div class="w-full overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr
            class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-slate-500 uppercase"
          >
            <td class="px-1 py-1.5 text-left dark:text-slate-300">ID</td>
            <td class="px-1 py-1.5 text-left dark:text-slate-300">Student</td>
            <td class="px-1 py-1.5 text-center dark:text-slate-300">Major</td>
            <td class="px-1 py-1.5 text-center dark:text-slate-300">Year</td>
            <td class="px-3 py-1.5 text-center dark:text-slate-300">Actions</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in 5"
            :key="item"
            class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
          >
            <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300">
              {{ item }}
            </td>
            <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-left">
              <div class="flex gap-2">
                <img
                  class="w-10 h-10 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                  alt=""
                />
                <div class="flex flex-col">
                  <h1 class="font-Kantumruy font-medium">Sovan Dara</h1>
                  <span class="text-xs font-Kantumruy font-medium">ID: KSIT-0232</span>
                </div>
              </div>
            </td>
            <td class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center">
              Computer
            </td>

            <td class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center">
              3
            </td>

            <td class="py-1.5 text-center">
              <!--  -->
              <div class="flex justify-center items-center gap-2">
                <button
                  value="View"
                  @click="$router.push({ name: 'users-profile', params: { id: 1 } })"
                  class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                >
                  <component :is="ViewIcon" />
                </button>
                <!-- @click="openFormUpdate(1)" -->
                <button
                  class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                >
                  <component :is="CheckIcon" />
                </button>
                <!-- @click="alert_messageg_check(1, 'delete')" -->
              </div>
            </td>
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
            class="bg-slate-100 dark:bg-slate-600 dark:text-slate-300 px-2 border-r border-slate-300 py-1 font-Kantumruy text-slate-500 rounded-l-md"
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
          class="w-8 h-8 bg-slate-100 dark:bg-slate-600 justify-center items-center flex rounded-full text-blue-600 cursor-pointer hover:bg-slate-200"
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
