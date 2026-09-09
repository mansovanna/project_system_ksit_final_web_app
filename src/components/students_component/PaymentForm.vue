<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStudentPaymentStore } from '@/stores/student_payment_store'
import Loading from '@/widgets/Loading.vue'
import QRCode from '../QRCode.vue'
import { usePaymentStore } from '@/stores/payment_store'
import { DownloadIcon } from '@/stores/Icons'
import NotData from '@/widgets/NotData.vue'
import PaymentConfirmModal from '@/widgets/PaymentConfirmModal.vue'

const paymentStoreFromAdmin = usePaymentStore()

const paymentStore = useStudentPaymentStore()

type PaymentMethod = 'qr' | 'payway'

const activeTab = ref<PaymentMethod>('qr')

// ----------------------------------------
// handle upload receipt
const fileImage = (e: any) => {
  const file = e.target.files?.[0]
  if (file) {
    paymentStore.formData.file = file
  }
}

// submit Payment Manual
const submitPaymentManual = async () => {
  paymentStore.isMessage.amount = ''
  paymentStore.isMessage.is_currency = ''
  paymentStore.isMessage.file = ''

  if (!paymentStore.formData.amount) {
    paymentStore.isMessage.amount = 'សូមបញ្ចូលចំនួនទឹកប្រាក់'
    return
  }

  if (!paymentStore.formData.is_currency) {
    paymentStore.isMessage.is_currency = 'សូមជ្រើសរើសធនាគារ'
    return
  }

  if (!paymentStore.formData.file || paymentStore.formData.file === null) {
    paymentStore.isMessage.file = 'សូម Upload វិក័យបត្រ'
    return
  }

  const data = new FormData()
  data.append('amount', paymentStore.formData.amount)
  data.append('is_currency', paymentStore.formData.is_currency)
  data.append('method', 'manual')
  data.append('file', paymentStore.formData.file)

  await paymentStore.paymentManual(data)
}

// submit PayWay payment ---------------------------------------
const submitPaywayPayment = async () => {
  paymentStore.isMessage.amount = ''
  paymentStore.isMessage.is_currency = ''

  if (!paymentStore.formData.amount) {
    paymentStore.isMessage.amount = 'សូមបញ្ចូលចំនួនទឹកប្រាក់'
    return
  }

  if (!paymentStore.formData.is_currency) {
    paymentStore.isMessage.is_currency = 'សូមជ្រើសរើសធនាគារ'
    return
  }

  const data = new FormData()
  data.append('amount', paymentStore.formData.amount)
  data.append('is_currency', paymentStore.formData.is_currency)

  await paymentStore.processPayment(data)
}

const isSelectedBanks = ref(0)

const selectBank = (index: number) => {
  isSelectedBanks.value = index
}

// check verify payment

watch(
  () => paymentStore.processResponse?.data.md5,
  (md5) => {
    if (md5) {
      paymentStore.startPolling()
    }
  },
)

const clearPaymentPayway = () => {
  paymentStore.stopPolling()
  paymentStore.clearData()
}

const showConfirmModal = ref(false)

const handleConfirm = () => {
  showConfirmModal.value = false
}

const handleCancel = () => {
  showConfirmModal.value = false
}

const isCloseSar = ref(false)
onMounted(() => {
  paymentStoreFromAdmin.getQRCodeBanks()

  isCloseSar.value = localStorage.getItem('isCloseSar') === 'true'

  setTimeout(() => {
    showConfirmModal.value = true
  }, 1000)
})

const isLoad = ref(false)

