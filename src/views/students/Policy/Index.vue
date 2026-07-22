<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import { ArrowBackIcon, DateIcon, DocumentIcon, DownloadIcon } from '@/stores/Icons'
import { useAnnouncementStore } from '@/stores/announcement_store'
import { usePolicyStore } from '@/stores/policy_store'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'
import { onMounted } from 'vue'

const announcementStore = useAnnouncementStore()
const policyStore = usePolicyStore()

onMounted(() => {
  policyStore.getPolicyOnly({ search: '', per_page: 10, page: 1 })
})
</script>

<template>
  <StudentLayouts>
    <div class="w-full px-4 py-4 max-md:pb-20 space-y-4">
      <!-- ================= HEADER ================= -->
      <!-- header -->
      <div class="w-full">
        <button
          @click="() => $router.back()"
          class="px-4 py-1.5 hidden max-lg:flex justify-center items-center gap-2 cursor-pointer hover:bg-red-500 transition-all bg-slate-600 text-white font-Kantumruy font-medium rounded-md"
        >
          <component :is="ArrowBackIcon" />
          <span>Back</span>
        </button>
      </div>
      <!-- End header -->
      <!-- ================= END HEADER ================= -->

      <div v-if="policyStore.data?.data.data.length" class="flex flex-col gap-4">
        <div
          v-for="(item, index) in policyStore.data?.data.data"
          :key="index"
          class="w-full bg-white dark:bg-slate-800 rounded-2xl overflow-clip flex flex-col gap-4"
        >
          <div class="w-full p-4 bg-green-700 text-white text-xl font-Kantumruy">
            <h1 class="font-Kantumruy text-center font-medium">{{ item.title }}</h1>
          </div>
          <!-- ================= POLICY TEXT ================= -->
          <div class="px-4">
            <p class="font-Kantumruy">{{ item.description ?? 'Null' }}</p>
          </div>
          <!-- ================= END POLICY TEXT ================= -->
          <hr class="text-slate-200 dark:text-slate-600" />

          <!-- ====================== FILE =========================== -->
          <div class="px-4">
            <div
              v-if="item.file_type == 'pdf'"
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
                  {{ item.file_type }}
                </span>
              </div>

              <div class="flex items-center gap-3" @click.stop>
                <button
                  @click="
                    announcementStore.downloadFile(String(item.id), item.file_url, item.file_path)
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
          </div>
          <!-- ==================== Emd FILE ============================= -->
          <div class="px-4 pb-4 flex justify-start items-center gap-4">
            <!-- =============== Date ================== -->
            <div class="flex justify-start items-center gap-1">
              <component :is="DateIcon" />
              <span class="font-Kantumruy text-xs font-medium text-slate-500">
                {{
                  new Date(item.created_at ?? '').toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                }}
              </span>
            </div>

            <!-- ================= File ================== -->
            <div class="flex justify-start items-center gap-1 text-blue-600">
              <component class="w-5 h-5" :is="DocumentIcon" />
              <span class="font-Kantumruy text-xs font-medium text-slate-500 uppercase">
                {{ item.file_type }}
              </span>
            </div>
          </div>
          <!-- ================= END DATE ================= -->
        </div>
      </div>

      <!-- Block loading -->
      <div v-if="policyStore.isLoading" class="w-full p-6 flex justify-center items-center">
        <div class="w-10 h-10 flex justify-center items-center gap-1">
          <Loading />
        </div>
      </div>
      <!-- End Block loading -->

      <!-- Block data empty -->

      <div
        v-else-if="policyStore.data?.data.data.length == 0 && !policyStore.isLoading"
        class="w-full flex justify-center items-center p-4"
      >
        <NotData />
      </div>
      <!-- End Block data empty -->
    </div>
  </StudentLayouts>
</template>
