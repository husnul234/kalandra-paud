import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { Topbar } from './components/Topbar';
import { RpmWizard } from './components/RpmWizard';
import { LiveTablePreview } from './components/LiveTablePreview';
import { DocumentHistory } from './components/DocumentHistory';
import { AdminLayout } from './components/admin/AdminLayout';
import { AuthPage } from './components/auth/AuthPage';
import { ApiKeyManagerModal } from './components/ApiKeyManagerModal';
import { ExportDocxModal } from './components/ExportDocxModal';
import { ProfileModal } from './components/ProfileModal';
import { SubscriptionModal } from './components/subscription/SubscriptionModal';
import { FirstLoginPasswordModal } from './components/auth/FirstLoginPasswordModal';
import { supabase } from './lib/supabaseClient';
import { SAMPLE_RPM_PAUD } from './data/default_sample_rpm';
import { RpmPaudDocData } from './lib/docx-engine/docx-paud-builder';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { logSecurityEvent } from './lib/securityLogger';

/**
 * Komponen Generator Utama RPM PAUD (/app)
 */
const GeneratorWorkspace: React.FC = () => {
  const { user, profile, isPro } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'wizard' | 'preview' | 'history' | 'admin'>('wizard');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDocType, setExportDocType] = useState<'rpm' | 'lampiran'>('rpm');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isFirstLoginPwdOpen, setIsFirstLoginPwdOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<RpmPaudDocData>(SAMPLE_RPM_PAUD);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      const email = user.email?.toLowerCase().trim() || '';
      if (email === 'pakhusnulid@gmail.com') return;

      const skipKey = `kalandra_pwd_skipped_${email}`;
      if (sessionStorage.getItem(skipKey) === 'true') return;

      const metaFlag = (user.user_metadata as any)?.needs_password_change;
      const localFlag = localStorage.getItem(`kalandra_pwd_change_needed_${email}`) === 'true';

      if (metaFlag === true || localFlag) {
        setIsFirstLoginPwdOpen(true);
      }
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTabChange = (tab: 'wizard' | 'preview' | 'history' | 'admin') => {
    if (tab === 'admin') {
      navigate('/admin');
    } else {
      setActiveTab(tab);
    }
  };

  const handleDocumentGenerated = async (newDoc: RpmPaudDocData) => {
    setCurrentDoc(newDoc);
    setActiveTab('preview');
    await saveDocToStorage(newDoc, '✨ Dokumen RPM 1 Minggu berhasil disusun dan disimpan di Riwayat!');
  };

  const saveDocToStorage = async (docToSave: RpmPaudDocData, customSuccessMsg?: string) => {
    setIsSaving(true);
    try {
      const info = docToSave.informasi_umum || {};
      const docTitle = `RPM Minggu ${info.minggu_ke || '1'}: ${info.topik_subtopik || 'Tema PAUD'}`;
      const docId = `rpm-${Date.now()}`;

      const newEntry = {
        id: docId,
        title: docTitle,
        topik: info.topik_subtopik || 'Tema PAUD',
        jenjang: info.jenjang_kelas || 'Kelompok A',
        mingguKe: info.minggu_ke || '1',
        createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        data: docToSave,
      };

      const existing = localStorage.getItem('kalandra_saved_rpm_docs');
      const docs = existing ? JSON.parse(existing) : [];
      const updated = [newEntry, ...docs.filter((d: any) => d.title !== newEntry.title)];
      const historyLimit = isPro ? 25 : 5;
      localStorage.setItem('kalandra_saved_rpm_docs', JSON.stringify(updated.slice(0, historyLimit)));

      if (user?.id) {
        const { error: dbError } = await supabase.from('generated_documents').insert({
          user_id: user.id,
          school_id: profile?.school_id || null,
          title: docTitle,
          jenjang_kelas: info.jenjang_kelas || 'Kelompok A (4-5 Tahun)',
          semester: info.semester || '1',
          minggu_ke: info.minggu_ke || '1',
          bulan: info.bulan || '',
          topik_subtopik: info.topik_subtopik || 'Tema PAUD',
          dpl_selected: docToSave.identifikasi?.dimensi_profil_lulusan_terpilih || [],
          used_model: 'gemini-3.6-flash',
          document_json: docToSave,
          is_starred: false,
        });

        if (dbError) {
          console.warn('[saveDocToStorage] Supabase save warning:', dbError.message);
        }
      }

      showToast(customSuccessMsg || '✅ Draf dokumen berhasil disimpan ke Riwayat!');
    } catch (e) {
      console.error('Save error:', e);
      showToast('⚠️ Gagal menyimpan draf dokumen.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FB] text-[#2A1532] selection:bg-[#522D60] selection:text-white">
      {/* Topbar */}
      <Topbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenAuth={() => navigate('/login')}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onGoToLanding={() => navigate('/')}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#2A1532] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-[#522D60] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'wizard' && (
          <RpmWizard
            onDocumentGenerated={handleDocumentGenerated}
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
          />
        )}

        {activeTab === 'preview' && (
          <LiveTablePreview
            data={currentDoc}
            onUpdateData={(updated) => setCurrentDoc(updated)}
            onOpenExportModal={() => {
              setExportDocType('rpm');
              setIsExportModalOpen(true);
            }}
            onOpenExportLampiran={() => {
              setExportDocType('lampiran');
              setIsExportModalOpen(true);
            }}
            onSaveDocument={() => saveDocToStorage(currentDoc)}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'history' && (
          <DocumentHistory
            onSelectDoc={(selected) => {
              setCurrentDoc(selected);
              setActiveTab('preview');
            }}
            onOpenExportModalWithData={(docData) => {
              setCurrentDoc(docData);
              setExportDocType('rpm');
              setIsExportModalOpen(true);
            }}
            onNewDocClick={() => setActiveTab('wizard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#EFE6F2] py-6 text-xs text-[#74607B] text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-[#2A1532]">
            Kalandra — Generator Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
          </p>
          <p className="text-[#74607B]/80 text-[11px]">
            Platform Perencanaan Pembelajaran TK Fase Fondasi 2025/2026
          </p>
        </div>
      </footer>

      {/* Key Manager Modal */}
      <ApiKeyManagerModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        userId={user?.id}
      />

      {/* Export DOCX Modal */}
      <ExportDocxModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentData={currentDoc}
        schoolName={profile?.school_name}
        initialDocType={exportDocType}
      />

      {/* Profile Guru & Satuan PAUD Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={() => {
          showToast('Profil Guru & Satuan PAUD berhasil diperbarui!');
        }}
      />

      {/* Subscription Pricing Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {/* First-Login Change Temporary Password Modal */}
      <FirstLoginPasswordModal
        isOpen={isFirstLoginPwdOpen}
        onClose={() => setIsFirstLoginPwdOpen(false)}
        userEmail={user?.email}
        userName={profile?.full_name || (user?.user_metadata as any)?.full_name}
        onSuccessToast={showToast}
      />
    </div>
  );
};

/**
 * Route Guard Khusus Superadmin / Pengelola (/admin)
 */
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!loading && user && !isAdmin) {
      logSecurityEvent('ADMIN_UNAUTHORIZED_ACCESS', {
        userId: user.id,
        details: { email: user.email, role: profile?.role, path: location.pathname },
      });
    } else if (!loading && user && isAdmin) {
      logSecurityEvent('ADMIN_ACCESS_ATTEMPT', {
        userId: user.id,
        details: { email: user.email, path: location.pathname },
      });
    }
  }, [loading, user, isAdmin, profile, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7FB] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[#522D60] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-[#74607B]">Memuat otentikasi admin...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7FB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-[#2A1532]">Akses Panel Khusus Admin</h2>
          <p className="text-xs text-[#74607B] leading-relaxed">
            Akun Anda terdaftar dengan peran <strong className="text-[#2A1532] capitalize">{profile?.role || 'guru'}</strong>. Halaman ini hanya dapat diakses oleh Pengelola & Superadmin Kalandra.
          </p>
          <button
            onClick={() => navigate('/app')}
            className="w-full py-2.5 px-4 bg-[#522D60] hover:bg-[#3E2149] text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            Buka Generator RPM
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Root Application Router
 */
export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* 1. Beranda / Landing Page */}
      <Route
        path="/"
        element={
          <LandingPage
            onGoToApp={() => navigate('/app')}
            onGoToAuth={() => navigate('/login')}
            onGoToAdmin={() => navigate('/admin')}
          />
        }
      />

      {/* 2. Halaman Autentikasi (Login / Register) */}
      <Route
        path="/login"
        element={
          <AuthPage
            onSuccess={(targetRole) => {
              if (targetRole === 'admin') {
                navigate('/admin');
              } else {
                navigate('/app');
              }
            }}
            onBackToApp={() => navigate('/')}
          />
        }
      />
      {/* Alias /auth -> /login */}
      <Route path="/auth" element={<Navigate to="/login" replace />} />

      {/* 3. Panel Admin (Khusus Superadmin) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <AdminLayout onBackToApp={() => navigate('/app')} />
          </ProtectedAdminRoute>
        }
      />

      {/* 4. Generator RPM TK Utama */}
      <Route path="/app" element={<GeneratorWorkspace />} />

      {/* Fallback ke Beranda jika URL tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
