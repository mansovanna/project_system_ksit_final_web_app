<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CloseIcon,
  CSVIcon,
  NotDataSVGICON,
  PrintIcon,
  RefreshIcon,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'
import { useReportPayment } from '@/stores/report_payment_store'
import export_serivce from '@/utils/export_serivce'
import Loading from '@/widgets/Loading.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { api as viewerApi } from 'v-viewer'
import 'viewerjs/dist/viewer.css'

const payStore = useReportPayment()
const avatar = useAvatar()

const toDateInputValue = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const getDefaultStartDate = () => {
  const now = new Date()
  return toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1))
}
const getDefaultEndDate = () => toDateInputValue(new Date())

const isShowImageInvoice = ref(false)
const preview = ref('')
const showInvoice = (image_url: string) => {
  if (image_url) {
    preview.value = image_url
    isShowImageInvoice.value = !isShowImageInvoice.value
  } else {
    isShowImageInvoice.value = false
  }
}

onMounted(() => {
  if (!payStore.start_date) payStore.start_date = getDefaultStartDate()
  if (!payStore.end_date) payStore.end_date = getDefaultEndDate()
  payStore.getPayments(payStore.search, payStore.start_date, payStore.end_date)
})

const formatDate = (date: string | null | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

const quickFilters = [
  { label: 'ទាំងអស់', value: 'all' },
  { label: 'មិនទាន់បង់', value: 'pending' },
  { label: 'កំពុងរង់ចាំ', value: 'pending_review' },
  { label: 'បានបង់ហើយ', value: 'paid' },
]
const setQuickFilter = (value: string) => {
  payStore.status = value
}

// === បញ្ចូល list ទាំង 3 ជា array តែមួយ, ដាក់ status tag ដើម្បីដឹងថាមកពី list ណា ===
const mergedList = computed(() => {
  const paid = (payStore.data?.paid_list ?? []).map((p: any) => ({
    ...p.user,
    payment: p,
    _tab: 'paid',
  }))
  const pending = (payStore.data?.pending_list ?? []).map((p: any) => ({
    ...p.user,
    payment: p,
    _tab: 'pending_review',
  }))
  const unpaid = (payStore.data?.unpaid_list ?? []).map((u: any) => ({ ...u, _tab: 'pending' }))

  if (payStore.status === 'paid') return paid
  if (payStore.status === 'pending_review') return pending
  if (payStore.status === 'pending') return unpaid
  return [...unpaid, ...pending, ...paid]
})

// const mergedList = computed(() => {
//   const paid = (payStore.data?.paid_list ?? []).map((p: any) => ({
//     ...p.user,
//     payment: p,
//     _tab: 'paid',
//   }))
//   const pending = (payStore.data?.pending_list ?? []).map((p: any) => ({
//     ...p.user,
//     payment: p,
//     _tab: 'pending_review',
//   }))
//   const unpaid = (payStore.data?.unpaid_list ?? []).map((u: any) => ({ ...u, _tab: 'pending' }))

//   let result: any[] = []
//   if (payStore.status === 'paid') result = paid
//   else if (payStore.status === 'pending_review') result = pending
//   else if (payStore.status === 'pending') result = unpaid
//   else result = [...unpaid, ...pending, ...paid]

//   // Dedupe by id (keep first occurrence) — safety net for backend duplicates
//   const seen = new Set()
//   return result.filter((item) => {
//     const key = `${item._tab}-${item.id}`
//     if (seen.has(key)) return false
//     seen.add(key)
//     return true
//   })
// })

// Search បន្ថែម client-side (ព្រោះ list ខ្លីទាំងអស់ស្រាប់ត្រូវ filter ក្នុង browser)
const filteredList = computed(() => {
  if (!payStore.search) return mergedList.value
  const kw = payStore.search.toLowerCase()
  return mergedList.value.filter(
    (item: any) =>
      (item.user_name ?? '').toLowerCase().includes(kw) ||
      (item.info?.id_card ?? '').toLowerCase().includes(kw) ||
      (item.phone_number ?? '').toLowerCase().includes(kw) ||
      (item.info?.id_card ?? '').toLowerCase().includes(kw) ||
      (item.info.level ?? '').toLowerCase().includes(kw) ||
      (item.info.major ?? '').toLowerCase().includes(kw) ||
      (item.info.year ?? '').toLowerCase().includes(kw),
  )
})

const statusBadge = (tab: string) => {
  if (tab === 'paid')
    return { text: 'បានបង់', class: 'bg-green-500/20 text-green-600 border-green-600' }
  if (tab === 'pending_review')
    return { text: 'កំពុងរង់ចាំ', class: 'bg-warning/20 text-warning-600 border-warning' }
  return { text: 'មិនទាន់បង់', class: 'bg-red-500/20 text-red-600 border-red-600' }
}

// Block Search date-range only ព្រោះ API base លើ start_date/end_date
let timer: ReturnType<typeof setTimeout>
watch([() => payStore.start_date, () => payStore.end_date], () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    payStore.getPayments(payStore.search, payStore.start_date, payStore.end_date)
  }, 500)
})

