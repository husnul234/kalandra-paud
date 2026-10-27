import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Shield, 
  UserCheck, 
  UserX, 
  KeyRound, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  X,
  Building2,
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  Lock
} from 'lucide-react';
import { 
  supabaseAdmin, 
  adminCreateUser, 
  adminDeleteUser, 
  adminResetPassword, 
  adminToggleUserStatus, 
  adminToggleUserRole 
} from '../../lib/supabaseAdmin';

export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'guru';
  school_name: string;
  assigned_class: string;
  docs_count: number;
  is_active: boolean;
  created_at: string;
}

export const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'guru'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset Password Dialog state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [newPassword, setNewPassword] = useState('Kalandra2026!');
  const [showPassword, setShowPassword] = useState(false);

  // Create User Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newInitialPassword, setNewInitialPassword] = useState('Kalandra2026!');
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'guru'>('guru');
  const [createError, setCreateError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch real profiles from database
      const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select('*, schools(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Fetch profiles error:', error);
      }

      // 2. Fetch real document counts per user
      const { data: docs } = await supabaseAdmin
        .from('generated_documents')
        .select('user_id');

      const docsCountMap: Record<string, number> = {};
      if (docs) {
        docs.forEach((d: any) => {
          if (d.user_id) {
            docsCountMap[d.user_id] = (docsCountMap[d.user_id] || 0) + 1;
          }
        });
      }

      const mapped: UserRow[] = (profiles || []).map((p: any) => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name || p.email.split('@')[0],
        role: p.email?.toLowerCase() === 'pakhusnulid@gmail.com' ? 'admin' : (p.role || 'guru'),
        school_name: (p.schools as any)?.name || 'TK NEGERI PEMBINA 01',
        assigned_class: p.assigned_class || 'A (4-5 Tahun)',
        docs_count: docsCountMap[p.id] || 0,
        is_active: p.is_active ?? true,
        created_at: p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      }));

      setUsers(mapped);
    } catch (e) {
      console.warn('Users fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    if (target.email.toLowerCase() === 'pakhusnulid@gmail.com') {
      showToast('Status Superadmin utama tidak dapat dinonaktifkan.');
      return;
    }

    const updated = !target.is_active;

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: updated } : u))
    );

    try {
      await adminToggleUserStatus(userId, updated);
      showToast(`Status akun ${target.full_name} berhasil ${updated ? 'diaktifkan' : 'dinonaktifkan'}.`);
    } catch (e: any) {
      console.error('Error updating status:', e);
      showToast(`Gagal mengubah status: ${e.message}`);
      fetchUsers();
    }
  };

  const handleToggleRole = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    if (target.email.toLowerCase() === 'pakhusnulid@gmail.com') {
      showToast('Peran Superadmin utama tidak dapat diubah.');
      return;
    }

    const nextRole = target.role === 'admin' ? 'guru' : 'admin';

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );

    try {
      await adminToggleUserRole(userId, nextRole);
      showToast(`Peran ${target.full_name} berhasil diubah menjadi ${nextRole}.`);
    } catch (e: any) {
      console.error('Error updating role:', e);
      showToast(`Gagal mengubah peran: ${e.message}`);
      fetchUsers();
    }
  };

  const handleOpenReset = (user: UserRow) => {
    setSelectedUser(user);
    setNewPassword('Kalandra2026!');
    setIsResetOpen(true);
  };

  const handleConfirmReset = async () => {
    if (!selectedUser) return;
    if (newPassword.length < 6) {
      alert('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminResetPassword(selectedUser.email);
      showToast(`Tautan reset kata sandi aman telah dikirimkan ke email ${selectedUser.email}.`);
      setIsResetOpen(false);
    } catch (e: any) {
      alert(`Gagal mengirim tautan reset kata sandi: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email.toLowerCase() === 'pakhusnulid@gmail.com') {
      showToast('Tidak dapat menghapus akun Superadmin utama.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus akun ${email} secara permanen? Pengguna tidak akan dapat login lagi.`)) {
      try {
        await adminDeleteUser(userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showToast(`Akun ${email} berhasil dihapus dari sistem.`);
      } catch (e: any) {
        alert(`Gagal menghapus akun: ${e.message}`);
        fetchUsers();
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanName = newFullName.trim();

    if (!cleanEmail || !cleanName) {
      setCreateError('Email dan Nama Lengkap wajib diisi.');
      return;
    }

    if (newInitialPassword.length < 6) {
      setCreateError('Kata sandi awal minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminCreateUser({
        email: cleanEmail,
        password: newInitialPassword,
        full_name: cleanName,
        role: newRole,
      });

      await fetchUsers();
      setIsCreateOpen(false);
      showToast(`Pengguna baru ${cleanName} (${cleanEmail}) berhasil didaftarkan dan dapat langsung login!`);

      // Reset form
      setNewEmail('');
      setNewFullName('');
      setNewInitialPassword('Kalandra2026!');
    } catch (e: any) {
      console.error('Error creating user:', e);
      setCreateError(e.message || 'Gagal menambahkan pengguna baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.school_name.toLowerCase().includes(q);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && u.is_active) ||
      (statusFilter === 'inactive' && !u.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2A1532] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-[#522D60] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EFE6F2]">
        <div>
          <h1 className="text-2xl font-black text-[#2A1532] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#80426E]" /> Pengguna & Peran Akun
          </h1>
          <p className="text-xs text-[#74607B] mt-0.5">
            Daftar akun pendidik PAUD terverifikasi di basis data Supabase resmi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2 rounded-xl border border-[#D8C3DD] bg-white text-[#522D60] hover:bg-[#FAF3FB] transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
          <button
            onClick={() => {
              setCreateError(null);
              setIsCreateOpen(true);
            }}
            className="py-2 px-3.5 rounded-xl text-white bg-[#522D60] hover:bg-[#693774] shadow-sm flex items-center gap-1.5 text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#EFE6F2] shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[#74607B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, email, atau satuan TK..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] text-[#2A1532]"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Role Filter */}
          <div className="flex items-center bg-[#FAF3FB] p-0.5 rounded-xl border border-[#E8D6EB]">
            {(['all', 'admin', 'guru'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                  roleFilter === r
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'text-[#74607B] hover:text-[#522D60]'
                }`}
              >
                {r === 'all' ? 'Semua Peran' : r === 'admin' ? 'Admin' : 'Guru'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-[#FAF3FB] p-0.5 rounded-xl border border-[#E8D6EB]">
            {(['all', 'active', 'inactive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === s
                    ? 'bg-[#80426E] text-white shadow-xs'
                    : 'text-[#74607B] hover:text-[#80426E]'
                }`}
              >
                {s === 'all' ? 'Semua Status' : s === 'active' ? 'Aktif' : 'Nonaktif'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#EFE6F2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF3FB] border-b border-[#E8D6EB] text-[11px] font-extrabold uppercase tracking-wider text-[#74607B]">
                <th className="py-3 px-4">Nama Lengkap & Email</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Satuan & Kelompok</th>
                <th className="py-3 px-4 text-center">Dokumen RPM</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE6F2] text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#74607B]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#522D60]" />
                      <span>Memuat data pengguna dari basis data Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#74607B]">
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuperadmin = u.email.toLowerCase() === 'pakhusnulid@gmail.com';

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF3FB]/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#2A1532] flex items-center gap-1.5">
                          <span>{u.full_name}</span>
                          {isSuperadmin && (
                            <span className="text-[10px] bg-[#522D60] text-[#FFD38B] font-extrabold px-1.5 py-0.5 rounded-md">
                              SUPERADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#74607B] font-mono">{u.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleRole(u.id)}
                          disabled={isSuperadmin}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            u.role === 'admin'
                              ? 'bg-[#522D60] text-white shadow-xs'
                              : 'bg-[#FAF3FB] text-[#80426E] border border-[#E8D6EB] hover:bg-[#F6ECF8]'
                          } ${isSuperadmin ? 'cursor-default' : 'cursor-pointer'}`}
                          title={isSuperadmin ? 'Peran Superadmin tidak dapat diubah' : 'Klik untuk mengubah peran'}
                        >
                          <Shield className="w-3 h-3 text-[#FFD38B]" />
                          <span className="capitalize">{u.role}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#2A1532] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#80426E]" />
                          <span>{u.school_name}</span>
                        </div>
                        <div className="text-[11px] text-[#74607B] flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3 h-3 text-[#74607B]" />
                          <span>{u.assigned_class}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-[#522D60]">
                        <span className="bg-[#FAF3FB] px-2.5 py-1 rounded-full border border-[#E8D6EB]">
                          {u.docs_count} Dokumen
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          disabled={isSuperadmin}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                            u.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          } ${isSuperadmin ? 'cursor-default' : 'cursor-pointer'}`}
                          title={isSuperadmin ? 'Superadmin selalu aktif' : 'Klik untuk mengaktifkan/menonaktifkan'}
                        >
                          {u.is_active ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>Nonaktif</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReset(u)}
                            title="Atur Ulang Kata Sandi"
                            className="p-1.5 rounded-lg border border-[#D8C3DD] bg-white text-[#522D60] hover:bg-[#FAF3FB] transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {!isSuperadmin && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              title="Hapus Akun Pengguna"
                              className="p-1.5 rounded-lg border border-red-100 bg-white text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE USER */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D8C3DD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE6F2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#522D60] text-white flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#FFD38B]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#2A1532]">Tambah Pengguna Baru</h3>
                  <p className="text-[11px] text-[#74607B]">Pengguna langsung terdaftar di Supabase dan bisa login</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-[#74607B] hover:bg-[#FAF3FB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Email Pengguna *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="guru@sekolah.sch.id"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Dewi Rahmawati, S.Pd."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Kata Sandi Awal *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#80426E] absolute left-3 top-2.5" />
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    required
                    value={newInitialPassword}
                    onChange={(e) => setNewInitialPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-2.5 text-[#74607B] hover:text-[#522D60]"
                  >
                    {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Peran Akun</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                >
                  <option value="guru">Guru (End-User Perencana RPM)</option>
                  <option value="admin">Admin (Pengelola Sistem)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE6F2]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-[#74607B] hover:bg-[#FAF3FB]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2 px-4 rounded-xl text-xs font-extrabold text-white bg-[#522D60] hover:bg-[#693774] shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Daftarkan Pengguna</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {isResetOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#D8C3DD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE6F2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#522D60] text-white flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-[#FFD38B]" />
                </div>
                <h3 className="font-extrabold text-sm text-[#2A1532]">Atur Ulang Kata Sandi</h3>
              </div>
              <button
                onClick={() => setIsResetOpen(false)}
                className="p-1 rounded-lg text-[#74607B] hover:bg-[#FAF3FB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#74607B]">
                Masukkan kata sandi baru untuk <span className="font-bold text-[#2A1532]">{selectedUser.full_name}</span> ({selectedUser.email}):
              </p>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-xs rounded-xl border border-[#CBB4D1] font-mono text-[#2A1532]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#74607B] hover:text-[#522D60]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE6F2]">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-[#74607B] hover:bg-[#FAF3FB]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmReset}
                  className="py-2 px-4 rounded-xl text-xs font-extrabold text-white bg-[#522D60] hover:bg-[#693774] shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Kata Sandi</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};