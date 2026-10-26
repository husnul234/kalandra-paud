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
  onSuccess: () => void;
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
        setSuccessMessage('Berhasil masuk! Mengalihkan ke aplikasi...');
        setTimeout(() => {
          onSuccess();
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
          onSuccess();
        }, 800);
      } else {
        setErrorMessage(res.error || 'Gagal mendaftarkan akun. Silakan coba kembali.');
      }
    }
  };

  const handleQuickDemo = (role: 'guru' | 'admin') => {
    switchToDemoRole(role);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#FAF7FB] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs with Color Hunt tones */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#522D60]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F2A67B]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFD38B]/10 blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button
          onClick={onBackToApp}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74607B] hover:text-[#522D60] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Generator RPM
        </button>
        <span className="text-[11px] font-bold text-[#80426E] bg-[#F4E8F6] px-2.5 py-0.5 rounded-full border border-[#D8C3DD]">
          PAUD Merdeka 2025/2026
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-[#522D60]/5 border border-[#EFE6F2] p-6 sm:p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#522D60] text-white shadow-md shadow-[#522D60]/20 mb-3">
            <Sparkles className="w-7 h-7 text-[#FFD38B]" />
          </div>
          <h1 className="text-2xl font-black text-[#2A1532] tracking-tight">
            Kalandra PAUD
          </h1>
          <p className="text-xs text-[#74607B] mt-1">
            Platform Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex p-1 bg-[#FAF3FB] rounded-xl mb-6 border border-[#E8D6EB]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#522D60] shadow-sm'
                : 'text-[#74607B] hover:text-[#522D60]'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#522D60] shadow-sm'
                : 'text-[#74607B] hover:text-[#522D60]'
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
                  <User className="w-4 h-4 text-[#74607B] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Dewi Rahmawati, S.Pd."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] focus:border-transparent bg-white text-[#2A1532]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Nama Satuan TK / PAUD
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#74607B] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Contoh: TK NEGERI PEMBINA 01"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] focus:border-transparent bg-white text-[#2A1532]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Kelompok Kelas yang Diampu
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#74607B] absolute left-3 top-3" />
                  <select
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] focus:border-transparent bg-white text-[#2A1532]"
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
              <Mail className="w-4 h-4 text-[#74607B] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] focus:border-transparent bg-white text-[#2A1532]"
              />
            </div>
            {email.trim().toLowerCase() === 'pakhusnulid@gmail.com' && (
              <p className="text-[10px] text-[#80426E] font-bold mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#522D60]" /> Akun ini terdaftar sebagai Superadministrator Kalandra PAUD
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A1532] mb-1">
              Kata Sandi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#74607B] absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] focus:border-transparent bg-white text-[#2A1532]"
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
                <Lock className="w-4 h-4 text-[#74607B] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] focus:border-transparent bg-white text-[#2A1532]"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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

        {/* Quick Demo Bypass for evaluation */}
        <div className="mt-6 pt-5 border-t border-[#EFE6F2] text-center">
          <p className="text-[11px] font-semibold text-[#74607B] mb-2.5">
            Ingin mengevaluasi fitur tanpa login?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('guru')}
              className="py-1.5 px-3 rounded-lg text-[11px] font-bold text-[#80426E] bg-[#FAF3FB] hover:bg-[#F4E8F6] border border-[#E8D6EB] transition-colors"
            >
              Mode Guru Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-3 rounded-lg text-[11px] font-bold text-[#522D60] bg-[#FAF3FB] hover:bg-[#F4E8F6] border border-[#E8D6EB] transition-colors"
            >
              Mode Admin Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-[#74607B]">
        Kalandra PAUD • Kepatuhan 100% Permendikdasmen No. 10/2025 (8 DPL) & 1/2026
      </div>
    </div>
  );
};
