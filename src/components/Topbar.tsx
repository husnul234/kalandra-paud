import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGeminiKeys } from '../hooks/useGeminiKeys';
import { 
  Sparkles, 
  KeyRound, 
  Shield, 
  User, 
  LogOut, 
  FileText, 
  LayoutDashboard, 
  Menu, 
  X, 
  Building2,
  CheckCircle,
  AlertTriangle,
  LogIn,
  Home,
  Crown,
  Smartphone
} from 'lucide-react';
import { PwaInstallModal } from './pwa/PwaInstallModal';

interface Props {
  activeTab: 'wizard' | 'preview' | 'history' | 'admin';
  setActiveTab: (tab: 'wizard' | 'preview' | 'history' | 'admin') => void;
  onOpenKeyModal: () => void;
  onOpenAuth: () => void;
  onOpenProfileModal?: () => void;
  onOpenSubscriptionModal?: () => void;
  onGoToLanding?: () => void;
}

export const Topbar: React.FC<Props> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenKeyModal, 
  onOpenAuth,
  onOpenProfileModal,
  onOpenSubscriptionModal,
  onGoToLanding 
}) => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { activeKeys } = useGeminiKeys(user?.id);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  const keyCount = activeKeys.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Badge */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                if (onGoToLanding) onGoToLanding();
                else setActiveTab('wizard');
              }}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-[#522D60]/20 shrink-0 border border-[#E8D6EB] group-hover:scale-105 transition-all bg-[#2A1532]">
                <img src="/kalandra_logo.png" alt="Kalandra" className="w-full h-full object-cover scale-[1.05]" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#2A1532] group-hover:text-[#522D60] transition-colors flex items-center gap-1.5">
                  KALANDRA
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-[#74607B] -mt-1">
                  RPM TK Fase Fondasi 2025/2026
                </span>
              </div>
            </div>

            {/* School Tag */}
            <button
              onClick={onOpenProfileModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3FB] hover:bg-[#F3E8F5] text-[#2A1532] text-xs font-semibold border border-[#E8D6EB] transition-all cursor-pointer group"
              title="Klik untuk mengubah nama sekolah / profil PAUD"
            >
              <Building2 className="w-3.5 h-3.5 text-[#80426E] group-hover:scale-110 transition-transform" />
              <span className="truncate max-w-[220px]">{profile?.school_name || 'Satuan PAUD'}</span>
              <span className="text-[10px] text-[#80426E]/70 font-normal underline ml-0.5 group-hover:text-[#522D60]">Ubah</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FAF3FB] p-1 rounded-2xl border border-[#E8D6EB]">
            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#74607B] hover:text-[#522D60] hover:bg-white/60 transition-all flex items-center gap-1"
                title="Kembali ke Halaman Beranda"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Beranda</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'wizard'
                  ? 'bg-white text-[#522D60] shadow-xs'
                  : 'text-[#74607B] hover:text-[#522D60] hover:bg-white/60'
              }`}
            >
              Penyusun RPM
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-[#522D60] shadow-xs'
                  : 'text-[#74607B] hover:text-[#522D60] hover:bg-white/60'
              }`}
            >
              Pratinjau Dokumen
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-[#522D60] shadow-xs'
                  : 'text-[#74607B] hover:text-[#522D60] hover:bg-white/60'
              }`}
            >
              Riwayat
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-[#522D60] text-white shadow-xs'
                    : 'text-[#522D60] hover:bg-[#F4E8F6]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Panel Admin
              </button>
            )}
          </nav>

          {/* Right Action Icons: Subscription Pill, BYOK Keys Pill & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Subscription Pill */}
            {onOpenSubscriptionModal && (
              <button
                onClick={onOpenSubscriptionModal}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all border bg-gradient-to-r from-[#FAF3FB] to-[#F3E8F5] text-[#522D60] border-[#E8D6EB] hover:border-[#522D60]/40 shadow-2xs cursor-pointer shrink-0"
                title="Buka Pilihan Paket Langganan Standar & Pro"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                <span className="hidden sm:inline">
                  {profile?.tier === 'standar' ? 'Paket STANDAR' : 'Paket PRO'}
                </span>
                <span className="text-[10px] bg-[#522D60] text-white px-1.5 py-0.2 rounded-full font-extrabold">
                  {profile?.tier === 'standar' ? '15 RPM' : 'Aktif'}
                </span>
              </button>
            )}

            {/* BYOK Status Pill (Admin Only) */}
            {isAdmin && (
              <button
                onClick={onOpenKeyModal}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  keyCount > 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-[#FFFBF2] text-[#9A6A00] border-[#FFE5B3] hover:bg-[#FFF6E5]'
                }`}
                title="Klik untuk membuka Pengelola Kunci BYOK (Admin Mode)"
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">BYOK Admin:</span>
                {keyCount > 0 ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
                    {keyCount} Aktif <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#9A6A00] font-extrabold">
                    Pool Sistem <Sparkles className="w-3 h-3 text-[#FFD38B]" />
                  </span>
                )}
              </button>
            )}

            {/* User Profile Dropdown */}
            {user || profile ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-[#E8D6EB] hover:bg-[#FAF3FB] transition-colors"
                  aria-expanded={showProfileMenu}
                >
                  <div className="w-7 h-7 rounded-xl bg-[#522D60] text-white flex items-center justify-center font-bold text-xs">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-[#2A1532] leading-tight">
                      {profile?.full_name?.split(' ')[0] || 'Guru'}
                    </div>
                    <div className="text-[10px] text-[#74607B] capitalize">
                      {isAdmin ? 'Administrator' : 'Guru Kelas'}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-[#EFE6F2] py-2 z-50 animate-scale-in"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 bg-[#FAF3FB]">
                      <p className="text-xs font-bold text-[#2A1532]">{profile?.full_name}</p>
                      <p className="text-[11px] text-[#74607B] truncate">{profile?.email}</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase ${
                        isAdmin ? 'bg-[#522D60]' : 'bg-[#80426E]'
                      }`}>
                        {isAdmin ? 'ADMINISTRATOR' : 'GURU KELAS'}
                      </span>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <button
                          onClick={() => setActiveTab('admin')}
                          className="w-full px-4 py-2 text-left text-xs text-[#522D60] hover:bg-[#FAF3FB] flex items-center gap-2 font-bold"
                        >
                          <Shield className="w-4 h-4 text-[#80426E]" /> Buka Panel Admin
                        </button>
                      )}

                      {onOpenProfileModal && (
                        <button
                          onClick={onOpenProfileModal}
                          className="w-full px-4 py-2 text-left text-xs text-[#2A1532] hover:bg-[#FAF3FB] flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-[#74607B]" /> Profil Guru & Satuan PAUD
                        </button>
                      )}

                      {onOpenSubscriptionModal && (
                        <button
                          onClick={onOpenSubscriptionModal}
                          className="w-full px-4 py-2 text-left text-xs text-[#522D60] hover:bg-[#FAF3FB] flex items-center gap-2 font-bold"
                        >
                          <Crown className="w-4 h-4 text-amber-500 fill-amber-400" /> Paket Langganan Standar & Pro
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={onOpenKeyModal}
                          className="w-full px-4 py-2 text-left text-xs text-[#2A1532] hover:bg-[#FAF3FB] flex items-center gap-2"
                        >
                          <KeyRound className="w-4 h-4 text-[#74607B]" /> Kelola API Key BYOK (Admin)
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setIsPwaModalOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 font-bold transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-600" /> Pasang di Layar HP (PWA)
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      {!user ? (
                        <button
                          onClick={onOpenAuth}
                          className="w-full px-4 py-2 text-left text-xs text-[#522D60] hover:bg-[#FAF3FB] flex items-center gap-2 font-bold"
                        >
                          <LogIn className="w-4 h-4" /> Masuk ke Akun
                        </button>
                      ) : (
                        <button
                          onClick={() => signOut()}
                          className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                        >
                          <LogOut className="w-4 h-4" /> Keluar Akun
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl text-[#2A1532] hover:bg-[#FAF3FB]"
              aria-label="Menu navigasi"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-[#EFE6F2] bg-white px-4 pt-3 pb-5 space-y-2 shadow-xl animate-fade-in max-h-[85vh] overflow-y-auto">
          {/* User Profile Summary Card (Mobile) */}
          {user || profile ? (
            <div className="p-3 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB] space-y-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#522D60] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#2A1532] truncate">
                    {profile?.full_name || 'Guru PAUD'}
                  </div>
                  <div className="text-[11px] text-[#74607B] truncate">
                    {user?.email || profile?.email}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                  isAdmin ? 'bg-[#522D60] text-white' : 'bg-[#80426E] text-white'
                }`}>
                  {isAdmin ? 'ADMIN' : 'GURU'}
                </span>
              </div>

              {/* School & Tier Badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#E8D6EB]/60">
                <button
                  onClick={() => { setShowMobileMenu(false); if (onOpenProfileModal) onOpenProfileModal(); }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#80426E] bg-white px-2 py-0.5 rounded-lg border border-[#E8D6EB] truncate max-w-full"
                >
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{profile?.school_name || 'Satuan PAUD'}</span>
                </button>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                  {profile?.tier === 'standar' ? 'Standar' : 'Pro'}
                </span>
              </div>
            </div>
          ) : null}

          <div className="text-[10px] font-black tracking-widest uppercase text-[#80426E] px-2 py-0.5">
            Menu Utama
          </div>

          {onGoToLanding && (
            <button
              onClick={() => { onGoToLanding(); setShowMobileMenu(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-[#2A1532] hover:bg-[#FAF3FB] transition-colors"
            >
              <Home className="w-4 h-4 text-[#80426E]" />
              <span>Beranda</span>
            </button>
          )}
          <button
            onClick={() => { setActiveTab('wizard'); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'wizard' ? 'bg-[#FAF3FB] text-[#522D60] font-bold shadow-2xs' : 'text-[#2A1532] hover:bg-[#FAF3FB]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#80426E]" />
            <span>Penyusun RPM (Wizard)</span>
          </button>
          <button
            onClick={() => { setActiveTab('preview'); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'preview' ? 'bg-[#FAF3FB] text-[#522D60] font-bold shadow-2xs' : 'text-[#2A1532] hover:bg-[#FAF3FB]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#80426E]" />
            <span>Pratinjau Dokumen & Edit</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'history' ? 'bg-[#FAF3FB] text-[#522D60] font-bold shadow-2xs' : 'text-[#2A1532] hover:bg-[#FAF3FB]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#74607B]" />
            <span>Riwayat Dokumen</span>
          </button>

          <div className="pt-2 border-t border-[#EFE6F2] space-y-1">
            {/* PWA Install in Mobile Drawer */}
            <button
              onClick={() => {
                setShowMobileMenu(false);
                setIsPwaModalOpen(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Pasang Kalandra di Layar HP</span>
              </div>
              <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                PWA
              </span>
            </button>

            {onOpenSubscriptionModal && (
              <button
                onClick={() => { onOpenSubscriptionModal(); setShowMobileMenu(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 text-[#522D60] bg-gradient-to-r from-[#FAF3FB] to-[#F3E8F5] border border-[#522D60]/20"
              >
                <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Paket Langganan Standar & Pro</span>
              </button>
            )}

            {user && onOpenProfileModal && (
              <button
                onClick={() => { onOpenProfileModal(); setShowMobileMenu(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-[#2A1532] hover:bg-[#FAF3FB] transition-colors"
              >
                <User className="w-4 h-4 text-[#80426E]" />
                <span>Profil Guru & Satuan PAUD</span>
              </button>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => { setActiveTab('admin'); setShowMobileMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'admin' ? 'bg-[#522D60] text-white' : 'text-[#522D60] hover:bg-[#FAF3FB]'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Panel Admin Platform</span>
                </button>
                <button
                  onClick={() => { onOpenKeyModal(); setShowMobileMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-[#2A1532] hover:bg-[#FAF3FB] transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-[#74607B]" />
                  <span>Kelola API Key BYOK (Admin)</span>
                </button>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-[#EFE6F2]">
            {!user ? (
              <button
                onClick={() => { onOpenAuth(); setShowMobileMenu(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-[#522D60] hover:bg-[#693774] flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Akun</span>
              </button>
            ) : (
              <button
                onClick={() => { setShowMobileMenu(false); signOut(); }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border border-red-200/60 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Keluar Akun</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />
    </header>
  );
};
