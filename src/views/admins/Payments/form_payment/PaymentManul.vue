<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { CloseIcon, DownloadIcon, PrintIcon, UploadIcon } from '@/stores/Icons'
import { ref, computed } from 'vue'
import Loading from '@/widgets/Loading.vue'
import { usePaymentStore } from '@/stores/payment_store'

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

  // Proof image
  if (!formData.value.proof_image) {
    paymentStore.isMessageError.proof_image = 'Invoice is required'
    valid = false
  }

  return valid
}

const fileImage = (e: any) => {
  const file = e.target.files?.[0]
  if (file) {
    paymentStore.isMessageError.proof_image = ''
    formData.value.proof_image = file
  }
}

const fileSize = computed(() => {
  const size = formData.value.proof_image?.size ?? 0
  return size < 1024 * 1024
    ? `${(size / 1024).toFixed(2)} KB`
    : `${(size / 1024 / 1024).toFixed(2)} MB`
})

const submit = async () => {
  if (paymentStore.isLoadingPayment) return

  paymentStore.isMessageError.id_card = ''
  paymentStore.isMessageError.amount = ''
  paymentStore.isMessageError.is_currency = ''
  paymentStore.isMessageError.proof_image = ''

  if (!validateForm()) return

  const data = new FormData()
  data.append('id_card', formData.value.id_card)
  data.append('amount', formData.value.amount)
  data.append('is_currency', formData.value.is_currency)
  data.append('method', 'manual')

  if (formData.value.proof_image) {
    data.append('proof_image', formData.value.proof_image)
  }

  // await paymentStore.addPaymentUser(data)
  // alert('This is Loading')
  await paymentStore.addPaymentUser(data)
}
// data success all
const isSuccess = computed(
  () =>
    !!formData.value.id_card &&
    !!formData.value.is_currency &&
    !!formData.value.proof_image &&
    !!formData.value.amount,
)

const isSelectedBanks = ref(0)

const selectBank = (index: number) => {
  isSelectedBanks.value = index
}

// Block download qr code
const isloading = ref(false)

