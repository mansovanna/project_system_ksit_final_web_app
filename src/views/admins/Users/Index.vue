<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import Headers from './Headers.vue'
import { ArrowSmallUpIcon, ViewIcon } from '@/stores/Icons'

import Loading from '@/widgets/Loading.vue'
import AvailableData from '@/widgets/AvailableData.vue'
</script>
<template>
  <AdminLayouts title="Dashboard">
    <div class="p-4">
      <!-- Add your admin home content here -->
      <Headers />

      <!--  -->

      <!-- Loading -->

      <!--  -->
      <div
        class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-500 font-Kantumruy text-nowrap text-slate-500 uppercase"
              >
                <td class="px-3 py-2 text-left">ID Student</td>
                <td class="px-3 py-2 text-center">Image</td>
                <td class="px-3 py-2 text-left">Name</td>
                <td class="px-3 py-2 text-left">User Name</td>
                <td class="px-3 py-2 text-left">Date of Birth</td>
                <td class="px-3 py-2 text-left">Phone</td>
                <td class="px-3 py-2 text-left">Parent</td>
                <td class="px-3 py-2 text-left">Addrees</td>
                <td class="px-3 py-2 text-center">Level</td>
                <td class="px-3 py-2 text-center">Major</td>
                <td class="px-3 py-2 text-center">Year</td>
                <td class="px-3 py-2 text-center">Status</td>
                <td class="px-3 py-2 text-center">Actions</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in 5"
                :key="item"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-3 py-2 font-Kantumruy text-slate-500">KSIT-0245{{ item + 1 }}</td>
                <td class="px-3 py-2 flex flex-start items-center">
                  <img
                    class="w-10 h-10 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                    alt=""
                  />
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500">សុវណ្ណ ដារ៉ា</td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500">Sovann Dara</td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500">30-04-2025</td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500">
                  <!--  -->
                  +855 999 9999 9999
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500">+855 888 8888 8888</td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500">Kampong Chnange,</td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500">បរិញ្ញាប័ត្រ</td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500">Computer</td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">2</td>

                <td class="px-3 py-2 text-center">
                  <!--  -->
                  <div class="border border-green-600 rounded-full px-3 py-1 bg-green-600/10">
                    <p class="text-xs text-green-600 font-Kantumruy">Approved</p>
                  </div>
                </td>

                <td class="px-3 py-2 text-center">
                  <!--  -->
                  <button
                    @click="$router.push({ name: 'users-profile', params: { id: item } })"
                    class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                  >
                    <component :is="ViewIcon" />
                  </button>
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
      <AvailableData />
      <Loading />
    </div>
  </AdminLayouts>
</template>
