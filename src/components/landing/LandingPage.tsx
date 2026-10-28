import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Award, 
  Clock, 
  Download, 
  Layers, 
  BookOpen, 
  LogIn, 
  HelpCircle,
  Building2,
  Users,
  ChevronRight,
  Printer,
  Crown,
  ClipboardList,
  Edit3,
  Bot,
  MessageSquare,
  Shield,
  Check,
  Smartphone,
  ExternalLink,
  X,
  Menu,
  Laptop,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PwaInstallModal } from '../pwa/PwaInstallModal';

interface LandingPageProps {
  onGoToApp: () => void;
  onGoToAuth: () => void;
  onGoToAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToApp,
  onGoToAuth,
  onGoToAdmin,
}) => {
  const { user, profile, isAdmin } = useAuth();
  const [pricingCycle, setPricingCycle] = useState<'1_bulan' | '6_bulan' | '1_tahun'>('1_tahun');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // WhatsApp order link generator
  const getWhatsAppOrderUrl = (tier: 'Standar' | 'PRO', periodLabel: string, price: string) => {
    const text = `Halo Admin Kalandra, saya ingin mengaktifkan *Paket ${tier} (${periodLabel} - ${price})* untuk perencanaan pembelajaran TK saya. Mohon informasi rekening dan aktivasinya.`;
    return `https://wa.me/6288228511309?text=${encodeURIComponent(text)}`;
  };

  // Helper action: Redirects to /app if logged in, otherwise redirects to /login (Wajib Login)
  const handlePrimaryAction = () => {
    if (user || profile) {
      onGoToApp();
    } else {
      onGoToAuth();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7FB] text-[#2A1532] flex flex-col selection:bg-[#522D60] selection:text-white">
      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 select-none cursor-pointer" onClick={onGoToApp}>
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-[#522D60]/20 shrink-0 border border-[#E8D6EB] hover:scale-105 transition-all bg-[#2A1532]">
              <img src="/kalandra_logo.png" alt="Kalandra" className="w-full h-full object-cover scale-[1.05]" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight text-[#2A1532] flex items-center gap-1.5">
                KALANDRA
              </span>
              <span className="hidden sm:block text-[11px] font-semibold text-[#80426E] -mt-1">
                RPM TK Fase Fondasi 2025/2026
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-bold text-[#74607B]">
            <a href="#fitur" className="hover:text-[#522D60] transition-colors">Fitur Unggulan</a>
            <a href="#lampiran" className="hover:text-[#522D60] transition-colors">4 Lampiran Observasi</a>
            <a href="#asisten" className="hover:text-[#522D60] transition-colors">Revisi AI Chat</a>
            <a href="#aplikasi-pwa" className="hover:text-[#522D60] transition-colors flex items-center gap-1 font-extrabold text-[#522D60]">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aplikasi HP</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-black">PWA</span>
            </a>
            <a href="#perbandingan" className="hover:text-[#522D60] transition-colors">Perbandingan</a>
            <a href="#harga" className="hover:text-[#522D60] transition-colors">Daftar Harga</a>
            <a href="#faq" className="hover:text-[#522D60] transition-colors">Tanya Jawab</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                onClick={onGoToAdmin}
                className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-[#522D60] bg-[#FAF3FB] hover:bg-[#F4E8F6] border border-[#E8D6EB] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#80426E]" />
                <span>Panel Admin</span>
              </button>
            )}

            {user || profile ? (
              <button
                onClick={onGoToApp}
                className="py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="hidden xs:inline">Buka Generator RPM</span>
                <span className="xs:hidden">Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onGoToAuth}
                className="py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#2A1532] hover:bg-[#FAF3FB] transition-colors"
              aria-label="Menu navigasi landing page"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#522D60]" /> : <Menu className="w-5 h-5 text-[#522D60]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EFE6F2] bg-white px-4 pt-3 pb-5 space-y-1 shadow-xl animate-fade-in">
            <div className="text-[10px] font-black tracking-widest uppercase text-[#80426E] px-3 py-1">
              Navigasi Halaman
            </div>
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#2A1532] hover:bg-[#FAF3FB] hover:text-[#522D60] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#80426E]" />
              <span>Fitur Unggulan</span>
            </a>
            <a
              href="#lampiran"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#2A1532] hover:bg-[#FAF3FB] hover:text-[#522D60] transition-colors"
            >
              <ClipboardList className="w-4 h-4 text-[#80426E]" />
              <span>4 Lampiran Observasi Siap Cetak</span>
            </a>
            <a
              href="#asisten"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#2A1532] hover:bg-[#FAF3FB] hover:text-[#522D60] transition-colors"
            >
              <Bot className="w-4 h-4 text-[#80426E]" />
              <span>Revisi AI Chat Eksklusif</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPwaModalOpen(true);
              }}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Pasang Kalandra di HP</span>
              </div>
              <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Install
              </span>
            </button>
            <a
              href="#perbandingan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#2A1532] hover:bg-[#FAF3FB] hover:text-[#522D60] transition-colors"
            >
              <Layers className="w-4 h-4 text-[#80426E]" />
              <span>Perbandingan Standar</span>
            </a>
            <a
              href="#harga"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#2A1532] hover:bg-[#FAF3FB] hover:text-[#522D60] transition-colors"
            >
              <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Daftar Harga & Paket</span>
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#2A1532] hover:bg-[#FAF3FB] hover:text-[#522D60] transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#74607B]" />
              <span>Tanya Jawab (FAQ)</span>
            </a>

            {isAdmin && (
              <button
                onClick={() => { setMobileMenuOpen(false); onGoToAdmin(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#522D60] bg-[#FAF3FB] hover:bg-[#F3E8F5] transition-colors mt-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#522D60]" />
                <span>Buka Panel Admin</span>
              </button>
            )}

            <div className="pt-2 border-t border-[#EFE6F2] mt-2">
              <button
                onClick={() => { setMobileMenuOpen(false); handlePrimaryAction(); }}
                className="w-full py-2.5 px-4 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD38B]" />
                <span>{user || profile ? 'Buka Generator RPM' : 'Masuk ke Platform'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#FAF3FB] via-[#FDF1EA]/30 to-transparent blur-3xl -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#FFD38B]/20 blur-3xl -z-10" />
        <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-[#80426E]/10 blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8D6EB] shadow-xs text-xs font-bold text-[#80426E] animate-fade-in flex-wrap justify-center">
            <span className="w-2 h-2 rounded-full bg-[#522D60] animate-pulse" />
            <span>Terstandar Pengawas PAUD 2025/2026</span>
            <span className="text-[#D8C3DD]">•</span>
            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              100% Responsif & Siap Pasang di Layar HP (Android & iOS)
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2A1532] tracking-tight leading-[1.15]">
            Susun RPM TK & 4 Lampiran Observasi Siap Cetak{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#522D60] via-[#80426E] to-[#F2A67B]">
              dalam 2 Menit
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-[#74607B] leading-relaxed">
            Platform otomatisasi kurikulum PAUD Fase Fondasi terlengkap. Merumuskan <strong>18 kegiatan main loose parts</strong>, kepatuhan mutlak <strong>8 Dimensi Profil Lulusan (8 DPL)</strong> tanpa P5, Taksonomi SOLO, Rubrik 4 Skala, dan <strong>4 Dokumen Lampiran Observasi</strong> terpisah siap cetak A4/F4 Folio.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handlePrimaryAction}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#522D60] hover:bg-[#693774] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#522D60]/25 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFD38B]" />
              <span>Mulai Susun RPM Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPwaModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>Pasang di HP (Android & iOS)</span>
            </button>
            <a
              href="#harga"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FAF3FB] text-[#522D60] border border-[#D8C3DD] rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Lihat Paket (Rp 9rb-an)</span>
            </a>
          </div>

          {/* Regulatory Badges Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3 bg-white rounded-2xl border border-[#EFE6F2] shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-[#2A1532]">Permendikdasmen 10/2025</div>
                <div className="text-[10px] text-[#74607B]">8 DPL Resmi (Bebas P5)</div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#EFE6F2] shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-[#2A1532]">Permendikdasmen 1/2026</div>
                <div className="text-[10px] text-[#74607B]">Siklus Deep Learning 3 Tahap</div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#EFE6F2] shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-[#2A1532]">BSKAP No. 046/2025</div>
                <div className="text-[10px] text-[#74607B]">Verbatim CP Fase Fondasi</div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#EFE6F2] shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-[#2A1532]">Standar Pengawas</div>
                <div className="text-[10px] text-[#74607B]">4 Lampiran Observasi Siap Cetak</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE SHOWCASE WITH VISUAL MOCKUPS */}
      <section id="fitur" className="py-16 bg-white border-y border-[#EFE6F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#80426E] uppercase tracking-wider">
              Pembaruan Terkini Standar Verifikasi 2025/2026
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2A1532]">
              Fitur Lengkap Sesuai Hasil Telaah Pengawas
            </h2>
            <p className="text-xs sm:text-sm text-[#74607B]">
              Semua yang Anda butuhkan untuk perencanaan dan asesmen observasi harian tanpa perlu mengetik manual.
            </p>
          </div>

          {/* MOCKUP 1: AI Rekomendasi Topik & Pemetaan Otomatis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3FB] text-[#522D60] text-xs font-bold border border-[#E8D6EB]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Rekomendasi AI Otomatis (Eksklusif PRO)</span>
              </div>
              <h3 className="text-2xl font-black text-[#2A1532]">
                Ketik Topik, AI Petakan DPL, CP & Loose Parts Seketika
              </h3>
              <p className="text-xs sm:text-sm text-[#74607B] leading-relaxed">
                Cukup ketik topik pembelajaran (misal: <em>"Tanaman Apotek Hidup di Sekolah"</em>), sistem AI kami langsung memilihkan kombinasi Dimensi Profil Lulusan yang paling esensial, subelemen CP verbatim BSKAP 046/2025, dan bahan loose parts konkret yang aman untuk anak usia dini.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-[#2A1532]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pemetaan 8 DPL akurat tanpa risiko salah pilih</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kutipan Capaian Pembelajaran kata-per-kata persis regulasi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bahan loose parts murah dan mudah didapat di lingkungan sekitar</span>
                </li>
              </ul>
            </div>

            {/* Simulated UI Mockup Card */}
            <div className="bg-[#FAF7FB] p-5 sm:p-6 rounded-3xl border border-[#D8C3DD] shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE6F2]">
                <span className="text-xs font-bold text-[#522D60] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Rekomendasi Kurikulum AI
                </span>
                <span className="text-[10px] bg-amber-400 text-[#2A1532] px-2 py-0.5 rounded-full font-black">
                  PRO
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#74607B]">Topik / Subtopik:</label>
                <div className="p-2.5 bg-white rounded-xl border border-[#CBB4D1] text-xs font-semibold text-[#2A1532]">
                  Tanaman Apotek Hidup di Lingkungan Sekolah (Kunyit, Jahe, Serai)
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#74607B]">DPL Terpetakan:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded-lg bg-[#522D60] text-white text-[10px] font-bold">
                    DPL1 (Keimanan)
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#522D60] text-white text-[10px] font-bold">
                    DPL3 (Penalaran Kritis)
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#522D60] text-white text-[10px] font-bold">
                    DPL4 (Kreativitas)
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#522D60] text-white text-[10px] font-bold">
                    DPL7 (Kesehatan)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#74607B]">Rekomendasi Loose Parts:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#D8C3DD] text-[10px] font-semibold text-[#522D60]">
                    Piring kertas
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#D8C3DD] text-[10px] font-semibold text-[#522D60]">
                    Parutan kayu tumpul
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#D8C3DD] text-[10px] font-semibold text-[#522D60]">
                    Cobek batu kecil
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#D8C3DD] text-[10px] font-semibold text-[#522D60]">
                    Air hangat & mangkuk bening
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                ✅ Berhasil diterapkan ke Langkah 2 & 3 dalam 1 klik!
              </div>
            </div>
          </div>

          {/* MOCKUP 2: 4 Lampiran Observasi Siap Cetak */}
          <div id="lampiran" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8 border-t border-[#EFE6F2]">
            {/* Simulated UI Mockup Grid */}
            <div className="grid grid-cols-2 gap-3 bg-[#FAF7FB] p-5 sm:p-6 rounded-3xl border border-[#D8C3DD] shadow-lg order-2 lg:order-1">
              {/* Lampiran 1 */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8D6EB] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#522D60] text-white flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="font-extrabold text-xs text-[#2A1532]">Catatan Anekdot</h4>
                <p className="text-[10px] text-[#74607B]">
                  Format kolom: Tanggal, Nama Anak, Peristiwa Bermakna, Analisis Capaian & Tindak Lanjut.
                </p>
              </div>

              {/* Lampiran 2 */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8D6EB] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#80426E] text-white flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="font-extrabold text-xs text-[#2A1532]">Ceklis IKTP SOLO</h4>
                <p className="text-[10px] text-[#74607B]">
                  Matriks nama peserta didik x indikator gradasi ketercapaian tujuan pembelajaran.
                </p>
              </div>

              {/* Lampiran 3 */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8D6EB] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#522D60] text-white flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="font-extrabold text-xs text-[#2A1532]">Hasil Karya Anak</h4>
                <p className="text-[10px] text-[#74607B]">
                  Kolom foto hasil karya, deskripsi proses kreasi loose parts, celoteh anak & refleksi.
                </p>
              </div>

              {/* Lampiran 4 */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8D6EB] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#80426E] text-white flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h4 className="font-extrabold text-xs text-[#2A1532]">Foto Berseri</h4>
                <p className="text-[10px] text-[#74607B]">
                  Dokumentasi tahapan bermain (Awal, Proses, Akhir) lengkap dengan lembar tanda tangan.
                </p>
              </div>
            </div>

            <div className="space-y-4 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3FB] text-[#522D60] text-xs font-bold border border-[#E8D6EB]">
                <ClipboardList className="w-3.5 h-3.5 text-[#80426E]" />
                <span>Instrumen Asesmen Lengkap Pengawas</span>
              </div>
              <h3 className="text-2xl font-black text-[#2A1532]">
                4 Dokumen Lampiran Observasi Siap Cetak Terpisah
              </h3>
              <p className="text-xs sm:text-sm text-[#74607B] leading-relaxed">
                Pengawas sekolah selalu memeriksa kelengkapan lampiran evaluasi. Kalandra menyediakan tombol unduh <strong>Lampiran (.docx)</strong> terpisah yang langsung menghasilkan 4 instrumen observasi otentik dengan format tabel rapi dan lembar tanda tangan kepala sekolah.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-[#2A1532]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tersedia pilihan ukuran kertas F4 Folio resmi maupun A4</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Diunduh terpisah agar tidak membengkakkan ketebalan file RPM utama</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dilengkapi panduan rubrik asesmen 4 skala: BB, MB, BSH, dan BSB</span>
                </li>
              </ul>
            </div>
          </div>

          {/* MOCKUP 3: Asisten Revisi AI via Chat (Mode Plan & Action) */}
          <div id="asisten" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8 border-t border-[#EFE6F2]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3FB] text-[#522D60] text-xs font-bold border border-[#E8D6EB]">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>Revisi Seperti di VS Code (Eksklusif PRO)</span>
              </div>
              <h3 className="text-2xl font-black text-[#2A1532]">
                Revisi Dokumen Cukup Chatting dengan AI
              </h3>
              <p className="text-xs sm:text-sm text-[#74607B] leading-relaxed">
                Ingin mengubah kegiatan hari Kamis atau menyesuaikan rubrik asesmen? Anda tidak perlu mengulang proses dari awal. Cukup ketik instruksi di sidebar Chat, pilih <strong>Mode Plan</strong> untuk melihat preview perubahan, atau <strong>Mode Action</strong> untuk langsung diterapkan ke dokumen!
              </p>
              <ul className="space-y-2 text-xs font-semibold text-[#2A1532]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Mode Plan:</strong> Tampilkan usulan perbedaan (diff) sebelum Anda setujui</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Mode Action:</strong> Terapkan perubahan instan ke lembar kerja tanpa jeda</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Mode Edit Cepat:</strong> Klik langsung sel tabel di lembar pratinjau untuk ketik manual</span>
                </li>
              </ul>
            </div>

            {/* Simulated Chat Drawer Mockup */}
            <div className="bg-white p-5 rounded-3xl border border-[#D8C3DD] shadow-xl space-y-3 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFE6F2]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#522D60] text-amber-300 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#2A1532]">Asisten Revisi Kalandra</span>
                </div>
                <div className="flex items-center gap-1 bg-[#FAF3FB] px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#522D60]">
                  <span>Mode Plan</span>
                </div>
              </div>

              {/* Chat Bubble User */}
              <div className="bg-[#522D60] text-white p-2.5 rounded-2xl rounded-br-xs text-xs ml-8">
                Ganti kegiatan main hari Rabu dengan eksplorasi daun kering dan cat air alami dari kunyit.
              </div>

              {/* Chat Bubble AI with Diff Proposal */}
              <div className="bg-[#FAF7FB] border border-[#D8C3DD] p-3 rounded-2xl text-xs space-y-2 mr-4">
                <p className="font-semibold text-[#2A1532]">
                  📋 <strong>Rencana Perubahan Hari ke-3:</strong>
                </p>
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-[11px] text-slate-800">
                  <span className="text-emerald-700 font-bold">+ Kegiatan 1:</span> Membuat lukisan cap daun kering menggunakan pasta perasan kunyit (bermakna, DPL4 Kreativitas).
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                    <Check className="w-3 h-3" /> Terapkan ke Dokumen
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3.4. PWA MOBILE APP SECTION (100% RESPONSIF DI HP & SIAP PASANG) */}
      <section id="aplikasi-pwa" className="py-20 bg-gradient-to-b from-[#FAF7FB] via-white to-[#FAF7FB] border-b border-[#EFE6F2] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#522D60]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Progressive Web App (PWA) 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2A1532] tracking-tight">
              100% Responsif di Layar HP &amp; Pasang Layaknya{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#522D60] to-emerald-700">
                Aplikasi Native Android / iOS
              </span>
            </h2>
            <p className="text-xs sm:text-base text-[#74607B] leading-relaxed">
              Tak perlu lagi membuka laptop hanya untuk menyusun perencanaan kelas atau mengecek rubrik asesmen. Pasang Kalandra langsung ke layar utama ponsel Bunda &amp; Bapak Guru tanpa repot unduh file puluhan megabyte dari toko aplikasi.
            </p>
          </div>

          {/* 4 Feature Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8D6EB] shadow-xs hover:border-[#522D60]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
                  <Smartphone className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-base font-extrabold text-[#2A1532]">
                  Layar Penuh (Standalone)
                </h3>
                <p className="text-xs text-[#74607B] leading-relaxed">
                  Bebas dari bilah navigasi dan URL browser yang mengganggu. Tampilan bersih dan lega serasa membuka aplikasi native Android atau iOS sesungguhnya.
                </p>
              </div>
              <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-[#EFE6F2]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Browser Clutter</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8D6EB] shadow-xs hover:border-[#522D60]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF3FB] text-[#522D60] flex items-center justify-center border border-[#E8D6EB] shadow-2xs">
                  <Zap className="w-6 h-6 text-[#80426E]" />
                </div>
                <h3 className="text-base font-extrabold text-[#2A1532]">
                  Ramah Sentuhan Jari
                </h3>
                <p className="text-xs text-[#74607B] leading-relaxed">
                  Navigasi geser (drawer) halus, tombol besar nyaman dipencet, serta tabel observasi yang responsif dan mudah digeser horizontal di layar 320px–480px.
                </p>
              </div>
              <div className="text-[11px] font-bold text-[#522D60] flex items-center gap-1.5 pt-2 border-t border-[#EFE6F2]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mobile Ergonomics</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8D6EB] shadow-xs hover:border-[#522D60]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-2xs">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-base font-extrabold text-[#2A1532]">
                  Super Ringan (~2 MB)
                </h3>
                <p className="text-xs text-[#74607B] leading-relaxed">
                  Tidak memakan memori HP Anda hingga ratusan MB seperti aplikasi Play Store. Cepat dimuat, hemat kuota internet, dan bekerja cepat di segala tipe gadget.
                </p>
              </div>
              <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5 pt-2 border-t border-[#EFE6F2]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Hemat Memori &amp; Kuota</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8D6EB] shadow-xs hover:border-[#522D60]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200 shadow-2xs">
                  <Laptop className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-base font-extrabold text-[#2A1532]">
                  1 Ketukan di Home Screen
                </h3>
                <p className="text-xs text-[#74607B] leading-relaxed">
                  Ikon resmi Kalandra akan muncul berdampingan dengan aplikasi favorit Anda. Buka kapan saja dalam 1 detik untuk menyusun kurikulum atau mengecek asesmen.
                </p>
              </div>
              <div className="text-[11px] font-bold text-sky-800 flex items-center gap-1.5 pt-2 border-t border-[#EFE6F2]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Android, iOS &amp; Laptop</span>
              </div>
            </div>

          </div>

          {/* Interactive Install Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2A1532] via-[#522D60] to-[#80426E] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-amber-300 text-xs font-bold border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instalasi 1 Langkah Mudah</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Pasang Kalandra ke Layar HP Anda Sekarang
              </h3>
              <p className="text-xs sm:text-sm text-pink-100 max-w-xl">
                Buka Kalandra layaknya aplikasi native tanpa login berulang. Mendukung Android (Chrome/Edge), iPhone (Safari Add to Home Screen), dan Windows/Mac.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsPwaModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pasang Aplikasi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3.5. COMPARISON SECTION (KENAPA KALANDRA BERBEDA? - ADAPTASI SIAP GURU) */}
      <section id="perbandingan" className="py-20 bg-white border-b border-[#EFE6F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3FB] border border-[#E8D6EB] text-[#522D60] text-xs font-black uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-[#80426E]" />
              <span>Perbandingan Layanan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2A1532] tracking-tight">
              Kenapa <span className="text-[#522D60]">KALANDRA</span> Berbeda?
            </h2>
            <p className="text-xs sm:text-sm text-[#74607B] leading-relaxed">
              Bandingkan cara konvensional/manual dengan Kalandra — selisih waktunya bisa Bunda/Bapak Guru gunakan untuk mendampingi tumbuh kembang anak secara lebih bermakna.
            </p>
          </div>

          {/* Table Container */}
          <div className="bg-[#FAF7FB] rounded-3xl border border-[#E8D6EB] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8D6EB] bg-white">
                    <th className="py-4.5 px-6 text-xs font-black uppercase tracking-wider text-[#74607B] w-1/3">
                      Aspek Perencanaan
                    </th>
                    <th className="py-4.5 px-6 text-xs font-black uppercase tracking-wider text-[#8A7991] w-1/3">
                      Cara Konvensional / Manual
                    </th>
                    <th className="py-4.5 px-6 text-xs font-black uppercase tracking-wider text-[#522D60] bg-[#FAF3FB] w-1/3">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>Kalandra RPM TK</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE6F2] text-xs font-medium">
                  {/* Row 1 */}
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#2A1532]">
                      Waktu Pembuatan 1 Dokumen RPM
                    </td>
                    <td className="py-4 px-6 text-[#74607B]">
                      <div className="flex items-center gap-2 text-rose-600 font-semibold">
                        <X className="w-4 h-4 shrink-0" />
                        <span>3 – 6 Jam (Lelah & Menumpuk)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-[#FAF3FB]/60 font-bold text-[#522D60]">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                        <span>&lt; 2 Menit (Otomatis & Lengkap)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#2A1532]">
                      Kepatuhan Kurikulum 2025/2026
                    </td>
                    <td className="py-4 px-6 text-[#74607B]">
                      <div className="flex items-center gap-2 text-[#74607B]">
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Perlu riset manual regulasi baru</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-[#FAF3FB]/60 font-bold text-[#522D60]">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                        <span>Otomatis & Terverifikasi (Permendikdasmen No. 10/2025 & 8 DPL)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#2A1532]">
                      Format & Lembar Pengesahan
                    </td>
                    <td className="py-4 px-6 text-[#74607B]">
                      <div className="flex items-center gap-2 text-[#74607B]">
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Susun sendiri tabel & format dari nol</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-[#FAF3FB]/60 font-bold text-[#522D60]">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                        <span>Siap Pakai & Profesional (Lengkap TTD KS & Guru)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#2A1532]">
                      4 Dokumen Lampiran Observasi Siap Cetak
                    </td>
                    <td className="py-4 px-6 text-[#74607B]">
                      <div className="flex items-center gap-2 text-[#74607B]">
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Dibuat manual terpisah berhari-hari</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-[#FAF3FB]/60 font-bold text-[#522D60]">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                        <span>Tersinkronisasi 100% (Anekdot, Ceklis, Karya, Foto)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#2A1532]">
                      Ekspor Dokumen Word (.docx) & PDF
                    </td>
                    <td className="py-4 px-6 text-[#74607B]">
                      <div className="flex items-center gap-2 text-[#74607B]">
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Atur layout & margin manual berantakan</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-[#FAF3FB]/60 font-bold text-[#522D60]">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                        <span>1 Klik Download (Format Standar F4 & A4 Siap Print)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#2A1532]">
                      Konsistensi & Asisten Revisi
                    </td>
                    <td className="py-4 px-6 text-[#74607B]">
                      <div className="flex items-center gap-2 text-[#74607B]">
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Sulit konsisten, bongkar ulang dokumen</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-[#FAF3FB]/60 font-bold text-[#522D60]">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                        <span>AI Assistant via Chat (Plan & Action Otomatis)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 7 */}
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#2A1532]">
                      Biaya & Efisiensi Energi
                    </td>
                    <td className="py-4 px-6 text-[#74607B]">
                      <div className="flex items-center gap-2 text-[#74607B]">
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Waktu & stres administrasi sangat tinggi</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-[#FAF3FB]/60 font-bold text-[#522D60]">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                        <span>Sangat Terjangkau (Mulai Rp 8.250-an / bulan)</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PRICELIST SECTION (TRANSPARAN & TERJANGKAU) */}
      <section id="harga" className="py-20 bg-gradient-to-b from-[#FAF7FB] to-white border-b border-[#EFE6F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#80426E] uppercase tracking-wider">
              Harga Sangat Terjangkau untuk Seluruh Pendidik PAUD
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2A1532]">
              Pilih Paket Sesuai Kebutuhan Anda
            </h2>
            <p className="text-xs sm:text-sm text-[#74607B]">
              Investasi cerdas untuk menghemat waktu berharga Anda setiap akhir pekan. Bebas instalasi, aktif langsung.
            </p>

            {/* Cycle Selector Pills */}
            <div className="inline-flex items-center bg-white p-1 rounded-2xl border border-[#D8C3DD] shadow-xs mt-4">
              <button
                type="button"
                onClick={() => setPricingCycle('1_bulan')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pricingCycle === '1_bulan'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'text-[#74607B] hover:text-[#2A1532]'
                }`}
              >
                1 Bulan
              </button>
              <button
                type="button"
                onClick={() => setPricingCycle('6_bulan')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pricingCycle === '6_bulan'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'text-[#74607B] hover:text-[#2A1532]'
                }`}
              >
                6 Bulan <span className="text-[10px] bg-amber-400 text-[#2A1532] px-1.5 py-0.2 rounded-full font-extrabold ml-1">Hemat s.d Rp 85rb</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingCycle('1_tahun')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pricingCycle === '1_tahun'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'text-[#74607B] hover:text-[#2A1532]'
                }`}
              >
                1 Tahun (365 Hari) <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-extrabold ml-1">Paling Hemat 57%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* CARD 1: STANDAR */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8D6EB] shadow-xs hover:border-[#522D60]/30 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#74607B]">
                    Paket Standar
                  </span>
                  <span className="text-xs font-bold text-[#522D60] bg-[#FAF3FB] px-2.5 py-1 rounded-full border border-[#E8D6EB]">
                    Untuk Guru Pemula
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#2A1532]">
                      {pricingCycle === '1_bulan' && 'Rp 19.000'}
                      {pricingCycle === '6_bulan' && 'Rp 59.000'}
                      {pricingCycle === '1_tahun' && 'Rp 99.000'}
                    </span>
                    <span className="text-xs text-[#74607B] font-semibold">
                      {pricingCycle === '1_bulan' && '/ bulan'}
                      {pricingCycle === '6_bulan' && '/ 6 bulan'}
                      {pricingCycle === '1_tahun' && '/ tahun'}
                    </span>
                  </div>
                  <p className="text-xs text-[#74607B] mt-1">
                    {pricingCycle === '1_bulan' && 'Hanya sekitar Rp 630 per hari untuk kemudahan menyusun RPM'}
                    {pricingCycle === '6_bulan' && 'Setara Rp 9.800/bulan (Lebih hemat Rp 55.000 dibanding bulanan)'}
                    {pricingCycle === '1_tahun' && 'Setara Rp 8.250/bulan (Paling hemat 57% / hemat Rp 129.000)'}
                  </p>
                </div>

                <ul className="space-y-3 text-xs font-semibold text-[#2A1532] pt-4 border-t border-[#EFE6F2]">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>15 Dokumen RPM</strong> per bulan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Maksimal <strong>5 Dokumen</strong> tersimpan di Riwayat</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dokumen Utama RPM 1 Minggu (.docx) Siap Cetak</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mode Edit Cepat Manual di Pratinjau Dokumen</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#9F88A7] line-through">
                    <span>4 Lampiran Observasi Siap Cetak Terpisah</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#9F88A7] line-through">
                    <span>Rekomendasi AI DPL, CP & Loose Parts</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#9F88A7] line-through">
                    <span>Asisten Revisi AI via Chat (Plan & Action)</span>
                  </li>
                </ul>
              </div>

              <a
                href={getWhatsAppOrderUrl(
                  'Standar',
                  pricingCycle === '1_bulan' ? '1 Bulan' : pricingCycle === '6_bulan' ? '6 Bulan' : '1 Tahun',
                  pricingCycle === '1_bulan' ? 'Rp 19.000' : pricingCycle === '6_bulan' ? 'Rp 59.000' : 'Rp 99.000'
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-white hover:bg-[#FAF3FB] text-[#522D60] border-2 border-[#522D60] rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
              >
                <span>Pilih Paket Standar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* CARD 2: PRO (RECOMMENDED) */}
            <div className="bg-gradient-to-b from-white to-[#FAF3FB] p-8 rounded-3xl border-2 border-[#522D60] shadow-xl relative flex flex-col justify-between space-y-6">
              {/* Highlight Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-[#2A1532] text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 fill-[#2A1532]" />
                <span>Paling Direkomendasikan</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#522D60]">
                    Paket PRO Lengkap
                  </span>
                  <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                    Akses Semua Fitur
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#2A1532]">
                      {pricingCycle === '1_bulan' && 'Rp 29.000'}
                      {pricingCycle === '6_bulan' && 'Rp 89.000'}
                      {pricingCycle === '1_tahun' && 'Rp 149.000'}
                    </span>
                    <span className="text-xs text-[#74607B] font-semibold">
                      {pricingCycle === '1_bulan' && '/ bulan'}
                      {pricingCycle === '6_bulan' && '/ 6 bulan'}
                      {pricingCycle === '1_tahun' && '/ tahun'}
                    </span>
                  </div>
                  <p className="text-xs text-[#74607B] mt-1">
                    {pricingCycle === '1_bulan' && 'Hanya sekitar Rp 960 per hari untuk akses penuh seluruh fitur unggulan'}
                    {pricingCycle === '6_bulan' && 'Setara Rp 14.800/bulan (Lebih hemat Rp 85.000 dibanding bulanan)'}
                    {pricingCycle === '1_tahun' && 'Setara Rp 12.400/bulan (Paling hemat 57% / hemat Rp 199.000)'}
                  </p>
                </div>

                <ul className="space-y-3 text-xs font-bold text-[#2A1532] pt-4 border-t border-[#EFE6F2]">
                  <li className="flex items-center gap-2.5 text-[#522D60]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>40 Dokumen RPM</strong> per bulan</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#522D60]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Maksimal <strong>25 Dokumen</strong> tersimpan di Riwayat Awan</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#522D60]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>4 Lampiran Observasi Siap Cetak</strong> Terpisah (.docx)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#522D60]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Rekomendasi AI Cerdas:</strong> DPL, CP Verbatim & Loose Parts</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#522D60]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Asisten Revisi AI (Chat):</strong> Mode Plan & Action (10 tiket/dokumen)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#522D60]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ekspor Resmi Kertas <strong>F4 Folio & A4</strong></span>
                  </li>
                </ul>
              </div>

              <a
                href={getWhatsAppOrderUrl(
                  'PRO',
                  pricingCycle === '1_bulan' ? '1 Bulan' : pricingCycle === '6_bulan' ? '6 Bulan' : '1 Tahun',
                  pricingCycle === '1_bulan' ? 'Rp 29.000' : pricingCycle === '6_bulan' ? 'Rp 89.000' : 'Rp 149.000'
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-[#522D60] hover:bg-[#693774] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md shadow-[#522D60]/20 active:scale-[0.98]"
              >
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Aktifkan Paket PRO Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Guarantee Note */}
          <div className="text-center text-xs text-[#74607B] max-w-md mx-auto flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garansi aktivasi instan via WhatsApp resmi & bantuan teknis ramah guru.</span>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#80426E] uppercase tracking-wider">Informasi Paling Sering Ditanyakan</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2A1532]">Pertanyaan Seputar Kalandra</h2>
        </div>

        <div className="space-y-3">
          <div className="bg-white p-5 rounded-2xl border border-[#EFE6F2] shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532]">Apakah kurikulumnya sudah sesuai aturan Kemendikdasmen 2025/2026?</h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Ya, 100% patuh. Kalandra secara tegas tidak lagi menggunakan istilah lama "P5" atau "Profil Pelajar Pancasila", melainkan menggunakan 8 Dimensi Profil Lulusan (DPL1-DPL8) sesuai Permendikdasmen No. 10/2025, Standar Proses Deep Learning Permendikdasmen No. 1/2026, serta Capaian Pembelajaran verbatim BSKAP No. 046/2025.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EFE6F2] shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532]">Apakah saya perlu mendaftarkan API key atau akun AI sendiri?</h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Tidak perlu! Seluruh pembuatan dokumen di Kalandra telah terhubung langsung ke multi-pool server AI resmi Kalandra. Guru cukup fokus mengetikkan topik dan memilih kelas, sistem kami yang mengurus seluruh pemrosesan otomatis tanpa perlu repot teknis.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EFE6F2] shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532]">Apakah file Word hasil unduhan bisa diedit kembali di laptop?</h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Tentu saja! Berkas yang diunduh berformat .docx biner resmi (OOXML) yang dapat langsung dibuka dan diedit di Microsoft Word, Google Docs, maupun WPS Office di laptop atau ponsel Anda.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EFE6F2] shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532]">Apa bedanya Paket Standar dan Paket PRO?</h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Paket Standar diperuntukkan bagi guru yang hanya membutuhkan dokumen utama RPM dengan kuota 15 dokumen/bulan. Paket PRO membuka seluruh fitur lanjutan: 4 Lampiran Observasi Siap Cetak (Anekdot, Ceklis SOLO, Hasil Karya, Foto Berseri), Rekomendasi AI DPL & Loose Parts, Asisten Revisi AI via Chat (Mode Plan & Action), dan kuota 40 dokumen/bulan.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532] flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Apakah Kalandra bisa dipasang di layar HP Android atau iPhone saya?</span>
            </h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Ya, 100% bisa! Kalandra telah mengadopsi standar Progressive Web App (PWA) modern. Bunda dan Bapak Guru dapat memasang Kalandra langsung ke layar utama (Home Screen) smartphone Android, iPhone/iPad (iOS), maupun Laptop tanpa perlu mengunduh aplikasi berukuran puluhan megabyte dari toko aplikasi. Aplikasi langsung terbuka secara layar penuh (fullscreen standalone) tanpa bilah URL browser.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532] flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bagaimana cara memasang aplikasi Kalandra di HP saya?</span>
            </h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Sangat praktis! Cukup klik tombol <strong>"Pasang di HP"</strong> di menu navigasi atau tombol di halaman ini:
              <br />
              • <strong>Di HP Android (Chrome/Edge):</strong> Klik tombol "Pasang Sekarang" pada kotak dialog yang muncul, lalu pilih 'Install'.
              <br />
              • <strong>Di iPhone/iPad (Safari):</strong> Ketuk tombol <em>Share</em> (ikon kotak dengan panah ke atas di bilah bawah browser Safari), lalu gulir ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama). Selesai!
            </p>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM BANNER CTA */}
      <section className="py-16 bg-[#522D60] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl overflow-hidden mx-auto shadow-2xl border border-white/20 bg-[#2A1532]">
            <img src="/kalandra_logo.png" alt="Kalandra" className="w-full h-full object-cover scale-[1.05]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Siap Menghemat Waktu Administrasi Pembelajaran Anda?
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Bergabunglah bersama ratusan pendidik PAUD lainnya yang telah beralih ke cara cerdas menyusun RPM mingguan.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handlePrimaryAction}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FFD38B] hover:bg-[#ffe0a6] text-[#522D60] rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Mulai Buat RPM Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToAuth}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-white border-t border-[#EFE6F2] py-8 text-xs text-[#74607B] text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-[#2A1532]">
            Kalandra — Generator Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
          </p>
          <p className="text-[11px] text-[#74607B]/80">
            Platform Perencanaan Pembelajaran TK Fase Fondasi 2025/2026 Terstandar Pengawas
          </p>
          <p className="text-[11px] text-[#74607B]/70 pt-1">
            © 2026 Kalandra. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>

      {/* PWA Install Modal Guide */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />
    </div>
  );
};
