<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import IndexLayouts from '@/layouts/IndexLayouts.vue'

import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.getOneAnnouncementOnly()
})
</script>

<template>
  <IndexLayouts>
    <!-- ANNOUNCEMENT SECTION -->
    <div class="w-full mt-24">
      <div v-if="authStore.isLoading" class="w-full flex justify-center items-center p-6">
        <div class="w-12 h-12">
          <loading />
        </div>
      </div>
      <!-- Announcement available -->
      <div v-else-if="!authStore.data_annon?.data" class="w-full p-4">
        <span
          class="w-full text-center font-Kantumruy text-slate-500 flex justify-center items-center"
          >No data available</span
        >
      </div>
      <!-- Announcement Details -->
      <div v-else class="w-full p-4">
        <div class="flex flex-col gap-4">
          <!-- Info / Title -->
          <div
            class="p-4​ w-full bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-600"
          >
            <div class="p-4">
              <div class="w-full flex justify-between items-start gap-4">
                <h1 class="text-xl font-semibold mb-2">
                  {{ authStore.data_annon?.data.title ?? 'N/A' }}
                </h1>

                <button
                  @click="() => $router.back()"
                  class="px-4 py-1.5 bg-red-600 text-white font-Kantumruy font-medium rounded-md"
                >
                  <span>Back</span>
                </button>
              </div>
              <p class="text-slate-600 dark:text-slate-300">
                {{ authStore.data_annon?.data.description ?? 'N/A' }}
              </p>
              <span class="font-Kantumruy text-xs font-medium text-slate-500">
                {{
                  new Date(authStore.data_annon?.data.created_at ?? '').toLocaleDateString(
                    'en-GB',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    },
                  )
                }}
              </span>
            </div>
          </div>

          <!-- IMAGE Viewer -->
          <!-- <img
            v-if="authStore.data_annon?.data.file_type == 'image'"
            class=""
            :src="authStore.data_annon?.data.file_url"
            alt="PDF File"
          /> -->
          <!-- PDF Viewer -->
          <!-- <div
            v-else
            class="lg:col-span-12 p-2 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-600"
          >
            <iframe
              :src="authStore.data_annon?.data.file_url"
              class="w-full h-[85vh] rounded"
              frameborder="0"
            />
          </div> -->
        </div>
      </div>
    </div>
  </IndexLayouts>
</template>
