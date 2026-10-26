# Design System & UI Engineering Guidelines
## Kalandra PAUD: Generator Perencanaan Pembelajaran Mendalam (RPM) TK

> **Acuan Desain:** `.agents/skills/design-taste-frontend/SKILL.md` (Anti-Slop Frontend Standard)  
> **Konteks Produk:** Aplikasi SaaS Pendidikan Anak Usia Dini untuk Guru TK & Kepala Satuan PAUD di Indonesia  

---

## 1. Brief Inference & The Three Dials

### 1.1. One-Line Design Read
> **"Reading this as: Educational productivity web app for Indonesian early childhood educators (Guru TK) and school administrators, with a warm, joyful, trustworthy, and professional educational language, leaning toward Tailwind v4 utilities + Plus Jakarta Sans + restrained micro-interactions."**

### 1.2. Konfigurasi The Three Dials
* **`DESIGN_VARIANCE: 7`**: Memadukan keteraturan formulir administratif resmi pemerintah dengan kartu interaktif bertema PAUD yang ceria, segar, dan ramah anak.
* **`MOTION_INTENSITY: 5`**: Transisi antar-langkah wizard yang halus (*spring physics*), feedback taktil pada tombol (`scale-[0.98]`), drawer bottom-sheet mobile yang alami, dan penghormatan penuh terhadap `prefers-reduced-motion`.
* **`VISUAL_DENSITY: 4`**: Area sentuh lega (*breathable padding*), bidang input lapang dengan ukuran target sentuh minimal 44x44px (memudahkan guru membuka aplikasi di smartphone atau tablet), serta tabel preview dengan kontras tinggi.

---

## 2. Palet Warna & Kalibrasi Kontras (Color Palette)

Menghindari klise AI-purple slop dan palet membosankan. Kalandra PAUD menggunakan kombinasi warna **Edukasi Bahari Indonesia (Deep Ocean Navy)** dipadukan dengan aksen **Kuning Mentari (Warm Amber)** dan **Hijau Segar (Sage Emerald)** yang melambangkan keceriaan dunia anak.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SISTEM WARNA KALANDRA PAUD                        │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Peran Token       │ Hex Code / Tailwind│ Fungsi Utama                   │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ Primary Brand     │ #1E3A8A (blue-900)│ Warna institusi, judul resmi,  │
│                   │                   │ header dokumen DOCX, navbar    │
│ Primary Accent    │ #2563EB (blue-600)│ Tombol CTA utama, status aktif │
│ Joyful Accent     │ #F59E0B (amber-500│ Lencana DPL Kreativitas,       │
│                   │                   │ highlight kegiatan bermain     │
│ Fresh Success     │ #059669 (emerald-6│ Indikator validasi DPL 100%,   │
│                   │                   │ tombol ekspor, status kunci OK │
│ Soft Danger       │ #DC2626 (red-600) │ Notifikasi kuota habis, error  │
│ Neutral Surface   │ #FFFFFF (white)   │ Latar belakang kartu & dialog  │
│ Page Canvas       │ #F8FAFC (slate-50)│ Latar belakang utama aplikasi  │
│ Border Subtle     │ #E2E8F0 (slate-200│ Garis tepi kartu & tabel       │
│ Text Primary      │ #0F172A (slate-900│ Teks utama judul & konten      │
│ Text Muted        │ #64748B (slate-500│ Petunjuk sub-judul & metadata  │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### Aturan Kepatuhan Kontras (WCAG AA):
- Seluruh tombol dengan teks putih wajib menggunakan latar belakang dengan rasio kontras $\ge 4.5:1$ terhadap putih (contoh: `#1E3A8A` memiliki kontras 10.7:1; `#2563EB` memiliki kontras 4.6:1).
- Teks abu-abu sekunder menggunakan minimal `#64748B` di atas latar putih (rasio 4.6:1). Dilarang memakai warna abu-abu pudar di bawah rasio 4.5:1.

