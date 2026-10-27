import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Sparkles, 
  Check, 
  Copy, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { adminCreateUser } from '../../lib/supabaseAdmin';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedMember {
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  tier: 'standar' | 'pro';
  duration: '1_bulan' | '6_bulan' | '1_tahun';
  generatedPassword: string;
  status?: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

const generateMemorablePassword = () => {
  const words = ['Kalandra', 'Pendidik', 'GuruTK', 'Bintang', 'Cerdas', 'Pelangi', 'Merdeka', 'Hebat'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(100 + Math.random() * 900);
  const syms = ['#', '!', '$', '@'];
  const sym = syms[Math.floor(Math.random() * syms.length)];
  return `${word}${sym}${num}`;
};

export const BulkAddMembersModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [rawText, setRawText] = useState('');
  const [parsedList, setParsedList] = useState<ParsedMember[]>([]);
  const [step, setStep] = useState<'input' | 'preview' | 'completed'>('input');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const handleFillSample = () => {
    setRawText(
`Dewi Rahmawati, dewi.rahma@gmail.com, 081234567890, TK Negeri Pembina 01, Pro, 1_tahun
Siti Aminah, siti.aminah@gmail.com, 085678901234, TK Aisyiyah Bustanul Athfal, Standar, 6_bulan
Nur Hidayati, nur.hidayati@gmail.com, 087890123456, TK Pertiwi Mandiri, Pro, 1_bulan`
    );
  };

  const handleParse = () => {
    const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const parsed: ParsedMember[] = [];

    lines.forEach((line) => {
      // Split by comma or tab
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      if (parts.length >= 2) {
        const fullName = parts[0]?.trim() || '';
        const email = parts[1]?.trim().toLowerCase() || '';
        const phone = parts[2]?.trim() || '';
        const schoolName = parts[3]?.trim() || 'Satuan PAUD';
        
        let tier: 'standar' | 'pro' = 'pro';
        if (parts[4]?.toLowerCase().includes('standar')) tier = 'standar';

        let duration: '1_bulan' | '6_bulan' | '1_tahun' = '1_tahun';
        const rawDur = parts[5]?.toLowerCase() || '';
        if (rawDur.includes('1_bulan') || rawDur.includes('1 bulan') || rawDur.includes('sebulan')) duration = '1_bulan';
        else if (rawDur.includes('6_bulan') || rawDur.includes('6 bulan') || rawDur.includes('setengah')) duration = '6_bulan';

        if (email.includes('@')) {
          parsed.push({
            fullName,
            email,
            phone,
            schoolName,
            tier,
            duration,
            generatedPassword: generateMemorablePassword(),
            status: 'pending',
          });
        }
      }
    });

    if (parsed.length === 0) {
      alert('Format teks tidak valid. Masukkan minimal Nama dan Email yang dipisahkan koma.');
      return;
    }

    setParsedList(parsed);
    setStep('preview');
  };

  const handleExecuteBulk = async () => {
    setIsProcessing(true);
    const updated = [...parsedList];

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      try {
        await adminCreateUser({
          email: item.email,
          password: item.generatedPassword,
          full_name: item.fullName,
          role: 'guru',
          tier: item.tier,
          duration: item.duration,
          school_name: item.schoolName,
          phone: item.phone,
        });
        updated[i].status = 'success';
      } catch (err: any) {
        console.error(`Error registering ${item.email}:`, err);
        updated[i].status = 'error';
        updated[i].errorMessage = err.message || 'Gagal mendaftar';
      }
      setParsedList([...updated]);
    }

    setIsProcessing(false);
    setStep('completed');
    onSuccess();
  };

  const handleSendWa = (m: ParsedMember) => {
    const durLabel = m.duration === '1_bulan' ? '1 Bulan' : m.duration === '6_bulan' ? '6 Bulan' : '1 Tahun';
    const cleanPhone = m.phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    const msg = `Halo Ibu/Bapak *${m.fullName}*,\n\n` +
      `Akun Anda di *KALANDRA (Platform Perencanaan Pembelajaran TK Fase Fondasi)* telah aktif!\n\n` +
      `• *Email Login:* ${m.email}\n` +
      `• *Kata Sandi:* ${m.generatedPassword}\n` +
      `• *Paket:* ${m.tier.toUpperCase()} (${durLabel})\n` +
      `• *Tautan Akses:* https://kalandra-paud.vercel.app/login\n\n` +
      `Silakan login dan mulai menyusun RPM mingguan berstandar kurikulum terbaru. Terima kasih!`;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopyAllCredentials = () => {
    const text = parsedList.map((m, i) => 
      `${i + 1}. ${m.fullName} | ${m.email} | Sandi: ${m.generatedPassword} | ${m.tier.toUpperCase()} (${m.duration}) | WA: ${m.phone}`
    ).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF3FB] text-[#522D60] flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-[#522D60]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#2A1532]">Tambah Member / Guru Massal</h3>
              <p className="text-xs text-[#74607B]">
                Daftarkan banyak guru sekaligus dengan auto-generate password dan pengiriman WhatsApp otomatis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: INPUT TEXTAREA */}
        {step === 'input' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Tempelkan Data Guru (Format: Nama, Email, No WA, Asal Sekolah, Tier, Durasi)
              </label>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-xs font-bold text-[#522D60] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Isi Contoh Format
              </button>
            </div>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Contoh:&#10;Dewi Rahmawati, dewi@gmail.com, 081234567890, TK Pembina 01, Pro, 1_tahun&#10;Siti Aminah, siti@gmail.com, 085678901234, TK Aisyiyah, Standar, 6_bulan"
              className="w-full p-4 text-xs font-mono rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#522D60] focus:outline-none bg-slate-50 leading-relaxed"
            />

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tips:</strong> Anda bisa langsung copy-paste baris kolom dari Microsoft Excel atau Google Sheets. Kolom yang didukung: Nama, Email, No WA, Asal PAUD, Tier (Standar/Pro), Durasi (1_bulan/6_bulan/1_tahun).
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleParse}
                disabled={!rawText.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-[#522D60] hover:bg-[#693774] rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                Lanjut ke Pratinjau & Validasi →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW & VERIFICATION */}
        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Pratinjau {parsedList.length} Guru yang Akan Didaftarkan:
              </span>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-xs text-slate-500 hover:underline"
              >
                ← Edit Teks Kembali
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF3FB] text-[#2A1532] font-bold border-b border-[#E8D6EB]">
                  <tr>
                    <th className="p-3">Nama Guru</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Kata Sandi Baru</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3">Durasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedList.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{m.fullName}</td>
                      <td className="p-3 text-slate-600">{m.email}</td>
                      <td className="p-3 font-mono font-bold text-[#522D60]">{m.generatedPassword}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.tier === 'pro' ? 'bg-[#522D60] text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {m.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{m.duration.replace('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Sandi acak yang aman telah digenerate otomatis untuk setiap pengguna.
              </span>
              <button
                type="button"
                onClick={handleExecuteBulk}
                disabled={isProcessing}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Eksekusi Daftarkan Semua ({parsedList.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: COMPLETED RESULTS & SEND CREDENTIALS */}
        {step === 'completed' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950">Pendaftaran Massal Selesai!</div>
                  <div className="text-emerald-800">
                    Akun telah aktif di sistem. Anda dapat langsung mengirimkan kredensial login via WhatsApp ke masing-masing guru.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAllCredentials}
                className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Tersalin!' : 'Salin Semua Akun'}</span>
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100">
              {parsedList.map((m, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50 gap-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{m.fullName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.2 rounded-full font-bold">
                        {m.tier.toUpperCase()} ({m.duration})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {m.email} • Sandi: <strong className="text-[#522D60]">{m.generatedPassword}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.status === 'success' ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                        {m.errorMessage || 'Gagal'}
                      </span>
                    )}

                    {m.phone && (
                      <button
                        type="button"
                        onClick={() => handleSendWa(m)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Kirim Kredensial via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#522D60] hover:bg-[#693774] text-white rounded-xl text-xs font-bold"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
