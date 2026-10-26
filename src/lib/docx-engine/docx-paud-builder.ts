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

export interface RpmPaudDocData {
  informasi_umum: {
    guru?: string;
    asal_sekolah?: string;
    fase?: string;
    jenjang_kelas?: string;
    semester?: string;
    minggu_ke?: string;
    bulan?: string;
    alokasi_waktu?: string;
    model_pembelajaran?: string;
    jumlah_anak?: string;
    topik_subtopik?: string;
  };
  identifikasi: {
    peserta_didik?: string;
    materi_pelajaran?: string;
    dimensi_profil_lulusan_terpilih?: string[];
  };
  desain_pembelajaran: {
    capaian_pembelajaran?: string[];
    lintas_disiplin_ilmu?: string;
    tujuan_pembelajaran?: string[];
    topik_pembelajaran?: string;
    praktik_pedagogis?: string;
    kemitraan_pembelajaran?: {
      lingkungan_sekolah?: string;
      masyarakat?: string;
      lingkungan_luar_sekolah?: string;
    };
    lingkungan_pembelajaran?: {
      ruang_fisik?: string;
      ruang_virtual?: string;
      budaya_belajar?: string;
    };
    pemanfaatan_digital?: {
      perencanaan?: string;
      pelaksanaan?: string;
      asesmen?: string;
      tautan_media?: string;
    };
  };
  pengalaman_belajar: {
    awal?: {
      judul_tahap?: string;
      pengantar?: string;
      poin_kegiatan?: string[];
    };
    inti?: {
      pengantar?: string;
      blok_tahap?: Array<{
        header_tahap: string;
        hari: Array<{
          hari_ke: number;
          kegiatan_list: Array<{
            nomor: number;
            nama_kegiatan: string;
            label?: string;
            alat_dan_bahan?: string;
            judul_langkah?: string;
            langkah?: string[];
          }>;
        }>;
      }>;
    };
    penutup?: {
      judul_tahap?: string;
      pengantar?: string;
      poin_kegiatan?: string[];
    };
  };
  asesmen_pembelajaran: {
    awal?: string[];
    proses?: string[];
    akhir?: string[];
  };
}

export interface DocxExportConfig {
  pageSize: 'A4' | 'F4_FOLIO';
  includeSignatures: boolean;
  principalName?: string;
  principalNip?: string;
  teacherName?: string;
  teacherNip?: string;
  documentDate?: string;
  city?: string;
}

const ALL_8_DPL = [
  { kode: 'DPL1', nama: 'Keimanan dan Ketakwaan terhadap Tuhan YME', desc: 'Mengenal Tuhan YME melalui ciptaan-Nya, membiasakan doa harian dengan berkesadaran, bersyukur, menyayangi sesama dan lingkungan.' },
  { kode: 'DPL2', nama: 'Kewargaan', desc: 'Mengenal identitas diri sebagai bagian dari keluarga, sekolah, masyarakat; menghargai keragaman teman; menaati aturan main.' },
  { kode: 'DPL3', nama: 'Penalaran Kritis', desc: 'Mengamati benda & alam, bertanya sebab-akibat, membandingkan perbedaan/persamaan, mencari jalan keluar saat bermain.' },
  { kode: 'DPL4', nama: 'Kreativitas', desc: 'Mengeksplorasi media seni & loose parts, menghasilkan karya orisinal, mengekspresikan imajinasi, mencoba ide baru.' },
  { kode: 'DPL5', nama: 'Kolaborasi', desc: 'Bermain bersama, berbagi alat dan bahan, sabar bergiliran, bekerja sama menyelesaikan proyek kelompok.' },
  { kode: 'DPL6', nama: 'Kemandirian', desc: 'Memilih kegiatan main, menyelesaikan tugas bermain sampai selesai, bina diri dasar, merapikan kembali alat main.' },
  { kode: 'DPL7', nama: 'Kesehatan', desc: 'Aktif bergerak melatih motorik kasar dan halus, kebiasaan cuci tangan dan makan sehat, menjaga keselamatan diri.' },
  { kode: 'DPL8', nama: 'Komunikasi', desc: 'Menyimak cerita, menceritakan kembali pengalaman secara lisan, memperluas kosakata dan kata santun, keaksaraan awal.' },
];

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
  } = {}
): TableCell {
  return new TableCell({
    width: options.widthPercent ? { size: options.widthPercent, type: WidthType.PERCENTAGE } : undefined,
    shading: options.bgColor ? { fill: options.bgColor, type: ShadingType.CLEAR } : undefined,
    verticalAlign: options.verticalAlign ?? VerticalAlign.TOP,
    columnSpan: options.colSpan,
    margins: {
      top: 120, // ~6pt
      bottom: 120,
      left: 140, // ~7pt
      right: 140,
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
    spacing: { after: options.spaceAfter ?? 60, line: 260 },
    children: [
      new TextRun({
        text,
        bold: options.bold,
        italics: options.italics,
        size: options.size ?? 21, // ~10.5pt
        color: options.color ?? DOCX_COLORS.darkText,
        font: DOCX_FONTS.primary,
      }),
    ],
  });
}

/**
 * Clean prefix bullets or numbers so we never get duplicate bullets or numbers
 */
function cleanListText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^[\s•\-\*\u2022\u25E6\u25AA\u25CF\u2013\u2014]+/, '')
    .replace(/^\d+[\.\)]\s*/, '')
    .trim();
}

