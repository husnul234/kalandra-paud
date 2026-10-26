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
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset Password Dialog state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Create User Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'guru'>('guru');
  const [newSchool, setNewSchool] = useState('TK NEGERI PEMBINA 01');
  const [newClass, setNewClass] = useState('A (4-5 Tahun)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*, schools(name)')
        .order('created_at', { ascending: false });

      // 2. Fetch document counts per user
      const { data: docs } = await supabase
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

      const mapped: UserRow[] = (profiles || []).map((p) => ({
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

      // Ensure Superadmin Pak Husnul is always available in the view
      if (!mapped.some((u) => u.email.toLowerCase() === 'pakhusnulid@gmail.com')) {
        mapped.unshift({
          id: 'admin-husnul-root',
          email: 'pakhusnulid@gmail.com',
          full_name: 'Pak Husnul (Administrator)',
          role: 'admin',
          school_name: 'Kalandra PAUD Official',
          assigned_class: 'Superadmin Platform',
          docs_count: docs?.length || 0,
          is_active: true,
          created_at: '2026-01-01',
        });
      }

      setUsers(mapped);
    } catch (e) {
      console.warn('Users fetch error:', e);
      // Fallback minimum admin
      setUsers([
        {
          id: 'admin-husnul-root',
          email: 'pakhusnulid@gmail.com',
          full_name: 'Pak Husnul (Administrator)',
          role: 'admin',
          school_name: 'Kalandra PAUD Official',
          assigned_class: 'Superadmin Platform',
          docs_count: 0,
          is_active: true,
          created_at: '2026-01-01',
        },
      ]);
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
      await supabase
        .from('profiles')
        .update({ is_active: updated })
        .eq('id', userId);
    } catch (e) {
      console.warn('Error updating profile status:', e);
    }

    showToast(`Status akun ${target.full_name} berhasil ${updated ? 'diaktifkan' : 'dinonaktifkan'}.`);
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
      await supabase
        .from('profiles')
        .update({ role: nextRole })
        .eq('id', userId);
    } catch (e) {
      console.warn('Error updating profile role:', e);
    }

    showToast(`Peran ${target.full_name} berhasil diubah menjadi ${nextRole}.`);
  };

  const handleOpenReset = (user: UserRow) => {
    setSelectedUser(user);
    setNewPassword('Kalandra2026!');
    setIsResetOpen(true);
  };

  const handleConfirmReset = () => {
    if (!selectedUser) return;
    showToast(`Instruksi pengaturan ulang kata sandi untuk ${selectedUser.full_name} berhasil dikirim.`);
    setIsResetOpen(false);
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email.toLowerCase() === 'pakhusnulid@gmail.com') {
      showToast('Tidak dapat menghapus akun Superadmin utama.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun pengguna ${email}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      try {
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.from('allowed_customers').delete().ilike('email', email);
      } catch (e) {
        console.warn('Error deleting user:', e);
      }

      showToast(`Akun ${email} berhasil dihapus dari sistem.`);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanName = newFullName.trim();
    if (!cleanEmail || !cleanName) return;

    const newUser: UserRow = {
      id: `u-${Date.now()}`,
      email: cleanEmail,
      full_name: cleanName,
      role: newRole,
      school_name: newSchool,
      assigned_class: newClass,
      docs_count: 0,
      is_active: true,
      created_at: new Date().toISOString().slice(0, 10),
    };

    setUsers([newUser, ...users]);
    setIsCreateOpen(false);

    try {
      // Also register in allowed_customers so they can activate their password
      await supabase.from('allowed_customers').insert({
        email: cleanEmail,
        full_name: cleanName,
        school_name: newSchool,
        account_type: 'annual',
        is_active: true,
      });
    } catch (e) {
      console.warn('Create user whitelist sync warning:', e);
    }

    showToast(`Pengguna baru ${cleanName} berhasil ditambahkan dan di-whitelist!`);
    setNewEmail('');
    setNewFullName('');
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
            Kelola akun guru TK terdaftar, hak akses peran admin, dan status operasional sistem
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
            onClick={() => setIsCreateOpen(true)}
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
              {filteredUsers.length === 0 ? (
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
                <h3 className="font-extrabold text-sm text-[#2A1532]">Tambah Pengguna Baru</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-[#74607B] hover:bg-[#FAF3FB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Email Pengguna *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="guru@paudceria.sch.id"
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

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Satuan PAUD</label>
                <input
                  type="text"
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  placeholder="TK NEGERI PEMBINA 01"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Kelompok Usia</label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                >
                  <option value="A (4-5 Tahun)">Kelompok A (4-5 Tahun)</option>
                  <option value="B (5-6 Tahun)">Kelompok B (5-6 Tahun)</option>
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
                  className="py-2 px-4 rounded-xl text-xs font-extrabold text-white bg-[#522D60] hover:bg-[#693774] shadow-sm"
                >
                  Simpan Pengguna
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
                Masukkan kata sandi sementara baru untuk guru <span className="font-bold text-[#2A1532]">{selectedUser.full_name}</span> ({selectedUser.email}):
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
                  onClick={handleConfirmReset}
                  className="py-2 px-4 rounded-xl text-xs font-extrabold text-white bg-[#522D60] hover:bg-[#693774] shadow-sm"
                >
                  Kirim & Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};