import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Plus, 
  RefreshCw, 
  MessageSquare, 
  CalendarPlus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X,
  Building2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { ActivationMessageModal, CustomerActivationInfo } from './ActivationMessageModal';

export interface AllowedCustomerRow {
  id: string;
  email: string;
  full_name: string;
  whatsapp: string;
  school_name: string;
  account_type: 'trial' | 'lite' | 'annual' | 'lifetime';
  subscription_start: string;
  subscription_end?: string;
  is_active: boolean;
  notes?: string;
}

const DEFAULT_CUSTOMERS: AllowedCustomerRow[] = [
  {
    id: 'c-1',
    email: 'pakhusnulid@gmail.com',
    full_name: 'Pak Husnul (Admin)',
    whatsapp: '081234567890',
    school_name: 'Pusat Kurikulum PAUD',
    account_type: 'lifetime',
    subscription_start: '2026-01-01',
    subscription_end: '2036-01-01',
    is_active: true,
    notes: 'Superadministrator Platform',
  },
  {
    id: 'c-2',
    email: 'guru.dewi@paudceria.sch.id',
    full_name: 'Dewi Rahmawati, S.Pd.',
    whatsapp: '085712345678',
    school_name: 'TK NEGERI PEMBINA 01',
    account_type: 'annual',
    subscription_start: '2026-02-01',
    subscription_end: '2027-02-01',
    is_active: true,
    notes: 'Guru Kelompok A',
  },
  {
    id: 'c-3',
    email: 'anisa.guru@kartika.sch.id',
    full_name: 'Anisa Nuraini, S.Pd.',
    whatsapp: '081398765432',
    school_name: 'TK KARTIKA CENDEKIA',
    account_type: 'annual',
    subscription_start: '2026-02-15',
    subscription_end: '2027-02-15',
    is_active: true,
    notes: 'Guru Kelompok B',
  },
  {
    id: 'c-4',
    email: 'ratih.paud@binaanak.sch.id',
    full_name: 'Ratih Kumala, S.Pd.',
    whatsapp: '081298877665',
    school_name: 'PAUD BINA ANAK CERIA',
    account_type: 'lite',
    subscription_start: '2026-03-01',
    subscription_end: '2026-09-01',
    is_active: true,
    notes: 'Paket Semester Gasal',
  },
];

