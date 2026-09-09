<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'
import { LogoSchool } from '@/stores/Icons'
import Loading from '@/widgets/Loading.vue'

defineEmits(['close'])

const reportTableRef = ref<HTMLElement | null>(null)

// ================= DATA MODEL =================
// Matches the shape returned by `reportStore.data?.data.data` in the
// leave report page (leave_store.getLeaveReports):
// { id, user: { first_name, last_name, user_name, phone_number, info: {...} }, start_date, end_date, reason, status }
interface UserInfo {
  id_card?: string
  level?: string
  major?: string
  year?: string | number
  phone_parent?: string
}

interface LeaveUser {
  first_name?: string
  last_name?: string
  user_name?: string
  phone_number?: string
  profile_photo_url?: string
  info?: UserInfo
}

interface LeaveRow {
  id?: number | string
  user: LeaveUser
  start_date?: string
  end_date?: string
  reason?: string
  status?: 'approved' | 'pending' | 'rejected' | string
}

const props = defineProps<{
  data: LeaveRow[]
}>()

const place = 'កំពង់ស្ពឺ'
const month = '........'
const year = '២០២...'

function formatDate(date: string | null | undefined) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

// Same logic as calculateTotalDays() in the leave report page
function calculateTotalDays(startDate?: string, endDate?: string, inclusive = true) {
  if (!startDate || !endDate) return 0

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < start) return 0

  const diffTime = end.getTime() - start.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return inclusive ? diffDays + 1 : diffDays
}

function statusText(status?: string) {
  if (status === 'approved') return 'អនុម័ត'
  if (status === 'rejected') return 'បដិសេធ'
  return 'កំពុងរង់ចាំ'
}