/**
 * Native Word Automatic Bullet Paragraph with hanging indent
 */
function cellBulletPara(
  text: string,
  options: {
    bold?: boolean;
    italics?: boolean;
    size?: number;
    color?: string;
    spaceAfter?: number;
    indentLeft?: number;
    hanging?: number;
  } = {}
): Paragraph {
  const clean = cleanListText(text);
  const indentLeft = options.indentLeft ?? 280;
  const hanging = options.hanging ?? 280;

  return new Paragraph({
    bullet: { level: 0 },
    indent: { left: indentLeft, hanging },
    alignment: AlignmentType.LEFT,
    spacing: { after: options.spaceAfter ?? 40, line: 260 },
    children: [
      new TextRun({
        text: clean,
        bold: options.bold,
        italics: options.italics,
        size: options.size ?? 21,
        color: options.color ?? DOCX_COLORS.darkText,
        font: DOCX_FONTS.primary,
      }),
    ],
  });
}

/**
 * Native Word Automatic Bullet Paragraph with a Bold Prefix/Label
 * E.g. "• Lingkungan Sekolah: text..." or "• Alat & Bahan: text..."
 */
function cellBulletWithLabelPara(
  label: string,
  content: string,
  options: {
    size?: number;
    spaceAfter?: number;
    isLink?: boolean;
  } = {}
): Paragraph {
  const cleanLabel = cleanListText(label).replace(/:+$/, '').trim();
  const cleanContent = cleanListText(content || '-');

  return new Paragraph({
    bullet: { level: 0 },
    indent: { left: 280, hanging: 280 },
    alignment: AlignmentType.LEFT,
    spacing: { after: options.spaceAfter ?? 40, line: 260 },
    children: [
      new TextRun({
        text: `${cleanLabel}: `,
        bold: true,
        size: options.size ?? 21,
        color: DOCX_COLORS.darkText,
        font: DOCX_FONTS.primary,
      }),
      new TextRun({
        text: cleanContent,
        italics: options.isLink,
        size: options.size ?? 21,
        color: options.isLink ? DOCX_COLORS.primaryNavy : DOCX_COLORS.bodyText,
        font: DOCX_FONTS.primary,
      }),
    ],
  });
}

/**
 * Native Word Automatic Numbered Paragraph
 */
