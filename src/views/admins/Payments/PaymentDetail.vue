<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { ArrowBackIcon, ArrowSmallUpIcon } from '@/stores/Icons'
import { usePaymentStore } from '@/stores/payment_store'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import Loading from '@/widgets/Loading.vue'

const paymentStore = usePaymentStore()
const route = useRoute()

const avata = useAvatar()

const statusStyle: Record<string, string> = {
  approved: 'bg-green-600 text-white',
  pending: 'bg-yellow-600 text-white',
  rejected: 'bg-red-600 text-white',
}

onMounted(async () => {
  // In a real application, you would fetch the payment details from an API using the ID from the route params.
  // For this example, we're using hardcoded data.
  if (route.params.id) {
    paymentStore.getPaymentByID(Number(route.params.id))
  }
})
</script>

<template>
  <AdminLayouts>
    <div class="p-4">
      <div
        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
      >
        <!-- Header -->
        <div
          class="px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700"
        >
          <div class="flex items-center gap-2 text-sm">
            <span
              @click="$router.push('/admin')"
              class="text-slate-500 hover:text-blue-500 font-Kantumruy cursor-pointer transition-colors"
              >Dashboard</span
            >
            <component :is="ArrowSmallUpIcon" class="rotate-90 w-3 h-3 text-slate-400" />
            <span class="text-blue-500 capitalize font-Kantumruy">{{ $route.name }}</span>
          </div>
          <button
            @click="$router.back()"
            class="flex items-center font-Kantumruy font-medium gap-1.5 px-4 py-2.5 text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <component :is="ArrowBackIcon" class="w-4 h-4" />
            Back
          </button>
        </div>

        <!-- Body -->
        <div
          v-if="paymentStore.data_state"
          class="p-6 grid grid-cols-1 md:grid-cols-2 flex-col-reverse gap-4 justify-start items-start"
        >
          <!-- Payment Info -->
          <div
            class="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5"
          >
            <p
              class="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4 font-Kantumruy"
            >
              Payment information
            </p>

            <div class="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <div class="flex justify-between items-center py-2.5">
                <span class="text-slate-500 font-Kantumruy font-medium">Payment ID</span>
                <span class="font-medium text-slate-800 dark:text-slate-100 font-Kantumruy">{{
                  paymentStore.data_state.id
                    ? `#PAY-${paymentStore.data_state.id.toString().padStart(5, '0')}`
                    : 'N/A'
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2.5 font-Kantumruy font-medium">
                <span class="text-slate-500 font-Kantumruy">Amount</span>
                <span
                  class="text-xl font-semibold text-slate-800 dark:text-slate-100 font-Kantumruy capitalize"
                  >{{
                    paymentStore.data_state.is_currency
                      ? paymentStore.data_state.is_currency == 'khm'
                        ? '៛'
                        : '$'
                      : 'N/A'
                  }}
                  {{ paymentStore.data_state.amount ? paymentStore.data_state.amount : 'N/A' }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2.5">
                <span class="text-slate-500 font-Kantumruy font-medium">Method</span>
                <div class="flex items-center gap-2">
                  <div
                    class="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/50 capitalize flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300 font-Kantumruy"
                  >
                    {{
                      paymentStore.data_state.method
                        ? paymentStore.data_state.method.charAt(0).toUpperCase()
                        : 'N/A'
                    }}
                  </div>
                  <span class="text-slate-800 dark:text-slate-100 font-Kantumruy capitalize">{{
                    paymentStore.data_state.method ? paymentStore.data_state.method : 'N/A'
                  }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center py-2.5">
                <span class="text-slate-500 font-Kantumruy font-medium">Status</span>
                <span
                  :class="[
                    'text-xs font-medium px-3 py-1.5 rounded-full font-Kantumruy capitalize',
                    statusStyle[paymentStore.data_state.status] ?? 'bg-slate-100 text-slate-700',
                  ]"
                >
                  {{ paymentStore.data_state.status }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2.5">
                <span class="text-slate-500 font-Kantumruy font-medium">Date</span>
                <span class="text-slate-800 dark:text-slate-100 font-Kantumruy">{{
                  paymentStore.data_state.approved_at
                    ? new Date(paymentStore.data_state.approved_at).toLocaleDateString()
                    : 'N/A'
                }}</span>
              </div>
            </div>

            <!-- proof_image -->
            <div v-if="paymentStore.data_state.image_url">
              <hr class="text-slate-200 dark:text-slate-600" />
              <p class="font-Kantumruy font-medium text-slate-800 dark:text-slate-100 mt-2">
                Proof Image
              </p>
              <div class="mt-2 flex justify-center">
                <img
                  :src="paymentStore.data_state.image_url"
                  alt="Proof Image"
                  class="max-w-96 h-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          <!-- User Info -->
          <div
            class="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5"
          >
            <p
              class="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4 font-Kantumruy"
            >
              User information
            </p>

            <div
              class="flex flex-col items-center text-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-700"
            >
              <img
                :src="avata.textToImage(paymentStore.data_state.user?.user_name)"
                alt="User Avatar"
                class="w-25 h-25 ring-4 ring-blue-600 dark:ring-blue-600 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-700 dark:text-purple-300 font-semibold text-3xl mb-3 shrink-0"
              />
              <p class="font-medium text-sm text-slate-800 dark:text-slate-100">
                {{ paymentStore.data_state.user?.user_name ?? 'N/A' }}
              </p>
              <p class="text-xs text-slate-400">
                User #{{ paymentStore.data_state.user.info?.id_card ?? 'N/A' }}
              </p>
            </div>

            <div class="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <div class="flex justify-between items-center py-2.5 font-Kantumruy font-medium">
                <span class="text-slate-500">Email</span>
                <span class="text-blue-500">{{
                  paymentStore.data_state.user?.email ?? 'N/A'
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2.5 font-Kantumruy font-medium">
                <span class="text-slate-500">Phone</span>
                <span class="text-slate-800 dark:text-slate-100">{{
                  paymentStore.data_state.user?.phone_number ?? 'N/A'
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="paymentStore.isLoading" class="w-full flex justify-center items-center p-6">
          <div class="w-10 h-10">
            <Loading />
          </div>
        </div>

        <div
          v-if="!paymentStore.data_state && !paymentStore.isLoading"
          class="w-full justify-center items-center flex p-6"
        >
          <p class="font-Kantumruy text-slate-400">Data is not available</p>
        </div>
      </div>
    </div>
  </AdminLayouts>
</template>
