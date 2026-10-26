import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  FileText, 
  Building2, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Search, 
  Code2, 
  BookOpen, 
  RefreshCw 
} from 'lucide-react';
import { SYSTEM_INSTRUCTION_RPM_PAUD, GEMINI_MODEL_CHAIN } from '../lib/gemini-rpm-engine';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'guru';
  school: string;
  classAssigned: string;
  docsGenerated: number;
  isActive: boolean;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'u-1',
    name: 'Dewi Rahmawati, S.Pd.',
    email: 'guru.dewi@paudceria.sch.id',
    role: 'guru',
    school: 'TK NEGERI PEMBINA 01',
    classAssigned: 'A (4-5 Tahun)',
    docsGenerated: 14,
    isActive: true,
  },
  {
    id: 'u-2',
    name: 'Hj. Siti Rahayu, M.Pd.',
    email: 'kepala.tk@paudceria.sch.id',
    role: 'admin',
    school: 'TK NEGERI PEMBINA 01',
    classAssigned: 'Kepala Satuan',
    docsGenerated: 5,
    isActive: true,
  },
  {
    id: 'u-3',
    name: 'Anisa Nuraini, S.Pd.',
    email: 'anisa.guru@kartika.sch.id',
    role: 'guru',
    school: 'TK KARTIKA CENDEKIA',
    classAssigned: 'B (5-6 Tahun)',
    docsGenerated: 8,
    isActive: true,
  },
  {
    id: 'u-4',
    name: 'Budi Santoso, S.Pd.',
    email: 'budi.santoso@paudceria.sch.id',
    role: 'guru',
    school: 'TK NEGERI PEMBINA 01',
    classAssigned: 'B (5-6 Tahun)',
    docsGenerated: 2,
    isActive: false,
  },
];

const INITIAL_LOGS = [
  { id: 1, time: '11:45:10', user: 'Dewi Rahmawati', action: 'DOCX_EXPORTED', details: 'Topik: Identitas Diriku (Format F4 Folio)' },
  { id: 2, time: '11:42:04', user: 'Dewi Rahmawati', action: 'DOCUMENT_GENERATED', details: 'Topik: Aku Istimewa (Model: gemini-3.6-flash, 18 Kegiatan OK)' },
  { id: 3, time: '10:15:33', user: 'Anisa Nuraini', action: 'DOCUMENT_GENERATED', details: 'Topik: Tanaman Sayur di Sekitarku (Model: gemini-3.6-flash)' },
  { id: 4, time: '09:30:12', user: 'Hj. Siti Rahayu', action: 'USER_ROLE_UPDATED', details: 'Promote Guru Dewi to Coordinator' },
];

export const AdminConsole: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'prompt' | 'audit'>('users');

  const toggleUserStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  const toggleUserRole = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: u.role === 'admin' ? 'guru' : 'admin' } : u)));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDocs = users.reduce((acc, u) => acc + u.docsGenerated, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" /> SUPERADMIN & CREATOR CONSOLE
          </div>
          <h1 className="text-2xl font-black tracking-tight">Pusat Tata Kelola Platform Kalandra</h1>
          <p className="text-xs text-blue-200/80 mt-1 max-w-xl">
            Pantau aktivitas guru lintas satuan PAUD, manajemen lisensi & akun, serta audit kepatuhan regulasi Kemendikdasmen 2025/2026.
          </p>
        </div>

        {/* Quick Platform Metrics */}
        <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 text-center">
          <div>
            <div className="text-xl font-black text-amber-400">{users.length}</div>
            <div className="text-[10px] text-blue-200 font-medium uppercase mt-0.5">Pendidik</div>
          </div>
          <div className="border-x border-white/10 px-3">
            <div className="text-xl font-black text-emerald-400">{totalDocs}</div>
            <div className="text-[10px] text-blue-200 font-medium uppercase mt-0.5">RPM Dibuat</div>
          </div>
          <div>
            <div className="text-xl font-black text-white">2</div>
            <div className="text-[10px] text-blue-200 font-medium uppercase mt-0.5">Satuan TK</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 pt-3 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'users' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Manajemen Pendidik ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'prompt' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" /> Master Prompt & Regulasi
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'audit' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" /> Log Aktivitas Sistem
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 border-t-0 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama guru, email, atau sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-xs text-slate-500">
              Menampilkan {filteredUsers.length} pengguna
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Nama & Email Pendidik</th>
                  <th className="p-3.5">Satuan PAUD</th>
                  <th className="p-3.5">Peran Akun</th>
                  <th className="p-3.5 text-center">RPM Dibuat</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-slate-500">{u.email}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{u.school}</div>
                      <div className="text-slate-500">{u.classAssigned}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-800">
                      {u.docsGenerated} Dokumen
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                          u.isActive ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {u.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => toggleUserRole(u.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700"
                        title="Ubah peran admin/guru"
                      >
                        Ubah Peran
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          u.isActive
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM PROMPT & REGULATORY AUDIT */}
      {activeTab === 'prompt' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 border-t-0 shadow-sm space-y-5">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="block text-amber-900 font-bold mb-1">
                Kepatuhan Regulasi Resmi Kemendikdasmen RI (Anti-Halusinasi Guard):
              </strong>
              Prompt ini secara ketat melarang kemunculan istilah usang seperti <em>"P5"</em> atau <em>"Profil Pelajar Pancasila"</em>, dan mengunci penggunaan <strong>"Dimensi Profil Lulusan (DPL1 - DPL8)"</strong> sesuai Permendikdasmen No. 10/2025. Subelemen Capaian Pembelajaran disalin verbatim tanpa pengubahan.
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Hirarki Model AI & Rantai Cadangan (Fallback Chain)
              </span>
              <span className="text-xs text-slate-500 font-mono">Dukungan Google AI Studio BYOK</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {GEMINI_MODEL_CHAIN.map((m, i) => (
                <div
                  key={m}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
                    i === 0
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  {m}
                  {i === 0 && <span className="text-[10px] text-blue-700 font-sans font-bold">(Utama)</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Konfigurasi System Instruction Aktif:
            </label>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed overflow-x-auto max-h-96 whitespace-pre-wrap border border-slate-800">
              {SYSTEM_INSTRUCTION_RPM_PAUD}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 border-t-0 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Log Aktivitas Pembuatan Dokumen Real-Time
            </span>
            <button className="text-xs font-semibold text-blue-700 flex items-center gap-1 hover:underline">
              <RefreshCw className="w-3.5 h-3.5" /> Segarkan
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Pendidik</th>
                  <th className="p-3">Aksi Sistem</th>
                  <th className="p-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{log.time}</td>
                    <td className="p-3 font-bold text-slate-900">{log.user}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
