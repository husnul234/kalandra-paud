import React, { useState } from 'react';
import { RpmPaudDocData } from '../lib/docx-engine/docx-paud-builder';
import { DATA_8_DPL } from '../data/cp_paud_data';
import { 
  FileDown, 
  Printer, 
  Save, 
  CheckCircle, 
  Sparkles,
  FileCheck,
  Eye,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface Props {
  data: RpmPaudDocData;
  onUpdateData: (newData: RpmPaudDocData) => void;
  onOpenExportModal: () => void;
  onSaveDocument?: () => void;
  isSaving?: boolean;
}

export const LiveTablePreview: React.FC<Props> = ({
  data,
  onOpenExportModal,
  onSaveDocument,
  isSaving = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const info = data.informasi_umum || {};
  const selectedDpl = data.identifikasi?.dimensi_profil_lulusan_terpilih || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP ACTION TOOLBAR (Modern UI styling) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold border border-blue-200">
            <FileCheck className="w-5 h-5 text-[#1E3A8A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Pratinjau Dokumen True-WYSIWYG Word
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#1E3A8A] border border-blue-200">
                Identik dengan .docx
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Format Calibri, Navy #1E3A8A, layout tabel, dan tanda tangan 100% presisi sesuai hasil unduhan.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Zoom controls */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono font-bold text-slate-700 min-w-[45px] text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(125, zoomLevel + 10))}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {onSaveDocument && (
            <button
              type="button"
              onClick={onSaveDocument}
              disabled={isSaving}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Draf'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Cetak Langsung Lembar Dokumen"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button
            type="button"
            onClick={onOpenExportModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <FileDown className="w-4 h-4" />
            <span>Ekspor Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* 2. OFFICE DESK CANVAS SIMULATOR (SLATE BACKDROP) */}
      <div className="bg-slate-300/80 p-3 sm:p-8 rounded-2xl border border-slate-300 shadow-inner overflow-x-auto flex justify-center">
        {/* 3. WHITE PAPER SHEET (TRUE WYSIWYG MICROSOFT WORD REPLICA) */}
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-[850px] bg-white shadow-2xl p-6 sm:p-12 md:p-14 border border-slate-300 text-slate-900 font-['Calibri',Arial,sans-serif] text-[13.5px] leading-relaxed transition-transform duration-200"
        >
          {/* Running Top Header (Subtle gray header like Word) */}
          <div className="text-right text-[11px] italic text-slate-400 border-b border-slate-200 pb-2 mb-6">
            {info.asal_sekolah || 'Satuan PAUD'} — Perencanaan Pembelajaran Mendalam (RPM)
          </div>

          {/* Document Main Title Block */}
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-lg sm:text-xl font-bold text-[#1E3A8A] tracking-normal uppercase font-['Calibri',Arial,sans-serif]">
              PERENCANAAN PEMBELAJARAN MENDALAM (RPM)
            </h1>
            <h2 className="text-sm sm:text-base font-bold text-[#1E40AF] uppercase">
              {info.asal_sekolah || 'SATUAN PENDIDIKAN ANAK USIA DINI'} — FASE FONDASI
            </h2>
            <p className="text-xs text-slate-500 italic">
              Tahun Ajaran 2025/2026 • Kurikulum Merdeka (Permendikdasmen No. 10/2025 & Keputusan BSKAP No. 046/H/KR/2025)
            </p>
          </div>

          {/* INFORMASI UMUM (2-Column Crisp Metadata Table) */}
          <div className="border border-slate-400 mb-6 text-xs text-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-400">
              {/* Kolom Kiri */}
              <div className="p-3 space-y-1.5 bg-[#FAFBFD]">
                <div>
                  <span className="font-bold text-[#1E3A8A] inline-block w-32">Satuan Pendidikan</span>: {info.asal_sekolah || '-'}
                </div>
                <div>
                  <span className="font-bold text-[#1E3A8A] inline-block w-32">Guru Kelas</span>: {info.guru || '-'}
                </div>
                <div>
                  <span className="font-bold text-[#1E3A8A] inline-block w-32">Fase / Kelompok</span>: Fondasi / {info.jenjang_kelas || 'Kelompok A (4-5 Tahun)'}
                </div>
                <div>
                  <span className="font-bold text-[#1E3A8A] inline-block w-32">Semester / Bulan</span>: {info.semester || '1 (Gasal)'} / {info.bulan || '-'}
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="p-3 space-y-1.5 bg-[#FAFBFD]">
                <div>
                  <span className="font-bold text-[#1E3A8A] inline-block w-32">Alokasi Waktu</span>: {info.alokasi_waktu || '6 x 3 JP'}
                </div>
                <div>
                  <span className="font-bold text-[#1E3A8A] inline-block w-32">Model Pembelajaran</span>: {info.model_pembelajaran || 'Sentra / Bermain'} ({info.jumlah_anak || '15'} Anak)
                </div>
                <div>
                  <span className="font-bold text-[#1E3A8A] inline-block w-32">Minggu Ke-</span>: Minggu ke-{info.minggu_ke || '1'}
                </div>
                <div>
                  <span className="font-bold text-[#1E3A8A] inline-block w-32">Tahun Ajaran</span>: 2025/2026
                </div>
              </div>
            </div>

            {/* Baris Topik / Subtopik Terintegrasi */}
            <div className="p-2.5 border-t border-slate-400 bg-[#EFF6FF] text-[#1E3A8A] font-bold text-xs flex items-center gap-2">
              <span className="uppercase tracking-wide">Topik / Subtopik:</span>
              <span className="text-slate-900 font-extrabold text-sm">{info.topik_subtopik || '-'}</span>
            </div>
          </div>

          {/* =========================================================================
              TABEL 1: IDENTIFIKASI (Word DOCX Replica)
          ========================================================================= */}
          <div className="mb-6">
            {/* Header Bar */}
            <div className="bg-[#1E3A8A] text-white px-3 py-2 font-bold text-xs tracking-wider uppercase border border-[#1E3A8A] flex justify-between items-center">
              <span>1. IDENTIFIKASI</span>
              <span className="text-[10px] font-normal text-blue-100">Permendikdasmen No. 10/2025 & No. 12/2025</span>
            </div>

            {/* Table Body */}
            <div className="border-x border-b border-slate-400 divide-y divide-slate-400 text-xs">
              {/* Row 1: Peserta Didik */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Peserta Didik
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 leading-relaxed">
                  {data.identifikasi?.peserta_didik || '-'}
                </div>
              </div>

              {/* Row 2: Materi Pelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Materi Pelajaran
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 leading-relaxed">
                  {data.identifikasi?.materi_pelajaran || '-'}
                </div>
              </div>

              {/* Row 3: Dimensi Profil Lulusan */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Dimensi Profil Lulusan
                  <span className="block font-normal text-[10px] text-slate-500 mt-0.5">8 Dimensi Resmi SKL</span>
                </div>
                <div className="p-3 md:col-span-3 space-y-2">
                  {DATA_8_DPL.map((dpl) => {
                    const isChecked = selectedDpl.includes(dpl.kode);
                    return (
                      <div key={dpl.kode} className="flex items-start gap-2">
                        <span className={`font-mono font-bold text-xs shrink-0 ${isChecked ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {isChecked ? '[ v ]' : '[   ]'}
                        </span>
                        <div>
                          <strong className={isChecked ? 'text-[#1E3A8A] font-bold' : 'text-slate-400 font-normal'}>
                            {dpl.kode} - {dpl.nama}:
                          </strong>{' '}
                          <span className={isChecked ? 'text-slate-800' : 'text-slate-400 italic'}>
                            {dpl.fokus_paud}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              TABEL 2: DESAIN PEMBELAJARAN (Word DOCX Replica)
          ========================================================================= */}
          <div className="mb-6">
            {/* Header Bar */}
            <div className="bg-[#1E3A8A] text-white px-3 py-2 font-bold text-xs tracking-wider uppercase border border-[#1E3A8A] flex justify-between items-center">
              <span>2. DESAIN PEMBELAJARAN</span>
              <span className="text-[10px] font-normal text-blue-100">Keputusan BSKAP No. 046/H/KR/2025</span>
            </div>

            {/* Table Body */}
            <div className="border-x border-b border-slate-400 divide-y divide-slate-400 text-xs">
              {/* Capaian Pembelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Capaian Pembelajaran (Verbatim CP 2025)
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1.5 leading-relaxed">
                  {(data.desain_pembelajaran?.capaian_pembelajaran || []).map((cp, i) => (
                    <p key={i}><strong>{i + 1}.</strong> {cp}</p>
                  ))}
                </div>
              </div>

              {/* Lintas Disiplin Ilmu */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Lintas Disiplin Ilmu
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 leading-relaxed">
                  {data.desain_pembelajaran?.lintas_disiplin_ilmu || '-'}
                </div>
              </div>

              {/* Tujuan Pembelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Tujuan Pembelajaran
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1 leading-relaxed">
                  {(data.desain_pembelajaran?.tujuan_pembelajaran || []).map((tp, i) => (
                    <p key={i}>• {tp}</p>
                  ))}
                </div>
              </div>

              {/* Topik / Subtopik */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Topik / Subtopik
                </div>
                <div className="p-3 md:col-span-3 text-slate-900 font-bold">
                  {data.desain_pembelajaran?.topik_pembelajaran || info.topik_subtopik || '-'}
                </div>
              </div>

              {/* Praktik Pedagogis */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Praktik Pedagogis
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 leading-relaxed">
                  {data.desain_pembelajaran?.praktik_pedagogis || '-'}
                </div>
              </div>

              {/* Kemitraan Pembelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Kemitraan Pembelajaran
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1">
                  <p><strong>• Lingkungan Sekolah:</strong> {data.desain_pembelajaran?.kemitraan_pembelajaran?.lingkungan_sekolah || '-'}</p>
                  <p><strong>• Masyarakat:</strong> {data.desain_pembelajaran?.kemitraan_pembelajaran?.masyarakat || '-'}</p>
                  <p><strong>• Lingkungan Luar Sekolah:</strong> {data.desain_pembelajaran?.kemitraan_pembelajaran?.lingkungan_luar_sekolah || '-'}</p>
                </div>
              </div>

              {/* Lingkungan Pembelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Lingkungan Pembelajaran
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1">
                  <p><strong>• Ruang Fisik:</strong> {data.desain_pembelajaran?.lingkungan_pembelajaran?.ruang_fisik || '-'}</p>
                  <p><strong>• Ruang Virtual:</strong> {data.desain_pembelajaran?.lingkungan_pembelajaran?.ruang_virtual || '-'}</p>
                  <p><strong>• Budaya Belajar:</strong> {data.desain_pembelajaran?.lingkungan_pembelajaran?.budaya_belajar || '-'}</p>
                </div>
              </div>

              {/* Pemanfaatan Digital */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Pemanfaatan Digital
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1">
                  <p><strong>• Perencanaan:</strong> {data.desain_pembelajaran?.pemanfaatan_digital?.perencanaan || '-'}</p>
                  <p><strong>• Pelaksanaan:</strong> {data.desain_pembelajaran?.pemanfaatan_digital?.pelaksanaan || '-'}</p>
                  <p><strong>• Asesmen:</strong> {data.desain_pembelajaran?.pemanfaatan_digital?.asesmen || '-'}</p>
                  {data.desain_pembelajaran?.pemanfaatan_digital?.tautan_media && (
                    <p className="text-blue-700 underline font-mono text-[11px]">
                      {data.desain_pembelajaran.pemanfaatan_digital.tautan_media}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              TABEL 3: PENGALAMAN BELAJAR (Word DOCX Replica)
          ========================================================================= */}
          <div className="mb-6">
            {/* Header Bar */}
            <div className="bg-[#1E3A8A] text-white px-3 py-2 font-bold text-xs tracking-wider uppercase border border-[#1E3A8A] flex justify-between items-center">
              <span>3. PENGALAMAN BELAJAR</span>
              <span className="text-[10px] font-normal text-blue-100">Tahap Awal, Inti (6 Hari), Penutup</span>
            </div>

            {/* Table Body */}
            <div className="border-x border-b border-slate-400 divide-y divide-slate-400 text-xs">
              {/* TAHAP AWAL */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  TAHAP AWAL
                  <span className="block font-normal text-[10px] text-slate-500 mt-0.5">Kegiatan Pembuka</span>
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1.5 leading-relaxed">
                  {data.pengalaman_belajar?.awal?.pengantar && (
                    <p className="font-semibold text-slate-900">{data.pengalaman_belajar.awal.pengantar}</p>
                  )}
                  <div className="space-y-1">
                    {(data.pengalaman_belajar?.awal?.poin_kegiatan || []).map((pt, i) => (
                      <p key={i}><strong>{i + 1}.</strong> {pt}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* TAHAP INTI (Per Hari 1 s/d Hari 6) */}
              {(data.pengalaman_belajar?.inti?.blok_tahap || []).map((blok, bIdx) => (
                <React.Fragment key={bIdx}>
                  {/* Sub-header row */}
                  <div className="bg-[#EFF6FF] px-3 py-2 font-bold text-[#1E3A8A] border-t border-b border-slate-400">
                    TAHAP INTI: {blok.header_tahap}
                  </div>

                  {(blok.hari || []).map((h) => (
                    <div key={h.hari_ke} className="grid grid-cols-1 md:grid-cols-4">
                      <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                        HARI KE-{h.hari_ke}
                      </div>
                      <div className="p-3 md:col-span-3 space-y-3.5">
                        {(h.kegiatan_list || []).map((k) => (
                          <div key={k.nomor} className="space-y-1">
                            <div className="font-bold text-slate-900 text-xs">
                              Kegiatan {k.nomor} : {k.nama_kegiatan}{' '}
                              {k.label && <span className="font-normal italic text-[#D97706]">({k.label})</span>}
                            </div>
                            {k.alat_dan_bahan && (
                              <p className="text-slate-800">
                                <strong>• Alat dan bahan:</strong> {k.alat_dan_bahan}
                              </p>
                            )}
                            {k.langkah && k.langkah.length > 0 && (
                              <div className="space-y-0.5 pt-0.5">
                                <strong className="text-slate-800">{k.judul_langkah || 'Cara bermain'}:</strong>
                                {k.langkah.map((l, lIdx) => (
                                  <p key={lIdx} className="text-slate-700 pl-3">
                                    - {l}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}

              {/* TAHAP PENUTUP */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  TAHAP PENUTUP
                  <span className="block font-normal text-[10px] text-slate-500 mt-0.5">Refleksi & Apresiasi</span>
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1.5 leading-relaxed">
                  {data.pengalaman_belajar?.penutup?.pengantar && (
                    <p className="font-semibold text-slate-900">{data.pengalaman_belajar.penutup.pengantar}</p>
                  )}
                  <div className="space-y-1">
                    {(data.pengalaman_belajar?.penutup?.poin_kegiatan || []).map((pt, i) => (
                      <p key={i}><strong>{i + 1}.</strong> {pt}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              TABEL 4: ASESMEN PEMBELAJARAN (Word DOCX Replica)
          ========================================================================= */}
          <div className="mb-8">
            {/* Header Bar */}
            <div className="bg-[#1E3A8A] text-white px-3 py-2 font-bold text-xs tracking-wider uppercase border border-[#1E3A8A] flex justify-between items-center">
              <span>4. ASESMEN PEMBELAJARAN</span>
              <span className="text-[10px] font-normal text-blue-100">Asesmen Autentik PAUD (Awal, Proses, Akhir)</span>
            </div>

            {/* 3-Column Table */}
            <div className="border-x border-b border-slate-400 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-400">
                {/* Asesmen Awal */}
                <div>
                  <div className="bg-[#EFF6FF] p-2.5 font-bold text-[#1E3A8A] border-b border-slate-400 text-center">
                    Asesmen pada Awal Pembelajaran
                  </div>
                  <div className="p-3 space-y-1.5 text-slate-800 leading-relaxed">
                    {(data.asesmen_pembelajaran?.awal || []).map((a, i) => (
                      <p key={i}>• {a}</p>
                    ))}
                  </div>
                </div>

                {/* Asesmen Proses */}
                <div>
                  <div className="bg-[#EFF6FF] p-2.5 font-bold text-[#1E3A8A] border-b border-slate-400 text-center">
                    Asesmen pada Proses Pembelajaran
                  </div>
                  <div className="p-3 space-y-1.5 text-slate-800 leading-relaxed">
                    {(data.asesmen_pembelajaran?.proses || []).map((p, i) => (
                      <p key={i}>• {p}</p>
                    ))}
                  </div>
                </div>

                {/* Asesmen Akhir */}
                <div>
                  <div className="bg-[#EFF6FF] p-2.5 font-bold text-[#1E3A8A] border-b border-slate-400 text-center">
                    Asesmen pada Akhir Pembelajaran
                  </div>
                  <div className="p-3 space-y-1.5 text-slate-800 leading-relaxed">
                    {(data.asesmen_pembelajaran?.akhir || []).map((ak, i) => (
                      <p key={i}>• {ak}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              LEMBAR TANDA TANGAN RESMI (Word DOCX Replica)
          ========================================================================= */}
          <div className="pt-4 border-t border-slate-300 text-xs text-slate-900 font-['Calibri',Arial,sans-serif]">
            {/* Tempat & Tanggal Dokumen */}
            <div className="text-right mb-6">
              <p>................................, ................................ 202...</p>
            </div>

            {/* Kolom Tanda Tangan: Kepala Satuan & Guru */}
            <div className="grid grid-cols-2 gap-8 text-center">
              {/* Kolom Kiri: Kepala Satuan PAUD */}
              <div className="space-y-1">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala {info.asal_sekolah || 'Satuan PAUD'}</p>
                <div className="h-20 flex items-center justify-center">
                  <span className="text-[10px] text-slate-300 italic">(Tanda Tangan & Cap Satuan)</span>
                </div>
                <p className="font-bold underline uppercase">( ................................................................ )</p>
                <p>NIP. ................................................................</p>
              </div>

              {/* Kolom Kanan: Guru Kelas */}
              <div className="space-y-1">
                <p>&nbsp;</p>
                <p className="font-bold">Guru Kelas,</p>
                <div className="h-20 flex items-center justify-center">
                  <span className="text-[10px] text-slate-300 italic">(Tanda Tangan Guru)</span>
                </div>
                <p className="font-bold underline uppercase">( {info.guru || '................................................................'} )</p>
                <p>NIP. ................................................................</p>
              </div>
            </div>
          </div>

          {/* Running Footer Sheet */}
          <div className="mt-12 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 italic">
            <span>Kalandra PAUD — Terstandar Permendikdasmen No. 10/2025</span>
            <span>Dokumen Perencanaan Pembelajaran Mendalam (Fase Fondasi)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
