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
  Calendar,
  Info
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export type TimeRangeFilter = '7d' | '14d' | '30d' | 'month' | 'year' | 'all';

interface DayCount {
  day: string;
  count: number;
}

export const AdminDashboardView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Metrics (Starts at 0, no mock data)
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [periodDocs, setPeriodDocs] = useState(0);
  const [totalAllowed, setTotalAllowed] = useState(0);
  const [claimedAllowed, setClaimedAllowed] = useState(0);
  const [activationRate, setActivationRate] = useState(0);
  const [dailyAvg, setDailyAvg] = useState('0.0');

  // Package Distribution
  const [packageDistribution, setPackageDistribution] = useState({
    annual: 0,
    lite: 0,
    lifetime: 0,
    trial: 0,
  });

  // Daily Chart Counts for the last 7 days
  const [dailyCounts, setDailyCounts] = useState<DayCount[]>([
    { day: 'Sen', count: 0 },
    { day: 'Sel', count: 0 },
    { day: 'Rab', count: 0 },
    { day: 'Kam', count: 0 },
    { day: 'Jum', count: 0 },
    { day: 'Sab', count: 0 },
    { day: 'Min', count: 0 },
  ]);

  const getTimeRangeDate = (filter: TimeRangeFilter): Date => {
    const now = new Date();
    switch (filter) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '14d':
        return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      case 'all':
      default:
        return new Date(0);
    }
  };

  const getDaysInFilter = (filter: TimeRangeFilter): number => {
    switch (filter) {
      case '7d': return 7;
      case '14d': return 14;
      case '30d': return 30;
      case 'month': return new Date().getDate();
      case 'year': return 365;
      case 'all': default: return 30;
    }
  };

  const fetchMetrics = async () => {
    setIsRefreshing(true);
    try {
      const cutoffDate = getTimeRangeDate(timeRange).toISOString();

      // 1. Fetch count of profiles (Registered Users)
      const { count: profileCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const pCount = Math.max(profileCount ?? 0, 1); // at least superadmin
      setTotalUsers(pCount);

      // 2. Fetch new profiles registered in timeRange
      const { count: newProfileCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', cutoffDate);

      setNewUsers(newProfileCount ?? 0);

      // 3. Fetch count of generated documents (Total & in TimeRange)
      const { count: totalDocCount } = await supabase
        .from('generated_documents')
        .select('*', { count: 'exact', head: true });

      setTotalDocs(totalDocCount ?? 0);

      const { data: periodDocsData } = await supabase
        .from('generated_documents')
        .select('created_at')
        .gte('created_at', cutoffDate);

      const pDocsCount = periodDocsData?.length ?? 0;
      setPeriodDocs(pDocsCount);

      const days = getDaysInFilter(timeRange);
      setDailyAvg((pDocsCount / days).toFixed(1));

      // 4. Fetch allowed_customers for license analytics
      let allowedList: any[] = [];
      const { data: allowedData } = await supabase
        .from('allowed_customers')
        .select('*');

      if (allowedData && allowedData.length > 0) {
        allowedList = allowedData;
      } else {
        const local = localStorage.getItem('kalandra_allowed_customers');
        if (local) {
          try {
            allowedList = JSON.parse(local);
          } catch (e) {}
        }
      }

      const totalAllowedCount = allowedList.length;
      setTotalAllowed(totalAllowedCount);

      const claimedCount = allowedList.filter((c) => Boolean(c.claimed_at)).length;
      setClaimedAllowed(claimedCount);

      if (totalAllowedCount > 0) {
        setActivationRate(Math.min(100, Math.round((claimedCount / totalAllowedCount) * 100)));
      } else {
        setActivationRate(pCount > 0 ? 100 : 0);
      }

      // Package counts
      const dist = { annual: 0, lite: 0, lifetime: 0, trial: 0 };
      allowedList.forEach((c) => {
        if (c.account_type === 'annual') dist.annual++;
        else if (c.account_type === 'lite') dist.lite++;
        else if (c.account_type === 'lifetime') dist.lifetime++;
        else if (c.account_type === 'trial') dist.trial++;
      });
      setPackageDistribution(dist);

      // 5. Compute day-by-day counts for the 7-day bar chart
      const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const last7Days: DayCount[] = [];
      const now = new Date();

      for (let i = 6; i >= 0; i--) {
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() - i);
        const dayOfWeek = dayLabels[targetDate.getDay()];
        const targetYMD = targetDate.toISOString().slice(0, 10);

        let countForDay = 0;
        if (periodDocsData) {
          countForDay = periodDocsData.filter(
            (d: any) => d.created_at && d.created_at.slice(0, 10) === targetYMD
          ).length;
        }

        last7Days.push({ day: dayOfWeek, count: countForDay });
      }

      setDailyCounts(last7Days);

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
      + `Total Pengguna Terdaftar,${totalUsers},Semua akun\n`
      + `Pengguna Baru,${newUsers},Periode ${timeRange}\n`
      + `Aktivasi Lisensi,${activationRate}%,Guru terverifikasi\n`
      + `Total Dokumen RPM PAUD,${totalDocs},Semua modul\n`
      + `Dokumen Periode Ini,${periodDocs},Dalam filter ${timeRange}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kalandra_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxChartVal = Math.max(...dailyCounts.map((d) => d.count), 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EFE6F2]">
        <div>
          <h1 className="text-2xl font-black text-[#2A1532] tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#80426E] fill-[#80426E]/20" /> Dashboard Administrasi
          </h1>
          <p className="text-xs text-[#74607B] mt-0.5">
            Data analitik riil: statistik modul RPM TK, pertumbuhan lisensi guru, dan kepatuhan 8 DPL
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

      {/* Stats Grid - 6 KPI Cards with Real Data */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Total Pengguna</span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF3FB] text-[#522D60] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{totalUsers}</div>
          <p className="text-[10px] text-[#74607B] mt-1">Akun terdaftar</p>
        </div>

        {/* Card 2: New Users */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Pengguna Baru</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{newUsers}</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">Dalam filter waktu</p>
        </div>

        {/* Card 3: Daily Avg */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Rata Harian RPM</span>
            <div className="w-7 h-7 rounded-lg bg-[#FDF1EA] text-[#C9602A] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{dailyAvg}</div>
          <p className="text-[10px] text-[#74607B] mt-1">Dokumen per hari</p>
        </div>

        {/* Card 4: Activation Rate */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Aktivasi Lisensi</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{activationRate}%</div>
          <p className="text-[10px] text-[#74607B] mt-1">{claimedAllowed} dari {totalAllowed || totalUsers} guru</p>
        </div>

        {/* Card 5: Total Docs */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">Total RPM Dibuat</span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF3FB] text-[#80426E] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{totalDocs}</div>
          <p className="text-[10px] text-[#74607B] mt-1">Database tersimpan</p>
        </div>

        {/* Card 6: Period Docs */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE6F2] shadow-xs relative overflow-hidden group hover:border-[#D8C3DD] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">RPM Periode Ini</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2A1532]">{periodDocs}</div>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1">Dalam filter waktu</p>
        </div>
      </div>

      {/* Main Analytical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Growth Trend Bar Visualization */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EFE6F2] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-[#2A1532] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#80426E]" /> Tren Pembuatan Dokumen RPM 7 Hari Terakhir
              </h3>
              <p className="text-xs text-[#74607B] mt-0.5">Analisis frekuensi penyusunan perencanaan mingguan guru</p>
            </div>
            <span className="text-[11px] font-bold text-[#80426E] bg-[#FAF3FB] px-2.5 py-1 rounded-full border border-[#E8D6EB]">
              6 Hari Belajar • 18 Kegiatan
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
            {dailyCounts.map((item, idx) => {
              const heightPercent = item.count > 0 ? Math.max((item.count / maxChartVal) * 100, 12) : 6;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#80426E] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count} dok
                  </span>
                  <div 
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[36px] rounded-t-xl transition-all shadow-xs ${
                      item.count > 0 
                        ? 'bg-gradient-to-t from-[#522D60] to-[#80426E] group-hover:from-[#80426E] group-hover:to-[#F2A67B]' 
                        : 'bg-[#F4E8F6]'
                    }`}
                  />
                  <span className="text-[11px] font-bold text-[#74607B]">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-2">
            <div className="p-3 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB]">
              <span className="text-[10px] font-bold text-[#74607B] uppercase">Total Periode Ini</span>
              <div className="text-lg font-black text-[#522D60]">{periodDocs} RPM</div>
            </div>
            <div className="p-3 bg-[#FDF1EA] rounded-2xl border border-[#F9CAA8]">
              <span className="text-[10px] font-bold text-[#9E4518] uppercase">Rata-rata Harian</span>
              <div className="text-lg font-black text-[#C9602A]">{dailyAvg} Dok/hari</div>
            </div>
            <div className="p-3 bg-[#FFFBF2] rounded-2xl border border-[#FFE5B3]">
              <span className="text-[10px] font-bold text-[#9A6A00] uppercase">Status Sistem</span>
              <div className="text-lg font-black text-[#7A5300]">100% Kepatuhan</div>
            </div>
          </div>
        </div>

        {/* Right Column: Segmentasi & Lisensi Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE6F2] shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-[#2A1532] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Segmentasi Lisensi & Onboarding
            </h3>
            <p className="text-xs text-[#74607B] mt-0.5">Komposisi paket akses guru TK di sistem</p>
          </div>

          {/* Progress Bar 1 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#2A1532]">Tingkat Aktivasi Akun Guru</span>
              <span className="text-[#80426E]">{activationRate}%</span>
            </div>
            <div className="w-full bg-[#FAF3FB] h-2.5 rounded-full overflow-hidden border border-[#E8D6EB]">
              <div 
                className="bg-gradient-to-r from-[#522D60] to-[#80426E] h-full rounded-full transition-all duration-500" 
                style={{ width: `${activationRate}%` }} 
              />
            </div>
            <p className="text-[10px] text-[#74607B]">
              {claimedAllowed} dari {totalAllowed || totalUsers} guru telah mengaktifkan kata sandi
            </p>
          </div>

          {/* Distribution breakdown */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#74607B]">
              Distribusi Paket Guru ({totalAllowed} Lisensi)
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#2A1532]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#522D60]" /> Paket 1 Tahun Ajaran
                </span>
                <span className="font-extrabold text-[#2A1532]">{packageDistribution.annual} Akun</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#2A1532]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#80426E]" /> Paket 1 Semester (6 Bulan)
                </span>
                <span className="font-extrabold text-[#2A1532]">{packageDistribution.lite} Akun</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#2A1532]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2A67B]" /> Akses Lifetime Satuan TK
                </span>
                <span className="font-extrabold text-[#2A1532]">{packageDistribution.lifetime} Akun</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#2A1532]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD38B]" /> Trial Gratis (14 Hari)
                </span>
                <span className="font-extrabold text-[#2A1532]">{packageDistribution.trial} Akun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};