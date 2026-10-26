# Product Requirements Document (PRD)
## Kalandra PAUD: Generator Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi

> **Status:** Approved / Draft Spesifikasi Teknis  
> **Target Audience:** Pendidik PAUD/TK (Kelompok A 4-5 Tahun & Kelompok B 5-6 Tahun), Kepala Satuan PAUD, Operator Sekolah  
> **Basis Regulasi:** Kurikulum Merdeka PAUD 2025/2026 (Permendikdasmen No. 10/2025, No. 12/2025, No. 1/2026, Keputusan BSKAP No. 046/H/KR/2025)  

---

## 1. Latar Belakang & Pernyataan Masalah (Problem Statement)

Dalam implementasi standar kurikulum PAUD terbaru tahun 2025 dan 2026, Kemendikdasmen RI menetapkan pembaharuan mendasar:
1. **Pergantian Istilah Karakter**: Istilah *"Profil Pelajar Pancasila"* dan *"P5"* digantikan secara resmi oleh **8 Dimensi Profil Lulusan (DPL)** (Permendikdasmen No. 10/2025). Banyak guru TK masih kebingungan dan kerap menggunakan format usang.
2. **Pendekatan Pembelajaran Mendalam (*Deep Learning*)**: Standar Proses (Permendikdasmen No. 1/2026) mewajibkan prinsip pembelajaran yang **Berkesadaran (Mindful)**, **Bermakna (Meaningful)**, dan **Menggembirakan (Joyful)** dengan 3 tahapan kognitif-afektif: **Memahami**, **Mengaplikasi**, dan **Merefleksi**.
3. **Beban Administratif Mingguan**: Guru TK diwajibkan menyusun perencanaan mingguan yang mencakup 3 kegiatan main per hari (total 18 aktivitas main per minggu untuk 6 hari sekolah). Aktivitas ini harus mengintegrasikan bahan lepasan (*loose parts*), permainan fisik/motorik, bahasa/keaksaraan awal, serta melarang dril Lembar Kerja Anak (LKA/LKS) mekanis. Proses manual ini menghabiskan waktu rata-rata 6–8 jam setiap akhir pekan.
4. **Keterbatasan Kuota AI**: Guru yang mencoba menggunakan AI (misalnya Google Gemini) sering kali terbentur *rate limit* (HTTP 429) pada tier gratis atau mengalami halusinasi istilah.
5. **Format Dokumen Tidak Standar**: Dokumen hasil salinan dari chat AI biasanya berantakan saat dipindahkan ke Word: tabel terbelah canggung di tengah baris teks, margin tidak sesuai standar instansi, dan format tidak seragam di lingkungan sekolah.

**Kalandra PAUD** hadir sebagai solusi berbasis web responsif yang memadukan otomasi kecerdasan buatan Gemini dengan arsitektur tangguh **BYOK (Bring Your Own Key)**, kepatuhan regulasi 100%, serta ekspor dokumen `.docx` publisher-grade yang langsung siap cetak.

---

## 2. Persona Pengguna (User Personas)

### Persona 1: Ibu Dewi, S.Pd. (Guru Kelas TK Kelompok A - Usia 4-5 Tahun)
- **Karakteristik**: Memiliki pemahaman mendalam tentang karakter anak usia 4-5 tahun, tetapi sering kewalahan dengan tuntutan dokumen administrasi mingguan. Lebih sering mengakses internet menggunakan smartphone atau tablet di sekolah dan laptop di rumah.
- **Tujuan**: Menyusun perencanaan mingguan 18 kegiatan berbasis *loose parts* yang sesuai tahapan motorik anak usia 4-5 tahun tanpa lembur di akhir pekan.
- **Pain Points**: Tidak paham teknis kuota API AI, frustrasi jika format tabel di Word berantakan saat dicetak, dan takut salah menggunakan regulasi/istilah kurikulum baru.

### Persona 2: Creator / Superadmin Platform (Pemilik & Pengembang Generator)
- **Karakteristik**: Kreator/pemilik aplikasi generator yang mendistribusikan alat ini kepada para guru TK/PAUD. Bertanggung jawab atas ketersediaan sistem, manajemen akun pengguna (guru), pembaruan master prompt kurikulum, dan pemantauan analitik penggunaan.
- **Tujuan**: Mengelola akses pengguna aplikasi (guru dari berbagai satuan PAUD), mengontrol aktivasi akun pengguna, memastikan template kurikulum selalu *up-to-date* sesuai regulasi Kemendikdasmen, dan memantau stabilitas AI engine.
- **Catatan Roadmap Masa Depan**: Sistem dirancang dapat diperluas (*extensible*) untuk menambahkan peran sekunder seperti *Admin Satuan / Kepala Sekolah* untuk kebutuhan supervisi internal sekolah tertentu.

