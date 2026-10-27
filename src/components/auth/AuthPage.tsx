import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { logSecurityEvent } from '../../lib/securityLogger';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Clock
} from 'lucide-react';

interface AuthPageProps {
  onSuccess: (role?: 'guru' | 'admin') => void;
  onBackToApp: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToApp }) => {
  const { signIn } = useAuth();

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OWASP A07: Brute Force Throttling State
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const saved = sessionStorage.getItem('kalandra_auth_failed_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => {
    const lockoutUntil = sessionStorage.getItem('kalandra_auth_lockout_until');
    if (lockoutUntil) {
      const diff = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    }
    return 0;
  });

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem('kalandra_auth_lockout_until');
          sessionStorage.setItem('kalandra_auth_failed_count', '0');
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (lockoutSeconds > 0) {
      setErrorMessage(`Terlalu banyak percobaan gagal. Silakan tunggu ${lockoutSeconds} detik.`);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage('Silakan lengkapi email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    const res = await signIn(cleanEmail, password);
    setIsLoading(false);

    if (res.success) {
      // Reset rate limit on success
      sessionStorage.removeItem('kalandra_auth_failed_count');
      sessionStorage.removeItem('kalandra_auth_lockout_until');
      setFailedAttempts(0);

      // Log successful login
      await logSecurityEvent('AUTH_LOGIN_SUCCESS', {
        details: { email: cleanEmail },
      });

      const isSuperadmin = cleanEmail === 'pakhusnulid@gmail.com';
      setSuccessMessage('Berhasil masuk! Mengalihkan ke aplikasi...');
      setTimeout(() => {
        onSuccess(isSuperadmin ? 'admin' : 'guru');
      }, 500);
    } else {
      const newFailed = failedAttempts + 1;
      setFailedAttempts(newFailed);
      sessionStorage.setItem('kalandra_auth_failed_count', newFailed.toString());

      // Log failed attempt (OWASP A09)
      await logSecurityEvent('AUTH_LOGIN_FAILED', {
        details: {
          email: cleanEmail,
          attempt: newFailed,
        },
      });

      // Trigger 60-second lockout on 5 consecutive failures (OWASP A07)
      if (newFailed >= 5) {
        const lockoutUntil = Date.now() + 60 * 1000;
        sessionStorage.setItem('kalandra_auth_lockout_until', lockoutUntil.toString());
        setLockoutSeconds(60);

        await logSecurityEvent('AUTH_RATE_LIMIT_TRIGGERED', {
          details: { email: cleanEmail, consecutiveFailures: newFailed },
        });

        setErrorMessage('Terlalu banyak percobaan login gagal. Demi keamanan, akun dikunci sementara selama 60 detik.');
        return;
      }

      if (res.error?.toLowerCase().includes('too many') || res.error?.includes('429') || res.error?.toLowerCase().includes('rate limit')) {
        setErrorMessage('Terlalu banyak percobaan login dalam waktu singkat. Demi keamanan sistem, mohon tunggu 1-2 menit sebelum mencoba lagi.');
      } else {
        setErrorMessage(
          res.error?.includes('Invalid login credentials')
            ? `Email atau kata sandi tidak sesuai. (Percobaan ${newFailed}/5)`
            : res.error || 'Gagal masuk akun. Silakan coba lagi.'
        );
      }
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
          <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3 shadow-lg shadow-[#522D60]/20 border border-[#E8D6EB] bg-[#2A1532]">
            <img src="/kalandra_logo.png" alt="Kalandra" className="w-full h-full object-cover scale-[1.05]" />
          </div>
          <h2 className="text-xl font-black text-[#2A1532] tracking-tight">
            KALANDRA
          </h2>
          <p className="text-xs text-[#80426E] font-medium mt-0.5">
            Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
          </p>
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

        {/* FORM MASUK (SIGN IN) */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun Anda"
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
            disabled={isLoading || lockoutSeconds > 0}
            className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Kata Sandi...</span>
              </>
            ) : lockoutSeconds > 0 ? (
              <>
                <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Terkunci ({lockoutSeconds}d)</span>
              </>
            ) : (
              <>
                <span>Masuk ke Akun</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Clean Footer Info without long regulation text */}
      <div className="mt-4 mb-2 text-center text-xs font-semibold text-[#522D60]/70 shrink-0">
        Kalandra © 2026 • Platform Perencanaan Pembelajaran TK Fase Fondasi
      </div>
    </div>
  );
};