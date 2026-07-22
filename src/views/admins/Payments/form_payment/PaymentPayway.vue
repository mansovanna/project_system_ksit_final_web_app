<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { CheckIcon, CloseIcon, PrintIcon } from '@/stores/Icons'
import { ref, computed, watch } from 'vue'
import Loading from '@/widgets/Loading.vue'
import { usePaymentStore } from '@/stores/payment_store'
import NotData from '@/widgets/NotData.vue'
import QRCode from '@/components/QRCode.vue'

const paymentStore = usePaymentStore()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const formData = ref({
  id_card: '',
  amount: '',
  is_currency: 'khr',
  proof_image: null as File | null,
})

const resetErrors = () => {
  paymentStore.isMessageError = {
    id_card: '',
    amount: '',
    is_currency: '',
    proof_image: '',
    file: null,
  }
}

const validateForm = () => {
  let valid = true
  resetErrors()

  // ID card
  if (!formData.value.id_card?.trim()) {
    paymentStore.isMessageError.id_card = 'Student ID is required'
    valid = false
  }

  // Amount (NUMBER FIX)
  if (!formData.value.amount || Number(formData.value.amount) <= 0) {
    paymentStore.isMessageError.amount = 'Amount must be greater than 0'
    valid = false
  }

  // Currency
  if (!formData.value.is_currency) {
    paymentStore.isMessageError.is_currency = 'Currency is required'
    valid = false
  }

  return valid
}

const submit = async () => {
  if (paymentStore.isLoadingPayment) return

  paymentStore.isMessageError.id_card = ''
  paymentStore.isMessageError.amount = ''
  paymentStore.isMessageError.is_currency = ''

  if (!validateForm()) return

  const data = new FormData()
  data.append('id_card', formData.value.id_card)
  data.append('amount', formData.value.amount)
  data.append('is_currency', formData.value.is_currency)
  data.append('method', 'manual')

  // ----------------------------------
  await paymentStore.checkout(data)
}
// data success all
const isSuccess = computed(
  () => !!formData.value.id_card && !!formData.value.is_currency && !!formData.value.amount,
)

// check payment

const status = ref('')

