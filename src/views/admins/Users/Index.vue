<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CallIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  InfoIcon,
  NotDataSVGICON,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'
import type { User } from '@/models/UserModel'
import UserCreateForm from './UserCreateForm.vue'
import { computed, onMounted, watch } from 'vue'
import { useUsersStore } from '@/stores/user_store'
import { useAvatar } from '@/composables/useAvatar'
import { useRouter } from 'vue-router'
import Loading from '@/widgets/Loading.vue'
import InputTextField from '@/widgets/InputTextField.vue'
import { api as viewerApi } from 'v-viewer'
import 'viewerjs/dist/viewer.css'
const avatar = useAvatar()

const router = useRouter()

const userStore = useUsersStore()

const alert_messageg_check = (id: number | null, status: string | null) => {
  if (id != null || status != null) {
    userStore.isMessage = status ?? ''
    userStore.isOpen = !userStore.isOpen
    userStore.id = String(id)
    userStore.status = String(status)
  } else {
    userStore.isOpen = !userStore.isOpen
  }
}

onMounted(async () => {
  userStore.getUsers(userStore.search, userStore.per_page, userStore.page)
})

let timer: ReturnType<typeof setTimeout>
watch([() => userStore.search, () => userStore.per_page], ([search]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    userStore.getUsers(search, userStore.per_page, userStore.page)
  }, 500)
})

const submitStatus = () => {
  userStore.isOpen = false
  if (userStore.id && userStore.status) {
    if (userStore.status !== 'delete') {
      userStore.updateStatus({
        id: userStore.id,
        status: userStore.status,
      })
    } else if (userStore.status === 'delete') {
      userStore.deleteUser(Number(userStore.id))
    } else {
      alert('Function is not used!')
    }
  } else {
    alert('ID and Status is failed!')
  }
}

// pagination code apply

