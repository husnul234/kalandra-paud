# Design System & UI Engineering Guidelines
## Kalandra PAUD: Generator Perencanaan Pembelajaran Mendalam (RPM) TK

> **Acuan Standar:** `.agents/skills/design-taste-frontend/SKILL.md` (Anti-Slop Frontend Standard)  
> **Karakter UI Aktual:** *Royal Plum & Warm Peach Educational Palette* — Memadukan kehangatan dunia PAUD yang ramah anak dengan keteraturan formal standar kementerian.  
> **Status Sinkronisasi:** **100% Selaras** dengan implementasi kode riil (`src/index.css`, `src/App.tsx`, `src/components/*`)

---

## 1. Filosofi Desain & The Three Dials

### 1.1. One-Line Design Read
> *"Educational productivity web application for Indonesian early childhood educators (Guru TK & KB) and school administrators, with a warm, joyful, trustworthy, and professional educational language, powered by Tailwind CSS v4 + Plus Jakarta Sans + Royal Plum & Warm Peach palette + restrained tactile micro-interactions."*

### 1.2. Konfigurasi Tiga Indikator (The Three Dials)
* **`DESIGN_VARIANCE: 7` (High-Distinctive)**:  
  Menghilangkan kesan aplikasi AI generik ("AI-Purple / Cyberpunk"). Memadukan wibawa formulir administratif resmi kementerian (Permendikdasmen No. 10/2025 & No. 1/2026) dengan kartu interaktif bertema PAUD yang ceria, hangat, dan ramah sentuhan.
* **`MOTION_INTENSITY: 5` (Restrained Tactile)**:  
  Transisi antar-langkah wizard yang halus (`duration-200 ease-out`), umpan balik taktil pada tombol (`active:scale-[0.98]`), drawer bottom-sheet mobile yang alami, partikel confetti pada saat dokumen selesai dirumuskan, serta penghormatan penuh terhadap `prefers-reduced-motion`.
* **`VISUAL_DENSITY: 4` (Comfortable Educational Ergonomics)**:  
  Area sentuh lega (*breathable padding*), bidang input lapang dengan ukuran target sentuh minimal 44x44px (memudahkan guru mengisi data di smartphone saat di kelas), serta simulator meja kerja dokumen (*Desk Canvas*) berkontras tinggi.

---

## 2. Fondasi Token Warna Riil (Real Color System)

Aplikasi Kalandra PAUD mengimplementasikan palet warna terkurasi khas **Color Hunt Royal Plum & Warm Peach** yang dideklarasikan langsung di `src/index.css`:

### 2.1. Variabel CSS Root (`src/index.css`)
```css
:root {
  /* Color Hunt Palette: #522D60, #80426E, #F2A67B, #FFD38B */
  --color-plum-dark: #522D60;
  --color-plum-mauve: #80426E;
  --color-peach-coral: #F2A67B;
  --color-honey-gold: #FFD38B;

  --color-surface: #FFFFFF;
  --color-canvas: #FAF7FB;
  --color-border: #EFE6F2;
  --color-border-strong: #D9C5DD;
  --color-text-main: #2A1532;
  --color-text-muted: #74607B;
}
```

