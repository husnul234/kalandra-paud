import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logSecurityEvent } from '../lib/securityLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorId: '',
  };

  public static getDerivedStateFromError(_: Error): State {
    return {
      hasError: true,
      errorId: `ERR-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log exception safely without exposing internal folder paths
    logSecurityEvent('SECURITY_EXCEPTION', {
      details: {
        errorId: this.state.errorId,
        message: error.message,
        componentStack: errorInfo.componentStack ? errorInfo.componentStack.slice(0, 300) : '',
      },
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7FB] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EFE6F2] shadow-xl text-center space-y-5">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#2A1532]">Terjadi Kendala Teknis</h2>
              <p className="text-xs text-[#74607B] mt-1.5 leading-relaxed">
                Sistem telah mengamankan sesi Anda. Silakan muat ulang halaman atau kembali ke beranda untuk melanjutkan.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400">
                Kode Referensi: {this.state.errorId}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 px-4 bg-[#522D60] hover:bg-[#3D1F49] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Muat Ulang Halaman
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="py-2.5 px-4 bg-[#FAF3FB] hover:bg-[#F4E8F6] text-[#522D60] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-[#E8D6EB]"
              >
                <Home className="w-3.5 h-3.5" />
                Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
