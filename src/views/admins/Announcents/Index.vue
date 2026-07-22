<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CloseIcon,
  DateIcon,
  DeleteIcon,
  EditIcon,
  FolderIcon,
  NotDataSVGICON,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'
import FormCreate from './FormCreate.vue'
import { onMounted, ref, watch, computed } from 'vue'
import FormUpdate from './FormUpdate.vue'
import { useAnnouncementStore } from '@/stores/announcement_store'
import Loading from '@/widgets/Loading.vue'
import InputTextField from '@/widgets/InputTextField.vue'

const announcementStore = useAnnouncementStore()

const isOpen = ref(false)
const isMessage = ref<string>('')
const alert_messageg_check = (id: number | null, status: string | null) => {
  if (id != null || status != null) {
    isMessage.value = status ?? ''
    isOpen.value = !isOpen.value
    announcementStore.item.id = String(id)
  } else {
    isOpen.value = !isOpen.value
  }
}

const openFormcreate = () => {
  announcementStore.isOpenCreate = !announcementStore.isOpenCreate
}

onMounted(() => {
  announcementStore.getAlls(
    announcementStore.search,
    announcementStore.per_page,
    announcementStore.page,
  )
})

function formatDate(date: string | number | Date) {
  if (!date) return 'NULL'
  return new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-')
}

let timer: ReturnType<typeof setTimeout>
watch([() => announcementStore.search, () => announcementStore.page], ([search]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    announcementStore.getAlls(search, announcementStore.per_page, announcementStore.page)
  }, 500)
})

const sumitDelete = (id: string, message: string) => {
  if (id && message == 'delete') {
    announcementStore.deleteItem(String(id))
    isOpen.value = false
  } else {
    alert('ID is not found!')
  }
}

const selectedItem = ref<any>(null)

const openUpdate = (item: any) => {
  selectedItem.value = item
  announcementStore.isOpenUpdate = true
}

const closeAndClear = () => {
  announcementStore.isOpenUpdate = false
  selectedItem.value = null
}

const updateAnnouncement = (data: any) => {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('status', data.status)

  announcementStore.updateItem(selectedItem.value.id, formData)
}

