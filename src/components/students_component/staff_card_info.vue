<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import { useAuthStore } from '@/stores/auth'
import Loading from '@/widgets/Loading.vue'
const authStore = useAuthStore()

const avta = useAvatar()
</script>

<template>
  <div v-if="authStore.isLoadings" class="w-full p-5 flex justify-center items-center">
    <div class="p-4 bg-white rounded-md dark:bg-slate-700">
      <div class="w-12 h-12">
        <loading />
      </div>
    </div>
  </div>
  <div
    v-for="(staff, index) in authStore.data_staffs?.data"
    :key="index"
    class="min-w-[23%] max-md:w-full text-sm text-gray-500 bg-white dark:bg-slate-800 border border-gray-500/30 rounded-xl divide-y divide-gray-500/30"
  >
    <!-- Profile -->
    <div class="flex flex-row items-center p-4">
      <img
        v-if="staff.profile_photo_path"
        class="h-24 w-24 rounded-full object-cover border-2 border-green-600 outline-2 outline-white ring-4 ring-green-700"
        :src="staff.profile_photo_url"
        :alt="staff.user_name"
      />
      <img
        v-else
        class="h-24 w-24 rounded-full object-cover"
        :src="avta.textToImage(staff.user_name) ?? ''"
        :alt="staff.user_name"
      />
      <div class="flex flex-col gap-2 justify-center items-start px-4">
        <h2 class="text-lg text-gray-800 dark:text-white text-center">
          {{ staff.user_name ?? 'Null' }}
        </h2>
        <p class="text-center">{{ staff.role }}</p>

        <span
          class="mt-2 px-2 py-0.5 text-xs text-green-600 bg-green-500/20 border border-green-500/30 rounded-full"
        >
          {{ staff.bio }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="w-full flex divide-y flex-col justify-start divide-gray-500/30">
      <!-- Email -->
      <a
        :href="`mailto:${staff.email}`"
        class="w-full py-3 flex items-center justify-left gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition px-4"
        :title="staff.email"
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5 2.5c0-.825-.675-1.5-1.5-1.5H3c-.825 0-1.5.675-1.5 1.5m15 0v9c0 .825-.675 1.5-1.5 1.5H3c-.825 0-1.5-.675-1.5-1.5v-9m15 0L9 7.75 1.5 2.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ staff.email }}</span>
      </a>

      <!-- Call -->
      <a
        :href="`tel:${(staff.phone_number ?? '').replace(/\s/g, '')}`"
        class="w-full py-3 flex items-center justify-left gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition px-4"
        :title="staff.phone_number ?? ''"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.29 3.75a3.75 3.75 0 0 1 2.962 2.963M11.289.75a6.75 6.75 0 0 1 5.963 5.955m-.75 5.985v2.25a1.5 1.5 0 0 1-1.635 1.5 14.84 14.84 0 0 1-6.472-2.303 14.6 14.6 0 0 1-4.5-4.5 14.84 14.84 0 0 1-2.303-6.502A1.5 1.5 0 0 1 3.085 1.5h2.25a1.5 1.5 0 0 1 1.5 1.29 9.6 9.6 0 0 0 .525 2.108 1.5 1.5 0 0 1-.338 1.582l-.952.952a12 12 0 0 0 4.5 4.5l.952-.952a1.5 1.5 0 0 1 1.582-.338c.681.254 1.388.43 2.108.526a1.5 1.5 0 0 1 1.29 1.522"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ staff.phone_number }}</span>
      </a>
    </div>
  </div>
</template>
