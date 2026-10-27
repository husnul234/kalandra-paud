# Context & Implementation Decision Log: Kalandra PAUD
## Dokumen Pembaruan: Autentikasi Sandi Sementara, Tabel Perbandingan, Jalur WA Resmi, & Penyesuaian Harga

> **File:** `/logs/log-auth-pricing-comparison.271026.md`  
> **Tanggal Pembuatan:** 27 Oktober 2026 (271026)  
> **Status:** Final & Teruji (Production Ready - Git Commit `af28754`)  
> **Inisiator:** Superadmin Platform (Pak Husnul) & Antigravity AI  

---

## 1. Ringkasan Eksekutif

Pembaruan pada tanggal 27 Oktober 2026 ini berfokus pada penyempurnaan menyeluruh alur *onboarding* dan administrasi pengguna oleh Admin, pembenahan fungsi RPC basis data Supabase Auth untuk reset/set kata sandi secara instan, perbaikan tautan layanan WhatsApp resmi, penambahan seksi perbandingan fitur di *landing page* (terinspirasi dari SiAP GURU), serta penetapan struktur harga langganan baru yang rasional dan sangat terjangkau bagi para pendidik PAUD di seluruh Indonesia.

---

## 2. Investigasi Mendalam & Solusi Kritis Autentikasi Pengguna

### 2.1. Akar Masalah Gagal Login dengan Sandi Sementara
Berdasarkan log konsol peramban dan evaluasi skema internal Supabase:
1. **Error Kolom Generated `confirmed_at`:**
   - Pesan error: `column "confirmed_at" can only be updated to DEFAULT`.
   - Di Supabase Auth, kolom `confirmed_at` pada tabel `auth.users` adalah **GENERATED COLUMN** yang dihitung secara otomatis dari `email_confirmed_at` dan `phone_confirmed_at`. PostgreSQL menolak keras setiap query `UPDATE` eksplisit ke kolom tersebut.
   - Kolom yang sah untuk aktivasi instan email adalah **`email_confirmed_at`**.
2. **Ketiadaan Schema `extensions` pada Pemanggilan Kriptografi:**
   - Pesan error: `function gen_salt(unknown) does not exist`.
   - Fungsi `crypt()` dan `gen_salt()` milik ekstensi `pgcrypto` terpasang pada skema `extensions`. Jika `SET search_path` tidak menyertakan `extensions` atau fungsi dipanggil tanpa prefix skema, PostgreSQL tidak dapat menemukan fungsi enkripsi tersebut.
3. **Kendala Sinkronisasi di Modal WhatsApp Sebelumnya:**
   - Sebelumnya, pembaruan kata sandi sementara hanya terpicu jika admin menekan tombol *"Kirim ke WhatsApp"*. Jika admin hanya mengklik tombol *"Salin Pesan"* atau menutup modal, kata sandi baru belum tersimpan di `auth.users`, sehingga pengguna gagal masuk.
4. **Proteksi Rate-Limit 429:**
   - Terlalu banyak percobaan gagal berturut-turut pada Supabase Auth memicu respons HTTP `429 (Too Many Requests)` yang sebelumnya belum menampilkan pesan jeda waktu yang ramah.

### 2.2. Solusi yang Diterapkan
1. **Pembaruan Skrip Migrasi SQL (`supabase/migrations/08_admin_password_and_tier.sql`):**
   - Menghapus manipulasi pada kolom generated `confirmed_at`.
   - Menggunakan prefix eksplisit `extensions.crypt(new_plain_password, extensions.gen_salt('bf'))`.
   - Mengisi otomatis `email_confirmed_at = COALESCE(email_confirmed_at, now())` sehingga setiap akun yang dibuat atau direset oleh Admin langsung berstatus terkonfirmasi dan dapat login seketika.
   - Menyediakan dua fungsi RPC berkeamanan tinggi (`SECURITY DEFINER`):
     - `admin_update_user_password(UUID, TEXT)`: Pembaruan berbasis User ID.
     - `admin_update_user_password_by_email(TEXT, TEXT)`: Pembaruan berbasis alamat email (memastikan kecocokan 100% meskipun UUID belum tersedia di memori klien).
2. **Penanganan Error Ramah di `AuthPage.tsx`:**
   - Mendeteksi error status 429 atau pesan *rate limit* untuk memandu pengguna menunggu jeda 1–2 menit sebelum mencoba kembali.

