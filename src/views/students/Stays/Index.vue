<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import { ArrowSmallUpIcon } from '@/stores/Icons'
import { useStaysStudentStore } from '@/stores/stays_student_store'

import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'
const stayStore = useStaysStudentStore()

let timer: ReturnType<typeof setTimeout>
watch(
  () => stayStore.per_page,
  (per_page) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      stayStore.getStaysStudentList(per_page, stayStore.page)
    }, 500)
  },
)

onMounted(() => {
  stayStore.getStaysStudentList()
})

// Block Pagination -------------------
const pages = computed(() => {
  const current = stayStore.data?.data.current_page || 1
  const last = stayStore.data?.data.last_page || 1

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
    <div class="w-full p-4">
      <div v-if="stayStore.data?.data.data" class="max-lg:pb-24">
        <!-- Desktop Table -->
        <div
          class="w-full overflow-auto bg-white dark:bg-slate-800 rounded-2xl​ rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <table class="w-full text-nowrap">
            <thead>
              <tr class="bg-gradient-to-r from-green-600 to-green-500 text-white">
                <th
                  class="font-Kantumruy font-normal px-4 py-3.5 text-xs uppercase tracking-wider rounded-tl-2xl"
                >
                  ID
                </th>
                <th
                  class="font-Kantumruy font-normal px-4 py-3.5 text-xs uppercase tracking-wider text-left"
                >
                  Student
                </th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-xs uppercase tracking-wider">
                  Room
                </th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-xs uppercase tracking-wider">
                  Start Date
                </th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-xs uppercase tracking-wider">
                  End Date
                </th>
                <th
                  class="font-Kantumruy font-normal px-4 py-3.5 text-xs uppercase tracking-wider rounded-tr-2xl"
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody class="font-Kantumruy">
              <tr
                v-for="(item, index) in stayStore.data.data.data"
                :key="index"
                class="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td
                  class="font-poppins font-medium px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center"
                >
                  #{{ index + 1 }}
                </td>

                <td class="px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-poppins text-xs font-semibold shrink-0"
                    >
                      {{ (item.user.user_name?.[0] ?? '?').toUpperCase() }}
                    </div>
                    <span class="text-slate-700 dark:text-slate-200 text-sm">
                      {{ item.user.first_name ?? 'N/A' }} {{ item.user.last_name ?? 'N/A' }}
                    </span>
                  </div>
                </td>

                <td class="px-4 py-3 text-center">
                  <span
                    class="font-poppins text-xs px-3 py-1.5 rounded-full font-medium uppercase inline-block bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {{ item.room.building.name ?? 'N/A' }} {{ item.room.id ?? 'N/A' }} ·
                    {{ item.room.building.gender ?? 'N/A' }}
                  </span>
                </td>

                <td
                  class="font-poppins px-4 py-3 text-sm text-center text-slate-600 dark:text-slate-300"
                >
                  {{ item.start_date ?? 'N/A' }}
                </td>

                <td
                  class="font-poppins px-4 py-3 text-sm text-center text-slate-600 dark:text-slate-300"
                >
                  {{ item.end_date ?? 'N/A' }}
                </td>

                <td class="px-4 py-3 text-center">
                  <span
                    class="px-3 py-1.5 text-xs font-poppins font-semibold capitalize rounded-full inline-flex items-center gap-1.5"
                    :class="
                      item.status === 'current'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400'
                        : item.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                    "
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="
                        item.status === 'current'
                          ? 'bg-yellow-500'
                          : item.status === 'active'
                            ? 'bg-green-600'
                            : 'bg-red-500'
                      "
                    />
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="p-2"></div>

      <!-- Block loading -->
      <div v-if="stayStore.isLoading" class="w-full p-6 flex justify-center items-center">
        <div class="w-10 h-10 flex justify-center items-center gap-1">
          <component :is="Loading" />
        </div>
      </div>
      <!-- End Block loading -->

      <!-- Block data empty -->

      <div
        v-else-if="stayStore.data?.data.data.length == 0 && !stayStore.isLoading"
        class="w-full flex justify-center items-center p-4"
      >
        <NotData />
      </div>
      <!-- End Block data empty -->

      <!-- PAGINATION -->
      <div
        v-if="stayStore.data?.data.data.length"
        class="w-full flex justify-between items-center gap-4 max-md:flex-col"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <!-- Text -->
          <p class="text-sm text-slate-600 font-Kantumruy">
            បង្ហាញ
            <span class="font-semibold text-slate-800">
              {{ stayStore.data?.data.from }}
            </span>
            -
            <span class="font-semibold text-slate-800">
              {{ stayStore.data?.data.to }}
            </span>
            នៃ
            <span class="font-semibold text-green-600">
              {{ stayStore.data?.data.total }}
            </span>
          </p>

          <!-- Input per page -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-slate-500 font-Kantumruy"> ចំនួន/ទំព័រ </label>

            <input
              type="number"
              min="1"
              v-model="stayStore.per_page"
              class="w-16 text-center px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition duration-200"
            />
          </div>
        </div>

        <div class="flex justify-center items-center gap-2">
          <!-- Prev -->

          <button
            :disabled="stayStore.data?.data.current_page <= 1"
            @click="
              stayStore.getStaysStudentList(
                stayStore.per_page,
                (stayStore.data?.data.current_page ?? 1) - 1,
              )
            "
            :class="
              stayStore.data?.data.current_page <= 1
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
              :disabled="stayStore.data?.data.current_page == page"
              @click="stayStore.getStaysStudentList(stayStore.per_page, Number(page))"
              :class="
                stayStore.data?.data.current_page == page
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
            :disabled="stayStore.data?.data.current_page >= stayStore.data?.data.last_page"
            @click="
              stayStore.getStaysStudentList(
                stayStore.per_page,
                (stayStore.data?.data.current_page ?? 1) + 1,
              )
            "
            :class="
              stayStore.data?.data.current_page >= stayStore.data?.data.last_page
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
    <!-- ------------------ -->
  </StudentLayouts>
</template>
