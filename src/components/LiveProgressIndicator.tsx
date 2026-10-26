import React from 'react';
import { Loader2, CheckCircle2, Sparkles, KeyRound, Cpu, ShieldCheck } from 'lucide-react';

interface Props {
  currentStage: number; // 1 to 4
  statusMessage: string;
  usedModel?: string;
  keyMasked?: string;
  attempt?: number;
}

const STAGES = [
  { id: 1, label: 'Membaca Regulasi PAUD 2025 & Master CP', icon: ShieldCheck },
  { id: 2, label: 'Koneksi Pool Gemini BYOK (Failover Check)', icon: KeyRound },
  { id: 3, label: 'Menyusun 18 Kegiatan Bermain & Loose Parts 6 Hari', icon: Sparkles },
  { id: 4, label: 'Validasi Skema JSON & Sinkronisasi 8 DPL', icon: Cpu },
];

export const LiveProgressIndicator: React.FC<Props> = ({
  currentStage,
  statusMessage,
  usedModel = 'gemini-3.6-flash',
  keyMasked,
  attempt = 1,
}) => {
  const progressPercent = Math.min(100, Math.round((currentStage / 4) * 100));

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-200/80 p-6 md:p-8 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Merumuskan RPM Pembelajaran Mendalam</h3>
            <p className="text-xs text-slate-500">Menerapkan prinsip Berkesadaran, Bermakna, & Menggembirakan</p>
          </div>
        </div>

        {/* Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 font-mono">
            {usedModel}
          </span>
          {keyMasked && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 font-mono">
              Key: {keyMasked}
            </span>
          )}
          {attempt > 1 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              Percobaan ke-{attempt}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>{statusMessage || 'Sedang memproses...'}</span>
          <span className="text-blue-700 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* 4-Stage Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {STAGES.map((s) => {
          const isDone = currentStage > s.id;
          const isCurrent = currentStage === s.id;
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900'
                  : isCurrent
                  ? 'border-blue-300 bg-blue-50/50 text-blue-950 ring-2 ring-blue-100 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 text-slate-400'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <Icon className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <span className={`text-xs font-medium leading-snug ${isCurrent ? 'font-bold' : ''}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Reassurance Footer */}
      <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
        💡 <strong>Tips:</strong> Proses memakan waktu 15–25 detik untuk menyusun detail lengkap 18 kegiatan main, alat bahan loose parts, dan langkah bermain per hari.
      </div>
    </div>
  );
};
