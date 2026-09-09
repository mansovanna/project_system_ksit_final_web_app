<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'
import { useLeaveStore } from '@/stores/leave_store'

import { computed, onMounted, ref, watch } from 'vue'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'
import InputTextField from '@/widgets/InputTextField.vue'
import { api as viewerApi } from 'v-viewer'
import 'viewerjs/dist/viewer.css'

// --------------------------------------
const leaveStore = useLeaveStore()
const avata = useAvatar()
// ---------------------------------------
const isOpen = ref(false)
const isMessage = ref<string>('')
const formStatus = ref({
  id: 0,
  status: '',
})
const alert_messageg_check = (id: number | null, status: string | null) => {
  if (id != null || status != null) {
    formStatus.value.id = Number(id)
    formStatus.value.status = String(status)
    isMessage.value = status ?? ''
    isOpen.value = true
  } else {
    isOpen.value = !isOpen.value
  }
}

const handleSubmit = () => {
  if (formStatus.value.id && formStatus.value.status.length) {
    leaveStore.updateStatus(formStatus.value.id, formStatus.value.status)
  }
}

onMounted(() => {
  leaveStore.getLeaves()
})

// Block Pagination -------------------
const pages = computed(() => {
  const current = leaveStore.data?.data.current_page || 1
  const last = leaveStore.data?.data.last_page || 1

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
  () => leaveStore.search,
  (value) => {
    clearTimeout(time)

    time = setTimeout(() => {
      leaveStore.getLeaves(value, leaveStore.per_page, leaveStore.page)
    }, 500)
  },
)

// count day
const totalDay = (start: string, end: string) => {
  const start_date = new Date(start)
  const end_date = new Date(end)

  const diffTime = end_date.getTime() - start_date.getTime()
  const total = diffTime / (1000 * 60 * 60 * 24) + 1

  return total
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
    <!-- Block Alert Select status -->

    <div
      v-if="isOpen"
      class="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div
        class="p-4 bg-white dark:bg-slate-700 rounded-xl w-full max-w-md shadow-lg relative overflow-clip"
      >
        <!-- Block -->
        <button
          @click="((isOpen = false), (leaveStore.isLoadinAny.isMessage = false))"
          class="px-4 py-1 rounded-bl-lg border border-t-0 drop-shadow-2xl cursor-pointer border-warning bg-red-500 text-white hover:bg-red-600 absolute right-0 top-0"
        >
          <component :is="CloseIcon" />
        </button>

        <!-- message success check status form api -->
        <div
          v-if="leaveStore.isLoadinAny.isMessage"
          class="flex flex-col justify-center items-center p-6"
        >
          <div class="p-4 bg-green-500 dark:bg-green-700 rounded-full animate-bounce">
            <component :is="CheckIcon" class="w-10 h-10 text-white" />
          </div>
          <p class="text-green-600 font-poppins font-medium mt-2 text-center">
            Data changed successful!
          </p>
          <p class="text-green-600 font-poppins text-center">Please refresh page now</p>
        </div>
        <!-- End message success check status from api -->

        <div v-else class="flex flex-col justify-center items-center">
          <!-- Icon -->
          <div class="flex justify-center">
            <div
              class="flex items-center justify-center rounded-full"
              :class="isMessage === 'rejected' ? 'text-red-500' : 'text-green-500'"
            >
              <!-- <span class="text-white text-3xl font-bold">!</span> -->
              <component :is="InfoIcon" class="w-30 h-30" />
            </div>
          </div>

          <!-- Message -->
          <h1
            class="font-Kantumruy mt-4 text-center font-medium text-slate-600 dark:text-slate-200"
          >
            Do you want to <span class="font-semibold capitalize">{{ isMessage }}</span> this item?
          </h1>

          <!-- Actions -->
          <div class="flex justify-center mt-6 w-full">
            <button
              :disabled="leaveStore.isLoadinAny.isLoading"
              @click="handleSubmit()"
              class="px-6 w-1/3 py-2 text-white rounded-md font-Kantumruy"
              :class="
                isMessage === 'rejected'
                  ? 'bg-red-600 hover:bg-red-500'
                  : 'bg-green-600 hover:bg-green-500'
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
      <!--  -->
      <div
        class="bg-white rounded-xl p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="flex">
          <div class="flex justify-start items-center w-full">
            <h1 class="font-Kantumruy text-slate-500">Dashboard</h1>
            <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
            <h1 class="font-Kantumruy text-blue-500">All List Leave Request</h1>
          </div>
          <div class="flex w-1/2">
            <!--  -->
            <InputTextField v-model="leaveStore.search" type="text" placeholder="Search...">
              <template #suffix>
                <component :is="SearchIcon" class="w-7 h-7 text-slate-500" />
              </template>
            </InputTextField>
          </div>
        </div>
        <hr class="w-full text-slate-300 dark:text-slate-500 my-3" />
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-slate-500 uppercase"
              >
                <td class="px-1 py-2 text-left dark:text-slate-300">ID</td>
                <td class="px-1 py-2 text-center dark:text-slate-300">Image</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Name</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Phone</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Parent</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Level</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Major</td>
                <td class="px-2 py-2 text-center dark:text-slate-300">Year</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Days</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Start Date</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">End Date</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Reason</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Status</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Actions</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in leaveStore.data?.data.data"
                :key="index"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-1 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ index + 1 }}
                </td>
                <td class="px-1 py-2 flex flex-start items-center">
                  <div
                    class="w-10 h-10 rounded-full"
                    @click="
                      openImage(
                        item.user.profile_photo_url
                          ? item.user.profile_photo_url
                          : avata.textToImage(item.user.user_name),
                      )
                    "
                  >
                    <img
                      :src="
                        item.user.profile_photo_url
                          ? item.user.profile_photo_url
                          : avata.textToImage(item.user.user_name)
                      "
                      alt="avatar"
                      class="w-10 h-10 rounded-full object-cover object-center outline-2 outline-offset-2 outline-blue-500 font-Kantumruy flex justify-center items-center"
                    />
                  </div>
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  <div>
                    <p class="font-Kantumruy">{{ item.user.user_name ?? 'N/A' }}</p>
                    <p class="font-poppins text-xs uppercase">
                      {{ item.user.info?.id_card ?? 'N/A' }}
                    </p>
                  </div>
                </td>

                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  <!--  -->
                  {{ item.user.phone_number ?? 'N/A' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.user.info?.phone_parent ?? 'N/A' }}
                </td>

                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.user.info?.level ?? 'N/A' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 capitalize dark:text-slate-300">
                  {{ item.user.info?.major ?? 'N/A' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.user.info?.year ?? 'N/A' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ totalDay(item.start_date, item.end_date) ?? 'N/A' }}
                </td>

                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.start_date ?? 'N/A' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.end_date ?? 'N/A' }}
                </td>

                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300 w-full">
                  <span class="line-clamp-1 text-wrap font-Kantumruy">
                    {{ item.reason ?? 'N/A' }}</span
                  >
                </td>

                <td class="px-3 py-2 text-center">
                  <!--  -->
                  <div
                    class="border rounded-full px-2 py-1"
                    :class="
                      item.status == 'pending'
                        ? 'border-warning bg-warning/10'
                        : item.status == 'approved'
                          ? 'border-green-600 bg-green-600/10'
                          : 'border-red-600 bg-red-600/10'
                    "
                  >
                    <p
                      class="text-xs font-poppins capitalize"
                      :class="
                        item.status == 'pending'
                          ? 'text-warning '
                          : item.status == 'approved'
                            ? 'text-green-600'
                            : 'text-red-600'
                      "
                    >
                      {{ item.status ?? 'N/A' }}
                    </p>
                  </div>
                </td>

                <td class="py-2 text-center">
                  <!--  -->
                  <div class="flex gap-2">
                    <button
                      title="View Users"
                      @click="$router.push({ name: 'leaves-detail', params: { id: item.id } })"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="ViewIcon" />
                    </button>

                    <button
                      @click="alert_messageg_check(Number(item.id), 'rejected')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CloseIcon" />
                    </button>
                    <button
                      @click="alert_messageg_check(Number(item.id), 'approved')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CheckIcon" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-if="leaveStore.isLoading" class="w-full flex justify-center items-center p-4">
          <div class="w-12 h-12">
            <Loading />
          </div>
        </div>
        <!-- End loading -->
        <!-- Block data empty -->

        <div
          v-if="!leaveStore.data?.data.data.length && !leaveStore.isLoading"
          class="w-full flex justify-center items-center p-4"
        >
          <NotData />
        </div>
        <!-- End Block data empty -->

        <!--  -->
        <hr class="text-slate-300" />
        <!-- Pagination Block code control -->
        <div
          v-if="leaveStore.data?.data.data.length"
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
                leaveStore.getLeaves(leaveStore.search, leaveStore.per_page, leaveStore.page)
              "
            >
              <input
                type="number"
                v-model="leaveStore.per_page"
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
              :disabled="leaveStore.data.data.current_page <= 1"
              @click="
                leaveStore.getLeaves(
                  leaveStore.search,
                  leaveStore.per_page,
                  leaveStore.data!.data.current_page - 1,
                )
              "
              :class="
                leaveStore.data.data.current_page <= 1
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
                :disabled="leaveStore.data.data.current_page == page"
                @click="leaveStore.getLeaves(leaveStore.search, leaveStore.per_page, Number(page))"
                :class="
                  leaveStore.data?.data.current_page == page
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
              :disabled="leaveStore.data.data.current_page >= leaveStore.data.data.last_page"
              @click="
                leaveStore.getLeaves(
                  leaveStore.search,
                  leaveStore.per_page,
                  leaveStore.data!.data.current_page + 1,
                )
              "
              :class="
                leaveStore.data.data.current_page >= leaveStore.data.data.last_page
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
  </AdminLayouts>
</template>
