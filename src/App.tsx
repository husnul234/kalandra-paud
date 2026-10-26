import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Topbar } from './components/Topbar';
import { RpmWizard } from './components/RpmWizard';
import { LiveTablePreview } from './components/LiveTablePreview';
import { DocumentHistory } from './components/DocumentHistory';
import { AdminConsole } from './components/AdminConsole';
import { ApiKeyManagerModal } from './components/ApiKeyManagerModal';
import { ExportDocxModal } from './components/ExportDocxModal';
import { SAMPLE_RPM_PAUD } from './data/default_sample_rpm';
import { RpmPaudDocData } from './lib/docx-engine/docx-paud-builder';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'wizard' | 'preview' | 'history' | 'admin'>('wizard');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<RpmPaudDocData>(SAMPLE_RPM_PAUD);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // When wizard completes AI generation
  const handleDocumentGenerated = (newDoc: RpmPaudDocData) => {
    setCurrentDoc(newDoc);
    setActiveTab('preview');
    saveDocToStorage(newDoc);
    showToast('✨ Dokumen RPM 1 Minggu berhasil disusun dan siap dicetak!');
  };

  // Save document to history
  const saveDocToStorage = (docToSave: RpmPaudDocData) => {
    setIsSaving(true);
    try {
      const existing = localStorage.getItem('kalandra_saved_rpm_docs');
      const docs = existing ? JSON.parse(existing) : [];

      const info = docToSave.informasi_umum || {};
      const newEntry = {
        id: `rpm-${Date.now()}`,
        title: `RPM Minggu ${info.minggu_ke || '1'}: ${info.topik_subtopik || 'Tema PAUD'}`,
        topik: info.topik_subtopik || 'Tema PAUD',
        jenjang: info.jenjang_kelas || 'Kelompok A',
        mingguKe: info.minggu_ke || '1',
        createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        data: docToSave,
      };

      const updated = [newEntry, ...docs.filter((d: any) => d.title !== newEntry.title)];
      localStorage.setItem('kalandra_saved_rpm_docs', JSON.stringify(updated.slice(0, 20)));
      showToast('Draf dokumen tersimpan di Riwayat.');
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Topbar */}
      <Topbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 animate-bounce">
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

        {activeTab === 'admin' && <AdminConsole />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            Kalandra PAUD — Generator Perencanaan Pembelajaran Mendalam (RPM) TK Fase Fondasi
          </p>
          <p>
            Kepatuhan 100% Permendikdasmen No. 10/2025, 12/2025, 1/2026, Keputusan BSKAP No. 046/H/KR/2025 • BYOK Gemini Engine • Ekspor OOXML Word
          </p>
        </div>
      </footer>

      {/* Key Manager Modal */}
      <ApiKeyManagerModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        userId={profile?.id}
      />

      {/* Export DOCX Modal */}
      <ExportDocxModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentData={currentDoc}
        schoolName={profile?.school_name}
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
