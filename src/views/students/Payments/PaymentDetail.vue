<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import { ArrowBackIcon } from '@/stores/Icons'
import NotData from '@/widgets/NotData.vue'
import { useStudentPaymentStore } from '@/stores/student_payment_store'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Loading from '@/widgets/Loading.vue'

const paymentStore = useStudentPaymentStore()

const route = useRoute()

const formatDate = (date: string) => {
  const d = new Date(date)

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')

  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12
  hours = hours ? hours : 12

  if (date === null) return 'N/A'

  return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes}${ampm}`
}
//-------------------
// Default load
onMounted(() => {
  if (route.params.id) {
    paymentStore.getPaymentDetail(Number(route.params.id))
  }
})
</script>

<template>
  <StudentLayouts>
    <div class="p-4 space-y-4">
      <!-- LEFT SIDE -->
      <div class="w-full flex justify-between items-center">
        <!--  -->
        <h1 class="font-Kantumruy text-xl text-slate-700 dark:text-slate-300">
          ព័ត៌មានលម្អិតនៃការបង់ប្រាក់
        </h1>
        <button
          @click="$router.back()"
          class="flex justify-center items-center px-4 py-1.5 bg-red-600 text-white hover:bg-red-700 cursor-pointer rounded-md"
        >
          <component :is="ArrowBackIcon" />
          <p>Back</p>
        </button>
      </div>

      <!-- info... -->
      <div
        v-if="paymentStore.data_detail?.data"
        class="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900"
      >
        <!-- Block pay info -->
        <div class="w-full flex gap-4 max-lg:flex-col">
          <!-- info -->
          <div class="w-1/2 max-lg:w-full space-y-1">
            <!-- id -->
            <div>
              <p class="font-Kantumruy font-medium text-blue-600">
                #PAY-ID: {{ paymentStore.data_detail.data.id }}
              </p>
            </div>

            <!-- End id -->

            <!-- name -->
            <div
              class="flex justify-between gap-1 w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md"
            >
              <p class="font-Kantumruy">ឈ្មោះសិស្ស៖</p>
              <p class="font-Kantumruy font-medium">
                {{ paymentStore.data_detail.data.user.user_name }}
              </p>
            </div>

            <!-- End name -->

            <!-- amount -->
            <div
              class="flex justify-between gap-1 w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md"
            >
              <p class="font-Kantumruy">ចំនួនទឹកប្រាក់៖</p>
              <p class="font-Kantumruy font-semibold text-red-500">
                {{ paymentStore.data_detail.data.amount }}
                {{ paymentStore.data_detail.data.is_currency != 'khr' ? 'USD' : 'KHR' }}
              </p>
            </div>

            <!-- End amount -->

            <!-- method -->
            <div
              class="flex justify-between items-center gap-1 w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md"
            >
              <p class="font-Kantumruy">វិធីបង់៖</p>
              <p
                class="font-Kantumruy capitalize font-medium text-sm px-3 py-1 bg-blue-500/30 text-blue-500 rounded-md"
              >
                {{ paymentStore.data_detail.data.method }}
              </p>
            </div>

            <!-- End method -->

            <!-- date pay-->
            <div
              class="flex justify-between gap-1 w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md"
            >
              <p class="font-Kantumruy">ថ្ងៃបង់៖</p>
              <p class="font-Kantumruy font-medium">
                {{ formatDate(paymentStore.data_detail.data.created_at) }}
              </p>
            </div>

            <!-- End date pay -->

            <!-- status -->
            <div
              class="flex justify-between gap-1 w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md"
            >
              <p class="font-Kantumruy">ស្ថានភាព៖</p>
              <p
                class="font-Kantumruy capitalize font-medium text-sm px-3 py-1 rounded-md"
                :class="{
                  'bg-orange-500/30 text-orange-500':
                    paymentStore.data_detail.data.status === 'pending',
                  'bg-green-500/30 text-green-500':
                    paymentStore.data_detail.data.status === 'approved' ||
                    paymentStore.data_detail.data.status === 'paid',
                  'bg-red-500/30 text-red-500':
                    paymentStore.data_detail.data.status === 'failed' ||
                    paymentStore.data_detail.data.status === 'rejected',
                }"
              >
                {{ paymentStore.data_detail.data.status }}
              </p>
            </div>

            <!-- End status -->

            <!-- date pay-->
            <div
              class="flex justify-between items-center gap-1 w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md"
            >
              <p class="font-Kantumruy">ត្រួតពិនិត្យដោយ៖</p>
              <p class="font-Kantumruy font-medium text-blue-500 capitalize">
                {{ paymentStore.data_detail.data.approved_by ?? 'N/A' }}
              </p>
            </div>

            <!-- End date pay -->
            <!-- date pay-->
            <div
              class="flex justify-between items-center gap-1 w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md"
            >
              <p class="font-Kantumruy">ថ្ងៃត្រួតពិនិត្យ៖</p>
              <p class="font-Kantumruy font-medium text-blue-500">
                {{ formatDate(paymentStore.data_detail.data.approved_at) }}
              </p>
            </div>

            <!-- End date pay -->

            <!--  -->
          </div>
          <!-- End info -->

          <!-- Block receipt -->
          <div class="w-full p-6 bg-slate-200 rounded-md flex flex-col justify-start items-center">
            <!-- image receipt -->
            <div v-if="paymentStore.data_detail.data.image_url" class="w-1/3 max-lg:w-full">
              <img
                :src="paymentStore.data_detail.data.image_url"
                alt=""
                class="w-full h-full object-cover"
              />
            </div>
            <!-- End image receipt -->

            <!-- if file empty -->
            <div v-else class="w-full">
              <NotData />
            </div>
            <!-- End if file empty -->
          </div>
          <!-- End block receipt -->
        </div>
      </div>
      <!-- End info -->

      <!-- Block loading -->
      <div v-if="paymentStore.isLoading" class="w-full flex justify-center items-center">
        <div class="w-10 h-10 flex justify-center items-center">
          <Loading />
        </div>
      </div>
      <!-- End Block loading -->

      <!-- Block data is empy -->
      <div v-if="!paymentStore.data_detail?.data && !paymentStore.isLoading" class="w-full">
        <div class="w-full">
          <NotData />
        </div>
      </div>
      <!-- End Block data is empy -->
    </div>
  </StudentLayouts>
</template>
