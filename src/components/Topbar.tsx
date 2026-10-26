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
  AlertTriangle
} from 'lucide-react';

interface Props {
  activeTab: 'wizard' | 'preview' | 'history' | 'admin';
  setActiveTab: (tab: 'wizard' | 'preview' | 'history' | 'admin') => void;
  onOpenKeyModal: () => void;
}

export const Topbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenKeyModal }) => {
  const { profile, signOut, isAdmin, switchToDemoRole } = useAuth();
  const { activeKeys } = useGeminiKeys(profile?.id);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const keyCount = activeKeys.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Badge */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('wizard')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black shadow-xs group-hover:bg-blue-800 transition-colors">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors flex items-center gap-1.5">
                  KALANDRA PAUD
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-slate-500 -mt-1">
                  RPM TK Fase Fondasi 2025/2026
                </span>
              </div>
            </div>

            {/* School Tag */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>{profile?.school_name || 'TK NEGERI PEMBINA 01'}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'wizard'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Penyusun RPM
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Pratinjau Dokumen
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Riwayat
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-blue-900 hover:bg-blue-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
          </nav>

          {/* Right Action Icons: BYOK Keys Pill & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* BYOK Status Pill */}
            <button
              onClick={onOpenKeyModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                keyCount > 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
              title="Klik untuk membuka Pengelola Kunci BYOK"
            >
              <KeyRound className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Kunci BYOK:</span>
              {keyCount > 0 ? (
                <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
                  {keyCount} Aktif <CheckCircle className="w-3 h-3 text-emerald-600" />
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-700 font-extrabold">
                  Belum Ada <AlertTriangle className="w-3 h-3 text-amber-600" />
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                aria-expanded={showProfileMenu}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {profile?.full_name?.split(' ')[0] || 'Guru'}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {profile?.role === 'admin' ? 'Kepala TK / Admin' : 'Guru Kelas'}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-scale-in"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-900">{profile?.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{profile?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                      {profile?.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Ganti Peran Demonstrasi
                    </div>
                    <button
                      onClick={() => switchToDemoRole('guru')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 ${
                        profile?.role === 'guru' ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <User className="w-4 h-4 text-blue-600" /> Guru Kelas (Penyusun RPM)
                    </button>
                    <button
                      onClick={() => switchToDemoRole('admin')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 ${
                        profile?.role === 'admin' ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-amber-600" /> Admin Satuan PAUD
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={onOpenKeyModal}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4 text-slate-500" /> Kelola API Key BYOK
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Menu navigasi"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => { setActiveTab('wizard'); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activeTab === 'wizard' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" /> Penyusun RPM (Wizard)
          </button>
          <button
            onClick={() => { setActiveTab('preview'); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activeTab === 'preview' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" /> Pratinjau Dokumen & Edit
          </button>
          <button
            onClick={() => { setActiveTab('history'); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activeTab === 'history' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-600" /> Riwayat Dokumen
          </button>
          {isAdmin && (
            <button
              onClick={() => { setActiveTab('admin'); setShowMobileMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'admin' ? 'bg-blue-900 text-white' : 'text-blue-900'
              }`}
            >
              <Shield className="w-4 h-4" /> Konsol Admin Platform
            </button>
          )}
        </div>
      )}
    </header>
  );
};