### 2.2. Matriks Token Warna & Peran Antarmuka
| Token Token Class | Hex Code | Peran & Penggunaan Riil di Codebase |
| :--- | :--- | :--- |
| **Plum Dark** (`.bg-plum-900`) | `#522D60` | Warna brand utama, tombol CTA primer, stepper langkah aktif, header modal, seleksi teks (`selection:bg-[#522D60]`) |
| **Deep Aubergine** | `#2A1532` | Teks heading utama (H1/H2), logo container, background badge gelap, teks navigasi utama |
| **Plum Hover** (`.hover:bg-plum-800`) | `#693774` | State hover tombol CTA primer |
| **Mauve Plum** (`.bg-plum-700`) | `#80426E` | Ikon fitur, sub-judul modul, border ring fokus, lencana jenjang sekolah |
| **Plum Accent Soft** (`.bg-plum-600`)| `#9C5586` | Gradien aksen sekunder tombol eksekusi AI & banner promo |
| **Plum Light Tint** (`.bg-plum-50`) | `#FAF3FB` | Latar stepper nav, navbar desktop pill container, form card background |
| **Plum Hover Tint** (`.bg-plum-100`) | `#F4E8F6` | State hover pada pill navbar dan dropdown menu profil |
| **Canvas Background** | `#FAF7FB` | Background utama seluruh halaman web (body app & landing) |
| **Surface White** | `#FFFFFF` | Background kartu formulir, navbar atas, modal dialog, sheet kertas |
| **Border Soft** | `#EFE6F2` | Garis batas navbar sticky, footer, dan kartu konten utama |
| **Border Mid** (`.border-plum-200`) | `#E8D6EB` | Garis pembatas kartu kontrol formulir dan logo container |
| **Border Strong** (`.border-plum-300`) | `#D8C3DD` | Border input form aktif, scrollbar thumb, dan outline modal |
| **Text Muted** | `#74607B` | Paragraf penjelas, deskripsi sub-label, dan metadata dokumen |
| **Peach Coral** (`.bg-peach-500`) | `#F2A67B` | Gradien aksen hero landing page, tag highlight, dan elemen visual ceria |
| **Peach Light** (`.bg-peach-50`) | `#FEF8F5` | Background aksen kartu tips edukasi dan banner pengumuman |
| **Peach Text** (`.text-peach-700`) | `#C9602A` | Teks aksen peach kontras tinggi |
| **Honey Gold** (`.bg-honey-500`) | `#FFD38B` | Lencana PRO, bintang ikon rekomendasi AI, aksen visual apresiasi |
| **Honey Light** (`.bg-honey-50`) | `#FFFBF2` | Background banner status pool sistem dan kartu peringatan ringan |
| **Emerald Success** | `#059669` / `#10B981` | Tombol Ekspor Word (.docx), status koneksi API aktif, banner sukses |
| **Amber Warning** | `#F59E0B` / `#D97706` | Tombol mode 'Edit Cepat' aktif, peringatan kuota tiket revisi |
| **Rose Error** | `#EF4444` / `#DC2626` | Pesan validasi gagal, proteksi route guard admin yang tidak sah |

### 2.3. Dual-World Visual Strategy (App Shell vs. Document Paper Simulator)
Aplikasi Kalandra PAUD memisahkan dua pengalaman visual secara tegas dan harmonis:
1. **Dunia App Shell (Modern SaaS PAUD):**
   * Menggunakan palet **Royal Plum (`#522D60`, `#80426E`, `#FAF3FB`)** dan **Warm Peach (`#F2A67B`)** untuk navigasi, formulir wizard, kartu konfigurasi admin, modal berlangganan, dan drawer asisten chat.
2. **Dunia Simulasi Dokumen Cetak (Office Paper Simulator):**
   * Berada di dalam kanvas meja kerja abu-abu (`bg-slate-300/80 p-3 sm:p-8 rounded-2xl border border-slate-300 shadow-inner`).
   * Lembar kertas putih bersih (`bg-white shadow-2xl border border-slate-300`) menggunakan warna **Biru Dinas Kemendikdasmen (`#1E3A8A` / `#1E40AF`)** untuk judul tabel dan seksi regulasi resmi, mereplikasi 100% tampilan fisik dokumen Microsoft Word asli yang siap diperiksa pengawas.

---

## 3. Sistem Tipografi (Typography System)

Kalandra menggunakan arsitektur 3 jenis keluarga huruf (*font families*) yang disesuaikan dengan konteks kegunaannya:

