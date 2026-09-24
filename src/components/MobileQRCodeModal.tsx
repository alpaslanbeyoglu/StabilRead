import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Smartphone, X, Copy, Check, ExternalLink, QrCode, Sparkles } from 'lucide-react';

interface MobileQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileQRCodeModal: React.FC<MobileQRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setCurrentUrl(url);

      if (canvasRef.current) {
        QRCode.toCanvas(
          canvasRef.current,
          url,
          {
            width: 240,
            margin: 2,
            color: {
              dark: '#020617',
              light: '#FFFFFF',
            },
          },
          (err) => {
            if (err) console.error('QR generation error:', err);
          }
        );
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Telefonda Aç & Arabada Kullan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <p className="text-xs text-slate-300 max-w-xs">
            Telefonunuzun kamerasını açarak aşağıdaki QR kodu okutun. Web uygulaması telefonunuzda anında açılır ve ivmeölçer donanımı devreye girer.
          </p>

          {/* QR Canvas Box */}
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/30">
            <canvas ref={canvasRef} className="block rounded-lg" />
          </div>

          <div className="w-full space-y-2 pt-2">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
              <span className="truncate flex-1 text-left px-1">{currentUrl}</span>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 shrink-0 transition-colors"
                title="Bağlantıyı Kopyala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
          </div>

          <div className="w-full p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 text-left text-xs text-emerald-300 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>PWA Web Uygulaması İpucu:</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Telefonunuzda açtıktan sonra tarayıcı menüsünden "Ana Ekrana Ekle" diyerek telefonunuza bir uygulama gibi yükleyebilir, internetsiz ortamda da kullanabilirsiniz.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