---

## 3. Pembaruan Alur Aktivasi Pengguna & WhatsApp

### 3.1. Penyesuaian Redaksi Pesan WhatsApp (`WhatsAppActivationModal.tsx`)
- **Penghapusan Baris Lembaga:** Baris `• *Lembaga:* [nama_tk]` telah dihapus seutuhnya dari seluruh preset pesan (*Aktivasi Lengkap*, *Format Singkat*, dan *Pengingat Akun*).
- **Pencantuman Kata Sandi Sementara:** Pesan WhatsApp secara eksplisit memuat baris:
  `• *Kata Sandi Sementara:* [password]`
- **Tombol Dedicated "Simpan Sandi ke Akun":**
  - Terdapat tombol simpan dengan umpan balik visual (*"Menyimpan..."* -> *"Tersimpan di Akun ✓"*).
  - Terdapat tombol *"Acak Sandi"* dan fitur intip/sembunyikan sandi.
  - Baik tombol *"Salin Pesan"* maupun tombol *"Kirim ke WhatsApp"* kini **secara otomatis mengeksekusi sinkronisasi kata sandi ke akun database**, menjamin bahwa sandi yang tertera di pesan selalu aktif di Supabase Auth.

### 3.2. Dialog Ganti Sandi Saat Login Pertama Kali (`FirstLoginPasswordModal.tsx`)
- Ketika guru pertama kali login ke `/app` menggunakan sandi sementara dari admin, aplikasi mendeteksi penanda `needs_password_change` dan menampilkan modal bernuansa ungu Kalandra.
- **Dukungan Opsi Lewati (Skip):**
  - Terdapat tombol **"Nanti Saja (Lewati)"** dan tombol silang (X).
  - Jika guru memilih melewatinya, sesi disimpan di `sessionStorage` sehingga guru tidak terganggu selama sesi mengajar dan tetap dapat menyusun RPM menggunakan kata sandi sementara.
- **Jika Guru Mengganti Sandi:**
  - Sandi baru diperbarui via `supabase.auth.updateUser`, flag `needs_password_change` dinonaktifkan, dan guru mendapatkan konfirmasi visual sukses.

---

## 4. Seksi Perbandingan Baru di Landing Page (Adaptasi SiAP GURU)

Telah ditambahkan seksi **"Kenapa KALANDRA Berbeda?"** pada `LandingPage.tsx` (dengan ID jangkar `#perbandingan`) yang menyajikan tabel perbandingan komprehensif antara cara konvensional/manual dengan platform Kalandra RPM TK:

| Aspek Perencanaan | Cara Konvensional / Manual | ✨ Kalandra RPM TK |
|:---|:---|:---|
| **Waktu Pembuatan 1 Dokumen RPM** | ✕ 3 – 6 Jam (Lelah & menumpuk di akhir pekan) | **✓ < 2 Menit (Otomatis & Lengkap)** |
| **Kepatuhan Kurikulum 2025/2026** | ✕ Perlu riset manual regulasi baru | **✓ Otomatis & Terverifikasi (Permendikdasmen No. 10/2025 & 8 DPL)** |
| **Format & Lembar Pengesahan** | ✕ Susun sendiri tabel & format dari nol | **✓ Siap Pakai & Profesional (Lengkap TTD Kepala Sekolah & Guru)** |
| **4 Dokumen Lampiran Observasi Siap Cetak** | ✕ Dibuat manual terpisah berhari-hari | **✓ Tersinkronisasi 100% (Anekdot, Ceklis, Hasil Karya, Foto Berseri)** |
| **Ekspor Dokumen Word (.docx) & PDF** | ✕ Atur layout & margin manual berantakan | **✓ 1 Klik Download (Format Standar F4 Folio & A4 Siap Print)** |
| **Konsistensi & Asisten Revisi** | ✕ Sulit konsisten, bongkar ulang dokumen | **✓ AI Assistant via Chat (Mode Plan & Action Otomatis)** |
| **Biaya & Efisiensi Energi** | ✕ Waktu & stres administrasi sangat tinggi | **✓ Sangat Terjangkau (Mulai Rp 8.250-an / bulan)** |

---

## 5. Saluran Resmi WhatsApp Pemesanan

