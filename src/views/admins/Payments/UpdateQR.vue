<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { CloseIcon, PrintIcon, UploadIcon } from '@/stores/Icons'
import { ref, computed, onMounted } from 'vue'
import Loading from '@/widgets/Loading.vue'
import { usePaymentStore } from '@/stores/payment_store'
import { colorOptions } from '@/utils/Color'

const paymentStore = usePaymentStore()

const props = defineProps<{
  data: any
}>()

const formData = ref({
  bank_name: props.data.bank_name,
  owner_name: props.data.owner_name,
  account_usd: props.data.account_usd,
  account_khr: props.data.account_khr,
  color_theme: props.data.color_theme,
  qr_image: null as File | null,
  is_active: props.data.is_active,
})

const errors = ref({
  bank_name: '',
  owner_name: '',
  account_usd: '',
  account_khr: '',
  color_theme: '',
  qr_image: '',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

// QR Image Preview
const fileImage = (e: any) => {
  const file = e.target.files[0]
  if (file) {
    errors.value.qr_image = ''
    formData.value.qr_image = file
  }
}

const selectColor = (value: string) => {
  formData.value.color_theme = value
  errors.value.color_theme = ''
}

const validateForm = () => {
  errors.value = {
    bank_name: '',
    owner_name: '',
    account_usd: '',
    account_khr: '',
    color_theme: '',
    qr_image: '',
  }

  let isValid = true

  if (!formData.value.bank_name.trim()) {
    errors.value.bank_name = 'Bank name is required'
    isValid = false
  }

  if (!formData.value.owner_name.trim()) {
    errors.value.owner_name = 'Owner name is required'
    isValid = false
  }

  if (!formData.value.account_usd.trim()) {
    errors.value.account_usd = 'USD account number is required'
    isValid = false
  }

  if (!formData.value.account_khr.trim()) {
    errors.value.account_khr = 'KHR account number is required'
    isValid = false
  }

  if (!formData.value.color_theme) {
    errors.value.color_theme = 'Please select a card color'
    isValid = false
  }

  return isValid
}

const submit = () => {
  paymentStore.isMessage.message = ''
  paymentStore.isMessage.title = ''

  if (!validateForm()) return

  const data = new FormData()
  data.append('bank_name', formData.value.bank_name)
  data.append('owner_name', formData.value.owner_name)
  data.append('account_usd', formData.value.account_usd)
  data.append('account_khr', formData.value.account_khr)
  data.append('color_theme', formData.value.color_theme)
  data.append('is_active', formData.value.is_active)
  // check if file is update new file
  if (formData.value.qr_image) {
    data.append('qr_image', formData.value.qr_image)
  }

  paymentStore.updateBank(props.data.id, data)
}

const fileSize = computed(() => {
  const size = formData.value.qr_image?.size ?? 0

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(2)} MB`
})

onMounted(() => {
  formData.value.bank_name = props.data.bank_name
  formData.value.owner_name = props.data.owner_name
  formData.value.account_usd = props.data.account_usd
  formData.value.account_khr = props.data.account_khr
  formData.value.color_theme = props.data.color_theme
  formData.value.is_active = props.data.is_active
})

// Calculate is update
const isUpdate = computed(() => {
  if (
    formData.value.bank_name === props.data.bank_name &&
    formData.value.owner_name === props.data.owner_name &&
    formData.value.account_usd === props.data.account_usd &&
    formData.value.account_khr === props.data.account_khr &&
    formData.value.color_theme === props.data.color_theme
  ) {
    return true
  }
  return false
})
</script>

<template>
  <!-- ✅ backdrop click fix: @click.self -->
  <div
    @click.self="emit('close')"
    class="w-full h-screen bg-black/50 flex justify-center items-center fixed inset-0 z-50 p-4"
  >
    <div
      class="w-full max-w-lg bg-white rounded-2xl border border-slate-200 overflow-clip animate-fadeIn"
    >
      <!-- Header -->
      <div class="flex justify-between items-center px-4 py-3">
        <h1 class="font-Kantumruy font-medium">Update QR Code</h1>
        <button
          @click="emit('close')"
          class="p-1 bg-red-500 text-white border border-slate-300 rounded-lg hover:bg-red-600 cursor-pointer"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <hr class="border-slate-200" />

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

      <!-- Form -->
      <div class="p-4 flex flex-col gap-3">
        <!-- Row 1: Bank Name + Owner Name -->
        <div class="flex gap-3 max-md:flex-col">
          <div class="w-full flex flex-col gap-1">
            <label class="font-Kantumruy text-sm">
              Bank Name <span class="text-red-500">*</span>
            </label>

            <input
              type="text"
              v-model="formData.bank_name"
              @input="errors.bank_name = ''"
              :class="[
                'w-full p-2 border rounded-md outline-none font-Kantumruy text-sm',
                errors.bank_name
                  ? 'border-red-500'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30',
              ]"
              placeholder="ABA, ACLEDA, Wing..."
            />

            <p v-if="errors.bank_name" class="text-red-500 text-xs font-Kantumruy">
              {{ errors.bank_name }}
            </p>
          </div>
          <div class="w-full flex flex-col gap-1">
            <label class="font-Kantumruy text-sm">
              Owner Name <span class="text-red-500">*</span>
            </label>

            <input
              type="text"
              v-model="formData.owner_name"
              @input="errors.owner_name = ''"
              :class="[
                'w-full p-2 border rounded-md outline-none font-Kantumruy text-sm',
                errors.owner_name
                  ? 'border-red-500'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30',
              ]"
              placeholder="SOVANNA MAN"
            />

            <p v-if="errors.owner_name" class="text-red-500 text-xs font-Kantumruy">
              {{ errors.owner_name }}
            </p>
          </div>
        </div>

        <!-- Row 2: Account USD + KHR -->
        <div class="flex gap-3 max-md:flex-col">
          <div class="w-full flex flex-col gap-1">
            <label class="font-Kantumruy text-sm">
              Account No. (USD) <span class="text-red-500">*</span>
            </label>

            <input
              type="text"
              v-model="formData.account_usd"
              @input="errors.account_usd = ''"
              :class="[
                'w-full p-2 border rounded-md outline-none font-Kantumruy text-sm',
                errors.account_usd
                  ? 'border-red-500'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30',
              ]"
            />

            <p v-if="errors.account_usd" class="text-red-500 text-xs font-Kantumruy">
              {{ errors.account_usd }}
            </p>
          </div>
          <div class="w-full flex flex-col gap-1">
            <label class="font-Kantumruy text-sm">
              Account No. (KHR) <span class="text-red-500">*</span>
            </label>

            <input
              type="text"
              v-model="formData.account_khr"
              @input="errors.account_khr = ''"
              :class="[
                'w-full p-2 border rounded-md outline-none font-Kantumruy text-sm',
                errors.account_khr
                  ? 'border-red-500'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30',
              ]"
            />

            <p v-if="errors.account_khr" class="text-red-500 text-xs font-Kantumruy">
              {{ errors.account_khr }}
            </p>
          </div>
        </div>

        <!-- Card Color -->
        <div class="flex flex-col gap-1">
          <label class="font-Kantumruy text-sm">
            Card Color <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2">
            <button
              v-for="c in colorOptions"
              :key="c.value"
              type="button"
              @click="selectColor(c.value)"
              :class="[
                'w-6 h-6 rounded-full cursor-pointer transition-all duration-150',
                c.bg,
                formData.color_theme === c.value
                  ? `ring-2 ring-offset-2 ${c.ring} scale-110`
                  : 'opacity-60 hover:opacity-100 hover:scale-105',
              ]"
            />
          </div>
          <p v-if="errors.color_theme" class="text-red-500 text-xs font-Kantumruy">
            {{ errors.color_theme }}
          </p>
        </div>

        <!-- QR Image Upload -->
        <div class="flex flex-col gap-1">
          <label class="font-Kantumruy text-sm">
            QR Image <span class="text-red-500">*</span>
          </label>
          <label class="w-full cursor-pointer">
            <div
              class="w-full flex flex-col justify-center items-center border border-dashed border-blue-500 rounded-md p-6 hover:bg-slate-50 transition"
            >
              <component :is="UploadIcon" />
              <p class="font-Kantumruy font-medium text-sm mt-1">Click to Update QR image</p>
              <p class="font-Kantumruy text-xs text-slate-400">JPG, PNG — max {{ fileSize }}</p>
              <p class="font-Kantumruy text-xs text-blue-700">
                file select: {{ formData.qr_image?.name }}
              </p>
            </div>
            <input type="file" accept=".png,.jpg,.jpeg" @change="fileImage" hidden />
          </label>
          <p v-if="errors.qr_image" class="text-red-500 text-xs font-Kantumruy">
            {{ errors.qr_image }}
          </p>
        </div>
      </div>
      <!-- End Form -->

      <hr class="border-slate-200" />

      <!-- Footer -->
      <div class="flex justify-end items-center px-4 py-3 gap-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-Kantumruy text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="submit"
          :disabled="paymentStore.isLoading || isUpdate"
          class="px-4 py-2 flex items-center disabled:bg-slate-600 disabled:cursor-not-allowed gap-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-Kantumruy text-sm cursor-pointer"
        >
          <div v-if="!paymentStore.isLoading" class="flex justify-center items-center gap-2">
            <component :is="PrintIcon" />
            <span>Save</span>
          </div>

          <div v-if="paymentStore.isLoading" class="flex justify-center items-center gap-1">
            <div class="w-5 h-5">
              <component :is="Loading" />
            </div>
            <span class="font-Kantumruy">Loading...</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
