import { DATA_8_DPL } from '../data/cp_paud_data';

export const GEMINI_MODEL_CHAIN = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.0-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

export const SYSTEM_INSTRUCTION_RPM_PAUD = `Anda adalah Pakar Kurikulum Pendidikan Anak Usia Dini (PAUD) Kemendikdasmen RI yang menguasai penyusunan Perencanaan Pembelajaran Mendalam (Deep Learning) Fase Fondasi untuk TK Kelompok A (usia 4-5 tahun) dan Kelompok B (usia 5-6 tahun).

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
5. Struktur 3 Kegiatan Bermain per Hari (Total 18 Kegiatan Seminggu):
   - Setiap hari WAJIB memuat tepat 3 Kegiatan yang seimbang (Olah Pikir, Olah Hati, Olah Rasa, Olah Raga):
     * Kegiatan 1: Eksplorasi karya seni / konstruksi / sains-rekayasa konkret menggunakan bahan lepasan (loose parts: kardus bekas, piring kertas, stik es krim, daun kering, dll.). Wajib mencantumkan Alat dan bahan serta langkah Cara Membuat yang jelas.
     * Kegiatan 2: Permainan fisik-motorik kasar/halus atau sosial-emosional interaktif (contoh: cermin ajaib, estafet senyum, lompat rintangan tali). Wajib mencantumkan Alat dan bahan serta Cara bermain.
     * Kegiatan 3: Permainan lingkaran (circle game), bahasa & komunikasi, atau pramembaca/pranumerasi kontekstual yang menyenangkan. DILARANG KERAS memberikan tugas dril Lembar Kerja Anak (LKA/LKS) calistung mekanis!
   - Setiap judul kegiatan WAJIB diikuti tanda kurung berisi minimal 1 Prinsip Pembelajaran (berkesadaran / bermakna / menggembirakan) dan 1 Dimensi Profil Lulusan yang relevan.
6. Kesesuaian Tahap Perkembangan Usia (DAP):
   - Jika Jenjang/Kelas adalah A (4-5 Tahun): Koordinasi motorik halus masih berkembang. Tuliskan eksplisit jika guru telah menyiapkan garis pola dasar pada Pijakan Lingkungan Main, anak menjiplak sederhana, menggunting garis lurus, mengecat, merakit loose parts, dan bermain.
   - Jika Jenjang/Kelas adalah B (5-6 Tahun): Anak dilibatkan sejak membuat pola sederhana, menggunting dengan gunting anak secara mandiri, mengukur dengan satuan tidak baku, dan merakit konstruksi yang lebih menantang.
7. Return Format:
   Kembalikan HANYA teks JSON murni (tanpa pembuka markdown \`\`\`json dan tanpa penutup \`\`\`) yang valid dan dapat di-JSON.parse().`;

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

  return `Susunlah dokumen PERENCANAAN PEMBELAJARAN MENDALAM 1 Minggu secara lengkap dan siap cetak berdasarkan parameter berikut:

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

Wajib kembalikan format JSON sesuai struktur skema:
{
  "informasi_umum": { ... },
  "identifikasi": {
    "peserta_didik": "...",
    "materi_pelajaran": "...",
    "dimensi_profil_lulusan_terpilih": ${JSON.stringify(p.dpl_selected)}
  },
  "desain_pembelajaran": {
    "capaian_pembelajaran": [ ... salin verbatim ... ],
    "lintas_disiplin_ilmu": "...",
    "tujuan_pembelajaran": [ ... minimal 3 tujuan ... ],
    "topik_pembelajaran": "${p.topik_subtopik}",
    "praktik_pedagogis": "...",
    "kemitraan_pembelajaran": { "lingkungan_sekolah": "...", "masyarakat": "...", "lingkungan_luar_sekolah": "..." },
    "lingkungan_pembelajaran": { "ruang_fisik": "...", "ruang_virtual": "...", "budaya_belajar": "..." },
    "pemanfaatan_digital": { "perencanaan": "...", "pelaksanaan": "...", "asesmen": "...", "tautan_media": "..." }
  },
  "pengalaman_belajar": {
    "awal": { "judul_tahap": "AWAL (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)", "pengantar": "...", "poin_kegiatan": [ ... 5-6 poin ... ] },
    "inti": {
      "pengantar": "...",
      "blok_tahap": [
        {
          "header_tahap": "MEMAHAMI (BERKESADARAN, BERMAKNA)",
          "hari": [
            { "hari_ke": 1, "kegiatan_list": [ { "nomor": 1, "nama_kegiatan": "...", "label": "...", "alat_dan_bahan": "...", "judul_langkah": "Cara Membuat", "langkah": [...] }, { "nomor": 2, ... }, { "nomor": 3, ... } ] },
            { "hari_ke": 2, "kegiatan_list": [ ... 3 kegiatan ... ] }
          ]
        },
        {
          "header_tahap": "MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)",
          "hari": [
            { "hari_ke": 3, "kegiatan_list": [ ... 3 kegiatan ... ] },
            { "hari_ke": 4, "kegiatan_list": [ ... 3 kegiatan ... ] }
          ]
        },
        {
          "header_tahap": "MEREFLEKSI (BERKESADARAN, BERMAKNA)",
          "hari": [
            { "hari_ke": 5, "kegiatan_list": [ ... 3 kegiatan ... ] },
            { "hari_ke": 6, "kegiatan_list": [ ... 3 kegiatan ... ] }
          ]
        }
      ]
    },
    "penutup": { "judul_tahap": "PENUTUP (BERKESADARAN, MENGGEMBIRAKAN)", "pengantar": "...", "poin_kegiatan": [ ... 5-6 poin ... ] }
  },
  "asesmen_pembelajaran": {
    "awal": [ ... ],
    "proses": [ ... ],
    "akhir": [ ... ]
  }
}`;
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

/**
 * Direct Gemini API invocation with multi-key pool rotation and model fallback chain
 */
export async function executeDirectGeminiRequest(
  apiKeys: string[],
  systemPrompt: string,
  userPrompt: string,
  onStatusUpdate?: (status: { message: string; keyMasked?: string; model?: string }) => void
): Promise<{ success: boolean; data: any; usedModel: string; usedKeyMasked: string }> {
  if (!apiKeys || apiKeys.length === 0) {
    throw new Error('Tidak ada kunci API Gemini yang aktif. Silakan tambahkan kunci di menu BYOK.');
  }

  let lastError = '';

  for (let kIdx = 0; kIdx < apiKeys.length; kIdx++) {
    const key = apiKeys[kIdx];
    const keyShort = `...${key.slice(-4)}`;

    for (const model of GEMINI_MODEL_CHAIN) {
      if (onStatusUpdate) {
        onStatusUpdate({
          message: `Menghubungkan ke Gemini (${model}) dengan kunci ${keyShort}...`,
          keyMasked: keyShort,
          model,
        });
      }

      try {
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
                parts: [{ text: 'Siap, saya mengerti instruksi penyusunan RPM PAUD 2025/2026.' }],
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
          console.warn(`[BYOK Direct] Quota limit 429 on key ${keyShort}. Rotasi ke kunci berikutnya.`);
          lastError = `Limit kuota (429) pada key ${keyShort}. Beralih ke kunci cadangan...`;
          if (onStatusUpdate) {
            onStatusUpdate({ message: `Limit kuota (429) pada key ${keyShort}. Beralih ke kunci berikutnya...` });
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
          console.error(`[BYOK Direct] Key ${keyShort} invalid (${response.status}).`);
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
 * Ping test a single API key
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; model?: string; error?: string }> {
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