const reload = () => {
  payStore.search = ''
  payStore.start_date = ''
  payStore.end_date = ''
  payStore.status = 'all'
  if (!payStore.start_date) payStore.start_date = getDefaultStartDate()
  if (!payStore.end_date) payStore.end_date = getDefaultEndDate()
  payStore.getPayments(payStore.search, payStore.start_date, payStore.end_date)
}

// ----------
async function openImage(url: string) {
  if (!url) return
  viewerApi({
    images: [url],
    options: {
      toolbar: true,
      navbar: false,
      title: false,
      movable: true,
    },
  })
}
</script>

<template>
  <AdminLayouts>
    <div class="p-4 text-nowrap">
      <div
        class="w-full p-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
      >
        <div class="w-full flex justify-between items-center">
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
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />

        <!-- Summary Cards -->
        <div class="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div
            class="p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700"
          >
            <p class="font-Kantumruy text-slate-400 text-sm">សិស្សសរុប</p>
            <p class="font-Kantumruy text-2xl font-bold text-slate-700 dark:text-white">
              {{ payStore.data?.total_active_users ?? 0 }}
            </p>
          </div>
          <div
            class="p-4 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 cursor-pointer hover:brightness-95"
            @click="setQuickFilter('pending')"
          >
            <p class="font-Kantumruy text-red-500 text-sm">មិនទាន់បង់ប្រាក់</p>
            <p class="font-Kantumruy text-2xl font-bold text-red-600">
              {{ payStore.data?.total_unpaid ?? 0 }}
            </p>
          </div>
          <div
            class="p-4 rounded-xl border border-warning bg-warning/10 cursor-pointer hover:brightness-95"
            @click="setQuickFilter('pending_review')"
          >
            <p class="font-Kantumruy text-warning-600 text-sm">កំពុងរង់ចាំពិនិត្យ</p>
            <p class="font-Kantumruy text-2xl font-bold text-warning-600">
              {{ payStore.data?.total_pending ?? 0 }}
            </p>
          </div>
          <div
            class="p-4 rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 cursor-pointer hover:brightness-95"
            @click="setQuickFilter('paid')"
          >
            <p class="font-Kantumruy text-green-600 text-sm">បានបង់ប្រាក់ហើយ</p>
            <p class="font-Kantumruy text-2xl font-bold text-green-600">
              {{ payStore.data?.total_paid_payments ?? 0 }}
            </p>
          </div>
        </div>

        <!-- Search + Date range -->
        <div class="w-full flex flex-wrap justify-between gap-4 max-lg:flex-col max-md:gap-7 mt-4">
          <form @submit.prevent class="w-2/3 max-xl:w-full">
            <div class="flex flex-wrap justify-start items-center gap-4 w-full max-md:flex-col">
              <div class="flex w-2/5 max-xl:w-full relative">
                <input
                  type="text"
                  v-model="payStore.search"
                  class="border pl-4 pr-10 py-2 rounded-md dark:text-white border-slate-300 w-full font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  placeholder="Search..."
                />
                <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
                  <component :is="SearchIcon" class="text-slate-400" />
                </div>
              </div>
              <div class="flex w-1/6 max-xl:w-full">
                <input
                  type="date"
                  v-model="payStore.start_date"
                  class="border px-4 py-2 rounded-md dark:text-white border-slate-300 w-full font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                />
              </div>
              <div class="flex w-1/6 max-xl:w-full">
                <input
                  type="date"
                  v-model="payStore.end_date"
                  class="border px-4 py-2 rounded-md dark:text-white border-slate-300 w-full font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                />
              </div>
            </div>
          </form>

          <div class="flex justify-between items-center gap-3">
            <button
              @click="reload"
              class="p-1.5 px-3 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-400 font-Kantumruy font-medium flex justify-center items-center gap-2"
            >
              <div :class="payStore.isLoading ? 'animate-spin' : ''">
                <component :is="RefreshIcon" class="text-white" />
              </div>
              <span>Refresh</span>
            </button>
            <div class="flex justify-end items-center gap-3">
              <button
                @click="() => export_serivce.export_student_report(filteredList)"
                class="p-1.5 px-3 bg-green-600 text-white rounded-md hover:bg-green-500 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
              >
                CSV
                <component :is="CSVIcon" />
              </button>
              <button
                @click="() => export_serivce.export_payment_pdf('payment-report-table')"
                class="p-1.5 px-3 bg-warning text-white rounded-md hover:bg-warning/80 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
              >
                PDF
                <component :is="PrintIcon" />
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Filter Tabs -->
        <div class="w-full flex gap-2 mt-4 flex-wrap">
          <button
            v-for="tab in quickFilters"
            :key="tab.value"
            @click="setQuickFilter(tab.value)"
            :class="
              payStore.status === tab.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-300 dark:border-slate-600'
            "
            class="px-4 py-1.5 rounded-full border font-Kantumruy text-sm cursor-pointer hover:brightness-95"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div
        class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="w-full overflow-x-auto">
          <table class="w-full" id="payment-report-table">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-slate-500 uppercase"
              >
                <td class="px-1 py-1.5 text-left dark:text-slate-300">ID</td>
                <td class="px-1 py-1.5 text-left dark:text-slate-300">About User</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Invoice</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Amount</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Method</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Paid At</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Status</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Actions</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in filteredList"
                :key="item.id"
                class="border-t border-slate-300 dark:border-slate-600 hover:bg-slate-500/5"
                :class="item._tab === 'pending' ? 'bg-red-50/60 dark:bg-red-900/10' : ''"
              >
                <!-- No -->
                <td class="px-2 py-1 text-sm text-slate-500 text-center">
                  {{ index + 1 }}
                </td>

                <!-- User -->
                <td class="px-2 py-1">
                  <div class="flex items-center gap-2">
                    <div class="relative shrink-0">
                      <img
                        @click="
                          openImage(
                            item.user.profile_photo_url
                              ? item.user.profile_photo_url
                              : avatar.textToImage(item.user.user_name),
                          )
                        "
                        class="w-10 h-10 rounded-full object-cover border"
                        :class="item._tab === 'pending' ? 'border-red-500' : 'border-blue-500'"
                        :src="
                          item.profile_photo_url
                            ? item.profile_photo_url
                            : avatar.textToImage(item.user_name)
                        "
                        :alt="item.user_name"
                      />

                      <span
                        v-if="item._tab === 'pending'"
                        title="មិនទាន់បង់ប្រាក់"
                        class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white"
                      />
                    </div>

                    <div class="leading-tight">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-medium font-poppins">
                          {{ item.user_name ?? 'N/A' }}
                        </p>
                        |
                        <p class="text-sm font-medium font-poppins uppercase">
                          {{ item.info?.id_card ?? 'N/A' }}
                        </p>
                      </div>

                      <span class="block text-[11px] text-slate-500">
                        PHONE: {{ item.phone_number ?? 'N/A' }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Invoice -->
                <td class="px-2 py-1 text-center flex justify-center items-center">
                  <div>
                    <img
                      v-if="item.payment?.image_url"
                      @click="openImage(item.payment.image_url)"
                      class="w-8 h-8 rounded object-cover cursor-pointer"
                      :src="item.payment.image_url"
                    />

                    <span v-else class="text-xs text-red-500"> No </span>
                  </div>
                </td>

                <!-- Amount -->
                <td class="px-2 py-1 text-center">
                  <div class="flex justify-center items-center gap-1">
                    <span class="text-sm font-semibold text-green-600 font-poppins">
                      + {{ item.payment?.amount ?? 'N/A' }}
                    </span>

                    <span v-if="item.payment?.amount" class="text-sm text-warning font-poppins">
                      {{ item.payment?.is_currency === 'usd' ? '$' : '៛' }}
                    </span>
                  </div>
                </td>

                <!-- Method -->
                <td class="px-2 py-1 text-xs uppercase text-center">
                  <div class="flex justify-center items-center gap-1">
                    <span
                      class="text-sm font-semibold font-poppins size-7 flex items-center justify-center rounded-md"
                      :class="
                        item.payment?.method == 'payway'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-blue-600/20 text-blue-600'
                      "
                    >
                      {{ item.payment?.method[0] ?? 'N/A' }}
                    </span>
                  </div>
                </td>

                <!-- Date -->
                <td class="px-2 py-1 text-xs text-center">
                  {{ formatDate(item.payment?.created_at) }}
                </td>

                <!-- Status -->
                <td class="px-2 py-1 text-center">
                  <div
                    class="inline-flex rounded-full border px-3 py-1 text-xs font-medium"
                    :class="statusBadge(item._tab).class"
                  >
                    {{ statusBadge(item._tab).text }}
                  </div>
                </td>

                <!-- Action -->
                <td class="px-2 py-1 text-center flex justify-center items-center gap-2">
                  <button
                    :disabled="item._tab == 'pending'"
                    title="View"
                    @click="
                      $router.push({
                        name: 'payments-detail',
                        params: { id: item.payment?.id },
                      })
                    "
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-600 text-warning hover:bg-warning hover:text-white duration-200"
                  >
                    <component :is="ViewIcon" class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr class="text-slate-300" />

        <div
          v-if="!filteredList.length && !payStore.isLoading"
          class="w-full flex flex-col justify-center items-center p-6"
        >
          <div>
            <img :src="NotDataSVGICON" alt="" />
          </div>
          <!-- <p class="text-slate-500 font-Kantumruy text-lg">មិនមានទិន្នន័យទេ</p> -->
        </div>

        <div v-if="payStore.isLoading" class="w-full flex justify-center items-center p-4">
          <div class="w-10 h-10"><Loading /></div>
        </div>
      </div>
    </div>

    <Transition name="bounce">
      <div
        v-if="isShowImageInvoice"
        @click="showInvoice('')"
        class="w-full h-screen fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/20 z-50"
      >
        <div class="w-1/3 bg-white rounded-lg shadow-2xl overflow-clip" @click.stop>
          <div class="w-full flex justify-between items-center relative p-4">
            <h1 class="font-Kantumruy text-slate-600 uppercase font-medium text-lg">Invoice PNG</h1>
            <button
              @click="isShowImageInvoice = false"
              class="w-8 h-8 bg-red-500 text-white flex justify-center items-center rounded-full absolute right-3 cursor-pointer hover:bg-red-400"
            >
              <component :is="CloseIcon" />
            </button>
          </div>
          <hr class="text-slate-300" />
          <div class="p-4 w-full flex justify-center">
            <img class="h-[700px] rounded-md" :src="preview" alt="" />
          </div>
        </div>
      </div>
    </Transition>
  </AdminLayouts>
</template>