function cellNumberedPara(
  reference: string,
  text: string,
  options: {
    bold?: boolean;
    italics?: boolean;
    size?: number;
    color?: string;
    spaceAfter?: number;
  } = {}
): Paragraph {
  const clean = cleanListText(text);

  return new Paragraph({
    numbering: { reference, level: 0 },
    indent: { left: 360, hanging: 360 },
    alignment: AlignmentType.LEFT,
    spacing: { after: options.spaceAfter ?? 40, line: 260 },
    children: [
      new TextRun({
        text: clean,
        bold: options.bold,
        italics: options.italics,
        size: options.size ?? 21,
        color: options.color ?? DOCX_COLORS.darkText,
        font: DOCX_FONTS.primary,
      }),
    ],
  });
}

/**
 * Build Table 1: IDENTIFIKASI
 */
function buildTable1Identifikasi(data: RpmPaudDocData): Table {
  const selectedDpl = data.identifikasi?.dimensi_profil_lulusan_terpilih || [];

  const dplRows = ALL_8_DPL.map((dpl) => {
    const isChecked = selectedDpl.includes(dpl.kode);
    const mark = isChecked ? '[ v ]' : '[   ]';
    return new Paragraph({
      spacing: { after: 40, line: 240 },
      children: [
        new TextRun({
          text: `${mark} `,
          bold: isChecked,
          color: isChecked ? DOCX_COLORS.freshEmerald : DOCX_COLORS.mutedText,
          font: 'Lucida Console', // Fixed width for checkbox
          size: 20,
        }),
        new TextRun({
          text: `${dpl.kode} - ${dpl.nama}: `,
          bold: isChecked,
          color: isChecked ? DOCX_COLORS.primaryNavy : DOCX_COLORS.bodyText,
          font: DOCX_FONTS.primary,
          size: 20,
        }),
        new TextRun({
          text: dpl.desc,
          italics: !isChecked,
          color: isChecked ? DOCX_COLORS.bodyText : DOCX_COLORS.mutedText,
          font: DOCX_FONTS.primary,
          size: 19,
        }),
      ],
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: DOCX_TABLE_BORDERS,
    rows: [
      // Table Header
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: [
          createTableCell(
            [cellPara('1. IDENTIFIKASI', { bold: true, size: 23, color: 'FFFFFF' })],
            { bgColor: DOCX_COLORS.tableHeaderBg, colSpan: 2 }
          ),
        ],
      }),
      // Row 1: Peserta Didik
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell(
            [cellPara('Peserta Didik', { bold: true, color: DOCX_COLORS.primaryNavy })],
            { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }
          ),
          createTableCell(
            [cellPara(data.identifikasi?.peserta_didik || '-')],
            { widthPercent: 72 }
          ),
        ],
      }),
      // Row 2: Materi Pelajaran
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell(
            [cellPara('Materi Pelajaran', { bold: true, color: DOCX_COLORS.primaryNavy })],
            { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }
          ),
          createTableCell(
            [cellPara(data.identifikasi?.materi_pelajaran || '-')],
            { widthPercent: 72 }
          ),
        ],
      }),
      // Row 3: Dimensi Profil Lulusan
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell(
            [
              cellPara('Dimensi Profil Lulusan', { bold: true, color: DOCX_COLORS.primaryNavy }),
              cellPara('(Permendikdasmen No. 10/2025)', { italics: true, size: 18, color: DOCX_COLORS.mutedText }),
            ],
            { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }
          ),
          createTableCell(
            dplRows,
            { widthPercent: 72 }
          ),
        ],
      }),
    ],
  });
}

/**
 * Build Table 2: DESAIN PEMBELAJARAN
 */
