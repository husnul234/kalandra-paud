import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Send, 
  RotateCcw, 
  Sparkles, 
  Phone, 
  Crown, 
  MessageSquare, 
  CheckCircle2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { adminUpdateUser } from '../../lib/supabaseAdmin';

export interface WhatsAppUserTarget {
  id?: string;
  fullName: string;
  email: string;
  whatsapp?: string;
  schoolName?: string;
  tier?: 'standar' | 'pro' | 'free';
  duration?: '1_bulan' | '6_bulan' | '1_tahun' | 'lifetime';
  expiryDate?: string;
  initialPassword?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: WhatsAppUserTarget | null;
  onNumberSaved?: (phone: string) => void;
}

export const WhatsAppActivationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  onNumberSaved,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('Paket Pro (Tahunan)');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [tempPassword, setTempPassword] = useState<string>('Kalandra#2026');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [saveNumberToData, setSaveNumberToData] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<'lengkap' | 'singkat' | 'reminder'>('lengkap');
  const [messageBody, setMessageBody] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.whatsapp || '');
      setTempPassword(user.initialPassword || 'Kalandra#2026');

      // Determine initial package label
      let pkg = 'Paket Pro (Tahunan)';
      if (user.tier === 'standar') {
        pkg = user.duration === '1_bulan' ? 'Paket Standar (Bulanan)' : 'Paket Standar (Tahunan)';
      } else {
        pkg = user.duration === '1_bulan' 
          ? 'Paket Pro (Bulanan)' 
          : user.duration === '6_bulan' 
          ? 'Paket Pro (6 Bulan)' 
          : 'Paket Pro (Tahunan)';
      }
      setSelectedPackage(pkg);
    }
  }, [user]);

  const handleGenerateRandomPassword = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newPwd = `Kalandra#${rand}`;
    setTempPassword(newPwd);
  };

  // Generate text based on preset
  const generateMessage = (preset: 'lengkap' | 'singkat' | 'reminder', pkg: string, pwd?: string) => {
    if (!user) return '';

    const name = user.fullName || 'Bunda/Bapak Guru';
    const email = user.email || '';
    const activePwd = (pwd ? pwd.trim() : '') || tempPassword || user.initialPassword || 'Kalandra#2026';
    
    // Formulate expiry
    let expiry = user.expiryDate;
    if (!expiry) {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      expiry = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const appUrl = `${window.location.origin}/login`;

    if (preset === 'singkat') {
      return `Halo Kak ${name}, akun Anda untuk aplikasi *Kalandra — RPM TK Fase Fondasi* sudah aktif ya! 🎉

📋 *Rincian Akun:*
• *Paket Langganan:* ${pkg}
• *Email Terdaftar:* ${email}
• *Kata Sandi Sementara:* ${activePwd}
• *Masa Aktif:* s.d. ${expiry}

👉 *Langkah Masuk (Login):*
1. Silakan login ke: ${appUrl}
2. Masukkan email terdaftar dan kata sandi sementara di atas.
3. Anda dapat langsung membuat kata sandi baru pribadi Anda setelah masuk (dapat juga dilewati).

Jika ada kendala saat login atau butuh bantuan lainnya, silakan langsung balas pesan ini ya Kak. Selamat mencoba! 🙏✨`;
    }

    if (preset === 'reminder') {
      return `Halo Kak ${name}, ini informasi pengingat akses akun *Kalandra — RPM TK Fase Fondasi* Anda:

📋 *Akun Kalandra:*
• *Email:* ${email}
• *Paket:* ${pkg}
• *Kata Sandi Sementara:* ${activePwd}
• *Masa Aktif:* s.d. ${expiry}

Tautan login: ${appUrl}

Seluruh pembuatan RPM 1 Minggu + 4 Lampiran Observasi Siap Cetak kini telah otomatis terhubung ke sistem AI Kalandra. Jika ada kendala, hubungi kami kapan saja ya Kak! 🙏✨`;
    }

    // Default: Aktivasi Lengkap
    return `Halo Kak ${name}, akun Anda untuk aplikasi *Kalandra — RPM TK Fase Fondasi* sudah aktif ya! 🎉

📋 *Rincian Akun:*
• *Paket Langganan:* ${pkg}
• *Email Terdaftar:* ${email}
• *Kata Sandi Sementara:* ${activePwd}
• *Masa Aktif:* ${expiry}

👉 *Langkah Masuk (Login):*
1. Silakan login ke: ${appUrl}
2. Masukkan email terdaftar dan kata sandi sementara di atas.
3. Setelah masuk, Anda akan langsung diberikan pilihan untuk membuat kata sandi baru pribadi Anda (bisa dilewati jika ingin tetap memakai sandi sementara).
4. Klik tombol *Masuk ke Akun*.

✨ *Fitur yang Siap Anda Nikmati:*
✅ Generator 18 Kegiatan Bermain Loose Parts Mingguan (Deep Learning)
✅ Kepatuhan Mutlak 8 Dimensi Profil Lulusan (Permendikdasmen No. 10/2025)
✅ 4 Dokumen Lampiran Observasi Siap Cetak (Anekdot, Ceklis SOLO, Hasil Karya, Foto Berseri)
✅ Rekomendasi AI Kurikulum & Asisten Revisi Dokumen via Chat

Jika ada kendala saat login atau butuh bantuan lainnya, silakan langsung balas pesan ini ya Kak. Selamat mencoba & semoga bermanfaat untuk kelancaran administrasi mengajar! 🙏✨`;
  };

  // Sync message when preset, package, or password changes
  useEffect(() => {
    if (user) {
      setMessageBody(generateMessage(activePreset, selectedPackage, tempPassword));
    }
  }, [user, activePreset, selectedPackage, tempPassword]);

  if (!isOpen || !user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = async () => {
    // 0. If admin customized the temporary password, sync to user account in DB
    const cleanPwd = tempPassword.trim();
    if (user.id && cleanPwd.length >= 6 && cleanPwd !== user.initialPassword) {
      try {
        await adminUpdateUser({
          userId: user.id,
          email: user.email,
          full_name: user.fullName,
          role: 'guru',
          new_password: cleanPwd,
        });
        localStorage.setItem(`kalandra_pwd_change_needed_${user.email.toLowerCase()}`, 'true');
      } catch (e) {
        console.warn('Sync temp password warning:', e);
      }
    }

    // 1. Save phone number if checked
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (saveNumberToData && user.id && cleanPhone) {
      try {
        await supabase
          .from('profiles')
          .update({ phone: cleanPhone })
          .eq('id', user.id);

        await supabase
          .from('allowed_customers')
          .update({ whatsapp: cleanPhone })
          .eq('email', user.email.toLowerCase());

        if (onNumberSaved) {
          onNumberSaved(cleanPhone);
        }
      } catch (e) {
        console.warn('Error saving phone number to database:', e);
      }
    }

    // 2. Format international format for wa.me
    let targetWa = cleanPhone;
    if (targetWa.startsWith('0')) {
      targetWa = '62' + targetWa.slice(1);
    }

    const encoded = encodeURIComponent(messageBody);
    if (targetWa) {
      window.open(`https://wa.me/${targetWa}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#D8C3DD] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Kirim Info Aktivasi Akun</h3>
              <p className="text-xs text-white/80">Pesan siap kirim ke WhatsApp atau copas langsung ke pelanggan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* User & Package Card */}
          <div className="bg-[#FAF3FB] p-4 rounded-2xl border border-[#E8D6EB] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#2A1532]">{user.fullName}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-[#2A1532] uppercase">
                    {user.tier === 'standar' ? 'Standar' : 'Pro'}
                  </span>
                </div>
                <p className="text-xs text-[#74607B] mt-0.5">{user.email}</p>
              </div>

              {/* Package selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-[#74607B] shrink-0">PAKET:</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[#CBB4D1] bg-white text-[#2A1532] focus:ring-2 focus:ring-[#522D60]"
                >
                  <option value="Paket Pro (Tahunan)">Paket Pro (Tahunan)</option>
                  <option value="Paket Pro (6 Bulan)">Paket Pro (6 Bulan)</option>
                  <option value="Paket Pro (Bulanan)">Paket Pro (Bulanan)</option>
                  <option value="Paket Standar (Tahunan)">Paket Standar (Tahunan)</option>
                  <option value="Paket Standar (Bulanan)">Paket Standar (Bulanan)</option>
                </select>
              </div>
            </div>

            {/* WhatsApp Phone Input */}
            <div className="pt-2 border-t border-[#EFE6F2]">
              <label className="block text-xs font-bold text-[#2A1532] mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nomor WhatsApp Pembeli:</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="08123456789 atau 628123456789"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-emerald-500 text-[#2A1532]"
                />
                <label className="flex items-center gap-2 text-xs font-semibold text-[#74607B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveNumberToData}
                    onChange={(e) => setSaveNumberToData(e.target.checked)}
                    className="rounded border-[#CBB4D1] text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Simpan nomor ke data</span>
                </label>
              </div>
            </div>

            {/* Temporary Password Input */}
            <div className="pt-2 border-t border-[#EFE6F2]">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#2A1532] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#80426E]" />
                  <span>Kata Sandi Sementara (Diberikan ke Pengguna):</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRandomPassword}
                  className="text-[11px] font-bold text-[#80426E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Acak Sandi</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Contoh: Kalandra#2026"
                  className="w-full px-3 py-2 pr-10 text-xs font-mono rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532] bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#74607B] hover:text-[#522D60] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-[#74607B] mt-1">
                Kata sandi ini tercantum otomatis di pesan WA. Guru akan diberikan dialog ganti sandi saat login pertama (bisa dilewati).
              </p>
            </div>
          </div>

          {/* Preset Buttons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#74607B]">Preset:</span>
              <button
                type="button"
                onClick={() => setActivePreset('lengkap')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreset === 'lengkap'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'bg-[#FAF3FB] text-[#74607B] hover:text-[#2A1532] border border-[#E8D6EB]'
                }`}
              >
                Aktivasi Lengkap (Default)
              </button>
              <button
                type="button"
                onClick={() => setActivePreset('singkat')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreset === 'singkat'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'bg-[#FAF3FB] text-[#74607B] hover:text-[#2A1532] border border-[#E8D6EB]'
                }`}
              >
                Format Singkat
              </button>
              <button
                type="button"
                onClick={() => setActivePreset('reminder')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreset === 'reminder'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'bg-[#FAF3FB] text-[#74607B] hover:text-[#2A1532] border border-[#E8D6EB]'
                }`}
              >
                Pengingat Akun
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMessageBody(generateMessage(activePreset, selectedPackage, tempPassword))}
              className="text-xs font-bold text-[#80426E] hover:text-[#522D60] flex items-center gap-1 hover:underline cursor-pointer"
              title="Kembalikan teks sesuai template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Teks</span>
            </button>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2A1532]">
              Teks Pesan (Dapat Diedit Sesuai Kebutuhan):
            </label>
            <textarea
              rows={9}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              className="w-full p-3.5 text-xs font-sans rounded-2xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532] leading-relaxed shadow-inner"
            />
          </div>

          {/* Info Banner */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Teks sudah otomatis diformat dengan sintaks WhatsApp (tebal *kata* & link aktif). Klik <strong>Kirim ke WhatsApp</strong> untuk membuka chat langsung atau <strong>Salin Pesan</strong> untuk paste manual.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FAF3FB] border-t border-[#EFE6F2] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#74607B] hover:bg-white transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#522D60] bg-white hover:bg-[#F3E8F5] border border-[#D8C3DD] flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#80426E]" />
                  <span>Salin Pesan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="py-2.5 px-5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
