# Context & Architecture Decision Log: Kalandra PAUD
## Dokumen Pembaruan Rencana, Konteks Regulasi, & Definisi Peran

> **File:** `/logs/log-planning-architecture.261026.md`  
> **Tanggal Pembuatan:** 26 Oktober 2026 (261026)  
> **Status:** Final Baseline Terkonfirmasi  
> **Inisiator:** Creator / Superadmin Platform & Antigravity AI  

---

## 1. Ringkasan Eksekutif & Konteks Pembaruan

Pembaruan ini mendokumentasikan hasil perancangan fondasi menyeluruh untuk **Generator Dokumen Perencanaan Pembelajaran Mendalam (RPM) TK / PAUD Fase Fondasi**, mencakup pemilihan nama produk, kepatuhan regulasi resmi Kemendikdasmen 2025/2026, arsitektur tangguh berbasis **BYOK (Bring Your Own Key)**, serta penyelarasan peran pengguna aplikasi.

### Penyelarasan Peran Kunci (Role Clarification):
- **Admin = Creator / Platform Owner (Anda)**:
  Pengembang dan pemilik platform aplikasi yang memiliki kendali penuh atas manajemen pengguna aplikasi (guru dari berbagai sekolah/satuan PAUD), aktivasi akun/lisensi, konfigurasi master prompt dan regulasi kurikulum, serta pemantauan telemetri dan log sistem.
- **Guru = End-User (Pendidik PAUD)**:
  Pengguna akhir yang memanfaatkan wizard pembuatan modul ajar mingguan, mengelola kunci API Google Gemini pribadi (BYOK) secara aman, mengedit pratinjau tabel secara live, dan mengekspor dokumen Word (`.docx`) siap cetak.
- **Roadmap Masa Depan (Extensibility)**:
  Skema database dan RLS disiapkan agar peran perantara seperti *Admin Satuan / Kepala Sekolah* dapat ditambahkan di kemudian hari untuk kebutuhan supervisi internal satu sekolah tertentu tanpa merombak arsitektur inti.

---

## 2. Rekomendasi Nama Produk (Product Naming)

| Nama Produk | Tagline & Makna | Karakter Branding |
|:---|:---|:---|
| **Kalandra PAUD** *(Rekomendasi Utama)* | *Platform Perencanaan Pembelajaran Mendalam PAUD Berkesadaran, Bermakna, & Menggembirakan*<br>• Bahasa Sanskerta: **Kalandra** = *menerangi, ceria, membawa kegembiraan*. Selaras dengan prinsip Permendikdasmen No. 1/2026. | Hangat, modern, anggun, berkarakter kuat, dan mudah diingat. |
| **ModulMendalam TK (M3-TK)** | *AI Generator RPP & Modul Ajar Deep Learning Fase Fondasi* | Formal, institusional, dan cocok untuk pelaporan dinas/akreditasi. |
| **PijakanBermain AI** | *Generator Modul Ajar Berbasis Loose Parts & Scaffolding PAUD* | Edukatif, menolak dril calistung mekanis, mengusung pedagogi resmi PAUD. |
| **CahayaFondasi** | *Menyusun Langkah Emas Pembelajaran Anak Usia Dini* | Puitis, sarat makna tumbuh kembang anak usia emas. |
| **RencanaCeria PAUD** | *Perencanaan Belajar Cepat, Guru Bahagia, Anak Ceria* | Ringan, bersahabat, dan menonjolkan aspek kemudahan bagi guru. |

---

## 3. Matriks Kepatuhan Regulasi Resmi Kurikulum PAUD

Aplikasi dirancang anti-halusinasi dengan menaati 4 regulasi resmi pemerintah:

1. **Permendikdasmen No. 10 Tahun 2025 (Standar Kompetensi Lulusan & STPPA)**:
   - **LARANGAN KERAS:** Dilarang menggunakan istilah lama *"Profil Pelajar Pancasila"* atau *"P5"*.
   - **WAJIB:** Menggunakan istilah resmi **8 Dimensi Profil Lulusan (DPL1 s.d. DPL8)**: Keimanan (DPL1), Kewargaan (DPL2), Penalaran Kritis (DPL3), Kreativitas (DPL4), Kolaborasi (DPL5), Kemandirian (DPL6), Kesehatan (DPL7), dan Komunikasi (DPL8).
   - Sinkronisasi mutlak: Setiap DPL yang dicentang pada identifikasi wajib muncul sebagai label pada kegiatan inti harian dan asesmen akhir.
2. **Permendikdasmen No. 12 Tahun 2025 (Standar Isi)**:
   - Memuat 3 pilar pengetahuan di bagian identifikasi materi: **Pengetahuan Esensial**, **Pengetahuan Aplikatif**, serta **Nilai dan Karakter**.
3. **Permendikdasmen No. 1 Tahun 2026 (Standar Proses - Deep Learning)**:
   - Prinsip Pembelajaran: **Berkesadaran (Mindful)**, **Bermakna (Meaningful)**, dan **Menggembirakan (Joyful)**.
   - Pembagian Tahapan Belajar Inti 6 Hari:
     - **Hari 1 & 2**: `MEMAHAMI (BERKESADARAN, BERMAKNA)` -> Pengenalan konsep konkret, cerita pemantik, eksplorasi panca indra.
     - **Hari 3 & 4**: `MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)` -> Eksperimen sederhana, konstruksi *loose parts*, permainan kolaboratif beraturan.
     - **Hari 5 & 6**: `MEREFLEKSI (BERKESADARAN, BERMAKNA)` -> Pemecahan masalah sebab-akibat, unjuk karya di depan teman, recalling berkesadaran.
   - Struktur Harian: Tepat **3 Kegiatan Bermain per Hari** (Total 18 kegiatan seminggu):
     - *Kegiatan 1:* Seni / Konstruksi / Rekayasa bahan lepasan (*loose parts*) (Alat & bahan + Cara membuat).
     - *Kegiatan 2:* Fisik-motorik kasar/halus atau sosial-emosional (Alat & bahan + Cara bermain).
     - *Kegiatan 3:* Circle game, bahasa/keaksaraan kontekstual (DILARANG dril LKS/calistung mekanis).