function buildTable2Desain(data: RpmPaudDocData): Table {
  const d = data.desain_pembelajaran;

  const cpParas = (d?.capaian_pembelajaran || []).map((cp) =>
    cellNumberedPara('cp-numbering', cp, { spaceAfter: 50 })
  );

  const tpParas = (d?.tujuan_pembelajaran || []).map((tp) =>
    cellBulletPara(tp, { spaceAfter: 40 })
  );

  const kemitraanParas = [
    cellBulletWithLabelPara('Lingkungan Sekolah', d?.kemitraan_pembelajaran?.lingkungan_sekolah || '-'),
    cellBulletWithLabelPara('Masyarakat/Keluarga', d?.kemitraan_pembelajaran?.masyarakat || '-'),
    cellBulletWithLabelPara('Lingkungan Luar Sekolah', d?.kemitraan_pembelajaran?.lingkungan_luar_sekolah || '-'),
  ];

  const lingkunganParas = [
    cellBulletWithLabelPara('Ruang Fisik', d?.lingkungan_pembelajaran?.ruang_fisik || '-'),
    cellBulletWithLabelPara('Ruang Virtual', d?.lingkungan_pembelajaran?.ruang_virtual || '-'),
    cellBulletWithLabelPara('Budaya Belajar', d?.lingkungan_pembelajaran?.budaya_belajar || '-'),
  ];

  const digitalParas = [
    cellBulletWithLabelPara('Perencanaan', d?.pemanfaatan_digital?.perencanaan || '-'),
    cellBulletWithLabelPara('Pelaksanaan', d?.pemanfaatan_digital?.pelaksanaan || '-'),
    cellBulletWithLabelPara('Asesmen', d?.pemanfaatan_digital?.asesmen || '-'),
    ...(d?.pemanfaatan_digital?.tautan_media ? [cellBulletWithLabelPara('Tautan Media', d.pemanfaatan_digital.tautan_media, { isLink: true })] : []),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: DOCX_TABLE_BORDERS,
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: [
          createTableCell(
            [cellPara('2. DESAIN PEMBELAJARAN', { bold: true, size: 23, color: 'FFFFFF' })],
            { bgColor: DOCX_COLORS.tableHeaderBg, colSpan: 2 }
          ),
        ],
      }),
      // Capaian Pembelajaran
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('Capaian Pembelajaran (Verbatim CP 2025)', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell(cpParas.length > 0 ? cpParas : [cellPara('-')], { widthPercent: 72 }),
        ],
      }),
      // Lintas Disiplin
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('Lintas Disiplin Ilmu', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell([cellPara(d?.lintas_disiplin_ilmu || '-')], { widthPercent: 72 }),
        ],
      }),
      // Tujuan Pembelajaran
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('Tujuan Pembelajaran', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell(tpParas.length > 0 ? tpParas : [cellPara('-')], { widthPercent: 72 }),
        ],
      }),
      // Topik Pembelajaran
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('Topik / Subtopik', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell([cellPara(d?.topik_pembelajaran || data.informasi_umum?.topik_subtopik || '-')], { widthPercent: 72 }),
        ],
      }),
      // Praktik Pedagogis
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('Praktik Pedagogis', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell([cellPara(d?.praktik_pedagogis || '-')], { widthPercent: 72 }),
        ],
      }),
      // Kemitraan Pembelajaran
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('Kemitraan Pembelajaran', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell(kemitraanParas, { widthPercent: 72 }),
        ],
      }),
      // Lingkungan Pembelajaran
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('Lingkungan Pembelajaran', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell(lingkunganParas, { widthPercent: 72 }),
        ],
      }),
      // Pemanfaatan Digital
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('Pemanfaatan Digital', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell(digitalParas, { widthPercent: 72 }),
        ],
      }),
    ],
  });
}

/**
 * Build Table 3: PENGALAMAN BELAJAR (6 HARI / 18 KEGIATAN)
 */
