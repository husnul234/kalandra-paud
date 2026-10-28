import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ShadingType,
  VerticalAlign,
  BorderStyle,
  HeightRule,
} from 'docx';
import {
  DOCX_COLORS,
  DOCX_FONTS,
  DOCX_PAGE_MARGINS,
  DOCX_PAGE_SIZE,
  DOCX_TABLE_BORDERS,
  createDocumentFooter,
  createDocumentHeader,
} from './docx-styles';
import type { RpmPaudDocData, DocxExportConfig } from './docx-paud-builder';

/**
 * Helper to build standard text or container cell with margins and cantSplit
 */
function createTableCell(
  elements: (Paragraph | Table)[],
  options: {
    widthPercent?: number;
    bgColor?: string;
    verticalAlign?: any;
    isHeader?: boolean;
    colSpan?: number;
    rowSpan?: number;
    borders?: any;
    margins?: { top: number; bottom: number; left: number; right: number };
  } = {}
): TableCell {
  return new TableCell({
    width: options.widthPercent ? { size: options.widthPercent, type: WidthType.PERCENTAGE } : undefined,
    shading: options.bgColor ? { fill: options.bgColor, type: ShadingType.CLEAR } : undefined,
    verticalAlign: options.verticalAlign ?? VerticalAlign.TOP,
    columnSpan: options.colSpan,
    rowSpan: options.rowSpan,
    borders: options.borders,
    margins: options.margins ?? {
      top: 100,
      bottom: 100,
      left: 120,
      right: 120,
    },
    children: elements,
  });
}

function cellPara(
  text: string,
  options: {
    bold?: boolean;
    italics?: boolean;
    size?: number;
    color?: string;
    alignment?: any;
    spaceAfter?: number;
  } = {}
): Paragraph {
  return new Paragraph({
    alignment: options.alignment ?? AlignmentType.LEFT,
    spacing: { after: options.spaceAfter ?? 40, line: 240 },
    children: [
      new TextRun({
        text,
        bold: options.bold,
        italics: options.italics,
        size: options.size ?? 20,
        color: options.color ?? DOCX_COLORS.darkText,
        font: DOCX_FONTS.primary,
      }),
    ],
  });
}

/**
 * Helper to build single-signer signature block for each instrument
 */
function createSingleTeacherSignature(config: DocxExportConfig, info: any): (Paragraph | Table)[] {
  const city = config.city || 'Kabupaten/Kota';
  const docDate = config.documentDate || '14 Juli 2026';
  const teacherName = config.teacherName || info.guru || 'Guru Pendidik';
  const teacherNip = config.teacherNip || '...........................................';

  return [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({
          text: `${city}, ${docDate}`,
          size: 18,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            createTableCell([cellPara(' ', { size: 18 })], { widthPercent: 55 }),
            createTableCell(
              [
                cellPara('Guru Kelas / Pendidik PAUD,', { bold: true, alignment: AlignmentType.CENTER, size: 18 }),
                cellPara('\n\n\n', { size: 16 }),
                cellPara(`( ${teacherName} )`, { bold: true, alignment: AlignmentType.CENTER, size: 18 }),
                cellPara(`NIP. ${teacherNip}`, { alignment: AlignmentType.CENTER, size: 18 }),
              ],
              { widthPercent: 45 }
            ),
          ],
        }),
      ],
    }),
  ];
}

/**
 * Helper to build double-signer signature block (Kepala Satuan & Guru Kelas)
 */
