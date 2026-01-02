<script setup lang="ts">
import { ref } from 'vue'
import { CloseIcon } from '@/stores/Icons'

const emit = defineEmits(['close'])

const form = ref({
  idCard: '',
  amount: '',
  invoice: null as File | null,
})

const errors = ref({
  idCard: '',
  amount: '',
})

const invoicePreview = ref<string | null>(null)

/* Validate Form */
const validate = () => {
  errors.value.idCard = ''
  errors.value.amount = ''

  let isValid = true

  if (!form.value.idCard) {
    errors.value.idCard = 'ID Card is required'
    isValid = false
  }

  if (!form.value.amount) {
    errors.value.amount = 'Amount is required'
    isValid = false
  } else if (Number(form.value.amount) <= 0) {
    errors.value.amount = 'Amount must be greater than 0'
    isValid = false
  }

  return isValid
}

/* Handle Invoice Upload */
const onInvoiceChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Accept only image
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file')
    return
  }

  form.value.invoice = file
  invoicePreview.value = URL.createObjectURL(file)
}

/* Submit */
const submit = () => {
  if (!validate()) return

  console.log(form.value)

  emit('close')
}
</script>

<template>
  <div
    @click="$emit('close')"
    class="w-full h-screen bg-black/50 fixed inset-0 flex justify-center items-center z-50"
  >
    <div class="w-full max-w-3xl bg-white dark:bg-slate-600 rounded-lg shadow-2xl" @click.stop>
      <!-- Header -->
      <div class="p-4 flex justify-between items-center">
        <p class="font-Kantumruy font-medium text-xl text-slate-600">Add Payment</p>
        <button
          @click="$emit('close')"
          class="bg-red-600 hover:bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-white"
        >
          <component :is="CloseIcon" />
        </button>
      </div>

      <hr class="border-slate-300" />

      <!-- Form -->
      <div class="p-4">
        <div class="grid grid-cols-2 max-md:grid-cols-1 gap-4">
          <!-- ID Card -->
          <div>
            <label class="font-Kantumruy font-medium text-slate-600">
              ID CARD <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.idCard"
              type="text"
              class="w-full p-2 rounded outline-none focus:ring-2 focus:ring-blue-200"
              :class="errors.idCard ? 'border border-red-400' : 'border border-slate-300'"
            />
            <p v-if="errors.idCard" class="text-red-500 text-sm mt-1">
              {{ errors.idCard }}
            </p>
          </div>

          <!-- Amount -->
          <div>
            <label class="font-Kantumruy font-medium text-slate-600">
              Amount <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.amount"
              type="number"
              class="w-full p-2 rounded outline-none focus:ring-2 focus:ring-blue-200"
              :class="errors.amount ? 'border border-red-400' : 'border border-slate-300'"
            />
            <p v-if="errors.amount" class="text-red-500 text-sm mt-1">
              {{ errors.amount }}
            </p>
          </div>
        </div>

        <!-- Invoice -->
        <div class="mt-4">
          <label class="font-Kantumruy font-medium text-slate-600"> Invoice </label>

          <input
            type="file"
            accept="image/*"
            @change="onInvoiceChange"
            class="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-200"
          />

          <!-- Preview -->
          <div v-if="invoicePreview" class="mt-3">
            <p class="text-sm text-slate-500 mb-1">Invoice Preview</p>
            <img
              :src="invoicePreview"
              class="w-full max-w-xs h-90 rounded object-center object-cover border border-slate-300 shadow"
            />
          </div>
        </div>

        <!-- Action -->
        <div class="flex justify-end mt-6">
          <button
            @click="submit"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-Kantumruy"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