### 3.1. Font Antarmuka Aplikasi (Web UI)
* **Keluarga Huruf**: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;`
* **Karakter**: Geometris, ramah, sangat mudah dibaca pada layar kecil ponsel guru, dan memiliki bobot font yang lengkap (Regular 400, Medium 500, SemiBold 600, Bold 700, Black 900).
* **Penerapan**: Seluruh navigasi, kartu wizard, formulir, teks tombol, modal, dan drawer obrolan.

### 3.2. Font Monospace & Kunci (Data Monospace)
* **Keluarga Huruf**: `'JetBrains Mono', monospace;`
* **Karakter**: Karakter mono presisi tinggi untuk data teknis dan angka kuota.
* **Penerapan**: ID dokumen (`rpm-1729...`), masking kunci API (`sk-qwen-3c1b...`), kode indikator CP (`JD-1`, `STEAM-3`), dan persentase zoom (`100%`).

### 3.3. Font Dokumen Cetak (DOCX & True-WYSIWYG Replica)
* **Keluarga Huruf**: `'Calibri', Arial, sans-serif;`
* **Karakter**: Standar default resmi Microsoft Office Word instansi pendidikan Indonesia.
* **Penerapan**: Diterapkan langsung pada lembar kertas pratinjau (`LiveTablePreview.tsx` dan `LampiranTrueWysiwygPreview.tsx`) serta diinjeksikan saat ekspor `.docx`.
* **Ukuran Resmi**: `13.5px` (setara 11pt di Word) dengan `leading-relaxed` (1.15 line spacing) untuk kenyamanan baca pengawas sekolah.

### 3.4. Skala Tipografi Riil di Kode
```
┌─────────────────┬─────────────────────────────────────────────────────────────┐
│ Level Hirarki   │ Definisi Tailwind Class Riil                                │
├─────────────────┼─────────────────────────────────────────────────────────────┤
│ Hero H1         │ text-3xl sm:text-5xl lg:text-6xl font-black text-[#2A1532] │
│                 │ tracking-tight leading-[1.15]                               │
│ Section Title H2│ text-xl sm:text-2xl font-black text-[#2A1532] tracking-tight│
│ Card Header H3  │ text-base sm:text-lg font-extrabold text-[#2A1532]          │
│ Subheading H4   │ text-xs sm:text-sm font-bold text-[#2A1532]                │
│ Body Text       │ text-xs sm:text-sm text-[#74607B] leading-relaxed           │
│ Small / Help    │ text-[11px] sm:text-xs text-[#74607B]                       │
│ Caption / Pill  │ text-[10px] sm:text-[11px] font-black uppercase             │
│ Document Title  │ text-lg sm:text-xl font-bold text-[#1E3A8A] font-['Calibri']│
└─────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 4. Spasi, Elevasi, dan Radius Sudut (Shape & Elevation Lock)

### 4.1. Konsistensi Radius Sudut (Shape Consistency Lock)
Untuk mempertahankan karakter ramah anak dan modern, Kalandra mengunci nilai radius sudut sebagai berikut:
* **Kartu Besar, Container, dan Modal Dialog**: `rounded-2xl` (16px) hingga `rounded-3xl` (24px).
* **Input Formulir, Dropdown, dan Textarea**: `rounded-xl` (12px).
* **Tombol Toolbar & Tombol Aksi**: `rounded-xl` (12px).
* **Tombol CTA Hero Utama**: `rounded-2xl` (16px).
* **Avatar & Logo Box**: `rounded-xl` atau `rounded-2xl`.
* **Lencana Status, Tag, dan Pill**: `rounded-full` (9999px).

### 4.2. Sistem Elevasi & Shadow
* **`shadow-xs` / `shadow-2xs`**: Digunakan untuk kartu ringkas, tombol toolbar biasa, dan border subtle.
* **`shadow-md shadow-[#522D60]/20`**: Digunakan untuk tombol primer Plum guna memberikan kedalaman warna yang khas.
* **`shadow-xl` / `shadow-2xl`**: Digunakan untuk modal dialog melayang dan lembar kertas dokumen cetak di atas kanvas abu-abu.
* **`backdrop-blur-md`**: Digunakan pada navigasi sticky atas (`bg-white/95`) dan sticky action toolbar pratinjau dokumen.

---

## 5. Arsitektur Komponen UI Riil (Component Blueprint)

### 5.1. Tombol (Button Tokens)

#### 1. Primary Brand Button (Simpan / Lanjut Wizard / Aksi Utama)
```html
<button class="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
  <Sparkles class="w-4 h-4 text-[#FFD38B]" />
  <span>Lanjutkan ke Langkah Berikutnya</span>
  <ChevronRight class="w-4 h-4" />
</button>
```

#### 2. Success Action (Ekspor Dokumen Word .docx)
```html
<button class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer">
  <FileDown class="w-4 h-4" />
  <span>Ekspor RPM (.docx)</span>
</button>
```

#### 3. Exclusive PRO Action (Asisten Revisi via Chat)
```html
<button class="px-3.5 py-2 bg-gradient-to-r from-[#522D60] to-[#80426E] hover:from-[#693774] hover:to-[#964E81] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 border border-amber-400/40 shadow-xs active:scale-[0.98] cursor-pointer">
  <Sparkles class="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
  <span>Revisi via Chat</span>
  <span class="text-[10px] bg-amber-400 text-[#2A1532] px-1.5 py-0.2 rounded-full font-black">PRO</span>
</button>
```

#### 4. Inline Edit Toggle Button (Mode Edit Cepat Lembar Kertas)
```html
<!-- State Nonaktif -->
<button class="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all shadow-xs cursor-pointer">
  <Edit3 class="w-3.5 h-3.5" />
  <span>Edit Cepat</span>
</button>

<!-- State Aktif (Menyala Amber) -->
<button class="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-amber-500 text-white border border-amber-600 shadow-md ring-2 ring-amber-300 transition-all cursor-pointer">
  <Edit3 class="w-3.5 h-3.5" />
  <span>Selesai Edit</span>
</button>
```

#### 5. Secondary Ghost Action (Kembali / Batal)
```html
<button class="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5">
  <ChevronLeft class="w-4 h-4" />
  <span>Kembali</span>
</button>
```

### 5.2. Kontrol Formulir & Input Ergonomis
* **Label Eksplisit**:
  ```html
  <label class="block text-xs font-bold text-[#2A1532] uppercase tracking-wider mb-1.5">
    Topik & Subtopik Pembelajaran:
  </label>
  ```
* **Text Input & Select Dropdown**:
  ```html
  <input 
    type="text" 
    class="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-[#2A1532] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#80426E] transition-all" 
  />
  ```
* **Target Sentuh Mobile**: Tinggi seluruh elemen input selalu $\ge 44\text{px}$ untuk kenyamanan pengetikan di layar smartphone.

### 5.3. Stepper Langkah Wizard (`RpmWizard.tsx`)
Stepper 4 langkah menampilkan nomor tahapan, nama, dan ringkasan langkah:
* **Langkah Selesai**: Lingkaran hijau `bg-emerald-600 text-white` dengan ikon `Check`.
* **Langkah Aktif**: Lingkaran Plum `bg-[#522D60] text-white ring-4 ring-[#FAF3FB]`.
* **Langkah Mendatang**: Lingkaran netral `bg-slate-100 text-[#74607B]`.
* **Versi Mobile**: Menggunakan ringkasan terpusat (*"Langkah X dari 4: [Nama Langkah]"*) untuk menghemat tinggi layar ponsel.

### 5.4. Selektor Interaktif 8 DPL & Subelemen CP
```html
<!-- Kartu Seleksi DPL -->
<label class="flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
  isSelected 
    ? 'border-[#522D60] bg-[#FAF3FB] ring-1 ring-[#522D60] shadow-xs' 
    : 'border-slate-200 bg-white hover:border-slate-300'
}">
  <input type="checkbox" checked={isSelected} class="w-4 h-4 rounded text-[#522D60] mt-1 cursor-pointer" />
  <div>
    <div class="font-bold text-[#2A1532] text-sm">DPL4: Kreativitas</div>
    <div class="text-xs text-[#74607B] mt-1 leading-relaxed">Eksplorasi loose parts, imajinasi mandiri...</div>
  </div>
</label>
```

### 5.5. Pil Material Lepasan (Loose Parts Selection Pills)
```html
<!-- Pill Belum Terpilih -->
<button class="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all flex items-center gap-1.5">
  Piring kertas & gelas kertas
</button>

<!-- Pill Terpilih -->
<button class="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 transition-all flex items-center gap-1.5 shadow-xs">
  <Check class="w-3.5 h-3.5 text-amber-700" />
  Piring kertas & gelas kertas
</button>

<!-- Pill Kustom Guru (Dengan tombol hapus) -->
<span class="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-200 text-amber-950 border border-amber-400 flex items-center gap-1.5 shadow-xs">
  <Check class="w-3.5 h-3.5 text-amber-800" />
  Cangkang kerang pantai
  <button class="ml-0.5 p-0.5 hover:bg-amber-300 rounded-full text-amber-900"><X class="w-3 h-3" /></button>
</span>
```

---

## 6. Arsitektur True-WYSIWYG Desk Simulator (`LiveTablePreview.tsx`)

Pratinjau dokumen di Kalandra didesain seperti lembaran kertas nyata di atas meja kerja:

```
┌────────────────────────────────────────────────────────────────────────┐
│             CANVAS MEJA KERJA ABU-ABU (bg-slate-300/80)                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │       LEMBAR KERTAS PUTIH RESMI (bg-white shadow-2xl)          │   │
│   │       Font: 'Calibri', Arial, sans-serif (13.5px / 11pt)       │   │
│   │                                                                │   │
│   │   [Header Kanan Word] Satuan PAUD — Perencanaan Pembelajaran...│   │
│   │                                                                │   │
│   │   PERENCANAAN PEMBELAJARAN MENDALAM (RPM)                      │   │
│   │   SATUAN PENDIDIKAN — FASE FONDASI (Text: #1E3A8A)             │   │
│   │                                                                │   │
│   │   ┌────────────────────────────────────────────────────────┐   │   │
│   │   │ TABEL 1: IDENTIFIKASI KELAS (Permendikdasmen 10/2025)  │   │   │
│   │   ├────────────────────────────────────────────────────────┤   │   │
│   │   │ TABEL 2: DESAIN PEMBELAJARAN (CP Verbatim BSKAP 046)   │   │   │
│   │   ├────────────────────────────────────────────────────────┤   │   │
│   │   │ TABEL 3: PENGALAMAN BELAJAR INTI 6 HARI (18 KEGIATAN)  │   │   │
│   │   ├────────────────────────────────────────────────────────┤   │   │
│   │   │ TABEL 4: ASESMEN PERKEMBANGAN ANAK (Taksonomi SOLO)    │   │   │
│   │   └────────────────────────────────────────────────────────┘   │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.1. Fitur Utama Simulator Pratinjau
1. **Interactive Zoom Engine**: Skala pratinjau dinamis (75%, 85%, 90%, 100%, 110%, 125%) dikontrol lewat toolbar menggunakan CSS `transform: scale(...)`.
2. **Document View Tabs Switcher**:
   * *Dokumen Utama (RPM 1 Minggu)*
   * *4 Lampiran Observasi Siap Cetak* (Catatan Anekdot, Matriks SOLO, Hasil Karya, Foto Berseri)
   * *Lihat Semua (Full Package)*
3. **Inline Quick Edit Mode**: Memanfaatkan atribut HTML5 `contentEditable={true}` berpadu dengan border aksen amber (`ring-4 ring-amber-400/50`) sehingga guru dapat langsung merevisi teks tabel sebelum dicetak.
4. **Print Optimization (`@media print`)**: Pengaturan CSS cetak yang menyembunyikan seluruh navbar, toolbar aksi, dan latar meja kerja, sehingga printer browser hanya mencetak lembar kertas putih murni tanpa terpotong (*page-break friendly*).

---

## 7. Asisten Revisi AI Chat Drawer (`DocumentRevisionChatDrawer.tsx`)

Sebagai fitur eksklusif Paket PRO, asisten revisi berbasis AI dirancang dengan sistem drawer meluncur:
* **Desktop**: Meluncur anggun dari tepi kanan layar (*slide-over drawer*) dengan lebar tetap 460px.
* **Mobile**: Membuka penuh sebagai *bottom-sheet* modal agar area pengetikan nyaman di layar sentuh.
* **Dual-Mode Execution**:
  1. **Mode Plan (Rekomendasi)**: AI menyajikan perbandingan teks lama vs baru (*diff preview card*) sebelum guru memutuskan klik *"Terapkan Revisi"*.
  2. **Mode Action (Instan)**: AI langsung memperbarui seksi dokumen yang dipilih secara langsung.
* **Badge Kuota Tiket**: Menampilkan pill sisa tiket revisi per dokumen (misal: `10 Tiket Tersisa`) berlatar `#FAF3FB`.

---

## 8. Antarmuka Panel Admin & Multi-Engine Key Manager

Halaman `/admin` mengadopsi struktur dashboard modern enterprise:
* **Sidebar Navigasi**: Kolapsibel (`lg:w-64` vs `lg:w-20`) dengan aksen teks Aubergine `#2A1532` dan lencana ikon aktif.
* **Kartu Mesin Utama Dattio AI Enterprise (`AdminSettingsView.tsx`)**:
  * Menampilkan status live kuota 20.000.000 token, model default (`glm-5.2` & `deepseek-v4-flash`), tombol cek kuota real-time, dan status latensi koneksi.
* **Kartu Pool Google Gemini BYOK**:
  * Menampilkan daftar kunci aktif dengan masking privasi (`AIzaSy...4x9B`), tombol uji koneksi per kunci, dan penghitung tingkat kegagalan (*failover counter*).

---

## 9. Standar Mobile-First & PWA Standalone

### 9.1. Breakpoints Responsif
* `xs`: 480px (Smartphone layar standar)
* `sm`: 640px (Smartphone besar / Phablet)
* `md`: 768px (Tablet portrait / iPad Mini)
* `lg`: 1024px (Laptop / iPad Pro landscape)
* `xl`: 1280px (Monitor desktop widescreen)

### 9.2. Prinsip Ergonomi Mobile PWA
1. **Layar Penuh Tanpa Browser Bar**: Dilengkapi dengan `manifest.json` dan Service Worker sehingga saat diinstal via tombol *"Pasang di HP (Android & iOS)"*, Kalandra beroperasi mandiri (*standalone mode*) seperti aplikasi native Play Store / App Store.
2. **Sticky Topbar & Floating Action**: Navigasi selalu dapat diakses di bagian atas dengan efek *backdrop blur*, dan tombol aksi penting tidak pernah tertutup oleh keyboard virtual.
3. **Target Ketukan Jari**: Tidak ada tombol interaktif yang memiliki ukuran lebih kecil dari 44x44px. Jarak antar-tombol minimal 8px untuk mencegah salah ketuk (*misclick*).

---

## 10. Checklist QA & Audit Anti-Slop (Quality Gate)

Setiap penambahan atau modifikasi komponen antarmuka di Kalandra wajib lolos uji audit 8 poin berikut:
- [x] **No AI-Purple Cliché**: Menggunakan warna khas **Royal Plum (`#522D60`)** dan **Warm Peach (`#F2A67B`)**, dilarang keras menggunakan gradien ungu neon generik khas template AI murah.
- [x] **WCAG AA Compliance**: Kontras teks gelap `#2A1532` di atas canvas `#FAF7FB` mencapai rasio $>12:1$ (jauh melampaui standar minimal 4.5:1).
- [x] **Unified Icon Set**: Seluruh ikon bersumber konsisten dari `lucide-react` dengan ketebalan stroke seragam (1.5px hingga 2px).
- [x] **Explicit Form Labels**: Semua kolom input memiliki label teks eksplisit di atas bidangnya.
- [x] **Print Precision**: Cetak browser (`Ctrl+P`) dan ekspor Word (`.docx`) memiliki keselarasan layout tabel yang identik.
- [x] **Zero Layout Shift (CLS)**: Elemen dinamis seperti rekomendasi AI menggunakan skeleton loader atau placeholder stabil saat memuat.
- [x] **Accessible Focus States**: Semua elemen interaktif memiliki `focus:ring-2 focus:ring-[#80426E]` yang tampak jelas saat diakses via keyboard.
- [x] **Touch Target Safety**: Seluruh tombol aksi utama pada layar smartphone mudah dijangkau satu jempol tangan.
