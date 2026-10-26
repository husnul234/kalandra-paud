import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';

export interface CustomerActivationInfo {
  fullName: string;
  email: string;
  whatsapp: string;
  schoolName: string;
  accountType: string;
  expiryDate?: string;
}

interface ActivationMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerActivationInfo | null;
}

export const ActivationMessageModal: React.FC<ActivationMessageModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !customer) return null;

  const appUrl = window.location.origin;

  const packageLabel =
    customer.accountType === 'lifetime'
      ? 'Akses Penuh Selamanya (Lifetime)'
      : customer.accountType === 'lite'
      ? 'Paket 1 Semester (6 Bulan)'
      : customer.accountType === 'trial'
      ? 'Masa Uji Coba Gratis (Trial)'
      : 'Paket 1 Tahun Ajaran Penuh';

  const messageText = `Halo Ibu/Bapak ${customer.fullName || 'Guru Hebat'} dari ${customer.schoolName || 'Satuan PAUD'},

Akun Generator Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi — *Kalandra PAUD* Anda telah aktif dan siap digunakan! 🎉

📋 *Rincian Akun*:
• Nama: ${customer.fullName}
• Asal Lembaga: ${customer.schoolName || '-'}
• Email Akun: ${customer.email}
• Jenis Paket: ${packageLabel}
${customer.expiryDate ? `• Berlaku Hingga: ${customer.expiryDate}\n` : ''}
🔗 *Tautan Akses Aplikasi*:
${appUrl}

💡 *Fitur Utama Kalandra PAUD*:
✅ Otomasi 18 Kegiatan Bermain Mendalam per Minggu (6 Hari Belajar)
✅ Kepatuhan 100% 8 Dimensi Profil Lulusan (Permendikdasmen No. 10/2025)
✅ Bebas Halusinasi — Ekspor Microsoft Word (.docx) Resmi Siap Cetak
✅ Sistem Multi-Key Gemini BYOK Bebas Limit 429

Jika memerlukan panduan atau kendala teknis, silakan hubungi tim kami kapan saja. Selamat menyusun perencanaan yang bermakna dan menggembirakan bagi anak didik! ✨`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    let cleanPhone = customer.whatsapp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#EFE6F2] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#522D60] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#FFD38B]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Kirim Pesan Aktivasi WhatsApp</h3>
              <p className="text-[11px] text-white/80">Kirimkan rincian akun ke guru pembeli</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-[#FAF3FB] p-3 rounded-xl border border-[#E8D6EB] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#74607B]">Tujuan Penerima:</span>
              <span className="font-bold text-[#2A1532]">{customer.fullName} ({customer.whatsapp || 'Tanpa No. WA'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#74607B]">Paket Lisensi:</span>
              <span className="font-bold text-[#80426E]">{packageLabel}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A1532] mb-1.5">
              Pratinjau Pesan yang Akan Dikirim:
            </label>
            <textarea
              readOnly
              rows={9}
              value={messageText}
              className="w-full text-xs font-mono p-3 rounded-xl bg-slate-50 border border-[#D8C3DD] text-[#2A1532] leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#EFE6F2] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="py-2 px-4 rounded-xl border border-[#D8C3DD] text-xs font-bold text-[#522D60] hover:bg-[#FAF3FB] flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Teks</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 text-xs font-semibold text-[#74607B] hover:text-[#2A1532]"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
