<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'

import { ref } from 'vue'

const isOpen = ref(false)
const isMessage = ref<string>('')
const alert_messageg_check = (id: number | null, status: string | null) => {
  if (id != null || status != null) {
    isMessage.value = status ?? ''
    isOpen.value = !isOpen.value
  } else {
    isOpen.value = !isOpen.value
  }
}
</script>
<template>
  <AdminLayouts title="User Register New">
    <!-- Block Alert Select status -->

    <div
      v-if="isOpen"
      class="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div
        class="p-4 bg-white dark:bg-slate-700 rounded-xl w-full max-w-md shadow-lg relative overflow-clip"
      >
        <!-- Block -->
        <button
          @click="alert_messageg_check(null, '')"
          class="px-4 py-1 rounded-bl-lg border border-t-0 drop-shadow-2xl cursor-pointer border-warning bg-red-500 text-white hover:bg-red-600 absolute right-0 top-0"
        >
          <component :is="CloseIcon" />
        </button>
        <!-- Icon -->
        <div class="flex justify-center">
          <div
            class="flex items-center justify-center rounded-full"
            :class="isMessage === 'reject' ? 'text-red-500' : 'text-green-500'"
          >
            <!-- <span class="text-white text-3xl font-bold">!</span> -->
            <component :is="InfoIcon" class="w-30 h-30" />
          </div>
        </div>

        <!-- Message -->
        <h1 class="font-Kantumruy mt-4 text-center font-medium text-slate-600 dark:text-slate-200">
          Do you want to <span class="font-semibold capitalize">{{ isMessage }}</span> this item?
        </h1>

        <!-- Actions -->
        <div class="flex justify-center mt-6">
          <button
            class="px-6 w-1/3 py-2 text-white rounded-md font-Kantumruy"
            :class="
              isMessage === 'approve'
                ? 'bg-green-600 hover:bg-green-500'
                : 'bg-red-600 hover:bg-red-500'
            "
          >
            Ok
          </button>
        </div>
      </div>
    </div>

    <!-- End Block Alert Select Status -->
    <div class="p-4">
      <!--  -->
      <div
        class="bg-white rounded-xl p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="flex">
          <div class="flex justify-start items-center w-full">
            <h1 class="font-Kantumruy text-slate-500">Dashboard</h1>
            <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
            <h1 class="font-Kantumruy text-blue-500">All List Leave Request</h1>
          </div>
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
        </div>
        <hr class="w-full text-slate-300 dark:text-slate-500 my-3" />
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-slate-500 uppercase"
              >
                <td class="px-1 py-2 text-left dark:text-slate-300">ID Student</td>
                <td class="px-1 py-2 text-center dark:text-slate-300">Image</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Name</td>

                <td class="px-3 py-2 text-left dark:text-slate-300">Reason</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Start Date</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">End Date</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Phone</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Parent</td>

                <td class="px-3 py-2 text-center dark:text-slate-300">Level</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Major</td>
                <td class="px-2 py-2 text-center dark:text-slate-300">Year</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Status</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Actions</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in 5"
                :key="item"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-1 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  KSIT-0245{{ item + 1 }}
                </td>
                <td class="px-1 py-2 flex flex-start items-center">
                  <img
                    class="w-10 h-10 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                    alt=""
                  />
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  សុវណ្ណ ដារ៉ា
                </td>

                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300 w-full">
                  <span class="line-clamp-1 text-wrap">
                    we go home with freind. and them we going to visit angkor wat</span
                  >
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  30-04-2025
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  30-04-2025
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  <!--  -->
                  +855 999 9999 9999
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  +855 888 8888 8888
                </td>

                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  បរិញ្ញាប័ត្រ
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  Computer
                </td>
                <td class="px-1 py-2 font-Kantumruy text-slate-500 dark:text-slate-300 text-center">
                  2
                </td>

                <td class="px-3 py-2 text-center">
                  <!--  -->
                  <div class="border border-warning rounded-full px-3 py-1 bg-warning/10">
                    <p class="text-xs text-warning font-Kantumruy">Pending</p>
                  </div>
                </td>

                <td class="py-2 text-center">
                  <!--  -->
                  <div class="flex gap-2">
                    <button
                      value="View"
                      @click="$router.push({ name: 'users-profile', params: { id: item } })"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="ViewIcon" />
                    </button>

                    <button
                      @click="alert_messageg_check(1, 'reject')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CloseIcon" />
                    </button>
                    <button
                      @click="alert_messageg_check(1, 'approve')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CheckIcon" />
                    </button>
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

      <!--  -->
    </div>
  </AdminLayouts>
</template>
