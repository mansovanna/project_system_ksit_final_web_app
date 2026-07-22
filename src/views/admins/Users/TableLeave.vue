<script setup lang="ts">
import { SearchIcon, ArrowSmallUpIcon } from '@/stores/Icons'
import { useLeaveStore } from '@/stores/leave_store'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'

const leaveStore = useLeaveStore()
const route = useRoute()

onMounted(() => {
  if (route.params.id) {
    leaveStore.getLeaveByIdStudent(
      Number(route.params.id),
      leaveStore.search,
      leaveStore.per_page ?? 10,
      leaveStore.page ?? 1,
    )
  }
})

let timer: ReturnType<typeof setTimeout>
watch([() => leaveStore.search, () => leaveStore.per_page], ([search, per_page]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    leaveStore.getLeaveByIdStudent(
      Number(route.params.id),
      search,
      per_page ?? 10,
      leaveStore.page ?? 1,
    )
  }, 500)
})

const pages = computed(() => {
  const current = leaveStore.data?.data.current_page || 1
  const last = leaveStore.data?.data.last_page || 1

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
  <div
    class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
  >
    <div class="w-full flex justify-between items-center">
      <h1 class="font-Kantumruy font-medium text-slate-500">Table Request Leave</h1>
      <div>
        <div class="w-full relative">
          <input
            type="text"
            v-model="leaveStore.search"
            class="border pl-4 pr-10 py-2 rounded-md border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
            placeholder="Search..."
          />
          <!-- icon -->
          <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
            <component :is="SearchIcon" class="text-slate-400" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="leaveStore.data?.data.data" class="w-full overflow-x-auto mt-4">
      <table class="w-full">
        <thead>
          <tr
            class="w-full bg-slate-100 dark:bg-slate-500 font-Kantumruy text-nowrap text-slate-500 uppercase"
          >
            <td class="px-3 py-2 text-left">ID</td>
            <td class="px-3 py-2 text-left">Reason</td>
            <td class="px-3 py-2 text-left">Start Date</td>
            <td class="px-3 py-2 text-left">End Date</td>
            <td class="px-3 py-2 text-left">Admin</td>
            <td class="px-3 py-2 text-center">Status</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in leaveStore.data?.data?.data"
            :key="index"
            class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
          >
            <td class="px-3 py-2 font-Kantumruy text-slate-500">{{ index + 1 }}</td>

            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-left">
              {{ item.reason ?? 'N/A' }}
            </td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-left">
              {{ item.start_date ?? 'N/A' }}
            </td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-left">
              {{ item.end_date ?? 'N/A' }}
            </td>

            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-left">
              <!--  -->
              <span
                class="px-2 py-1 bg-slate-500/10 rounded-full border border-slate-200 text-xs"
                >{{ item.approved_by ?? 'N/A' }}</span
              >
            </td>
            <td class="px-3 py-2 text-center">
              <!--  -->
              <div class="flex justify-center">
                <div
                  class="border rounded-full px-3 py-1.5 flex justify-center items-center capitalize font-medium"
                  :class="
                    item.status === 'pending'
                      ? 'border-warning bg-warning/10'
                      : item.status === 'approved'
                        ? 'border-green-700 bg-green-700/10'
                        : 'border-red-700 bg-red-700/10'
                  "
                >
                  <p
                    class="text-xs font-Kantumruy"
                    :class="
                      item.status == 'pending'
                        ? 'text-warning'
                        : item.status == 'approved'
                          ? 'text-green-600'
                          : 'text-red-600'
                    "
                  >
                    {{ item.status ?? 'N/A' }}
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--  -->
    <hr class="text-slate-300" />

    <!-- Block loading -->
    <div v-if="leaveStore.isLoading" class="w-full p-6 flex justify-center items-center">
      <div class="w-10 h-10 flex justify-center items-center gap-1">
        <component :is="Loading" />
      </div>
    </div>
    <!-- End Block loading -->

    <!-- Block data empty -->
    <div
      v-else-if="leaveStore.data?.data.data.length == 0 && !leaveStore.isLoading"
      class="w-full flex justify-center items-center p-4"
    >
      <not-data />
    </div>
    <!-- End Block data empty -->

    <!-- pagination -->
    <!-- Pagination Block code control -->
    <div
      v-if="leaveStore.data?.data.data.length"
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
            leaveStore.getLeaves(leaveStore.search, leaveStore.per_page, leaveStore.page)
          "
        >
          <input
            type="number"
            v-model="leaveStore.per_page"
            class="border border-slate-300 px-3 py-1 pl-15 w-36 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 font-Kantumruy font-medium text-slate-400"
          />
        </form>
      </div>

      <!-- <p>current page: {{ roomStore.room_list?.data.current_page }}</p> -->
      <!--  -->

      <!-- -------------------------------------------------- -->
      <div class="flex justify-center items-center gap-2">
        <!-- Prev -->

        <button
          :disabled="leaveStore.data?.data.current_page <= 1"
          @click="
            leaveStore.getLeaves(
              leaveStore.search,
              leaveStore.per_page,
              Number(leaveStore.data?.data.current_page) - 1,
            )
          "
          :class="
            leaveStore.data?.data.current_page <= 1
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
            :disabled="leaveStore.data?.data.current_page == page"
            @click="leaveStore.getLeaves(leaveStore.search, leaveStore.per_page, Number(page))"
            :class="
              leaveStore.data?.data.current_page == page
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
          :disabled="leaveStore.data?.data.current_page >= leaveStore.data?.data.last_page"
          @click="
            leaveStore.getLeaves(
              leaveStore.search,
              leaveStore.per_page,
              Number(leaveStore.data?.data.current_page) + 1,
            )
          "
          :class="
            leaveStore.data?.data.current_page >= leaveStore.data?.data.last_page
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
</template>
