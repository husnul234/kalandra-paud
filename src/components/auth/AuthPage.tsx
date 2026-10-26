import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface AuthPageProps {
  onSuccess: (role?: 'guru' | 'admin') => void;
  onBackToApp: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToApp }) => {
  const { signIn, signUp, switchToDemoRole, checkAllowedCustomer } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign in states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign up states
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('TK NEGERI PEMBINA 01');
  const [assignedClass, setAssignedClass] = useState('A (4-5 Tahun)');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === 'signin') {
      if (!email.trim() || !password) {
        setErrorMessage('Silakan masukkan email dan kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      const res = await signIn(email.trim(), password);
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage('Berhasil masuk! Mengalihkan...');
        const isSuperAdmin = email.trim().toLowerCase() === 'pakhusnulid@gmail.com';
        setTimeout(() => {
          onSuccess(isSuperAdmin ? 'admin' : 'guru');
        }, 600);
      } else {
        setErrorMessage(res.error || 'Email atau kata sandi tidak sesuai.');
      }
    } else {
      // Sign up validation
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMessage('Harap lengkapi seluruh kolom formulir pendaftaran.');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Kata sandi minimal terdiri dari 6 karakter.');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok.');
        setIsLoading(false);
        return;
      }

      // Check whitelist / customer info
      const customerInfo = await checkAllowedCustomer(email);
      const isAutoAdmin = email.trim().toLowerCase() === 'pakhusnulid@gmail.com';

      const res = await signUp(
        email.trim(),
        password,
        fullName.trim(),
        isAutoAdmin ? 'admin' : 'guru',
        schoolName.trim() || customerInfo.schoolName || 'TK NEGERI PEMBINA 01',
        assignedClass
      );
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage('Pendaftaran berhasil! Akun Anda siap digunakan.');
        setTimeout(() => {
          onSuccess(isAutoAdmin ? 'admin' : 'guru');
        }, 800);
      } else {
        setErrorMessage(res.error || 'Gagal mendaftarkan akun. Silakan coba kembali.');
      }
    }
  };

  const handleQuickDemo = (role: 'guru' | 'admin') => {
    switchToDemoRole(role);
    onSuccess(role);
  };

  return (
    <div className="min-h-screen bg-[#FAF7FB] flex flex-col justify-start sm:justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-y-auto">
      {/* Decorative background blobs with Color Hunt tones */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#522D60]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F2A67B]/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFD38B]/10 blur-3xl" />
      </div>

      {/* Top back navigation bar */}
      <div className="w-full max-w-md mb-3 sm:mb-4 flex items-center justify-between z-10 shrink-0">
        <button
          onClick={onBackToApp}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#522D60] hover:text-[#2A1532] bg-white/90 hover:bg-white px-3 py-1.5 rounded-xl border border-[#D8C3DD] shadow-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[#80426E]" /> Kembali ke Beranda
        </button>
        <span className="text-[11px] font-extrabold text-[#522D60] bg-[#FAF3FB] px-3 py-1 rounded-full border border-[#D8C3DD] shadow-2xs">
          PAUD Merdeka 2025/2026
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-[#522D60]/10 border border-[#D8C3DD] p-6 sm:p-8 relative z-10 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-[#522D60] text-white shadow-md shadow-[#522D60]/20 mb-2.5">
            <Sparkles className="w-6 h-6 text-[#FFD38B]" />
          </div>
          <h1 className="text-2xl font-black text-[#2A1532] tracking-tight">
            Kalandra PAUD
          </h1>
          <p className="text-xs text-[#522D60]/85 font-medium mt-1">
            Platform Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex p-1 bg-[#F4E8F6] rounded-xl mb-5 border border-[#D8C3DD]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-[#522D60] text-white shadow-sm'
                : 'text-[#522D60] hover:bg-white/60'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-[#522D60] text-white shadow-sm'
                : 'text-[#522D60] hover:bg-white/60'
            }`}
          >
            Daftar Guru Baru
          </button>
        </div>

        {/* Alert Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Dewi Rahmawati, S.Pd."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] focus:border-transparent bg-white text-[#2A1532] placeholder:text-[#9B88A2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Nama Satuan TK / PAUD
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Contoh: TK NEGERI PEMBINA 01"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] focus:border-transparent bg-white text-[#2A1532] placeholder:text-[#9B88A2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Kelompok Kelas yang Diampu
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                  <select
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] focus:border-transparent bg-white text-[#2A1532]"
                  >
                    <option value="A (4-5 Tahun)">Kelompok A (Usia 4-5 Tahun)</option>
                    <option value="B (5-6 Tahun)">Kelompok B (Usia 5-6 Tahun)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#2A1532] mb-1">
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] focus:border-transparent bg-white text-[#2A1532] placeholder:text-[#9B88A2]"
              />
            </div>

            {/* Special Card for Superadmin */}
            {email.trim().toLowerCase() === 'pakhusnulid@gmail.com' && (
              <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-[#FAF3FB] via-[#F6ECF8] to-[#FAF3FB] border-2 border-[#80426E]/30 text-[#2A1532] shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#522D60] text-[#FFD38B] flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#522D60] leading-tight">
                      Akun Superadministrator Terverifikasi
                    </p>
                    <p className="text-[10px] text-[#74607B]">
                      Pak Husnul • Hak Akses Penuh Sistem Kalandra PAUD
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#E8D6EB] flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="w-full py-2 px-3 rounded-xl bg-[#522D60] hover:bg-[#693774] text-white font-extrabold text-xs shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD38B]" />
                    <span>Masuk Langsung ke Admin Panel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-[#74607B] text-center font-medium">
                    Atau gunakan kata sandi Supabase Anda di bawah ini
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A1532] mb-1">
              Kata Sandi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] focus:border-transparent bg-white text-[#2A1532] placeholder:text-[#9B88A2]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#74607B] hover:text-[#522D60]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1">
                Ulangi Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] focus:border-transparent bg-white text-[#2A1532] placeholder:text-[#9B88A2]"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Masuk ke Akun' : 'Daftar Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Section with High-Contrast Buttons */}
        <div className="mt-5 pt-4 border-t border-[#EFE6F2]">
          <div className="text-center mb-2.5">
            <span className="text-[11px] font-bold text-[#522D60] bg-[#FAF3FB] px-3 py-0.5 rounded-full border border-[#D8C3DD]">
              Uji Coba Cepat Tanpa Login
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('guru')}
              className="py-2 px-3 rounded-xl text-xs font-bold text-[#522D60] bg-white hover:bg-[#FAF3FB] border-2 border-[#D8C3DD] shadow-xs flex items-center justify-center gap-1.5 transition-all group active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-[#80426E] group-hover:scale-110 transition-transform" />
              <span>Mode Guru Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] border-2 border-[#522D60] shadow-sm shadow-[#522D60]/20 flex items-center justify-center gap-1.5 transition-all group active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFD38B] group-hover:scale-110 transition-transform" />
              <span>Mode Admin Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 mb-2 text-center text-xs font-semibold text-[#522D60]/80 shrink-0">
        Kalandra PAUD • Kepatuhan 100% Permendikdasmen No. 10/2025 (8 DPL) & 1/2026
      </div>
    </div>
  );
};
