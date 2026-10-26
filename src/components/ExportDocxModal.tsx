import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import { 
  FileDown, 
  X, 
  Check, 
  Settings2, 
  Printer, 
  Building2, 
  UserCheck, 
  Loader2 
} from 'lucide-react';
import { buildRpmPaudDocxBlob, RpmPaudDocData, DocxExportConfig } from '../lib/docx-engine/docx-paud-builder';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentData: RpmPaudDocData;
  schoolName?: string;
}

export const ExportDocxModal: React.FC<Props> = ({
  isOpen,
  onClose,
  documentData,
  schoolName = 'TK NEGERI PEMBINA 01',
}) => {
  const [pageSize, setPageSize] = useState<'A4' | 'F4_FOLIO'>('A4');
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [city, setCity] = useState('Jakarta');
  const [documentDate, setDocumentDate] = useState('14 Juli 2026');
  const [principalName, setPrincipalName] = useState('Hj. Siti Rahayu, M.Pd.');
  const [principalNip, setPrincipalNip] = useState('197508122002122001');
  const [teacherName, setTeacherName] = useState(documentData.informasi_umum?.guru || 'Dewi Rahmawati, S.Pd.');
  const [teacherNip, setTeacherNip] = useState('198906142015032002');
  const [isExporting, setIsExporting] = useState(false);

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

      const blob = await buildRpmPaudDocxBlob(documentData, config);
      const fileName = `RPM_1_Minggu_${documentData.informasi_umum?.topik_subtopik?.replace(/[^a-zA-Z0-9]/g, '_') || 'PAUD'}.docx`;

      saveAs(blob, fileName);

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
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ekspor Dokumen Microsoft Word (.docx)</h2>
              <p className="text-xs text-slate-500">Standar margin 3-2.5-2-2.5 cm, cantSplit & tblHeader</p>
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
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Unduh Berkas .DOCX Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
