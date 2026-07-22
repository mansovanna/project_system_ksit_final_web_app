<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import Student_Report_Layout from '@/views/admins/Reports/Student_Report_Layout.vue'
import {
  ArrowSmallUpIcon,
  CSVIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  NotDataSVGICON,
  PrintIcon,
  RefreshIcon,
  SearchIcon,
  ViewIcon,
} from '@/stores/Icons'
import { useReportStudent } from '@/stores/report_student_store'
import Loading from '@/widgets/Loading.vue'
import ExcelJS from 'exceljs'
import { computed, onMounted, ref, watch } from 'vue'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas-pro'
import saveAs from 'file-saver'
import Student_pdf from './report/student_pdf.vue'
import type { User } from '@/models/UserModel.ts'

const avatar = useAvatar()
const resportStore = useReportStudent()

let timer: ReturnType<typeof setTimeout>
watch(
  [
    () => resportStore.search,
    () => resportStore.start_date,
    () => resportStore.end_date,
    () => resportStore.status_options,
    () => resportStore.page,
  ],
  ([search]) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      resportStore.getUsers(
        search,
        resportStore.start_date,
        resportStore.end_date,
        resportStore.status_options,
        resportStore.per_page,
        resportStore.page,
      )
    }, 500)
  },
)

// -----------------------------
const exportExcel = async () => {
  const data = resportStore.data?.data?.data || []

  if (!data.length) {
    alert('No data to export')
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Student Report')

  // ===============================

  worksheet.columns = [
    { header: 'ល.រ', key: 'no', width: 8 },
    { header: 'លេខកាតសិស្ស', key: 'id_card', width: 18 },
    { header: 'នាមត្រកូល', key: 'first_name', width: 25 },
    { header: 'នាមខ្លួន', key: 'last_name', width: 20 },
    { header: 'ឈ្មោះជាភាសាអង់គ្លេស', key: 'user_name', width: 20 },
    { header: 'ថ្ងៃខែឆ្នាំកំណើត', key: 'dob', width: 18 },
    { header: 'លេខទូរស័ព្ទ', key: 'phone', width: 18 },
    { header: 'អាសយដ្ឋាន', key: 'address', width: 30 },
    { header: 'កម្រិតសិក្សារ', key: 'level', width: 15 },
    { header: 'ជំនាញ', key: 'major', width: 20 },
    { header: 'ឆ្នាំ', key: 'year', width: 10 },
  ]

  const totalColumns = worksheet.columns.length

  // ===============================
  // 🎨 HEADER STYLE (ONLY COLUMNS)
  // ===============================
  for (let col = 1; col <= totalColumns; col++) {
    const cell = worksheet.getRow(1).getCell(col)

    cell.font = {
      bold: true,
      size: 13,
      name: 'Battambang',
      color: { argb: 'FFFFFFFF' },
    }

    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    }

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF305496' },
    }

    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
  }

  worksheet.getRow(1).height = 25

  // ===============================
  // 📄 ADD DATA ROWS
  // ===============================
  data.forEach((item: any, index: number) => {
    const row = worksheet.addRow({
      no: index + 1,
      id_card: item.info?.id_card ?? 'Null',
      first_name: item.first_name ?? 'Null',
      last_name: item.last_name ?? 'Null',
      user_name: item.user_name ?? 'Null',
      dob: item.info?.date_of_birth ?? 'Null',
      phone: item.phone_number ?? 'Null',
      address: item.info?.address ?? 'Null',
      level: item.info?.level ?? 'Null',
      major: item.info?.major ?? 'Null',
      year: item.info?.year ?? 'Null',
    })

    // Zebra row color
    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' },
        }
      })
    }

    // Style every cell
    row.eachCell((cell) => {
      worksheet.pageSetup = {
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      }
      cell.font = { name: 'Battambang', size: 12 }

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
  })

  // ===============================
  // 🔎 AUTO FILTER
  // ===============================
  worksheet.autoFilter = {
    from: 'A4',
    to: String.fromCharCode(64 + totalColumns) + '1',
  }

  // ===============================
  // 💾 DOWNLOAD
  // ===============================
  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), 'student_report.xlsx')
}

// Block Pagination -------------------
const pages = computed(() => {
  const current = Number(resportStore.data?.data.current_page) || 1
  const last = Number(resportStore.data?.data.last_page) || 1

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
  //
  resportStore.getUsers(
    resportStore.search,
    resportStore.start_date,
    resportStore.end_date,
    resportStore.status_options,
    resportStore.per_page,
    resportStore.page,
  )
})

const handleReload = () => {
  resportStore.search = ''
  resportStore.start_date = ''
  resportStore.end_date = ''
  resportStore.status_options = 'all'
  resportStore.per_page = 10
  resportStore.page = 1
  // Call getUsers
  resportStore.getUsers(
    resportStore.search,
    resportStore.start_date,
    resportStore.end_date,
    resportStore.status_options,
    resportStore.per_page,
    resportStore.page,
  )
}

