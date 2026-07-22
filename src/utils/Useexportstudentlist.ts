// composables/useExportStudentList.ts
// Install: npm install docx file-saver
// Types:   npm install -D @types/file-saver

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
} from 'docx'
import { saveAs } from 'file-saver'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface StudentRecord {
  no: number
  studentId: string
  fullName: string
  major: string
  classGroup: string
  dob: string
  address: string
  notes?: string
  status?: string
}

// ─────────────────────────────────────────────
// Column layout (A4 landscape, 0.5-inch margins)
// Total content width ≈ 12958 DXA
// ─────────────────────────────────────────────
const COL_WIDTHS = {
  no: 600,
  studentId: 1200,
  fullName: 2000,
  major: 2000,
  classGroup: 1200,
  dob: 1300,
  address: 2000,
  notes: 1800,
  status: 858,
} as const

const TABLE_WIDTH = Object.values(COL_WIDTHS).reduce((a, b) => a + b, 0)

const HEADERS = [
  { key: 'no' as const, label: 'លរ' },
  { key: 'studentId' as const, label: 'លេខសម្គាល់' },
  { key: 'fullName' as const, label: 'នាមត្រកូល និងនាមខ្លួន' },
  { key: 'major' as const, label: 'ឯកទេស/ជំនាញ' },
  { key: 'classGroup' as const, label: 'ថ្នាក់/ក្រុម' },
  { key: 'dob' as const, label: 'ថ្ងៃខែឆ្នាំ​កំណើត' },
  { key: 'address' as const, label: 'អាសយដ្ឋាន' },
  { key: 'notes' as const, label: 'កត់សម្គាល់' },
  { key: 'status' as const, label: 'ស្ថានភាព' },
] as const

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const GREEN_BORDER = { style: BorderStyle.SINGLE, size: 6, color: '2E7D32' }
const ALL_BORDERS = {
  top: GREEN_BORDER,
  bottom: GREEN_BORDER,
  left: GREEN_BORDER,
  right: GREEN_BORDER,
}
const NO_BORDERS = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
  insideH: { style: BorderStyle.NONE },
  insideV: { style: BorderStyle.NONE },
}

function kCell(
  text: string,
  colKey: keyof typeof COL_WIDTHS,
  opts: { header?: boolean; center?: boolean } = {},
): TableCell {
  return new TableCell({
    borders: ALL_BORDERS,
    width: { size: COL_WIDTHS[colKey], type: WidthType.DXA },
    shading: {
      fill: opts.header ? 'C6EFCE' : 'FFFFFF',
      type: ShadingType.CLEAR,
    },
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text ?? '',
            font: 'Khmer OS Siemreap',
            size: opts.header ? 20 : 18,
            bold: opts.header,
          }),
        ],
      }),
    ],
  })
}

function kParagraph(
  text: string,
  opts: {
    align?: (typeof AlignmentType)[keyof typeof AlignmentType]
    bold?: boolean
    size?: number
    spaceBefore?: number
    spaceAfter?: number
  } = {},
): Paragraph {
  return new Paragraph({
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing: { before: opts.spaceBefore ?? 0, after: opts.spaceAfter ?? 0 },
    children: [
      new TextRun({
        text,
        font: 'Khmer OS Siemreap',
        size: opts.size ?? 22,
        bold: opts.bold ?? false,
      }),
    ],
  })
}

function noBorderCell(width: number, children: Paragraph[]): TableCell {
  return new TableCell({
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    width: { size: width, type: WidthType.DXA },
    children,
  })
}