---

## 3. Matriks Kepatuhan Regulasi Resmi (Regulatory Compliance Matrix)

| Aspek Regulasi | Dasar Hukum | Ketentuan Wajib Aplikasi |
|:---|:---|:---|
| **Dimensi Profil Lulusan** | Permendikdasmen No. 10 Tahun 2025 | Dilarang keras memakai istilah "P5" atau "Profil Pelajar Pancasila". Wajib memakai istilah resmi **DPL1 s.d. DPL8**. Form menyediakan multi-select DPL1-DPL8. |
| **Standar Isi PAUD** | Permendikdasmen No. 12 Tahun 2025 | Memuat 3 pilar: **Pengetahuan Esensial**, **Pengetahuan Aplikatif**, serta **Nilai dan Karakter** pada bagian `Identifikasi Materi Pelajaran`. |
| **Standar Proses (Deep Learning)** | Permendikdasmen No. 1 Tahun 2026 | Pembagian siklus belajar harian: <br>• **Hari 1 & 2**: Tahap *Memahami (Berkesadaran, Bermakna)*<br>• **Hari 3 & 4**: Tahap *Mengaplikasi (Berkesadaran, Bermakna, Menggembirakan)*<br>• **Hari 5 & 6**: Tahap *Merefleksi (Berkesadaran, Bermakna)* |
| **Keseimbangan Kegiatan Harian** | Panduan Pembelajaran & Asesmen PAUD | Setiap hari memuat tepat **3 Kegiatan Bermain**: <br>1. *Eksplorasi Seni / Loose Parts / Rekayasa* (Ada Alat-Bahan & Cara Membuat)<br>2. *Permainan Fisik-Motorik / Sosial-Emosional* (Ada Alat-Bahan & Cara Bermain)<br>3. *Circle Game / Bahasa / Keaksaraan Kontekstual* (Bukan Dril LKS) |
| **Kesesuaian Usia (DAP)** | Pedoman Kurikulum Fase Fondasi | • **Kelompok A (4-5 Tahun)**: Guru menyiapkan garis pola/potongan dasar pada pijakan lingkungan main.<br>• **Kelompok B (5-6 Tahun)**: Anak menggunting mandiri, merakit pola geometri, mengukur satuan tidak baku. |
| **Capaian Pembelajaran (CP)** | Keputusan BSKAP No. 046/H/KR/2025 | Teks elemen & subelemen disalin *verbatim* dari master data `cp_paud_detail_2025.json` tanpa diubah atau dikarang ulang oleh AI. |

---

## 4. Fitur Utama & Kebutuhan Fungsional (Functional Requirements)

### 4.1. Manajemen Kunci API BYOK (Bring Your Own Key) & Pooling
- **Multi-Key Storage**: Pengguna (Guru/Admin) dapat menyimpan 1 hingga 5 kunci Google Gemini API gratis (diperoleh dari Google AI Studio).
- **Auto-Failover Kuota (HTTP 429)**: Jika Kunci A mengalami limit kuota (*ResourceExhausted* / 429), mesin backend otomatis beralih seketika ke Kunci B tanpa membatalkan proses guru.
- **Model Fallback Chain**: Urutan fallback otomatis jika model tertentu mengalami 404/503:
  1. `gemini-3.6-flash` (Prioritas Utama / Kecepatan & Nalar Tinggi)
  2. `gemini-3.5-flash` / `gemini-3.0-flash`
  3. `gemini-2.5-flash`
  4. `gemini-2.5-flash-lite`
- **Uji Koneksi Real-time**: Tombol *Test Key* untuk memvalidasi apakah kunci API valid dan aktif.
- **Keamanan Kunci**: Kunci API tersimpan di database dengan Supabase Row Level Security (RLS) terisolasi per `user_id`, sehingga guru lain maupun pengguna publik tidak dapat melihatnya.

