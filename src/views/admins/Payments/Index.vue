<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CheckIcon,
  CloseIcon,
  NotDataSVGICON,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'

import { onMounted, ref, computed, watch } from 'vue'
import { usePaymentStore } from '@/stores/payment_store'
import Loading from '@/widgets/Loading.vue'
import { useAvatar } from '@/composables/useAvatar'
import PaymentManul from './form_payment/PaymentManul.vue'
import PaymentPayway from './form_payment/PaymentPayway.vue'
import InputTextField from '@/widgets/InputTextField.vue'
import NotData from '@/widgets/NotData.vue'
import { QrCodeIcon } from '@lucide/vue'

import { api as viewerApi } from 'v-viewer'
import 'viewerjs/dist/viewer.css'

const paymentStore = usePaymentStore()

const avatar = useAvatar()

//----------------------------------
const isOpen = ref(false)
const isMessage = ref<string>('')
const formStatus = ref({
  id: 0,
  status: '',
})
const alert_messageg_check = (id: number | null, status: string | null) => {
  if (id != null || status != null) {
    isMessage.value = status ?? ''
    formStatus.value.id = Number(id)
    formStatus.value.status = String(status)
    isOpen.value = true
  }
}
//------------------------------------
const isShowImageInvoice = ref(false)
const preViewImage = ref('')
const showInvoice = (image: string) => {
  isShowImageInvoice.value = !isShowImageInvoice.value
  if (image) {
    preViewImage.value = image
  }
}
// -----------------------------------
const formatDate = (dateString: string) => {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}
// ----------------
onMounted(() => {
  paymentStore.getUserNotPayments(paymentStore.search, paymentStore.per_page, paymentStore.page)
  paymentStore.getQRCodeBanks()
})

// pagination code apply

