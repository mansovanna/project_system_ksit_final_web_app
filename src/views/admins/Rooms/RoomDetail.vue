<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CloseIcon,
  DeleteIcon,
  ViewIcon,
  CSVIcon,
  PrintIcon,
  CheckIcon,
} from '@/stores/Icons'
import { api as viewerApi } from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import { onMounted, ref } from 'vue'
import RoomCreateForm from './RoomCreateForm.vue'
import UnAssignment from './UnAssignment.vue'
import { useRoomStore } from '@/stores/room_store'
import { useRoute } from 'vue-router'
import NotData from '@/widgets/NotData.vue'
import { useAvatar } from '@/composables/useAvatar'

const avatar = useAvatar()
const roomStore = useRoomStore()

const route = useRoute()

onMounted(() => {
  if (route.params.id) {
    roomStore.roomActive(Number(route.params.id))
    roomStore.roomUnActive(
      Number(route.params.id),
      roomStore.search,
      roomStore.per_page,
      roomStore.page,
    )
    roomStore.roomUnassignActiveOld(
      Number(route.params.id),
      roomStore.search,
      roomStore.per_page,
      roomStore.page,
    )
  } else {
    alert('Data is not id')
  }
})

const alert_messageg_check = (id: number | null, status: string | null) => {
  roomStore.isMessage = ''
  if (id != null || status != null) {
    roomStore.isMessage = status ?? ''
    roomStore.isOpen = !roomStore.isOpen
    roomStore.id = Number(id)
  } else {
    roomStore.isOpen = !roomStore.isOpen
  }
}

const isOpenFromCreate = ref(false)

const openFormcreate = () => {
  isOpenFromCreate.value = !isOpenFromCreate.value
}

const handleUnAssign = (id: number) => {
  if (id && roomStore.isMessage == 'approved') {
    roomStore.roomUnAssign(id)
  } else if (id && roomStore.isMessage == 'delete') {
    roomStore.removeAssign(id)
  } else {
    alert('false id:')
  }
}

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
  <AdminLayouts title="User Register New">
    <!-- Block Building Create form -->
    <RoomCreateForm v-if="isOpenFromCreate" @close="openFormcreate" />
    <!-- End ---------------------------- -->

    <div
      v-if="roomStore.isOpen"
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
            :class="roomStore.isMessage === 'approved' ? 'text-green-400' : 'text-red-400'"
          >
            <!-- <span class="text-white text-3xl font-bold">!</span> -->
            <component
              :is="roomStore.isMessage === 'approved' ? CheckIcon : DeleteIcon"
              class="w-30 h-30"
            />
          </div>
        </div>

        <!-- Message -->
        <h1 class="font-Kantumruy mt-4 text-center font-medium text-slate-600 dark:text-slate-200">
          Do you want to
          <span class="font-semibold capitalize">{{ roomStore.isMessage }}</span> this item?
        </h1>

        <!-- Actions -->
        <div class="flex justify-center mt-6">
          <button
            @click="handleUnAssign(roomStore.id)"
            class="px-6 w-1/3 py-2 text-white rounded-md font-Kantumruy"
            :class="
              roomStore.isMessage === 'approved'
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
        class="w-full p-6 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
      >
        <div class="w-full flex justify-between items-center">
          <div>
            <div class="flex justify-start items-center">
              <h1 class="font-Kantumruy text-slate-500">Dashboard</h1>
              <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
              <h1 class="font-Kantumruy text-blue-500">Rooms Detailt</h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>
          <button
            class="px-4 py-2 pl-2 bg-red-600 text-white rounded-md hover:bg-red-500 font-Kantumruy cursor-pointer flex justify-center items-center"
            @click="$router.back()"
          >
            <component class="-rotate-90" :is="ArrowSmallUpIcon"></component>
            <span class="font-Kantumruy font-medium">Back</span>
          </button>
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />
        <div class="w-full flex justify-between gap-2">
          <div>
            <span class="font-Kantumruy text-base capitalize">
              Build/Room/Floor: {{ roomStore.roomAssignActive?.data.building.name ?? 'null' }}-{{
                roomStore.roomAssignActive?.data.building.gender == 'male'
                  ? 'M'
                  : roomStore.roomAssignActive?.data.building.gender == 'female'
                    ? 'F'
                    : 'Other'
              }}
              /{{ roomStore.roomAssignActive?.data.floor ?? 'null' }} /{{
                roomStore.roomAssignActive?.data.floor ?? 'null'
              }}
              /{{ roomStore.roomAssignActive?.data.floor ?? 'null' }}</span
            >
          </div>
        </div>
      </div>

      <!--  -->

      <!-- Loading -->

      <!--  -->
      <div
        class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="flex justify-between items-center">
          <h1
            class="text-wrap w-full font-Kantumruy font-medium text-slate-600 dark:text-slate-300"
          >
            Room Assigned
          </h1>

          <!--  -->
          <div v-if="false" class="flex justify-end items-center gap-3 ml-3">
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
          </div>
        </div>
        <hr class="text-slate-300 dark:text-slate-400 my-4" />
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

                <td class="px-3 py-1.5 text-center dark:text-slate-300">Start Date</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">End Date</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Actions</td>
              </tr>
            </thead>
            <tbody v-if="roomStore.roomAssignActive?.data.room_actives.length">
              <tr
                v-for="(item, index) in roomStore.roomAssignActive?.data.room_actives"
                :key="index"
                class="border-y border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
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
                          item?.user.profile_photo_url ??
                            avatar.textToImage(item?.user.user_name ?? 'User'),
                        )
                      "
                    >
                      <img
                        :src="
                          item?.user.profile_photo_url
                            ? item.user.profile_photo_url
                            : avatar.textToImage(item?.user.user_name ?? 'User')
                        "
                        alt="avatar"
                        class="w-10 h-10 rounded-full object-cover object-center outline-2 outline-offset-2 outline-blue-500 font-Kantumruy flex justify-center items-center"
                      />
                    </div>
                    <div class="flex flex-col">
                      <h1 class="font-Kantumruy font-medium capitalize">
                        {{ item.user.user_name ?? 'N/A' }}
                      </h1>
                      <span class="text-xs font-Kantumruy font-medium uppercase"
                        >ID: {{ item.user.info?.id_card ?? 'N/A' }}</span
                      >
                    </div>
                  </div>
                </td>
                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.user.info?.major ?? 'N/A' }}
                </td>

                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.user.info?.year ?? 'N/A' }}
                </td>

                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.start_date ?? 'N/A' }}
                </td>
                <td
                  class="px-3 py-1.5 font-Kantumruy dark:text-slate-300 text-center"
                  :class="!item.end_date ? 'text-red-500' : 'text-slate-500'"
                >
                  {{ item.end_date ?? 'Not yet' }}
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
                    <button
                      @click="alert_messageg_check(item.id, 'approved')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CheckIcon" />
                    </button>

                    <button
                      @click="alert_messageg_check(item.id, 'delete')"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="DeleteIcon" />
                    </button>
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

        <!--  -->
      </div>

      <!--  -->
      <UnAssignment :id="Number(route.params.id)" />
    </div>
  </AdminLayouts>
</template>
