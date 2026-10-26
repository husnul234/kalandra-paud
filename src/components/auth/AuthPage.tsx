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
  const { signIn, signUp } = useAuth();
  
  // Tabs: 'signin' | 'signup'
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up State
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpSchool, setSignUpSchool] = useState('TK NEGERI PEMBINA 01');
  const [signUpClass, setSignUpClass] = useState('A (4-5 Tahun)');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = signInEmail.trim().toLowerCase();
    if (!email || !signInPassword) {
      setErrorMessage('Silakan lengkapi email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    const res = await signIn(email, signInPassword);
    setIsLoading(false);

    if (res.success) {
      const isSuperadmin = email === 'pakhusnulid@gmail.com';
      setSuccessMessage('Berhasil masuk! Mengalihkan ke aplikasi...');
      setTimeout(() => {
        onSuccess(isSuperadmin ? 'admin' : 'guru');
      }, 500);
    } else {
      setErrorMessage(
        res.error?.includes('Invalid login credentials')
          ? 'Email atau kata sandi tidak sesuai. Silakan periksa kembali.'
          : res.error || 'Gagal masuk akun. Silakan coba lagi.'
      );
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = signUpEmail.trim().toLowerCase();
    const fullName = signUpFullName.trim();

    if (!fullName) {
      setErrorMessage('Nama lengkap wajib diisi.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Silakan masukkan alamat email yang valid.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    const res = await signUp(
      email,
      signUpPassword,
      fullName,
      email === 'pakhusnulid@gmail.com' ? 'admin' : 'guru',
      signUpSchool.trim(),
      signUpClass
    );
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage('Pendaftaran akun berhasil! Anda langsung diarahkan ke aplikasi...');
      setTimeout(() => {
        onSuccess(email === 'pakhusnulid@gmail.com' ? 'admin' : 'guru');
      }, 700);
    } else {
      setErrorMessage(
        res.error?.includes('already registered')
          ? 'Email ini sudah terdaftar. Silakan pilih tab "Masuk ke Akun".'
          : res.error || 'Gagal mendaftarkan akun. Silakan coba lagi.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7FB] flex flex-col justify-start sm:justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-y-auto selection:bg-[#522D60] selection:text-white">
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
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#522D60] text-white flex items-center justify-center font-black mx-auto mb-3 shadow-md shadow-[#522D60]/20">
            <Sparkles className="w-6 h-6 text-[#FFD38B]" />
          </div>
          <h2 className="text-xl font-black text-[#2A1532] tracking-tight">
            KALANDRA PAUD
          </h2>
          <p className="text-xs text-[#80426E] font-medium mt-0.5">
            Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
          </p>
        </div>

        {/* Tab Switcher: Masuk vs Daftar */}
        <div className="grid grid-cols-2 gap-1 bg-[#FAF3FB] p-1 rounded-2xl border border-[#E8D6EB] mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              tab === 'signin'
                ? 'bg-white text-[#522D60] shadow-xs font-extrabold'
                : 'text-[#74607B] hover:text-[#522D60]'
            }`}
          >
            Masuk ke Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              tab === 'signup'
                ? 'bg-white text-[#522D60] shadow-xs font-extrabold'
                : 'text-[#74607B] hover:text-[#522D60]'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Feedback Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: FORM MASUK (SIGN IN) */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="nama.guru@sekolah.sch.id"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#80426E] absolute left-3 top-3" />
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun Anda"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3 top-3 text-[#74607B] hover:text-[#522D60]"
                >
                  {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  <span>Memverifikasi Kata Sandi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Superadmin Note */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-[#74607B] inline-flex items-center gap-1 bg-[#FAF3FB] px-2.5 py-1 rounded-full border border-[#E8D6EB]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#80426E]" />
                Akun Administrator: <strong>pakhusnulid@gmail.com</strong>
              </span>
            </div>
          </form>
        )}

        {/* TAB 2: FORM DAFTAR (SIGN UP) */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1">
                Nama Lengkap & Gelar *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#80426E] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={signUpFullName}
                  onChange={(e) => setSignUpFullName(e.target.value)}
                  placeholder="Dewi Rahmawati, S.Pd."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1">
                Lembaga / Satuan PAUD
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#80426E] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={signUpSchool}
                  onChange={(e) => setSignUpSchool(e.target.value)}
                  placeholder="TK NEGERI PEMBINA 01"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1">
                Kelompok Usia yang Diampu
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-[#80426E] absolute left-3 top-2.5" />
                <select
                  value={signUpClass}
                  onChange={(e) => setSignUpClass(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                >
                  <option value="A (4-5 Tahun)">Kelompok A (4-5 Tahun)</option>
                  <option value="B (5-6 Tahun)">Kelompok B (5-6 Tahun)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1532] mb-1">
                Alamat Email Resmi *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#80426E] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="nama.guru@sekolah.sch.id"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min. 6 digit"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Ulangi Sandi *
                </label>
                <div className="relative">
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:outline-none focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#74607B]">
              <input
                type="checkbox"
                id="showPwd"
                checked={showSignUpPassword}
                onChange={() => setShowSignUpPassword(!showSignUpPassword)}
                className="rounded border-[#CBB4D1] text-[#522D60] focus:ring-[#522D60]"
              />
              <label htmlFor="showPwd" className="cursor-pointer select-none">
                Tampilkan kata sandi
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun Resmi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 mb-2 text-center text-xs font-semibold text-[#522D60]/80 shrink-0">
        Kalandra PAUD • Kepatuhan 100% Permendikdasmen No. 10/2025 (8 DPL) & 1/2026
      </div>
    </div>
  );
};