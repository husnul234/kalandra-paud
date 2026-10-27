import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Resilient Gemini Model Hierarchy
 */
export const GEMINI_MODEL_CHAIN = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.0-flash",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

/**
 * 8 Dimensi Profil Lulusan (Permendikdasmen No. 10/2025)
 */
export const DATA_8_DPL = [
  {
    kode: "DPL1",
    nama: "Keimanan dan Ketakwaan terhadap Tuhan YME",
    label_kegiatan: "keimanan",
    fokus_paud: "Mengenal Tuhan YME melalui ciptaan-Nya, membiasakan doa harian dengan penuh kesadaran, bersyukur, serta menyayangi sesama dan lingkungan."
  },
  {
    kode: "DPL2",
    nama: "Kewargaan",
    label_kegiatan: "kewargaan",
    fokus_paud: "Mengenal identitas diri sebagai bagian dari keluarga, sekolah, dan masyarakat; menghargai perbedaan teman; serta mematuhi kesepakatan bermain."
  },
  {
    kode: "DPL3",
    nama: "Penalaran Kritis",
    label_kegiatan: "penalaran kritis",
    fokus_paud: "Mengamati perubahan benda/lingkungan, bertanya, membandingkan persamaan dan perbedaan, mengetahui sebab-akibat, serta mencari solusi sederhana saat bermain."
  },
  {
    kode: "DPL4",
    nama: "Kreativitas",
    label_kegiatan: "kreativitas",
    fokus_paud: "Mengeksplorasi berbagai media seni dan loose parts untuk menghasilkan karya orisinal, mengekspresikan imajinasi, serta mencoba cara-cara baru."
  },
  {
    kode: "DPL5",
    nama: "Kolaborasi",
    label_kegiatan: "kolaborasi",
    fokus_paud: "Bermain bersama teman, berbagi alat dan bahan main, sabar menunggu giliran, serta bekerja sama menyelesaikan proyek atau permainan kelompok."
  },
  {
    kode: "DPL6",
    nama: "Kemandirian",
    label_kegiatan: "kemandirian",
    fokus_paud: "Memilih kegiatan main, fokus menyelesaikan kegiatan, melakukan bina diri dasar, mengelola emosi dengan bantuan guru, dan merapikan kembali alat main."
  },
  {
    kode: "DPL7",
    nama: "Kesehatan",
    label_kegiatan: "kesehatan",
    fokus_paud: "Aktif bergerak melatih motorik kasar dan halus, menjaga kebersihan tubuh (mencuci tangan), mengenal makanan sehat, serta bermain dengan aman."
  },
  {
    kode: "DPL8",
    nama: "Komunikasi",
    label_kegiatan: "komunikasi",
    fokus_paud: "Menyimak cerita, menceritakan kembali pengalaman atau karya secara lisan, memperluas kosakata, menggunakan kata santun (tolong, maaf, terima kasih), dan keaksaraan awal."
  }
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
2. Kutipan CP Verbatim: Pada bagian capaian_pembelajaran, Anda WAJIB menyalin persis kalimat Capaian Pembelajaran / Subelemen tanpa mengubah, mengurangi, atau mengarang kalimat baru.
3. Sinkronisasi DPL 100% Konsisten:
   - Setiap Dimensi Profil Lulusan (DPL) yang dicentang pada bagian IDENTIFIKASI wajib muncul sebagai label di dalam kegiatan inti harian.
   - DILARANG menuliskan label dimensi di kegiatan inti apabila kode DPL-nya tidak dicentang pada bagian IDENTIFIKASI.
   - Pada bagian Asesmen pada Akhir Pembelajaran (poin Observasi holistik), sebutkan secara akurat nama Dimensi Profil Lulusan yang ditargetkan sesuai daftar DPL yang dicentang.
4. Arsitektur Pengalaman Belajar Inti 6 Hari (Siklus Pembelajaran Mendalam):
   - Tahap 1: MEMAHAMI (BERKESADARAN, BERMAKNA) -> Hari 1 dan Hari 2. Fokus pada pengenalan konsep dasar secara konkret, cerita, pengamatan panca indra, dan eksplorasi awal tentang topik.
   - Tahap 2: MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN) -> Hari 3 dan Hari 4. Fokus pada penerapan konsep melalui eksperimen sains/seni sederhana, merakit konstruksi loose parts/balok, dan permainan kolaboratif beraturan.
   - Tahap 3: MEREFLEKSI (BERKESADARAN, BERMAKNA) -> Hari 5 dan Hari 6. Fokus pada permainan pemecahan masalah (sebab-akibat), unjuk karya/presentasi sederhana di depan teman, menyampaikan alasan atas pilihannya, dan refleksi pengalaman belajar.
