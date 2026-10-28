# Roadmap & Catatan Progress: Sinkronisasi True-WYSIWYG 4 Lampiran Dokumen PAUD

**Status:** Selesai Diimplementasikan & Terverifikasi (Build 0 Error)  
**Terakhir Diperbarui:** 28 Oktober 2026  
**Cabang Git:** `main`

---

## 📌 Ringkasan Status

1. **Fitur PWA & Optimalisasi Mobile:**
   - 100% Selesai & Terverifikasi (`npm run build` berhasil 0 error).
   - Telah di-commit dan di-push ke GitHub (`https://github.com/husnul234/kalandra-paud`).

2. **Resolusi Sinkronisasi True-WYSIWYG 4 Lampiran DOCX:**
   - **Solusi Masalah 1 & 5 (Paket Lengkap & Integrasi Dokumen):**
     - Ditambahkan opsi ke-3 pada modal ekspor: **Paket Lengkap (RPM + 4 Lampiran)** dalam 1 file `.docx`.
     - Fungsi reusable `buildLampiranDocxElements()` mengalirkan 4 instrumen observasi berhalaman baru (`pageBreakBefore: true`) ke dokumen utama saat opsi `full` dipilih.
   - **Solusi Masalah 2 (Tinggi Baris Catatan Anekdot):**
     - Dipasang `HeightRule.ATLEAST` bernilai 720 dxa (~1.3 cm) pada 7 baris observasi kosong Catatan Anekdot di Word, menjamin baris lega dan siap ditulis tangan oleh guru.
   - **Solusi Masalah 3 (Penyatuan Header Matriks SOLO):**
     - Diterapkan `rowSpan: 2` pada kolom "No" dan "Nama Peserta Didik" di Word, menyatukan header secara vertikal sesuai tabel preview di layar tanpa sel terpotong.
   - **Solusi Masalah 4 (Bingkai Foto Putus-putus & Tinggi Fisik):**
     - Dipasang inner table berbingkai `BorderStyle.DASHED` dengan tinggi fisik pasti (`HeightRule.ATLEAST`) untuk kotak penempelan foto di Lampiran 3 (Hasil Karya, 5000 dxa) dan Lampiran 4 (Foto Berseri, 2600 dxa).

---

## 📁 Berkas yang Dimodifikasi:
1. [`src/lib/docx-engine/docx-lampiran-builder.ts`](file:///D:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/lib/docx-engine/docx-lampiran-builder.ts): Penambahan `buildLampiranDocxElements()`, `rowSpan: 2`, `HeightRule.ATLEAST`, dan bingkai `BorderStyle.DASHED`.
2. [`src/lib/docx-engine/docx-paud-builder.ts`](file:///D:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/lib/docx-engine/docx-paud-builder.ts): Integrasi `includeLampiran` pada `DocxExportConfig` dan panggilan elemen lampiran.
3. [`src/components/ExportDocxModal.tsx`](file:///D:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/components/ExportDocxModal.tsx): Penambahan segmented button 3 opsi: Paket Lengkap (Rekomendasi), RPM Utama, dan 4 Lampiran.
4. [`src/App.tsx`](file:///D:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/15.%20US%20DEWI/RPP%20TK%20CODE%20BASE/src/App.tsx): Dukungan state tipe ekspor `'full' | 'rpm' | 'lampiran'`.
