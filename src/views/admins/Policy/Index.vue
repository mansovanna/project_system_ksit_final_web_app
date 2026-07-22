<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  ClockIcon,
  CloseIcon,
  DeleteIcon,
  DocumentIcon,
  EditIcon,
  NotDataSVGICON,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'
import Form from './Form.vue'
import { usePolicyStore } from '@/stores/policy_store'
import { computed, onMounted, ref, watch } from 'vue'
import Loading from '@/widgets/Loading.vue'
import InputTextField from '@/widgets/InputTextField.vue'

const policyStore = usePolicyStore()

// model
interface FormData {
  id: number
  title: string
  description: string
}

// var
const formData = ref<FormData>({ id: 0, title: '', description: '' })

// Block handle model
const handleCloseModal = (id: number, title: string, des: string) => {
  if (id) {
    policyStore.handleShowUpdate()
    formData.value.id = id
    formData.value.title = title
    formData.value.description = des
  }
}
//handle clear data
const clearInfo = () => {
  formData.value.title = ''
  formData.value.description = ''
  policyStore.handleShowUpdate()
}
// Block handle submit update policy
const handleUpdatePolicy = async () => {
  policyStore.isMessageError.title = ''
  policyStore.isMessageError.description = ''
  // policyStore.updatePolicy()
  if (formData.value.title.length == 0) {
    // alert('This is title is not required')
    return (policyStore.isMessageError.title = 'Title is required')
  }

  if (formData.value.description.length == 0) {
    return (policyStore.isMessageError.description = 'Description is required')
  }

  // if (policyStore.isLoadingUpdate.isLoading) {
  //   return
  // }

  await policyStore.updatePolicy(
    formData.value.id,
    formData.value.title,
    formData.value.description,
  )
}

let timer: ReturnType<typeof setTimeout>
watch([() => policyStore.search, () => policyStore.page], ([search]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    policyStore.getPolicy({
      search: search,
      per_page: policyStore.per_page,
      page: policyStore.page,
    })
  }, 500)
})

