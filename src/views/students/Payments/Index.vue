<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import PaymentForm from '@/components/students_component/PaymentForm.vue'
import { useStudentPaymentStore } from '@/stores/student_payment_store'
import Loading from '@/widgets/Loading.vue'
import { ArrowSmallUpIcon, UserFillIcon } from '@/stores/Icons'
import NotData from '@/widgets/NotData.vue'

const paymentStore = useStudentPaymentStore()

/* ---------------- MENU ---------------- */

const listMenus = ref([
  { name: 'ទាំងអស់', value: 'all' },
  { name: 'កំពុងរង់ចាំ', value: 'pending' },
  { name: 'បានបង់រួច', value: 'approved' },
  { name: 'បោះបង់', value: 'rejected' },
])

/* ---------------- FETCH DATA ---------------- */

/* ---------------- ACTION ---------------- */

const submitStatus = (status: string) => {
  paymentStore.activeTab = status
  paymentStore.getHistoryPayment(status, paymentStore.per_page, paymentStore.page)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('km-KH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

let timer: NodeJS.Timeout | null = null
watch(
  () => [paymentStore.per_page, paymentStore.page],
  ([per_page, page]) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      paymentStore.getHistoryPayment(String(paymentStore.activeTab), Number(per_page), Number(page))
    }, 500)
  },
)

