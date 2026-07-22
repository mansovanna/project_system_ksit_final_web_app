<script setup lang="ts">
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { LogoSchool } from '@/stores/Icons'

const downloadPDF = async () => {
  const element = document.getElementById('pdf-content')
  const canvas = await html2canvas(element as HTMLElement, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF('l', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pdfWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pdfHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight // negative offset pushes image up
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight
  }

  pdf.save('report.pdf')
}
</script>

<template>
  <div class="p-5">
    <button @click="downloadPDF" class="bg-red-500 text-white px-4 py-2 rounded">
      Download PDF
    </button>

    <!-- PDF CONTENT -->
    <div id="pdf-content" class="bg-white p-10 min-w-full">
      <!-- Header -->
      <div class="flex items-center justify-between border-b pb-4">
        <div class="flex items-center gap-3">
          <img :src="LogoSchool" class="w-20 h-20 object-cover" />

          <div>
            <h1 class="text-3xl font-bold">PV Company</h1>

            <p>Phnom Penh Cambodia</p>
          </div>
        </div>

        <div>
          <p>Date: 10/05/2026</p>
        </div>
      </div>

      <!-- Title -->
      <div class="my-5">
        <h2 class="text-2xl font-bold text-center">Product Report</h2>
      </div>

      <!-- Table -->
      <table class="w-full border-collapse border">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">ID</th>
            <th class="border p-2">Name</th>
            <th class="border p-2">Price</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in 10" :key="item">
            <td class="border p-2">{{ item }}</td>
            <td class="border p-2">Product {{ item }}</td>
            <td class="border p-2">$100</td>
          </tr>
        </tbody>
      </table>

      <!-- Footer -->
      <div class="mt-10 text-center text-sm">© 2026 PV Company</div>
    </div>
  </div>
</template>
