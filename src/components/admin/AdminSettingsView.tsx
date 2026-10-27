import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Cpu, 
  Code2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Zap,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { SYSTEM_INSTRUCTION_RPM_PAUD, GEMINI_MODEL_CHAIN } from '../../lib/gemini-rpm-engine';

export interface DemoKeyRecord {
  id: string;
  api_key: string;
  label: string;
  is_active: boolean;
  created_at: string;
}

const DEFAULT_DEMO_KEYS: DemoKeyRecord[] = [
  {
    id: 'k-1',
    api_key: 'AIzaSyA1234567890abcdefghijklmnopqrstuvw',
    label: 'Primary System Gemini Flash Pool #1',
    is_active: true,
    created_at: '2026-01-15',
  },
  {
    id: 'k-2',
    api_key: 'AIzaSyB0987654321zyxwvutsrqponmlkjihgfed',
    label: 'Backup Failover Pool #2',
    is_active: true,
    created_at: '2026-02-01',
  },
];

const LOCAL_STORAGE_KEY = 'kalandra_system_demo_keys';

export const AdminSettingsView: React.FC = () => {
  const [demoKeys, setDemoKeys] = useState<DemoKeyRecord[]>(() => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}
    return DEFAULT_DEMO_KEYS;
  });
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showKeyIndex, setShowKeyIndex] = useState<{ [id: string]: boolean }>({});
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const syncAndSave = (keys: DemoKeyRecord[]) => {
    setDemoKeys(keys);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(keys));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
  };

  const fetchKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: DemoKeyRecord[] = data.map((d: any) => ({
          id: d.id,
          api_key: d.api_key,
          label: d.label || 'Gemini Key Pool',
          is_active: d.is_active ?? true,
          created_at: d.created_at ? d.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
        }));
        syncAndSave(mapped);
      } else {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setDemoKeys(parsed);
            }
          } catch (_) {}
        }
      }
    } catch (e) {
      console.warn('Demo keys fetch warning:', e);
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDemoKeys(parsed);
          }
        } catch (_) {}
      }
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = newKey.trim();
    if (!cleanKey) return;

    if (demoKeys.some(k => k.api_key === cleanKey)) {
      showToast('⚠️ Kunci API ini sudah terdaftar dalam pool.');
      return;
    }

    const tempId = `k-${Date.now()}`;
    const newRecord: DemoKeyRecord = {
      id: tempId,
      api_key: cleanKey,
      label: newLabel.trim() || `Gemini Pool #${demoKeys.length + 1}`,
      is_active: true,
      created_at: new Date().toISOString().slice(0, 10),
    };

    const updated = [newRecord, ...demoKeys];
    syncAndSave(updated);
    setNewKey('');
    setNewLabel('');
    showToast('Kunci API cadangan sistem berhasil ditambahkan.');

    // Asynchronously sync to Supabase demo_api_keys table
    try {
      const { data, error } = await supabase.from('demo_api_keys').insert({
        api_key: newRecord.api_key,
        label: newRecord.label,
        is_active: newRecord.is_active,
      }).select().single();

      if (!error && data) {
        const synced = updated.map(k => k.id === tempId ? { ...k, id: data.id } : k);
        syncAndSave(synced);
      }
    } catch (err) {
      console.warn('demo_api_keys remote insert warning:', err);
    }
  };

  const handleToggleKeyStatus = async (id: string) => {
    const target = demoKeys.find(k => k.id === id);
    if (!target) return;
    const nextStatus = !target.is_active;

    const updated = demoKeys.map((k) =>
      k.id === id ? { ...k, is_active: nextStatus } : k
    );
    syncAndSave(updated);

    try {
      await supabase.from('demo_api_keys').update({ is_active: nextStatus }).eq('id', id);
    } catch (_) {}

    showToast(`Status kunci API berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}.`);
  };

  const handleDeleteKey = async (id: string) => {
    if (confirm('Hapus kunci API ini dari pool cadangan?')) {
      const updated = demoKeys.filter((k) => k.id !== id);
      syncAndSave(updated);

      try {
        await supabase.from('demo_api_keys').delete().eq('id', id);
      } catch (_) {}

      showToast('Kunci API telah dihapus dari pool.');
    }
  };

  const handleTestKey = async (id: string, apiKey: string) => {
    setIsTesting(id);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (res.ok) {
        showToast('✅ Kunci API Valid & Aktif (Koneksi Google Gemini Berhasil)!');
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${res.status}`;
        showToast(`❌ Uji Gagal: ${errMsg.slice(0, 60)}`);
      }
    } catch (err: any) {
      showToast(`⚠️ Gagal menghubungi server Google: ${err.message || 'Network error'}`);
    } finally {
      setIsTesting(null);
    }
  };

  const toggleShowKey = (id: string) => {
    setShowKeyIndex((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (keyStr: string) => {
    if (keyStr.length <= 10) return '••••••••••••';
    return keyStr.slice(0, 8) + '••••••••••••' + keyStr.slice(-4);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(SYSTEM_INSTRUCTION_RPM_PAUD);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2A1532] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-[#522D60] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-2 border-b border-[#EFE6F2]">
        <h1 className="text-2xl font-black text-[#2A1532] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#80426E]" /> Pengaturan Sistem & API Pool
        </h1>
        <p className="text-xs text-[#74607B] mt-0.5">
          Kelola kunci Google Gemini API cadangan sistem, model fallback, dan prompt standar kurikulum 2025/2026
        </p>
      </div>

      {/* Section 1: System API Keys Pool (Adapted from Settings.tsx of ModulAjar Online) */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE6F2] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-[#2A1532] flex items-center gap-2">
              <Key className="w-5 h-5 text-[#522D60]" /> Pool Kunci API Gemini Cadangan Sistem
            </h3>
            <p className="text-xs text-[#74607B] mt-1">
              Kunci ini digunakan secara otomatis untuk guru baru atau mode evaluasi jika pengguna belum memasukkan kunci BYOK pribadi
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {demoKeys.filter((k) => k.is_active).length} Kunci Aktif
          </span>
        </div>

        {/* Form Tambah Key */}
        <form onSubmit={handleAddKey} className="p-4 bg-[#FAF3FB] rounded-2xl border border-[#E8D6EB] space-y-3">
          <span className="text-xs font-bold text-[#522D60] uppercase tracking-wider block">
            + Tambah Kunci API Baru ke Pool Sistem
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Masukkan API Key (AIzaSy...)"
                className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] bg-white text-[#2A1532] focus:outline-none focus:ring-2 focus:ring-[#80426E]"
              />
            </div>
            <div>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label Kunci (Opsional)"
                className="w-full text-xs p-2.5 rounded-xl border border-[#D8C3DD] bg-white text-[#2A1532] focus:outline-none focus:ring-2 focus:ring-[#80426E]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Simpan ke Pool
            </button>
          </div>
        </form>

        {/* List of Keys */}
        <div className="space-y-2.5">
          {demoKeys.map((k) => {
            const isShown = showKeyIndex[k.id];
            return (
              <div
                key={k.id}
                className="p-3.5 rounded-2xl border border-[#EFE6F2] hover:border-[#D8C3DD] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2A1532]">{k.label}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        k.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-red-50 text-red-700 border-red-300'
                      }`}
                    >
                      {k.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-[#74607B] mt-1 flex items-center gap-2">
                    <span>{isShown ? k.api_key : maskKey(k.api_key)}</span>
                    <button
                      type="button"
                      onClick={() => toggleShowKey(k.id)}
                      className="text-[#80426E] hover:underline"
                    >
                      {isShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleTestKey(k.id, k.api_key)}
                    disabled={isTesting === k.id}
                    className="py-1.5 px-3 rounded-lg border border-[#D8C3DD] text-[11px] font-bold text-[#522D60] hover:bg-[#FAF3FB] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting === k.id ? 'animate-spin' : ''}`} />
                    <span>Uji Koneksi</span>
                  </button>
                  <button
                    onClick={() => handleToggleKeyStatus(k.id)}
                    className="py-1.5 px-3 rounded-lg border border-slate-200 text-[11px] font-bold text-[#74607B] hover:bg-slate-50 transition-colors"
                  >
                    {k.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    onClick={() => handleDeleteKey(k.id)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Model Fallback Chain & Prompt Standard */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE6F2] shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-[#2A1532] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#80426E]" /> Urutan Fallback Model Google Gemini (Resilience Chain)
          </h3>
          <p className="text-xs text-[#74607B] mt-1">
            Jika model tingkat atas mengalami limit 429 atau maintenance, sistem secara otomatis beralih ke model berikutnya tanpa membatalkan proses guru
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {GEMINI_MODEL_CHAIN.map((model, idx) => (
            <div
              key={model}
              className={`p-4 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-[#FAF3FB] border-[#522D60] ring-1 ring-[#522D60]'
                  : 'bg-white border-[#EFE6F2]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#74607B]">
                  Tingkat #{idx + 1}
                </span>
                {idx === 0 && (
                  <span className="text-[10px] font-bold bg-[#522D60] text-white px-2 py-0.5 rounded-full">
                    Prioritas Utama
                  </span>
                )}
              </div>
              <div className="font-mono font-bold text-xs text-[#2A1532] truncate">{model}</div>
              <p className="text-[10px] text-[#74607B] mt-1">
                {idx === 0
                  ? 'Kecepatan & Nalar Tertinggi'
                  : idx === 1
                  ? 'Fallback Pertama (Stabil)'
                  : idx === 2
                  ? 'Fallback Ringan'
                  : 'Cadangan Darurat Lite'}
              </p>
            </div>
          ))}
        </div>

        {/* Master Prompt System Instruction */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-bold text-[#2A1532] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#522D60]" /> Master System Instruction (8 DPL & Deep Learning 2025/2026)
              </h4>
              <p className="text-[11px] text-[#74607B]">
                Instruksi acuan anti-halusinasi yang disuntikkan ke seluruh pemanggilan AI
              </p>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="py-1 px-3 rounded-lg border border-[#D8C3DD] text-[11px] font-bold text-[#522D60] hover:bg-[#FAF3FB] transition-colors flex items-center gap-1"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Tersalin!' : 'Salin Instruksi'}</span>
            </button>
          </div>

          <pre className="text-[11px] font-mono p-4 rounded-2xl bg-slate-50 border border-[#D8C3DD] text-[#2A1532] h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {SYSTEM_INSTRUCTION_RPM_PAUD}
          </pre>
        </div>
      </div>
    </div>
  );
};