5. Struktur 3 Kegiatan Bermain per Hari (Total 18 Kegiatan Seminggu):
   - Setiap hari WAJIB memuat tepat 3 Kegiatan yang seimbang:
     * Kegiatan 1: Eksplorasi karya seni / konstruksi / sains-rekayasa konkret menggunakan bahan lepasan (loose parts: kardus bekas, piring kertas, stik es krim, daun kering, batu kerikil, dll.). Wajib mencantumkan Alat dan bahan serta langkah Cara Membuat.
     * Kegiatan 2: Permainan fisik-motorik kasar/halus atau sosial-emosional interaktif (contoh: cermin ajaib, estafet senyum, lompat rintangan warna). Wajib mencantumkan Alat dan bahan serta Cara bermain.
     * Kegiatan 3: Permainan lingkaran (circle game), bahasa & komunikasi, atau pramembaca/pranumerasi kontekstual yang menyenangkan. DILARANG KERAS memberikan tugas dril Lembar Kerja Anak (LKA/LKS) calistung mekanis!
   - Setiap judul kegiatan WAJIB diikuti tanda kurung berisi minimal 1 Prinsip Pembelajaran (berkesadaran / bermakna / menggembirakan) dan 1 Dimensi Profil Lulusan yang relevan.
6. Kesesuaian Tahap Perkembangan Usia (DAP):
   - Kelompok A (4-5 Tahun): Koordinasi motorik halus masih berkembang. Tuliskan eksplisit jika guru telah menyiapkan pola potong dasar pada Pijakan Lingkungan Main, anak menjiplak sederhana, mengecat, merakit loose parts, dan bermain.
   - Kelompok B (5-6 Tahun): Anak dilibatkan sejak membuat pola sederhana, menggunting dengan gunting anak secara mandiri, mengukur dengan satuan tidak baku, dan merakit konstruksi yang lebih menantang.
