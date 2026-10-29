import React, { useState, useEffect } from 'react';
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { 
  FileDown, 
  X, 
  Check, 
  Building2, 
  UserCheck, 
  Loader2,
  FileText,
  ClipboardList,
  Layers,
  Sparkles
} from 'lucide-react';
import { buildRpmPaudDocxBlob, RpmPaudDocData, DocxExportConfig } from '../lib/docx-engine/docx-paud-builder';
import { buildRpmLampiranDocxBlob } from '../lib/docx-engine/docx-lampiran-builder';

export type ExportDocType = 'full' | 'rpm' | 'lampiran';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentData: RpmPaudDocData;
  schoolName?: string;
  initialDocType?: ExportDocType;
}

export const ExportDocxModal: React.FC<Props> = ({
  isOpen,
  onClose,
  documentData,
  schoolName,
  initialDocType = 'full',
}) => {
  const { profile } = useAuth();

  const [docType, setDocType] = useState<ExportDocType>(initialDocType);
  const [pageSize, setPageSize] = useState<'A4' | 'F4_FOLIO'>('A4');
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [city, setCity] = useState(profile?.city || 'Jakarta');
  const [documentDate, setDocumentDate] = useState(() => 
    new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  );
  const [principalName, setPrincipalName] = useState(profile?.principal_name || '');
  const [principalNip, setPrincipalNip] = useState(profile?.principal_nip || '');
  const [teacherName, setTeacherName] = useState(documentData.informasi_umum?.guru || profile?.full_name || '');
  const [teacherNip, setTeacherNip] = useState(profile?.nip || '');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDocType(initialDocType || 'full');
      if (profile?.city) setCity(profile.city);
      if (profile?.principal_name) setPrincipalName(profile.principal_name);
      if (profile?.principal_nip) setPrincipalNip(profile.principal_nip);
      if (documentData.informasi_umum?.guru) {
        setTeacherName(documentData.informasi_umum.guru);
      } else if (profile?.full_name) {
        setTeacherName(profile.full_name);
      }
      if (profile?.nip) setTeacherNip(profile.nip);
    }
  }, [isOpen, initialDocType, profile, documentData]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const config: DocxExportConfig = {
        pageSize,
        includeSignatures,
        city,
        documentDate,
        principalName,
        principalNip,
        teacherName,
        teacherNip,
      };

      const resolvedSchool = documentData.informasi_umum?.asal_sekolah || profile?.school_name || schoolName || 'Satuan PAUD';
      const finalDocData: RpmPaudDocData = {
        ...documentData,
        informasi_umum: {
          ...documentData.informasi_umum,
          asal_sekolah: resolvedSchool,
          guru: teacherName || documentData.informasi_umum?.guru || profile?.full_name || 'Guru PAUD',
        },
      };

      const safeTopic = finalDocData.informasi_umum?.topik_subtopik?.replace(/[^a-zA-Z0-9]/g, '_') || 'PAUD';

      let blob: Blob;
      let fileName: string;

      if (docType === 'lampiran') {
        blob = await buildRpmLampiranDocxBlob(finalDocData, config);
        fileName = `Lampiran_Observasi_Kelas_${safeTopic}.docx`;
      } else if (docType === 'full') {
        blob = await buildRpmPaudDocxBlob(finalDocData, { ...config, includeLampiran: true });
        fileName = `Paket_Lengkap_RPM_dan_Lampiran_${safeTopic}.docx`;
      } else {
        blob = await buildRpmPaudDocxBlob(finalDocData, { ...config, includeLampiran: false });
        fileName = `RPM_1_Minggu_${safeTopic}.docx`;
      }

      downloadBlob(blob, fileName);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Export DOCX error:', err);
      alert('Gagal mengekspor dokumen Word: ' + String(err));
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full md:max-w-xl bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              docType === 'full'
                ? 'bg-purple-100 text-purple-800'
                : docType === 'lampiran'
                ? 'bg-[#FAF3FB] text-[#522D60]'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {docType === 'full' ? (
                <Layers className="w-5 h-5 text-purple-700" />
              ) : docType === 'lampiran' ? (
                <ClipboardList className="w-5 h-5 text-[#522D60]" />
              ) : (
                <FileText className="w-5 h-5 text-emerald-700" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {docType === 'full'
                  ? 'Ekspor Paket Lengkap: RPM + 4 Lampiran (.docx)'
                  : docType === 'lampiran'
                  ? 'Unduh 4 Lampiran Observasi Kelas (.docx)'
                  : 'Ekspor Dokumen RPM Utama (.docx)'}
              </h2>
              <p className="text-xs text-slate-500">
                {docType === 'full'
                  ? 'Dokumen RPM bersambung 4 instrumen observasi siap cetak (True-WYSIWYG)'
                  : docType === 'lampiran'
                  ? 'Catatan Anekdot, Matriks SOLO, Hasil Karya, & Foto Berseri Siap Cetak'
                  : 'Standar margin 3-2.5-2-2.5 cm, cantSplit & tblHeader'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Document Type Selector Segmented Control */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Pilihan Format Dokumen yang Diekspor
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {/* Opsi 1: Paket Lengkap (Rekomendasi) */}
              <button
                type="button"
                onClick={() => setDocType('full')}
                className={`py-2.5 px-2.5 rounded-xl text-left transition-all relative flex flex-col justify-between ${
                  docType === 'full'
                    ? 'bg-white text-purple-950 shadow-sm border border-purple-200 ring-2 ring-purple-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="text-xs font-bold">Paket Lengkap</span>
                  </div>
                  <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full font-extrabold uppercase">
                    Rekomendasi
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">
                  RPM + 4 Lampiran True-WYSIWYG (1 File)
                </p>
              </button>

              {/* Opsi 2: RPM Utama Saja */}
              <button
                type="button"
                onClick={() => setDocType('rpm')}
                className={`py-2.5 px-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                  docType === 'rpm'
                    ? 'bg-white text-emerald-950 shadow-sm border border-emerald-200 ring-2 ring-emerald-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold">RPM Utama</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">
                  Hanya Perencanaan Pembelajaran 6 Hari
                </p>
              </button>

              {/* Opsi 3: 4 Lampiran Saja */}
              <button
                type="button"
                onClick={() => setDocType('lampiran')}
                className={`py-2.5 px-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                  docType === 'lampiran'
                    ? 'bg-white text-[#522D60] shadow-sm border border-[#522D60]/20 ring-2 ring-[#522D60]/30 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <ClipboardList className="w-4 h-4 text-[#522D60] shrink-0" />
                  <span className="text-xs font-bold">4 Lampiran</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">
                  Hanya Instrumen Asesmen & Observasi
                </p>
              </button>
            </div>
          </div>

          {/* Paper Size Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Ukuran Kertas Dokumen
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPageSize('A4')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                  pageSize === 'A4'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-950 ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">A4 Standard</div>
                  <div className="text-xs text-slate-500 mt-0.5">210 × 297 mm</div>
                </div>
                {pageSize === 'A4' && <Check className="w-4 h-4 text-blue-600 mt-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setPageSize('F4_FOLIO')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                  pageSize === 'F4_FOLIO'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-950 ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">F4 / Folio (Indonesia)</div>
                  <div className="text-xs text-slate-500 mt-0.5">215 × 330 mm</div>
                </div>
                {pageSize === 'F4_FOLIO' && <Check className="w-4 h-4 text-blue-600 mt-0.5" />}
              </button>
            </div>
          </div>

          {/* Signature Block Settings */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-slate-500" /> Kolom Pengesahan Tanda Tangan
              </label>
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {includeSignatures && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 sm:space-y-0">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Kota / Domisili:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tanggal Dokumen:</label>
                  <input
                    type="text"
                    value={documentDate}
                    onChange={(e) => setDocumentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Kepala Satuan PAUD:</label>
                  <input
                    type="text"
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NIP Kepala Satuan:</label>
                  <input
                    type="text"
                    value={principalNip}
                    onChange={(e) => setPrincipalNip(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Guru Kelas:</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NIP Guru Kelas:</label>
                  <input
                    type="text"
                    value={teacherNip}
                    onChange={(e) => setTeacherNip(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className={`px-6 py-2.5 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
              docType === 'full'
                ? 'bg-purple-700 hover:bg-purple-800 ring-1 ring-purple-600 shadow-purple-200'
                : docType === 'lampiran'
                ? 'bg-[#522D60] hover:bg-[#693774]'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {docType === 'full'
              ? 'Unduh Paket Lengkap RPM + Lampiran (.docx)'
              : docType === 'lampiran'
              ? 'Unduh 4 Lampiran (.docx)'
              : 'Unduh Dokumen RPM Utama (.docx)'}
          </button>
        </div>
      </div>
    </div>
  );
};