let timer: ReturnType<typeof setInterval> | null = null
const startCountdown = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  if (!paymentStore.paymentAPIResponse?.data?.md5) return
  if (paymentStore.timeLeft <= 0) return

  timer = setInterval(async () => {
    if (paymentStore.timeLeft <= 0) {
      clearInterval(timer!)
      timer = null
      paymentStore.clearData()
      return
    }

    paymentStore.timeLeft--
    paymentStore.countdown = paymentStore.timeLeft

    try {
      const res = await paymentStore.transaction({
        md5: paymentStore.paymentAPIResponse?.data.md5,
        id_card: paymentStore.paymentAPIResponse?.data.id_card,
      })

      if (res.responseCode == 0) {
        clearInterval(timer!)
        timer = null
        status.value = 'success'

        setTimeout(() => {
          paymentStore.clearData()
          paymentStore.isShowPaymentPayway = false
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
    } catch (err) {
      console.error(err)
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

const clearData = () => {
  paymentStore.timeLeft = 0
  paymentStore.countdown = 0
  paymentStore.paymentAPIResponse = null
  paymentStore.clearData()
  status.value = ''

  timer = null

  emit('close')
}
</script>

<template>
  <div
    @click.self="clearData()"
    class="w-full h-screen bg-black/50 flex justify-center items-center fixed inset-0 z-50 p-4"
  >
    <div
      class="animate-fadeIn w-full max-w-5xl bg-white rounded-t-3xl lg:rounded-2xl border border-slate-200 max-h-[95vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="flex justify-between items-center px-4 py-3">
        <h1 class="font-Kantumruy font-medium">Add New Payment Payway</h1>
        <button
          @click="emit('close')"
          class="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <hr class="border-slate-200" />

      <div class="flex flex-col lg:grid lg:grid-cols-2 flex-1 overflow-clip rounded-b-2xl">
        <!-- QR Preview -->
        <div class="order-2 lg:order-2 p-4 border-t lg:border-t-0 lg:border-l border-slate-200">
          <div
            v-if="!paymentStore.paymentAPIResponse?.data.qr_string"
            class="w-full h-[300px] lg:h-full bg-slate-100 rounded-md flex items-center justify-center"
          >
            <NotData :message="'សូមបំពេញទម្រង់ខាងឆ្វេងដើម្បីមើល QR Code'" />
          </div>

          <div
            v-if="paymentStore.paymentAPIResponse"
            class="flex flex-col justify-center items-center"
          >
            <div v-if="!status" class="flex flex-col justify-center items-center">
              <QRCode
                :qrString="paymentStore.paymentAPIResponse.data.qr_string"
                :amount="paymentStore.paymentAPIResponse.data.amount"
                :is_currency="paymentStore.paymentAPIResponse.data.is_currency"
                :userName="paymentStore.paymentAPIResponse.data.username"
              />
              <!-- Replace with your real QR -->
              <p class="font-Kantumruy text-lg text-red-500 font-medium">
                {{ paymentStore.countdown }}
              </p>
              <p class="text-slate-500">
                This page will expire in
                <span id="seconds">{{ paymentStore.timeLeft }}</span> seconds.
              </p>
              <!-- <p>MD5: {{ paymentStore.paymentAPIResponse.data.md5 }}</p> -->
              <!-- <p>QR String: {{ paymentStore.paymentAPIResponse.data.qr_string }}</p> -->
              <!-- <p>Amount: {{ paymentStore.paymentAPIResponse.data.amount }}</p> -->
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
          <!-- ----------------------------- -->
          <div v-if="false" class="w-full flex flex-col justify-center items-center gap-4">
            <div class="p-6 border border-slate-200 rounded-full text-green-600">
              <component :is="CheckIcon" />
            </div>
            <p class="text-green-600 font-Kantumruy text-2xl font-bold">Payment successful!</p>
          </div>
        </div>

        <!-- FORM SIDE -->
        <div class="order-1 lg:order-1 flex flex-col justify-between">
          <!-- Message -->
          <p
            v-if="paymentStore.isMessageBank.message"
            class="text-xs font-Kantumruy p-2 mt-1"
            :class="
              paymentStore.isMessageBank.type === 'error'
                ? 'bg-red-500/30 text-red-500'
                : 'bg-green-500/30 text-green-500'
            "
          >
            {{ paymentStore.isMessageBank.message }}
          </p>

          <!-- FORM -->
          <div class="p-4 flex flex-col gap-3">
            <!-- Student ID -->
            <div class="flex flex-col gap-1">
              <label class="font-Kantumruy text-sm">
                Student ID <span class="text-red-500">*</span>
              </label>

              <input
                type="text"
                v-model="formData.id_card"
                @input="paymentStore.isMessageError.id_card = ''"
                class="w-full p-2 border rounded-md outline-none text-sm"
                :class="
                  paymentStore.isMessageError.id_card
                    ? 'border-red-500'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30'
                "
                placeholder="KSIT001..."
              />

              <p v-if="paymentStore.isMessageError.id_card" class="text-red-500 text-xs">
                {{ paymentStore.isMessageError.id_card }}
              </p>
            </div>

            <!-- Amount + Currency -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Amount -->
              <div class="flex flex-col gap-1">
                <label class="text-sm"> Amount <span class="text-red-500">*</span> </label>

                <input
                  type="number"
                  v-model="formData.amount"
                  @input="paymentStore.isMessageError.amount = ''"
                  class="w-full p-2 border rounded-md outline-none text-sm"
                  :class="
                    paymentStore.isMessageError.amount
                      ? 'border-red-500'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30'
                  "
                  placeholder="0.00"
                />

                <p v-if="paymentStore.isMessageError.amount" class="text-red-500 text-xs">
                  {{ paymentStore.isMessageError.amount }}
                </p>
              </div>

              <!-- Currency -->
              <div class="flex flex-col gap-1">
                <label class="text-sm"> Currency <span class="text-red-500">*</span> </label>

                <select
                  v-model="formData.is_currency"
                  @change="paymentStore.isMessageError.is_currency = ''"
                  class="w-full p-2 border rounded-md outline-none text-sm"
                  :class="
                    paymentStore.isMessageError.is_currency
                      ? 'border-red-500'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30'
                  "
                >
                  <option value="usd">USD</option>
                  <option value="khr">KHR</option>
                </select>

                <p v-if="paymentStore.isMessageError.is_currency" class="text-red-500 text-xs">
                  {{ paymentStore.isMessageError.is_currency }}
                </p>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="flex justify-end items-center px-4 py-3 gap-3 border-t border-slate-200">
            <!-- Cancel -->
            <button
              @click="clearData"
              class="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 text-sm"
            >
              Cancel
            </button>

            <!-- Submit -->
            <button
              @click="submit"
              :disabled="!isSuccess || paymentStore.isLoadingPayment"
              class="px-4 py-2 flex items-center gap-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <template v-if="!paymentStore.isLoadingPayment">
                <component :is="PrintIcon" />
                <span>Save</span>
              </template>

              <template v-else>
                <div class="w-5 h-5">
                  <component :is="Loading" />
                </div>
                <span>Loading...</span>
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
