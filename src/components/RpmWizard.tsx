import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGeminiKeys } from '../hooks/useGeminiKeys';
import { DATA_8_DPL, MASTER_CP_PAUD, REKOMENDASI_LOOSE_PARTS, SubelemenCP } from '../data/cp_paud_data';
import { invokeGenerateWithRetry } from '../lib/invokeWithRetry';
import { assembleDynamicUserPrompt, requestAiRekomendasiTopik } from '../lib/gemini-rpm-engine';
import { RpmPaudDocData } from '../lib/docx-engine/docx-paud-builder';
import { LiveProgressIndicator } from './LiveProgressIndicator';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Layers, 
  BookOpen, 
  Package, 
  KeyRound, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onDocumentGenerated: (docData: RpmPaudDocData) => void;
  onOpenKeyModal: () => void;
}

export const RpmWizard: React.FC<Props> = ({ onDocumentGenerated, onOpenKeyModal }) => {
  const { user, profile } = useAuth();
  const { activeKeys } = useGeminiKeys(user?.id);

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State - Step 1: Identitas
  const [guru, setGuru] = useState(profile?.full_name || 'Dewi Rahmawati, S.Pd.');
  const [asalSekolah, setAsalSekolah] = useState(profile?.school_name || 'TK NEGERI PEMBINA 01');
  const [jenjangKelas, setJenjangKelas] = useState<'A (4-5 Tahun)' | 'B (5-6 Tahun)'>('A (4-5 Tahun)');
  const [semester, setSemester] = useState('1 (Gasal)');
  const [mingguKe, setMingguKe] = useState('1');
  const [bulan, setBulan] = useState('Juli 2026');
  const [alokasiWaktu, setAlokasiWaktu] = useState('6 x 3 JP');
  const [modelPembelajaran, setModelPembelajaran] = useState('Sentra');
  const [jumlahAnak, setJumlahAnak] = useState('15');
  const [topikSubtopik, setTopikSubtopik] = useState('Identitas / Diriku (Aku Istimewa: Ayo Kita Berkenalan)');

  // Form State - Step 2: 8 DPL
  const [dplSelected, setDplSelected] = useState<string[]>([
    'DPL1', 'DPL2', 'DPL3', 'DPL4', 'DPL5', 'DPL6', 'DPL7', 'DPL8'
  ]);

  // Form State - Step 3: CP & Loose Parts
  const [selectedSubElements, setSelectedSubElements] = useState<SubelemenCP[]>([
    MASTER_CP_PAUD[1].subelemen[0], // JD-1
    MASTER_CP_PAUD[1].subelemen[3], // JD-4
    MASTER_CP_PAUD[2].subelemen[0], // STEAM-1
  ]);
  const [selectedLooseParts, setSelectedLooseParts] = useState<string[]>([
    'Kardus bekas berbagai ukuran & bentuk',
    'Piring kertas & gelas kertas',
    'Stik es krim kayu',
    'Tutup botol plastik warna-warni',
    'Daun kering aneka bentuk',
  ]);
  const [catatanGuru, setCatatanGuru] = useState('');

  // Generation State - Step 4
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState(1);
  const [progressMessage, setProgressMessage] = useState('');
  const [usedModel, setUsedModel] = useState('gemini-3.6-flash');
  const [usedKeyMasked, setUsedKeyMasked] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // AI Recommendation State (Topik -> DPL, CP & Loose Parts)
  const [isRecommending, setIsRecommending] = useState(false);
  const [aiRecommendationNote, setAiRecommendationNote] = useState<string | null>(null);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  const handleRequestAiRecommendation = async () => {
    if (!topikSubtopik.trim()) {
      setRecommendError('Silakan ketikkan topik pembelajaran terlebih dahulu.');
      return;
    }

    if (activeKeys.length === 0) {
      onOpenKeyModal();
      return;
    }

    setRecommendError(null);
    setIsRecommending(true);
    try {
      const res = await requestAiRekomendasiTopik(activeKeys, topikSubtopik, jenjangKelas);

      // 1. Map DPL
      if (res.dpl_codes && res.dpl_codes.length > 0) {
        setDplSelected(res.dpl_codes);
      }

      // 2. Map Subelemen CP
      if (res.subelemen_codes && res.subelemen_codes.length > 0) {
        const matchedSubs: SubelemenCP[] = [];
        MASTER_CP_PAUD.forEach((el) => {
          el.subelemen.forEach((sub) => {
            if (res.subelemen_codes.includes(sub.kode)) {
              matchedSubs.push(sub);
            }
          });
        });
        if (matchedSubs.length > 0) {
          setSelectedSubElements(matchedSubs);
        }
      }

      // 3. Map Loose Parts
      if (res.loose_parts && res.loose_parts.length > 0) {
        setSelectedLooseParts(res.loose_parts);
      }

      setAiRecommendationNote(
        res.alasan_singkat ||
          'Rekomendasi DPL, CP verbatim, dan bahan loose parts berhasil diterapkan ke Langkah 2 & 3!'
      );

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error('AI Recommendation error:', err);
      setRecommendError(err.message || 'Gagal memanggil rekomendasi AI.');
    } finally {
      setIsRecommending(false);
    }
  };

  // Toggle DPL selection
  const toggleDpl = (kode: string) => {
    if (dplSelected.includes(kode)) {
      setDplSelected(dplSelected.filter((d) => d !== kode));
    } else {
      setDplSelected([...dplSelected, kode]);
    }
  };

  // Toggle SubElement selection
  const toggleSubElement = (sub: SubelemenCP) => {
    const exists = selectedSubElements.some((s) => s.kode === sub.kode);
    if (exists) {
      setSelectedSubElements(selectedSubElements.filter((s) => s.kode !== sub.kode));
    } else {
      setSelectedSubElements([...selectedSubElements, sub]);
    }
  };

  // Toggle Loose Parts
  const toggleLoosePart = (item: string) => {
    if (selectedLooseParts.includes(item)) {
      setSelectedLooseParts(selectedLooseParts.filter((p) => p !== item));
    } else {
      setSelectedLooseParts([...selectedLooseParts, item]);
    }
  };

  // Execute Generation
  const handleGenerate = async () => {
    if (activeKeys.length === 0) {
      setGenerationError('Anda belum mendaftarkan API Key Gemini. Buka tombol "Kunci BYOK" di kanan atas untuk menambahkan.');
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);
    setProgressStage(1);
    setProgressMessage('Membaca regulasi kurikulum PAUD & merakit parameter...');

    try {
      const userPrompt = assembleDynamicUserPrompt({
        guru,
        asal_sekolah: asalSekolah,
        fase: 'Fondasi',
        jenjang_kelas: jenjangKelas,
        semester,
        minggu_ke: mingguKe,
        bulan,
        alokasi_waktu: alokasiWaktu,
        model_pembelajaran: modelPembelajaran,
        jumlah_anak: jumlahAnak,
        topik_subtopik: topikSubtopik,
        dpl_selected: dplSelected,
        subelemen_selected: selectedSubElements,
        loose_parts_selected: selectedLooseParts,
        catatan_guru: catatanGuru,
      });

      const res = await invokeGenerateWithRetry(
        {
          userPrompt,
          customKeys: activeKeys,
        },
        {
          onProgress: (p) => {
            if (p.phase === 'connecting') {
              setProgressStage(2);
              setProgressMessage(p.message || 'Dokumen Perangkat Pembelajaran Anda sedang dibuat...');
            } else if (p.phase === 'generating') {
              setProgressStage(3);
              setProgressMessage('Dokumen Perangkat Pembelajaran Anda sedang dibuat...');
            } else if (p.phase === 'completed') {
              setProgressStage(4);
              setProgressMessage('Dokumen Perangkat Pembelajaran Anda selesai disusun!');
            }
          },
        }
      );

      setUsedModel(res.usedModel);
      setUsedKeyMasked(res.usedKeyMasked);

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Pass result to parent preview
      setTimeout(() => {
        setIsGenerating(false);
        onDocumentGenerated(res.data);
      }, 600);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setIsGenerating(false);
      setGenerationError(err.message || 'Gagal menyusun dokumen. Silakan periksa koneksi atau kunci API Anda.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Step Navigation Stepper */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Identitas', desc: 'Kelas & Topik' },
            { step: 2, title: 'Target 8 DPL', desc: 'Profil Lulusan' },
            { step: 3, title: 'Capaian & Loose Parts', desc: 'Bahan Main' },
            { step: 4, title: 'Eksekusi AI', desc: '18 Kegiatan' },
          ].map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div 
                key={s.step} 
                onClick={() => !isGenerating && setCurrentStep(s.step)}
                className={`flex items-center gap-2.5 cursor-pointer select-none transition-colors ${
                  isCurrent ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#522D60] text-white ring-4 ring-[#FAF3FB]'
                      : 'bg-slate-100 text-[#74607B]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <div className="hidden sm:block text-left">
                  <div className={`text-xs font-bold ${isCurrent ? 'text-[#2A1532]' : 'text-slate-600'}`}>
                    {s.title}
                  </div>
                  <div className="text-[10px] text-slate-400">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: IDENTITAS DOKUMEN */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-700" /> Langkah 1: Identitas Dokumen & Karakteristik Kelas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tentukan satuan pendidikan, usia anak, alokasi waktu, serta tema topik pembelajaran.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Guru Pendidik:</label>
              <input
                type="text"
                value={guru}
                onChange={(e) => setGuru(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Asal Satuan PAUD / TK:</label>
              <input
                type="text"
                value={asalSekolah}
                onChange={(e) => setAsalSekolah(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Jenjang Kelas dengan DAP Guidance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenjang / Usia Anak:</label>
              <select
                value={jenjangKelas}
                onChange={(e) => setJenjangKelas(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
              >
                <option value="A (4-5 Tahun)">Kelompok A (4-5 Tahun) — Pola Dasar Siap Pijakan Guru</option>
                <option value="B (5-6 Tahun)">Kelompok B (5-6 Tahun) — Menggunting Mandiri & Merakit</option>
              </select>
              <p className="text-[11px] text-blue-800 mt-1.5 bg-blue-50 p-2 rounded-lg leading-relaxed">
                ℹ️ <strong>DAP Info:</strong> AI akan menyesuaikan instruksi langkah kegiatan sesuai kemampuan motorik halus jenjang <strong>{jenjangKelas}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Semester & Minggu Ke-:</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="1 (Gasal)">Semester 1 (Gasal)</option>
                  <option value="2 (Genap)">Semester 2 (Genap)</option>
                </select>
                <input
                  type="text"
                  placeholder="Minggu ke-..."
                  value={mingguKe}
                  onChange={(e) => setMingguKe(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Bulan Pelaksanaan & Alokasi:</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
                <input
                  type="text"
                  value={alokasiWaktu}
                  onChange={(e) => setAlokasiWaktu(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Model Pembelajaran & Jumlah Anak:</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={modelPembelajaran}
                  onChange={(e) => setModelPembelajaran(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Sentra">Model Sentra</option>
                  <option value="Kelompok dengan Pengaman">Kelompok (Sudut)</option>
                  <option value="Area">Model Area</option>
                  <option value="Proyek Bermain">Bermain Proyek</option>
                </select>
                <input
                  type="number"
                  value={jumlahAnak}
                  onChange={(e) => setJumlahAnak(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Topik / Subtopik Pembelajaran 1 Minggu:</label>
              <input
                type="text"
                value={topikSubtopik}
                onChange={(e) => {
                  setTopikSubtopik(e.target.value);
                  setAiRecommendationNote(null);
                  setRecommendError(null);
                }}
                placeholder="Contoh: Identitas / Diriku (Aku Istimewa: Ayo Kita Berkenalan)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-blue-950 focus:ring-2 focus:ring-[#522D60] focus:outline-none"
              />

              {/* Rekomendasi AI Smart Assistant Card */}
              <div className="mt-3 bg-gradient-to-r from-[#FAF3FB] to-[#F3E8F5] p-3.5 rounded-2xl border border-[#522D60]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#522D60] text-pink-300 flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2A1532] flex items-center gap-1.5">
                      Rekomendasi AI Otomatis
                      <span className="text-[10px] bg-[#522D60] text-white px-1.5 py-0.2 rounded-full font-bold">Smart</span>
                    </div>
                    <div className="text-[11px] text-[#74607B] leading-tight mt-0.5">
                      Pilihkan DPL, Capaian Pembelajaran verbatim, dan Loose Parts yang paling cocok untuk topik ini.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRequestAiRecommendation}
                  disabled={isRecommending || !topikSubtopik.trim()}
                  className="px-4 py-2 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  {isRecommending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-300" />
                      <span>Menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                      <span>Rekomendasikan AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Banner Rekomendasi Sukses */}
              {aiRecommendationNote && (
                <div className="mt-2.5 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 animate-fade-in shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-950">Rekomendasi Berhasil Diterapkan!</span>
                      <span className="text-[10px] bg-emerald-200/70 text-emerald-800 px-2 py-0.2 rounded-full font-bold">Langkah 2 & 3 Terisi</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed italic">
                      "{aiRecommendationNote}"
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold border border-emerald-200">
                        ✓ {dplSelected.length} DPL Terpilih
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-lg text-[10px] font-bold border border-blue-200">
                        ✓ {selectedSubElements.length} Subelemen CP
                      </span>
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold border border-amber-200">
                        ✓ {selectedLooseParts.length} Bahan Loose Parts
                      </span>
                      <span className="text-[10px] text-slate-500 italic">
                        (Anda tetap bebas mengubahnya di Langkah 2 & 3)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {recommendError && (
                <div className="mt-2.5 p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{recommendError}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              Lanjut ke Target 8 DPL <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 8 DIMENSI PROFIL LULUSAN (DPL) */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" /> Langkah 2: Target 8 Dimensi Profil Lulusan (DPL)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Permendikdasmen No. 10/2025. Dimensi yang dicentang wajib terintegrasi di 18 kegiatan main dan asesmen.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDplSelected(DATA_8_DPL.map((d) => d.kode))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Pilih Semua (8)
              </button>
              <button
                type="button"
                onClick={() => setDplSelected(['DPL1', 'DPL2', 'DPL3', 'DPL4', 'DPL5', 'DPL7', 'DPL8'])}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Reset Default (7)
              </button>
            </div>
          </div>

          {/* DPL Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {DATA_8_DPL.map((dpl) => {
              const isSelected = dplSelected.includes(dpl.kode);
              return (
                <label
                  key={dpl.kode}
                  onClick={() => toggleDpl(dpl.kode)}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Controlled by label click
                    className="w-4 h-4 rounded text-blue-600 mt-1 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{dpl.kode}: {dpl.nama}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {dpl.fokus_paud}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              Lanjut ke Capaian & Loose Parts <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CAPAIAN PEMBELAJARAN & LOOSE PARTS */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" /> Langkah 3: Capaian Pembelajaran Verbatim & Bahan Loose Parts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih subelemen CP dari Keputusan BSKAP No. 046/H/KR/2025 dan material lepasan yang tersedia di sekolah.
            </p>
          </div>

          {/* SubElement Selector by Category */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Pilih Subelemen Capaian Pembelajaran ({selectedSubElements.length} Terpilih):
            </label>

            {MASTER_CP_PAUD.map((elemen) => (
              <div key={elemen.nama_elemen} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800 border-b border-slate-200">
                  {elemen.nama_elemen}
                </div>
                <div className="p-3 space-y-2 bg-slate-50/50">
                  {elemen.subelemen.map((sub) => {
                    const isSelected = selectedSubElements.some((s) => s.kode === sub.kode);
                    return (
                      <div
                        key={sub.kode}
                        onClick={() => toggleSubElement(sub)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-medium'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-blue-600 mt-0.5 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#522D60]">[{sub.kode}]</span> {sub.subelemen}
                            <div className="text-[11px] text-slate-500 mt-1">
                              <strong>Indikator:</strong> {sub.indikator_ketercapaian.join('; ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Loose Parts Selection Pills */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Pilih Bahan Material Lepasan (Loose Parts) yang Tersedia:
            </label>
            <div className="flex flex-wrap gap-2">
              {REKOMENDASI_LOOSE_PARTS.map((item) => {
                const isSelected = selectedLooseParts.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleLoosePart(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catatan Konteks Lokal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catatan Khusus / Konteks Lokal Sekolah (Opsional):
            </label>
            <textarea
              rows={2}
              value={catatanGuru}
              onChange={(e) => setCatatanGuru(e.target.value)}
              placeholder="Contoh: Fokus pada kebiasaan menyapa sopan, dekat dengan kebun sekolah, anak suka bermain pasir."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              Lanjut ke Ringkasan & Eksekusi <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: KONFIRMASI & EKSEKUSI AI GENERATOR */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          {isGenerating ? (
            <LiveProgressIndicator
              currentStage={progressStage}
              statusMessage={progressMessage}
              usedModel={usedModel}
              keyMasked={usedKeyMasked}
            />
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-700" /> Langkah 4: Konfirmasi & Mulai Perumusan RPM
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tinjau kembali parameter sebelum AI merumuskan 18 kegiatan main, alat bahan, dan rubrik asesmen.
                </p>
              </div>

              {/* Summary Checklist */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><strong>Satuan PAUD:</strong> {asalSekolah}</div>
                  <div><strong>Jenjang:</strong> {jenjangKelas}</div>
                  <div><strong>Guru:</strong> {guru}</div>
                  <div><strong>Waktu:</strong> {semester} • Minggu ke-{mingguKe}</div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <strong className="text-blue-950">Topik / Subtopik:</strong> {topikSubtopik}
                </div>
                <div>
                  <strong>Dimensi Profil Lulusan ({dplSelected.length}):</strong>{' '}
                  <span className="text-slate-600">{dplSelected.join(', ')}</span>
                </div>
                <div>
                  <strong>Subelemen CP ({selectedSubElements.length}):</strong>{' '}
                  <span className="text-slate-600">{selectedSubElements.map((s) => s.kode).join(', ')}</span>
                </div>
                <div>
                  <strong>Material Loose Parts:</strong>{' '}
                  <span className="text-slate-600">{selectedLooseParts.slice(0, 4).join(', ')}...</span>
                </div>
              </div>

              {/* API Key Status Guard */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                activeKeys.length > 0 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <KeyRound className={`w-5 h-5 shrink-0 mt-0.5 ${activeKeys.length > 0 ? 'text-emerald-700' : 'text-amber-700'}`} />
                <div className="text-xs leading-relaxed flex-1">
                  {activeKeys.length > 0 ? (
                    <div>
                      <p className="font-bold text-emerald-900">
                        {activeKeys.length} Kunci API Gemini Aktif Terdeteksi
                      </p>
                      Sistem siap melakukan rotasi otomatis jika kuota per menit salah satu kunci mencapai batas (429).
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-amber-900">Belum Ada Kunci API Gemini yang Aktif</p>
                      Silakan masukkan kunci Google Gemini API Anda terlebih dahulu untuk menjalankan inferensi.
                    </div>
                  )}
                </div>
                {activeKeys.length === 0 && (
                  <button
                    type="button"
                    onClick={onOpenKeyModal}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0"
                  >
                    Tambah Kunci
                  </button>
                )}
              </div>

              {/* Error feedback */}
              {generationError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}

              {/* CTA Action Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || activeKeys.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-[#522D60] to-[#80426E] hover:from-[#693774] hover:to-[#9C5586] text-white rounded-xl text-sm font-bold flex items-center gap-2.5 shadow-md shadow-[#522D60]/20 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Susun Dokumen Pembelajaran Mendalam Sekarang</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
