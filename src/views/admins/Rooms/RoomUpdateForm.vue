<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { CloseIcon, SearchIcon } from '@/stores/Icons'
import { useBuildStore } from '@/stores/build_store'
import { useRoomStore } from '@/stores/room_store'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'
import { SaveIcon } from '@lucide/vue'
import { reactive, ref, watch } from 'vue'

const roomStore = useRoomStore()
const buildStore = useBuildStore()

const isOpenBuilding = ref(false)

let timer: ReturnType<typeof setTimeout>

watch(
  () => buildStore.search,
  () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      buildStore.getBuildList(buildStore.search, buildStore.per_page, buildStore.page)
    }, 500)
  },
  { deep: true },
)

const props = defineProps<{
  item: any
}>()

const isSelectBuilding = ref(props.item.building.name + ' | ' + props.item.building.gender)
const toggleBuilding = () => {
  isOpenBuilding.value = !isOpenBuilding.value
}

const formData = reactive({
  room_number: Number(props.item.room_number) ?? '',
  building_id: Number(props.item.building_id) ?? 0,
  floor: Number(props.item.floor) ?? 0,
  max_member: Number(props.item.max_member) ?? 0,
})

const selectBuilding = (id: number, building: string) => {
  formData.building_id = id
  isSelectBuilding.value = building
  isOpenBuilding.value = false
}
const errorMessage = reactive({
  room_number: '',
  building_id: '',
  floor: '',
  max_member: '',
})

const validate = () => {
  if (!formData.room_number) {
    errorMessage.room_number = 'Room number is required'
    return false
  }

  if (!formData.building_id) {
    errorMessage.building_id = 'Building is required'
    return false
  }

  if (!formData.floor) {
    errorMessage.floor = 'Floor is required'
    return false
  }

  if (!formData.max_member) {
    errorMessage.max_member = 'Max member is required'
    return false
  }

  return true
}

const submit = () => {
  // clear errors
  errorMessage.room_number = ''
  errorMessage.building_id = ''
  errorMessage.floor = ''
  errorMessage.max_member = ''

  // validate
  if (!validate()) {
    return
  }

  // submit
  // alert('ok')
  if (props.item.id) {
    roomStore.updateRoom(props.item.id, {
      room_number: Number(formData.room_number),
      building_id: Number(formData.building_id),
      floor: Number(formData.floor),
      max_member: Number(formData.max_member),
    })
  }
}
</script>

