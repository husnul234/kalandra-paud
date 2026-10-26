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
  EyeOff
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

const DEFAULT_USERS_DATA: UserRow[] = [
  {
    id: 'u-admin-1',
    email: 'pakhusnulid@gmail.com',
    full_name: 'Pak Husnul (Administrator)',
    role: 'admin',
    school_name: 'Kalandra PAUD Official',
    assigned_class: 'Superadmin Platform',
    docs_count: 84,
    is_active: true,
    created_at: '2026-01-10',
  },
  {
    id: 'u-guru-1',
    email: 'guru.dewi@paudceria.sch.id',
    full_name: 'Dewi Rahmawati, S.Pd.',
    role: 'guru',
    school_name: 'TK NEGERI PEMBINA 01',
    assigned_class: 'A (4-5 Tahun)',
    docs_count: 24,
    is_active: true,
    created_at: '2026-02-14',
  },
  {
    id: 'u-guru-2',
    email: 'anisa.guru@kartika.sch.id',
    full_name: 'Anisa Nuraini, S.Pd.',
    role: 'guru',
    school_name: 'TK KARTIKA CENDEKIA',
    assigned_class: 'B (5-6 Tahun)',
    docs_count: 18,
    is_active: true,
    created_at: '2026-02-18',
  },
  {
    id: 'u-guru-3',
    email: 'budi.santoso@paudceria.sch.id',
    full_name: 'Budi Santoso, S.Pd.',
    role: 'guru',
    school_name: 'TK NEGERI PEMBINA 01',
    assigned_class: 'B (5-6 Tahun)',
    docs_count: 6,
    is_active: false,
    created_at: '2026-03-01',
  },
];

