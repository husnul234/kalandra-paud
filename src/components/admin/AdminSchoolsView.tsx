import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  Users, 
  CheckCircle2, 
  X,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export interface SchoolRecord {
  id: string;
  name: string;
  npsn: string;
  address: string;
  subdistrict: string;
  city_regency: string;
  province: string;
  principal_name: string;
  principal_nip: string;
  teachers_count: number;
}

const DEFAULT_SCHOOLS: SchoolRecord[] = [
  {
    id: 's-1',
    name: 'TK NEGERI PEMBINA 01',
    npsn: '20108921',
    address: 'Jl. Merdeka No. 45',
    subdistrict: 'Kecamatan Ceria',
    city_regency: 'Kota Jakarta Selatan',
    province: 'DKI Jakarta',
    principal_name: 'Hj. Siti Rahayu, M.Pd.',
    principal_nip: '197508122002122001',
    teachers_count: 8,
  },
  {
    id: 's-2',
    name: 'TK KARTIKA CENDEKIA',
    npsn: '20109844',
    address: 'Jl. Pendidikan No. 12',
    subdistrict: 'Kecamatan Melati',
    city_regency: 'Kota Bandung',
    province: 'Jawa Barat',
    principal_name: 'Dra. Endang Lestari',
    principal_nip: '198103152006042003',
    teachers_count: 5,
  },
  {
    id: 's-3',
    name: 'KB AISYIYAH BUSTANUL ATHFAL 03',
    npsn: '69871234',
    address: 'Jl. Flamboyan No. 8',
    subdistrict: 'Kecamatan Sukamaju',
    city_regency: 'Kota Surabaya',
    province: 'Jawa Timur',
    principal_name: 'Nurul Hidayati, S.Pd.',
    principal_nip: '-',
    teachers_count: 4,
  },
];

