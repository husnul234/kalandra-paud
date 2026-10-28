import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  SlidersHorizontal, 
  FileEdit, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { RpmPaudDocData } from '../../lib/docx-engine/docx-paud-builder';
import { executePartitionedDocumentEdit } from '../../lib/gemini-rpm-engine';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentData: RpmPaudDocData;
  onApplyRevision: (revisedDoc: RpmPaudDocData, revisionSummary: string) => void;
  onOpenUpgradeModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  proposal?: {
    sectionKey: string;
    sectionTitle: string;
    summary: string;
    explanation: string;
    oldContent: any;
    newContent: any;
    applied?: boolean;
  };
}

const SECTIONS_LIST = [
  { key: 'pengalaman_belajar', title: 'Kegiatan Bermain Harian (Hari 1-6 & Loose Parts)' },
  { key: 'asesmen_pembelajaran', title: 'Instrumen Asesmen (IKTP SOLO, Rubrik & Observasi)' },
  { key: 'tujuan_pembelajaran', title: 'Tujuan Pembelajaran & Subelemen CP' },
  { key: 'informasi_umum', title: 'Informasi Umum & Identifikasi Peserta Didik' },
];

export const DocumentRevisionChatDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  documentData,
  onApplyRevision,
  onOpenUpgradeModal,
}) => {
  const { isPro, isAdmin } = useAuth();
  const canUseChat = isPro || isAdmin;

  // Mode: 'plan' (propose diff first) vs 'action' (direct apply)
  const [chatMode, setChatMode] = useState<'plan' | 'action'>('plan');
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>('pengalaman_belajar');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ticketsRemaining, setTicketsRemaining] = useState<number>(10);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: 'Baru saja',
      text: 'Halo Ibu/Bapak Guru! Saya Asisten Revisi AI Kalandra. Beritahukan bagian mana yang ingin diperbaiki, misalnya: "Ganti kegiatan Hari ke-3 dengan permainan sensorik tepung dan sendok kayu" atau "Perjelas deskriptor rubrik asesmen BSB".',
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isProcessing) return;

    if (!canUseChat) {
      if (onOpenUpgradeModal) onOpenUpgradeModal();
      return;
    }

    if (ticketsRemaining <= 0) {
      alert('Kuota 10 tiket revisi untuk dokumen ini telah habis. Silakan gunakan Edit Cepat Inline untuk penyesuaian manual.');
      return;
    }

    const userText = inputPrompt.trim();
    setInputPrompt('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // Determine targeted content from document
      const sectionInfo = SECTIONS_LIST.find((s) => s.key === selectedSectionKey) || SECTIONS_LIST[0];
      let currentSectionContent: any = null;

      if (selectedSectionKey === 'pengalaman_belajar') {
        currentSectionContent = documentData.pengalaman_belajar;
      } else if (selectedSectionKey === 'asesmen_pembelajaran') {
        currentSectionContent = {
          iktp_bergradasi: documentData.iktp_bergradasi,
          rubrik_asesmen: documentData.rubrik_asesmen,
          asesmen_awal: documentData.asesmen_pembelajaran?.awal,
          asesmen_akhir: documentData.asesmen_pembelajaran?.akhir,
        };
      } else if (selectedSectionKey === 'tujuan_pembelajaran') {
        currentSectionContent = {
          tujuan_pembelajaran: documentData.desain_pembelajaran?.tujuan_pembelajaran,
          capaian_pembelajaran: documentData.desain_pembelajaran?.capaian_pembelajaran,
        };
      } else {
        currentSectionContent = {
          informasi_umum: documentData.informasi_umum,
          identifikasi: documentData.identifikasi,
        };
      }

      const res = await executePartitionedDocumentEdit([], {
        sectionTitle: sectionInfo.title,
        currentContent: currentSectionContent,
        userInstruction: userText,
        topikSubtopik: documentData.informasi_umum?.topik_subtopik || 'Topik PAUD',
        jenjangKelas: documentData.informasi_umum?.jenjang_kelas || 'Kelompok A',
      });

      // Deduct ticket
      setTicketsRemaining((prev) => Math.max(0, prev - 1));

      // Build updated document copy
      const updatedDoc: RpmPaudDocData = JSON.parse(JSON.stringify(documentData));
      if (selectedSectionKey === 'pengalaman_belajar') {
        updatedDoc.pengalaman_belajar = res.revisedContent;
      } else if (selectedSectionKey === 'asesmen_pembelajaran') {
        if (res.revisedContent.iktp_bergradasi) {
          updatedDoc.iktp_bergradasi = res.revisedContent.iktp_bergradasi;
        }
        if (res.revisedContent.rubrik_asesmen) {
          updatedDoc.rubrik_asesmen = res.revisedContent.rubrik_asesmen;
        }
        if (res.revisedContent.asesmen_akhir && updatedDoc.asesmen_pembelajaran) {
          updatedDoc.asesmen_pembelajaran.akhir = res.revisedContent.asesmen_akhir;
        }
      } else if (selectedSectionKey === 'tujuan_pembelajaran') {
        if (res.revisedContent.tujuan_pembelajaran && updatedDoc.desain_pembelajaran) {
          updatedDoc.desain_pembelajaran.tujuan_pembelajaran = res.revisedContent.tujuan_pembelajaran;
        }
        if (res.revisedContent.capaian_pembelajaran && updatedDoc.desain_pembelajaran) {
          updatedDoc.desain_pembelajaran.capaian_pembelajaran = res.revisedContent.capaian_pembelajaran;
        }
      } else {
        if (res.revisedContent.informasi_umum) {
          updatedDoc.informasi_umum = { ...updatedDoc.informasi_umum, ...res.revisedContent.informasi_umum };
        }
      }

      if (chatMode === 'action') {
        // Immediate Apply
        onApplyRevision(updatedDoc, res.summary);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: `✅ **Perubahan Langsung Diterapkan ke Dokumen!**\n\n${res.summary}\n\n*Alasan Pedagogis:* ${res.explanation}`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Mode Plan: Proposal Diff Card
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: `Saya telah menyiapkan rencana revisi untuk bagian **${sectionInfo.title}**. Silakan tinjau usulan di bawah ini sebelum menerapkannya:`,
          proposal: {
            sectionKey: selectedSectionKey,
            sectionTitle: sectionInfo.title,
            summary: res.summary,
            explanation: res.explanation,
            oldContent: currentSectionContent,
            newContent: res.revisedContent,
            applied: false,
          },
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error('Revision error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        text: `⚠️ Maaf, terjadi kendala saat merevisi: ${err.message || 'Gagal memproses perubahan.'}. Silakan coba instruksi yang lebih spesifik.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyProposal = (msgId: string) => {
    const targetMsg = messages.find((m) => m.id === msgId);
    if (!targetMsg || !targetMsg.proposal || targetMsg.proposal.applied) return;

    const { sectionKey, newContent, summary } = targetMsg.proposal;
    const updatedDoc: RpmPaudDocData = JSON.parse(JSON.stringify(documentData));

    if (sectionKey === 'pengalaman_belajar') {
      updatedDoc.pengalaman_belajar = newContent;
    } else if (sectionKey === 'asesmen_pembelajaran') {
      if (newContent.iktp_bergradasi) {
        updatedDoc.iktp_bergradasi = newContent.iktp_bergradasi;
      }
      if (newContent.rubrik_asesmen) {
        updatedDoc.rubrik_asesmen = newContent.rubrik_asesmen;
      }
      if (newContent.asesmen_akhir && updatedDoc.asesmen_pembelajaran) {
        updatedDoc.asesmen_pembelajaran.akhir = newContent.asesmen_akhir;
      }
    } else if (sectionKey === 'tujuan_pembelajaran') {
      if (newContent.tujuan_pembelajaran && updatedDoc.desain_pembelajaran) {
        updatedDoc.desain_pembelajaran.tujuan_pembelajaran = newContent.tujuan_pembelajaran;
      }
      if (newContent.capaian_pembelajaran && updatedDoc.desain_pembelajaran) {
        updatedDoc.desain_pembelajaran.capaian_pembelajaran = newContent.capaian_pembelajaran;
      }
    } else {
      if (newContent.informasi_umum) {
        updatedDoc.informasi_umum = { ...updatedDoc.informasi_umum, ...newContent.informasi_umum };
      }
    }

    onApplyRevision(updatedDoc, summary);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    // Mark as applied
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.proposal
          ? { ...m, proposal: { ...m.proposal, applied: true } }
          : m
      )
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-white shadow-2xl border-l border-[#D8C3DD] flex flex-col animate-slide-left">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#522D60] to-[#693774] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold tracking-tight">Asisten Revisi AI (Chat)</h3>
              <span className="text-[10px] bg-amber-400 text-[#2A1532] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-white/80">
              Ubah kegiatan atau rubrik dokumen via instruksi chat langsung
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mode & Section Control Bar */}
      <div className="p-3 bg-[#FAF3FB] border-b border-[#EFE6F2] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Plan vs Action Toggle */}
          <div className="flex items-center bg-white p-0.5 rounded-xl border border-[#D8C3DD] shadow-2xs w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setChatMode('plan')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                chatMode === 'plan'
                  ? 'bg-[#522D60] text-white shadow-xs'
                  : 'text-[#74607B] hover:text-[#2A1532]'
              }`}
            >
              <span>📋 <span className="sm:hidden">Plan</span><span className="hidden sm:inline">Mode Plan (Tinjau Dulu)</span></span>
            </button>
            <button
              type="button"
              onClick={() => setChatMode('action')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                chatMode === 'action'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[#74607B] hover:text-[#2A1532]'
              }`}
            >
              <span>⚡ <span className="sm:hidden">Action</span><span className="hidden sm:inline">Mode Action (Langsung)</span></span>
            </button>
          </div>

          {/* Ticket Counter */}
          <div className="flex items-center justify-between sm:justify-start gap-1 text-[11px] font-bold text-[#522D60] bg-white px-2.5 py-1 rounded-xl border border-[#D8C3DD] shrink-0">
            <span>Tiket Revisi:</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-extrabold">
              {ticketsRemaining}/10
            </span>
          </div>
        </div>

        {/* Target Section Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-[#74607B] shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#80426E]" />
            <span>Bagian Target:</span>
          </label>
          <select
            value={selectedSectionKey}
            onChange={(e) => setSelectedSectionKey(e.target.value)}
            className="flex-1 px-2.5 py-1 text-xs font-semibold rounded-xl border border-[#CBB4D1] bg-white text-[#2A1532] focus:ring-2 focus:ring-[#522D60]"
          >
            {SECTIONS_LIST.map((s) => (
              <option key={s.key} value={s.key}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Non-Pro Warning Banner */}
      {!canUseChat && (
        <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-extrabold text-amber-900">Fitur Eksklusif Paket PRO</h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Fitur Asisten Revisi AI (Chat Plan & Action) hanya tersedia untuk pelanggan PRO (Rp 14.000/bln).
            </p>
            {onOpenUpgradeModal && (
              <button
                onClick={onOpenUpgradeModal}
                className="mt-2 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
              >
                Tingkatkan ke PRO Sekarang
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-[#FAF3FB] border border-[#D8C3DD] text-[#522D60] flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#522D60] text-white rounded-br-xs'
                  : 'bg-white border border-[#EFE6F2] text-[#2A1532] rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Proposal Diff Card for Mode Plan */}
              {msg.proposal && (
                <div className="mt-3 p-3 bg-[#FAF7FB] rounded-xl border border-[#D8C3DD] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#522D60] uppercase tracking-wider">
                      Usulan Perubahan
                    </span>
                    <span className="text-[10px] text-[#74607B]">{msg.proposal.sectionTitle}</span>
                  </div>

                  <p className="font-bold text-[#2A1532] text-xs">{msg.proposal.summary}</p>
                  <p className="text-[11px] text-[#74607B] italic">"{msg.proposal.explanation}"</p>

                  <div className="pt-2 border-t border-[#EFE6F2] flex items-center justify-end gap-2">
                    {msg.proposal.applied ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Telah Diterapkan
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApplyProposal(msg.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Terapkan ke Dokumen</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div
                className={`text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-[#74607B]'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-[#522D60] text-white flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#80426E] p-3 bg-[#FAF3FB] rounded-2xl border border-[#EFE6F2] animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-[#522D60]" />
            <span>AI sedang merumuskan revisi kurikulum untuk bagian ini...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#EFE6F2] space-y-2">
        <div className="relative flex items-center">
          <input
            type="text"
            disabled={!canUseChat || isProcessing || ticketsRemaining <= 0}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              !canUseChat
                ? 'Tingkatkan ke PRO untuk mengaktifkan revisi via chat...'
                : ticketsRemaining <= 0
                ? 'Kuota revisi dokumen ini telah mencapai 10 tiket.'
                : 'Ketik instruksi revisi (misal: ganti loose parts hari Kamis...)'
            }
            className="w-full pl-3 pr-12 py-2.5 text-xs rounded-2xl border border-[#CBB4D1] focus:ring-2 focus:ring-[#522D60] text-[#2A1532] placeholder:text-[#9F88A7] disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || !canUseChat || isProcessing || ticketsRemaining <= 0}
            className="absolute right-1.5 p-2 bg-[#522D60] hover:bg-[#693774] disabled:bg-slate-300 text-white rounded-xl transition-all shadow-xs disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#74607B] px-1">
          <span>Gunakan instruksi spesifik per hari atau bagian agar hasil maksimal.</span>
          <span className="font-mono">Partisi Token -85%</span>
        </div>
      </form>
    </div>
  );
};
