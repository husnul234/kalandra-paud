import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  onSuccessToast?: (msg: string) => void;
}

export const FirstLoginPasswordModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userEmail,
  userName,
  onSuccessToast,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSkip = () => {
    try {
      const emailKey = userEmail?.toLowerCase() || 'current';
      sessionStorage.setItem(`kalandra_pwd_skipped_${emailKey}`, 'true');
    } catch (_) {}
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPwd = newPassword.trim();
    if (cleanPwd.length < 6) {
      setErrorMessage('Kata sandi baru minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (cleanPwd !== confirmPassword.trim()) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update password in Supabase Auth and remove needs_password_change flag
      const { error } = await supabase.auth.updateUser({
        password: cleanPwd,
        data: {
          needs_password_change: false,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // 2. Clear local storage requirement flags
      try {
        if (userEmail) {
          localStorage.removeItem(`kalandra_pwd_change_needed_${userEmail.toLowerCase()}`);
        }
      } catch (_) {}

      if (onSuccessToast) {
        onSuccessToast('🎉 Kata sandi baru Anda berhasil disimpan!');
      }

      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memperbarui kata sandi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-['Inter',sans-serif]">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#D8C3DD] overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#522D60] to-[#80426E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Lock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Ganti Kata Sandi Sementara</h3>
              <p className="text-[11px] text-white/80">Kenyamanan & Keamanan Akun Anda</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            title="Lewati untuk sekarang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#FAF3FB] p-3.5 rounded-2xl border border-[#E8D6EB]">
            <p className="text-xs text-[#2A1532] leading-relaxed">
              Halo <strong>{userName || 'Bunda/Bapak Guru'}</strong>! Akun Anda saat ini menggunakan kata sandi sementara yang dibuatkan oleh Admin. Silakan buat kata sandi baru pribadi Anda agar mudah diingat.
            </p>
            <p className="text-[11px] text-[#74607B] mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Anda juga dapat melewati langkah ini jika ingin tetap menggunakan sandi sementara.</span>
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Input Password Baru */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2A1532]">
              Kata Sandi Baru:
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full text-xs p-2.5 pr-10 rounded-xl border border-[#D8C3DD] bg-white text-[#2A1532] focus:outline-none focus:ring-2 focus:ring-[#80426E]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-[#74607B] hover:text-[#522D60] cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Input Konfirmasi Password Baru */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2A1532]">
              Konfirmasi Kata Sandi Baru:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full text-xs p-2.5 pr-10 rounded-xl border border-[#D8C3DD] bg-white text-[#2A1532] focus:outline-none focus:ring-2 focus:ring-[#80426E]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-[#74607B] hover:text-[#522D60] cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword && confirmPassword && (
              <p className={`text-[10px] font-bold mt-1 ${
                newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {newPassword === confirmPassword ? '✓ Kata sandi cocok' : '✗ Kata sandi belum cocok'}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#74607B] hover:text-[#2A1532] bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
            >
              Nanti Saja (Lewati)
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#522D60] to-[#80426E] hover:from-[#693774] hover:to-[#964E81] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Simpan Sandi Baru</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