---

## 3. Tipografi & Skala Hirarki (Typography System)

### 3.1. Font Antarmuka Aplikasi (Web UI)
- **Keluarga Font Utama**: `Plus Jakarta Sans`, sans-serif (alternatif: `Outfit`).
  - Alasan: Font modern karya desainer Indonesia yang sangat ergonomis untuk teks bahasa Indonesia, memiliki kesan hangat, ramah anak, namun tetap formal dan terpercaya.
- **Keluarga Font Monospace (Data & Kunci)**: `JetBrains Mono`.
  - Digunakan khusus untuk: masking kunci API (`AIzaSy...4f89`), kode regulasi (`NABP-1`, `DPL1`), dan log waktu.

### 3.2. Font Dokumen Cetak (DOCX Export)
- **Keluarga Font Resmi DOCX**: `Calibri` (atau `Arial` sebagai alternatif).
  - Alasan: Kompatibilitas universal 100% pada seluruh instalasi Microsoft Word, WPS Office, dan Google Docs tanpa menyebabkan pergeseran tata letak font di komputer kantor sekolah.

### 3.3. Skala Tipografi Web:
- **Display H1**: `text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900` (Judul Halaman Utama).
- **Section H2**: `text-xl md:text-2xl font-bold tracking-tight text-slate-900` (Judul Bagian/Langkah Wizard).
- **Card H3**: `text-base md:text-lg font-semibold text-slate-800` (Judul Kartu Kegiatan).
- **Body Regular**: `text-sm md:text-base text-slate-700 leading-relaxed` (Deskripsi kegiatan & isi tabel).
- **Caption / Metadata**: `text-xs font-medium text-slate-500` (Label alokasi waktu, minggu, dan tag).

---

## 4. Sistem Komponen & Token Visual (Component Architecture)

### 4.1. Konsistensi Radius Sudut (Shape Consistency Lock)
Aplikasi mengunci skala radius sudut seragam:
- **Kartu & Panel**: `rounded-2xl` (16px) untuk kesan lembut dan modern.
- **Input Formulir & Dropdown**: `rounded-xl` (12px) dengan padding nyaman `px-4 py-3`.
- **Tombol & Tag**: `rounded-xl` (12px) untuk tombol sekunder; `rounded-full` khusus untuk tag indikator status (*pill badges*).

### 4.2. Tombol (Buttons) & Status Taktil
- **Primary Action (CTA)**:
  - Kelas: `bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] focus:ring-4 focus:ring-blue-100`
- **Success Action (Ekspor DOCX)**:
  - Kelas: `bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] focus:ring-4 focus:ring-emerald-100`
- **Secondary Ghost Action**:
  - Kelas: `bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-xl border border-slate-200 transition-all active:scale-[0.98]`
- **Aturan Anti-Wrap Tombol**: Teks tombol CTA tidak boleh terpotong atau membungkus (*wrap*) ke dua baris pada layar desktop.

### 4.3. Bidang Input & Kontrol Formulir (Form Ergonomics)
- **Label di Atas Bidang**: Selalu mencantumkan label eksplisit di atas input (`block text-sm font-semibold text-slate-700 mb-1.5`). Dilarang menggantikan label dengan teks placeholder.
- **Target Sentuh Mobile**: Tinggi minimal kontrol input adalah `48px` untuk mencegah salah sentuh pada jari guru saat menggunakan ponsel.
- **Ring Fokus Aksesibel**: Menggunakan ring fokus tebal saat input aktif (`focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100`).

### 4.4. Kotak Centang 8 DPL (DPL Multi-Select Cards)
Setiap kartu Dimensi Profil Lulusan disajikan sebagai kotak seleksi interaktif:
```html
<label class="flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none
  ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}">
  <input type="checkbox" class="w-5 h-5 rounded text-blue-600 mt-0.5 focus:ring-blue-500" />
  <div>
    <div class="font-bold text-slate-900 text-sm">DPL1: Keimanan & Ketakwaan</div>
    <div class="text-xs text-slate-600 mt-0.5 leading-normal">Mengenal Tuhan melalui ciptaan-Nya, doa berkesadaran...</div>
  </div>
</label>
```

