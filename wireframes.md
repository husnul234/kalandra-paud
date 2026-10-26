# Wireframes & Desain Tata Letak Antarmuka (UI/UX)
## Kalandra PAUD: Generator Perencanaan Pembelajaran Mendalam (RPM) TK

> **Fokus Desain:** Responsif multi-perangkat (Mobile Smartphone, Tablet, Desktop), Ergonomi Sentuh Guru TK, dan Tipografi Ramah Pendidikan  
> **Pendekatan UX:** Anti-Slop (Bersih, Kontras Tinggi, Form Terpandu, Bottom-Sheet pada Mobile, Split-Workspace pada Desktop)  

---

## 1. Peta Layar & Arsitektur Informasi (Site Map)

```
[ Kalandra PAUD ]
   │
   ├── [ Layar 1: Autentikasi & Seleksi Peran ]
   │     ├── Login (Email / Password)
   │     └── Registrasi Akun (Pilih Peran: Admin Satuan PAUD / Guru Kelas)
   │
   ├── [ PORTAL GURU ]
   │     ├── [ Layar 2: Dashboard Guru & Riwayat Dokumen ]
   │     ├── [ Layar 3: 4-Step RPM Generator Wizard ]
   │     │     ├── Step 1: Identitas Dokumen
   │     │     ├── Step 2: Target 8 Dimensi Profil Lulusan (DPL)
   │     │     ├── Step 3: Capaian Pembelajaran & Bahan Loose Parts
   │     │     └── Step 4: Eksekusi AI & Live Progress Engine
   │     ├── [ Layar 4: Live Table Preview & Editor ]
   │     │     ├── Tampilan Desktop (Split Table Publisher-Grade)
   │     │     └── Tampilan Mobile (Accordion Harian 18 Kegiatan)
   │     ├── [ Layar 5: BYOK API Key Manager (Modal / Bottom Sheet) ]
   │     └── [ Layar 6: Dialog Ekspor DOCX (A4 / F4) ]
   │
   └── [ PORTAL ADMIN ]
         ├── [ Layar 7: Dashboard Kepala TK / Admin ]
         ├── [ Layar 8: Manajemen Akun Guru & Kelas Binaan ]
         └── [ Layar 9: Profil Satuan PAUD & Master Data Kurikulum ]
```

---

## 2. Wireframe Layar 1: Autentikasi & Pemilihan Peran

### 2.1. Tampilan Desktop & Tablet
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│         ┌─────────────────────────────────────────────────────────────┐         │
│         │                      KALANDRA PAUD                          │         │
│         │   Perencanaan Pembelajaran Mendalam Fase Fondasi TK 2025    │         │
│         ├─────────────────────────────────────────────────────────────┤         │
│         │                                                             │         │
│         │  [ Tab: Masuk ]       [ Tab: Daftar Akun Baru ]             │         │
│         │                                                             │         │
│         │  Email Satuan / Guru:                                       │         │
│         │  [ guru.dewi@paudceria.sch.id                             ] │         │
│         │                                                             │         │
│         │  Kata Sandi:                                                │         │
│         │  [ ••••••••••••••••••                                    ]  │         │
│         │                                                             │         │
│         │  Pilih Peran Akun:                                          │         │
│         │  ┌──────────────────────────┐  ┌──────────────────────────┐ │         │
│         │  │ (•) Guru Pengajar        │  │ ( ) Admin / Creator      │ │         │
│         │  │     Menyusun RPM & DOCX  │  │     Kelola User & Sistem │ │         │
│         │  └──────────────────────────┘  └──────────────────────────┘ │         │
│         │                                                             │         │
│         │  Asal Satuan PAUD:                                          │         │
│         │  [ TK NEGERI PEMBINA 01                             ▼ ]     │         │
│         │                                                             │         │
│         │  ┌───────────────────────────────────────────────────────┐  │         │
│         │  │                [ MASUK KE WORKSPACE ]                 │  │         │
│         │  └───────────────────────────────────────────────────────┘  │         │
│         │                                                             │         │
│         │  Lupa kata sandi? Hubungi Operator Admin Sekolah            │         │
│         └─────────────────────────────────────────────────────────────┘         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2. Tampilan Mobile (< 768px)
```
┌────────────────────────────────────────┐
│  KALANDRA PAUD                         │
│  Perencanaan Pembelajaran Mendalam     │
├────────────────────────────────────────┤
│  [ Masuk ]      [ Daftar ]             │
│                                        │
│  Email:                                │
│  [ guru.dewi@paudceria.sch.id        ] │
│                                        │
│  Kata Sandi:                           │
│  [ ••••••••••••••••••                ] │
│                                        │
│  Peran:                                │
│  [ (•) Guru Kelas   ( ) Admin TK     ] │
│                                        │
│  Satuan PAUD:                          │
│  [ TK NEGERI PEMBINA 01            ▼ ] │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │             MASUK                │  │
│  └──────────────────────────────────┘  │
│                                        │
│  v1.0 • Standar Permendikdasmen 2026   │
└────────────────────────────────────────┘
```