function buildTable3PengalamanBelajar(data: RpmPaudDocData): Table {
  const exp = data.pengalaman_belajar;
  const rows: TableRow[] = [];

  // Table Header
  rows.push(
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        createTableCell(
          [cellPara('3. PENGALAMAN BELAJAR MENDALAM (DEEP LEARNING 6 HARI)', { bold: true, size: 23, color: 'FFFFFF' })],
          { bgColor: DOCX_COLORS.tableHeaderBg, colSpan: 2 }
        ),
      ],
    })
  );

  // 1. TAHAP AWAL
  const awalParas: Paragraph[] = [];
  if (exp?.awal?.pengantar) {
    awalParas.push(cellPara(exp.awal.pengantar, { spaceAfter: 60 }));
  }
  (exp?.awal?.poin_kegiatan || []).forEach((pt) => {
    awalParas.push(cellNumberedPara('tahap-awal-numbering', pt, { spaceAfter: 40 }));
  });

  rows.push(
    new TableRow({
      cantSplit: true,
      children: [
        createTableCell(
          [
            cellPara(exp?.awal?.judul_tahap || 'TAHAP AWAL', { bold: true, color: DOCX_COLORS.primaryNavy }),
            cellPara('(Berkesadaran, Bermakna, Menggembirakan)', { italics: true, size: 18, color: DOCX_COLORS.mutedText }),
          ],
          { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }
        ),
        createTableCell(awalParas.length > 0 ? awalParas : [cellPara('-')], { widthPercent: 72 }),
      ],
    })
  );

  // 2. TAHAP INTI BLOKS
  const blokList = exp?.inti?.blok_tahap || [];
  blokList.forEach((blok) => {
    // Header Blok Tahap
    rows.push(
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell(
            [cellPara(`TAHAP INTI: ${blok.header_tahap}`, { bold: true, size: 21, color: DOCX_COLORS.primaryNavy })],
            { bgColor: DOCX_COLORS.accentSubHeaderBg, colSpan: 2 }
          ),
        ],
      })
    );

    (blok.hari || []).forEach((h) => {
      const kegParas: Paragraph[] = [];

      (h.kegiatan_list || []).forEach((k) => {
        kegParas.push(
          new Paragraph({
            spacing: { before: 80, after: 30, line: 240 },
            children: [
              new TextRun({
                text: `Kegiatan ${k.nomor} : ${k.nama_kegiatan} `,
                bold: true,
                size: 21,
                color: DOCX_COLORS.darkText,
                font: DOCX_FONTS.primary,
              }),
              ...(k.label
                ? [
                    new TextRun({
                      text: `(${k.label})`,
                      italics: true,
                      size: 19,
                      color: DOCX_COLORS.accentAmber,
                      font: DOCX_FONTS.primary,
                    }),
                  ]
                : []),
            ],
          })
        );

        if (k.alat_dan_bahan) {
          kegParas.push(
            cellBulletWithLabelPara('Alat & Bahan', k.alat_dan_bahan, { size: 20, spaceAfter: 30 })
          );
        }

        if (k.langkah && k.langkah.length > 0) {
          kegParas.push(
            cellPara(`${k.judul_langkah || 'Cara Bermain / Membuat'}:`, { bold: true, size: 20, color: DOCX_COLORS.bodyText, spaceAfter: 20 })
          );
          k.langkah.forEach((l) => {
            kegParas.push(cellBulletPara(l, { size: 19, spaceAfter: 20, indentLeft: 360, hanging: 240 }));
          });
        }
      });

      rows.push(
        new TableRow({
          cantSplit: true,
          children: [
            createTableCell(
              [cellPara(`HARI KE-${h.hari_ke}`, { bold: true, size: 22, color: DOCX_COLORS.primaryNavy })],
              { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }
            ),
            createTableCell(kegParas.length > 0 ? kegParas : [cellPara('-')], { widthPercent: 72 }),
          ],
        })
      );
    });
  });

  // 3. TAHAP PENUTUP
  const penutupParas: Paragraph[] = [];
  if (exp?.penutup?.pengantar) {
    penutupParas.push(cellPara(exp.penutup.pengantar, { spaceAfter: 60 }));
  }
  (exp?.penutup?.poin_kegiatan || []).forEach((pt) => {
    penutupParas.push(cellNumberedPara('tahap-penutup-numbering', pt, { spaceAfter: 40 }));
  });

  rows.push(
    new TableRow({
      cantSplit: true,
      children: [
        createTableCell(
          [
            cellPara(exp?.penutup?.judul_tahap || 'TAHAP PENUTUP', { bold: true, color: DOCX_COLORS.primaryNavy }),
            cellPara('(Berkesadaran, Menggembirakan)', { italics: true, size: 18, color: DOCX_COLORS.mutedText }),
          ],
          { widthPercent: 28, bgColor: DOCX_COLORS.subHeaderBg }
        ),
        createTableCell(penutupParas.length > 0 ? penutupParas : [cellPara('-')], { widthPercent: 72 }),
      ],
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: DOCX_TABLE_BORDERS,
    rows,
  });
}