const pages = computed(() => {
  const current = paymentStore.data?.data.current_page || 1
  const last = paymentStore.data?.data.last_page || 1

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

let time: ReturnType<typeof setTimeout>

watch(
  () => paymentStore.search,
  (value) => {
    clearTimeout(time)

    time = setTimeout(() => {
      paymentStore.getUserNotPayments(
        value,
        paymentStore.per_page,
        paymentStore.page, // reset to page 1 when search
      )
    }, 500) // delay 500ms
  },
)

// --------------------------------------------------

// --------------------------------------------------

const checkMessage = (id: number, status: string) => {
  if (id && status) {
    // logic update status payment of students or users
    // alert('this is coding1' + status)
    paymentStore.updateCheckStatus(id, status)
  }
}

// ----------
async function openImage(url: string) {
  if (!url) return
  viewerApi({
    images: [url],
    options: {
      toolbar: true,
      navbar: false,
      title: false,
      movable: true,
    },
  })
}
</script>
<template>
  <AdminLayouts>
    <div
      v-if="isOpen"
      class="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div
        class="p-4 bg-white dark:bg-slate-700 rounded-xl w-full max-w-md shadow-lg relative overflow-clip"
      >
        <!-- Block -->
        <button
          @click="isOpen = false"
          class="px-4 py-1 rounded-bl-lg border border-t-0 drop-shadow-2xl cursor-pointer border-warning bg-red-500 text-white hover:bg-red-600 absolute right-0 top-0"
        >
          <component :is="CloseIcon" />
        </button>

        <!-- message success check status form api -->
        <div v-if="paymentStore.isPoPMessage" class="flex flex-col justify-center items-center p-6">
          <div class="p-4 bg-green-500 dark:bg-green-700 rounded-full animate-bounce">
            <component :is="CheckIcon" class="w-10 h-10 text-white" />
          </div>
          <p class="text-green-600 font-medium mt-2 text-center font-Kantumruy">
            Data changed successful!
          </p>
          <p class="text-green-600 font-Kantumruy text-center">Please refresh page now</p>
        </div>
        <!-- End message success check status from api -->

        <div v-else class="flex flex-col justify-center items-center">
          <!-- Icon -->
          <div class="flex justify-center">
            <div
              class="flex items-center justify-center rounded-full"
              :class="isMessage === 'approved' ? 'text-green-600' : 'text-red-600'"
            >
              <!-- <span class="text-white text-3xl font-bold">!</span> -->
              <component :is="isMessage === 'approved' ? CheckIcon : CloseIcon" class="w-30 h-30" />
            </div>
          </div>

          <!-- Message -->
          <h1
            class="font-Kantumruy mt-4 text-center font-medium text-slate-600 dark:text-slate-200"
          >
            Do you want to <span class="font-semibold capitalize">{{ isMessage }}</span> this item?
          </h1>

          <!-- Actions -->
          <div class="w-full flex justify-center mt-6">
            <button
              @click="checkMessage(formStatus.id, formStatus.status)"
              class="px-6 w-1/3 py-2 text-white rounded-md font-Kantumruy"
              :class="
                formStatus.status === 'approved'
                  ? 'bg-green-600 hover:bg-green-500'
                  : 'bg-red-600 hover:bg-red-500'
              "
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- End Block Alert Select Status -->
    <div class="p-4">
      <!-- Add your admin home content here -->
      <div
        class="w-full p-6 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
      >
        <div
          class="w-full flex justify-between items-center max-md:flex-col max-md:items-start gap-2"
        >
          <div class="w-full">
            <div class="flex justify-start items-center">
              <h1
                @click="$router.push('/admin')"
                class="font-Kantumruy text-slate-500 cursor-pointer"
              >
                Dashboard
              </h1>
              <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
              <h1 class="font-Kantumruy text-blue-500">Payments List</h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>
          <!-- Block Button Pay  -->
          <div class="flex gap-2 text-nowrap">
            <!-- Block Pay manual -->
            <button
              @click="paymentStore.isShowPaymentManul = true"
              class="px-4 py-2 flex items-center gap-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 font-Kantumruy cursor-pointer"
            >
              <component :is="QrCodeIcon" />
              <span>Manual</span>
            </button>
            <!-- Block Pay By QR Code -->

            <!-- Block Pay By Bank -->
            <button
              @click="paymentStore.isShowPaymentPayway = true"
              class="px-4 py-2 flex items-center gap-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 font-Kantumruy cursor-pointer"
            >
              <component :is="QrCodeIcon" />
              <span>Pay Way</span>
            </button>
          </div>
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />
        <div class="w-full flex justify-between gap-2">
          <InputTextField v-model="paymentStore.search" placeholder="Search...">
            <template #prefix>
              <component :is="SearchIcon" />
            </template>
          </InputTextField>
        </div>
      </div>

      <!--  -->
      <div
        class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-slate-500 uppercase"
              >
                <td class="px-1 py-1 text-left dark:text-slate-300">ID</td>
                <td class="px-1 py-1.5 text-left dark:text-slate-300">Student</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Major(Y)</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Invoice</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Ammount</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Paid At</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Admin</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Reviewed At</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Status</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Actions</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in paymentStore.data?.data.data"
                :key="index"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-1 py-1 font-Kantumruy text-slate-500 dark:text-slate-300 uppercase">
                  {{ index + 1 }}
                </td>
                <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-left">
                  <div class="flex justify-start items-center gap-3">
                    <div
                      @click="
                        openImage(
                          item.user.profile_photo_url
                            ? item.user.profile_photo_url
                            : avatar.textToImage(item.user.user_name),
                        )
                      "
                      class="w-10 h-10 rounded-full"
                    >
                      <img
                        :src="
                          item.user.profile_photo_url
                            ? item.user.profile_photo_url
                            : avatar.textToImage(item.user.user_name)
                        "
                        alt="avatar"
                        class="w-10 h-10 rounded-full object-cover object-center outline-2 outline-offset-2 outline-blue-500 font-Kantumruy flex justify-center items-center"
                      />
                    </div>

                    <div class="leading-4">
                      <p class="font-Kantumruy font-medium">{{ item.user.user_name ?? 'N/A' }}</p>
                      <span class="text-xs font-poppins uppercase">{{
                        item.user.info?.id_card ?? 'Null'
                      }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">
                  <div class="flex justify-center items-center gap-0.5">
                    <p
                      class="font-Kantumruy rounded-full capitalize"
                      :class="!item.user.info?.major ? 'text-red-500' : ''"
                    >
                      {{ item.user.info?.major ?? 'N/A' }}
                    </p>
                    -
                    <p
                      class="font-Kantumruy rounded-full capitalize"
                      :class="!item.user.info?.year ? 'text-red-500' : ''"
                    >
                      {{ item.user.info?.year ?? 'N/A' }}
                    </p>
                  </div>
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">
                  <div class="flex justify-center items-center">
                    <p
                      v-if="!item.proof_image"
                      class="font-Kantumruy font-medium text-sm text-blue-600 rounded-full"
                    >
                      Null
                    </p>
                    <img
                      v-else
                      @click="openImage(item.image_url ?? NotDataSVGICON)"
                      class="w-10 h-10 rounded-full object-cover cursor-pointer"
                      :src="item.image_url"
                      alt=""
                    />
                  </div>
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">
                  <div class="flex justify-center items-center gap-1">
                    <!-- <component class="w-8 h-8 text-warning" :is="MoneyIconOutlien" /> -->

                    <span class="text-xl font-semibold font-Kantumruy text-red-500"
                      >{{ item.amount ?? 'N/A' }} {{ item.is_currency == 'khr' ? '៛' : '$' }}</span
                    >
                  </div>
                </td>
                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.created_at ? formatDate(item.created_at) : 'N/A' }}
                </td>
                <td
                  class="px-3 py-1.5 font-Kantumruy capitalize text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.approved_by ?? 'pending' }}
                </td>
                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.approved_at ? formatDate(item.approved_at) : 'N/A' }}
                </td>

                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  <span
                    class="px-2 py-1 border rounded-full text-xs capitalize font-poppins"
                    :class="
                      item.status == 'pending'
                        ? 'text-warning  bg-warning/10  border-warning'
                        : item.status == 'approved'
                          ? 'text-green-600  bg-green-500/10  border-green-500'
                          : ''
                    "
                    >{{ item.status ?? 'null' }}</span
                  >
                </td>

                <td class="py-1.5 text-center">
                  <!--  -->
                  <div class="flex justify-center items-center gap-2">
                    <button
                      title="View"
                      @click="
                        $router.push({
                          name: 'payments-detail',
                          params: { id: item.id },
                        })
                      "
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="ViewIcon" />
                    </button>
                    <!-- end button views -->

                    <!-- butoon status -->
                    <button
                      v-if="item.status !== 'approved'"
                      :disabled="item.status == 'approved'"
                      title="Approved"
                      @click="alert_messageg_check(item.id, 'approved')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                      :class="item.status == 'approved' ? 'opacity-20' : ''"
                    >
                      <component :is="CheckIcon" />
                    </button>

                    <button
                      v-if="item.status != 'approved'"
                      title="Rejected"
                      @click="alert_messageg_check(item.id, 'rejected')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CloseIcon" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--  -->
        <hr class="text-slate-300" />

        <!-- Block loading -->
        <div
          v-if="paymentStore.isLoadingPayment"
          class="w-full p-6 flex justify-center items-center"
        >
          <div class="w-10 h-10 flex justify-center items-center gap-1">
            <component :is="Loading" />
          </div>
        </div>
        <!-- End Block loading -->

        <!-- Block data empty -->
        <div
          v-if="!paymentStore.data?.data.data.length && !paymentStore.isLoadingPayment"
          class="w-full flex justify-center items-center p-4"
        >
          <NotData />
        </div>
        <!-- End Block data empty -->

        <!-- --------------- -->
        <!-- Pagination -->
        <div
          v-if="paymentStore.data?.data.data.length"
          class="w-full mt-4 flex justify-between items-center gap-3 max-md:flex-col"
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
                paymentStore.getUserNotPayments(
                  paymentStore.search,
                  paymentStore.per_page,
                  paymentStore.page,
                )
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
              :disabled="paymentStore.data.data.current_page <= 1"
              @click="
                paymentStore.getUserNotPayments(
                  paymentStore.search,
                  paymentStore.per_page,
                  paymentStore.data!.data.current_page - 1,
                )
              "
              :class="
                paymentStore.data.data.current_page <= 1
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
                :disabled="paymentStore.data.data.current_page == page"
                @click="
                  paymentStore.getUserNotPayments(
                    paymentStore.search,
                    paymentStore.per_page,
                    Number(page),
                  )
                "
                :class="
                  paymentStore.data?.data.current_page == page
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
              :disabled="paymentStore.data.data.current_page >= paymentStore.data.data.last_page"
              @click="
                paymentStore.getUserNotPayments(
                  paymentStore.search,
                  paymentStore.per_page,
                  paymentStore.data!.data.current_page + 1,
                )
              "
              :class="
                paymentStore.data.data.current_page >= paymentStore.data.data.last_page
                  ? 'text-blue-600 bg-slate-600/10 dark:bg-slate-600'
                  : ' bg-blue-600 text-white'
              "
              class="w-8 h-8 justify-center items-center flex rounded-full cursor-pointer hover:bg-slate-200"
            >
              <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
            </button>
          </div>
        </div>
      </div>

      <!--  -->
    </div>

    <!-- Block Content show invoice image -->
    <Transition name="bounce">
      <div
        v-if="isShowImageInvoice"
        @click="showInvoice('')"
        class="w-full fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/20 z-50 p-6"
      >
        <div
          class="w-1/3 max-md:w-full bg-white rounded-lg shadow-2xl overflow-clip animate-fadeIn"
          @click.stop
        >
          <div class="w-full flex justify-between items-center relative p-4">
            <h1 class="font-Kantumruy text-slate-600 uppercase font-medium text-lg">Invoice PNG</h1>
            <button
              @click="isShowImageInvoice = false"
              class="w-8 h-8 bg-red-500 text-white flex justify-center items-center rounded-full absolute right-3 cursor-pointer hover:bg-red-400"
            >
              <component :is="CloseIcon" />
            </button>
          </div>
          <hr class="text-slate-300" />
          <div class="p-4">
            <img
              class="w-full h-[82vh] object-center object-cover rounded-md"
              :src="preViewImage"
              alt=""
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Blocl component of payment form -->
    <div class="w-full" v-if="paymentStore.isShowPaymentManul">
      <PaymentManul @close="paymentStore.isShowPaymentManul = false" />
    </div>

    <!-- Blocl component of payment form -->
    <div class="w-full" v-if="paymentStore.isShowPaymentPayway">
      <PaymentPayway @close="paymentStore.isShowPaymentPayway = false" />
    </div>
  </AdminLayouts>
</template>