---

## 3. Wireframe Layar 2: Dashboard Guru & Daftar Dokumen

### 3.1. Tampilan Desktop (Split View & Topbar)
```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo] KALANDRA PAUD   |   TK NEGERI PEMBINA 01      [Key: 2 Aktif (OK) 🟢] [Ibu Dewi, S.Pd. ▾] [Keluar] │
├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                       │
│  BERANDA GURU                                                                                         │
│  Kelola Dokumen Perencanaan Pembelajaran Mendalam (Fase Fondasi)                                      │
│                                                                                                       │
│  ┌───────────────────────────────────────────────┐  ┌──────────────────────────────────────────────┐  │
│  │ 📑 + BUAT PERENCANAAN MINGGUAN BARU (RPM)     │  │ 🔑 KELOLA API KEY GEMINI (BYOK)              │  │
│  │    Susun 18 kegiatan main mendalam 6 hari     │  │    2 Kunci aktif • Auto-failover siap        │  │
│  └───────────────────────────────────────────────┘  └──────────────────────────────────────────────┘  │
│                                                                                                       │
│  Daftar Perencanaan Minggu Ini & Arsip                                                               │
│  Filter: [ Semua Jenjang ▾ ]  [ Semester 1 ▾ ]   Cari: [ Cari topik/minggu...                       ] │
│                                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Judul / Topik Pembelajaran         | Kelas | Minggu | DPL Ditargetkan       | Tanggal  | Aksi   │  │
│  ├────────────────────────────────────┼───────┼────────┼───────────────────────┼──────────┼────────┤  │
│  │ Aku Istimewa: Ayo Berkenalan       | TK-A  | M-1    | DPL1, DPL2, DPL4, DPL7| 26/10/26 | [Lihat]│  │
│  │ Tubuh Sehat Ciptaan Tuhan          | TK-A  | M-2    | DPL1, DPL3, DPL7, DPL8| 19/10/26 | [Lihat]│  │
│  │ Lingkungan Sekolahku yang Asri     | TK-B  | M-3    | DPL2, DPL4, DPL5, DPL6| 12/10/26 | [Lihat]│  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2. Tampilan Mobile (< 768px)
```
┌────────────────────────────────────────┐
│ ☰ KALANDRA PAUD       [🔑 2] [Dewi ▾]  │
├────────────────────────────────────────┤
│ Halo, Bu Dewi! 👋                     │
│ Kelas Binaan: TK Kelompok A (4-5 Thn)  │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │  + BUAT PERENCANAAN BARU (RPM)     │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Riwayat Dokumen RPM (3 Dokumen):       │
│ ┌────────────────────────────────────┐ │
│ │ 📄 Aku Istimewa: Ayo Berkenalan    │ │
│ │ TK-A • Minggu 1 • Semester 1       │ │
│ │ DPL: Keimanan, Kreativitas, Sehat  │ │
│ │ [Buka & Edit]       [Unduh DOCX]   │ │
│ └────────────────────────────────────┘ │
│ ┌────────────────────────────────────┐ │
│ │ 📄 Tubuh Sehat Ciptaan Tuhan       │ │
│ │ TK-A • Minggu 2 • Semester 1       │ │
│ │ [Buka & Edit]       [Unduh DOCX]   │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 🔑 Status Kunci: 2 Siap (Gemini)   │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## 4. Wireframe Layar 3: 4-Step Document Generator Wizard

