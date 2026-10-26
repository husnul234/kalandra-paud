import React, { useState } from 'react';
import { useGeminiKeys } from '../hooks/useGeminiKeys';
import { 
  KeyRound, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Activity, 
  Loader2 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const ApiKeyManagerModal: React.FC<Props> = ({ isOpen, onClose, userId }) => {
  const {
    keys,
    activeKeys,
    addKey,
    toggleKey,
    deleteKey,
    testKey,
    testingKeyId,
    testResult,
  } = useGeminiKeys(userId);

  const [inputKey, setInputKey] = useState('');
  const [inputLabel, setInputLabel] = useState('');
  const [addError, setAddError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!inputKey.trim()) {
      setAddError('Kunci API tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    const res = await addKey(inputKey, inputLabel);
    setIsSubmitting(false);

    if (res.success) {
      setInputKey('');
      setInputLabel('');
    } else {
      setAddError(res.error || 'Gagal menambahkan kunci.');
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return `${key.slice(0, 6)}••••••••${key.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Container: Bottom-sheet on mobile (<768px), Centered Modal on Desktop */}
      <div 
        className="w-full md:max-w-xl bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] transition-transform"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Drag Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-300"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#FAF3FB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#522D60] text-white flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5 text-[#FFD38B]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2A1532]">Kelola API Key Gemini (BYOK)</h2>
              <p className="text-xs text-[#74607B]">Multi-key auto-failover saat kuota 429 tercapai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Info Banner */}
          <div className="p-4 rounded-2xl bg-[#FAF3FB] border border-[#E8D6EB] text-[#2A1532] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#80426E] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-[#522D60] mb-0.5">Keamanan Terisolasi (Row Level Security)</p>
              Kunci API disimpan dengan isolasi kepemilikan mutlak di database Anda. Anda disarankan mendaftarkan minimal 2 kunci untuk rotasi otomatis tanpa jeda saat limit kuota gratis habis.
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[#80426E] hover:text-[#522D60] font-bold underline"
              >
                Dapatkan API Key Gratis di Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Add Key Form */}
          <form onSubmit={handleAddKey} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#522D60]" /> Tambah Kunci Gemini Baru
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-2">
                <input
                  type="password"
                  placeholder="Paste AIzaSy... (API Key Gemini)"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#80426E] font-mono text-slate-800"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Label (opsional)"
                  value={inputLabel}
                  onChange={(e) => setInputLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#80426E] text-slate-800"
                />
              </div>
            </div>

            {addError && (
              <div className="text-xs text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {addError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#522D60] hover:bg-[#693774] text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Simpan Kunci ke Pool
            </button>
          </form>

          {/* Active Keys List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Daftar Kunci Terdaftar ({keys.length})
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {activeKeys.length} Kunci Aktif
              </span>
            </div>

            {keys.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                <KeyRound className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Belum ada API Key Gemini yang disimpan.</p>
                <p className="text-xs text-slate-400 mt-1">Masukkan API key Anda di atas untuk memulai pembuatan RPM.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {keys.map((k, index) => {
                  const isTesting = testingKeyId === k.id;
                  const res = testResult?.id === k.id ? testResult : null;

                  return (
                    <div
                      key={k.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        k.is_active ? 'border-slate-300 bg-white shadow-xs' : 'border-slate-200 bg-slate-50/70 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-800 truncate">
                              {k.label || `Kunci #${index + 1}`}
                            </span>
                            {k.is_active && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-md">
                                AKTIF
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-500 mt-0.5">
                            {maskKey(k.api_key)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => testKey(k.id)}
                            disabled={isTesting}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1 transition-colors"
                            title="Uji coba koneksi ke Gemini"
                          >
                            {isTesting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                            ) : (
                              <Activity className="w-3.5 h-3.5 text-blue-600" />
                            )}
                            <span className="hidden sm:inline">Uji</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleKey(k.id)}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                              k.is_active
                                ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {k.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteKey(k.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Kunci"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Live Test Feedback */}
                      {res && (
                        <div
                          className={`mt-2.5 p-2 rounded-lg text-xs flex items-center gap-1.5 ${
                            res.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {res.success ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          )}
                          <span>{res.message}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Pool: <strong className="text-slate-800">{activeKeys.length}</strong> siap digunakan
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