### 4.2. Wizard Pembuatan Perencanaan Mingguan (4-Step Guided Wizard)
- **Langkah 1: Identitas Dokumen**:
  - Nama Guru, Asal Satuan PAUD, Fase (Otomatis: *Fondasi*), Jenjang/Kelas (`A (4-5 Tahun)` atau `B (5-6 Tahun)`), Semester (`1 (Gasal)` / `2 (Genap)`), Minggu Ke- (1 s.d. 18), Bulan, Alokasi Waktu (Default `6 x 3 JP` atau `5 x 3 JP`), Model Pembelajaran (`Sentra` / `Kelompok` / `Area` / `Proyek`), Jumlah Anak, serta Topik & Sub-topik.
- **Langkah 2: Target 8 Dimensi Profil Lulusan (DPL)**:
  - Checkbox interaktif DPL1 s.d. DPL8 lengkap dengan ringkasan fokus PAUD.
  - Validasi minimal memilih 2 DPL dan maksimal 8 DPL.
- **Langkah 3: Pemilihan Capaian Pembelajaran & Konteks Lokal**:
  - Tree-selector subelemen CP dari `cp_paud_detail_2025.json`:
    - *Nilai Agama dan Budi Pekerti (NABP-1 s.d. NABP-4)*
    - *Jati Diri (JD-1 s.d. JD-5)*
    - *Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni (LMSTRS-1 s.d. LMSTRS-7)*
  - Indikator acuan otomatis tercentang sesuai subelemen.
  - Catatan konteks lokal guru (misalnya ketersediaan bahan *loose parts*: "banyak daun mangga kering, kardus susu, dan botol plastik").
- **Langkah 4: Eksekusi AI & Live Status**:
  - Tombol **Generate RPM**.
  - Indikator progres multi-fase (*Menyiapkan Konteks -> Menghubungi Model AI -> Memvalidasi Skema DPL -> Menyusun Struktur Tabel*).
  - Tampilan visual model & key yang aktif digunakan.

### 4.3. Interactive Preview & Live In-place Editor
- **Tampilan Tabel Identik Resmi**: Merender hasil generate ke dalam struktur tabel HTML yang sesuai dengan tata letak dokumen resmi.
- **In-place Editing**: Guru dapat langsung mengklik dan mengedit teks kegiatan, bahan *loose parts*, atau kalimat asesmen sebelum diekspor.
- **Audit Sinkronisasi DPL Real-Time**: Indikator otomatis yang memberi peringatan hijau jika seluruh DPL terpilih telah muncul pada label kegiatan harian, atau kuning jika terdapat inkonsistensi.

### 4.4. Publisher-Grade DOCX Export Engine
- **Ekspor 1-Klik ke Microsoft Word**: Menghasilkan file `.docx` biner yang dapat diedit di Word / Google Docs / LibreOffice.
- **Pilihan Ukuran Kertas**: Mendukung kertas standar instansi Indonesia: **A4 (210 x 297 mm)** dan **F4 / Folio (215 x 330 mm)**.
- **Margin Resmi**: Kiri 3 cm, Atas 2.5 cm, Kanan 2 cm, Bawah 2.5 cm.
- **Pencegahan Tabel Rusak**: Menggunakan atribut OOXML `cantSplit: true` pada tiap baris agar teks kegiatan tidak terbelah di perbatasan halaman, serta `tblHeader: true` agar judul kolom berulang rapi di halaman baru.
- **Header & Footer Standar**: Header judul dokumen (8pt abu-abu) dan Footer *"Halaman X dari Y"*.

### 4.5. Sistem Dua Peran (Role-Based Access Control)
- **Role `admin` (Creator / Superadmin Platform)**:
  - Dashboard Creator: Statistik penggunaan platform (total guru terdaftar, dokumen dihasilkan, volume generasi mingguan).
  - Manajemen Pengguna Aplikasi: Melihat daftar seluruh pengguna (guru), mengaktifkan/menonaktifkan akses akun, menyetel status kuota/langganan, dan reset akses.
  - Manajemen Master Kurikulum & Prompt: Konfigurasi default `systemInstruction`, penyesuaian regulasi CP 2025/2026, dan katalog referensi DPL.
  - Log & Telemetri Platform: Memantau log generasi AI, mendeteksi error tingkat global (seperti kegagalan model), dan rekapitulasi performa engine.
  - *(Roadmap Masa Depan)*: Kemampuan menambahkan role *Admin Satuan / Kepala Sekolah* untuk pengelolaan tersentralisasi per instansi.
