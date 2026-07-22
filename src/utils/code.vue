<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import logo from '@/assets/images/logo.jpg'

import AdminLayouts from '@/layouts/AdminLayouts.vue'

const pdfSection = ref<HTMLElement | null>(null)

const students = ref([
  { name: 'សុខ វិបុល', gender: 'ប្រុស', score: 95.5, grade: 'A' },
  { name: 'ចាន់ ធារី', gender: 'ស្រី', score: 88.0, grade: 'B' },
  { name: 'មាស សុភ័ក្ត្រ', gender: 'ប្រុស', score: 72.4, grade: 'C' },
  { name: 'សួង ចាន់ណា', gender: 'ស្រី', score: 45.0, grade: 'F' },
  { name: 'កែវ មុនី', gender: 'ប្រុស', score: 82.3, grade: 'B' },
])

const formatDate = () => {
  return new Date().toLocaleString('km-KH')
}

const exportToPDF = async () => {
  try {
    const element = pdfSection.value

    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = 210
    const pdfHeight = 297

    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)

    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight

      pdf.addPage()

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)

      heightLeft -= pdfHeight
    }

    pdf.save(`Student-Report-${Date.now()}.pdf`)
  } catch (error) {
    console.log(error)
  }
}

// ​export to excel
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const exportToExcel = async () => {
  try {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet('Student Report', {
      pageSetup: {
        paperSize: 9, // A4
        orientation: 'portrait',
      },
    })

    // Column Width
    worksheet.columns = [{ width: 10 }, { width: 35 }, { width: 15 }, { width: 20 }, { width: 15 }]

    // ===== Header =====
    worksheet.mergeCells('A1:E1')
    worksheet.getCell('A1').value = 'វិទ្យាល័យបច្ចេកវិទ្យាភ្នំពេញ'

    worksheet.getCell('A1').font = {
      size: 18,
      bold: true,
    }

    worksheet.getCell('A1').alignment = {
      horizontal: 'center',
      vertical: 'middle',
    }

    worksheet.mergeCells('A2:E2')

    worksheet.getCell('A2').value = 'របាយការណ៍លទ្ធផលការសិក្សា'

    worksheet.getCell('A2').font = {
      size: 16,
      bold: true,
    }

    worksheet.getCell('A2').alignment = {
      horizontal: 'center',
    }

    worksheet.addRow([])

    // ===== Table Header =====
    const headerRow = worksheet.addRow(['ល.រ', 'ឈ្មោះ', 'ភេទ', 'ពិន្ទុ', 'និទ្ទេស'])

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: {
          argb: 'FFFFFFFF',
        },
      }

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '1E3A8A',
        },
      }

      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      }

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
      }
    })

    // ===== Student Data =====
    students.value.forEach((student, index) => {
      const row = worksheet.addRow([
        index + 1,
        student.name,
        student.gender,
        student.score,
        student.grade,
      ])

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' },
        }

        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
        }
      })

      // Left align student name
      row.getCell(2).alignment = {
        horizontal: 'left',
      }
    })

    worksheet.addRow([])

    // ===== Footer =====
    const footerRow = worksheet.addRow([`បោះពុម្ព៖ ${formatDate()}`])

    worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number}`)

    footerRow.getCell(1).alignment = {
      horizontal: 'left',
    }

    // ===== Export =====
    const buffer = await workbook.xlsx.writeBuffer()

    saveAs(new Blob([buffer]), `Student-Report-${Date.now()}.xlsx`)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <AdminLayouts>
    <div class="min-h-screen p-2" style="background: #f1f5f9">
      <!-- Header Action -->
      <div class="mb-2 flex justify-end">
        <button
          @click="exportToPDF"
          class="rounded-lg px-5 py-2 text-white transition"
          style="background: #059669"
        >
          Export PDF
        </button>

        <button
          @click="exportToExcel"
          class="ml-2 rounded-lg px-5 py-2 text-white transition"
          style="background: #059669"
        >
          Export Excel
        </button>
      </div>

      <!-- PDF Container -->
      <div class="flex justify-center overflow-auto">
        <div ref="pdfSection" class="pdf-page">
          <!-- School Header -->
          <div class="header">
            <div class="block-logo">
              <img :src="logo" alt="" class="logo" />
              <div>
                <h1 class="school-name">វិទ្យាល័យបច្ចេកវិទ្យាភ្នំពេញ</h1>

                <p class="school-en">Phnom Penh Technology High School</p>
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
                <th>ពិន្ទុ</th>
                <th>និទ្ទេស</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(student, index) in students" :key="index">
                <td>{{ index + 1 }}</td>

                <td class="text-left">
                  {{ student.name }}
                </td>

                <td>
                  {{ student.gender }}
                </td>

                <td>
                  {{ student.score }}
                </td>

                <td class="grade">
                  {{ student.grade }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Footer -->
          <div class="footer">
            <div>
              <p>បោះពុម្ព៖ {{ formatDate() }}</p>
            </div>

            <div class="signature">
              <p>ថ្ងៃទី........ខែ........ឆ្នាំ........</p>

              <h3>នាយកសាលា</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayouts>
</template>

<style scoped>
.block-logo {
  flex: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.logo {
  width: 80px;
}
.pdf-page {
  width: 210mm;
  min-height: 297mm;

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
  align-items: flex-start;

  margin-bottom: 40px;
}

.school-name {
  font-size: 28px;
  font-weight: bold;

  color: #1e3a8a;

  margin-bottom: 5px;
}

.school-en {
  font-size: 14px;

  color: #64748b;
}

.kingdom {
  text-align: center;

  font-size: 14px;
  font-weight: bold;

  line-height: 1.8;
}

.title-section {
  text-align: center;

  margin-bottom: 40px;
}

.title-section h2 {
  font-size: 26px;
  font-weight: bold;
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
