# Work Breakdown Structure (WBS) & Task Execution Plan
## Kalandra PAUD: Generator Perencanaan Pembelajaran Mendalam (RPM) TK

> **Panduan Status:**  
> - [x] **Selesai (Completed)**  
> - [/] **Sedang Berjalan (In Progress)**  
> - [ ] **Belum Dimulai (Pending)**  

---

## Ringkasan Progres Proyek

| Kategori Tahapan | Total Tugas | Selesai | Persentase | Status |
|:---|:---:|:---:|:---:|:---:|
| **Fase 1: Dokumentasi & Desain Teknis** | 7 | 7 | 100% | Selesai |
| **Fase 2: Skema Basis Data & Keamanan RLS** | 5 | 5 | 100% | Selesai |
| **Fase 3: Backend Edge Function & BYOK Pooling** | 5 | 5 | 100% | Selesai |
| **Fase 4: Engine Kompilasi DOCX Siap Cetak** | 6 | 6 | 100% | Selesai |
| **Fase 5: Hook & Pipeline Ketahanan Klien** | 4 | 4 | 100% | Selesai |
| **Fase 6: Komponen Antarmuka & Wizard Responsif** | 8 | 8 | 100% | Selesai |
| **Fase 7: Pengujian, Validasi Responsif, & QA** | 5 | 5 | 100% | Selesai |
| **TOTAL KESELURUHAN** | **40** | **40** | **100%** | **Selesai Paripurna** |

---

## Rincian Daftar Tugas (Task Checklist)

### Fase 1: Dokumentasi & Desain Teknis Fondasi
- [x] **TASK-1.1**: Analisis regulasi Kurikulum PAUD (Permendikdasmen No. 10/2025, 12/2025, 1/2026, Keputusan BSKAP 046/2025).
- [x] **TASK-1.2**: Penyusunan Rencana Strategis & Rekomendasi Nama Produk ([plan.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/plan.md)).
- [x] **TASK-1.3**: Penyusunan Dokumen Kebutuhan Produk ([prd.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/prd.md)) dengan matriks regulasi resmi dan persona pengguna.
- [x] **TASK-1.4**: Desain Arsitektur Sistem ([architecture.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/architecture.md)) mencakup DDL PostgreSQL, RLS admin/guru, dan failover BYOK.
- [x] **TASK-1.5**: Perancangan Wireframe Antarmuka Multi-Device ([wireframes.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/wireframes.md)) untuk Desktop, Tablet, dan Mobile.
- [x] **TASK-1.6**: Pembuatan Panduan Desain Anti-Slop ([design_system.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/design_system.md)) dengan kalibrasi warna edukasi, tipografi, dan token UI.
- [x] **TASK-1.7**: Pencatatan Keputusan Arsitektur ADR-001 s.d. ADR-007 ([log.md](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/log.md)).

---

### Fase 2: Skema Basis Data & Keamanan RLS Supabase
- [x] **TASK-2.1**: Buat skrip migrasi SQL untuk tabel `schools` (Profil Satuan PAUD, NPSN, Alamat, Kepala Sekolah) ([01_schools.sql](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/supabase/migrations/01_schools.sql)).
- [x] **TASK-2.2**: Buat skrip migrasi SQL untuk tabel `profiles` dengan peran `admin` dan `guru` serta trigger auto-create profil dari `auth.users` ([02_profiles.sql](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/supabase/migrations/02_profiles.sql)).
- [x] **TASK-2.3**: Buat skrip migrasi SQL untuk tabel `user_api_keys` dengan enkripsi dan aturan RLS kepemilikan mutlak ([03_user_api_keys.sql](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/supabase/migrations/03_user_api_keys.sql)).
- [x] **TASK-2.4**: Buat skrip migrasi SQL untuk tabel `generated_documents` (metadata perencanaan & payload JSONB) dengan RLS guru dan supervisi admin ([04_generated_documents.sql](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/supabase/migrations/04_generated_documents.sql)).
- [x] **TASK-2.5**: Buat skrip migrasi SQL untuk tabel `audit_logs` untuk mencatat aktivitas pembuatan dokumen dan unduhan berkas ([05_audit_logs.sql](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/supabase/migrations/05_audit_logs.sql)).

---

### Fase 3: Backend Supabase Edge Function & AI Engine BYOK
- [x] **TASK-3.1**: Setup fungsi Edge `generate-content-core` dengan autentikasi Bearer JWT ([supabase/functions/generate-content-core/index.ts](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/supabase/functions/generate-content-core/index.ts)).
- [x] **TASK-3.2**: Tanamkan data master `cp_paud_detail_2025.json` dan konstanta 8 DPL ke dalam runtime fungsi backend.
- [x] **TASK-3.3**: Implementasikan Dynamic Prompt Assembler dengan `systemInstruction` resmi (larangan kata "P5", kutipan verbatim CP, aturan DAP Kelompok A vs Kelompok B).
- [x] **TASK-3.4**: Implementasikan mesin rotasi multi-kunci dinamis (Outer loop kunci, tangkap HTTP 429, alihkan ke kunci berikutnya seketika).
- [x] **TASK-3.5**: Implementasikan Model Fallback Chain (`gemini-3.6-flash` -> `gemini-3.5-flash` / `gemini-3.0-flash` -> `gemini-2.5-flash` -> `gemini-2.5-flash-lite`) serta pembersih Markdown JSON.

---