- **Role `guru`**:
  - Dashboard pribadi: daftar draf dan dokumen RPM yang telah dibuat.
  - Wizard generator RPM mingguan.
  - Modal / Drawer BYOK API Key pribadi.
  - Riwayat dokumen: unduh ulang DOCX, duplikasi draf minggu sebelumnya untuk diedit, hapus dokumen.
  - Pengaturan profil pengajar pribadi.

---

## 5. Kebutuhan Responsivitas & Antarmuka Multi-Device

Mengikuti standar `design-taste-frontend`:
- **Desktop (≥ 1024px)**:
  - Layout dua panel (*Split Workspace*): Sisi kiri formulir wizard navigatif dengan progress steps, sisi kanan live preview tabel interaktif dengan toolbar aksi (Edit, Regenerate Bagian Tertentu, Ekspor DOCX).
- **Tablet (768px – 1023px)**:
  - Sidebar kolapsibel otomatis, formulir wizard mengisi lebar penuh dengan mode *tabs* atau *stepper bar*, preview dapat diakses melalui tombol tab navigasi cepat.
- **Mobile Smartphone (< 768px)**:
  - *Full touch-optimized UX*: Form wizard disusun vertikal dengan ukuran sentuh minimal 44x44px.
  - Drawer / Bottom-sheet untuk API Key Manager dan pemilih subelemen CP.
  - Tabel preview dilengkapi tombol sakelar tampilan: **Mode Kartu Akordion Harian** (sangat nyaman dibaca di layar HP tanpa perlu geser horizontal) atau **Mode Tabel Lebar Penuh** (dengan *scroll container* yang mulus).
  - Tombol aksi melayang (*Sticky Bottom Action Bar*) untuk tombol **Simpan & Ekspor DOCX**.

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Keandalan (Resilience & Reliability)**:
   - Client-side retry via `invokeWithRetry.ts` hingga 3 kali percobaan dengan exponential backoff (800ms, 1600ms, 3200ms) untuk menangani *transient connection failure*.
   - Validasi skema deterministik: memastikan field `informasi_umum`, `identifikasi`, `desain_pembelajaran`, `pengalaman_belajar.inti`, dan `asesmen_pembelajaran` tidak null sebelum disajikan ke guru.
2. **Kinerja (Performance)**:
   - Waktu respons pembentukan dokumen AI rata-rata 15–30 detik (bergantung kecepatan inferensi Gemini Flash).
   - Ekspor biner `.docx` di sisi browser selesai dalam waktu < 1.5 detik menggunakan library `docx` JavaScript murni tanpa membebani server.
3. **Keamanan Data (Security & Privacy)**:
   - Autentikasi menggunakan Supabase Auth (Email & Kata Sandi aman).
   - Seluruh tabel database diproteksi oleh Row Level Security (RLS). Guru hanya dapat membaca dan menulis dokumen serta kunci API miliknya sendiri. Admin memiliki akses baca agregat untuk pelaporan sekolah.
   - Kunci API pengguna tidak pernah di-log ke console publik atau dibagikan ke pihak ketiga selain endpoint resmi Google AI.
4. **Aksesibilitas (Accessibility & Usability)**:
   - Kontras warna teks memenuhi standar WCAG AA (rasio kontras minimal 4.5:1 untuk teks biasa dan 3:1 untuk tombol/heading).
   - Font keterbacaan tinggi (*Plus Jakarta Sans* / *Outfit* untuk antarmuka aplikasi, *Calibri* untuk ekspor resmi dokumen Word).
   - Seluruh input formulir memiliki label eksplisit di atas bidang input (tidak mengandalkan placeholder saja).

---

## 7. Metrik Keberhasilan & KPI Produk

- **Time-to-Document**: Penurunan durasi penyusunan RPP mingguan dari 6 jam menjadi < 3 menit.
- **Tingkat Keberhasilan Ekspor**: 99.5% keberhasilan konversi dari JSON ke DOCX tanpa *crash*.
- **Toleransi Rate Limit 429**: 0 kegagalan total bagi guru yang memasukkan ≥ 2 API keys aktif.
- **Zero Hallucination Rate**: 0% kemunculan kata kunci usang ("P5" / "Profil Pelajar Pancasila") pada dokumen hasil generate.
- **Mobile Usability Score**: Guru dapat menyelesaikan input dan mengunduh berkas langsung dari smartphone Android/iOS tanpa kendala tata letak.
