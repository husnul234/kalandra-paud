import React, { useState } from 'react';
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
import { supabase } from './lib/supabaseClient';
import { SAMPLE_RPM_PAUD } from './data/default_sample_rpm';
import { RpmPaudDocData } from './lib/docx-engine/docx-paud-builder';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export type PageView = 'landing' | 'app' | 'auth' | 'admin';

const MainLayout: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  
  // Default first page is the Landing Page
  const [pageView, setPageView] = useState<PageView>('landing');
  const [activeTab, setActiveTab] = useState<'wizard' | 'preview' | 'history' | 'admin'>('wizard');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<RpmPaudDocData>(SAMPLE_RPM_PAUD);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. LANDING PAGE VIEW (Default on site visit)
  if (pageView === 'landing') {
    return (
      <LandingPage
        onGoToApp={() => setPageView('app')}
        onGoToAuth={() => setPageView('auth')}
        onGoToAdmin={() => setPageView('admin')}
      />
    );
  }

  // 2. AUTHENTICATION PAGE (Login / Register / Whitelist Access)
  if (pageView === 'auth') {
    return (
      <AuthPage
        onSuccess={(targetRole) => {
          if (targetRole === 'admin') {
            setPageView('admin');
          } else {
            setPageView('app');
          }
        }}
        onBackToApp={() => setPageView('landing')}
      />
    );
  }

  // 3. ADMIN PANEL (Multi-menu with collapsible sidebar)
  if (pageView === 'admin' && isAdmin) {
    return (
      <AdminLayout onBackToApp={() => setPageView('app')} />
    );
  }

  // Handle tab switching in app
  const handleTabChange = (tab: 'wizard' | 'preview' | 'history' | 'admin') => {
    if (tab === 'admin') {
      setPageView('admin');
    } else {
      setActiveTab(tab);
    }
  };

  // When wizard completes AI generation
  const handleDocumentGenerated = async (newDoc: RpmPaudDocData) => {
    setCurrentDoc(newDoc);
    setActiveTab('preview');
    await saveDocToStorage(newDoc, '✨ Dokumen RPM 1 Minggu berhasil disusun dan disimpan di Riwayat!');
  };

  // Save document to history (Supabase DB + LocalStorage Hybrid)
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

      // 1. Save to LocalStorage immediately
      const existing = localStorage.getItem('kalandra_saved_rpm_docs');
      const docs = existing ? JSON.parse(existing) : [];
      const updated = [newEntry, ...docs.filter((d: any) => d.title !== newEntry.title)];
      localStorage.setItem('kalandra_saved_rpm_docs', JSON.stringify(updated.slice(0, 25)));

      // 2. If logged in, save to Supabase generated_documents table
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

  // 4. MAIN GENERATOR APPLICATION
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FB] text-[#2A1532] selection:bg-[#522D60] selection:text-white">
      {/* Topbar */}
      <Topbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenAuth={() => setPageView('auth')}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onGoToLanding={() => setPageView('landing')}
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
            onOpenExportModal={() => setIsExportModalOpen(true)}
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
            Kalandra PAUD — Generator Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
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
      />

      {/* Profile Guru & Satuan PAUD Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={() => {
          showToast('Profil Guru & Satuan PAUD berhasil diperbarui!');
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