---

## 5. Pola Responsivitas Multi-Device (Adaptive Layouts)

### 5.1. Breakpoint Standar
- `sm`: 640px (Ponsel horizontal / Tablet kecil)
- `md`: 768px (Tablet portrait)
- `lg`: 1024px (Laptop / Desktop standar)
- `xl`: 1280px (Layar lebar desktop)

### 5.2. Adaptasi Layar Khusus
1. **Pola Bottom-Sheet di Ponsel (< 768px)**:
   - Dialog kelola API key dan pemilih Capaian Pembelajaran tidak menggunakan pop-up tengah layar yang sempit. Dialog bertransformasi menjadi **Bottom Sheet** yang meluncur dari bagian bawah layar dengan tarikan jari yang alami (*drag handle*).
2. **Mode Kartu Akordion Harian vs Tabel Lebar**:
   - Di Desktop ($\ge 1024\text{px}$): Dokumen langsung ditampilkan dalam wujud **Tabel Resmi Pembelajaran Mendalam** lengkap dengan kolom dan batas sel seperti cetakan Word.
   - Di Mobile ($< 768\text{px}$): Guru dapat memilih tampilan **Kartu Akordion Harian**. Setiap hari (Hari 1 s.d. Hari 6) menjadi satu kartu yang dapat dibuka-tutup. 3 Kegiatan harian dirinci secara bertumpuk tanpa perlu menggeser horizontal (*no horizontal scroll jank*).
3. **Sticky Floating Action Bar**:
   - Pada perangkat seluler, tombol aksi penting (*Simpan Perubahan*, *Ekspor DOCX*) melayang secara tetap di bagian bawah layar ponsel (`sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-30`), sehingga selalu dalam jangkauan satu sentuhan jempol.

---

## 6. Panduan Animasi & Gerakan Berkesadaran (Motion Directives)

Sesuai `design-taste-frontend`, animasi ditujukan untuk memperjelas konteks dan hirarki, bukan sekadar riasan grafis:
1. **Transisi Langkah Wizard**:
   - Transisi antar-langkah menggunakan pergeseran halus horizontal (`x: 20 -> 0`, `opacity: 0 -> 1`) dengan durasi $0.25\text{ detik}$.
2. **Indikator Progres AI**:
   - Baris progres pengolahan dokumen bergerak dengan transisi fluida (*smooth pulse progress bar*). Lencana status langkah berganti ikon dari pemutar berputar (*spinner*) menjadi centang hijau saat tahapan tuntas.
3. **Kepatuhan Terhadap `prefers-reduced-motion`**:
   - Ketika pengguna mengaktifkan mode ramah-sensori pada sistem operasi, seluruh animasi transisi seketika dinonaktifkan (`duration: 0` atau statis) untuk menjaga kenyamanan mata.

---

## 7. Audit Mandiri Anti-Slop (Pre-Flight Check)

Sebelum fitur antarmuka dinyatakan tuntas:
- [x] Tidak ada gradien ungu AI cliché (*no AI purple gradient*).
- [x] Kontras teks terhadap latar memenuhi standar WCAG AA $\ge 4.5:1$.
- [x] Semua tombol utama memiliki teks ringkas satu baris pada desktop.
- [x] Tidak ada ikon yang digambar manual dengan tag `<svg>` mentah; menggunakan pustaka ikon teruji (`@phosphor-icons/react` / `@tabler/icons-react` / `lucide-react`).
- [x] Seluruh input formulir memiliki label teks eksplisit di atasnya.
- [x] Tampilan tidak pecah saat diuji pada resolusi smartphone 360px.