const pages = computed(() => {
  const current = userStore.users_list?.data.current_page || 1
  const last = userStore.users_list?.data.last_page || 1

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

const handleView = (user: User) => {
  userStore.user_info = user
  router.push({
    name: 'users-profile',
    params: { id: user.id },
  })
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
    <UserCreateForm
      v-if="userStore.isOpenUserCreateForm"
      @close="userStore.isOpenUserCreateForm = false"
    />

    <div
      v-if="userStore.isOpen"
      class="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div
        class="p-4 bg-white dark:bg-slate-700 rounded-xl w-full max-w-md shadow-lg relative overflow-clip"
      >
        <!-- Block -->
        <button
          @click="alert_messageg_check(null, '')"
          class="px-4 py-1 rounded-bl-lg border border-t-0 drop-shadow-2xl cursor-pointer border-warning bg-red-500 text-white hover:bg-red-600 absolute right-0 top-0"
        >
          <component :is="CloseIcon" />
        </button>
        <!-- Icon -->
        <div class="flex justify-center">
          <div
            class="flex items-center justify-center rounded-full"
            :class="userStore.isMessage === 'active' ? 'text-green-500' : 'text-red-500'"
          >
            <!-- <span class="text-white text-3xl font-bold">!</span> -->
            <component
              :is="userStore.isMessage === 'delete' ? DeleteIcon : InfoIcon"
              class="w-30 h-30"
            />
          </div>
        </div>

        <!-- Message -->
        <h1 class="font-Kantumruy mt-4 text-center font-medium text-slate-600 dark:text-slate-200">
          Do you want to
          <span class="font-semibold capitalize">{{ userStore.isMessage }}</span> this item?
        </h1>

        <!-- Actions -->
        <div class="flex justify-center mt-6">
          <button
            @click="submitStatus"
            class="px-6 w-1/3 py-2 text-white rounded-md font-Kantumruy"
            :class="
              userStore.isMessage === 'active'
                ? 'bg-green-600 hover:bg-green-500'
                : 'bg-red-600 hover:bg-red-500'
            "
          >
            Ok
          </button>
        </div>
      </div>
    </div>

    <!-- End Block Alert Select Status -->
    <div class="p-4">
      <!-- Add your admin home content here -->
      <div
        class="w-full p-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
      >
        <div class="w-full flex justify-between items-center">
          <div>
            <div class="flex justify-start items-center">
              <h1 class="font-Kantumruy text-slate-500">Dashboard</h1>
              <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
              <h1 class="font-Kantumruy text-blue-500">Users New</h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>
          <button
            @click="userStore.isOpenUserCreateForm = !userStore.isOpenUserCreateForm"
            class="px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600 cursor-pointer font-Kantumruy"
          >
            Add New
          </button>
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />
        <div class="w-full flex justify-between gap-2 font-Kantumruy">
          <InputTextField v-model="userStore.search" placeholder="Search...">
            <template #suffix>
              <component :is="SearchIcon" class="text-slate-400" />
            </template>
          </InputTextField>

          <!-- ------- -->
          <!-- <div class="flex justify-end items-center gap-3">
            <button
              class="p-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-500 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
            >
              Export
              <component :is="CSVIcon" />
            </button>
            <button
              class="p-2 px-4 bg-warning text-white rounded-md hover:bg-warning/80 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
            >
              Print
              <component :is="PrintIcon" />
            </button>
          </div> -->
        </div>
      </div>

      <!--  -->

      <!-- Loading -->

      <!--  -->
      <div
        class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-600 font-poppins font-medium text-nowrap text-slate-500 uppercase"
              >
                <td class="px-3 py-2 text-left dark:text-slate-300 font-Kantumruy">No.</td>

                <td class="px-3 py-2 text-left dark:text-slate-300 font-Kantumruy">Name</td>

                <td class="px-3 py-2 text-center dark:text-slate-300 font-Kantumruy">Major</td>

                <td class="px-3 py-2 text-center dark:text-slate-300 font-Kantumruy">Level</td>

                <td class="px-2 py-2 text-center dark:text-slate-300 font-Kantumruy">Year</td>

                <td class="px-3 py-2 text-left dark:text-slate-300 font-Kantumruy">Phone Number</td>

                <td class="px-3 py-2 text-center dark:text-slate-300 font-Kantumruy">Status</td>

                <td class="px-3 py-2 text-center dark:text-slate-300 font-Kantumruy">Action</td>
              </tr>
            </thead>

            <tbody v-if="userStore.users_list?.data.data.length">
              <tr
                v-for="(item, index) in userStore.users_list?.data.data"
                :key="index"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300 uppercase">
                  {{ index + 1 }}
                </td>
                <td class="px-3 py-2 flex flex-start items-center">
                  <div class="flex justify-start items-center gap-4">
                    <div
                      class="w-10 h-10 rounded-full"
                      @click="
                        openImage(
                          item?.profile_photo_url
                            ? item.profile_photo_url
                            : avatar.textToImage(item?.user_name ?? 'User'),
                        )
                      "
                    >
                      <img
                        :src="
                          item?.profile_photo_url
                            ? item.profile_photo_url
                            : avatar.textToImage(item?.user_name ?? 'User')
                        "
                        alt="avatar"
                        class="w-10 h-10 rounded-full object-cover object-center outline-2 outline-offset-2 outline-blue-500 font-Kantumruy flex justify-center items-center"
                      />
                    </div>
                    <div>
                      <p class="font-Kantumruy">
                        {{ item.first_name ?? 'N/A' }} {{ item.last_name ?? '' }}
                      </p>
                      <p class="text-xs text-slate-500 dark:text-slate-300 uppercase font-poppins">
                        {{ item.info?.id_card }}
                      </p>
                    </div>
                  </div>
                </td>

                <td
                  class="px-3 py-2 text-center font-Kantumruy"
                  :class="
                    item.info?.major == null || item.info.major == ''
                      ? 'text-red-400'
                      : 'text-slate-500 dark:text-slate-300'
                  "
                >
                  {{
                    item.info?.major == null || item.info?.major == '' ? 'N/A' : item.info?.major
                  }}
                </td>

                <td
                  class="px-3 py-2 text-center font-Kantumruy"
                  :class="
                    item.info?.level == null || item.info.level == ''
                      ? 'text-red-400'
                      : 'text-slate-500 dark:text-slate-300'
                  "
                >
                  {{
                    item.info?.level == null || item.info?.level == '' ? 'N/A' : item.info?.level
                  }}
                </td>

                <td class="px-2 py-2 text-center text-slate-500 dark:text-slate-300 font-Kantumruy">
                  {{ item.info?.year ?? 'N/A' }}
                </td>

                <td class="px-3 py-2 text-slate-500 dark:text-slate-300 font-Kantumruy">
                  <div class="flex justify-start items-center gap-1">
                    <component :is="CallIcon" class="text-slate-400 w-5 h-5" />
                    <p class="font-Kantumruy text-slate-500 dark:text-slate-300">
                      {{ item.phone_number ?? 'N/A' }}
                    </p>
                  </div>
                </td>

                <td class="px-3 py-2 text-center font-Kantumruy">
                  <div class="flex justify-center items-center">
                    <div
                      class="border rounded-full px-3 py-1 font-medium capitalize"
                      :class="
                        item.status == 'pending'
                          ? 'border-warning bg-warning/10 text-warning'
                          : item.status == 'active'
                            ? 'border-green-600 bg-green-600/20 text-green-600'
                            : item.status == 'block'
                              ? 'bg-red-600/20 text-red-600'
                              : 'bg-slate-500/20 border-slate-600 text-slate-700'
                      "
                    >
                      <p class="text-xs">
                        {{ item.status ?? 'N/A' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-3 py-2 text-center">
                  <div class="flex justify-center items-center gap-3.5">
                    <button
                      value="View"
                      @click="handleView(item)"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="ViewIcon" />
                    </button>
                    <button
                      value="Delete"
                      @click="alert_messageg_check(item.id, 'delete')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-400 hover:text-white text-red-500 cursor-pointer ease-in-out duration-200"
                    >
                      <div
                        v-if="
                          userStore.isLoadingAny.isLoading &&
                          userStore.isLoadingAny.id === item.id &&
                          userStore.isMessage === 'delete'
                        "
                      >
                        <component :is="Loading" />
                      </div>
                      <div v-else>
                        <component :is="DeleteIcon" />
                      </div>
                    </button>
                    <button
                      @click="alert_messageg_check(item.id, 'block')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CloseIcon" />
                    </button>
                    <button
                      @click="alert_messageg_check(item.id, 'active')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                    >
                      <div
                        v-if="
                          userStore.isLoadingAny.isLoading &&
                          userStore.isLoadingAny.id === item.id &&
                          userStore.isMessage === 'active'
                        "
                      >
                        <component :is="Loading" />
                      </div>
                      <div v-else>
                        <component :is="CheckIcon" />
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Block loading -->
        <div v-if="userStore.isLoading" class="w-full flex justify-center items-center p-6">
          <div class="w-10 h-10">
            <Loading />
          </div>
        </div>

        <!-- End Block loading -->

        <!-- Block data empty -->
        <div
          v-if="!userStore.users_list?.data.data.length && !userStore.isLoading"
          class="w-full flex justify-center items-center"
        >
          <img :src="NotDataSVGICON" alt="" />
        </div>

        <!-- End Block data empty -->

        <!-- Block pagination -->
        <hr class="text-slate-300" />
        <!-- Pagination -->
        <div
          v-if="userStore.users_list?.data.data.length"
          class="w-full mt-4 flex justify-between items-center gap-3 max-md:flex-col"
        >
          <!--  -->
          <div class="relative">
            <div class="flex justify-start items-center absolute top-0 bottom-0 left-0.5">
              <p
                class="bg-slate-100 dark:bg-slate-600 dark:text-slate-300 px-2 border-r border-slate-300 py-1 font-Kantumruy text-slate-500 rounded-l"
              >
                Page
              </p>
            </div>
            <form
              @submit.prevent="
                userStore.getUsers(userStore.search, userStore.per_page, userStore.page)
              "
            >
              <input
                type="number"
                v-model="userStore.per_page"
                class="border border-slate-300 px-3 py-1 pl-18 w-30 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 font-Kantumruy font-medium text-slate-400"
              />
            </form>
          </div>

          <!-- <p>current page: {{ roomStore.room_list?.data.current_page }}</p> -->
          <!--  -->

          <!-- -------------------------------------------------- -->
          <div class="flex justify-center items-center gap-2">
            <!-- Prev -->

            <button
              :disabled="userStore.users_list.data.current_page <= 1"
              @click="
                userStore.getUsers(
                  userStore.search,
                  userStore.per_page,
                  Number(userStore.users_list?.data.current_page) - 1,
                )
              "
              :class="
                userStore.users_list.data.current_page <= 1
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
                :disabled="userStore.users_list.data.current_page == page"
                @click="userStore.getUsers(userStore.search, userStore.per_page, Number(page))"
                :class="
                  userStore.users_list?.data.current_page == page
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
              :disabled="
                userStore.users_list.data.current_page >= userStore.users_list.data.last_page
              "
              @click="
                userStore.getUsers(
                  userStore.search,
                  userStore.per_page,
                  Number(userStore.users_list?.data.current_page) + 1,
                )
              "
              :class="
                userStore.users_list?.data.current_page >= userStore.users_list.data.last_page
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
      <!-- <AvailableData /> -->
      <!-- <Loading /> -->
    </div>
  </AdminLayouts>
</template>
