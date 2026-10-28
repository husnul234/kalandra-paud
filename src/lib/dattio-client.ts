/**
 * Dattio AI Client & Multi-Model Adapter
 * Integrates high-speed OpenAI-compatible inference with 20M token enterprise pool
 * Base URL: https://bandelbanget.xyz/v1
 * Recommended Models: glm-5.2 (Primary coding/logic), deepseek-v4-flash (Fast & token-efficient)
 */

import { stripMarkdownJson, type AiRekomendasiResult, type PartitionedRevisionRequest, type PartitionedRevisionResponse } from './gemini-rpm-engine';

export const DEFAULT_DATTIO_BASE_URL = 'https://bandelbanget.xyz/v1';

export const DATTIO_MODEL_CHAIN = [
  'glm-5.2',             // Primary recommendation: deep reasoning, high instruction adherence
  'deepseek-v4-flash',    // Ultra-fast JSON formatting & economical token usage
  'deepseek-v4.1-flash',  // Fast multimodal/vision support
  'claude-opus-5-5',      // Heavy architectural reasoning fallback
];

export const DATTIO_STORAGE_KEY = 'kalandra_dattio_api_key';
export const DATTIO_MODEL_STORAGE_KEY = 'kalandra_dattio_selected_model';

/**
 * Get active Dattio API Key from localStorage or env
 */
export function getDattioApiKey(): string {
  try {
    const local = localStorage.getItem(DATTIO_STORAGE_KEY);
    if (local && local.trim().startsWith('sk-')) {
      return local.trim();
    }
  } catch (_) {}

  const envKey = (import.meta as any).env?.VITE_DATTIO_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().startsWith('sk-')) {
    return envKey.trim();
  }

  return '';
}

/**
 * Get active Dattio Base URL
 */
export function getDattioBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_DATTIO_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().startsWith('http')) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_DATTIO_BASE_URL;
}

/**
 * Check real-time Dattio quota and validity
 */
export interface DattioQuotaInfo {
  success: boolean;
  status: string;
  name?: string;
  maxTokens: number;
  remainingTokens: number;
  usagePercent: number;
  validDays: number;
  error?: string;
}

export async function checkDattioQuota(apiKey?: string): Promise<DattioQuotaInfo> {
  const key = apiKey?.trim() || getDattioApiKey();
  const baseUrl = getDattioBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/quota`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        status: `HTTP ${res.status}`,
        maxTokens: 0,
        remainingTokens: 0,
        usagePercent: 0,
        validDays: 0,
        error: `Gagal membaca kuota (${res.status}): ${errText.slice(0, 100)}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      status: data.status || 'active',
      name: data.name,
      maxTokens: data.maxTokens ?? 20000000,
      remainingTokens: data.remainingTokens ?? 20000000,
      usagePercent: data.usagePercent ?? 0,
      validDays: data.validDays ?? 28,
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'network_error',
      maxTokens: 0,
      remainingTokens: 0,
      usagePercent: 0,
      validDays: 0,
      error: `Koneksi jaringan gagal: ${err.message || 'Network error'}`,
    };
  }
}

/**
 * Quick connection test
 */
export async function testDattioApiKey(apiKey: string): Promise<{ success: boolean; model?: string; quotaInfo?: DattioQuotaInfo; error?: string }> {
  const quota = await checkDattioQuota(apiKey);
  if (!quota.success) {
    return { success: false, error: quota.error };
  }

  // Quick 1-token ping completion test with primary model
  const baseUrl = getDattioBaseUrl();
  const testModel = DATTIO_MODEL_CHAIN[0]; // glm-5.2

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: testModel,
        messages: [{ role: 'user', content: "ping. Balas 'pong' saja." }],
        temperature: 0.1,
        max_tokens: 10,
      }),
    });

    if (res.ok) {
      return {
        success: true,
        model: testModel,
        quotaInfo: quota,
      };
    }

    const errJson = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errJson?.error?.message || `HTTP ${res.status}`,
      quotaInfo: quota,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Koneksi gagal saat ping chat completion',
      quotaInfo: quota,
    };
  }
}

/**
 * Execute Document Generation via Dattio AI (OpenAI Compatible Protocol)
 * Implements model fallback chain across glm-5.2 -> deepseek-v4-flash -> deepseek-v4.1-flash
 */
export async function executeDattioRpmRequest(params: {
  systemPrompt: string;
  userPrompt: string;
  apiKey?: string;
  model?: string;
  onStatusUpdate?: (status: { message: string; keyMasked?: string; model?: string }) => void;
}): Promise<{ success: boolean; data: any; usedModel: string; usedKeyMasked: string; rawText: string }> {
  const key = params.apiKey?.trim() || getDattioApiKey();
  const keyShort = `...${key.slice(-4)}`;
  const baseUrl = getDattioBaseUrl();

  const modelChain = params.model
    ? [params.model, ...DATTIO_MODEL_CHAIN.filter((m) => m !== params.model)]
    : DATTIO_MODEL_CHAIN;

  let lastError = '';

  for (const model of modelChain) {
    if (params.onStatusUpdate) {
      params.onStatusUpdate({
        message: `Menyusun dokumen PAUD via Dattio AI (${model})...`,
        keyMasked: keyShort,
        model,
      });
    }

    try {
      const payload = {
        model,
        messages: [
          {
            role: 'system',
            content: params.systemPrompt,
          },
          {
            role: 'user',
            content: params.userPrompt,
          },
        ],
        temperature: 0.3,
      };

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        if (!content) {
          lastError = `Model ${model} mengembalikan respons kosong.`;
          continue;
        }

        const cleaned = stripMarkdownJson(content);
        const parsed = JSON.parse(cleaned);

        return {
          success: true,
          data: parsed,
          usedModel: model,
          usedKeyMasked: keyShort,
          rawText: content,
        };
      }

      const errText = await res.text();
      console.warn(`[Dattio AI] Model ${model} returned error ${res.status}:`, errText);
      lastError = `Dattio AI error (${res.status}): ${errText.slice(0, 120)}`;

      // If invalid key 401/403, no point retrying same key
      if (res.status === 401 || res.status === 403) {
        break;
      }
    } catch (fetchErr: any) {
      console.warn(`[Dattio AI] Fetch error for model ${model}:`, fetchErr);
      lastError = `Network error: ${fetchErr.message || String(fetchErr)}`;
    }
  }

  throw new Error(lastError || 'Seluruh model Dattio AI gagal merespons.');
}

/**
 * Fast AI Curriculum Recommendation using Dattio AI (deepseek-v4-flash or glm-5.2)
 */
export async function requestDattioAiRekomendasiTopik(
  topik: string,
  jenjangKelas: string,
  apiKey?: string
): Promise<AiRekomendasiResult> {
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

  const res = await executeDattioRpmRequest({
    systemPrompt: 'Anda adalah asisten cerdas kurikulum PAUD Kemendikdasmen RI yang memberikan rekomendasi pemetaan kurikulum yang akurat dan ringkas dalam format JSON.',
    userPrompt: prompt,
    apiKey,
    model: 'deepseek-v4-flash', // Ultra-fast response for wizard suggestion
  });

  return res.data as AiRekomendasiResult;
}

/**
 * Section Partitioned Document Editor using Dattio AI
 */
export async function executeDattioPartitionedDocumentEdit(
  request: PartitionedRevisionRequest,
  apiKey?: string
): Promise<PartitionedRevisionResponse> {
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

  const res = await executeDattioRpmRequest({
    systemPrompt,
    userPrompt,
    apiKey,
    model: 'glm-5.2',
  });

  return res.data as PartitionedRevisionResponse;
}