// Block Pagination -------------------
const pages = computed(() => {
  const current = announcementStore.data?.data.current_page || 1
  const last = announcementStore.data?.data.last_page || 1

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
  <AdminLayouts title="User Register New">
    <FormUpdate
      v-if="announcementStore.isOpenUpdate && selectedItem"
      :title="selectedItem.title"
      :description="selectedItem.description"
      :id="selectedItem.id"
      :status="selectedItem.status"
      @close="closeAndClear"
      @save="updateAnnouncement"
    />

    <!-- Block Alert Select status -->

    <FormCreate
      v-if="announcementStore.isOpenCreate"
      :isOpenCreate="announcementStore.isOpenCreate"
      @close="announcementStore.isOpenCreate = false"
    />

    <div
      v-if="isOpen"
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
          <div class="flex items-center justify-center rounded-full">
            <!-- <span class="text-white text-3xl font-bold">!</span> -->
            <component :is="DeleteIcon" class="w-30 h-30 text-red-400" />
          </div>
        </div>

        <!-- Message -->
        <h1 class="font-Kantumruy mt-4 text-center font-medium text-slate-600 dark:text-slate-200">
          Do you want to {{ announcementStore.item.id }}
          <span class="font-semibold capitalize">{{ isMessage }}</span> this item?
        </h1>

        <!-- Actions -->
        <div class="flex justify-center mt-6">
          <button
            @click="sumitDelete(announcementStore.item.id, 'delete')"
            class="px-6 w-1/3 py-2 text-white rounded-md font-Kantumruy"
            :class="
              isMessage === 'approve'
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
              <h1 class="font-Kantumruy text-blue-500">Building List</h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>

          <div class="flex w-1/4 justify-end items-center gap-6">
            <InputTextField v-model="announcementStore.search" placeholder="Search...">
              <template #prefix>
                <component :is="SearchIcon" />
              </template>
            </InputTextField>
            <button
              @click="openFormcreate"
              class="px-4 py-2 text-nowrap text-white rounded-md bg-green-500 hover:bg-green-600 cursor-pointer font-Kantumruy"
            >
              Add New
            </button>
          </div>
        </div>
      </div>

      <!-- Block card show product -->
      <div class="mt-4">
        <TransitionGroup
          v-if="announcementStore.data?.data.data.length"
          name="list"
          tag="div"
          class="grid grid-cols-5 gap-4 max-sm:grid-cols-1 max-md:grid-cols-2 max-xl:grid-cols-3 max-2xl:grid-cols-4"
        >
          <div
            v-for="(item, index) in announcementStore.data?.data.data"
            :key="index"
            class="py-4 bg-white dark:bg-slate-800 group hover:scale-95 hover:border-warning duration-500 transform-3d border border-slate-300 dark:border-slate-600 rounded-2xl relative overflow-clip flex flex-col justify-between gap-1"
          >
            <!-- Block Style -->
            <div
              class="p-0.5 absolute bg-green-600 group-hover:bg-warning top-0 right-0 left-0 z-10"
            ></div>

            <div class="w-full flex flex-col gap-2">
              <h1 class="px-4 font-Kantumruy font-medium text-lg line-clamp-2">
                {{ item.title ?? 'N/A' }}
              </h1>
              <!-- <hr class="w-full my-2 text-slate-200" /> -->
              <p class="px-4 font-Kantumruy line-clamp-3">{{ item.description }}</p>
            </div>

            <div class="w-full">
              <!-- Block active -->
              <div class="px-4 mt-4 flex justify-between items-end w-full">
                <!-- status -->
                <div class="flex justify-center items-center gap-1 px-2 py-1 rounded-full">
                  <component class="w-4 h-4 text-warning" :is="FolderIcon" />
                  <span class="font-Kantumruy text-md text-slate-400">
                    {{ item.files.length > 0 ? item.files.length : 'No file' }}</span
                  >
                </div>

                <!-- Block date -->
                <div
                  class="flex justify-center items-center gap-1 font-poppins text-slate-500 text-xs"
                >
                  <component class="w-4 h-4" :is="DateIcon" />
                  <span>{{ formatDate(item.created_at) ?? 'N/A' }}</span>
                </div>
              </div>

              <!-- Block botton -->
              <hr class="w-full text-slate-300 my-2" />
              <div class="w-full px-4 flex justify-between items-center">
                <!-- Status -->
                <div
                  class="px-5 py-1.5 font-poppins font-semibold text-center rounded-full capitalize text-xs"
                  :class="
                    item.status === 'public'
                      ? 'bg-green-600/20 text-green-600'
                      : 'bg-red-500/20 text-red-500'
                  "
                >
                  {{ item.status }}
                </div>
                <!-- End Status -->

                <!-- Block button action -->
                <div class="flex justify-end items-center gap-2">
                  <button
                    @click="$router.push({ name: 'announcements-detail', params: { id: item.id } })"
                    class="flex justify-center items-center p-3 bg-green-500 rounded-full text-white hover:bg-green-700 cursor-pointer"
                  >
                    <component :is="ViewIcon" />
                  </button>

                  <!-- Block Edit -->
                  <button
                    @click="openUpdate(item)"
                    class="flex justify-center items-center p-3 bg-blue-500 rounded-full text-white hover:bg-blue-700 cursor-pointer"
                  >
                    <component class="w-4.5 h-4.5" :is="EditIcon" />
                  </button>
                  <!-- End Block Edit -->

                  <!-- Block delete -->
                  <button
                    @click="announcementStore.deleteItem(String(item.id))"
                    class="flex justify-center items-center p-3 bg-red-500 rounded-full text-white hover:bg-red-700 cursor-pointer"
                  >
                    <component
                      v-if="announcementStore.item.id !== String(item.id)"
                      class="w-4.5 h-4.5"
                      :is="DeleteIcon"
                    />
                    <div v-else class="w-4 h-4">
                      <component :is="Loading" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- End Block card show product -->

      <!-- Loading -->
      <div v-if="announcementStore.isLoading" class="w-full flex justify-center items-center">
        <div class="w-10 h-10"><Loading /></div>
      </div>
      <!-- End Loading -->

      <!-- No Data -->
      <div
        v-if="!announcementStore.data?.data.data.length && !announcementStore.isLoading"
        class="w-full flex justify-center items-center"
      >
        <div>
          <img :src="NotDataSVGICON" alt="" />
        </div>
      </div>
      <!-- End No Data -->

      <!-- Pagination -->

      <!-- Block Pagination -->
      <div
        v-if="announcementStore.data?.data.data.length"
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
              announcementStore.getAlls(
                announcementStore.search,
                announcementStore.per_page,
                announcementStore.page,
              )
            "
          >
            <input
              type="number"
              v-model="announcementStore.per_page"
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
            :disabled="announcementStore.data.data.current_page <= 1"
            @click="
              announcementStore.getAlls(
                announcementStore.search,
                announcementStore.per_page,
                announcementStore.data!.data.current_page - 1,
              )
            "
            :class="
              announcementStore.data.data.current_page <= 1
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
              :disabled="announcementStore.data.data.current_page == page"
              @click="
                announcementStore.getAlls(
                  announcementStore.search,
                  announcementStore.per_page,
                  Number(page),
                )
              "
              :class="
                announcementStore.data.data.current_page == page
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
              announcementStore.data.data.current_page >= announcementStore.data.data.last_page
            "
            @click="
              announcementStore.getAlls(
                announcementStore.search,
                announcementStore.per_page,
                announcementStore.data!.data.current_page + 1,
              )
            "
            :class="
              announcementStore.data.data.current_page >= announcementStore.data.data.last_page
                ? 'text-blue-600 bg-slate-600/10 dark:bg-slate-600'
                : ' bg-blue-600 text-white'
            "
            class="w-8 h-8 justify-center items-center flex rounded-full cursor-pointer hover:bg-slate-200"
          >
            <component class="rotate-90" :is="ArrowSmallUpIcon"></component>
          </button>
        </div>
      </div>

      <!-- End Pagination -->

      <!--  -->
    </div>
  </AdminLayouts>
</template>

<style scoped>
/* important for grid animation */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.list-leave-from {
  opacity: 1;
  transform: scale(1);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* important for grid smooth movement */
.list-move {
  transition: transform 0.4s ease;
}
</style>