// ─────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────
export function useExportStudentList() {
  /**
   * Export students to a DOCX matching the KST form layout.
   *
   * @param students  Array of StudentRecord from your Pinia store / API
   * @param fileName  Output filename (default: 'student-list.docx')
   */
  async function exportToDocx(
    students: StudentRecord[],
    fileName = 'student-list.docx',
  ): Promise<void> {
    const half = Math.floor(TABLE_WIDTH / 2)
    const otherHalf = TABLE_WIDTH - half

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                // A4 Landscape — pass portrait dimensions; docx-js swaps them
                width: 16838,
                height: 11906,
              },
              margin: { top: 720, right: 720, bottom: 720, left: 720 },
            },
          },
          children: [
            // ── Letterhead row ────────────────────────────────────────────
            new Table({
              width: { size: TABLE_WIDTH, type: WidthType.DXA },
              columnWidths: [half, otherHalf],
              borders: NO_BORDERS,
              rows: [
                new TableRow({
                  children: [
                    noBorderCell(half, [
                      kParagraph('វិទ្យាស្ថានបច្ចេកវិទ្យាកំពង់ស្ពឺ', { bold: true, size: 24 }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Kompong Spue Instituts of Technology',
                            font: 'Arial',
                            size: 18,
                          }),
                        ],
                      }),
                    ]),
                    noBorderCell(otherHalf, [
                      kParagraph('ព្រះរាជាណាចក្រកម្ពុជា', {
                        align: AlignmentType.RIGHT,
                        size: 20,
                      }),
                      kParagraph('ជាតិ សាសនា ព្រះមហាក្សត្រ', {
                        align: AlignmentType.RIGHT,
                        size: 20,
                      }),
                    ]),
                  ],
                }),
              ],
            }),

            // ── Title ─────────────────────────────────────────────────────
            kParagraph('បញ្ជីរាយនាមសិស្សនិស្សិត', {
              align: AlignmentType.CENTER,
              bold: true,
              size: 26,
              spaceBefore: 200,
              spaceAfter: 160,
            }),

            // ── Data table ────────────────────────────────────────────────
            new Table({
              width: { size: TABLE_WIDTH, type: WidthType.DXA },
              columnWidths: Object.values(COL_WIDTHS),
              rows: [
                // Header
                new TableRow({
                  tableHeader: true,
                  children: HEADERS.map(({ key, label }) =>
                    kCell(label, key, { header: true, center: true }),
                  ),
                }),
                // Data rows
                ...students.map(
                  (s) =>
                    new TableRow({
                      children: [
                        kCell(String(s.no), 'no', { center: true }),
                        kCell(s.studentId, 'studentId'),
                        kCell(s.fullName, 'fullName'),
                        kCell(s.major, 'major'),
                        kCell(s.classGroup, 'classGroup'),
                        kCell(s.dob, 'dob', { center: true }),
                        kCell(s.address, 'address'),
                        kCell(s.notes ?? '', 'notes'),
                        kCell(s.status ?? '', 'status'),
                      ],
                    }),
                ),
              ],
            }),

            // Spacing before signatures
            new Paragraph({ spacing: { before: 400 }, children: [] }),

            // ── Signature row ─────────────────────────────────────────────
            new Table({
              width: { size: TABLE_WIDTH, type: WidthType.DXA },
              columnWidths: [half, otherHalf],
              borders: NO_BORDERS,
              rows: [
                new TableRow({
                  children: [
                    noBorderCell(half, [
                      kParagraph('ឯកភាព', {
                        align: AlignmentType.CENTER,
                        bold: true,
                        size: 22,
                      }),
                      kParagraph('និង​ឯកភាពការជោយ', {
                        align: AlignmentType.CENTER,
                        size: 20,
                      }),
                    ]),
                    noBorderCell(otherHalf, [
                      kParagraph('កំពង់ស្ពឺ............ថ្ងៃ..........ខែ..........ឆ្នាំ២៥៦....', {
                        align: AlignmentType.RIGHT,
                        size: 18,
                      }),
                      kParagraph('ក្រុមមើលថ្ងៃ......ថ្ងៃ.........ខែ២០២........', {
                        align: AlignmentType.RIGHT,
                        size: 18,
                      }),
                      new Paragraph({ spacing: { before: 100 }, children: [] }),
                      kParagraph('ឡើងចំនួន​ច្រើន', {
                        align: AlignmentType.RIGHT,
                        bold: true,
                        size: 22,
                      }),
                    ]),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, fileName)
  }

  return { exportToDocx }
}