export const AdminCustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<AllowedCustomerRow[]>(DEFAULT_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState<'all' | 'annual' | 'lite' | 'lifetime' | 'trial'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Activation Message Modal
  const [messageTarget, setMessageTarget] = useState<CustomerActivationInfo | null>(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  // Add Customer Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formSchool, setFormSchool] = useState('');
  const [formType, setFormType] = useState<'annual' | 'lite' | 'lifetime' | 'trial'>('annual');
  const [formNotes, setFormNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('allowed_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCustomers(
          data.map((c) => ({
            id: c.id,
            email: c.email,
            full_name: c.full_name || c.email.split('@')[0],
            whatsapp: c.whatsapp || '',
            school_name: c.school_name || 'Satuan PAUD',
            account_type: c.account_type || 'annual',
            subscription_start: new Date(c.subscription_start).toISOString().slice(0, 10),
            subscription_end: c.subscription_end
              ? new Date(c.subscription_end).toISOString().slice(0, 10)
              : undefined,
            is_active: c.is_active ?? true,
            notes: c.notes || '',
          }))
        );
      }
    } catch (e) {
      console.warn('Customers fetch warning:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenMessage = (c: AllowedCustomerRow) => {
    setMessageTarget({
      fullName: c.full_name,
      email: c.email,
      whatsapp: c.whatsapp,
      schoolName: c.school_name,
      accountType: c.account_type,
      expiryDate: c.subscription_end,
    });
    setIsMessageOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
    showToast('Status lisensi member berhasil diperbarui.');
  };

  const handleExtendSubscription = (id: string, monthsToAdd: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const currentEnd = c.subscription_end ? new Date(c.subscription_end) : new Date();
          currentEnd.setMonth(currentEnd.getMonth() + monthsToAdd);
          const newEnd = currentEnd.toISOString().slice(0, 10);
          showToast(`Masa aktif ${c.full_name} berhasil diperpanjang hingga ${newEnd}!`);
          return { ...c, subscription_end: newEnd };
        }
        return c;
      })
    );
  };

  const handleDelete = (id: string, email: string) => {
    if (confirm(`Hapus whitelist untuk ${email}?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast('Data member berhasil dihapus dari whitelist.');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formName.trim()) return;

    const startDate = new Date();
    const endDate = new Date(startDate);
    if (formType === 'lite') endDate.setMonth(endDate.getMonth() + 6);
    else if (formType === 'annual') endDate.setFullYear(endDate.getFullYear() + 1);
    else if (formType === 'lifetime') endDate.setFullYear(endDate.getFullYear() + 10);
    else if (formType === 'trial') endDate.setDate(endDate.getDate() + 14);

    const newCustomer: AllowedCustomerRow = {
      id: `c-${Date.now()}`,
      email: formEmail.trim(),
      full_name: formName.trim(),
      whatsapp: formWhatsapp.trim(),
      school_name: formSchool.trim() || 'Satuan TK',
      account_type: formType,
      subscription_start: startDate.toISOString().slice(0, 10),
      subscription_end: endDate.toISOString().slice(0, 10),
      is_active: true,
      notes: formNotes.trim(),
    };

    setCustomers([newCustomer, ...customers]);
    setIsAddOpen(false);
    showToast(`Member baru ${formName} berhasil di-whitelist!`);

    // Reset form
    setFormEmail('');
    setFormName('');
    setFormWhatsapp('');
    setFormSchool('');
    setFormNotes('');
  };

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      c.full_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.school_name.toLowerCase().includes(q) ||
      c.whatsapp.includes(q);

    const matchType = packageFilter === 'all' || c.account_type === packageFilter;
    return matchQuery && matchType;
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
            <UserCheck className="w-6 h-6 text-[#80426E]" /> Pelanggan & Member Whitelist
          </h1>
          <p className="text-xs text-[#74607B] mt-0.5">
            Kelola lisensi akses guru PAUD, batas waktu masa aktif, dan pengiriman notifikasi WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCustomers}
            disabled={isLoading}
            className="p-2 rounded-xl border border-[#D8C3DD] bg-white text-[#522D60] hover:bg-[#FAF3FB] transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="py-2 px-3.5 rounded-xl text-white bg-[#522D60] hover:bg-[#693774] shadow-sm flex items-center gap-1.5 text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Member</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#EFE6F2] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[#74607B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, email, sekolah, nomor WhatsApp..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] text-[#2A1532]"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'annual', label: '1 Tahun' },
            { id: 'lite', label: 'Semester' },
            { id: 'lifetime', label: 'Lifetime' },
            { id: 'trial', label: 'Trial' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPackageFilter(item.id as any)}
              className={`py-1 px-3 rounded-xl text-xs font-bold transition-all ${
                packageFilter === item.id
                  ? 'bg-[#522D60] text-white shadow-xs'
                  : 'text-[#74607B] hover:text-[#522D60] hover:bg-[#FAF3FB]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#EFE6F2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF3FB] border-b border-[#E8D6EB] text-[11px] font-extrabold uppercase tracking-wider text-[#74607B]">
                <th className="py-3 px-4">Guru & WhatsApp</th>
                <th className="py-3 px-4">Lembaga Satuan TK</th>
                <th className="py-3 px-4">Paket Lisensi</th>
                <th className="py-3 px-4">Masa Berlaku</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE6F2] text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#74607B]">
                    Tidak ada member whitelist yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const badgeColor =
                    c.account_type === 'lifetime'
                      ? 'bg-[#522D60] text-white'
                      : c.account_type === 'annual'
                      ? 'bg-[#80426E] text-white'
                      : c.account_type === 'lite'
                      ? 'bg-[#F2A67B] text-white'
                      : 'bg-[#FFD38B] text-[#7A5300]';

                  return (
                    <tr key={c.id} className="hover:bg-[#FAF3FB]/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#2A1532]">{c.full_name}</div>
                        <div className="text-[11px] text-[#74607B] font-mono">{c.email}</div>
                        {c.whatsapp && (
                          <div className="text-[10px] text-emerald-700 font-medium">WA: {c.whatsapp}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#2A1532] flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#80426E]" /> {c.school_name}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeColor}`}>
                          {c.account_type === 'lifetime'
                            ? 'Lifetime'
                            : c.account_type === 'annual'
                            ? '1 Tahun'
                            : c.account_type === 'lite'
                            ? 'Semester'
                            : 'Trial'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="flex items-center gap-1 text-[#2A1532]">
                          <Calendar className="w-3.5 h-3.5 text-[#74607B]" />
                          {c.subscription_end || 'Selamanya'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(c.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                            c.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-red-50 text-red-700 border-red-300'
                          }`}
                        >
                          {c.is_active ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send WhatsApp Message */}
                          <button
                            onClick={() => handleOpenMessage(c)}
                            title="Kirim Pesan Aktivasi WA"
                            className="p-1.5 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1 text-[11px] font-bold"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Kirim WA</span>
                          </button>

                          {/* Extend 1 Year */}
                          <button
                            onClick={() => handleExtendSubscription(c.id, 12)}
                            title="Perpanjang +1 Tahun"
                            className="p-1.5 rounded-lg border border-[#D8C3DD] text-[#522D60] hover:bg-[#FAF3FB] transition-colors"
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(c.id, c.email)}
                            title="Hapus Member"
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Modal Tambah Pelanggan Baru */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EFE6F2]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#2A1532] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#522D60]" /> Tambah Member ke Whitelist
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#74607B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Nama Lengkap Guru *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Ratih Kumala, S.Pd."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Email Guru (Untuk Login) *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="ratih.guru@email.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="081234567890"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">Paket Lisensi</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532] bg-white"
                  >
                    <option value="annual">1 Tahun Ajaran</option>
                    <option value="lite">1 Semester (6 Bulan)</option>
                    <option value="lifetime">Akses Lifetime</option>
                    <option value="trial">Trial 14 Hari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Satuan TK / KB</label>
                <input
                  type="text"
                  value={formSchool}
                  onChange={(e) => setFormSchool(e.target.value)}
                  placeholder="Contoh: TK KARTIKA CENDEKIA"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Pembayaran transfer BCA via Bu Dewi"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="py-2 px-3 text-xs font-semibold text-[#74607B]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774]"
                >
                  Simpan Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activation Message Modal */}
      <ActivationMessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        customer={messageTarget}
      />
    </div>
  );
};
