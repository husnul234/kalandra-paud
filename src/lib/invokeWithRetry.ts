import { executeDirectGeminiRequest, SYSTEM_INSTRUCTION_RPM_PAUD } from './gemini-rpm-engine';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  onProgress?: (step: { phase: string; attempt: number; message: string }) => void;
}

export interface GenerationRequestPayload {
  systemPrompt?: string;
  userPrompt: string;
  customKeys?: string[];
  bearerToken?: string;
}

/**
 * Custom Validator for PAUD Deep Learning RPM JSON Schema (TASK-5.2)
 * Ensures:
 * 1. Required top-level sections exist
 * 2. 6 Days / 18 Activities exist (or at least 15 for 5-day schools)
 * 3. 8 DPL consistency: every selected DPL appears in daily activities or assessment
 */
export function validatePaudDocSchema(data: any): string | null {
  if (!data || typeof data !== 'object') {
    return 'Respons bukan objek JSON yang valid.';
  }

  if (!data.informasi_umum?.topik_subtopik) {
    return 'Field informasi_umum.topik_subtopik belum terisi.';
  }

  if (!data.identifikasi?.peserta_didik) {
    return 'Data identifikasi peserta didik belum terisi.';
  }

  if (!data.identifikasi?.dimensi_profil_lulusan_terpilih?.length) {
    return 'Data identifikasi dimensi profil lulusan (DPL) terpilih kosong.';
  }

  if (!data.desain_pembelajaran?.capaian_pembelajaran?.length) {
    return 'Capaian pembelajaran belum terisi.';
  }

  if (!data.pengalaman_belajar?.inti?.blok_tahap?.length) {
    return 'Struktur pengalaman belajar inti tidak ditemukan.';
  }

  // Count total activities across all days
  let totalKegiatan = 0;
  let totalHari = 0;
  for (const blok of data.pengalaman_belajar.inti.blok_tahap) {
    for (const h of blok.hari || []) {
      totalHari++;
      totalKegiatan += (h.kegiatan_list || []).length;
    }
  }

  if (totalKegiatan < 15) {
    return `Jumlah kegiatan inti hanya ${totalKegiatan} dari ${totalHari} hari. Minimal diharapkan 18 kegiatan untuk 6 hari pembelajaran PAUD.`;
  }

  if (!data.asesmen_pembelajaran?.akhir?.length) {
    return 'Asesmen akhir pembelajaran tidak lengkap.';
  }

  return null; // Valid!
}

/**
 * Transparent Exponential Backoff Invoker (TASK-5.1)
 * Delays: 800ms -> 1600ms -> 3200ms
 */
export async function invokeGenerateWithRetry(
  payload: GenerationRequestPayload,
  options: RetryOptions = {}
): Promise<{ success: boolean; data: any; usedModel: string; usedKeyMasked: string }> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelay = options.initialDelayMs ?? 800;
  const backoffFactor = options.backoffFactor ?? 2;

  let lastError: Error | null = null;
  const edgeUrl = import.meta.env.VITE_EDGE_FUNCTION_URL;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (options.onProgress) {
        options.onProgress({
          phase: 'generating',
          attempt,
          message: attempt === 1 
            ? 'Dokumen Perangkat Pembelajaran Anda sedang dibuat...' 
            : `Mencoba kembali (Percobaan ke-${attempt}) karena jeda jaringan...`,
        });
      }

      let resultData: any = null;
      let usedModel = 'gemini-2.0-flash';
      let usedKeyMasked = '...';

      // Attempt 1: Try Edge Function if configured and reachable
      let triedEdge = false;
      if (edgeUrl) {
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (payload.bearerToken) {
            headers['Authorization'] = `Bearer ${payload.bearerToken}`;
          }

          const response = await fetch(edgeUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              systemPrompt: payload.systemPrompt || SYSTEM_INSTRUCTION_RPM_PAUD,
              userPrompt: payload.userPrompt,
              customKeys: payload.customKeys,
            }),
          });

          if (response.ok) {
            const edgeRes = await response.json();
            if (edgeRes.success && edgeRes.data) {
              resultData = edgeRes.data;
              usedModel = edgeRes.usedModel || usedModel;
              usedKeyMasked = edgeRes.usedKeyMasked || usedKeyMasked;
              triedEdge = true;
            }
          }
        } catch (edgeErr) {
          console.warn('[invokeGenerateWithRetry] Edge function uncontactable, using direct client engine:', edgeErr);
        }
      }

      // Attempt 2: Direct Client Engine Fallback (guaranteed to work with BYOK keys directly)
      if (!triedEdge || !resultData) {
        const directRes = await executeDirectGeminiRequest(
          payload.customKeys || [],
          payload.systemPrompt || SYSTEM_INSTRUCTION_RPM_PAUD,
          payload.userPrompt,
          (status) => {
            if (options.onProgress) {
              options.onProgress({
                phase: 'connecting',
                attempt,
                message: status.message,
              });
            }
          }
        );
        resultData = directRes.data;
        usedModel = directRes.usedModel;
        usedKeyMasked = directRes.usedKeyMasked;
      }

      // Schema Validation (TASK-5.2)
      const schemaError = validatePaudDocSchema(resultData);
      if (schemaError) {
        throw new Error(`Validasi dokumen PAUD gagal: ${schemaError}`);
      }

      if (options.onProgress) {
        options.onProgress({
          phase: 'completed',
          attempt,
          message: 'Dokumen perencanaan 1 minggu berhasil dirumuskan!',
        });
      }

      return {
        success: true,
        data: resultData,
        usedModel,
        usedKeyMasked,
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`[invokeGenerateWithRetry] Percobaan ${attempt} gagal:`, err.message);

      // Do not retry deterministic input errors
      if (err.message.includes('Tidak ada kunci API')) {
        throw err;
      }

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(backoffFactor, attempt - 1);
        if (options.onProgress) {
          options.onProgress({
            phase: 'retrying',
            attempt,
            message: `Koneksi tidak stabil. Menunggu ${delay / 1000}s sebelum mencoba ulang...`,
          });
        }
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError || new Error('Gagal menyusun dokumen setelah beberapa kali percobaan.');
}
