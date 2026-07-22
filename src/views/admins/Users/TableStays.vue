<script setup lang="ts">
import { SearchIcon, ArrowSmallUpIcon } from '@/stores/Icons'
import { useStaysStudentStore } from '@/stores/stays_student_store'
import { useRoute } from 'vue-router'
import Loading from '@/widgets/Loading.vue'
import { computed, onMounted, watch } from 'vue'
import NotData from '@/widgets/NotData.vue'

const route = useRoute()
const stayStore = useStaysStudentStore()

let timer: ReturnType<typeof setTimeout>
watch([() => stayStore.search, () => stayStore.page], ([search]) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    stayStore.getStaysByIdStudent(
      Number(route.params.id),
      search,
      stayStore.per_page,
      stayStore.page,
    )
  }, 500)
})

// Block Pagination -------------------
const pages = computed(() => {
  const current = stayStore.data?.data.current_page || 1
  const last = stayStore.data?.data.last_page || 1

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
  if (route.params.id) {
    stayStore.getStaysByIdStudent(
      Number(route.params.id),
      stayStore.search,
      stayStore.per_page,
      stayStore.page,
    )
  }
})
</script>

<template>
  <div
    class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
  >
    <div class="w-full flex justify-between items-center">
      <h1 class="font-Kantumruy font-medium text-slate-500">History Stays</h1>
      <div>
        <div class="w-full relative">
          <input
            type="text"
            v-model="stayStore.search"
            class="border pl-4 pr-10 py-2 rounded-md border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
            placeholder="Search..."
          />
          <!-- icon -->
          <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
            <component :is="SearchIcon" class="text-slate-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- {{ stayStore.data?.data }} -->

    <div v-if="stayStore.data?.data.data.length">
      <div class="w-full overflow-x-auto mt-4">
        <table class="w-full">
          <thead>
            <tr
              class="w-full bg-slate-100 dark:bg-slate-500 font-Kantumruy text-nowrap text-slate-500 uppercase"
            >
              <td class="px-3 py-2 text-left">ID</td>

              <td class="px-3 py-2 text-left">Build</td>
              <td class="px-3 py-2 text-left">Room Num</td>
              <td class="px-3 py-2 text-left">Start Date</td>
              <td class="px-3 py-2 text-left">Last Date</td>
              <td class="px-3 py-2 text-center">Status</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in stayStore.data?.data.data"
              :key="index"
              class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
            >
              <td class="px-3 py-2 font-Kantumruy text-slate-500">{{ index + 1 }}</td>

              <td class="px-3 py-2 font-Kantumruy text-slate-500 capitalize">
                {{ item.room.building.name ?? 'N/A' }} | {{ item.room.building.gender ?? 'N/A' }}
              </td>
              <td class="px-3 py-2 font-Kantumruy text-slate-500">
                {{ item.room.room_number ?? 'N/A' }}
              </td>
              <td class="px-3 py-2 font-Kantumruy text-slate-500">
                {{ item.start_date ?? 'N/A' }}
              </td>
              <td
                class="px-3 py-2 font-Kantumruy"
                :class="item.end_date ? 'text-slate-500' : 'text-blue-500'"
              >
                {{ item.end_date ?? 'កំពង់ស្នាក់នៅ' }}
              </td>

              <td class="px-3 py-2 font-Kantumruy text-slate-500 text-center">
                <!--  -->
                <span
                  class="px-2 py-1.5 rounded-full border text-xs capitalize font-medium"
                  :class="
                    item.status === 'active'
                      ? 'bg-green-600 border-green-700 text-white'
                      : 'bg-red-600 border-red-700 text-white'
                  "
                  >{{ item.status }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--  -->
      <hr class="text-slate-300" />
    </div>

    <!-- Block loading -->
    <div v-if="stayStore.isLoading" class="w-full p-6 flex justify-center items-center">
      <div class="w-10 h-10 flex justify-center items-center gap-1">
        <component :is="Loading" />
      </div>
    </div>
    <!-- End Block loading -->

    <!-- Block data empty -->
    <div
      v-else-if="stayStore.data?.data.data.length == 0 && !stayStore.isLoading"
      class="w-full flex justify-center items-center p-4"
    >
      <not-data />
    </div>
    <!-- End Block data empty -->

    <!-- Pagination Block code control -->
    <div
      v-if="stayStore.data?.data.data.length"
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
            stayStore.getStaysByIdStudent(
              Number(route.params.id),
              stayStore.search,
              stayStore.per_page,
              stayStore.page,
            )
          "
        >
          <input
            type="number"
            v-model="stayStore.per_page"
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
          :disabled="stayStore.data.data.current_page <= 1"
          @click="
            stayStore.getStaysByIdStudent(
              Number(route.params.id),
              stayStore.search,
              stayStore.per_page,
              stayStore.data.data.current_page - 1,
            )
          "
          :class="
            stayStore.data.data.current_page <= 1
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
            :disabled="stayStore.data.data.current_page == page"
            @click="
              stayStore.getStaysByIdStudent(
                Number(route.params.id),
                stayStore.search,
                stayStore.per_page,
                Number(page),
              )
            "
            :class="
              stayStore.data.data.current_page == page
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
          :disabled="stayStore.data.data.current_page >= stayStore.data.data.last_page"
          @click="
            stayStore.getStaysByIdStudent(
              Number(route.params.id),
              stayStore.search,
              stayStore.per_page,
              stayStore.data.data.current_page + 1,
            )
          "
          :class="
            stayStore.data.data.current_page >= stayStore.data.data.last_page
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
