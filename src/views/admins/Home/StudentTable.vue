<script setup lang="ts">
import { CheckIcon, CloseIcon, ViewIcon } from '@/stores/Icons'
</script>

<template>
  <table class="w-full">
    <thead>
      <tr class="w-full bg-slate-300 font-Kantumruy font-medium text-nowrap">
        <td class="px-6 py-2">No</td>
        <td class="px-6 py-2">Student</td>
        <td class="px-6 py-2">Date of Birth</td>
        <td class="px-6 py-2 text-center">User Name</td>
        <td class="px-6 py-2 text-center">Phone</td>
        <td class="px-6 py-2 text-center">Parent</td>
        <td class="px-6 py-2 text-center">Addrees</td>
        <td class="px-6 py-2 text-center">Level</td>
        <td class="px-6 py-2 text-center">Major</td>
        <td class="px-6 py-2 text-center">Year</td>
        <td class="px-6 py-2 text-center">Status</td>
        <td class="px-6 py-2 text-center">Actions</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in 2" :key="item" class="border-t border-slate-300 text-nowrap">
        <td class="px-4 py-2">{{ item + 1 }}</td>
        <td class="px-6 py-2">
          <div class="flex justify-start items-center gap-4 text-nowrap">
            <img
              class="w-10 h-10 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              alt=""
            />
            <div class="leading-2">
              <p class="font-medium text-lg font-Kantumruy">សុវណ្ណ ដារ៉ា</p>
              <p class="text-xs font-Kantumruy text-slate-500 hover:text-blue-600 hover:underline">
                ID: 12004455
              </p>
            </div>
          </div>
        </td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500">Sovann Dara</td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500">30-04-2025</td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500">
          <!--  -->
          +855 999 9999 9999
        </td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500">+855 888 8888 8888</td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500">Kampong Chnange,</td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500">បរិញ្ញាប័ត្រ</td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500">Computer</td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500 text-center">2</td>

        <td class="px-4 py-2 text-center">
          <!--  -->
          <div class="border border-warning rounded-full px-4 py-1.5 bg-warning/10">
            <p class="text-xs text-warning font-Kantumruy">Pending</p>
          </div>
        </td>

        <td class="px-4 py-2 text-center">
          <!--  -->
          <div class="flex gap-2">
            <button
              class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
            >
              <component :is="ViewIcon" />
            </button>
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