export const AdminSchoolsView: React.FC = () => {
  const [schools, setSchools] = useState<SchoolRecord[]>(DEFAULT_SCHOOLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolRecord | null>(null);
  const [formName, setFormName] = useState('');
  const [formNpsn, setFormNpsn] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formSubdistrict, setFormSubdistrict] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formProvince, setFormProvince] = useState('');
  const [formPrincipal, setFormPrincipal] = useState('');
  const [formNip, setFormNip] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        setSchools(
          data.map((s) => ({
            id: s.id,
            name: s.name,
            npsn: s.npsn || '-',
            address: s.address || '',
            subdistrict: s.subdistrict || '',
            city_regency: s.city_regency || '',
            province: s.province || '',
            principal_name: s.principal_name || 'Kepala Satuan PAUD',
            principal_nip: s.principal_nip || '-',
            teachers_count: 6,
          }))
        );
      }
    } catch (e) {
      console.warn('Schools fetch warning:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleOpenAdd = () => {
    setEditingSchool(null);
    setFormName('');
    setFormNpsn('');
    setFormAddress('');
    setFormSubdistrict('');
    setFormCity('');
    setFormProvince('Jawa Barat');
    setFormPrincipal('');
    setFormNip('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (school: SchoolRecord) => {
    setEditingSchool(school);
    setFormName(school.name);
    setFormNpsn(school.npsn);
    setFormAddress(school.address);
    setFormSubdistrict(school.subdistrict);
    setFormCity(school.city_regency);
    setFormProvince(school.province);
    setFormPrincipal(school.principal_name);
    setFormNip(school.principal_nip);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingSchool) {
      setSchools((prev) =>
        prev.map((s) =>
          s.id === editingSchool.id
            ? {
                ...s,
                name: formName.trim(),
                npsn: formNpsn.trim(),
                address: formAddress.trim(),
                subdistrict: formSubdistrict.trim(),
                city_regency: formCity.trim(),
                province: formProvince.trim(),
                principal_name: formPrincipal.trim(),
                principal_nip: formNip.trim(),
              }
            : s
        )
      );
      showToast('Data satuan PAUD berhasil diperbarui!');
    } else {
      const newRecord: SchoolRecord = {
        id: `s-${Date.now()}`,
        name: formName.trim(),
        npsn: formNpsn.trim(),
        address: formAddress.trim(),
        subdistrict: formSubdistrict.trim(),
        city_regency: formCity.trim(),
        province: formProvince.trim(),
        principal_name: formPrincipal.trim(),
        principal_nip: formNip.trim(),
        teachers_count: 1,
      };
      setSchools([newRecord, ...schools]);
      showToast('Lembaga satuan PAUD baru berhasil didaftarkan!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus ${name}?`)) {
      setSchools((prev) => prev.filter((s) => s.id !== id));
      showToast('Satuan PAUD berhasil dihapus.');
    }
  };

  const filteredSchools = schools.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.npsn.includes(q) ||
      s.city_regency.toLowerCase().includes(q) ||
      s.principal_name.toLowerCase().includes(q)
    );
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
            <Building2 className="w-6 h-6 text-[#80426E]" /> Data Satuan PAUD / TK
          </h1>
          <p className="text-xs text-[#74607B] mt-0.5">
            Kelola master lembaga TK/KB untuk otomatisasi kop dokumen dan pengesahan kepala satuan
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={fetchSchools}
            disabled={isLoading}
            className="p-2 rounded-xl border border-[#D8C3DD] bg-white text-[#522D60] hover:bg-[#FAF3FB] transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Segarkan data satuan TK"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="py-2 px-3 sm:px-3.5 rounded-xl text-white bg-[#522D60] hover:bg-[#693774] shadow-sm flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Tambah Satuan TK</span>
            <span className="xs:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#EFE6F2] shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#74607B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama TK, NPSN, kota, atau nama kepala sekolah..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D8C3DD] focus:outline-none focus:ring-2 focus:ring-[#80426E] text-[#2A1532]"
          />
        </div>
      </div>

      {/* Schools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl p-5 border border-[#EFE6F2] shadow-xs hover:border-[#D8C3DD] transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF3FB] text-[#522D60] flex items-center justify-center shrink-0 border border-[#E8D6EB]">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#80426E] bg-[#FAF3FB] px-2 py-0.5 rounded-full border border-[#D8C3DD]">
                  NPSN: {s.npsn}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-[#2A1532] mt-3 leading-snug">
                {s.name}
              </h3>

              <div className="text-xs text-[#74607B] mt-2 space-y-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#80426E]" />
                  <span className="truncate">{s.address || s.city_regency || 'Alamat belum disetel'}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-[#80426E]" />
                  <span>Kepsek: <strong className="text-[#2A1532]">{s.principal_name}</strong></span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[#74607B] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#522D60]" /> {s.teachers_count} Pendidik
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 rounded-lg border border-[#D8C3DD] text-[#522D60] hover:bg-[#FAF3FB]"
                  title="Edit Satuan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.name)}
                  className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  title="Hapus Satuan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit School */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EFE6F2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#2A1532] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#522D60]" />
                <span>{editingSchool ? 'Edit Satuan PAUD' : 'Tambah Satuan TK Baru'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#74607B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Nama Lembaga TK / KB *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: TK KARTIKA CENDEKIA"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">NPSN</label>
                  <input
                    type="text"
                    value={formNpsn}
                    onChange={(e) => setFormNpsn(e.target.value)}
                    placeholder="Contoh: 20108921"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Contoh: Kota Bandung"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1532] mb-1">Alamat Jalan</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Contoh: Jl. Merdeka No. 45"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={formSubdistrict}
                    onChange={(e) => setFormSubdistrict(e.target.value)}
                    placeholder="Contoh: Ceria"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={formProvince}
                    onChange={(e) => setFormProvince(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">Nama Kepala Satuan PAUD</label>
                  <input
                    type="text"
                    value={formPrincipal}
                    onChange={(e) => setFormPrincipal(e.target.value)}
                    placeholder="Contoh: Hj. Siti Rahayu, M.Pd."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2A1532] mb-1">NIP Kepala Satuan</label>
                  <input
                    type="text"
                    value={formNip}
                    onChange={(e) => setFormNip(e.target.value)}
                    placeholder="Contoh: 197508122002122001"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] text-[#2A1532]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-3 text-xs font-semibold text-[#74607B]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774]"
                >
                  Simpan Satuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
