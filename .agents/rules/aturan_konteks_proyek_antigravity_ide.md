# WORKSPACE RULES: GENERATOR PERENCANAAN PEMBELAJARAN MENDALAM (RPM) TK/PAUD

*(Simpan isi file ini ke dalam `.agents/rules.md` pada folder proyek `RPP TK CODE BASE` di Antigravity IDE Anda)*

---

## 1. Visi & Tujuan Proyek
Membangun aplikasi web **Generator Perencanaan Pembelajaran Mendalam (RPM / Modul Ajar) TK Fase Fondasi (1 Minggu / 6 Hari)** yang menghasilkan dokumen perencanaan rapi, bebas halusinasi regulasi, sesuai prinsip pedagogis anak usia dini, memiliki fitur *live preview* dengan *inline editing*, dan dapat diekspor menjadi file `.docx` siap cetak yang 100% identik dengan tampilan preview.

---

## 2. Prinsip Arsitektur & Desain UI/UX (Wajib Dipatuhi Agent)
1. **Single-File / Clean Architecture:**
   - Satukan seluruh kode aplikasi atau modul secara bersih. Pastikan data dari `cp_paud_detail_2025.json` terintegrasi langsung di dalam aplikasi sehingga *dropdown* dan *checkbox* Elemen serta Subelemen CP dapat dipilih guru tanpa mengetik manual.
2. **Gaya Desain (Clean Corporate Education UI):**
   - Gunakan tata letak dua panel (*Split-Screen Layout*):
     - **Panel Kiri:** Form Input Identitas, Pilihan Subelemen CP (`cp_paud_detail_2025.json`), Pilihan 8 Dimensi Profil Lulusan (`DPL1` s.d. `DPL8`), dan Tombol Generate AI.
     - **Panel Kanan:** Kertas Kerja Preview A4/F4 Interaktif lengkap dengan tombol **Export .DOCX Siap Cetak** dan **Cetak / Simpan PDF**.
   - Gunakan skema warna bersih (*white / slate / indigo* atau *emerald* formal). Hindari *gradient* mencolok, warna neon, atau *glassmorphism* berlebihan.

3. **Kesesuaian Preview & Export `.docx` (WYSIWYG) + Inline Editing:**
   - Struktur tabel di layar preview wajib memiliki baris, kolom, *colspan*, warna latar *header* bagian (biru muda/abu-abu lembut), dan garis *border* tabel hitam tegas (`1px solid #000`) yang **100% sama** dengan file referensi `Contoh Perencanaan 1 minggu.docx`.
   - Seluruh sel tabel di layar preview wajib memiliki atribut `contenteditable="true"` agar guru dapat mengedit teks hasil generate secara langsung (*inline editing*) sebelum mengunduh file `.docx`.
   - Saat tombol **Export .DOCX** diklik, sistem membaca isi terbaru dari DOM yang sudah diedit guru dan menghasilkan file `.docx` yang rapi serta siap dicetak di Microsoft Word.

---

## 3. Aturan Regulasi & Anti-Halusinasi Kurikulum (Standar 2025/2026)
1. **Sumber Kebenaran Tunggal (Single Source of Truth):**
   - Teks Capaian Pembelajaran (CP) dan Subelemen (`NABP-1` s.d. `STEAM-5`) **WAJIB** diambil langsung secara *verbatim* (kata demi kata) dari file `cp_paud_detail_2025.json` (Kepka BSKAP No. 046/H/KR/2025). AI dilarang mengarang kalimat CP sendiri.
2. **Terminologi Resmi (Permendikdasmen No. 10 Tahun 2025):**
   - Gunakan istilah **"Dimensi Profil Lulusan (DPL)"** yang terdiri atas 8 dimensi (`DPL1` s.d. `DPL8`).
   - **DILARANG KERAS** menggunakan istilah lama *"Profil Pelajar Pancasila"* atau *"P5"*.
3. **Koreksi Struktur Pengalaman Belajar Inti (6 Hari):**
   - Dokumen referensi `Contoh Perencanaan 1 minggu.docx` memiliki kesalahan ketik di mana sub-header `MEMAHAMI` tertulis dua kali (pada Hari 1-2 dan Hari 3-4).
   - Di aplikasi ini, struktur tabel kegiatan inti **WAJIB DIKOREKSI** sesuai siklus Pembelajaran Mendalam resmi:
     - **Hari 1 & Hari 2:** Sub-header `MEMAHAMI (BERKESADARAN, BERMAKNA)`
     - **Hari 3 & Hari 4:** Sub-header `MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)`
     - **Hari 5 & Hari 6:** Sub-header `MEREFLEKSI (BERKESADARAN, BERMAKNA)`

---

## 4. Aturan Pedagogis Anak Usia Dini (TK Kelompok A & B)
1. **Diferensiasi Usia (DAP - Developmentally Appropriate Practice):**
   - **Kelompok A (4-5 Tahun):** Fokus pada eksplorasi sensori, motorik kasar, dan koordinasi awal motorik halus. Jika kegiatan melibatkan guntingan atau pola rumit, instruksi harus menyatakan *"guru menyiapkan pola/potongan dasar, anak merangkai/mewarnai/menggunting garis lurus sederhana"*.
   - **Kelompok B (5-6 Tahun):** Anak dapat melakukan pengukuran tidak baku/sederhana, menggunting pola lengkung/geometri secara mandiri, bekerja sama dalam aturan main yang lebih terstruktur, dan menceritakan karya dengan kalimat lebih lengkap.
