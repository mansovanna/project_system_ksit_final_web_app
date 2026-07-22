<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import { useAnnouncementStore } from '@/stores/announcement_store'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Loading from '@/widgets/Loading.vue'
import { ArrowBackIcon, DateIcon, DocumentIcon, DownloadIcon } from '@/stores/Icons'

const annouceStore = useAnnouncementStore()
const route = useRoute()
const announcementStore = useAnnouncementStore()

onMounted(() => {
  // Fetch the announcement details when the component is mounted
  // You can replace '1' with the actual ID of the announcement you want to fetch
  if (route.params.id) {
    annouceStore.studentAnnouncementDetail(String(route.params.id))
  }
})
</script>

<template>
  <StudentLayouts>
    <div class="w-full p-4 space-y-4">
      <!-- header -->
      <div class="w-full">
        <button
          @click="() => $router.back()"
          class="px-4 py-1.5 flex justify-center items-center gap-2 cursor-pointer hover:bg-red-500 transition-all bg-slate-600 text-white font-Kantumruy font-medium rounded-md"
        >
          <component :is="ArrowBackIcon" />
          <span>Back</span>
        </button>
      </div>
      <!-- End header -->
      <!-- Announcement Details -->
      <div v-if="annouceStore.data_list?.data" class="w-full">
        <div class="flex flex-col gap-4">
          <!-- Info / Title -->
          <div
            class="​ w-full bg-white dark:bg-slate-800 rounded-xl overflow-clip border border-slate-200 dark:border-slate-600"
          >
            <div class="w-full flex justify-between items-start gap-4 bg-green-700 text-white p-4">
              <h1 class="text-xl font-semibold font-Kantumruy">Announcement Details</h1>
            </div>

            <div class="p-4">
              <h1 class="text-slate-600 dark:text-slate-300 font-Kantumruy text-xl font-medium">
                {{ annouceStore.data_list.data.title ?? 'N/A' }}
              </h1>
              <p class="text-slate-600 dark:text-slate-300 font-Kantumruy mt-2">
                {{ annouceStore.data_list.data.description ?? 'N/A' }}
              </p>
            </div>
            <hr class="text-slate-200 dark:text-slate-600" />
            <div class="flex justify-start items-center gap-1 p-4">
              <component :is="DateIcon" />
              <span class="font-Kantumruy text-xs font-medium text-slate-500">
                {{
                  new Date(annouceStore.data_list.data.created_at ?? '').toLocaleDateString(
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

          <!-- IMAGE Viewer​ -->
          <div
            v-if="annouceStore.data_list.data.files && annouceStore.data_list.data.files.length > 0"
            class="w-full p-4 bg-white dark:bg-slate-800 rounded-xl gap-4 flex flex-col border border-slate-200 dark:border-slate-600"
          >
            <div v-for="(item, index) in annouceStore.data_list.data.files" :key="index">
              <img
                v-if="item.type == 'image'"
                class="w-1/3"
                :src="item.file_url"
                :alt="item.file_name"
              />

              <!-- Header -->
              <div
                v-if="item.type == 'pdf'"
                class="w-full flex justify-between items-center bg-slate-100 dark:bg-slate-700 rounded-md p-2"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white"
                  >
                    <component :is="DocumentIcon" class="w-5 h-5" />
                  </div>

                  <span
                    class="font-Kantumruy text-slate-600 dark:text-slate-300 font-semibold uppercase"
                  >
                    {{ item.file_name }}
                  </span>
                </div>

                <div class="flex items-center gap-3" @click.stop>
                  <button
                    @click="
                      announcementStore.downloadFile(String(item.id), item.file_url, item.file_name)
                    "
                    :disabled="
                      announcementStore.item.id === String(item.id) &&
                      announcementStore.item.isLoading &&
                      announcementStore.item.status === 'download'
                    "
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-blue-500 cursor-pointer"
                  >
                    <div class="w-5 h-5 flex justify-center items-center">
                      <component
                        :is="
                          announcementStore.item.id === String(item.id) &&
                          announcementStore.item.isLoading &&
                          announcementStore.item.status === 'download'
                            ? Loading
                            : DownloadIcon
                        "
                      />
                    </div>
                  </button>
                </div>
              </div>
              <!-- PDF Viewer -->
              <!-- <div
              v-else
              class="lg:col-span-12 p-2 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-600"
            >
              <iframe :src="item.file_url" class="w-full h-[85vh] rounded" frameborder="0" />
            </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Block loading -->
      <div v-if="annouceStore.isLoading" class="w-full p-6 flex justify-center items-center">
        <div class="w-10 h-10 flex justify-center items-center gap-1">
          <component :is="Loading" />
        </div>
      </div>
      <!-- End Block loading -->

      <!-- Block data empty -->

      <div
        v-else-if="!annouceStore.data_list?.data && !annouceStore.isLoading"
        class="w-full flex justify-center items-center p-4"
      >
        <NotData />
      </div>
      <!-- End Block data empty -->
    </div>
  </StudentLayouts>
</template>
