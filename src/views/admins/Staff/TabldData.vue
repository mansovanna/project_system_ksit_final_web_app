<script setup lang="ts">
import { ViewIcon } from '@/stores/Icons'
</script>

<template>
  <table class="w-full">
    <thead>
      <tr
        class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-base text-slate-500"
      >
        <td class="px-4 py-2 font-Kantumruy uppercase w-10">No</td>
        <td class="px-4 py-2 font-Kantumruy uppercase w-1">Avatar</td>
        <td class="px-4 py-2 font-Kantumruy uppercase w-1">Name</td>
        <td class="px-4 py-2 font-Kantumruy uppercase">Username</td>
        <td class="px-4 py-2 font-Kantumruy uppercase text-left w-1">Email</td>
        <td class="px-4 py-2 text-left font-Kantumruy uppercase">Phone</td>
        <td class="px- py-2 text-center font-Kantumruy uppercase">Status</td>
        <td class="px- py-2 text-center font-Kantumruy uppercase">Role</td>
        <!-- <td class="px-6 py-2 text-center">Status</td> -->
        <td class="px-4 py-2 text-center font-Kantumruy uppercase">Actions</td>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in 3"
        :key="item"
        class="border-t border-slate-200 dark:border-slate-400 text-nowrap"
      >
        <!-- No -->
        <td class="px-4 py-2">{{ item + 1 }}</td>

        <!-- Staff / Admin -->
        <td class="px-4 py-2 text-center flex justify-center items-center">
          <img
            class="w-10 h-10 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000"
            alt="profile"
          />
        </td>

        <!-- Staff / Admin -->
        <td class="px-4 py-2 font-Kantumruy text-slate-400 text-left">សុវណ្ណ ដារ៉ា</td>
        <td class="px-4 py-2 font-Kantumruy text-slate-400 text-left">Sovann Dara</td>
        <td class="px-4 py-2 font-Kantumruy text-blue-400 text-left">sovanndara@gmail.com</td>

        <!-- Phone -->
        <td class="px-4 py-2 font-Kantumruy text-slate-500 text-left">+855 999 999 999</td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500 text-center">
          <span
            class="px-2 py-1 text-xs font-Kantumruy font-medium bg-green-500/20 border border-green-600 rounded-full text-green-600"
            >Online</span
          >
        </td>

        <!-- Role -->
        <td class="px-4 py-2 font-Kantumruy text-slate-500 text-center">
          <span
            class="px-2 border rounded-full text-xs py-1 border-slate-300 bg-slate-300/20 font-medium"
            >Admin</span
          >
        </td>

        <!-- Status -->
        <!-- <td class="px-4 py-2 text-center flex justify-center">
                  <div class="border border-warning rounded-full px-4 py-1.5 bg-warning/10">
                    <p class="text-xs text-warning font-Kantumruy">Pending</p>
                  </div>
                </td> -->

        <!-- Actions -->
        <td class="px-4 py-2 text-center">
          <div class="flex gap-2 justify-center">
            <!-- View -->
            <RouterLink
              :to="{ name: 'staff-profile', params: { id: item } }"
              class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
            >
              <component :is="ViewIcon" />
            </RouterLink>

            <!-- Approve -->
            <!-- <button
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 hover:bg-green-500 hover:text-white text-green-500 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CheckIcon" />
                    </button> -->

            <!-- Reject -->
            <!-- <button
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-red-500 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CloseIcon" />
                    </button> -->
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
