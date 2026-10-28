import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCheck, 
  Settings, 
  Home, 
  LogOut, 
  ChevronLeft, 
  Menu, 
  BookOpen, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminUsersView } from './AdminUsersView';
import { AdminSchoolsView } from './AdminSchoolsView';
import { AdminCustomersView } from './AdminCustomersView';
import { AdminSettingsView } from './AdminSettingsView';

export type AdminTabType = 'dashboard' | 'users' | 'schools' | 'customers' | 'settings';

interface AdminLayoutProps {
  onBackToApp: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToApp }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Pengguna & Guru', icon: Users },
    { id: 'schools', label: 'Lembaga PAUD', icon: Building2 },
    { id: 'customers', label: 'Pelanggan & Lisensi', icon: UserCheck },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ] as const;

  const handleSignOut = async () => {
    await signOut();
    onBackToApp();
  };

  return (
    <div className="min-h-screen bg-[#FAF7FB] text-[#2A1532] flex">
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#EFE6F2] z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-[#FAF3FB] rounded-xl text-[#522D60]"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#522D60] rounded-xl flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4 text-[#FFD38B]" />
            </div>
            <span className="font-extrabold text-sm text-[#2A1532]">Admin Panel</span>
          </div>
        </div>

        <button
          onClick={onBackToApp}
          className="text-xs font-bold text-[#80426E] hover:underline"
        >
          Ke Aplikasi →
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar (Collapsible on desktop, drawer on mobile) */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-[#EFE6F2] z-50 flex flex-col justify-between transition-all duration-300 w-72 max-w-[85vw] ${
          sidebarOpen ? 'lg:w-64' : 'lg:w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-xl lg:shadow-sm`}
      >
        {/* Top: Header & Collapse Toggle */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#EFE6F2]">
            {/* Logo area */}
            <div className={`flex items-center gap-2.5 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-xs border border-[#E8D6EB] bg-[#2A1532] shrink-0">
                <img src="/kalandra_logo.png" alt="Kalandra" className="w-full h-full object-cover scale-[1.05]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-[#2A1532] leading-tight">Admin Panel</span>
                <span className="text-[11px] text-[#74607B] font-medium">Kalandra</span>
              </div>
            </div>

            {/* Desktop collapsed icon */}
            {!sidebarOpen && (
              <div className="hidden lg:flex w-10 h-10 rounded-xl overflow-hidden items-center justify-center mx-auto border border-[#E8D6EB] bg-[#2A1532]">
                <img src="/kalandra_logo.png" alt="Kalandra" className="w-full h-full object-cover scale-[1.05]" />
              </div>
            )}

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 hover:bg-[#FAF3FB] rounded-lg text-[#74607B] hover:text-[#522D60] transition-colors"
              title={sidebarOpen ? 'Ciutkan Sidebar' : 'Perluas Sidebar'}
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-xl text-[#74607B] hover:text-[#522D60] hover:bg-[#FAF3FB] transition-colors"
              aria-label="Tutup menu sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (5 Main Menus) */}
          <nav className="p-3 space-y-1">
            <div className={`px-3 pt-2 pb-1 text-[10px] font-extrabold tracking-widest text-[#74607B] uppercase ${
              !sidebarOpen ? 'lg:hidden' : ''
            }`}>
              Menu Utama
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as AdminTabType);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#522D60] text-white shadow-sm'
                      : 'text-[#74607B] hover:text-[#522D60] hover:bg-[#FAF3FB]'
                  } ${!sidebarOpen ? 'lg:justify-center' : ''}`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={!sidebarOpen ? 'lg:hidden' : ''}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Ke Aplikasi, Keluar, & Profile Info */}
        <div className="p-3 border-t border-[#EFE6F2] space-y-1">
          <button
            onClick={onBackToApp}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#522D60] hover:bg-[#FAF3FB] transition-colors ${
              !sidebarOpen ? 'lg:justify-center' : ''
            }`}
            title="Ke Aplikasi (Generator RPM)"
          >
            <Home className="w-5 h-5 flex-shrink-0 text-[#80426E]" />
            <span className={!sidebarOpen ? 'lg:hidden' : ''}>Ke Aplikasi</span>
          </button>

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors ${
              !sidebarOpen ? 'lg:justify-center' : ''
            }`}
            title="Keluar"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={!sidebarOpen ? 'lg:hidden' : ''}>Keluar</span>
          </button>

          {/* Admin Profile Box */}
          <div className={`mt-3 p-3 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB] ${
            !sidebarOpen ? 'lg:hidden' : ''
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#522D60] text-white flex items-center justify-center font-bold text-xs shrink-0">
                H
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#2A1532] truncate">
                  {user?.email || profile?.email || 'pakhusnulid@gmail.com'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#80426E] uppercase">
                  <ShieldCheck className="w-3 h-3 text-[#522D60]" /> Administrator
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        } pt-20 lg:pt-6 p-4 sm:p-6 lg:p-8 min-h-screen`}
      >
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <AdminDashboardView />}
          {activeTab === 'users' && <AdminUsersView />}
          {activeTab === 'schools' && <AdminSchoolsView />}
          {activeTab === 'customers' && <AdminCustomersView />}
          {activeTab === 'settings' && <AdminSettingsView />}
        </div>
      </main>
    </div>
  );
};
