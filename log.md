# Architectural Decision Log (ADR) & Riwayat Perubahan
## Kalandra PAUD: Generator Perencanaan Pembelajaran Mendalam (RPM) TK

> **Tujuan Dokumen:** Mencatat keputusan arsitektural utama (*Architecture Decision Records*), rasionalisasi pedagogis PAUD, dan riwayat iterasi teknis sistem.

---

## 1. Daftar Catatan Keputusan Arsitektur (Architecture Decision Records)

### ADR-001: Pemilihan Arsitektur BYOK (Bring Your Own Key) Multi-Key Pooling
- **Tanggal:** 2026-10-26
- **Status:** Diterima & Disetujui
- **Konteks:**
  Layanan AI terpusat berbasis langganan bulanan sering kali membebani anggaran sekolah TK/PAUD kecil di daerah. Sementara itu, Google AI Studio menyediakan tier kunci API gratis bagi pengembang/pengguna individual, namun memiliki kelemahan: batas kuota per menit (*rate limit HTTP 429*).
- **Keputusan:**
  Mengadopsi pola arsitektur **BYOK Multi-Key Pooling**. Guru dan sekolah dapat mendaftarkan beberapa kunci API Gemini gratis mereka sendiri ke dalam profil akun yang terenkripsi. Mesin backend secara dinamis melakukan rotasi kunci otomatis saat terbentur error 429.
- **Konsekuensi:**
  - *Positif:* Nol biaya komputasi AI bagi pengembang aplikasi, sekolah mandiri secara kuota, dan proses generate tidak pernah macet di tengah jalan.
  - *Mitigasi:* Disediakan antarmuka modal/bottom-sheet yang sangat ramah orang awam dengan panduan langkah demi langkah cara mengambil kunci API gratis di Google AI Studio.

---

### ADR-002: Ekspor Dokumen Berstandar Penerbit di Sisi Klien (Client-Side OOXML Engine)
- **Tanggal:** 2026-10-26
- **Status:** Diterima & Disetujui
- **Konteks:**
  Mengompilasi file Word `.docx` di sisi server (misalnya menggunakan LibreOffice headless atau Node.js container) memerlukan memori server tinggi, rentan *crash* saat diakses banyak guru secara bersamaan, dan menimbulkan latensi jaringan.
- **Keputusan:**
  Menggunakan pustaka JavaScript `docx` murni yang dieksekusi 100% di browser pengguna (*client-side execution*). Dokumen langsung dirakit menjadi biner Blob dan diunduh seketika melalui browser.
- **Konsekuensi:**
  - *Positif:* Ekspor dokumen instan (< 1.5 detik), tidak ada beban memori di server Supabase, dokumen dapat diunduh bahkan saat koneksi backend sedang lambat, serta mendukung penataan margin dan tabel resmi secara presisi (`cantSplit`, `tblHeader`, margin 3-2.5-2-2.5 cm).

---

### ADR-003: Penghapusan Total Terminologi Usang ("P5" / "Profil Pelajar Pancasila")
- **Tanggal:** 2026-10-26
- **Status:** Diterima & Disetujui (Kepatuhan Regulasi Wajib)
- **Konteks:**
  Permendikdasmen No. 10 Tahun 2025 secara resmi menggantikan konsep Profil Pelajar Pancasila dengan **8 Dimensi Profil Lulusan (DPL)** pada Standar Kompetensi Lulusan PAUD. Di lapangan, banyak model AI generik yang masih berhalusinasi menyertakan istilah "P5" dan modul proyek calistung mekanis.
- **Keputusan:**
  1. Menanamkan aturan negatif (*negative constraints*) eksplisit pada `systemInstruction`: DILARANG KERAS menggunakan kata "P5" atau "Profil Pelajar Pancasila".
  2. Menggantikan seluruh field dan tabel perencanaan dengan istilah **8 Dimensi Profil Lulusan (DPL1 s.d. DPL8)**.
  3. Memvalidasi secara terprogram bahwa label kegiatan harian sinkron 100% dengan kode DPL yang dicentang guru pada formulir.

---

### ADR-004: Penegakan Siklus Pembelajaran Mendalam (Deep Learning) 6 Hari
- **Tanggal:** 2026-10-26
- **Status:** Diterima & Disetujui
- **Konteks:**
  Permendikdasmen No. 1 Tahun 2026 menetapkan Standar Proses baru yang menekankan *Deep Learning* berkesadaran, bermakna, dan menggembirakan dengan tahapan: Memahami, Mengaplikasi, dan Merefleksi.
