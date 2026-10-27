import React, { useState, useEffect } from 'react';
import { RpmPaudDocData } from '../lib/docx-engine/docx-paud-builder';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  FileText, 
  Clock, 
  Trash2, 
  Printer, 
  Star, 
  ExternalLink, 
  Sparkles, 
  RotateCw,
  Cloud,
  HardDrive,
  Loader2
} from 'lucide-react';

export interface StoredDoc {
  id: string;
  title: string;
  topik: string;
  jenjang: string;
  mingguKe: string;
  createdAt: string;
  isStarred?: boolean;
  isCloud?: boolean;
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
  const { user, isPro } = useAuth();
  const [docs, setDocs] = useState<StoredDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAllHistory = async () => {
    setIsLoading(true);
    try {
      const combinedDocs: StoredDoc[] = [];
      const seenTitles = new Set<string>();

      // 1. Fetch from Supabase generated_documents if user is authenticated
      if (user?.id) {
        try {
          const { data: dbRows, error: dbError } = await supabase
            .from('generated_documents')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!dbError && dbRows) {
            for (const row of dbRows) {
              seenTitles.add(row.title);
              combinedDocs.push({
                id: row.id,
                title: row.title,
                topik: row.topik_subtopik || 'Tema PAUD',
                jenjang: row.jenjang_kelas || 'Kelompok A',
                mingguKe: row.minggu_ke || '1',
                createdAt: new Date(row.created_at).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                }),
                isStarred: row.is_starred || false,
                isCloud: true,
                data: row.document_json,
              });
            }
          }
        } catch (dbErr) {
          console.warn('Error fetching Supabase history:', dbErr);
        }
      }

      // 2. Fetch from LocalStorage fallback
      try {
        const saved = localStorage.getItem('kalandra_saved_rpm_docs');
        if (saved) {
          const localList: StoredDoc[] = JSON.parse(saved);
          for (const localItem of localList) {
            // If not already included from Supabase cloud
            if (!seenTitles.has(localItem.title)) {
              seenTitles.add(localItem.title);
              combinedDocs.push({
                ...localItem,
                isCloud: false,
              });
            }
          }
        }
      } catch (localErr) {
        console.warn('Error reading localStorage history:', localErr);
      }

      setDocs(combinedDocs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllHistory();
  }, [user?.id]);

  const deleteDoc = async (id: string, isCloud?: boolean) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini dari riwayat?')) {
      return;
    }

    // 1. Delete from Supabase if cloud doc
    if (isCloud && user?.id) {
      try {
        await supabase.from('generated_documents').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete from Supabase:', err);
      }
    }

    // 2. Delete from LocalStorage
    try {
      const saved = localStorage.getItem('kalandra_saved_rpm_docs');
      if (saved) {
        const localList: StoredDoc[] = JSON.parse(saved);
        const updatedLocal = localList.filter((d) => d.id !== id);
        localStorage.setItem('kalandra_saved_rpm_docs', JSON.stringify(updatedLocal));
      }
    } catch (e) {}

    // 3. Update component state
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleStar = async (id: string, isCloud?: boolean, currentStarred?: boolean) => {
    const nextStarred = !currentStarred;

    // 1. Update Supabase if cloud doc
    if (isCloud && user?.id) {
      try {
        await supabase
          .from('generated_documents')
          .update({ is_starred: nextStarred })
          .eq('id', id);
      } catch (err) {
        console.error('Failed to star in Supabase:', err);
      }
    }

    // 2. Update LocalStorage
    try {
      const saved = localStorage.getItem('kalandra_saved_rpm_docs');
      if (saved) {
        const localList: StoredDoc[] = JSON.parse(saved);
        const updatedLocal = localList.map((d) => (d.id === id ? { ...d, isStarred: nextStarred } : d));
        localStorage.setItem('kalandra_saved_rpm_docs', JSON.stringify(updatedLocal));
      }
    } catch (e) {}

    // 3. Update state
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, isStarred: nextStarred } : d)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#522D60]" /> Riwayat Dokumen Perencanaan (RPM)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar perencanaan pembelajaran yang tersimpan dan siap diedit atau dicetak ulang sewaktu-waktu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllHistory}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Segarkan Riwayat"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#522D60]' : ''}`} />
          </button>

          <button
            onClick={onNewDocClick}
            className="px-4 py-2.5 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-[#FFD38B]" />
            <span>+ Buat RPM Baru</span>
          </button>
        </div>
      </div>

      {/* Capacity & Tier Bar */}
      <div className="bg-[#FAF3FB] border border-[#E8D6EB] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#522D60] text-white flex items-center justify-center font-bold shrink-0">
            <HardDrive className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#2A1532]">
                Kapasitas Penyimpanan: {docs.length} / {isPro ? 25 : 5} Dokumen
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                isPro ? 'bg-amber-400 text-[#2A1532]' : 'bg-[#D8C3DD] text-[#522D60]'
              }`}>
                {isPro ? 'PRO (Maks. 25)' : 'STANDAR (Maks. 5)'}
              </span>
            </div>
            <p className="text-[11px] text-[#74607B]">
              {isPro
                ? 'Paket PRO aktif dengan batas 25 dokumen tersimpan di komputasi awan.'
                : 'Paket Standar dibatasi maksimal 5 dokumen tersimpan. Tingkatkan ke PRO untuk menyimpan hingga 25 dokumen.'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="w-full h-2 rounded-full bg-[#EFE6F2] overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                docs.length >= (isPro ? 25 : 5) ? 'bg-rose-500' : 'bg-[#522D60]'
              }`}
              style={{ width: `${Math.min(100, (docs.length / (isPro ? 25 : 5)) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-right font-mono text-[#74607B]">
            {Math.round(Math.min(100, (docs.length / (isPro ? 25 : 5)) * 100))}% Terpakai
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#EFE6F2] shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 mx-auto text-[#522D60] animate-spin" />
          <p className="text-xs text-[#74607B]">Memuat riwayat dokumen tersimpan...</p>
        </div>
      ) : docs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-[#D8C3DD] text-[#74607B] space-y-3">
          <FileText className="w-12 h-12 mx-auto text-[#D8C3DD]" />
          <h3 className="text-base font-bold text-[#2A1532]">Belum Ada Riwayat Dokumen Tersimpan</h3>
          <p className="text-xs text-[#74607B] max-w-sm mx-auto">
            Gunakan tab <strong>Penyusun RPM</strong> untuk membuat draf perencanaan pembelajaran 1 minggu pertama Anda.
          </p>
          <button
            onClick={onNewDocClick}
            className="mt-2 px-5 py-2 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
          >
            Mulai Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-[#EFE6F2] shadow-xs hover:border-[#D8C3DD] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF3FB] text-[#522D60] border border-[#E8D6EB]">
                      Minggu ke-{doc.mingguKe} • {doc.jenjang}
                    </span>
                    {doc.isCloud ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1" title="Tersimpan di Cloud Database">
                        <Cloud className="w-2.5 h-2.5" /> Cloud
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1" title="Tersimpan di Penyimpanan Lokal">
                        <HardDrive className="w-2.5 h-2.5" /> Lokal
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleStar(doc.id, doc.isCloud, doc.isStarred)}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                    title={doc.isStarred ? 'Hapus bintang' : 'Beri bintang'}
                  >
                    <Star className={`w-4 h-4 ${doc.isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-[#2A1532] mt-2.5 leading-snug line-clamp-2">
                  {doc.title || doc.topik}
                </h3>
                <p className="text-xs text-[#74607B] mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {doc.createdAt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => deleteDoc(doc.id, doc.isCloud)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenExportModalWithData(doc.data)}
                    className="px-3 py-1.5 rounded-lg border border-[#D8C3DD] hover:bg-[#FAF3FB] text-[#2A1532] text-xs font-semibold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DOCX</span>
                  </button>
                  <button
                    onClick={() => onSelectDoc(doc.data)}
                    className="px-3.5 py-1.5 bg-[#522D60] hover:bg-[#693774] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
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