const downloadQrCode = async (image: string, bank_name: string) => {
  if (!image) return

  isloading.value = true

  try {
    const response = await fetch(image)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `qr-code-${bank_name}.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Download failed:', error)
  } finally {
    setTimeout(() => {
      isloading.value = false
    }, 500)
  }
}
</script>

<template>
  <div
    @click.self="emit('close')"
    class="w-full h-screen bg-black/50 flex justify-center items-center fixed inset-0 z-50 p-4"
  >
    <div
      class="animate-fadeIn w-full max-w-5xl bg-white rounded-t-3xl lg:rounded-2xl border border-slate-200 max-h-[95vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="flex justify-between items-center px-4 py-3">
        <h1 class="font-Kantumruy font-medium">Add New Bank Account</h1>
        <button
          @click="emit('close')"
          class="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <hr class="border-slate-200" />

      <div class="grid grid-cols-1 lg:grid-cols-2 overflow-y-auto flex-1">
        <!-- QR Preview -->
        <div
          class="order-1 lg:order-2 p-4 border-b lg:border-b-0 lg:border-l border-slate-200 relative"
        >
          <div class="flex items-center gap-2 overflow-x-auto p-1" style="scrollbar-width: none">
            <button
              v-for="(item, index) in paymentStore.data_qr?.data"
              :key="index"
              @click="selectBank(index)"
              :class="[
                'px-4 py-1 rounded-full border border-slate-200 font-Kantumruy text-sm cursor-pointer shrink-0',
                isSelectedBanks === index
                  ? `bg-green-600 text-white ring-2 ring-green-600`
                  : 'bg-slate-100 text-slate-900',
              ]"
            >
              {{ item.bank_name }} Bank
            </button>
          </div>

          <div class="mt-2 flex flex-col items-center">
            <p class="font-Kantumruy text-lg font-medium mb-2">Scan Pay Now</p>

            <div class="flex justify-center">
              <img
                v-if="paymentStore.data_qr?.data?.[isSelectedBanks]?.qr_image_url"
                :src="paymentStore.data_qr.data[isSelectedBanks]?.qr_image_url ?? ''"
                alt="QR Code"
                class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover rounded-xl border border-slate-300"
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
            <button
              @click="
                downloadQrCode(
                  String(paymentStore.data_qr?.data?.[isSelectedBanks]?.qr_image_url),
                  String(paymentStore.data_qr?.data?.[isSelectedBanks]?.bank_name),
                )
              "
              :disabled="isloading"
              class="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center items-center"
            >
              <DownloadIcon v-if="!isloading" class="w-6 h-6" />

              <div v-else class="w-6 h-6 flex justify-center items-center">
                <component :is="Loading" />
              </div>
            </button>
          </div>
        </div>

        <!-- Form -->
        <div class="order-2 lg:order-1">
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
                :class="[
                  'w-full p-2 border rounded-md outline-none font-Kantumruy text-sm',
                  paymentStore.isMessageError.id_card
                    ? 'border-red-500'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30',
                ]"
                placeholder="KSIT001..."
              />

              <p
                v-if="paymentStore.isMessageError.id_card"
                class="text-red-500 text-xs font-Kantumruy"
              >
                {{ paymentStore.isMessageError.id_card }}
              </p>
            </div>

            <!-- Amount + Currency -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="font-Kantumruy text-sm">
                  Amount <span class="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  v-model="formData.amount"
                  @input="paymentStore.isMessageError.amount = ''"
                  :class="[
                    'w-full p-2 border rounded-md outline-none font-Kantumruy text-sm',
                    paymentStore.isMessageError.amount
                      ? 'border-red-500'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30',
                  ]"
                  placeholder="0.00"
                />

                <p
                  v-if="paymentStore.isMessageError.amount"
                  class="text-red-500 text-xs font-Kantumruy"
                >
                  {{ paymentStore.isMessageError.amount }}
                </p>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-Kantumruy text-sm">
                  Currency <span class="text-red-500">*</span>
                </label>

                <select
                  v-model="formData.is_currency"
                  @change="paymentStore.isMessageError.is_currency = ''"
                  :class="[
                    'w-full p-2 border rounded-md outline-none font-Kantumruy text-sm',
                    paymentStore.isMessageError.is_currency
                      ? 'border-red-500'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30',
                  ]"
                >
                  <option value="usd">USD</option>
                  <option value="khr">KHR</option>
                </select>

                <p
                  v-if="paymentStore.isMessageError.is_currency"
                  class="text-red-500 text-xs font-Kantumruy"
                >
                  {{ paymentStore.isMessageError.is_currency }}
                </p>
              </div>
            </div>

            <!-- Upload -->
            <div class="flex flex-col gap-1">
              <label class="font-Kantumruy text-sm">
                Invoice <span class="text-red-500">*</span>
              </label>

              <label class="w-full cursor-pointer">
                <div
                  class="w-full flex flex-col justify-center items-center border border-dashed rounded-md p-6 hover:bg-slate-50 transition"
                  :class="
                    paymentStore.isMessageError.proof_image
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-blue-500'
                  "
                >
                  <component :is="UploadIcon" />

                  <p class="font-Kantumruy font-medium text-sm mt-1">Click to upload</p>

                  <p class="font-Kantumruy text-xs text-slate-400">
                    JPG, PNG
                    {{ formData.proof_image ? ` — ${fileSize}` : '' }}
                  </p>

                  <p
                    v-if="formData.proof_image"
                    class="font-Kantumruy text-xs text-blue-700 truncate max-w-full"
                  >
                    {{ formData.proof_image.name }}
                  </p>
                </div>

                <input type="file" accept=".png,.jpg,.jpeg" @change="fileImage" hidden />
              </label>

              <p
                v-if="paymentStore.isMessageError.proof_image"
                class="text-red-500 text-xs font-Kantumruy"
              >
                {{ paymentStore.isMessageError.proof_image }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="flex justify-end items-center px-4 py-3 gap-3 rounded-b-md">
        <button
          @click="emit('close')"
          class="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-Kantumruy text-sm cursor-pointer"
        >
          Cancel
        </button>
        <!--  -->
        <button
          @click="submit"
          :disabled="!isSuccess || paymentStore.isLoadingPayment"
          class="px-4 py-2 flex items-center gap-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-Kantumruy text-sm cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed"
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
</template>
