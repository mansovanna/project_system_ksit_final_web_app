<script setup lang="ts">
import { CheckIcon, CloseIcon, ViewIcon } from '@/stores/Icons'
</script>

<template>
  <table class="w-full">
    <thead>
      <tr class="w-full bg-slate-300 font-Kantumruy font-medium text-nowrap">
        <td class="px-6 py-2">No</td>
        <td class="px-6 py-2">Name</td>
        <td class="px-6 py-2">Reasons</td>
        <td class="px-6 py-2 text-center">Total Date</td>
        <td class="px-6 py-2 text-center">Start Date</td>
        <td class="px-6 py-2 text-center">Last Date</td>
        <td class="px-6 py-2 text-center">Status</td>
        <td class="px-6 py-2 text-center">Actions</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in 2" :key="item" class="border-t border-slate-300 hover:bg-slate-50">
        <td class="px-4 py-2">1</td>
        <td class="px-6 py-2">
          <div class="flex justify-start items-center gap-4 text-nowrap">
            <img
              class="w-10 h-10 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              alt=""
            />
            <div class="leading-2">
              <p class="font-medium text-lg font-Kantumruy">Sovanna Dara</p>
              <p
                class="text-md font-Kantumruy text-slate-500 hover:text-blue-600 hover:underline mt-2"
              >
                000-000-000
              </p>
            </div>
          </div>
        </td>
        <td class="px-4 py-2">
          <p class="line-clamp-1">
            "Text" can refer to written or spoken material, the main body of a page or book, or the
            act of sending electronic messages. In a broader sense, it can also refer to any object
            or medium that can be "read" and interpreted, such as a movie, painting, or even a style
            of clothing.
          </p>
        </td>
        <td class="px-4 py-2 text-center">
          <p class="font-Kantumruy text-slate-600">3</p>
        </td>
        <td class="px-4 py-2 text-center">
          <p class="font-Kantumruy text-slate-600">20-12-2025</p>
        </td>
        <td class="px-4 py-2 text-center">
          <p class="font-Kantumruy text-slate-600">22-12-2025</p>
        </td>
        <td class="px-4 py-2 text-center">
          <!--  -->
          <div class="border border-warning rounded-full px-4 py-1.5 bg-warning/10">
            <p class="text-xs text-warning font-Kantumruy">Pending</p>
          </div>
        </td>

        <td class="px-4 py-2 text-center">
          <!--  -->
          <div class="flex gap-2">
            <router-link
              :to="{
                name: 'detail-leave',
                params: {
                  id: item + 1,
                },
              }"
              class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
            >
              <component :is="ViewIcon" />
            </router-link>
            <!--  -->
            <button
              class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 hover:bg-green-500 hover:text-white text-green-500 cursor-pointer ease-in-out duration-200"
            >
              <component :is="CheckIcon" />
            </button>
            <!--  -->
            <button
              class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-red-500 cursor-pointer ease-in-out duration-200"
            >
              <component :is="CloseIcon" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