const export_payment_pdf = () => {
  const element = document.getElementById('reportTable')

  if (!element) return

  html2pdf()
    .from(element)
    .set({
      filename: 'payment-report.pdf',
    })
    .save()
}

// Block data for export to pdf
const data_export = ref<User[]>([])

const isExportPDF = ref(false)

const handleExportPDF = (data: any) => {
  console.log(data)
  if (!data) return
  data_export.value = data
  isExportPDF.value = true
}
</script>
<template>
  <Student_pdf :data="data_export" v-if="isExportPDF" @close="isExportPDF = false" />
  <AdminLayouts>
    <div class="p-4">
      <!-- Add your admin home content here -->
      <div
        class="w-full p-6 max-md:p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
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
        </div>
        <hr class="text-slate-300 dark:text-slate-600 my-2" />
        <div class="w-full flex justify-between gap-4 max-xl:flex-col max-md:gap-7 mt-2">
          <!-- Search Block -->
          <form @submit.prevent class="w-2/1 max-xl:w-full">
            <div
              class="flex flex-wrap justify-start items-center gap-4 w-full max-md:flex-col max-md:justify-start max-md:items-center"
            >
              <div class="flex w-2/5 max-xl:w-full">
                <div class="relative w-full">
                  <input
                    type="text"
                    v-model="resportStore.search"
                    class="border pl-4 pr-10 py-2 rounded-md dark:text-white border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    placeholder="Search..."
                  />
                  <!-- icon -->
                  <div class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2">
                    <component :is="SearchIcon" class="text-slate-400" />
                  </div>
                </div>
              </div>
              <div class="flex w-1/6 max-xl:w-full">
                <div class="w-full relative">
                  <input
                    type="date"
                    v-model="resportStore.start_date"
                    class="border px-4 py-2 rounded-md dark:text-white border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    placeholder="Search..."
                  />
                  <!-- icon -->
                </div>
              </div>

              <!-- searc last year -->
              <div class="flex w-1/6 max-xl:w-full">
                <div class="w-full relative">
                  <input
                    type="date"
                    v-model="resportStore.end_date"
                    class="border px-4 py-2 rounded-md dark:text-white border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    placeholder="Search..."
                  />
                  <!-- icon -->
                </div>
              </div>

              <!-- search status -->
              <div class="flex w-1/6 max-xl:w-full">
                <div class="w-full relative">
                  <select
                    name="status"
                    id=""
                    v-model="resportStore.status_options"
                    @change="
                      resportStore.getUsers(
                        resportStore.search,
                        resportStore.start_date,
                        resportStore.end_date,
                        resportStore.status_options,
                        resportStore.per_page,
                        resportStore.page,
                      )
                    "
                    class="border capitalize font-medium px-4 py-2.5 dark:text-white dark:bg-slate-800 rounded-md border-slate-300 w-full placeholder:font-Kantumruy placeholder:text-slate-400 text-slate-600 font-Kantumruy focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <option value="all">All</option>
                    <option value="active">active</option>
                    <option value="pending">pending</option>
                    <option value="complete">complete</option>
                    <option value="block">block</option>
                  </select>
                </div>
              </div>

              <!-- Refresh Page -->
            </div>
          </form>
          <!-- ------- -->

          <div class="flex justify-between items-center gap-3">
            <button
              @click="handleReload"
              class="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-400 font-poppins font-medium flex justify-center items-center gap-2"
            >
              <div :class="resportStore.isLoading ? 'animate-spin' : ''">
                <component :is="RefreshIcon" class="text-white" />
              </div>
              <span>Refresh</span>
            </button>
            <div class="flex justify-end items-center gap-3">
              <button
                @click="exportExcel"
                class="p-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-500 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
              >
                CSV
                <component :is="CSVIcon" />
              </button>
              <button
                @click="handleExportPDF(resportStore.data?.data.data ?? [])"
                class="p-2 px-4 bg-warning text-white rounded-md hover:bg-warning/80 font-Kantumruy flex justify-center items-center gap-2 cursor-pointer"
              >
                PDF
                <component :is="PrintIcon" />
              </button>
            </div>
          </div>
        </div>
        <!-- End Search Block -->
      </div>

      <div
        class="bg-white rounded-xl mt-4 p-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
      >
        <div id="reportTable" class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="w-full bg-slate-100 dark:bg-slate-600 font-poppins font-medium text-nowrap text-slate-500 uppercase"
              >
                <td class="px-3 py-2 text-left dark:text-slate-300">No.</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">About User</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Username (EN)</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Date of Birth</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">phone number</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Guardian Phone</td>
                <td class="px-3 py-2 text-left dark:text-slate-300">Address</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Education Level</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Major/Skill</td>
                <td class="px-2 py-2 text-center dark:text-slate-300">Year</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Status</td>
                <td class="px-3 py-2 text-center dark:text-slate-300">Action</td>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in resportStore.data?.data.data"
                :key="index"
                class="border-t border-slate-300 dark:border-slate-600 text-nowrap hover:bg-slate-500/5"
              >
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300 uppercase">
                  {{ index + 1 }}
                </td>

                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  <div class="flex justify-start items-center gap-3">
                    <div class="w-11 h-11">
                      <img
                        :src="
                          item?.profile_photo_url
                            ? item.profile_photo_url
                            : avatar.textToImage(item?.user_name ?? 'User')
                        "
                        alt="avatar"
                        class="w-11 h-11 rounded-full object-cover object-center border border-blue-500 font-Kantumruy flex justify-center items-center"
                      />
                    </div>
                    <div>
                      <span class="font-Kantumruy font-medium">
                        {{ item.first_name ?? 'null' }} {{ item.last_name ?? 'null' }}
                      </span>
                      <span class="text-xs flex justify-start items-center gap-1">
                        <!-- <p>ID Card:</p> -->
                        <p class="font-poppins uppercase font-medium">
                          {{ item.info?.id_card ?? 'N/A' }}
                        </p>
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.user_name ?? 'null' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.info?.date_of_birth ?? 'null' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  <!--  -->
                  {{ item.phone_number ?? 'null' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.info?.phone_parent ?? 'null' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.info?.address ?? 'null' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.info?.level ?? 'N/A' }}
                </td>
                <td class="px-3 py-2 font-Kantumruy text-slate-500 dark:text-slate-300">
                  {{ item.info?.major ?? 'null' }}
                </td>
                <td class="px-1 py-2 font-Kantumruy text-slate-500 dark:text-slate-300 text-center">
                  {{ item.info?.year ?? 'null' }}
                </td>

                <td class="px-3 py-2 text-center">
                  <!--  -->
                  <div class="flex justify-center items-center">
                    <div
                      class="border rounded-full px-3 py-1 font-Kantumruy font-medium capitalize"
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
                      <p class="text-xs font-Kantumruy">{{ item.status ?? 'null' }}</p>
                    </div>
                  </div>
                </td>

                <td class="py-2 text-center">
                  <!--  -->
                  <div class="flex gap-2">
                    <button
                      value="View"
                      @click="
                        $router.push({
                          name: 'users-profile',
                          params: { id: item.id },
                          query: { data: JSON.stringify(item) },
                        })
                      "
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-warning hover:text-white text-warning cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="ViewIcon" />
                    </button>
                    <button
                      value="Delete"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-400 hover:text-white text-red-500 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="DeleteIcon" />
                    </button>
                    <button
                      v-if="item.status === 'pending'"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CloseIcon" />
                    </button>
                    <button
                      v-if="item.status === 'pending'"
                      class="w-10 h-10 flex justify-center items-center rounded-full bg-slate-100 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-green-600 cursor-pointer ease-in-out duration-200"
                    >
                      <component :is="CheckIcon" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Block Check data empty -->
        <div
          v-if="!resportStore.data?.data.data.length"
          class="w-full flex justify-center items-center p-4"
        >
          <!-- <p class="font-poppins text-slate-500">Data is Avialable!</p> -->
          <div>
            <img :src="NotDataSVGICON" alt="" />
          </div>
        </div>
        <!-- End Block Check data empty -->

        <!-- Block loading -->
        <div v-if="resportStore.isLoading" class="w-full flex justify-center items-center p-4">
          <div class="w-10 h-10">
            <Loading />
          </div>
        </div>

        <!--  -->
        <hr class="text-slate-300" />
        <!-- Pagination Block code control -->
        <div
          v-if="resportStore.data?.data.data.length"
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
                resportStore.getUsers(
                  resportStore.search,
                  resportStore.start_date,
                  resportStore.end_date,
                  resportStore.status,
                  resportStore.per_page,
                  resportStore.page,
                )
              "
            >
              <input
                type="number"
                v-model="resportStore.per_page"
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
              :disabled="resportStore.data.data.current_page <= 1"
              @click="
                resportStore.getUsers(
                  resportStore.search,
                  resportStore.start_date,
                  resportStore.end_date,
                  resportStore.status,
                  resportStore.per_page,
                  Number(resportStore.data!.data.current_page) - 1,
                )
              "
              :class="
                resportStore.data.data.current_page <= 1
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
                :disabled="resportStore.data.data.current_page == page"
                @click="
                  resportStore.getUsers(
                    resportStore.search,
                    resportStore.start_date,
                    resportStore.end_date,
                    resportStore.status,
                    resportStore.per_page,
                    Number(page),
                  )
                "
                :class="
                  resportStore.data.data.current_page == page
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
              :disabled="resportStore.data.data.current_page >= resportStore.data.data.last_page"
              @click="
                resportStore.getUsers(
                  resportStore.search,
                  resportStore.start_date,
                  resportStore.end_date,
                  resportStore.status,
                  resportStore.per_page,
                  Number(resportStore.data!.data.current_page) + 1,
                )
              "
              :class="
                resportStore.data.data.current_page >= resportStore.data.data.last_page
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
    </div>

    <!-- Block Content -->
    <div v-if="false" class="p-4">
      <Student_Report_Layout :data="resportStore.data?.data.data" />
    </div>
  </AdminLayouts>
</template>
