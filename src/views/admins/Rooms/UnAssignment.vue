<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ArrowSmallUpIcon, CheckIcon, SearchIcon, ViewIcon } from '@/stores/Icons'
import { useRoomStore } from '@/stores/room_store'
import { computed, ref, watch } from 'vue'
import { api as viewerApi } from 'v-viewer'
import 'viewerjs/dist/viewer.css'
const avatar = useAvatar()

import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'
import { useAvatar } from '@/composables/useAvatar'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const roomStore = useRoomStore()

let timer: ReturnType<typeof setTimeout>
watch([() => roomStore.search, () => roomStore.page], ([search]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    roomStore.roomUnActive(Number(props.id), search, roomStore.per_page, roomStore.page)
    roomStore.roomUnassignActiveOld(Number(props.id), search, roomStore.per_page, roomStore.page)
  }, 500)
})

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
// --------------------------------

// Block Pagination -------------------
const pages = computed(() => {
  const current = roomStore.room_anActive_list?.data.current_page || 1
  const last = roomStore.room_anActive_list?.data.last_page || 1

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
  <div
    class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
  >
    <div class="flex justify-between items-center">
      <h1 class="text-wrap w-full font-Kantumruy font-medium text-slate-600 dark:text-slate-300">
        Student is not Assign
      </h1>
      <div class="w-full justify-end flex gap-3">
        <div class="w-full relative">
          <input
            v-model="roomStore.search"
            type="text"
            class="border pl-4 pr-10 py-2 rounded-md border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
            placeholder="Search..."
          />

          <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
            <component :is="SearchIcon" class="text-slate-400" />
          </div>
        </div>
      </div>
      <!--  -->
    </div>
    <hr class="text-slate-300 dark:text-slate-400 my-4" />
    <div class="flex gap-4">
      <!-- Block Student New -->
      <div class="w-1/2">
        <p class="font-poppins text-slate-500 mb-2 text-center">Student New</p>
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-slate-500 uppercase"
              >
                <td class="px-1 py-1.5 text-left dark:text-slate-300">ID</td>
                <td class="px-1 py-1.5 text-left dark:text-slate-300">Student</td>
                <td class="px-1 py-1.5 text-center dark:text-slate-300">Major</td>
                <td class="px-1 py-1.5 text-center dark:text-slate-300">Year</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Actions</td>
              </tr>
            </thead>
            <!-- ----------------------------------- -->
            <tbody v-if="roomStore.isLoading">
              <tr>
                <th colspan="7" class="font-Kantumruy font-normal text-slate-400 p-4">
                  <div class="w-full flex justify-center items-center">
                    <div class="w-10 h-10">
                      <loading />
                    </div>
                  </div>
                </th>
              </tr>
            </tbody>
            <!-- --------------------------------------- -->
            <tbody v-else-if="roomStore.room_anActive_list?.data.data.length">
              <tr
                v-for="(item, index) in roomStore.room_anActive_list?.data.data"
                :key="index"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ index + 1 }}
                </td>
                <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-left">
                  <div class="flex gap-2">
                    <div
                      class="w-10 h-10 rounded-full"
                      @click="
                        openImage(
                          item.profile_photo_url
                            ? item.profile_photo_url
                            : avatar.textToImage(item?.user_name ?? 'User'),
                        )
                      "
                    >
                      <img
                        :src="
                          item.profile_photo_url
                            ? item.profile_photo_url
                            : avatar.textToImage(item?.user_name ?? 'User')
                        "
                        alt="avatar"
                        class="w-10 h-10 rounded-full object-cover object-center outline-2 outline-offset-2 outline-blue-500 font-Kantumruy flex justify-center items-center"
                      />
                    </div>
                    <div class="flex flex-col">
                      <h1 class="font-Kantumruy font-medium capitalize">
                        {{ item.user_name ?? null }}
                      </h1>
                      <span class="text-xs font-Kantumruy font-medium"
                        >ID: {{ item.info?.id_card ?? null }}</span
                      >
                    </div>
                  </div>
                </td>
                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.info?.major ?? 'Null' }}
                </td>

                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.info?.year ?? null }}
                </td>

                <td class="py-1.5 text-center">
                  <!--  -->
                  <div class="flex justify-center items-center gap-2">
                    <button
                      value="View"
                      @click="$router.push({ name: 'users-profile', params: { id: 1 } })"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="ViewIcon" />
                    </button>
                    <!-- @click="openFormUpdate(1)" -->
                    <div>
                      <!--  -->
                      <button
                        @click="
                          roomStore.roomAssigned(
                            item.id,
                            Number(roomStore.roomAssignActive?.data.id),
                          )
                        "
                        class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                      >
                        <div
                          v-if="
                            roomStore.isLoadingAny.isID == item.id &&
                            roomStore.isLoadingAny.isLoading
                          "
                          class="w-6 h-6 flex justify-center items-center"
                        >
                          <loading />
                        </div>

                        <span v-else>
                          <component :is="CheckIcon" />
                        </span>
                      </button>
                    </div>
                    <!-- @click="alert_messageg_check(1, 'delete')" -->
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <th colspan="7" class="font-Kantumruy font-normal text-slate-400 pt-4">
                  <not-data />
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Block Student Old -->
      <div class="w-1/2">
        <p class="font-poppins text-slate-500 mb-2 text-center">Student Olds</p>
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-slate-500 uppercase"
              >
                <td class="px-1 py-1.5 text-left dark:text-slate-300">ID</td>
                <td class="px-1 py-1.5 text-left dark:text-slate-300">Student</td>
                <td class="px-1 py-1.5 text-center dark:text-slate-300">Major</td>
                <td class="px-1 py-1.5 text-center dark:text-slate-300">Year</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Actions</td>
              </tr>
            </thead>
            <!-- ----------------------------------- -->
            <tbody v-if="roomStore.isLoadingOld">
              <tr>
                <th colspan="7" class="font-Kantumruy font-normal text-slate-400 p-4">
                  <div class="w-full flex justify-center items-center">
                    <div class="w-10 h-10">
                      <loading />
                    </div>
                  </div>
                </th>
              </tr>
            </tbody>
            <!-- --------------------------------------- -->
            <tbody v-else-if="roomStore.room_anActive_list_old?.data.data.length">
              <tr
                v-for="(item, index) in roomStore.room_anActive_list_old?.data.data"
                :key="index"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ index + 1 }}
                </td>
                <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-left">
                  <div class="flex gap-2">
                    <div
                      class="w-10 h-10 rounded-full"
                      @click="
                        openImage(
                          item.profile_photo_url
                            ? item.profile_photo_url
                            : avatar.textToImage(item?.user_name ?? 'User'),
                        )
                      "
                    >
                      <img
                        :src="
                          item.profile_photo_url
                            ? item.profile_photo_url
                            : avatar.textToImage(item?.user_name ?? 'User')
                        "
                        alt="avatar"
                        class="w-10 h-10 rounded-full object-cover object-center outline-2 outline-offset-2 outline-blue-500 font-Kantumruy flex justify-center items-center"
                      />
                    </div>
                    <div class="flex flex-col">
                      <h1 class="font-Kantumruy font-medium capitalize">
                        {{ item.user_name ?? null }}
                      </h1>
                      <span class="text-xs font-Kantumruy font-medium"
                        >ID: {{ item.info?.id_card ?? null }}</span
                      >
                    </div>
                  </div>
                </td>
                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.info?.major ?? 'Null' }}
                </td>

                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.info?.year ?? null }}
                </td>

                <td class="py-1.5 text-center">
                  <!--  -->
                  <div class="flex justify-center items-center gap-2">
                    <button
                      value="View"
                      @click="$router.push({ name: 'users-profile', params: { id: 1 } })"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="ViewIcon" />
                    </button>
                    <!-- @click="openFormUpdate(1)" -->
                    <button
                      @click="
                        roomStore.roomAssigned(item.id, Number(roomStore.roomAssignActive?.data.id))
                      "
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                    >
                      <div
                        v-if="
                          roomStore.isLoadingAny.isID == item.id && roomStore.isLoadingAny.isLoading
                        "
                        class="w-6 h-6 flex justify-center items-center"
                      >
                        <loading />
                      </div>

                      <span v-else>
                        <component :is="CheckIcon" />
                      </span>
                    </button>
                    <!-- @click="alert_messageg_check(1, 'delete')" -->
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <th colspan="7" class="font-Kantumruy font-normal text-slate-400 pt-4">
                  <not-data />
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!--  -->
    <hr class="text-slate-300" />
    <!-- -------------------------------------------------- -->
    <!-- Pagination Block code control -->
    <div
      v-if="roomStore.room_list?.data.data.length"
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
            roomStore.roomUnActive(
              Number(props.id),
              roomStore.search,
              roomStore.per_page,
              roomStore.page,
            )
          "
        >
          <input
            type="number"
            v-model="roomStore.per_page"
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
          :disabled="roomStore.room_list!.data.current_page <= 1"
          @click="
            roomStore.roomUnActive(
              Number(props.id),
              roomStore.search,
              roomStore.per_page,
              roomStore.room_list!.data.current_page - 1,
            )
          "
          :class="
            roomStore.room_list!.data.current_page <= 1
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
            :disabled="roomStore.room_list!.data.current_page == page"
            @click="
              roomStore.roomUnActive(
                Number(props.id),
                roomStore.search,
                roomStore.per_page,
                Number(page),
              )
            "
            :class="
              roomStore.room_list?.data.current_page == page
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
          :disabled="roomStore.room_list!.data.current_page >= roomStore.room_list!.data.last_page"
          @click="
            roomStore.roomUnActive(
              Number(props.id),
              roomStore.search,
              roomStore.per_page,
              roomStore.room_list!.data.current_page + 1,
            )
          "
          :class="
            roomStore.room_list!.data.current_page >= roomStore.room_list!.data.last_page
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
