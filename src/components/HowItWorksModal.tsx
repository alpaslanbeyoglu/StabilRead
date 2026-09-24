import React from 'react';
import { Activity, Check, HelpCircle, Lightbulb, Shield, Smartphone, X } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Nasıl Çalışır? Titreşim Sönümleme Bilimi
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 custom-scrollbar leading-relaxed">
          {/* Step 1: Biological Dilemma */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span>01. Problem: Retinal Slip ve Araç İçi Titreşim</span>
            </div>
            <p className="text-slate-300">
              Araçla giderken yol pürüzleri ve motor titreşimleri telefonu elinizde saniyede 10 ila 30 kez mikron düzeyinde sallar. Gözlerimiz her sarsıntıda harflerin yerini yeniden bulmak için kasılır (Retinal Slip). Bu durum 5-10 dakika içinde şiddetli <strong>göz yorgunluğuna</strong>, <strong>okuma odağının kaybolmasına</strong> ve <strong>araç tutmasına (kinetosis)</strong> yol açar.
            </p>
          </div>

          {/* Step 2: Algorithmic Inversion */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <span>02. Algoritma: Ters Fazlı İvme Dengeleme (Inverse Inertia)</span>
            </div>
            <p className="text-slate-300">
              Uygulama, telefonun dahili <strong>MEMS İvmeölçer ve Jiroskop</strong> sensörlerini 60 FPS hızında dinler. Telefon yukarı ve sola doğru 3 mm sarsıldığında, ekran üzerindeki yazı metni tam tersi yönde (aşağı ve sağa doğru 3 mm) milisaniyeler içinde kaydırılır.
            </p>
            <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-900/40 font-mono text-[11px] text-indigo-300">
              ΔX_tel = +a_x(t) → ΔX_metin = -K · Kalman(a_x) → Net_Göz = 0 mm (Sabit)
            </div>
          </div>

          {/* Step 3: Mathematical Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Kalman Gürültü Filtresi</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Sensör gürültüsünü ve el titremelerini doğal yol sarsıntısından ayıklar.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Yaylı Merkezleme (Spring Damper)</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Yol düzleştiğinde yazıyı gözü rahatsız etmeden yavaşça ekran ortasına çeker.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Aşırı Çukur Koruması (Clamp)</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Derin çukurlarda yazının ekran sınırlarının dışına uçmasını önler.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Biyonik Odaklama Desteği</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Kelime başlarını belirginleştirerek sarsıntılı ortamda göz sıçramasını 2 kat hızlandırır.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Anladım, Okumaya Başla
          </button>
        </div>
      </div>
    </div>
  );
};
