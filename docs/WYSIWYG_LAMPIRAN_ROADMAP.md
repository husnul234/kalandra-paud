# Roadmap & Catatan Progress: Sinkronisasi True-WYSIWYG 4 Lampiran Dokumen PAUD

**Status:** Tersimpan di Lokal (Siap Dilanjutkan Kapan Saja)  
**Terakhir Diperbarui:** 28 Oktober 2026  
**Cabang Git:** `main` (commit terakhir `af08275` ter-push ke GitHub)

---

## 📌 Ringkasan Status

1. **Fitur PWA & Optimalisasi Mobile:**
   - 100% Selesai & Terverifikasi (`npm run build` berhasil 0 error).
   - Telah di-commit dan di-push ke GitHub (`https://github.com/husnul234/kalandra-paud`).

2. **Analisis Isu WYSIWYG Lampiran (Sudah Disetujui):**
   - **Masalah 1:** Ekspor "Dokumen RPM Utama" di Word hanya merender teks poin-poin biasa, belum menyertakan 4 tabel instrumen resmi seperti di layar.
   - **Masalah 2:** Pada ekspor "4 Lampiran", baris kosong Catatan Anekdot tidak memiliki tinggi baris fisik (`HeightRule.ATLEAST`), sehingga sempit di Word.
   - **Masalah 3:** Header Matriks SOLO 14 kolom belum menerapkan `rowSpan: 2` di DOCX (sel pecah/tidak menyatu secara vertikal).
   - **Masalah 4:** Area penempelan foto pada Lampiran 3 (Hasil Karya) dan Lampiran 4 (Foto Berseri) di Word belum memiliki bingkai bergaris putus-putus (`BorderStyle.DASHED`) dan tinggi fisik kotak foto seperti di layar.
   - **Masalah 5:** Modal ekspor belum memiliki opsi "Paket Lengkap (RPM + 4 Lampiran True-WYSIWYG dalam 1 file .docx)".

---

## 🚀 Langkah Eksekusi yang Akan Dijalankan Saat Dilanjutkan:

1. **[`src/lib/docx-engine/docx-lampiran-builder.ts`](file:///E:/1.%20APPLIKASI/1.%20CLIENT/6.%20KALANDRA/src/lib/docx-engine/docx-lampiran-builder.ts):**
   - Tambahkan fungsi pembangun elemen lampiran reusable: `buildLampiranDocxElements()`.
   - Pasang `HeightRule.ATLEAST` untuk tinggi baris kosong Anekdot.
   - Terapkan `rowSpan: 2` pada header kolom Matriks SOLO.
   - Pasang bingkai `BorderStyle.DASHED` dan tinggi kotak foto pada Hasil Karya & Foto Berseri.
2. **[`src/lib/docx-engine/docx-paud-builder.ts`](file:///E:/1.%20APPLIKASI/1.%20CLIENT/6.%20KALANDRA/src/lib/docx-engine/docx-paud-builder.ts):**
   - Integrasikan `buildLampiranDocxElements()` ke dalam dokumen utama saat opsi `full` dipilih.
3. **[`src/components/ExportDocxModal.tsx`](file:///E:/1.%20APPLIKASI/1.%20CLIENT/6.%20KALANDRA/src/components/ExportDocxModal.tsx):**
   - Tambahkan opsi ke-3 pada tombol jenis dokumen: *Paket Lengkap (RPM + 4 Lampiran)*.
4. **Verifikasi:**
   - Jalankan `npm run build` dan uji pratinjau dokumen.
