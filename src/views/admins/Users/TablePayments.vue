<script setup lang="ts">
import { SearchIcon, ArrowSmallUpIcon, CloseIcon } from '@/stores/Icons'
import { usePaymentStore } from '@/stores/payment_store'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const paymentStore = usePaymentStore()

const isShowImageInvoice = ref(false)

const previewImage = ref('')

const showInvoice = (url: string) => {
  isShowImageInvoice.value = !isShowImageInvoice.value
  previewImage.value = url
}
const route = useRoute()
//

let timer: ReturnType<typeof setTimeout>
watch([() => paymentStore.search, () => paymentStore.page], ([search]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    paymentStore.getUserPayments({
      user_id: Number(route.params.id),
      search,
      per_page: paymentStore.per_page,
      page: paymentStore.page,
    })
  }, 500)
})

// Block Pagination -------------------
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

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

onMounted(() => {
  if (route.params.id) {
    paymentStore.getUserPayments({
      user_id: Number(route.params.id),
      search: paymentStore.search,
      per_page: paymentStore.per_page,
      page: paymentStore.page,
    })
  }
})
</script>

<template>
  <!-- Block Content show invoice image -->
  <div
    v-if="isShowImageInvoice && previewImage"
    @click="showInvoice('')"
    class="w-full h-screen fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/20 z-50"
  >
    <div class="w-1/3 bg-white rounded-lg shadow-2xl overflow-clip animate-fadeIn" @click.stop>
      <div class="w-full flex justify-between items-center relative p-4">
        <h1 class="font-Kantumruy text-slate-600 uppercase font-medium text-lg">Invoice PNG</h1>
        <button
          @click="showInvoice('')"
          class="w-8 h-8 bg-red-500 text-white flex justify-center items-center rounded-full absolute right-3 cursor-pointer hover:bg-red-400"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <hr class="text-slate-300" />
      <div class="p-4">
        <img
          class="w-full h-[700px] object-center object-cover rounded-md"
          :src="previewImage"
          alt="NOT FOUND"
        />
      </div>
    </div>
  </div>
  <!-- End Block Content show invoice image -->

  <!-- End Block Alert popup  -->
  <div
    class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
  >
    <div class="w-full flex justify-between items-center">
      <h1 class="font-Kantumruy font-medium text-slate-500">History Payments</h1>
      <div>
        <div class="w-full relative">
          <input
            type="text"
            v-model="paymentStore.search"
            class="border pl-4 pr-10 py-2 rounded-md border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
            placeholder="Search..."
          />
          <!-- icon -->
          <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
            <component :is="SearchIcon" class="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
    <div class="w-full overflow-x-auto mt-4">
      <table class="w-full">
        <thead>
          <tr
            class="w-full bg-slate-100 dark:bg-slate-500 font-Kantumruy text-nowrap text-slate-500 uppercase"
          >
            <td class="px-3 py-2 text-left">Invoice</td>
            <td class="px-3 py-2 text-left">Ammount</td>
            <td class="px-3 py-2 text-left">Paid At</td>
            <td class="px-3 py-2 text-left">Admin</td>
            <td class="px-3 py-2 text-left">Reviewed At</td>
            <td class="px-3 py-2 text-center">Status</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paymentStore.data?.data.data"
            :key="index"
            class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
          >
            <td class="px-3 py-2 font-Kantumruy text-slate-500">
              <img
                v-if="item.image_url"
                @click="showInvoice(item.image_url)"
                class="w-10 h-10 rounded-full object-cover cursor-pointer"
                :src="item.image_url"
                alt=""
              />
            </td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500">
              {{ item.amount ?? 'Null' }} {{ item.is_currency == 'kmr' ? 'Khr' : 'USD' }}
            </td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500">
              {{ formatDateTime(item.created_at) }}
            </td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500 text-left capitalize">
              {{ item.approved_by ?? 'Null' }}
            </td>
            <td class="px-3 py-2 font-Kantumruy text-slate-500">
              {{ formatDateTime(item.approved_at) ?? 'Null' }}
            </td>

            <td class="px-3 py-2 text-center">
              <!--  -->
              <div class="flex justify-center">
                <div
                  class="border border-green-100 rounded-full px-3 py-2 bg-green-600 capitalize font-medium"
                >
                  <p class="text-xs text-white font-Kantumruy">{{ item.status }}</p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--  -->
    <hr class="text-slate-300" />

    <!-- Block loading -->
    <div v-if="paymentStore.isLoadingPayment" class="w-full p-6 flex justify-center items-center">
      <div class="w-10 h-10 flex justify-center items-center gap-1">
        <component :is="Loading" />
      </div>
    </div>
    <!-- End Block loading -->

    <!-- Block data empty -->
    <div
      v-else-if="paymentStore.data?.data.data.length == 0 && !paymentStore.isLoadingPayment"
      class="w-full flex justify-center items-center p-4"
    >
      <not-data />
    </div>
    <!-- End Block data empty -->

    <!-- pagination -->
    <!-- Pagination Block code control -->
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
            paymentStore.getUserPayments({
              user_id: Number(route.params.id),
              search: paymentStore.search,
              per_page: paymentStore.per_page,
              page: paymentStore.page,
            })
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
          :disabled="paymentStore.data?.data.current_page <= 1"
          @click="
            paymentStore.getUserPayments({
              user_id: Number(route.params.id),
              search: paymentStore.search,
              per_page: paymentStore.per_page,
              page: paymentStore.data?.data.current_page - 1,
            })
          "
          :class="
            paymentStore.data?.data.current_page <= 1
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
            :disabled="paymentStore.data?.data.current_page == page"
            @click="
              paymentStore.getUserPayments({
                user_id: Number(route.params.id),
                search: paymentStore.search,
                per_page: paymentStore.per_page,
                page: Number(page),
              })
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
          :disabled="paymentStore.data?.data.current_page >= paymentStore.data?.data.last_page"
          @click="
            paymentStore.getUserPayments({
              user_id: Number(route.params.id),
              search: paymentStore.search,
              per_page: paymentStore.per_page,
              page: paymentStore.data?.data.current_page + 1,
            })
          "
          :class="
            paymentStore.data?.data.current_page >= paymentStore.data?.data.last_page
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
</template>

<style scoped>
/* .v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
} */

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
