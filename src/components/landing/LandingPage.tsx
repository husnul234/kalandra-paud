import React from 'react';
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
  KeyRound, 
  LogIn, 
  HelpCircle,
  Building2,
  Users,
  ChevronRight,
  Printer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <div className="min-h-screen bg-[#FAF7FB] text-[#2A1532] flex flex-col selection:bg-[#522D60] selection:text-white">
      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 select-none cursor-pointer" onClick={onGoToApp}>
            <div className="w-10 h-10 rounded-2xl bg-[#522D60] text-white flex items-center justify-center font-black shadow-md shadow-[#522D60]/20">
              <Sparkles className="w-5 h-5 text-[#FFD38B]" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight text-[#2A1532] flex items-center gap-1.5">
                KALANDRA PAUD
              </span>
              <span className="hidden sm:block text-[11px] font-semibold text-[#80426E] -mt-1">
                RPM TK Fase Fondasi 2025/2026
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#74607B]">
            <a href="#fitur" className="hover:text-[#522D60] transition-colors">Fitur Unggulan</a>
            <a href="#regulasi" className="hover:text-[#522D60] transition-colors">Kepatuhan Regulasi</a>
            <a href="#contoh" className="hover:text-[#522D60] transition-colors">Contoh Dokumen</a>
            <a href="#faq" className="hover:text-[#522D60] transition-colors">Tanya Jawab</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                onClick={onGoToAdmin}
                className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-[#522D60] bg-[#FAF3FB] hover:bg-[#F4E8F6] border border-[#E8D6EB] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#80426E]" />
                <span>Panel Admin</span>
              </button>
            )}

            {user || profile ? (
              <button
                onClick={onGoToApp}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center gap-1.5 transition-all"
              >
                <span>Buka Generator RPM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={onGoToAuth}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-bold text-[#522D60] hover:bg-[#FAF3FB] border border-[#D8C3DD] transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
                <button
                  onClick={onGoToApp}
                  className="py-1.5 sm:py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] shadow-md shadow-[#522D60]/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Mulai Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Glow ambient background blobs with Color Hunt tones */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#FAF3FB] via-[#FDF1EA]/30 to-transparent blur-3xl -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#FFD38B]/20 blur-3xl -z-10" />
        <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-[#80426E]/10 blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8D6EB] shadow-xs text-xs font-bold text-[#80426E] animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#522D60] animate-pulse" />
            <span>Standar Baru Kurikulum Merdeka PAUD 2025/2026</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2A1532] tracking-tight leading-[1.15]">
            Susun Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#522D60] via-[#80426E] to-[#F2A67B]">
              dalam 2 Menit
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-[#74607B] leading-relaxed">
            Platform generator cerdas berkesadaran, bermakna, dan menggembirakan. Otomatisasi <strong>18 kegiatan bermain loose parts</strong> mingguan, kepatuhan mutlak <strong>8 Dimensi Profil Lulusan (8 DPL)</strong> tanpa istilah usang P5, dan ekspor Microsoft Word (.docx) resmi siap cetak tanpa halusinasi.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToApp}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#522D60] hover:bg-[#693774] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#522D60]/25 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#FFD38B]" />
              <span>Mulai Susun RPM Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToAuth}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FAF3FB] text-[#522D60] border border-[#D8C3DD] rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun Guru</span>
            </button>
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
                <div className="text-[10px] text-[#74607B]">Deep Learning 3 Tahapan</div>
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
                <div className="text-[11px] font-bold text-[#2A1532]">BYOK Gemini Pooling</div>
                <div className="text-[10px] text-[#74607B]">Bebas Limit Kuota 429</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM VS SOLUTION */}
      <section className="py-16 bg-white border-y border-[#EFE6F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2A1532]">
              Mengapa Guru TK Membutuhkan Kalandra PAUD?
            </h2>
            <p className="text-xs sm:text-sm text-[#74607B] mt-2">
              Perubahan kurikulum dan tuntutan administrasi mingguan tidak lagi harus mengorbankan akhir pekan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box Masalah */}
            <div className="p-6 sm:p-8 rounded-3xl bg-red-50/60 border border-red-200/80 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                ⚠️ Masalah Manual Guru Sebelumnya
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-red-950">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Lembur 6–8 jam:</strong> Merancang 18 kegiatan bermain berbeda tiap minggu memakan banyak waktu istirahat guru.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Istilah usang P5:</strong> Masih kerap menggunakan istilah <i>"Profil Pelajar Pancasila"</i> yang sudah digantikan oleh 8 Dimensi Profil Lulusan (DPL).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Limit AI Kuota Habis (429):</strong> Chatbot AI gratis sering kali macet di tengah jalan karena batasan kuota harian.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Tabel Word Pecah Saat Dicetak:</strong> Dokumen berantakan, terbelah di tengah kalimat, dan margin tidak rapi.</span>
                </li>
              </ul>
            </div>

            {/* Box Solusi */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF3FB] border border-[#E8D6EB] space-y-4 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#522D60] text-white text-xs font-bold">
                ✨ Solusi Cerdas Kalandra PAUD
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#2A1532]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#80426E] font-bold shrink-0">✓</span>
                  <span><strong>Selesai dalam 2 Menit:</strong> Panduan 4 langkah terstruktur langsung meracik 18 kegiatan main PAUD mendalam.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#80426E] font-bold shrink-0">✓</span>
                  <span><strong>Kepatuhan Regulasi 100%:</strong> Salinan Capaian Pembelajaran verbatim dari BSKAP 046/2025 dan pemetaan 8 DPL otomatis.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#80426E] font-bold shrink-0">✓</span>
                  <span><strong>BYOK Auto-Failover:</strong> Simpan hingga 5 kunci Gemini gratis; sistem otomatis berpindah kunci jika limit 429 terjadi.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#80426E] font-bold shrink-0">✓</span>
                  <span><strong>Word Siap Cetak (OOXML):</strong> File .docx biner murni dengan atribut <i>cantSplit</i> dan margin resmi A4 / F4 Folio.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES */}
      <section id="fitur" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#80426E] uppercase tracking-wider">Fitur Dirancang Khusus untuk Pendidik PAUD</span>
          <h2 className="text-3xl font-black text-[#2A1532]">4 Keunggulan Utama Kalandra PAUD</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Fitur 1 */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE6F2] shadow-xs hover:border-[#D8C3DD] transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#522D60] text-white flex items-center justify-center font-bold">
              <Award className="w-6 h-6 text-[#FFD38B]" />
            </div>
            <h3 className="text-base font-extrabold text-[#2A1532]">8 Dimensi Profil Lulusan</h3>
            <p className="text-xs text-[#74607B] leading-relaxed">
              Menerapkan Permendikdasmen No. 10/2025 secara penuh. Mengeliminasi total istilah lama P5 dengan validasi sistematis DPL 1 s.d. DPL 8.
            </p>
          </div>

          {/* Fitur 2 */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE6F2] shadow-xs hover:border-[#D8C3DD] transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#80426E] text-white flex items-center justify-center font-bold">
              <Layers className="w-6 h-6 text-[#FFD38B]" />
            </div>
            <h3 className="text-base font-extrabold text-[#2A1532]">18 Kegiatan Main Loose Parts</h3>
            <p className="text-xs text-[#74607B] leading-relaxed">
              6 hari belajar dengan masing-masing tepat 3 kegiatan seimbang: Seni/Loose Parts, Motorik/Sosial, dan Keaksaraan Kontekstual (Bukan dril LKS).
            </p>
          </div>

          {/* Fitur 3 */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE6F2] shadow-xs hover:border-[#D8C3DD] transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#522D60] text-white flex items-center justify-center font-bold">
              <KeyRound className="w-6 h-6 text-[#FFD38B]" />
            </div>
            <h3 className="text-base font-extrabold text-[#2A1532]">BYOK Gemini Multi-Key</h3>
            <p className="text-xs text-[#74607B] leading-relaxed">
              Gunakan kunci API gratis Google AI Studio milik Anda sendiri. Dilengkapi rotasi cerdas yang langsung melompat jika limit kuota tercapai.
            </p>
          </div>

          {/* Fitur 4 */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE6F2] shadow-xs hover:border-[#D8C3DD] transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#80426E] text-white flex items-center justify-center font-bold">
              <Printer className="w-6 h-6 text-[#FFD38B]" />
            </div>
            <h3 className="text-base font-extrabold text-[#2A1532]">Ekspor Word True WYSIWYG</h3>
            <p className="text-xs text-[#74607B] leading-relaxed">
              Apa yang Anda lihat di layar pratinjau adalah apa yang Anda dapatkan di Microsoft Word (.docx). Siap cetak langsung ke kertas A4 atau F4 Folio.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE DOCUMENT MOCKUP TEASER */}
      <section id="contoh" className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div>
            <span className="text-xs font-bold text-[#80426E] uppercase tracking-wider">Kualitas Publisher-Grade Siap Cetak</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2A1532] mt-1">
              Pratinjau Dokumen Identik Microsoft Word
            </h2>
            <p className="text-xs sm:text-sm text-[#74607B] max-w-xl mx-auto mt-2">
              Tidak perlu membuang waktu merapikan margin dan tabel di Word. Kalandra PAUD menyusun berkas dengan standar resmi instansi.
            </p>
          </div>

          {/* Visual Paper Sheet Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-300 max-w-3xl mx-auto text-left font-['Calibri'] space-y-4">
            <div className="text-center pb-4 border-b border-[#1E3A8A]/20 space-y-0.5">
              <h3 className="text-lg font-bold text-[#1E3A8A] uppercase tracking-wide">
                PERENCANAAN PEMBELAJARAN MENDALAM (RPM)
              </h3>
              <p className="text-xs font-bold text-[#1E3A8A]">
                TK NEGERI PEMBINA 01 — FASE FONDASI
              </p>
              <p className="text-[10px] text-slate-500">
                Standar Kurikulum PAUD Permendikdasmen No. 10/2025, 12/2025, 1/2026 & BSKAP 046/2025
              </p>
            </div>

            {/* Mock Table Header */}
            <div className="bg-[#1E3A8A] text-white px-3.5 py-1.5 text-xs font-bold flex justify-between items-center">
              <span>1. IDENTIFIKASI</span>
              <span className="text-[10px] font-normal text-blue-200">Permendikdasmen No. 10/2025 & No. 12/2025</span>
            </div>

            {/* Mock Table Rows */}
            <div className="border border-slate-300 divide-y divide-slate-300 text-xs">
              <div className="grid grid-cols-4">
                <div className="p-2.5 font-bold text-[#1E3A8A] border-r border-slate-300 bg-slate-50">
                  Peserta Didik
                </div>
                <div className="col-span-3 p-2.5 text-slate-800 leading-relaxed text-[11px]">
                  Peserta didik berada pada rentang usia 4–5 tahun (Kelompok A) dalam masa adaptasi awal masuk sekolah. Anak mulai mengeksplorasi lingkungan baru...
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="p-2.5 font-bold text-[#1E3A8A] border-r border-slate-300 bg-slate-50">
                  Dimensi Profil Lulusan
                </div>
                <div className="col-span-3 p-2.5 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold">[ v ]</span>
                    <strong className="text-[#1E3A8A]">DPL1 - Keimanan dan Ketakwaan terhadap Tuhan YME</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold">[ v ]</span>
                    <strong className="text-[#1E3A8A]">DPL4 - Kreativitas (Eksplorasi Loose Parts)</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onGoToApp}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#522D60] hover:text-[#693774] underline"
              >
                <span>Buka Editor & Lihat Dokumen Lengkap 6 Hari →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#80426E] uppercase tracking-wider">Informasi Paling Sering Ditanyakan</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2A1532]">Pertanyaan Seputar Kalandra PAUD</h2>
        </div>

        <div className="space-y-3">
          <div className="bg-white p-5 rounded-2xl border border-[#EFE6F2] shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532]">Apakah kurikulumnya sudah sesuai aturan Kemendikdasmen 2025/2026?</h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Ya, 100% patuh. Kalandra PAUD secara tegas tidak lagi menggunakan istilah "P5" atau "Profil Pelajar Pancasila", melainkan menggunakan 8 Dimensi Profil Lulusan (DPL1-DPL8) sesuai Permendikdasmen No. 10/2025 serta siklus Deep Learning Permendikdasmen No. 1/2026.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EFE6F2] shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532]">Bagaimana cara mendapatkan kunci Google Gemini API gratis?</h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Sangat mudah! Anda cukup masuk ke Google AI Studio (aistudio.google.com), klik tombol "Get API Key", dan salin kunci tersebut ke menu Kunci BYOK di Kalandra PAUD. Kami sarankan mendaftarkan minimal 2 kunci agar rotasi otomatis berjalan lancar tanpa limit.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EFE6F2] shadow-xs">
            <h4 className="text-sm font-bold text-[#2A1532]">Apakah file Word hasil unduhan bisa diedit kembali?</h4>
            <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
              Tentu saja! Berkas yang diunduh berformat .docx biner resmi yang dapat dibuka dan diedit di Microsoft Word, Google Docs, maupun WPS Office di laptop atau ponsel Anda.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM BANNER CTA */}
      <section className="py-16 bg-[#522D60] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-[#FFD38B]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Siap Menghemat Waktu Administrasi Pembelajaran Anda?
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Bergabunglah bersama ratusan pendidik PAUD lainnya yang telah beralih ke cara cerdas menyusun RPM mingguan.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToApp}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FFD38B] hover:bg-[#ffe0a6] text-[#522D60] rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Mulai Buat RPM Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToAuth}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-white border-t border-[#EFE6F2] py-8 text-xs text-[#74607B] text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-[#2A1532]">
            Kalandra PAUD — Generator Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
          </p>
          <p className="text-[11px] text-[#74607B]/80">
            Platform Perencanaan Pembelajaran TK Fase Fondasi 2025/2026
          </p>
          <p className="text-[11px] text-[#74607B]/70 pt-1">
            © 2026 Kalandra PAUD. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>
    </div>
  );
};