/**
 * Build Table 4: ASESMEN PEMBELAJARAN
 */
function buildTable4Asesmen(data: RpmPaudDocData): Table {
  const as = data.asesmen_pembelajaran;

  const awalParas = (as?.awal || []).map((p) => cellBulletPara(p, { spaceAfter: 40 }));
  const prosesParas = (as?.proses || []).map((p) => cellBulletPara(p, { spaceAfter: 40 }));
  const akhirParas = (as?.akhir || []).map((p) => cellBulletPara(p, { spaceAfter: 40 }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: DOCX_TABLE_BORDERS,
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: [
          createTableCell(
            [cellPara('4. ASESMEN PEMBELAJARAN', { bold: true, size: 23, color: 'FFFFFF' })],
            { bgColor: DOCX_COLORS.tableHeaderBg, colSpan: 3 }
          ),
        ],
      }),
      // 3 Columns Header
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: [
          createTableCell([cellPara('Asesmen pada Awal Pembelajaran', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 33, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell([cellPara('Asesmen pada Proses Pembelajaran', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 34, bgColor: DOCX_COLORS.subHeaderBg }),
          createTableCell([cellPara('Asesmen pada Akhir Pembelajaran', { bold: true, color: DOCX_COLORS.primaryNavy })], { widthPercent: 33, bgColor: DOCX_COLORS.subHeaderBg }),
        ],
      }),
      // Content row
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell(awalParas.length > 0 ? awalParas : [cellPara('-')], { widthPercent: 33 }),
          createTableCell(prosesParas.length > 0 ? prosesParas : [cellPara('-')], { widthPercent: 34 }),
          createTableCell(akhirParas.length > 0 ? akhirParas : [cellPara('-')], { widthPercent: 33 }),
        ],
      }),
    ],
  });
}

/**
 * Build Signature block Table
 */
function buildSignatureBlock(config: DocxExportConfig, info: RpmPaudDocData['informasi_umum']): Table {
  const city = config.city || 'Kota';
  const docDate = config.documentDate || 'Juli 2026';
  const principalName = config.principalName || 'Kepala Satuan PAUD';
  const principalNip = config.principalNip || '...........................................';
  const teacherName = config.teacherName || info.guru || 'Guru Pengajar';
  const teacherNip = config.teacherNip || '...........................................';

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('')], { widthPercent: 50 }),
          createTableCell(
            [cellPara(`${city}, ${docDate}`, { alignment: AlignmentType.CENTER })],
            { widthPercent: 50 }
          ),
        ],
      }),
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell(
            [cellPara('Mengetahui,\nKepala Satuan PAUD', { bold: true, alignment: AlignmentType.CENTER })],
            { widthPercent: 50 }
          ),
          createTableCell(
            [cellPara('Guru Kelas / Pendidik', { bold: true, alignment: AlignmentType.CENTER })],
            { widthPercent: 50 }
          ),
        ],
      }),
      // Spacer row for signature
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell([cellPara('\n\n\n\n')], { widthPercent: 50 }),
          createTableCell([cellPara('\n\n\n\n')], { widthPercent: 50 }),
        ],
      }),
      // Names row
      new TableRow({
        cantSplit: true,
        children: [
          createTableCell(
            [
              cellPara(principalName, { bold: true, alignment: AlignmentType.CENTER }),
              cellPara(`NIP. ${principalNip}`, { size: 19, color: DOCX_COLORS.mutedText, alignment: AlignmentType.CENTER }),
            ],
            { widthPercent: 50 }
          ),
          createTableCell(
            [
              cellPara(teacherName, { bold: true, alignment: AlignmentType.CENTER }),
              cellPara(`NIP. ${teacherNip}`, { size: 19, color: DOCX_COLORS.mutedText, alignment: AlignmentType.CENTER }),
            ],
            { widthPercent: 50 }
          ),
        ],
      }),
    ],
  });
}