2. **3 Kegiatan Bermain per Hari (Total 18 Kegiatan Seminggu):**
   - Setiap hari wajib memiliki **3 Kegiatan**:
     - *Kegiatan 1:* Seni, Eksplorasi Sains, atau Konstruksi (*Loose Parts* / Karya Kreatif) lengkap dengan **Alat dan Bahan** serta **Cara Membuat**.
     - *Kegiatan 2:* Gerak & Lagu, Motorik Kasar, atau Permainan Aturan Berpasangan/Kelompok lengkap dengan **Alat dan Bahan** serta **Cara Bermain**.
     - *Kegiatan 3:* Permainan Lingkaran (*Circle Game*), Bahasa/Komunikasi, Pramembaca/Pranumerasi Kontekstual, atau Sosial-Emosional.
   - **Larangan Calistung Dril:** Dilarang membuat kegiatan berupa mengerjakan Lembar Kerja Anak (LKA/LKS) menebalkan huruf/angka secara mekanis.
3. **Konsistensi Sinkronisasi DPL:**
   - Dimensi Profil Lulusan (DPL) yang dicentang (`✅`) pada tabel **IDENTIFIKASI** harus konsisten muncul sebagai label pada kegiatan harian dan disebutkan jumlah serta rinciannya pada **Asesmen Akhir Pembelajaran**.

---

## 5. Urutan Struktur Tabel Dokumen Output (Wajib Persis Contoh `.docx`)
1. **Judul Utama:** `PERENCANAAN PEMBELAJARAN MENDALAM` (Tengah, Bold).
2. **Tabel Identitas Umum (4 Kolom):**
   - Baris 1: `Guru` | `{nama_guru}` | `Semester` | `{semester}`
   - Baris 2: `Asal Sekolah` | `{asal_sekolah}` | `Minggu Ke-` | `{minggu_ke}`
   - Baris 3: `Fase` | `Fondasi` | `Bulan` | `{bulan}`
   - Baris 4: `Jenjang/Kelas` | `{jenjang_kelas}` | `Alokasi Waktu` | `{alokasi_waktu}`
   - Baris 5: `Model Pembelajaran` | `{model_pembelajaran}` | `Jumlah Anak` | `{jumlah_anak}`
   - Baris 6: `Topik / Sub Topik` | `{topik_subtopik}` *(colspan=3)*
3. **Header Bagian:** `IDENTIFIKASI`
   - Baris `Peserta Didik` | `{narasi_peserta_didik}` *(colspan=4)*
   - Baris `Materi Pelajaran` | `{narasi_materi_pelajaran}` *(colspan=4)*
   - Baris `Dimensi Profil Lulusan` | Grid 2 baris x 4 kolom berisi `✅` atau `⬜` untuk `DPL1` s.d. `DPL8`.
4. **Header Bagian:** `DESAIN PEMBELAJARAN`
   - Baris `Capaian Pembelajaran` | Kutipan asli dari `cp_paud_detail_2025.json`
   - Baris `Lintas Disiplin Ilmu` | `{lintas_disiplin_ilmu}`
   - Baris `Tujuan Pembelajaran` | Daftar poin Tujuan Pembelajaran
   - Baris `Topik Pembelajaran` | `{topik_pembelajaran}`
   - Baris `Praktik Pedagogis` | `{praktik_pedagogis}`
   - Baris `Kemitraan Pembelajaran` | Lingkungan Sekolah, Masyarakat, Lingkungan Luar Sekolah
   - Baris `Lingkungan Pembelajaran` | Ruang Fisik, Ruang Virtual, Budaya Belajar
   - Baris `Pemanfaatan Digital` | Perencanaan, Pelaksanaan, Asesmen, dan Tautan/QR Media Ajar
5. **Header Bagian:** `PENGALAMAN BELAJAR`
   - Sub-bagian `AWAL (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)` beserta pengantar dan 6 poin kegiatan pembuka.
   - Sub-bagian `INTI` beserta pengantar dan Tabel 2 Kolom (`Hari` | `Uraian Kegiatan`) untuk Hari 1 s.d. Hari 6 yang terbagi dalam 3 bar pemisah: `MEMAHAMI (BERKESADARAN, BERMAKNA)` (Hari 1-2), `MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)` (Hari 3-4), dan `MEREFLEKSI (BERKESADARAN, BERMAKNA)` (Hari 5-6).
   - Sub-bagian `PENUTUP (BERKESADARAN, MENGGEMBIRAKAN)` beserta pengantar dan 6 poin kegiatan penutup.
6. **Header Bagian:** `ASESMEN PEMBELAJARAN`
   - `Asesmen pada Awal Pembelajaran` (3 poin)
   - `Asesmen pada Proses Pembelajaran` (4 poin)
   - `Asesmen pada Akhir Pembelajaran` (4 poin)
7. **Blok Pengesahan (Tanda Tangan):** Mengetahui Kepala TK (kiri) dan Guru Kelas (kanan).