### Fase 4: Engine Kompilasi Dokumen Microsoft Word (DOCX Engine)
- [x] **TASK-4.1**: Porting dan adaptasi modul `docx-styles.ts` untuk dokumen administrasi PAUD (Margin Kiri 3cm, Atas 2.5cm, Kanan 2cm, Bawah 2.5cm; Kertas A4 & F4/Folio) ([docx-styles.ts](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/lib/docx-engine/docx-styles.ts)).
- [x] **TASK-4.2**: Implementasikan pembuat Tabel 1: Identifikasi (Peserta Didik, Materi Pelajaran, dan Matriks 8 Dimensi Profil Lulusan) ([docx-paud-builder.ts](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/lib/docx-engine/docx-paud-builder.ts)).
- [x] **TASK-4.3**: Implementasikan pembuat Tabel 2: Desain Pembelajaran (Capaian Pembelajaran, Lintas Disiplin, Tujuan, Topik, Kemitraan, Lingkungan Belajar, Pemanfaatan Digital).
- [x] **TASK-4.4**: Implementasikan pembuat Tabel 3: Pengalaman Belajar Inti 6 Hari (Tahap Memahami H1-H2, Mengaplikasi H3-H4, Merefleksi H5-H6; 3 Kegiatan harian dengan Alat-Bahan & Cara Membuat/Bermain).
- [x] **TASK-4.5**: Implementasikan pembuat Tabel 4: Asesmen Pembelajaran (Awal, Proses, Akhir) dan Blok Pengesahan Tanda Tangan.
- [x] **TASK-4.6**: Pastikan seluruh baris tabel memiliki properti `cantSplit: true` dan kepala tabel berulang otomatis dengan `tblHeader: true`.

---

### Fase 5: Hook & Pipeline Ketahanan Sisi Klien
- [x] **TASK-5.1**: Adaptasi `invokeWithRetry.ts` dengan penanganan exponential backoff (800ms, 1600ms, 3200ms) untuk jaringan seluler tidak stabil ([invokeWithRetry.ts](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/lib/invokeWithRetry.ts)).
- [x] **TASK-5.2**: Buat custom validator skema JSON `validatePaudDocSchema` yang memeriksa kelengkapan 18 kegiatan bermain dan sinkronisasi 8 DPL.
- [x] **TASK-5.3**: Adaptasi hook `useGeminiKeys.ts` untuk operasi CRUD kunci API Gemini guru, status aktif/nonaktif, dan tombol pengujian koneksi ([useGeminiKeys.ts](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/hooks/useGeminiKeys.ts)).
- [x] **TASK-5.4**: Buat Context & Guard Autentikasi Pengguna (`AuthContext.tsx`) yang menangani login, registrasi, dan pembatasan peran `admin` vs `guru` ([AuthContext.tsx](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/context/AuthContext.tsx)).

---

### Fase 6: Komponen Antarmuka & Wizard Responsif
- [x] **TASK-6.1**: Konfigurasi Tailwind v4, variabel CSS tema pendidikan, dan font `Plus Jakarta Sans` ([index.css](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/index.css)).
- [x] **TASK-6.2**: Buat Topbar & Navigasi Responsif dengan Lencana Status Kunci BYOK Aktif dan Profil Pengguna ([Topbar.tsx](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/components/Topbar.tsx)).
- [x] **TASK-6.3**: Buat 4-Step Wizard Pembuatan Perencanaan Mingguan (Identitas Dokumen, Checkbox 8 DPL, Pemilih Subelemen CP dari JSON, dan Catatan Loose Parts) ([RpmWizard.tsx](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/components/RpmWizard.tsx)).
- [x] **TASK-6.4**: Buat Komponen Live Progress Indicator saat AI memproses dokumen dengan umpan balik visual yang tenang ([LiveProgressIndicator.tsx](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/components/LiveProgressIndicator.tsx)).
- [x] **TASK-6.5**: Buat Live Table Preview resmi (Mode Split Table untuk Desktop) dan Mode Kartu Akordion Harian (Mobile-Friendly) ([LiveTablePreview.tsx](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/components/LiveTablePreview.tsx)).
- [x] **TASK-6.6**: Buat Modal & Bottom-Sheet BYOK API Key Manager dengan panduan tautan ke Google AI Studio ([ApiKeyManagerModal.tsx](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/components/ApiKeyManagerModal.tsx)).
- [x] **TASK-6.7**: Buat Dialog Ekspor DOCX dengan pilihan ukuran kertas (A4 vs F4) dan opsi tanda tangan ([ExportDocxModal.tsx](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/components/ExportDocxModal.tsx)).
- [x] **TASK-6.8**: Buat Konsol Creator / Superadmin Platform (Manajemen Pengguna Guru dari berbagai sekolah, Aktivasi/Nonaktivasi Akun, Metrik Generasi Dokumen, dan Konfigurasi Master Prompt) ([AdminConsole.tsx](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/components/AdminConsole.tsx)).

---

### Fase 7: Pengujian, Validasi Responsivitas, & QA
- [x] **TASK-7.1**: Uji coba responsivitas layar smartphone Android/iOS (resolusi 360px - 414px) untuk memastikan tidak ada layout overflow dan drawer bottom-sheet bekerja mulus.
- [x] **TASK-7.2**: Uji coba responsivitas tablet (iPad / Android Tablet 768px - 1024px) dengan mode dual panel.
- [x] **TASK-7.3**: Simulasi penanganan limit kuota (HTTP 429) untuk memverifikasi peralihan otomatis ke kunci cadangan tanpa interupsi guru.
- [x] **TASK-7.4**: Verifikasi hasil file biner `.docx` yang diekspor di Microsoft Word dan WPS Office untuk memastikan margin, tabel, dan halaman rapi tanpa canggung.
- [x] **TASK-7.5**: Audit kepatuhan regulasi akhir (memastikan 0% kemunculan kata "P5" dan seluruh 8 DPL sinkron 100%).
