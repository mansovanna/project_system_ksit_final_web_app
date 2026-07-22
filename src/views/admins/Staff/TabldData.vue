<script setup lang="ts">
import { UsersIcon, ViewIcon } from '@/stores/Icons'
import { useStaffStore } from '@/stores/staffStore'
import { useAvatar } from '@/composables/useAvatar'
import { useAuthStore } from '@/stores/auth'
import { api as viewerApi } from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// ---------------------------------------------------
const authStore = useAuthStore()
const staffStore = useStaffStore()
// ---------------------------------------------------
const avatar = useAvatar()

// ----------
async function openImage(url: string) {
  if (!url) return
  viewerApi({
    images: [url],
    options: {
      toolbar: true,
      navbar: false,
      title: false,
      movable: true,
    },
  })
}
</script>

<template>
  <table class="w-full">
    <thead>
      <tr
        class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-base text-slate-500"
      >
        <td class="px-4 py-2 font-Kantumruy uppercase w-10">No</td>
        <td class="px-4 py-2 font-Kantumruy uppercase w-1">Photo</td>
        <td class="px-4 py-2 font-Kantumruy uppercase w-1">Full Name</td>
        <td class="px-4 py-2 font-Kantumruy uppercase">Username</td>
        <td class="px-4 py-2 font-Kantumruy uppercase text-left w-1">Email</td>
        <td class="px-4 py-2 text-left font-Kantumruy uppercase">Phone Number</td>
        <td class="px-4 py-2 text-left font-Kantumruy uppercase">Description</td>
        <td class="px- py-2 text-center font-Kantumruy uppercase">Status</td>
        <td class="px- py-2 text-center font-Kantumruy uppercase">Role</td>
        <td class="px-4 py-2 text-center font-Kantumruy uppercase">Actions</td>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(item, index) in staffStore.staff_list?.data.data"
        :key="index"
        class="border-t border-slate-200 dark:border-slate-400 text-nowrap"
      >
        <!-- No -->
        <td class="px-4 py-2">{{ index + 1 }}</td>

        <!-- Photo -->
        <td class="px-4 py-2 text-center flex justify-center items-center">
          <div
            @click="
              openImage(
                item?.profile_photo_url
                  ? item.profile_photo_url
                  : avatar.textToImage(item?.user_name ?? 'User'),
              )
            "
            class="w-11 h-11 outline-2 outline-white dark:outline-slate-700 ring-4 ring-blue-600 rounded-full"
          >
            <img
              :src="
                item?.profile_photo_url
                  ? item.profile_photo_url
                  : avatar.textToImage(item?.user_name ?? 'User')
              "
              alt="avatar"
              class="w-11 h-11 rounded-full font-Kantumruy flex justify-center items-center object-cover object-center"
            />
          </div>
        </td>

        <!-- Full Name -->
        <td class="px-4 py-2 font-Kantumruy text-slate-400 text-left capitalize">
          {{ item.first_name ?? 'N/A' }} {{ item.last_name ?? 'N/A' }}
        </td>
        <td class="px-4 py-2 font-Kantumruy text-slate-400 text-left capitalize">
          {{ item.user_name ?? 'N/A' }}
        </td>
        <td class="px-4 py-2 font-Kantumruy text-blue-400 text-left">{{ item.email ?? 'N/A' }}</td>

        <!-- Phone -->
        <td class="px-4 py-2 font-Kantumruy text-slate-500 text-left">
          {{ item.phone_number ?? 'N/A' }}
        </td>
        <!-- Bio -->
        <td class="px-4 py-2 font-Kantumruy text-slate-500 text-left">
          {{ item.bio ?? 'N/A' }}
        </td>
        <td class="px-4 py-2 font-Kantumruy text-slate-500 text-center">
          <span
            class="px-3 py-1.5 text-xs capitalize font-Kantumruy font-medium border rounded-full text-green-600"
            :class="
              item.status == 'active'
                ? 'bg-green-700/10 border-green-600'
                : item.status == 'blocked'
                  ? 'bg-red-700/10 text-red-600 border-red-600'
                  : item.status == 'pending'
                    ? 'bg-yellow-700/10 text-yellow-600 border-yellow-600'
                    : 'bg-slate-300/10 text-slate-500 border-slate-300'
            "
            >{{ item.status ?? 'null' }}</span
          >
        </td>

        <!-- Role -->
        <td class="py-2 font-Kantumruy text-slate-500 text-center">
          <div class="flex justify-center items-center">
            <span
              class="px-4 border rounded-full text-xs py-1.5 capitalize dark:text-white border-slate-300 bg-slate-300/20 font-medium flex justify-center items-center gap-1"
              ><component :is="UsersIcon" class="w-4 h-4 capitalize" />{{
                item.role ?? 'N/A'
              }}</span
            >
          </div>
        </td>

        <!-- Actions -->
        <td class="px-4 py-2 text-center">
          <div class="flex gap-2 justify-center">
            <!-- View -->
            <RouterLink
              v-if="item.role !== 'admin' && item.id !== authStore.current_use?.id"
              :to="{ name: 'staff-profile', params: { id: item.id } }"
              class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-500 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
            >
              <component :is="ViewIcon" />
            </RouterLink>

            <p v-else class="font-Kantumruy text-slate-400 font-normal">...</p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