const pages = computed(() => {
  const current = paymentStore.data?.data.current_page || 1
  const last = paymentStore.data?.data.last_page || 1

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

//-------------------
// Default load
onMounted(() => {
  paymentStore.activeTab = 'all'

  paymentStore.getHistoryPayment('all', paymentStore.per_page, paymentStore.page)
})
</script>

<template>
  <StudentLayouts>
    <div class="p-4 max-md:pt-2 flex max-lg:flex-col gap-4 items-start">
      <!-- LEFT SIDE -->
      <div class="w-2/3 max-lg:w-full flex flex-col gap-4">
        <!-- FILTER TABS -->
        <div
          class="gap-2 grid max-md:grid-cols-4 max-xl:grid-cols-6 grid-cols-10 sticky top-0 z-10 overflow-x-auto"
        >
          <button
            v-for="tab in listMenus"
            :key="tab.value"
            @click="submitStatus(tab.value)"
            :disabled="paymentStore.activeTab === tab.value"
            class="max-md:p-0.5"
          >
            <div
              class="px-4 py-2 rounded-lg text-sm transition​ max-md:text-sm text-nowrap cursor-pointer font-Kantumruy duration-500 ease-in-out"
              :class="
                paymentStore.activeTab === tab.value
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white dark:bg-slate-700 dark:text-white text-emerald-700 border border-emerald-600 hover:bg-emerald-50'
              "
            >
              {{ tab.name }}
            </div>
          </button>
        </div>

        <!-- CARD LIST -->
        <!-- <div
          v-if="false"
          class="w-full grid max-md:grid-cols-1 max-xl:grid-cols-2 grid-cols-3 gap-4"
        >
          <div v-for="(item, index) in paymentStore.data?.data.data" :key="index">
            <button
              @click="$router.push({ name: 'student-payment-detail', params: { id: item.id } })"
              class="w-full bg-white dark:bg-slate-700 rounded-xl p-4 shadow-sm relative cursor-pointer hover:scale-105 transition-all duration-500 ease-in-out"
            >
              <div class="flex justify-between items-center mb-2">
                <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  # {{ index + 1 }}
                </p>
                <div class="flex items-center gap-2">
                  <span
                    class="w-5 h-5 rounded-full"
                    :class="{
                      'bg-radial from-yellow-200 from-10% to-orange-500': item.status === 'pending',
                      'bg-radial from-green-300 from-5% to-green-600': item.status === 'approved',
                      'bg-radial from-red-300 from-5% to-red-600': item.status === 'rejected',
                    }"
                  >
                  </span>
                </div>
              </div>
              <div class="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <div class="flex gap-1 justify-start items-center">
                  <p class="font-hanuman">ឈ្មោះសិស្ស៖</p>
                  <p class="font-Kantumruy font-medium">{{ item.user.user_name }}</p>
                </div>

                <div class="flex gap-1 justify-start items-center">
                  <p class="font-hanuman">ចំនួនទឹកប្រាក់៖</p>
                  <p class="font-poppins font-semibold text-red-500">
                    {{ item.amount ?? 0 }} {{ item.is_currency == 'khr' ? '៛' : '$' }}
                  </p>
                </div>

                <div class="flex gap-1 justify-start items-center">
                  <p class="font-hanuman">វិធីបង់៖</p>
                  <p
                    class="font-Kantumruy font-medium capitalize px-3 py-0.5 text-white rounded-full"
                    :class="item.method == 'manual' ? 'bg-orange-500' : 'bg-blue-500'"
                  >
                    {{ item.method ?? 'N/A' }}
                  </p>
                </div>

                <div class="flex w-full justify-between items-end">
                  <div class="flex gap-1 justify-start items-center">
                    <p class="font-hanuman">ត្រួតពិនិត្យដោយ៖</p>
                    <p class="font-Kantumruy font-medium capitalize flex">
                      <component :is="UserFillIcon" class="w-4 h-4" />
                      {{ item.approved_by ?? 'N/A' }}
                    </p>
                  </div>
                  <div class="text-right mt-3 font-poppins text-xs text-slate-400">
                    {{ formatDate(item.created_at) }}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div> -->

        <div
          class="w-full overflow-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <table class="w-full text-nowrap">
            <thead>
              <tr class="bg-gradient-to-r from-green-600 to-green-500 text-white">
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm rounded-tl-2xl">No</th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm text-left">សិស្ស</th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm">ចំនួនទឹកប្រាក់</th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm">វិធីបង់</th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm">ស្ថានភាព</th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm">កាលបរិច្ឆេទ</th>
                <th class="font-Kantumruy font-normal px-4 py-3.5 text-sm rounded-tr-2xl">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in paymentStore.data?.data.data"
                :key="index"
                class="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td
                  class="font-Kantumruy font-normal px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center"
                >
                  #{{ item.id }}
                </td>

                <td class="font-Kantumruy font-normal px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <!-- <div
                      class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-poppins text-xs font-semibold shrink-0"
                    >
                      {{ item.user.first_name?.[0] ?? '?' }}
                    </div> -->
                    <span class="text-slate-700 dark:text-slate-200">
                      {{ item.user.first_name ?? 'N/A' }} {{ item.user.last_name ?? 'N/A' }}
                    </span>
                  </div>
                </td>

                <td class="font-Kantumruy font-normal px-4 py-3 text-center">
                  <div class="flex justify-center items-center text-red-500 gap-1">
                    <span class="font-poppins font-semibold">{{ item.amount ?? 'N/A' }}</span>
                    <span
                      class="font-medium"
                      :class="item.is_currency == 'khr' ? 'font-Kantumruy' : 'font-poppins'"
                      >{{ item.is_currency == 'khr' ? '៛' : '$' }}</span
                    >
                  </div>
                </td>

                <td class="font-Kantumruy font-normal px-4 py-3 text-center">
                  <span
                    class="font-poppins text-xs px-3 py-1.5 rounded-full font-medium uppercase inline-block"
                    :class="
                      item.method == 'payway'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                        : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                    "
                  >
                    {{ item.method }}
                  </span>
                </td>

                <td class="font-Kantumruy font-normal px-4 py-3 text-center">
                  <span
                    class="px-3 py-1.5 text-xs font-poppins text-white capitalize rounded-full inline-flex items-center gap-1.5"
                    :class="
                      item.status == 'approved'
                        ? 'bg-green-600'
                        : item.status == 'pending'
                          ? 'bg-warning'
                          : 'bg-red-500'
                    "
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                    {{ item.status }}
                  </span>
                </td>

                <td
                  class="font-Kantumruy font-normal px-4 py-3 text-center text-slate-500 dark:text-slate-400 text-sm"
                >
                  {{ formatDate(item.created_at) }}
                </td>

                <td class="font-Kantumruy font-normal px-4 py-3 text-center">
                  <RouterLink
                    :to="{ name: 'student-payment-detail', params: { id: item.id } }"
                    class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-poppins text-sm hover:underline"
                  >
                    View
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Block loading -->
        <div
          v-if="paymentStore.isLoadingStudentPayment"
          class="w-full p-6 flex justify-center items-center"
        >
          <div class="w-10 h-10 flex justify-center items-center gap-1">
            <component :is="Loading" />
          </div>
        </div>
        <!-- End Block loading -->

        <!-- Block data empty -->

        <div
          v-else-if="!paymentStore.data?.data.data.length && !paymentStore.isLoadingStudentPayment"
          class="w-full flex justify-center items-center p-4"
        >
          <NotData />
        </div>
        <!-- End Block data empty -->

        <!-- PAGINATION -->
        <div
          v-if="paymentStore.data?.data.data.length"
          class="w-full flex justify-between items-center gap-4 max-md:flex-col text-nowrap"
        >
          <div class="flex flex-row items-center justify-start max-md:justify-between gap-3 w-full">
            <!-- Text -->
            <p class="text-sm text-slate-600 font-Kantumruy">
              បង្ហាញ
              <span class="font-semibold text-slate-800">
                {{ paymentStore.data?.data.from }}
              </span>
              -
              <span class="font-semibold text-slate-800">
                {{ paymentStore.data?.data.to }}
              </span>
              នៃ
              <span class="font-semibold text-green-600">
                {{ paymentStore.data?.data.total }}
              </span>
            </p>
            <!-- Input per page -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-slate-500 font-Kantumruy"> ចំនួន/ទំព័រ </label>

              <input
                type="number"
                min="1"
                v-model="paymentStore.per_page"
                class="w-16 text-center px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition duration-200"
              />
            </div>
            <!-- End Input per page -->
          </div>

          <!-- Block page click -->
          <div class="flex justify-center items-center gap-2">
            <!-- Prev -->

            <button
              :disabled="paymentStore.data?.data.current_page <= 1"
              @click="
                paymentStore.getHistoryPayment(
                  paymentStore.status,
                  paymentStore.per_page,
                  (paymentStore.data?.data.current_page ?? 1) - 1,
                )
              "
              :class="
                paymentStore.data?.data.current_page <= 1
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
                :disabled="paymentStore.data?.data.current_page == page"
                @click="
                  paymentStore.getHistoryPayment(
                    paymentStore.status,
                    paymentStore.per_page,
                    Number(page),
                  )
                "
                :class="
                  paymentStore.data?.data.current_page == page
                    ? 'bg-green-600  text-white'
                    : ' bg-slate-200 dark:bg-slate-600 text-green-600 dark:text-white'
                "
                class="w-8 h-8 max-md:w-6 max-md:h-6 justify-center items-center flex rounded-full hover:bg-blue-400 hover:text-white cursor-pointer"
              >
                <p class="font-Kantumruy font-medium">{{ page }}</p>
              </button>

              <!-- dots -->
              <span v-else class="px-2 text-slate-400">...</span>
            </template>

            <button
              :disabled="paymentStore.data?.data.current_page >= paymentStore.data?.data.last_page"
              @click="
                paymentStore.getHistoryPayment(
                  paymentStore.status,
                  paymentStore.per_page,
                  paymentStore.data?.data.current_page + 1,
                )
              "
              :class="
                paymentStore.data?.data.current_page >= paymentStore.data?.data.last_page
                  ? 'text-green-600 bg-slate-600/10 dark:bg-slate-600'
                  : ' bg-green-600 text-white'
              "
              class="w-8 h-8 max-md:w-6 max-md:h-6 justify-center disabled:opacity-50 disabled:cursor-not-allowed items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>
          </div>
          <!-- End Block page click -->
        </div>
        <!-- End PAGINATION -->
      </div>
      <!-- RIGHT SIDE -->
      <div class="w-1/3 max-md:w-full max-lg:hidden sticky top-20">
        <PaymentForm class="relative" />
      </div>
      <!-- End RIGHT SIDE -->
    </div>
  </StudentLayouts>
</template>
