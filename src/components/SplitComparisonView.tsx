import React, { useState } from 'react';
import { ArticleItem, TypographySettings } from '../types';
import { CheckCircle2, ShieldAlert, Sparkles, SlidersHorizontal } from 'lucide-react';

interface SplitComparisonViewProps {
  currentArticle: ArticleItem;
  typography: TypographySettings;
  screenShake: { x: number; y: number };
  contentOffset: { x: number; y: number };
  efficiencyPct: number;
}

export const SplitComparisonView: React.FC<SplitComparisonViewProps> = ({
  currentArticle,
  typography,
  screenShake,
  contentOffset,
  efficiencyPct,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [mode, setMode] = useState<'side-by-side' | 'curtain'>('side-by-side');

  const sampleParagraphs = currentArticle.content.slice(0, 3);

  return (
    <div className="relative flex flex-col flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-950 p-4 sm:p-6">
      {/* Top Header & Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Canlı Titreşim Karşılaştırması</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Gerçek Zamanlı Göz & Odak Simülasyonu</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setMode('side-by-side')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                mode === 'side-by-side' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Yan Yana (Dual)
            </button>
            <button
              onClick={() => setMode('curtain')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                mode === 'curtain' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kaydırmalı Perde
            </button>
          </div>
        </div>
      </div>

      {/* Main Comparative Viewport */}
      {mode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 my-3 overflow-hidden">
          {/* LEFT: Unstabilized (Standard Screen during Bumpy Ride) */}
          <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-rose-500/30 overflow-hidden shadow-xl">
            {/* Header Badge */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-rose-950/40 border-b border-rose-900/40 text-xs text-rose-300">
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Stabilizasyonsuz (Klasik Okuma)</span>
              </div>
              <span className="font-mono text-[11px] text-rose-400/80">Retinal Slip: Yüksek</span>
            </div>

            {/* Shaking Document Canvas */}
            <div
              className="flex-1 p-6 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif] select-none"
              style={{
                transform: `translate3d(${screenShake.x}px, ${screenShake.y}px, 0)`,
                transition: 'none',
              }}
            >
              <h2 className="text-xl font-bold text-slate-200 mb-3">{currentArticle.title}</h2>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                {sampleParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Bottom Overlay Info */}
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-rose-400 flex items-center justify-between">
              <span>✕ Göz kasları sürekli sarsıntıyı takip etmek zorunda kalır</span>
              <span className="font-mono font-bold">%0 İzolasyon</span>
            </div>
          </div>

          {/* RIGHT: Stabilized (StabilRead Active) */}
          <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-emerald-500/40 overflow-hidden shadow-xl">
            {/* Header Badge */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-900/40 text-xs text-emerald-300">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>StabilRead Aktif (İvme Sönümlemeli)</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 font-bold">
                İzolasyon: %{efficiencyPct}
              </span>
            </div>

            {/* Vibrating Container + Compensated Inner Canvas */}
            <div
              className="flex-1 overflow-hidden"
              style={{
                transform: `translate3d(${screenShake.x}px, ${screenShake.y}px, 0)`,
                transition: 'none',
              }}
            >
              <div
                className="h-full p-6 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif] select-none"
                style={{
                  transform: `translate3d(${contentOffset.x}px, ${contentOffset.y}px, 0)`,
                  transition: 'none',
                }}
              >
                <h2 className="text-xl font-bold text-slate-100 mb-3">{currentArticle.title}</h2>
                <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
                  {sampleParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Overlay Info */}
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center justify-between">
              <span>✓ Harfler uzayda sabit kalır, göz yorgunluğu ve baş dönmesi önlenir</span>
              <span className="font-mono font-bold">Kristal Netlik</span>
            </div>
          </div>
        </div>
      ) : (
        /* Single Canvas with Interactive Curtain Slider */
        <div className="relative flex-1 my-3 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden select-none">
          {/* Unstabilized Background Layer */}
          <div
            className="absolute inset-0 p-8 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]"
            style={{
              transform: `translate3d(${screenShake.x}px, ${screenShake.y}px, 0)`,
              transition: 'none',
            }}
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block">
                [HAM SARSINTILI]
              </span>
              <h2 className="text-2xl font-bold text-slate-200">{currentArticle.title}</h2>
              {sampleParagraphs.map((p, i) => (
                <p key={i} className="text-slate-400 text-base leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Stabilized Clipped Foreground Layer */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
            }}
          >
            <div
              className="absolute inset-0 bg-slate-950/90"
              style={{
                transform: `translate3d(${screenShake.x}px, ${screenShake.y}px, 0)`,
                transition: 'none',
              }}
            >
              <div
                className="h-full p-8 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]"
                style={{
                  transform: `translate3d(${contentOffset.x}px, ${contentOffset.y}px, 0)`,
                  transition: 'none',
                }}
              >
                <div className="max-w-2xl mx-auto space-y-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                    [STABİLİZASYONLU - STABILREAD]
                  </span>
                  <h2 className="text-2xl font-bold text-emerald-100">{currentArticle.title}</h2>
                  {sampleParagraphs.map((p, i) => (
                    <p key={i} className="text-slate-100 text-base leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Draggable Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] cursor-ew-resize z-20 flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Interactive Range Input overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            aria-label="Karşılaştırma Perdesi Konumu"
          />
        </div>
      )}

      {/* Comparison Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block mb-1">Göz Odak Kaybı</span>
          <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">-%78 Azalma</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block mb-1">Okuma Hızı (WPM)</span>
          <span className="font-mono text-base font-bold text-cyan-400 tabular-nums">+%35 Artış</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block mb-1">Vestibüler Uyumsuzluk</span>
          <span className="font-mono text-base font-bold text-indigo-400 tabular-nums">Sıfıra Yakın</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block mb-1">Dinamik Tepki Süresi</span>
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">4.2 ms</span>
        </div>
      </div>
    </div>
  );
};
