# Handover Dokumen: Integrasi API Key Dattio AI

Dokumen ini disiapkan agar agen AI di proyek baru dapat langsung memahami kredensial, spesifikasi teknis, dan cara implementasi API Dattio AI tanpa perlu mengulang riset awal.

---

## 1. Kredensial & Status API (Terverifikasi)

* **Provider:** Dattio AI ([Dokumentasi Resmi](https://dattioai.com/docs))
* **Base URL (OpenAI Compatible):** `https://bandelbanget.xyz/v1`
* **Origin (Anthropic / Claude Code):** `https://bandelbanget.xyz`
* **API Key:** `sk-qwen-3c1b...ddab` (Tersimpan aman di file `.env` lokal sebagai `VITE_DATTIO_API_KEY`)
* **Status Key:** `active`
* **Kuota Token:** `20.000.000` (20 Juta token penuh, 0% terpakai)
* **Masa Aktif:** 28 hari (otomatis tereset setiap kali ada top-up)

---

## 2. Model Rekomendasi & Multiplier

| Model ID | Multiplier | Penggunaan Terbaik |
| :--- | :--- | :--- |
| `glm-5.2` | 1.25x | **Rekomendasi Utama** untuk coding, tugas panjang, dan Claude Code / OpenCode. |
| `deepseek-v4-flash` | 2.0x | Super cepat & hemat token untuk parsing dan formatting. |
| `deepseek-v4.1-flash`| 2.0x | Model cepat dengan dukungan vision / multi-modal. |
| `claude-opus-5-5` | Standar | Reasoning tingkat tinggi dan penanganan logika kompleks. |
| `glm-5.3` / `kimi-k2.7-code` | Standar | Alternatif coding dan tugas instruksi mendalam. |

---

## 3. Kompatibilitas Protokol & Endpoint

1. **OpenAI Compatible:**
   * Endpoint: `POST https://bandelbanget.xyz/v1/chat/completions`
   * Header:
     * `Content-Type: application/json`
     * `Authorization: Bearer <API_KEY>`
2. **Anthropic Compatible:**
   * Endpoint: `POST https://bandelbanget.xyz/v1/messages`
   * Header: `x-api-key: <API_KEY>` atau `Authorization: Bearer <API_KEY>`
3. **Cek Quota:**
   * Endpoint: `GET https://bandelbanget.xyz/v1/quota`

---

## 4. Opsi Penerapan di Proyek Baru

1. **Untuk AI Coding Assistant Lokal (Claude Code / OpenCode / Cursor / Cline):**
   * Gunakan Base URL dan API key di konfigurasi provider OpenAI-compatible atau environment variables terminal.
2. **Untuk Backend / API Service Aplikasi:**
   * Panggil via library resmi `openai` (Python / Node.js) dengan mengubah parameter `baseURL` / `base_url`.
3. **Untuk Frontend / Web Client:**
   * Jangan simpan API key langsung di frontend publik. Gunakan backend proxy (seperti Next.js API Routes, Express, Cloudflare Workers, dll.).
