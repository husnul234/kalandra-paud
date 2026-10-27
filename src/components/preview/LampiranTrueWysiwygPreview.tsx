import React from 'react';
import { RpmPaudDocData } from '../../lib/docx-engine/docx-paud-builder';
import { 
  ClipboardList, 
  FileText, 
  Printer, 
  FileDown, 
  CheckCircle2, 
  Calendar, 
  User, 
  Camera, 
  Palette,
  Sparkles
} from 'lucide-react';

interface Props {
  data: RpmPaudDocData;
  isInlineEditActive?: boolean;
  onUpdateData?: (newData: RpmPaudDocData) => void;
  onOpenExportLampiran?: () => void;
}

export const LampiranTrueWysiwygPreview: React.FC<Props> = ({
  data,
  isInlineEditActive = false,
  onUpdateData,
  onOpenExportLampiran,
}) => {
  const info = data.informasi_umum || {};
  const iktpList = data.iktp_bergradasi || [];

  return (
    <div className="space-y-8 print:space-y-0 text-slate-800 font-['Calibri',Arial,sans-serif]">
      {/* Visual Navigation Pill Bar */}
      <div className="bg-[#FAF3FB] p-2.5 rounded-2xl border border-[#E8D6EB] flex flex-wrap items-center justify-between gap-2 print:hidden shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#522D60] uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-[#80426E]" />
            Daftar 4 Instrumen Observasi Siap Cetak:
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
          <a
            href="#lampiran-1"
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            L-1 Catatan Anekdot
          </a>
          <a
            href="#lampiran-2"
            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
          >
            L-2 Matriks SOLO
          </a>
          <a
            href="#lampiran-3"
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            L-3 Hasil Karya
          </a>
          <a
            href="#lampiran-4"
            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            L-4 Foto Berseri
          </a>
          {onOpenExportLampiran && (
            <button
              type="button"
              onClick={onOpenExportLampiran}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 shadow-xs transition-colors ml-2 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Unduh DOCX Siap Print</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          LEMBAR 1: LAMPIRAN 1 - FORMAT CATATAN ANEKDOT KELAS (Anecdotal Records)
      ========================================================================= */}
      <div
        id="lampiran-1"
        className="bg-white rounded-sm shadow-xl p-6 sm:p-10 border border-slate-300 relative print:shadow-none print:border-none print:p-0 print:m-0 print:break-after-page"
      >
        <div className="border-b-2 border-[#1E3A8A] pb-3 mb-4 text-center">
          <h2 className="text-base sm:text-lg font-black text-[#1E3A8A] uppercase tracking-wide">
            LAMPIRAN 1: FORMAT CATATAN ANEKDOT KELAS (ANECDOTAL RECORDS)
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Satuan: <span className="font-bold text-[#1E3A8A]">{info.asal_sekolah || 'Satuan PAUD'}</span> | Kelompok: {info.jenjang_kelas || 'A (4-5 Tahun)'} | Topik: {info.topik_subtopik || '-'} | Semester {info.semester || '1'} (Minggu ke-{info.minggu_ke || '1'})
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-[#1E3A8A] text-white font-black text-center">
                <th colSpan={6} className="py-2 px-3 tracking-wider text-xs uppercase">
                  INSTRUMEN CATATAN ANEKDOT PERISTIWA BERMAKNA (Fase Fondasi)
                </th>
              </tr>
              <tr className="bg-slate-100 font-extrabold text-slate-800 text-center border-b border-slate-400">
                <th className="py-2 px-2 border-r border-slate-400 w-[5%]">No</th>
                <th className="py-2 px-3 border-r border-slate-400 w-[14%]">Hari / Tgl</th>
                <th className="py-2 px-3 border-r border-slate-400 w-[16%]">Nama Anak</th>
                <th className="py-2 px-3 border-r border-slate-400 w-[31%]">Peristiwa / Perilaku yang Teramati (Objektif)</th>
                <th className="py-2 px-3 border-r border-slate-400 w-[16%]">Capaian / DPL Terkait</th>
                <th className="py-2 px-3 w-[18%]">Analisis & Umpan Balik Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {/* Row 1: Contoh terisi */}
              <tr className="bg-blue-50/40">
                <td className="py-2.5 px-2 text-center font-bold border-r border-slate-300">1</td>
                <td className="py-2.5 px-3 border-r border-slate-300 font-medium">Senin, ...</td>
                <td className="py-2.5 px-3 border-r border-slate-300 font-bold text-[#1E3A8A]">Ananda A...</td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-slate-700 leading-relaxed">
                  Saat kegiatan main tentang <em>{info.topik_subtopik || 'kegiatan'}</em>, anak memilih bahan loose parts dan mengajak temannya bekerja sama tanpa berebut.
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 font-bold text-[#1E3A8A]">
                  DPL5 (Kolaborasi)<br />DPL6 (Kemandirian)
                </td>
                <td className="py-2.5 px-3 text-slate-700 italic leading-relaxed">
                  Menunjukkan regulasi emosi positif dan kepedulian sosial. Diberi penguatan verbal apresiatif.
                </td>
              </tr>

              {/* Rows 2 - 8: Baris Observasi Kosong Siap Catat */}
              {[2, 3, 4, 5, 6, 7, 8].map((rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-2 text-center font-bold border-r border-slate-300 text-slate-500">{rowIdx}</td>
                  <td className="py-4 px-3 border-r border-slate-300 text-slate-400 font-mono text-[11px]">..................</td>
                  <td className="py-4 px-3 border-r border-slate-300 text-slate-400 font-mono text-[11px]">..................</td>
                  <td className="py-4 px-3 border-r border-slate-300 text-slate-300"> </td>
                  <td className="py-4 px-3 border-r border-slate-300 text-slate-300"> </td>
                  <td className="py-4 px-3 text-slate-300"> </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Guru di Halaman 1 */}
        <div className="mt-8 flex justify-end">
          <div className="text-center text-xs min-w-[220px]">
            <p className="text-slate-600">................................, ................................ 202...</p>
            <p className="font-bold text-slate-800 mt-1">Guru Kelas / Pendidik PAUD,</p>
            <div className="h-14 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">(Tanda Tangan Guru)</span>
            </div>
            <p className="font-bold text-slate-900 underline uppercase">( {info.guru || '................................................................'} )</p>
            <p className="text-slate-500 text-[11px]">NIP. ................................................................</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEMBAR 2: LAMPIRAN 2 - MATRIKS CEKLIS IKTP TAKSONOMI SOLO (Checklist)
      ========================================================================= */}
      <div
        id="lampiran-2"
        className="bg-white rounded-sm shadow-xl p-6 sm:p-10 border border-slate-300 relative print:shadow-none print:border-none print:p-0 print:m-0 print:break-after-page"
      >
        <div className="border-b-2 border-amber-600 pb-3 mb-4 text-center">
          <h2 className="text-base sm:text-lg font-black text-amber-700 uppercase tracking-wide">
            LAMPIRAN 2: MATRIKS CEKLIS IKTP BERGRADASI (TAKSONOMI SOLO)
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Satuan: <span className="font-bold text-amber-800">{info.asal_sekolah || 'Satuan PAUD'}</span> | Kelompok: {info.jenjang_kelas || 'A (4-5 Tahun)'} | Topik: {info.topik_subtopik || '-'} | Semester {info.semester || '1'} (Minggu ke-{info.minggu_ke || '1'})
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-amber-600 text-white font-black text-center">
                <th colSpan={14} className="py-2 px-3 tracking-wider text-xs uppercase">
                  MATRIKS CEKLIS KELAS (Taksonomi SOLO: BB, MB, BSH, BSB)
                </th>
              </tr>
              <tr className="bg-slate-100 font-extrabold text-slate-800 text-center border-b border-slate-400 text-[11px]">
                <th rowSpan={2} className="py-2 px-2 border-r border-slate-400 w-[5%]">No</th>
                <th rowSpan={2} className="py-2 px-3 border-r border-slate-400 w-[20%]">Nama Peserta Didik</th>
                {[0, 1, 2].map((tIdx) => {
                  const tp = iktpList[tIdx];
                  const title = tp ? `TP-${tp.tujuan_ke}: ${tp.tujuan_ringkas.slice(0, 22)}...` : `Tujuan Pembelajaran ${tIdx + 1}`;
                  return (
                    <th key={tIdx} colSpan={4} className="py-1.5 px-2 border-r border-slate-400 text-[#1E3A8A] bg-blue-50/70">
                      {title}
                    </th>
                  );
                })}
              </tr>
              <tr className="bg-slate-50 font-bold text-center border-b border-slate-400 text-[10px]">
                {[0, 1, 2].map((tIdx) => (
                  <React.Fragment key={tIdx}>
                    <th className="py-1 px-1 border-r border-slate-300 bg-red-50 text-red-700 w-[6%]">BB</th>
                    <th className="py-1 px-1 border-r border-slate-300 bg-amber-50 text-amber-700 w-[6%]">MB</th>
                    <th className="py-1 px-1 border-r border-slate-300 bg-emerald-50 text-emerald-700 w-[6%]">BSH</th>
                    <th className="py-1 px-1 border-r border-slate-400 bg-blue-50 text-blue-700 w-[7%]">BSB</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {/* 15 Baris Absensi Lengkap 1 Halaman Siap Cetak */}
              {Array.from({ length: 15 }, (_, i) => i + 1).map((idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-1.5 px-2 text-center font-bold border-r border-slate-300 text-slate-500">{idx}</td>
                  <td className="py-1.5 px-3 border-r border-slate-300 text-slate-400 font-mono text-[11px]">
                    ................................................
                  </td>
                  {[0, 1, 2].map((tIdx) => (
                    <React.Fragment key={tIdx}>
                      <td className="py-1.5 px-1 border-r border-slate-200 text-center text-slate-300"> </td>
                      <td className="py-1.5 px-1 border-r border-slate-200 text-center text-slate-300"> </td>
                      <td className="py-1.5 px-1 border-r border-slate-200 text-center text-slate-300"> </td>
                      <td className="py-1.5 px-1 border-r border-slate-400 text-center text-slate-300"> </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-[11px] text-slate-500 italic">
          * Keterangan Skala SOLO: <strong>BB</strong> = Belum Berkembang (Unistruktural), <strong>MB</strong> = Mulai Berkembang (Multistruktural), <strong>BSH</strong> = Berkembang Sesuai Harapan (Relasional), <strong>BSB</strong> = Berkembang Sangat Baik (Extended Abstract).
        </div>

        {/* Tanda Tangan Guru di Halaman 2 */}
        <div className="mt-6 flex justify-end">
          <div className="text-center text-xs min-w-[220px]">
            <p className="text-slate-600">................................, ................................ 202...</p>
            <p className="font-bold text-slate-800 mt-1">Guru Kelas / Pendidik PAUD,</p>
            <div className="h-12 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">(Tanda Tangan Guru)</span>
            </div>
            <p className="font-bold text-slate-900 underline uppercase">( {info.guru || '................................................................'} )</p>
            <p className="text-slate-500 text-[11px]">NIP. ................................................................</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEMBAR 3: LAMPIRAN 3 - LEMBAR DOKUMENTASI HASIL KARYA (Work Samples)
      ========================================================================= */}
      <div
        id="lampiran-3"
        className="bg-white rounded-sm shadow-xl p-6 sm:p-10 border border-slate-300 relative print:shadow-none print:border-none print:p-0 print:m-0 print:break-after-page"
      >
        <div className="border-b-2 border-emerald-700 pb-3 mb-4 text-center">
          <h2 className="text-base sm:text-lg font-black text-emerald-800 uppercase tracking-wide flex items-center justify-center gap-2">
            <Palette className="w-5 h-5 text-emerald-700" />
            LAMPIRAN 3: LEMBAR DOKUMENTASI HASIL KARYA ANAK (WORK SAMPLES)
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Satuan: <span className="font-bold text-emerald-800">{info.asal_sekolah || 'Satuan PAUD'}</span> | Kelompok: {info.jenjang_kelas || 'A (4-5 Tahun)'} | Topik: {info.topik_subtopik || '-'}
          </p>
        </div>

        <div className="border border-slate-400 rounded-sm overflow-hidden text-xs">
          <div className="bg-emerald-700 text-white font-black py-2 px-3 text-center uppercase tracking-wider text-xs">
            INSTRUMEN DOKUMENTASI KARYA FISIK / KONSTRUKSI LOOSE PARTS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-400">
            {/* Kolom Kiri: Area Tempel Foto Sangat Luas (Tinggi Penuh) */}
            <div className="p-6 bg-slate-50/70 flex flex-col items-center justify-center text-center min-h-[380px] border-dashed border-2 border-slate-300 m-3 rounded-lg">
              <Camera className="w-10 h-10 text-slate-300 mb-2" />
              <p className="font-bold text-slate-600 text-sm">
                TEMPELKAN FOTO / REKAMAN FISIK KARYA ANAK DI SINI
              </p>
              <p className="text-slate-400 italic text-[11px] mt-1 max-w-xs">
                (Area Tempel Foto Dokumentasi Ukuran 3R / 4R / Hasil Gambar & Konstruksi Bahan Loose Parts Anak)
              </p>
            </div>

            {/* Kolom Kanan: Rincian & Analisis Capaian Guru */}
            <div className="p-4 space-y-3.5 text-slate-800">
              <div className="space-y-1 pb-2 border-b border-slate-200">
                <p className="font-bold text-sm text-[#1E3A8A]">
                  Nama Peserta Didik : <span className="font-mono text-slate-500 font-normal">.................................................</span>
                </p>
                <p className="font-medium text-xs text-slate-600">
                  Kelompok Usia : <span className="font-bold text-slate-800">{info.jenjang_kelas || 'Kelompok A (4-5 Tahun)'}</span>
                </p>
                <p className="font-medium text-xs text-slate-600">
                  Hari / Tanggal : <span className="font-mono text-slate-500">.................................................</span>
                </p>
                <p className="font-medium text-xs text-slate-600">
                  Topik / Subtopik : <span className="font-bold text-emerald-800">{info.topik_subtopik || '-'}</span>
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 mb-1">
                  1. Deskripsi Ungkapan / Cerita Anak Mengenai Karyanya:
                </h4>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 italic text-[11px] leading-relaxed">
                  "................................................................................................................................................................................................................................................................................................................"
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 mb-1">
                  2. Analisis Capaian Perkembangan Guru (DPL & TP):
                </h4>
                <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-slate-700 text-[11px] space-y-1">
                  <p>• Anak menunjukkan penalaran kritis dalam memilih bahan dan struktur loose parts.</p>
                  <p>• Anak menunjukkan kemandirian dan rasa bangga saat mempresentasikan hasil karyanya.</p>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 mb-1">
                  3. Rencana Penguatan / Pijakan Guru Selanjutnya:
                </h4>
                <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-200 text-slate-700 text-[11px] italic">
                  Memberikan tantangan scaffolding lebih mendalam dengan menghubungkan karya anak ke cerita fungsional bermakna.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tanda Tangan Guru di Halaman 3 */}
        <div className="mt-6 flex justify-end">
          <div className="text-center text-xs min-w-[220px]">
            <p className="text-slate-600">................................, ................................ 202...</p>
            <p className="font-bold text-slate-800 mt-1">Guru Kelas / Pendidik PAUD,</p>
            <div className="h-12 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">(Tanda Tangan Guru)</span>
            </div>
            <p className="font-bold text-slate-900 underline uppercase">( {info.guru || '................................................................'} )</p>
            <p className="text-slate-500 text-[11px]">NIP. ................................................................</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEMBAR 4: LAMPIRAN 4 - FORMAT FOTO BERSERI (Learning Story) + PENGESAHAN
      ========================================================================= */}
      <div
        id="lampiran-4"
        className="bg-white rounded-sm shadow-xl p-6 sm:p-10 border border-slate-300 relative print:shadow-none print:border-none print:p-0 print:m-0"
      >
        <div className="border-b-2 border-purple-700 pb-3 mb-4 text-center">
          <h2 className="text-base sm:text-lg font-black text-purple-800 uppercase tracking-wide flex items-center justify-center gap-2">
            <Camera className="w-5 h-5 text-purple-700" />
            LAMPIRAN 4: FORMAT FOTO BERSERI / PORTOFOLIO PROSES BELAJAR
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Satuan: <span className="font-bold text-purple-800">{info.asal_sekolah || 'Satuan PAUD'}</span> | Kelompok: {info.jenjang_kelas || 'A (4-5 Tahun)'} | Topik: {info.topik_subtopik || '-'}
          </p>
        </div>

        <div className="border border-slate-400 rounded-sm overflow-hidden text-xs mb-6">
          <div className="bg-purple-700 text-white font-black py-2 px-3 text-center uppercase tracking-wider text-xs">
            DOKUMENTASI FOTO BERSERI PROSES BELAJAR (LEARNING STORY)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-400">
            {/* Foto 1: Tahap Awal */}
            <div className="p-3 bg-purple-50/20 flex flex-col justify-between">
              <div>
                <p className="font-black text-[#1E3A8A] text-center text-xs uppercase">FOTO 1: TAHAP AWAL</p>
                <p className="text-[10px] text-slate-500 italic text-center mb-2">(Pijakan / Eksplorasi Alat & Bahan)</p>
                
                <div className="h-44 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-white p-2 text-center text-slate-400">
                  <Camera className="w-6 h-6 text-slate-300 mb-1" />
                  <span className="text-[10px] italic">[Tempel Foto Tahap Awal]</span>
                </div>
              </div>

              <div className="mt-3 p-2 rounded bg-white border border-slate-200">
                <p className="font-bold text-[11px] text-slate-700">Catatan Perilaku:</p>
                <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">
                  Anak mengamati dan memilih bahan main dengan berkesadaran serta fokus.
                </p>
              </div>
            </div>

            {/* Foto 2: Tahap Proses */}
            <div className="p-3 bg-purple-50/20 flex flex-col justify-between">
              <div>
                <p className="font-black text-[#1E3A8A] text-center text-xs uppercase">FOTO 2: TAHAP PROSES</p>
                <p className="text-[10px] text-slate-500 italic text-center mb-2">(Interaksi Main / Kolaborasi Mendalam)</p>
                
                <div className="h-44 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-white p-2 text-center text-slate-400">
                  <Camera className="w-6 h-6 text-slate-300 mb-1" />
                  <span className="text-[10px] italic">[Tempel Foto Tahap Proses]</span>
                </div>
              </div>

              <div className="mt-3 p-2 rounded bg-white border border-slate-200">
                <p className="font-bold text-[11px] text-slate-700">Catatan Perilaku:</p>
                <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">
                  Anak tekun mencoba, bertanya sebab-akibat, dan saling berbagi bahan dengan teman.
                </p>
              </div>
            </div>

            {/* Foto 3: Tahap Hasil */}
            <div className="p-3 bg-purple-50/20 flex flex-col justify-between">
              <div>
                <p className="font-black text-[#1E3A8A] text-center text-xs uppercase">FOTO 3: TAHAP HASIL</p>
                <p className="text-[10px] text-slate-500 italic text-center mb-2">(Unjuk Karya & Refleksi Anak)</p>
                
                <div className="h-44 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-white p-2 text-center text-slate-400">
                  <Camera className="w-6 h-6 text-slate-300 mb-1" />
                  <span className="text-[10px] italic">[Tempel Foto Tahap Hasil]</span>
                </div>
              </div>

              <div className="mt-3 p-2 rounded bg-white border border-slate-200">
                <p className="font-bold text-[11px] text-slate-700">Catatan Perilaku:</p>
                <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">
                  Anak menceritakan hasil mainnya kepada guru dan teman dengan percaya diri.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lembar Tanda Tangan Resmi Lengkap (Kepala Satuan PAUD & Guru Kelas) */}
        <div className="pt-4 border-t border-slate-300 text-xs">
          <div className="text-right mb-4">
            <p className="text-slate-600">................................, ................................ 202...</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-bold text-slate-900">Kepala {info.asal_sekolah || 'Satuan PAUD'}</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic">(Tanda Tangan & Cap Satuan)</span>
              </div>
              <p className="font-bold text-slate-900 underline uppercase">( ................................................................ )</p>
              <p className="text-slate-500 text-[11px]">NIP. ................................................................</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-600">&nbsp;</p>
              <p className="font-bold text-slate-900">Guru Kelas / Pendidik PAUD,</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic">(Tanda Tangan Guru)</span>
              </div>
              <p className="font-bold text-slate-900 underline uppercase">( {info.guru || '................................................................'} )</p>
              <p className="text-slate-500 text-[11px]">NIP. ................................................................</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
