// // export_student_report.ts

// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'

// class ExportService {
//   async export_student_report() {
//     try {
//       const element = document.getElementById('pdf')

//       if (!element) return

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//       })

//       const imgData = canvas.toDataURL('image/png')

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4',
//       })

//       const pdfWidth = pdf.internal.pageSize.getWidth()
//       const pdfHeight = pdf.internal.pageSize.getHeight()

//       const imgWidth = pdfWidth
//       const imgHeight = (canvas.height * imgWidth) / canvas.width

//       let heightLeft = imgHeight
//       let position = 0

//       // First Page
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)

//       heightLeft -= pdfHeight

//       // Multiple Pages
//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight

//         pdf.addPage()

//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)

//         heightLeft -= pdfHeight
//       }

//       // Generate filename
//       const fileName = `Student-Report-${crypto.randomUUID()}.pdf`

//       pdf.save(fileName)
//     } catch (error) {
//       console.error('Export PDF Error:', error)
//     }
//   }
// }

// export default new ExportService()

// utils/export_serivce.ts
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PaymentItem {
  id: number
  user: {
    user_name: string
    profile_photo_url?: string | null
    phone_number?: string | null
    info?: {
      id_card?: string | null
    } | null
  }
  method?: string | null
  created_at: string
  approved_at?: string | null
  approved_by?: string | null
  status?: string | null
  image_url?: string | null
}

function formatDate(date?: string | null): string {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

function escapeCsvValue(value: string | number): string {
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Pure function: builds the CSV string content from rows.
 * Kept separate from the download trigger so it can be unit tested
 * without needing a browser/DOM environment.
 */
export function buildCsvContent(rows: PaymentItem[]): string {
  const headers = [
    'ID',
    'Name',
    'ID Card',
    'Phone',
    'Invoice',
    'Amount',
    'Method',
    'Paid At',
    'Reviewed Date',
    'Reviewed By',
    'Status',
  ]

  const lines = rows.map((item, index) =>
    [
      index + 1,
      item.user?.user_name ?? 'N/A',
      item.user?.info?.id_card ?? 'N/A',
      item.user?.phone_number ?? 'N/A',
      item.image_url ? 'Yes' : 'No',
      20, // amount is hardcoded "20" in the current UI — replace with item.amount once the API exposes it
      item.method ?? 'N/A',
      formatDate(item.created_at),
      formatDate(item.approved_at),
      item.approved_by ?? 'N/A',
      item.status ?? 'N/A',
    ]
      .map(escapeCsvValue)
      .join(','),
  )

  return [headers.join(','), ...lines].join('\r\n')
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/**
 * CSV export — bind in the template as:
 *   @click="() => export_serivce.export_student_report(payStore.data?.data.data ?? [])"
 */
function export_student_report(rows: PaymentItem[]): void {
  if (!rows || rows.length === 0) {
    console.warn('No payment rows to export')
    return
  }

  const csvContent = buildCsvContent(rows)
  // UTF-8 BOM so Excel renders Khmer text (user_name, etc.) correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `payment-report-${Date.now()}.csv`)
}

/**
 * PDF export via html2canvas + jsPDF — captures the actual table DOM,
 * so Khmer text renders correctly without font-embedding into jsPDF.
 *
 * @param elementId - id of the DOM element to capture (e.g. the table wrapper)
 * @param hideSelector - optional CSS selector for elements to hide during capture (e.g. the Actions column)
 */
async function export_payment_pdf(elementId: string, hideSelector = '.export-hide'): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export`)
    return
  }

  // Temporarily hide action buttons/columns during capture
  const hiddenEls = element.querySelectorAll<HTMLElement>(hideSelector)
  hiddenEls.forEach((el) => (el.style.visibility = 'hidden'))

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 40
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 20

    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 40

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 20
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - 40
    }

    pdf.save(`payment-report-${Date.now()}.pdf`)
  } finally {
    hiddenEls.forEach((el) => (el.style.visibility = ''))
  }
}

export default {
  export_student_report,
  export_payment_pdf,
  buildCsvContent,
}
