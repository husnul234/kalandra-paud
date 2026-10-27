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

const cleanListText = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/^[\s•\-\*\u2022\u25E6\u25AA\u25CF\u2013\u2014]+/, '')
    .replace(/^\d+[\.\)]\s*/, '')
    .trim();
};

export const LiveTablePreview: React.FC<Props> = ({
  data,
  onOpenExportModal,
  onSaveDocument,
  isSaving = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [justSaved, setJustSaved] = useState(false);

  const info = data.informasi_umum || {};
  const selectedDpl = data.identifikasi?.dimensi_profil_lulusan_terpilih || [];

  const handlePrint = () => {
    window.print();
  };

  const handleSaveClick = async () => {
    if (onSaveDocument) {
      await onSaveDocument();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP ACTION TOOLBAR (Sticky when scrolling) */}
      <div className="sticky top-16 sm:top-[72px] z-30 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-md flex flex-wrap items-center justify-between gap-3 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold border border-blue-200 shrink-0">
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
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                justSaved
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'border border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {justSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Tersimpan di Riwayat!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-600" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Riwayat'}</span>
                </>
              )}
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
                <div className="p-3 md:col-span-3 text-slate-800 leading-relaxed">
                  {(data.desain_pembelajaran?.capaian_pembelajaran || []).length > 0 ? (
                    <ol className="space-y-1.5">
                      {(data.desain_pembelajaran?.capaian_pembelajaran || []).map((cp, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                          <span className="font-bold text-[#1E3A8A] min-w-[18px] text-right shrink-0 select-none">{i + 1}.</span>
                          <span className="flex-1">{cleanListText(cp)}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p>-</p>
                  )}
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
                <div className="p-3 md:col-span-3 text-slate-800 leading-relaxed">
                  {(data.desain_pembelajaran?.tujuan_pembelajaran || []).length > 0 ? (
                    <ul className="space-y-1.5">
                      {(data.desain_pembelajaran?.tujuan_pembelajaran || []).map((tp, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                          <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                          <span className="flex-1">{cleanListText(tp)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>-</p>
                  )}
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
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Lingkungan Sekolah:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.kemitraan_pembelajaran?.lingkungan_sekolah || '-')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Masyarakat/Keluarga:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.kemitraan_pembelajaran?.masyarakat || '-')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Lingkungan Luar Sekolah:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.kemitraan_pembelajaran?.lingkungan_luar_sekolah || '-')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lingkungan Pembelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Lingkungan Pembelajaran
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Ruang Fisik:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.lingkungan_pembelajaran?.ruang_fisik || '-')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Ruang Virtual:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.lingkungan_pembelajaran?.ruang_virtual || '-')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Budaya Belajar:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.lingkungan_pembelajaran?.budaya_belajar || '-')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pemanfaatan Digital */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#F8FAFC] p-3 font-bold text-[#1E3A8A] md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400">
                  Pemanfaatan Digital
                </div>
                <div className="p-3 md:col-span-3 text-slate-800 space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Perencanaan:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.pemanfaatan_digital?.perencanaan || '-')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Pelaksanaan:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.pemanfaatan_digital?.pelaksanaan || '-')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                    <div className="flex-1">
                      <strong>Asesmen:</strong>{' '}
                      <span>{cleanListText(data.desain_pembelajaran?.pemanfaatan_digital?.asesmen || '-')}</span>
                    </div>
                  </div>
                  {data.desain_pembelajaran?.pemanfaatan_digital?.tautan_media && (
                    <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                      <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                      <div className="flex-1">
                        <strong>Tautan Media:</strong>{' '}
                        <a
                          href={data.desain_pembelajaran.pemanfaatan_digital.tautan_media}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 underline font-mono text-[11px] break-all"
                        >
                          {data.desain_pembelajaran.pemanfaatan_digital.tautan_media}
                        </a>
                      </div>
                    </div>
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
                  {(data.pengalaman_belajar?.awal?.poin_kegiatan || []).length > 0 && (
                    <ol className="space-y-1.5 pt-1">
                      {(data.pengalaman_belajar?.awal?.poin_kegiatan || []).map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                          <span className="font-bold text-[#1E3A8A] min-w-[18px] text-right shrink-0 select-none">{i + 1}.</span>
                          <span className="flex-1">{cleanListText(pt)}</span>
                        </li>
                      ))}
                    </ol>
                  )}
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
                          <div key={k.nomor} className="space-y-1.5">
                            <div className="font-bold text-slate-900 text-xs">
                              Kegiatan {k.nomor} : {k.nama_kegiatan}{' '}
                              {k.label && <span className="font-normal italic text-[#D97706]">({k.label})</span>}
                            </div>
                            {k.alat_dan_bahan && (
                              <div className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                                <span className="text-slate-600 font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                                <div className="flex-1">
                                  <strong>Alat & Bahan:</strong> {cleanListText(k.alat_dan_bahan)}
                                </div>
                              </div>
                            )}
                            {k.langkah && k.langkah.length > 0 && (
                              <div className="space-y-1 pt-1">
                                <strong className="text-slate-800 text-xs">{k.judul_langkah || 'Cara bermain'}:</strong>
                                <ul className="space-y-1 pl-2">
                                  {k.langkah.map((l, lIdx) => (
                                    <li key={lIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                                      <span className="text-slate-400 font-bold leading-none pt-0.5 shrink-0 select-none">-</span>
                                      <span className="flex-1">{cleanListText(l)}</span>
                                    </li>
                                  ))}
                                </ul>
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
                  {(data.pengalaman_belajar?.penutup?.poin_kegiatan || []).length > 0 && (
                    <ol className="space-y-1.5 pt-1">
                      {(data.pengalaman_belajar?.penutup?.poin_kegiatan || []).map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-800 leading-relaxed">
                          <span className="font-bold text-[#1E3A8A] min-w-[18px] text-right shrink-0 select-none">{i + 1}.</span>
                          <span className="flex-1">{cleanListText(pt)}</span>
                        </li>
                      ))}
                    </ol>
                  )}
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
                  <div className="p-3 text-slate-800 leading-relaxed">
                    {(data.asesmen_pembelajaran?.awal || []).length > 0 ? (
                      <ul className="space-y-1.5">
                        {(data.asesmen_pembelajaran?.awal || []).map((a, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                            <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                            <span className="flex-1">{cleanListText(a)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </div>

                {/* Asesmen Proses */}
                <div>
                  <div className="bg-[#EFF6FF] p-2.5 font-bold text-[#1E3A8A] border-b border-slate-400 text-center">
                    Asesmen pada Proses Pembelajaran
                  </div>
                  <div className="p-3 text-slate-800 leading-relaxed">
                    {(data.asesmen_pembelajaran?.proses || []).length > 0 ? (
                      <ul className="space-y-1.5">
                        {(data.asesmen_pembelajaran?.proses || []).map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                            <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                            <span className="flex-1">{cleanListText(p)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </div>

                {/* Asesmen Akhir */}
                <div>
                  <div className="bg-[#EFF6FF] p-2.5 font-bold text-[#1E3A8A] border-b border-slate-400 text-center">
                    Asesmen pada Akhir Pembelajaran
                  </div>
                  <div className="p-3 text-slate-800 leading-relaxed">
                    {(data.asesmen_pembelajaran?.akhir || []).length > 0 ? (
                      <ul className="space-y-1.5">
                        {(data.asesmen_pembelajaran?.akhir || []).map((ak, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                            <span className="text-[#1E3A8A] font-bold text-sm leading-none pt-0.5 shrink-0 select-none">•</span>
                            <span className="flex-1">{cleanListText(ak)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          {/* Tabel 5A: IKTP Bergradasi Taksonomi SOLO */}
          {(data.iktp_bergradasi && data.iktp_bergradasi.length > 0) && (
            <div className="mb-6">
              <div className="bg-[#1E3A8A] text-white px-3 py-2 font-bold text-xs tracking-wider uppercase border border-[#1E3A8A] flex justify-between items-center">
                <span>5A. IKTP BERGRADASI — TAKSONOMI SOLO</span>
                <span className="text-[10px] font-normal text-blue-100">Standar Verifikasi Pengawas</span>
              </div>
              <div className="border-x border-b border-slate-400 text-[11px] overflow-x-auto">
                <table className="w-full border-collapse" style={{minWidth: '640px'}}>
                  <thead>
                    <tr className="bg-[#F8FAFC]">
                      <th className="p-2 border-b border-r border-slate-400 text-[#1E3A8A] font-bold text-left w-[22%]">Tujuan</th>
                      <th className="p-2 border-b border-r border-slate-400 text-[#B91C1C] font-bold text-center bg-[#FEF2F2]">BB</th>
                      <th className="p-2 border-b border-r border-slate-400 text-[#D97706] font-bold text-center bg-[#FFFBEB]">MB</th>
                      <th className="p-2 border-b border-r border-slate-400 text-[#15803D] font-bold text-center bg-[#F0FDF4]">BSH</th>
                      <th className="p-2 border-b border-slate-400 text-[#1D4ED8] font-bold text-center bg-[#EFF6FF]">BSB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {data.iktp_bergradasi.map((item, i) => (
                      <tr key={i}>
                        <td className="p-2 border-r border-slate-300 font-bold text-[#1E3A8A] align-top bg-[#F8FAFC]">
                          TP-{item.tujuan_ke}
                          <span className="block font-normal text-slate-600 mt-0.5 text-[10px]">{item.tujuan_ringkas}</span>
                        </td>
                        <td className="p-2 border-r border-slate-300 text-[#7F1D1D] align-top bg-[#FEF2F2] text-[10px] leading-relaxed">{item.solo_bb}</td>
                        <td className="p-2 border-r border-slate-300 text-[#92400E] align-top bg-[#FFFBEB] text-[10px] leading-relaxed">{item.solo_mb}</td>
                        <td className="p-2 border-r border-slate-300 text-[#14532D] align-top bg-[#F0FDF4] text-[10px] leading-relaxed">{item.solo_bsh}</td>
                        <td className="p-2 text-[#1E3A8A] align-top bg-[#EFF6FF] text-[10px] leading-relaxed">{item.solo_bsb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tabel 5B: Rubrik Asesmen 4 Skala */}
          {(data.rubrik_asesmen && data.rubrik_asesmen.length > 0) && (
            <div className="mb-6">
              <div className="bg-[#1E3A8A] text-white px-3 py-2 font-bold text-xs tracking-wider uppercase border border-[#1E3A8A] flex justify-between items-center">
                <span>5B. RUBRIK ASESMEN 4 SKALA (BB / MB / BSH / BSB)</span>
                <span className="text-[10px] font-normal text-blue-100">Siap Cetak</span>
              </div>
              <div className="border-x border-b border-slate-400 text-[11px] overflow-x-auto">
                <table className="w-full border-collapse" style={{minWidth: '640px'}}>
                  <thead>
                    <tr>
                      <th className="p-2 border-b border-r border-slate-400 text-[#1E3A8A] font-bold text-left bg-[#F8FAFC] w-[22%]">Kriteria</th>
                      <th className="p-2 border-b border-r border-slate-400 text-[#B91C1C] font-bold text-center bg-[#FEF2F2]">BB</th>
                      <th className="p-2 border-b border-r border-slate-400 text-[#D97706] font-bold text-center bg-[#FFFBEB]">MB</th>
                      <th className="p-2 border-b border-r border-slate-400 text-[#15803D] font-bold text-center bg-[#F0FDF4]">BSH</th>
                      <th className="p-2 border-b border-slate-400 text-[#1D4ED8] font-bold text-center bg-[#EFF6FF]">BSB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {data.rubrik_asesmen.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 border-r border-slate-300 font-bold text-[#1E3A8A] align-top bg-[#F8FAFC]">{row.kriteria}</td>
                        <td className="p-2 border-r border-slate-300 text-[#7F1D1D] align-top bg-[#FEF2F2] text-[10px] leading-relaxed">{row.bb}</td>
                        <td className="p-2 border-r border-slate-300 text-[#92400E] align-top bg-[#FFFBEB] text-[10px] leading-relaxed">{row.mb}</td>
                        <td className="p-2 border-r border-slate-300 text-[#14532D] align-top bg-[#F0FDF4] text-[10px] leading-relaxed">{row.bsh}</td>
                        <td className="p-2 text-[#1E3A8A] align-top bg-[#EFF6FF] text-[10px] leading-relaxed">{row.bsb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tabel 6: Catatan Keselamatan Anak */}
          {(data.catatan_keselamatan && data.catatan_keselamatan.length > 0) && (
            <div className="mb-6">
              <div className="bg-[#B91C1C] text-white px-3 py-2 font-bold text-xs tracking-wider uppercase border border-[#B91C1C] flex justify-between items-center">
                <span>6. CATATAN KESELAMATAN ANAK</span>
                <span className="text-[10px] font-normal text-red-200">Wajib Dibaca Sebelum Kegiatan</span>
              </div>
              <div className="border-x border-b border-slate-400 divide-y divide-slate-300 text-xs bg-[#FEF2F2]">
                {data.catatan_keselamatan.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5">
                    <span className="text-[#B91C1C] font-bold shrink-0">&#9888;</span>
                    <span className="text-[#7F1D1D]">{cleanListText(note)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lampiran Instrumen Observasi */}
          {data.lampiran_instrumen && (
            <div className="mb-8">
              <div className="bg-[#1E3A8A] text-white px-3 py-2 font-bold text-xs tracking-wider uppercase border border-[#1E3A8A] flex justify-between items-center">
                <span>LAMPIRAN: 4 INSTRUMEN OBSERVASI SIAP CETAK</span>
                <span className="text-[10px] font-normal text-blue-100">Di DOCX: Halaman Terpisah</span>
              </div>
              <div className="border-x border-b border-slate-400 text-xs divide-y divide-slate-300">
                {([
                  { key: 'catatan_anekdot' as const, label: 'L-1 Catatan Anekdot', color: '#D97706', bg: '#FFFBEB' },
                  { key: 'ceklis_iktp' as const, label: 'L-2 Ceklis IKTP per Anak', color: '#15803D', bg: '#F0FDF4' },
                  { key: 'hasil_karya' as const, label: 'L-3 Dokumentasi Hasil Karya', color: '#7C3AED', bg: '#F5F3FF' },
                  { key: 'foto_berseri' as const, label: 'L-4 Foto Berseri / Portofolio', color: '#0369A1', bg: '#F0F9FF' },
                ]).map((item) => {
                  const content = data.lampiran_instrumen?.[item.key];
                  if (!content) return null;
                  const lines = content.split('\n').filter((l) => l.trim());
                  return (
                    <div key={item.key} className="grid grid-cols-1 md:grid-cols-4">
                      <div className="p-3 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-400 font-bold text-xs" style={{ color: item.color, backgroundColor: item.bg }}>
                        {item.label}
                      </div>
                      <div className="p-3 md:col-span-3 text-slate-700 leading-relaxed space-y-1">
                        {lines.slice(0, 4).map((line, li) => (
                          <div key={li} className="flex items-start gap-1.5">
                            <span className="text-slate-400 shrink-0 font-bold">•</span>
                            <span className="text-[11px]">{cleanListText(line)}</span>
                          </div>
                        ))}
                        {lines.length > 4 && (
                          <p className="text-slate-400 italic text-[10px] mt-1">... (selengkapnya di dokumen Word)</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
            <span>Kalandra — Terstandar Permendikdasmen No. 10/2025</span>
            <span>Dokumen Perencanaan Pembelajaran Mendalam (Fase Fondasi)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
