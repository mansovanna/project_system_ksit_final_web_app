<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import { useStaffStoreStudent } from '@/stores/staff_store_student'
import { computed, onMounted, watch } from 'vue'
import Loading from '@/widgets/Loading.vue'
import { ArrowSmallUpIcon } from '@/stores/Icons'
import NotData from '@/widgets/NotData.vue'
import UserFillIcon from '@/assets/icons/UserFillIcon.vue'

const avatar = useAvatar()

const staffStore = useStaffStoreStudent()

let timer: ReturnType<typeof setTimeout>
watch(
  () => staffStore.per_page,
  (per_page) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      staffStore.getStaffStoreStaffList(per_page, staffStore.page)
    }, 500)
  },
)

onMounted(() => {
  staffStore.getStaffStoreStaffList()
})

// Block Pagination -------------------
const pages = computed(() => {
  const current = staffStore.data?.data.current_page || 1
  const last = staffStore.data?.data.last_page || 1

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
</script>

<template>
  <StudentLayouts>
    <div
      class="px-4 py-3 flex flex-col gap-4 max-md:flex-col justify-start items-start w-full max-md:pb-20"
    >
      <div
        v-if="staffStore.data?.data.data"
        class="w-full grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-2xl:grid-cols-3 max-md:grid-cols-1"
      >
        <div
          v-for="(staff, index) in staffStore.data?.data.data"
          :key="index"
          class="min-w-[23%] max-md:w-full text-sm text-gray-500 bg-white dark:bg-slate-800 border border-gray-500/30 rounded divide-y divide-gray-500/30"
        >
          <!-- Profile -->
          <div class="flex flex-row items-center p-4">
            <img
              v-if="staff.profile_photo_url"
              class="h-24 w-24 rounded-full object-cover border-2 border-green-600 outline-2 outline-white ring-4 ring-green-700"
              :src="staff.profile_photo_url"
              :alt="staff.user_name"
            />
            <img
              v-else
              class="h-24 w-24 rounded-full object-cover"
              :src="avatar.textToImage(staff.user_name) ?? ''"
              :alt="staff.user_name"
            />
            <div class="flex flex-col gap-2 justify-center items-start px-4">
              <h2
                class="text-lg text-gray-800 dark:text-white font-Kantumruy text-center capitalize font-medium"
              >
                {{ staff.user_name ?? 'Null' }}
              </h2>
              <!-- <p class="text-center font-poppins">{{ staff.role ?? 'N/A' }}</p> -->

              <span
                class="px-2.5 py-1 text-xs flex justify-end items-center gap-1 text-green-600 bg-green-500/20 border border-green-500/30 rounded-full"
              >
                <div class="w-4 h-4 flex justify-center items-center">
                  <component class="w-4 h-4" :is="UserFillIcon" />
                </div>
                <p class="font-Kantumruy font-medium">
                  {{ staff.bio ?? 'N/A' }}
                </p>
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="w-full flex divide-y flex-col justify-start divide-gray-500/30">
            <!-- Email -->
            <a
              :href="`mailto:${'email'}`"
              class="w-full py-3 flex items-center justify-left gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition px-4"
              :title="'email'"
            >
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 2.5c0-.825-.675-1.5-1.5-1.5H3c-.825 0-1.5.675-1.5 1.5m15 0v9c0 .825-.675 1.5-1.5 1.5H3c-.825 0-1.5-.675-1.5-1.5v-9m15 0L9 7.75 1.5 2.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ staff.email ?? 'N/A' }}</span>
            </a>

            <!-- Call -->
            <a
              :href="`tel:${staff.phone_number.replace(/\s/g, '')}`"
              class="w-full py-3 flex items-center justify-left gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition px-4"
              :title="staff.phone_number"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.29 3.75a3.75 3.75 0 0 1 2.962 2.963M11.289.75a6.75 6.75 0 0 1 5.963 5.955m-.75 5.985v2.25a1.5 1.5 0 0 1-1.635 1.5 14.84 14.84 0 0 1-6.472-2.303 14.6 14.6 0 0 1-4.5-4.5 14.84 14.84 0 0 1-2.303-6.502A1.5 1.5 0 0 1 3.085 1.5h2.25a1.5 1.5 0 0 1 1.5 1.29 9.6 9.6 0 0 0 .525 2.108 1.5 1.5 0 0 1-.338 1.582l-.952.952a12 12 0 0 0 4.5 4.5l.952-.952a1.5 1.5 0 0 1 1.582-.338c.681.254 1.388.43 2.108.526a1.5 1.5 0 0 1 1.29 1.522"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ staff.phone_number ?? 'N/A' }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Block loading -->
      <div v-if="staffStore.isLoading" class="w-full p-6 flex justify-center items-center">
        <div class="w-10 h-10 flex justify-center items-center gap-1">
          <component :is="Loading" />
        </div>
      </div>
      <!-- End Block loading -->

      <!-- Block data empty -->

      <div
        v-if="!staffStore.data?.data.data.length && !staffStore.isLoading"
        class="w-full flex justify-center items-center p-4"
      >
        <NotData />
      </div>
      <!-- End Block data empty -->

      <!-- PAGINATION -->
      <div
        v-if="staffStore.data?.data.data.length"
        class="w-full flex justify-between items-center gap-4 max-md:flex-col"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <!-- Text -->
          <p class="text-sm text-slate-600 font-Kantumruy">
            បង្ហាញ
            <span class="font-semibold text-slate-800">
              {{ staffStore.data?.data.from }}
            </span>
            -
            <span class="font-semibold text-slate-800">
              {{ staffStore.data?.data.to }}
            </span>
            នៃ
            <span class="font-semibold text-green-600">
              {{ staffStore.data?.data.total }}
            </span>
          </p>

          <!-- Input per page -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-slate-500 font-Kantumruy"> ចំនួន/ទំព័រ </label>

            <input
              type="number"
              min="1"
              v-model="staffStore.per_page"
              class="w-16 text-center px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition duration-200"
            />
          </div>
        </div>

        <div class="flex justify-center items-center gap-2">
          <!-- Prev -->

          <button
            :disabled="staffStore.data?.data.current_page <= 1"
            @click="
              staffStore.getStaffStoreStaffList(
                staffStore.per_page,
                staffStore.data?.data.current_page - 1,
              )
            "
            :class="
              staffStore.data?.data.current_page <= 1
                ? 'text-green-600 bg-slate-600/10 dark:bg-slate-600'
                : ' bg-green-600 text-white'
            "
            class="w-8 h-8 justify-center font-Kantumruy disabled:opacity-50 disabled:cursor-not-allowed items-center flex rounded-full cursor-pointer hover:bg-slate-200"
          >
            <component class="-rotate-90" :is="ArrowSmallUpIcon"></component>
          </button>

          <!-- Pages -->
          <template v-for="(page, index) in pages" :key="index">
            <!-- number -->

            <button
              v-if="page !== '...'"
              :disabled="staffStore.data?.data.current_page == page"
              @click="staffStore.getStaffStoreStaffList(staffStore.per_page, Number(page))"
              :class="
                staffStore.data?.data.current_page == page
                  ? 'bg-green-600  text-white'
                  : ' bg-slate-200 dark:bg-slate-600 text-green-600 dark:text-white'
              "
              class="w-8 h-8 justify-center items-center flex rounded-full hover:bg-blue-400 hover:text-white cursor-pointer"
            >
              <p class="font-Kantumruy font-medium">{{ page }}</p>
            </button>

            <!-- dots -->
            <span v-else class="px-2 text-slate-400">...</span>
          </template>

          <button
            :disabled="staffStore.data?.data.current_page >= staffStore.data?.data.last_page"
            @click="
              staffStore.getStaffStoreStaffList(
                staffStore.per_page,
                staffStore.data?.data.current_page + 1,
              )
            "
            :class="
              staffStore.data?.data.current_page >= staffStore.data?.data.last_page
                ? 'text-green-600 bg-slate-600/10 dark:bg-slate-600'
                : ' bg-green-600 text-white'
            "
            class="w-8 h-8 justify-center disabled:opacity-50 disabled:cursor-not-allowed items-center flex rounded-full cursor-pointer hover:bg-slate-200"
          >
            <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
          </button>
        </div>
      </div>

      <!-- -------------------------------------- -->
      <!-- End PAGINATION -->
    </div>
  </StudentLayouts>
</template>
