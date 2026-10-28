import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  ClipboardList, 
  Zap, 
  MessageCircle, 
  Lock, 
  KeyRound,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  highlightPro?: boolean;
}

export type SubscriptionPeriod = '1_bulan' | '6_bulan' | '1_tahun';

export const SubscriptionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  highlightPro = false,
}) => {
  const { user, profile } = useAuth();
  const [period, setPeriod] = useState<SubscriptionPeriod>('1_tahun');
  const [licenseCode, setLicenseCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationMsg, setActivationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Pricing Matrix
  const prices = {
    standar: {
      '1_bulan': { total: 'Rp 19.000', perMonth: 'Rp 19.000/bln', note: 'Ditagih per bulan' },
      '6_bulan': { total: 'Rp 59.000', perMonth: 'Rp 9.800/bln', note: 'Lebih hemat Rp 55.000 (Rp 59.000 total)' },
      '1_tahun': { total: 'Rp 99.000', perMonth: 'Rp 8.250/bln', note: 'Paling hemat 57% (Rp 99.000 total)' },
    },
    pro: {
      '1_bulan': { total: 'Rp 29.000', perMonth: 'Rp 29.000/bln', note: 'Ditagih per bulan' },
      '6_bulan': { total: 'Rp 89.000', perMonth: 'Rp 14.800/bln', note: 'Lebih hemat Rp 85.000 (Rp 89.000 total)' },
      '1_tahun': { total: 'Rp 149.000', perMonth: 'Rp 12.400/bln', note: 'Paling hemat 57% (Rp 149.000 total)' },
    },
  };

  const currentPriceStandar = prices.standar[period];
  const currentPricePro = prices.pro[period];

  const handleOrderWhatsApp = (tierName: 'Standar' | 'Pro', totalCost: string) => {
    const periodLabel = period === '1_bulan' ? '1 Bulan' : period === '6_bulan' ? '6 Bulan' : '1 Tahun';
    const email = user?.email || profile?.email || 'email-guru@example.com';
    const nama = profile?.full_name || 'Guru PAUD';
    const sekolah = profile?.school_name || '-';

    const message = `Halo Admin Kalandra PAUD, saya ingin mengaktifkan langganan aplikasi:\n\n` +
      `• *Paket:* ${tierName}\n` +
      `• *Durasi:* ${periodLabel}\n` +
      `• *Biaya:* ${totalCost}\n` +
      `• *Nama Pendidik:* ${nama}\n` +
      `• *Email Akun:* ${email}\n` +
      `• *Asal PAUD:* ${sekolah}\n\n` +
      `Mohon dibantu info pembayaran via QRIS / Transfer Bank. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    const waNumber = '6288228511309'; // Default nomor admin resmi
    window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');
  };

  const handleClaimLicense = async () => {
    if (!licenseCode.trim()) {
      setActivationMsg({ type: 'error', text: 'Masukkan kode lisensi atau kupon Anda.' });
      return;
    }

    setIsActivating(true);
    setActivationMsg(null);

    // Mock validation / demo activation
    setTimeout(() => {
      setIsActivating(false);
      if (licenseCode.trim().toUpperCase() === 'PROTK2026' || licenseCode.trim().toUpperCase().startsWith('KAL-')) {
        setActivationMsg({
          type: 'success',
          text: 'Selamat! Akun Anda telah berhasil di-upgrade ke Paket PRO Aktif selama 1 Tahun.',
        });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setActivationMsg({
          type: 'error',
          text: 'Kode lisensi tidak valid atau telah digunakan. Hubungi admin WhatsApp untuk bantuan.',
        });
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#2A1532] to-[#522D60] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold border border-white/20">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Pilih Paket Langganan Kalandra</h2>
              <p className="text-xs text-pink-200 mt-0.5">
                Investasi terjangkau untuk perencanaan kurikulum PAUD Mendalam (Deep Learning) berkualitas pengawas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Period Toggle Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF3FB] p-2 rounded-2xl border border-[#522D60]/20">
            <span className="text-xs font-bold text-[#2A1532] px-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#522D60]" /> Pilihan Durasi Paket:
            </span>
            <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setPeriod('1_bulan')}
                className={`py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  period === '1_bulan'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'text-[#74607B] hover:text-[#522D60] hover:bg-white/60'
                }`}
              >
                1 Bulan
              </button>
              <button
                type="button"
                onClick={() => setPeriod('6_bulan')}
                className={`py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all relative cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 ${
                  period === '6_bulan'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'text-[#74607B] hover:text-[#522D60] hover:bg-white/60'
                }`}
              >
                <span>6 Bulan</span>
                <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full font-extrabold whitespace-nowrap">
                  <span className="sm:hidden">-49%</span>
                  <span className="hidden sm:inline">Hemat 49%</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPeriod('1_tahun')}
                className={`py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all relative cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 ${
                  period === '1_tahun'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'text-[#74607B] hover:text-[#522D60] hover:bg-white/60'
                }`}
              >
                <span>1 Tahun</span>
                <span className="text-[9px] bg-emerald-400 text-slate-900 px-1.5 py-0.2 rounded-full font-extrabold whitespace-nowrap">
                  <span className="sm:hidden">-57%</span>
                  <span className="hidden sm:inline">Hemat 57%</span>
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TIER 1: STANDAR */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-slate-900 text-base">Paket Standar</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                    Esensial
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Sangat cocok untuk guru yang fokus menyusun Dokumen RPM Utama mingguan secara mandiri.
                </p>

                <div className="mb-5 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900">{currentPriceStandar.total}</span>
                    <span className="text-xs text-slate-500">/ periode</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Setara {currentPriceStandar.perMonth} • {currentPriceStandar.note}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Generate Dokumen RPM Utama</strong> (6 Hari, 18 Kegiatan Bermain)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Standar Pengawas Lengkap:</strong> IKTP SOLO, Rubrik 4 Skala, Mitigasi Risiko</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Ekspor DOCX True-WYSIWYG:</strong> A4 & Folio F4 Siap Cetak</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                    <span>AI Rekomendasi DPL, CP & Loose Parts (Terkunci)</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                    <span>Dokumen 4 Lampiran Observasi Kelas Siap Cetak (Terkunci)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOrderWhatsApp('Standar', currentPriceStandar.total)}
                className="mt-6 w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Pilih Standar ({currentPriceStandar.total})
              </button>
            </div>

            {/* TIER 2: PRO (BEST VALUE) */}
            <div className="bg-gradient-to-b from-white to-[#FAF3FB] rounded-2xl border-2 border-[#522D60] p-5 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-[#522D60] text-amber-300 text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> PALING REKOMENDASI
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-[#2A1532] text-base flex items-center gap-1.5">
                    Paket PRO
                    <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                  </h3>
                  <span className="text-[10px] bg-[#522D60] text-white px-2.5 py-0.5 rounded-full font-bold">
                    Semua Terbuka
                  </span>
                </div>
                <p className="text-xs text-[#74607B] mb-4">
                  Solusi komplit bagi guru dan satuan PAUD: dokumen utama + seluruh instrumen observasi siap cetak.
                </p>

                <div className="mb-5 pb-4 border-b border-[#E8D6EB]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#522D60]">{currentPricePro.total}</span>
                    <span className="text-xs text-[#74607B]">/ periode</span>
                  </div>
                  <div className="text-[11px] text-[#80426E] font-medium mt-0.5">
                    Setara {currentPricePro.perMonth} • {currentPricePro.note}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 text-xs text-slate-800 font-medium">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Semua Fitur Paket Standar Termasuk</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-[#522D60]">
                    <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span><strong>AI Rekomendasi Otomatis:</strong> DPL, CP Verbatim & Loose Parts</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#522D60]">
                    <ClipboardList className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>4 Dokumen Lampiran Observasi Siap Cetak:</strong> Catatan Anekdot, Ceklis IKTP SOLO, Lembar Karya & Foto Berseri</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Penyimpanan Riwayat Tanpa Batas</strong> di Akun Cloud</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Prioritas Bantuan Admin</strong> via WhatsApp Satgas Guru</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOrderWhatsApp('Pro', currentPricePro.total)}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#522D60] hover:bg-[#693774] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                Langganan Paket PRO ({currentPricePro.total})
              </button>
            </div>
          </div>

          {/* License Code Voucher Input */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-800">Sudah memiliki Kode Lisensi / Voucher?</div>
                <div className="text-[11px] text-slate-500">Masukkan kode aktivasi yang dikirimkan oleh admin untuk aktivasi instan.</div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Contoh: PROTK2026"
                value={licenseCode}
                onChange={(e) => setLicenseCode(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#522D60] w-full sm:w-36"
              />
              <button
                type="button"
                onClick={handleClaimLicense}
                disabled={isActivating || !licenseCode.trim()}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isActivating ? 'Memproses...' : 'Klaim'}
              </button>
            </div>
          </div>

          {activationMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
              activationMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{activationMsg.text}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>* Pembayaran fleksibel via QRIS (Semua E-Wallet/Bank) atau Transfer Rekening.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
