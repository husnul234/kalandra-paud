import {
  AlignmentType,
  Document,
  HeadingLevel,
  LevelFormat,
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
import { RpmPaudDocData, DocxExportConfig } from './docx-paud-builder';

/**
 * Helper to build standard text cell with margins and cantSplit
 */
function createTableCell(
  paragraphs: Paragraph[],
  options: {
    widthPercent?: number;
    bgColor?: string;
    verticalAlign?: any;
    isHeader?: boolean;
    colSpan?: number;
    borders?: any;
  } = {}
): TableCell {
  return new TableCell({
    width: options.widthPercent ? { size: options.widthPercent, type: WidthType.PERCENTAGE } : undefined,
    shading: options.bgColor ? { fill: options.bgColor, type: ShadingType.CLEAR } : undefined,
    verticalAlign: options.verticalAlign ?? VerticalAlign.TOP,
    columnSpan: options.colSpan,
    borders: options.borders,
    margins: {
      top: 100,
      bottom: 100,
      left: 120,
      right: 120,
    },
    children: paragraphs,
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
 * Generates standalone, print-ready DOCX Document for PAUD Observation Instruments:
 * 1. Catatan Anekdot (Anecdotal Record)
 * 2. Ceklis IKTP Matriks Taksonomi SOLO (Checklist)
 * 3. Dokumentasi Hasil Karya (Work Samples)
 * 4. Foto Berseri / Portofolio Visual (Learning Stories)
 */
export async function buildRpmLampiranDocxBlob(
  data: RpmPaudDocData,
  config: DocxExportConfig
): Promise<Blob> {
  const info = data.informasi_umum || {};
  const isFolio = config.pageSize === 'F4_FOLIO';
  const pageDim = isFolio ? DOCX_PAGE_SIZE.F4_FOLIO : DOCX_PAGE_SIZE.A4;

  const sectionsChildren: (Paragraph | Table)[] = [];

  // =========================================================================
  // 1. JUDUL RESMI DOKUMEN LAMPIRAN
  // =========================================================================
  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60, line: 260 },
      children: [
        new TextRun({
          text: 'LAMPIRAN INSTRUMEN OBSERVASI & ASESMEN KELAS',
          bold: true,
          size: 26,
          color: DOCX_COLORS.primaryNavy,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40, line: 240 },
      children: [
        new TextRun({
          text: `PERENCANAAN PEMBELAJARAN MENDALAM (DEEP LEARNING) FASE FONDASI`,
          bold: true,
          size: 21,
          color: DOCX_COLORS.accentAmber,
          font: DOCX_FONTS.primary,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180, line: 240 },
      children: [
        new TextRun({
          text: `${info.asal_sekolah || 'SATUAN PAUD'} — TAHUN AJARAN 2025/2026`,
          size: 19,
          italics: true,
          color: DOCX_COLORS.mutedText,
          font: DOCX_FONTS.primary,
        }),
      ],
    })
  );

  // =========================================================================
  // 2. TABEL IDENTITAS RINGKAS
  // =========================================================================
  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            createTableCell([cellPara('Satuan PAUD', { bold: true, size: 19 })], { widthPercent: 18, bgColor: DOCX_COLORS.subHeaderBg }),
            createTableCell([cellPara(info.asal_sekolah || '-', { size: 19 })], { widthPercent: 32 }),
            createTableCell([cellPara('Jenjang / Kelompok', { bold: true, size: 19 })], { widthPercent: 20, bgColor: DOCX_COLORS.subHeaderBg }),
            createTableCell([cellPara(info.jenjang_kelas || '-', { size: 19 })], { widthPercent: 30 }),
          ],
        }),
        new TableRow({
          cantSplit: true,
          children: [
            createTableCell([cellPara('Topik / Subtopik', { bold: true, size: 19 })], { widthPercent: 18, bgColor: DOCX_COLORS.subHeaderBg }),
            createTableCell([cellPara(info.topik_subtopik || '-', { bold: true, size: 19, color: DOCX_COLORS.primaryNavy })], { widthPercent: 32 }),
            createTableCell([cellPara('Semester / Minggu', { bold: true, size: 19 })], { widthPercent: 20, bgColor: DOCX_COLORS.subHeaderBg }),
            createTableCell([cellPara(`Semester ${info.semester || '1'} / Minggu ke-${info.minggu_ke || '1'} (${info.bulan || ''})`, { size: 19 })], { widthPercent: 30 }),
          ],
        }),
        new TableRow({
          cantSplit: true,
          children: [
            createTableCell([cellPara('Guru Pendidik', { bold: true, size: 19 })], { widthPercent: 18, bgColor: DOCX_COLORS.subHeaderBg }),
            createTableCell([cellPara(info.guru || '-', { size: 19 })], { widthPercent: 32 }),
            createTableCell([cellPara('Jumlah Peserta Didik', { bold: true, size: 19 })], { widthPercent: 20, bgColor: DOCX_COLORS.subHeaderBg }),
            createTableCell([cellPara(`${info.jumlah_anak || '15'} Anak`, { size: 19 })], { widthPercent: 30 }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 180 } })
  );

  // =========================================================================
  // 3. LAMPIRAN 1: INSTRUMEN CATATAN ANEKDOT (ANECDOTAL RECORDS)
  // =========================================================================
  const anekdotRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell([cellPara('LAMPIRAN 1: FORMAT CATATAN ANEKDOT KELAS (Anecdotal Records)', { bold: true, size: 21, color: 'FFFFFF' })], {
          bgColor: DOCX_COLORS.primaryNavy,
          colSpan: 6,
        }),
      ],
    }),
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell([cellPara('No', { bold: true, size: 18, alignment: AlignmentType.CENTER })], { widthPercent: 6, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Hari / Tgl', { bold: true, size: 18, alignment: AlignmentType.CENTER })], { widthPercent: 14, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Nama Anak', { bold: true, size: 18, alignment: AlignmentType.CENTER })], { widthPercent: 16, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Peristiwa / Perilaku yang Teramati (Objektif)', { bold: true, size: 18, alignment: AlignmentType.CENTER })], { widthPercent: 30, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Capaian / DPL Terkait', { bold: true, size: 18, alignment: AlignmentType.CENTER })], { widthPercent: 16, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('Analisis & Umpan Balik Guru', { bold: true, size: 18, alignment: AlignmentType.CENTER })], { widthPercent: 18, bgColor: DOCX_COLORS.subHeaderBg }),
      ],
    }),
  ];

  // 1 Contoh terisi sesuai topik
  anekdotRows.push(
    new TableRow({
      cantSplit: true,
      children: [
        createTableCell([cellPara('1', { size: 18, alignment: AlignmentType.CENTER })], { widthPercent: 6 }),
        createTableCell([cellPara('Senin, ...', { size: 18 })], { widthPercent: 14 }),
        createTableCell([cellPara('Ananda A...', { size: 18, bold: true })], { widthPercent: 16 }),
        createTableCell([cellPara(`Saat kegiatan main tentang ${info.topik_subtopik || 'kegiatan'}, anak secara mandiri memilih bahan dan mengajak temannya bekerja sama tanpa berebut.`, { size: 18 })], { widthPercent: 30 }),
        createTableCell([cellPara('DPL5 (Kolaborasi), DPL6 (Kemandirian)', { size: 18, bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 16 }),
        createTableCell([cellPara('Menunjukkan kematangan regulasi emosi dan kepedulian sosial. Diberi penguatan apresiasi verbal.', { size: 18, italics: true })], { widthPercent: 18 }),
      ],
    })
  );

  // 5 Baris kosong siap diisi guru secara berkala
  for (let i = 2; i <= 6; i++) {
    anekdotRows.push(
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara(`${i}`, { size: 18, alignment: AlignmentType.CENTER })], { widthPercent: 6 }),
          createTableCell([cellPara('..................', { size: 18, color: 'CBD5E1' })], { widthPercent: 14 }),
          createTableCell([cellPara('..................', { size: 18, color: 'CBD5E1' })], { widthPercent: 16 }),
          createTableCell([cellPara('\n\n', { size: 18 })], { widthPercent: 30 }),
          createTableCell([cellPara('\n\n', { size: 18 })], { widthPercent: 16 }),
          createTableCell([cellPara('\n\n', { size: 18 })], { widthPercent: 18 }),
        ],
      })
    );
  }

  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: anekdotRows,
    }),
    new Paragraph({ spacing: { after: 180 } })
  );

  // =========================================================================
  // 4. LAMPIRAN 2: MATRIKS CEKLIS IKTP BERGRADASI TAKSONOMI SOLO (Checklist)
  // =========================================================================
  const iktpList = data.iktp_bergradasi || [];
  const iktpCount = Math.max(iktpList.length, 3);

  // Sub-header headers for up to 3 TP
  const subCols: TableCell[] = [];
  const tpColsHeader: TableCell[] = [];

  for (let t = 0; t < Math.min(iktpCount, 3); t++) {
    const tpItem = iktpList[t];
    const tpLabel = tpItem ? `TP-${tpItem.tujuan_ke}: ${tpItem.tujuan_ringkas.slice(0, 24)}...` : `Tujuan Pembelajaran ${t + 1}`;
    
    tpColsHeader.push(
      createTableCell([cellPara(tpLabel, { bold: true, size: 17, alignment: AlignmentType.CENTER, color: DOCX_COLORS.primaryNavy })], {
        bgColor: DOCX_COLORS.subHeaderBg,
        colSpan: 4,
        widthPercent: 25,
      })
    );

    subCols.push(
      createTableCell([cellPara('BB', { bold: true, size: 15, alignment: AlignmentType.CENTER, color: '7F1D1D' })], { widthPercent: 6, bgColor: 'FEF2F2' }),
      createTableCell([cellPara('MB', { bold: true, size: 15, alignment: AlignmentType.CENTER, color: '92400E' })], { widthPercent: 6, bgColor: 'FFFBEB' }),
      createTableCell([cellPara('BSH', { bold: true, size: 15, alignment: AlignmentType.CENTER, color: '14532D' })], { widthPercent: 6, bgColor: 'F0FDF4' }),
      createTableCell([cellPara('BSB', { bold: true, size: 15, alignment: AlignmentType.CENTER, color: '1E3A8A' })], { widthPercent: 7, bgColor: 'EFF6FF' })
    );
  }

  const ceklisRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell([cellPara('LAMPIRAN 2: MATRIKS CEKLIS IKTP KELAS (Taksonomi SOLO: BB, MB, BSH, BSB)', { bold: true, size: 21, color: 'FFFFFF' })], {
          bgColor: DOCX_COLORS.accentAmber,
          colSpan: 2 + subCols.length,
        }),
      ],
    }),
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell([cellPara('No', { bold: true, size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 5, bgColor: DOCX_COLORS.subHeaderBg, colSpan: 1 }),
        createTableCell([cellPara('Nama Peserta Didik', { bold: true, size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 20, bgColor: DOCX_COLORS.subHeaderBg, colSpan: 1 }),
        ...tpColsHeader,
      ],
    }),
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell([cellPara('', { size: 14 })], { widthPercent: 5, bgColor: DOCX_COLORS.subHeaderBg }),
        createTableCell([cellPara('(Daftar Absensi)', { italics: true, size: 14, alignment: AlignmentType.CENTER, color: DOCX_COLORS.mutedText })], { widthPercent: 20, bgColor: DOCX_COLORS.subHeaderBg }),
        ...subCols,
      ],
    }),
  ];

  // 12 baris absensi anak
  const numRows = Math.min(parseInt(info.jumlah_anak || '12', 10) || 12, 15);
  for (let a = 1; a <= numRows; a++) {
    const checkCells: TableCell[] = [];
    for (let c = 0; c < subCols.length; c++) {
      checkCells.push(createTableCell([cellPara(' ', { size: 16 })], { widthPercent: 6 }));
    }

    ceklisRows.push(
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara(`${a}`, { size: 17, alignment: AlignmentType.CENTER })], { widthPercent: 5 }),
          createTableCell([cellPara(`................................................`, { size: 16, color: 'CBD5E1' })], { widthPercent: 20 }),
          ...checkCells,
        ],
      })
    );
  }

  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: ceklisRows,
    }),
    new Paragraph({
      spacing: { before: 40, after: 180 },
      children: [
        new TextRun({
          text: '* Keterangan Skala SOLO: BB = Belum Berkembang (Unistruktural), MB = Mulai Berkembang (Multistruktural), BSH = Berkembang Sesuai Harapan (Relasional), BSB = Berkembang Sangat Baik (Extended Abstract).',
          size: 16,
          italics: true,
          color: DOCX_COLORS.mutedText,
          font: DOCX_FONTS.primary,
        }),
      ],
    })
  );

  // =========================================================================
  // 5. LAMPIRAN 3: LEMBAR DOKUMENTASI HASIL KARYA (Work Samples)
  // =========================================================================
  sectionsChildren.push(
    new Paragraph({ pageBreakBefore: true }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: [
        new TableRow({
          tableHeader: true,
          cantSplit: true,
          children: [
            createTableCell([cellPara('LAMPIRAN 3: LEMBAR DOKUMENTASI HASIL KARYA ANAK (Work Samples)', { bold: true, size: 21, color: 'FFFFFF' })], {
              bgColor: '15803D',
              colSpan: 2,
            }),
          ],
        }),
        new TableRow({
          cantSplit: true,
          children: [
            createTableCell([
              cellPara('TEMPELKAN FOTO / REKAMAN KARYA ANAK DI SINI', { bold: true, size: 18, color: DOCX_COLORS.mutedText, alignment: AlignmentType.CENTER }),
              cellPara('\n\n\n\n\n(Area Foto Hasil Konstruksi Loose Parts / Lukisan / Kreasi 3D)\n\n\n\n\n', { size: 16, italics: true, color: '94A3B8', alignment: AlignmentType.CENTER }),
            ], { widthPercent: 50, bgColor: 'F8FAFC' }),
            createTableCell([
              cellPara('Nama Anak     : .................................................', { size: 18, bold: true }),
              cellPara('Kelompok      : ' + (info.jenjang_kelas || 'Kelompok A'), { size: 18 }),
              cellPara('Hari / Tanggal: .................................................', { size: 18 }),
              cellPara('Topik Main    : ' + (info.topik_subtopik || '-'), { size: 18, color: DOCX_COLORS.primaryNavy }),
              cellPara('\nDeskripsi Ungkapan Anak:', { bold: true, size: 18 }),
              cellPara('".......................................................................................\n ......................................................................................."', { italics: true, size: 17 }),
              cellPara('\nAnalisis Capaian Perkembangan Guru:', { bold: true, size: 18 }),
              cellPara('• Menunjukkan penalaran kritis saat merakit bahan loose parts.\n• Menunjukkan kemandirian dan rasa bangga atas hasil karyanya.', { size: 17 }),
              cellPara('\nRencana Penguatan / Pijakan Selanjutnya:', { bold: true, size: 18 }),
              cellPara('Menantang anak menambahkan detail cerita pada karya berikutnya.', { italics: true, size: 17 }),
            ], { widthPercent: 50 }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 180 } })
  );

  // =========================================================================
  // 6. LAMPIRAN 4: LEMBAR FOTO BERSERI (Learning Stories / Visual Portfolio)
  // =========================================================================
  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: DOCX_TABLE_BORDERS,
      rows: [
        new TableRow({
          tableHeader: true,
          cantSplit: true,
          children: [
            createTableCell([cellPara('LAMPIRAN 4: FORMAT FOTO BERSERI / PORTOFOLIO PROSES BELAJAR (Learning Story)', { bold: true, size: 21, color: 'FFFFFF' })], {
              bgColor: '6D28D9',
              colSpan: 3,
            }),
          ],
        }),
        new TableRow({
          cantSplit: true,
          children: [
            createTableCell([
              cellPara('FOTO 1: TAHAP AWAL', { bold: true, size: 17, alignment: AlignmentType.CENTER, color: DOCX_COLORS.primaryNavy }),
              cellPara('(Pijakan / Eksplorasi Alat & Bahan)', { size: 15, italics: true, alignment: AlignmentType.CENTER, color: DOCX_COLORS.mutedText }),
              cellPara('\n\n\n[Tempel Foto 1]\n\n\n', { size: 16, alignment: AlignmentType.CENTER, color: '94A3B8' }),
              cellPara('Catatan Perilaku:\nAnak mengamati dan memilih bahan main dengan berkesadaran.', { size: 16 }),
            ], { widthPercent: 33.3, bgColor: 'FAF5FF' }),
            createTableCell([
              cellPara('FOTO 2: TAHAP PROSES', { bold: true, size: 17, alignment: AlignmentType.CENTER, color: DOCX_COLORS.primaryNavy }),
              cellPara('(Interaksi Main / Kolaborasi)', { size: 15, italics: true, alignment: AlignmentType.CENTER, color: DOCX_COLORS.mutedText }),
              cellPara('\n\n\n[Tempel Foto 2]\n\n\n', { size: 16, alignment: AlignmentType.CENTER, color: '94A3B8' }),
              cellPara('Catatan Perilaku:\nAnak tekun mencoba, bertanya sebab-akibat, dan saling berbagi bahan.', { size: 16 }),
            ], { widthPercent: 33.3, bgColor: 'FAF5FF' }),
            createTableCell([
              cellPara('FOTO 3: TAHAP HASIL', { bold: true, size: 17, alignment: AlignmentType.CENTER, color: DOCX_COLORS.primaryNavy }),
              cellPara('(Unjuk Karya & Refleksi)', { size: 15, italics: true, alignment: AlignmentType.CENTER, color: DOCX_COLORS.mutedText }),
              cellPara('\n\n\n[Tempel Foto 3]\n\n\n', { size: 16, alignment: AlignmentType.CENTER, color: '94A3B8' }),
              cellPara('Catatan Perilaku:\nAnak menceritakan hasil mainnya kepada guru dan teman dengan percaya diri.', { size: 16 }),
            ], { widthPercent: 33.4, bgColor: 'FAF5FF' }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 200 } })
  );

  // =========================================================================
  // 7. LEMBAR TANDA TANGAN RESMI PENGESAHAN INSTRUMEN
  // =========================================================================
  if (config.includeSignatures) {
    const city = config.city || 'Kabupaten/Kota';
    const docDate = config.documentDate || '14 Juli 2026';
    const principalName = config.principalName || 'Nama Kepala Satuan PAUD, M.Pd.';
    const principalNip = config.principalNip || '197508122002122001';
    const teacherName = config.teacherName || info.guru || 'Nama Guru Kelas, S.Pd.';
    const teacherNip = config.teacherNip || '198906142015032002';

    sectionsChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 100, after: 120 },
        children: [
          new TextRun({
            text: `${city}, ${docDate}`,
            size: 20,
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
                  cellPara('Mengetahui,', { alignment: AlignmentType.CENTER }),
                  cellPara(`Kepala ${info.asal_sekolah || 'Satuan PAUD'}`, { bold: true, alignment: AlignmentType.CENTER }),
                  cellPara('\n\n\n\n', { size: 16 }),
                  cellPara(`( ${principalName} )`, { bold: true, alignment: AlignmentType.CENTER }),
                  cellPara(`NIP. ${principalNip}`, { alignment: AlignmentType.CENTER }),
                ],
                { widthPercent: 50 }
              ),
              createTableCell(
                [
                  cellPara(' ', { alignment: AlignmentType.CENTER }),
                  cellPara('Guru Kelas / Pendidik,', { bold: true, alignment: AlignmentType.CENTER }),
                  cellPara('\n\n\n\n', { size: 16 }),
                  cellPara(`( ${teacherName} )`, { bold: true, alignment: AlignmentType.CENTER }),
                  cellPara(`NIP. ${teacherNip}`, { alignment: AlignmentType.CENTER }),
                ],
                { widthPercent: 50 }
              ),
            ],
          }),
        ],
      })
    );
  }

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
