<!-- eslint-disable vue/multi-word-component-names -->

<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'

const avatar = useAvatar()
const authStore = useAuthStore()

// ------------------------------------------------------

// Block Notification or Announcement Only!!

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString('km-KH', options)
}

onMounted(() => {
  authStore.getOneAnnouncementOnly()
})
</script>

<template>
  <StudentLayouts>
    <div class="w-full flex flex-col gap-4 p-4">
      <div class="w-full flex gap-4 max-lg:flex-col">
        <!-- Block Welcome -->
        <div class="w-1/2 max-lg:w-full">
          <div
            class="w-full bg-linear-to-r from-green-800 to-green-600 text-white p-4 pb-1 rounded-2xl"
          >
            <div class="flex justify-start items-center gap-4">
              <img
                class="w-20 h-20 object-center object-cover rounded-full border-2 border-red-400 ring-2 ring-shadow-2xs"
                :src="
                  authStore.current_use?.profile_photo_url
                    ? authStore.current_use?.profile_photo_url
                    : avatar.textToImage(authStore.current_use?.user_name ?? 'User')
                "
                :alt="authStore.current_use?.user_name ?? 'Avatar'"
              />

              <div>
                <h1 class="font-hanuman text-xl line-clamp-1">
                  សួស្ដី! {{ authStore.current_use?.first_name }}
                  {{ authStore.current_use?.last_name }}
                </h1>
                <p class="font-Kantumruy font-medium text-slate-300">
                  ID: {{ authStore.current_use?.info?.id_card ?? 'N/A' }}
                </p>
              </div>
            </div>
            <h1 class="mt-1 text-shadow text-xl/12 line-clamp-1 font-moul">
              អន្តេរវាសិកដ្ឋាន សូមស្វាគមន៍
            </h1>
          </div>
        </div>
        <!-- End Block Welcome -->
        <!-- Block Notification -->
        <div class="w-1/2 max-lg:w-full">
          <div class="w-full flex justify-between gap-4 items-center">
            <h1 class="font-Kantumruy text-lg dark:text-white">ការជូនដំណឹង</h1>
            <button
              @click="$router.push({ name: 'student-announcement' })"
              class="dark:text-white font-Kantumruy hover:underline cursor-pointer hover:text-warning"
            >
              មើលបន្ថែម
            </button>
          </div>

          <!-- Block Loading-->
          <div v-if="authStore.isLoading" class="p-4 w-full flex justify-center items-center">
            <div class="w-20 h-20 p-4">
              <loading />
            </div>
          </div>
          <!-- End Loading -->

          <!-- Block Data is issus or null -->

          <div
            v-else-if="!authStore.data_annon && !authStore.isLoading"
            class="w-full flex justify-center items-center p-2"
          >
            <div class="w-10 h-10 p-4">
              <NotData :message="'មិនមានការជូនដំណឹង!'" />
            </div>
          </div>
          <!-- End Block Data is issus or null -->

          <!-- Block data that have  -->
          <div
            v-else
            class="bg-white/70 mt-2 dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition p-6 max-md:p-5 border-l-4 max-lg:max-w-full w-full mx-auto border-warning"
          >
            <!-- Header -->
            <div class="flex justify-between items-center mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-warning/20 text-warning">
                <!-- {{ item.type === 'important' ? 'សំខាន់' : 'ជូនដំណឹង' }} -->
                important
              </span>
              <span class="text-sm text-slate-500 font-Kantumruy dark:text-slate-300">
                📅 {{ formatDate(authStore.data_annon?.data.created_at ?? 'N/A') }}
              </span>
            </div>

            <!-- Titles -->
            <h2 class="font-hanuman text-xl text-green-800 dark:text-white font-bold mb-1">
              {{ authStore.data_annon?.data.title ?? 'N/A' }}
            </h2>
            <p class="text-sm text-slate-500 font-Kantumruy mb-2 dark:text-slate-300">
              Important Announcement
            </p>

            <!-- Description -->
            <p class="font-Kantumruy text-slate-700 dark:text-white leading-relaxed line-clamp-2">
              {{ authStore.data_annon?.data.description ?? 'N/A' }}
            </p>

            <!-- Action -->
            <div class="mt-4">
              <button
                @click="
                  $router.push({
                    name: 'student-announcement-detail',
                    params: { id: authStore.data_annon?.data.id },
                  })
                "
                class="text-sm font-Kantumruy text-green-800 dark:text-slate-300 hover:text-warning transition cursor-pointer"
              >
                អានបន្ថែម →
              </button>
            </div>
          </div>
        </div>
        <!-- End Block Notification -->
      </div>
    </div>
  </StudentLayouts>
</template>
