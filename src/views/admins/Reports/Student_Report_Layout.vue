<script setup lang="ts">
import logo from '@/assets/images/logo.jpg'
import { useReportStudent } from '@/stores/report_student_store'
// import export_serivce from '@/utils/export_serivce'
import { ref } from 'vue'

const reportStudents = useReportStudent()

const isLoading = ref()

const hadleExport = async () => {
  isLoading.value = true
  try {
    // await export_serivce.export_student_report()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div class="min-h-screen p-2" style="background: #f1f5f9">
    <!-- Header Action -->
    <div class="mb-2 flex justify-end">
      <button
        @click="hadleExport"
        class="rounded-lg px-5 py-2 text-white transition"
        style="background: #059669"
      >
        {{ isLoading ? 'Loading...' : 'Export PDF' }}
      </button>
    </div>

    <!-- PDF Container -->
    <div class="flex justify-center">
      <div id="pdf" ref="pdf" class="pdf-page">
        <!-- School Header -->
        <div class="header">
          <div class="block-logo">
            <img :src="logo" alt="" class="logo" />
            <div>
              <h1 class="school-name">វិទ្យាស្ថានបច្ចេកវិទ្យាកំពង់ស្ពឺ</h1>

              <p class="school-en">Kampong Speu Institute of Technology</p>
            </div>
          </div>

          <div class="kingdom">
            <p>ព្រះរាជាណាចក្រកម្ពុជា</p>
            <p>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
          </div>
        </div>

        <!-- Title -->
        <div class="title-section">
          <h2>របាយការណ៍លទ្ធផលការសិក្សា</h2>
        </div>

        <!-- Table -->
        <table>
          <thead>
            <tr>
              <th>ល.រ</th>
              <th class="text-left">ឈ្មោះ</th>
              <th>ភេទ</th>
              <th>ថ្ងៃខែឆ្នាំកំណើត</th>
              <th>កម្រិតសិក្សារ</th>
              <th>ជំនាញ</th>
              <th>ឆ្នាំ</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in reportStudents.data?.data.data" :key="index">
              <td>{{ index + 1 }}</td>

              <td class="text-left">
                {{ item.first_name + ' ' + item.last_name }}
              </td>

              <td>
                {{ item.gender }}
              </td>

              <td>
                {{ item.info?.date_of_birth }}
              </td>

              <td class="grade">
                {{ item.info?.level }}
              </td>
              <td>
                {{ item.info?.major }}
              </td>
              <td>
                {{ item.info?.year }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
          <div>
            <p>បោះពុម្ព៖......</p>
          </div>

          <div class="signature">
            <p>ថ្ងៃទី........ខែ........ឆ្នាំ........</p>

            <h3>នាយកសាលា</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.block-logo {
  display: flex;
  flex-direction: column;
  flex: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.block-logo > div {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  font-weight: 700;
  font-size: 16px;
  flex-direction: column;
}
.logo {
  width: 90px;
}
.pdf-page {
  width: 297mm;
  min-height: 210mm;
  padding: 10mm;
  background: #ffffff;
  color: #000000;

  box-sizing: border-box;

  font-family: 'Kantumruy Pro', sans-serif;

  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.school-name {
  font-size: 16px;
  /* font-weight: bold; */
  font-family: Khmer OS Muol Light;

  color: #1e3a8a;

  margin-bottom: 5px;
}

.school-en {
  font-size: 14px;
  font-family: 'Times New Roman', Times, serif;
  color: #64748b;
}

.kingdom {
  text-align: center;
  font-family: Khmer os Moul;
  font-size: 16px;
  /* font-weight: bold; */

  line-height: 1.8;
}

.title-section {
  text-align: center;
  font-family: Khmer os Moul;
  margin-bottom: 5px;
}

.title-section h2 {
  font-size: 16px;
  /* font-weight: bold; */
  color: #1e3a8a;
}

table {
  width: 100%;

  border-collapse: collapse;

  margin-top: 20px;
}

thead {
  background: #1e3a8a;
  color: white;
}

th,
td {
  border: 1px solid #cbd5e1;

  padding: 12px;

  text-align: center;

  font-size: 14px;
}

tbody tr:nth-child(even) {
  background: #f8fafc;
}

.grade {
  font-weight: bold;
}

.text-left {
  text-align: left;
}

.footer {
  margin-top: 80px;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  font-size: 13px;

  color: #475569;
}

.signature {
  text-align: center;
}

.signature p {
  margin-bottom: 80px;
}

.signature h3 {
  font-size: 18px;
  font-weight: bold;

  color: #000000;
}

@media print {
  .pdf-page {
    box-shadow: none;
  }
}
</style>
