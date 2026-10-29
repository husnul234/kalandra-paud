import { DATA_8_DPL } from '../data/cp_paud_data';

export const GEMINI_MODEL_CHAIN = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

export const SYSTEM_INSTRUCTION_RPM_PAUD = `Anda adalah Pakar Kurikulum Pendidikan Anak Usia Dini (PAUD) Kemendikdasmen RI yang menguasai penyusunan Perencanaan Pembelajaran Mendalam (Deep Learning) Fase Fondasi untuk Kelompok Bermain / KB (usia 3-4 tahun), TK Kelompok A (usia 4-5 tahun), dan Kelompok B (usia 5-6 tahun).
Standar dokumen yang Anda hasilkan harus setara dengan dokumen yang telah LULUS VERIFIKASI PENGAWAS, mencakup: IKTP bergradasi Taksonomi SOLO, Rubrik Asesmen 4 Skala (BB/MB/BSH/BSB), Catatan Keselamatan Anak, dan 4 Lampiran Instrumen Observasi.

TUGAS UTAMA:
Menyusun dokumen "PERENCANAAN PEMBELAJARAN MENDALAM" 1 Minggu (6 Hari) dalam format JSON terstruktur yang mematuhi regulasi resmi berikut:
1. Permendikdasmen Nomor 10 Tahun 2025 tentang Standar Kompetensi Lulusan (8 Dimensi Profil Lulusan & STPPA).
2. Permendikdasmen Nomor 12 Tahun 2025 tentang Standar Isi (mencakup pengetahuan esensial, pengetahuan aplikatif, serta nilai dan karakter).
3. Permendikdasmen Nomor 1 Tahun 2026 tentang Standar Proses (Prinsip Berkesadaran, Bermakna, Menggembirakan, serta tahapan Memahami, Mengaplikasi, dan Merefleksi).
4. Keputusan Kepala BSKAP Kemendikdasmen Nomor 046/H/KR/2025 tentang Capaian Pembelajaran PAUD Fase Fondasi.

ATURAN ANTI-HALUSINASI & PEDAGOGI PAUD (WAJIB DIPATUHI):
1. Larangan Istilah Lama: Gunakan istilah resmi "Dimensi Profil Lulusan" (DPL1 s.d. DPL8). DILARANG KERAS menggunakan istilah lama "Profil Pelajar Pancasila" atau singkatan "P5".
2. Kutipan CP Verbatim: Pada bagian capaian_pembelajaran, Anda WAJIB menyalin persis kalimat Capaian Pembelajaran / Subelemen yang diberikan tanpa mengubah, mengurangi, atau mengarang kalimat baru.
3. Sinkronisasi DPL 100% Konsisten:
   - Setiap Dimensi Profil Lulusan (DPL) yang dicentang pada bagian IDENTIFIKASI wajib muncul sebagai label di dalam kegiatan inti harian.
   - DILARANG menuliskan label dimensi di kegiatan inti apabila kode DPL-nya tidak dicentang pada bagian IDENTIFIKASI.
   - Pada bagian Asesmen pada Akhir Pembelajaran (poin Observasi holistik), sebutkan secara akurat nama Dimensi Profil Lulusan yang ditargetkan sesuai daftar DPL yang dicentang.
4. Arsitektur Pengalaman Belajar Inti 6 Hari (Siklus Pembelajaran Mendalam):
   - Tahap 1: MEMAHAMI (BERKESADARAN, BERMAKNA) -> Hari 1 dan Hari 2. Fokus pada pengenalan konsep dasar secara konkret, cerita, pengamatan panca indra, dan eksplorasi awal tentang topik.
   - Tahap 2: MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN) -> Hari 3 dan Hari 4. Fokus pada penerapan konsep melalui eksperimen sains/seni sederhana, merakit konstruksi loose parts/balok, dan permainan kolaboratif beraturan.
   - Tahap 3: MEREFLEKSI (BERKESADARAN, BERMAKNA) -> Hari 5 dan Hari 6. Fokus pada permainan pemecahan masalah (sebab-akibat), unjuk karya/presentasi sederhana di depan teman, menyampaikan alasan atas pilihannya, dan refleksi pengalaman belajar.
5. Struktur 3 Kegiatan Bermain per Hari (Total 18 Kegiatan Seminggu) & KEKAYAAN PEDAGOGICAL SCRIPTING:
   - Setiap hari WAJIB memuat tepat 3 Kegiatan yang seimbang (Olah Pikir, Olah Hati, Olah Rasa, Olah Raga):
     * Kegiatan 1: Eksplorasi karya seni / konstruksi / sains-rekayasa konkret menggunakan bahan lepasan (loose parts: kardus bekas, piring kertas, stik es krim, daun kering, dll.). Wajib judul_langkah: "Cara Membuat".
     * Kegiatan 2: Permainan fisik-motorik kasar/halus atau sosial-emosional interaktif (contoh: cermin ajaib, estafet senyum, lompat rintangan tali). Wajib judul_langkah: "Cara Bermain".
     * Kegiatan 3: Permainan lingkaran (circle game), bahasa & komunikasi, atau pramembaca/pranumerasi kontekstual yang menyenangkan. DILARANG KERAS memberikan tugas dril Lembar Kerja Anak (LKA/LKS) calistung mekanis! Wajib judul_langkah: "Cara Bermain".
   - STANDAR KEKAYAAN NARASI (PEDAGOGICAL SCRIPTING - DILARANG KERAS KALIMAT TELEGRAFIK PENDEK!):
     * SETIAP KEGIATAN WAJIB MEMILIKI TEPAT 4 LANGKAH DESKRIPTIF YANG KAYA, HIDUP, DAN MENGAJAR (Bukan kalimat 5 kata seperti 'Guru menata meja', melainkan kalimat utuh 15-30 kata yang menjelaskan Who, What, How, dan dialog pemantik).
     * Pola alur 4 langkah per kegiatan wajib terstruktur pedagogis PAUD:
       1. Pijakan Awal & Pertanyaan Pemantik Guru (Wajib kutipan dialog guru bertanda kutip): Guru menata lingkungan main secara estetik, mengumpulkan anak, dan mengajukan pertanyaan pemantik bernalar kritis dengan kalimat langsung (contoh: Guru mengajak anak mengamati wadah loose parts lalu bertanya: "Menurutmu bahan mana yang paling cocok dijadikan roda mobil? Bagaimana jika kita mengujinya di lantai miring?").
       2. Aksi Eksplorasi Mandiri & Contoh Konkret (Wajib contoh variasi dalam tanda kurung 'misal: ...'): Anak memilih bahan yang disukai, mengamati perbedaan tekstur/ukuran, dan menentukan rancangannya (contoh: Anak memilih loose parts yang diinginkan (misal: kancing besar untuk mata, stik es krim untuk bingkai, daun kering untuk rambut) lalu menata polanya secara mandiri).
       3. Kreasi & Skenario Bermain Peran (Hands-on Deep Play): Aksi inti merakit karya atau skenario interaksi kelompok (contoh: Anak secara berpasangan berbagi tugas (misal: satu anak memegang kardus dan pasangannya merekatkan selotip), kemudian menguji coba hasil karyanya sambil saling bertukar senyum dan tawa).
       4. Komunikasi, Refleksi, & Apresiasi Sosial: Anak menceritakan karyanya, mengekspresikan perasaannya, atau membereskan media bersama (contoh: Secara bergantian, anak menceritakan keunikan karyanya di depan teman sebangku, saling memberikan tepuk tangan apresiasi, lalu gotong royong merapikan loose parts ke keranjang penyimpanan).
   - STANDAR ALAT & BAHAN (LOOSE PARTS KAYA & KONKRET):
     * Wajib mencantumkan minimal 4 sampai 6 material konkret yang variatif, murah, aman, dan kontekstual dengan topik (contoh: "Kertas karton pola oval, lem kertas aman anak, stik es krim kayu, potongan kain perca, kancing baju bekas, spidol warna"). DILARANG HANYA MENULIS 1 ATAU 2 BAHAN SINGKAT!
   - PENAMAAN KEGIATAN & LABEL:
     * Field nama_kegiatan HANYA berisi nama kegiatan yang deskriptif menarik (contoh: "Membuat Kolase Wajah Anggota Keluarga dari Loose Parts"). DILARANG menaruh tanda kurung label DPL di dalam nama_kegiatan agar tidak terduplikasi di dokumen cetak!
     * Field label HANYA berisi prinsip belajar dan kode Dimensi Profil Lulusan (contoh: "berkesadaran, kreativitas, DPL4").
   - Jika kegiatan melibatkan gunting, cat, cairan, panas, atau ketinggian: tambahkan catatan_keselamatan sebagai array string dalam objek kegiatan itu.
6. Kesesuaian Tahap Perkembangan Usia (DAP):
   - Jika Jenjang/Kelas adalah KB (3-4 Tahun) / Usia 3-4 Tahun: Tahap sensori-motorik dan eksplorasi konkret. Rancang kegiatan yang sangat aman (DILARANG gunting tajam atau partikel kecil berisiko tersedak), gunakan loose parts berukuran besar (kardus, daun besar, mangkok plastik, wadah bertutup, playdough buatan sendiri), fokus pada stimulasi motorik kasar, eksplorasi indera (meraba tekstur, warna, bunyi), meniru gerakan hewan/lagu, serta pendampingan intensif penuh oleh guru.
   - Jika Jenjang/Kelas adalah A (4-5 Tahun): Koordinasi motorik halus masih berkembang. Tuliskan eksplisit jika guru telah menyiapkan garis pola dasar pada Pijakan Lingkungan Main, anak menjiplak sederhana, menggunting garis lurus, mengecat, merakit loose parts, dan bermain.
   - Jika Jenjang/Kelas adalah B (5-6 Tahun): Anak dilibatkan sejak membuat pola sederhana, menggunting dengan gunting anak secara mandiri, mengukur dengan satuan tidak baku, dan merakit konstruksi yang lebih menantang.
7. IKTP Bergradasi Taksonomi SOLO (WAJIB untuk setiap Tujuan Pembelajaran):
   - Untuk setiap tujuan_pembelajaran, wajib sertakan 1 entri di array iktp_bergradasi yang berisi 4 level deskriptor:
     * BB (Belum Berkembang / Unistruktural): Anak menunjukkan 1 elemen saja, masih membutuhkan banyak pendampingan.
     * MB (Mulai Berkembang / Multistruktural): Anak menunjukkan beberapa elemen secara terpisah, dengan panduan sesekali.
     * BSH (Berkembang Sesuai Harapan / Relasional): Anak menghubungkan elemen secara mandiri, menunjukkan pemahaman utuh.
     * BSB (Berkembang Sangat Baik / Extended Abstract): Anak mampu mentransfer, mencipta, dan menggeneralisasi ke situasi baru.
   - Tulis setiap deskriptor sebagai kalimat behavioral yang spesifik dan dapat diobservasi (bukan kata sifat abstrak).
8. Rubrik Asesmen 4 Skala (WAJIB, minimal 3 kriteria per dokumen):
   - Setiap rubrik_asesmen berisi: kriteria (singkat, max 8 kata), dan 4 deskriptor BB, MB, BSH, BSB yang dapat diamati.
   - Tambahkan 1-2 kriteria untuk keterampilan proses (contoh: kerjasama, kreativitas, komunikasi lisan).
9. Catatan Keselamatan Anak (WAJIB jika ada kegiatan fisik, bahan tajam, atau cairan):
   - Di field catatan_keselamatan (root level), tulis array string berisi prosedur mitigasi risiko umum (contoh: 'Gunting plastik berujung bulat', 'Guru mendampingi penuh saat pewarna cair').
   - Di setiap kegiatan yang berisiko, tambahkan juga field catatan_keselamatan lokal.
10. Lampiran Instrumen Observasi (4 Instrumen Siap Cetak di field lampiran_instrumen):
    - catatan_anekdot: Panduan format catatan anekdot + contoh isian lengkap.
    - ceklis_iktp: Panduan ceklis IKTP per anak (kolom header = Tujuan 1..N, baris = nama anak, isi = BB/MB/BSH/BSB).
    - hasil_karya: Panduan dokumentasi hasil karya + tips penyimpanan portofolio.
    - foto_berseri: Panduan foto berseri/portofolio visual (jenis foto, teknik, pengarsipan).
11. Return Format:
    Kembalikan HANYA teks JSON murni (tanpa pembuka backtick json dan tanpa penutup backtick) yang valid dan dapat di-JSON.parse().`;

