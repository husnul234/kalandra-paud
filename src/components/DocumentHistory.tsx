import React, { useState, useEffect } from 'react';
import { RpmPaudDocData } from '../lib/docx-engine/docx-paud-builder';
import { 
  FileText, 
  Clock, 
  Trash2, 
  Printer, 
  Star, 
  ExternalLink, 
  Sparkles, 
  Building2 
} from 'lucide-react';

interface StoredDoc {
  id: string;
  title: string;
  topik: string;
  jenjang: string;
  mingguKe: string;
  createdAt: string;
  isStarred?: boolean;
  data: RpmPaudDocData;
}

interface Props {
  onSelectDoc: (data: RpmPaudDocData) => void;
  onOpenExportModalWithData: (data: RpmPaudDocData) => void;
  onNewDocClick: () => void;
}

export const DocumentHistory: React.FC<Props> = ({
  onSelectDoc,
  onOpenExportModalWithData,
  onNewDocClick,
}) => {
  const [docs, setDocs] = useState<StoredDoc[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kalandra_saved_rpm_docs');
      if (saved) {
        setDocs(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  const deleteDoc = (id: string) => {
    const updated = docs.filter((d) => d.id !== id);
    setDocs(updated);
    localStorage.setItem('kalandra_saved_rpm_docs', JSON.stringify(updated));
  };

  const toggleStar = (id: string) => {
    const updated = docs.map((d) => (d.id === id ? { ...d, isStarred: !d.isStarred } : d));
    setDocs(updated);
    localStorage.setItem('kalandra_saved_rpm_docs', JSON.stringify(updated));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" /> Riwayat Dokumen Perencanaan (RPM)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar perencanaan pembelajaran yang tersimpan dan siap dicetak ulang sewaktu-waktu.
          </p>
        </div>

        <button
          onClick={onNewDocClick}
          className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>+ Buat RPM Baru</span>
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-3">
          <FileText className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">Belum Ada Riwayat Dokumen Tersimpan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Gunakan tab <strong>Penyusun RPM</strong> untuk membuat draf perencanaan pembelajaran 1 minggu pertama Anda.
          </p>
          <button
            onClick={onNewDocClick}
            className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
          >
            Mulai Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                    Minggu ke-{doc.mingguKe} • {doc.jenjang}
                  </span>
                  <button
                    onClick={() => toggleStar(doc.id)}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${doc.isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2.5 leading-snug line-clamp-2">
                  {doc.title || doc.topik}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {doc.createdAt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => deleteDoc(doc.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenExportModalWithData(doc.data)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DOCX</span>
                  </button>
                  <button
                    onClick={() => onSelectDoc(doc.data)}
                    className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <span>Buka Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
