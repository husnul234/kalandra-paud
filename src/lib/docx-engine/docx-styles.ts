import {
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  Paragraph,
  TextRun,
  PageNumber,
  type ITableBordersOptions,
} from 'docx';

/**
 * Standard Margins (in dxa: 1 cm = 567 dxa, 1 inch = 1440 dxa).
 * Format Resmi Administrasi Pemerintahan & Pendidikan Indonesia:
 * Kiri: 3 cm (1701 dxa)
 * Atas: 2.5 cm (1417 dxa)
 * Kanan: 2 cm (1134 dxa)
 * Bawah: 2.5 cm (1417 dxa)
 */
export const DOCX_PAGE_MARGINS = {
  top: 1417,
  right: 1134,
  bottom: 1417,
  left: 1701,
};

export const DOCX_PAGE_SIZE = {
  A4: {
    width: 11906, // 210mm
    height: 16838, // 297mm
  },
  F4_FOLIO: {
    width: 12240, // 215mm
    height: 18720, // 330mm
  },
};

export const DOCX_FONTS = {
  primary: 'Calibri',
  serif: 'Times New Roman',
  modern: 'Arial',
};

export const DOCX_COLORS = {
  primaryNavy: '1E3A8A', // Deep Ocean Navy (#1E3A8A)
  headerBlue: '1E40AF',  // Royal Blue
  accentAmber: 'D97706', // Warm Amber
  freshEmerald: '059669',// Sage Emerald
  darkText: '0F172A',    // Slate 900
  bodyText: '334155',    // Slate 700
  mutedText: '64748B',   // Slate 500
  borderDark: '94A3B8',  // Slate 400
  borderLight: 'CBD5E1', // Slate 300
  zebraLight: 'F8FAFC',  // Slate 50
  tableHeaderBg: '1E3A8A', // Table header navy
  tableHeaderColor: 'FFFFFF',
  subHeaderBg: 'F1F5F9', // Light gray table section
  accentSubHeaderBg: 'EFF6FF', // Light blue section
};

export const DOCX_TABLE_BORDERS: ITableBordersOptions = {
  top: { style: BorderStyle.SINGLE, size: 6, color: DOCX_COLORS.borderDark },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: DOCX_COLORS.borderDark },
  left: { style: BorderStyle.SINGLE, size: 6, color: DOCX_COLORS.borderDark },
  right: { style: BorderStyle.SINGLE, size: 6, color: DOCX_COLORS.borderDark },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: DOCX_COLORS.borderLight },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: DOCX_COLORS.borderLight },
};

/**
 * Standard Header: Document Title on right side in subtle grey
 */
export function createDocumentHeader(schoolName: string, titleText: string): Header {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `${schoolName} — ${titleText}`,
            size: 16, // 8pt
            color: DOCX_COLORS.mutedText,
            font: DOCX_FONTS.primary,
            italics: true,
          }),
        ],
      }),
    ],
  });
}

/**
 * Standard Footer: "Halaman X dari Y" on right side
 */
export function createDocumentFooter(systemWatermark?: string): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          ...(systemWatermark
            ? [
                new TextRun({
                  text: `${systemWatermark} | `,
                  size: 16,
                  color: DOCX_COLORS.mutedText,
                  font: DOCX_FONTS.primary,
                }),
              ]
            : []),
          new TextRun({
            text: 'Halaman ',
            size: 16,
            color: DOCX_COLORS.mutedText,
            font: DOCX_FONTS.primary,
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16,
            color: DOCX_COLORS.mutedText,
            font: DOCX_FONTS.primary,
          }),
          new TextRun({
            text: ' dari ',
            size: 16,
            color: DOCX_COLORS.mutedText,
            font: DOCX_FONTS.primary,
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 16,
            color: DOCX_COLORS.mutedText,
            font: DOCX_FONTS.primary,
          }),
        ],
      }),
    ],
  });
}