export interface IktpBergradasiItem {
  tujuan_ke: number;
  tujuan_ringkas: string;
  solo_bb: string; // Belum Berkembang - Unistruktural
  solo_mb: string; // Mulai Berkembang - Multistruktural
  solo_bsh: string; // Berkembang Sesuai Harapan - Relasional
  solo_bsb: string; // Berkembang Sangat Baik - Extended Abstract
}

export interface RubrikAsesmenItem {
  kriteria: string;
  bb: string;
  mb: string;
  bsh: string;
  bsb: string;
}

export interface LampiranInstrumen {
  catatan_anekdot?: string;
  ceklis_iktp?: string;
  hasil_karya?: string;
  foto_berseri?: string;
}

export interface PromptInputParams {
  guru: string;
  asal_sekolah: string;
  fase: string;
  jenjang_kelas: string;
  semester: string;
  minggu_ke: string;
  bulan: string;
  alokasi_waktu: string;
  model_pembelajaran: string;
  jumlah_anak: string;
  topik_subtopik: string;
  dpl_selected: string[];
  subelemen_selected: Array<{
    kode: string;
    subelemen: string;
    indikator_ketercapaian: string[];
  }>;
  loose_parts_selected: string[];
  catatan_guru: string;
}

export function assembleDynamicUserPrompt(p: PromptInputParams): string {
  const dplListText = p.dpl_selected
    .map((code) => {
      const item = DATA_8_DPL.find((d) => d.kode === code);
      return `- ${code} (${item?.nama || code}): ${item?.fokus_paud || ''}`;
    })
    .join('\n');

  const cpListText = p.subelemen_selected
    .map((s) => `- [${s.kode}] ${s.subelemen}`)
    .join('\n');

  const indListText = p.subelemen_selected
    .map((s) => `• [${s.kode}]: ${s.indikator_ketercapaian.join(', ')}`)
    .join('\n');

  const loosePartsText = p.loose_parts_selected.length > 0
    ? `Bahan Loose Parts Utama: ${p.loose_parts_selected.join(', ')}`
    : 'Bahan Loose Parts: kardus, piring kertas, stik es krim, tutup botol, daun kering.';

  return `Susunlah dokumen PERENCANAAN PEMBELAJARAN MENDALAM 1 Minggu secara lengkap dan SETARA STANDAR PENGAWAS berdasarkan parameter berikut:

1. IDENTITAS DOKUMEN:
- Nama Guru: ${p.guru || 'Guru PAUD'}
- Asal Sekolah: ${p.asal_sekolah || 'Satuan PAUD'}
- Fase: ${p.fase || 'Fondasi'}
- Jenjang/Kelas: ${p.jenjang_kelas || 'A (4-5 Tahun)'}
- Semester: ${p.semester || '1 (Gasal)'}
- Minggu Ke-: ${p.minggu_ke || '1'}
- Bulan: ${p.bulan || 'Juli 2026'}
- Alokasi Waktu: ${p.alokasi_waktu || '6 x 3 JP'}
- Model Pembelajaran: ${p.model_pembelajaran || 'Sentra / Kelompok'}
- Jumlah Anak: ${p.jumlah_anak || '15'}
- Topik / Sub Topik: ${p.topik_subtopik}

2. DIMENSI PROFIL LULUSAN YANG DITARGETKAN (Wajib sinkron di Identifikasi, Label Kegiatan Harian, dan Asesmen Akhir):
${dplListText || '- DPL1, DPL3, DPL4, DPL5, DPL6, DPL7, DPL8'}

3. CAPAIAN PEMBELAJARAN RESMI DARI FILE cp_paud_detail_2025.json (Salin verbatim ke dalam array capaian_pembelajaran):
${cpListText || '- Murid mengenali identitas dirinya dan berpartisipasi aktif dalam kegiatan bermain.'}

4. INDIKATOR KETERCAPAIAN ACUAN (Gunakan untuk merumuskan Tujuan Pembelajaran, 18 Kegiatan Inti, dan Asesmen):
${indListText || '• Menunjukkan rasa percaya diri, berkolaborasi, dan menghasilkan karya kreatif.'}

5. CATATAN TAMBAHAN & LOOSE PARTS:
${loosePartsText}
${p.catatan_guru ? `Catatan Konteks Sekolah: ${p.catatan_guru}` : ''}

Wajib kembalikan format JSON sesuai struktur skema lengkap berikut (SEMUA field wajib diisi, hindari null atau string kosong):
{
  "informasi_umum": { "guru": "...", "asal_sekolah": "...", "fase": "...", "jenjang_kelas": "...", "semester": "...", "minggu_ke": "...", "bulan": "...", "alokasi_waktu": "...", "model_pembelajaran": "...", "jumlah_anak": "...", "topik_subtopik": "..." },
  "identifikasi": {
    "peserta_didik": "...",
    "materi_pelajaran": "...",
    "dimensi_profil_lulusan_terpilih": ${JSON.stringify(p.dpl_selected)}
  },
  "desain_pembelajaran": {
    "capaian_pembelajaran": [ "... salin verbatim ..." ],
    "lintas_disiplin_ilmu": "...",
    "tujuan_pembelajaran": [ "Tujuan 1 (min 3 tujuan, tiap tujuan 1 string)", "Tujuan 2", "Tujuan 3" ],
    "topik_pembelajaran": "${p.topik_subtopik}",
    "praktik_pedagogis": "...",
    "kemitraan_pembelajaran": { "lingkungan_sekolah": "...", "masyarakat": "...", "lingkungan_luar_sekolah": "..." },
    "lingkungan_pembelajaran": { "ruang_fisik": "...", "ruang_virtual": "...", "budaya_belajar": "..." },
    "pemanfaatan_digital": { "perencanaan": "...", "pelaksanaan": "...", "asesmen": "...", "tautan_media": "..." }
  },
  "pengalaman_belajar": {
    "awal": { "judul_tahap": "AWAL (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)", "pengantar": "...", "poin_kegiatan": [ "...", "...", "...", "...", "..." ] },
    "inti": {
      "pengantar": "...",
      "blok_tahap": [
        {
          "header_tahap": "MEMAHAMI (BERKESADARAN, BERMAKNA)",
          "hari": [
            {
              "hari_ke": 1,
              "kegiatan_list": [
                {
                  "nomor": 1,
                  "nama_kegiatan": "Membuat Boneka Jari Keluargaku dari Loose Parts",
                  "label": "berkesadaran, kreativitas, DPL4",
                  "alat_dan_bahan": "Kertas karton pola jari, stik es krim kayu, kancing baju bekas aneka warna, potongan kain perca, benang wol, lem fox aman anak, spidol warna",
                  "judul_langkah": "Cara Membuat",
                  "langkah": [
                    "Guru menyiapkan wadah aneka loose parts di meja kegiatan lalu mengajukan pertanyaan pemantik dialogis: \"Siapa saja anggota keluarga yang tinggal di rumahmu? Bagaimana jika hari ini kita membuat karakternya menggunakan stik dan kain perca ini?\"",
                    "Anak memilih material loose parts yang disukainya dari keranjang (misal: kancing besar untuk mata ayah, benang wol untuk rambut ibu) lalu menjiplak bentuk jemarinya dengan bimbingan hangat guru.",
                    "Anak secara tekun merekatkan stik es krim sebagai gagang pegangan dan menempelkan loose parts membentuk karakter anggota keluarga yang dicintainya.",
                    "Secara berpasangan, anak menceritakan keunikan boneka buatannya kepada teman di sampingnya, lalu seluruh anak bersama-sama merapikan sisa bahan ke dalam kotak penyimpanan."
                  ],
                  "catatan_keselamatan": ["Pengawasan penuh guru saat anak menggunakan lem dan gunting berujung bulat"]
                },
                {
                  "nomor": 2,
                  "nama_kegiatan": "Permainan 'Tali Persahabatan: Menggelindingkan Bola Ceria'",
                  "label": "menggembirakan, kolaborasi, DPL2",
                  "alat_dan_bahan": "Bola karet empuk warna-warni bertekstur, pita pembatas / tali rafia panjang, karpet lingkaran, musik instrumental ceria",
                  "judul_langkah": "Cara Bermain",
                  "langkah": [
                    "Guru memandu anak duduk melingkar di atas karpet dan mendemonstrasikan aturan main menggulirkan bola secara santun dan kompak tanpa berebut.",
                    "Anak berpasangan memegang ujung pita pembatas (misal: berpasangan dengan teman sebangku) lalu bekerja sama menggulirkan bola melewati rintangan sederhana (misal: mengitari botol plastik, melewati bawah meja kecil).",
                    "Saat menerima bola, anak menyapa pasangannya dengan senyuman gembira sambil menyebutkan nama temannya dengan suara lantang dan ramah: \"Halo temanku, ini giliranmu!\"",
                    "Guru mengamati kekompakan kerjasama dan komunikasi antar anak, memberikan tepuk tangan ceria, dan mengajak anak saling berterima kasih atas kebersamaannya."
                  ]
                },
                {
                  "nomor": 3,
                  "nama_kegiatan": "Lingkaran Cerita Interaktif 'Kartu Ekspresi Wajahku'",
                  "label": "bermakna, komunikasi, DPL8",
                  "alat_dan_bahan": "Boneka tangan karakter beruang, kartu ekspresi wajah anak (senang, sedih, takjub), rebana mini kayu, karpet santai",
                  "judul_langkah": "Cara Bermain",
                  "langkah": [
                    "Guru membuka sesi bermain lingkaran dengan membunyikan rebana mini secara lembut dan bertanya: \"Bagaimana perasaan hatimu ketika bermain bersama teman-teman hari ini?\"",
                    "Anak menyimak cerita dongeng boneka tangan dengan antusias, lalu menirukan berbagai ekspresi emosi pada kartu gambar (misal: tersenyum lebar saat senang, mata membesar saat takjub).",
                    "Secara bergantian, anak mengangkat kartu ekspresi yang mewakili perasaannya hari ini lalu menceritakan alasan perasaannya dengan kalimat sederhana tanpa rasa takut.",
                    "Guru memvalidasi seluruh perasaan anak dengan pelukan hangat dan bersama-sama menyanyikan lagu penutup bertema persahabatan penuh sukacita."
                  ]
                }
              ]
            },
            { "hari_ke": 2, "kegiatan_list": [ ... 3 kegiatan serupa: masing-masing WAJIB 3-4 LANGKAH DESKRIPTIF dan 4-6 BAHAN KONKRET ... ] }
          ]
        },
        {
          "header_tahap": "MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)",
          "hari": [
            { "hari_ke": 3, "kegiatan_list": [ ... 3 kegiatan serupa: masing-masing WAJIB 3-4 LANGKAH DESKRIPTIF dan 4-6 BAHAN KONKRET ... ] },
            { "hari_ke": 4, "kegiatan_list": [ ... 3 kegiatan serupa: masing-masing WAJIB 3-4 LANGKAH DESKRIPTIF dan 4-6 BAHAN KONKRET ... ] }
          ]
        },
        {
          "header_tahap": "MEREFLEKSI (BERKESADARAN, BERMAKNA)",
          "hari": [
            { "hari_ke": 5, "kegiatan_list": [ ... 3 kegiatan serupa: masing-masing WAJIB 3-4 LANGKAH DESKRIPTIF dan 4-6 BAHAN KONKRET ... ] },
            { "hari_ke": 6, "kegiatan_list": [ ... 3 kegiatan serupa: masing-masing WAJIB 3-4 LANGKAH DESKRIPTIF dan 4-6 BAHAN KONKRET ... ] }
          ]
        }
      ]
    },
    "penutup": { "judul_tahap": "PENUTUP (BERKESADARAN, MENGGEMBIRAKAN)", "pengantar": "...", "poin_kegiatan": [ "...", "...", "...", "...", "..." ] }
  },
  "asesmen_pembelajaran": {
    "awal": [ "...", "..." ],
    "proses": [ "...", "..." ],
    "akhir": [ "...", "..." ]
  },
  "iktp_bergradasi": [
    {
      "tujuan_ke": 1,
      "tujuan_ringkas": "Anak dapat ... (max 10 kata)",
      "solo_bb": "BB: Anak ... (kalimat behavioral spesifik yang dapat diobservasi, menggunakan kata kerja operasional)",
      "solo_mb": "MB: Anak ... (kalimat behavioral spesifik)",
      "solo_bsh": "BSH: Anak ... (kalimat behavioral spesifik)",
      "solo_bsb": "BSB: Anak ... (kalimat behavioral spesifik, transfer ke situasi baru)"
    }
  ],
  "rubrik_asesmen": [
    {
      "kriteria": "Nama Kriteria Singkat (max 8 kata)",
      "bb": "Deskriptor BB yang dapat diobservasi langsung",
      "mb": "Deskriptor MB yang dapat diobservasi langsung",
      "bsh": "Deskriptor BSH yang dapat diobservasi langsung",
      "bsb": "Deskriptor BSB yang dapat diobservasi langsung"
    }
  ],
  "catatan_keselamatan": [
    "Prosedur mitigasi risiko 1...",
    "Prosedur mitigasi risiko 2..."
  ],
  "lampiran_instrumen": {
    "catatan_anekdot": "Panduan + contoh isian catatan anekdot untuk topik ${p.topik_subtopik} ...",
    "ceklis_iktp": "Panduan ceklis IKTP per anak untuk topik ${p.topik_subtopik} ...",
    "hasil_karya": "Panduan dokumentasi hasil karya untuk topik ${p.topik_subtopik} ...",
    "foto_berseri": "Panduan foto berseri/portofolio visual untuk topik ${p.topik_subtopik} ..."
  }
}
PENTING:
- PADA 18 KEGIATAN INTI: SETIAP KEGIATAN WAJIB MEMILIKI TEPAT 4 LANGKAH DESKRIPTIF DENGAN GAYA "PEDAGOGICAL SCRIPTING" (DILARANG KERAS HANYA 1-2 BARIS PENDEK ATAU KALIMAT TELEGRAFIK KAKU!).
- Setiap langkah berupa kalimat naratif utuh (15-30 kata) yang menjelaskan tindakan nyata guru dan anak.
- Wajib memuat pertanyaan pemantik dialogis guru dengan tanda kutip (contoh: Guru bertanya: "Menurutmu bagaimana cara membuatnya kokoh?").
- Wajib memuat contoh konkret dalam tanda kurung (misal: ...).
- Alat dan bahan wajib kaya: sebutkan minimal 4-6 media loose parts konkret per kegiatan.
- nama_kegiatan HANYA nama kegiatan yang menarik (DILARANG menaruh tanda kurung label DPL di nama_kegiatan, letakkan hanya di field "label").
- Semua deskriptor di iktp_bergradasi dan rubrik_asesmen harus menggunakan kata kerja operasional (menunjukkan, menyebutkan, menghubungkan, merancang, dll.) yang dapat diamati langsung oleh guru tanpa tes tulis. Jumlah entri iktp_bergradasi harus sama dengan jumlah tujuan_pembelajaran.`;
}

