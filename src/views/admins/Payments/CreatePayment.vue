<script setup lang="ts">
import { ref } from 'vue'
import { CloseIcon } from '@/stores/Icons'
import Menual from './form_payment/PaymentManul.vue'
import Payway from './Payway.vue'
import { usePaymentStore } from '@/stores/payment_store'

/* ===============================
   Payment Type
=================================*/
const paymentType = ref<'manual' | 'payway'>('manual')

const selectPayment = (type: 'manual' | 'payway') => {
  paymentType.value = type
}

const paymentStore = usePaymentStore()
</script>

<template>
  <div class="w-full h-screen bg-black/50 fixed inset-0 flex justify-center items-center z-50 p-4">
    <div class="bg-white dark:bg-slate-700 rounded-lg shadow-2xl" @click.stop>
      <!-- Header -->
      <div class="p-4 flex justify-between items-center">
        <p class="font-Kantumruy font-medium text-xl text-slate-700 dark:text-white">Add Payment</p>

        <button
          @click="paymentStore.clearData()"
          class="bg-red-600 hover:bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-white"
        >
          <component :is="CloseIcon" />
        </button>
      </div>

      <hr class="border-slate-300 dark:border-slate-600" />

      <div class="w-full min-h-auto max-md:max-h-[700px] overflow-auto">
        <div class="flex-1">
          <!-- Payment Selector -->
          <div class="w-full p-4 flex gap-4 max-md:flex-col">
            <!-- Manual -->
            <div
              @click="selectPayment('manual')"
              class="cursor-pointer font-Kantumruy rounded-md p-2 px-4 w-full text-center"
              :class="
                paymentType === 'manual'
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              "
            >
              Manual Payment
            </div>

            <!-- PayWay -->
            <div
              @click="selectPayment('payway')"
              class="cursor-pointer font-Kantumruy rounded-md p-2 px-4 w-full text-center"
              :class="
                paymentType === 'payway'
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              "
            >
              PayWay Banks
            </div>
          </div>

          <!-- ===============================
           Manual Payment Form
      =================================-->
          <div v-if="paymentType === 'manual'" class="p-4">
            <Menual />
          </div>

          <!-- ===============================
           PayWay Payment
      =================================-->
          <div v-if="paymentType === 'payway'" class="p-4 text-center">
            <Payway />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
