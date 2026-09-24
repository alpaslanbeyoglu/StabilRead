import React, { useState, useEffect, useRef } from 'react';
import { ArticleItem, StabilizationConfig, TypographySettings } from '../types';
import { Pause, Play, RotateCcw, FastForward, Rewind, Volume2 } from 'lucide-react';

interface RSVPReaderProps {
  currentArticle: ArticleItem;
  typography: TypographySettings;
  config: StabilizationConfig;
  onToggleStabilization: () => void;
  screenShake: { x: number; y: number };
  contentOffset: { x: number; y: number };
}

export const RSVPReader: React.FC<RSVPReaderProps> = ({
  currentArticle,
  typography,
  config,
  onToggleStabilization,
  screenShake,
  contentOffset,
}) => {
  const [wpm, setWpm] = useState<number>(350);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wordIndex, setWordIndex] = useState<number>(0);

  // Flatten all words in current article
  const fullText = currentArticle.content.join(' ');
  const words = React.useMemo(() => fullText.split(/\s+/).filter(Boolean), [fullText]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / wpm) * 1000;
      timerRef.current = setInterval(() => {
        setWordIndex((prev) => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, wpm, words.length]);

  const currentWord = words[wordIndex] || 'Hazır';

  // Calculate Optimal Recognition Point (ORP) - usually index 1 or 2 for eye fixation
  const getOrpComponents = (word: string) => {
    if (!word) return { prefix: '', pivot: '', suffix: '' };
    const pivotIdx = Math.min(Math.floor((word.length - 1) / 3) + 1, word.length - 1);
    const prefix = word.slice(0, pivotIdx);
    const pivot = word.slice(pivotIdx, pivotIdx + 1);
    const suffix = word.slice(pivotIdx + 1);
    return { prefix, pivot, suffix };
  };

  const { prefix, pivot, suffix } = getOrpComponents(currentWord);
  const progressPct = Math.round((wordIndex / Math.max(1, words.length)) * 100);

  return (
    <div className="relative flex flex-col flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-950 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full justify-between">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-slate-200">RSVP Hızlı Okuma</span>
            <span className="mx-2">·</span>
            <span className="truncate max-w-[200px] inline-block align-bottom">
              {currentArticle.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono tabular-nums">
              {wordIndex + 1} / {words.length} kelime
            </span>
            <span className="font-mono text-emerald-400 tabular-nums">%{progressPct}</span>
          </div>
        </div>

        {/* Center RSVP Display Stage with Dynamic Counter-Motion */}
        <div
          className="relative my-auto flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden"
          style={{
            transform: `translate3d(${screenShake.x}px, ${screenShake.y}px, 0)`,
            transition: 'none',
          }}
        >
          {/* ORP Calibration Guidelines (Top & Bottom Center Ticks) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-emerald-500/50" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-emerald-500/50" />

          {/* Stabilized Word Stage */}
          <div
            className="flex items-center justify-center min-h-[120px] w-full"
            style={{
              transform: `translate3d(${contentOffset.x}px, ${contentOffset.y}px, 0)`,
              transition: 'none',
            }}
          >
            <div className="font-['JetBrains_Mono',monospace] text-4xl sm:text-6xl font-bold tracking-tight text-slate-100 flex items-center justify-center">
              <span className="text-right w-[160px] sm:w-[240px] text-slate-400">{prefix}</span>
              <span className="text-emerald-400 font-extrabold px-0.5 underline decoration-emerald-500 decoration-4 underline-offset-8">
                {pivot}
              </span>
              <span className="text-left w-[160px] sm:w-[240px] text-slate-100">{suffix}</span>
            </div>
          </div>

          {/* Context Snippet around current word */}
          <div className="mt-8 text-center text-xs text-slate-500 max-w-md line-clamp-1 italic">
            ...{' '}
            {words.slice(Math.max(0, wordIndex - 3), Math.min(words.length, wordIndex + 4)).join(' ')}{' '}
            ...
          </div>
        </div>

        {/* Bottom RSVP Control Deck */}
        <div className="space-y-4 pt-4 border-t border-slate-800 bg-slate-900/60 p-4 rounded-2xl border">
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer">
            <div
              className="bg-emerald-500 h-full transition-all duration-100"
              style={{ width: `${progressPct}%` }}
              onClick={(e) => {
                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                if (rect) {
                  const clickX = (e.clientX - rect.left) / rect.width;
                  setWordIndex(Math.floor(clickX * words.length));
                }
              }}
            />
          </div>

          {/* Playback Controls & WPM Slider */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Play/Pause & Step Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWordIndex((prev) => Math.max(0, prev - 10))}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="10 Kelime Geri"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Durdur' : 'Başlat'}</span>
              </button>

              <button
                onClick={() => setWordIndex((prev) => Math.min(words.length - 1, prev + 10))}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="10 Kelime İleri"
              >
                <FastForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setWordIndex(0);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="Başa Dön"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* WPM Speed Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Hız:</span>
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                {[250, 350, 450, 600].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setWpm(speed)}
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
                      wpm === speed ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-slate-400">WPM</span>
            </div>

            {/* Quick Stabilization Switch */}
            <button
              onClick={onToggleStabilization}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                config.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {config.enabled ? '✓ Titreşim Kilitli' : '✗ Titreşim Serbest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