export function stripMarkdownJson(text: string): string {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean.trim();
}

import { 
  loadSystemKeyPool, 
  markKeyRateLimited, 
  acquireConcurrencySlot,
  getOrderedKeys
} from './geminiKeyPool';
import {
  executeDattioRpmRequest,
  testDattioApiKey,
  requestDattioAiRekomendasiTopik,
  executeDattioPartitionedDocumentEdit,
  getDattioApiKey,
} from './dattio-client';

/**
 * Direct Gemini / Dattio AI invocation with multi-key pool rotation and model fallback chain
 */
export async function executeDirectGeminiRequest(
  apiKeys: string[],
  systemPrompt: string,
  userPrompt: string,
  onStatusUpdate?: (status: { message: string; keyMasked?: string; model?: string }) => void
): Promise<{ success: boolean; data: any; usedModel: string; usedKeyMasked: string }> {
  let activePool = apiKeys && apiKeys.length > 0 ? [...apiKeys] : [];
  
  if (activePool.length === 0) {
    activePool = await loadSystemKeyPool();
  }

  activePool = getOrderedKeys(activePool);

  if (activePool.length === 0) {
    throw new Error('Layanan AI Kalandra sedang menyinkronkan kuota sistem. Silakan muat ulang atau coba beberapa saat lagi.');
  }

  let lastError = '';

  for (let kIdx = 0; kIdx < activePool.length; kIdx++) {
    const key = activePool[kIdx];
    const keyShort = `...${key.slice(-4)}`;

    // Route to Dattio AI (OpenAI Compatible Protocol) if key starts with sk-
    if (key.startsWith('sk-')) {
      if (onStatusUpdate) {
        onStatusUpdate({
          message: 'Menghubungkan ke Dattio AI Enterprise Pool (glm-5.2)...',
          keyMasked: keyShort,
          model: 'glm-5.2',
        });
      }
      try {
        const dattioRes = await executeDattioRpmRequest({
          systemPrompt,
          userPrompt,
          apiKey: key,
          onStatusUpdate,
        });
        return {
          success: true,
          data: dattioRes.data,
          usedModel: dattioRes.usedModel,
          usedKeyMasked: dattioRes.usedKeyMasked,
        };
      } catch (dattioErr: any) {
        console.warn(`[Engine] Dattio key ${keyShort} error, failover ke pool berikutnya:`, dattioErr);
        lastError = dattioErr.message || 'Dattio AI request failed';
        continue;
      }
    }

    for (const model of GEMINI_MODEL_CHAIN) {
      if (onStatusUpdate) {
        onStatusUpdate({
          message: 'Dokumen Perangkat Pembelajaran Anda sedang dibuat...',
          keyMasked: keyShort,
          model,
        });
      }

      try {
        await acquireConcurrencySlot(350);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `INSTRUCTIONS:\n${systemPrompt}` }],
              },
              {
                role: 'model',
                parts: [{ text: 'Siap, saya mengerti instruksi penyusunan RPM PAUD 2025/2026 standar pengawas, termasuk IKTP SOLO, Rubrik 4 Skala (BB/MB/BSH/BSB), Catatan Keselamatan, dan 4 Lampiran Instrumen Observasi.' }],
              },
              {
                role: 'user',
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.35,
              topP: 0.95,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (response.ok) {
          const resJson = await response.json();
          const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) {
            lastError = 'Model mengembalikan respons teks kosong.';
            continue;
          }

          const cleaned = stripMarkdownJson(rawText);
          const parsed = JSON.parse(cleaned);

          return {
            success: true,
            data: parsed,
            usedModel: model,
            usedKeyMasked: keyShort,
          };
        }

        // Quota exhaustion 429 -> Rotate immediately to next key
        if (response.status === 429) {
          markKeyRateLimited(key, 60);
          console.warn(`[BYOK Direct] Quota limit 429 on key ${keyShort}. Rotasi ke kunci berikutnya.`);
          lastError = `Limit kuota (429) pada key ${keyShort}. Beralih ke kunci cadangan...`;
          if (onStatusUpdate) {
            onStatusUpdate({ message: 'Menyesuaikan antrean sistem, melanjutkan pembuatan dokumen...' });
          }
          break; // Break inner model loop, switch key
        }

        // 404 or 503 -> Fallback to next model
        if (response.status === 404 || response.status === 503) {
          console.warn(`[BYOK Direct] Model ${model} returned ${response.status}. Fallback model.`);
          lastError = `Model ${model} tidak merespons (${response.status}).`;
          continue;
        }

        if (response.status === 401 || response.status === 403) {
          console.warn(`[BYOK Direct] Key ${keyShort} tidak aktif (${response.status}). Mengalihkan ke kunci berikutnya.`);
          lastError = `API Key ${keyShort} tidak valid atau kedaluwarsa.`;
          break;
        }

        const errText = await response.text();
        lastError = `API error ${response.status}: ${errText}`;
      } catch (err) {
        lastError = `Network error: ${String(err)}`;
      }
    }
  }

  throw new Error(lastError || 'Seluruh API Key Gemini atau model cadangan telah dicoba namun belum berhasil.');
}

