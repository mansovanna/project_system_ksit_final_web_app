<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import Headers from './Headers.vue'
import { ArrowSmallUpIcon } from '@/stores/Icons'
import TabldData from './TabldData.vue'

import FormCreate from './FormCreate.vue'

// import Loading from '@/widgets/Loading.vue'
// import AvailableData from '@/widgets/AvailableData.vue'
import { useStaffStore } from '@/stores/staffStore'
import { computed, onMounted } from 'vue'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'

const staffStore = useStaffStore()

onMounted(() => {
  staffStore.get_staff_all(staffStore.search, staffStore.per_page, staffStore.page)
})

const pages = computed(() => {
  const current = staffStore.staff_list?.data.current_page || 1
  const last = staffStore.staff_list?.data.last_page || 1

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
  <AdminLayouts>
    <FormCreate v-if="staffStore.isShowCreate" />
    <div class="p-4">
      <!-- Add your admin home content here -->
      <Headers />

      <!--  -->

      <!-- Loading -->

      <div
        class="bg-white dark:bg-slate-800 rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:text-white"
      >
        <div class="w-full overflow-x-auto">
          <!-- Table for Staff and Admin -->
          <TabldData />
        </div>

        <!-- Loading -->
        <div v-if="staffStore.isLoading" class="w-full flex justify-center items-center p-4">
          <div class="w-12 h-12">
            <Loading />
          </div>
        </div>
        <!-- End loading -->

        <!-- Block data empty -->

        <div
          v-if="!staffStore.staff_list?.data.data.length && !staffStore.isLoading"
          class="w-full flex justify-center items-center p-4"
        >
          <NotData />
        </div>
        <!-- End Block data empty -->

        <!--  -->
        <hr class="text-slate-300" />

        <!-- Pagination -->

        <div
          v-if="staffStore.staff_list?.data.data.length"
          class="w-full mt-4 flex justify-between items-center gap-3 max-md:flex-col"
        >
          <!--  -->
          <div class="relative">
            <div class="flex justify-start items-center absolute top-0 bottom-0 left-0.5">
              <p
                class="bg-slate-100 dark:bg-slate-600 dark:text-slate-300 px-2 border-r border-slate-300 py-1 font-Kantumruy text-slate-500 rounded-l"
              >
                Page
              </p>
            </div>
            <form
              @submit.prevent="
                staffStore.get_staff_all(staffStore.search, staffStore.per_page, staffStore.page)
              "
            >
              <input
                type="number"
                v-model="staffStore.per_page"
                class="border border-slate-300 px-3 py-1 pl-18 w-30 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 font-Kantumruy font-medium text-slate-400"
              />
            </form>
          </div>

          <!-- <p>current page: {{ roomStore.room_list?.data.current_page }}</p> -->
          <!--  -->

          <!-- -------------------------------------------------- -->
          <div class="flex justify-center items-center gap-2">
            <!-- Prev -->

            <button
              :disabled="staffStore.staff_list.data.current_page <= 1"
              @click="
                staffStore.get_staff_all(
                  staffStore.search,
                  staffStore.per_page,
                  Number(staffStore.staff_list?.data.current_page) - 1,
                )
              "
              :class="
                staffStore.staff_list.data.current_page <= 1
                  ? 'text-blue-600 bg-slate-600/10 dark:bg-slate-600'
                  : ' bg-blue-600 text-white'
              "
              class="w-8 h-8 justify-center items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <component class="-rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>

            <!-- Pages -->
            <template v-for="(page, index) in pages" :key="index">
              <!-- number -->

              <button
                v-if="page !== '...'"
                :disabled="staffStore.staff_list.data.current_page == page"
                @click="
                  staffStore.get_staff_all(staffStore.search, staffStore.per_page, Number(page))
                "
                :class="
                  staffStore.staff_list?.data.current_page == page
                    ? 'bg-blue-600  text-white'
                    : ' bg-slate-200 text-blue-600'
                "
                class="w-8 h-8 justify-center items-center flex rounded-full hover:bg-blue-400 hover:text-white cursor-pointer"
              >
                <p class="font-Kantumruy font-medium">{{ page }}</p>
              </button>

              <!-- dots -->
              <span v-else class="px-2 text-slate-400">...</span>
            </template>

            <button
              :disabled="
                staffStore.staff_list.data.current_page >= staffStore.staff_list.data.last_page
              "
              @click="
                staffStore.get_staff_all(
                  staffStore.search,
                  staffStore.per_page,
                  Number(staffStore.staff_list?.data.current_page) + 1,
                )
              "
              :class="
                staffStore.staff_list?.data.current_page >= staffStore.staff_list.data.last_page
                  ? 'text-blue-600 bg-slate-600/10 dark:bg-slate-600'
                  : ' bg-blue-600 text-white'
              "
              class="w-8 h-8 justify-center items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>
          </div>
        </div>
      </div>

      <!--  -->
      <!-- <AvailableData />
      <Loading /> -->
    </div>
  </AdminLayouts>
</template>