const downLoadQR = (qr: any) => {
  const url = typeof qr === 'string' ? qr : qr.url
  const link = document.createElement('a')
  link.href = url
  link.download = url.split('/').pop() || 'qr-code.png'
  link.target = '_blank'
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <!-- Message Notification -->ា
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div
      v-if="paymentStore.isMessagePaymentManual.message"
      class="fixed bottom-10 right-4 w-full max-w-96 z-50"
    >
      <div
        class="p-4 rounded-lg shadow-md border w-full relative overflow-clip"
        :class="
          paymentStore.isMessagePaymentManual.status === 'success'
            ? 'bg-gradient-to-r from-green-700 to-green-500 border-green-600'
            : 'bg-gradient-to-r from-red-600 to-red-400 border-red-600'
        "
      >
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div class="shrink-0 text-white">
            <svg
              v-if="paymentStore.isMessagePaymentManual.status === 'success'"
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <!-- Message -->
          <p class="text-sm font-medium text-white flex-1">
            {{ paymentStore.isMessagePaymentManual.message }}
          </p>

          <!-- Close Button -->
          <button
            class="shrink-0 text-white/70 hover:text-white transition-colors"
            @click="paymentStore.isMessagePaymentManual.message = ''"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
  <!-- End Message Notification -->

  <!--  -->

  <!-- check aler message -->
  <PaymentConfirmModal
    v-if="!isCloseSar"
    v-model="showConfirmModal"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
  <!--  -->

  <!-- ---------------------------------------------------------------------- -->
  <div class="w-full bg-white dark:bg-slate-700 rounded-xl p-4 shadow-sm">
    <h3 class="text-lg font-semibold mb-3 dark:text-white font-Kantumruy">បន្ថែមការបង់ប្រាក់</h3>

    <!-- Tabs -->
    <div class="w-full flex gap-3 mb-4">
      <button
        @click="activeTab = 'qr'"
        :class="[
          'flex-1 py-2 rounded-lg text-sm font-medium font-Kantumruy transition  cursor-pointer',
          activeTab === 'qr'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-slate-600 dark:text-white',
        ]"
      >
        Pay Manual
      </button>

      <button
        @click="activeTab = 'payway'"
        :class="[
          'flex-1 py-2 rounded-lg text-sm font-medium font-Kantumruy transition  cursor-pointer',
          activeTab === 'payway'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-slate-600 dark:text-white',
        ]"
      >
        PayWay / Banks
      </button>
    </div>

    <!-- Block Start Payment Manual -->
    <!-- ================= QR CODE PAYMENT ================= -->
    <div v-if="activeTab === 'qr'">
      <!-- data is not empty (QR CODE )-->
      <div v-if="paymentStoreFromAdmin.data_qr?.data.length" class="space-y-4">
        <div class="relative">
          <!-- Bank select -->
          <div class="flex items-center gap-2 overflow-x-auto p-1" style="scrollbar-width: none">
            <button
              v-for="(item, index) in paymentStoreFromAdmin.data_qr?.data"
              :key="index"
              @click="selectBank(index)"
              :class="[
                'px-4 py-1 rounded-full border border-slate-200 font-Kantumruy text-sm cursor-pointer shrink-0 duration-300 ease-in-out',
                isSelectedBanks === index
                  ? `bg-green-600 text-white ring-2 ring-green-600`
                  : 'bg-slate-100 text-slate-900',
              ]"
            >
              {{ item.bank_name }} Bank
            </button>
          </div>
          <!-- QR Code (from admin) -->

          <div class="mt-2 flex flex-col items-center">
            <p class="font-Kantumruy text-lg font-medium mb-2">Scan Pay Now</p>

            <div class="flex justify-center">
              <img
                v-if="paymentStoreFromAdmin.data_qr?.data?.[isSelectedBanks]?.qr_image_url"
                :src="paymentStoreFromAdmin.data_qr.data[isSelectedBanks]?.qr_image_url ?? ''"
                alt="QR Code"
                class="w-48 h-72 sm:w-56 object-cover rounded-xl border border-slate-300"
              />
              <div
                v-else
                class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400"
              >
                No QR Image
              </div>
            </div>
          </div>

          <div class="absolute bottom-4 right-4">
            <!-- Block  download QR Image -->
            <button
              @click="
                downLoadQR(paymentStoreFromAdmin.data_qr?.data?.[isSelectedBanks]?.qr_image_url)
              "
              class="p-3 cursor-pointer bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center items-center"
            >
              <DownloadIcon v-if="!isLoad" class="w-6 h-6" />

              <div v-else class="w-6 h-6 flex justify-center items-center">
                <component :is="Loading" />
              </div>
            </button>
          </div>
        </div>

        <!-- Block amount -->
        <div>
          <label class="block text-sm mb-1 dark:text-white font-Kantumruy"> ចំនួនទឹកប្រាក់ </label>
          <div class="relative">
            <input
              v-model="paymentStore.formData.amount"
              type="number"
              placeholder="0.00"
              class="w-full rounded-lg border px-3 py-3 font-Kantumruy focus:outline-green-600 focus:ring-2 focus:ring-green-500 dark:text-white border-gray-300"
              :class="paymentStore.isMessage.amount ? 'border-red-500 bg-red-500/10' : ''"
            />
          </div>
          <span class="text-red-500 text-sm mt-3">{{ paymentStore.isMessage.amount }}</span>
        </div>
        <!-- End Block amount -->

        <!-- Block currency -->
        <div>
          <label class="block text-sm mb-1 dark:text-white font-Kantumruy"> ប្រភេទទឹកប្រាក់ </label>
          <div class="relative">
            <select
              name=""
              id=""
              v-model="paymentStore.formData.is_currency"
              class="w-full rounded-lg border px-3 py-3 font-Kantumruy focus:outline-green-600 focus:ring-2 focus:ring-green-500 dark:text-white border-gray-300"
              :class="paymentStore.isMessage.is_currency ? 'border-red-500 bg-red-500/10' : ''"
            >
              <option value="khr" selected>KHR (លុយរៀល)</option>
              <option value="usd">USD (លុយដុល្លា)</option>
            </select>
          </div>
          <span class="text-red-500 text-sm mt-3">{{ paymentStore.isMessage.is_currency }}</span>
        </div>
        <!-- End Block currency -->

        <div>
          <label class="block text-sm mb-1 dark:text-white font-Kantumruy">
            Upload វិក័យបត្រ
          </label>
          <input
            type="file"
            accept="image/*"
            @change="fileImage"
            class="w-full rounded-lg border px-3 py-3 font-Kantumruy focus:outline-green-600 focus:ring-2 focus:ring-green-500 dark:text-white border-gray-300"
            :class="paymentStore.isMessage.file ? 'border-red-500 bg-red-500/10' : ''"
          />
          <span class="text-red-500 text-sm mt-3">{{ paymentStore.isMessage.file }}</span>
        </div>

        <button
          @click="submitPaymentManual"
          :disabled="paymentStore.isLoading"
          class="w-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed bg-green-600 text-white font-Kantumruy py-2 rounded-lg hover:bg-green-700"
        >
          <span v-if="!paymentStore.isLoading">បញ្ជូនការបង់ប្រាក់</span>
          <div v-else class="flex justify-center items-center gap-2">
            <div class="w-5 h-5">
              <loading />
            </div>
            <span class="font-poppins">Loading...</span>
          </div>
        </button>
      </div>
      <!-- end data is not empty (QR CODE)-->

      <!-- data is empty -->
      <div
        v-else-if="!paymentStoreFromAdmin.data_qr?.data.length && !paymentStoreFromAdmin.isLoading"
      >
        <NotData :message="`QR Code is not found!, Please contact admin`" />
      </div>
      <!-- End data is empty -->

      <div
        v-if="paymentStoreFromAdmin.isLoading"
        class="w-full flex justify-center items-center p-6"
      >
        <div class="w-10 h-10">
          <Loading />
        </div>
      </div>
    </div>
    <!-- End Block Payment Manual -->

    <!-- -------------------------------------------------------- -->

    <!-- Block Start Payment Payway -->
    <!-- ================= PAYWAY PAYMENT ================= -->
    <div v-else>
      <!-- Bank select -->

      <!-- Show QR Code -->
      <div class="w-full justify-center items-center" v-if="paymentStore.processResponse?.data.md5">
        <QRCode
          :qrString="paymentStore.processResponse?.data.qr_string ?? ''"
          :amount="paymentStore.processResponse?.data.amount ?? 0"
          :is_currency="String(paymentStore.processResponse?.data.is_currency ?? 'khr')"
          :userName="paymentStore.processResponse?.data.bakong_name ?? ''"
        />
        <!--  -->
        <div class="w-full flex flex-col justify-center items-center mt-2 space-y-2">
          <p class="text-slate-500">
            This page will expire in
            <span class="font-Kantumruy text-red-500 font-semibold text-2xl">{{
              paymentStore.timeLeft
            }}</span>
            seconds.
          </p>
          <button
            @click="clearPaymentPayway()"
            class="w-full bg-red-600 text-white py-2 rounded-lg cursor-pointer hover:bg-red-700 font-Kantumruy text-lg"
          >
            បោះបង់ការបង់ប្រាក់
          </button>
        </div>

        <!--  -->
      </div>

      <div v-else class="space-y-4">
        <div class="w-full p-3 bg-slate-100 dark:bg-slate-600 rounded-md">
          <NotData :message="''" />
          <p class="font-Kantumruy">
            សូមបញ្ចូលចំនួនទឹកប្រាក់ និងជ្រើសរើសធនាគារដែលអ្នកចង់បង់តាម PayWay
          </p>
        </div>

        <div>
          <!-- Block amount -->
          <div>
            <label class="block text-sm mb-1 dark:text-white font-Kantumruy">
              ចំនួនទឹកប្រាក់
            </label>
            <div class="relative">
              <input
                v-model="paymentStore.formData.amount"
                type="number"
                placeholder="0.00"
                class="w-full rounded-lg border px-3 py-3 font-Kantumruy focus:outline-green-600 focus:ring-2 focus:ring-green-500 dark:text-white border-gray-300"
                :class="paymentStore.isMessage.amount ? 'border-red-500 bg-red-500/10' : ''"
              />
            </div>
            <span class="text-red-500 text-sm mt-3">{{ paymentStore.isMessage.amount }}</span>
          </div>
          <!-- End Block amount -->

          <!-- Block currency -->
          <div>
            <label class="block text-sm mb-1 dark:text-white font-Kantumruy">
              ប្រភេទទឹកប្រាក់
            </label>
            <div class="relative">
              <select
                name=""
                id=""
                v-model="paymentStore.formData.is_currency"
                class="w-full rounded-lg border px-3 py-3 font-Kantumruy focus:outline-green-600 focus:ring-2 focus:ring-green-500 dark:text-white border-gray-300"
                :class="paymentStore.isMessage.is_currency ? 'border-red-500 bg-red-500/10' : ''"
              >
                <option value="khr" selected>KHR (លុយរៀល)</option>
                <option value="usd">USD (លុយដុល្លា)</option>
              </select>
            </div>
            <span class="text-red-500 text-sm mt-3">{{ paymentStore.isMessage.is_currency }}</span>
          </div>
          <!-- End Block currency -->

          <button
            @click="submitPaywayPayment"
            :disabled="paymentStore.isLoading"
            class="w-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed bg-green-600 text-white font-Kantumruy py-2 rounded-lg mt-8 hover:bg-green-700"
          >
            <span v-if="!paymentStore.isLoading">បង់តាម PayWay</span>
            <div v-else class="flex justify-center items-center gap-2">
              <div class="w-5 h-5">
                <loading />
              </div>
              <span class="font-poppins">Loading...</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