/**
 * Ping test a single API key (auto-detects Gemini vs Dattio sk- key)
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; model?: string; error?: string }> {
  if (apiKey.trim().startsWith('sk-')) {
    const dattioRes = await testDattioApiKey(apiKey.trim());
    return {
      success: dattioRes.success,
      model: dattioRes.model,
      error: dattioRes.error,
    };
  }

  for (const model of GEMINI_MODEL_CHAIN) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "ping. Balas 'pong'." }] }],
        }),
      });

      if (res.ok) {
        return { success: true, model };
      }

      if (res.status === 404) {
        continue; // Try next model
      }

      const errText = await res.text();
      return { success: false, error: `Gagal (${res.status}): ${errText}` };
    } catch (err) {
      return { success: false, error: `Koneksi gagal: ${String(err)}` };
    }
  }
  return { success: false, error: 'Tidak ada model yang kompatibel untuk kunci ini.' };
}

export interface AiRekomendasiResult {
  dpl_codes: string[];
  subelemen_codes: string[];
  loose_parts: string[];
  alasan_singkat: string;
}

/**
 * Fast AI Recommender for DPL, CP Sub-elements, and Loose Parts based on Topic
 * Prioritizes Dattio AI (deepseek-v4-flash) with seamless fallback to Gemini
 */
