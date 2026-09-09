import html2pdf from 'html2pdf.js'

export async function export_student_report(
  elementId: string = 'pdf',
  filename: string = 'student-report.pdf',
) {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  const options = {
    margin: 0,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2, // higher = sharper text, bigger file
      useCORS: true, // needed since you're loading a local logo image
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'landscape' as const,
    },
  } as const

  await html2pdf().set(options).from(element).save()
}

export default { export_student_report }