### 4.1. Step 1: Identitas Dokumen
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ LANGKAH 1 DARI 4: IDENTITAS DOKUMEN                                             │
│ [ (1) Identitas ] ─── [ (2) 8 DPL ] ─── [ (3) CP & Catatan ] ─── [ (4) Generate]│
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Nama Guru Pengajar:                  Asal Satuan PAUD:                         │
│  [ Dewi Sartika, S.Pd.              ] [ TK NEGERI PEMBINA 01                  ] │
│                                                                                 │
│  Jenjang / Kelompok Usia:             Semester:                                 │
│  [ (•) Kelompok A (4-5 Tahun)       ] [ (•) 1 (Gasal)                           │
│  [ ( ) Kelompok B (5-6 Tahun)       ] [ ( ) 2 (Genap)                           │
│                                                                                 │
│  Minggu Ke-:        Bulan & Tahun:            Alokasi Waktu:                    │
│  [ 1             ]  [ Juli 2026             ] [ 6 x 3 JP (6 Hari Sekolah)     ▼]│
│                                                                                 │
│  Model Pembelajaran:                  Jumlah Peserta Didik:                     │
│  [ Sentra (Sentra Balok & Seni)   ▼ ] [ 15 Anak                               ] │
│                                                                                 │
│  Topik & Sub Topik Pembelajaran:                                                │
│  [ Identitas / Diriku (Aku Istimewa: Ayo Kita Berkenalan)                     ] │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                [ Lanjut ke Langkah 2: DPL ➔] │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Step 2: Target 8 Dimensi Profil Lulusan (DPL Permendikdasmen 10/2025)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ LANGKAH 2 DARI 4: TARGET 8 DIMENSI PROFIL LULUSAN (DPL)                         │
│ [ (✓) Identitas ] ─── [ (2) 8 DPL ] ─── [ (3) CP & Catatan ] ─── [ (4) Generate]│
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Pilihlah Dimensi Profil Lulusan yang ditargetkan untuk minggu ini:             │
│  (Dimensi terpilih otomatis disinkronkan ke label 18 kegiatan & asesmen akhir)  │
│                                                                                 │
│  [✓] DPL1: Keimanan & Ketakwaan terhadap Tuhan YME                              │
│      Fokus: Mengenal Tuhan melalui ciptaan-Nya, doa berkesadaran, bersyukur.     │
│                                                                                 │
│  [✓] DPL2: Kewargaan                                                            │
│      Fokus: Identitas diri, keluarga, sekolah, menghargai perbedaan teman.      │
│                                                                                 │
│  [ ] DPL3: Penalaran Kritis                                                     │
│      Fokus: Mengamati perubahan benda, bertanya, sebab-akibat sederhana.        │
│                                                                                 │
│  [✓] DPL4: Kreativitas                                                          │
│      Fokus: Eksplorasi media loose parts, seni orisinal, imajinasi bebas.       │
│                                                                                 │
│  [✓] DPL5: Kolaborasi                                                           │
│      Fokus: Bermain bersama, berbagi alat main, menunggu giliran, kerja tim.   │
│                                                                                 │
│  [ ] DPL6: Kemandirian                                                          │
│      Fokus: Memilih mainan, bina diri dasar, merapikan kembali alat main.       │
│                                                                                 │
│  [✓] DPL7: Kesehatan                                                            │
│      Fokus: Motorik kasar & halus aktif, cuci tangan, makanan sehat, aman.      │
│                                                                                 │
│  [✓] DPL8: Komunikasi                                                           │
│      Fokus: Menyimak cerita, bercerita kembali, kata santun, keaksaraan awal.   │
│                                                                                 │
│  DPL Terpilih: 6 dari 8 Dimensi (Optimal & Seimbang)                            │
│                                                                                 │
│  ┌───────────────────────────────────┐     ┌─────────────────────────────────┐  │
│  │ [ ⬅ Kembali ke Identitas ]        │     │ [ Lanjut ke Capaian Belajar ➔ ] │  │
│  └───────────────────────────────────┘     └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3. Step 3: Capaian Pembelajaran Resmi & Catatan Konteks Loose Parts
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ LANGKAH 3 DARI 4: CAPAIAN PEMBELAJARAN (BSKAP 046/2025) & KONTEKS LOKAL         │
│ [ (✓) Identitas ] ─── [ (✓) 8 DPL ] ─── [ (3) CP & Catatan ] ─── [ (4) Generate]│
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Pilih Subelemen CP Resmi (Teks akan disalin verbatim anti-halusinasi):         │
│                                                                                 │
│  ▼ ELEMEN 1: NILAI AGAMA DAN BUDI PEKERTI                                       │
│    [✓] NABP-1: Murid percaya kepada Tuhan YME sebagai pencipta dirinya...      │
│    [ ] NABP-2: Murid menjaga kebersihan, kesehatan, dan keselamatan diri...     │
│                                                                                 │
│  ▼ ELEMEN 2: JATI DIRI                                                          │
│    [✓] JD-1: Mengenali identitas diri (fisik, minat, sosial budaya)...          │
│    [✓] JD-2: Mengenali perannya dalam keluarga & satuan pendidikan...           │
│                                                                                 │
│  ▼ ELEMEN 3: DASAR LITERASI, MATEMATIKA, SAINS, TEKNOLOGI, REKAYASA & SENI      │
│    [✓] LMSTRS-7: Mengeksplorasi dan mengekspresikan pikiran melalui seni...     │
│                                                                                 │
│  Catatan Konteks Bahan Loose Parts & Karakteristik Lokal Sekolah:               │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ Di sekolah banyak daun mangga kering, kardus bekas susu, piring kertas,   │  │
│  │ dan tutup botol warna-warni. Anak-anak sangat suka bernyanyi dan gerak.   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌───────────────────────────────────┐     ┌─────────────────────────────────┐  │
│  │ [ ⬅ Kembali ke DPL ]              │     │ [ Siap Generate dengan AI 🚀 ]  │  │
│  └───────────────────────────────────┘     └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.4. Step 4: Live Progress Engine & Eksekusi AI
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ MEMPROSES DOKUMEN PERENCANAAN MENDALAM 1 MINGGU...                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                    [   ██████████████████████░░░░░░░░░░   ] 68%                 │
│                                                                                 │
│  Status Alur:                                                                   │
│  [✓] 1. Merakit prompt regulasi resmi (Permendikdasmen 10/2025 & 1/2026)        │
│  [✓] 2. Menghubungkan Gemini API (Pool Key #1: ...4f89)                         │
│  [🔄] 3. Menyusun 18 Kegiatan Main (Memahami H1-H2, Mengaplikasi H3-H4...)      │
│  [ ] 4. Validasi sinkronisasi 6 DPL ke kegiatan harian                          │
│  [ ] 5. Menyusun tabel asesmen dan pratinjau siap cetak                         │
│                                                                                 │
│  Model Digunakan: gemini-3.6-flash  •  Estimasi Selesai: 12 detik               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Wireframe Layar 4: Live Table Preview & In-Place Editor

### 5.1. Tampilan Desktop: Split Screen (Toolbar Atas + Format Resmi)
```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [⬅ Kembali ke Draft]  DOKUMEN RPM MINGGU 1 - KELOMPOK A   [🟢 6 DPL Sinkron] [✏️ Edit Teks] [📥 Unduh DOCX]│
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                             PERENCANAAN PEMBELAJARAN MENDALAM                                     │  │
│  │                          TK NEGERI PEMBINA 01 - TAHUN AJARAN 2026                                 │  │
│  ├───────────────────────────────────────────────────────────────────────────────────────────────────┤  │
│  │ Guru: Dewi Sartika, S.Pd.    | Jenjang: TK-A (4-5 Thn) | Semester: 1 (Gasal) | Minggu: 1 (Juli)    │  │
│  │ Topik: Identitas / Diriku    | Model: Sentra           | Alokasi: 6 x 3 JP   | Jumlah: 15 Anak    │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
│  1. IDENTIFIKASI                                                                                        │
│  ┌──────────────────────┬────────────────────────────────────────────────────────────────────────────┐  │
│  │ Peserta Didik        │ Anak usia 4-5 tahun memiliki rentang perhatian 10-15 menit, aktif...       │  │
│  ├──────────────────────┼────────────────────────────────────────────────────────────────────────────┤  │
│  │ Materi Pelajaran     │ Pengetahuan Esensial: Konsep nama dan keluarga... Nilai: Saling sayang...  │  │
│  ├──────────────────────┼────────────────────────────────────────────────────────────────────────────┤  │
│  │ Dimensi Profil       │ [v] Keimanan  [v] Kewargaan  [ ] Nalar Kritis  [v] Kreativitas             │  │
│  │ Lulusan (DPL)        │ [v] Kolaborasi  [ ] Mandiri  [v] Kesehatan    [v] Komunikasi               │  │
│  └──────────────────────┴────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
│  2. DESAIN PEMBELAJARAN                                                                                 │
│  ┌──────────────────────┬────────────────────────────────────────────────────────────────────────────┐  │
│  │ Capaian Pembelajaran │ • Murid percaya kepada Tuhan YME sebagai pencipta dirinya... (NABP-1)      │  │
│  │                      │ • Mengenali identitas dirinya yang terbentuk oleh karakteristik... (JD-1)  │  │
│  ├──────────────────────┼────────────────────────────────────────────────────────────────────────────┤  │
│  │ Tujuan Pembelajaran  │ 1. Anak mampu mengenali dan menyebutkan nama anggota keluarga intinya...   │  │
│  │                      │ 2. Anak mampu berkolaborasi membuat boneka jari dengan bahan loose parts...│  │
│  └──────────────────────┴────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
│  3. PENGALAMAN BELAJAR (INTI 6 HARI - SIKLUS PEMBELAJARAN MENDALAM)                                     │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ TAHAP 1: MEMAHAMI (BERKESADARAN, BERMAKNA) - HARI 1 DAN HARI 2                                    │  │
│  ├───────────────────────────────────────────────────────────────────────────────────────────────────┤  │
│  │ HARI 1:                                                                                           │  │
│  │ • Kegiatan 1: Membuat Boneka Jari Keluarga (berkesadaran, bermakna, kreativitas)                  │  │
│  │   Alat/Bahan: Kertas karton, stik es krim, lem, cat warna, gunting anak.                          │  │
│  │   Cara Membuat: Menjiplak tangan di karton, menggambar keluarga, pasang stik es krim.             │  │
│  │ • Kegiatan 2: Lingkaran Nama (menggembirakan, kolaborasi)                                         │  │
│  │   Alat/Bahan: Bola busa lembut.                                                                   │  │
│  │   Cara Bermain: Menggelindingkan bola melingkar sambil menyebutkan nama teman.                    │  │
│  │ • Kegiatan 3: Cerita Berantai Siapa Aku (bermakna, komunikasi)                                    │  │
│  │   Alat/Bahan: Boneka tangan beruang.                                                              │  │
│  │   Cara Bermain: Bercerita bergantian menyebutkan hal yang disukai.                                │  │
│  ├───────────────────────────────────────────────────────────────────────────────────────────────────┤  │
│  │ TAHAP 2: MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN) - HARI 3 DAN HARI 4                │  │
│  ├───────────────────────────────────────────────────────────────────────────────────────────────────┤  │
│  │ TAHAP 3: MEREFLEKSI (BERKESADARAN, BERMAKNA) - HARI 5 DAN HARI 6                                  │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2. Tampilan Mobile: Accordion Mode (< 768px)
```
┌────────────────────────────────────────┐
│ ⬅ RPM Minggu 1 (TK-A)      [📥 DOCX]   │
├────────────────────────────────────────┤
│ [ Tab: Ringkasan ]  [ Tab: 18 Kegiatan]│
│                                        │
│ ▼ TAHAP MEMAHAMI (Hari 1 & 2)          │
│   ┌──────────────────────────────────┐ │
│   │ ▶ HARI 1 (3 Kegiatan Bermain)    │ │
│   │   1. Boneka Jari Keluarga (Seni) │ │
│   │   2. Lingkaran Nama (Motorik)    │ │
│   │   3. Cerita Siapa Aku (Bahasa)   │ │
│   │   [Ketuk untuk rincian cara buat]│ │
│   └──────────────────────────────────┘ │
│   ┌──────────────────────────────────┐ │
│   │ ▶ HARI 2 (3 Kegiatan Bermain)    │ │
│   └──────────────────────────────────┘ │
│                                        │
│ ▶ TAHAP MENGAPLIKASI (Hari 3 & 4)      │
│ ▶ TAHAP MEREFLEKSI (Hari 5 & 6)        │
│ ▶ ASESMEN (Awal, Proses, Akhir)        │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 🟢 Seluruh 6 DPL Terverifikasi     │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 📥 DOWNLOAD DOKUMEN WORD (.DOCX)   │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## 6. Wireframe Layar 5: BYOK API Key Manager (Modal & Bottom Sheet)

### 6.1. Tampilan Modal (Desktop) & Bottom Sheet (Mobile)
```
┌────────────────────────────────────────────────────────────────────────┐
│  🔑 Kelola Kunci Google Gemini API (BYOK Pooling)             [ ✕ ]    │
├────────────────────────────────────────────────────────────────────────┤
│  Kunci API Anda tersimpan aman dan terenkripsi untuk akun Anda saja.   │
│  Sistem otomatis beralih jika sebuah kunci terkena batas kuota (429).  │
│                                                                        │
│  Daftar Kunci Aktif:                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 1. Akun Google Pribadi (AI Studio)             [🟢 Aktif]        │  │
│  │    AIzaSy...4f89 • Terakhir digunakan: 2 menit lalu              │  │
│  │    [Test Koneksi]                              [🗑️ Hapus]        │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ 2. Akun Sekolah Cadangan                       [🟢 Aktif]        │  │
│  │    AIzaSy...9x12 • Terakhir digunakan: Kemarin                   │  │
│  │    [Test Koneksi]                              [🗑️ Hapus]        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  + Tambah Kunci Gemini Baru:                                           │
│  Label Kunci:                                                          │
│  [ Akun Google Gmail Cadangan                                        ] │
│  API Key:                                                              │
│  [ AIzaSyD983kjhsdkfjhsd98f7ysdfhskjdfhkj                            ] │
│                                                                        │
│  ℹ️ Belum punya kunci API?                                             │
│  [Dapatkan API Key Gratis di Google AI Studio (Buka di tab baru ↗)]    │
│                                                                        │
│  ┌───────────────────────────────────┐     ┌────────────────────────┐  │
│  │ [ Batal ]                         │     │ [ Simpan & Uji Kunci ] │  │
│  └───────────────────────────────────┘     └────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Wireframe Layar 6: Dialog Ekspor DOCX Siap Cetak

```
┌────────────────────────────────────────────────────────────────────────┐
│  📥 Ekspor Perencanaan Pembelajaran Mendalam (.docx)          [ ✕ ]    │
├────────────────────────────────────────────────────────────────────────┤
│  Dokumen akan dikompilasi ke format resmi Microsoft Word siap cetak.  │
│                                                                        │
│  Ukuran Kertas Resmi:                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ (•) A4 Standard (210 x 297) │  │ ( ) F4 / Folio (215 x 330 mm)   │  │
│  │     Format Umum Administrasi│  │     Format Standar Dinas Daerah │  │
│  └─────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                        │
│  Pengaturan Tambahan:                                                  │
│  [✓] Sertakan Kolom Pengesahan Tanda Tangan (Kepala TK & Guru Kelas)   │
│  [✓] Atur Tabel Anti-Terbelah (cantSplit) & Ulangi Header Halaman      │
│  [✓] Cantumkan Penomoran "Halaman X dari Y" di Footer                  │
│                                                                        │
│  Nama Berkas:                                                          │
│  [ RPM_Minggu_1_TK_A_Aku_Istimewa_Dewi_Sartika.docx                  ] │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │             [ 📥 DOWNLOAD BERKAS .DOCX SEKARANG ]                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Wireframe Layar 7: Portal Creator / Superadmin Platform (Pengelola Aplikasi)

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo] KALANDRA PAUD   |   KONSOL CREATOR & SUPERADMIN PLATFORM          [Admin Creator ▾]  [Keluar]  │
├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                       │
│  PANEL MANAJEMEN PLATFORM GENERATOR RPP PAUD                                                          │
│  Kelola Pengguna Aplikasi (Guru), Status Lisensi/Akses, dan Konfigurasi Master Prompt AI             │
│                                                                                                       │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────────┐  │
│  │ Total Guru Terdaftar  │  │ Total RPM Digenerate  │  │ Sekolah Terwakili     │  │ Status Engine  │  │
│  │       48 Pengguna     │  │       312 Dokumen     │  │      23 Satuan PAUD   │  │   Semua Normal 🟢│
│  └───────────────────────┘  └───────────────────────┘  └───────────────────────┘  └────────────────┘  │
│                                                                                                       │
│  Manajemen Pengguna Aplikasi (Guru Pendidik):                                                         │
│  Cari Guru / Email / Sekolah: [ Cari pengguna...                                            ] [+ User]│
│                                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Nama Pengajar        | Email / Kontak            | Asal Satuan PAUD      | Status | RPM | Aksi  │  │
│  ├──────────────────────┼───────────────────────────┼───────────────────────┼────────┼─────┼───────┤  │
│  │ Dewi Sartika, S.Pd.  | dewi@paudceria.sch.id     | TK Negeri Pembina 01  | [Aktif]|  14 | [Ubah]│  │
│  │ Siti Aminah, S.Pd.   | aminah.tk@gmail.com       | TK Islam Al-Falah     | [Aktif]|  22 | [Ubah]│  │
│  │ Rina Marlina, S.Pd.  | rina.marlina@yahoo.co.id  | TK Bintang Harapan    | [Aktif]|   9 | [Ubah]│  │
│  │ Budi Santoso, S.Pd.  | budi.tkpertiwi@gmail.com  | TK Pertiwi 02         | [Nonak]|   1 | [Ubah]│  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                       │
│  [ Kelola Master Prompt Kurikulum ]   [ Monitor Log Generasi AI & Kuota ]   [ Ekspor Rekap Pengguna ] │
│                                                                                                       │
│  *(Catatan Roadmap: Peran tambahan 'Admin Sekolah/Kepala TK' akan hadir pada update multi-tenant)*    │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
