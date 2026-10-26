import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Users, 
  UserPlus, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  Activity, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  Award,
  Layers,
  Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export type TimeRangeFilter = '7d' | '14d' | '30d' | 'month' | 'year' | 'all';

export const AdminDashboardView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Metrics
  const [totalUsers, setTotalUsers] = useState(128);
  const [newUsers, setNewUsers] = useState(14);
  const [totalDocs, setTotalDocs] = useState(542);
  const [periodDocs, setPeriodDocs] = useState(38);
  const [activationRate, setActivationRate] = useState(86);
  const [dailyAvg, setDailyAvg] = useState(2.0);

  const fetchMetrics = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch count of profiles
      const { count: profileCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (profileCount !== null && profileCount > 0) {
        setTotalUsers(profileCount);
      }

      // 2. Fetch count of generated documents
      const { count: docsCount } = await supabase
        .from('generated_documents')
        .select('*', { count: 'exact', head: true });

      if (docsCount !== null && docsCount > 0) {
        setTotalDocs(docsCount);
      }
    } catch (e) {
      console.warn('Dashboard fetch warning:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metrik,Nilai,Keterangan\n"
      + `Total Pengguna,${totalUsers},Semua waktu\n`
      + `Pengguna Baru,${newUsers},Periode ${timeRange}\n`
      + `Aktivasi Profil,${activationRate}%,Profil lengkap\n`
      + `Total Dokumen RPM,${totalDocs},Semua modul\n`
      + `Dokumen Periode Ini,${periodDocs},Dalam filter`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kalandra_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EFE6F2]">
        <div>
          <h1 className="text-2xl font-black text-[#2A1532] tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#80426E] fill-[#80426E]/20" /> Dashboard Administrasi
          </h1>
          <p className="text-xs text-[#74607B] mt-0.5">
            Pantau pertumbuhan pengguna, statistik modul RPM TK, dan kepatuhan kurikulum 8 DPL
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetrics}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-[#D8C3DD] bg-white text-[#522D60] hover:bg-[#FAF3FB] transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="py-2 px-3 rounded-xl border border-[#D8C3DD] bg-white text-[#522D60] hover:bg-[#FAF3FB] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-[#EFE6F2] shadow-xs">
        <span className="text-[11px] font-bold text-[#74607B] px-3 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#80426E]" /> FILTER:
        </span>
        {[
          { id: '7d', label: '7 Hari' },
          { id: '14d', label: '14 Hari' },
          { id: '30d', label: '30 Hari' },
          { id: 'month', label: 'Bulan Ini' },
          { id: 'year', label: 'Tahun Ini' },
          { id: 'all', label: 'Semua' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTimeRange(item.id as TimeRangeFilter)}
            className={`py-1 px-3 rounded-xl text-xs font-bold transition-all ${
              timeRange === item.id
                ? 'bg-[#522D60] text-white shadow-xs'
                : 'text-[#74607B] hover:text-[#522D60] hover:bg-[#FAF3FB]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Stats Grid - 6 KPI Cards matching reference design */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Total Pengguna</span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF3FB] text-[#522D60] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{totalUsers}</div>
          <p className="text-[10px] text-[#74607B] mt-1">Semua waktu</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Pengguna Baru</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{newUsers}</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">↑ 12% dari periode lalu</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Rata Pendaftaran</span>
            <div className="w-7 h-7 rounded-lg bg-[#FDF1EA] text-[#C9602A] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{dailyAvg}</div>
          <p className="text-[10px] text-[#74607B] mt-1">Guru baru per hari</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Aktivasi Profil</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{activationRate}%</div>
          <p className="text-[10px] text-[#74607B] mt-1">Profil guru lengkap</p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Total RPM Dibuat</span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF3FB] text-[#80426E] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{totalDocs}</div>
          <p className="text-[10px] text-[#74607B] mt-1">Semua dokumen</p>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">RPM Periode Ini</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{periodDocs}</div>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1">↑ 24% peningkatan</p>
        </div>
      </div>

      {/* Main Analytical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Growth Trend Bar Visualization */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EFE6F2] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-[#2A1532] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#80426E]" /> Tren Pembuatan Dokumen RPM PAUD
              </h3>
              <p className="text-xs text-[#74607B] mt-0.5">Analisis lonjakan penyusunan perencanaan pembelajaran mingguan</p>
            </div>
            <span className="text-[11px] font-bold text-[#80426E] bg-[#FAF3FB] px-2.5 py-1 rounded-full border border-[#E8D6EB]">
              6 Hari Belajar • 18 Kegiatan
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
            {[
              { day: 'Sen', val: 65, count: 26 },
              { day: 'Sel', val: 80, count: 32 },
              { day: 'Rab', val: 95, count: 38 },
              { day: 'Kam', val: 75, count: 30 },
              { day: 'Jum', val: 120, count: 48 },
              { day: 'Sab', val: 160, count: 64 },
              { day: 'Min', val: 140, count: 56 },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-[#80426E] opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>
                <div 
                  style={{ height: `${(item.val / 160) * 100}%` }}
                  className="w-full max-w-[36px] bg-gradient-to-t from-[#522D60] to-[#80426E] rounded-t-xl group-hover:from-[#80426E] group-hover:to-[#F2A67B] transition-all shadow-xs"
                />
                <span className="text-[11px] font-bold text-[#74607B]">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-2">
            <div className="p-3 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB]">
              <span className="text-[10px] font-bold text-[#74607B] uppercase">Total Periode Ini</span>
              <div className="text-lg font-black text-[#522D60]">294 RPM</div>
            </div>
            <div className="p-3 bg-[#FDF1EA] rounded-2xl border border-[#F9CAA8]">
              <span className="text-[10px] font-bold text-[#9E4518] uppercase">Rata-rata Harian</span>
              <div className="text-lg font-black text-[#C9602A]">42 Dok/hari</div>
            </div>
            <div className="p-3 bg-[#FFFBF2] rounded-2xl border border-[#FFE5B3]">
              <span className="text-[10px] font-bold text-[#9A6A00] uppercase">Puncak Pembuatan</span>
              <div className="text-lg font-black text-[#7A5300]">Sabtu (Akhir Pekan)</div>
            </div>
          </div>
        </div>

        {/* Right Column: Segmentasi & Lisensi Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE6F2] shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-[#2A1532] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Segmentasi Lisensi & Onboarding
            </h3>
            <p className="text-xs text-[#74607B] mt-0.5">Komposisi paket akses guru TK terdaftar</p>
          </div>

          {/* Progress Bar 1 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#2A1532]">Tingkat Aktivasi Profil Guru</span>
              <span className="text-[#80426E]">86%</span>
            </div>
            <div className="w-full bg-[#FAF3FB] h-2.5 rounded-full overflow-hidden border border-[#E8D6EB]">
              <div className="bg-gradient-to-r from-[#522D60] to-[#80426E] h-full rounded-full" style={{ width: '86%' }} />
            </div>
            <p className="text-[10px] text-[#74607B]">110 dari 128 guru telah melengkapi data satuan & kelas</p>
          </div>

          {/* Progress Bar 2 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#2A1532]">Rasio Whitelist Terklaim</span>
              <span className="text-emerald-700">92%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }} />
            </div>
            <p className="text-[10px] text-[#74607B]">118 sudah klaim akun • 10 belum aktivasi</p>
          </div>

          {/* Distribution breakdown */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#74607B]">
              Distribusi Paket Guru (128 Akun)
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#2A1532]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#522D60]" /> Paket 1 Tahun Ajaran
                </span>
                <span className="font-extrabold text-[#2A1532]">88 (68%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#2A1532]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#80426E]" /> Paket 1 Semester (6 Bulan)
                </span>
                <span className="font-extrabold text-[#2A1532]">26 (20%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#2A1532]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2A67B]" /> Akses Lifetime
                </span>
                <span className="font-extrabold text-[#2A1532]">8 (6%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#2A1532]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD38B]" /> Trial Gratis (14 Hari)
                </span>
                <span className="font-extrabold text-[#2A1532]">6 (5%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
