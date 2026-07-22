<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import { AnnoouncementIconFille, ArrowSmallUpIcon, SearchIcon } from '@/stores/Icons'
import { useAnnouncementStore } from '@/stores/announcement_store'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'

const annouceStore = useAnnouncementStore()

const formatDate = (date: string) => {
  if (!date) return ''

  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
onMounted(() => {
  annouceStore.studentAnnouncements(
    String(annouceStore.search),
    Number(annouceStore.per_page),
    Number(annouceStore.page),
  )
})

let timer: NodeJS.Timeout | null = null
watch(
  () => [annouceStore.search, annouceStore.per_page, annouceStore.page],
  ([search, per_page, page]) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      annouceStore.studentAnnouncements(String(search), Number(per_page), Number(page))
    }, 500)
  },
)

const pages = computed(() => {
  const current = annouceStore.data?.data.current_page || 1
  const last = annouceStore.data?.data.last_page || 1

  const range = []

  // always show first
  if (current > 2) {
    range.push(1)
  }

  // show ...
  if (current > 3) {
    range.push('...')
  }

  // show current -1
  if (current > 1) {
    range.push(current - 1)
  }

  // show current
  range.push(current)

  // show current +1
  if (current < last) {
    range.push(current + 1)
  }

  // show ...
  if (current < last - 2) {
    range.push('...')
  }

  // always show last
  if (current < last - 1) {
    range.push(last)
  }

  return range
})
</script>