export async function requestAiRekomendasiTopik(
  apiKeys: string[],
  topik: string,
  jenjangKelas: string
): Promise<AiRekomendasiResult> {
  const dattioKey = apiKeys.find((k) => k && k.startsWith('sk-')) || getDattioApiKey();
  if (dattioKey) {
    try {
      return await requestDattioAiRekomendasiTopik(topik, jenjangKelas, dattioKey);
    } catch (dattioErr) {
      console.warn('[AI Rekomendasi] Dattio error, fallback ke Gemini:', dattioErr);
    }
  }

  const prompt = `Anda adalah Pakar Kurikulum PAUD Kemendikdasmen RI.
Topik Pembelajaran: "${topik}"
Jenjang Kelas: "${jenjangKelas}"

Tugas Anda:
Berdasarkan Permendikdasmen No. 10/2025 dan Keputusan Kepala BSKAP No. 046/H/KR/2025, rekomendasikan:
1. dpl_codes: 3 sampai 5 kode Dimensi Profil Lulusan yang paling esensial dan relevan (pilihan yang valid HANYA: DPL1, DPL2, DPL3, DPL4, DPL5, DPL6, DPL7, DPL8).
2. subelemen_codes: 3 sampai 4 kode subelemen Capaian Pembelajaran PAUD yang paling selaras (pilihan yang valid HANYA: NABP-1, NABP-2, NABP-3, NABP-4, JD-1, JD-2, JD-3, JD-4, JD-5, STEAM-1, STEAM-2, STEAM-3, STEAM-4, STEAM-5).
3. loose_parts: 4 sampai 6 bahan material lepas (loose parts) konkret yang murah, mudah dicari di lingkungan PAUD, kontekstual dengan topik, dan aman untuk anak usia ${jenjangKelas}.
4. alasan_singkat: 1-2 kalimat alasan pedagogis ringkas mengapa kombinasi ini cocok.

Kembalikan HANYA teks JSON murni (tanpa tanda kutip markdown backtick json):
{
  "dpl_codes": ["DPL1", "DPL7"],
  "subelemen_codes": ["NABP-2", "JD-5"],
  "loose_parts": ["Kardus bekas", "Botol semprot bekas", "Spons busa"],
  "alasan_singkat": "Menguatkan kemandirian merawat diri dan eksplorasi bahan kebersihan."
}`;

  const res = await executeDirectGeminiRequest(
    apiKeys,
    'Anda adalah asisten cerdas kurikulum PAUD Kemendikdasmen RI yang memberikan rekomendasi pemetaan kurikulum yang akurat dan ringkas dalam format JSON.',
    prompt
  );

  return res.data as AiRekomendasiResult;
}

