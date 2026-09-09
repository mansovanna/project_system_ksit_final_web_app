<script setup lang="ts">
import logo from '@/assets/images/logo.jpg'
import { useReportStudent } from '@/stores/report_student_store'
import export_service from '@/utils/export_service2'
import { ref } from 'vue'

const reportStudents = useReportStudent()
const isLoading = ref(false)

const handleExport = async () => {
  isLoading.value = true
  try {
    await export_service.export_student_report('pdf', 'student-report.pdf')
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
        @click="handleExport"
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
  padding: 15mm 12mm;
  background: #ffffff;
  color: #000000;
  box-sizing: border-box;
  font-family: 'Kantumruy Pro', sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* ===== HEADER ===== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 12px;
  border-bottom: 2px solid #1e3a8a;
  margin-bottom: 20px;
}

.block-logo {
  display: flex;
  flex-direction: row; /* logo + text side by side, not stacked */
  align-items: center;
  gap: 14px;
}

.block-logo img.logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.block-logo > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* left align, not center */
  gap: 2px;
}

.school-name {
  font-size: 15px;
  font-family: 'Khmer OS Muol Light', sans-serif;
  color: #1e3a8a;
  line-height: 1.4;
}

.school-en {
  font-size: 12px;
  font-family: 'Times New Roman', Times, serif;
  color: #64748b;
  letter-spacing: 0.3px;
}

.kingdom {
  text-align: center;
  font-family: 'Khmer OS Muol', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #1e3a8a;
  padding-top: 4px;
}

/* ===== TITLE ===== */
.title-section {
  text-align: center;
  margin: 10px 0 20px;
}

.title-section h2 {
  font-size: 18px;
  font-family: 'Khmer OS Muol', sans-serif;
  color: #1e3a8a;
  display: inline-block;
  padding-bottom: 6px;
  border-bottom: 3px solid #059669;
}

/* ===== TABLE ===== */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 13px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

thead {
  background: #1e3a8a;
  color: white;
}

th {
  padding: 10px 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

td {
  border: 1px solid #e2e8f0;
  padding: 8px;
  text-align: center;
  font-size: 13px;
  color: #1e293b;
}

th {
  border: 1px solid #1e3a8a;
}

tbody tr:nth-child(even) {
  background: #f8fafc;
}

tbody tr:hover {
  background: #eef2ff;
}

.grade {
  font-weight: 600;
  color: #1e3a8a;
}

.text-left {
  text-align: left;
  padding-left: 14px;
}

/* ===== FOOTER ===== */
.footer {
  margin-top: 60px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 12px;
  color: #475569;
}

.signature {
  text-align: center;
}

.signature p {
  margin-bottom: 60px;
}

.signature h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Khmer OS Muol Light', sans-serif;
}

@media print {
  .pdf-page {
    box-shadow: none;
  }
}
</style>