/**
 * Build and Pack Full DOCX Document Blob
 */
export async function buildRpmPaudDocxBlob(
  data: RpmPaudDocData,
  config: DocxExportConfig
): Promise<Blob> {
  const info = data.informasi_umum || {};
  const schoolName = info.asal_sekolah || 'SATUAN PAUD';
  const docTitle = `RPM 1 Minggu: ${info.topik_subtopik || 'Perencanaan Pembelajaran'}`;

  const header = createDocumentHeader(schoolName, docTitle);
  const footer = createDocumentFooter('Kalandra • Kurikulum PAUD Permendikdasmen 2025/2026');

  const selectedSize = config.pageSize === 'F4_FOLIO' ? DOCX_PAGE_SIZE.F4_FOLIO : DOCX_PAGE_SIZE.A4;

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'cp-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 360, hanging: 360 },
                },
              },
            },
          ],
        },
        {
          reference: 'tahap-awal-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 360, hanging: 360 },
                },
              },
            },
          ],
        },
        {
          reference: 'tahap-penutup-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 360, hanging: 360 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: selectedSize,
            margin: DOCX_PAGE_MARGINS,
          },
        },
        headers: { default: header },
        footers: { default: footer },
        children: [
          // Document Header Banner
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({
                text: 'PERENCANAAN PEMBELAJARAN MENDALAM (RPM)',
                bold: true,
                size: 28, // 14pt
                color: DOCX_COLORS.primaryNavy,
                font: DOCX_FONTS.primary,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `${schoolName.toUpperCase()} — FASE FONDASI`,
                bold: true,
                size: 24, // 12pt
                color: DOCX_COLORS.headerBlue,
                font: DOCX_FONTS.primary,
              }),
            ],
          }),

          // Metadata Info Block (Grid Table)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: DOCX_COLORS.primaryNavy },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                cantSplit: true,
                children: [
                  createTableCell(
                    [
                      cellPara(`Guru: ${info.guru || '-'}`),
                      cellPara(`Fase / Jenjang: Fondasi / ${info.jenjang_kelas || 'Kelompok A'}`),
                      cellPara(`Alokasi Waktu: ${info.alokasi_waktu || '6 x 3 JP'}`),
                    ],
                    { widthPercent: 50 }
                  ),
                  createTableCell(
                    [
                      cellPara(`Semester: ${info.semester || '1 (Gasal)'}`),
                      cellPara(`Minggu / Bulan: Minggu ke-${info.minggu_ke || '1'} (${info.bulan || '-'})`),
                      cellPara(`Model: ${info.model_pembelajaran || 'Sentra / Bermain'} (${info.jumlah_anak || '15'} Anak)`),
                    ],
                    { widthPercent: 50 }
                  ),
                ],
              }),
            ],
          }),

          // Spacer
          new Paragraph({ spacing: { after: 180 } }),

          // 1. Tabel Identifikasi
          buildTable1Identifikasi(data),
          new Paragraph({ spacing: { after: 180 } }),

          // 2. Tabel Desain Pembelajaran
          buildTable2Desain(data),
          new Paragraph({ spacing: { after: 180 } }),

          // 3. Tabel Pengalaman Belajar
          buildTable3PengalamanBelajar(data),
          new Paragraph({ spacing: { after: 180 } }),

          // 4. Tabel Asesmen Pembelajaran
          buildTable4Asesmen(data),
          new Paragraph({ spacing: { after: 240 } }),

          // 5. Blok Tanda Tangan
          ...(config.includeSignatures ? [buildSignatureBlock(config, info)] : []),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