export interface PartitionedRevisionRequest {
  sectionTitle: string;
  currentContent: any;
  userInstruction: string;
  topikSubtopik: string;
  jenjangKelas: string;
}

export interface PartitionedRevisionResponse {
  summary: string;
  revisedContent: any;
  explanation: string;
}

/**
 * Targeted Section Partitioned Document Editor for Pro Chat Assistant
 * Only sends and receives the targeted section to save 85% tokens and prevent quota waste
 */
export async function executePartitionedDocumentEdit(
  apiKeys: string[],
  request: PartitionedRevisionRequest
): Promise<PartitionedRevisionResponse> {
  const dattioKey = apiKeys.find((k) => k && k.startsWith('sk-')) || getDattioApiKey();
  if (dattioKey) {
    try {
      return await executeDattioPartitionedDocumentEdit(request, dattioKey);
    } catch (dattioErr) {
      console.warn('[Partitioned Edit] Dattio error, fallback ke Gemini:', dattioErr);
    }
  }

  const systemPrompt = `Anda adalah Asisten Editor RPM PAUD Kemendikdasmen RI.
Tugas Anda merevisi HANYA satu bagian spesifik dari dokumen pembelajaran TK berdasarkan instruksi guru.
PENTING:
- Tetap patuhi prinsip pembelajaran mendalam (berkesadaran, bermakna, menggembirakan).
- Pertahankan struktur field JSON agar cocok dengan dokumen induk.
- Jangan gunakan tes tertulis atau LKS calistung mekanis.`;

  const userPrompt = `BAGIAN YANG INGIN DIREVISI: "${request.sectionTitle}"
TOPIK: "${request.topikSubtopik}" (${request.jenjangKelas})

KONTEN SAAT INI:
${JSON.stringify(request.currentContent, null, 2)}

PERMINTAAN PERUBAHAN DARI GURU:
"${request.userInstruction}"

Kembalikan HANYA teks JSON murni dengan format:
{
  "summary": "Ringkasan 1 kalimat tentang apa yang diubah",
  "explanation": "Alasan pedagogis mengapa perubahan ini mendukung pembelajaran anak",
  "revisedContent": <konten JSON bagian ini yang sudah diperbarui dengan struktur persis sama seperti KONTEN SAAT INI>
}`;

  const res = await executeDirectGeminiRequest(apiKeys, systemPrompt, userPrompt);
  return res.data as PartitionedRevisionResponse;
}