<template>
  <div
    class="top-0 left-0 bottom-0 right-0 fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    @click="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-xl w-full max-w-xl shadow-lg relative overflow-visible"
      @click.stop
    >
      <div @click="isOpenBuilding = false">
        <div class="w-full flex justify-between items-center p-4">
          <!-- Block -->
          <button
            @click="$emit('close')"
            class="px-4 py-1 rounded-bl-lg rounded-tr-lg border border-t-0 drop-shadow-2xl cursor-pointer border-warning bg-red-500 text-white hover:bg-red-600 absolute right-0 top-0"
          >
            <component :is="CloseIcon" />
          </button>

          <h1 class="font-Kantumruy text-lg font-medium text-slate-600 dark:text-slate-300">
            Update Room
          </h1>
        </div>
        <hr class="text-slate-300 dark:text-slate-500" />
        <!-- Icon -->
        <div>
          <div class="flex flex-col justify-start items-start gap-3 p-4 w-full">
            <!-- ----------- -->
            <div class="w-full grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              <div class="w-full">
                <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Room Number </span>
                <div class="mt-1">
                  <input
                    type="text"
                    placeholder="0"
                    v-model="formData.room_number"
                    class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    :class="{
                      'border-red-500 bg-red-500/10': errorMessage.room_number,
                      'border-slate-200 dark:border-slate-500 bg-slate-50 font-Kantumruy dark:bg-slate-800':
                        !errorMessage.room_number,
                    }"
                  />
                  <span
                    v-if="errorMessage.room_number"
                    class="text-red-500 text-xs font-Kantumruy"
                    >{{ errorMessage.room_number }}</span
                  >
                </div>
              </div>
              <!-- Block Building  -->
              <div class="w-full flex flex-col space-y-1">
                <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Building</span>

                <!--  -->
                <div class="w-full relative" @click.stop>
                  <button
                    type="button"
                    @click="toggleBuilding"
                    class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    :class="{
                      'border-red-500 bg-red-500/10': errorMessage.building_id,
                      'border-slate-200 dark:border-slate-500 bg-slate-50 font-Kantumruy dark:bg-slate-800':
                        !errorMessage.building_id,
                    }"
                  >
                    <p
                      class="font-Kantumruy text-slate-600 dark:text-slate-300 text-start capitalize"
                    >
                      {{ isSelectBuilding || 'NT-0...' }}
                    </p>
                  </button>

                  <span
                    v-if="errorMessage.building_id"
                    class="text-red-500 text-xs font-Kantumruy"
                    >{{ errorMessage.building_id }}</span
                  >

                  <!-- Block Dropdown -->
                  <div
                    v-if="isOpenBuilding"
                    @click.stop
                    class="absolute top-12 w-full bg-white dark:bg-slate-700 rounded-md shadow-lg p-1 border border-slate-200 dark:border-slate-500"
                  >
                    <!-- Block search -->
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="Search"
                        v-model="buildStore.search"
                        class="w-full p-2 bg-slate-50 font-Kantumruy dark:bg-slate-800 border border-slate-200 dark:border-slate-500 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      />
                      <div class="absolute right-2 top-2 text-slate-300">
                        <component :is="SearchIcon" />
                      </div>
                    </div>
                    <!-- Block items -->
                    <div class="overflow-visible">
                      <div class="max-h-45 overflow-y-auto scroll-y mt-1">
                        <!-- list data -->
                        <div v-if="buildStore.build_list?.data.data.length" class="space-y-1">
                          <button
                            @click="selectBuilding(item.id, `${item.name} | ${item.gender}`)"
                            v-for="(item, index) in buildStore.build_list?.data.data"
                            :key="index"
                            class="w-full p-2 bg-slate-50 font-Kantumruy hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 border border-slate-200 dark:border-slate-500 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                          >
                            <p
                              class="font-Kantumruy text-slate-600 dark:text-slate-300 text-start capitalize"
                            >
                              {{ item.name }} | {{ item.gender }}
                            </p>
                          </button>
                        </div>
                        <!-- End list data -->
                        <!-- No data -->
                        <div
                          v-if="
                            buildStore.build_list?.data.data.length == 0 && !buildStore.isLoading
                          "
                        >
                          <not-data :size="50" />
                        </div>
                        <!-- End No data -->

                        <!-- isLoading -->
                        <div
                          v-if="buildStore.isLoading"
                          class="w-full p-4 flex justify-center items-center"
                        >
                          <div class="w-8 h-8">
                            <loading />
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- End Block items -->
                  </div>
                  <!-- End Block Dropdown -->
                </div>
              </div>
              <!-- End Block Building  -->
              <!-- Block Floor -->

              <div class="w-full">
                <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Floor</span>
                <div class="mt-1">
                  <input
                    type="number"
                    placeholder="0"
                    v-model="formData.floor"
                    class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    :class="{
                      'border-red-500 bg-red-500/10': errorMessage.floor,
                      'border-slate-200 dark:border-slate-500 bg-slate-50 font-Kantumruy dark:bg-slate-800':
                        !errorMessage.floor,
                    }"
                  />
                  <span v-if="errorMessage.floor" class="text-red-500 text-xs font-Kantumruy">{{
                    errorMessage.floor
                  }}</span>
                </div>
              </div>

              <!--  -->
              <div class="w-full">
                <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Max Member</span>
                <div class="mt-1">
                  <input
                    type="number"
                    placeholder="0"
                    v-model="formData.max_member"
                    class="w-full p-2 bg-slate-50 font-Kantumruy dark:bg-slate-800 border border-slate-200 dark:border-slate-500 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>

            <div class="w-full flex justify-end mt-2">
              <button
                @click="submit"
                title="Save data"
                :disabled="roomStore.isLoading"
                class="px-4 py-2 flex disabled:opacity-50 disabled:cursor-not-allowed justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-Kantumruy rounded-md"
              >
                <span v-if="!roomStore.isLoading" class="flex justify-center items-center gap-2">
                  <component :is="SaveIcon" />
                  <p>Save</p>
                </span>

                <div v-if="roomStore.isLoading" class="flex justify-center items-center gap-1">
                  <div class="w-5 h-5 flex justify-center">
                    <loading />
                  </div>
                  <span>Loading...</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
