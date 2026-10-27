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
  AlertTriangle,
  Loader2,
  Users
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
  claimed_at?: string | null;
}

const LOCAL_STORAGE_KEY = 'kalandra_allowed_customers';

export const AdminCustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<AllowedCustomerRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState<'all' | 'annual' | 'lite' | 'lifetime' | 'trial'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const syncToLocalStorage = (list: AllowedCustomerRow[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('allowed_customers')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch profiles to get any updated school_name (from avatar_url)
      const { data: profs } = await supabase
        .from('profiles')
        .select('email, avatar_url, full_name');
      const profileMap: Record<string, any> = {};
      if (profs) {
        profs.forEach((p: any) => {
          if (p.email) profileMap[p.email.toLowerCase().trim()] = p;
        });
      }

      if (!error && data) {
        const mapped: AllowedCustomerRow[] = data.map((c) => {
          const prof = profileMap[c.email.toLowerCase().trim()] || {};
          const resolvedSchool = prof.avatar_url || c.school_name || 'Satuan PAUD';

          return {
            id: c.id,
            email: c.email,
            full_name: prof.full_name || c.full_name || c.email.split('@')[0],
            whatsapp: c.whatsapp || '',
            school_name: resolvedSchool,
            account_type: c.account_type || 'annual',
            subscription_start: c.subscription_start ? new Date(c.subscription_start).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            subscription_end: c.subscription_end
              ? new Date(c.subscription_end).toISOString().slice(0, 10)
              : undefined,
            is_active: c.is_active ?? true,
            notes: c.notes || '',
            claimed_at: c.claimed_at,
          };
        });
        setCustomers(mapped);
        syncToLocalStorage(mapped);
      } else {
        // Fallback to localStorage if table is pending migration or offline
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          try {
            setCustomers(JSON.parse(localData));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('Customers fetch error, reading local fallback:', e);
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        try {
          setCustomers(JSON.parse(localData));
        } catch (err) {}
      }
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

  const handleToggleActive = async (id: string) => {
    const target = customers.find((c) => c.id === id);
    if (!target) return;

    const nextActive = !target.is_active;

    // Optimistic UI update
    const updatedList = customers.map((c) =>
      c.id === id ? { ...c, is_active: nextActive } : c
    );
    setCustomers(updatedList);
    syncToLocalStorage(updatedList);

    try {
      await supabase
        .from('allowed_customers')
        .update({ is_active: nextActive })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase update active warning:', e);
    }

    showToast(`Status lisensi ${target.full_name} berhasil ${nextActive ? 'diaktifkan' : 'dinonaktifkan'}.`);
  };

  const handleExtendSubscription = async (id: string, monthsToAdd: number) => {
    const target = customers.find((c) => c.id === id);
    if (!target) return;

    const currentEnd = target.subscription_end ? new Date(target.subscription_end) : new Date();
    currentEnd.setMonth(currentEnd.getMonth() + monthsToAdd);
    const newEnd = currentEnd.toISOString().slice(0, 10);

    // Optimistic UI update
    const updatedList = customers.map((c) =>
      c.id === id ? { ...c, subscription_end: newEnd } : c
    );
    setCustomers(updatedList);
    syncToLocalStorage(updatedList);

    try {
      await supabase
        .from('allowed_customers')
        .update({ subscription_end: new Date(newEnd).toISOString() })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase extend subscription warning:', e);
    }

    showToast(`Masa aktif ${target.full_name} berhasil diperpanjang hingga ${newEnd}!`);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Hapus whitelist lisensi untuk ${email}? Guru tidak akan dapat masuk kembali.`)) {
      return;
    }

    const updatedList = customers.filter((c) => c.id !== id);
    setCustomers(updatedList);
    syncToLocalStorage(updatedList);

    try {
      await supabase.from('allowed_customers').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete customer warning:', e);
    }

    showToast(`Data lisensi ${email} berhasil dihapus dari whitelist.`);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = formEmail.trim().toLowerCase();
    const cleanName = formName.trim();
    if (!cleanEmail || !cleanName) return;

    setIsSubmitting(true);

    const startDate = new Date();
    const endDate = new Date(startDate);
    if (formType === 'lite') endDate.setMonth(endDate.getMonth() + 6);
    else if (formType === 'annual') endDate.setFullYear(endDate.getFullYear() + 1);
    else if (formType === 'lifetime') endDate.setFullYear(endDate.getFullYear() + 10);
    else if (formType === 'trial') endDate.setDate(endDate.getDate() + 14);

    let insertedId = `c-${Date.now()}`;

    try {
      const { data, error } = await supabase
        .from('allowed_customers')
        .insert({
          email: cleanEmail,
          full_name: cleanName,
          whatsapp: formWhatsapp.trim(),
          school_name: formSchool.trim() || 'Satuan PAUD',
          account_type: formType,
          subscription_start: startDate.toISOString(),
          subscription_end: endDate.toISOString(),
          is_active: true,
          notes: formNotes.trim(),
        })
        .select()
        .maybeSingle();

      if (!error && data) {
        insertedId = data.id;
      }
    } catch (e) {
      console.warn('Supabase insert customer warning, saving locally:', e);
    }

    const newCustomer: AllowedCustomerRow = {
      id: insertedId,
      email: cleanEmail,
      full_name: cleanName,
      whatsapp: formWhatsapp.trim(),
      school_name: formSchool.trim() || 'Satuan PAUD',
      account_type: formType,
      subscription_start: startDate.toISOString().slice(0, 10),
      subscription_end: endDate.toISOString().slice(0, 10),
      is_active: true,
      notes: formNotes.trim(),
    };

    const updated = [newCustomer, ...customers.filter((c) => c.email.toLowerCase() !== cleanEmail)];
    setCustomers(updated);
    syncToLocalStorage(updated);

    setIsSubmitting(false);
    setIsAddOpen(false);
    showToast(`Lisensi guru ${cleanName} berhasil didaftarkan ke whitelist!`);

    // Reset form
    setFormEmail('');
    setFormName('');
    setFormWhatsapp('');
    setFormSchool('');
    setFormNotes('');

    // Open WhatsApp activation modal directly for admin convenience
    handleOpenMessage(newCustomer);
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
            <UserCheck className="w-6 h-6 text-[#80426E]" /> Pelanggan & Member Whitelist
          </h1>
          <p className="text-xs text-[#74607B] mt-0.5">
            Daftarkan email guru sebelum mereka login, atur masa aktif lisensi, dan kirimkan format aktivasi WhatsApp
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
            <span>Tambah Guru / Lisensi Baru</span>
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
            placeholder="Cari berdasarkan nama guru, email, sekolah, atau WhatsApp..."
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

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-[#EFE6F2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF3FB] border-b border-[#E8D6EB] text-[11px] font-extrabold uppercase tracking-wider text-[#74607B]">
                <th className="py-3 px-4">Guru & WhatsApp</th>
                <th className="py-3 px-4">Lembaga Satuan TK</th>
                <th className="py-3 px-4">Paket Lisensi</th>
                <th className="py-3 px-4">Masa Berlaku</th>
                <th className="py-3 px-4">Status & Akun</th>
                <th className="py-3 px-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE6F2] text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#74607B]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF3FB] flex items-center justify-center text-[#80426E]">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="font-extrabold text-sm text-[#2A1532]">Belum ada guru yang didaftarkan</p>
                      <p className="text-xs text-[#74607B] max-w-sm">
                        Daftarkan email guru melalui tombol di atas agar mereka dapat mengaktifkan kata sandi pada halaman login.
                      </p>
                      <button
                        onClick={() => setIsAddOpen(true)}
                        className="mt-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] transition-all"
                      >
                        + Daftarkan Guru Pertama
                      </button>
                    </div>
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
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${badgeColor}`}>
                          {c.account_type === 'annual'
                            ? '1 Tahun'
                            : c.account_type === 'lite'
                            ? 'Semester (6 Bln)'
                            : c.account_type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#74607B]">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#80426E]" />
                          <span>Hingga {c.subscription_end || 'Selamanya'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <button
                            onClick={() => handleToggleActive(c.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                              c.is_active
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            {c.is_active ? '● Aktif' : '○ Dinonaktifkan'}
                          </button>
                          <span className={`text-[10px] font-semibold ${c.claimed_at ? 'text-emerald-700' : 'text-amber-600'}`}>
                            {c.claimed_at ? '✓ Akun Teraktivasi' : '⏳ Belum Aktivasi'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send WhatsApp Activation */}
                          <button
                            onClick={() => handleOpenMessage(c)}
                            title="Buka Pesan Aktivasi WhatsApp"
                            className="p-1.5 rounded-lg border border-[#D8C3DD] bg-white text-[#522D60] hover:bg-[#FAF3FB] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Extend 1 Year */}
                          <button
                            onClick={() => handleExtendSubscription(c.id, 12)}
                            title="Perpanjang 1 Tahun"
                            className="p-1.5 rounded-lg border border-[#D8C3DD] bg-white text-[#80426E] hover:bg-[#FAF3FB] transition-colors"
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(c.id, c.email)}
                            title="Hapus dari Whitelist"
                            className="p-1.5 rounded-lg border border-red-100 bg-white text-red-600 hover:bg-red-50 transition-colors"
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

      {/* MODAL: ADD CUSTOMER */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D8C3DD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE6F2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#522D60] text-white flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#FFD38B]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#2A1532]">Daftarkan Guru / Lisensi Baru</h3>
                  <p className="text-[11px] text-[#74607B]">Pintu masuk resmi agar guru dapat aktivasi akun</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-[#74607B] hover:bg-[#FAF3FB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Email Guru <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="guru.dewi@paudceria.sch.id"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Nama Lengkap Guru <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Dewi Rahmawati, S.Pd."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">
                    Nomor WhatsApp Guru
                  </label>
                  <input
                    type="text"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">
                    Satuan TK / PAUD
                  </label>
                  <input
                    type="text"
                    value={formSchool}
                    onChange={(e) => setFormSchool(e.target.value)}
                    placeholder="Contoh: TK Pembina / PAUD Ceria"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Jenis Paket Lisensi
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                >
                  <option value="annual">Paket 1 Tahun Ajaran Penuh (Rekomendasi)</option>
                  <option value="lite">Paket 1 Semester (6 Bulan)</option>
                  <option value="lifetime">Akses Lifetime Satuan TK</option>
                  <option value="trial">Uji Coba Gratis (14 Hari)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">
                  Catatan Lisensi / Administrasi
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Guru Kelas A, Lisensi Dinas Pendidikan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE6F2]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-[#74607B] hover:bg-[#FAF3FB]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2 px-4 rounded-xl text-xs font-extrabold text-white bg-[#522D60] hover:bg-[#693774] shadow-sm flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Daftarkan & Kirim Pesan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVATION WHATSAPP MESSAGE MODAL */}
      <ActivationMessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        customer={messageTarget}
      />
    </div>
  );
};