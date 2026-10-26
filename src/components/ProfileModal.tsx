import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Building2, 
  User, 
  GraduationCap, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  FileCheck2
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [nip, setNip] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [assignedClass, setAssignedClass] = useState('A (4-5 Tahun)');
  const [principalName, setPrincipalName] = useState('');
  const [principalNip, setPrincipalNip] = useState('');
  const [city, setCity] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setNip(profile.nip || '');
      setSchoolName(profile.school_name || '');
      setAssignedClass(profile.assigned_class || 'A (4-5 Tahun)');
      
      // Load extra local profile data if available (e.g. principal details)
      try {
        const savedMeta = localStorage.getItem(`kalandra_profile_meta_${profile.id}`);
        if (savedMeta) {
          const parsed = JSON.parse(savedMeta);
          setPrincipalName(parsed.principalName || '');
          setPrincipalNip(parsed.principalNip || '');
          setCity(parsed.city || '');
        }
      } catch (e) {}
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // 1. Update Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          nip: nip.trim(),
          assigned_class: assignedClass,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) {
        console.warn('Profile update warning:', error);
      }

      // 2. Also persist school name & signature metadata locally for instant signature reflection
      localStorage.setItem(
        `kalandra_profile_meta_${profile.id}`,
        JSON.stringify({
          schoolName: schoolName.trim(),
          principalName: principalName.trim(),
          principalNip: principalNip.trim(),
          city: city.trim(),
        })
      );

      await refreshProfile();
      if (onProfileUpdated) onProfileUpdated();

      setMessage({
        type: 'success',
        text: 'Profil dan identitas lembaga berhasil diperbarui!',
      });

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Gagal menyimpan profil.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D8C3DD] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE6F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#522D60] text-white flex items-center justify-center">
              <User className="w-5 h-5 text-[#FFD38B]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#2A1532]">
                Profil Guru & Satuan PAUD
              </h3>
              <p className="text-[11px] text-[#74607B]">
                Identitas ini otomatis tercetak pada lembar pengesahan dan tanda tangan dokumen RPM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#74607B] hover:bg-[#FAF3FB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Section 1: Data Guru */}
          <div className="bg-[#FAF3FB] p-3.5 rounded-2xl border border-[#E8D6EB] space-y-3">
            <h4 className="text-xs font-bold text-[#522D60] flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-[#80426E]" /> Data Guru Pengampu
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#2A1532] mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dewi Rahmawati, S.Pd."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#2A1532] mb-1">
                  NIP Guru (Opsional)
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="198906142015032002 / -"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2A1532] mb-1">
                Kelompok Usia yang Diampu
              </label>
              <select
                value={assignedClass}
                onChange={(e) => setAssignedClass(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
              >
                <option value="A (4-5 Tahun)">Kelompok A (4-5 Tahun)</option>
                <option value="B (5-6 Tahun)">Kelompok B (5-6 Tahun)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Data Lembaga & Kepala Sekolah */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-slate-600" /> Lembaga & Kepala Satuan PAUD
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-[#2A1532] mb-1">
                Nama Satuan PAUD / TK *
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="TK NEGERI PEMBINA 01"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#2A1532] mb-1">
                  Nama Kepala Satuan PAUD
                </label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  placeholder="Hj. Siti Rahayu, M.Pd."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#2A1532] mb-1">
                  NIP Kepala Satuan
                </label>
                <input
                  type="text"
                  value={principalNip}
                  onChange={(e) => setPrincipalNip(e.target.value)}
                  placeholder="197508122002122001 / -"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2A1532] mb-1">
                Kota / Kabupaten Dokumen
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta Selatan"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#522D60] bg-white text-[#2A1532]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE6F2]">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-bold text-[#74607B] hover:bg-[#FAF3FB]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-4 rounded-xl text-xs font-extrabold text-white bg-[#522D60] hover:bg-[#693774] shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Simpan Profil</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