<template>
  <StudentLayouts>
    <!-- ===== Wrapper ===== -->
    <div class="px-4 py-4 max-w-full mx-auto space-y-4">
      <div
        class="w-full p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex justify-between items-center max-md:flex-col max-md:items-start gap-4"
      >
        <div class="flex justify-start items-center gap-4">
          <div class="p-2 bg-warning text-white rounded-full">
            <component :is="AnnoouncementIconFille" />
          </div>
          <h1 class="font-hanuman text-xl max-md:text-lg">សេចក្តីជូនដំណឹង</h1>
        </div>

        <!--  -->
        <div class="w-1/4 max-md:w-full relative">
          <div>
            <input
              v-model="annouceStore.search"
              type="text"
              class="border p-2 w-full border-slate-300 rounded focus:outline-0 focus:border-green-600 focus:ring-3 focus:ring-green-700/20 font-Kantumruy"
              placeholder="Search...!"
            />
            <div
              class="absolute right-0 top-0 bottom-0 p-2 flex justify-center items-center text-slate-400"
            >
              <component :is="SearchIcon" />
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Timeline Grid ===== -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in annouceStore.data?.data.data"
          :key="index"
          @click="$router.push({ name: 'student-announcement-detail', params: { id: item.id } })"
          class="relative pl-12 cursor-pointer group"
        >
          <!-- Line -->
          <span class="absolute left-5 top-0 bottom-0 w-px bg-slate-200"></span>

          <!-- Dot -->
          <span
            class="absolute left-2.5 top-0 w-5 h-5 rounded-full border-4 font-Kantumruy"
            :class="{
              'border-red-500 bg-red-100': item.files === null,
              'border-emerald-500 bg-emerald-100': item.files,
            }"
          ></span>

          <!-- Card -->
          <div
            class="bg-white dark:bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-200 dark:border-slate-600 hover:shadow-xl hover:-translate-y-0.5 transition-all group-hover:border-emerald-400"
          >
            <div class="flex justify-between items-start gap-2">
              <h2 class="font-Kantumruy font-semibold text-base lg:text-xl">
                {{ item.title ?? 'មិនមានចំណងជើង' }}
              </h2>

              <span
                class="text-xs px-2 py-0.5 rounded-full font-Kantumruy text-nowrap font-medium"
                :class="
                  item.files.length > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                "
              >
                {{ item.files.length > 0 ? 'Files' : 'Not Files' }}
              </span>
            </div>

            <p class="mt-2 text-sm lg:text-base text-slate-600 dark:text-slate-300 font-Kantumruy">
              {{ item.description ?? 'No description' }}
            </p>

            <div class="flex justify-between mt-4 text-xs text-slate-400">
              <span class="font-Kantumruy">{{
                item.created_at ? formatDate(item.created_at) : 'N/A'
              }}</span>
              <span
                class="flex justify-center items-center text-blue-700 hover:underline font-Kantumruy"
                ><p class="font-Kantumruy uppercase font-medium">
                  {{ item.files ? 'ឯកសារភ្ជាប់' : 'N/A' }}
                </p>
                · ចុចមើល</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Block Page control -->
      <div class="w-full flex justify-between items-center gap-4 max-md:flex-col">
        <!-- Block loading -->
        <div v-if="annouceStore.isLoading" class="w-full p-6 flex justify-center items-center">
          <div class="w-10 h-10 flex justify-center items-center gap-1">
            <component :is="Loading" />
          </div>
        </div>
        <!-- End Block loading -->

        <!-- Block data empty -->

        <div
          v-else-if="annouceStore.data?.data.data.length == 0 && !annouceStore.isLoading"
          class="w-full flex justify-center items-center p-4"
        >
          <NotData />
        </div>
        <!-- End Block data empty -->

        <!-- PAGINATION -->
        <div
          v-if="annouceStore.data?.data.data.length"
          class="w-full flex justify-between items-center gap-4 max-md:flex-col"
        >
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <!-- Text -->
            <p class="text-sm text-slate-600 font-Kantumruy">
              បង្ហាញ
              <span class="font-semibold text-slate-800">
                {{ annouceStore.data?.data.from }}
              </span>
              -
              <span class="font-semibold text-slate-800">
                {{ annouceStore.data?.data.to }}
              </span>
              នៃ
              <span class="font-semibold text-green-600">
                {{ annouceStore.data?.data.total }}
              </span>
            </p>

            <!-- Input per page -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-slate-500 font-Kantumruy"> ចំនួន/ទំព័រ </label>

              <input
                type="number"
                min="1"
                v-model="annouceStore.per_page"
                class="w-16 text-center px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition duration-200"
              />
            </div>
          </div>

          <div class="flex justify-center items-center gap-2">
            <!-- Prev -->

            <button
              :disabled="annouceStore.data?.data.current_page <= 1"
              @click="
                annouceStore.studentAnnouncements(
                  annouceStore.search,
                  annouceStore.per_page,
                  annouceStore.data?.data.current_page - 1,
                )
              "
              :class="
                annouceStore.data?.data.current_page <= 1
                  ? 'text-green-600 bg-slate-600/10 dark:bg-slate-600'
                  : ' bg-green-600 text-white'
              "
              class="w-8 h-8 justify-center font-Kantumruy disabled:opacity-50 disabled:cursor-not-allowed items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <component class="-rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>

            <!-- Pages -->
            <template v-for="(page, index) in pages" :key="index">
              <!-- number -->

              <button
                v-if="page !== '...'"
                :disabled="annouceStore.data?.data.current_page == page"
                @click="
                  annouceStore.studentAnnouncements(
                    annouceStore.search,
                    annouceStore.per_page,
                    Number(page),
                  )
                "
                :class="
                  annouceStore.data?.data.current_page == page
                    ? 'bg-green-600  text-white'
                    : ' bg-slate-200 dark:bg-slate-600 text-green-600 dark:text-white'
                "
                class="w-8 h-8 justify-center items-center flex rounded-full hover:bg-blue-400 hover:text-white cursor-pointer"
              >
                <p class="font-Kantumruy font-medium">{{ page }}</p>
              </button>

              <!-- dots -->
              <span v-else class="px-2 text-slate-400">...</span>
            </template>

            <button
              :disabled="annouceStore.data?.data.current_page >= annouceStore.data?.data.last_page"
              @click="
                annouceStore.studentAnnouncements(
                  annouceStore.search,
                  annouceStore.per_page,
                  annouceStore.data?.data.current_page + 1,
                )
              "
              :class="
                annouceStore.data?.data.current_page >= annouceStore.data?.data.last_page
                  ? 'text-green-600 bg-slate-600/10 dark:bg-slate-600'
                  : ' bg-green-600 text-white'
              "
              class="w-8 h-8 justify-center disabled:opacity-50 disabled:cursor-not-allowed items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>
          </div>
        </div>
        <!-- End PAGINATION -->
      </div>
    </div>

    <!-- ===== Modal / Bottom Sheet ===== -->
  </StudentLayouts>
</template>

<!-- backdrop-blur-sm -->
<style scoped>
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slideUp {
  animation: slideUp 0.35s ease-out;
}
</style>