function createDoubleSignatureBlock(config: DocxExportConfig, info: any): (Paragraph | Table)[] {
  const city = config.city || 'Kabupaten/Kota';
  const docDate = config.documentDate || '14 Juli 2026';
  const principalName = config.principalName || '...........................................';
  const principalNip = config.principalNip || '...........................................';
  const teacherName = config.teacherName || info.guru || '...........................................';
  const teacherNip = config.teacherNip || '...........................................';

  return [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 120, after: 100 },
      children: [
        new TextRun({
          text: `${city}, ${docDate}`,
          size: 19,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            createTableCell(
              [
                cellPara('Mengetahui,', { alignment: AlignmentType.CENTER, size: 18 }),
                cellPara(`Kepala ${info.asal_sekolah || 'Satuan PAUD'}`, { bold: true, alignment: AlignmentType.CENTER, size: 18 }),
                cellPara('\n\n\n\n', { size: 16 }),
                cellPara(`( ${principalName} )`, { bold: true, alignment: AlignmentType.CENTER, size: 18 }),
                cellPara(`NIP. ${principalNip}`, { alignment: AlignmentType.CENTER, size: 18 }),
              ],
              { widthPercent: 50 }
            ),
            createTableCell(
              [
                cellPara(' ', { alignment: AlignmentType.CENTER, size: 18 }),
                cellPara('Guru Kelas / Pendidik PAUD,', { bold: true, alignment: AlignmentType.CENTER, size: 18 }),
                cellPara('\n\n\n\n', { size: 16 }),
                cellPara(`( ${teacherName} )`, { bold: true, alignment: AlignmentType.CENTER, size: 18 }),
                cellPara(`NIP. ${teacherNip}`, { alignment: AlignmentType.CENTER, size: 18 }),
              ],
              { widthPercent: 50 }
            ),
          ],
        }),
      ],
    }),
  ];
}

/**
 * Helper to construct dashed-border photo container for True-WYSIWYG visual alignment
 */