7. Return Format:
   Kembalikan HANYA teks JSON murni (tanpa pembuka markdown \`\`\`json dan tanpa penutup \`\`\`) yang valid dan dapat di-JSON.parse().`;

function getGeminiEndpoint(model: string, apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
}

export function stripMarkdownJson(text: string): string {
  let clean = text.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return clean.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    let user: { id: string; email?: string } | null = null;
    let supabaseClient: any = null;

    if (supabaseUrl && supabaseAnonKey && authHeader) {
      try {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: authData } = await supabaseClient.auth.getUser();
        user = authData?.user ?? null;
      } catch (err) {
        console.warn("[generate-content-core] Supabase auth check warning:", err);
      }
    }

    const payload = await req.json();
    const {
      type = "generate",
      systemPrompt = SYSTEM_INSTRUCTION_RPM_PAUD,
      userPrompt = "",
      customKeys = [],
      metadata = {},
    } = payload;

    // 1. Gather all candidate API keys for this user
    let userApiKeys: string[] = [];

    if (Array.isArray(customKeys) && customKeys.length > 0) {
      userApiKeys = customKeys.filter(Boolean);
    } else if (user && supabaseClient) {
      const { data: dbKeys } = await supabaseClient
        .from("user_api_keys")
        .select("api_key")
        .eq("user_id", user.id)
        .eq("provider", "gemini")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (dbKeys && dbKeys.length > 0) {
        userApiKeys = dbKeys.map((k: { api_key: string }) => k.api_key).filter(Boolean);
      }
    }

    // Fallback to system secret if configured
    const systemSecret = Deno.env.get("GEMINI_API_KEY");
    if (userApiKeys.length === 0 && systemSecret) {
      userApiKeys.push(systemSecret);
    }

    // Fallback to admin system pool keys from database
    if (userApiKeys.length === 0) {
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      if (serviceRoleKey && supabaseUrl) {
        try {
          const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
          const { data: adminPoolKeys } = await adminSupabase
            .from("user_api_keys")
            .select("api_key")
            .eq("provider", "gemini")
            .eq("is_active", true);

          if (adminPoolKeys && adminPoolKeys.length > 0) {
            userApiKeys = adminPoolKeys.map((k: { api_key: string }) => k.api_key).filter(Boolean);
          }
        } catch (dbErr) {
          console.warn("[generate-content-core] Error loading admin pool keys:", dbErr);
        }
      }
    }

    if (userApiKeys.length === 0) {
      return new Response(
        JSON.stringify({
          needApiKey: true,
          error: "Layanan AI sedang dalam sinkronisasi kuota. Silakan coba kembali dalam beberapa saat.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Connectivity test ping
    if (type === "test") {
      const testKey = userApiKeys[0];
      const testModel = GEMINI_MODEL_CHAIN[0];
      const res = await fetch(getGeminiEndpoint(testModel, testKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "ping. Balas 'pong'." }] }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return new Response(
          JSON.stringify({ success: false, error: `Test API gagal (${res.status}): ${errText}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, model: testModel, message: "Koneksi Gemini berhasil!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Prepare generation payload
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: `INSTRUCTIONS:\n${systemPrompt}` }],
        },
        {
          role: "model",
          parts: [{ text: "Dipahami. Saya akan menyusun dokumen Perencanaan Pembelajaran Mendalam (RPM) 1 Minggu dalam format JSON sesuai seluruh regulasi PAUD 2025/2026." }],
        },
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
        responseMimeType: "application/json",
      },
    };

    // 4. Dual-loop Multi-Key Rotation + Model Chain Fallback
    let lastError: string | null = null;
    let successfulData: unknown = null;
    let usedModel = "";
    let usedKeyMasked = "";

    keyLoop: for (let kIdx = 0; kIdx < userApiKeys.length; kIdx++) {
      const currentKey = userApiKeys[kIdx];
      const keyShort = `...${currentKey.slice(-4)}`;

      for (const model of GEMINI_MODEL_CHAIN) {
        try {
          const res = await fetch(getGeminiEndpoint(model, currentKey), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          if (res.ok) {
            const data = await res.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textResponse) {
              lastError = "Model mengembalikan respons kosong.";
              continue;
            }

            successfulData = textResponse;
            usedModel = model;
            usedKeyMasked = keyShort;
            break keyLoop;
          }

          // HTTP 429 Quota exhausted -> Rotate to next key immediately
          if (res.status === 429) {
            console.warn(`[BYOK] Quota limit 429 pada key ${keyShort}. Rotasi ke key berikutnya.`);
            lastError = `Limit kuota (429) pada key ${keyShort}. Mencoba kunci cadangan.`;
            break; // Break inner model loop, proceed to next key
          }

          // HTTP 404 Model Not Found or 503 Overloaded -> Try next model with same key
          if (res.status === 404 || res.status === 503) {
            console.warn(`[BYOK] Model ${model} error (${res.status}). Mencoba fallback model...`);
            lastError = `Model ${model} tidak merespons (${res.status}).`;
            continue;
          }

          // Non-recoverable auth error for this key -> Go to next key
          if (res.status === 401 || res.status === 403) {
            console.error(`[BYOK] Key ${keyShort} tidak valid (${res.status}). Mengabaikan key ini.`);
            lastError = `API key ${keyShort} tidak valid (${res.status})`;
            break;
          }

          const errText = await res.text();
          lastError = `API error (${res.status}): ${errText}`;
        } catch (fetchErr) {
          lastError = `Network fetch error: ${String(fetchErr)}`;
        }
      }
    }

    if (!successfulData) {
      return new Response(
        JSON.stringify({
          error: lastError || "Seluruh API key atau model Gemini habis/gagal.",
          transient: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Sanitize and parse JSON
    const rawText = String(successfulData);
    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(stripMarkdownJson(rawText));
    } catch {
      parsedJson = null;
    }

    return new Response(
      JSON.stringify({
        success: true,
        usedModel,
        usedKeyMasked,
        rawText,
        data: parsedJson ?? rawText,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    console.error("[generate-content-core] Fatal error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error)?.message || "Terjadi kesalahan internal server." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
