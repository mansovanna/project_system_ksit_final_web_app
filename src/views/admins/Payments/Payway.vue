<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { CheckIcon } from '@/stores/Icons'
import { usePaymentStore } from '@/stores/payment_store'
import QRCode from '@/components/QRCode.vue'
import { ref, watch } from 'vue'

const paymentStore = usePaymentStore()

const handleCreateQRCode = () => {
  paymentStore.isMessageError = {
    id_card: '',
    amount: '',
    is_currency: '',
    proof_image: '',
    file: null,
  }
  // ----------------------------------------------------
  if (paymentStore.formData.id_card.length == 0) {
    return (paymentStore.isMessageError.id_card = 'ID Card is required')
  }

  if (paymentStore.formData.amount == 0) {
    return (paymentStore.isMessageError.amount = 'Amount is required')
  }

  paymentStore.checkout({
    id_card: paymentStore.formData.id_card,
    amount: paymentStore.formData.amount,
    is_currency: paymentStore.formData.is_currency,
  })
}

// {{-- Countdown Script --}}

const status = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const startCountdown = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  timer = setInterval(async () => {
    if (paymentStore.timeLeft > 0) {
      paymentStore.timeLeft--
      paymentStore.countdown = paymentStore.timeLeft

      const res = await paymentStore.transaction({
        md5: paymentStore.paymentAPIResponse?.data.md5,
        id_card: paymentStore.paymentAPIResponse?.data.id_card,
      })

      console.log(res.responseCode)

      if (res.responseCode == 0) {
        clearInterval(timer!)
        timer = null
        status.value = 'success'

        setTimeout(() => {
          paymentStore.clearData()
          status.value = ''
        }, 1500)
      } else if (res.failed) {
        clearInterval(timer!)
        timer = null
        status.value = 'failed'

        setTimeout(() => {
          paymentStore.clearData()
          status.value = ''
        }, 1500)
      }
    } else {
      clearInterval(timer!)
      timer = null
      paymentStore.clearData()
    }
  }, 1000)
}

// ----------------------------------------------------------
watch(
  () => [paymentStore.timeLeft, paymentStore.paymentAPIResponse?.data.md5],
  (newValue) => {
    if (newValue[0] != 0) {
      startCountdown()
    }
  },
)

watch(
  () => status.value,
  (newValue) => {
    if (newValue === 'success' || newValue === 'failed') {
      status.value = newValue
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  },
)
</script>

<template>
  <div class="w-full flex gap-4 max-md:flex-col max-md:justify-center max-md:items-center">
    <!-- form for create -->

    <form @submit.prevent="handleCreateQRCode" class="w-1/2 max-md:w-full">
      <div class="w-full flex flex-col gap-4">
        <div class="flex flex-col justify-start">
          <label class="text-left font-Kantumruy text-base">ID Card</label>
          <input
            v-model="paymentStore.formData.id_card"
            type="text"
            class="input w-full p-4 mt-1"
            :class="paymentStore.isMessageError.id_card ? 'error' : ''"
            placeholder="Please enter ID CARD student"
          />
          <span class="text-red-500 text-left text-xs font-Kantumruy mt-1">{{
            paymentStore.isMessageError.id_card
          }}</span>
        </div>
        <!-- ------------------- -->
        <div class="flex flex-row gap-4">
          <div class="w-full flex flex-col justify-start">
            <label class="text-left font-Kantumruy text-base">Amount</label>
            <input
              v-model="paymentStore.formData.amount"
              type="text"
              class="input w-full p-4 mt-1"
              placeholder="Please enter amount"
              :class="paymentStore.isMessageError.amount ? 'error' : ''"
            />
            <span class="text-red-500 text-left text-xs font-Kantumruy mt-1">{{
              paymentStore.isMessageError.amount
            }}</span>
          </div>

          <div class="w-1/2 flex flex-col justify-start items-start">
            <label class="font-Kantumruy font-medium text-slate-700 dark:text-white">
              Currency
            </label>

            <select
              name="is_currency"
              class="border w-full mt-1 rounded-md font-Kantumruy font-bold text-red-500 bg-red-50 border-red-300 px-3 py-2.5"
              v-model="paymentStore.formData.is_currency"
            >
              <option value="khr">KHR</option>
              <option value="usd">USD</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col justify-start">
          <button
            :disabled="paymentStore.isLoadingPayment"
            class="bg-green-700 p-2 rounded text-white font-Kantumruy cursor-pointer hover:bg-green-900 w-full mt-4"
          >
            <span v-if="!paymentStore.isLoadingPayment" class="font-Kantumruy">Create QR Code</span>
            <span v-else class="font-Kantumruy">Loading...</span>
          </button>
        </div>
      </div>
    </form>
    <!-- end form for create qr -->

    <div
      class="w-1/2 max-md:w-full text-wrap p-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col justify-center font-Kantumruy items-center"
    >
      <p class="font-Kantumruy" v-if="!paymentStore.paymentAPIResponse?.data.qr_string">
        Please complete information student before scanning QR code
      </p>

      <div v-if="paymentStore.paymentAPIResponse" class="flex flex-col justify-center items-center">
        <div v-if="!status">
          <QRCode
            :qrString="paymentStore.paymentAPIResponse.data.qr_string"
            :amount="paymentStore.paymentAPIResponse.data.amount"
            :is_currency="paymentStore.paymentAPIResponse.data.is_currency"
            :userName="paymentStore.paymentAPIResponse.data.username"
          />
          <!-- Replace with your real QR -->
          <p class="mt-4 font-Kantumruy text-lg text-red-500 font-medium">
            {{ paymentStore.countdown }}
          </p>
          <p class="mt-2 text-slate-500">
            This page will expire in <span id="seconds">{{ paymentStore.timeLeft }}</span> seconds.
          </p>
          <!-- <p>MD5: {{ paymentStore.paymentAPIResponse.data.md5 }}</p>
        <p>QR String: {{ paymentStore.paymentAPIResponse.data.qr_string }}</p>
        <p>Amount: {{ paymentStore.paymentAPIResponse.data.amount }}</p> -->
        </div>

        <div v-else-if="status == 'success'" class="flex flex-col justify-center items-center">
          <div class="p-4 bg-green-500 dark:bg-green-700 rounded-full animate-bounce">
            <component :is="CheckIcon" class="w-10 h-10 text-white" />
          </div>
          <p class="text-green-600 font-Kantumruy font-medium mt-2">Payment successful!</p>
        </div>

        <div v-else class="flex flex-col justify-center items-center">
          <div class="p-4 bg-red-500 dark:bg-red-700 rounded-full animate-bounce">
            <component :is="CheckIcon" class="w-10 h-10 text-white" />
          </div>
          <p class="text-red-600 font-Kantumruy font-medium mt-2">Payment failed!</p>
        </div>
      </div>
    </div>
    <!-- success -->

    <div v-if="false" class="w-full flex flex-col justify-center items-center gap-4">
      <div class="p-6 border border-slate-200 rounded-full text-green-600">
        <component :is="CheckIcon" />
      </div>
      <p class="text-green-600 font-Kantumruy text-2xl font-bold">Payment successful!</p>
    </div>
  </div>
</template>