function createPhotoBoxTable(
  placeholderTitle: string,
  placeholderSubtitle?: string,
  minHeightTwips: number = 2600
): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.DASHED, size: 6, color: '94A3B8' },
      bottom: { style: BorderStyle.DASHED, size: 6, color: '94A3B8' },
      left: { style: BorderStyle.DASHED, size: 6, color: '94A3B8' },
      right: { style: BorderStyle.DASHED, size: 6, color: '94A3B8' },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    rows: [
      new TableRow({
        cantSplit: true,
        height: { value: minHeightTwips, rule: HeightRule.ATLEAST },
        children: [
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            margins: { top: 180, bottom: 180, left: 140, right: 140 },
            children: [
              cellPara(placeholderTitle, {
                bold: true,
                size: 17,
                color: '64748B',
                alignment: AlignmentType.CENTER,
                spaceAfter: placeholderSubtitle ? 60 : 0,
              }),
              ...(placeholderSubtitle
                ? [
                    cellPara(placeholderSubtitle, {
                      italics: true,
                      size: 14,
                      color: '94A3B8',
                      alignment: AlignmentType.CENTER,
                    }),
                  ]
                : []),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Reusable Element Generator for the 4 Authentic PAUD Observation Instruments:
 * 1. Catatan Anekdot (Halaman Penuh 1)
 * 2. Ceklis IKTP Matriks Taksonomi SOLO (Halaman Penuh 2)
 * 3. Dokumentasi Hasil Karya (Halaman Penuh 3)
 * 4. Foto Berseri / Portofolio Visual + Pengesahan (Halaman Penuh 4)
 *
 * Can be rendered directly in a standalone document, or appended to the main RPM document.
 */
export function buildLampiranDocxElements(
  data: RpmPaudDocData,
  config: DocxExportConfig,
  options: { startWithPageBreak?: boolean } = {}
): (Paragraph | Table)[] {
  const info = data.informasi_umum || {};
  const elements: (Paragraph | Table)[] = [];
  const startWithBreak = options.startWithPageBreak ?? false;

  // =========================================================================
  // HALAMAN 1: LAMPIRAN 1 - FORMAT CATATAN ANEKDOT KELAS (Anecdotal Records)
  // =========================================================================
  elements.push(
    new Paragraph({
      pageBreakBefore: startWithBreak,
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40, line: 260 },
      children: [
        new TextRun({
          text: 'LAMPIRAN 1: FORMAT CATATAN ANEKDOT KELAS (ANECDOTAL RECORDS)',
          bold: true,
          size: 24,
          color: DOCX_COLORS.primaryNavy,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120, line: 240 },
      children: [
        new TextRun({
          text: `Satuan: ${info.asal_sekolah || 'SATUAN PAUD'} | Kelompok: ${info.jenjang_kelas || 'A (4-5 Tahun)'} | Topik: ${info.topik_subtopik || '-'} | Semester ${info.semester || '1'} (Minggu ${info.minggu_ke || '1'})`,
          size: 17,
          italics: true,
          color: DOCX_COLORS.mutedText,
          font: DOCX_FONTS.primary,
        }),
      ],
    })
  );

  // Tabel Catatan Anekdot (Full Page: 1 contoh + 7 baris observasi lega dengan HeightRule.ATLEAST)
  const anekdotRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell(
          [cellPara('INSTRUMEN CATATAN ANEKDOT PERISTIWA BERMAKNA (Fase Fondasi)', { bold: true, size: 19, color: 'FFFFFF' })],
          {
            bgColor: DOCX_COLORS.primaryNavy,
            colSpan: 6,
          }
        ),
      ],
    }),
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell([cellPara('No', { bold: true, size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 5, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Hari / Tgl', { bold: true, size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 14, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Nama Anak', { bold: true, size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 16, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Peristiwa / Perilaku yang Teramati (Objektif)', { bold: true, size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 31, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Capaian / DPL Terkait', { bold: true, size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 16, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Analisis & Umpan Balik Guru', { bold: true, size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 18, bgColor: DOCX_COLORS.subHeaderBg }),
      ],
    }),
  ];

  // 1 Contoh terisi sesuai topik main
  anekdotRows.push(
    new TableRow({
      cantSplit: true,
      children: [
        createTableCell([cellPara('1', { size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 5 }),
        createTableCell([cellPara('Senin, ...', { size: 17 })], { widthPercent: 14 }),
        createTableCell([cellPara('Ananda A...', { size: 17, bold: true })], { widthPercent: 16 }),
        createTableCell([cellPara(`Saat kegiatan main ${info.topik_subtopik || 'kegiatan'}, anak memilih bahan loose parts dan mengajak temannya bekerja sama tanpa berebut.`, { size: 17 })], { widthPercent: 31 }),
        createTableCell([cellPara('DPL5 (Kolaborasi)\nDPL6 (Kemandirian)', { size: 16, bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 16 }),
        createTableCell([cellPara('Menunjukkan regulasi emosi positif dan kepedulian sosial. Diberi penguatan verbal.', { size: 16, italics: true })], { widthPercent: 18 }),
      ],
    })
  );

  // 7 Baris kosong observasi harian dengan tinggi fisik terjamin (HeightRule.ATLEAST = 720 dxa / ~1.3 cm)
  for (let i = 2; i <= 8; i++) {
    anekdotRows.push(
      new TableRow({
        cantSplit: true,
        height: { value: 720, rule: HeightRule.ATLEAST },
        children: [
          createTableCell([cellPara(`${i}`, { size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 5, verticalAlign: VerticalAlign.CENTER }),
          createTableCell([cellPara('..................', { size: 16, color: '94A3B8' })], { widthPercent: 14, verticalAlign: VerticalAlign.CENTER }),
          createTableCell([cellPara('..................', { size: 16, color: '94A3B8' })], { widthPercent: 16, verticalAlign: VerticalAlign.CENTER }),
          createTableCell([cellPara(' ', { size: 16 })], { widthPercent: 31 }),
          createTableCell([cellPara(' ', { size: 16 })], { widthPercent: 16 }),
          createTableCell([cellPara(' ', { size: 16 })], { widthPercent: 18 }),
        ],
      })
    );
  }

  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: anekdotRows,
    })
  );

  if (config.includeSignatures) {
    elements.push(...createSingleTeacherSignature(config, info));
  }

  // =========================================================================
  // HALAMAN 2: LAMPIRAN 2 - MATRIKS CEKLIS IKTP TAKSONOMI SOLO (Checklist)
  // DIMULAI PADA HALAMAN BARU (pageBreakBefore: true)
  // =========================================================================
  const iktpList = data.iktp_bergradasi || [];
  const iktpCount = Math.max(iktpList.length, 3);

  const subCols: TableCell[] = [];
  const tpColsHeader: TableCell[] = [];

  for (let t = 0; t < Math.min(iktpCount, 3); t++) {
    const tpItem = iktpList[t];
    const tpLabel = tpItem ? `TP-${tpItem.tujuan_ke}: ${tpItem.tujuan_ringkas.slice(0, 24)}...` : `Tujuan Pembelajaran ${t + 1}`;

    tpColsHeader.push(
      createTableCell([cellPara(tpLabel, { bold: true, size: 16, alignment: AlignmentType.CENTER, color: DOCX_COLORS.primaryNavy })], {
        bgColor: DOCX_COLORS.subHeaderBg,
        colSpan: 4,
        widthPercent: 25,
      })
    );

    subCols.push(
      createTableCell([cellPara('BB', { bold: true, size: 14, alignment: AlignmentType.CENTER, color: '7F1D1D' })], { widthPercent: 6, bgColor: 'FEF2F2' }),
      createTableCell([cellPara('MB', { bold: true, size: 14, alignment: AlignmentType.CENTER, color: '92400E' })], { widthPercent: 6, bgColor: 'FFFBEB' }),
      createTableCell([cellPara('BSH', { bold: true, size: 14, alignment: AlignmentType.CENTER, color: '14532D' })], { widthPercent: 6, bgColor: 'F0FDF4' }),
      createTableCell([cellPara('BSB', { bold: true, size: 14, alignment: AlignmentType.CENTER, color: '1E3A8A' })], { widthPercent: 7, bgColor: 'EFF6FF' })
    );
  }

  const ceklisRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell([cellPara('LAMPIRAN 2: MATRIKS CEKLIS IKTP KELAS (Taksonomi SOLO: BB, MB, BSH, BSB)', { bold: true, size: 19, color: 'FFFFFF' })], {
          bgColor: DOCX_COLORS.accentAmber,
          colSpan: 2 + subCols.length,
        }),
      ],
    }),
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        // True-WYSIWYG: rowSpan: 2 vertically merges the No and Nama columns
        createTableCell([cellPara('No', { bold: true, size: 16, alignment: AlignmentType.CENTER })], {
          widthPercent: 5,
          bgColor: DOCX_COLORS.subHeaderBg,
          rowSpan: 2,
          verticalAlign: VerticalAlign.CENTER,
        }),
        createTableCell([cellPara('Nama Peserta Didik', { bold: true, size: 16, alignment: AlignmentType.CENTER })], {
          widthPercent: 20,
          bgColor: DOCX_COLORS.subHeaderBg,
          rowSpan: 2,
          verticalAlign: VerticalAlign.CENTER,
        }),
        ...tpColsHeader,
      ],
    }),
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        // rowSpan: 2 above automatically handles vertical merge for cols 1 & 2 in OOXML
        ...subCols,
      ],
    }),
  ];

  // 15 baris absensi anak (pas 1 halaman A4/F4 penuh) dengan tinggi fisik stabil
  for (let a = 1; a <= 15; a++) {
    const checkCells: TableCell[] = [];
    for (let c = 0; c < subCols.length; c++) {
      checkCells.push(createTableCell([cellPara(' ', { size: 14 })], { widthPercent: 6 }));
    }

    ceklisRows.push(
      new TableRow({
        cantSplit: true,
        height: { value: 360, rule: HeightRule.ATLEAST },
        children: [
          createTableCell([cellPara(`${a}`, { size: 15, alignment: AlignmentType.CENTER })], { widthPercent: 5, verticalAlign: VerticalAlign.CENTER }),
          createTableCell([cellPara(`................................................`, { size: 14, color: 'CBD5E1' })], { widthPercent: 20, verticalAlign: VerticalAlign.CENTER }),
          ...checkCells,
        ],
      })
    );
  }

  elements.push(
    new Paragraph({
      pageBreakBefore: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40, line: 260 },
      children: [
        new TextRun({
          text: 'LAMPIRAN 2: MATRIKS CEKLIS IKTP BERGRADASI (TAKSONOMI SOLO)',
          bold: true,
          size: 24,
          color: DOCX_COLORS.accentAmber,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120, line: 240 },
      children: [
        new TextRun({
          text: `Satuan: ${info.asal_sekolah || 'SATUAN PAUD'} | Kelompok: ${info.jenjang_kelas || 'A (4-5 Tahun)'} | Topik: ${info.topik_subtopik || '-'} | Semester ${info.semester || '1'} (Minggu ${info.minggu_ke || '1'})`,
          size: 17,
          italics: true,
          color: DOCX_COLORS.mutedText,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: ceklisRows,
    }),
    new Paragraph({
      spacing: { before: 60, after: 80 },
      children: [
        new TextRun({
          text: '* Keterangan Skala SOLO: BB = Belum Berkembang (Unistruktural), MB = Mulai Berkembang (Multistruktural), BSH = Berkembang Sesuai Harapan (Relasional), BSB = Berkembang Sangat Baik (Extended Abstract).',
          size: 15,
          italics: true,
          color: DOCX_COLORS.mutedText,
          font: DOCX_FONTS.primary,
        }),
      ],
    })
  );

  if (config.includeSignatures) {
    elements.push(...createSingleTeacherSignature(config, info));
  }

  // =========================================================================
  // HALAMAN 3: LAMPIRAN 3 - LEMBAR DOKUMENTASI HASIL KARYA (Work Samples)
  // DIMULAI PADA HALAMAN BARU (pageBreakBefore: true)
  // =========================================================================
  const hasilKaryaPhotoTable = createPhotoBoxTable(
    'TEMPELKAN FOTO / REKAMAN FISIK KARYA ANAK DI SINI',
    '(Area Tempel Foto Dokumentasi Ukuran 3R / 4R / Hasil Gambar & Konstruksi Bahan Loose Parts Anak)',
    5000
  );

  elements.push(
    new Paragraph({
      pageBreakBefore: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40, line: 260 },
      children: [
        new TextRun({
          text: 'LAMPIRAN 3: LEMBAR DOKUMENTASI HASIL KARYA ANAK (WORK SAMPLES)',
          bold: true,
          size: 24,
          color: '15803D',
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120, line: 240 },
      children: [
        new TextRun({
          text: `Satuan: ${info.asal_sekolah || 'SATUAN PAUD'} | Kelompok: ${info.jenjang_kelas || 'A (4-5 Tahun)'} | Topik: ${info.topik_subtopik || '-'}`,
          size: 17,
          italics: true,
          color: DOCX_COLORS.mutedText,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: [
        new TableRow({
          tableHeader: true,
          cantSplit: true,
          children: [
            createTableCell([cellPara('INSTRUMEN DOKUMENTASI KARYA FISIK / KONSTRUKSI LOOSE PARTS', { bold: true, size: 19, color: 'FFFFFF' })], {
              bgColor: '15803D',
              colSpan: 2,
            }),
          ],
        }),
        new TableRow({
          cantSplit: true,
          children: [
            // Kolom Kiri: Area Tempel Foto dengan Dashed Border & Tinggi Fisik Mantap
            createTableCell([hasilKaryaPhotoTable], {
              widthPercent: 50,
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 140, bottom: 140, left: 140, right: 140 },
            }),

            // Kolom Kanan: Detail & Analisis Asesmen Guru
            createTableCell([
              cellPara('Nama Peserta Didik : .................................................', { size: 18, bold: true }),
              cellPara('Kelompok Usia       : ' + (info.jenjang_kelas || 'Kelompok A (4-5 Tahun)'), { size: 18 }),
              cellPara('Hari / Tanggal      : .................................................', { size: 18 }),
              cellPara('Topik / Subtopik    : ' + (info.topik_subtopik || '-'), { size: 18, color: DOCX_COLORS.primaryNavy }),
              cellPara('\n1. Deskripsi Ungkapan / Cerita Anak Mengenai Karyanya:', { bold: true, size: 18 }),
              cellPara('".......................................................................................\n .......................................................................................\n ......................................................................................."', { italics: true, size: 16, color: '475569' }),
              cellPara('\n2. Analisis Capaian Perkembangan Guru (DPL & TP):', { bold: true, size: 18 }),
              cellPara('• Anak menunjukkan penalaran kritis dalam memilih bahan dan struktur loose parts.\n• Anak menunjukkan kemandirian dan rasa bangga saat mempresentasikan hasil karyanya.', { size: 16 }),
              cellPara('\n3. Rencana Penguatan / Pijakan Guru Selanjutnya:', { bold: true, size: 18 }),
              cellPara('Memberikan tantangan scaffolding lebih mendalam dengan menghubungkan karya anak ke cerita fungsional bermakna.', { italics: true, size: 16 }),
            ], { widthPercent: 50 }),
          ],
        }),
      ],
    })
  );

  if (config.includeSignatures) {
    elements.push(...createSingleTeacherSignature(config, info));
  }

  // =========================================================================
  // HALAMAN 4: LAMPIRAN 4 - FORMAT FOTO BERSERI (Learning Story) + PENGESAHAN
  // DIMULAI PADA HALAMAN BARU (pageBreakBefore: true)
  // =========================================================================
  const photoBoxAwal = createPhotoBoxTable('[Tempel Foto Tahap Awal]', '(Pijakan & Eksplorasi Alat/Bahan)', 2600);
  const photoBoxProses = createPhotoBoxTable('[Tempel Foto Tahap Proses]', '(Interaksi Main & Kolaborasi)', 2600);
  const photoBoxHasil = createPhotoBoxTable('[Tempel Foto Tahap Hasil]', '(Unjuk Karya & Refleksi Anak)', 2600);

  elements.push(
    new Paragraph({
      pageBreakBefore: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40, line: 260 },
      children: [
        new TextRun({
          text: 'LAMPIRAN 4: FORMAT FOTO BERSERI / PORTOFOLIO PROSES BELAJAR',
          bold: true,
          size: 24,
          color: '6D28D9',
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120, line: 240 },
      children: [
        new TextRun({
          text: `Satuan: ${info.asal_sekolah || 'SATUAN PAUD'} | Kelompok: ${info.jenjang_kelas || 'A (4-5 Tahun)'} | Topik: ${info.topik_subtopik || '-'}`,
          size: 17,
          italics: true,
          color: DOCX_COLORS.mutedText,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: [
        new TableRow({
          tableHeader: true,
          cantSplit: true,
          children: [
            createTableCell([cellPara('DOKUMENTASI FOTO BERSERI PROSES BELAJAR (LEARNING STORY)', { bold: true, size: 19, color: 'FFFFFF' })], {
              bgColor: '6D28D9',
              colSpan: 3,
            }),
          ],
        }),
        new TableRow({
          cantSplit: true,
          children: [
            // Foto 1: Tahap Awal
            createTableCell([
              cellPara('FOTO 1: TAHAP AWAL', { bold: true, size: 17, alignment: AlignmentType.CENTER, color: DOCX_COLORS.primaryNavy }),
              cellPara('(Pijakan / Eksplorasi Alat & Bahan)', { size: 14, italics: true, alignment: AlignmentType.CENTER, color: DOCX_COLORS.mutedText, spaceAfter: 60 }),
              photoBoxAwal,
              new Paragraph({ spacing: { before: 80, after: 20 }, children: [new TextRun({ text: 'Catatan Perilaku:', bold: true, size: 16, font: DOCX_FONTS.primary })] }),
              cellPara('Anak mengamati dan memilih bahan main dengan berkesadaran serta fokus.', { size: 15, italics: true, color: '334155' }),
            ], { widthPercent: 33.3, bgColor: 'FAF5FF' }),

            // Foto 2: Tahap Proses
            createTableCell([
              cellPara('FOTO 2: TAHAP PROSES', { bold: true, size: 17, alignment: AlignmentType.CENTER, color: DOCX_COLORS.primaryNavy }),
              cellPara('(Interaksi Main / Kolaborasi Mendalam)', { size: 14, italics: true, alignment: AlignmentType.CENTER, color: DOCX_COLORS.mutedText, spaceAfter: 60 }),
              photoBoxProses,
              new Paragraph({ spacing: { before: 80, after: 20 }, children: [new TextRun({ text: 'Catatan Perilaku:', bold: true, size: 16, font: DOCX_FONTS.primary })] }),
              cellPara('Anak tekun mencoba, bertanya sebab-akibat, dan saling berbagi bahan dengan teman.', { size: 15, italics: true, color: '334155' }),
            ], { widthPercent: 33.3, bgColor: 'FAF5FF' }),

            // Foto 3: Tahap Hasil
            createTableCell([
              cellPara('FOTO 3: TAHAP HASIL', { bold: true, size: 17, alignment: AlignmentType.CENTER, color: DOCX_COLORS.primaryNavy }),
              cellPara('(Unjuk Karya & Refleksi Anak)', { size: 14, italics: true, alignment: AlignmentType.CENTER, color: DOCX_COLORS.mutedText, spaceAfter: 60 }),
              photoBoxHasil,
              new Paragraph({ spacing: { before: 80, after: 20 }, children: [new TextRun({ text: 'Catatan Perilaku:', bold: true, size: 16, font: DOCX_FONTS.primary })] }),
              cellPara('Anak menceritakan hasil mainnya kepada guru dan teman dengan percaya diri.', { size: 15, italics: true, color: '334155' }),
            ], { widthPercent: 33.4, bgColor: 'FAF5FF' }),
          ],
        }),
      ],
    })
  );

  // Lembar Pengesahan Lengkap (Kepala Satuan PAUD & Guru Kelas)
  if (config.includeSignatures) {
    elements.push(...createDoubleSignatureBlock(config, info));
  }

  return elements;
}

/**
 * Generates standalone, print-ready DOCX Document for PAUD Observation Instruments:
 * 1. Catatan Anekdot (Halaman Penuh 1)
 * 2. Ceklis IKTP Matriks Taksonomi SOLO (Halaman Penuh 2)
 * 3. Dokumentasi Hasil Karya (Halaman Penuh 3)
 * 4. Foto Berseri / Portofolio Visual + Pengesahan (Halaman Penuh 4)
 */
export async function buildRpmLampiranDocxBlob(
  data: RpmPaudDocData,
  config: DocxExportConfig
): Promise<Blob> {
  const info = data.informasi_umum || {};
  const isFolio = config.pageSize === 'F4_FOLIO';
  const pageDim = isFolio ? DOCX_PAGE_SIZE.F4_FOLIO : DOCX_PAGE_SIZE.A4;

  const sectionsChildren = buildLampiranDocxElements(data, config, { startWithPageBreak: false });

  // Build Document
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: DOCX_FONTS.primary,
            size: 20,
            color: DOCX_COLORS.darkText,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: pageDim,
            margin: DOCX_PAGE_MARGINS,
          },
        },
        headers: {
          default: createDocumentHeader(info.asal_sekolah || 'Satuan PAUD', 'Lampiran Asesmen & Observasi'),
        },
        footers: {
          default: createDocumentFooter(),
        },
        children: sectionsChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
