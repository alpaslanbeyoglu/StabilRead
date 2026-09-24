import React, { useState, useRef } from 'react';
import { ArticleItem, StabilizationConfig, TypographySettings } from '../types';
import { formatBionicText } from '../utils/physics';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Minus,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ReaderViewProps {
  currentArticle: ArticleItem;
  onSelectArticle: (article: ArticleItem) => void;
  articles: ArticleItem[];
  typography: TypographySettings;
  onUpdateTypography: (updated: Partial<TypographySettings>) => void;
  config: StabilizationConfig;
  onToggleStabilization: () => void;
  screenShake: { x: number; y: number };
  contentOffset: { x: number; y: number };
  efficiencyPct: number;
  onOpenCustomTextModal: () => void;
  onSwitchToRSVP: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  currentArticle,
  onSelectArticle,
  articles,
  typography,
  onUpdateTypography,
  config,
  onToggleStabilization,
  screenShake,
  contentOffset,
  efficiencyPct,
  onOpenCustomTextModal,
  onSwitchToRSVP,
}) => {
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);
  const [showArticleList, setShowArticleList] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Theme style mapping
  const getThemeClasses = () => {
    switch (typography.theme) {
      case 'light':
        return 'bg-[#F9F8F6] text-[#1E2022] border-stone-200 selection:bg-amber-200';
      case 'sepia':
        return 'bg-[#F4ECD8] text-[#3D2E1E] border-[#E2D4B7] selection:bg-amber-300/40';
      case 'forest':
        return 'bg-[#0E1A16] text-[#E0EBE6] border-[#1C2E28] selection:bg-emerald-800';
      case 'oled':
        return 'bg-[#000000] text-[#E2E8F0] border-zinc-900 selection:bg-indigo-900';
      case 'dark':
      default:
        return 'bg-[#0B0F17] text-[#E2E8F0] border-slate-800/80 selection:bg-emerald-500/30';
    }
  };

  const getFontFamilyStyle = () => {
    switch (typography.fontFamily) {
      case 'serif':
        return "font-['Lora',serif]";
      case 'dyslexic':
        return "font-['Sora',sans-serif]";
      case 'mono':
        return "font-['JetBrains_Mono',monospace]";
      case 'sans':
      default:
        return "font-['Plus_Jakarta_Sans',sans-serif]";
    }
  };

  const getContentWidthClass = () => {
    switch (typography.contentWidth) {
      case 'compact':
        return 'max-w-xl';
      case 'wide':
        return 'max-w-4xl';
      case 'normal':
      default:
        return 'max-w-2xl';
    }
  };

  return (
    <div className="relative flex flex-col flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-950">
      {/* Top Floating Mini-Action Bar */}
      <div className="z-20 flex items-center justify-between px-4 py-2 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-xs">
        {/* Left: Article Selector & Custom Text */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArticleList(!showArticleList)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium max-w-[140px] sm:max-w-[220px] truncate">
              {currentArticle.title}
            </span>
          </button>

          <button
            onClick={onOpenCustomTextModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Kendi Metnini Yapıştır veya Yükle"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Metin Yapıştır</span>
          </button>

          <button
            onClick={onSwitchToRSVP}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            title="Tek Kelime Odaklı Hızlı Okuma Modu"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>RSVP Moduna Geç</span>
          </button>
        </div>

        {/* Right: Quick Typography & Bionic Controls */}
        <div className="flex items-center gap-1.5">
          {/* Bionic Toggle */}
          <button
            onClick={() => onUpdateTypography({ bionicReading: !typography.bionicReading })}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
              typography.bionicReading
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
            title="Biyonik Odaklama: Kelimelerin ilk harflerini koyulaştırarak göz sıçramasını hızlandırır"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Biyonik Odak</span>
          </button>

          {/* Font Size Adjusters */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
            <button
              onClick={() => onUpdateTypography({ fontSize: Math.max(14, typography.fontSize - 1) })}
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Yazı Boyutunu Küçült"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-300 tabular-nums">
              {typography.fontSize}px
            </span>
            <button
              onClick={() => onUpdateTypography({ fontSize: Math.min(32, typography.fontSize + 1) })}
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Yazı Boyutunu Büyüt"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Theme Cycler */}
          <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 border border-slate-700">
            {(['dark', 'sepia', 'light', 'oled', 'forest'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onUpdateTypography({ theme: t })}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  typography.theme === t ? 'scale-110 ring-2 ring-emerald-400' : 'opacity-70 hover:opacity-100'
                } ${
                  t === 'dark'
                    ? 'bg-slate-900 border-slate-700'
                    : t === 'sepia'
                    ? 'bg-[#F4ECD8] border-[#E2D4B7]'
                    : t === 'light'
                    ? 'bg-white border-slate-300'
                    : t === 'oled'
                    ? 'bg-black border-zinc-800'
                    : 'bg-[#0E1A16] border-[#1C2E28]'
                }`}
                title={`Tema: ${t.toUpperCase()}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Article Selector Dropdown Drawer */}
      {showArticleList && (
        <div className="absolute top-12 left-4 z-30 w-80 max-w-[90vw] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-3 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kütüphane Makaleleri
            </span>
            <button
              onClick={() => setShowArticleList(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Kapat
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {articles.map((art) => (
              <button
                key={art.id}
                onClick={() => {
                  onSelectArticle(art);
                  setShowArticleList(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition-all ${
                  currentArticle.id === art.id
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                    : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                }`}
              >
                <div className="text-xs font-medium truncate">{art.title}</div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span>{art.category}</span>
                  <span>·</span>
                  <span>{art.readTimeMin} dk</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Anti-Motion Sickness Horizon Peripheral Dots (Apple Vehicle Motion Cues style) */}
      {config.peripheralMotionCues && (
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{
            transform: `translate3d(${-screenShake.x * 0.8}px, ${-screenShake.y * 0.8}px, 0)`,
          }}
        >
          {/* Left Edge Dots */}
          <div className="absolute left-3 top-1/4 bottom-1/4 flex flex-col justify-between items-center opacity-60">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={`left-dot-${i}`}
                className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"
              />
            ))}
          </div>
          {/* Right Edge Dots */}
          <div className="absolute right-3 top-1/4 bottom-1/4 flex flex-col justify-between items-center opacity-60">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={`right-dot-${i}`}
                className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Reading Stage */}
      <div
        className="relative flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-6"
        style={{
          // Container vibrates with the vehicle if simulation is on
          transform: `translate3d(${screenShake.x}px, ${screenShake.y}px, 0)`,
          transition: 'none', // Ensure instant zero-latency physical binding
          willChange: 'transform',
        }}
      >
        {/* The Stabilized Document Canvas (Receives inverse translation offset) */}
        <div
          ref={scrollContainerRef}
          className={`w-full h-full overflow-y-auto rounded-2xl p-6 sm:p-10 border shadow-2xl transition-colors ${getThemeClasses()} ${getFontFamilyStyle()}`}
          style={{
            // Inverse translation cancelling out the physical shake
            transform: `translate3d(${contentOffset.x}px, ${contentOffset.y}px, 0)`,
            transition: 'none',
            willChange: 'transform',
          }}
        >
          <div className={`mx-auto ${getContentWidthClass()} space-y-6`}>
            {/* Metadata Header (No pills - clean unboxed typography) */}
            <div className="border-b border-current/10 pb-4">
              <div className="flex items-center gap-2 text-xs opacity-70 mb-2">
                <span>{currentArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>{currentArticle.author}</span>
                <span aria-hidden="true">·</span>
                <span>{currentArticle.readTimeMin} dk okuma</span>
                <span aria-hidden="true">·</span>
                <span>{currentArticle.date}</span>
              </div>

              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight"
                style={{ textWrap: 'balance' }}
              >
                {currentArticle.title}
              </h1>

              <p className="mt-3 text-sm sm:text-base opacity-80 italic leading-relaxed">
                "{currentArticle.summary}"
              </p>
            </div>

            {/* Paragraphs with Focus Line Highlighter and Bionic support */}
            <div className="space-y-6 pt-2">
              {currentArticle.content.map((paragraph, idx) => {
                const isActive = activeParagraphIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveParagraphIndex(idx)}
                    className={`relative cursor-pointer transition-all duration-150 p-3.5 -mx-3.5 rounded-xl ${
                      config.readingRulerEnabled && isActive
                        ? 'bg-emerald-500/10 border-l-4 border-emerald-500 pl-4'
                        : 'hover:bg-current/5 border-l-4 border-transparent'
                    }`}
                  >
                    <p
                      className="leading-relaxed"
                      style={{
                        fontSize: `${typography.fontSize}px`,
                        lineHeight: typography.lineHeight,
                        letterSpacing: `${typography.letterSpacing}em`,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: typography.bionicReading
                          ? formatBionicText(paragraph)
                          : paragraph,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* End of article notice */}
            <div className="pt-8 pb-4 text-center border-t border-current/10 opacity-60 text-xs flex items-center justify-center gap-2">
              <span>✦ Makalenin Sonu ✦</span>
              <span>·</span>
              <span>StabilRead Optik Dengeleme Motoru</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick HUD & Vibration Status Indicator */}
      <div className="z-20 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Titreşim Durumu:</span>
            <span
              className={`font-semibold ${
                Math.abs(screenShake.x) + Math.abs(screenShake.y) > 15
                  ? 'text-rose-400'
                  : Math.abs(screenShake.x) + Math.abs(screenShake.y) > 4
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {Math.abs(screenShake.x) + Math.abs(screenShake.y) > 15
                ? 'Şiddetli Çukur / Sarsıntı'
                : Math.abs(screenShake.x) + Math.abs(screenShake.y) > 4
                ? 'Yol Titreşimi Aktif'
                : 'Durağan / Sakin'}
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>ΔX: {contentOffset.x}px</span>
            <span>ΔY: {contentOffset.y}px</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Toggle On/Off for Instant Comparison */}
          <button
            onClick={onToggleStabilization}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              config.enabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {config.enabled ? `Stabilize Ediliyor (%${efficiencyPct})` : 'Ham Sarsıntı (Kapalı)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
