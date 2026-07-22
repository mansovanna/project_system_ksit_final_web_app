<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { ArrowSmallUpIcon, CloseIcon, DeleteIcon, EditIcon, SearchIcon } from '@/stores/Icons'

import BuildCreateForm from './BuildCreateForm.vue'
import BuildUpdateForm from './BuildUpdateForm.vue'

const buildStore = useBuildStore()

import { computed, onMounted, ref, watch } from 'vue'
import { useBuildStore } from '@/stores/build_store'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'
import InputTextField from '@/widgets/InputTextField.vue'

const isOpen = ref(false)
const isMessage = ref<string>('')
const alert_messageg_check = (id: number | null, status: string | null) => {
  if (id != null || status != null) {
    isMessage.value = status ?? ''
    isOpen.value = !isOpen.value
    buildStore.isLoadingAny.id = Number(id)
  } else {
    isOpen.value = !isOpen.value
  }
}

const confirmDelete = () => {
  if (buildStore.isLoadingAny.id) {
    buildStore.deleteBuild(buildStore.isLoadingAny.id)
    isOpen.value = false
  }
}

const update = (id: number, name: string, gender: string) => {
  buildStore.formData.id = id
  buildStore.formData.name = name
  buildStore.formData.gender = gender

  if (buildStore.formData.name) {
    buildStore.isMessagError.name = 'Please required name!'
  }

  if (buildStore.formData.gender) {
    buildStore.isMessagError.name = 'Please required gender!'
  }

  if (buildStore.formData.id) {
    buildStore.isOpenFromUpdate = true
  } else {
    console.log('Id is not found!')
  }
}

let timer: ReturnType<typeof setTimeout>
watch([() => buildStore.search, () => buildStore.page], ([search]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    buildStore.getBuildList(search, buildStore.per_page, buildStore.page)
  }, 500)
})

// Block Pagination -------------------
const pages = computed(() => {
  const current = buildStore.build_list?.data.current_page || 1
  const last = buildStore.build_list?.data.last_page || 1

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

onMounted(() => {
  buildStore.getBuildList(buildStore.search, buildStore.per_page, buildStore.page)
})
</script>
<template>
  <AdminLayouts title="User Register New">
    <!-- Block Building Create form -->
    <BuildCreateForm v-if="buildStore.isSelectStateAdd" @close="buildStore.toggleAdd" />
    <!-- End ---------------------------- -->
    <BuildUpdateForm
      v-if="buildStore.isOpenFromUpdate"
      @close="buildStore.isOpenFromUpdate = false"
    />
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
          Do you want to <span class="font-semibold capitalize">{{ isMessage }}</span> this item?
        </h1>

        <!-- Actions -->
        <div class="flex justify-center mt-6">
          <button
            @click="confirmDelete"
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
        class="w-full p-6 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
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
          <button
            @click="buildStore.toggleAdd"
            class="px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600 cursor-pointer font-Kantumruy"
          >
            Add New
          </button>
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />
        <div class="w-full flex justify-between gap-2">
          <InputTextField v-model="buildStore.search" placeholder="Search...">
            <template #suffix>
              <component :is="SearchIcon" class="text-slate-400" />
            </template>
          </InputTextField>
          <!-- ------- -->
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
                class="w-full bg-slate-100 dark:bg-slate-600 font-Kantumruy text-nowrap text-slate-500 uppercase"
              >
                <td class="px-1 py-1.5 text-left dark:text-slate-300">ID</td>
                <td class="px-1 py-1.5 text-left dark:text-slate-300">Name</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Gender</td>
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Total Room</td>
                <!-- <td class="px-3 py-1.5 text-center dark:text-slate-300">Status</td> -->
                <td class="px-3 py-1.5 text-center dark:text-slate-300">Actions</td>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in buildStore.build_list?.data.data"
                :key="index"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ index + 1 }}
                </td>
                <td class="px-1 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-left">
                  {{ item.name ?? 'Null' }}
                </td>
                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center capitalize"
                >
                  {{ item.gender ?? 'Null' }}
                </td>

                <td
                  class="px-3 py-1.5 font-Kantumruy text-slate-500 dark:text-slate-300 text-center"
                >
                  {{ item.rooms_count ?? 'Null' }}
                </td>

                <td class="py-1.5 text-center">
                  <!--  -->
                  <div class="flex justify-center items-center gap-2">
                    <!-- @click="openFormUpdate(1)" -->
                    <button
                      @click="update(item.id, item.name, item.gender)"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-blue-600 hover:text-white text-blue-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="EditIcon" />
                    </button>

                    <button
                      @click="alert_messageg_check(item.id, 'delete')"
                      :disabled="
                        buildStore.isLoadingAny.isloading && buildStore.isLoadingAny.id === item.id
                      "
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer ease-in-out duration-200"
                    >
                      <div
                        v-if="
                          buildStore.isLoadingAny.isloading &&
                          buildStore.isLoadingAny.id === item.id
                        "
                        class="flex justify-center items-center w-5 h-5"
                      >
                        <component :is="Loading" />
                      </div>
                      <component v-else :is="DeleteIcon" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Block loading -->
        <div v-if="buildStore.isLoading" class="w-full p-6 flex justify-center items-center">
          <div class="w-10 h-10 flex justify-center items-center gap-1">
            <component :is="Loading" />
          </div>
        </div>
        <!-- End Block loading -->

        <!-- Block data empty -->

        <div
          v-else-if="!buildStore.build_list?.data.data.length && !buildStore.isLoading"
          class="w-full flex justify-center items-center p-4"
        >
          <NotData />
        </div>
        <!-- End Block data empty -->
        <!--  -->
        <hr class="text-slate-300" />
        <!-- Pagination Block code control -->
        <div
          v-if="buildStore.build_list?.data.data.length"
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
                buildStore.getBuildList(buildStore.search, buildStore.per_page, buildStore.page)
              "
            >
              <input
                type="number"
                v-model="buildStore.per_page"
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
              :disabled="buildStore.build_list.data.current_page <= 1"
              @click="
                buildStore.getBuildList(
                  buildStore.search,
                  buildStore.per_page,
                  buildStore.build_list!.data.current_page - 1,
                )
              "
              :class="
                buildStore.build_list.data.current_page <= 1
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
                :disabled="buildStore.build_list.data.current_page == page"
                @click="
                  buildStore.getBuildList(buildStore.search, buildStore.per_page, Number(page))
                "
                :class="
                  buildStore.build_list?.data.current_page == page
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
                buildStore.build_list.data.current_page >= buildStore.build_list.data.last_page
              "
              @click="
                buildStore.getBuildList(
                  buildStore.search,
                  buildStore.per_page,
                  buildStore.build_list!.data.current_page + 1,
                )
              "
              :class="
                buildStore.build_list.data.current_page >= buildStore.build_list.data.last_page
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
