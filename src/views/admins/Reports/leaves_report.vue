<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CSVIcon,
  NotDataSVGICON,
  PrintIcon,
  RefreshIcon,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'
import { useLeaveStore } from '@/stores/leave_store'
import { computed, onMounted, watch } from 'vue'
import Loading from '@/widgets/Loading.vue'

const reportStore = useLeaveStore()
const avatar = useAvatar()

onMounted(() => {
  reportStore.getLeaveReports(
    reportStore.search,
    reportStore.start_date,
    reportStore.end_date,
    reportStore.status,
    reportStore.per_page,
    reportStore.page,
  )
})

function calculateTotalDays(startDate: string, endDate: string, inclusive = true) {
  if (!startDate || !endDate) return 0

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < start) return 0

  const diffTime = end.getTime() - start.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return inclusive ? diffDays + 1 : diffDays
}
// Block Pagination -------------------
const pages = computed(() => {
  const current = Number(reportStore.data?.data.current_page) || 1
  const last = Number(reportStore.data?.data.last_page) || 1

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

//------------------------------------------
let time: ReturnType<typeof setTimeout>
watch(
  () => [
    reportStore.search,
    reportStore.start_date,
    reportStore.end_date,
    reportStore.status,
    reportStore.per_page,
    reportStore.page,
  ],
  () => {
    clearTimeout(time)
    time = setTimeout(() => {
      reportStore.getLeaveReports(
        reportStore.search,
        reportStore.start_date,
        reportStore.end_date,
        reportStore.status,
        reportStore.per_page,
        reportStore.page,
      )
    }, 1000)
  },
)

// reset and reload data
const reload = () => {
  reportStore.search = ''
  reportStore.start_date = ''
  reportStore.end_date = ''
  reportStore.status = 'all'
  reportStore.per_page = 10
  reportStore.page = 1

  reportStore.getLeaveReports(
    reportStore.search,
    reportStore.start_date,
    reportStore.end_date,
    reportStore.status,
    reportStore.per_page,
    reportStore.page,
  )
}
</script>

<template>
  <AdminLayouts>
    <div class="p-4">
      <!-- Add your admin home content here -->
      <div
        class="w-full p-4 max-md:p-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
      >
        <div class="w-full flex justify-between items-center">
          <div>
            <div class="flex justify-start items-center">
              <h1
                @click="$router.push('/admin')"
                class="font-Kantumruy text-slate-500 cursor-pointer"
              >
                Dashboard
              </h1>
              <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
              <h1 class="font-Kantumruy text-blue-500 capitalize">{{ $route.name }}</h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>
          <!-- <p>Report</p> -->
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />
        <div class="w-full flex justify-between gap-4 max-xl:flex-col max-md:gap-4">
          <!-- Search Block -->
          <div class="w-full">
            <div
              class="flex justify-start items-center gap-4 w-full max-lg:flex-col max-lg:justify-start max-lg:items-center"
            >
              <div class="flex w-full max-xl:w-1/2 max-lg:w-full">
                <div class="relative w-full">
                  <input
                    type="text"
                    v-model="reportStore.search"
                    class="border pl-4 pr-10 py-2 rounded-md dark:text-white border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    placeholder="Search..."
                  />
                  <!-- icon -->
                  <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
                    <component :is="SearchIcon" class="text-slate-400" />
                  </div>
                </div>
              </div>

              <!--  -->
              <div class="w-full grid grid-cols-3 gap-4 max-md:grid-cols-1">
                <div class="flex">
                  <div class="w-full relative">
                    <input
                      type="date"
                      v-model="reportStore.start_date"
                      class="border px-4 py-2 rounded-md dark:text-white border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      placeholder="Search..."
                    />
                    <!-- icon -->
                  </div>
                </div>

                <!-- searc last year -->
                <div class="flex">
                  <div class="w-full relative">
                    <input
                      type="date"
                      v-model="reportStore.end_date"
                      class="border px-4 py-2 rounded-md dark:text-white border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      placeholder="Search..."
                    />
                    <!-- icon -->
                  </div>
                </div>

                <!-- search status -->
                <div class="flex">
                  <div class="w-full relative">
                    <select
                      name="status"
                      id=""
                      v-model="reportStore.status"
                      class="border capitalize px-4 py-2.5 dark:text-white dark:bg-slate-800 rounded-md border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                      <option value="all">All</option>
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>
                    </select>
                    <!-- icon -->
                  </div>
                </div>
              </div>

              <!-- Refresh Page -->
            </div>
          </div>
          <!-- ------- -->

          <div class="flex justify-between items-center gap-3 max-md:gap-1">
            <button
              @click="reload"
              class="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-400 font-poppins font-medium flex justify-center items-center gap-2"
            >
              <div>
                <component :is="RefreshIcon" class="text-white" />
              </div>
              <span>Refresh</span>
            </button>
            <div class="flex justify-end items-center gap-3">
              <button
                class="p-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-500 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
              >
                <component :is="CSVIcon" />
                <span>CSV</span>
              </button>
              <button
                class="p-2 px-4 bg-warning text-white rounded-md hover:bg-warning/80 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
              >
                <component :is="PrintIcon" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
        <!-- End Search Block -->
      </div>

      <div
        class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-700 font-Kantumruy text-nowrap text-slate-500 dark:text-white uppercase"
              >
                <td class="px-3 py-2 text-left">ID</td>
                <td class="px-3 py-2 text-center">About User</td>
                <td class="px-3 py-2 text-center">About Phone</td>
                <td class="px-3 py-2 text-center">About Study</td>
                <td class="px-3 py-2 text-center">Start Date</td>
                <td class="px-3 py-2 text-center">End Date</td>
                <td class="px-3 py-2 text-center">Total Days</td>
                <td class="px-3 py-2 text-left">Reason</td>
                <td class="px-3 py-2 text-center">Status</td>
                <td class="px-3 py-2 text-center">Actions</td>
              </tr>
            </thead>

            <tbody v-if="reportStore.data?.data.data.length">
              <tr
                v-for="(item, index) in reportStore.data?.data.data"
                :key="index"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-3 py-2 font-Kantumruy text-slate-500 uppercase">
                  {{ index + 1 }}
                </td>
                <td class="px-3 py-2 flex flex-start items-center w-45">
                  <div class="flex justify-start items-center gap-3">
                    <div class="w-12 h-12">
                      <img
                        :src="
                          item.user.profile_photo_url
                            ? item.user.profile_photo_url
                            : avatar.textToImage(item.user.user_name ?? 'User')
                        "
                        class="rounded-full w-12 h-12 object-center object-cover border-2 border-blue-700"
                        alt=""
                      />
                    </div>
                    <div class=" ">
                      <p class="font-Kantumruy text-lg">
                        {{ item.user.first_name ?? 'Null' }} {{ item.user.last_name ?? 'Null' }}
                      </p>
                      <p class="font-poppins text-slate-500 text-xs uppercase mt-0.5">
                        {{ item.user.info?.id_card ?? 'Null' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-3 py-2 font-Kantumruy text-slate-500">
                  <div>
                    <p>Student: {{ item.user.phone_number ?? 'Null' }}</p>
                    <p>Parent: {{ item.user.info?.phone_parent ?? 'Null' }}</p>
                  </div>
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">
                  <div class="flex flex-col justify-center items-start capitalize">
                    <p>
                      Level: {{ item.user.info?.level ?? 'Null' }} - Year:
                      {{ item.user.info?.year ?? 'Null' }}
                    </p>
                    <p>Major: {{ item.user.info?.major ?? 'Null' }}</p>
                  </div>
                </td>
                <td class="px-3 py-2 font-poppins text-slate-500 text-center">
                  {{ item.start_date ?? 'Null' }}
                </td>
                <td class="px-3 py-2 font-poppins text-slate-500 text-center">
                  {{ item.end_date ?? 'Null' }}
                </td>
                <td class="px-3 py-2 font-poppins text-slate-500 text-center">
                  {{ calculateTotalDays(item.start_date, item.end_date) }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 w-md">
                  {{ item.reason ?? 'Null' }}
                </td>

                <td class="px-3 py-2 text-center">
                  <!--  -->
                  <div class="flex justify-center items-center">
                    <div
                      class="border rounded-full px-3 py-1 bg-green-600/10"
                      :class="
                        item.status == 'rejected'
                          ? 'bg-red-500/20 border-red-500'
                          : item.status == 'pending'
                            ? 'bg-warning/20 border-warning'
                            : item.status == 'approved'
                              ? 'bg-green-600/20 border-green-600'
                              : 'bg-slate-500/24'
                      "
                    >
                      <p
                        class="text-xs text-green-600 font-Kantumruy font-medium capitalize"
                        :class="
                          item.status == 'block'
                            ? 'text-red-500 dark:text-red-400'
                            : item.status == 'pending'
                              ? 'text-warning'
                              : item.status == 'active'
                                ? 'text-green-600'
                                : 'text-slate-500'
                        "
                      >
                        {{ item.status }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-3 py-2 text-center">
                  <!--  -->
                  <button
                    @click="$router.push({ name: 'leaves-detail', params: { id: item.id } })"
                    class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                  >
                    <component :is="ViewIcon" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--  -->
        <hr class="text-slate-300" />

        <!-- Block loading -->
        <div v-if="reportStore.isLoading" class="w-full p-6 flex justify-center items-center">
          <div class="w-10 h-10 flex justify-center items-center gap-1">
            <component :is="Loading" />
          </div>
        </div>
        <!-- End Block loading -->

        <!-- Block data empty -->

        <div
          v-else-if="reportStore.data?.data.data.length == 0 && !reportStore.isLoading"
          class="w-full flex justify-center items-center p-4"
        >
          <!-- <NotData /> -->
          <div>
            <img :src="NotDataSVGICON" alt="" />
          </div>
        </div>
        <!-- End Block data empty -->

        <div
          v-if="reportStore.data?.data.data.length"
          class="w-full mt-4 flex justify-between items-center gap-3 max-md:flex-col"
        >
          <!--  -->
          <div class="relative">
            <div class="flex justify-start items-center absolute top-0 bottom-0 left-0.5">
              <p
                class="bg-slate-100 dark:bg-slate-600 dark:text-slate-300 px-2 border-r border-slate-300 py-1 font-Kantumruy text-slate-500 rounded-l-md"
              >
                Page
              </p>
            </div>
            <form
              @submit.prevent="
                reportStore.getLeaveReports(
                  reportStore.search,
                  reportStore.start_date,
                  reportStore.end_date,
                  reportStore.status,
                  reportStore.per_page,
                  reportStore.page,
                )
              "
            >
              <input
                type="number"
                v-model="reportStore.per_page"
                class="border border-slate-300 px-3 py-1 pl-15 w-36 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 font-Kantumruy font-medium text-slate-400"
              />
            </form>
          </div>

          <!-- -------------------------------------------------- -->
          <div class="flex justify-center items-center gap-2">
            <!-- Prev -->

            <button
              :disabled="Number(reportStore.data?.data.current_page) <= 1"
              @click="
                reportStore.getLeaveReports(
                  reportStore.search,
                  reportStore.start_date,
                  reportStore.end_date,
                  reportStore.status,
                  reportStore.per_page,
                  Number(reportStore.data?.data.current_page) - 1,
                )
              "
              :class="
                Number(reportStore.data?.data.current_page) <= 1
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
                :disabled="reportStore.data?.data.current_page == page"
                @click="
                  reportStore.getLeaveReports(
                    reportStore.search,
                    reportStore.start_date,
                    reportStore.end_date,
                    reportStore.status,
                    reportStore.per_page,
                    Number(page),
                  )
                "
                :class="
                  reportStore.data?.data.current_page == page
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
                Number(reportStore.data?.data.current_page) >=
                Number(reportStore.data?.data.last_page)
              "
              @click="
                reportStore.getLeaveReports(
                  reportStore.search,
                  reportStore.start_date,
                  reportStore.end_date,
                  reportStore.status,
                  reportStore.per_page,
                  Number(reportStore.data?.data.current_page) + 1,
                )
              "
              :class="
                Number(reportStore.data?.data.current_page) >=
                Number(reportStore.data?.data.last_page)
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
    </div>
  </AdminLayouts>
</template>