4. **Keputusan BSKAP No. 046/H/KR/2025 (Capaian Pembelajaran PAUD)**:
   - Teks Capaian Pembelajaran dan Subelemen (NABP, Jati Diri, Literasi/STEM/Seni) disalin secara *verbatim* dari `cp_paud_detail_2025.json` tanpa mengubah atau mengarang kalimat baru.

---

## 4. Arsitektur Teknis & Ketahanan BYOK Gemini

1. **BYOK Multi-Key Pooling & Auto-Failover**:
   - Guru dapat menyimpan 1 hingga 5 kunci API Gemini gratis dari Google AI Studio.
   - Jika kunci aktif terbentur limit kuota gratis (*HTTP 429 Too Many Requests*), backend secara otomatis beralih ke kunci cadangan berikutnya seketika tanpa membatalkan proses.
2. **Model Fallback Chain**:
   - `gemini-3.6-flash` (Prioritas Utama / Kecepatan & Reasoning Tinggi)
   - `gemini-3.5-flash` / `gemini-3.0-flash`
   - `gemini-2.5-flash`
   - `gemini-2.5-flash-lite`
3. **Client-Side Resilience (`invokeWithRetry.ts`)**:
   - 3x percobaan dengan *exponential backoff* ($800\text{ms} \to 1600\text{ms} \to 3200\text{ms}$) untuk mengatasi gangguan sinyal seluler.
   - Custom validator JSON: memastikan 18 kegiatan inti dan keterhubungan 8 DPL lengkap sebelum dirender.
4. **Print-Ready OOXML DOCX Engine**:
   - Berjalan 100% di browser pengguna (*zero server compute*).
   - Menghasilkan berkas Word `.docx` berstandar penerbit:
     - Kertas A4 & F4/Folio, Margin resmi: Kiri 3 cm, Atas 2.5 cm, Kanan 2 cm, Bawah 2.5 cm.
     - `cantSplit: true` pada seluruh baris tabel (mencegah teks terpotong canggung antar-halaman).
     - `tblHeader: true` (judul tabel berulang otomatis di halaman baru).
     - Footer penomoran halaman otomatis: *"Halaman X dari Y"*.

---

## 5. UI/UX Anti-Slop & Responsivitas Multi-Device

Mengikuti pedoman `.agents/skills/design-taste-frontend/SKILL.md`:
- **The Three Dials**: `DESIGN_VARIANCE: 7` | `MOTION_INTENSITY: 5` | `VISUAL_DENSITY: 4`.
- **Palet Warna**: *Deep Indonesian Navy* (`#1E3A8A`), *Warm Mentari Amber* (`#F59E0B`), *Fresh Sage Emerald* (`#059669`), dan kanvas bersih `#F8FAFC`. Seluruh teks memenuhi WCAG AA $\ge 4.5:1$.
- **Tipografi**: `Plus Jakarta Sans` untuk antarmuka web, `Calibri` untuk dokumen resmi Word.
- **Responsivitas Perangkat**:
  - **Desktop ($\ge 1024\text{px}$)**: *Split Workspace 2-Panel* (Form input terpandu di kiri, Live preview tabel resmi di kanan).
  - **Mobile ($< 768\text{px}$)**: *Mode Akordion Harian* (18 kegiatan disajikan per kartu hari yang dapat dilipat agar tidak perlu scroll horizontal), *Bottom-Sheet Drawer* untuk manajemen kunci API, serta *Sticky Floating Action Bar* di jangkauan jempol.

---

## 6. Indeks Dokumen Fondasi yang Telah Dibuat

1. [plan.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/plan.md) - Rencana Proyek, Milestone 5 Fase, Analisis Risiko, & Rekomendasi Nama Produk.
2. [prd.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/prd.md) - Product Requirements Document, Persona Guru & Creator, Matriks Regulasi Resmi.
3. [architecture.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/architecture.md) - Arsitektur 3 Lapis, DDL PostgreSQL, RLS Creator vs Guru, Sequence Diagram BYOK.
4. [wireframes.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/wireframes.md) - Wireframe ASCII lengkap Desktop, Tablet, & Mobile (Auth, Wizard, Preview, Key Manager, Creator Console).
5. [design_system.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/design_system.md) - Design System Anti-Slop, Kontras WCAG AA, Token Komponen, dan Pola Gerakan.
6. [log.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/log.md) - Architectural Decision Records (ADR-001 s.d. ADR-007) & Changelog.
7. [task.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/task.md) - Work Breakdown Structure (40 Checklist Tugas Eksekusi Pengodean).

---

## 7. Status & Tahapan Selanjutnya

- [x] **Fase 1 (Dokumentasi & Desain Teknis):** 100% Selesai & Terverifikasi.
- [ ] **Fase 2 (Setup Database & Supabase Migration):** Siap dieksekusi (Tabel `profiles`, `schools`, `user_api_keys`, `generated_documents`, `audit_logs`).
- [ ] **Fase 3 (Backend Edge Function):** Implementasi `generate-content-core` dengan BYOK multi-key failover.
- [ ] **Fase 4 (DOCX Engine):** Kompilasi tabel resmi 6 hari siap cetak.
- [ ] **Fase 5 & 6 (Frontend UI):** Wizard 4-langkah, editor live table, dan panel Creator.
