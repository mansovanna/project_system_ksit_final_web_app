<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import RequestLeaveForm from '@/components/students_component/RequestLeaveForm.vue'
import { ArrowSmallUpIcon } from '@/stores/Icons'
import { useLeaveStudentStore } from '@/stores/leave_student_stote'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'

const leaveStore = useLeaveStudentStore()

onMounted(() => {
  leaveStore.getLeaveAll()
})

/* ---------------- Pagination ---------------- */
const formatDate = (date: string) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}-${month}-${year}`
}

const getDays = (start: string, end: string) => {
  if (!start || !end) return 'N/A'

  const startDate = new Date(start)
  const endDate = new Date(end)

  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return diffDays + 1 // +1 if you want inclusive days
}
/* ---------------- Status UI ---------------- */

const tapButton = (tab: string) => {
  leaveStore.activeTab = tab
  leaveStore.getLeaveAll(tab, leaveStore.per_page, leaveStore.page)
}

//
let time: ReturnType<typeof setTimeout> | null = null

watch(
  () => leaveStore.per_page,
  (value: number) => {
    if (time) clearTimeout(time)

    time = setTimeout(() => {
      leaveStore.page = 1
      leaveStore.getLeaveAll(leaveStore.activeTab, value, leaveStore.page)
    }, 300)
  },
)

// Block Pagination -------------------
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
  <StudentLayouts>
    <div class="p-4 flex max-lg:flex-col gap-4 items-start">
      <!-- LIST (LEFT) -->
      <div class="w-2/3 max-lg:w-full flex flex-col gap-4">
        <!-- FILTER TABS -->
        <div
          class="grid max-md:grid-cols-4 max-xl:grid-cols-6 grid-cols-10 gap-2 sticky top-0 z-10 overflow-x-auto"
        >
          <button
            v-for="tab in [
              { key: 'all', label: 'ទាំងអស់' },
              { key: 'pending', label: 'កំពុងពិនិត្យ' },
              { key: 'approved', label: 'អនុម័ត' },
              { key: 'rejected', label: 'បដិសេធ' },
            ]"
            :key="tab.key"
            @click="tapButton(tab.key)"
            class="px-4 py-2 rounded-lg text-sm transition​ max-md:text-sm text-nowrap cursor-pointer font-Kantumruy duration-500 ease-in-out"
            :class="
              leaveStore.activeTab === tab.key
                ? 'bg-emerald-700 text-white'
                : 'bg-white dark:bg-slate-700 dark:text-white text-emerald-700 border border-emerald-600'
            "
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- CARD LIST -->
        <div
          v-if="false"
          class="w-full grid max-md:grid-cols-1 max-xl:grid-cols-2 grid-cols-3 gap-4"
        >
          <div
            v-for="(item, index) in leaveStore.data?.data.data"
            :key="index"
            class="bg-white dark:bg-slate-700 rounded-xl p-4 shadow-sm relative"
          >
            <div class="flex justify-between items-center mb-2">
              <p
                class="text-sm font-semibold font-poppins uppercase text-slate-700 dark:text-slate-400"
              >
                ID: {{ item.user.info?.id_card ?? 'N/A' }}
              </p>
              <div class="flex items-center gap-2">
                <span
                  class="w-5 h-5 rounded-full"
                  :class="
                    item.status === 'pending'
                      ? 'bg-radial from-yellow-200 from-10% to-yellow-500'
                      : item.status === 'approved'
                        ? 'bg-radial from-green-200 from-5% to-green-600'
                        : 'bg-radial from-red-200 from-10% to-red-600'
                  "
                />
                <span
                  class="text-sm font-medium font-Kantumruy capitalize"
                  :class="
                    item.status === 'pending'
                      ? 'text-warning'
                      : item.status === 'approved'
                        ? 'text-success'
                        : 'text-danger'
                  "
                >
                  {{ item.status }}
                </span>
              </div>
            </div>

            <div class="text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <p class="font-Kantumruy">
                ឈ្មោះ៖ {{ item.user.first_name ?? 'N/A' }} {{ item.user.last_name ?? 'N/A' }}
              </p>
              <div class="flex justify-start items-center gap-2">
                <p class="font-Kantumruy">ចំនួនថ្ងៃឈប់សម្រាក​៖</p>
                <p class="font-poppins">
                  {{ getDays(item.start_date, item.end_date) ?? 'N/A' }}
                </p>
              </div>
              <div class="flex justify-start items-center gap-2">
                <p class="font-Kantumruy">ចន្លោះថ្ងៃ៖</p>
                <p class="font-poppins">
                  {{ item.start_date ?? 'N/A' }} | {{ item.end_date ?? 'N/A' }}
                </p>
              </div>
              <div class="flex w-full justify-between items-end">
                <p class="font-Kantumruy">មូលហេតុ៖ {{ item.reason ?? 'N/A' }}</p>
                <div class="text-right mt-3 font-poppins text-xs text-slate-400">
                  {{ formatDate(item.created_at) ?? 'N/A' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="w-full overflow-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <table class="w-full text-nowrap">
            <thead>
              <tr class="bg-gradient-to-r from-green-600 to-green-500 text-white">
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm rounded-tl-2xl">
                  ID Card
                </th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm text-left">ឈ្មោះ</th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm">ចំនួនថ្ងៃឈប់</th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm">ចន្លោះថ្ងៃ</th>
                <th
                  class="font-Kantumruy font-normal px-4 py-3.5 text-sm text-left w-full text-wrap"
                >
                  មូលហេតុ
                </th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm">ស្ថានភាព</th>

                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm rounded-tr-2xl">
                  អ្នកត្រួតពិនិត្យ
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in leaveStore.data?.data.data"
                :key="index"
                class="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td
                  class="font-poppins font-medium px-4 py-3 text-sm text-slate-600 dark:text-slate-300 uppercase text-center"
                >
                  {{ item.user.info?.id_card ?? 'N/A' }}
                </td>

                <td class="font-Kantumruy font-normal px-4 py-3 text-slate-700 dark:text-slate-200">
                  {{ item.user.first_name ?? 'N/A' }} {{ item.user.last_name ?? 'N/A' }}
                </td>

                <td
                  class="font-poppins font-normal px-4 py-3 text-sm text-center text-slate-700 dark:text-slate-300"
                >
                  {{ getDays(item.start_date, item.end_date) ?? 'N/A' }}
                </td>

                <td
                  class="font-poppins font-normal px-4 py-3 text-sm text-center text-slate-500 dark:text-slate-400"
                >
                  {{ item.start_date ?? 'N/A' }}
                  <span class="text-slate-300 dark:text-slate-600">→</span>
                  {{ item.end_date ?? 'N/A' }}
                </td>

                <td
                  class="font-Kantumruy font-normal px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[200px] truncate"
                  :title="item.reason"
                >
                  {{ item.reason ?? 'N/A' }}
                </td>

                <td class="font-Kantumruy font-normal px-4 py-3">
                  <div class="flex items-center justify-center gap-2">
                    <span
                      class="size-4 rounded-full"
                      :class="
                        item.status === 'pending'
                          ? 'bg-radial from-yellow-200 from-10% to-yellow-500'
                          : item.status === 'approved'
                            ? 'bg-radial from-green-200 from-5% to-green-600'
                            : 'bg-radial from-red-200 from-10% to-red-600'
                      "
                    />
                    <span
                      class="text-sm font-medium font-Kantumruy capitalize"
                      :class="
                        item.status === 'pending'
                          ? 'text-warning'
                          : item.status === 'approved'
                            ? 'text-success'
                            : 'text-danger'
                      "
                    >
                      {{ item.status }}
                    </span>
                  </div>
                </td>

                <td
                  class="font-poppins font-normal px-4 py-1 text-xs text-center text-slate-400 capitalize"
                >
                  <div class="flex items-center gap-2.5">
                    <div
                      v-if="item.approved_by"
                      class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-poppins text-xs font-semibold shrink-0"
                    >
                      {{ item.approved_by.charAt(0).toUpperCase() }}
                    </div>

                    <span class="text-slate-700 dark:text-slate-200">
                      {{ item.approved_by || 'Null' }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
          <NotData />
        </div>
        <!-- End Block data empty -->

        <!-- PAGINATION -->
        <div
          v-if="leaveStore.data?.data.data.length"
          class="w-full flex justify-between items-center gap-4 max-md:flex-col"
        >
          <div class="flex flex-row items-center justify-start max-md:justify-between gap-3 w-full">
            <!-- Text -->
            <p class="text-sm text-slate-600 font-Kantumruy">
              បង្ហាញ
              <span class="font-semibold text-slate-800">
                {{ leaveStore.data?.data.from }}
              </span>
              -
              <span class="font-semibold text-slate-800">
                {{ leaveStore.data?.data.to }}
              </span>
              នៃ
              <span class="font-semibold text-green-600">
                {{ leaveStore.data?.data.total }}
              </span>
            </p>

            <!-- Input per page -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-slate-500 font-Kantumruy"> ចំនួន/ទំព័រ </label>

              <input
                type="number"
                min="1"
                v-model="leaveStore.per_page"
                class="w-16 text-center px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition duration-200"
              />
            </div>
          </div>

          <div class="flex justify-center items-center gap-2">
            <!-- Prev -->

            <button
              :disabled="leaveStore.data?.data.current_page <= 1"
              @click="
                leaveStore.getLeaveAll(
                  leaveStore.status,
                  leaveStore.per_page,
                  leaveStore.data?.data.current_page - 1,
                )
              "
              :class="
                leaveStore.data?.data.current_page <= 1
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
                :disabled="leaveStore.data?.data.current_page == page"
                @click="
                  leaveStore.getLeaveAll(leaveStore.status, leaveStore.per_page, Number(page))
                "
                :class="
                  leaveStore.data?.data.current_page == page
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
              :disabled="leaveStore.data?.data.current_page >= leaveStore.data?.data.last_page"
              @click="
                leaveStore.getLeaveAll(
                  leaveStore.status,
                  leaveStore.per_page,
                  leaveStore.data?.data.current_page + 1,
                )
              "
              :class="
                leaveStore.data?.data.current_page >= leaveStore.data?.data.last_page
                  ? 'text-green-600 bg-slate-600/10 dark:bg-slate-600'
                  : ' bg-green-600 text-white'
              "
              class="w-8 h-8 justify-center disabled:opacity-50 disabled:cursor-not-allowed items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>
          </div>
        </div>
      </div>

      <!-- FORM (RIGHT) -->
      <div class="w-1/3 max-lg:w-full max-lg:hidden sticky top-20">
        <RequestLeaveForm />
      </div>
    </div>
  </StudentLayouts>
</template>
