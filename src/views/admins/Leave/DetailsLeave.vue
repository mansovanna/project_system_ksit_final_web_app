<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import Loading from '@/widgets/Loading.vue'
import {
  ArrowBackIcon,
  ArrowSmallUpIcon,
  CallIcon,
  CheckIcon,
  ClassIcon,
  ClockIcon,
  CloseIcon,
  DateIcon,
  EmailIcon,
  LocationIcon,
  SchoolIcon,
  UserFillIcon,
} from '@/stores/Icons'
import { useLeaveStore } from '@/stores/leave_store'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const avatar = useAvatar()

const leaveStore = useLeaveStore()
const route = useRoute()
onMounted(() => {
  leaveStore.getLeaveById(Number(route.params.id))
})

// function
const calculateTotalDays = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 0

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < start) return 0

  const diffTime = end.getTime() - start.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return diffDays + 1
}

// computed
const totalDays = computed(() => {
  if (!leaveStore.data_by_id) return 0
  return calculateTotalDays(
    leaveStore.data_by_id.data.start_date,
    leaveStore.data_by_id.data.end_date,
  )
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  })
}

// handle button
const isOpenConfirm = ref(false)
const isConfirm = ref({
  id: 0,
  status: 'approved',
})
const handleAccept = (id: number, status: string) => {
  isOpenConfirm.value = true
  isConfirm.value.id = id
  isConfirm.value.status = status
}