const isLoading = ref(false)
async function downloadPdf() {
  if (!reportTableRef.value) return

  await document.fonts.ready

  const el = reportTableRef.value

  const options = {
    margin: 0,
    filename: 'leave-report-landscape.pdf',
    image: { type: 'jpeg' as const, quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape' as const,
    },
    pagebreak: { mode: ['css'], avoid: ['tr', 'tfoot', '.footer'] },
  }
  isLoading.value = true
  try {
    await html2pdf().set(options).from(el).save()
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fixed top-0 bottom-0 right-0 left-0 flex flex-col z-50 items-center bg-black/50 p-6">
    <div class="flex gap-3 mb-4">
      <button class="btn" @click="downloadPdf">
        <span v-if="!isLoading">Download PDF</span>
        <div v-else class="flex justify-center items-center gap-2 font-asap">
          <div class="w-5 flex justify-center items-center">
            <Loading />
          </div>
          <span>Loading...</span>
        </div>
      </button>
      <button class="btn-close" @click="$emit('close')">បិទ</button>
    </div>

    <div class="w-full overflow-auto">
      <div ref="reportTableRef" class="pdf-page">
        <!-- ================= HEADER ================= -->
        <header style="display: flex; justify-content: space-between; justify-items: start">
          <div
            style="
              display: flex;
              justify-content: start;
              justify-items: start;
              align-items: center;
              width: 50%;
              gap: 8px;
              margin-top: 0px;
            "
          >
            <div
              style="
                width: 80px;
                height: 80px;
                padding: 2px;
                display: flex;
                justify-content: center;
                justify-items: center;
              "
            >
              <img :src="LogoSchool" crossorigin="anonymous" />
            </div>
            <div>
              <p class="kingdom" style="font-family: 'Moul', serif">
                វិទ្យាស្ថានបច្ចេកវិទ្យាកំពង់ស្ពឺ
              </p>
              <p style="font-family: 'Hanuman', serif; margin-top: 4px" class="institute-name-en">
                Kampong Speu Institute of Technology
              </p>
            </div>
          </div>

          <div
            style="
              font-family: 'Moul', serif;
              display: flex;
              flex-direction: column;
              justify-content: center;
              justify-items: center;
            "
          >
            <p class="kingdom" style="text-align: center">ព្រះរាជាណាចក្រកម្ពុជា</p>

            <p class="kingdom" style="text-align: center; margin-top: 5px">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </p>
            <div
              class="divider-symbol"
              style="display: flex; justify-content: center; justify-items: center"
            >
              ☸
            </div>
          </div>
        </header>

        <!-- ================= TITLE ================= -->
        <div class="doc-title-block">
          <h2 style="font-family: 'Moul', serif">បញ្ជីច្បាប់ឈប់សម្រាក (Leave Report)</h2>
        </div>

        <!-- ================= TABLE ================= -->
        <table class="leave-table">
          <colgroup>
            <col style="width: 4%" />
            <col style="width: 13%" />
            <col style="width: 17%" />
            <col style="width: 13%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 7%" />
            <col style="width: 15%" />
            <col style="width: 9%" />
          </colgroup>

          <thead>
            <tr>
              <th><div class="cell">ល.រ</div></th>
              <th><div class="cell">លេខកាតសិស្ស</div></th>
              <th><div class="cell">ឈ្មោះសិស្ស</div></th>
              <th><div class="cell">កម្រិត / ជំនាញ</div></th>
              <th><div class="cell">ថ្ងៃចាប់ផ្តើម</div></th>
              <th><div class="cell">ថ្ងៃបញ្ចប់</div></th>
              <th><div class="cell right">ចំនួនថ្ងៃ</div></th>
              <th><div class="cell">មូលហេតុ</div></th>
              <th><div class="cell">សភាពភាព</div></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in data" :key="item.id ?? index">
              <td>
                <div class="cell">{{ index + 1 }}</div>
              </td>
              <td>
                <div class="cell">{{ item.user?.info?.id_card ?? 'N/A' }}</div>
              </td>
              <td>
                <div class="cell">{{ item.user?.first_name }} {{ item.user?.last_name }}</div>
              </td>
              <td>
                <div class="cell">
                  {{ item.user?.info?.level ?? 'N/A' }} - {{ item.user?.info?.major ?? 'N/A' }}
                </div>
              </td>
              <td>
                <div class="cell">{{ formatDate(item.start_date) }}</div>
              </td>
              <td>
                <div class="cell">{{ formatDate(item.end_date) }}</div>
              </td>
              <td>
                <div class="cell right">
                  {{ calculateTotalDays(item.start_date, item.end_date) }}
                </div>
              </td>
              <td>
                <div class="cell">{{ item.reason ?? 'N/A' }}</div>
              </td>
              <td>
                <div class="cell">{{ statusText(item.status) }}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ================= FOOTER ================= -->
        <footer class="footer">
          <div>
            <div style="display: flex; justify-content: center; justify-items: center">
              <p>ធ្វើនៅ {{ place }}</p>
              <p style="padding: 5px"></p>
              <p>ថ្ងៃទី................... ខែ {{ month }} ឆ្នាំ {{ year }}</p>
            </div>

            <div
              style="
                display: flex;
                justify-content: center;
                justify-items: center;
                margin-top: 10px;
              "
            >
              <p>ហត្ថលេខា</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Khmer OS Battambang';
  src:
    url('/fonts/KhmerOSBattambang.woff2') format('woff2'),
    local('Khmer OS Battambang');
  font-display: block;
}

.btn {
  padding: 10px 20px;
  background: #ef4444;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.btn-close {
  padding: 10px 20px;
  background: #6b7280;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.pdf-page {
  width: 277mm;
  min-height: 190mm;
  padding: 8mm;
  background: #fff;
  color: #000;
  box-sizing: border-box;
  font-family: 'Khmer OS Battambang', Arial, sans-serif;
  margin: 0 auto;
}

.doc-title-block {
  text-align: center;
  margin-bottom: 20px;
}

.kingdom {
  font-size: 20px;
}

.institute-name-en {
  font-size: 14px;
}

.leave-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  table-layout: fixed;
}

.leave-table thead {
  display: table-header-group;
}

.leave-table tr {
  break-inside: avoid;
  page-break-inside: avoid;
}

.leave-table tfoot {
  break-inside: avoid;
  page-break-inside: avoid;
}

.footer {
  break-inside: avoid;
  page-break-inside: avoid;
}

.leave-table th,
.leave-table td {
  border: 1px solid #808080;
  text-align: center;
  vertical-align: middle;
  line-height: 1.4;
  padding: 0;
  height: 40px;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 20px;
  padding-top: 8px;
  padding-right: 8px;
  padding-left: 8px;
  text-align: center;
}

.cell.right {
  justify-content: flex-end;
}

.leave-table th {
  background: #eee;
}

.right {
  text-align: right !important;
}

tfoot td {
  font-weight: bold;
}

.footer {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}

@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }

  .pdf-page {
    width: 297mm;
    min-height: 210mm;
  }
}
</style>