Tautan tombol pemesanan paket pada `LandingPage.tsx` dan `SubscriptionModal.tsx` telah diselaraskan ke nomor layanan resmi admin:
- **Nomor Telepon:** `088228511309`
- **Format URL Tautan:** `https://wa.me/6288228511309?text=...`

---

## 6. Struktur Harga Baru & Matriks Nilai Ekonomis

Struktur harga baru telah disepakati dan diimplementasikan pada selektor durasi, kartu paket di *landing page*, serta modal langganan di dalam aplikasi:

### 6.1. Rincian Paket Standar
*Fokus pada guru yang hanya memerlukan Dokumen RPM Utama (15 dokumen/bulan).*
- **1 Bulan:** **Rp 19.000 / bulan** (~Rp 630/hari - paket perkenalan/uji coba).
- **6 Bulan:** **Rp 59.000 / 6 bulan** (Setara ~Rp 9.800/bulan | **Hemat Rp 55.000** dibandingkan akumulasi bulanan 6 x Rp 19.000 = Rp 114.000).
- **1 Tahun (365 Hari):** **Rp 99.000 / tahun** (Setara ~Rp 8.250/bulan | **Paling Hemat 57%** / Hemat Rp 129.000 dibandingkan akumulasi 12 bulan).

### 6.2. Rincian Paket PRO (Paling Direkomendasikan)
*Akses penuh seluruh fitur: Kuota 40 dokumen/bulan, 4 Lampiran Observasi Siap Cetak, Rekomendasi AI DPL/CP/Loose Parts, serta Asisten Revisi AI via Chat.*
- **1 Bulan:** **Rp 29.000 / bulan** (~Rp 960/hari).
- **6 Bulan:** **Rp 89.000 / 6 bulan** (Setara ~Rp 14.800/bulan | **Hemat Rp 85.000** dibandingkan akumulasi bulanan 6 x Rp 29.000 = Rp 174.000).
- **1 Tahun (365 Hari):** **Rp 149.000 / tahun** (Setara ~Rp 12.400/bulan | **Paling Hemat 57%** / Hemat Rp 199.000 dibandingkan akumulasi 12 bulan).

---

## 7. Inventaris Berkas yang Dimodifikasi

1. **`supabase/migrations/08_admin_password_and_tier.sql`**:
   - Skrip RPC Supabase definitif yang aman dan bebas error kolom generated `confirmed_at`.
2. **`src/lib/supabaseAdmin.ts`**:
   - Integrasi RPC ganda (UUID & Email), fungsi ekspor `adminDirectSetPassword`, dan auto-konfirmasi email saat pembuatan akun baru.
3. **`src/components/admin/WhatsAppActivationModal.tsx`**:
   - Penambahan tombol simpan sandi ke akun, auto-sync saat salin pesan & kirim WA, dan penghapusan redaksi lembaga.
4. **`src/components/admin/EditUserModal.tsx` & `src/components/admin/AdminUsersView.tsx`**:
   - Penyampaian status reset kata sandi yang informatif dan penerusan data akun ke modal aktivasi.
5. **`src/components/auth/FirstLoginPasswordModal.tsx`**:
   - Komponen modal ganti kata sandi login pertama bagi pendidik dengan opsi lewati (*skip*).
6. **`src/components/auth/AuthPage.tsx`**:
   - Penanganan pesan error proteksi rate limit HTTP 429 yang komunikatif.
7. **`src/components/landing/LandingPage.tsx`**:
   - Penambahan seksi perbandingan 7 dimensi, tautan navbar `#perbandingan`, nomor WA `088228511309`, dan pembaruan kartu harga.
8. **`src/components/subscription/SubscriptionModal.tsx`**:
   - Penyelarasan matriks harga baru (Standar 19k/59k/99k & PRO 29k/89k/149k) serta nomor WA admin resmi.

---

## 8. Verifikasi & Pengujian
- **Pemeriksaan Kompilasi TypeScript:** `npx tsc -b` -> Lolos tanpa kesalahan.
- **Pengujian Bundling Produksi:** `npm run build` -> Sukses menghasilkan berkas distribusi (`dist/`) dalam 7.54 detik.
- **Status Kontrol Versi:** Terunggah dan tersinkronisasi ke cabang utama repositori (`main`) via commit `af28754`.