const submit = () => {
  if (isConfirm.value.id && isConfirm.value.status) {
    leaveStore.updateStatus(isConfirm.value.id, isConfirm.value.status)
    isOpenConfirm.value = false
  }
}
</script>
<template>
  <!-- Block popup alert confirm -->
  <div
    v-if="isOpenConfirm"
    class="w-full h-screen fixed top-0 bottom-0 bg-black/40 z-50 flex justify-center items-center p-6"
    @click="isOpenConfirm = false"
  >
    <div
      class="max-w-99 bg-white shadow rounded-xl p-6 border border-slate-300 flex flex-col gap-2"
      @click.stop
    >
      <!-- Block Icon -->
      <div class="w-full flex justify-center items-center">
        <div
          class="flex justify-center items-center p-6 border rounded-full"
          :class="
            isConfirm.status === 'approved'
              ? 'bg-green-500/20 text-green-600 border-green-500'
              : 'bg-red-500/20 text-red-600 border-red-500'
          "
        >
          <component :is="isConfirm.status === 'approved' ? CheckIcon : CloseIcon" />
        </div>
      </div>
      <!-- end Block Icon -->

      <!-- Block Title -->
      <h1 class="text-xl font-poppins text-center mt-4">Confirm approval</h1>
      <p
        v-if="isConfirm.status === 'approve'"
        class="text-center text-slate-500 font-poppins text-sm"
      >
        Are you sure you want to approve this leave request? The student will be notified
        immediately.
      </p>
      <p v-else class="text-center text-slate-500 font-poppins text-sm">
        Are you sure you want to approve this leave request? The student will be notified
        immediately.
      </p>
      <!-- Are you sure you want to reject this leave request? This action cannot be undone. -->
      <div class="p-4 bg-slate-200 rounded-md mt-2 flex flex-col gap-2">
        <!-- Block name -->
        <div class="w-full flex justify-between items-center">
          <p class="text-sm font-poppins text-slate-500 capitalize">Student Name</p>
          <p class="font-poppins text-sm">
            {{ leaveStore.data_by_id?.data.user.user_name ?? 'N/A' }}
          </p>
        </div>
        <!-- End Block name -->

        <!-- Block Duration -->
        <div class="w-full flex justify-between items-center">
          <p class="text-sm font-poppins text-slate-500 capitalize">Duration</p>

          <p class="font-poppins text-sm">
            {{ formatDate(String(leaveStore.data_by_id?.data.start_date)) }} -
            {{ formatDate(String(leaveStore.data_by_id?.data.end_date)) }}
            <span> ({{ totalDays != null ? totalDays + ' days' : 'N/A' }}) </span>
          </p>
        </div>
        <!-- End Block Duration -->

        <!-- Block Current Status -->
        <div class="w-full flex justify-between items-center">
          <p class="text-sm font-poppins text-slate-500 capitalize">Current Status</p>
          <p
            class="font-poppins text-sm capitalize px-2 py-0.5 rounded-full"
            :class="{
              'text-green-600 bg-green-500/20': leaveStore.data_by_id?.data.status === 'approved',
              'text-red-600 bg-red-500/20': leaveStore.data_by_id?.data.status === 'rejected',
              'text-yellow-600 bg-yellow-500/20': leaveStore.data_by_id?.data.status === 'pending',
            }"
          >
            {{ leaveStore.data_by_id?.data.status ?? 'N/A' }}
          </p>
        </div>
        <!-- End Block Current Status -->

        <!-- Block new Status -->
        <div class="w-full flex justify-between items-center">
          <p class="text-sm font-poppins text-slate-500 capitalize">New Status</p>
          <p
            class="font-poppins text-sm capitalize px-2 py-0.5 rounded-full text-white"
            :class="isConfirm.status == 'approved' ? 'bg-green-600' : 'bg-red-500'"
          >
            {{ isConfirm.status ?? 'N/A' }}
          </p>
        </div>
        <!-- End Block new Status -->
      </div>
      <!-- Button Approve or recject -->
      <button
        @click="submit"
        class="flex justify-center items-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 cursor-pointer font-poppins rounded-full mt-6 text-white"
      >
        <component :is="isConfirm.status === 'approved' ? CheckIcon : CloseIcon" />
        <span>{{ isConfirm.status === 'approved' ? 'Approve' : 'Reject' }}</span>
      </button>
      <!-- End Block button Approved -->
      <!-- Block Button cancel -->
      <button
        @click="isOpenConfirm = false"
        class="flex justify-center items-center gap-2 py-3 hover:bg-red-500 hover:text-white text-red-500 border border-red-500 cursor-pointer font-poppins rounded-full mt-2"
      >
        <!-- <component :is="CheckIcon" /> -->
        <span>Cancel</span>
      </button>
      <!-- End Button Cancel -->
    </div>
    <!-- <component :is="ConfirmAlert" /> -->
  </div>
  <!-- Block Conent of leave details -->
  <AdminLayouts>
    <!--  -->
    <div class="p-4 relative">
      <!-- Block Loading -->
      <div
        v-if="leaveStore.isLoadinAny.isLoading"
        class="absolute inset-0 z-50 flex justify-center items-center bg-black/30"
      >
        <div class="flex items-center gap-2 w-10 h-10">
          <Loading />
        </div>
      </div>
      <!-- End Block Loading -->
      <div
        class="w-full p-6 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
      >
        <div class="w-full flex justify-between items-center">
          <div>
            <div class="flex justify-start items-center">
              <h1
                @click="$router.push('/admin')"
                class="font-Kantumruy text-slate-500 cursor-pointer"
              >
                Dashboard
              </h1>
              <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
              <h1 class="font-Kantumruy text-blue-500 capitalize">{{ $route.name }}</h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>
          <!-- <p>Report</p> -->

          <button
            @click="$router.back()"
            class="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-400 font-poppins font-medium flex justify-center items-center gap-2"
          >
            <div>
              <component :is="ArrowBackIcon" class="text-white" />
            </div>
            <span>Back</span>
          </button>
        </div>
        <hr class="text-slate-300 dark:text-slate-600 mt-6" />
        <!-- ------------------ -->
        <!-- Block Details Info -->
        <div v-if="leaveStore.data_by_id" class="flex max-md:flex-col">
          <!-- Block Detail About student -->
          <div class="pt-6 pr-6 w-90 max-md:w-full max-md:justify-center">
            <div class="flex flex-col justify-center items-center">
              <img
                :src="
                  leaveStore.data_by_id?.data.user.profile_photo_url === null ||
                  leaveStore.data_by_id?.data.user.profile_photo_url === ''
                    ? avatar.textToImage(leaveStore.data_by_id?.data.user.user_name ?? 'User')
                    : leaveStore.data_by_id?.data.user.profile_photo_url
                "
                :alt="leaveStore.data_by_id?.data.user.user_name"
                class="w-40 h-40 rounded-full border-3 border-blue-600 dark:border-slate-200 object-cover"
              />
              <p class="mt-2 font-Kantumruy text-2xl text-center text-slate-500">
                {{ leaveStore.data_by_id?.data.user.first_name ?? 'N/A' }}
                {{ leaveStore.data_by_id?.data.user.last_name ?? 'N/A' }}
              </p>
              <div class="flex justify-center items-center gap-1 uppercase font-medium">
                <p class="mt-2 font-Kantumruy text-center text-slate-500">ID:</p>
                <p class="mt-2 font-Kantumruy text-center text-slate-500">
                  {{ leaveStore.data_by_id?.data.user.info?.id_card ?? 'N/A' }}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-4 mt-4">
              <hr class="text-slate-400" />
              <!-- Block User name -->
              <div class="">
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-500" :is="UserFillIcon" />
                  <p class="uppercase font-Kantumruy text-slate-500 font-medium">username</p>
                </div>
                <p class="ml-8 font-Kantumruy font-medium">
                  {{ leaveStore.data_by_id?.data.user.user_name ?? 'N/A' }}
                </p>
              </div>
              <!-- End Block username -->

              <!-- Block Email -->
              <div class="">
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-500" :is="EmailIcon" />
                  <p class="uppercase font-Kantumruy text-slate-500 font-medium">email</p>
                </div>
                <p
                  class="ml-8 font-Kantumruy font-medium"
                  :class="leaveStore.data_by_id?.data.user.email != null ? '' : 'text-red-500'"
                >
                  {{ leaveStore.data_by_id?.data.user.email ?? 'N/A' }}
                </p>
              </div>
              <!-- End Block Emdil -->

              <!-- Block Phone Number -->
              <div class="">
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-500" :is="CallIcon" />
                  <p class="uppercase font-Kantumruy text-slate-500 font-medium">Phone Number</p>
                </div>
                <p
                  class="ml-8 font-Kantumruy font-medium"
                  :class="
                    leaveStore.data_by_id?.data.user.phone_number != null ? '' : 'text-red-500'
                  "
                >
                  {{ leaveStore.data_by_id?.data.user.phone_number ?? 'N/A' }}
                </p>
              </div>
              <!-- End Block Phone Number -->

              <!-- Block Phone Number Parent -->
              <div class="">
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-500" :is="CallIcon" />
                  <p class="uppercase font-Kantumruy text-slate-500 font-medium">Phone Number</p>
                </div>
                <p
                  class="ml-8 font-Kantumruy font-medium"
                  :class="
                    leaveStore.data_by_id?.data.user.info?.phone_parent != null
                      ? ''
                      : 'text-red-500'
                  "
                >
                  {{ leaveStore.data_by_id?.data.user.info?.phone_parent ?? 'N/A' }}
                </p>
              </div>
              <!-- End Block Phone Number Parent -->

              <!-- Block Address -->

              <div class="">
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-500" :is="LocationIcon" />
                  <p class="uppercase font-Kantumruy text-slate-500 font-medium">Address</p>
                </div>
                <p
                  class="ml-8 font-Kantumruy font-medium"
                  :class="
                    leaveStore.data_by_id?.data.user.info?.address != null ? '' : 'text-red-500'
                  "
                >
                  {{ leaveStore.data_by_id?.data.user.info?.address ?? 'N/A' }}
                </p>
              </div>

              <!-- End Block Address -->

              <!-- Block Major -->
              <div class="">
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-500" :is="SchoolIcon" />
                  <p class="uppercase font-Kantumruy text-slate-500 font-medium">Major</p>
                </div>
                <p
                  class="ml-8 font-Kantumruy font-medium capitalize"
                  :class="
                    leaveStore.data_by_id?.data.user.info?.major != null ? '' : 'text-red-500'
                  "
                >
                  {{ leaveStore.data_by_id?.data.user.info?.major ?? 'N/A' }}
                </p>
              </div>
              <!-- End Block Major -->

              <!-- Block Year -->
              <div class="">
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-500" :is="ClassIcon" />
                  <p class="uppercase font-Kantumruy text-slate-500 font-medium">Year / Level</p>
                </div>
                <div class="flex justify-start items-center gap-1">
                  <p
                    class="ml-8 font-Kantumruy font-medium capitalize"
                    :class="
                      leaveStore.data_by_id?.data.user.info?.year != null ? '' : 'text-red-500'
                    "
                  >
                    {{ leaveStore.data_by_id?.data.user.info?.year ?? 'N/A' }}
                  </p>
                  —
                  <p
                    class="ml-8 font-Kantumruy font-medium capitalize"
                    :class="leaveStore.data_by_id?.data.user.info?.level ?? 'text-red-500'"
                  >
                    {{ leaveStore.data_by_id?.data.user.info?.level ?? 'N/A' }}
                  </p>
                </div>
              </div>
              <!-- End Block Year -->

              <!-- Block Gender -->
              <div class="">
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-500" :is="UserFillIcon" />
                  <p class="uppercase font-Kantumruy text-slate-500 font-medium">Gender</p>
                </div>
                <p
                  class="ml-8 font-Kantumruy font-medium capitalize"
                  :class="leaveStore.data_by_id?.data.user.gender != null ? '' : 'text-red-500'"
                >
                  {{ leaveStore.data_by_id?.data.user.gender ?? 'N/A' }}
                </p>
              </div>
              <!-- End Block Level -->
            </div>
          </div>

          <!-- End Block Detail About student -->

          <!-- Block Detail Leave Request -->
          <hr class="text-slate-300 my-3 hidden max-md:block" />
          <div
            class="max-md:w-full border-l max-md:border-none max-md:p-0 border-slate-300 dark:border-slate-600 p-4 flex flex-col gap-4"
          >
            <h1 class="font-Kantumruy font-medium text-slate-500 uppercase">Leave period</h1>

            <!-- End Block Date -->
            <div class="flex flex-wrap justify-start items-center gap-4">
              <!-- Block Start Date -->
              <div
                class="min-w-50 p-4 bg-linear-to-r/srgb from-blue-700 to-blue-500 rounded-xl shadow"
              >
                <!-- Block Icon and title -->
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-100" :is="DateIcon" />
                  <p class="uppercase font-Kantumruy text-slate-200 font-medium">Start Date</p>
                </div>
                <p
                  class="font-Kantumruy font-medium mt-2 text-center text-lg text-nowrap text-white"
                  :class="leaveStore.data_by_id?.data.start_date != null ? '' : 'text-red-500'"
                >
                  {{ leaveStore.data_by_id?.data.start_date ?? 'N/A' }}
                </p>
              </div>
              <!-- End Block Start Date -->

              <!-- Block End Date -->
              <div
                class="min-w-50 p-4 bg-linear-to-r/srgb from-red-700 to-red-500 rounded-xl shadow"
              >
                <!-- Block Icon and title -->
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-100" :is="DateIcon" />
                  <p class="uppercase font-Kantumruy text-slate-200 font-medium">End Date</p>
                </div>
                <p
                  class="font-Kantumruy font-medium mt-2 text-center text-lg text-nowrap text-white"
                  :class="leaveStore.data_by_id?.data.end_date != null ? '' : 'text-red-500'"
                >
                  {{ leaveStore.data_by_id?.data.end_date ?? 'N/A' }}
                </p>
              </div>
              <!-- End Block End Date -->

              <!-- Block Total Leave -->
              <div
                class="min-w-50 p-4 bg-linear-to-r/srgb from-green-800 to-green-600 rounded-xl shadow"
              >
                <!-- Block Icon and title -->
                <div class="flex gap-2 justify-start items-center">
                  <component class="text-slate-100" :is="ClockIcon" />
                  <p class="uppercase font-Kantumruy text-slate-200 font-medium">Total Days</p>
                </div>
                <p
                  class="font-Kantumruy font-medium mt-2 text-center text-lg text-nowrap text-white"
                  :class="totalDays != null ? '' : 'text-red-500'"
                >
                  {{ totalDays ?? 'N/A' }} day
                </p>
              </div>
              <!-- End Block Total Leave -->
            </div>

            <!-- End Block Date -->

            <!-- Block Status -->
            <h1 class="font-Kantumruy font-medium text-slate-500 uppercase">Status</h1>
            <div class="flex flex-wrap justify-start items-center gap-6">
              <!-- Block Status view -->
              <div
                class="p-2 pr-4 rounded-full font-Kantumruy flex justify-center items-center gap-2 text-white capitalize"
                :class="
                  leaveStore.data_by_id?.data.status === 'approved'
                    ? 'bg-green-600'
                    : leaveStore.data_by_id?.data.status === 'pending'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                "
              >
                <component
                  :is="
                    leaveStore.data_by_id?.data.status === 'approved'
                      ? CheckIcon
                      : leaveStore.data_by_id?.data.status === 'pending'
                        ? ClockIcon
                        : CloseIcon
                  "
                />
                <span>{{ leaveStore.data_by_id?.data.status }}</span>
              </div>
              <!-- End Block Status view -->

              <!-- Block Buttons -->
              <div
                v-if="leaveStore.data_by_id?.data.status === 'pending'"
                class="flex justify-start items-center gap-2"
              >
                <!-- button approve -->
                <button
                  @click="handleAccept(Number(leaveStore.data_by_id.data.id), 'approved')"
                  class="font-Kantumruy p-2 pr-3 bg-green-600 text-white rounded-xl cursor-pointer hover:bg-green-700 flex justify-center items-center gap-2"
                >
                  <component :is="CheckIcon" />
                  <span>Approve</span>
                </button>
                <!-- End block approve -->

                <!-- block reject -->
                <button
                  @click="handleAccept(Number(leaveStore.data_by_id.data.id), 'rejected')"
                  class="font-Kantumruy p-2 pr-3 bg-red-500 text-white rounded-xl cursor-pointer hover:bg-red-700 flex justify-center items-center gap-2"
                >
                  <component :is="CloseIcon" />
                  <span>Reject</span>
                </button>
                <!-- End block reject -->
              </div>
              <!-- End Block Buttons -->
            </div>
            <!-- End Block Status -->

            <!-- Block Reason -->
            <h1 class="font-Kantumruy font-medium text-slate-500 uppercase">Reason</h1>
            <div class="relative bg-slate-200 dark:bg-slate-700 overflow-clip rounded-md">
              <div class="absolute top-0 bottom-0 p-0.5 bg-green-600"></div>
              <p class="p-4 pl-5 font-Kantumruy font-medium">
                {{ leaveStore.data_by_id?.data.reason ?? 'N/A' }}
              </p>
            </div>
            <!-- End Block Reason -->

            <!-- Block description -->
            <div>
              <h1 class="font-Kantumruy font-medium text-slate-500 uppercase">description</h1>
              <div class="relative bg-slate-200 dark:bg-slate-700 overflow-clip rounded-md">
                <div class="absolute top-0 bottom-0 left-0 p-0.5 bg-blue-600"></div>
                <!-- <div class="absolute top-0 right-0 left-0 p-0.5 bg-blue-600 z-10"></div> -->
                <p class="p-4 pl-5 font-Kantumruy font-medium">
                  {{ leaveStore.data_by_id?.data.description ?? 'N/A' }}
                </p>
              </div>
            </div>
            <!-- End Block Comment -->
          </div>
          <!-- End Block Detail Leave Request -->
        </div>
        <!-- End Block Details Info -->

        <!-- Block Data not available -->
        <div v-if="leaveStore.data_by_id === null && leaveStore.isLoading === false">
          <p class="text-center text-red-500">Data is not available</p>
        </div>
        <!-- End Block Data not available -->

        <!-- Block Loading -->
        <div v-if="leaveStore.isLoading" class="flex justify-center items-center p-6">
          <div class="w-10 h-10">
            <Loading />
          </div>
        </div>
        <!-- End Block Loading -->
      </div>
    </div>
  </AdminLayouts>
</template>
