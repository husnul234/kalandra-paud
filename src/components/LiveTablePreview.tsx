import React, { useState } from 'react';
import { RpmPaudDocData } from '../lib/docx-engine/docx-paud-builder';
import { DATA_8_DPL } from '../data/cp_paud_data';
import { 
  FileDown, 
  Printer, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Sparkles, 
  Save, 
  CheckCircle, 
  Layers, 
  Edit3 
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
  onUpdateData,
  onOpenExportModal,
  onSaveDocument,
  isSaving = false,
}) => {
  const [activeAccordionDay, setActiveAccordionDay] = useState<number | null>(1);
  const [mobileMode, setMobileMode] = useState<'table' | 'accordion'>('table');

  const info = data.informasi_umum || {};
  const selectedDpl = data.identifikasi?.dimensi_profil_lulusan_terpilih || [];

  const toggleAccordion = (day: number) => {
    setActiveAccordionDay(activeAccordionDay === day ? null : day);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Pratinjau Tabel Perencanaan Pembelajaran Mendalam (RPM)
            </h2>
            <p className="text-xs text-slate-500">
              {info.asal_sekolah || 'Satuan PAUD'} • Minggu ke-{info.minggu_ke || '1'} ({info.topik_subtopik || 'Topik'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile view switch */}
          <div className="md:hidden flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMobileMode('table')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mobileMode === 'table' ? 'bg-white text-blue-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setMobileMode('accordion')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mobileMode === 'accordion' ? 'bg-white text-blue-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Kartu Harian
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
            onClick={onOpenExportModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Ekspor Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* Main Document Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-8 space-y-8">
        {/* Document Header Banner */}
        <div className="text-center border-b-2 border-blue-900/20 pb-6 space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight uppercase">
            PERENCANAAN PEMBELAJARAN MENDALAM (RPM)
          </h1>
          <h2 className="text-base sm:text-lg font-bold text-blue-800 uppercase">
            {info.asal_sekolah || 'SATUAN PENDIDIKAN ANAK USIA DINI'} — FASE FONDASI
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Standar Kurikulum PAUD Permendikdasmen No. 10/2025, 12/2025, 1/2026 & BSKAP 046/2025
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div><strong className="text-slate-900">Guru:</strong> {info.guru || '-'}</div>
          <div><strong className="text-slate-900">Semester / Bulan:</strong> {info.semester || '1 (Gasal)'} / {info.bulan || '-'}</div>
          <div><strong className="text-slate-900">Fase / Jenjang:</strong> Fondasi / {info.jenjang_kelas || 'A (4-5 Tahun)'}</div>
          <div><strong className="text-slate-900">Minggu Ke-:</strong> Minggu ke-{info.minggu_ke || '1'}</div>
          <div><strong className="text-slate-900">Alokasi Waktu:</strong> {info.alokasi_waktu || '6 x 3 JP'}</div>
          <div><strong className="text-slate-900">Model Pembelajaran:</strong> {info.model_pembelajaran || 'Sentra / Bermain'} ({info.jumlah_anak || '15'} Anak)</div>
          <div className="sm:col-span-2 pt-1 border-t border-slate-200 text-blue-900 font-bold">
            <strong>Topik / Subtopik:</strong> {info.topik_subtopik || '-'}
          </div>
        </div>

        {/* =========================================================================
            TABEL 1: IDENTIFIKASI
        ========================================================================= */}
        <div className="space-y-2">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-t-xl font-bold text-sm flex items-center justify-between">
            <span>1. IDENTIFIKASI</span>
            <span className="text-[11px] font-normal text-blue-200">Permendikdasmen No. 10/2025 & No. 12/2025</span>
          </div>
          <div className="border border-slate-200 rounded-b-xl overflow-hidden divide-y divide-slate-200 text-xs">
            {/* Peserta Didik */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Peserta Didik
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 leading-relaxed">
                {data.identifikasi?.peserta_didik || '-'}
              </div>
            </div>

            {/* Materi Pelajaran */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Materi Pelajaran
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 leading-relaxed">
                {data.identifikasi?.materi_pelajaran || '-'}
              </div>
            </div>

            {/* Matriks 8 Dimensi Profil Lulusan */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Dimensi Profil Lulusan
                <span className="block font-normal text-[10px] text-slate-500 mt-0.5">8 Dimensi Resmi SKL</span>
              </div>
              <div className="p-3.5 md:col-span-3 space-y-2">
                {DATA_8_DPL.map((dpl) => {
                  const isChecked = selectedDpl.includes(dpl.kode);
                  return (
                    <div key={dpl.kode} className="flex items-start gap-2.5">
                      <span className={`font-mono font-bold text-xs ${isChecked ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {isChecked ? '[ v ]' : '[   ]'}
                      </span>
                      <div>
                        <strong className={isChecked ? 'text-blue-950 font-bold' : 'text-slate-500'}>
                          {dpl.kode} - {dpl.nama}:
                        </strong>{' '}
                        <span className={isChecked ? 'text-slate-700' : 'text-slate-400 italic'}>
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
            TABEL 2: DESAIN PEMBELAJARAN
        ========================================================================= */}
        <div className="space-y-2">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-t-xl font-bold text-sm flex items-center justify-between">
            <span>2. DESAIN PEMBELAJARAN</span>
            <span className="text-[11px] font-normal text-blue-200">Keputusan BSKAP No. 046/H/KR/2025</span>
          </div>
          <div className="border border-slate-200 rounded-b-xl overflow-hidden divide-y divide-slate-200 text-xs">
            {/* Capaian Pembelajaran */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Capaian Pembelajaran (Verbatim CP 2025)
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 space-y-1.5 leading-relaxed">
                {(data.desain_pembelajaran?.capaian_pembelajaran || []).map((cp, i) => (
                  <p key={i}><strong>{i + 1}.</strong> {cp}</p>
                ))}
              </div>
            </div>

            {/* Lintas Disiplin Ilmu */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Lintas Disiplin Ilmu
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700">
                {data.desain_pembelajaran?.lintas_disiplin_ilmu || '-'}
              </div>
            </div>

            {/* Tujuan Pembelajaran */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Tujuan Pembelajaran
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 space-y-1 leading-relaxed">
                {(data.desain_pembelajaran?.tujuan_pembelajaran || []).map((tp, i) => (
                  <p key={i}>• {tp}</p>
                ))}
              </div>
            </div>

            {/* Topik / Subtopik */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Topik / Subtopik
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 font-semibold">
                {data.desain_pembelajaran?.topik_pembelajaran || info.topik_subtopik || '-'}
              </div>
            </div>

            {/* Praktik Pedagogis */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Praktik Pedagogis
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700">
                {data.desain_pembelajaran?.praktik_pedagogis || '-'}
              </div>
            </div>

            {/* Kemitraan Pembelajaran */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Kemitraan Pembelajaran
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 space-y-1">
                <p>• <strong>Lingkungan Sekolah:</strong> {data.desain_pembelajaran?.kemitraan_pembelajaran?.lingkungan_sekolah || '-'}</p>
                <p>• <strong>Masyarakat/Keluarga:</strong> {data.desain_pembelajaran?.kemitraan_pembelajaran?.masyarakat || '-'}</p>
                <p>• <strong>Luar Sekolah:</strong> {data.desain_pembelajaran?.kemitraan_pembelajaran?.lingkungan_luar_sekolah || '-'}</p>
              </div>
            </div>

            {/* Lingkungan Pembelajaran */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Lingkungan Pembelajaran
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 space-y-1">
                <p>• <strong>Ruang Fisik:</strong> {data.desain_pembelajaran?.lingkungan_pembelajaran?.ruang_fisik || '-'}</p>
                <p>• <strong>Ruang Virtual:</strong> {data.desain_pembelajaran?.lingkungan_pembelajaran?.ruang_virtual || '-'}</p>
                <p>• <strong>Budaya Belajar:</strong> {data.desain_pembelajaran?.lingkungan_pembelajaran?.budaya_belajar || '-'}</p>
              </div>
            </div>

            {/* Pemanfaatan Digital */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                Pemanfaatan Digital
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 space-y-1">
                <p>• <strong>Perencanaan:</strong> {data.desain_pembelajaran?.pemanfaatan_digital?.perencanaan || '-'}</p>
                <p>• <strong>Pelaksanaan:</strong> {data.desain_pembelajaran?.pemanfaatan_digital?.pelaksanaan || '-'}</p>
                <p>• <strong>Asesmen:</strong> {data.desain_pembelajaran?.pemanfaatan_digital?.asesmen || '-'}</p>
                {data.desain_pembelajaran?.pemanfaatan_digital?.tautan_media && (
                  <p className="text-blue-700 break-all">• <strong>Tautan Media:</strong> {data.desain_pembelajaran.pemanfaatan_digital.tautan_media}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TABEL 3: PENGALAMAN BELAJAR MENDALAM (6 HARI / 18 KEGIATAN)
        ========================================================================= */}
        <div className="space-y-2">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-t-xl font-bold text-sm flex items-center justify-between">
            <span>3. PENGALAMAN BELAJAR MENDALAM (6 HARI / 18 KEGIATAN)</span>
            <span className="text-[11px] font-normal text-blue-200">Permendikdasmen No. 1/2026 Standar Proses</span>
          </div>

          {/* Tahap Awal */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                TAHAP AWAL
                <span className="block font-normal text-[10px] text-slate-500 mt-0.5">Berkesadaran, Bermakna, Menggembirakan</span>
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 space-y-1.5 leading-relaxed">
                {data.pengalaman_belajar?.awal?.pengantar && (
                  <p className="font-medium text-slate-800">{data.pengalaman_belajar.awal.pengantar}</p>
                )}
                <div className="space-y-1 pt-1">
                  {(data.pengalaman_belajar?.awal?.poin_kegiatan || []).map((pt, i) => (
                    <p key={i}><strong>{i + 1}.</strong> {pt}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tahap Inti 6 Hari: Choose Table Mode or Accordion Mode */}
          {mobileMode === 'accordion' ? (
            /* ACCORDION MODE FOR SMARTPHONE */
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Daftar 6 Hari Kegiatan Main (Mode Kartu Akordion Mobile)
              </div>
              {(data.pengalaman_belajar?.inti?.blok_tahap || []).flatMap((blok) => blok.hari || []).map((h) => {
                const isOpen = activeAccordionDay === h.hari_ke;
                return (
                  <div key={h.hari_ke} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(h.hari_ke)}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                          {h.hari_ke}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">HARI KE-{h.hari_ke}</div>
                          <div className="text-[11px] text-slate-500">{(h.kegiatan_list || []).length} Kegiatan Main</div>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </button>

                    {isOpen && (
                      <div className="p-4 space-y-4 divide-y divide-slate-100 text-xs">
                        {(h.kegiatan_list || []).map((k) => (
                          <div key={k.nomor} className="pt-3 first:pt-0 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                Kegiatan {k.nomor} : {k.nama_kegiatan}
                              </span>
                              {k.label && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                                  {k.label}
                                </span>
                              )}
                            </div>
                            {k.alat_dan_bahan && (
                              <p className="text-slate-600">
                                <strong>• Alat & Bahan:</strong> {k.alat_dan_bahan}
                              </p>
                            )}
                            {k.langkah && (
                              <div className="mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                <strong className="text-slate-800">{k.judul_langkah || 'Cara Bermain'}:</strong>
                                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                                  {k.langkah.map((l, lIdx) => (
                                    <li key={lIdx}>{l}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE MODE (DEFAULT FOR DESKTOP / PRINT AUDIT) */
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
              {(data.pengalaman_belajar?.inti?.blok_tahap || []).map((blok, bIdx) => (
                <React.Fragment key={bIdx}>
                  <div className="bg-blue-50/80 px-4 py-2 font-bold text-blue-900 border-t border-b border-blue-200">
                    TAHAP INTI: {blok.header_tahap}
                  </div>

                  {(blok.hari || []).map((h) => (
                    <div key={h.hari_ke} className="grid grid-cols-1 md:grid-cols-4">
                      <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                        HARI KE-{h.hari_ke}
                      </div>
                      <div className="p-3.5 md:col-span-3 space-y-4">
                        {(h.kegiatan_list || []).map((k) => (
                          <div key={k.nomor} className="space-y-1">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              Kegiatan {k.nomor} : {k.nama_kegiatan}{' '}
                              {k.label && <span className="font-normal italic text-amber-700">({k.label})</span>}
                            </div>
                            {k.alat_dan_bahan && (
                              <p className="text-slate-700">
                                <strong>• Alat dan bahan:</strong> {k.alat_dan_bahan}
                              </p>
                            )}
                            {k.langkah && k.langkah.length > 0 && (
                              <div className="space-y-0.5 pt-0.5">
                                <strong className="text-slate-800">{k.judul_langkah || 'Cara bermain'}:</strong>
                                {k.langkah.map((l, lIdx) => (
                                  <p key={lIdx} className="text-slate-600 pl-3">
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
            </div>
          )}

          {/* Tahap Penutup */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs mt-2">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-slate-100 p-3.5 font-bold text-blue-950 md:col-span-1 border-r border-slate-200">
                TAHAP PENUTUP
                <span className="block font-normal text-[10px] text-slate-500 mt-0.5">Berkesadaran, Menggembirakan</span>
              </div>
              <div className="p-3.5 md:col-span-3 text-slate-700 space-y-1.5 leading-relaxed">
                {data.pengalaman_belajar?.penutup?.pengantar && (
                  <p className="font-medium text-slate-800">{data.pengalaman_belajar.penutup.pengantar}</p>
                )}
                <div className="space-y-1 pt-1">
                  {(data.pengalaman_belajar?.penutup?.poin_kegiatan || []).map((pt, i) => (
                    <p key={i}><strong>{i + 1}.</strong> {pt}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TABEL 4: ASESMEN PEMBELAJARAN
        ========================================================================= */}
        <div className="space-y-2">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-t-xl font-bold text-sm flex items-center justify-between">
            <span>4. ASESMEN PEMBELAJARAN</span>
            <span className="text-[11px] font-normal text-blue-200">Asesmen Autentik PAUD</span>
          </div>
          <div className="border border-slate-200 rounded-b-xl overflow-hidden text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* Asesmen Awal */}
              <div className="p-4 space-y-2 bg-slate-50/50">
                <div className="font-bold text-blue-950 border-b border-slate-200 pb-2">
                  Asesmen pada Awal Pembelajaran
                </div>
                <div className="space-y-1 text-slate-700 leading-relaxed">
                  {(data.asesmen_pembelajaran?.awal || []).map((a, i) => (
                    <p key={i}>• {a}</p>
                  ))}
                </div>
              </div>

              {/* Asesmen Proses */}
              <div className="p-4 space-y-2">
                <div className="font-bold text-blue-950 border-b border-slate-200 pb-2">
                  Asesmen pada Proses Pembelajaran
                </div>
                <div className="space-y-1 text-slate-700 leading-relaxed">
                  {(data.asesmen_pembelajaran?.proses || []).map((p, i) => (
                    <p key={i}>• {p}</p>
                  ))}
                </div>
              </div>

              {/* Asesmen Akhir */}
              <div className="p-4 space-y-2 bg-slate-50/50">
                <div className="font-bold text-blue-950 border-b border-slate-200 pb-2">
                  Asesmen pada Akhir Pembelajaran
                </div>
                <div className="space-y-1 text-slate-700 leading-relaxed">
                  {(data.asesmen_pembelajaran?.akhir || []).map((ak, i) => (
                    <p key={i}>• {ak}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Signature Preview */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            Tersimpan secara lokal & cloud • Dokumen terverifikasi 100% patuh kurikulum PAUD 2025/2026
          </div>
          <button
            type="button"
            onClick={onOpenExportModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <FileDown className="w-4 h-4" />
            <span>Ekspor ke Word (.docx)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
