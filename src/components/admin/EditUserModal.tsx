import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Lock, 
  Eye, 
  EyeOff, 
  Dices, 
  Mail, 
  Crown, 
  Calendar, 
  Building2, 
  Phone, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Loader2,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserRow } from './AdminUsersView';
import { adminUpdateUser, adminResetPassword } from '../../lib/supabaseAdmin';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserRow | null;
  onSuccess: (notice?: string, updatedPassword?: string) => void;
}

export const EditUserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [assignedClass, setAssignedClass] = useState('A (4-5 Tahun)');
  const [tier, setTier] = useState<'standar' | 'pro' | 'free'>('pro');
  const [duration, setDuration] = useState<'1_bulan' | '6_bulan' | '1_tahun' | 'lifetime'>('1_tahun');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState<'admin' | 'guru'>('guru');

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setSchoolName(user.school_name || '');
      setAssignedClass(user.assigned_class || 'A (4-5 Tahun)');
      setTier(user.tier || 'pro');
      setDuration(user.duration || '1_tahun');
      setIsActive(user.is_active);
      setRole(user.role);
      setNewPassword('');
      setErrorMessage(null);

      // Expiry date calculation
      if (user.expiry_date) {
        setExpiryDate(user.expiry_date.slice(0, 10));
      } else {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        setExpiryDate(d.toISOString().slice(0, 10));
      }
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const isSuperadmin = user.email.toLowerCase() === 'pakhusnulid@gmail.com';

  const handleGeneratePassword = () => {
    const words = ['Kalandra', 'Pendidik', 'GuruTK', 'Bintang', 'Cerdas', 'Pelangi', 'Merdeka', 'Hebat'];
    const word = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const syms = ['#', '!', '$', '@'];
    const sym = syms[Math.floor(Math.random() * syms.length)];
    setNewPassword(`${word}${sym}${num}`);
    setShowPassword(true);
  };

  const handleSendResetEmail = async () => {
    setIsSendingResetEmail(true);
    try {
      await adminResetPassword(user.email);
      alert(`Tautan atur ulang kata sandi telah dikirimkan ke email ${user.email}.`);
    } catch (e: any) {
      alert(`Gagal mengirim tautan reset: ${e.message}`);
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Nama lengkap tidak boleh kosong.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMessage('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await adminUpdateUser({
        userId: user.id,
        email: user.email,
        full_name: fullName.trim(),
        role: isSuperadmin ? 'admin' : role,
        tier: tier,
        duration: duration,
        expiryDate: expiryDate,
        school_name: schoolName.trim(),
        assigned_class: assignedClass,
        phone: phone.trim(),
        is_active: isSuperadmin ? true : isActive,
        new_password: newPassword.trim() || undefined,
      });

      let notice = 'Data akun pengguna berhasil diperbarui!';
      if (newPassword.trim()) {
        if (res?.passwordResult?.updated) {
          notice = `Data profil diperbarui! ${res.passwordResult.message}`;
        } else {
          notice = `Profil disimpan. Catatan Sandi: ${res?.passwordResult?.message || 'Cek konsol'}`;
        }
      }

      onSuccess(notice, newPassword.trim() || undefined);
      onClose();
    } catch (err: any) {
      console.error('Update user error:', err);
      setErrorMessage(err.message || 'Gagal memperbarui data pengguna.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#D8C3DD] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#522D60] to-[#693774] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-amber-300 font-black">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">Lihat & Edit Akun Pengguna</h3>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  user.tier === 'standar' ? 'bg-[#D8C3DD] text-[#522D60]' : 'bg-amber-400 text-[#2A1532]'
                }`}>
                  {user.tier === 'standar' ? 'Standar' : 'PRO'}
                </span>
              </div>
              <p className="text-xs text-white/80">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* User Account Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF3FB] p-3.5 rounded-2xl border border-[#E8D6EB] text-xs">
            <div>
              <span className="text-[10px] text-[#74607B] block font-bold">Dokumen Dibuat:</span>
              <span className="font-extrabold text-[#522D60] flex items-center gap-1 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
                {user.docs_count} Dokumen RPM
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#74607B] block font-bold">Tanggal Daftar:</span>
              <span className="font-bold text-[#2A1532] mt-0.5 block">{user.created_at}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#74607B] block font-bold">Status Login:</span>
              <span className={`inline-block mt-0.5 font-bold ${isActive ? 'text-emerald-700' : 'text-rose-600'}`}>
                ● {isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#74607B] block font-bold">ID Akun:</span>
              <span className="font-mono text-[10px] text-[#74607B] truncate block mt-0.5">
                {user.id.slice(0, 8)}...
              </span>
            </div>
          </div>

          {/* Section 1: Data Identitas Pendidik */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#80426E] flex items-center gap-1.5 pb-1 border-b border-[#EFE6F2]">
              <User className="w-3.5 h-3.5" /> Data Profil Pendidik
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Nomor WhatsApp Guru</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#80426E] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Nama Satuan PAUD / TK</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-[#80426E] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="TK Aisyiah 01"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Kelompok Usia Belajar</label>
                <select
                  value={assignedClass}
                  onChange={(e) => setAssignedClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                >
                  <option value="A (4-5 Tahun)">Kelompok A (4–5 Tahun)</option>
                  <option value="B (5-6 Tahun)">Kelompok B (5–6 Tahun)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Paket Langganan & Masa Aktif */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#80426E] flex items-center gap-1.5 pb-1 border-b border-[#EFE6F2]">
              <Crown className="w-3.5 h-3.5 text-amber-500" /> Paket Langganan & Status Akses
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Tier Paket</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532] bg-[#FAF3FB]"
                >
                  <option value="standar">Standar (15 RPM/bln)</option>
                  <option value="pro">PRO (40 RPM/bln + Lampiran)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Durasi Langganan</label>
                <select
                  value={duration}
                  onChange={(e) => {
                    const nextDur = e.target.value as any;
                    setDuration(nextDur);
                    const d = new Date();
                    const days = nextDur === '1_bulan' ? 30 : nextDur === '6_bulan' ? 180 : nextDur === 'lifetime' ? 3650 : 365;
                    d.setDate(d.getDate() + days);
                    setExpiryDate(d.toISOString().slice(0, 10));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                >
                  <option value="1_bulan">1 Bulan (30 Hari)</option>
                  <option value="6_bulan">6 Bulan (180 Hari)</option>
                  <option value="1_tahun">1 Tahun (365 Hari)</option>
                  <option value="lifetime">Akses Selamanya (Lifetime)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Berlaku Hingga</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-[#80426E] absolute left-3 top-3" />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Peran Hak Akses</label>
                <select
                  disabled={isSuperadmin}
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532] disabled:opacity-50"
                >
                  <option value="guru">Guru (Perencana Pembelajaran)</option>
                  <option value="admin">Administrator Sistem</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Status Keaktifan Akun</label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isSuperadmin}
                    onClick={() => setIsActive(!isActive)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    <span>{isActive ? '● Akun Aktif (Dapat Login)' : '○ Akun Dinonaktifkan'}</span>
                  </button>
                  {isSuperadmin && (
                    <span className="text-[11px] text-[#74607B] italic">Superadmin utama tidak dapat dinonaktifkan.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Kelola Kata Sandi Akun */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-700" /> Kelola Kata Sandi Akun
              </h4>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#80426E] hover:text-[#522D60] hover:underline cursor-pointer"
              >
                <Dices className="w-3.5 h-3.5 text-[#D97706]" />
                <span>🎲 Acak Sandi Baru</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-600">
              Kosongkan jika tidak ingin mengubah kata sandi pengguna saat ini.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ketik kata sandi baru (min. 6 kar)"
                  className="w-full pl-3 pr-10 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#522D60] text-slate-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <button
                  type="button"
                  disabled={isSendingResetEmail}
                  onClick={handleSendResetEmail}
                  className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Kirim tautan reset kata sandi ke email pengguna"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isSendingResetEmail ? 'Mengirim...' : 'Kirim Tautan Reset ke Email'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-[#EFE6F2] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#74607B] hover:bg-[#FAF3FB] transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-xl text-xs font-extrabold text-white bg-[#522D60] hover:bg-[#693774] shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
