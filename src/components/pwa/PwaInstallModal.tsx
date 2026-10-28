import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Laptop,
  ArrowRight
} from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePwaInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2A1532] to-[#522D60] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-bold border border-white/20">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Pasang Aplikasi Kalandra
              </h3>
              <p className="text-[11px] text-pink-200 mt-0.5">
                Akses cepat dari layar utama HP Android, iPhone, atau Laptop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Logo & App Info */}
          <div className="flex items-center gap-3.5 p-3.5 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB]">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-[#522D60]/20 shrink-0 border border-[#E8D6EB] bg-[#2A1532]">
              <img src="/kalandra_logo.png" alt="Kalandra" className="w-full h-full object-cover scale-[1.05]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm text-[#2A1532] flex items-center gap-1.5">
                <span>KALANDRA PAUD</span>
                <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-[#522D60] text-white uppercase">
                  PWA Native
                </span>
              </div>
              <p className="text-[11px] text-[#74607B] truncate">
                Generator Perencanaan Pembelajaran Mendalam (RPM) TK
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-700 font-bold">
                <span className="inline-flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Bebas Kuota Download
                </span>
                <span>•</span>
                <span>Ukuran Ringan (~2 MB)</span>
              </div>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong>Akses 1-Ketukan dari Home Screen:</strong> Buka langsung dari ikon aplikasi di layar HP tanpa perlu membuka browser atau mengetik alamat website.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-lg bg-purple-50 text-[#522D60] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong>Tampilan Layar Penuh (Fullscreen):</strong> Tanpa address bar dan tombol browser, memberikan kenyamanan bekerja seperti aplikasi Android / iOS native.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong>Hemat Penyimpanan & Selalu Terbaru:</strong> Tidak memenuhi memori memori HP dan selalu terbarui otomatis tanpa perlu update manual di Play Store.
              </div>
            </div>
          </div>

          {/* Platform-Specific Installation Area */}
          {installSuccess || isInstalled ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-extrabold text-sm text-emerald-900">Aplikasi Sudah Terpasang!</h4>
              <p className="text-xs text-emerald-700">
                Kalandra telah siap dibuka langsung dari layar beranda gawai Anda.
              </p>
            </div>
          ) : isIOS ? (
            /* iOS Safari Step-by-Step Guide */
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Smartphone className="w-4 h-4 text-amber-700" />
                <span>Panduan Pasang di iPhone / iPad (Safari):</span>
              </div>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside pl-1">
                <li className="leading-relaxed">
                  Ketuk tombol <strong>Bagikan / Share</strong> (<Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" />) di bilah bawah peramban Safari.
                </li>
                <li className="leading-relaxed">
                  Gulir ke bawah pada menu, lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" />).
                </li>
                <li className="leading-relaxed">
                  Ketuk tombol <strong>"Tambah" (Add)</strong> di sudut kanan atas layar. Ikon Kalandra akan muncul di Home Screen iPhone Anda.
                </li>
              </ol>
            </div>
          ) : isInstallable ? (
            /* Android / Desktop One-Click Install */
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 px-5 bg-gradient-to-r from-[#522D60] to-[#80426E] hover:from-[#693774] hover:to-[#964E81] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-lg shadow-[#522D60]/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FFD38B]" />
                <span>Pasang Aplikasi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-[#74607B]">
                Mendukung Android (Chrome/Edge/Samsung Internet) & Laptop (Windows/Mac/Linux)
              </p>
            </div>
          ) : (
            /* Generic Guide if beforeinstallprompt not yet fired */
            <div className="p-4 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB] space-y-2">
              <div className="text-xs font-bold text-[#522D60] flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-[#80426E]" />
                <span>Cara Memasang di Perangkat Anda:</span>
              </div>
              <p className="text-xs text-[#74607B] leading-relaxed">
                Di browser HP Chrome / Edge: Ketuk menu titik tiga (⋮) di pojok kanan atas, lalu pilih <strong>"Tambahkan ke Layar Utama" (Install App / Add to Home Screen)</strong>.
              </p>
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full mt-2 py-2.5 px-4 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FFD38B]" />
                <span>Coba Pasang Otomatis</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-[#74607B]">
          <span>Kalandra Progressive Web App (PWA)</span>
          <button
            onClick={onClose}
            className="font-bold text-[#522D60] hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
