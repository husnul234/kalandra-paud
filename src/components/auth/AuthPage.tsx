import React, { useState } from 'react';
import { useAuth, AllowedCustomerInfo } from '../../context/AuthContext';
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
  GraduationCap,
  MessageCircle,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';

interface AuthPageProps {
  onSuccess: (role?: 'guru' | 'admin') => void;
  onBackToApp: () => void;
}

type AuthStep = 'email' | 'denied' | 'first_time' | 'password';

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToApp }) => {
  const { signIn, signUp, switchToDemoRole, checkAllowedCustomer } = useAuth();
  
  // Step state
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [customerInfo, setCustomerInfo] = useState<AllowedCustomerInfo | null>(null);

  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('TK NEGERI PEMBINA 01');
  const [assignedClass, setAssignedClass] = useState('A (4-5 Tahun)');

  // Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSuperAdminEmail = email.trim().toLowerCase() === 'pakhusnulid@gmail.com';

  // Step 1: Check Email Whitelist
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Silakan masukkan alamat email yang valid.');
      return;
    }

    setIsLoading(true);
    try {
      const info = await checkAllowedCustomer(cleanEmail);
      setCustomerInfo(info);
      setIsLoading(false);

      if (isSuperAdminEmail) {
        if (info.isRegistered) {
          setStep('password');
        } else {
          setFullName('Pak Husnul (Administrator)');
          setSchoolName('Kalandra PAUD Official');
          setStep('first_time');
        }
        return;
      }

      if (!info.allowed) {
        setStep('denied');
        return;
      }

      if (info.isActive === false) {
        setErrorMessage('Lisensi untuk akun ini sedang dinonaktifkan. Silakan hubungi Administrator.');
        setStep('denied');
        return;
      }

      if (!info.isRegistered) {
        // First-time user: needs to create password
        setFullName(info.fullName || '');
        setSchoolName(info.schoolName || 'TK NEGERI PEMBINA 01');
        setStep('first_time');
      } else {
        // Registered user: enter password
        setFullName(info.fullName || '');
        setSchoolName(info.schoolName || 'TK NEGERI PEMBINA 01');
        setStep('password');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Gagal memeriksa status email. Silakan coba lagi.');
    }
  };

  // Step 2A: First-Time Activation (Set Password & Profile)
  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    const assignedRole = isSuperAdminEmail ? 'admin' : 'guru';

    const res = await signUp(
      email.trim(),
      password,
      fullName.trim(),
      assignedRole,
      schoolName.trim() || customerInfo?.schoolName || 'TK NEGERI PEMBINA 01',
      assignedClass
    );

    setIsLoading(false);

    if (res.success) {
      setSuccessMessage('Aktivasi akun berhasil! Selamat datang di Kalandra PAUD...');
      setTimeout(() => {
        onSuccess(assignedRole);
      }, 700);
    } else {
      setErrorMessage(res.error || 'Gagal mengaktifkan akun. Silakan coba lagi.');
    }
  };

  // Step 2B: Returning User Login (Enter Password)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    const res = await signIn(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage('Berhasil masuk! Mengalihkan ke aplikasi...');
      setTimeout(() => {
        onSuccess(isSuperAdminEmail ? 'admin' : 'guru');
      }, 600);
    } else {
      setErrorMessage(res.error || 'Kata sandi tidak sesuai. Silakan periksa kembali.');
    }
  };

  const handleResetToEmail = () => {
    setStep('email');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleQuickDemo = (role: 'guru' | 'admin') => {
    switchToDemoRole(role);
    onSuccess(role);
  };

  const whatsappMessage = `Halo Admin Kalandra PAUD, saya ingin konfirmasi pendaftaran akun guru untuk email: ${email.trim()}`;
  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappMessage)}`;

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

        {/* Dynamic Process Indicator (Like ModulAjar Online) */}
        <div className="mb-5 flex items-center justify-between px-2 py-1.5 bg-[#FAF3FB] rounded-xl border border-[#E8D6EB] text-[11px] font-bold text-[#74607B]">
          <span className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${step === 'email' ? 'bg-[#522D60]' : 'bg-emerald-600'}`}>
              {step === 'email' ? '1' : <Check className="w-3 h-3" />}
            </span>
            <span>Identifikasi</span>
          </span>
          <span className="text-[#CBB4D1]">─</span>
          <span className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'email' 
                ? 'bg-[#E8D6EB] text-[#74607B]' 
                : step === 'denied' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-[#522D60] text-white'
            }`}>
              2
            </span>
            <span>
              {step === 'first_time' ? 'Aktivasi' : step === 'denied' ? 'Verifikasi' : 'Autentikasi'}
            </span>
          </span>
        </div>

        {/* Alert Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STEP 1: INPUT EMAIL */}
        {step === 'email' && (
          <form onSubmit={handleCheckEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1">
                Alamat Email Guru / Administrator <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@sekolah.sch.id atau pakhusnulid@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] focus:border-transparent bg-white text-[#2A1532] placeholder:text-[#9B88A2]"
                />
              </div>
              <p className="text-[11px] text-[#74607B] mt-1.5">
                Masukkan email yang didaftarkan oleh sekolah atau Administrator platform Kalandra PAUD.
              </p>
            </div>

            {/* Special Recognition for Superadmin */}
            {isSuperAdminEmail && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FAF3FB] via-[#F6ECF8] to-[#FAF3FB] border-2 border-[#80426E]/40 text-[#2A1532] shadow-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#522D60] text-[#FFD38B] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#522D60] leading-tight">
                      Akun Superadministrator Terverifikasi
                    </p>
                    <p className="text-[10px] text-[#74607B]">
                      Pak Husnul • Hak Akses Penuh Sistem
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#E8D6EB]">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="w-full py-2 px-3 rounded-xl bg-[#522D60] hover:bg-[#693774] text-white font-extrabold text-xs shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD38B]" />
                    <span>Masuk Cepat Langsung ke Admin Panel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memeriksa Izin Akses...</span>
                </>
              ) : (
                <>
                  <span>Lanjutkan Verifikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2A: ACCESS DENIED (EMAIL NOT IN WHITELIST) */}
        {step === 'denied' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h3 className="font-extrabold text-xs text-amber-900">
                  Email Belum Terdaftar di Whitelist
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-amber-800">
                Alamat email <span className="font-bold underline">{email}</span> belum memiliki lisensi aktif di sistem Kalandra PAUD.
              </p>
              <p className="text-[11px] leading-relaxed text-amber-700 mt-2">
                Pendaftaran guru baru dikelola secara terpusat oleh Satuan Sekolah / Administrator agar penyusunan dokumen RPM sesuai dengan kuota dan standar resmi PAUD.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Admin via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleResetToEmail}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#522D60] bg-white hover:bg-[#FAF3FB] border border-[#D8C3DD] flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Gunakan Alamat Email Lain</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2B: FIRST-TIME USER (PASSWORD CREATION & PROFILE CONFIRMATION) */}
        {step === 'first_time' && (
          <form onSubmit={handleActivateAccount} className="space-y-3.5 animate-fade-in">
            <div className="p-3 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-[#522D60]">Aktivasi Akun Pertama Kali</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  Lisensi Aktif
                </span>
              </div>
              <p className="text-[11px] text-[#74607B]">
                Selamat datang! Akun Anda telah terdaftar oleh Administrator. Silakan lengkapi profil dan buat kata sandi Anda.
              </p>
            </div>

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
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1">
                Satuan TK / PAUD
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: TK NEGERI PEMBINA 01"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
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
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                >
                  <option value="A (4-5 Tahun)">Kelompok A (Usia 4-5 Tahun)</option>
                  <option value="B (5-6 Tahun)">Kelompok B (Usia 5-6 Tahun)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1">
                Buat Kata Sandi Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
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
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengaktifkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Aktifkan Akun & Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleResetToEmail}
                className="text-[11px] font-bold text-[#74607B] hover:text-[#522D60] underline"
              >
                ← Ganti Email ({email})
              </button>
            </div>
          </form>
        )}

        {/* STEP 2C: RETURNING USER (PASSWORD LOGIN) */}
        {step === 'password' && (
          <form onSubmit={handleSignIn} className="space-y-4 animate-fade-in">
            <div className="p-3 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-[#522D60]">
                  {fullName ? `Halo, ${fullName}` : 'Selamat Datang Kembali'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  Terverifikasi
                </span>
              </div>
              <p className="text-[11px] text-[#74607B]">
                {email} • {schoolName}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#2A1532]">
                  Kata Sandi <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleResetToEmail}
                className="text-[11px] font-bold text-[#74607B] hover:text-[#522D60] underline"
              >
                ← Ganti Email ({email})
              </button>
            </div>
          </form>
        )}

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