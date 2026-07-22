<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'
import { LogoSchool } from '@/stores/Icons'
import type { User } from '@/models/UserModel'
import Loading from '@/widgets/Loading.vue'

defineEmits(['close'])

const reportTableRef = ref<HTMLElement | null>(null)

const props = defineProps<{
  data: User[]
}>()

const place = 'កំពង់ស្ពឺ'
const day = '០៧'
const month = 'កក្កដា'
const year = '២០២៦'
const signerRole = 'នាយកវិទ្យាស្ថាន'
const signerName = 'ឈ្មោះ នាយក'

// const totalAmount = computed(() =>
//   payments.value.reduce((sum, item) => sum + Number(item.amount), 0),
// )

function formatCurrency(value: number) {
  return '$ ' + Number(value).toFixed(2)
}

const isLoading = ref(false)
async function downloadPdf() {
  if (!reportTableRef.value) return

  await document.fonts.ready

  const el = reportTableRef.value

  const options = {
    margin: 0,
    filename: 'payment-report-landscape.pdf',
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
    // ប្តូរត្រង់នេះ
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
          <h2 style="font-family: 'Moul', serif">បញ្ជីរាយនាមសិស្សនិស្សិស្នាក់នៅអន្តេវាសិកដ្ឋាន</h2>
        </div>

        <!-- ================= TABLE ================= -->
        <table class="payment-table">
          <colgroup>
            <col style="width: 6%" />
            <col style="width: 22%" />
            <col style="width: 22%" />
            <col style="width: 8%" />
            <col style="width: 14%" />
            <col style="width: 14%" />
            <col style="width: 18%" />
            <col style="width: 8%" />
            <col style="width: 12%" />
          </colgroup>

          <thead>
            <tr>
              <th><div class="cell">ល.រ</div></th>
              <th><div class="cell">ឈ្មោះសិស្ស</div></th>
              <th><div class="cell">ឈ្មោះជាអង់គ្លេស</div></th>
              <th><div class="cell">ប្រភេទ</div></th>
              <th><div class="cell">ថ្ងៃខែឆ្នាំកំណើត</div></th>
              <th><div class="cell">លេខទូរស័ព្ទ</div></th>
              <th><div class="cell">ជំនាញ</div></th>
              <th><div class="cell">ឆ្នាំទី</div></th>
              <th><div class="cell">ស្ថានភាព</div></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in data" :key="index">
              <td>
                <div class="cell">{{ index + 1 }}</div>
              </td>
              <td>
                <div class="cell">{{ item.first_name }} {{ item.last_name }}</div>
              </td>
              <td>
                <div class="cell">{{ item.user_name }}</div>
              </td>
              <td>
                <div class="cell">{{ item.gender }}</div>
              </td>
              <td>
                <div class="cell right">{{ item.info?.date_of_birth }}</div>
              </td>
              <td>
                <div class="cell">{{ item.phone_number }}</div>
              </td>
              <td>
                <div class="cell">{{ item.info?.major }}</div>
              </td>
              <td>
                <div class="cell">{{ item.info?.year }}</div>
              </td>
              <td>
                <div class="cell">{{ item.status }}</div>
              </td>
            </tr>
          </tbody>

          <tfoot v-if="false">
            <tr>
              <td colspan="4"><div class="cell right">សរុប</div></td>
              <td>
                <div class="cell right">{{ 'formatCurrency(totalAmount)' }}</div>
              </td>
              <td colspan="2"><div class="cell"></div></td>
            </tr>
          </tfoot>
        </table>

        <!-- ================= FOOTER ================= -->
        <footer class="footer">
          <div class="signature">
            <p>ធ្វើនៅ {{ place }}</p>
            <p>ថ្ងៃទី {{ day }} ខែ {{ month }} ឆ្នាំ {{ year }}</p>
            <div class="signature-space"></div>
            <p>{{ signerRole }}</p>
            <div class="signature-space small"></div>
            <strong>{{ signerName }}</strong>
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
  margin: 0 auto; /* centers only when the viewport is wide enough */
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  width: 90px;
}

.logo {
  width: 80px;
}

.header-center {
  flex: 1;
  text-align: center;
}

.header-right {
  width: 150px;
  text-align: right;
}

.kingdom {
  font-size: 20px;
  /* font-weight: bold; */
}

.motto {
  font-size: 16px;
}

.institute-name {
  font-size: 18px;
  font-weight: bold;
}

.institute-name-en {
  font-size: 14px;
}

.header-line {
  border: none;
  border-top: 1px solid #000;
  margin: 15px 0;
}

.doc-title-block {
  text-align: center;
  margin-bottom: 20px;
}

.payment-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
}

.payment-table thead {
  display: table-header-group; /* repeat header every page */
}

.payment-table tr {
  break-inside: avoid;
  page-break-inside: avoid;
}

.payment-table tfoot {
  break-inside: avoid;
  page-break-inside: avoid;
}

.footer {
  break-inside: avoid;
  page-break-inside: avoid;
}

.payment-table th,
.payment-table td {
  border: 1px solid #808080;
  /* padding: 8px; */
  text-align: center;
  vertical-align: middle;
  line-height: 1.4;
  padding: 0;
  height: 40px;
}
.cell-p {
  padding-bottom: 60px!;
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* padding: 10px 10px 20px 0px; */
  padding-bottom: 20px;
  padding-top: 8px;
  padding-right: 8px;
  padding-left: 8px;
  text-align: center;
}

.cell.right {
  justify-content: flex-end;
}

.payment-table th {
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

.signature {
  width: 250px;
  text-align: center;
}

.signature-space {
  height: 60px;
}

.signature-space.small {
  height: 40px;
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