- **Keputusan:**
  Membagi struktur kegiatan inti 6 hari sekolah menjadi 3 blok berpasangan yang deterministik:
  - **Hari 1 & 2**: `MEMAHAMI (BERKESADARAN, BERMAKNA)` -> Eksplorasi konsep awal dan observasi panca indra.
  - **Hari 3 & 4**: `MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)` -> Konstruksi *loose parts*, eksperimen sains sederhana, permainan kelompok beraturan.
  - **Hari 5 & 6**: `MEREFLEKSI (BERKESADARAN, BERMAKNA)` -> Pemecahan masalah, unjuk karya di depan teman, recalling berkesadaran.
  Setiap hari memuat tepat **3 kegiatan** (Total 18 kegiatan per minggu), melarang dril LKS calistung mekanis.

---

### ADR-005: Model Chain Fallback Berjenjang Gemini
- **Tanggal:** 2026-10-26
- **Status:** Diterima & Disetujui
- **Konteks:**
  Google AI Studio sering memperbarui status ketersediaan model (misalnya model baru dirilis atau model lama ditutup) dan akun gratis dapat memiliki akses tier yang berbeda.
- **Keputusan:**
  Menetapkan rantai fallback otomatis di Edge Function:
  1. `gemini-3.6-flash` (Pilihan Utama - Penalaran Tinggi)
  2. `gemini-3.5-flash` / `gemini-3.0-flash`
  3. `gemini-2.5-flash`
  4. `gemini-2.5-flash-lite`
  Jika model utama mengembalikan status HTTP 404 (tidak ditemukan) atau 503 (kelebihan beban), mesin seketika mencoba model berikutnya dalam rantai tanpa gagal.

---

### ADR-006: Definisi Dua Peran (Creator/Superadmin Platform vs Guru End-User)
- **Tanggal:** 2026-10-26
- **Status:** Diterima & Disetujui
- **Konteks:**
  Aplikasi ini dibuat dan dikelola oleh Creator/Pengembang (Admin) untuk didistribusikan kepada para guru TK/PAUD sebagai pengguna akhir (*end-users*). Creator memerlukan kendali menyeluruh atas aktivasi akun guru, pemantauan penggunaan kuota/dokumen, dan pemeliharaan master prompt/kurikulum.
- **Keputusan:**
  - **Role `admin` (Creator / Superadmin Platform)**: Memiliki hak akses mengelola seluruh pengguna aplikasi (guru), mengaktifkan/menonaktifkan akses akun, menyetel konfigurasi master prompt dan kurikulum, serta membaca telemetri audit sistem.
  - **Role `guru` (End-User / Pendidik)**: Mengakses wizard pembuatan dokumen, mengelola kunci API pribadi (BYOK) secara aman terenkripsi per user, dan mengunduh berkas RPM.
  - **Extensibility Roadmap**: Skema basis data dirancang mendukung penambahan peran sekunder di masa depan (*Admin Satuan / Kepala Sekolah*) untuk fitur supervisi internal satuan pendidikan tertentu tanpa merombak arsitektur inti.

---

### ADR-007: Adaptasi Responsif Mobile-First dengan Mode Akordion Harian
- **Tanggal:** 2026-10-26
- **Status:** Diterima & Disetujui
- **Konteks:**
  Guru TK sering memeriksa perencanaan saat berada di kelas atau di perjalanan menggunakan smartphone (layar 360px – 414px). Tabel resmi 6 hari yang lebar sangat sulit dibaca di layar HP jika dipaksa menggunakan scrolling horizontal terus-menerus.
- **Keputusan:**
  Menyediakan sakelar tampilan cerdas:
  - **Mode Akordion Harian (Mobile Default)**: Menyajikan 6 hari pembelajaran dalam bentuk kartu lipat (*collapsible accordion*). Setiap hari dapat dibuka untuk membaca 3 kegiatan secara vertikal dengan nyaman.
  - **Mode Tabel Resmi (Desktop/Tablet Default)**: Menampilkan tata letak grid tabel lengkap yang menyerupai berkas cetak dokumen Word.

---

## 2. Riwayat Perubahan & Tonggak Proyek (Changelog)

| Versi | Tanggal | Inisiator | Ringkasan Perubahan |
|:---:|:---:|:---:|:---|
| **v0.1.0** | 2026-10-26 | Antigravity AI | • Inisiasi proyek dan riset regulasi Kurikulum PAUD 2025/2026.<br>• Pembuatan Cetak Biru Perencanaan Pembelajaran Mendalam TK.<br>• Pemetaan 8 Dimensi Profil Lulusan (Permendikdasmen 10/2025) dan Capaian Pembelajaran (`cp_paud_detail_2025.json`).<br>• Penyusunan 7 dokumen teknis fondasi: `plan.md`, `prd.md`, `architecture.md`, `wireframes.md`, `design_system.md`, `log.md`, dan `task.md`. |
