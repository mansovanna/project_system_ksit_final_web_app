/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const useExportToCSV = defineStore('csv', {
  actions: {
    async exportCSV(data: object[]) {
      if (!data || !data.length) return

      const headers = Object.keys(data[0]!)
      const rows = data.map((item) =>
        headers.map((key) => `"${(item as any)[key] ?? ''}"`).join(','),
      )

      const csvContent = [headers.join(','), ...rows].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'export.csv'
      link.click()

      URL.revokeObjectURL(url)
    },

    async printPDFDocument(data: any[]) {
      if (!data || !data.length) return

      const doc = new jsPDF('p', 'mm', 'a4')

      // =========================
      // HEADER
      // =========================

      // Logo (Base64 or URL)
      const logoUrl = '/logo.png' // put your logo in public folder
      doc.addImage(logoUrl, 'PNG', 15, 10, 25, 25)

      // Company Name
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Huy Yun Agriculture Co., Ltd', 45, 18)

      // Subtitle
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Agricultural Products & Services', 45, 24)
      doc.text('Tel: 012 345 678 | Phnom Penh, Cambodia', 45, 29)

      // Line
      doc.setLineWidth(0.5)
      doc.line(15, 38, 195, 38)

      // =========================
      // TITLE
      // =========================
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('PRODUCT REPORT', 105, 48, { align: 'center' })

      // =========================
      // TABLE
      // =========================
      const headers = Object.keys(data[0]).map((key) => ({
        header: key.toUpperCase(),
        dataKey: key,
      }))

      autoTable(doc, {
        startY: 55,
        head: [headers.map((h) => h.header)],
        body: data.map((row) => headers.map((h) => row[h.dataKey] ?? '')),
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [30, 64, 175], // blue
          textColor: 255,
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
      })

      // =========================
      // FOOTER
      // =========================
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(9)
        doc.text(`Printed on: ${new Date().toLocaleDateString()}`, 15, 290)
        doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: 'right' })
      }

      // =========================
      // PRINT
      // =========================
      doc.autoPrint()
      window.open(doc.output('bloburl'), '_blank')
    },
  },
})