// Block Pagination -------------------
const pages = computed(() => {
  const current = policyStore.data?.data.current_page || 1
  const last = policyStore.data?.data.last_page || 1

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

//  formate date
function formatDate(date: string | number | Date) {
  if (!date) return 'NULL'
  return new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-')
}

onMounted(async () => {
  await policyStore.getPolicy({ search: '', per_page: 10, page: 1 })
})
</script>

<template>
  <!--  -->
  <!-- Bloc form create -->
  <!-- Block form -->
  <div v-if="policyStore.isShowModal">
    <Form />
  </div>

  <!-- End Block form -->
  <!-- Block Update policy -->
  <div
    v-if="policyStore.isShowUpdate"
    @click="clearInfo()"
    class="w-full fixed top-0 bottom-0 right-0 left-0 bg-black/30 z-50 flex justify-center items-center p-4"
  >
    <!-- Block Update -->

    <Transition name="model">
      <div
        v-if="policyStore.isShowUpdate"
        @click.stop
        class="w-full max-w-[550px] bg-white dark:bg-slate-900 dark:border dark:border-slate-600 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-modal-enter"
      >
        <!-- Header -->
        <div class="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="font-poppins text-xl font-bold text-slate-900 dark:text-white">
              Update Policy
            </h1>
          </div>
          <button
            @click="clearInfo()"
            class="p-2 hover:bg-red-400 rounded-full transition-all duration-200 text-red-500 hover:text-white duration-500"
            title="Close"
          >
            <component :is="CloseIcon" />
          </button>
        </div>

        <!-- Success Message -->
        <!-- <transition name="slide-down">
        <div
          v-if="policyStore.isMessageError.title"
          class="bg-green-50 border-b border-green-200 px-6 py-4 flex items-center gap-3"
        >
          <span class="text-xl">✓</span>
          <p class="text-sm font-medium text-green-700">{{ policyStore.isMessageError.title }}</p>
        </div>
      </transition> -->

        <!-- Form Content -->
        <form @submit.prevent="handleUpdatePolicy()" class="p-6 space-y-5">
          <!-- Title Field -->
          <div class="space-y-2">
            <div class="flex justify-between items-baseline">
              <label
                for="title"
                class="font-Kantumruy font-semibold text-slate-700 dark:text-white"
              >
                Title
                <span class="text-red-500">*</span>
              </label>
            </div>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="Enter policy title..."
              maxlength="100"
              :class="[
                'w-full px-4 py-3 dark:bg-slate-700 dark:text-white border rounded-xl font-Kantumruy transition-all duration-200 focus:outline-none',
                policyStore.isMessageError.title
                  ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-slate-400',
              ]"
            />
            <transition name="fade">
              <div v-if="policyStore.isMessageError.title" class="space-y-1">
                <p class="text-xs text-red-600 flex items-center gap-1">
                  <span>⚠</span> {{ policyStore.isMessageError.title }}
                </p>
              </div>
            </transition>
          </div>

          <!-- Description Field -->
          <div class="space-y-2">
            <div class="flex justify-between items-baseline">
              <label
                for="description"
                class="font-Kantumruy font-semibold text-slate-700 dark:text-white"
              >
                Description
                <span class="text-red-500">*</span>
              </label>
            </div>
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Enter policy description in detail..."
              maxlength="2000"
              rows="5"
              :class="[
                'w-full px-4 py-3 border dark:bg-slate-800 dark:text-white rounded-xl font-Kantumruy transition-all duration-200 focus:outline-none resize-none',
                policyStore.isMessageError.description
                  ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-slate-400',
              ]"
            ></textarea>
            <transition name="fade">
              <div v-if="policyStore.isMessageError.description" class="space-y-1">
                <p class="text-xs text-red-600 flex items-center gap-1">
                  <span>⚠</span> {{ policyStore.isMessageError.description }}
                </p>
              </div>
            </transition>
          </div>
        </form>

        <!-- Footer Buttons -->
        <div
          class="bg-slate-50 dark:bg-slate-700 border-t border-slate-200 px-6 py-4 flex justify-end items-center gap-3"
        >
          <button
            @click="clearInfo()"
            type="button"
            class="px-5 py-2.5 border border-red-500 text-rd-500 font-Kantumruy font-medium rounded-lg hover:bg-red-400 text-red-500 hover:text-white transition-all duration-200 active:scale-95"
          >
            Cancel
          </button>

          <button
            @click="handleUpdatePolicy()"
            :disabled="policyStore.isLoadingAny.loading"
            type="button"
            class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-Kantumruy font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95"
          >
            <span
              v-if="policyStore.isLoadingAny.loading"
              class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            <span>{{ policyStore.isLoadingAny.loading ? 'Saving...' : 'Save' }}</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- End Block Update -->
  </div>
  <!-- End Block update policy -->
  <AdminLayouts>
    <div class="w-full p-4">
      <div
        class="w-full p-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
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
              <h1 class="font-Kantumruy text-blue-500 line-clamp-1 capitalize">
                {{ $route.name }}
              </h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>
          <button
            @click="policyStore.handleShowModal()"
            class="px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600 cursor-pointer font-Kantumruy"
          >
            Add New
          </button>
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />
        <div class="w-full flex justify-between gap-2">
          <InputTextField v-model="policyStore.search" placeholder="Search...">
            <template #prefix>
              <component :is="SearchIcon" />
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
      <!-- Block card policy -->

      <div v-if="policyStore.data?.data.data">
        <!-- use animation -->
        <TransitionGroup
          name="list"
          tag="div"
          class="w-full grid grid-cols-4 gap-4 mt-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-2xl:grid-cols-3"
        >
          <div
            v-for="(item, index) in policyStore.data?.data.data"
            :key="index"
            class="relative z-0 w-full flex flex-col justify-between p-4 group hover:translate-1 duration-500 transform-3d ease-in-out bg-white border border-slate-200 dark:border-slate-600 rounded-xl dark:bg-slate-800 overflow-clip"
          >
            <div>
              <!-- Block style -->
              <div
                class="w-full h-1.5 bg-green-600 group-hover:bg-warning absolute bottom-0 top-0 left-0"
              ></div>
              <!-- <div
            class="w-full h-1.5 bg-blue-600 absolute group-hover:top-0 bottom-0 left-0 duration-700"
          ></div> -->
              <!-- Block title -->
              <h1 class="font-Kantumruy font-medium text-xl line-clamp-2">
                {{ item.title ?? 'No title' }}
              </h1>
              <!-- End Block title -->

              <!-- Block Body content -->
              <div class="mt-2">
                <p class="line-clamp-4 font-Kantumruy">
                  {{ item.description ?? 'No description' }}
                </p>
              </div>

              <!-- End Block Body contents -->
            </div>
            <!-- End Block nav -->

            <div>
              <!-- Block nav -->
              <div class="flex mt-3 justify-between items-center gap-2">
                <div class="flex justify-start items-center gap-2">
                  <!-- Block status -->
                  <div
                    class="font-poppins capitalize text-xs font-medium text-green-100 px-4 text-center py-1.5 rounded-full"
                    :class="{
                      'bg-green-500': item.status === 'published',
                      'bg-red-500': item.status === 'draft',
                    }"
                  >
                    <p>{{ item.status ?? 'Unknown' }}</p>
                  </div>
                  <!-- End Block status -->

                  <!-- Block file -->
                  <div
                    class="flex justify-center items-center px-2 py-1 font-Kantumruy text-xs font-bold"
                    :class="item.file_path ? 'text-blue-500' : 'text-red-500'"
                  >
                    <component :is="DocumentIcon" class="w-4 h-4" />
                    {{ item.file_path ? 'PDF' : 'No file' }}
                  </div>
                  <!-- End Block file -->
                </div>
                <!-- ------------------------------------------------- -->

                <!-- Block date -->
                <div class="flex justify-start items-center gap-1 text-slate-400">
                  <div>
                    <component class="w-3 h-3" :is="ClockIcon" />
                  </div>
                  <p class="font-Kantumruy text-xs">{{ formatDate(item.created_at) }}</p>
                </div>
              </div>
              <hr class="my-2 text-slate-300" />
              <div class="flex justify-end items-center gap-3">
                <button
                  @click="$router.push({ name: 'policy-detail', params: { id: item.id } })"
                  class="flex justify-center items-center p-3 bg-green-500 rounded-full text-white hover:bg-green-700 cursor-pointer"
                >
                  <component :is="ViewIcon" />
                </button>

                <!-- Block Edit -->
                <button
                  @click="handleCloseModal(item.id, item.title, item.description)"
                  class="flex justify-center items-center p-3 bg-blue-500 rounded-full text-white hover:bg-blue-700 cursor-pointer"
                >
                  <component class="w-4.5 h-4.5" :is="EditIcon" />
                </button>
                <!-- End Block Edit -->

                <!-- Block delete -->
                <button
                  @click="policyStore.deletePolicyById(item.id)"
                  :disabled="
                    policyStore.isLoadingAny.id === item.id && policyStore.isLoadingAny.loading
                  "
                  class="flex justify-center items-center p-3 bg-red-500 rounded-full text-white hover:bg-red-700 cursor-pointer"
                >
                  <component class="w-4.5 h-4.5" :is="DeleteIcon" />
                </button>
              </div>
            </div>

            <!-- loading -->
            <div
              v-if="policyStore.isLoadingAny.id === item.id && policyStore.isLoadingAny.loading"
              class="bg-black/50 absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center p-5"
            >
              <div class="w-10 h-10">
                <Loading />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Block data is empty -->
      <div
        v-if="!policyStore.isLoading && !policyStore.data?.data.data.length"
        class="w-full p-6 flex justify-center items-center"
      >
        <!-- <NotData /> -->
        <div>
          <img :src="NotDataSVGICON" alt="" />
        </div>
      </div>

      <!-- Block loading data -->
      <div v-if="policyStore.isLoading" class="w-full flex justify-center items-center p-4">
        <div class="w-10 h-10"><Loading /></div>
      </div>

      <!-- Block Pagination -->
      <div
        v-if="policyStore.data?.data.data.length"
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
              policyStore.getPolicy({
                search: policyStore.search,
                per_page: policyStore.per_page,
                page: policyStore.page,
              })
            "
          >
            <input
              type="number"
              v-model="policyStore.per_page"
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
            :disabled="policyStore.data.data.current_page <= 1"
            @click="
              policyStore.getPolicy({
                search: policyStore.search,
                per_page: policyStore.per_page,
                page: policyStore.data!.data.current_page - 1,
              })
            "
            :class="
              policyStore.data.data.current_page <= 1
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
              :disabled="policyStore.data.data.current_page == page"
              @click="
                policyStore.getPolicy({
                  search: policyStore.search,
                  per_page: policyStore.per_page,
                  page: Number(page),
                })
              "
              :class="
                policyStore.data.data.current_page == page
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
            :disabled="policyStore.data.data.current_page >= policyStore.data.data.last_page"
            @click="
              policyStore.getPolicy({
                search: policyStore.search,
                per_page: policyStore.per_page,
                page: policyStore.data!.data.current_page + 1,
              })
            "
            :class="
              policyStore.data.data.current_page >= policyStore.data.data.last_page
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
  </AdminLayouts>
</template>

<style scoped>
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-enter {
  animation: modal-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Focus ring effects */
input:focus,
textarea:focus {
  box-shadow: inset 0 0 0 1px transparent;
}

/* Character counter animation */
@keyframes pulse-warn {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

span:has(+ .text-red-500),
span:has(+ .text-orange-500) {
  animation: pulse-warn 1s ease-in-out;
}

.model-enter-active,
.model-leave-active {
  transition: all 0.3s ease;
}
.model-enter-from,
.model-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* animation list */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

/* important for grid animation */
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.list-leave-active {
  position: absolute;
}
</style>