export const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>(DEFAULT_USERS_DATA);
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*, schools(name)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: UserRow[] = data.map((p) => ({
          id: p.id,
          email: p.email,
          full_name: p.full_name || p.email.split('@')[0],
          role: p.email.toLowerCase() === 'pakhusnulid@gmail.com' ? 'admin' : (p.role || 'guru'),
          school_name: (p.schools as any)?.name || 'TK NEGERI PEMBINA 01',
          assigned_class: p.assigned_class || 'A (4-5 Tahun)',
          docs_count: 5,
          is_active: p.is_active ?? true,
          created_at: new Date(p.created_at).toISOString().slice(0, 10),
        }));

        // Ensure pakhusnulid@gmail.com is listed
        if (!mapped.some((u) => u.email.toLowerCase() === 'pakhusnulid@gmail.com')) {
          mapped.unshift(DEFAULT_USERS_DATA[0]);
        }

        setUsers(mapped);
      }
    } catch (e) {
      console.warn('Users fetch fallback to default:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = !u.is_active;
          showToast(`Status akun ${u.full_name} berhasil ${updated ? 'diaktifkan' : 'dinonaktifkan'}.`);
          return { ...u, is_active: updated };
        }
        return u;
      })
    );
  };

  const handleToggleRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (u.email.toLowerCase() === 'pakhusnulid@gmail.com') {
            showToast('Peran Superadmin utama tidak dapat diubah.');
            return u;
          }
          const nextRole = u.role === 'admin' ? 'guru' : 'admin';
          showToast(`Peran ${u.full_name} berhasil diubah menjadi ${nextRole}.`);
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const handleOpenReset = (user: UserRow) => {
    setSelectedUser(user);
    setNewPassword('Kalandra2026!');
    setIsResetOpen(true);
  };

  const handleConfirmReset = () => {
    if (!selectedUser) return;
    showToast(`Kata sandi untuk ${selectedUser.full_name} berhasil di-reset.`);
    setIsResetOpen(false);
  };

  const handleDeleteUser = (userId: string, email: string) => {
    if (email.toLowerCase() === 'pakhusnulid@gmail.com') {
      showToast('Tidak dapat menghapus akun Superadmin.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun ${email}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('Akun berhasil dihapus dari sistem.');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newFullName.trim()) return;

    const newUser: UserRow = {
      id: `u-${Date.now()}`,
      email: newEmail.trim(),
      full_name: newFullName.trim(),
      role: newRole,
      school_name: newSchool,
      assigned_class: newClass,
      docs_count: 0,
      is_active: true,
      created_at: new Date().toISOString().slice(0, 10),
    };

    setUsers([newUser, ...users]);
    setIsCreateOpen(false);
    showToast(`Pengguna baru ${newFullName} berhasil ditambahkan!`);
    setNewEmail('');
    setNewFullName('');
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    const matchQuery =
      u.full_name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.school_name.toLowerCase().includes(query);

    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && u.is_active) ||
      (statusFilter === 'inactive' && !u.is_active);

    return matchQuery && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
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
            <Users className="w-6 h-6 text-[#80426E]" /> Manajemen Pengguna & Guru
          </h1>
          <p className="text-xs text-[#74607B] mt-0.5">
            Kelola hak akses akun pendidik PAUD, aktivasi pengguna, dan reset kredensial
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

      {/* Search & Filters */}
      <div className="bg-white p-3 rounded-2xl border border-[#EFE6F2] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#74607B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama guru, email, atau asal TK..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] text-[#2A1532]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="text-xs py-1.5 px-3 rounded-xl border border-[#D8C3DD] text-[#2A1532] bg-white focus:outline-none"
          >
            <option value="all">Semua Peran</option>
            <option value="guru">Guru Kelas</option>
            <option value="admin">Administrator</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs py-1.5 px-3 rounded-xl border border-[#D8C3DD] text-[#2A1532] bg-white focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#EFE6F2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF3FB] border-b border-[#E8D6EB] text-[11px] font-extrabold uppercase tracking-wider text-[#74607B]">
                <th className="py-3 px-4">Nama & Email</th>
                <th className="py-3 px-4">Lembaga Satuan TK</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Peran</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">RPM Dibuat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE6F2] text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#74607B]">
                    Tidak ditemukan data pengguna yang cocok.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isHusnul = u.email.toLowerCase() === 'pakhusnulid@gmail.com';
                  return (
                    <tr key={u.id} className="hover:bg-[#FAF3FB]/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#2A1532] flex items-center gap-1.5">
                          {u.full_name}
                          {isHusnul && (
                            <span className="text-[10px] bg-[#522D60] text-white px-1.5 py-0.2 rounded font-extrabold">
                              ROOT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#74607B] font-mono">{u.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#2A1532] flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#80426E]" /> {u.school_name}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] text-[#74607B] bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                          {u.assigned_class}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleRole(u.id)}
                          title="Klik untuk beralih peran"
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border transition-all ${
                            u.role === 'admin'
                              ? 'bg-[#522D60] text-white border-[#522D60]'
                              : 'bg-[#FAF3FB] text-[#80426E] border-[#D8C3DD] hover:bg-[#F4E8F6]'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          <span>{u.role === 'admin' ? 'Admin' : 'Guru'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          title="Klik untuk ubah status akun"
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border transition-all ${
                            u.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-red-50 text-red-700 border-red-300'
                          }`}
                        >
                          {u.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          <span>{u.is_active ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#522D60]">
                        {u.docs_count} modul
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReset(u)}
                            title="Reset Kata Sandi"
                            className="p-1.5 rounded-lg border border-[#D8C3DD] text-[#522D60] hover:bg-[#FAF3FB] transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          {!isHusnul && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              title="Hapus Pengguna"
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
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

      {/* Modal Reset Password */}
      {isResetOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#EFE6F2]">
            <h3 className="text-sm font-bold text-[#2A1532] flex items-center gap-2 mb-2">
              <KeyRound className="w-4 h-4 text-[#80426E]" /> Reset Kata Sandi Pengguna
            </h3>
            <p className="text-xs text-[#74607B] mb-4">
              Atur ulang kata sandi sementara untuk guru <strong>{selectedUser.full_name}</strong> ({selectedUser.email}).
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-[#2A1532] mb-1">Kata Sandi Baru</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#74607B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsResetOpen(false)}
                className="py-2 px-3 text-xs font-semibold text-[#74607B]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774]"
              >
                Simpan Kata Sandi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pengguna */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EFE6F2]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#2A1532] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#522D60]" /> Daftarkan Pengguna Baru
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-[#74607B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Contoh: Rahmawati, S.Pd."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nama@sekolah.sch.id"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">Peran Akun</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532] bg-white"
                  >
                    <option value="guru">Guru Kelas</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">Kelompok Usia</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532] bg-white"
                  >
                    <option value="A (4-5 Tahun)">Kelompok A (4-5 Th)</option>
                    <option value="B (5-6 Tahun)">Kelompok B (5-6 Th)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Satuan TK / Lembaga</label>
                <input
                  type="text"
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="py-2 px-3 text-xs font-semibold text-[#74607B]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774]"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
