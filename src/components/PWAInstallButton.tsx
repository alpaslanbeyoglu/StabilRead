import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, Smartphone, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  onOpenQRModal?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenQRModal }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, show minimal status
  if (isInstalled) {
    return (
      <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>PWA Yüklü</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow (native prompt)
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm active:scale-95"
        title="Uygulamayı Cihazınıza / Ana Ekrana Yükleyin"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Uygulamayı Yükle</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm active:scale-95"
          title="iPhone / iPad Ana Ekrana Ekle"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Telefona Ekle</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 text-slate-200">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Smartphone className="w-5 h-5" />
                <h3>iPhone / iPad'e Yükleme</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
                    1
                  </div>
                  <p>
                    Safari araç çubuğunun altındaki <strong className="text-white">Paylaş (Share)</strong>{' '}
                    <Share className="inline w-3.5 h-3.5 text-cyan-400" /> simgesine dokunun.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
                    2
                  </div>
                  <p>
                    Aşağı kaydırıp <strong className="text-white">Ana Ekrana Ekle</strong>{' '}
                    <PlusSquare className="inline w-3.5 h-3.5 text-cyan-400" /> seçeneğini seçin.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
                    3
                  </div>
                  <p>
                    Artık telefonunuzda tek dokunuşla tam ekran ve tam ivmeölçer desteğiyle çalışacaktır!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Anladım
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop or standard browser: Show QR Modal trigger so user can open on mobile phone directly
  return (
    <button
      onClick={onOpenQRModal}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm"
      title="Telefonda Aç (QR Kod ile Tara)"
    >
      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
      <span>Telefonda Aç</span>
    </button>
  );
};
