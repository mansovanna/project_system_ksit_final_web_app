<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { AddIcon, ArrowSmallUpIcon, DeleteIcon, EditIcon } from '@/stores/Icons'

import { usePaymentStore } from '@/stores/payment_store'
import { computed, onMounted, ref } from 'vue'
import UpdateQR from './UpdateQR.vue'
import CreateQR from './CreateQR.vue'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'
import { themeColor } from '@/utils/Color'
const paymentStore = usePaymentStore()

const items = ref({})
const handleUpdate = (data: any) => {
  console.log(data)
  paymentStore.isFormDataUpdate = !paymentStore.isFormDataUpdate
  items.value = data
}

onMounted(() => {
  paymentStore.getBanks()
})

// Block delete data

const isShowNotifi = ref(false)

const submitNot = (id: string) => {
  //
  paymentStore.isLoadAny.id = id
  isShowNotifi.value = !isShowNotifi.value
}

const submitDelete = () => {
  paymentStore.deleteBank(paymentStore.isLoadAny.id)
  isShowNotifi.value = !isShowNotifi.value
}

const clearData = () => {
  paymentStore.isLoadAny.id = ''
  paymentStore.isLoadAny.isLoading = false
  isShowNotifi.value = false
}
// Block Pagination -------------------
const pages = computed(() => {
  const current = paymentStore.data_bank?.data.current_page || 1
  const last = paymentStore.data_bank?.data.last_page || 1

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

// const headerClass = computed(() => colorMap[item.color_theme])
</script>
<template>
  <AdminLayouts>
    <!-- Overlay -->
    <div
      v-if="isShowNotifi"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <!-- Modal -->
      <div
        class="w-full max-w-md bg-white dark:bg-slate-700 dark:text-white rounded-2xl shadow-xl p-6 animate-fadeIn"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex justify-start gap-4 items-center">
            <div class="p-2 bg-red-600 text-white rounded-full">
              <component :is="DeleteIcon" />
            </div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white font-Kantumruy">
              Notification
            </h2>
          </div>
          <button
            @click="clearData"
            class="text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-6 font-Kantumruy">
          Are you sure you want to delete this item? This action cannot be undone.
        </div>

        <!-- Actions -->
        <div class="flex justify-between">
          <button
            class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition font-Kantumruy cursor-pointer"
            @click="clearData"
          >
            Cancel
          </button>

          <button
            @click="submitDelete()"
            class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition font-Kantumruy cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Block main -->
    <div class="p-4">
      <!-- Add your admin home content here -->
      <div
        class="w-full p-6 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
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
              <h1 class="font-Kantumruy text-blue-500">Banks List</h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>
          <button
            @click="paymentStore.isShowCreatePayment = true"
            class="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 font-Kantumruy"
          >
            Add New
          </button>
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />
        <div class="w-full flex justify-between gap-2">
          <!-- Block  -->
        </div>
      </div>

      <!--  -->

      <!-- Block Content of bank qr -->
      <div class="w-full grid grid-cols-4 max-lg:grid-cols-1 max-xl:grid-cols-2 gap-4 mt-4">
        <!-- Block Card -->
        <div
          v-for="(item, index) in paymentStore.data_bank?.data.data"
          :key="index"
          class="border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-2xl overflow-clip"
        >
          <div
            class="w-full flex justify-between p-4 text-white bg-top-left"
            :class="themeColor(String(item.color_theme))"
          >
            <div class="flex justify-start items-center gap-2">
              <!-- <component class="w-5 h-5" :is="MoneyIconFille" /> -->
              <span class="font-Kantumruy font-semibold">QR Code</span>
            </div>
            <p class="font-Kantumruy text-slate-200">Scan to Pay</p>
          </div>
          <div class="w-full flex flex-col gap-4 justify-center items-center p-4">
            <img
              :src="item.qr_image_url ?? ''"
              alt=""
              class="w-full h-96 bg-slate-200 dark:bg-slate-900 rounded-xl object-center object-cover"
            />

            <!-- Block Money -->
            <div class="w-full flex flex-col">
              <!-- Block  KHR -->
              <div class="w-full flex justify-between items-center">
                <p class="font-Kantumruy">KHR</p>
                <p class="font-Kantumruy">{{ item.account_khr }}</p>
              </div>

              <!-- Block  USD -->
              <div class="w-full flex justify-between items-center">
                <p class="font-Kantumruy">USD</p>
                <p class="font-Kantumruy">{{ item.account_usd }}</p>
              </div>
            </div>
          </div>
          <hr class="w-full text-slate-300 dark:text-slate-600" />
          <div class="w-full flex justify-between items-center gap-4 p-4">
            <div>
              <p class="font-Kantumruy">{{ item.bank_name }} Bank</p>
              <p class="font-Kantumruy font-semibold text-xl">{{ item.owner_name }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="handleUpdate(item)"
                class="p-2 border dark:border-slate-600 border-slate-300 rounded-lg cursor-pointer text-blue-600 hover:bg-blue-600/20"
              >
                <component :is="EditIcon" />
              </button>
              <button
                @click="submitNot(String(item.id))"
                :disabled="
                  paymentStore.isLoadAny.isLoading && paymentStore.isLoadAny.id === String(item.id)
                "
                class="p-2 border dark:border-red-600 flex justify-center items-center border-red-300 rounded-lg cursor-pointer text-red-600 hover:bg-red-600/20 disabled:bg-slate-200 dark:disabled:bg-slate-700"
              >
                <div
                  v-if="
                    paymentStore.isLoadAny.isLoading &&
                    paymentStore.isLoadAny.id === String(item.id)
                  "
                  class="w-6 h-6"
                >
                  <component :is="Loading" />
                </div>

                <component v-else :is="DeleteIcon" />
              </button>
            </div>
          </div>
        </div>

        <!-- End Blok Card -->
        <!-- -------------------------- -->
        <!-- Block Add form -->
        <div
          @click="paymentStore.isShowCreatePayment = true"
          class="w-full h-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 border border-dashed border-blue-600 dark:bg-slate-800 rounded-2xl overflow-clip p-6 flex justify-center items-center"
        >
          <div class="flex flex-col justify-center items-center">
            <div
              class="flex justify-center items-center p-6 bg-slate-200 dark:bg-slate-900 rounded-full"
            >
              <component :is="AddIcon" class="w-5 h-5" />
            </div>
            <h1 class="font-Kantumruy text-center font-medium">Add New Bank</h1>
            <p class="font-Kantumruy text-center text-xs text-slate-500 mt-1">
              upload QR Image <br />from your bank app
            </p>
          </div>
        </div>
        <!-- End Block Add form -->
      </div>

      <!--  -->

      <!-- Block Pagination -->
      <div
        v-if="paymentStore.data_bank?.data.data.length"
        class="w-full mt-4 flex justify-between items-center gap-3 max-sm:flex-col"
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
              paymentStore.getBanks(paymentStore.search, paymentStore.per_page, paymentStore.page)
            "
          >
            <input
              type="number"
              v-model="paymentStore.per_page"
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
            :disabled="paymentStore.data_bank?.data.current_page <= 1"
            @click="
              paymentStore.getBanks(
                paymentStore.search,
                paymentStore.per_page,
                paymentStore.data_bank?.data.current_page - 1,
              )
            "
            :class="
              paymentStore.data_bank?.data.current_page <= 1
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
              :disabled="paymentStore.data_bank?.data.current_page == page"
              @click="
                paymentStore.getBanks(paymentStore.search, paymentStore.per_page, Number(page))
              "
              :class="
                paymentStore.data_bank?.data.current_page == page
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
              paymentStore.data_bank?.data.current_page >= paymentStore.data_bank?.data.last_page
            "
            @click="
              paymentStore.getBanks(
                paymentStore.search,
                paymentStore.per_page,
                paymentStore.data_bank?.data.current_page + 1,
              )
            "
            :class="
              paymentStore.data_bank?.data.current_page >= paymentStore.data_bank?.data.last_page
                ? 'text-blue-600 bg-slate-600/10 dark:bg-slate-600'
                : ' bg-blue-600 text-white'
            "
            class="w-8 h-8 justify-center items-center flex rounded-full cursor-pointer hover:bg-slate-200"
          >
            <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
          </button>
        </div>
      </div>
      <!-- End Block Pagination -->
    </div>

    <!-- Block Loading show -->
    <div v-if="paymentStore.isLoadingPayment" class="w-full flex justify-center items-center p-6">
      <div class="w-10 h-10 flex justify-center items-center">
        <Loading />
      </div>
    </div>

    <!-- Block Not found Data -->
    <div
      v-if="!paymentStore.isLoadingPayment && paymentStore.data_bank?.data.data.length == 0"
      class="w-full flex justify-center items-center p-6"
    >
      <div>
        <component :is="NotData" />
      </div>
    </div>

    <!-- Block update info banks -->
    <UpdateQR
      v-if="paymentStore.isFormDataUpdate"
      @close="paymentStore.isFormDataUpdate = false"
      :data="items"
      :is-loading="paymentStore.isLoading"
    />

    <!-- End Block update info banks  -->

    <!-- Block create banks -->
    <CreateQR
      v-if="paymentStore.isShowCreatePayment"
      @close="paymentStore.isShowCreatePayment = false"
    />
    <!-- End Block create banks -->

    <!--  -->
  </AdminLayouts>
</template>
